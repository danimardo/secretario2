@echo off
echo ========================================
echo    INSTALADOR DE SECRETARIO AI
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor, descarga e instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version

echo.
echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo Para ejecutar Secretario AI:
echo   1. Ejecuta: npm start
echo   2. O usa el archivo: ejecutar.bat
echo.
echo Configuracion inicial:
echo   - Obtener token API en: https://console.mistral.ai/
echo   - Hacer clic en el boton de configuracion (engranaje)
echo   - Pegar el token y guardar
echo.
pause
