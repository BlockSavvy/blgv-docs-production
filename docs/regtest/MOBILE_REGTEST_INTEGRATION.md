# Mobile Regtest Integration

Guide for integrating mobile applications with the BLGV regtest environment for development and testing.

## 📱 **Mobile App Setup**

### Environment Configuration
```bash
# Navigate to mobile app
cd platforms/blgv-wallet-app

# Install dependencies
npm install

# Configure for regtest
cp .env.example .env.regtest
```

### Environment Variables
```env
# Mobile regtest configuration
EXPO_PUBLIC_API_BASE_URL=http://10.0.0.45:3004
EXPO_PUBLIC_ENVIRONMENT=regtest
EXPO_PUBLIC_BITCOIN_NETWORK=regtest
EXPO_PUBLIC_BTCPAY_SERVER_URL=http://10.0.0.45:14142
EXPO_PUBLIC_REGTEST_FAUCET_ENABLED=true
```

## 🌐 **Network Configuration**

### IP Address Setup
```bash
# Find your development machine IP
ifconfig | grep 'inet 10\|inet 192'

# Update all mobile configs with your IP
# Replace 10.0.0.45 with your actual IP address
```

### Port Forwarding
- **Treasury**: 3001
- **DEX**: 3002  
- **Pool**: 3003
- **Unified API**: 3004
- **BTCPay**: 14142

## 🔧 **Testing Features**

### Regtest-Specific Features
- **Faucet**: Get test Bitcoin instantly
- **Fast blocks**: Generate blocks on demand
- **Mock data**: Simulated mining and trading
- **Debug mode**: Enhanced logging and debugging

### Testing Workflow
```typescript
// Example test workflow
const testRegtest = async () => {
  // 1. Get test Bitcoin from faucet
  await faucet.getFunds(wallet.address, 1.0);
  
  // 2. Test treasury deposit
  await treasury.deposit(0.5);
  
  // 3. Test DEX trading
  await dex.placeOrder('BTC/USDT', 'buy', 0.1, 45000);
  
  // 4. Test Lightning payment
  await lightning.payInvoice(testInvoice);
};
```

## 📋 **Development Checklist**

### Before Testing
- [ ] Regtest environment running
- [ ] Mobile app configured with correct IP
- [ ] Device connected to same network
- [ ] Faucet funds available
- [ ] All services responding

### During Testing
- [ ] Monitor regtest logs
- [ ] Check API responses
- [ ] Verify database updates
- [ ] Test error scenarios
- [ ] Validate real-time updates

---

**Need help?** Check our [Complete Regtest Setup](COMPLETE_REGTEST_SETUP.md) guide. 