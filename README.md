# Journal for Me 📔

![Journal for Me - Dashboard Screenshot](site-screenshot.png)

A minimalist, secure personal journal application with **cross-device sync** and offline capabilities, built as a Progressive Web App (PWA) with zero-knowledge encryption.

> **🚀 Early Access Available** - Experience secure, multi-device journaling with our hybrid architecture, now ready for early adopters!

## 🌟 Features

### Phase 1 (Current MVP) - ✅ COMPLETE
- ✅ **Zero-knowledge journaling** with AES-256 client-side encryption
- ✅ **Cross-device sync** with secure server-side storage
- ✅ **Offline-first PWA** with beautiful markdown editor and dark/light themes
- ✅ **Hybrid architecture** combining local IndexedDB with encrypted cloud sync

### Planned Features
- 📅 **Calendar & Search**: Visual timeline with full-text search and tagging
- 📊 **Analytics & Export**: Writing insights with PDF/HTML export options

## 🚀 Quick Start

### Prerequisites
- Node.js 24.6.0+ 
- npm 11.5.1+
- SQLite (for backend development)

### Installation

```bash
# Clone the repository
git clone https://github.com/brennanbrown/journalfor.me.git
cd journalfor.me

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migration
npm run migrate

# Start backend server (in server directory)
npm run dev

# Start frontend (in root directory)
cd ..
npm run dev

# Open http://localhost:5173 in your browser
```
cs
### Available Scripts

```bash
# Frontend Commands
npm run dev          # Start frontend development server
npm run build        # Build frontend for production
npm run preview      # Preview frontend production build
npm run type-check   # Run TypeScript type checking
npm run test         # Run automated test suite

# Backend Commands (in server/ directory)
npm run dev          # Start backend API server
npm run build        # Build backend for production
npm run migrate      # Run database migrations
npm test             # Run backend tests
```

## 🌐 Deployment

### Hybrid Architecture Deployment

The app now requires both frontend and backend deployment:

#### Frontend (Static Site)
**Recommended: Netlify/Vercel**
```bash
# Build frontend
npm run build
# Deploy dist/ folder to static hosting
```

#### Backend (API Server)
**Recommended: Railway/Render/Fly.io**
```bash
# From server/ directory
npm run build
# Deploy with environment variables:
# - JWT_SECRET
# - DATABASE_URL (PostgreSQL for production)
# - ALLOWED_ORIGINS
```

#### Environment Variables
```bash
# Backend (.env)
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

#### Production Database
- **Development**: SQLite (included)
- **Production**: PostgreSQL (recommended)
- **Managed Options**: Supabase, PlanetScale, Neon

## 🏗️ Project Structure

```
journalfor.me/
├── public/                 # Static assets
│   └── favicon.svg        # App icon
├── src/                   # Frontend source
│   ├── components/        # UI components
│   │   ├── App.ts        # Main application shell
│   │   ├── Auth.ts       # Authentication forms
│   │   ├── Dashboard.ts  # Dashboard/home page
│   │   ├── Editor.ts     # Markdown editor
│   │   ├── Calendar.ts   # Calendar view
│   │   ├── Search.ts     # Search interface
│   │   ├── Settings.ts   # User preferences
│   │   └── EntryView.ts  # Single entry display
│   ├── utils/            # Utility functions
│   │   ├── storage.ts    # Hybrid storage manager
│   │   ├── api.ts        # Server API client
│   │   └── router.ts     # Client-side routing
│   └── types/            # TypeScript definitions
├── server/                # Backend API
│   ├── src/
│   │   ├── controllers/   # API route handlers
│   │   ├── middleware/    # Auth & validation
│   │   ├── database/      # Database connection
│   │   ├── types/         # Backend types
│   │   └── index.ts       # Express server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment template
├── vite.config.ts         # Frontend build config
└── package.json           # Frontend dependencies
```

## 🎨 Design System

### Colors
- **Primary**: Blue (`#3B82F6`) for interactive elements
- **Secondary**: Gray variants for text and backgrounds
- **Accent**: Context-specific colors (green for success, red for danger, etc.)

### Typography
- **Font Stack**: System fonts optimized for readability
- **Sizes**: Consistent scale using Tailwind's typography utilities
- **Line Height**: Comfortable reading experience with proper spacing

### Components
- **Cards**: Consistent container styling with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, ghost) with hover states
- **Forms**: Accessible input fields with proper focus indicators
- **Navigation**: Clean, intuitive navigation with active states

## 🔒 Security & Privacy

- **Zero-knowledge architecture**: Server stores only encrypted blobs, never plaintext
- **Client-side encryption**: AES-256 with PBKDF2 key derivation
- **Secure authentication**: JWT tokens with bcrypt password hashing
- **HTTPS required**: All data transmission encrypted in transit
- **No data mining**: Your journal entries remain completely private

## ♿ Accessibility

- **WCAG 2.1 AA compliant** with full keyboard navigation and screen reader support

## 📱 Progressive Web App

- **Offline-first PWA** that installs like a native app with full functionality without internet

## 🛠️ Tech Stack

### Frontend
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for consistent iconography

### Storage & Sync
- **Hybrid Storage**: IndexedDB + encrypted server sync
- **Zero-Knowledge**: Client-side AES-256 encryption
- **SQLite/PostgreSQL**: Server-side encrypted data storage
- **Service Workers**: Offline functionality and caching
- **Web App Manifest**: PWA configuration

### Backend
- **Node.js + Express**: RESTful API server
- **JWT Authentication**: Secure token-based auth
- **bcrypt**: Password hashing and validation
- **SQLite/PostgreSQL**: Database with better-sqlite3/pg

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Early Access Status

**Journal for Me** is now available in **Early Access**! Phase 1 MVP is complete and ready for users who want to experience the future of digital journaling.

### ✅ What's Ready Now
- **Cross-device sync** with zero-knowledge encryption
- **Hybrid architecture** combining offline-first with cloud backup
- **Production-ready MVP** with 97% test coverage
- **Secure authentication** and encrypted storage

### 🎯 Perfect For Early Adopters Who Want
- **Privacy-first journaling** with beautiful UX and zero data tracking

### 🔜 Coming Soon (Phase 2)
- **Enhanced features** including calendar view, search/filtering, analytics, and export functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style and conventions
2. Add TypeScript types for all new code
3. Ensure accessibility compliance for UI changes
4. Test on both desktop and mobile devices
5. Update documentation for new features

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspired by analog journaling** and modern web accessibility standards
