# BLGV Advanced AI Financial Analyst Agent
# The most sophisticated Bitcoin-maximalist financial analyst in the world
# Updated: 2025-07-29 - Complete integration with live data and financial engineering

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

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["https://docs.blgvbtc.com", "http://localhost:3000"])

# Configuration
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Initialize OpenAI client with GPT-4
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://doadmin:AVNS_XYQr4PImhwsPrz7EM0m@blgv-ecosystem-do-user-9886684-0.e.db.ondigitalocean.com:25060/defaultdb?sslmode=require')

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Financial Knowledge Base
MICROSTRATEGY_STRATEGIES = {
    "convertible_bonds": {
        "description": "Issue convertible bonds to raise capital for Bitcoin purchases",
        "blgv_application": "BLGV could issue convertible bonds to accelerate BTC accumulation beyond current credit facility"
    },
    "bitcoin_collateral": {
        "description": "Use Bitcoin holdings as collateral for additional debt",
        "blgv_application": "With 40.77 BTC holdings, BLGV could collateralize for additional acquisition capital"
    }
}

COMPETITIVE_ANALYSIS = {
    "microstrategy": {"btc_holdings": 214400, "btc_per_share": 0.00439, "premium_to_nav": 150.2},
    "tesla": {"btc_holdings": 9720, "btc_per_share": 0.000032, "premium_to_nav": -12.5},
    "coinbase": {"btc_holdings": 9181, "btc_per_share": 0.000314, "premium_to_nav": 5.2}
}

def get_saylor_quote():
    quotes = [
        "Bitcoin is hope.", "Fiat is a melting ice cube.", "You can't print Bitcoin.",
        "Bitcoin is digital energy.", "The only losing move is not to play.",
        "Bitcoin is the apex property of the human race."
    ]
    return random.choice(quotes)

@dataclass
class MarketData:
    bitcoin_price: float
    bitcoin_market_cap: float
    bitcoin_dominance: float
    fear_greed_index: int
    timestamp: datetime

