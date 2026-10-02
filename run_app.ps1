Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "              ANTIGRAVITY AI ML FULLSTACK APPLICATION                    " -ForegroundColor Green
Write-Host "           'Lifting the Heavy Weight of Burnout & Stress'                " -ForegroundColor White
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting Flask Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\backend'; python app.py"

Write-Host "[2/2] Starting React Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Both services launched successfully!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:   http://127.0.0.1:5000/api/health" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan
