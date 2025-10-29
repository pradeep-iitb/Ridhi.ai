# 🚀 Ridhi.ai - Complete Setup Guide

This guide will help you set up and run Ridhi.ai on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed
- A **Firebase project** (we'll guide you through this)
- API keys for **Gemini** and **DeepSeek** (already provided)

## 🔧 Step 1: Automated Setup

Run the setup script to install all dependencies:

```powershell
.\setup.ps1
```

This will:
- Check Node.js installation
- Install backend dependencies
- Install frontend dependencies

## 🔑 Step 2: Firebase Configuration

### For Backend (Required)

You need to add Firebase Admin credentials to the backend:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ridhiaiproject**
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Open `backend\.env` and update:
   - `FIREBASE_CLIENT_EMAIL` - Copy from JSON file
   - `FIREBASE_PRIVATE_KEY` - Copy from JSON file (keep the quotes and \n)

### For Frontend (Already Configured)

The frontend Firebase config is already set in `frontend\.env.local`. No changes needed!

## 🎯 Step 3: Running the Application

### Option A: Run Both Separately (Recommended)

**Terminal 1 - Backend:**
```powershell
.\run-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\run-frontend.ps1
```

### Option B: Manual Start

**Backend:**
```powershell
cd backend
npm run dev
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

## 🌐 Step 4: Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 🎨 Step 5: Test the Features

### 1. Sign In
- Go to http://localhost:3000
- Click "Sign in with Google" or use email/password
- You'll be redirected to the chat page

### 2. Test Chat
- Type a message and press Enter
- Try: "What is machine learning?"
- AI will respond using Gemini + DeepSeek

### 3. Test Voice Mode
- Click the microphone icon
- Start speaking
- Your speech will be transcribed
- After 2 seconds of silence, AI responds vocally!

### 4. Test File Upload
- Drag a PDF file into the chat
- Or click the paperclip icon
- AI will summarize the document

### 5. View Chat History
- Click the menu icon (top left)
- View conversations organized by week

## 🐛 Troubleshooting

### Backend won't start?
- Check if port 4000 is available
- Verify Firebase credentials in `backend\.env`
- Check console for error messages

### Frontend won't start?
- Check if port 3000 is available
- Clear cache: Delete `.next` folder and restart

### Voice not working?
- Use Google Chrome (best support)
- Allow microphone permissions
- Check browser console for errors

### File upload fails?
- Check file size (max 10MB)
- Verify Firebase Storage is enabled
- Check backend console logs

## 📱 Production Deployment

### Deploy Backend to Render

1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Copy from `backend\.env`

### Deploy Frontend to Vercel

1. Create account at [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add environment variables from `frontend\.env.local`
5. Update `NEXT_PUBLIC_BACKEND_URL` to your Render URL
6. Deploy!

## 🔐 Security Notes

### Before Deploying:
1. Add `.env` files to `.gitignore` (already done)
2. Never commit API keys to GitHub
3. Use environment variables in production
4. Enable Firebase security rules

### Recommended Firebase Rules:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /files/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📚 Project Structure

```
Ridhi.ai/
├── frontend/              # Next.js application
│   ├── app/              # Pages (login, chat, home)
│   │   ├── chat/         # Chat page
│   │   ├── login/        # Login page
│   │   ├── layout.jsx    # Root layout
│   │   └── page.jsx      # Home page (redirects)
│   ├── components/       # React components
│   │   ├── Hyperspeed.jsx   # Login background
│   │   └── Vortex.jsx       # Chat background
│   ├── lib/              # Utilities
│   │   ├── firebase.js   # Firebase client
│   │   ├── api.js        # Backend API client
│   │   └── voice.js      # Voice features
│   └── public/           # Static files
│       └── logo.jpg      # App logo
│
├── backend/              # Express API server
│   ├── config/           
│   │   └── firebase.js   # Firebase Admin
│   ├── lib/
│   │   └── ai.js         # AI integration
│   ├── routes/
│   │   ├── chat.js       # Chat endpoints
│   │   ├── files.js      # File management
│   │   └── gmail.js      # Gmail integration
│   └── server.js         # Main server
│
├── setup.ps1             # Automated setup script
├── run-backend.ps1       # Start backend
├── run-frontend.ps1      # Start frontend
└── README.md             # This file
```

## 🎓 Features Explained

### Voice Mode with Auto-Response
When voice mode is active:
1. Microphone captures your speech
2. Speech-to-text converts it to message
3. AI processes and responds
4. **After 2 seconds of inactivity**, AI speaks the response automatically
5. This creates a natural conversation flow!

### Dual AI System
- **Gemini**: Best for factual, technical questions
- **DeepSeek**: Best for creative, conversational responses
- System intelligently chooses which to prioritize
- Both run in parallel for faster responses

### Weekly Chat History
- Conversations automatically organized by week
- Format: "Week 1 October", "Week 2 October", etc.
- Easy to find and review old conversations
- Each week can be loaded separately

## 💡 Tips & Tricks

1. **Voice Commands**: Try natural language like "Hey Ridhi, what's calculus?"
2. **File Queries**: After uploading, ask "What's the main topic?" or "Summarize this"
3. **Context**: The AI remembers the last 10 messages for context
4. **Mobile**: Works on mobile browsers! Try it on your phone

## 🤝 Need Help?

- Check the documentation in each folder
- Review the code comments
- Open an issue on GitHub
- Check console logs for errors

## 🎉 You're All Set!

Enjoy using Ridhi.ai! Happy learning! 🚀

---

**Note**: This is a student project. Use it for educational purposes and feel free to customize it!
