# BLGV Ecosystem Migration Roadmap
**Complete Migration to Unified DigitalOcean Database**

## 🚀 STATUS: Phase 1 Complete - Pool Platform Migrated Successfully

### **✅ COMPLETED PHASE 1: Pool Platform Migration**
- **Database**: Migrated from Neon to DigitalOcean unified database 
- **Real Mining**: Bitaxe BM1370 v2.7.1 actively mining (25 shares, 0.5 TH/s)
- **Production Server**: Upgraded to Gunicorn production WSGI server
- **Domain**: pool.blgvbtc.com operational 
- **GitHub**: Repository renamed to `blgv-ecosystem`

---

## 📋 **PHASE 2: DEX Platform Migration**

### **Current DEX State Analysis:**
- **Database**: Neon PostgreSQL (`ep-odd-feather-a59mn0nt.us-east-2.aws.neon.tech`)
- **Schema**: 15+ tables (tokens, liquidity_pools, swap_transactions, amm_pools, etc.)
- **Status**: Functional DEX with AMM, BTCPay integration, test mode support
- **Authentication**: Advanced wallet signature system (INSTITUTIONAL GRADE ✅)

### **DEX Migration Steps:**

#### **Step 2.1: Database Schema Analysis & Export**
```bash
# Export current DEX database
pg_dump "postgresql://username:password@host:port/database

# Analyze schema structure
psql "postgresql://username:password@host:port/database
```

#### **Step 2.2: Create DEX Schema in Unified Database**
```sql
-- Connect to DigitalOcean unified database
-- Create all DEX tables in 'dex' schema:

SET search_path TO dex, public;

-- Import schema from shared/schema.ts
-- Key tables: tokens, liquidityPools, swapTransactions, ammPools, 
-- treasuryStats, marketData, adminUsers, btcPayStores, etc.
```

#### **Step 2.3: Data Migration to Unified Database**
```bash
# Modify dump to target 'dex' schema
sed 's/public\./dex\./g' dex_database_backup.sql > dex_schema_migration.sql

# Import to unified database
psql "postgresql://username:password@host:port/database
```

#### **Step 2.4: Update DEX Environment Configuration**
```bash
# platforms/dex/.env (new)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
PGDATABASE=defaultdb
PGHOST=YOUR_DATABASE_HOST
PGPORT=25060
PGUSER=doadmin
PGPASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# Update connection in platforms/dex/server/db.ts to set search_path=dex
```

#### **Step 2.5: Create DigitalOcean App for DEX**
- **App Name**: `blgv-dex`
- **Domain**: `dex.blgvbtc.com`
- **Environment**: All current DEX environment variables + new database config
- **Build**: Node.js app with Vite build process

#### **Step 2.6: Test DEX Migration**
```bash
# Test unified database connection
curl -s "https://dex-staging.blgvbtc.com/api/health"

# Test wallet authentication
curl -s "https://dex-staging.blgvbtc.com/api/tokens"

# Test AMM functionality  
curl -s "https://dex-staging.blgvbtc.com/api/pools"
```

---

## 📋 **PHASE 3: Treasury Platform Migration**

### **Current Treasury State Analysis:**
- **Database**: Neon PostgreSQL (`ep-wandering-firefly-w4k6m77y.c-2.us-east-1.aws.neon.tech`)
- **Schema**: User auth, financial intelligence, DEX event tracking, treasury balances
- **Status**: Live deployment via Replit agent with email/password authentication
- **Authentication**: Email/password + 2FA system

### **Treasury Migration Steps:**

#### **Step 3.1: Database Schema Analysis & Export**
```bash
# Export current Treasury database
pg_dump "postgresql://username:password@host:port/database
```

#### **Step 3.2: Create Treasury Schema in Unified Database**
```sql
SET search_path TO treasury, public;

-- Key tables: sessions, users, newsArticles, timelineEvents, 
-- companyMetrics, creditFacility, dexEvents, treasuryBalances, wsEvents
```

#### **Step 3.3: Data Migration & User Account Preservation**
```bash
# Critical: Preserve all user accounts and sessions
# Treasury has live users with email/password authentication
sed 's/public\./treasury\./g' treasury_database_backup.sql > treasury_schema_migration.sql
psql "postgresql://username:password@host:port/database
```

#### **Step 3.4: Create DigitalOcean App for Treasury**
- **App Name**: `blgv-treasury`  
- **Domain**: `blgvbtc.com` (main domain)
- **Environment**: All current Treasury environment variables + new database config

---

