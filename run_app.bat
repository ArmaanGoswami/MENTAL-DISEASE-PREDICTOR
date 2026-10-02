@echo off
title Antigravity - Mental Disease & Burnout Risk Predictor Launcher
echo =========================================================================
echo               ANTIGRAVITY AI ML FULLSTACK APPLICATION
echo            "Lifting the Heavy Weight of Burnout & Stress"
echo =========================================================================
echo.
echo [1/2] Starting Flask AI/ML Backend Server on http://127.0.0.1:5000 ...
start "Antigravity Backend API" cmd /k "cd /d %~dp0backend && python app.py"

echo [2/2] Starting React Vite Frontend Server on http://localhost:5173 ...
start "Antigravity React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================================================
echo  Application is launching!
echo  Frontend UI:  http://localhost:5173
echo  Backend API:  http://127.0.0.1:5000/api/health
echo =========================================================================
echo.
pause
