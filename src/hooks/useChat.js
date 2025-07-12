/**
 * useChat Hook - Manages chat state and API interactions
 * 
 * Features:
 * - Centralized chat state management
 * - API error handling
 * - Session management
 * - Message history
 * - Loading states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';

export const useChatStates = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  SENDING: 'sending',
  ERROR: 'error',
  SESSION_EXPIRED: 'session_expired'
};

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [chatState, setChatState] = useState(useChatStates.INITIALIZING);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});
  
  // Track initialization to prevent duplicate calls in StrictMode
  const initializingRef = useRef(false);
  const initializedRef = useRef(false);

  /**
   * Initialize chat session
   */
  const initialize = useCallback(async () => {
    // Prevent duplicate initialization
    if (initializingRef.current || initializedRef.current) {
      console.log('Initialization already in progress, skipping...');
      return;
    }
    
    console.log('Starting session initialization...');
    initializingRef.current = true;
    setChatState(useChatStates.INITIALIZING);
    setError(null);

    try {
      console.log('Calling apiClient.startConversation...');
      const result = await apiClient.startConversation();

      console.log('API result:', result);
      
      if (result.success) {
        console.log('Session started successfully:', result.data);
        setSessionId(result.data.sessionId);
        setMessages([{
          id: Date.now(),
          text: result.data.message,
          sender: result.data.messageType || 'agent',
          timestamp: new Date(),
          metadata: result.data.metadata
        }]);
        setMetadata(result.data.metadata || {});
        setChatState(useChatStates.READY);
        initializedRef.current = true;
      } else {
        console.error('Session initialization failed:', result.error);
        setError(result.error);
        setChatState(useChatStates.ERROR);
        setMessages([{
          id: Date.now(),
          text: result.fallbackMessage,
          sender: 'error',
          timestamp: new Date()
        }]);
      }
    } finally {
      initializingRef.current = false;
    }
  }, []);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || chatState === useChatStates.SENDING || !sessionId) {
      return false;
    }

    setChatState(useChatStates.SENDING);
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const result = await apiClient.sendMessage(sessionId, text);

    if (result.success) {
      // Add agent response
      const agentMessage = {
        id: Date.now() + 1,
        text: result.data.message,
        sender: result.data.messageType || 'agent',
        timestamp: new Date(),
        metadata: result.data.metadata
      };
      setMessages(prev => [...prev, agentMessage]);
      setMetadata(result.data.metadata || {});
      setChatState(useChatStates.READY);
      return true;
    } else {
      if (result.requiresReload) {
        setChatState(useChatStates.SESSION_EXPIRED);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'Deine Sitzung ist abgelaufen. Die Seite wird neu geladen...',
          sender: 'system',
          timestamp: new Date()
        }]);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(result.error);
        setChatState(useChatStates.ERROR);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: result.fallbackMessage || 'Ein Fehler ist aufgetreten.',
          sender: 'error',
          timestamp: new Date()
        }]);
      }
      return false;
    }
  }, [sessionId, chatState]);

  /**
   * Clear chat and start new session
   */
  const resetChat = useCallback(async () => {
    // Reset initialization flags
    initializedRef.current = false;
    initializingRef.current = false;
    
    // Reset API client flag as well
    apiClient.isStarting = false;
    
    setMessages([]);
    setSessionId(null);
    setError(null);
    setMetadata({});
    await initialize();
  }, [initialize]);

  /**
   * Get session info
   */
  const getSessionInfo = useCallback(async () => {
    if (!sessionId) return null;

    const result = await apiClient.getSessionInfo(sessionId);
    return result.success ? result.data : null;
  }, [sessionId]);

  // Initialize on mount
  useEffect(() => {
    let mounted = true;
    
    const initializeChat = async () => {
      if (mounted && !initializingRef.current && !initializedRef.current) {
        await initialize();
      }
    };
    
    initializeChat();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

  return {
    // State
    messages,
    sessionId,
    chatState,
    error,
    metadata,
    
    // Actions
    sendMessage,
    resetChat,
    getSessionInfo,
    
    // Computed
    isReady: chatState === useChatStates.READY,
    isLoading: chatState === useChatStates.SENDING || chatState === useChatStates.INITIALIZING,
    hasError: chatState === useChatStates.ERROR
  };
}