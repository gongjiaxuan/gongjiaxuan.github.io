"""Simple deploy server — receives config from admin.html, writes files, git commits & pushes."""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, sys

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))

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
                for path, b64 in files.items():
                    full = os.path.join(ROOT, path)
                    os.makedirs(os.path.dirname(full), exist_ok=True)
                    with open(full, 'wb') as f:
                        f.write(base64.b64decode(b64))
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
