import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Header from './Header';
import Footer from './Footer';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);  // NEW: Store session token
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchIntro = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const apiKey = process.env.REACT_APP_API_KEY;
      
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }
      
      try {
        const res = await fetch(`${apiUrl}/flow_intro`, {
          method: 'POST',
          headers,
        });
        const data = await res.json();
        if (data.session_id) setSessionId(data.session_id);
        if (data.session_token) setSessionToken(data.session_token);  // NEW: Store token
        if (data.messages) {
          // Don't normalize sender to lowercase, keep original value
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Intro fetch failed:', err);
        setMessages([
          {
            text: 'Willkommen! Leider konnte die Begrüßung nicht geladen werden.',
            sender: 'error',
          },
        ]);
      }
    };

    fetchIntro();
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
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `${apiUrl}/flow_step`;
      const body = JSON.stringify({ 
        session_id: sessionId, 
        session_token: sessionToken,  // NEW: Include token
        message: input 
      });

      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      console.log("📨 Sende Nachricht an:", url);
      console.log("📨 Payload:", body);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });
      console.log('Fetch response:', response);
      console.log('Status:', response.status);

      // Handle session expiration
      if (response.status === 401) {
        console.log('Session expired, starting new conversation');
        setSessionId(null);
        setSessionToken(null);
        setMessages([{
          text: 'Deine Sitzung ist abgelaufen. Bitte starte eine neue Unterhaltung.',
          sender: 'system'
        }]);
        setLoading(false);
        // Restart conversation
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      const newMessages = data.messages || [];
      console.log('🔍 New messages:', newMessages);
      if (newMessages.length > 0) {
        let delay = 0;
        const readingSpeed = 100;

        newMessages.forEach((msg, index) => {
          const text = typeof msg === 'string' ? msg : (msg.text || msg.content || '');
          const delayMs = Math.max(text.length * (1000 / readingSpeed), 1000);

          setTimeout(() => {
            if (index > 0) setLoading(true);
          }, delay);

          setTimeout(() => {
            setLoading(false);
            setMessages((prev) => [...prev, { ...msg, text }]);
          }, delay + (index > 0 ? 1000 : 0));

          delay += delayMs + (index > 0 ? 1000 : 0);
        });
      }

      if (data.done) {
        setSessionId(null);
      }
    } catch (err) {
      console.error('Error fetching response:', err);
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
    <div className="flex flex-col min-h-screen bg-background text-primary font-sans overflow-hidden">
      <div className="w-full max-w-xl flex flex-col flex-grow mx-auto">
        <Header />
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-[60px] flex flex-col-reverse gap-2">
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