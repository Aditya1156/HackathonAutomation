# 🚀 Hackathon Fusion

<div align="center">

![Hackathon Fusion](https://img.shields.io/badge/Hackathon-Fusion-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, feature-rich hackathon management platform with AI-powered features, real-time collaboration, and stunning animations.**

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Performance Optimizations](#-performance-optimizations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Hackathon Fusion** is a comprehensive platform designed to streamline hackathon management for organizers, participants, mentors, and judges. It features an intuitive interface, AI-powered project ideation, GitHub integration, real-time chat, and beautiful animations powered by Framer Motion and GSAP.

### Why Hackathon Fusion?

- ✨ **Modern UI/UX** - Stunning dark theme with glassmorphism effects
- 🤖 **AI Integration** - Google Gemini AI for project idea generation
- 🔗 **GitHub Integration** - Seamless repository search and verification
- 📊 **Real-time Dashboard** - Live project tracking and team management
- 🎨 **Smooth Animations** - Framer Motion & GSAP for fluid transitions
- 🛡️ **Type-Safe** - Built with TypeScript for robust code
- ⚡ **Performance Optimized** - Debouncing, memoization, and lazy loading

---

## ✨ Features

### 🎯 For Participants

- **Team Registration** - Multi-step registration with GitHub integration
- **Student Dashboard** - Track progress, manage team, submit projects
- **Project Hub** - Repository management and submission tracking
- **Mentor Chat** - Real-time communication with mentors
- **Resource Library** - Access to tutorials and helpful resources
- **AI Idea Generator** - Get project suggestions powered by Google Gemini

### 👨‍💼 For Admins

- **Admin Portal** - Comprehensive management dashboard
- **Team Management** - View and manage all registered teams
- **Event Configuration** - Set hackathon details and timelines
- **Submission Review** - Track and evaluate project submissions
- **Analytics Dashboard** - Monitor event statistics

### 👨‍🏫 For Mentors & Judges

- **Mentor Portal** - Review team progress and provide guidance
- **Evaluation System** - Score and provide feedback on projects
- **Communication Tools** - Chat with teams in real-time

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0** - Latest React with automatic batching
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool with HMR

### Styling & Animations
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 11.3.11** - Production-ready animation library
- **GSAP 3.12.5** - Professional-grade animations

### State Management
- **React Hooks** - useState, useEffect, useRef, custom hooks
- **Session Storage** - Persistent state across page refreshes

### APIs & Integration
- **Google Gemini AI** - AI-powered project idea generation
- **GitHub API** - Repository search and validation
- **Lucide React** - Beautiful icon library

### Development Tools
- **ESLint** - Code quality and consistency
- **Vite Config** - Optimized build configuration
- **TypeScript Config** - Strict type checking

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Clone the Repository

```bash
git clone https://github.com/Aditya1156/HackathonAutomation.git
cd HackathonAutomation
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
VITE_GITHUB_TOKEN=your_github_token_here
```

> **Note:** Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🎮 Usage

### For Participants

1. **Register Your Team**
   - Click "Participant Portal" from the header
   - Fill in team details (name, project synopsis, domain)
   - Search and verify your GitHub repository
   - Add team members with their GitHub usernames
   - Submit registration

2. **Login to Dashboard**
   - Click "Student Dashboard"
   - Enter your GitHub username
   - Access your team's dashboard

3. **Manage Your Project**
   - Navigate through Overview, My Team, Project Hub
   - Chat with mentors for guidance
   - Submit your final project

### For Admins

1. Click "Admin Portal" from the header
2. Access team management and event configuration
3. Review submissions and manage the event

---

## 📁 Project Structure

```
HackathonFusion/
├── animations/
│   └── framerVariants.ts          # Reusable animation variants
├── components/
│   ├── AnimatedComponents.tsx      # Animated UI elements
│   ├── Countdown.tsx               # Event countdown timer
│   ├── DashboardChat.tsx           # Mentor chat interface
│   ├── DashboardOverview.tsx       # Dashboard home
│   ├── DashboardProject.tsx        # Project management
│   ├── DashboardTeam.tsx           # Team information
│   ├── ErrorBoundary.tsx           # Error handling wrapper
│   ├── Footer.tsx                  # Global footer
│   ├── Header.tsx                  # Global navigation
│   ├── ScrollFXContainer.tsx       # Scroll animations
│   └── TargetCursor.tsx            # Custom cursor
├── hooks/
│   ├── useCountdown.ts             # Countdown timer hook
│   ├── useToast.tsx                # Toast notification hook
│   └── useTypewriter.ts            # Typewriter effect hook
├── pages/
│   ├── AdminPortal.tsx             # Admin dashboard
│   ├── DashboardPage.tsx           # Student dashboard
│   ├── LandingPage.tsx             # Homepage
│   ├── RegistrationPage.tsx        # Team registration
│   ├── StudentLoginPage.tsx        # Student login
│   └── UserPortal.tsx              # Registration portal
├── services/
│   ├── geminiService.ts            # Google Gemini AI integration
│   ├── githubService.ts            # GitHub API integration
│   └── mockData.ts                 # Mock data for development
├── App.tsx                         # Main application component
├── index.tsx                       # Application entry point
├── types.ts                        # TypeScript type definitions
├── vite.config.ts                  # Vite configuration
└── package.json                    # Dependencies and scripts
```

---

## 🔑 Key Components

### App.tsx
Main application component with routing logic, session management, and global state.

```typescript
- Manages app mode (landing, user portal, admin, student dashboard)
- Handles authentication and protected routes
- Implements error boundary for crash prevention
- Manages page transitions with Framer Motion
```

### Header.tsx
Global navigation with animated logo and portal links.

```typescript
- Logo click redirects to landing page with logout
- Animated navigation buttons
- Sticky header with backdrop blur effect
```

### DashboardPage.tsx
Student dashboard with multiple views (Overview, Team, Project, Chat, Resources).

```typescript
- Tab-based navigation with sidebar
- Session-based welcome toasts
- Integrated team and project management
```

### UserPortal.tsx
Multi-step registration form with GitHub integration.

```typescript
- Step 1: Team details and project synopsis
- Step 2: GitHub repository search and verification
- Step 3: Add team members
- Debounced GitHub search (300ms)
- Form validation and error handling
```

---

## ⚡ Performance Optimizations

### Implemented Optimizations

1. **Debouncing** - GitHub search with 300ms delay
2. **React.memo** - Memoized toast components
3. **Cleanup Functions** - Proper cleanup of timeouts and intervals
4. **Error Boundaries** - Crash prevention with error UI
5. **Session Storage** - Persistent state with try-catch protection
6. **Optimized Animations** - Single AnimatePresence, no nested conflicts
7. **Code Splitting** - Component-based code organization
8. **CSS Animations** - Hardware-accelerated toast timer animations

### Bug Fixes

- ✅ Fixed logo navigation from all dashboard sections
- ✅ Removed nested AnimatePresence causing stuck animations
- ✅ Fixed negative countdown values with Math.max(0, ...)
- ✅ Added proper cleanup for memory leaks
- ✅ Enhanced API key error handling with typeof checks
- ✅ Fixed session storage crashes in browser

---

## 🎨 Animation Features

- **Page Transitions** - Smooth fade and slide animations
- **Custom Cursor** - Interactive target cursor with spin animation
- **Scroll Effects** - Blur and scale on scroll velocity
- **Typewriter Effect** - Animated text typing
- **Glowing Cards** - Gradient borders with motion effects
- **Countdown Timer** - Animated time display
- **Toast Notifications** - Slide-in alerts with CSS timer animation

---

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
- React plugin for JSX transformation
- Port: 3000
- HMR (Hot Module Replacement) enabled
```

### TypeScript Configuration
```json
// tsconfig.json
- Strict mode enabled
- JSX: react-jsx
- ES2020 target
- Module resolution: bundler
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for type safety
- Follow existing code structure
- Add comments for complex logic
- Test your changes thoroughly
- Ensure no console errors

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aditya1156**

- GitHub: [@Aditya1156](https://github.com/Aditya1156)
- Repository: [HackathonAutomation](https://github.com/Aditya1156/HackathonAutomation)

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React 19 framework
- **Framer Motion** - For beautiful animation capabilities
- **Tailwind CSS** - For rapid UI development
- **Google Gemini** - For AI-powered features
- **Vite Team** - For the blazing-fast build tool

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Aditya1156/HackathonAutomation/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

---

<div align="center">

**Made with ❤️ by Aditya1156**

⭐ Star this repository if you find it helpful!

</div>
