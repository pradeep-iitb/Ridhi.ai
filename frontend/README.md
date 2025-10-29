# Ridhi.ai Frontend

Next.js frontend for Ridhi.ai - Unified AI Assistant for Students

## 🚀 Features

- **Beautiful UI**: Hyperspeed login animation & Vortex chat background
- **Voice Mode**: Speech recognition with 2-second inactivity auto-response
- **Real-time Chat**: ChatGPT-like interface with streaming responses
- **File Upload**: Drag & drop file uploads with AI summarization
- **Weekly History**: Organized chat history by weeks
- **Firebase Auth**: Google Sign-In & email authentication
- **Responsive**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running (see backend/README.md)

## 🛠️ Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Environment variables are already set in `.env.local`. Update if needed:

- Firebase configuration
- Backend API URL
- Google OAuth client ID

## 🏃 Running the App

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

App runs on `http://localhost:3000` by default.

## 📱 Features Guide

### Voice Mode
1. Click the microphone icon to activate voice mode
2. Start speaking - your words will be transcribed
3. After you stop speaking, AI responds automatically
4. If you're inactive for 2 seconds, AI starts speaking the last response

### File Upload
- Click the paperclip icon to select files
- Or drag and drop files anywhere on the chat screen
- Supports PDF, Word docs, images
- AI automatically summarizes uploaded files

### Chat History
- Click the menu icon to view chat history
- History is organized by weeks
- Click any week to load previous conversations

## 🎨 Customization

### Animations
- **Login Background**: Edit `components/Hyperspeed.jsx`
- **Chat Background**: Edit `components/Vortex.jsx`

### Styles
- **Colors**: Edit `tailwind.config.js`
- **Global Styles**: Edit `app/globals.css`

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

## 🤝 Contributing

This is a student project. Feel free to suggest improvements!

## 📄 License

MIT
