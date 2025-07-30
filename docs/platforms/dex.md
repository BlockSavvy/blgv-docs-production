# ⚡ DEX Platform

**Bitcoin-Native Decentralized Exchange for Professional Trading**

## 🎯 **Overview**

The BLGV DEX Platform is a professional-grade decentralized exchange designed specifically for Bitcoin-native assets, Taproot Assets, and cross-platform trading within the BLGV ecosystem.

### **Key Features**
- **Bitcoin-Native Trading**: Direct BTC and Lightning Network integration
- **Taproot Assets**: First-class support for Bitcoin-native tokens
- **Professional Interface**: Advanced trading tools and analytics
- **Cross-Platform Integration**: Seamless mobile and treasury platform sync
- **Lightning Fast**: Instant settlement via Lightning Network

### **Production URL**
**Live Platform**: [https://dex.blgvbtc.com](https://dex.blgvbtc.com)

---

## 🏗️ **Architecture**

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (dex schema)
- **Trading Engine**: Custom orderbook and matching engine
- **Payments**: BTCPay Server + Lightning Network
- **WebSockets**: Real-time price feeds and order updates

### **Directory Structure**
```
platforms/dex/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Trading interface pages
│   │   ├── lib/              # Trading utilities
│   │   └── index.css         # Styles
│   └── package.json
├── server/                    # Trading engine backend
│   ├── routes/               # API routes
│   ├── amm-engine.ts         # AMM trading engine
│   ├── btcpay-plugin.ts      # Payment integration
│   └── index.ts              # Server entry
├── shared/                   # Shared trading logic
├── mobile/                   # Mobile SDK integration
└── README.md
```

### **Database Schema**
- **Schema**: `dex`
- **Main Tables**: `users`, `trading_pairs`, `orders`, `trades`
- **Real-Time**: Order book and trade history

---

## 🚀 **Getting Started**

### **Development Setup**
```bash
cd platforms/dex

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development

# Start development servers
npm run dev

# Frontend: http://localhost:3002
# Backend API: http://localhost:3002/api
```

### **Environment Variables**
```env
# Development
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/blgv_development
BTCPAY_API_KEY=your_btcpay_key
TREASURY_WEBHOOK_URL=http://localhost:3001/v1/events

# Production (see docs/ENVIRONMENT_SECRETS.md)
NODE_ENV=production
DATABASE_URL=postgresql://doadmin:...
BTCPAY_LIVE_API_KEY=production_key
TREASURY_WEBHOOK_URL=https://blgvbtc.com/v1/events
```

---

## 💱 **Trading Features**

### **1. Order Management**
**Component**: `TradingInterface.tsx`

Professional trading interface:
- Market and limit orders
- Stop-loss and take-profit orders
- Order book visualization
- Trade history and portfolio tracking

### **2. Automated Market Making (AMM)**
**Engine**: `amm-engine.ts`

Advanced AMM functionality:
- Liquidity pools for trading pairs
- Dynamic fee adjustments
- Slippage protection
- Yield farming opportunities

### **3. Lightning Integration**
**Component**: `LightningPayments.tsx`

Instant settlement capabilities:
- Lightning Network deposits/withdrawals
- Submarine swaps (on-chain ↔ Lightning)
- Channel management
- Real-time settlement

### **4. Taproot Assets**
**Component**: `TaprootAssets.tsx`

Bitcoin-native token support:
- Asset issuance and management
- Cross-asset trading pairs
- Asset metadata and verification
- Multi-asset portfolios

---

## 🔗 **API Endpoints**

### **Trading**
```typescript
GET  /api/markets              # Available trading pairs
GET  /api/orderbook/:pair      # Order book for trading pair
POST /api/orders               # Create new order
GET  /api/orders               # User's orders
DELETE /api/orders/:id         # Cancel order
```

### **Portfolio**
```typescript
GET  /api/portfolio            # User portfolio
GET  /api/trades               # Trade history
GET  /api/balances             # Account balances
POST /api/deposits             # Initiate deposit
POST /api/withdrawals          # Request withdrawal
```

### **Market Data**
```typescript
GET  /api/tickers              # 24h ticker data
GET  /api/candles/:pair        # OHLCV candlestick data
GET  /api/trades/:pair         # Recent trades
GET  /api/stats                # Platform statistics
```

### **Lightning**
```typescript
POST /api/lightning/invoice    # Create Lightning invoice
GET  /api/lightning/channels   # Channel information
POST /api/lightning/swap       # Submarine swap
GET  /api/lightning/balance    # Lightning balance
```

---

## 🔐 **Authentication & Security**

### **Wallet-Based Authentication**
```typescript
// Connect Bitcoin wallet
const walletAddress = await connectWallet();

// Sign authentication message
const signature = await signMessage(authMessage);

// Authenticate with DEX
const session = await dexSDK.auth.authenticateWithWallet(
  walletAddress, 
  signature
);
```

### **Trading Security**
- **Non-Custodial**: Users control their private keys
- **Multi-Signature**: Optional multi-sig wallet support
- **Time-Locked Orders**: Automated order expiration
- **Rate Limiting**: Protection against API abuse

### **Fund Security**
- **Lightning Channels**: Secure channel state management
- **On-Chain Escrow**: Multi-signature escrow for large trades
- **Hot/Cold Storage**: Segregated fund management
- **Regular Audits**: Proof-of-reserves verification

---

## 📱 **Mobile Integration**

### **SDK Integration**
```typescript
import { blgvSDK } from '../../sdk/typescript';

// Get market data for mobile
const markets = await blgvSDK.dex.getMarkets();

// Place mobile order
const order = await blgvSDK.dex.createOrder({
  pair: 'BTC/USDT',
  side: 'buy',
  amount: 0.001,
  type: 'market'
});

// Real-time price updates
blgvSDK.dex.subscribeToPriceUpdates((update) => {
  updateMobilePrices(update);
});
```

### **Mobile Features**
- **Touch-Optimized Interface**: Mobile-first trading UI
- **Biometric Orders**: Biometric confirmation for trades
- **Push Notifications**: Price alerts and order fills
- **Offline Portfolio**: Cached portfolio data

---

## 🔄 **Real-Time Trading**

### **WebSocket Feeds**
```typescript
// Real-time order book updates
const ws = new WebSocket('/ws/orderbook/BTC-USDT');

ws.on('orderbook_update', (data) => {
  updateOrderBook(data);
});

// Real-time trade stream
ws.on('trade', (trade) => {
  updateTradeHistory(trade);
});

// Price ticker updates
ws.on('ticker', (ticker) => {
  updatePriceTicker(ticker);
});
```

### **Market Data Feeds**
- **Order Book**: Real-time bid/ask updates
- **Trade Stream**: Live trade execution data
- **Price Tickers**: 24h price and volume data
- **Depth Charts**: Market depth visualization

---

## 💰 **Payment Integration**

### **BTCPay Server Integration**
```typescript
// Create payment invoice
const invoice = await btcpay.createInvoice({
  amount: 0.001,
  currency: 'BTC',
  description: 'DEX deposit'
});

// Monitor payment status
btcpay.on('payment_received', (payment) => {
  creditUserAccount(payment);
});
```

### **Lightning Network**
```typescript
// Lightning deposit
const lightningInvoice = await lnd.createInvoice({
  amount: 10000, // sats
  memo: 'DEX Lightning deposit'
});

// Lightning withdrawal
const withdrawal = await lnd.payInvoice({
  invoice: userInvoice,
  amount: 5000
});
```

---

## 🧪 **Testing**

### **Trading Engine Tests**
```bash
# Order matching tests
npm run test:orderbook

# AMM engine tests
npm run test:amm

# Lightning integration tests
npm run test:lightning

# End-to-end trading tests
npm run test:e2e:trading
```

### **Test Coverage**
- **Order Matching**: Comprehensive order book testing
- **Payment Integration**: BTCPay and Lightning testing
- **API Endpoints**: Full REST API testing
- **WebSocket**: Real-time data stream testing

---

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Sync to production repo
./ops/deploy/sync-to-production.sh dex

# Monitor deployment
./ops/deploy/sync-to-production.sh --status

# Verify trading functionality
curl -s https://dex.blgvbtc.com/api/health
curl -s https://dex.blgvbtc.com/api/markets
```

### **Health Checks**
- **Endpoint**: `/api/health`
- **Trading Engine**: Order matching functionality
- **Database**: Connection and query performance
- **BTCPay**: Payment processor connectivity
- **Lightning**: Node connectivity and channel status

---

## 📈 **Trading Analytics**

### **Platform Metrics**
- **Trading Volume**: 24h and historical volume
- **Liquidity Depth**: Order book depth analysis
- **User Activity**: Active traders and new signups
- **Fee Revenue**: Platform fee generation

### **Performance Monitoring**
- **Order Latency**: Time from order to execution
- **WebSocket Performance**: Real-time data delivery
- **Payment Processing**: Deposit/withdrawal times
- **Database Queries**: Trading query optimization

---

## 🛠️ **Development Guidelines**

### **Trading Engine Development**
```typescript
// Order processing template
interface Order {
  id: string;
  userId: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
}

const processOrder = async (order: Order) => {
  // Validation
  // Risk checks
  // Order matching
  // Settlement
};
```

### **Component Development**
```typescript
// Trading component template
interface TradingComponentProps {
  pair: TradingPair;
  orderBook: OrderBook;
  onOrderCreate: (order: Order) => void;
}

const TradingComponent: React.FC<TradingComponentProps> = ({
  pair,
  orderBook,
  onOrderCreate
}) => {
  // Trading logic
  return (
    <div className="trading-interface">
      {/* Trading UI */}
    </div>
  );
};
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Order Not Executing**
```bash
# Check order book liquidity
curl https://dex.blgvbtc.com/api/orderbook/BTC-USDT

# Verify order parameters
curl https://dex.blgvbtc.com/api/orders/USER_ORDER_ID

# Check trading engine logs
tail -f logs/trading-engine.log
```

#### **Payment Issues**
```bash
# Test BTCPay connection
curl -H "Authorization: Bearer $BTCPAY_API_KEY" \
     https://btc.gdyup.xyz/api/v1/stores

# Check Lightning node status
lightning-cli getinfo

# Verify invoice status
curl https://dex.blgvbtc.com/api/invoices/INVOICE_ID
```

#### **WebSocket Connection Failed**
```bash
# Test WebSocket endpoint
wscat -c wss://dex.blgvbtc.com/ws/orderbook/BTC-USDT

# Check connection limits
netstat -an | grep 3002 | wc -l

# Verify authentication
# Check WebSocket authentication headers
```

---

## 🔧 **Configuration**

### **Trading Parameters**
```env
# Order matching
MIN_ORDER_SIZE=0.00001
MAX_ORDER_SIZE=10.0
TICK_SIZE=0.01
MAKER_FEE=0.001
TAKER_FEE=0.002

# Risk management
MAX_OPEN_ORDERS=100
DAILY_TRADING_LIMIT=1.0
WITHDRAWAL_LIMIT=0.1
```

### **Performance Settings**
```env
# WebSocket
WS_MAX_CONNECTIONS=10000
WS_HEARTBEAT_INTERVAL=30000

# Database
ORDER_BOOK_CACHE_TTL=5000
TRADE_HISTORY_LIMIT=1000

# Lightning
CHANNEL_RESERVE=100000
PAYMENT_TIMEOUT=30000
```

---

## 📚 **Resources**

### **Documentation**
- [Trading API Reference](../api/dex.md)
- [Lightning Integration Guide](../lightning/integration.md)
- [BTCPay Setup Guide](../payments/btcpay.md)
- [Mobile Trading SDK](../sdk/mobile-trading.md)

### **External Resources**
- [BTCPay Server Documentation](https://docs.btcpayserver.org/)
- [Lightning Network Protocol](https://github.com/lightningnetwork/lightning-rfc)
- [Taproot Assets Protocol](https://docs.lightning.engineering/the-lightning-network/taproot-assets)

---

## 🎯 **Roadmap**

### **Current Features** ✅
- Spot trading (BTC/USDT, BTC/USD)
- Lightning deposits/withdrawals
- Real-time order book
- Mobile trading interface
- Cross-platform portfolio sync

### **Planned Features** 🚀
- **Q1 2025**
  - Taproot Assets trading
  - Advanced order types
  - Margin trading
  - DCA (Dollar Cost Averaging)

- **Q2 2025**
  - Derivatives trading
  - Options contracts
  - Liquidity mining
  - Governance tokens

- **Q3 2025**
  - Cross-chain bridges
  - Automated trading bots
  - Institutional API
  - Advanced charting

---

**Maintainer**: DEX Team  
**Last Updated**: January 2025  
**Version**: 2.1.0 