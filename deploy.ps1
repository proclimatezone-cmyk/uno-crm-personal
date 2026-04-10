# UNO CRM Deployment Script
# Run this to push to GitHub and deploy to Vercel

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Emerald

# 1. GitHub
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "📦 Creating GitHub Repository..."
    gh repo create uno-crm --source=. --public --push
} else {
    Write-Host "⚠️ GitHub CLI (gh) not found. Please push manually to your repository." -ForegroundColor Yellow
}

# 2. Vercel
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "☁️ Deploying to Vercel..."
    vercel --prod
} else {
    Write-Host "⚠️ Vercel CLI not found. Please deploy manually via Vercel Dashboard." -ForegroundColor Yellow
}

Write-Host "✅ Deployment script finished." -ForegroundColor Green
