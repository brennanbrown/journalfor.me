# Journal for Me 📔

![Journal for Me - Dashboard Screenshot](site-screenshot.png)

A minimalist, secure personal journal application with offline capabilities, built as a Progressive Web App (PWA).

> **🚀 Early Access Available** - Experience the future of digital journaling with our Phase 1 MVP, now ready for early adopters!

## 🌟 Features

### Phase 1 (Current MVP) - ✅ COMPLETE
- ✅ **Zero-knowledge journaling** with AES-256 client-side encryption
- ✅ **Offline-first PWA** with beautiful markdown editor and dark/light themes

### Planned Features
- 📅 **Calendar & Search**: Visual timeline with full-text search and tagging
- 📊 **Analytics & Export**: Writing insights with PDF/HTML export options

## 🚀 Quick Start

### Prerequisites
- Node.js 24.6.0+ 
- npm 11.5.1+

### Installation

```bash
# Clone the repository
git clone https://github.com/brennanbrown/journalfor.me.git
cd journalfor.me

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run test         # Run automated test suite
```

## 🌐 Deployment

### Netlify (Recommended)

This app is optimized for Netlify deployment with the included `netlify.toml` configuration:

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Auto-Deploy**: Netlify will automatically detect the build settings
3. **Custom Domain**: Configure your domain in Netlify dashboard

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18+

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains your deployable static files
# Upload the contents to any static hosting service
```

## 🏗️ Project Structure

```
journalfor.me/
├── public/                 # Static assets
│   └── favicon.svg        # App icon
├── src/
│   ├── components/        # UI components
│   │   ├── App.ts        # Main application shell
│   │   ├── Auth.ts       # Authentication forms
│   │   ├── Dashboard.ts  # Dashboard/home page
│   │   ├── Editor.ts     # Markdown editor
│   │   ├── Calendar.ts   # Calendar view
│   │   ├── Search.ts     # Search interface
│   │   ├── Settings.ts   # User preferences
│   │   └── EntryView.ts  # Single entry display
│   ├── styles/
│   │   └── main.css      # Global styles with Tailwind
│   ├── utils/            # Utility functions
│   │   ├── app.ts        # App initialization
│   │   ├── theme.ts      # Theme management
│   │   ├── storage.ts    # IndexedDB wrapper
│   │   └── router.ts     # Client-side routing
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Core types
│   └── main.ts           # Application entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
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

- **Zero-knowledge architecture** with AES-256 client-side encryption—your entries never leave your device unencrypted

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

### Storage & PWA
- **IndexedDB**: Client-side database for data persistence
- **Service Workers**: Offline functionality and caching
- **Web App Manifest**: PWA configuration

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Early Access Status

**Journal for Me** is now available in **Early Access**! Phase 1 MVP is complete and ready for users who want to experience the future of digital journaling.

### ✅ What's Ready Now
- **Production-ready MVP** with secure authentication, encrypted storage, markdown editor, and 97% test coverage

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
