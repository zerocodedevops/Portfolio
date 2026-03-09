# import-session.ps1 — Read and restore the session state from the local repository
# Usage: pwsh scripts/import-session.ps1

$rootDir = Split-Path -Parent $PSScriptRoot
$localBrainBase = "$env:USERPROFILE\.gemini\antigravity\brain"
$sessionFolder = Join-Path $rootDir ".ai-session"
$remoteBrain = Join-Path $sessionFolder "brain"

if (-not (Test-Path $remoteBrain)) {
    Write-Host "`n⚠️ No exported session found in .ai-session/brain." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n📄 Importing AI session from repository..." -ForegroundColor Cyan

# 1. Restore Brain State
# Identify the most recent conversation brain folder (active conversation)
$localBrain = Get-ChildItem $localBrainBase | Where-Object { $_.PSIsContainer -and $_.Name -match "^[a-f0-9-]{36}$" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($localBrain) {
    Write-Host "`n🧠 Syncing brain context to current conversation: $($localBrain.Name)" -ForegroundColor Magenta
    # Clean local brain first (optional, but safer for consistency)
    Remove-Item -Path "$($localBrain.FullName)\*" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Copy contents of repo brain to local brain
    Copy-Item -Path "$remoteBrain\*" -Destination $localBrain.FullName -Recurse -Force
    Write-Host "✅ Brain internal state restored!" -ForegroundColor Green
}
else {
    Write-Host "`n❌ Could not restore brain state. No active local conversation found." -ForegroundColor Red
}

Write-Host "`n💡 The AI code assistant now has all the context from the previous session." -ForegroundColor Yellow
Write-Host "🚀 You can now ask: 'Continúa con la tarea según el plan restaurado'." -ForegroundColor Cyan
