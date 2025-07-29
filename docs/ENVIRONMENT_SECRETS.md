# 🔐 BLGV Ecosystem Environment Secrets & Configuration

**Security Notice**: This document contains sensitive configuration templates. Never commit actual secrets to version control.

## 📋 Overview

Complete environment configuration for all BLGV platforms across development, regtest, and production environments.

## 🏗️ Environment Structure

```
├── Production (Digital Ocean)
│   ├── Treasury Platform
│   ├── DEX Platform  
│   ├── Pool Platform
│   ├── Unified API Server
│   └── Mobile App
├── Regtest (Local Docker)
│   ├── All Platforms (Local)
│   └── Mobile App (Device Testing)
└── Development (Local)
    └── Individual Platform Development
```

---

## 🌐 **PRODUCTION ENVIRONMENTS**

### **Digital Ocean Unified API Server**
**App Name**: `blgv-unified-ecosystem-api`
**URL**: `https://blgv-unified-api-[hash].ondigitalocean.app`

```env
# === CORE CONFIGURATION ===
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=prefer
NODE_ENV=production
PORT=8080

# === JWT & AUTHENTICATION ===
JWT_SECRET=blgv-unified-ecosystem-jwt-secret-production-2025
SESSION_SECRET=blgv-unified-ecosystem-session-secret-production-2025

# === PLATFORM API KEYS ===
POOL_API_KEY=blgv-pool-unified-access-2025-YOUR_SESSION_SECRET
POOL_SESSION_SECRET=YOUR_SESSION_SECRET
DEX_HMAC_SECRET=treasury-dex-integration-bf7c9a84-3f2e-4d5a-8b91-e7f6c2a4d8e9-secure-hmac-auth-2025
TREASURY_API_KEY=treasury-api-key-for-unified-access-2025

# === BTCPAY SERVER ===
BTCPAY_API_KEY=YOUR_BTCPAY_API_KEY
BTCPAY_SERVER_URL=https://btc.gdyup.xyz
BTCPAY_STORE_ID=GcR3vzdWr67xPw7yFSuS7XzmKj3y5d9kUmGq9RHjmHF7

# === EXTERNAL API KEYS ===
TWELVE_DATA_API_KEY=77b6050a40304a36a91e9897d254b139
ALPHA_VANTAGE_API_KEY=ZGHDGA0EQBWWPIMY
FIXER_API_KEY=demo

# === DATABASE SCHEMA URLS ===
POOL_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=prefer&options=-csearch_path%3Dpool,shared,public
DEX_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=prefer&options=-csearch_path%3Ddex,shared,public
TREASURY_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=prefer&options=-csearch_path%3Dtreasury,shared,public
```

### **DEX Platform Production**
**App Name**: `blgv-dex`
**URL**: `https://dex.blgvbtc.com`

