# 🚀 Deployment Guide - Complete Walkthrough

This guide walks you through deploying Ridhi.ai to production using Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- Render account (sign up with GitHub)
- Your code pushed to GitHub

## 🎯 Deployment Strategy

We'll deploy in this order:
1. **Backend to Render** (get backend URL first)
2. **Frontend to Vercel** (configure with backend URL)
3. **Update cross-references** (make them talk to each other)

---

## Part 1: Deploy Backend to Render 🔧

### Step 1: Push to GitHub

```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `Ridhi.ai` repository
5. Configure:

```
Name: ridhi-ai-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free (or Starter for production)
```

### Step 3: Add Environment Variables

Click "Advanced" and add these one by one:

```bash
# Server
NODE_ENV=production
PORT=4000

# Firebase Admin (Get from Firebase Console)
FIREBASE_PROJECT_ID=ridhiaiproject
FIREBASE_CLIENT_EMAIL=your-service-account@ridhiaiproject.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# AI APIs
GEMINI_API_KEY=AIzaSyBeI5lJjxvHpPgU9uOhLyScDVUKc6kjjyI
DEEPSEEK_API_KEY=sk-adf8e40b351c4dfb8aeb776121d89688

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# URLs (Update after getting actual URLs)
BACKEND_URL=https://ridhi-ai-backend.onrender.com
FRONTEND_URL=https://ridhi-ai.vercel.app
```

### Step 4: Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **ridhiaiproject**
3. Click ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Copy these values to Render:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters!)

### Step 5: Deploy!

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Once deployed, copy your backend URL (e.g., `https://ridhi-ai-backend.onrender.com`)

### Step 6: Update Backend URLs

1. Go to your Render service
2. Click "Environment"
3. Update these variables with your actual backend URL:
   - `BACKEND_URL` = your Render URL (e.g., `https://ridhi-ai-backend.onrender.com`)
   - `FRONTEND_URL` = keep as `https://ridhi-ai.vercel.app` for now
4. Click "Save Changes"

### Step 7: Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Should see:
```json
{
  "status": "ok",
  "message": "Ridhi.ai Backend is running"
}
```

✅ **Backend deployed successfully!**

---

## Part 2: Deploy Frontend to Vercel 🎨

### Step 1: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your `Ridhi.ai` repository
4. Configure:

```
Framework Preset: Next.js (auto-detected)
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### Step 2: Add Environment Variables

Click "Environment Variables" and add:

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAZlKw4_-aXIzV3agzbRgpdxYEIEBpFaPA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ridhiaiproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ridhiaiproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ridhiaiproject.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=476510178597
NEXT_PUBLIC_FIREBASE_APP_ID=1:476510178597:web:bded871d1a7adf9d329ecc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E43QLV0D42

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# IMPORTANT: Update with your actual Render backend URL
NEXT_PUBLIC_BACKEND_URL=https://ridhi-ai-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://ridhi-ai.vercel.app
```

**Important**: Replace `https://ridhi-ai-backend.onrender.com` with your actual Render URL from Part 1!

### Step 3: Deploy!

1. Click "Deploy"
2. Wait 2-5 minutes
3. Once deployed, copy your Vercel URL (e.g., `https://ridhi-ai-xxx.vercel.app`)

✅ **Frontend deployed successfully!**

---

## Part 3: Connect Frontend & Backend 🔗

### Step 1: Update Frontend URLs in Vercel

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Update `NEXT_PUBLIC_FRONTEND_URL` with your actual Vercel URL
4. Click "Save"
5. Go to "Deployments" tab
6. Click "..." → "Redeploy" on latest deployment

### Step 2: Update Backend URLs in Render

1. Go to Render Dashboard → Your Service
2. Click "Environment" tab
3. Update `FRONTEND_URL` with your actual Vercel URL
4. Click "Save Changes"
5. Service will auto-redeploy

### Step 3: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-actual-vercel-url.vercel.app/api/auth/callback/google
   ```
4. Click "Save"

---

## Part 4: Final Testing 🧪

### Test 1: Backend Health Check
Visit: `https://your-backend.onrender.com/health`

Expected: `{"status": "ok", "message": "Ridhi.ai Backend is running"}`

### Test 2: Frontend Loads
Visit: `https://your-frontend.vercel.app`

Expected: Should redirect to login page

### Test 3: Login
1. Click "Sign in with Google"
2. Should authenticate successfully
3. Should redirect to chat page

### Test 4: Send Message
1. Type "Hello" in chat
2. Should get AI response
3. Check browser console for errors

### Test 5: Voice Mode
1. Click microphone icon
2. Speak something
3. Should transcribe and respond

### Test 6: File Upload
1. Upload a PDF file
2. Should summarize the content

---

## 🎉 Success Checklist

- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ Environment variables configured
- ✅ URLs updated in both services
- ✅ Google OAuth redirect URIs updated
- ✅ Backend health check passes
- ✅ Frontend loads correctly
- ✅ Authentication works
- ✅ Chat functionality works
- ✅ Voice mode works
- ✅ File upload works

---

## 🔧 Quick Reference

### Your Deployment URLs
```
Backend (Render): https://ridhi-ai-backend.onrender.com
Frontend (Vercel): https://ridhi-ai.vercel.app
```

### Update Just the URLs
If you need to change URLs in the future, update these 4 places:

**Render (Backend):**
1. `BACKEND_URL` - Your Render URL
2. `FRONTEND_URL` - Your Vercel URL

**Vercel (Frontend):**
1. `NEXT_PUBLIC_BACKEND_URL` - Your Render URL
2. `NEXT_PUBLIC_FRONTEND_URL` - Your Vercel URL

After updating, both services auto-redeploy!

---

## 🆘 Troubleshooting

### Backend Issues

**"Service Unavailable"**
- Wait a few minutes (free tier spins down)
- Check Render logs for errors
- Verify environment variables

**"Firebase Error"**
- Check Firebase credentials are correct
- Verify private key format (must have `\n`)

### Frontend Issues

**"CORS Error"**
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check backend has frontend URL in CORS whitelist
- Check both services are deployed

**"Authentication Failed"**
- Verify Google OAuth redirect URI includes Vercel URL
- Check Firebase config is correct

**"API Not Responding"**
- Check backend URL is correct
- Verify backend is running (check health endpoint)
- Check browser console for errors

### General Issues

**"Environment Variables Not Working"**
- Must start with `NEXT_PUBLIC_` for frontend
- Redeploy after changing variables
- Check they're set for production environment

---

## 📱 Mobile App (Future)

To build mobile app with Expo:
1. Use same backend URL
2. Configure in `app.json`
3. Build with `eas build`
4. Submit to Play Store

---

## 💰 Cost Breakdown

### Free Tier (Testing)
- Render: Free (with spin down)
- Vercel: Free (hobby tier)
- Total: **$0/month**

### Production Ready
- Render Starter: $7/month
- Vercel Pro: $20/month
- Total: **$27/month**

---

## 🎓 You're Live!

Your Ridhi.ai app is now deployed and accessible worldwide! 🌍

Share your URLs:
- App: `https://your-app.vercel.app`
- API: `https://your-backend.onrender.com`

**Next Steps:**
- Share with friends for testing
- Monitor error logs
- Add custom domain (optional)
- Optimize performance
- Add more features!

---

**Congratulations! You've successfully deployed Ridhi.ai! 🎊**
