# Complete Regtest Environment Setup

Comprehensive guide for setting up the complete BLGV regtest development environment with all services.

## 🐳 **Docker Environment**

### Prerequisites
- Docker and Docker Compose installed
- 16GB+ RAM recommended
- 100GB+ free disk space

### Launch Complete Environment
```bash
# Clone repository
git clone https://github.com/BlockSavvy/Unified-Treasury-System.git
cd Unified-Treasury-System/regtest-ecosystem

# Start all services
docker-compose up -d

# Verify services
docker-compose ps
```

## ⚙️ **Service Configuration**

### Bitcoin Core (Regtest)
- **Port**: 18443 (RPC), 18444 (P2P)
- **User**: bitcoin
- **Password**: bitcoin
- **Network**: regtest

### Lightning Network (LND)
- **Port**: 10009 (gRPC), 8080 (REST)
- **Network**: regtest
- **Auto-pilot**: enabled

### BTCPay Server
- **Port**: 14142
- **Network**: regtest
- **Store**: auto-configured

## 🔧 **Platform Services**

### Treasury Platform
- **URL**: http://localhost:3001
- **Database**: PostgreSQL (treasury schema)
- **Features**: Full treasury management

### DEX Platform  
- **URL**: http://localhost:3002
- **Database**: PostgreSQL (dex schema)
- **Features**: Trading, order books

### Mining Pool
- **URL**: http://localhost:3003
- **Stratum**: localhost:3333
- **Database**: PostgreSQL (pool schema)

### Unified API
- **URL**: http://localhost:3004
- **Features**: Cross-platform API gateway

## 📱 **Mobile Development**

### Device Configuration
```bash
# Get your IP address
ip addr show | grep inet

# Update mobile app config
EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:3004
```

---

**Need help?** Check our [Mobile Regtest Integration](MOBILE_REGTEST_INTEGRATION.md) guide. 