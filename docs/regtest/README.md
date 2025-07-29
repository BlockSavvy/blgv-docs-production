# BLGV Regtest Environment

The BLGV regtest environment is our comprehensive Bitcoin development and testing infrastructure.

## 🏗️ Overview

Our regtest environment includes:
- **Bitcoin Core** (regtest mode)
- **Lightning Network** (LND nodes)
- **BTCPay Server** (payment processing)
- **All BLGV Platforms** (Treasury, DEX, Pool, LSP)
- **Mobile App Testing** (device-accessible endpoints)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.8+

### Launch Regtest
```bash
# From project root
cd regtest-ecosystem/
./start-regtest.sh
```

### Access Services
- **Bitcoin Core RPC**: `http://localhost:18443`
- **BTCPay Server**: `http://localhost:14142`
- **Treasury Platform**: `http://localhost:3001`
- **DEX Platform**: `http://localhost:3002`
- **Pool Platform**: `http://localhost:3003`
- **Unified API**: `http://localhost:3004`

### Mobile Testing
For physical device testing, use your local IP:
```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Example mobile config
EXPO_PUBLIC_API_BASE_URL=http://10.0.0.45:3004
```

## 📚 Documentation

- [Complete Regtest Setup Guide](../regtest/COMPLETE_REGTEST_SETUP.md)
- [Mobile Integration](../regtest/MOBILE_REGTEST_INTEGRATION.md)
- [Environment Secrets](../ENVIRONMENT_SECRETS.md)

## 🔧 Development Workflow

1. **Start regtest environment**
2. **Generate test Bitcoin** using faucet
3. **Test platform integrations**
4. **Validate mobile app connectivity**
5. **Run integration tests**

## 🚨 Important Notes

- **No Real Bitcoin**: Regtest uses fake Bitcoin for testing
- **Reset Anytime**: `docker-compose down -v` to reset all data
- **Mobile IP**: Update mobile app config with your local IP
- **Port Conflicts**: Ensure ports 3001-3004, 18443, 14142 are available

---

**Remember**: Regtest is your safe playground for Bitcoin development! 🧪₿ 