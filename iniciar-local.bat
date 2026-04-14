@echo off
echo ================================
echo   WebRopa - Servidor Local
echo ================================
echo.
echo Abriendo en: http://localhost:8080
echo.
echo Presiona Ctrl+C para detener.
echo.
start "" "http://localhost:8080"
npx serve . -p 8080
pause
