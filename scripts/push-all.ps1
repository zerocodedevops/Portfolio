# push-all.ps1 — Commit and push the monorepo in one command
# Usage: pwsh scripts/push-all.ps1 "your commit message"

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Message
)

$rootDir = Split-Path -Parent $PSScriptRoot

Write-Host "`n🔄 Pushing monorepo with message: `"$Message`"" -ForegroundColor Cyan

# 0. Export AI Session to the repository
pwsh (Join-Path $PSScriptRoot "export-session.ps1")

# 1. Commit and Push root repository
Push-Location $rootDir

$status = git status --porcelain
if ($status) {
    Write-Host "`n📦 Staging and committing changes..." -ForegroundColor Yellow
    git add -A
    git commit -m $Message --no-verify
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
else {
    Write-Host "`n✔️  No changes to commit" -ForegroundColor DarkGray
}

Write-Host "🚀 Pushing to GitHub (Portfolio)..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
else {
    Write-Host "✅ Done!" -ForegroundColor Green
}

Pop-Location
Write-Host "`n🎉 Monorepo pushed successfully!" -ForegroundColor Green
