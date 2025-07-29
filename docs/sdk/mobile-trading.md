# Mobile Trading SDK

The BLGV Mobile Trading SDK provides React Native components and hooks for seamless DEX integration within the mobile app.

## 📱 **Mobile DEX Integration**

### Trading Components
```typescript
import { TradingView, OrderBook, TradeHistory } from '@blgv/mobile-trading';

const DEXTradingScreen = () => {
  return (
    <View style={styles.container}>
      <TradingView pair="BTC/USDT" />
      <OrderBook pair="BTC/USDT" />
      <TradeHistory userId={currentUser.id} />
    </View>
  );
};
```

### Trading Hooks
```typescript
import { useTrading, useOrderBook, useMarketData } from '@blgv/mobile-trading';

const TradingHook = () => {
  const { placeOrder, cancelOrder, orders } = useTrading();
  const { bids, asks, spread } = useOrderBook('BTC/USDT');
  const { price, volume, change } = useMarketData('BTC/USDT');
  
  const handleTrade = async () => {
    await placeOrder({
      pair: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      amount: '0.1',
      price: '45000'
    });
  };
  
  return (
    // Trading UI components
  );
};
```

## 🔐 **Security Features**
- Biometric authentication for trades
- Hardware wallet integration
- Secure key storage
- Transaction signing

## ⚡ **Lightning Integration**
- Instant deposits via Lightning
- Lightning withdrawals
- Channel management
- Payment routing

---

**Need help?** Check our [DEX Platform](../platforms/dex.md) or [Mobile App](../platforms/mobile.md) documentation. 