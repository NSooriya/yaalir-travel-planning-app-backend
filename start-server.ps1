# TamilNadu Heritage Explorer - Start Backend Server

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot"

Write-Host "Server will run on: http://localhost:5000" -ForegroundColor Green
Write-Host "API endpoints: http://localhost:5000/api" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm start
