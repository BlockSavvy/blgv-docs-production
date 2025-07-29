import os
from openai import OpenAI
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["https://docs.blgvbtc.com", "http://localhost:3000"])

# Configuration
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# BLGV Documentation Context
BLGV_CONTEXT = """
You are an AI assistant for the BLGV (Belgravia Hartford) Bitcoin-native financial ecosystem documentation.

BLGV Ecosystem includes:
- Treasury Intelligence Platform (blgvbtc.com) - Bitcoin treasury management and analytics
- DEX Platform (dex.blgvbtc.com) - Decentralized Bitcoin trading with Taproot Assets  
- Mining Pool (pool.blgvbtc.com) - Bitcoin mining operations "Mission 1867"
- Lightning LSP (lsp.blgvbtc.com) - Lightning Network services and liquidity provision
- Mobile App (React Native + Expo) - Unified mobile interface for all platforms
- Unified API Server (api.blgvbtc.com) - Central API gateway and cross-platform integration

Key principles:
- Bitcoin-First (no altcoins - only Bitcoin and Lightning Network)
- NO HARDCODED DATA (use regtest environment for development, real data for production)
- Real-time WebSocket integration across all platforms
- Mobile-first design philosophy
- Enterprise-grade security and compliance
- Unified SDK for cross-platform development

Technical Stack:
- TypeScript/React for web platforms
- React Native/Expo for mobile
- Python/Flask for mining pool
- Node.js/Express for API services
- PostgreSQL with multi-schema architecture
- Docker regtest environment for development
- Digital Ocean for production hosting

Be helpful, professional, and focus on Bitcoin-native solutions. Always encourage using the regtest environment for development and testing.
"""

@app.route('/health')
def health_check():
    """Health check endpoint for Digital Ocean"""
    return jsonify({
        'status': 'healthy',
        'service': 'blgv-docs-ai-assistant',
        'version': '1.0.0'
    }), 200

@app.route('/ask', methods=['POST'])
@app.route('/api/ask', methods=['POST'])
def ask_question():
    """Main AI assistant endpoint"""
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({'error': 'Question is required'}), 400
        
        question = data['question']
        logger.info(f"Received question: {question}")
        
        # Create OpenAI completion (new client syntax)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": BLGV_CONTEXT},
                {"role": "user", "content": question}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content
        
        return jsonify({
            'question': question,
            'answer': answer,
            'timestamp': response.created
        })
        
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        return jsonify({'error': 'Failed to process question'}), 500

@app.route('/widget')
@app.route('/api/widget')
def chat_widget():
    """Simple chat widget for embedding in documentation"""
    widget_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>BLGV Docs AI Assistant</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .chat-container { max-width: 600px; margin: 0 auto; }
            .question-input { width: 100%; padding: 10px; margin: 10px 0; }
            .ask-button { background: #f7931a; color: white; padding: 10px 20px; border: none; cursor: pointer; }
            .answer-box { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="chat-container">
            <h2>🤖 BLGV Documentation Assistant</h2>
            <input type="text" id="questionInput" class="question-input" placeholder="Ask about BLGV documentation...">
            <button onclick="askQuestion()" class="ask-button">Ask Question</button>
            <div id="answerBox" class="answer-box" style="display:none;"></div>
        </div>
        
        <script>
            async function askQuestion() {
                const question = document.getElementById('questionInput').value;
                if (!question) return;
                
                const response = await fetch('/api/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question })
                });
                
                const data = await response.json();
                const answerBox = document.getElementById('answerBox');
                answerBox.innerHTML = `<strong>Q:</strong> ${data.question}<br><br><strong>A:</strong> ${data.answer}`;
                answerBox.style.display = 'block';
            }
            
            document.getElementById('questionInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') askQuestion();
            });
        </script>
    </body>
    </html>
    """
    return widget_html

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
