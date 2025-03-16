from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path.startswith('static/'):
        return send_from_directory('.', path)
    return send_from_directory('templates', path)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)