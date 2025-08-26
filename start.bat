@echo off
echo Iniciando Secretario2...
echo.
echo Si es la primera vez que ejecutas la aplicacion, 
echo asegurate de haber instalado las dependencias con: npm install
echo.

@echo off
cd /d %~dp0

setlocal enabledelayedexpansion

REM Ejecutar electron en el proyecto actual
& npx electron .