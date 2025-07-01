# Frontend V3 Integration Guide

This document describes the V3 API integration for the WuffChat frontend.

## Overview

The frontend has been enhanced to work with the V3 agentic architecture while maintaining backward compatibility with V2.

## Architecture

### 1. API Client (`src/services/apiClient.js`)
Centralized API communication with:
- V3 endpoint support (primary)
- V2 fallback compatibility
- Consistent error handling
- Session management integration

### 2. React Hook (`src/hooks/useChat.js`)
State management hook providing:
- Chat state management
- Message history
- Loading states
- Error handling
- Session lifecycle

### 3. Components

#### Original Chat (`src/components/Chat.jsx`)
- Already V3 compatible
- Direct API calls
- Working implementation

#### Enhanced ChatV3 (`src/components/ChatV3.jsx`)
- Uses centralized API client
- Better error handling
- Optional metadata display
- Debug mode support

#### Hook-based Chat (`src/components/ChatWithHook.jsx`)
- Uses `useChat` hook
- Clean separation of concerns
- Simplified component logic

## Migration Paths

### Option 1: Use Existing Chat Component
The current `Chat.jsx` already works with V3 API. No changes needed.

### Option 2: Upgrade to API Client
Replace direct fetch calls with `apiClient`:

```javascript
// Before
const response = await fetch(`${apiUrl}/v3/message`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ session_id: sessionId, message: input })
});

// After
const result = await apiClient.sendMessage(sessionId, input);
```

### Option 3: Use Hook-based Approach
For new components or refactoring:

```javascript
import { useChat } from '../hooks/useChat';

function MyChat() {
  const { messages, sendMessage, isReady } = useChat();
  // Component logic simplified
}
```

## API Client Usage

### Starting a Conversation
```javascript
import apiClient from '../services/apiClient';

const result = await apiClient.startConversation();
if (result.success) {
  console.log('Session:', result.data.sessionId);
  console.log('Greeting:', result.data.message);
}
```

### Sending Messages
```javascript
const result = await apiClient.sendMessage(sessionId, userMessage);
if (result.success) {
  console.log('Response:', result.data.message);
  console.log('Metadata:', result.data.metadata);
} else if (result.requiresReload) {
  // Session expired - reload page
  window.location.reload();
}
```

### Health Checks
```javascript
const health = await apiClient.checkHealth();
console.log('API Status:', health.healthy);
```

## Error Handling

The integration provides robust error handling:

### Connection Errors
- Automatic fallback messages
- User-friendly error display
- Retry mechanisms

### Session Expiration
- Automatic detection
- Graceful reload
- User notification

### Server Errors
- Consistent error formatting
- Fallback responses
- Debug information (dev mode)

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_KEY=optional_api_key
VITE_API_VERSION=v3

# Debug Mode
NODE_ENV=development  # Shows metadata in debug mode
```

## Features

### V3-Specific Features
- Agent metadata display
- Conversation phase tracking
- Belief and goal visibility
- Action type indicators

### Development Features
- Debug mode toggle
- Metadata display
- Health monitoring
- Session inspection

## Testing

### Manual Testing
1. Start the API: `python -m uvicorn src.main:app --port 8000`
2. Start frontend: `npm run dev`
3. Test conversation flow
4. Verify error handling
5. Check session persistence

### API Health
Visit `http://localhost:8000/health` to verify API status.

## Troubleshooting

### Common Issues

#### 1. Connection Refused
- Ensure API is running on port 8000
- Check VITE_API_URL environment variable

#### 2. Session Expired
- Check session timeout (30 minutes)
- Verify session storage works

#### 3. CORS Errors
- API includes CORS headers for localhost:3000 and localhost:5173
- Check browser console for specific errors

#### 4. No Response from Agent
- Check API logs for tool integration issues
- Verify Weaviate service status (fallback mode)

### Debug Information

Enable debug mode in development:
- Check "Show metadata" checkbox
- View agent decision information
- Monitor conversation phase

## Performance

### Optimizations
- Centralized API client reduces code duplication
- Hook-based state management prevents unnecessary re-renders
- Session storage reduces initialization overhead

### Monitoring
- API response times
- Error rates
- Session duration
- Message throughput

## Future Enhancements

### Planned Features
- Real-time health monitoring
- Message reactions/feedback
- Conversation export
- Multi-language support
- Voice input/output

### API Improvements
- WebSocket support for real-time updates
- Message streaming for long responses
- Offline mode support
- Caching strategies