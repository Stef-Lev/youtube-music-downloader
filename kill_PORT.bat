@echo off
setlocal enabledelayedexpansion

set "port=3099"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr /r /c:":%port% .* LISTENING"') do (
    set "pid=%%a"
)

if defined pid (
    echo Killing process with PID !pid!...
    taskkill /F /PID !pid!
) else (
    echo No process running on port %port%.
)
