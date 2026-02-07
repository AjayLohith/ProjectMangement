#!/bin/bash
# Bash script to prepare project for submission
# Removes unnecessary files before uploading to Google Drive

echo "🧹 Preparing project for submission..."

# Remove node_modules
echo "Removing node_modules..."
rm -rf node_modules
rm -rf server/node_modules
rm -rf client/node_modules

# Remove build outputs
echo "Removing build outputs..."
rm -rf client/dist
rm -rf client/build

# Remove .env files (keep .env.example)
echo "Removing .env files (keeping .env.example)..."
rm -f server/.env
rm -f client/.env

# Remove log files
echo "Removing log files..."
find . -name "*.log" -type f -delete

# Remove uploads (keep .gitkeep)
echo "Cleaning uploads folder..."
find server/uploads -type f ! -name ".gitkeep" -delete

# Remove cache files
echo "Removing cache files..."
rm -rf .cache
rm -rf client/.vite

echo "✅ Project cleaned and ready for submission!"
echo ""
echo "📋 Next steps:"
echo "1. Upload the entire project folder to Google Drive"
echo "2. Set folder permissions to 'Anyone with the link can view'"
echo "3. Copy the shareable link"
echo "4. Add the link to your .docx submission file"

