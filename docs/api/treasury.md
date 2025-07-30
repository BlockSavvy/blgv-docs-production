# Treasury Platform API Reference

The BLGV Treasury platform provides enterprise-grade Bitcoin treasury management APIs with real-time analytics and BTC-per-share tracking.

## 🔗 **Base URL**

- **Production**: `https://blgvbtc.com/api`
- **Regtest**: `http://localhost:3001/api`

## 🔐 **Authentication**

### API Key Authentication
```bash
curl -X GET "https://blgvbtc.com/api/treasury/holdings" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json"
```

### Multi-Signature Wallet Authentication
```typescript
interface MultisigAuth {
  walletId: string;
  signatures: string[];
  threshold: number;
  publicKeys: string[];
}
```

## 💰 **Treasury Holdings**

### GET /treasury/holdings
Get current Bitcoin holdings and portfolio

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBTC": "15.75432100",
    "totalUSD": "708750.00",
    "btcPrice": "45000.00",
    "shareOutstanding": 1000000,
    "btcPerShare": "0.00001575",
    "lastUpdated": "2025-01-29T12:00:00Z",
    "holdings": [
      {
        "address": "bc1q...",
        "balance": "5.25000000",
        "type": "cold_storage",
        "label": "Primary Treasury"
      }
    ]
  }
}
```

### GET /treasury/performance
Get treasury performance metrics

**Query Parameters:**
- `period` - Time period (1d, 7d, 30d, 90d, 1y, all)
- `metric` - Specific metric (btc_holdings, usd_value, btc_per_share)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "startValue": "650000.00",
    "endValue": "708750.00",
    "changePercent": "+9.04%",
    "btcHoldingsChange": "+0.75432100",
    "timeseries": [
      {
        "timestamp": "2025-01-01T00:00:00Z",
        "btcHoldings": "15.00000000",
        "usdValue": "650000.00",
        "btcPerShare": "0.00001500"
      }
    ]
  }
}
```

## 📊 **Analytics & Reporting**

### GET /treasury/analytics/btc-per-share
Get detailed BTC-per-share analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "current": "0.00001575",
    "previousMonth": "0.00001500",
    "changePercent": "+5.0%",
    "trend": "increasing",
    "projections": {
      "conservative": "0.00001650",
      "moderate": "0.00001750",
      "optimistic": "0.00001850"
    }
  }
}
```

### GET /treasury/analytics/cash-flow
Get cash flow analysis

### GET /treasury/analytics/risk-metrics
Get risk assessment metrics

## 🔄 **Transactions**

### GET /treasury/transactions
Get transaction history

**Query Parameters:**
- `type` - Transaction type (purchase, sale, fee, transfer)
- `limit` - Number of transactions (default: 50)
- `since` - Timestamp filter
- `address` - Filter by address

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "txid": "a1b2c3...",
      "type": "purchase",
      "amount": "1.50000000",
      "price": "44000.00",
      "usdValue": "66000.00",
      "fee": "0.00010000",
      "timestamp": "2025-01-29T10:30:00Z",
      "status": "confirmed",
      "confirmations": 6
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

### POST /treasury/purchase
Execute Bitcoin purchase (requires multi-sig)

**Request:**
```json
{
  "amount": "1.0",
  "maxPrice": "45000.00",
  "strategy": "dca",
  "approvers": ["pubkey1", "pubkey2", "pubkey3"]
}
```

### POST /treasury/transfer
Transfer Bitcoin between addresses

## 📈 **Price & Market Data**

### GET /treasury/price/current
Get current Bitcoin price and sources

**Response:**
```json
{
  "success": true,
  "data": {
    "price": "45000.00",
    "currency": "USD",
    "sources": [
      {
        "exchange": "Coinbase",
        "price": "44995.50",
        "weight": 0.3
      },
      {
        "exchange": "Binance",
        "price": "45002.25",
        "weight": 0.3
      }
    ],
    "lastUpdated": "2025-01-29T12:00:00Z"
  }
}
```

### GET /treasury/price/history
Get historical price data

## 🏢 **Compliance & Reporting**

### GET /treasury/reports/monthly
Generate monthly treasury report

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2025-01",
    "summary": {
      "openingBalance": "14.25000000",
      "purchases": "2.50000000",
      "sales": "0.00000000",
      "fees": "0.00567900",
      "closingBalance": "15.75432100"
    },
    "pnl": {
      "realizedGains": "0.00",
      "unrealizedGains": "58750.00",
      "totalReturn": "+9.04%"
    },
    "reportUrl": "https://blgvbtc.com/reports/2025-01-treasury.pdf"
  }
}
```

