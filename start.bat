@echo off
start powershell -NoExit ./gradleb.bat
start powershell -NoExit -Command "cd ./frontend/; npm start"
start git-bash
:: FOR /F "tokens=*" %%a in ('cd') do SET OUTPUT=%%a
::start /MIN idea.bat "%OUTPUT%"
start /MIN idea.bat