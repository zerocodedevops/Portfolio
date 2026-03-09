# export-session.ps1 — Export a conversation summary and brain to the local repository
# Usage: pwsh scripts/export-session.ps1

$rootDir = Split-Path -Parent $PSScriptRoot
$localBrainBase = "$env:USERPROFILE\.gemini\antigravity\brain"
$sessionFolder = Join-Path $rootDir ".ai-session"
$brainDest = Join-Path $sessionFolder "brain"

if (-not (Test-Path $sessionFolder)) {
    New-Item -ItemType Directory -Path $sessionFolder -Force | Out-Null
}

if (-not (Test-Path $brainDest)) {
    New-Item -ItemType Directory -Path $brainDest -Force | Out-Null
}

$latestBrain = Get-ChildItem $localBrainBase | Where-Object { $_.PSIsContainer -and $_.Name -match "^[a-f0-9-]{36}$" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($latestBrain) {
    Write-Host "🧠 Exporting brain state from: $($latestBrain.Name)" -ForegroundColor Magenta
    # Clean previous remote brain
    Remove-Item -Path "$brainDest\*" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Copy new brain
    Copy-Item -Path "$($latestBrain.FullName)\*" -Destination $brainDest -Recurse -Force
    Write-Host "✅ AI Session context exported to repository (.ai-session/brain)!" -ForegroundColor Green
} else {
    Write-Host "⚠️ No local AI conversation found to export." -ForegroundColor Yellow
}
