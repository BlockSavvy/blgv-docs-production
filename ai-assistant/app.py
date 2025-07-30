#!/usr/bin/env python3
# BLGV Ultimate Treasury Agent - Production Wrapper
# Robust error handling for DigitalOcean deployment

import os
import sys
import traceback
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import the enhanced agent
app = None
treasury_agent_available = False

try:
    logger.info("🚀 Attempting to import BLGV Treasury Agent...")
    from blgv_advanced_financial_agent import app
    treasury_agent_available = True
    logger.info("✅ BLGV Ultimate Treasury Agent loaded successfully!")
    
except Exception as e:
    logger.error(f"❌ Failed to import treasury agent: {e}")
    logger.error(f"❌ Full traceback: {traceback.format_exc()}")
    
    # Create fallback Flask app
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    
    app = Flask(__name__)
    CORS(app, origins=["*"])
    
    @app.route('/health')
    def health():
        return jsonify({
            'status': 'fallback_mode',
            'treasury_agent': False,
            'error': str(e),
            'message': 'BLGV Treasury Agent failed to load - running in fallback mode'
        }), 200
    
    @app.route('/ask', methods=['POST'])
    def ask_fallback():
        return jsonify({
            'error': 'Treasury Agent unavailable',
            'message': 'The BLGV Ultimate Treasury Agent failed to load. Please check deployment logs.',
            'fallback_answer': 'Bitcoin is hope. The treasury revolution continues, but I need to be fixed first! 🧡',
            'status': 'fallback_mode'
        }), 503
    
    @app.route('/widget')
    def widget_fallback():
        return '''
        <!DOCTYPE html>
        <html><head><title>BLGV Treasury Agent - Maintenance</title></head>
        <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
        <h1>🧡 BLGV Treasury Agent</h1>
        <p>The Ultimate Treasury Agent is currently under maintenance.</p>
        <p style="color:#f7931a;">Bitcoin is hope. Stack sats, stay humble.</p>
        <p><small>Error: Treasury agent failed to load</small></p>
        </body></html>
        '''
    
    @app.route('/metrics')
    def metrics_fallback():
        return jsonify({
            'success': False,
            'error': 'Treasury Agent unavailable',
            'status': 'fallback_mode'
        }), 503
    
    @app.route('/')
    def home():
        return jsonify({
            'message': 'BLGV Treasury Agent - Fallback Mode',
            'status': 'fallback_mode',
            'treasury_agent': False,
            'endpoints': ['/health', '/ask', '/widget', '/metrics']
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    if treasury_agent_available:
        logger.info(f"🚀 Starting BLGV Ultimate Treasury Agent on port {port}")
    else:
        logger.info(f"⚠️ Starting fallback mode on port {port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)
