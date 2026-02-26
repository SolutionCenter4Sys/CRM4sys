# ============================================================================
# CRM Foursys - Frontend Mock - Script de Instalação e Execução
# ============================================================================
# Data: 14/02/2026
# Ambiente: Windows PowerShell
# ============================================================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  CRM FOURSYS - FRONTEND MOCK SETUP" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para pasta do frontend
Write-Host "[1/4] Navegando para pasta do frontend..." -ForegroundColor Yellow
Set-Location -Path "C:\Cursor_Codigo\CRM\frontend"
Write-Host "✓ Pasta: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "[2/4] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Node.js: https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Instalar dependências
Write-Host "[3/4] Instalando dependências do NPM..." -ForegroundColor Yellow
Write-Host "(Isso pode levar 1-2 minutos...)" -ForegroundColor Gray
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ ERRO ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Executar aplicação
Write-Host "[4/4] Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  APLICAÇÃO INICIANDO..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione CTRL+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

npm run dev