## 📋 **PHASE 4: Authentication Unification**

### **Current Authentication Systems:**
1. **Pool**: Manual wallet address entry
2. **DEX**: Wallet signature authentication (INSTITUTIONAL GRADE ✅)
3. **Treasury**: Email/password + 2FA
4. **Mobile**: Cross-platform wallet-based sync

### **Authentication Strategy:**
**KEEP EXISTING SYSTEMS** - They're already institutional grade and work well:

- **Treasury**: Keep email/password for financial intelligence platform
- **DEX/Pool**: Keep wallet signature authentication  
- **Unified**: Use the existing ProfileSyncManager for cross-platform synchronization

### **Sync Layer Updates:**
```typescript
// Update ProfileSyncManager to use unified database
const UNIFIED_DATABASE_CONFIG = {
  pool: 'postgresql://...?search_path=pool',
  dex: 'postgresql://...?search_path=dex', 
  treasury: 'postgresql://...?search_path=treasury',
  shared: 'postgresql://...?search_path=shared'
};
```

---

## 📋 **PHASE 5: Cross-Platform Integration**

### **Step 5.1: Update Sync Layer**
- Modify ProfileSyncManager to use unified database
- Update cross-platform event tracking 
- Implement real-time sync across all platforms

### **Step 5.2: Test Cross-Platform Functionality** 
```bash
# Test wallet authentication flows between platforms
# Test data synchronization
# Test real-time updates
```

### **Step 5.3: Update Mobile App Configuration**
```typescript
// Update API endpoints to point to unified ecosystem
const API_ENDPOINTS = {
  pool: 'https://pool.blgvbtc.com/api',
  dex: 'https://dex.blgvbtc.com/api',
  treasury: 'https://blgvbtc.com/api',
  sync: 'https://api.blgvbtc.com/sync'
};
```

---

## 🎯 **SUCCESS CRITERIA**

### **Phase 2 Success (DEX):**
- ✅ DEX migrated to unified database
- ✅ dex.blgvbtc.com operational
- ✅ All trading functionality preserved
- ✅ Wallet authentication working
- ✅ AMM pools and liquidity intact

### **Phase 3 Success (Treasury):**
- ✅ Treasury migrated to unified database  
- ✅ blgvbtc.com operational
- ✅ All user accounts preserved
- ✅ Financial intelligence features working
- ✅ Email/password authentication intact

### **Phase 4-5 Success (Integration):**
- ✅ All platforms using unified database
- ✅ Cross-platform sync working
- ✅ Authentication systems preserved
- ✅ Real-time data synchronization
- ✅ Mobile app integration complete

---

## ⚠️ **CRITICAL CONSIDERATIONS**

### **Security Requirements:**
1. **Database Migration**: Zero user data loss
2. **Authentication**: Preserve all existing auth mechanisms (they're already institutional grade)
3. **Live Services**: Maintain 100% uptime for Treasury platform (has live users)
4. **Testing**: Comprehensive testing before switching production traffic

### **Migration Order:**
1. **DEX First**: Less critical, can have brief downtime
2. **Treasury Second**: More critical, has live users requiring careful migration
3. **Integration Last**: After both platforms are stable on unified database

---

## 📊 **UNIFIED ECOSYSTEM ARCHITECTURE (FINAL STATE)**

```
BLGV Unified Ecosystem
├── pool.blgvbtc.com     ✅ LIVE (Mining Pool - Unified DB)
├── dex.blgvbtc.com      🔄 TO MIGRATE (DEX Platform)  
├── blgvbtc.com          🔄 TO MIGRATE (Treasury Intelligence)
└── api.blgvbtc.com      🔄 FUTURE (Unified API Gateway)

Database: DigitalOcean Managed PostgreSQL
├── pool schema         ✅ LIVE (mining data)
├── dex schema          🔄 TO CREATE (trading data)
├── treasury schema     🔄 TO CREATE (intelligence data)
├── shared schema       ✅ READY (cross-platform auth)
└── regtest schema      ✅ READY (testing environment)
```

---

## 🚀 **IMMEDIATE NEXT ACTIONS**

1. **Export DEX database from current Neon instance**
2. **Create DEX schema in unified DigitalOcean database**
3. **Test DEX migration in regtest schema first**
4. **Create DigitalOcean app for DEX platform**
5. **Switch DEX traffic to unified database**

**Status**: Ready to execute Phase 2 (DEX Migration)
**Timeline**: 2-3 days per phase with proper testing
**Risk**: Low (proven migration strategy from successful Pool migration) 