# Ridhi.ai - Run Frontend
# Starts the frontend development server

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Starting Ridhi.ai Frontend" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "Frontend server starting on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
