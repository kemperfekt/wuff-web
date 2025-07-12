/**
 * API Client for WuffChat V3
 * 
 * Centralized API communication with:
 * - V3 endpoints (primary)
 * - V2 fallback support
 * - Error handling
 * - Session management integration
 */

import SessionManager from '../utils/sessionManager';

class ApiClient {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.apiKey = import.meta.env.VITE_API_KEY;
    this.apiVersion = import.meta.env.VITE_API_VERSION || 'v3'; // Default to V3
    
    console.log('ApiClient initialized with:', {
      baseUrl: this.baseUrl,
      apiVersion: this.apiVersion,
      hasApiKey: !!this.apiKey
    });
    
    // Request deduplication
    this.pendingRequests = new Map();
    this.requestTimestamps = new Map();
    this.isStarting = false; // Simple flag to prevent multiple start requests
  }

  /**
   * Get common headers for API requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    return headers;
  }

  /**
   * Handle API errors consistently
   */
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('SESSION_NOT_FOUND');
      }
      if (response.status === 500) {
        throw new Error('SERVER_ERROR');
      }
      throw new Error(`API_ERROR_${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Start a new conversation
   * @param {string} sessionId - Optional session ID to resume
   * @returns {Promise<Object>} Conversation start response
   */
  async startConversation(sessionId = null) {
    // Simple blocking flag to prevent multiple simultaneous requests
    if (this.isStarting) {
      console.warn('startConversation already in progress, ignoring duplicate request');
      return {
        success: false,
        error: 'DUPLICATE_REQUEST',
        fallbackMessage: 'Ein anderer Verbindungsaufbau ist bereits in Gange...'
      };
    }
    
    this.isStarting = true;
    console.log('Starting conversation request...');
    
    try {
      const url = `${this.baseUrl}/${this.apiVersion}/start`;
      console.log('Fetching:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await this.handleResponse(response);
      
      // Store session if successful
      if (data.session_id) {
        SessionManager.setSession(data.session_id, data.session_token);
      }
      
      return {
        success: true,
        data: {
          sessionId: data.session_id,
          message: data.message,
          messageType: data.message_type,
          metadata: data.metadata
        }
      };
    } catch (error) {
      console.error('Failed to start conversation:', error);
      return {
        success: false,
        error: error.message,
        fallbackMessage: 'Willkommen! Leider konnte ich die Verbindung nicht herstellen.'
      };
    } finally {
      this.isStarting = false;
      console.log('Conversation request completed');
    }
  }

  /**
   * Send a message in the conversation
   * @param {string} sessionId - Current session ID
   * @param {string} message - User's message
   * @returns {Promise<Object>} API response
   */
  async sendMessage(sessionId, message) {
    if (!sessionId) {
      throw new Error('NO_SESSION');
    }

    try {
      const endpoint = this.apiVersion === 'v2' 
        ? `${this.baseUrl}/v2/message`
        : `${this.baseUrl}/v3/message`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          session_id: sessionId,
          message: message
        }),
      });

      const data = await this.handleResponse(response);
      
      // Refresh session on successful message
      SessionManager.refreshSession();
      
      // Normalize response for V2/V3 compatibility
      return {
        success: true,
        data: {
          message: data.message || data.response,
          messageType: data.message_type || 'agent',
          metadata: data.metadata || {},
          phase: data.metadata?.phase || data.state
        }
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      
      if (error.message === 'SESSION_NOT_FOUND') {
        SessionManager.clearSession();
        return {
          success: false,
          error: 'SESSION_EXPIRED',
          requiresReload: true
        };
      }
      
      return {
        success: false,
        error: error.message,
        fallbackMessage: 'Entschuldigung, ich konnte deine Nachricht nicht verarbeiten.'
      };
    }
  }

  /**
   * Get session information
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session details
   */
  async getSessionInfo(sessionId) {
    try {
      const endpoint = this.apiVersion === 'v2'
        ? `${this.baseUrl}/v2/session/${sessionId}`
        : `${this.baseUrl}/v3/session/${sessionId}`;

      const response = await fetch(endpoint, {
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Failed to get session info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      
      return {
        success: true,
        healthy: data.status === 'healthy',
        data: data
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        healthy: false,
        error: error.message
      };
    }
  }

  /**
   * Check if V3 API is available
   * @returns {Promise<boolean>} True if V3 is available
   */
  async isV3Available() {
    try {
      const response = await fetch(`${this.baseUrl}/v3/health`, {
        headers: this.getHeaders(),
      });
      
      return response.ok;
    } catch (error) {
      console.error('V3 availability check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;