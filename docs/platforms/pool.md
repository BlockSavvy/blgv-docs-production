# ⛏️ BLGV Mining Pool Platform

**Professional Bitcoin Mining Operations & Pool Management**

## 🎯 **Overview**

The BLGV Mining Pool Platform is a professional-grade Bitcoin mining pool that provides transparent operations, fair payouts, and enterprise-level mining management as part of the "Mission 1867" initiative to integrate Bitcoin mining with decentralized energy markets.

### **Key Features**
- **Transparent Operations**: Real-time statistics and mining transparency
- **Professional Stratum**: Enterprise-grade mining protocol implementation
- **Fair Payout System**: Multiple payout schemes (PPS, PPLNS, SOLO)
- **Energy Integration**: "Mission 1867" renewable energy focus
- **Cross-Platform Sync**: Integration with Treasury and DEX platforms

### **Production URL**
**Live Platform**: [https://pool.blgvbtc.com](https://pool.blgvbtc.com)

---

## 🏗️ **Architecture**

### **Technology Stack**
- **Backend**: Python 3.9 + Flask
- **Frontend**: HTML5 + JavaScript + Bootstrap
- **Database**: PostgreSQL (pool schema)
- **Mining Protocol**: Stratum v1/v2
- **Real-Time**: WebSocket mining statistics
- **Monitoring**: Prometheus + Grafana integration

### **Directory Structure**
```
platforms/pool/
├── app.py                      # Main Flask application
├── templates/                  # HTML templates
│   ├── dashboard.html         # Mining dashboard
│   ├── stats.html            # Pool statistics
│   └── miners.html           # Miner management
├── static/                    # Static assets
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript
│   └── images/               # Pool assets
├── stratum/                   # Stratum server
│   ├── server.py             # Stratum implementation
│   ├── jobs.py               # Mining job management
│   └── workers.py            # Worker management
├── utils/                     # Utility functions
│   ├── database.py           # Database operations
│   ├── mining.py             # Mining calculations
│   └── payouts.py            # Payout processing
├── config/                   # Configuration
├── tests/                    # Testing suite
└── README.md
```

### **Database Schema**
- **Schema**: `pool`
- **Main Tables**: `miners`, `workers`, `shares`, `blocks`, `payouts`
- **Real-Time**: Mining statistics and worker status

---

## 🚀 **Getting Started**

### **Development Setup**
```bash
cd platforms/pool

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env.development

# Initialize database
python init_db.py

# Start development server
python app.py

# Pool runs on: http://localhost:3003
# Stratum server: localhost:3333
```

### **Environment Variables**
```env
# Development
FLASK_ENV=development
DATABASE_URL=postgresql://localhost:5432/blgv_development
POOL_FEE=2.0
STRATUM_PORT=3333

# Production (see docs/ENVIRONMENT_SECRETS.md)
FLASK_ENV=production
POOL_DATABASE_URL=postgresql://doadmin:...
BTCPAY_API_KEY=your_btcpay_key
SESSION_SECRET=secure_production_secret
```

---

## ⛏️ **Mining Features**

### **1. Mining Pool Management**
**Component**: `PoolDashboard.html`

Professional mining interface:
- Real-time hashrate monitoring
- Worker status and performance
- Pool statistics and luck analysis
- Payout history and projections

### **2. Stratum Server**
**Implementation**: `stratum/server.py`

Enterprise-grade mining protocol:
- Stratum v1 and v2 support
- Variable difficulty adjustment
- Mining job distribution
- Share validation and recording

### **3. Payout System**
**Component**: `PayoutProcessor.py`

Fair and transparent payouts:
- PPS (Pay Per Share) - guaranteed payments
- PPLNS (Pay Per Last N Shares) - pool luck based
- SOLO mining - full block rewards
- Automatic payout processing

### **4. Mission 1867 Integration**
**Component**: `EnergyIntegration.py`

Renewable energy focus:
- Energy source tracking
- Carbon footprint monitoring
- Grid stabilization participation
- Renewable energy certificates

---

## 🔗 **API Endpoints**

### **Pool Statistics**
```python
GET  /api/stats               # Pool statistics
GET  /api/hashrate            # Real-time hashrate
GET  /api/blocks              # Recent blocks found
GET  /api/luck                # Pool luck analysis
```

### **Miner Management**
```python
POST /api/miners/register     # Register new miner
GET  /api/miners/:address     # Miner statistics
GET  /api/workers/:id         # Worker details
POST /api/payouts/request     # Request payout
```

### **Mining Operations**
```python
GET  /api/difficulty          # Current difficulty
GET  /api/jobs                # Available mining jobs
POST /api/shares              # Submit mining shares
GET  /api/earnings/:address   # Miner earnings
```

### **Energy Integration**
```python
GET  /api/energy/sources      # Energy source mix
GET  /api/carbon/footprint    # Carbon impact metrics
POST /api/energy/report       # Energy usage reporting
```

---

## 🔐 **Security & Compliance**

### **Mining Security**
- **DDoS Protection**: Rate limiting and traffic filtering
- **Share Validation**: Cryptographic share verification
- **Address Verification**: Bitcoin address validation
- **Anti-Cheat**: Share difficulty monitoring

### **Financial Security**
- **Multi-Signature Payouts**: Enhanced payout security
- **Cold Storage**: Majority of funds in cold storage
- **Audit Trail**: Complete transaction logging
- **Regulatory Compliance**: Mining regulation adherence

---

## 📱 **Mobile Integration**

### **SDK Integration**
```python
from blgv_sdk import PoolSDK

# Initialize pool SDK
pool_sdk = PoolSDK(
    api_url="https://pool.blgvbtc.com",
    api_key="your_api_key"
)

# Get miner statistics
miner_stats = await pool_sdk.get_miner_stats(bitcoin_address)

# Monitor real-time hashrate
for hashrate_update in pool_sdk.subscribe_hashrate():
    update_mobile_display(hashrate_update)
```

### **Mobile Features**
- **Mining Monitoring**: Real-time miner performance
- **Payout Notifications**: Push notifications for payouts
- **Energy Dashboard**: Mission 1867 energy tracking
- **Pool Statistics**: Comprehensive pool analytics

---

## 🔄 **Real-Time Monitoring**

### **WebSocket Integration**
```javascript
// Real-time pool statistics
const ws = new WebSocket('/ws/pool-stats');

ws.on('hashrate_update', (data) => {
  updateHashrateDisplay(data);
});

ws.on('block_found', (block) => {
  notifyBlockFound(block);
});

ws.on('payout_processed', (payout) => {
  updatePayoutHistory(payout);
});
```

### **Monitoring Metrics**
- **Pool Hashrate**: Real-time network contribution
- **Active Workers**: Connected mining equipment
- **Block Discovery**: Recent blocks found by pool
- **Payout Processing**: Automatic payout execution

---

## 🧪 **Testing**

### **Testing Strategy**
```bash
# Unit tests
python -m pytest tests/unit/

# Integration tests
python -m pytest tests/integration/

# Stratum protocol tests
python -m pytest tests/stratum/

# Load testing
python -m pytest tests/load/
```

### **Test Coverage**
- **Mining Calculations**: Share difficulty and rewards
- **Payout Processing**: Payment calculation accuracy
- **Stratum Protocol**: Mining job distribution
- **Database Operations**: Pool statistics and history

---

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Sync to production repo
./ops/deploy/sync-to-production.sh pool

# Monitor deployment
./ops/deploy/sync-to-production.sh --status

# Verify pool functionality
curl -s https://pool.blgvbtc.com/api/stats
```

### **Health Checks**
- **Endpoint**: `/health`
- **Stratum Server**: Mining protocol connectivity
- **Database**: Pool statistics and worker data
- **Bitcoin Node**: Blockchain connectivity
- **Payout System**: Payment processing status

---

## 📈 **Pool Analytics**

### **Performance Metrics**
- **Pool Efficiency**: Share acceptance rate
- **Block Discovery**: Finding frequency and luck
- **Miner Distribution**: Geographic and hardware analysis
- **Energy Efficiency**: Mission 1867 sustainability metrics

### **Financial Metrics**
- **Revenue Distribution**: Pool fees and miner payouts
- **Payout Accuracy**: Payment precision and timing
- **Cost Analysis**: Operational cost breakdown
- **Profitability**: Per-TH/s earnings analysis

---

## 🛠️ **Development Guidelines**

### **Mining Code Standards**
```python
# Mining calculation template
def calculate_share_difficulty(target_bits: int) -> float:
    """Calculate share difficulty from target bits."""
    max_target = 0x00000000FFFF0000000000000000000000000000000000000000000000000000
    target = target_bits
    return max_target / target

def validate_share(share_data: dict) -> bool:
    """Validate submitted mining share."""
    # Share validation logic
    # Difficulty verification
    # Address verification
    return True
```

### **Database Operations**
```python
# Database operation template
async def record_share(worker_id: str, difficulty: float, timestamp: datetime):
    """Record mining share in database."""
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO shares (worker_id, difficulty, timestamp) VALUES ($1, $2, $3)",
            worker_id, difficulty, timestamp
        )
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Stratum Connection Failed**
```bash
# Check stratum server status
netstat -an | grep 3333

# Test stratum connectivity
telnet pool.blgvbtc.com 3333

# Check stratum server logs
tail -f logs/stratum.log
```

