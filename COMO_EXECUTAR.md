# 🚀 GUIA DE EXECUÇÃO RÁPIDA - CRM Foursys Frontend Mock

**Data:** 14/02/2026  
**Versão:** 1.0.0  
**Ambiente:** Windows PowerShell

---

## ⚡ EXECUÇÃO RÁPIDA (3 Comandos)

```powershell
# 1. Navegar para pasta
cd "C:\Cursor_Codigo\CRM\frontend"

# 2. Executar script
.\START.ps1

# 3. Aguardar abertura automática em http://localhost:3000
```

✅ **Pronto! A aplicação abrirá automaticamente no navegador.**

---

## 📋 Scripts Disponíveis

### 🟢 **START.ps1** - Execução Simples (Recomendado para uso diário)
```powershell
.\START.ps1
```
- Verifica Node.js
- Instala dependências automaticamente
- Inicia servidor porta 3000

### 🔵 **start-mock.ps1** - Execução Avançada (Recomendado para debug)
```powershell
# Básico
.\start-mock.ps1

# Com opções
.\start-mock.ps1 -Clean          # Limpar cache antes
.\start-mock.ps1 -Fresh          # Instalação limpa
.\start-mock.ps1 -Debug          # Modo debug
.\start-mock.ps1 -Port 3001      # Porta customizada
.\start-mock.ps1 -Host           # Expor para rede
.\start-mock.ps1 -Clean -Port 3001  # Combinado
```

### 🟡 **start.bat** - Command Prompt (Windows CMD)
```cmd
start.bat
```

### 🟣 **start.sh** - Bash (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

---

## 🎯 Escolha Seu Script

| Cenário | Script Recomendado | Comando |
|---------|-------------------|---------|
| **Primeira vez** | START.ps1 | `.\START.ps1` |
| **Uso diário** | START.ps1 | `.\START.ps1` |
| **Problemas/Cache** | start-mock.ps1 -Clean | `.\start-mock.ps1 -Clean` |
| **Reinstalar tudo** | start-mock.ps1 -Fresh | `.\start-mock.ps1 -Fresh` |
| **Porta ocupada** | start-mock.ps1 -Port 3001 | `.\start-mock.ps1 -Port 3001` |
| **Demo para equipe** | start-mock.ps1 -Host | `.\start-mock.ps1 -Host` |
| **Sem PowerShell** | start.bat | `start.bat` |
| **Linux/Mac** | start.sh | `./start.sh` |

---

## 🐛 Problemas Comuns

### ❌ "Não é possível executar scripts"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\START.ps1
```

### ❌ "node não reconhecido"
Instale Node.js: https://nodejs.org/

### ❌ "Porta 3000 ocupada"
```powershell
.\start-mock.ps1 -Port 3001
```

### ❌ Tela branca / Não carrega
```powershell
.\start-mock.ps1 -Clean
```

### ❌ Dados mock não aparecem
Abrir Console (F12):
```javascript
localStorage.clear()
location.reload()
```

---

## 📦 Comandos NPM Alternativos

Se preferir usar NPM diretamente:

```powershell
# Desenvolvimento
npm start                  # Alias para npm run dev
npm run dev                # Porta 3000
npm run dev:port           # Porta 3001
npm run dev:host           # Expor para rede

# Limpeza
npm run clean:cache        # Limpar cache Vite
npm run start:fresh        # Limpar cache + iniciar

# Build
npm run build              # Build produção
npm run preview            # Preview do build

# Qualidade
npm run lint               # ESLint
npm run type-check         # TypeScript check
```

---

## ✅ Checklist de Validação

Após executar a aplicação, verifique:

- [ ] Aplicação abriu em `http://localhost:3000`
- [ ] Página de Contatos carregou
- [ ] Tabela exibe 5 contatos
- [ ] Busca funciona (digite "João")
- [ ] Lead Score badges aparecem (🔥⚡❄️)
- [ ] Clicar em contato abre página de detalhes
- [ ] Tabs navegam corretamente
- [ ] Botões e menu funcionam

---

## 🎉 Sucesso!

Se a aplicação abriu em `http://localhost:3000` e você vê a lista de contatos, **está tudo funcionando perfeitamente!** 🎉

### Próximos passos:
1. Navegar pela aplicação
2. Testar todas funcionalidades
3. Validar UX/UI com equipe
4. Coletar feedback para melhorias

---

**💡 Dica:** Use `.\START.ps1` para uso diário e `.\start-mock.ps1 -Clean` se houver problemas.

**Documentação completa:** `README.md`  
**Troubleshooting:** `SCRIPTS_README.md`
