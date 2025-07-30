import React, { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: '👋 Hi! I\'m the BLGV AI Assistant. I can help you with questions about our Bitcoin-native ecosystem, including Treasury, DEX, Mining Pool, Lightning LSP, and Mobile platforms. What would you like to know?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      // Use enhanced DigitalOcean Agent with premium Bitcoin treasury intelligence
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
              content: 'You are the BLGV Ultimate Treasury Agent with access to premium Bitcoin treasury intelligence from bitcointreasuries.net, Arkham Intelligence, and Fidelity Digital Assets. Help users understand BLGV documentation, ecosystem, platforms, and Bitcoin treasury strategies. Always provide specific actionable advice. When discussing treasury topics, be brutally honest about BLGV\'s current 41 BTC position vs competitors.'
            },
            ...messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
            { role: 'user', content: userMessage }
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
        
        // Add assistant response with knowledge indicator
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: agentResponse,
          knowledgeUsed: hasKnowledgeData
        }]);
      } else {
        throw new Error('Invalid response from enhanced agent');
      }
    } catch (error) {
      console.error('Enhanced agent error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `❌ Enhanced Agent Error: ${error.message}\n\n*"Bitcoin is hope. Fiat is a melting ice cube." - Michael Saylor*` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Compare BLGV to MicroStrategy's Bitcoin strategy",
    "What are BLGV's current Bitcoin holdings?",
    "How does the Treasury platform work?",
    "What is BLGV's Bitcoin accumulation strategy?", 
    "Tell me about BLGV's ecosystem advantages",
    "What are the best acquisition targets for BLGV?"
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`${styles.floatingButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
      >
        {isOpen ? '✕' : '🧡'}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidget}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.title}>🧡 BLGV Treasury Agent</span>
              <span className={styles.status}>
                <span className={styles.statusDot}></span>
                Online
              </span>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.quickQuestions}>
              <div className={styles.quickQuestionsTitle}>Quick Questions:</div>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className={styles.quickQuestionBtn}
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about BLGV ecosystem..."
                className={styles.input}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!inputValue.trim() || isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant; 