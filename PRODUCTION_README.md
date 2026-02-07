# Production Deployment - Quick Start

## 🚀 Quick Deploy Guide

### Backend (Render) - 5 Minutes

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Settings**:
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
   - Environment: `Node`
4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=generate_with_openssl_rand_base64_32
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
5. **Deploy** → Copy your Render URL

### Frontend (Vercel) - 3 Minutes

1. **Create Vercel Account**: https://vercel.com
2. **Import Project** → Select GitHub repo
3. **Settings**:
   - Framework: `Vite`
   - Root Directory: `client`
   - Build: `npm run build`
   - Output: `dist`
4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```
5. **Deploy** → Your app is live!

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0 for Render)
- [ ] JWT_SECRET generated (32+ characters)
- [ ] GitHub repository ready
- [ ] All environment variables documented

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] MongoDB password is strong
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] No sensitive data in code
- [ ] Environment variables set in deployment platform

## 🧪 Post-Deployment Testing

1. **Health Check**: `https://your-api.onrender.com/health`
2. **Login Test**: Use test credentials
3. **API Test**: Verify all endpoints work
4. **CORS Test**: Frontend can call backend
5. **Database Test**: Create/view projects

## 📊 Monitoring

- **Render**: Dashboard → Logs
- **Vercel**: Dashboard → Analytics
- **MongoDB Atlas**: Monitoring tab

## 🆘 Common Issues

**Backend won't start**
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**CORS errors**
- Verify CLIENT_URL matches Vercel URL exactly
- Check CORS configuration in server.js

**Database connection fails**
- Whitelist Render IPs in MongoDB Atlas
- Verify MONGODB_URI format
- Check database user permissions

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions.