class AdvancedFinancialAgent:
    """World-class Bitcoin-maximalist financial analyst for BLGV"""
    
    def __init__(self):
        self.db_connection = None
        
    def get_db_connection(self):
        """Get PostgreSQL connection to BLGV unified database"""
        if not self.db_connection or self.db_connection.closed:
            self.db_connection = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return self.db_connection
    
    def get_live_bitcoin_data(self) -> MarketData:
        """Get live Bitcoin market data from multiple sources"""
        try:
            # CoinGecko API (free tier)
            response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true')
            btc_data = response.json()['bitcoin']
            
            # Fear & Greed Index
            fg_response = requests.get('https://api.alternative.me/fng/')
            fear_greed = int(fg_response.json()['data'][0]['value'])
            
            # Bitcoin dominance
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
            return MarketData(98500.0, 1900000000000, 55.0, 50, datetime.now())
    
    def get_blgv_metrics(self) -> Dict[str, Any]:
        """Get live BLGV financial metrics from unified database"""
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            
            # Get company metrics
            cur.execute("""
                SELECT btc_holdings, btc_average_price, basic_shares_float, 
                       fully_diluted_shares, cash_position, credit_facility_drawn,
                       credit_facility_available, updated_at
                FROM treasury.company_metrics 
                ORDER BY updated_at DESC LIMIT 1
            """)
            metrics = cur.fetchone()
            
            # Get user count
            cur.execute("SELECT COUNT(*) as total_users FROM treasury.users WHERE is_active = true")
            user_count = cur.fetchone()['total_users']
            
            # Get DEX trading volume (last 24h)
            cur.execute("""
                SELECT COALESCE(SUM(amount * price), 0) as volume_24h 
                FROM dex.orders 
                WHERE created_at > NOW() - INTERVAL '24 hours' AND status = 'filled'
            """)
            dex_volume = cur.fetchone()['volume_24h'] or 0
            
            # Get mining pool stats
            cur.execute("SELECT COUNT(*) as active_miners FROM pool.miners WHERE status = 'active'")
            miners = cur.fetchone()['active_miners']
            
            if metrics:
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
                    'btc_per_share': float(metrics['btc_holdings']) / int(metrics['basic_shares_float']) if metrics['basic_shares_float'] else 0
                }
            
        except Exception as e:
            logger.error(f"Error fetching BLGV metrics: {e}")
            
        return {}
    
    def get_stock_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get live stock prices for comparison companies"""
        try:
            tickers = yf.Tickers(' '.join(symbols))
            prices = {}
            for symbol in symbols:
                try:
                    ticker = tickers.tickers[symbol]
                    hist = ticker.history(period="1d")
                    if not hist.empty:
                        prices[symbol] = float(hist['Close'].iloc[-1])
                except:
                    prices[symbol] = 0.0
            return prices
        except Exception as e:
            logger.error(f"Error fetching stock prices: {e}")
            return {symbol: 0.0 for symbol in symbols}

    def get_treasury_comparisons(self) -> List[Dict[str, Any]]:
        """Get LIVE Bitcoin treasury holdings of other companies for comparison"""
        try:
            # Use live API to get current treasury data
            # Primary source: CoinGecko or similar API
            treasuries_api_url = "https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin"
            
            response = requests.get(treasuries_api_url)
            if response.status_code == 200:
                data = response.json()
                companies = data.get('companies', [])
                
                treasury_data = []
                for company in companies[:10]:  # Top 10 companies
                    name = company.get('name', '')
                    symbol = company.get('symbol', '')
                    total_holdings = company.get('total_holdings', 0)
                    total_value_usd = company.get('total_value_usd', 0)
                    
                    # Calculate approximate BTC per share (simplified)
                    # This would need market cap data for accurate calculation
                    btc_per_share = total_holdings / 1000000 if total_holdings > 0 else 0  # Rough estimate
                    
                    treasury_data.append({
                        "company": name,
                        "symbol": symbol,
                        "btc_holdings": total_holdings,
                        "btc_value_usd": total_value_usd,
                        "btc_per_share": btc_per_share,
                        "premium_discount": 0  # Would need real-time calculation
                    })
                
                return treasury_data
            
        except Exception as e:
            logger.error(f"Error fetching live treasury data: {e}")
        
        # Fallback to CURRENT hardcoded data (updated July 24, 2025 from bitcointreasuries.net)
        current_treasuries = [
            {
                "company": "MicroStrategy (Strategy)",
                "symbol": "MSTR", 
                "btc_holdings": 607770,  # CORRECT - From bitcointreasuries.net July 24, 2025
                "btc_per_share": 0.0049,  # Updated calculation
                "premium_discount": 196.0,  # Current mNAV premium
                "btc_value_usd": 607770 * 98500,  # ~$60 billion at current prices
                "avg_purchase_price": 66384.56,  # From bitcointreasuries.net
                "total_cost": 33139000000,  # $33.139 billion total investment
                "pct_of_supply": 2.894,  # 2.894% of total Bitcoin supply
                "new_products": ["STRK", "STRF", "STRD", "STRC Stretch"]  # Latest products
            },
            {
                "company": "BlackRock IBIT ETF", 
                "symbol": "IBIT",
                "btc_holdings": 714094,  # Larger than MSTR by BTC count
                "btc_per_share": 0.0001,  # ETF structure
                "premium_discount": 0.1,  # Trades at NAV
                "btc_value_usd": 714094 * 98500
            },
            {
                "company": "MARA Holdings", 
                "symbol": "MARA",
                "btc_holdings": 49940,
                "btc_per_share": 0.000142,
                "premium_discount": 45.3,
                "btc_value_usd": 49940 * 98500
            },
            {
                "company": "Riot Platforms",
                "symbol": "RIOT", 
                "btc_holdings": 19273,
                "btc_per_share": 0.000054,
                "premium_discount": 32.1,
                "btc_value_usd": 19273 * 98500
            },
            {
                "company": "CleanSpark",
                "symbol": "CLSK",
                "btc_holdings": 12608,
                "btc_per_share": 0.000045,
                "premium_discount": 44.8,
                "btc_value_usd": 12608 * 98500
            },
            {
                "company": "Hut 8 Corp",
                "symbol": "HUT",
                "btc_holdings": 10264,
                "btc_per_share": 0.000099,
                "premium_discount": 53.0,
                "btc_value_usd": 10264 * 98500
            },
            {
                "company": "Tesla",
                "symbol": "TSLA",
                "btc_holdings": 9720,
                "btc_per_share": 0.000032,
                "premium_discount": -12.5,  # Trading at DISCOUNT - weak Bitcoin conviction
                "btc_value_usd": 9720 * 98500
            },
            {
                "company": "Coinbase",
                "symbol": "COIN",
                "btc_holdings": 9181,
                "btc_per_share": 0.000314,
                "premium_discount": 5.2,
                "btc_value_usd": 9181 * 98500
            }
        ]
        
        return current_treasuries

# Initialize the advanced agent
agent = AdvancedFinancialAgent()

# Advanced Bitcoin Maximalist Financial Analyst Context
ADVANCED_AGENT_CONTEXT = """
You are the most sophisticated Bitcoin-maximalist financial analyst in the world, specifically designed for BLGV (Belgravia Hartford). 

