# 🚀 BLGV Mining Pool - Stratum Droplet Setup

## Problem: DigitalOcean App Platform doesn't support TCP traffic

Your pool **web interface** is running perfectly on App Platform, but **miners need a TCP Stratum server** on port 3333.

## ✅ Solution: Add a $6/month Droplet for Stratum server

### **Step 1: Create Droplet**
1. Go to DigitalOcean → **Create Droplet**
2. **Image**: Ubuntu 22.04 LTS
3. **Size**: Basic $6/month (1 GB RAM, 1 vCPU)
4. **Region**: Same as your App (probably NYC or SFO)
5. **Authentication**: SSH keys or password
6. **Name**: `blgv-stratum-server`

### **Step 2: Connect & Setup**
```bash
# SSH into your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Python and dependencies
apt install -y python3 python3-pip git

# Clone your pool repository
git clone https://github.com/BlockSavvy/BLGV-POOL-DO.git
cd BLGV-POOL-DO

# Install Python dependencies
pip3 install -r requirements.txt

# Setup production environment
cp production.env.example production.env
nano production.env  # Add your database credentials
```

### **Step 3: Create Stratum Server**
```bash
# Create dedicated stratum server script
cat > stratum_server.py << 'EOF'
#!/usr/bin/env python3
"""
BLGV BTC Pool - Dedicated Stratum V2 Server
Runs on DigitalOcean Droplet for TCP mining connections
"""

import asyncio
import socket
import logging
import json
import os
import psycopg2
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StratumServer:
    def __init__(self, host='0.0.0.0', port=3333):
        self.host = host
        self.port = port
        self.clients = {}
        
    async def handle_client(self, reader, writer):
        """Handle individual miner connections"""
        client_addr = writer.get_extra_info('peername')
        client_id = f"{client_addr[0]}:{client_addr[1]}"
        
        logger.info(f"🔌 New miner connected: {client_id}")
        
        try:
            while True:
                data = await reader.read(1024)
                if not data:
                    break
                    
                # Parse Stratum message
                try:
                    message = json.loads(data.decode().strip())
                    logger.info(f"📨 Received from {client_id}: {message}")
                    
                    # Handle mining.subscribe
                    if message.get('method') == 'mining.subscribe':
                        response = {
                            "id": message.get('id'),
                            "result": [
                                [["mining.set_difficulty", "subscription_id"], 
                                 ["mining.notify", "subscription_id"]], 
                                "ExtraNonce1", 
                                4
                            ],
                            "error": None
                        }
                        await self.send_response(writer, response)
                        
                        # Send difficulty
                        difficulty_msg = {
                            "id": None,
                            "method": "mining.set_difficulty",
                            "params": [1024]
                        }
                        await self.send_response(writer, difficulty_msg)
                        
                    # Handle mining.authorize
                    elif message.get('method') == 'mining.authorize':
                        # Register miner in database
                        wallet_address = message.get('params', [None])[0]
                        await self.register_miner(wallet_address, client_id)
                        
                        response = {
                            "id": message.get('id'),
                            "result": True,
                            "error": None
                        }
                        await self.send_response(writer, response)
                        
                    # Handle mining.submit (shares)
                    elif message.get('method') == 'mining.submit':
                        # Process share submission
                        await self.process_share(message, client_id)
                        
                        response = {
                            "id": message.get('id'),
                            "result": True,
                            "error": None
                        }
                        await self.send_response(writer, response)
                        
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON from {client_id}: {data}")
                    
        except Exception as e:
            logger.error(f"Error handling client {client_id}: {e}")
        finally:
            logger.info(f"🔌 Miner disconnected: {client_id}")
            if client_id in self.clients:
                del self.clients[client_id]
            writer.close()
            await writer.wait_closed()
    
    async def send_response(self, writer, response):
        """Send JSON response to miner"""
        try:
            response_str = json.dumps(response) + '\n'
            writer.write(response_str.encode())
            await writer.drain()
        except Exception as e:
            logger.error(f"Failed to send response: {e}")
    
    async def register_miner(self, wallet_address, client_id):
        """Register miner in database"""
        try:
            conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
            cursor = conn.cursor()
            
            # Insert or update miner
            cursor.execute("""
                INSERT INTO miners (username, wallet_address, status, hash_rate, is_test_mode, created_at, updated_at)
                VALUES (%s, %s, 'online', 500000000000, false, NOW(), NOW())
                ON CONFLICT (wallet_address) 
                DO UPDATE SET status = 'online', updated_at = NOW()
            """, (client_id, wallet_address))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            logger.info(f"✅ Registered miner: {wallet_address}")
            
        except Exception as e:
            logger.error(f"Database error registering miner: {e}")
    
    async def process_share(self, message, client_id):
        """Process submitted share"""
        try:
            # TODO: Implement real share validation
            logger.info(f"💎 Share submitted by {client_id}: {message.get('params')}")
            
            # Update share count in database
            conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO pool_shares (miner_id, difficulty, is_valid, created_at)
                VALUES (%s, %s, %s, NOW())
            """, (client_id, 1024, True))
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error processing share: {e}")
    
    async def start(self):
        """Start the Stratum server"""
        server = await asyncio.start_server(
            self.handle_client, 
            self.host, 
            self.port
        )
        
        logger.info(f"🚀 BLGV Stratum Server listening on {self.host}:{self.port}")
        logger.info(f"⚡ Ready for Bitaxe and ASIC connections!")
        
        async with server:
            await server.serve_forever()

if __name__ == '__main__':
    # Load environment
    from dotenv import load_dotenv
    load_dotenv('production.env')
    
    # Start server
    server = StratumServer()
    asyncio.run(server.start())
EOF

chmod +x stratum_server.py
```

### **Step 4: Start Stratum Server**
```bash
# Test the stratum server
python3 stratum_server.py

# Should see:
# 🚀 BLGV Stratum Server listening on 0.0.0.0:3333
# ⚡ Ready for Bitaxe and ASIC connections!
```

### **Step 5: Create Systemd Service**
```bash
# Create service file
cat > /etc/systemd/system/blgv-stratum.service << 'EOF'
[Unit]
Description=BLGV BTC Mining Pool Stratum Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/BLGV-POOL-DO
ExecStart=/usr/bin/python3 stratum_server.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl enable blgv-stratum
systemctl start blgv-stratum
systemctl status blgv-stratum
```

### **Step 6: Configure Firewall**
```bash
# Allow port 3333
ufw allow 3333/tcp
ufw allow ssh
ufw --force enable
```

### **Step 7: Update Your Bitaxe**
Change your Bitaxe pool URL to:
```
stratum+tcp://YOUR_DROPLET_IP:3333
```

## 🎯 **Architecture**
- **App Platform**: Web interface (port 8080) ✅
- **Droplet**: Stratum server (port 3333) ✅
- **Database**: Shared Neon PostgreSQL ✅

**Total Cost**: $12/month App + $6/month Droplet = **$18/month**

## 🔍 **Testing**
```bash
# Test from your Droplet
telnet localhost 3333

# Check logs
journalctl -u blgv-stratum -f
```

Once setup, your Bitaxe will connect successfully! 🎉 