# WuffChat Frontend

> **Current Status**: Stable V2 in production | V3 compatibility in development

Modern React PWA providing the chat interface for WuffChat - the AI dog behavior assistant.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.development.template .env.development

# Start development server
npm run dev
```

## Technical Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS  
- **PWA**: Installable mobile app with offline support
- **API**: Compatible with V2 endpoints (/flow_intro, /flow_step)

## Key Features

- Real-time chat interface with typing indicators
- Session persistence (30-minute timeout)
- Responsive design optimized for mobile
- Progressive Web App capabilities
- ~63KB gzipped bundle size

## Deployment

Production deployment on Scalingo:
- URL: [app.wuffchat.de](https://app.wuffchat.de)
- Auto-deploy from GitHub main branch
- Environment variables configured on platform

## Full Documentation

For architecture details, development guidelines, and API integration:  
**[-> View Complete Documentation](https://github.com/kemperfekt/dogbot)**

---

Part of the WuffChat ecosystem - see [wuffchat](https://github.com/kemperfekt/wuffchat) for overview.