import http.server
import socketserver
import os

PORT = 8081
# 서빙할 디렉토리 경로 지정
DIRECTORY = "./file"

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")  # 모든 출처 허용
        super().end_headers()

    def translate_path(self, path):
        path = super().translate_path(path)
        return os.path.join(DIRECTORY, os.path.relpath(path, self.directory))

# 파일 서빙
handler = CORSHTTPRequestHandler
handler.directory = DIRECTORY

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Serving at port {PORT} from directory: {DIRECTORY}")
    httpd.serve_forever()