```env
# === DATABASE ===
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require&options=-csearch_path%3Ddex,shared,public
PGDATABASE=defaultdb
PGHOST=YOUR_DATABASE_HOST
PGPORT=25060
PGUSER=doadmin
PGPASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# === AUTHENTICATION ===
SESSION_SECRET=FPiyC3eA/xp1o0kPQ9i1MQU7RpzH/y/bcYLPjdEOGCgCjhf/iBbv99ZmxoIbKwRqANrm+ssqsxIlznMcgBl0bA==
JWT_SECRET=blgv-dex-production-jwt-secret-2025-FPiyC3eA-xp1o0kPQ9i1MQU7RpzH

# === CORS & SECURITY ===
CORS_ORIGIN=https://blgv-dex-iqhea.ondigitalocean.app,https://dex.blgvbtc.com

# === BTCPAY SERVER ===
BTCPAY_LIVE_API_KEY=3065bb790e2a64f54612d959b2e0074479f1e032
BTCPAY_LIVE_URL=https://btc.gdyup.xyz
BTCPAY_LIVE_STORE_ID=GcR3vzdWr67xPw7yFSuS7XzmKj3y5d9kUmGq9RHjmHF7

# === TREASURY INTEGRATION ===
TREASURY_WEBHOOK_URL=https://blgvbtc.com/v1/events
TREASURY_WEBHOOK_SECRET=treasury-dex-integration-bf7c9a84-3f2e-4d5a-8b91-e7f6c2a4d8e9-secure-hmac-auth-2025

# === PRODUCTION SETTINGS ===
NODE_ENV=production
ENVIRONMENT=production
PORT=${PORT}
BLGV_ECOSYSTEM_MODE=unified
BLGV_DATABASE_SCHEMA=dex
BLGV_REGTEST_MODE=false

# === FRONTEND VARIABLES ===
VITE_API_BASE_URL=https://blgv-dex-iqhea.ondigitalocean.app
VITE_ENVIRONMENT=production
VITE_WS_URL=wss://blgv-dex-iqhea.ondigitalocean.app/ws

# === PERFORMANCE & SECURITY ===
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
HELMET_ENABLED=true
HTTPS_ONLY=true
SECURE_COOKIES=true
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
UPTIME_CHECK_INTERVAL=30000

# === FEATURE FLAGS ===
TEST_MODE=false
DEBUG_MODE=false
ENABLE_SCREENSHOTS=true
ENABLE_SWAGGER_DOCS=false
ENABLE_ADMIN_PANEL=true

# === BITCOIN NETWORK ===
BITCOIN_NETWORK=mainnet
ENABLE_LIGHTNING=true
ENABLE_TAPROOT=true

# === DEPLOYMENT INFO ===
DEPLOYMENT_VERSION=1.0.0
DEPLOYMENT_TIMESTAMP=${TIMESTAMP}
BUILD_HASH=${BUILD_HASH}
```

### **Pool Platform Production**
**App Name**: `blgv-pool`
**URL**: `https://pool.blgvbtc.com`

```env
# === DATABASE ===
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=prefer&options=-csearch_path%3Dtreasury,shared,public
POOL_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require&options=-csearch_path%3Dpool,shared,public
PGDATABASE=defaultdb
PGHOST=YOUR_DATABASE_HOST
PGPORT=25060
PGUSER=doadmin
PGPASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# === APPLICATION ===
NODE_ENV=production
FLASK_ENV=production
PORT=8000
HOST=0.0.0.0
STRATUM_PORT=3333
POOL_FEE=2.0

# === TREASURY SETTINGS ===
TREASURY_MODE=production
BLGV_TEST_MODE=false
BLGV_SHOW_FAKE_ASSETS=false

# === AUTHENTICATION ===
SESSION_SECRET=YOUR_SESSION_SECRET
FLASK_SECRET_KEY=YOUR_SESSION_SECRET

# === BTCPAY SERVER ===
BTCPAY_API_KEY=767f0cb9a9a73efc328cc388ec34623792923dd7
BTCPAY_SERVER_URL=https://btc.gdyup.xyz
BTCPAY_STORE_ID=GCXn6dFBaHhEh3mkXRpVRqgMTh9YGx4ybPEhbjetYk6u
```

---

## 📱 **MOBILE APP ENVIRONMENTS**

### **Production Mobile App**
**Platform**: iOS/Android via Expo
**Environment**: Production API endpoints

```env
# === CORE API CONFIGURATION ===
EXPO_PUBLIC_API_BASE_URL=https://blgv-unified-api-[hash].ondigitalocean.app
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_BLGV_API_KEY=blgv-mobile-app-production-2025

# === PLATFORM-SPECIFIC API ENDPOINTS ===
EXPO_PUBLIC_TREASURY_API_URL=https://blgvbtc.com
EXPO_PUBLIC_DEX_API_URL=https://dex.blgvbtc.com
EXPO_PUBLIC_POOL_API_URL=https://pool.blgvbtc.com
EXPO_PUBLIC_INTEL_API_URL=https://blgvbtc.com/api

# === WEBSOCKET CONNECTIONS ===
EXPO_PUBLIC_WS_URL=wss://blgv-unified-api-[hash].ondigitalocean.app/ws

# === PRODUCTION SETTINGS ===
EXPO_PUBLIC_TEST_MODE=false
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=warn

# === FEATURE FLAGS ===
EXPO_PUBLIC_ENABLE_BIOMETRICS=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_DEX_TRADING=true
EXPO_PUBLIC_ENABLE_POOL_MINING=true

# === BITCOIN NETWORK ===
EXPO_PUBLIC_BITCOIN_NETWORK=mainnet

# === BTCPAY SERVER ===
EXPO_PUBLIC_BTCPAY_SERVER_URL=https://btc.gdyup.xyz
EXPO_PUBLIC_BTCPAY_REGTEST_MODE=false

# === EXTERNAL SERVICE KEYS ===
EXPO_PUBLIC_COINAPI_KEY=[PRODUCTION_COINAPI_KEY]
```

