# Rollback Script for Heritage Data
# Run this to restore original data if you don't like the new version

Write-Host "Rolling back to original heritage data..." -ForegroundColor Yellow

$dataPath = "C:\Users\nagar\OneDrive\Documents\College\FINAL YEAR PROJECT\tamilnadu-heritage-explorer\server\data"

# Check if backups exist
if (Test-Path "$dataPath\heritage.json.BACKUP") {
    Copy-Item "$dataPath\heritage.json.BACKUP" "$dataPath\heritage.json" -Force
    Write-Host "✓ Heritage data restored from backup" -ForegroundColor Green
} else {
    Write-Host "✗ No heritage backup found!" -ForegroundColor Red
}

if (Test-Path "$dataPath\crafts.json.BACKUP") {
    Copy-Item "$dataPath\crafts.json.BACKUP" "$dataPath\crafts.json" -Force
    Write-Host "✓ Crafts data restored from backup" -ForegroundColor Green
} else {
    Write-Host "✗ No crafts backup found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Rollback complete! Restart your server to see original data." -ForegroundColor Cyan
