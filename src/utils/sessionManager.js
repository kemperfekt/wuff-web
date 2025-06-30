/**
 * Secure session management utility
 * Handles session ID and token storage with security best practices
 */

const SESSION_STORAGE_KEYS = {
  SESSION_ID: 'wuffchat_session_id',
  SESSION_TOKEN: 'wuffchat_session_token',
  TIMESTAMP: 'wuffchat_session_timestamp'
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

class SessionManager {
  /**
   * Store session data securely (V3 compatible - sessionToken optional)
   */
  static setSession(sessionId, sessionToken = null) {
    if (!sessionId) {
      console.warn('SessionManager: Invalid session ID provided');
      return false;
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, sessionId);
      // V3 doesn't use tokens, but store for V2 compatibility
      if (sessionToken) {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_TOKEN, sessionToken);
      }
      sessionStorage.setItem(SESSION_STORAGE_KEYS.TIMESTAMP, Date.now().toString());
      return true;
    } catch (error) {
      console.error('SessionManager: Failed to store session:', error);
      return false;
    }
  }

  /**
   * Retrieve session data with expiration check (V3 compatible)
   */
  static getSession() {
    try {
      const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_ID);
      const sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_TOKEN);
      const timestamp = sessionStorage.getItem(SESSION_STORAGE_KEYS.TIMESTAMP);

      if (!sessionId || !timestamp) {
        return null;
      }

      // Check if session has expired
      const sessionAge = Date.now() - parseInt(timestamp);
      if (sessionAge > SESSION_TIMEOUT) {
        this.clearSession();
        return null;
      }

      // V3 compatible: return sessionId, sessionToken optional
      return { sessionId, sessionToken };
    } catch (error) {
      console.error('SessionManager: Failed to retrieve session:', error);
      return null;
    }
  }

  /**
   * Update session timestamp to extend expiration
   */
  static refreshSession() {
    try {
      if (this.getSession()) {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('SessionManager: Failed to refresh session:', error);
      return false;
    }
  }

  /**
   * Clear all session data
   */
  static clearSession() {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_ID);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_TOKEN);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.TIMESTAMP);
      return true;
    } catch (error) {
      console.error('SessionManager: Failed to clear session:', error);
      return false;
    }
  }

  /**
   * Check if a valid session exists
   */
  static hasValidSession() {
    return this.getSession() !== null;
  }
}

export default SessionManager;