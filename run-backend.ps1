# Ridhi.ai - Run Backend
# Starts the backend server

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Starting Ridhi.ai Backend" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "Backend server starting on http://localhost:4000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
