# BLGV Advanced AI Agent - Production Version
# Automatically generated for Digital Ocean deployment

import os
import sys

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run the advanced agent
from blgv_advanced_financial_agent import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
