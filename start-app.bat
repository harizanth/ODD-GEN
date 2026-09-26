@echo off
title ODD GEN Enterprise App
echo ========================================================
echo        Starting ODD GEN Enterprise Local App...
echo ========================================================
echo.

cd /d "%~dp0\nt-suite - Copy\nt-suite"

echo Starting server and client services...
start "" http://localhost:5173
npm run dev

pause
