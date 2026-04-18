@echo off
title Detener Cartera en Mora

echo Deteniendo Cartera en Mora...

REM Buscar y matar el proceso que usa el puerto 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a > nul 2>&1
)

echo Aplicacion detenida correctamente.
timeout /t 2 /nobreak > nul