### **Regtest Mobile App (Physical Device Testing)**
**Platform**: iOS/Android via Expo
**Environment**: Local Docker regtest environment

```env
# === CORE API CONFIGURATION ===
EXPO_PUBLIC_API_BASE_URL=http://10.0.0.45:3004
EXPO_PUBLIC_ENVIRONMENT=regtest
EXPO_PUBLIC_BLGV_API_KEY=blgv-mobile-app-regtest-2025

# === PLATFORM-SPECIFIC API ENDPOINTS ===
EXPO_PUBLIC_TREASURY_API_URL=http://10.0.0.45:3001
EXPO_PUBLIC_DEX_API_URL=http://10.0.0.45:3002
EXPO_PUBLIC_POOL_API_URL=http://10.0.0.45:3003
EXPO_PUBLIC_INTEL_API_URL=http://10.0.0.45:3001/api

# === WEBSOCKET CONNECTIONS ===
EXPO_PUBLIC_WS_URL=ws://10.0.0.45:3004/ws

# === TEST MODE CONFIGURATION ===
EXPO_PUBLIC_TEST_MODE=true
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug

# === FEATURE FLAGS ===
EXPO_PUBLIC_ENABLE_BIOMETRICS=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_DEX_TRADING=true
EXPO_PUBLIC_ENABLE_POOL_MINING=true

# === BITCOIN NETWORK ===
EXPO_PUBLIC_BITCOIN_NETWORK=regtest

# === BTCPAY SERVER (Local Regtest) ===
EXPO_PUBLIC_BTCPAY_SERVER_URL=http://10.0.0.45:14142
EXPO_PUBLIC_BTCPAY_REGTEST_MODE=true

# === REGTEST SPECIFIC FEATURES ===
EXPO_PUBLIC_REGTEST_FAUCET_ENABLED=true
EXPO_PUBLIC_MOCK_MINING_ENABLED=true
EXPO_PUBLIC_FAST_BLOCK_GENERATION=true

# === EXTERNAL SERVICE KEYS ===
EXPO_PUBLIC_COINAPI_KEY=regtest_mode_no_key_needed
```

---

## 🐳 **REGTEST ENVIRONMENT (Docker)**

### **Unified Regtest Configuration**
**Platform**: All platforms running in Docker containers
**Database**: Local PostgreSQL with schema separation

```env
# === DATABASE CONFIGURATION ===
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=disable
POOL_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=disable&options=-csearch_path%3Dpool,shared,public
DEX_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=disable&options=-csearch_path%3Ddex,shared,public
TREASURY_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=disable&options=-csearch_path%3Dtreasury,shared,public

# === APPLICATION SETTINGS ===
NODE_ENV=development
FLASK_ENV=development
BLGV_ECOSYSTEM_MODE=regtest
BLGV_REGTEST_MODE=true
BLGV_TEST_MODE=true
BLGV_SHOW_FAKE_ASSETS=true

# === BITCOIN REGTEST ===
BITCOIN_NETWORK=regtest
BITCOIN_RPC_HOST=bitcoind_core
BITCOIN_RPC_PORT=18443
BITCOIN_RPC_USER=bitcoin_core
BITCOIN_RPC_PASSWORD=regtest_core_password

# === LIGHTNING NETWORK ===
LND_REST_HOST=lnd
LND_REST_PORT=8080
LND_MACAROON_PATH=/shared/lnd/admin.macaroon
LND_TLS_CERT_PATH=/shared/lnd/tls.cert

# === BTCPAY SERVER ===
BTCPAY_SERVER_URL=http://btcpay:14142
BTCPAY_API_KEY=regtest_api_key
BTCPAY_STORE_ID=regtest_store_id

# === AUTHENTICATION (Weak for testing) ===
SESSION_SECRET=regtest_session_secret
JWT_SECRET=regtest_jwt_secret
FLASK_SECRET_KEY=regtest_flask_secret

# === API ENDPOINTS ===
TREASURY_API_URL=http://localhost:3001
DEX_API_URL=http://localhost:3002
POOL_API_URL=http://localhost:3003
UNIFIED_API_URL=http://localhost:3004

# === FEATURE FLAGS ===
ENABLE_WEBSOCKETS=true
ENABLE_REAL_TIME_UPDATES=true
ENABLE_MOCK_DATA=true
ENABLE_AUTO_MINING=true
ENABLE_FAST_BLOCKS=true

# === LOGGING ===
LOG_LEVEL=debug
DEBUG_MODE=true
VERBOSE_LOGGING=true
```

