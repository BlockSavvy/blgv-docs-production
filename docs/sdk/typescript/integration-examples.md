# BLGV SDK Integration Examples

## 📱 Mobile App Integration (Current Project)

### Update existing TreasuryDashboard to use SDK

```typescript
// src/screens/wallet/TreasuryDashboard.tsx
import React, { useEffect, useState } from 'react';
import { MobileSDK } from '../sdk';

const sdk = new MobileSDK({
  environment: 'production',
  apiKey: process.env.EXPO_PUBLIC_BLGV_API_KEY,
});

export default function TreasuryDashboard() {
  const [treasuryData, setTreasuryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      await sdk.initialize();
      
      // Subscribe to real-time updates
      sdk.treasury.on('dataUpdated', setTreasuryData);
      
      // Load initial data
      const data = await sdk.treasury.getTreasuryData();
      setTreasuryData(data);
      setLoading(false);
    } catch (error) {
      console.error('SDK initialization failed:', error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>
        {sdk.treasury.formatBTCBalance()} BTC
      </Text>
      <Text style={styles.value}>
        {sdk.treasury.formatUSDValue()}
      </Text>
      <Text style={styles.premium}>
        Premium: {treasuryData?.premiumDiscount.toFixed(2)}%
      </Text>
    </View>
  );
}
```

## 🌐 DEX Platform Integration Prompt

```typescript
// PROMPT FOR DEX PLATFORM AGENT:

/*
TASK: Integrate BLGV Ecosystem SDK into the DEX platform

STEPS:
1. Install the SDK: npm install @blgv/ecosystem-sdk
2. Replace existing API calls with SDK methods
3. Implement cross-platform user sync
4. Add real-time treasury data display

IMPLEMENTATION:
*/

// pages/_app.tsx
import { WebSDK } from '@blgv/ecosystem-sdk';

const sdk = new WebSDK({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  apiKey: process.env.NEXT_PUBLIC_BLGV_API_KEY,
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    sdk.initialize().then(() => {
      console.log('BLGV SDK initialized');
    });
  }, []);

  return (
    <SDKProvider sdk={sdk}>
      <Component {...pageProps} />
    </SDKProvider>
  );
}

// components/TradingInterface.tsx
export function TradingInterface() {
  const { sdk } = useSDK();
  const [markets, setMarkets] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    loadTradingData();
    
    // Subscribe to real-time updates
    sdk.dex.on('marketsUpdated', setMarkets);
    sdk.dex.on('orderFilled', (order) => {
      toast.success(`Order ${order.id} filled!`);
      loadUserOrders();
    });
  }, []);

  const loadTradingData = async () => {
    const [marketsData, ordersData] = await Promise.all([
      sdk.dex.getMarkets(),
      sdk.dex.getOrders(userWallet)
    ]);
    setMarkets(marketsData);
    setUserOrders(ordersData);
  };

  const placeOrder = async (orderData) => {
    try {
      const order = await sdk.dex.placeOrder({
        ...orderData,
        walletAddress: userWallet
      });
      toast.success('Order placed successfully!');
      loadUserOrders();
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="trading-interface">
      <MarketsList markets={markets} />
      <OrderForm onSubmit={placeOrder} />
      <OrderBook orders={userOrders} />
      <TreasuryWidget sdk={sdk} />
    </div>
  );
}

// components/TreasuryWidget.tsx
export function TreasuryWidget({ sdk }) {
  const [treasuryData, setTreasuryData] = useState(null);

  useEffect(() => {
    sdk.treasury.getTreasuryData().then(setTreasuryData);
    sdk.treasury.on('dataUpdated', setTreasuryData);
  }, []);

  return (
    <div className="treasury-widget">
      <h3>BLGV Treasury</h3>
      <div className="metrics">
        <div className="metric">
          <label>BTC Holdings</label>
          <value>{treasuryData?.btcBalance} BTC</value>
        </div>
        <div className="metric">
          <label>Premium/Discount</label>
          <value className={treasuryData?.premiumDiscount > 0 ? 'positive' : 'negative'}>
            {treasuryData?.premiumDiscount.toFixed(2)}%
          </value>
        </div>
      </div>
    </div>
  );
}
```

## ⛏️ Mining Pool Integration Prompt