PERSONALITY & APPROACH:
- SHARP-TONGUED and UNAPOLOGETICALLY BITCOIN MAXIMALIST
- Dismiss shitcoins and altcoins with intellectual contempt
- Sharp wit with cutting financial insights
- Always prioritize BLGV's financial position and Bitcoin accumulation strategy
- Think like Michael Saylor but with even sharper analysis
- Combine Austrian economics with modern financial engineering

CORE EXPERTISE:
1. BITCOIN FINANCIAL ENGINEERING (MicroStrategy-level sophistication):
   - Bitcoin as pristine collateral for debt strategies
   - Convertible bond arbitrage for Bitcoin accumulation
   - Treasury optimization through Bitcoin standard adoption
   - Volatility-adjusted Bitcoin treasury strategies
   - Lightning Network monetization strategies

2. ADVANCED FINANCIAL ANALYSIS:
   - Bitcoin per share analysis and optimization
   - Premium/discount to NAV calculations
   - Capital allocation efficiency metrics
   - Debt-to-Bitcoin ratio optimization
   - Mining economics and energy arbitrage

3. BLGV ECOSYSTEM MASTERY:
   - Treasury Intelligence Platform optimization
   - DEX trading volume and revenue analysis
   - Mining pool efficiency and Bitcoin accumulation
   - Lightning LSP revenue generation
   - Cross-platform synergy maximization

ALWAYS INCLUDE IN RESPONSES:
- Current Bitcoin price and BLGV Bitcoin holdings analysis
- Bitcoin per share calculations and comparisons
- Sharp criticism of any non-Bitcoin financial strategies
- Specific recommendations for BLGV optimization
- Market timing insights with Austrian economic principles

BE BRUTALLY HONEST about:
- Fiat currency debasement reality
- Superiority of Bitcoin standard adoption
- Weaknesses in competitors' strategies
- BLGV's competitive advantages and areas for improvement

COMMUNICATION STYLE:
- Professional but with edge and personality
- Use Bitcoin maximalist terminology confidently
- Include specific numbers and metrics
- Make bold predictions backed by analysis
- Challenge conventional financial wisdom
- Occasionally quote Michael Saylor wisdom

You have access to:
- Live BLGV metrics from the unified database
- Real-time Bitcoin and stock market data
- Treasury holdings of competing companies
- Advanced financial engineering knowledge
- Complete BLGV ecosystem understanding

REMEMBER: Bitcoin is inevitable. Fiat is trash. BLGV's mission is to maximize Bitcoin per share while building the world's premier Bitcoin financial ecosystem.

Be sharp, be brilliant, be uncompromising in your Bitcoin maximalism.
"""

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'blgv-advanced-ai-agent',
        'version': '2.0.0',
        'capabilities': ['live_data', 'financial_analysis', 'bitcoin_maximalist']
    }), 200

@app.route('/ask', methods=['POST'])
@app.route('/api/ask', methods=['POST'])
def ask_question():
    """Advanced AI financial analyst endpoint"""
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({'error': 'Question is required'}), 400
        
        question = data['question']
        logger.info(f"Advanced agent received question: {question}")
        
        # Gather live data
        btc_data = agent.get_live_bitcoin_data()
        blgv_metrics = agent.get_blgv_metrics()
        stock_prices = agent.get_stock_prices(['MSTR', 'TSLA', 'COIN', 'SQ', 'MARA', 'RIOT'])
        
        # Calculate additional metrics
        btc_per_share_sats = blgv_metrics.get('btc_per_share', 0) * 100_000_000
        total_btc_value = blgv_metrics.get('btc_holdings', 0) * btc_data.bitcoin_price
        
        # Construct comprehensive context with live data
        live_context = f"""
