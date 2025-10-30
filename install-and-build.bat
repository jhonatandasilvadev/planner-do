@echo off
echo ========================================
echo   Planner do John - Instalacao e Build
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [2/3] Criando versao instalavel...
call npm run build

echo.
echo [3/3] Criando versao portable...
call npm run build-portable

echo.
echo ========================================
echo   Build concluido com sucesso!
echo ========================================
echo.
echo Os arquivos estao na pasta "dist/"
echo - Instalador: dist/Planner do John Setup.exe
echo - Portable: dist/Planner do John.exe
echo.
pause

