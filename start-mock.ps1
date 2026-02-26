# ============================================================================
# CRM Foursys - Frontend Mock - Script Completo (PowerShell)
# ============================================================================
# Versão: 2.0
# Data: 14/02/2026
# Funcionalidades:
# - Verifica Node.js instalado
# - Instala dependências automaticamente (se necessário)
# - Limpa cache se houver problemas
# - Inicia servidor de desenvolvimento
# - Opções de debug e porta customizada
# ============================================================================

param(
    [switch]$Clean,      # Limpar cache antes de iniciar
    [switch]$Fresh,      # Instalação limpa (remove node_modules)
    [switch]$Debug,      # Modo debug
    [int]$Port = 3000,   # Porta customizada
    [switch]$Host        # Expor para rede local
)

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Banner
Clear-Host
Write-ColorOutput "==========================================" "Cyan"
Write-ColorOutput "  CRM FOURSYS - FRONTEND MOCK v2.0" "Cyan"
Write-ColorOutput "==========================================" "Cyan"
Write-Host ""

# Verificar Node.js
Write-ColorOutput "[1/5] Verificando Node.js..." "Yellow"
try {
    $nodeVersion = node --version
    Write-ColorOutput "✓ Node.js instalado: $nodeVersion" "Green"
    
    $npmVersion = npm --version
    Write-ColorOutput "✓ NPM instalado: v$npmVersion" "Green"
} catch {
    Write-ColorOutput "✗ ERRO: Node.js não encontrado!" "Red"
    Write-ColorOutput "Por favor, instale Node.js: https://nodejs.org/" "Red"
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit 1
}
Write-Host ""

# Limpar instalação se solicitado
if ($Fresh) {
    Write-ColorOutput "[2/5] Limpando instalação anterior..." "Yellow"
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-ColorOutput "✓ node_modules removido" "Green"
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
        Write-ColorOutput "✓ package-lock.json removido" "Green"
    }
    Write-Host ""
}

# Limpar cache se solicitado
if ($Clean -or $Fresh) {
    Write-ColorOutput "[2/5] Limpando cache..." "Yellow"
    if (Test-Path "node_modules/.vite") {
        Remove-Item -Recurse -Force "node_modules/.vite"
        Write-ColorOutput "✓ Cache Vite limpo" "Green"
    }
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-ColorOutput "✓ Pasta dist removida" "Green"
    }
    Write-Host ""
} else {
    Write-ColorOutput "[2/5] Verificando cache... (OK)" "Green"
    Write-Host ""
}

# Verificar/instalar dependências
Write-ColorOutput "[3/5] Verificando dependências..." "Yellow"
if (-not (Test-Path "node_modules")) {
    Write-ColorOutput "Instalando dependências do NPM..." "Yellow"
    Write-ColorOutput "(Isso pode levar 1-2 minutos...)" "Gray"
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Dependências instaladas com sucesso!" "Green"
    } else {
        Write-ColorOutput "✗ ERRO ao instalar dependências!" "Red"
        Write-Host ""
        Read-Host "Pressione ENTER para sair"
        exit 1
    }
} else {
    Write-ColorOutput "✓ Dependências já instaladas" "Green"
}
Write-Host ""

# Type checking (opcional, rápido)
Write-ColorOutput "[4/5] Verificando tipos TypeScript..." "Yellow"
$typeCheck = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "✓ Nenhum erro de tipos encontrado" "Green"
} else {
    Write-ColorOutput "⚠ Avisos de tipos encontrados (não crítico)" "Yellow"
}
Write-Host ""

# Construir comando de inicialização
$viteCommand = "vite"
$viteArgs = @()

if ($Debug) {
    $viteArgs += "--debug"
}

if ($Host) {
    $viteArgs += "--host"
}

if ($Port -ne 3000) {
    $viteArgs += "--port", $Port
}

# Iniciar servidor
Write-ColorOutput "[5/5] Iniciando servidor de desenvolvimento..." "Yellow"
Write-Host ""
Write-ColorOutput "==========================================" "Cyan"
Write-ColorOutput "  APLICAÇÃO INICIANDO..." "Cyan"
Write-ColorOutput "==========================================" "Cyan"
Write-Host ""

$url = if ($Host) { "http://0.0.0.0:$Port" } else { "http://localhost:$Port" }
Write-ColorOutput "URL Local:    http://localhost:$Port" "Green"

if ($Host) {
    Write-ColorOutput "URL Network:  Verifique o console para o IP da rede" "Green"
}

if ($Debug) {
    Write-ColorOutput "Modo Debug:   ATIVO" "Yellow"
}

Write-Host ""
Write-ColorOutput "Funcionalidades Mock disponíveis:" "Cyan"
Write-ColorOutput "  • Lista de Contatos:    $url/contacts" "Gray"
Write-ColorOutput "  • Detalhes do Contato:  $url/contacts/:id" "Gray"
Write-ColorOutput "  • Mock API:             10 endpoints funcionais" "Gray"
Write-ColorOutput "  • Mock Data:            25 registros (localStorage)" "Gray"
Write-Host ""
Write-ColorOutput "Pressione CTRL+C para parar o servidor" "Gray"
Write-Host ""
Write-ColorOutput "==========================================" "Cyan"
Write-Host ""

# Executar Vite
if ($viteArgs.Count -gt 0) {
    npx $viteCommand $viteArgs
} else {
    npx $viteCommand
}
