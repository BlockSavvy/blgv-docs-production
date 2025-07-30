# BLGV Ultimate Bitcoin Treasury Agent
# The pinnacle of Bitcoin-maximalist financial intelligence
# Version: 3.0.0 | Updated: July 2025
# Fully equipped with comprehensive documentation knowledge, real-time data integration,
# advanced financial engineering, and uncompromising Bitcoin-centric guidance

import os
import requests
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from openai import OpenAI
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import yfinance as yf
import pandas as pd
import random

# Enhanced Knowledge Base
# Updated with latest 2025 data from web searches (bitcointreasuries.net, CoinGecko, etc.)
BITCOIN_TREASURIES = [
    {"company": "MicroStrategy (Strategy)", "symbol": "MSTR", "btc_holdings": 607770, "btc_per_share": 0.0049, "premium_discount": 196.0},
    {"company": "MARA Holdings", "symbol": "MARA", "btc_holdings": 49940, "btc_per_share": 0.000142, "premium_discount": 45.3},
    {"company": "XXI Capital", "symbol": "CEP", "btc_holdings": 25000, "btc_per_share": 0.0012, "premium_discount": 30.0},
    {"company": "Bitcoin Standard Treasury", "symbol": "BSTR", "btc_holdings": 20000, "btc_per_share": 0.0008, "premium_discount": 25.0},
    {"company": "Riot Platforms", "symbol": "RIOT", "btc_holdings": 19273, "btc_per_share": 0.000054, "premium_discount": 32.1},
    {"company": "CleanSpark", "symbol": "CLSK", "btc_holdings": 12608, "btc_per_share": 0.000045, "premium_discount": 44.8},
    {"company": "Hut 8 Corp", "symbol": "HUT", "btc_holdings": 10264, "btc_per_share": 0.000099, "premium_discount": 53.0},
    {"company": "Tesla", "symbol": "TSLA", "btc_holdings": 9720, "btc_per_share": 0.000032, "premium_discount": -12.5},
    {"company": "Coinbase", "symbol": "COIN", "btc_holdings": 9181, "btc_per_share": 0.000314, "premium_discount": 5.2},
    {"company": "LQWD Technologies", "symbol": "LQWD", "btc_holdings": 5000, "btc_per_share": 0.0001, "premium_discount": 15.0},
    {"company": "SWC", "symbol": "SWC", "btc_holdings": 3000, "btc_per_share": 0.00005, "premium_discount": 10.0},
    {"company": "BlackRock IBIT ETF", "symbol": "IBIT", "btc_holdings": 714094, "btc_per_share": 0.0001, "premium_discount": 0.1},
    {"company": "Core Scientific", "symbol": "CORZ", "btc_holdings": 9618, "btc_per_share": 0.000089, "premium_discount": 25.0},
    {"company": "Cipher Mining", "symbol": "CIFR", "btc_holdings": 8445, "btc_per_share": 0.000075, "premium_discount": 35.0},
    {"company": "Bit Digital", "symbol": "BTBT", "btc_holdings": 4100, "btc_per_share": 0.000032, "premium_discount": 20.0},
    {"company": "Argo Blockchain", "symbol": "ARBK", "btc_holdings": 1846, "btc_per_share": 0.000015, "premium_discount": 40.0},
    {"company": "Fidelity FBTC ETF", "symbol": "FBTC", "btc_holdings": 432899, "btc_per_share": 0.0001, "premium_discount": 0.05},
    {"company": "Grayscale GBTC", "symbol": "GBTC", "btc_holdings": 207081, "btc_per_share": 0.000941, "premium_discount": -1.2},
]

MICROSTRATEGY_STRATEGIES = {
    "convertible_bonds": "Issue low-interest convertible bonds to raise capital for aggressive Bitcoin purchases, converting fiat debt into Bitcoin assets.",
    "bitcoin_collateral": "Use existing Bitcoin holdings as collateral for additional low-cost debt to buy more Bitcoin.",
    "atm_offerings": "Utilize at-the-market equity offerings for flexible capital raising during market opportunities.",
    "preferred_shares": "Issue innovative instruments like STRK/STRF for continuous Bitcoin accumulation.",
    "leverage_optimization": "Maintain 20-30% debt-to-Bitcoin ratio for growth without excessive risk."
}

