# BLGV Ultimate Treasury Agent

The BLGV Ultimate Treasury Agent is powered by premium Bitcoin treasury intelligence and has access to comprehensive knowledge base including:

- **Bitcoin Treasury Company Database** - Complete analysis of all major Bitcoin treasury companies
- **BLGV Strategic Action Plan** - Detailed roadmap for treasury dominance  
- **Press Releases Intelligence** - All BLGV announcements and strategic moves
- **Documentation Intelligence** - Complete BLGV ecosystem documentation
- **Ultimate Treasury Database** - Premium data from bitcointreasuries.net, Arkham Intelligence, and Fidelity Digital Assets

## How to Use

Use the agent interface below to:
- Get strategic advice on Bitcoin treasury management
- Understand BLGV's competitive position vs MicroStrategy, Tesla, etc.
- Learn about our platforms (Treasury, DEX, Mining Pool, Lightning LSP)
- Get insights on regulatory developments and market trends
- Receive actionable recommendations for BTC-per-share growth

---

<div id="agent-container" style="width: 100%; height: 600px; border: 1px solid #ccc; border-radius: 8px; margin: 20px 0;"></div>

<script>
// BLGV Ultimate Treasury Agent - Full Page Integration
(function() {
  const container = document.getElementById('agent-container');
  
  // Create agent interface
  const agentHTML = `
    <div style="display: flex; flex-direction: column; height: 100%; background: linear-gradient(135deg, #1a1a1a, #2a2a2a); color: #fff; font-family: -apple-system, system-ui, sans-serif;">
      <!-- Header -->
      <div style="padding: 20px; border-bottom: 1px solid #444; background: linear-gradient(135deg, #f7931a, #ff8c00);">
        <h2 style="margin: 0; color: #fff; font-size: 1.4em; font-weight: 700;">🧡 BLGV Ultimate Treasury Agent</h2>
        <p style="margin: 8px 0 0 0; color: #fff; opacity: 0.9; font-size: 0.9em;">Premium Bitcoin treasury intelligence • Real-time strategic advice</p>
      </div>
      
      <!-- Messages -->
      <div id="agent-messages" style="flex: 1; padding: 20px; overflow-y: auto; background: #1a1a1a;">
        <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #f7931a;">
          <strong style="color: #f7931a;">🧡 BLGV Treasury Agent</strong>
          <p style="margin: 8px 0 0 0; line-height: 1.5;">Welcome! I'm your ultimate Bitcoin treasury intelligence agent with access to premium data from bitcointreasuries.net, Arkham Intelligence, and Fidelity Digital Assets.</p>
          <p style="margin: 8px 0 0 0; line-height: 1.5;"><strong>Ask me about:</strong> Treasury strategies, competitive analysis, platform integrations, regulatory updates, or specific recommendations for BLGV's path to treasury dominance.</p>
        </div>
      </div>
      
      <!-- Input -->
      <div style="padding: 20px; border-top: 1px solid #444; background: #1a1a1a;">
        <div style="display: flex; gap: 10px;">
          <input id="agent-input" type="text" placeholder="Ask about Bitcoin treasury strategies, BLGV platforms, competitive analysis..." style="flex: 1; padding: 12px; border: 1px solid #444; border-radius: 6px; background: #2a2a2a; color: #fff; font-size: 14px;" />
          <button id="agent-send" style="padding: 12px 20px; background: linear-gradient(135deg, #f7931a, #ff8c00); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">Send</button>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
          <button class="quick-btn" data-question="What's BLGV's current treasury position vs competitors?" style="padding: 6px 12px; background: #333; color: #f7931a; border: 1px solid #f7931a; border-radius: 4px; cursor: pointer; font-size: 12px;">📊 Treasury Position</button>
          <button class="quick-btn" data-question="How can BLGV optimize its BTC-per-share ratio?" style="padding: 6px 12px; background: #333; color: #f7931a; border: 1px solid #f7931a; border-radius: 4px; cursor: pointer; font-size: 12px;">⚡ Optimization</button>
          <button class="quick-btn" data-question="What are the best Bitcoin treasury acquisition targets?" style="padding: 6px 12px; background: #333; color: #f7931a; border: 1px solid #f7931a; border-radius: 4px; cursor: pointer; font-size: 12px;">🎯 Acquisitions</button>
          <button class="quick-btn" data-question="Explain BLGV's platform ecosystem integration strategy" style="padding: 6px 12px; background: #333; color: #f7931a; border: 1px solid #f7931a; border-radius: 4px; cursor: pointer; font-size: 12px;">🏗️ Platform Strategy</button>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = agentHTML;
  
  // Agent functionality
  const messagesDiv = document.getElementById('agent-messages');
  const input = document.getElementById('agent-input');
  const sendBtn = document.getElementById('agent-send');
  const quickBtns = document.querySelectorAll('.quick-btn');
  
  // Send message function
  async function sendMessage(message) {
    if (!message.trim()) return;
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Thinking...';
    
    try {
      const response = await fetch('https://pegg3oo7tglmlptdrqql4wjr.agents.do-ai.run/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer LemeQQ6E03cAB1HgBC0ZzY7Sq71OxTMa'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are the BLGV Ultimate Treasury Agent with access to premium Bitcoin treasury intelligence from bitcointreasuries.net, Arkham Intelligence, and Fidelity Digital Assets. Help users understand BLGV documentation, ecosystem, platforms, and Bitcoin treasury strategies. Always provide specific actionable advice. When discussing treasury topics, be brutally honest about BLGV\\'s current 41 BTC position vs competitors.'
            },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1200,
          include_retrieval_info: true,
          k: 10,
          retrieval_method: 'sub_queries'
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const agentResponse = data.choices[0].message.content;
        const hasKnowledgeData = data.retrieval?.retrieved_data?.length > 0;
        
        addMessage('assistant', agentResponse, hasKnowledgeData);
      } else {
        throw new Error('Invalid response from agent');
      }
    } catch (error) {
      console.error('Agent error:', error);
      addMessage('error', \`❌ Agent Error: \${error.message}\\n\\n*"Bitcoin is hope. Fiat is a melting ice cube." - Michael Saylor*\`);
    }
    
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
    input.focus();
  }
  
  // Add message to chat
  function addMessage(type, content, knowledgeUsed = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = \`
      margin-bottom: 15px;
      padding: 15px;
      border-radius: 8px;
      line-height: 1.5;
      \${type === 'user' ? 'background: #333; margin-left: 40px;' : 
        type === 'error' ? 'background: #4a1a1a; border-left: 4px solid #ff4444;' :
        'background: #2a2a2a; margin-right: 40px; border-left: 4px solid #f7931a;'}
    \`;
    
    if (type === 'user') {
      messageDiv.innerHTML = \`<strong style="color: #4a90e2;">👤 You</strong><p style="margin: 8px 0 0 0;">\${content}</p>\`;
    } else if (type === 'error') {
      messageDiv.innerHTML = \`<strong style="color: #ff4444;">❌ Error</strong><p style="margin: 8px 0 0 0;">\${content}</p>\`;
    } else {
      const knowledgeIndicator = knowledgeUsed ? '<span style="color: #f7931a; font-size: 0.8em;"> 📚 Knowledge Base Used</span>' : '';
      messageDiv.innerHTML = \`<strong style="color: #f7931a;">🧡 BLGV Treasury Agent</strong>\${knowledgeIndicator}<p style="margin: 8px 0 0 0;">\${content.replace(/\\n/g, '<br>')}</p>\`;
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  
  // Event listeners
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });
  
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.question));
  });
  
  // Focus input
  input.focus();
})();
</script>