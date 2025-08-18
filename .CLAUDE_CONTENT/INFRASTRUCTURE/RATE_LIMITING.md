# Rate Limiting Documentation

## 🚦 Rate Limiting Implementation

We've implemented rate limiting to prevent API abuse and ensure fair usage for all users.

## Current Limits

### Per Endpoint
- **`/flow_intro`**: 10 requests per minute (new conversations)
- **`/flow_step`**: 30 requests per minute (messages within conversation)
- **Global**: 100 requests per minute (all endpoints combined)

### Rate Limit Headers
Every response includes rate limit information:
```
X-RateLimit-Limit: 10        # Maximum requests allowed
X-RateLimit-Remaining: 7     # Requests remaining
X-RateLimit-Reset: 1609459200 # Unix timestamp when limit resets
```

## How It Works

1. **IP-Based Limiting**: Limits are applied per IP address
2. **Proxy Support**: Correctly identifies real IP behind load balancers (Scalingo)
3. **429 Response**: When limit exceeded, returns HTTP 429 with retry information

## Testing Rate Limits

```bash
# Install slowapi first
pip install slowapi

# Run the test script
python test_rate_limit.py
```

## Handling Rate Limits (Frontend)

```javascript
async function makeAPICall(url, options) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    // Rate limited
    const retryAfter = response.headers.get('Retry-After') || 60;
    console.error(`Rate limited. Retry after ${retryAfter} seconds`);
    
    // Implement exponential backoff
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    
    // Retry the request
    return makeAPICall(url, options);
  }
  
  return response;
}
```

## Best Practices

### For Frontend Development
1. **Cache responses** when possible to reduce API calls
2. **Debounce user input** to avoid rapid-fire requests
3. **Show remaining limits** to users if needed
4. **Implement retry logic** with exponential backoff

### For Users
1. **Spread requests** over time instead of bursts
2. **Reuse sessions** instead of creating new ones
3. **Cache data** client-side when appropriate

## Configuration

### Environment Variables
```bash
# Future: Configure rate limits via environment
RATE_LIMIT_FLOW_INTRO=10/minute
RATE_LIMIT_FLOW_STEP=30/minute
RATE_LIMIT_GLOBAL=100/minute
```

### Custom Limits (Future)
```python
# Premium users (future feature)
RATE_LIMIT_TIERS = {
    "premium": {
        "flow_intro": "20/minute",
        "flow_step": "60/minute",
        "global": "200/minute"
    }
}
```

## Monitoring

### Check Current Violations
```python
# In production, monitor rate limit violations
GET /admin/rate-limit-stats  # Future admin endpoint
```

### Logs
Rate limit violations are logged:
```
🚦 Rate limit violation #1 from 192.168.1.1
🚫 IP 192.168.1.1 exceeded violation threshold - consider blocking
```

## Security Benefits

1. **Prevents DoS attacks**: Limits request volume
2. **Controls costs**: Prevents OpenAI API abuse
3. **Ensures fairness**: All users get fair access
4. **Identifies bad actors**: Logs help identify attackers

## Next Steps

After rate limiting, the next security priorities are:
1. ✅ API Authentication (done)
2. ✅ Rate Limiting (done)
3. 🔄 Session Security (next)
4. 🔄 Input Sanitization
5. 🔄 Error Message Sanitization