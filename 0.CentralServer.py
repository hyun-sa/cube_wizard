from http.server import BaseHTTPRequestHandler, HTTPServer


class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        print(post_data)
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        return


def run_server(server_class=HTTPServer, handler_class=MyServer, port=1050):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print("서버가 시작되었습니다.")
    httpd.serve_forever()


if __name__ == '__main__':
    run_server()

