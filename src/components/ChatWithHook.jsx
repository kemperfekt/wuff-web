import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Header from './Header';
import Footer from './Footer';
import { useChat, useChatStates } from '../hooks/useChat';

/**
 * ChatWithHook Component - Simplified chat using useChat hook
 * 
 * Clean separation of concerns:
 * - useChat hook handles all state and API logic
 * - Component focuses on presentation
 */
function ChatWithHook() {
  const {
    messages,
    chatState,
    error,
    sendMessage,
    resetChat,
    isReady,
    isLoading
  } = useChat();

  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Focus input when ready
  useEffect(() => {
    if (isReady) {
      inputRef.current?.focus();
    }
  }, [isReady]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !isReady) return;
    
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'Figtree, sans-serif',
        backgroundColor: '#F7E5C9',
        color: '#4B7893'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '36rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          margin: '0 auto',
          height: '100vh'
        }}
      >
        <Header />
        
        {/* Error Banner */}
        {error && chatState !== useChatStates.SESSION_EXPIRED && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '0.75rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
          onClick={resetChat}
          >
            Verbindungsfehler - Klicke hier um neu zu starten
          </div>
        )}

        {/* Messages Area */}
        <div 
          style={{
            overflowY: 'auto',
            padding: '1rem',
            flexGrow: 1,
            scrollBehavior: 'smooth'
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '0.5rem' }}>
              <MessageBubble
                text={msg.text}
                sender={msg.sender}
                loading={false}
              />
            </div>
          ))}
          
          {isLoading && chatState === useChatStates.SENDING && (
            <div style={{ marginBottom: '0.5rem' }}>
              <MessageBubble
                text=""
                sender="agent"
                loading={true}
              />
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div 
          style={{
            padding: '1rem',
            borderTop: '1px solid #ccc',
            backgroundColor: '#F7E5C9'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isReady ? "Schreibe eine Nachricht..." : "Einen Moment bitte..."
              }
              disabled={!isReady}
              style={{
                flexGrow: 1,
                padding: '0.75rem',
                borderRadius: '1.5rem',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#333',
                opacity: isReady ? 1 : 0.6
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !isReady}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1.5rem',
                border: 'none',
                backgroundColor: (!input.trim() || !isReady) ? '#ccc' : '#4B7893',
                color: 'white',
                cursor: (!input.trim() || !isReady) ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? '...' : 'Senden'}
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ChatWithHook;