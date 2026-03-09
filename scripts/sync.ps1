# sync.ps1 — Pull and sync the monorepo in one command
# Usage: pwsh scripts/sync.ps1

Write-Host "`n🔄 Syncing monorepo..." -ForegroundColor Cyan

# Pull root repo
Write-Host "`n📦 Pulling from GitHub (Portfolio)..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Failed to pull repository" -ForegroundColor Red
    exit 1 
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n✅ Everything is up to date!" -ForegroundColor Green

# 3. Import AI Session from the repository
pwsh (Join-Path $PSScriptRoot "import-session.ps1")
