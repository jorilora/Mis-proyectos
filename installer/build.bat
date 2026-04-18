@echo off
title Preparar Cartera en Mora - Instalador
echo ============================================
echo   Preparando instalador de Cartera en Mora
echo ============================================
echo.

echo [1/4] Compilando backend...
cd /d "%~dp0..\backend"
call npm install
if %errorlevel% neq 0 ( echo. & echo ERROR: Fallo npm install en backend & pause & exit /b 1 )
call npm run build
if %errorlevel% neq 0 ( echo. & echo ERROR: Fallo la compilacion del backend & pause & exit /b 1 )
echo     Backend OK

echo [2/4] Compilando frontend...
cd /d "%~dp0..\frontend"
call npm install
if %errorlevel% neq 0 ( echo. & echo ERROR: Fallo npm install en frontend & pause & exit /b 1 )
call npm run build
if %errorlevel% neq 0 ( echo. & echo ERROR: Fallo la compilacion del frontend & pause & exit /b 1 )
echo     Frontend OK

echo [3/4] Abriendo Inno Setup para generar el instalador...
cd /d "%~dp0"
set ISCC="C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if not exist %ISCC% set ISCC="C:\Program Files\Inno Setup 6\ISCC.exe"
if not exist %ISCC% (
    echo.
    echo Inno Setup no encontrado. Abriendo el script manualmente...
    echo Presiona F9 en Inno Setup para compilar.
    start "" "cartera-mora.iss"
    pause
    exit /b 0
)
%ISCC% cartera-mora.iss
if %errorlevel% neq 0 ( echo. & echo ERROR: Fallo la compilacion del instalador & pause & exit /b 1 )

echo.
echo [4/4] Listo!
echo El instalador fue creado en: installer\Cartera-en-Mora-Setup.exe
echo.
pause
