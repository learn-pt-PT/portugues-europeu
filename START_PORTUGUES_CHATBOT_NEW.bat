@echo off
cd /d "%~dp0"

echo ============================================
echo  Portugues Europeu Launcher
echo ============================================
echo Working directory: %CD%
echo.

:: Verify the HTML file exists here
if not exist "portugues_europeu.html" (
    echo ERROR: portugues_europeu.html not found in %CD%
    echo Make sure this .bat file is in the same folder as the HTML file.
    pause
    exit /b 1
)
echo Found: portugues_europeu.html

:: Verify Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found on PATH.
    echo Install Python from https://python.org and ensure "Add to PATH" is checked.
    pause
    exit /b 1
)
echo Found: python
echo.

:: Kill any existing server on port 8000
netstat -an | find "0.0.0.0:8000" >nul 2>&1
if %errorlevel% == 0 (
    echo Port 8000 already in use - killing existing process...
    for /f "tokens=5" %%a in ('netstat -aon ^| find "0.0.0.0:8000"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

:: Start the server in a visible window so errors are readable
echo Starting Python HTTP server on port 8000...
start "Portugues Server" cmd /k "python -m http.server 8000"
timeout /t 3 /nobreak >nul

:: Confirm server is actually listening
netstat -an | find "0.0.0.0:8000" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Server does not appear to be running after 3 seconds.
    echo Check the server window for error messages.
    pause
    exit /b 1
)
echo Server is running.
echo.

:: Open in Chrome, Edge, or default browser
set URL=http://localhost:8000/portugues_europeu.html

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Opening Chrome...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%URL%"
    goto done
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo Opening Chrome...
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%URL%"
    goto done
)
where msedge >nul 2>&1
if %errorlevel% == 0 (
    echo Chrome not found - opening Edge...
    start msedge "%URL%"
    goto done
)
echo Chrome and Edge not found - opening default browser...
start "" "%URL%"

:done
echo.
echo ============================================
echo  Server is running in the other window.
echo  Close that window to stop the server.
echo ============================================
pause
