@echo off
REM ============================================================================
REM CRM Foursys - Frontend Mock - Script de Execução (Windows CMD)
REM ============================================================================
REM Data: 14/02/2026
REM ============================================================================

echo.
echo ==========================================
echo   CRM FOURSYS - FRONTEND MOCK
echo ==========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Mostrar versão do Node.js
echo [INFO] Node.js instalado:
node --version
echo.

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo [1/2] Instalando dependencias do NPM...
    echo (Isso pode levar 1-2 minutos...)
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas com sucesso!
    echo.
) else (
    echo [INFO] Dependencias ja instaladas (node_modules/ existe)
    echo.
)

REM Iniciar servidor de desenvolvimento
echo [2/2] Iniciando servidor de desenvolvimento...
echo.
echo ==========================================
echo   APLICACAO INICIANDO...
echo ==========================================
echo.
echo URL: http://localhost:3000
echo.
echo Pressione CTRL+C para parar o servidor
echo.

call npm run dev
