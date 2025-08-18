# WuffChat - Frontend Application

A modern, secure PWA frontend for WuffChat built with Vite, React, and Tailwind CSS. Fully compatible with the V3 agentic backend architecture.

> **Note**: This frontend supports both V2 compatibility and V3 agentic API endpoints, with enhanced state management for autonomous agent interactions.

---

## 🎯 What is WuffChat?

**WuffChat** is an AI-powered conversational assistant that helps dog owners understand their furry friends by **explaining behavior from the dog's perspective**. Using advanced AI and a comprehensive knowledge base about canine instincts, WuffChat provides empathetic, instinct-based behavioral analysis.

> **Technical Note**: This project is internally referred to as "DogBot" in repositories and code. WuffChat is the public-facing brand name.

```mermaid
graph LR
    A[🧑 Dog Owner] -->|Describes Behavior| B[💬 WuffChat]
    B -->|Analyzes| C[🧠 AI Engine]
    C -->|Searches| D[📚 Knowledge Base]
    D -->|Returns| E[🐕 Dog's Perspective]
    E -->|Provides| F[💡 Training Tips]
    F -->|Helps| A
```

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend"
        UI[dogbot-web<br/>Vite + React PWA]
    end
    
    subgraph "Backend"
        API[dogbot-agent<br/>FastAPI]
        FSM[FSM Engine<br/>11 States]
        AI[GPT-4<br/>Analysis]
    end
    
    subgraph "Data Layer"
        VDB[(Weaviate<br/>Vector DB)]
        CACHE[(Redis<br/>Cache)]
    end
    
    subgraph "Infrastructure"
        OPS[dogbot-ops<br/>Data Management]
        WWW[dogbot-www<br/>Landing Page]
    end
    
    UI <-->|REST API| API
    API --> FSM
    FSM --> AI
    API <--> VDB
    API <--> CACHE
    OPS -->|Manages| VDB
    
    style UI fill:#61DAFB,color:#000
    style API fill:#009688,color:#fff
    style AI fill:#412991,color:#fff
    style VDB fill:#2C2C2C,color:#fff
```

## 🚀 Quick Start

```bash
# Clone the meta repository
git clone https://github.com/kemperfekt/dogbot.git
cd dogbot

# Start the backend
cd dogbot-agent
pip install -r requirements.txt
export OPENAI_API_KEY=your_key_here
uvicorn src.main:app --port 8000

# In a new terminal, start the frontend
cd ../dogbot-web
npm install
npm run dev

# Set up environment
cp .env.development.template .env.development
# Edit .env.development and configure:
# VITE_API_URL=http://localhost:8000
# VITE_API_VERSION=v3  # or v2 for compatibility

# Start development server
npm run dev

## 📦 Repository Structure

| Repository | Purpose | Tech Stack | Status |
|------------|---------|------------|--------|
| **[dogbot-agent](https://github.com/kemperfekt/dogbot-agent)** | Backend API & AI Logic | FastAPI, GPT-4, Weaviate | ✅ Production |
| **[dogbot-web](https://github.com/kemperfekt/dogbot-web)** | Chat Interface | Vite, React, PWA, Tailwind | ✅ Production |
| **[dogbot-ops](https://github.com/kemperfekt/dogbot-ops)** | Data & Schema Management | Python, Content-as-Code | ✅ Active |
| **[dogbot-www](https://github.com/kemperfekt/dogbot-www)** | Landing Page | Static HTML, Tailwind | ✅ Live |

## 🧠 How It Works

### Conversation Flow

```mermaid
stateDiagram-v2
    [*] --> START
    START --> GREETING: User starts
    GREETING --> CONTEXT_GATHERING: Collects info
    CONTEXT_GATHERING --> INITIAL_ASSESSMENT: Analyzes behavior
    INITIAL_ASSESSMENT --> INSTINCT_DIAGNOSIS: Identifies instincts
    INSTINCT_DIAGNOSIS --> DETAILED_SOLUTION: Provides tips
    DETAILED_SOLUTION --> FEEDBACK: Asks for feedback
    FEEDBACK --> END: Completes
    
    note right of INITIAL_ASSESSMENT
        AI provides response from
        the dog's perspective
    end note
    
    note right of INSTINCT_DIAGNOSIS
        Maps behavior to core
        canine instincts
    end note
```

### Core Instincts Model

WuffChat analyzes behavior through four fundamental canine instincts:

```mermaid
mindmap
  root((Dog Behavior))
    Jagdinstinkt
      Prey Drive
      Chase Behavior
      Resource Guarding
    Territorialinstinkt
      Space Protection
      Boundary Setting
      Alert Behavior
    Rudelinstinkt
      Pack Dynamics
      Social Hierarchy
      Cooperation
    Sexualinstinkt
      Mating Behavior
      Competition
      Hormonal Changes
```

## 🔧 Development

### Local Development Setup

Each repository has its own development environment:

```bash
# Backend development
cd dogbot-agent
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
pytest  # Run tests

# Frontend development
cd dogbot-web
npm install
npm test

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

**dogbot-web/.env.development**
```env
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_api_key_here
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

## 🚀 Deployment

```mermaid
graph LR
    A[GitHub Push] -->|Webhook| B[Scalingo Build]
    B -->|Deploy| C[Production]
    C --> D[app.wuffchat.de]
    C --> E[api.wuffchat.de]
    C --> F[wuffchat.de]
```

### Manual Deployment

```bash
# Deploy backend
cd dogbot-agent
git push scalingo main

# Deploy frontend
cd dogbot-web
git push scalingo main
```

## 📊 API Documentation

The API is fully documented with OpenAPI/Swagger:

- **Local**: http://localhost:8000/docs
- **Production**: https://api.wuffchat.de/docs

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/start-conversation` | POST | Begin new chat |
| `/send-message` | POST | Send message |
| `/feedback` | POST | Submit feedback |

## 🧪 Testing

```bash
# Run all tests
cd dogbot-agent && pytest
cd ../dogbot-web && npm test

# Run specific test suites
pytest tests/test_flow_engine.py
npm test -- --coverage
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛡️ Security & Privacy

- All conversations are anonymous
- No personal data is stored without consent
- OpenAI API calls use anonymized prompts
- See our [Privacy Policy](https://wuffchat.de/datenschutz.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.


## 📝 Naming Convention

- **WuffChat**: Public-facing product name (used in marketing, UI, and customer communication)
- **DogBot**: Internal technical name (used in code, repositories, and technical documentation)

This dual naming allows us to maintain technical consistency while presenting a friendly brand to users.

---

Built with ❤️ using Vite + React + V3 Agentic Architecture