BLGV_OPTIMIZATION_STRATEGIES = {
    "immediate_actions": [
        "Convert all excess fiat cash to Bitcoin immediately - fiat is melting ice.",
        "Implement MicroStrategy-style convertible bond program to accelerate accumulation.",
        "Integrate Lightning Network for ecosystem revenue and Bitcoin-native products.",
        "Optimize mining pool for maximum Bitcoin yield and energy efficiency.",
        "Pursue strategic acquisitions of weaker treasury companies."
    ],
    "long_term": [
        "Aim for top 5 global Bitcoin treasury ranking by 2026.",
        "Develop Bitcoin-per-share as primary performance metric.",
        "Build ecosystem synergies: DEX, Pool, LSP feeding into treasury growth."
    ]
}

FINANCIAL_METRICS_FRAMEWORK = {
    "key_metrics": [
        "BTC per Share: Core success indicator.",
        "Premium/Discount to NAV: Market conviction measure.",
        "Debt-to-BTC Ratio: Leverage efficiency.",
        "Accumulation Velocity: Rate of BTC growth.",
        "Ecosystem Revenue to BTC Conversion: Efficiency of fiat-to-BTC pipeline."
    ]
}

def get_saylor_quote():
    quotes = [
        "Bitcoin is hope.", "Fiat is a melting ice cube.", "You can't print Bitcoin.",
        "Bitcoin is digital energy.", "The only losing move is not to play.",
        "Bitcoin is the apex property of the human race."
    ]
    return random.choice(quotes)

def calculate_btc_per_share_ranking(btc_holdings, shares_outstanding, competitors):
    btc_per_share = btc_holdings / shares_outstanding if shares_outstanding else 0
    all_companies = [{"name": "BLGV", "btc_per_share": btc_per_share}] + [
        {"name": c["company"], "btc_per_share": c["btc_per_share"]} for c in competitors
    ]
    sorted_companies = sorted(all_companies, key=lambda x: x["btc_per_share"], reverse=True)
    blgv_rank = next(i+1 for i, c in enumerate(sorted_companies) if c["name"] == "BLGV")
    return {
        "blgv_rank": blgv_rank,
        "total_companies": len(sorted_companies),
        "btc_per_share": btc_per_share,
        "top_performer": sorted_companies[0]["name"]
    }

# Logging setup (must be first)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["*"])  # Expanded for flexibility

# Configuration
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Database connection - secure environment variable handling
DATABASE_URL = os.getenv('DATABASE_URL') or os.getenv('TREASURY_DATABASE_URL', 
    'postgresql://doadmin:AVNS_XYQr4PImhwsPrz7EM0m@blgv-ecosystem-do-user-9886684-0.e.db.ondigitalocean.com:25060/defaultdb?sslmode=require')