#### **Share Rejection Issues**
```bash
# Check difficulty settings
curl https://pool.blgvbtc.com/api/difficulty

# Verify worker configuration
curl https://pool.blgvbtc.com/api/workers/WORKER_ID

# Check share validation logs
grep "share_rejected" logs/pool.log
```

#### **Payout Delays**
```bash
# Check payout queue
curl https://pool.blgvbtc.com/api/payouts/pending

# Verify Bitcoin node connectivity
bitcoin-cli getblockchaininfo

# Check payout processing logs
tail -f logs/payouts.log
```

---

## 🔧 **Configuration**

### **Mining Parameters**
```env
# Pool settings
POOL_FEE=2.0
MIN_PAYOUT=0.001
SHARE_DIFFICULTY=1024
VARDIFF_ENABLED=true

# Stratum settings
STRATUM_PORT=3333
MAX_CONNECTIONS=10000
JOB_REFRESH_INTERVAL=30

# Payout settings
PAYOUT_SCHEME=PPLNS
PAYOUT_FREQUENCY=daily
AUTO_PAYOUT_THRESHOLD=0.01
```

### **Performance Settings**
```env
# Database
DB_POOL_SIZE=50
DB_POOL_TIMEOUT=30000

# Redis caching
REDIS_CACHE_TTL=300
SHARE_CACHE_SIZE=100000

# Monitoring
STATS_UPDATE_INTERVAL=10000
HASHRATE_WINDOW=600
```

