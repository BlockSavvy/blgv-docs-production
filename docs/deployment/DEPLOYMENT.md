# 🚀 BLGV Ecosystem Deployment Guide

**Complete deployment workflow for the BLGV Bitcoin-native financial infrastructure**

## 🎯 **Deployment Overview**

### **Important Terminology**

| Term | Definition | What It Does |
|------|------------|--------------|
| **SYNC** | Update production GitHub repositories | Copies code from monorepo → individual production repos |
| **DEPLOY** | Digital Ocean auto-deployment | Automatically builds & deploys from production repos |

### **Deployment Flow**
```mermaid
graph LR
    A[Unified Monorepo] -->|SYNC| B[Production Repos]
    B -->|AUTO-DEPLOY| C[Digital Ocean Apps]
    C -->|LIVE| D[Production Websites]
    
    A1[platforms/treasury/] -->|sync| B1[blgv-treasury-production]
    A2[platforms/dex/] -->|sync| B2[blgv-dex-production]
    A3[platforms/pool/] -->|sync| B3[blgv-pool-production]
    A4[server/] -->|sync| B4[blgv-unified-api-production]
    
    B1 -->|auto-deploy| C1[blgvbtc.com]
    B2 -->|auto-deploy| C2[dex.blgvbtc.com]
    B3 -->|auto-deploy| C3[pool.blgvbtc.com]
    B4 -->|auto-deploy| C4[api.blgvbtc.com]
```

---

## 🏭 **Production Infrastructure**

### **GitHub Production Repositories**
| Platform | Repository | Auto-Deploy Target |
|----------|------------|-------------------|
| **Treasury** | `blgv-treasury-production` | https://blgvbtc.com |
| **DEX** | `blgv-dex-production` | https://dex.blgvbtc.com |
| **Pool** | `blgv-pool-production` | https://pool.blgvbtc.com |
| **API** | `blgv-unified-api-production` | https://api.blgvbtc.com |
| **Mobile** | `blgv-wallet-app` | iOS/Android App Stores |

### **Digital Ocean Apps**
| App Name | Domain | Type | Database Schema |
|----------|---------|------|----------------|
| `blgv-treasury-intelligence-platform` | blgvbtc.com | React/Node.js | `treasury` |
| `blgv-dex` | dex.blgvbtc.com | React/Node.js | `dex` |
| `blgv-pool` | pool.blgvbtc.com | Python/Flask | `pool` |
| `blgv-unified-ecosystem-api` | [auto-generated] | Node.js API | `shared` |

---

## 🛠️ **Deployment Commands**

### **Master Sync Script**
```bash
# Sync specific platform
./ops/deploy/sync-to-production.sh treasury
./ops/deploy/sync-to-production.sh dex
./ops/deploy/sync-to-production.sh pool
./ops/deploy/sync-to-production.sh api
./ops/deploy/sync-to-production.sh mobile

# Sync all platforms
./ops/deploy/sync-to-production.sh all

# Check deployment status
./ops/deploy/sync-to-production.sh --status
```

### **Individual Platform Scripts** (Legacy)
```bash
# These still work but use the master script above
./ops/deploy/treasury.sh
./ops/deploy/dex.sh
./ops/deploy/pool.sh
./ops/deploy/api.sh
./ops/deploy/mobile.sh
./ops/deploy/all.sh
```

---

## 📋 **Step-by-Step Deployment**

### **1. Pre-Deployment Checklist**
- [ ] All changes committed and pushed to monorepo
- [ ] Local testing completed
- [ ] Environment variables configured
- [ ] Database migrations ready (if applicable)
- [ ] Dependencies updated in package.json/requirements.txt

### **2. Sync to Production Repos**
```bash
# From monorepo root directory
cd /path/to/Unified-Treasury-System

# Sync individual platform (recommended for testing)
./ops/deploy/sync-to-production.sh treasury

# Or sync all platforms
./ops/deploy/sync-to-production.sh all
```

### **3. Monitor Auto-Deployment**
```bash
# Check sync status
./ops/deploy/sync-to-production.sh --status

# Monitor Digital Ocean deployments
# Visit: https://cloud.digitalocean.com/apps
```

### **4. Verify Deployment**
```bash
# Check live platforms
curl -s https://blgvbtc.com/api/health
curl -s https://dex.blgvbtc.com/api/health  
curl -s https://pool.blgvbtc.com/health
curl -s https://api.blgvbtc.com/health
```

---

## 🔧 **Environment Configuration**

### **Environment Files**
Each platform requires a `.env.production` file with secrets:

```bash
platforms/treasury/.env.production
platforms/dex/.env.production
platforms/pool/.env.production
server/.env.production
```

### **Secret Management**
See [Environment Secrets Guide](../ENVIRONMENT_SECRETS.md) for complete configuration.

**Critical Production Secrets:**
- Database connection strings
- JWT secrets and session keys
- BTCPay Server API keys
- External service API keys
- CORS origins and security settings

### **Digital Ocean Environment Variables**
Set these in the Digital Ocean App Platform console:
1. Go to your app dashboard
2. Settings → App-Level Environment Variables
3. Copy relevant section from [Environment Secrets](../ENVIRONMENT_SECRETS.md)
4. Save and redeploy

---

## 🐳 **Container vs App Platform Deployment**

### **Current Setup: Digital Ocean App Platform**
✅ **Advantages:**
- Automatic deployment from GitHub
- Built-in CI/CD pipeline
- Automatic SSL certificates
- Easy scaling and management
- Integrated database connections

### **Alternative: Docker Containers**
**Consider for future when you need:**
- Multi-region deployment
- Complex orchestration
- Custom infrastructure requirements
- Advanced networking

---

## 🔄 **Deployment Environments**

