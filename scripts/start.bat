@echo off
title Cartera en Mora

REM Subir un nivel desde la carpeta scripts/ hasta la raiz del proyecto
cd /d "%~dp0.."

REM Verificar que el backend compilado existe
if not exist "backend\dist\index.js" (
    echo ERROR: La aplicacion no esta instalada correctamente.
    echo Por favor ejecuta el instalador nuevamente.
    pause
    exit /b 1
)

echo Iniciando Cartera en Mora...
echo.

REM Arrancar el servidor en segundo plano
start /b "" node backend\dist\index.js

REM Esperar 3 segundos a que el servidor levante
timeout /t 3 /nobreak > nul

REM Abrir el navegador
start "" "http://localhost:3000"

echo Aplicacion iniciada correctamente.
echo Accede en: http://localhost:3000
echo.
echo Para detener la aplicacion, usa "Detener Cartera en Mora" del menu inicio.