### GET /treasury/reports/audit-trail
Get detailed audit trail

### POST /treasury/reports/generate
Generate custom report

## 🎯 **Strategy & DCA**

### GET /treasury/strategy/current
Get current investment strategy

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "dca",
    "frequency": "weekly",
    "amount": "10000.00",
    "maxPrice": "50000.00",
    "active": true,
    "nextExecution": "2025-02-03T10:00:00Z",
    "performance": {
      "totalInvested": "500000.00",
      "avgCostBasis": "41500.00",
      "currentValue": "708750.00",
      "unrealizedGain": "+41.75%"
    }
  }
}
```

### POST /treasury/strategy/update
Update investment strategy

### GET /treasury/strategy/backtest
Backtest investment strategies

## 🔔 **Webhooks & Events**

### POST /treasury/webhooks
Register webhook endpoint

**Request:**
```json
{
  "url": "https://your-app.com/blgv-webhook",
  "events": ["purchase", "price_alert", "balance_change"],
  "secret": "webhook-secret"
}
```

### Event Types
- `purchase` - Bitcoin purchase executed
- `sale` - Bitcoin sale executed
- `price_alert` - Price threshold reached
- `balance_change` - Holdings balance changed
- `report_ready` - Report generation completed

## 🎯 **Alerts & Notifications**

### POST /treasury/alerts
Create price or balance alert

**Request:**
```json
{
  "type": "price",
  "condition": "above",
  "threshold": "50000.00",
  "notification": {
    "email": true,
    "webhook": true,
    "push": false
  }
}
```

### GET /treasury/alerts
Get active alerts

## 🔒 **Multi-Signature Operations**

### GET /treasury/multisig/wallets
Get multi-signature wallet configurations

### POST /treasury/multisig/propose
Propose multi-signature transaction

### POST /treasury/multisig/approve
Approve pending transaction

### GET /treasury/multisig/pending
Get pending transactions

## 📊 **Dashboard Data**

### GET /treasury/dashboard
Get dashboard overview data

**Response:**
```json
{
  "success": true,
  "data": {
    "holdings": {
      "btc": "15.75432100",
      "usd": "708750.00"
    },
    "performance": {
      "24h": "+2.5%",
      "7d": "+8.2%",
      "30d": "+9.04%"
    },
    "recentTransactions": [...],
    "alerts": [...],
    "nextDCA": "2025-02-03T10:00:00Z"
  }
}
```

## 📚 **SDK Integration**

```typescript
import { TreasuryClient } from '@blgv/ecosystem-sdk';

const treasury = new TreasuryClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get holdings
const holdings = await treasury.getHoldings();

// Execute purchase
const purchase = await treasury.purchase({
  amount: '1.0',
  maxPrice: '45000.00'
});
```

## 🚨 **Error Handling**

### Common Error Codes
- `INSUFFICIENT_FUNDS` - Not enough funds for operation
- `PRICE_EXCEEDED` - Current price exceeds maximum
- `MULTISIG_REQUIRED` - Operation requires multi-signature approval
- `COMPLIANCE_VIOLATION` - Operation violates compliance rules
- `RATE_LIMIT_EXCEEDED` - Too many API requests

## 📝 **Rate Limiting**

- **Public endpoints**: 100 requests per minute
- **Private endpoints**: 300 requests per minute
- **Trading operations**: 60 requests per minute

---

**Need help?** Check our [Treasury Platform Guide](../platforms/treasury.md) or reach out via [GitHub Issues](https://github.com/BlockSavvy/Unified-Treasury-System/issues). 