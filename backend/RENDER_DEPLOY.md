# Render Deployment Guide for Ridhi.ai Backend

## Quick Deploy to Render

### Step 1: Prepare Your Code

1. Ensure your code is pushed to GitHub
2. Make sure `.gitignore` excludes `.env` (already done)
3. Verify `package.json` has correct start script

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Select your repository: `Ridhi.ai`
3. Configure the service:

#### Basic Settings
```
Name: ridhi-ai-backend
Region: Choose closest to your users
Branch: main
Root Directory: backend
```

#### Build Settings
```
Runtime: Node
Build Command: npm install
Start Command: npm start
```

#### Instance Type
```
Free Tier: Free (with limitations)
Starter: $7/month (recommended for production)
```

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add each of these:

#### Server Config
```
PORT=4000
NODE_ENV=production
```

#### Firebase Admin (REQUIRED - Get from Firebase Console)
```
FIREBASE_PROJECT_ID=ridhiaiproject
FIREBASE_CLIENT_EMAIL=your-service-account@ridhiaiproject.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_ACTUAL_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"
```

**How to get Firebase Admin credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: ridhiaiproject
3. Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy values from downloaded JSON

#### AI API Keys (Already provided)
```
GEMINI_API_KEY=AIzaSyBeI5lJjxvHpPgU9uOhLyScDVUKc6kjjyI
DEEPSEEK_API_KEY=sk-adf8e40b351c4dfb8aeb776121d89688
```

#### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### URL Configuration (IMPORTANT)
```
BACKEND_URL=https://ridhi-ai-backend.onrender.com
FRONTEND_URL=https://ridhi-ai.vercel.app
```

**Note**: Replace with your actual URLs:
- `BACKEND_URL`: Your Render service URL (shown after deploy)
- `FRONTEND_URL`: Your Vercel frontend URL

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait for deployment to complete (5-10 minutes)

### Step 6: Get Your Backend URL

After deployment completes:
1. Copy the URL (e.g., `https://ridhi-ai-backend.onrender.com`)
2. Update `BACKEND_URL` environment variable in Render with this URL
3. Update `NEXT_PUBLIC_BACKEND_URL` in Vercel frontend with this URL

## Post-Deployment Configuration

### 1. Update Frontend

In your Vercel frontend environment variables:
```
NEXT_PUBLIC_BACKEND_URL=https://ridhi-ai-backend.onrender.com
```

### 2. Update Google OAuth

Add to authorized redirect URIs:
```
https://ridhi-ai.vercel.app/api/auth/callback/google
```

### 3. Test Your Backend

Visit: `https://your-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "message": "Ridhi.ai Backend is running"
}
```

## Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin down takes 30-60 seconds
- 750 hours/month free (shared across all services)

### Upgrade to Starter ($7/month) for:
- Always-on service (no spin down)
- Faster response times
- More resources

### Environment Variables

**CRITICAL**: The `FIREBASE_PRIVATE_KEY` must:
- Be wrapped in double quotes
- Keep the `\n` characters (don't replace with actual newlines)
- Include the BEGIN and END markers

Example:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n"
```

## Monitoring & Logs

### View Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. See real-time server logs

### Check Metrics
- CPU usage
- Memory usage
- Request count
- Response times

## Troubleshooting

### Deployment Failed
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` scripts are correct

### Server Crashes
- Check logs for error messages
- Verify Firebase credentials are correct
- Check API keys are valid

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check CORS configuration in `server.js`
- Ensure frontend is using correct backend URL

### Firebase Errors
- Double-check Firebase Admin credentials
- Verify service account has correct permissions
- Check private key format (must include \n)

## Automatic Deployments

Render automatically deploys when you push to GitHub:
- Pushes to `main` branch trigger deployments
- See deployment history in dashboard
- Rollback to previous versions if needed

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate auto-generates

## Scaling

### Vertical Scaling
Upgrade instance type:
- Free → Starter → Standard → Pro

### Horizontal Scaling
Add more instances (Pro plan):
- Load balancing automatic
- Shared environment variables

## Database Recommendations

For production, consider:
- Keep Firebase Firestore (already set up)
- Or add Render PostgreSQL
- Or add MongoDB Atlas

## Security Best Practices

1. **Never commit `.env` files** (already in .gitignore)
2. **Rotate API keys regularly**
3. **Use Render's environment groups** for shared configs
4. **Enable HTTPS only** (automatic on Render)
5. **Set up Firebase security rules**

## Backup & Recovery

### Database Backups
- Firebase Firestore: Auto-backed up by Google
- Export data regularly via Firebase Console

### Environment Variables
- Keep a secure backup of all env vars
- Use password manager or encrypted file

## Performance Optimization

1. **Enable compression** (already in code)
2. **Set up caching** headers
3. **Optimize database queries**
4. **Monitor response times**
5. **Use CDN** for static assets

## Cost Estimation

### Free Tier
```
Backend: Free
Total: $0/month
```

### Production Ready
```
Backend Starter: $7/month
Total: $7/month
```

### High Traffic
```
Backend Standard: $25/month
Total: $25/month
```

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Status Page](https://status.render.com)

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Check performance metrics
- Update dependencies monthly
- Review API usage
- Rotate sensitive keys quarterly

### Updates
```bash
# Local testing
cd backend
npm update
npm test
git commit -am "Update dependencies"
git push
# Render auto-deploys
```

## Emergency Procedures

### If Backend Goes Down
1. Check Render status page
2. Check logs for errors
3. Verify environment variables
4. Try manual restart
5. Rollback to previous deploy if needed

### If High Error Rate
1. Check logs immediately
2. Verify API keys are valid
3. Check Firebase status
4. Check third-party API status
5. Scale up if needed

---

**You're all set! Your backend is now running on Render! 🚀**
