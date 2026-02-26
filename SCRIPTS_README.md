# 🚀 SCRIPTS DISPONÍVEIS - CRM Foursys Frontend Mock

Este diretório contém vários scripts para executar a aplicação frontend com mock data.

---

## 📋 Scripts Disponíveis

### 1. **START.ps1** (PowerShell Simples) ⭐ RECOMENDADO
Script básico e rápido para iniciar a aplicação.

```powershell
.\START.ps1
```

**Features:**
- ✅ Verifica Node.js
- ✅ Instala dependências automaticamente
- ✅ Inicia servidor na porta 3000

---

### 2. **start-mock.ps1** (PowerShell Avançado) 🔧
Script completo com opções avançadas e limpeza de cache.

```powershell
# Execução básica
.\start-mock.ps1

# Limpar cache antes de iniciar
.\start-mock.ps1 -Clean

# Instalação limpa (remove node_modules)
.\start-mock.ps1 -Fresh

# Modo debug
.\start-mock.ps1 -Debug

# Porta customizada
.\start-mock.ps1 -Port 3001

# Expor para rede local
.\start-mock.ps1 -Host

# Combinações
.\start-mock.ps1 -Clean -Port 3001
.\start-mock.ps1 -Fresh -Debug -Host
```

**Features:**
- ✅ Todas as features do START.ps1
- ✅ Limpeza de cache Vite
- ✅ Instalação limpa (fresh install)
- ✅ Modo debug
- ✅ Porta customizada
- ✅ Expor para rede local
- ✅ Type checking TypeScript

---

### 3. **start.bat** (Windows CMD/Batch)
Script para Command Prompt do Windows.

```cmd
start.bat
```

**Features:**
- ✅ Compatível com CMD
- ✅ Verifica Node.js
- ✅ Instala dependências automaticamente

---

### 4. **start.sh** (Linux/Mac Bash)
Script para sistemas Unix (Linux/Mac).

```bash
# Dar permissão de execução (primeira vez)
chmod +x start.sh

# Executar
./start.sh
```

**Features:**
- ✅ Compatível com Bash
- ✅ Verifica Node.js
- ✅ Instala dependências automaticamente

---

## 📦 Comandos NPM Disponíveis

### Desenvolvimento
```powershell
# Iniciar servidor (porta 3000)
npm run dev

# Iniciar com debug
npm run dev:debug

# Iniciar e expor para rede local
npm run dev:host

# Iniciar em porta customizada (3001)
npm run dev:port
```

### Build & Preview
```powershell
# Build para produção
npm run build

# Preview do build
npm run preview

# Preview em porta específica
npm run preview:port
```

### Linting & Type Checking
```powershell
# Lint
npm run lint

# Type check (sem build)
npm run type-check
```

### Limpeza
```powershell
# Limpar dist
npm run clean

# Limpar cache Vite
npm run clean:cache

# Instalação limpa
npm run install:clean
```

### Atalhos
```powershell
# Alias para npm run dev
npm start

# Iniciar com cache limpo
npm run start:fresh
```

---

## 🎯 Guia Rápido por Cenário

### 💻 **Primeira Execução**
```powershell
# PowerShell (Recomendado)
.\START.ps1

# OU Command Prompt
start.bat

# OU Linux/Mac
./start.sh
```

### 🔄 **Problemas com Cache**
```powershell
# PowerShell
.\start-mock.ps1 -Clean

# NPM
npm run start:fresh
```

### 🆕 **Reinstalação Completa**
```powershell
# PowerShell
.\start-mock.ps1 -Fresh

# OU Manual
npm run install:clean
npm start
```

### 🌐 **Testar em Outro Dispositivo (mesma rede)**
```powershell
# PowerShell
.\start-mock.ps1 -Host

# NPM
npm run dev:host
```
Acesse via: `http://<SEU_IP>:3000`

### 🐛 **Modo Debug**
```powershell
# PowerShell
.\start-mock.ps1 -Debug

# NPM
npm run dev:debug
```

### 🔌 **Porta Ocupada (usar 3001)**
```powershell
# PowerShell
.\start-mock.ps1 -Port 3001

# NPM
npm run dev:port
```

---

## 🚨 Troubleshooting

### Erro: "Não é possível executar scripts neste sistema"
**PowerShell Execution Policy**

```powershell
# Verificar policy atual
Get-ExecutionPolicy

# Habilitar execução de scripts (temporário)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Executar script
.\START.ps1
```

### Erro: "node não é reconhecido"
**Node.js não instalado**

1. Baixar Node.js: https://nodejs.org/
2. Instalar versão LTS
3. Reiniciar PowerShell/CMD
4. Verificar: `node --version`

### Erro: "npm install falhou"
**Problemas de rede/permissão**

```powershell
# Limpar cache npm
npm cache clean --force

# Tentar instalação novamente
npm install

# Se persistir, usar instalação limpa
.\start-mock.ps1 -Fresh
```

### Erro: "Porta 3000 já está em uso"
**Outra aplicação usando a porta**

```powershell
# Opção 1: Usar porta diferente
.\start-mock.ps1 -Port 3001

# Opção 2: Matar processo na porta 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Aplicação não carrega / Tela branca
**Cache corrompido**

```powershell
# Limpar cache e reiniciar
.\start-mock.ps1 -Clean

# Se persistir, instalação limpa
.\start-mock.ps1 -Fresh
```

### Dados mock não aparecem
**LocalStorage precisa ser resetado**

1. Abrir DevTools (F12)
2. Console tab
3. Executar:
```javascript
localStorage.clear()
location.reload()
```

---

## 📊 Comparação de Scripts

| Feature | START.ps1 | start-mock.ps1 | start.bat | start.sh |
|---------|-----------|----------------|-----------|----------|
| Verifica Node.js | ✅ | ✅ | ✅ | ✅ |
| Instala deps auto | ✅ | ✅ | ✅ | ✅ |
| Limpa cache | ❌ | ✅ | ❌ | ❌ |
| Instalação limpa | ❌ | ✅ | ❌ | ❌ |
| Porta customizada | ❌ | ✅ | ❌ | ❌ |
| Modo debug | ❌ | ✅ | ❌ | ❌ |
| Network host | ❌ | ✅ | ❌ | ❌ |
| Type checking | ❌ | ✅ | ❌ | ❌ |
| **Complexidade** | Simples | Avançado | Simples | Simples |
| **Recomendado para** | Dia-a-dia | Debug/Setup | CMD | Linux/Mac |

---

## ✨ Recomendações

### Uso Diário
```powershell
.\START.ps1
```
Rápido e simples para desenvolvimento normal.

### Primeira Vez / Problemas
```powershell
.\start-mock.ps1 -Fresh
```
Garante instalação limpa.

### Apresentação / Demo
```powershell
.\start-mock.ps1 -Host
```
Permite acesso de outros dispositivos na rede.

### Debug de Erros
```powershell
.\start-mock.ps1 -Clean -Debug
```
Limpa cache e mostra logs detalhados.

---

## 📞 Suporte

Se nenhum script funcionar:

1. Verificar Node.js instalado: `node --version`
2. Verificar NPM: `npm --version`
3. Executar manualmente:
```powershell
npm install
npm run dev
```
4. Abrir DevTools (F12) e verificar erros no Console

---

**Escolha o script que melhor se adequa ao seu cenário!** 🚀