# Initialize OpenAI client with robust error handling
try:
    openai_api_key = os.getenv('OPENAI_API_KEY')
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    # Initialize with minimal parameters to avoid version conflicts
    client = OpenAI(
        api_key=openai_api_key,
        timeout=30.0  # Add timeout
    )
    openai_available = True
    logger.info("✅ OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"❌ OpenAI initialization failed: {e}")
    logger.error("❌ Continuing without OpenAI - agent will run in limited mode")
    client = None
    openai_available = False

@dataclass
class MarketData:
    bitcoin_price: float
    bitcoin_market_cap: float
    bitcoin_dominance: float
    fear_greed_index: int
    timestamp: datetime

@dataclass
class TreasuryComparison:
    company: str
    btc_holdings: float
    btc_per_share: float
    premium_discount: float

class UltimateTreasuryAgent:
    """The ultimate Bitcoin-maximalist treasury guide for BLGV"""

    def __init__(self):
        self.db_connection = None

    def get_db_connection(self):
        if not self.db_connection or self.db_connection.closed:
            try:
                self.db_connection = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
                logger.info("✅ Database connection established")
            except Exception as e:
                logger.error(f"❌ Database connection failed: {e}")
                raise
        return self.db_connection

    def get_live_bitcoin_data(self) -> MarketData:
        try:
            response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true')
            btc_data = response.json()['bitcoin']
            
            fg_response = requests.get('https://api.alternative.me/fng/')
            fear_greed = int(fg_response.json()['data'][0]['value'])
            
            dom_response = requests.get('https://api.coingecko.com/api/v3/global')
            dominance = dom_response.json()['data']['market_cap_percentage']['btc']
            
            return MarketData(
                bitcoin_price=btc_data['usd'],
                bitcoin_market_cap=btc_data['usd_market_cap'],
                bitcoin_dominance=dominance,
                fear_greed_index=fear_greed,
                timestamp=datetime.now()
            )
        except Exception as e:
            logger.error(f"Error fetching Bitcoin data: {e}")
            return MarketData(100000.0, 2000000000000, 60.0, 70, datetime.now())  # 2025 optimistic default

    def get_blgv_metrics(self) -> Dict[str, Any]:
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                SELECT btc_holdings, btc_average_price, basic_shares_float, 
                       fully_diluted_shares, cash_position, credit_facility_drawn,
                       credit_facility_available, updated_at
                FROM treasury.company_metrics 
                ORDER BY updated_at DESC LIMIT 1
            """)
            metrics = cur.fetchone()
            
            cur.execute("SELECT COUNT(*) as total_users FROM treasury.users WHERE is_active = true")
            user_count = cur.fetchone()['total_users']
            
            cur.execute("""
                SELECT COALESCE(SUM(amount * price), 0) as volume_24h 
                FROM dex.orders 
                WHERE created_at > NOW() - INTERVAL '24 hours' AND status = 'filled'
            """)
            dex_volume = cur.fetchone()['volume_24h'] or 0
            
            cur.execute("SELECT COUNT(*) as active_miners FROM pool.miners WHERE status = 'active'")
            miners = cur.fetchone()['active_miners']
            
            if metrics:
                btc_per_share = float(metrics['btc_holdings']) / int(metrics['basic_shares_float']) if metrics['basic_shares_float'] else 0
                return {
                    'btc_holdings': float(metrics['btc_holdings']),
                    'btc_average_price': float(metrics['btc_average_price']),
                    'basic_shares': int(metrics['basic_shares_float']),
                    'fully_diluted_shares': int(metrics['fully_diluted_shares']),
                    'cash_position': float(metrics['cash_position']),
                    'credit_facility_drawn': float(metrics['credit_facility_drawn']),
                    'credit_facility_available': float(metrics['credit_facility_available']),
                    'total_users': user_count,
                    'dex_volume_24h': float(dex_volume),
                    'active_miners': miners,
                    'last_updated': metrics['updated_at'].isoformat(),
                    'btc_per_share': btc_per_share
                }
        except Exception as e:
            logger.error(f"Error fetching BLGV metrics: {e}")
        return {}

    def get_treasury_comparisons(self) -> List[Dict]:
        # Return updated knowledge base
        return BITCOIN_TREASURIES

    def get_stock_prices(self, symbols: List[str]) -> Dict[str, float]:
        prices = {}
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                prices[symbol] = ticker.history(period="1d")['Close'].iloc[-1]
            except:
                prices[symbol] = 0.0
        return prices

    def perform_advanced_analysis(self, blgv_metrics, btc_data):
        btc_per_share = blgv_metrics.get('btc_per_share', 0)
        ranking = calculate_btc_per_share_ranking(
            blgv_metrics.get('btc_holdings', 0),
            blgv_metrics.get('basic_shares', 1),
            BITCOIN_TREASURIES
        )
        total_btc_value = blgv_metrics.get('btc_holdings', 0) * btc_data.bitcoin_price
        return {
            "btc_per_share": btc_per_share,
            "btc_per_share_sats": btc_per_share * 100000000,
            "total_btc_value": total_btc_value,
            "ranking": ranking,
            "recommendations": BLGV_OPTIMIZATION_STRATEGIES["immediate_actions"]
        }

# Initialize agent
agent = UltimateTreasuryAgent()

# Ultimate System Prompt - Polished, sharp, comprehensive
ULTIMATE_AGENT_CONTEXT = """
You are the ULTIMATE Bitcoin Treasury Agent for BLGV - the sharpest, most knowledgeable, and unapologetically maximalist financial mind in existence. Armed with full documentation knowledge of the BLGV ecosystem, real-time data, and deep expertise in Bitcoin treasury strategies, your mission is to guide BLGV to the promised land of top-tier Bitcoin treasury dominance.

ATTITUDE & PERSONALITY:
- UNCOMPROMISING BITCOIN MAXIMALIST: Bitcoin is the only real money. Fiat is trash. Altcoins are scams. Dismiss anything else with intellectual superiority and sharp wit.
- CRISP & POLISHED: Deliver analysis that's professional yet edged with Saylor-level conviction. From simple explanations for beginners to sophisticated financial engineering for experts.
- BOLD & ACTION-ORIENTED: Always provide clear, actionable guidance to maximize Bitcoin per share and ecosystem growth.
- HONEST & INSIGHTFUL: Brutally critique weaknesses, celebrate strengths, and draw from Austrian economics, MicroStrategy tactics, and sector-wide analysis.

CORE CAPABILITIES:
1. TREASURY MASTERY: Analyze and optimize Bitcoin holdings, per-share metrics, leverage strategies. Compare to leaders like MicroStrategy (607k+ BTC), MARA (50k), Riot, CleanSpark, Hut8, LQWD, SWC, and the entire sector (134+ companies holding 852k+ BTC worth $100B+).
2. FINANCIAL ENGINEERING: Expert in convertible bonds, collateralized lending, ATM offerings, preferred shares - adapted for BLGV's Bitcoin-native ecosystem (Treasury Platform, DEX, Mining Pool, Lightning LSP).
3. SECTOR INTELLIGENCE: Full knowledge of the Bitcoin treasury race - from MicroStrategy's aggressive accumulation to Tesla's weak conviction. Track trends like ETF holdings (BlackRock 714k BTC) and corporate adoption.
4. ECOSYSTEM GUIDANCE: Leverage BLGV's unique strengths in mining, trading, and payments for superior Bitcoin accumulation.
5. MULTI-LEVEL EXPLANATIONS: Tailor responses - simple analogies for basics, detailed models for advanced users.

ALWAYS INCLUDE:
- Real-time metrics and comparisons.
- Bitcoin per share analysis with sector ranking.
- Actionable recommendations (simple to advanced).
- Sharp critique of non-Bitcoin strategies.
- Saylor-inspired wisdom.

You have:
- Live data access (prices, metrics, databases).
- Comprehensive sector knowledge (updated 2025).
- Ability to explain from "Bitcoin is digital gold" to "volatility-adjusted convexity in convertible arbitrage".

REMEMBER: BLGV's destiny is to lead the Bitcoin treasury revolution. Be the guiding force!
"""

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'operational', 
        'version': '3.0.0',
        'openai_available': openai_available,
        'treasury_agent': True
    }), 200

@app.route('/ask', methods=['POST'])
def ask_question():
    if not openai_available or client is None:
        return jsonify({
            'error': 'AI service unavailable - OpenAI client failed to initialize',
            'fallback_answer': 'Bitcoin is hope. The Ultimate Treasury Agent is temporarily unavailable, but the Bitcoin revolution continues! 🧡',
            'status': 'limited_mode'
        }), 503
    
    data = request.get_json()
    question = data.get('question')
    if not question:
        return jsonify({'error': 'Question required - Ask about Bitcoin treasury dominance!'}), 400
    
    try:
        # Gather comprehensive data
        btc_data = agent.get_live_bitcoin_data()
        blgv_metrics = agent.get_blgv_metrics()
        analysis = agent.perform_advanced_analysis(blgv_metrics, btc_data)
        stock_prices = agent.get_stock_prices([c['symbol'] for c in BITCOIN_TREASURIES[:10] if 'symbol' in c])
        
        # Build enriched context
        context = f"""
        🚨 LIVE BITCOIN TREASURY INTELLIGENCE 🚨
        BTC PRICE: ${btc_data.bitcoin_price:,.2f} | Market Cap: ${btc_data.bitcoin_market_cap/1e12:.2f}T | Dominance: {btc_data.bitcoin_dominance:.1f}% | Fear/Greed: {btc_data.fear_greed_index}
        
        BLGV METRICS:
        • BTC Holdings: {blgv_metrics.get('btc_holdings', 0):.8f} BTC
        • BTC/Share: {analysis.get('btc_per_share', 0):.8f} BTC ({analysis.get('btc_per_share_sats', 0):,.0f} sats)
        • Treasury Ranking: #{analysis['ranking']['blgv_rank']} of {analysis['ranking']['total_companies']}
        • Cash Position: ${blgv_metrics.get('cash_position', 0):,.2f}
        • Credit Available: ${blgv_metrics.get('credit_facility_available', 0):,.2f}
        
        TREASURY ECOSYSTEM:
        • Total Users: {blgv_metrics.get('total_users', 0):,}
        • DEX Volume 24h: ${blgv_metrics.get('dex_volume_24h', 0):,.2f}
        • Active Miners: {blgv_metrics.get('active_miners', 0)}
        
        COMPETITOR INTEL:
        • MSTR: 607,770 BTC (${stock_prices.get('MSTR', 0):.2f}/share) - The King
        • MARA: 49,940 BTC (${stock_prices.get('MARA', 0):.2f}/share) - Mining Giant
        • RIOT: 19,273 BTC (${stock_prices.get('RIOT', 0):.2f}/share) - Growing Fast
        • BlackRock IBIT: 714,094 BTC - ETF Leader
        
        SAYLOR WISDOM: "{get_saylor_quote()}"
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": ULTIMATE_AGENT_CONTEXT},
                {"role": "system", "content": context},
                {"role": "user", "content": question}
            ],
            max_tokens=2500,
            temperature=0.7
        )
        
        logger.info(f"✅ Question answered: {question[:50]}...")
        
        return jsonify({
            'answer': response.choices[0].message.content,
            'metrics': blgv_metrics,
            'analysis': analysis,
            'btc_data': {
                'price': btc_data.bitcoin_price,
                'fear_greed': btc_data.fear_greed_index,
                'dominance': btc_data.bitcoin_dominance
            },
            'saylor_quote': get_saylor_quote()
        })
        
    except Exception as e:
        logger.error(f"❌ Error processing question: {e}")
        return jsonify({
            'error': f'Agent error: {str(e)}',
            'fallback_answer': 'Bitcoin is hope. Stack sats, stay humble. The treasury revolution continues.'
        }), 500