---

## 📚 **Resources**

### **Documentation**
- [Stratum Protocol Specification](../protocols/stratum.md)
- [Mining Pool Economics](../guides/pool-economics.md)
- [Mission 1867 Energy Integration](../energy/mission-1867.md)
- [Bitcoin Mining Best Practices](../guides/mining-best-practices.md)

### **External Resources**
- [Bitcoin Core RPC Documentation](https://bitcoincore.org/en/doc/)
- [Stratum Mining Protocol](https://braiins.com/stratum-v1/docs)
- [Pool Mining Economics](https://github.com/btccom/btcpool)

---

## 🎯 **Roadmap**

### **Current Features** ✅
- Professional Stratum v1 server
- Multiple payout schemes
- Real-time monitoring
- Cross-platform integration
- Mission 1867 energy tracking

### **Planned Features** 🚀
- **Q1 2025**
  - Stratum v2 implementation
  - Advanced difficulty algorithms
  - Enhanced energy monitoring
  - Mobile miner management

- **Q2 2025**
  - Lightning Network payouts
  - Decentralized pool architecture
  - Advanced analytics dashboard
  - Enterprise mining contracts

- **Q3 2025**
  - AI-powered optimization
  - Renewable energy trading
  - Cross-pool collaboration
  - Institutional mining services

---

**Maintainer**: Pool Team  
**Last Updated**: January 2025  
**Version**: 1.5.0 