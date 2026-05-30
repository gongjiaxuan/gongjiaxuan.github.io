"""Simple deploy server — receives config from admin.html, writes files, git commits & pushes."""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, sys, shutil, tempfile

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
VIDEO_EXTS = {'.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'}
SERVER_VERSION = 'file-safe-v2'

def safe_join(root, rel_path):
    rel_path = rel_path.replace('\\', '/').lstrip('/')
    full = os.path.abspath(os.path.join(root, rel_path))
    root = os.path.abspath(root)
    if os.path.commonpath([root, full]) != root:
        raise ValueError(f'Unsafe upload path: {rel_path}')
    return full

def is_video_path(path):
    normalized = path.replace('\\', '/').lower()
    ext = os.path.splitext(normalized)[1]
    return normalized.startswith('videos/') or ext in VIDEO_EXTS

def is_external_ref(ref):
    lower = str(ref).lower()
    return lower.startswith(('http://', 'https://', 'mailto:', '#'))

def prefixed_asset(ref, prefix=None):
    if not ref or is_external_ref(ref):
        return None
    normalized = str(ref).replace('\\', '/').lstrip('/')
    if normalized.startswith(('images/', 'videos/', 'cv/')):
        return normalized
    if prefix:
        return f'{prefix}/{normalized}'
    return normalized

def iter_section_asset_refs(section):
    if not isinstance(section, dict):
        return
    for key in ('image', 'media'):
        media = section.get(key)
        if isinstance(media, dict):
            src = prefixed_asset(media.get('src'), 'images')
            if src:
                yield f'section {section.get("title", "")} {key}', src
    for img in section.get('images') or []:
        if isinstance(img, dict):
            src = prefixed_asset(img.get('src'), 'images')
            if src:
                yield f'section {section.get("title", "")} gallery', src
    for key in ('src', 'video', 'poster'):
        src = prefixed_asset(section.get(key))
        if src:
            yield f'section {section.get("title", "")} {key}', src

def validate_config_assets(root, cfg):
    missing = []
    site = cfg.get('site') or {}
    for label, ref in (('site.photo', site.get('photo')), ('site.cvPath', site.get('cvPath'))):
        src = prefixed_asset(ref)
        if src and not os.path.exists(safe_join(root, src)):
            missing.append(f'{label}: {src}')

    for p in cfg.get('projects', []):
        pid = p.get('id') or p.get('title') or 'project'
        for field in ('hero', 'cardImage'):
            src = prefixed_asset(p.get(field))
            if src and not os.path.exists(safe_join(root, src)):
                missing.append(f'{pid}.{field}: {src}')
        for img in p.get('images') or []:
            src = prefixed_asset(img.get('src') if isinstance(img, dict) else img, 'images')
            if src and not os.path.exists(safe_join(root, src)):
                missing.append(f'{pid}.images: {src}')
        for img in p.get('processImages') or []:
            src = prefixed_asset(img.get('src') if isinstance(img, dict) else img, 'images')
            if src and not os.path.exists(safe_join(root, src)):
                missing.append(f'{pid}.processImages: {src}')
        video = p.get('video') or {}
        if isinstance(video, dict):
            for field in ('src', 'poster'):
                src = prefixed_asset(video.get(field))
                if src and not os.path.exists(safe_join(root, src)):
                    missing.append(f'{pid}.video.{field}: {src}')
        for section in p.get('sections') or []:
            for label, src in iter_section_asset_refs(section):
                if src and not os.path.exists(safe_join(root, src)):
                    missing.append(f'{pid}.{label}: {src}')

    if missing:
        preview = '\n'.join(missing[:20])
        if len(missing) > 20:
            preview += f'\n...and {len(missing) - 20} more'
        raise RuntimeError('Config references missing local assets:\n' + preview)

