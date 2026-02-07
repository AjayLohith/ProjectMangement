# MongoDB Setup Guide

## Current Issue

Your server is failing to connect to MongoDB Atlas. The error indicates:
- **IP Address not whitelisted**: Your current IP address needs to be added to MongoDB Atlas IP whitelist
- **Connection timeout**: The server cannot reach the MongoDB Atlas cluster

## Solutions

### Option 1: Fix MongoDB Atlas Connection (Recommended for Production)

1. **Whitelist Your IP Address**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to your cluster → **Network Access** (or **Security** → **Network Access**)
   - Click **Add IP Address**
   - Click **Add Current IP Address** (or manually enter your IP)
   - For development, you can temporarily allow all IPs: `0.0.0.0/0` (⚠️ **Not recommended for production**)

2. **Verify Connection String**
   - Check your `.env` file in the `server` directory
   - Ensure `MONGODB_URI` is correct
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

3. **Check Cluster Status**
   - Ensure your MongoDB Atlas cluster is running
   - Verify you have the correct username and password

### Option 2: Use Local MongoDB (Recommended for Development)

If you have MongoDB installed locally:

1. **Install MongoDB** (if not installed)
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

2. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/pixelforge-nexus
   ```

3. **Start MongoDB**
   - Windows: MongoDB should start as a service automatically
   - Or run: `mongod` (if installed manually)

### Option 3: Use MongoDB Atlas with 0.0.0.0/0 (Temporary - Development Only)

⚠️ **WARNING**: This allows access from any IP address. Only use for development!

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0`
3. Add comment: "Development - Temporary"
4. **Remember to remove this after development!**

## Quick Fix Steps

1. **Check your .env file** in `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

2. **Whitelist your IP in MongoDB Atlas**:
   - Login to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Go to **Network Access**
   - Click **Add IP Address**
   - Click **Add Current IP Address**

3. **Restart the server**:
   ```powershell
   # Stop the server (Ctrl+C)
   npm start
   ```

## Testing the Connection

After fixing the connection, you should see:
```
✓ MongoDB Connected successfully
Server running on port 5000
```

If you still see errors, check:
- MongoDB Atlas cluster is running
- Username and password are correct
- Database name exists
- Network connectivity (firewall, VPN, etc.)

## Environment Variables Template

Create `server/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Option 1: MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixelforge-nexus

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/pixelforge-nexus

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Connection String Format: https://docs.mongodb.com/manual/reference/connection-string/
- IP Whitelist Guide: https://docs.atlas.mongodb.com/security-whitelist/

