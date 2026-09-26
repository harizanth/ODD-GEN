@echo off
title ODD GEN Enterprise Production Server
echo ========================================================
echo        Starting ODD GEN Enterprise Local App...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Opening ODD GEN App in Browser...
start "" http://127.0.0.1:4000

echo [2/2] Running Local Production Node Server on http://127.0.0.1:4000
npm start

pause