def write_uploaded_file(root, path, b64):
    full = safe_join(root, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    data = base64.b64decode(b64)

    if not is_video_path(path):
        with open(full, 'wb') as f:
            f.write(data)
        return None

    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg:
        raise RuntimeError(
            f'ffmpeg is required for video uploads so browsers can play H.264/AAC MP4: {path}'
        )

    ext = os.path.splitext(path)[1] or '.bin'
    tmp_name = None
    out_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(data)
            tmp_name = tmp.name
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4', dir=os.path.dirname(full)) as out:
            out_name = out.name
        subprocess.run(
            [
                ffmpeg, '-y', '-i', tmp_name,
                '-map', '0:v:0', '-map', '0:a?',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '128k',
                '-movflags', '+faststart',
                out_name
            ],
            cwd=root, capture_output=True, text=True, check=True
        )
        os.replace(out_name, full)
        out_name = None
        return f'transcoded video to H.264/AAC: {path}'
    except subprocess.CalledProcessError as e:
        err = (e.stderr or e.stdout or str(e)).strip()
        raise RuntimeError(f'video transcode failed for {path}: {err[-1200:]}') from e
    except Exception as e:
        raise RuntimeError(f'video upload failed for {path}: {e}') from e
    finally:
        if tmp_name and os.path.exists(tmp_name):
            try:
                os.remove(tmp_name)
            except OSError:
                pass
        if out_name and os.path.exists(out_name):
            try:
                os.remove(out_name)
            except OSError:
                pass

MIME = {'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.ico':'image/x-icon'}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/version'):
            self.send_response(200); self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Content-Type','text/plain'); self.end_headers()
            self.wfile.write(f'DEPLOY_SERVER_VERSION:{SERVER_VERSION}'.encode())
            return
        # Serve static files
        path = self.path.split('?')[0].lstrip('/') or 'index.html'
        filepath = safe_join(ROOT, path)
        if not os.path.isfile(filepath):
            self.send_response(404); self.send_header('Access-Control-Allow-Origin','*'); self.end_headers(); return
        ext = os.path.splitext(path)[1].lower()
        ct = MIME.get(ext, 'application/octet-stream')
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Content-Type', ct)
        if ct.startswith('video/'): self.send_header('Accept-Ranges','bytes')
        self.end_headers()
        with open(filepath, 'rb') as f:
            self.wfile.write(f.read())

    def log_message(self, format, *args):
        if '/deploy' in str(args): print(f'[{self.log_date_time_string()}] {args[0]}')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/deploy':
            try:
                length = int(self.headers.get('Content-Length', 0))
                data = json.loads(self.rfile.read(length))
                cfg = data.get('config', {})
                files = data.get('files', {})
                message = data.get('message', 'Update from CMS')

                # 1. Write uploaded files first. Config is written only after uploads succeed.
                written = 0
                notes = []
                uploaded_paths = []
                for path, b64 in files.items():
                    note = write_uploaded_file(ROOT, path, b64)
                    if note:
                        notes.append(note)
                    uploaded_paths.append(path.replace('\\', '/').lstrip('/'))
                    written += 1

                # 2. Write config.json
                clean = dict(cfg)
                clean.pop('_schema', None)
                clean.pop('_help', None)
                clean.pop('_uploads', None)
                if 'site' in clean: clean['site'].pop('_photoUpload', None)
                for p in clean.get('projects', []):
                    p.pop('_uploads', None)

                validate_config_assets(ROOT, clean)

                with open(os.path.join(ROOT, 'config.json'), 'w', encoding='utf-8') as f:
                    json.dump(clean, f, indent=2, ensure_ascii=False)

                # 3. Git add only files touched by this CMS request, then commit and push.
                add_paths = ['config.json'] + uploaded_paths
                result = subprocess.run(
                    ['git', 'add', '--'] + add_paths,
                    cwd=ROOT, capture_output=True, text=True
                )
                if result.returncode != 0:
                    raise RuntimeError(result.stderr.strip() or result.stdout.strip() or 'git add failed')
                result = subprocess.run(
                    ['git', 'commit', '-m', message],
                    cwd=ROOT, capture_output=True, text=True
                )
                combined_commit = (result.stdout + '\n' + result.stderr).strip()
                did_commit = result.returncode == 0
                if result.returncode != 0 and 'nothing to commit' not in combined_commit.lower():
                    raise RuntimeError(combined_commit or 'git commit failed')

                push = None
                if did_commit:
                    push = subprocess.run(
                        ['git', 'push', 'origin', 'main'],
                        cwd=ROOT, capture_output=True, text=True
                    )
                    if push.returncode != 0:
                        raise RuntimeError(push.stderr.strip() or push.stdout.strip() or 'git push failed')

                msg = f'DEPLOY_SERVER_VERSION:{SERVER_VERSION}\nOK: config saved, {written} files written'
                if notes:
                    msg += '\n' + '\n'.join(notes)
                if did_commit:
                    msg += f'\nCommitted: {combined_commit}'
                    msg += f'\nPush: {(push.stdout or push.stderr).strip()}'
                else:
                    msg += '\nNo changes to commit.'

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(msg.encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(f'Error: {str(e)}'.encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        print(f'[{self.log_date_time_string()}] {args[0]}')

if __name__ == '__main__':
    print(f'Deploy server running at http://localhost:{PORT} ({SERVER_VERSION})')
    print('Press Ctrl+C to stop.')
    sys.stdout.flush()
    HTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
