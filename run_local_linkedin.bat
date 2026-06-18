@echo off
title LA27 Hybrid LinkedIn Agent
echo Starting LA27 Hybrid LinkedIn Agent...
"C:\Users\timhe\AppData\Local\Programs\Python\Python313\python.exe" "%~dp0agents\linkedin_local_agent.py" %*
if %errorlevel% neq 0 (
    echo.
    echo Script encountered an error. Trying with default python command...
    python "%~dp0agents\linkedin_local_agent.py" %*
)
echo.
pause
