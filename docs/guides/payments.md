# Payment Processing Guide

Comprehensive guide for implementing Bitcoin and Lightning payments using BLGV's payment infrastructure.

## 💳 **Payment Methods**

### Supported Payment Types
- **On-chain Bitcoin**: Traditional Bitcoin transactions
- **Lightning Network**: Instant, low-fee payments
- **BTCPay Server**: Self-hosted payment processing
- **Cross-platform**: Unified payment experience

## ⚡ **Lightning Payments**

### Creating Lightning Invoices
```typescript
import { PaymentProcessor } from '@blgv/payments';

const payments = new PaymentProcessor({
  lightning: true,
  btcpay: {
    serverUrl: 'https://btc.gdyup.xyz',
    apiKey: process.env.BTCPAY_API_KEY
  }
});

// Create Lightning invoice
const invoice = await payments.createLightningInvoice({
  amount: 100000, // satoshis
  description: 'BLGV Service Payment',
  expiry: 3600
});
```

### Processing Payments
```typescript
// Listen for payment confirmations
payments.on('payment_received', (payment) => {
  console.log('Payment received:', payment);
  // Update order status, deliver goods, etc.
});

// Handle payment failures
payments.on('payment_failed', (payment) => {
  console.log('Payment failed:', payment);
  // Notify user, retry, etc.
});
```

## 🏪 **BTCPay Integration**

### Store Setup
```typescript
const storeConfig = {
  name: 'BLGV Store',
  website: 'https://blgvbtc.com',
  defaultCurrency: 'USD',
  invoiceExpiration: 3600,
  lightningEnabled: true
};

const store = await payments.createStore(storeConfig);
```

### Webhook Handling
```typescript
app.post('/btcpay-webhook', (req, res) => {
  const { type, data } = req.body;
  
  switch (type) {
    case 'InvoiceSettled':
      handlePaymentComplete(data);
      break;
    case 'InvoiceExpired':
      handlePaymentExpired(data);
      break;
  }
  
  res.status(200).send('OK');
});
```

## 🔐 **Security Best Practices**

### Payment Verification
- Always verify payment amounts
- Check payment confirmations
- Implement proper webhook authentication
- Use HTTPS for all payment endpoints

### Error Handling
```typescript
try {
  const payment = await payments.processPayment(paymentData);
  return { success: true, payment };
} catch (error) {
  console.error('Payment processing error:', error);
  return { success: false, error: error.message };
}
```

---

**Need help?** Check our [BTCPay Integration](../payments/btcpay.md) documentation. 