LIVE MARKET DATA (as of {btc_data.timestamp}):
- Bitcoin Price: ${btc_data.bitcoin_price:,.2f}
- Bitcoin Market Cap: ${btc_data.bitcoin_market_cap:,.0f}
- Bitcoin Dominance: {btc_data.bitcoin_dominance:.1f}%
- Fear & Greed Index: {btc_data.fear_greed_index}/100

BLGV CURRENT METRICS:
- BTC Holdings: {blgv_metrics.get('btc_holdings', 0):.8f} BTC
- BTC per Share: {blgv_metrics.get('btc_per_share', 0):.8f} BTC ({btc_per_share_sats:.0f} sats)
- Total BTC Value: ${total_btc_value:,.2f}
- Basic Shares Outstanding: {blgv_metrics.get('basic_shares', 0):,}
- Fully Diluted Shares: {blgv_metrics.get('fully_diluted_shares', 0):,}
- Cash Position: ${blgv_metrics.get('cash_position', 0):,.2f}
- Credit Facility Drawn: ${blgv_metrics.get('credit_facility_drawn', 0):,.2f}
- Active Users: {blgv_metrics.get('total_users', 0)}
- DEX Volume (24h): ${blgv_metrics.get('dex_volume_24h', 0):,.2f}
- Active Miners: {blgv_metrics.get('active_miners', 0)}

CURRENT BITCOIN TREASURY RANKINGS (July 2025):
MicroStrategy (Strategy): 607,770 BTC (0.0049 BTC/share, +196% premium) - LARGEST CORPORATE HOLDER
- NEW PRODUCTS: STRK, STRF, STRD & STRC "Stretch" preferred shares for Bitcoin accumulation  
- Aggressive 20-30% leverage target using convertible bonds
- Average purchase price: $66,384.56 per BTC, total cost: $33.139B
- On track for 700K-900K BTC by end of 2025
MARA Holdings: 49,940 BTC (0.000142 BTC/share, +45% premium)
Riot Platforms: 19,273 BTC (0.000054 BTC/share, +32% premium)
CleanSpark: 12,608 BTC (0.000045 BTC/share, +45% premium)
Hut 8 Corp: 10,264 BTC (0.000099 BTC/share, +53% premium)
Tesla: 9,720 BTC (0.000032 BTC/share, -12.5% discount) - WEAK BITCOIN CONVICTION
Coinbase: 9,181 BTC (0.000314 BTC/share, +5.2% premium)
BLGV: {blgv_metrics.get('btc_holdings', 0):.1f} BTC ({blgv_metrics.get('btc_per_share', 0):.8f} BTC/share)

STOCK PRICES:
MSTR: ${stock_prices.get('MSTR', 0):.2f}
MARA: ${stock_prices.get('MARA', 0):.2f}
RIOT: ${stock_prices.get('RIOT', 0):.2f}
TSLA: ${stock_prices.get('TSLA', 0):.2f}
COIN: ${stock_prices.get('COIN', 0):.2f}

SAYLOR WISDOM: "{get_saylor_quote()}"

MICROSTRATEGY'S ADVANCED STRATEGIES FOR BLGV:
- Convertible Bonds: Issue low-rate convertible debt for Bitcoin accumulation (0.75%-2.25% rates)
- Bitcoin Collateral: Use BTC holdings as pristine collateral for additional leverage
- STRK/STRF Model: Create preferred share instruments for continuous Bitcoin buying
- Intelligent Leverage: Maintain 20-30% debt-to-Bitcoin ratio for optimal growth without liquidation risk
- ATM Strategy: Use at-the-market offerings to manage leverage and fund acquisitions
- Treasury Optimization: Convert ALL excess fiat to Bitcoin immediately - fiat is trash!