---

## 🔧 **DEVELOPMENT ENVIRONMENT**

### **Local Development Template**
```env
# === DATABASE ===
DATABASE_URL=postgresql://localhost:5432/blgv_development
NODE_ENV=development

# === API KEYS (Development) ===
BTCPAY_API_KEY=dev_api_key_here
TWELVE_DATA_API_KEY=dev_twelve_data_key
ALPHA_VANTAGE_API_KEY=dev_alpha_vantage_key

# === AUTHENTICATION ===
SESSION_SECRET=development_session_secret_change_in_production
JWT_SECRET=development_jwt_secret_change_in_production

# === FEATURE FLAGS ===
BLGV_TEST_MODE=true
BLGV_SHOW_FAKE_ASSETS=true
DEBUG_MODE=true
LOG_LEVEL=debug

# === BITCOIN NETWORK ===
BITCOIN_NETWORK=regtest
```

---

## 🛡️ **SECURITY CONSIDERATIONS**

### **Production Security Checklist**
- [ ] All secrets are unique and randomly generated
- [ ] Database connections use SSL (`sslmode=require`)
- [ ] CORS origins are restricted to known domains
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are enabled
- [ ] Debug mode is disabled
- [ ] Sensitive logs are disabled
- [ ] API keys have appropriate permissions
- [ ] Sessions use secure cookies

### **Secret Management**
1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive configuration
3. **Rotate keys regularly** for production systems
4. **Use different secrets** for each environment
5. **Implement secret scanning** in CI/CD pipelines

### **Database Security**
- **Schema isolation**: Each platform uses its own database schema
- **Connection pooling**: Limit concurrent connections
- **SSL encryption**: All production connections encrypted
- **Regular backups**: Automated backup strategy
- **Access logging**: Monitor database access patterns

---

## 📚 **Environment Management**

### **File Structure**
```
/platforms/[platform]/
├── .env.production          # Production secrets (NOT in git)
├── .env.regtest             # Regtest configuration
├── .env.development         # Development configuration
└── .env.example             # Template file (in git)
```

### **Loading Priority**
1. `.env.production` (production only)
2. `.env.regtest` (regtest environment)
3. `.env.development` (development)
4. `.env.local` (local overrides)
5. `.env` (fallback)

### **Digital Ocean App Configuration**
Each platform deployment requires these environment variables to be set in the Digital Ocean App Platform console. Copy the relevant section above and paste into the app's environment variables section.

---

## 🔄 **Environment Switching**

### **Mobile App Environment Switching**
```bash
# Development
cp .env.development .env

# Regtest (Local Docker)
cp .env.regtest .env

# Production
cp .env.production .env
```

### **Platform Environment Switching**
```bash
# Set environment for specific platform
export BLGV_ENVIRONMENT=production|regtest|development

# Run platform with specific environment
npm run start:production
npm run start:regtest
npm run start:development
```

---

## 📞 **Support & Maintenance**

### **Environment Issues**
1. Check environment variable loading
2. Verify database connectivity
3. Confirm API key permissions
4. Test external service connections
5. Review security settings

### **Regular Maintenance**
- **Monthly**: Rotate production secrets
- **Quarterly**: Review access permissions
- **Annually**: Security audit and penetration testing

### **Emergency Procedures**
- **Secret Compromise**: Rotate all related keys immediately
- **Database Issues**: Check connection strings and permissions
- **API Failures**: Verify external service status and keys

---

**Last Updated**: January 2025  
**Document Version**: 1.0  
**Security Classification**: CONFIDENTIAL 