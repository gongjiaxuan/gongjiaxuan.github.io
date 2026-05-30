"""Simple deploy server — receives config from admin.html, writes files, git commits & pushes."""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, sys, shutil, tempfile

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
VIDEO_EXTS = {'.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'}

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
        with open(full, 'wb') as f:
            f.write(data)
        return f'ffmpeg not found; wrote raw video without H.264 transcode: {path}'

    ext = os.path.splitext(path)[1] or '.bin'
    tmp_name = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(data)
            tmp_name = tmp.name
        subprocess.run(
            [
                ffmpeg, '-y', '-i', tmp_name,
                '-map', '0:v:0', '-map', '0:a?',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '128k',
                '-movflags', '+faststart',
                full
            ],
            cwd=root, capture_output=True, text=True, check=True
        )
        return f'transcoded video to H.264/AAC: {path}'
    except Exception as e:
        with open(full, 'wb') as f:
            f.write(data)
        return f'video transcode failed; wrote raw upload for {path}: {e}'
    finally:
        if tmp_name and os.path.exists(tmp_name):
            try:
                os.remove(tmp_name)
            except OSError:
                pass

class Handler(BaseHTTPRequestHandler):
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

                # 1. Write config.json
                clean = dict(cfg)
                clean.pop('_schema', None)
                clean.pop('_help', None)
                clean.pop('_uploads', None)
                if 'site' in clean: clean['site'].pop('_photoUpload', None)
                for p in clean.get('projects', []):
                    p.pop('_uploads', None)

                with open(os.path.join(ROOT, 'config.json'), 'w', encoding='utf-8') as f:
                    json.dump(clean, f, indent=2, ensure_ascii=False)

                # 2. Write uploaded files
                written = 0
                notes = []
                for path, b64 in files.items():
                    note = write_uploaded_file(ROOT, path, b64)
                    if note:
                        notes.append(note)
                    written += 1

                # 3. Git add, commit, push
                result = subprocess.run(
                    ['git', 'add', '-A'],
                    cwd=ROOT, capture_output=True, text=True
                )
                result = subprocess.run(
                    ['git', 'commit', '-m', message],
                    cwd=ROOT, capture_output=True, text=True
                )
                push = subprocess.run(
                    ['git', 'push', 'origin', 'main'],
                    cwd=ROOT, capture_output=True, text=True
                )

                msg = f'OK: config saved, {written} files written'
                if notes:
                    msg += '\n' + '\n'.join(notes)
                if 'nothing to commit' not in result.stdout:
                    msg += f'\nCommitted: {result.stdout.strip()}'
                    msg += f'\nPush: {push.stdout.strip() or push.stderr.strip()}'
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
    print(f'Deploy server running at http://localhost:{PORT}')
    print('Press Ctrl+C to stop.')
    sys.stdout.flush()
    HTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
