@echo off
title ODD GEN Spatial AI Test
cd /d "%~dp0\nt-suite - Copy\nt-suite"
node server/src/routes/spatial.js
pause
