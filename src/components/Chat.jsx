import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Header from './Header';
import Footer from './Footer';
import SessionManager from '../utils/sessionManager';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const initializeSession = async () => {
      // Clear any existing session on app load to always get greeting
      SessionManager.clearSession();
      
      // Always fetch intro to get greeting messages

      // No valid session found, create new one
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const apiKey = import.meta.env.VITE_API_KEY;
      
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }
      
      try {
        const res = await fetch(`${apiUrl}/v3/start`, {
          method: 'POST',
          headers,
          body: JSON.stringify({})
        });
        const data = await res.json();
        
        if (data.session_id) {
          // V3 doesn't use session tokens, just session_id
          setSessionId(data.session_id);
          // Store session for compatibility
          SessionManager.setSession(data.session_id, null);
        }
        
        if (data.message) {
          // V3 returns single message, not array
          setMessages([{
            text: data.message,
            sender: data.message_type || 'agent'
          }]);
        }
      } catch (err) {
        console.error('Session initialization failed:', err);
        setMessages([
          {
            text: 'Willkommen! Leider konnte die Begrüßung nicht geladen werden.',
            sender: 'error',
          },
        ]);
      }
    };

    initializeSession();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `${apiUrl}/v3/message`;
      const body = JSON.stringify({ 
        session_id: sessionId, 
        message: input 
      });

      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      // Handle session not found (V3 returns 404 for invalid sessions)
      if (response.status === 404) {
        console.log('Session not found, starting new conversation');
        SessionManager.clearSession();
        setSessionId(null);
        setMessages([{
          text: 'Deine Sitzung ist abgelaufen. Bitte starte eine neue Unterhaltung.',
          sender: 'system'
        }]);
        setLoading(false);
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      const data = await response.json();

      // Refresh session timestamp on successful request
      SessionManager.refreshSession();

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      // V3 returns single message, not array
      if (data.message) {
        const text = data.message;
        const delayMs = Math.max(text.length * 10, 1000); // Simulate typing delay

        setTimeout(() => {
          setLoading(false);
          setMessages((prev) => [...prev, { 
            text: text, 
            sender: data.message_type || 'agent',
            message_type: data.message_type 
          }]);
        }, delayMs);
      }

      // V3 doesn't have a "done" flag - conversations are managed by the agent
    } catch (err) {
      console.error('Error fetching response:', err);
      // Clear invalid session on network/server errors
      SessionManager.clearSession();
      setSessionId(null);
      setMessages((prev) => [
        ...prev,
        { text: 'Serverfehler. Bitte später erneut versuchen.', sender: 'error' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
        <div 
          style={{
            flex: '1 1 0%',
            overflowY: 'auto',
            padding: '80px 16px 120px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px'
          }}
        >
          <div ref={bottomRef} />
          {loading && <MessageBubble text="" sender="typing" />}
          {[...messages].reverse().map((msg, i) => (
            <MessageBubble key={i} text={msg.text} sender={msg.sender} />
          ))}
        </div>
        <Footer
          input={input}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
          inputRef={inputRef}
          autoGrow={true}
        />
      </div>
    </div>
  );
}

export default Chat;