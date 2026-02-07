# PowerShell script to prepare project for submission
# Removes unnecessary files before uploading to Google Drive

Write-Host "🧹 Preparing project for submission..." -ForegroundColor Cyan

# Remove node_modules
Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "server/node_modules") { Remove-Item -Recurse -Force "server/node_modules" }
if (Test-Path "client/node_modules") { Remove-Item -Recurse -Force "client/node_modules" }

# Remove build outputs
Write-Host "Removing build outputs..." -ForegroundColor Yellow
if (Test-Path "client/dist") { Remove-Item -Recurse -Force "client/dist" }
if (Test-Path "client/build") { Remove-Item -Recurse -Force "client/build" }

# Remove .env files (keep .env.example)
Write-Host "Removing .env files (keeping .env.example)..." -ForegroundColor Yellow
if (Test-Path "server/.env") { Remove-Item -Force "server/.env" }
if (Test-Path "client/.env") { Remove-Item -Force "client/.env" }

# Remove log files
Write-Host "Removing log files..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Filter "*.log" | Remove-Item -Force

# Remove uploads (keep .gitkeep)
Write-Host "Cleaning uploads folder..." -ForegroundColor Yellow
Get-ChildItem "server/uploads" -Exclude ".gitkeep" | Remove-Item -Force

# Remove cache files
Write-Host "Removing cache files..." -ForegroundColor Yellow
if (Test-Path ".cache") { Remove-Item -Recurse -Force ".cache" }
if (Test-Path "client/.vite") { Remove-Item -Recurse -Force "client/.vite" }

Write-Host "✅ Project cleaned and ready for submission!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload the entire project folder to Google Drive" -ForegroundColor White
Write-Host "2. Set folder permissions to 'Anyone with the link can view'" -ForegroundColor White
Write-Host "3. Copy the shareable link" -ForegroundColor White
Write-Host "4. Add the link to your .docx submission file" -ForegroundColor White

