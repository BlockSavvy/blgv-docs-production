# ⚡ Installation Guide

Quick installation guide for the BLGV Bitcoin-native ecosystem.

## 🎯 **Choose Your Installation**

### 🏃‍♂️ **Quick Start (Recommended)**
```bash
# Clone repository
git clone https://github.com/BlockSavvy/Unified-Treasury-System.git
cd Unified-Treasury-System

# Start regtest environment
cd regtest-ecosystem
./start-regtest.sh

# Access platforms
# Treasury: http://localhost:3001
# DEX: http://localhost:3002  
# Pool: http://localhost:3003
# API: http://localhost:3004
```

### 🐳 **Docker Installation**
```bash
# Install Docker & Docker Compose
# macOS
brew install docker docker-compose

# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Start ecosystem
docker-compose up -d
```

### 📦 **Manual Installation**

#### Prerequisites
```bash
# Node.js 20+
nvm install 20
nvm use 20

# Python 3.11+
python3 --version

# PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu
```

#### Platform Installation
```bash
# Treasury Platform
cd platforms/treasury
npm install
npm run build
npm start

# DEX Platform  
cd platforms/dex
npm install
npm run build
npm start

# Mining Pool
cd platforms/pool
pip install -r requirements.txt
python app.py

# Mobile App
cd platforms/blgv-wallet-app
npm install
npx expo start
```

## 🔧 **Configuration**

### Environment Variables
```bash
# Copy environment templates
cp .env.example .env
cp platforms/treasury/.env.example platforms/treasury/.env
cp platforms/dex/.env.example platforms/dex/.env

# Edit with your values
DATABASE_URL=postgresql://user:pass@localhost:5432/blgv
BITCOIN_NETWORK=regtest
BTCPAY_SERVER_URL=http://localhost:14142
```

### Database Setup
```sql
-- Create database
CREATE DATABASE blgv_ecosystem;

-- Create schemas
CREATE SCHEMA treasury;
CREATE SCHEMA dex;
CREATE SCHEMA pool;
CREATE SCHEMA shared;

-- Run migrations
npm run migrate
```

## ✅ **Verification**

### Health Checks
```bash
# Check all services
curl http://localhost:3001/health  # Treasury
curl http://localhost:3002/health  # DEX
curl http://localhost:3003/health  # Pool
curl http://localhost:3004/health  # API

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Connectivity
```bash
# Test database connection
npm run db:test

# Test Bitcoin node
npm run btc:test

# Test Lightning node
npm run ln:test
```

## 🚨 **Troubleshooting**

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :3001  # Treasury
lsof -i :3002  # DEX
lsof -i :3003  # Pool

# Kill processes
kill -9 <PID>
```

#### Docker Issues
```bash
# Reset Docker
docker-compose down -v
docker system prune -f
docker-compose up -d
```

#### Database Connection
```bash
# Check PostgreSQL status
brew services list | grep postgresql  # macOS
systemctl status postgresql           # Linux

# Reset database
DROP DATABASE blgv_ecosystem;
CREATE DATABASE blgv_ecosystem;
```

## 📱 **Mobile Setup**

### iOS Development
```bash
# Install Xcode
# Install iOS Simulator

cd platforms/blgv-wallet-app
npx expo run:ios
```

### Android Development
```bash
# Install Android Studio
# Setup Android emulator

cd platforms/blgv-wallet-app  
npx expo run:android
```

### Physical Device Testing
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I | awk '{print $1}'  # Linux

# Update mobile environment
EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:3004
```

## 🔐 **Security Setup**

### SSL Certificates (Production)
```bash
# Generate certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Update configuration
HTTPS_ENABLED=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### API Keys
```bash
# Generate secure API keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set in environment
BLGV_API_KEY=your-generated-key
BTCPAY_API_KEY=your-btcpay-key
```

## 🚀 **Next Steps**

1. **[Development Setup](guides/development-setup)** - Full dev environment
2. **[Environment Secrets](ENVIRONMENT_SECRETS)** - Configure all secrets  
3. **[Quick Start](quick-start)** - Architecture overview
4. **[Platform Guides](../platforms)** - Platform-specific documentation

## 📞 **Support**

- **Documentation**: [docs.blgvbtc.com](https://docs.blgvbtc.com)
- **GitHub Issues**: [GitHub Issues](https://github.com/BlockSavvy/Unified-Treasury-System/issues)
- **Discord**: Join BLGV developer community
- **Email**: support@blgvbtc.com 