def app(environ, start_response):
    path = environ.get("PATH_INFO", "/")
    if path in ("/", "/index.html"):
        try:
            with open("index.html", "rb") as f:
                data = f.read()
            status = "200 OK"
            headers = [
                ("Content-Type", "text/html"),
                ("Content-Length", str(len(data)))
            ]
            start_response(status, headers)
            return [data]
        except Exception as e:
            status = "500 Internal Server Error"
            start_response(status, [("Content-Type", "text/plain")])
            return [b"Error loading index.html"]
    else:
        status = "404 Not Found"
        start_response(status, [("Content-Type", "text/plain")])
        return [b"Not Found"]

if __name__ == "__main__":
    from wsgiref.simple_server import make_server
    port = 5000
    print(f"Serving on port {port}...")
    make_server("0.0.0.0", port, app).serve_forever()
