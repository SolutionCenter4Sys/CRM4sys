#!/bin/bash
# ============================================================================
# CRM Foursys - Frontend Mock - Script de Execução (Linux/Mac)
# ============================================================================
# Data: 14/02/2026
# ============================================================================

echo ""
echo "=========================================="
echo "  CRM FOURSYS - FRONTEND MOCK"
echo "=========================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo "Por favor, instale Node.js: https://nodejs.org/"
    echo ""
    exit 1
fi

# Mostrar versão do Node.js
echo "[INFO] Node.js instalado:"
node --version
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "[1/2] Instalando dependências do NPM..."
    echo "(Isso pode levar 1-2 minutos...)"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "[ERRO] Falha ao instalar dependências!"
        exit 1
    fi
    echo ""
    echo "[OK] Dependências instaladas com sucesso!"
    echo ""
else
    echo "[INFO] Dependências já instaladas (node_modules/ existe)"
    echo ""
fi

# Iniciar servidor de desenvolvimento
echo "[2/2] Iniciando servidor de desenvolvimento..."
echo ""
echo "=========================================="
echo "  APLICAÇÃO INICIANDO..."
echo "=========================================="
echo ""
echo "URL: http://localhost:3000"
echo ""
echo "Pressione CTRL+C para parar o servidor"
echo ""

npm run dev
