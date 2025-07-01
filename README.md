# WuffChat - Frontend Application

A modern, secure PWA frontend for WuffChat built with Vite, React, and Tailwind CSS. Fully compatible with the V3 agentic backend architecture.

> **Note**: This frontend supports both V2 compatibility and V3 agentic API endpoints, with enhanced state management for autonomous agent interactions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.development.template .env.development
# Edit .env.development and configure:
# VITE_API_URL=http://localhost:8000
# VITE_API_VERSION=v3  # or v2 for compatibility

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Features

- ⚡ **Vite** - Lightning fast development
- 📱 **PWA** - Installable as mobile app
- 🎨 **Tailwind CSS** - Utility-first styling
- 🔒 **Secure** - 0 vulnerabilities
- 🧪 **Vitest** - Modern testing framework
- 📦 **TypeScript Ready** - Can be gradually added
- 🤖 **V3 Agent Support** - Enhanced for agentic interactions
- 🔄 **Smart State Management** - React hooks for conversation flow
- 🔌 **API Flexibility** - V2/V3 compatibility layer

## 📱 PWA Features

- **Installable**: Users can install as native app
- **Offline Support**: Basic offline functionality
- **Auto-Update**: Automatic updates without app store
- **Native Feel**: Full-screen, native-like experience

## 🛡️ Security

- Environment variables properly configured
- No hardcoded secrets
- Modern dependency management
- HTTPS ready

## 🚀 Deployment

### Static Hosting (Recommended)
```bash
npm run build
# Upload dist/ folder to any static host
```

### Environment Variables
```env
VITE_API_URL=https://your-api-domain.com
VITE_API_KEY=your_production_api_key
VITE_API_VERSION=v3  # Use v3 for agentic features, v2 for compatibility
VITE_DEBUG_MODE=false  # Enable for development debugging
```

## 📊 Performance

- **Bundle Size**: ~63KB gzipped
- **Build Time**: <2 seconds
- **Dev Server**: <50ms hot reload
- **Lighthouse Score**: 95+ (PWA optimized)

## 🔄 Migration from Create React App

This version replaces the old Create React App with:
- ✅ 0 vulnerabilities (vs 9 vulnerabilities)
- ✅ 10x faster development
- ✅ 50% smaller bundle size
- ✅ PWA capabilities
- ✅ Modern tooling

## V3 Integration Features

### Enhanced API Client
- **Centralized Communication**: `src/services/apiClient.js`
- **Version Abstraction**: Automatic V2/V3 endpoint routing
- **Error Handling**: Comprehensive error recovery and user feedback
- **Session Management**: Automatic session lifecycle handling

### React Hooks
- **`useChat`**: Complete chat state management with V3 support
- **Loading States**: Real-time feedback for agent processing
- **Error Recovery**: Graceful degradation and retry mechanisms

### Component Architecture
```
src/
├── components/
│   ├── Chat.jsx           # Original V2 compatible
│   ├── ChatV3.jsx         # Enhanced V3 features
│   └── ChatWithHook.jsx   # Hook-based implementation
├── hooks/
│   └── useChat.js         # V3 state management
└── services/
    └── apiClient.js       # V2/V3 API abstraction
```

### Development vs Production
- **Development**: Debug mode with agent metadata display
- **Production**: Optimized for user experience
- **Testing**: Mock API responses for offline development

---

Built with ❤️ using Vite + React + V3 Agentic Architecture
