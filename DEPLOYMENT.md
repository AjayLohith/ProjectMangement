# Deployment Guide - PixelForge Nexus

This guide covers deploying the PixelForge Nexus application to Vercel (Frontend) and Render (Backend).

## Architecture

- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js/Express API deployed on Render
- **Database**: MongoDB Atlas

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (free tier available)

## Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster (free tier)
2. Create a database user
3. Whitelist IP addresses:
   - For Render: Add `0.0.0.0/0` (allows all IPs) or Render's IP ranges
   - For local development: Add your current IP
4. Get your connection string:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pixelforge-nexus-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or Starter for production)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_secret_key_here
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your Render URL (e.g., `https://pixelforge-nexus-api.onrender.com`)

### Option B: Using render.yaml

1. Push your code to GitHub
2. In Render dashboard, select "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect `render.yaml` and deploy

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-render-api-url.onrender.com/api
   ```

6. Click "Deploy"
7. Wait for deployment to complete
8. Your app will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
cd client
npm install -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

## Step 4: Update CORS Settings

After deployment, update your backend CORS settings:

1. Go to Render dashboard → Your service → Environment
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-project.vercel.app
   ```
3. Redeploy the service

## Step 5: Seed Database

After deployment, seed your database with test users:

1. Option A: Use Render Shell
   - Go to Render dashboard → Your service → Shell
   - Run: `cd server && node seeder.js`

2. Option B: Use MongoDB Atlas
   - Connect to your database
   - Run the seeder script locally pointing to production DB

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] CORS is configured correctly
- [ ] Database is seeded with test users
- [ ] Login functionality works
- [ ] All API endpoints are accessible
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (automatic on both platforms)

## Troubleshooting

### Backend Issues

**Connection Timeout**
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI is correct
- Check Render logs for errors

**CORS Errors**
- Verify CLIENT_URL matches your Vercel URL exactly
- Check CORS configuration in server.js

**500 Errors**
- Check Render logs
- Verify all environment variables are set
- Ensure database connection is working

### Frontend Issues

**API Calls Failing**
- Verify VITE_API_URL is set correctly
- Check browser console for CORS errors
- Ensure backend is running

**Build Failures**
- Check Vercel build logs
- Verify all dependencies are in package.json
- Check for TypeScript/ESLint errors

## Production Optimizations

### Backend
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Error handling
- ✅ MongoDB connection pooling

### Frontend
- ✅ Production build optimizations
- ✅ Code minification
- ✅ Environment-based API URLs
- ✅ Error boundaries
- ✅ Loading states

## Monitoring

### Render
- View logs in Render dashboard
- Set up health checks
- Monitor uptime

### Vercel
- View analytics in Vercel dashboard
- Monitor build times
- Check function logs

## Security Notes

1. **Never commit `.env` files** - Use environment variables in deployment platforms
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Keep dependencies updated** - Regularly update npm packages
4. **Enable MongoDB Atlas IP restrictions** - Only allow necessary IPs
5. **Use HTTPS** - Both Vercel and Render provide HTTPS automatically

## Scaling

### Free Tier Limits
- **Render**: 750 hours/month, sleeps after 15 min inactivity
- **Vercel**: 100GB bandwidth/month
- **MongoDB Atlas**: 512MB storage

### Upgrade Path
- **Render Starter**: $7/month - No sleep, better performance
- **Vercel Pro**: $20/month - More bandwidth, better analytics
- **MongoDB Atlas M10**: $57/month - Better performance, backups

## Support

For issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection
5. Review CORS settings

