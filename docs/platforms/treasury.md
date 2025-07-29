# 🏛️ Treasury Intelligence Platform

**AI-Powered Treasury Analytics & Management for Bitcoin-Native Finance**

## 🎯 **Overview**

The Treasury Intelligence Platform is the flagship application of the BLGV ecosystem, providing institutional-grade treasury analytics, AI-powered market insights, and comprehensive Bitcoin portfolio management.

### **Key Features**
- **Real-Time Treasury Tracking**: Live BTC holdings and USD value monitoring
- **AI-Powered Analysis**: Claude-4 driven market analysis and recommendations
- **Cross-Platform Insights**: Unified view of DEX, Pool, and Mobile activity
- **Professional Analytics**: Institutional-grade charts and performance metrics
- **Risk Management**: Portfolio risk assessment and mitigation strategies

### **Production URL**
**Live Platform**: [https://blgvbtc.com](https://blgvbtc.com)

---

## 🏗️ **Architecture**

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (treasury schema)
- **AI Integration**: Anthropic Claude-4 API
- **Real-Time**: WebSocket connections
- **Authentication**: JWT + session-based

### **Directory Structure**
```
platforms/treasury/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities & SDK
│   │   └── index.css         # Global styles
│   ├── index.html
│   └── package.json
├── server/                    # Node.js backend
│   ├── routes/               # API routes
│   ├── ai.ts                 # AI integration
│   └── index.ts              # Server entry
├── mobile/                   # Mobile SDK integration
├── shared/                   # Shared utilities
├── docs/                     # Platform documentation
└── README.md
```

### **Database Schema**
- **Schema**: `treasury`
- **Main Tables**: `users`, `company_metrics`, `timeline_events`
- **Shared Tables**: Access to `shared` schema for cross-platform data

---

## 🚀 **Getting Started**

### **Development Setup**
```bash
cd platforms/treasury

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development

# Start development server
npm run dev

# Backend runs on: http://localhost:3001
# Frontend runs on: http://localhost:5173
```

### **Environment Variables**
```env
# Development
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/blgv_development
SESSION_SECRET=development_secret
ANTHROPIC_API_KEY=your_claude_api_key

# Production (see docs/ENVIRONMENT_SECRETS.md)
NODE_ENV=production
DATABASE_URL=postgresql://doadmin:...
SESSION_SECRET=secure_production_secret
ANTHROPIC_API_KEY=prod_claude_api_key
```

---

## 📊 **Core Features**

### **1. Treasury Dashboard**
**Component**: `IntelligenceDashboard.tsx`

Real-time treasury metrics and analytics:
- Current BTC holdings and USD value
- Portfolio performance indicators
- Premium/discount analysis
- Historical performance charts

### **2. AI-Powered Analysis**
**Component**: `AIAnalysisInterface.tsx`

Claude-4 integration for:
- Market sentiment analysis
- Risk assessment reports
- Investment recommendations
- Portfolio optimization suggestions

### **3. Cross-Platform Insights**
**Component**: `CrossPlatformInsights.tsx`

Unified view across ecosystem:
- DEX trading activity
- Mining pool statistics
- Mobile app engagement
- User behavior analytics

### **4. Advanced Analytics**
**Component**: `AdvancedAnalytics.tsx`

Professional-grade analytics:
- Performance metrics
- Risk analysis
- Comparative analysis
- Custom reporting

---

## 🔗 **API Endpoints**

### **Treasury Data**
```typescript
GET  /api/treasury-data          # Current treasury metrics
GET  /api/treasury-history       # Historical data
POST /api/treasury-analysis      # AI analysis request
```

### **AI Integration**
```typescript
POST /api/ai/analyze             # Request AI analysis
GET  /api/ai/insights           # Get AI insights
POST /api/ai/query              # Custom AI queries
```

### **Cross-Platform**
```typescript
GET  /api/cross-platform-data   # Unified ecosystem data
GET  /api/user-activity         # User engagement metrics
GET  /api/platform-stats        # Platform statistics
```

### **Authentication**
```typescript
POST /api/auth/login            # User authentication
GET  /api/auth/session          # Session validation
POST /api/auth/logout           # Session termination
```

---

## 🔐 **Authentication & Authorization**

### **User Roles**
- **Admin**: Full system access
- **Treasury**: Treasury data and analytics
- **Analyst**: Read-only analytics access
- **Viewer**: Basic dashboard access

### **Authentication Flow**
1. User login with email/password
2. JWT token generation
3. Session storage with expiration
4. Role-based route protection
5. Cross-platform session sync

### **Protected Routes**
```typescript
/intelligence        # Treasury/Admin only
/analytics          # Analyst/Treasury/Admin
/reports            # Treasury/Admin only
/settings           # Admin only
```

---

## 📱 **Mobile Integration**

### **SDK Integration**
The platform integrates with the mobile app via the unified TypeScript SDK:

```typescript
import { blgvSDK } from '../../sdk/typescript';

// Get treasury data for mobile
const treasuryData = await blgvSDK.treasury.getTreasuryData();

// Real-time updates
blgvSDK.treasury.on('dataUpdated', (data) => {
  updateMobileDisplay(data);
});
```

### **Mobile-Specific Features**
- Push notifications for significant changes
- Offline data caching
- Biometric authentication support
- Background data synchronization

---

## 🔄 **Real-Time Features**

### **WebSocket Integration**
```typescript
// Real-time treasury updates
const ws = new WebSocket('/ws/treasury');

ws.on('treasury_update', (data) => {
  updateDashboard(data);
});

ws.on('ai_analysis_complete', (analysis) => {
  displayAnalysis(analysis);
});
```

### **Live Data Sources**
- **Bitcoin Price**: CoinGecko + Coinbase APIs
- **Treasury Holdings**: Real-time blockchain monitoring
- **Market Data**: Multiple exchange feeds
- **Cross-Platform**: Live ecosystem activity

---

## 🧪 **Testing**

### **Testing Strategy**
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# AI integration tests
npm run test:ai
```

### **Test Coverage**
- Component testing with React Testing Library
- API endpoint testing with Jest
- AI integration testing with mock responses
- Database integration testing

---

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Sync to production repo
./ops/deploy/sync-to-production.sh treasury

# Monitor deployment
./ops/deploy/sync-to-production.sh --status

# Verify deployment
curl -s https://blgvbtc.com/api/health
```

### **Environment Configuration**
See [Environment Secrets](../ENVIRONMENT_SECRETS.md) for complete production configuration.

### **Health Checks**
- **Endpoint**: `/api/health`
- **Database**: Connection and query testing
- **AI Service**: Claude API availability
- **External APIs**: Price feed connectivity

---

## 📈 **Performance Monitoring**

### **Key Metrics**
- **Response Time**: API endpoint performance
- **Database Queries**: Query optimization and indexing
- **AI Requests**: Claude API usage and response times
- **WebSocket Connections**: Real-time connection health

### **Monitoring Tools**
- **Digital Ocean Monitoring**: Built-in app metrics
- **Database Metrics**: PostgreSQL performance monitoring
- **Application Logs**: Structured logging with correlation IDs
- **Error Tracking**: Exception monitoring and alerting

---

## 🛠️ **Development Guidelines**

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Component Structure**: Consistent component patterns

### **Component Guidelines**
```typescript
// Component template
interface ComponentProps {
  // Define props with proper types
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### **API Development**
```typescript
// API route template
app.get('/api/endpoint', async (req, res) => {
  try {
    // Validation
    // Business logic
    // Response
    res.json({ success: true, data });
  } catch (error) {
    // Error handling
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **AI Integration Failed**
```bash
# Check Claude API key
echo $ANTHROPIC_API_KEY

# Test API connectivity
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages

# Check error logs
tail -f logs/ai-integration.log
```

#### **Database Connection Issues**
```bash
# Test database connection
psql "$DATABASE_URL"

# Check connection pool
SELECT count(*) FROM pg_stat_activity;

# Verify schema access
\dn treasury
```

#### **Real-Time Updates Not Working**
```bash
# Check WebSocket connection
wscat -c ws://localhost:3001/ws

# Verify WebSocket server
netstat -an | grep 3001

# Check client-side connection
# Browser DevTools → Network → WS
```

---

## 🔧 **Configuration**

### **Feature Flags**
```env
ENABLE_AI_ANALYSIS=true
ENABLE_REAL_TIME_UPDATES=true
ENABLE_CROSS_PLATFORM_SYNC=true
ENABLE_ADVANCED_ANALYTICS=true
DEBUG_MODE=false
```

### **Performance Tuning**
```env
# Database connection pool
DB_POOL_SIZE=20
DB_POOL_TIMEOUT=30000

# API rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# WebSocket settings
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000
```

---

## 📚 **Resources**

### **Documentation**
- [API Documentation](../api/treasury.md)
- [Database Schema](../database/treasury-schema.md)
- [Deployment Guide](../deployment/DEPLOYMENT.md)
- [Environment Secrets](../ENVIRONMENT_SECRETS.md)

### **External Resources**
- [Anthropic Claude API](https://docs.anthropic.com/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎯 **Roadmap**

### **Current Features** ✅
- Real-time treasury tracking
- AI-powered analysis
- Cross-platform insights
- Professional analytics
- Mobile integration

### **Planned Features** 🚀
- **Q1 2025**
  - Enhanced AI recommendations
  - Custom dashboard layouts
  - Advanced risk modeling
  - Export capabilities

- **Q2 2025**
  - Multi-signature treasury support
  - Automated reporting
  - Compliance monitoring
  - Third-party integrations

---

**Maintainer**: Treasury Team  
**Last Updated**: January 2025  
**Version**: 2.0.0 