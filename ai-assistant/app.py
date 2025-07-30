#!/usr/bin/env python3
# BLGV Ultimate Treasury Agent - Gunicorn Compatible
# Minimal wrapper for DigitalOcean deployment

try:
    from blgv_advanced_financial_agent import app
    
    if __name__ == '__main__':
        import os
        port = int(os.environ.get('PORT', 8080))
        app.run(host='0.0.0.0', port=port, debug=False)
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback to basic Flask app
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/health')
    def health():
        return jsonify({'status': 'fallback_mode', 'error': 'Treasury agent import failed'})
    
    @app.route('/')
    def home():
        return jsonify({'message': 'BLGV Treasury Agent - Import Error', 'status': 'fallback'})
    
    if __name__ == '__main__':
        import os
        port = int(os.environ.get('PORT', 8080))
        app.run(host='0.0.0.0', port=port, debug=False)