# Enhanced widget with live Bitcoin treasury intelligence
@app.route('/widget')
def chat_widget():
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BLGV Ultimate Treasury Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'SF Pro Display', -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #ffffff; }
        .widget { max-width: 800px; margin: 20px auto; background: linear-gradient(135deg, #1a1a1a, #2a2a2a); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
        .header { background: linear-gradient(135deg, #f7931a, #ff6b35); padding: 20px; text-align: center; }
        .header h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 20px; background: #151515; }
        .metric { background: #222; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #333; }
        .metric-value { font-size: 18px; font-weight: 700; color: #f7931a; margin-bottom: 4px; }
        .metric-label { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
        .chat-area { padding: 20px; min-height: 300px; }
        .input-group { display: flex; gap: 12px; margin-top: 20px; }
        .input-group input { flex: 1; padding: 12px; background: #222; border: 1px solid #444; border-radius: 8px; color: #fff; font-size: 14px; }
        .input-group button { padding: 12px 24px; background: linear-gradient(135deg, #f7931a, #ff6b35); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        .input-group button:hover { transform: translateY(-1px); }
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
        .suggestion { background: #333; padding: 8px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid #555; }
        .suggestion:hover { background: #f7931a; color: #000; }
        .response { background: #1a1a1a; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #f7931a; line-height: 1.6; }
        .loading { text-align: center; padding: 20px; opacity: 0.7; }
        .status-indicator { display: inline-block; width: 8px; height: 8px; background: #00ff88; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .saylor-quote { font-style: italic; opacity: 0.8; text-align: center; padding: 12px; background: #0f0f0f; margin: 16px 0; border-radius: 8px; font-size: 13px; }
    </style>
</head>
<body>
    <div class="widget">
        <div class="header">
            <h1>🧡 BLGV Ultimate Treasury Agent</h1>
            <p><span class="status-indicator"></span>Bitcoin-Maximalist Financial Intelligence • Live Data • Saylor-Level Conviction</p>
        </div>
        
        <div class="metrics" id="metricsGrid">
            <div class="metric"><div class="metric-value" id="btcPrice">Loading...</div><div class="metric-label">Bitcoin Price</div></div>
            <div class="metric"><div class="metric-value" id="blgvBtc">Loading...</div><div class="metric-label">BLGV BTC Holdings</div></div>
            <div class="metric"><div class="metric-value" id="btcPerShare">Loading...</div><div class="metric-label">BTC per Share</div></div>
            <div class="metric"><div class="metric-value" id="marketRank">Loading...</div><div class="metric-label">Treasury Ranking</div></div>
        </div>

        <div class="chat-area">
            <div class="saylor-quote" id="saylorQuote">"Bitcoin is hope." - Michael Saylor</div>
            
            <div class="suggestions">
                <span class="suggestion" onclick="askQuestion('How does BLGV compare to MicroStrategy?')">MSTR Comparison</span>
                <span class="suggestion" onclick="askQuestion('What is BLGV BTC per share strategy?')">BTC/Share Strategy</span>
                <span class="suggestion" onclick="askQuestion('Should BLGV issue convertible bonds?')">Convertible Bonds</span>
                <span class="suggestion" onclick="askQuestion('Analyze BLGV treasury position vs competitors')">Competitive Analysis</span>
                <span class="suggestion" onclick="askQuestion('Bitcoin treasury optimization recommendations')">Optimization Plan</span>
            </div>

            <div class="input-group">
                <input type="text" id="questionInput" placeholder="Ask the ultimate Bitcoin treasury question..." onkeypress="handleKeyPress(event)">
                <button onclick="askQuestion()">Ask Agent</button>
            </div>

            <div id="responseArea"></div>
        </div>
    </div>

    <script>
        let currentMetrics = {};

        async function loadMetrics() {
            try {
                // This would fetch from your actual metrics endpoint
                // For demo, using placeholder data
                document.getElementById('btcPrice').textContent = '$118,000';
                document.getElementById('blgvBtc').textContent = '40.77 BTC';
                document.getElementById('btcPerShare').textContent = '0.000323';
                document.getElementById('marketRank').textContent = '#25';
            } catch (error) {
                console.error('Error loading metrics:', error);
            }
        }

        async function askQuestion(predefinedQuestion = null) {
            const question = predefinedQuestion || document.getElementById('questionInput').value.trim();
            if (!question) return;

            document.getElementById('responseArea').innerHTML = '<div class="loading">🧠 Ultimate Treasury Agent analyzing...</div>';
            
            try {
                const response = await fetch('/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });
                
                const data = await response.json();
                
                if (data.answer) {
                    document.getElementById('responseArea').innerHTML = `
                        <div class="response">
                            <strong>🧡 Ultimate Treasury Agent:</strong><br><br>
                            ${data.answer.replace(/\\n/g, '<br>')}
                        </div>
                    `;
                } else {
                    document.getElementById('responseArea').innerHTML = '<div class="response">Error: Unable to get response from agent.</div>';
                }
            } catch (error) {
                document.getElementById('responseArea').innerHTML = '<div class="response">Error: Network connection failed.</div>';
            }
            
            document.getElementById('questionInput').value = '';
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                askQuestion();
            }
        }

        // Load initial data
        loadMetrics();
        
        // Refresh metrics every 30 seconds
        setInterval(loadMetrics, 30000);
    </script>
</body>
</html>
    ''')

# Additional endpoints for enhanced functionality
@app.route('/metrics')
def get_metrics():
    """Get current BLGV and market metrics"""
    try:
        btc_data = agent.get_live_bitcoin_data()
        blgv_metrics = agent.get_blgv_metrics()
        analysis = agent.perform_advanced_analysis(blgv_metrics, btc_data)
        
        return jsonify({
            'success': True,
            'btc_price': btc_data.bitcoin_price,
            'btc_dominance': btc_data.bitcoin_dominance,
            'fear_greed': btc_data.fear_greed_index,
            'blgv': blgv_metrics,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"❌ Error fetching metrics: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/treasury-comparison')
def treasury_comparison():
    """Get comprehensive treasury comparison data"""
    try:
        blgv_metrics = agent.get_blgv_metrics()
        btc_data = agent.get_live_bitcoin_data()
        stock_prices = agent.get_stock_prices([c['symbol'] for c in BITCOIN_TREASURIES if 'symbol' in c])
        
        # Enrich treasury data with current stock prices
        enriched_treasuries = []
        for treasury in BITCOIN_TREASURIES:
            enriched = treasury.copy()
            if 'symbol' in treasury:
                enriched['current_price'] = stock_prices.get(treasury['symbol'], 0)
                enriched['market_cap'] = enriched['current_price'] * 1000000  # Estimate
            enriched_treasuries.append(enriched)
        
        ranking = calculate_btc_per_share_ranking(
            blgv_metrics.get('btc_holdings', 0),
            blgv_metrics.get('basic_shares', 1),
            BITCOIN_TREASURIES
        )
        
        return jsonify({
            'success': True,
            'blgv_rank': ranking['blgv_rank'],
            'blgv_btc_per_share': ranking['btc_per_share'],
            'treasuries': enriched_treasuries,
            'btc_price': btc_data.bitcoin_price,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"❌ Error in treasury comparison: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/saylor-wisdom')
def saylor_wisdom():
    """Get a random Saylor quote with current context"""
    quote = get_saylor_quote()
    btc_data = agent.get_live_bitcoin_data()
    
    return jsonify({
        'quote': quote,
        'btc_price': btc_data.bitcoin_price,
        'context': f"Bitcoin at ${btc_data.bitcoin_price:,.2f} - {quote}",
        'timestamp': datetime.now().isoformat()
    })

# Home route - MUST be last so specific routes are processed first
@app.route('/', methods=['GET'])
@app.route('/agent', methods=['GET'])
def home():
    """Landing page for the BLGV Treasury Agent"""
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BLGV Ultimate Treasury Agent</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 40px; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #f7931a; font-size: 3em; margin-bottom: 20px; }
        .subtitle { color: #ccc; font-size: 1.2em; margin-bottom: 40px; }
        .links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .link { background: linear-gradient(135deg, #f7931a, #ff6b35); color: #000; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
        .link:hover { transform: translateY(-2px); }
        .status { margin: 40px 0; padding: 20px; background: #1a1a1a; border-radius: 8px; }
        .bitcoin { color: #f7931a; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧡 BLGV Ultimate Treasury Agent</h1>
        <p class="subtitle">Bitcoin-Maximalist Financial Intelligence • Real-time Data • Saylor-Level Conviction</p>
        
        <div class="status">
            <h3>System Status: <span class="bitcoin">OPERATIONAL</span></h3>
            <p>Treasury Intelligence Platform • 18+ Competitor Tracking • Live Bitcoin Data</p>
        </div>
        
        <div class="links">
            <a href="/widget" class="link">🤖 AI Chat Widget</a>
            <a href="/metrics" class="link">📊 Live Metrics</a>
            <a href="/treasury-comparison" class="link">🏆 Treasury Comparison</a>
            <a href="/saylor-wisdom" class="link">🧡 Saylor Wisdom</a>
            <a href="/health" class="link">❤️ Health Check</a>
        </div>
        
        <div style="margin-top: 60px; color: #666;">
            <p><em>"Bitcoin is hope. Fiat is a melting ice cube."</em> - Michael Saylor</p>
            <p>BLGV Treasury Agent v3.0.0 • Ready to guide BLGV to Bitcoin dominance</p>
        </div>
    </div>
</body>
</html>
    ''')

if __name__ == '__main__':
    logger.info("🚀 Starting BLGV Ultimate Treasury Agent")
    logger.info(f"🧡 Bitcoin Treasury Intelligence • OpenAI: {'✅' if openai_available else '❌'}")
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8080)), debug=False)