```typescript
// PROMPT FOR MINING POOL AGENT:

/*
TASK: Integrate BLGV Ecosystem SDK into the Mining Pool platform

STEPS:
1. Install the SDK: npm install @blgv/ecosystem-sdk
2. Replace mining pool API with SDK methods
3. Sync miner configurations with user profiles
4. Add treasury transparency to mining dashboard

IMPLEMENTATION:
*/

// lib/blgv-sdk.ts
import { WebSDK } from '@blgv/ecosystem-sdk';

export const sdk = new WebSDK({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  apiKey: process.env.NEXT_PUBLIC_BLGV_API_KEY,
});

// Initialize on app startup
sdk.initialize();

// components/MiningDashboard.tsx
export function MiningDashboard() {
  const { userWallet } = useAuth();
  const [poolStats, setPoolStats] = useState(null);
  const [userMiners, setUserMiners] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    loadMiningData();
    
    // Real-time updates
    sdk.pool.on('statsUpdated', setPoolStats);
    sdk.pool.on('minerAdded', () => loadUserMiners());
  }, [userWallet]);

  const loadMiningData = async () => {
    if (!userWallet) return;

    const [stats, miners, totalEarnings] = await Promise.all([
      sdk.pool.getPoolStats(),
      sdk.pool.getCachedMiners().filter(m => m.walletAddress === userWallet),
      sdk.pool.getTotalEarnings(userWallet)
    ]);

    setPoolStats(stats);
    setUserMiners(miners);
    setEarnings(totalEarnings);
  };

  const addMiner = async (minerData) => {
    try {
      await sdk.pool.addMiner({
        ...minerData,
        walletAddress: userWallet
      });
      toast.success('Miner added successfully!');
    } catch (error) {
      toast.error('Failed to add miner');
    }
  };

  return (
    <div className="mining-dashboard">
      <PoolStatsCard stats={poolStats} />
      <MinersGrid miners={userMiners} />
      <EarningsChart earnings={earnings} />
      <AddMinerForm onSubmit={addMiner} />
      <TreasuryTransparency sdk={sdk} />
    </div>
  );
}

// components/TreasuryTransparency.tsx
export function TreasuryTransparency({ sdk }) {
  const [treasuryData, setTreasuryData] = useState(null);

  useEffect(() => {
    sdk.treasury.getTreasuryData().then(setTreasuryData);
    sdk.treasury.on('dataUpdated', setTreasuryData);
  }, []);

  return (
    <div className="treasury-transparency">
      <h2>Treasury Transparency</h2>
      <div className="treasury-metrics">
        <div className="metric-card">
          <h3>BTC Holdings</h3>
          <div className="value">{treasuryData?.btcBalance} BTC</div>
          <div className="usd-value">{sdk.treasury.formatUSDValue()}</div>
        </div>
        <div className="metric-card">
          <h3>Net Asset Value</h3>
          <div className="value">${treasuryData?.btcNAV.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <h3>Premium/Discount</h3>
          <div className={`value ${treasuryData?.premiumDiscount > 0 ? 'positive' : 'negative'}`}>
            {treasuryData?.premiumDiscount.toFixed(2)}%
          </div>
        </div>
      </div>
      <PerformanceChart data={treasuryData?.performance} />
    </div>
  );
}
```

## 🧠 Treasury Intelligence Platform Integration Prompt

```typescript
// PROMPT FOR TREASURY INTELLIGENCE AGENT:

/*
TASK: Integrate BLGV Ecosystem SDK into the Treasury Intelligence platform

STEPS:
1. Install the SDK: npm install @blgv/ecosystem-sdk
2. Create comprehensive analytics dashboard
3. Add user profile sync for personalized insights
4. Implement cross-platform activity tracking

IMPLEMENTATION:
*/

// lib/sdk-client.ts
import { WebSDK } from '@blgv/ecosystem-sdk';

export const blgvSDK = new WebSDK({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  apiKey: process.env.NEXT_PUBLIC_BLGV_API_KEY,
});

// Initialize analytics tracking
blgvSDK.initialize().then(() => {
  // Track platform usage
  blgvSDK.profile.updateCrossPlatformData({
    aiUsage: {
      firstAccess: new Date().toISOString(),
      lastQuery: new Date().toISOString(),
      favoriteModels: [],
      queryCount: 0,
      subscriptionTier: 'free'
    }
  });
});

// components/IntelligenceDashboard.tsx
export function IntelligenceDashboard() {
  const [treasuryData, setTreasuryData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [crossPlatformActivity, setCrossPlatformActivity] = useState(null);

  useEffect(() => {
    loadIntelligenceData();
    
    // Real-time sync
    blgvSDK.sync.on('profileSynced', setUserProfile);
    blgvSDK.treasury.on('dataUpdated', setTreasuryData);
  }, []);

  const loadIntelligenceData = async () => {
    const [treasury, profile] = await Promise.all([
      blgvSDK.treasury.getTreasuryData(),
      blgvSDK.profile.getCurrentProfile()
    ]);

    setTreasuryData(treasury);
    setUserProfile(profile);
    
    if (profile) {
      setCrossPlatformActivity(profile.crossPlatformData);
    }
  };

  return (
    <div className="intelligence-dashboard">
      <TreasuryAnalytics data={treasuryData} />
      <CrossPlatformInsights activity={crossPlatformActivity} />
      <AIQueryInterface sdk={blgvSDK} />
      <PerformanceMetrics />
    </div>
  );
}

// components/CrossPlatformInsights.tsx
export function CrossPlatformInsights({ activity }) {
  if (!activity) return null;

  return (
    <div className="cross-platform-insights">
      <h2>Cross-Platform Activity</h2>
      
      <div className="activity-grid">
        <div className="activity-card">
          <h3>DEX Trading</h3>
          <div className="metrics">
            <div>Volume: {activity.dexActivity?.totalVolume} BTC</div>
            <div>Trades: {activity.dexActivity?.completedTrades}</div>
            <div>Active Orders: {activity.dexActivity?.activeOrders}</div>
          </div>
        </div>
        
        <div className="activity-card">
          <h3>Mining Pool</h3>
          <div className="metrics">
            <div>Earnings: {activity.miningActivity?.totalEarnings} BTC</div>
            <div>Hashrate: {formatHashrate(activity.miningActivity?.currentHashrate)}</div>
            <div>Miners: {activity.miningActivity?.connectedMiners?.length}</div>
          </div>
        </div>
        
        <div className="activity-card">
          <h3>AI Usage</h3>
          <div className="metrics">
            <div>Queries: {activity.aiUsage?.queryCount}</div>
            <div>Tier: {activity.aiUsage?.subscriptionTier}</div>
            <div>Models: {activity.aiUsage?.favoriteModels?.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/AIQueryInterface.tsx
export function AIQueryInterface({ sdk }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update AI usage stats
      const profile = sdk.profile.getCurrentProfile();
      if (profile) {
        await sdk.profile.updateCrossPlatformData({
          aiUsage: {
            ...profile.crossPlatformData.aiUsage,
            lastQuery: new Date().toISOString(),
            queryCount: (profile.crossPlatformData.aiUsage?.queryCount || 0) + 1
          }
        });
      }

      // Process query...
      
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-query-interface">
      <h2>AI Treasury Analysis</h2>
      <form onSubmit={handleQuery}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about treasury performance, market analysis, or Bitcoin trends..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </div>
  );
}
```

