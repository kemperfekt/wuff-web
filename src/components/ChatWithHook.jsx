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
    if (!input.trim() || !isReady) {
      console.log('Cannot send:', { input: input.trim(), isReady });
      return;
    }
    
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter pressed, calling handleSend');
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
            paddingTop: '76px', // 60px header + 16px padding
            paddingBottom: '96px', // 80px footer + 16px padding
            flexGrow: 1,
            scrollBehavior: 'smooth',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          <div>
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
        </div>

        <Footer 
          input={input}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}

export default ChatWithHook;