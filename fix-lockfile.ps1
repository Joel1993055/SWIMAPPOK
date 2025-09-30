# Remove duplicate lockfile causing Next.js conflicts
Write-Host "🔧 Removing duplicate lockfile causing build conflicts..." -ForegroundColor Yellow

$lockfilePath = "C:\Users\joels\package-lock.json"

if (Test-Path $lockfilePath) {
    try {
        Remove-Item $lockfilePath -Force
        Write-Host "✅ Successfully removed duplicate lockfile" -ForegroundColor Green
        Write-Host "📍 Removed: $lockfilePath" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Error removing lockfile: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Try running PowerShell as Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️ No duplicate lockfile found at $lockfilePath" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your development server" -ForegroundColor White
Write-Host "2. Run: npm run dev:turbo" -ForegroundColor White
Write-Host "3. Build times should improve significantly" -ForegroundColor White