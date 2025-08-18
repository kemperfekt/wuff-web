# API Key Setup Guide

## 🔐 Security Update: API Key Authentication

We've implemented API key authentication to protect the backend from unauthorized access and potential abuse.

## Backend Setup

### 1. Generate a Secure API Key

```bash
# Generate a secure random key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Example output: `Rz8kNvX3Qm2yP5sL9fJ7wE4tH6bK1aG0xC8uD2iV4nM`

### 2. Set Environment Variable

Add to your `.env` file or environment:

```bash
# Development
export WUFFCHAT_API_KEY="your-generated-key-here"

# Production (Scalingo)
scalingo env-set WUFFCHAT_API_KEY="your-production-key-here"
```

### 3. Verify Backend is Protected

```bash
# Start the backend
python -m uvicorn src.main:app --port 8000

# In another terminal, run the test
python test_api_auth.py
```

## Frontend Setup

### 1. Update Environment Files

**Development** (`.env.development`):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_KEY=your-development-key-here
```

**Production** (`.env.production`):
```env
REACT_APP_API_URL=https://dogbot-agent.osc-fr1.scalingo.io
REACT_APP_API_KEY=your-production-key-here
```

### 2. Rebuild Frontend

```bash
# Development
npm run dev

# Production build
npm run build
```

## How It Works

1. **Backend** checks for `X-API-Key` header on protected endpoints
2. **Frontend** automatically includes the API key in all requests
3. **Public endpoints** (health checks) don't require authentication
4. **Protected endpoints** (`/flow_intro`, `/flow_step`) require valid API key

## Security Notes

- ⚠️ The API key in frontend JavaScript is visible to users who inspect the code
- ✅ This protects against: bots, scrapers, casual attackers
- ❌ This doesn't protect against: determined attackers who extract the key
- 🔒 For production, combine with rate limiting (next security improvement)

## Testing

Without API key:
```bash
curl -X POST http://localhost:8000/flow_intro
# Returns: 401 Unauthorized
```

With API key:
```bash
curl -X POST http://localhost:8000/flow_intro \
  -H "X-API-Key: your-key-here"
# Returns: 200 OK with session
```

## Next Steps

After implementing API key authentication, the next security priorities are:
1. Rate limiting (prevent abuse even with valid key)
2. Session security (add expiration and validation)
3. Error message sanitization