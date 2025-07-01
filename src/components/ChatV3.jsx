import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Header from './Header';
import Footer from './Footer';
import apiClient from '../services/apiClient';

/**
 * ChatV3 Component - Enhanced chat with V3 API integration
 * 
 * Features:
 * - Uses centralized API client
 * - Better error handling
 * - Loading states
 * - Session management
 * - Metadata display (optional)
 */
function ChatV3() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false); // Debug mode
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Initialize conversation on mount
  useEffect(() => {
    initializeConversation();
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /**
   * Initialize a new conversation
   */
  const initializeConversation = async () => {
    setLoading(true);
    setError(null);

    const result = await apiClient.startConversation();

    if (result.success) {
      setSessionId(result.data.sessionId);
      setMessages([{
        text: result.data.message,
        sender: result.data.messageType || 'agent',
        metadata: result.data.metadata
      }]);
    } else {
      setError(result.error);
      setMessages([{
        text: result.fallbackMessage,
        sender: 'error'
      }]);
    }

    setLoading(false);
  };

  /**
   * Send user message
   */
  const sendMessage = async () => {
    if (!input.trim() || loading || !sessionId) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, {
      text: userMessage,
      sender: 'user'
    }]);

    setLoading(true);

    const result = await apiClient.sendMessage(sessionId, userMessage);

    if (result.success) {
      setMessages(prev => [...prev, {
        text: result.data.message,
        sender: result.data.messageType || 'agent',
        metadata: result.data.metadata
      }]);
    } else {
      if (result.requiresReload) {
        setError('SESSION_EXPIRED');
        setMessages(prev => [...prev, {
          text: 'Deine Sitzung ist abgelaufen. Die Seite wird neu geladen...',
          sender: 'system'
        }]);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(result.error);
        setMessages(prev => [...prev, {
          text: result.fallbackMessage || 'Ein Fehler ist aufgetreten.',
          sender: 'error'
        }]);
      }
    }

    setLoading(false);
  };

  /**
   * Handle Enter key press
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Render message with optional metadata
   */
  const renderMessage = (msg, idx) => {
    return (
      <div key={idx} style={{ marginBottom: '0.5rem' }}>
        <MessageBubble
          text={msg.text}
          sender={msg.sender}
          loading={loading && idx === messages.length - 1}
        />
        {showMetadata && msg.metadata && (
          <div style={{
            fontSize: '0.75rem',
            color: '#7a7a7a',
            marginTop: '0.25rem',
            marginLeft: msg.sender === 'user' ? 'auto' : '0',
            marginRight: msg.sender === 'user' ? '0' : 'auto',
            maxWidth: '70%',
            fontFamily: 'monospace'
          }}>
            {msg.metadata.action_type && (
              <div>Action: {msg.metadata.action_type}</div>
            )}
            {msg.metadata.phase && (
              <div>Phase: {msg.metadata.phase}</div>
            )}
            {msg.metadata.confidence && (
              <div>Confidence: {(msg.metadata.confidence * 100).toFixed(0)}%</div>
            )}
          </div>
        )}
      </div>
    );
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
        {error && error !== 'SESSION_EXPIRED' && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '0.75rem',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            Verbindungsfehler - Bitte versuche es später erneut
          </div>
        )}

        {/* Chat Messages */}
        <div 
          style={{
            overflowY: 'auto',
            padding: '1rem',
            flexGrow: 1,
            scrollBehavior: 'smooth'
          }}
        >
          {messages.map((msg, idx) => renderMessage(msg, idx))}
          
          {loading && (
            <MessageBubble
              text=""
              sender="agent"
              loading={true}
            />
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
              placeholder="Schreibe eine Nachricht..."
              disabled={loading || !sessionId}
              style={{
                flexGrow: 1,
                padding: '0.75rem',
                borderRadius: '1.5rem',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#333'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || !sessionId}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1.5rem',
                border: 'none',
                backgroundColor: loading || !input.trim() ? '#ccc' : '#4B7893',
                color: 'white',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? '...' : 'Senden'}
            </button>
          </div>
          
          {/* Debug Mode Toggle */}
          {import.meta.env.DEV && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#7a7a7a'
            }}>
              <label>
                <input
                  type="checkbox"
                  checked={showMetadata}
                  onChange={(e) => setShowMetadata(e.target.checked)}
                /> Show metadata
              </label>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ChatV3;