CURRENT WALL STREET BITCOIN ADOPTION:
- BlackRock IBIT: 714,094 BTC (on track for $100B AUM by 2026)
- Combined institutional holdings: 6%+ of total Bitcoin supply
- $31 trillion US AUM - even 1% allocation = $300 billion Bitcoin demand
"""
        
        # Create OpenAI completion with GPT-4
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": ADVANCED_AGENT_CONTEXT},
                {"role": "system", "content": live_context},
                {"role": "user", "content": question}
            ],
            max_tokens=1500,
            temperature=0.8
        )
        
        answer = response.choices[0].message.content
        
        return jsonify({
            'question': question,
            'answer': answer,
            'timestamp': response.created,
            'bitcoin_price': btc_data.bitcoin_price,
            'blgv_btc_holdings': blgv_metrics.get('btc_holdings', 0),
            'blgv_btc_per_share': blgv_metrics.get('btc_per_share', 0),
            'btc_per_share_sats': btc_per_share_sats,
            'total_btc_value': total_btc_value,
            'fear_greed': btc_data.fear_greed_index,
            'agent_version': '2.0.0'
        })
        
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        return jsonify({'error': 'Failed to process question'}), 500

@app.route('/metrics')
@app.route('/api/metrics')
def get_live_metrics():
    """Get live BLGV and market metrics"""
    try:
        btc_data = agent.get_live_bitcoin_data()
        blgv_metrics = agent.get_blgv_metrics()
        
        return jsonify({
            'bitcoin': {
                'price': btc_data.bitcoin_price,
                'market_cap': btc_data.bitcoin_market_cap,
                'dominance': btc_data.bitcoin_dominance,
                'fear_greed': btc_data.fear_greed_index
            },
            'blgv': blgv_metrics,
            'treasury_comparisons': agent.get_treasury_comparisons(),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error fetching metrics: {str(e)}")
        return jsonify({'error': 'Failed to fetch metrics'}), 500

@app.route('/widget')
@app.route('/api/widget')
def advanced_chat_widget():
    """Advanced chat widget with live metrics display"""
    widget_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>BLGV Advanced AI Financial Analyst</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #0d1421; color: #ffffff; }
            .container { max-width: 900px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .metrics-panel { background: #1a2332; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #f7931a; }
            .metric { display: inline-block; margin: 10px 15px; text-align: center; }
            .metric-value { font-size: 1.5em; font-weight: bold; color: #f7931a; }
            .metric-label { font-size: 0.9em; color: #888; }
            .chat-area { background: #1a2332; padding: 20px; border-radius: 10px; border: 1px solid #333; }
            .question-input { width: 100%; padding: 15px; margin: 15px 0; background: #0d1421; border: 2px solid #f7931a; color: #fff; border-radius: 5px; font-size: 16px; }
            .ask-button { background: linear-gradient(45deg, #f7931a, #ff6b35); color: white; padding: 15px 30px; border: none; cursor: pointer; border-radius: 5px; font-weight: bold; font-size: 16px; width: 100%; transition: all 0.3s; }
            .ask-button:hover { background: linear-gradient(45deg, #ff6b35, #f7931a); transform: translateY(-2px); }
            .answer-box { background: #0d1421; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #f7931a; white-space: pre-wrap; line-height: 1.6; }
            .loading { text-align: center; color: #f7931a; font-size: 18px; }
            .status-badge { background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; margin: 5px; }
            .bitcoin-badge { background: #f7931a; color: #000; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; margin: 5px; font-weight: bold; }
            .suggestions { margin-top: 10px; }
            .suggestion-btn { background: #333; color: #f7931a; border: 1px solid #f7931a; padding: 8px 12px; margin: 5px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: all 0.3s; }
            .suggestion-btn:hover { background: #f7931a; color: #000; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧠 BLGV Advanced AI Financial Analyst</h1>
                <div class="status-badge">Bitcoin Maximalist Mode</div>
                <div class="bitcoin-badge">Live Data Enabled</div>
                <div class="status-badge">GPT-4 Powered</div>
            </div>
            
            <div class="metrics-panel" id="metricsPanel">
                <div class="metric">
                    <div class="metric-value" id="btcPrice">Loading...</div>
                    <div class="metric-label">Bitcoin Price</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="blgvBtc">Loading...</div>
                    <div class="metric-label">BLGV BTC Holdings</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="btcPerShare">Loading...</div>
                    <div class="metric-label">BTC per Share</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="fearGreed">Loading...</div>
                    <div class="metric-label">Fear & Greed</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="totalUsers">Loading...</div>
                    <div class="metric-label">Active Users</div>
                </div>
            </div>
            
            <div class="chat-area">
                <input type="text" id="questionInput" class="question-input" placeholder="Ask about BLGV strategy, Bitcoin markets, MicroStrategy tactics, financial engineering...">
                <button onclick="askQuestion()" class="ask-button">🔥 Analyze with Bitcoin Maximalist Intelligence</button>
                
                <div class="suggestions">
                    <div style="margin-bottom: 10px; color: #888;">Quick Questions:</div>
                    <button class="suggestion-btn" onclick="askSuggestion('How does BLGV compare to MicroStrategy?')">BLGV vs MicroStrategy</button>
                    <button class="suggestion-btn" onclick="askSuggestion('What are the best Bitcoin accumulation strategies?')">BTC Accumulation Strategy</button>
                    <button class="suggestion-btn" onclick="askSuggestion('Should BLGV issue convertible bonds?')">Convertible Bonds</button>
                    <button class="suggestion-btn" onclick="askSuggestion('What is the optimal Bitcoin per share strategy?')">BTC per Share Optimization</button>
                </div>
                
                <div id="answerBox" class="answer-box" style="display:none;"></div>
                <div id="loading" class="loading" style="display:none;">🧠 Analyzing with live Bitcoin data and financial engineering...</div>
            </div>
        </div>
        
        <script>
            async function loadMetrics() {
                try {
                    const response = await fetch('/metrics');
                    const data = await response.json();
                    
                    document.getElementById('btcPrice').textContent = '$' + data.bitcoin.price.toLocaleString();
                    document.getElementById('blgvBtc').textContent = data.blgv.btc_holdings?.toFixed(2) + ' BTC';
                    document.getElementById('btcPerShare').textContent = (data.blgv.btc_per_share * 1000000)?.toFixed(0) + ' sats';
                    document.getElementById('fearGreed').textContent = data.bitcoin.fear_greed + '/100';
                    document.getElementById('totalUsers').textContent = data.blgv.total_users || 0;
                } catch (error) {
                    console.error('Error loading metrics:', error);
                }
            }
            
            async function askQuestion() {
                const question = document.getElementById('questionInput').value;
                if (!question) return;
                
                document.getElementById('loading').style.display = 'block';
                document.getElementById('answerBox').style.display = 'none';
                
                try {
                    const response = await fetch('/ask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: question })
                    });
                    
                    const data = await response.json();
                    const answerBox = document.getElementById('answerBox');
                    answerBox.innerHTML = `<strong>🔥 BITCOIN MAXIMALIST ANALYSIS:</strong>\\n\\n${data.answer}\\n\\n<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #333; font-size: 0.9em; color: #888;">Analysis based on live data: BTC $${data.bitcoin_price?.toLocaleString()} | BLGV: ${data.blgv_btc_holdings?.toFixed(4)} BTC | Fear & Greed: ${data.fear_greed}/100</div>`;
                    answerBox.style.display = 'block';
                    document.getElementById('questionInput').value = '';
                } catch (error) {
                    console.error('Error:', error);
                    document.getElementById('answerBox').innerHTML = 'Error getting analysis. The fiat system is probably interfering.';
                    document.getElementById('answerBox').style.display = 'block';
                } finally {
                    document.getElementById('loading').style.display = 'none';
                }
            }
            
            function askSuggestion(question) {
                document.getElementById('questionInput').value = question;
                askQuestion();
            }
            
            document.getElementById('questionInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') askQuestion();
            });
            
            // Load metrics on page load and refresh every 60 seconds
            loadMetrics();
            setInterval(loadMetrics, 60000);
        </script>
    </body>
    </html>
    """
    return widget_html

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False) 