# DEX Platform API Reference

The BLGV DEX platform provides a comprehensive Bitcoin-native trading API with Lightning Network integration and Taproot Assets support.

## 🔗 **Base URL**

- **Production**: `https://dex.blgvbtc.com/api`
- **Regtest**: `http://localhost:3002/api`

## 🔐 **Authentication**

### Wallet Signature Authentication
```typescript
interface WalletAuth {
  address: string;
  signature: string;
  message: string;
  timestamp: number;
}
```

### HMAC Authentication (Server-to-Server)
```bash
curl -X GET "https://dex.blgvbtc.com/api/markets" \
  -H "X-BLGV-API-Key: your-api-key" \
  -H "X-BLGV-Signature: hmac-signature" \
  -H "X-BLGV-Timestamp: 1234567890"
```

## 📊 **Market Data Endpoints**

### GET /markets
Get all available trading pairs

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "pair": "BTC/USDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "status": "active",
      "minOrderSize": "0.00001",
      "maxOrderSize": "100.0",
      "priceDecimals": 2,
      "volumeDecimals": 8,
      "lastPrice": "45000.00",
      "24hVolume": "150.5",
      "24hChange": "+2.5%"
    }
  ]
}
```

### GET /ticker/:pair
Get 24h ticker statistics

**Parameters:**
- `pair` - Trading pair (e.g., "BTC-USDT")

**Response:**
```json
{
  "success": true,
  "data": {
    "pair": "BTC/USDT",
    "last": "45000.00",
    "high": "46500.00",
    "low": "44000.00",
    "volume": "150.5",
    "change": "+2.5%",
    "timestamp": "2025-01-29T12:00:00Z"
  }
}
```

### GET /orderbook/:pair
Get order book for trading pair

**Response:**
```json
{
  "success": true,
  "data": {
    "pair": "BTC/USDT",
    "bids": [
      ["44950.00", "0.5"],
      ["44900.00", "1.2"]
    ],
    "asks": [
      ["45050.00", "0.8"],
      ["45100.00", "2.1"]
    ],
    "timestamp": "2025-01-29T12:00:00Z"
  }
}
```

### GET /trades/:pair
Get recent trades

**Query Parameters:**
- `limit` - Number of trades (default: 50, max: 500)
- `since` - Timestamp to get trades after

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trade_123",
      "price": "45000.00",
      "amount": "0.1",
      "side": "buy",
      "timestamp": "2025-01-29T12:00:00Z"
    }
  ]
}
```

## 💰 **Trading Endpoints**

### POST /orders
Place a new order

**Request Body:**
```json
{
  "pair": "BTC/USDT",
  "side": "buy",
  "type": "limit",
  "amount": "0.1",
  "price": "45000.00",
  "timeInForce": "GTC"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "pending",
    "pair": "BTC/USDT",
    "side": "buy",
    "type": "limit",
    "amount": "0.1",
    "price": "45000.00",
    "filled": "0.0",
    "remaining": "0.1",
    "timestamp": "2025-01-29T12:00:00Z"
  }
}
```

### GET /orders
Get user's orders

**Query Parameters:**
- `status` - Order status (pending, filled, cancelled)
- `pair` - Trading pair filter
- `limit` - Number of orders (default: 50)

### GET /orders/:orderId
Get specific order details

### DELETE /orders/:orderId
Cancel an order

### GET /trades
Get user's trade history

## ⚡ **Lightning Network Integration**

### POST /lightning/invoice
Create Lightning invoice for deposit

**Request:**
```json
{
  "amount": 100000,
  "description": "DEX deposit",
  "expiry": 3600
}
```

### POST /lightning/withdraw
Withdraw via Lightning Network

**Request:**
```json
{
  "invoice": "lnbc...",
  "amount": 95000
}
```

## 🏷️ **Taproot Assets**

### GET /assets
List supported Taproot Assets

### POST /assets/transfer
Transfer Taproot Assets

## 📈 **Analytics Endpoints**

### GET /stats/volume
Get trading volume statistics

### GET /stats/fees
Get fee structure

### GET /stats/liquidity
Get liquidity metrics

## 🔔 **WebSocket API**

### Connection
```javascript
const ws = new WebSocket('wss://dex.blgvbtc.com/ws');
```

### Subscribe to Market Data
```json
{
  "type": "subscribe",
  "channel": "ticker",
  "pair": "BTC/USDT"
}
```

### Order Updates
```json
{
  "type": "subscribe",
  "channel": "orders",
  "apiKey": "your-api-key"
}
```

## 🚨 **Error Handling**

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for this operation",
    "details": {
      "required": "0.1 BTC",
      "available": "0.05 BTC"
    }
  }
}
```

### Common Error Codes
- `INVALID_PAIR` - Trading pair not supported
- `INSUFFICIENT_BALANCE` - Not enough balance
- `INVALID_ORDER_SIZE` - Order size below minimum
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INVALID_SIGNATURE` - Authentication failed

## 📝 **Rate Limiting**

- **Public endpoints**: 100 requests per minute
- **Private endpoints**: 300 requests per minute
- **WebSocket**: 1000 messages per minute

## 🔒 **Security**

- All API calls require HTTPS in production
- Sensitive operations require wallet signature
- Rate limiting enforced
- Request signing for server-to-server communication

## 📚 **SDK Integration**

```typescript
import { DEXClient } from '@blgv/ecosystem-sdk';

const dex = new DEXClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Place order
const order = await dex.placeOrder({
  pair: 'BTC/USDT',
  side: 'buy',
  type: 'limit',
  amount: '0.1',
  price: '45000.00'
});
```

---

**Need help?** Check our [DEX Platform Guide](../platforms/dex.md) or reach out via [GitHub Issues](https://github.com/BlockSavvy/Unified-Treasury-System/issues). 