# ============================================================================
# CRM FOURSYS - GUIA RÁPIDO DE EXECUÇÃO
# ============================================================================

## 🚀 Opção 1: Script Automático (Recomendado)

### Windows PowerShell:
```powershell
cd "C:\Cursor_Codigo\CRM\frontend"
.\START.ps1
```

## 🔧 Opção 2: Comandos Manuais

### Passo 1: Navegar para pasta
```powershell
cd "C:\Cursor_Codigo\CRM\frontend"
```

### Passo 2: Instalar dependências (primeira vez)
```powershell
npm install
```
⏱️ Tempo: 1-2 minutos

### Passo 3: Rodar aplicação
```powershell
npm run dev
```

✅ **Aplicação abrirá em:** `http://localhost:3000`

---

## 📋 Comandos Disponíveis

```powershell
# Desenvolvimento (localhost:3000)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

---

## 🧪 Testar Funcionalidades

### 1. Lista de Contatos
- ✅ Ver tabela com 5 contatos
- ✅ Buscar por "João"
- ✅ Selecionar múltiplos contatos
- ✅ Deletar contato
- ✅ Testar paginação

### 2. Detalhes do Contato
- ✅ Clicar em qualquer linha
- ✅ Ver informações completas
- ✅ Navegar entre tabs

### 3. Mock API
- ✅ Abrir DevTools (F12)
- ✅ Ver logs de API calls no Console
- ✅ Verificar LocalStorage

---

## 🐛 Problemas Comuns

### Erro: "npm não reconhecido"
**Solução:** Instalar Node.js → https://nodejs.org/

### Porta 3000 ocupada
**Solução:** Editar `vite.config.ts` e mudar porta para 3001

### Limpar dados mock
**Console do navegador:**
```javascript
localStorage.clear()
location.reload()
```

---

## 📚 Documentação

- `README.md` - Documentação completa
- `CONCLUSAO_FRONTEND_MOCK.md` - Resumo do projeto
- `@CRM/user-stories/frontend/` - User Stories

---

✅ **Frontend Mock 100% Funcional!**
