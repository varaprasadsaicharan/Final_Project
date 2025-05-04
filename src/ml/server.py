from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from models import predict_heart_disease, predict_diabetes, predict_liver_disease

class PredictionHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        prediction = None
        features = data.get('features', [])
        
        if self.path == '/predict/heart':
            prediction = predict_heart_disease(features)
        elif self.path == '/predict/diabetes':
            prediction = predict_diabetes(features)
        elif self.path == '/predict/liver':
            prediction = predict_liver_disease(features)
            
        if prediction:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(prediction).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, PredictionHandler)
    print('Starting server on port 8000...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()