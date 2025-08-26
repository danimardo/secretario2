@echo off
title Secretario AI
echo ========================================
echo        SECRETARIO AI - INICIANDO
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando instalacion...
if not exist "node_modules" (
    echo ERROR: Dependencias no instaladas.
    echo Ejecuta primero: instalar.bat
    echo.
    pause
    exit /b 1
)

echo Iniciando Secretario AI...
echo.
echo Para cerrar la aplicacion:
echo   - Cierra la ventana de la aplicacion
echo   - O presiona Ctrl+C en esta ventana
echo.

npm start

echo.
echo Secretario AI se ha cerrado.
pause
