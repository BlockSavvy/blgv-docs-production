# 🛠️ Development Setup Guide

Complete guide to setting up your BLGV development environment.

## 🎯 **Prerequisites**

### Required Software
- **Node.js 20+** - JavaScript runtime
- **Docker & Docker Compose** - Containerization
- **Git** - Version control
- **Python 3.11+** - For pool and AI components
- **PostgreSQL Client** - Database access

### Development Tools
- **Cursor AI** - Primary IDE with MCP integration
- **VS Code** - Alternative IDE
- **Bruno/Postman** - API testing
- **DBeaver** - Database management

## 🐳 **Regtest Environment Setup**

### Start Full Ecosystem
```bash
cd regtest-ecosystem
./start-regtest.sh
```

### Individual Components
```bash
# Start specific platform
docker-compose up treasury -d
docker-compose up dex -d
docker-compose up pool -d
docker-compose up lsp -d

# Check status
docker-compose ps
```

### Environment Variables
```bash
# Development
DATABASE_URL=postgresql://postgres:password@localhost:5432/blgv_dev
NODE_ENV=development
DEBUG=true

# Regtest
DATABASE_URL=postgresql://postgres:password@localhost:5433/blgv_regtest
BITCOIN_NETWORK=regtest
BTCPAY_SERVER_URL=http://localhost:14142
```

## 📱 **Mobile Development**

### Expo Setup
```bash
cd platforms/blgv-wallet-app
npm install
npx expo install

# Start for iOS
npx expo run:ios

# Start for Android  
npx expo run:android
```

### Device Configuration
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
ip route get 1 | awk '{print $7}' # Linux

# Update mobile .env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:3004
```

## 🌐 **Web Development**

### Treasury Platform
```bash
cd platforms/treasury
npm install
npm run dev  # http://localhost:3001
```

### DEX Platform
```bash
cd platforms/dex
npm install
npm run dev  # http://localhost:3002
```

### Mining Pool
```bash
cd platforms/pool
pip install -r requirements.txt
python app.py  # http://localhost:3003
```

## 🔌 **Unified API Server**

```bash
cd server
npm install
npm run build
npm run dev  # http://localhost:3004
```

## 🧪 **Testing Setup**

### Unit Tests
```bash
# JavaScript/TypeScript
npm test

# Python
pytest
```

### Integration Tests
```bash
# Full ecosystem test
./regtest-ecosystem/test-ecosystem.sh
```

## 🔧 **IDE Configuration**

### Cursor AI Settings
```json
{
  "typescript.preferences.packageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Recommended Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Bitcoin Development Pack
- Docker
- GitLens

## 🐛 **Common Issues**

### Docker Issues
```bash
# Reset everything
docker-compose down -v
docker system prune -f
./start-regtest.sh
```

### Node.js Issues
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Reset database
docker-compose down postgres
docker volume prune
docker-compose up postgres -d
```

## 📚 **Next Steps**

1. **[Testing Strategy](testing-strategy)** - Learn testing approaches
2. **[Best Practices](best-practices)** - Follow development standards
3. **[Deployment Guide](deployment-guide)** - Deploy to production
4. **[SDK Documentation](../sdk/README)** - Use the unified SDK

## 🆘 **Getting Help**

- **Documentation**: Check platform-specific docs in `/platforms`
- **Issues**: Create GitHub issues for bugs
- **Discord**: Join the BLGV developer channel
- **Email**: dev@blgvbtc.com 