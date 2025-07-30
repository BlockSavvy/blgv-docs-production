# MCP Server Setup for Cursor AI Context

Model Context Protocol (MCP) servers give Cursor AI **real-time access** to your live BLGV production systems for intelligent development assistance.

## 🎯 **What MCP Servers Provide Cursor**

### Live System Context
- **PostgreSQL MCP**: Query your live Digital Ocean database schemas
- **GitHub MCP**: Access repo information, PRs, issues, and deployment status  
- **Bitcoin Core MCP**: Get real blockchain data from production systems
- **Browser Tools MCP**: Interact with live websites and check functionality
- **Firecrawl MCP**: Scrape and analyze live web content

### Development Benefits
```typescript
// Cursor can now help with queries like:
// "What's the current BTC price in our treasury database?"
// "Check if the DEX platform is responding properly"
// "What's the latest GitHub issue about the mobile app?"
// "Show me the current mining pool hash rate"
```

## ⚡ **Quick Setup**

### 1. Copy MCP Configuration
```bash
# Copy the MCP config to your Cursor settings
cp cursor-mcp-config.json ~/.cursor/mcp_servers.json
```

### 2. Install Dependencies
```bash
# Install the Bitcoin MCP server
npm install -g bitcoin-mcp-server

# Install other MCP tools
npm install -g @modelcontextprotocol/server-postgres
```

### 3. Configure API Keys
```bash
# Add to your environment
export GITHUB_TOKEN="your_github_token"
export FIRECRAWL_API_KEY="your_firecrawl_key"
export POSTGRES_CONNECTION_STRING="your_production_db_url"
```

### 4. Restart Cursor
Close and reopen Cursor to load the MCP servers.

## 🔧 **Available MCP Commands in Cursor**

Once configured, Cursor can execute these commands:

### Database Queries
- `@mcp-postgres` - Query production database
- Get live treasury data, user counts, transaction volumes

### GitHub Integration  
- `@mcp-github` - Access repo information
- Check deployment status, recent commits, open issues

### Bitcoin Network
- `@mcp-bitcoin` - Get blockchain information
- Current block height, mempool status, network stats

### Browser Automation
- `@mcp-browser` - Interact with live sites
- Check if platforms are responding, capture screenshots

### Web Scraping
- `@mcp-firecrawl` - Analyze web content
- Monitor competitor sites, extract data

---

**Ready to deploy the docs?** Let's get this live on Digital Ocean! 🚀 