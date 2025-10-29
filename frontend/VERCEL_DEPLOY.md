# Vercel Deployment Guide for Ridhi.ai Frontend

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js
6. Add environment variables (see below)
7. Click "Deploy"!

### Option 2: Vercel CLI

```bash
npm install -g vercel
cd frontend
vercel
```

## Environment Variables to Add in Vercel

Go to your project settings → Environment Variables and add:

### Firebase Config (Already provided - copy from .env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAZlKw4_-aXIzV3agzbRgpdxYEIEBpFaPA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ridhiaiproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ridhiaiproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ridhiaiproject.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=476510178597
NEXT_PUBLIC_FIREBASE_APP_ID=1:476510178597:web:bded871d1a7adf9d329ecc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E43QLV0D42
```

### Google OAuth
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### URLs (Update with your actual URLs)
```
NEXT_PUBLIC_BACKEND_URL=https://ridhi-ai-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://ridhi-ai.vercel.app
```

**IMPORTANT**: Replace the URLs above with your actual deployment URLs:
- `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL
- `NEXT_PUBLIC_FRONTEND_URL`: Your Vercel app URL (shown after first deploy)

## Deployment Settings

### Root Directory
```
frontend
```

### Framework Preset
```
Next.js
```

### Build Command (auto-detected)
```
npm run build
```

### Output Directory (auto-detected)
```
.next
```

### Install Command (auto-detected)
```
npm install
```

## Post-Deployment Steps

1. **Get Your Vercel URL**: After first deployment, Vercel provides a URL like `https://ridhi-ai-xxx.vercel.app`

2. **Update Environment Variables**: 
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_FRONTEND_URL` with your actual Vercel URL

3. **Update Backend CORS**:
   - Add your Vercel URL to backend's `FRONTEND_URL` environment variable in Render

4. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Add your Vercel URL to authorized redirect URIs:
     - `https://your-app.vercel.app/api/auth/callback/google`

5. **Redeploy**: After updating environment variables, trigger a new deployment

## Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update environment variables with new domain

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

### Environment Variables Not Working
- Must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables
- Check they're set for "Production" environment

### CORS Errors
- Verify backend has your Vercel URL in CORS whitelist
- Check `NEXT_PUBLIC_BACKEND_URL` is correct
- Backend must be deployed and running

### Authentication Issues
- Verify Firebase config is correct
- Check Google OAuth redirect URIs include Vercel URL
- Ensure Firebase Auth domain is authorized

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **main branch** → Production deployment
- **Other branches** → Preview deployments

## Performance Optimization

Vercel automatically optimizes:
- Image optimization
- Automatic HTTPS
- Global CDN
- Edge caching

## Monitoring

View in Vercel Dashboard:
- Real-time logs
- Performance analytics
- Deployment history
- Error tracking

## Rollback

If something breaks:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- Check Vercel dashboard logs for errors
