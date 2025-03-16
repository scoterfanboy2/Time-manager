from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

port = 5000
server = HTTPServer(('0.0.0.0', port), Handler)

if __name__ == "__main__":
    print(f"Server started at port {port}")
    server.serve_forever()