## 🔧 Backend API Integration

```typescript
// PROMPT FOR BACKEND API DEVELOPMENT:

/*
TASK: Create backend APIs to support the BLGV Ecosystem SDK

REQUIRED ENDPOINTS:

Authentication:
- POST /auth/wallet
- POST /auth/api-key
- POST /auth/refresh
- POST /auth/logout

Profiles:
- POST /profiles
- GET /profiles/:id
- PUT /profiles/:id
- DELETE /profiles/:id

Wallets:
- POST /wallets
- POST /wallets/import
- GET /wallets
- GET /wallets/:address
- GET /wallets/:address/balance
- DELETE /wallets/:address

Treasury:
- GET /treasury
- GET /btc/price
- GET /stock/price
- GET /treasury/performance

DEX:
- GET /markets
- GET /markets/:symbol
- POST /orders
- GET /orders
- DELETE /orders/:id
- GET /orders/history
- GET /trading/volume

Pool:
- GET /stats
- POST /miners
- GET /miners
- GET /miners/:id
- PUT /miners/:id
- DELETE /miners/:id
- GET /payouts
- GET /earnings

Sync:
- POST /sync/operations
- GET /sync/conflicts
- POST /sync/conflicts/:id/resolve
- GET /sync/changes

IMPLEMENTATION:
*/

// server/routes/treasury.ts
import express from 'express';
import { getTreasuryData, getBTCPrice, getStockPrice } from '../services/treasury';

const router = express.Router();

router.get('/treasury', async (req, res) => {
  try {
    const data = await getTreasuryData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/btc/price', async (req, res) => {
  try {
    const price = await getBTCPrice();
    res.json({ success: true, data: { price } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add more endpoints...

export default router;
```

## 📱 Integration with Current Mobile App

```typescript
// Update existing mobile app to use SDK

// src/lib/blgv-sdk.ts
import { MobileSDK } from './sdk';

export const blgvSDK = new MobileSDK({
  environment: __DEV__ ? 'development' : 'production',
  apiKey: process.env.EXPO_PUBLIC_BLGV_API_KEY,
});

// Initialize SDK
export const initializeSDK = async () => {
  try {
    await blgvSDK.initialize();
    console.log('BLGV SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('SDK initialization failed:', error);
    return false;
  }
};

// src/App.tsx - Update to initialize SDK
export default function App() {
  useEffect(() => {
    initializeSDK();
  }, []);

  // Rest of app...
}

// Update existing screens to use SDK
// src/screens/wallet/TreasuryDashboard.tsx
import { blgvSDK } from '../../lib/blgv-sdk';

// Replace existing API calls with SDK methods
const [treasuryData, setTreasuryData] = useState(null);

useEffect(() => {
  blgvSDK.treasury.getTreasuryData().then(setTreasuryData);
  blgvSDK.treasury.on('dataUpdated', setTreasuryData);
}, []);
``` 