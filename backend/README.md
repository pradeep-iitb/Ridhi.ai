# Ridhi.ai Backend API

Backend API server for Ridhi.ai - Unified AI Assistant for Students

## 🚀 Features

- **AI Chat Integration**: Dual AI (Gemini + DeepSeek) with intelligent response merging
- **File Management**: Upload, process, and query PDFs and documents
- **Gmail Integration**: Read, send, and manage emails via OAuth
- **Firebase Integration**: Authentication, Firestore, and Storage
- **Weekly Chat History**: Organized conversation tracking

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project created
- API keys for Gemini and DeepSeek
- Google OAuth credentials

## 🛠️ Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your credentials in `.env`:
   - Firebase Admin SDK credentials
   - AI API keys (Gemini, DeepSeek)
   - Google OAuth credentials

## 🏃 Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:4000` by default.

## 📡 API Endpoints

### Chat Routes (`/api/chat`)
- `POST /message` - Send message and get AI response
- `GET /history/:userId` - Get chat history
- `GET /weeks/:userId` - Get list of chat weeks
- `DELETE /history/:userId` - Clear chat history

### File Routes (`/api/files`)
- `POST /upload` - Upload file
- `GET /list/:userId` - List user files
- `GET /:fileId` - Get file details
- `POST /query` - Query file content with AI
- `DELETE /:fileId` - Delete file

### Gmail Routes (`/api/gmail`)
- `GET /auth-url` - Get OAuth URL
- `POST /set-tokens` - Exchange code for tokens
- `POST /list` - List emails
- `POST /read` - Read specific email
- `POST /send` - Send email

## 🔒 Security

- CORS configured for frontend origins
- File size limits enforced
- Firebase security rules recommended
- Environment variables for secrets

## 📦 Deployment

### Render.com (Recommended)

#### Option 1: Using render.yaml (Easy)
1. Push code to GitHub
2. Go to Render Dashboard
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will detect `render.yaml` and configure automatically
6. Add environment variables in Render dashboard

#### Option 2: Manual Setup
1. Create new Web Service
2. Connect your repository
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from `.env`

See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for detailed instructions.

## 🤝 Contributing

This is a student project. Feel free to suggest improvements!

## 📄 License

MIT