### **Production Environment**
- **Purpose**: Live customer-facing applications
- **Database**: Digital Ocean Managed PostgreSQL
- **Domains**: blgvbtc.com, dex.blgvbtc.com, pool.blgvbtc.com
- **Monitoring**: Automated health checks
- **Backups**: Automated daily backups

### **Staging Environment** (Recommended Future Addition)
```bash
# Create staging branches in production repos
# Deploy to staging.blgvbtc.com subdomains
# Test before production deployment
```

### **Regtest Environment**
- **Purpose**: Local development and testing
- **Location**: Docker containers on developer machines
- **Database**: Local PostgreSQL with test data
- **Commands**: See [Regtest Guide](../regtest/README.md)

---

## 🚨 **Emergency Procedures**

### **Rollback Deployment**
```bash
# 1. Identify last working commit in production repo
cd ../blgv-[platform]-production
git log --oneline

# 2. Revert to previous commit
git reset --hard [commit-hash]
git push --force origin main

# 3. Monitor Digital Ocean auto-deployment
```

### **Hotfix Deployment**
```bash
# 1. Create hotfix in monorepo
git checkout -b hotfix/critical-fix
# Make changes
git commit -m "hotfix: critical issue fix"
git push origin hotfix/critical-fix

# 2. Sync hotfix to production
./ops/deploy/sync-to-production.sh [platform]

# 3. Monitor deployment
./ops/deploy/sync-to-production.sh --status
```

### **Database Issues**
```bash
# Check database connectivity
psql "postgresql://doadmin:AVNS_...@blgv-ecosystem-do-user.../defaultdb"

# Run database migrations
npm run db:migrate:production

# Check database logs in Digital Ocean console
```

---

## 📊 **Monitoring & Logging**

### **Application Monitoring**
- **Health Checks**: Built into each platform at `/health` or `/api/health`
- **Digital Ocean Metrics**: CPU, memory, request volume
- **Error Tracking**: Application logs in DO console
- **Uptime Monitoring**: External monitoring recommended

### **Database Monitoring**
- **Connection Pooling**: Monitor active connections
- **Query Performance**: Slow query analysis
- **Storage Usage**: Monitor database size growth
- **Backup Status**: Verify automated backups

### **Log Access**
```bash
# View application logs in Digital Ocean console
# Or setup log forwarding to external service

# Local development logs
docker-compose logs -f [service-name]
```

---

## 🔐 **Security Considerations**

### **Deployment Security**
- **Secrets Management**: Use environment variables, never commit secrets
- **SSL/TLS**: Automatic HTTPS with Let's Encrypt
- **Database Security**: VPC networks, SSL connections
- **API Security**: Rate limiting, CORS, authentication

### **Access Control**
- **GitHub Access**: Limited to deployment team
- **Digital Ocean Access**: Role-based permissions
- **Database Access**: IP restrictions, SSL required
- **API Keys**: Regular rotation schedule

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Deployment Failed**
```bash
# Check GitHub repository sync
cd ../blgv-[platform]-production
git log --oneline -5

# Check Digital Ocean deployment logs
# Visit app dashboard → Activity tab

# Verify environment variables
# Check app settings → Environment Variables
```

#### **Environment Variable Issues**
```bash
# Verify environment file exists
ls -la platforms/[platform]/.env.production

# Check environment secrets documentation
cat docs/ENVIRONMENT_SECRETS.md

# Test environment loading locally
npm run test:env
```

#### **Database Connection Failed**
```bash
# Test database connection
psql "$DATABASE_URL"

# Check database status in Digital Ocean
# Verify connection string format
# Check IP restrictions and SSL settings
```

#### **SSL Certificate Issues**
```bash
# Check certificate status in Digital Ocean
# Verify domain DNS settings
# Check CNAME/A records pointing to Digital Ocean
```

### **Debug Commands**
```bash
# Test individual platform sync
./ops/deploy/sync-to-production.sh treasury --dry-run

# Verify platform directory structure
ls -la platforms/treasury/

# Check monorepo environment
./ops/deploy/sync-to-production.sh --status

# Test production repository access
git clone https://github.com/BlockSavvy/blgv-treasury-production.git
```

---

## 📈 **Performance Optimization**

### **Deployment Speed**
- **Incremental Builds**: Only rebuild changed files
- **Caching**: Enable Docker layer caching
- **Parallel Deployments**: Deploy multiple platforms simultaneously
- **CDN**: Use Digital Ocean CDN for static assets

### **Application Performance**
- **Bundle Size**: Monitor and optimize bundle sizes
- **Database Queries**: Optimize slow queries
- **Caching Strategy**: Implement Redis caching
- **Image Optimization**: Compress and optimize images

---

## 📞 **Support & Maintenance**

### **Regular Maintenance**
- **Weekly**: Review deployment logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Security audit and penetration testing
- **Annually**: Infrastructure review and optimization

### **Emergency Contacts**
- **Development Team**: dev@blgvbtc.com
- **DevOps Support**: ops@blgvbtc.com
- **Digital Ocean Support**: https://cloud.digitalocean.com/support

### **Documentation Updates**
Keep this document updated when:
- Adding new platforms
- Changing deployment workflow
- Updating infrastructure
- Adding new monitoring tools

---

## 🎯 **Future Improvements**

### **Short Term**
- [ ] Add staging environment
- [ ] Implement blue-green deployments
- [ ] Add deployment notifications (Slack/Discord)
- [ ] Create deployment dashboard

### **Long Term**
- [ ] Consider multi-region deployment
- [ ] Implement canary deployments
- [ ] Add comprehensive monitoring stack
- [ ] Setup automated testing pipeline

---

**Last Updated**: January 2025  
**Document Version**: 1.0  
**Maintainer**: BLGV DevOps Team 