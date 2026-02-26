# CRM Foursys - Frontend Mock (React + TypeScript + Material-UI)

Frontend mock do CRM B2B Tech Foursys para validação de telas em localhost.

## 🚀 Stack Tecnológico

- **React 18** - Library UI
- **TypeScript 5** - Type safety
- **Vite** - Build tool ultra-rápido
- **Material-UI v5** - Component library
- **React Router v6** - Navegação
- **Mock API** - Simulação de backend com localStorage

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (localhost:3000)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📂 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── LeadScoreBadge.tsx
│   │   └── LifecycleStageBadge.tsx
│   ├── pages/                # Páginas principais
│   │   ├── ContactsListPage.tsx
│   │   └── ContactDetailPage.tsx
│   ├── mock/                 # Mock data & API
│   │   ├── data.ts          # Dados mockados
│   │   └── api.ts           # API mock com localStorage
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── styles/               # Estilos e tema
│   │   └── theme.ts         # Tema Foursys (Material-UI)
│   ├── App.tsx               # App principal
│   └── main.tsx              # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System Foursys

### Cores Principais
- **Primary (Azul Foursys):** `#0052CC`
- **Secondary (Laranja):** `#FF8C00`
- **Success (Verde):** `#00B341`
- **Error (Vermelho):** `#E53E3E`

### Lead Score Colors
- 🔥 **Hot (70-100):** `#E53E3E` (Vermelho)
- ⚡ **Warm (40-69):** `#FFB800` (Amarelo)
- ❄️ **Cold (0-39):** `#00B4D8` (Azul claro)

### Typography
- **Font Family:** Inter (Google Fonts)
- **Font Weights:** 400 (regular), 600 (semibold), 700 (bold)

## 🧩 Funcionalidades Implementadas

### ✅ Página de Contatos (`/contacts`)
- [x] Listagem de contatos com tabela responsiva
- [x] Busca full-text (nome, email, cargo)
- [x] Lead Score badge visual (Hot/Warm/Cold)
- [x] Lifecycle Stage badge
- [x] Seleção múltipla com checkbox
- [x] Ações em lote (deletar, exportar)
- [x] Paginação (10, 20, 50, 100 itens)
- [x] Menu de ações (ver, editar, duplicar, deletar)
- [x] Loading skeleton
- [x] Error handling

### ✅ Página de Detalhes (`/contacts/:id`)
- [x] Header com informações principais
- [x] Lead Score visual
- [x] Informações de contato (email, telefone)
- [x] Buying Committee role
- [x] Tags
- [x] Tabs: Visão Geral, Atividades, Deals, Arquivos
- [x] Breadcrumb de navegação

### ✅ Mock API Service
- [x] `contacts.list()` - Listagem com filtros e paginação
- [x] `contacts.getById()` - Buscar por ID
- [x] `contacts.create()` - Criar contato
- [x] `contacts.update()` - Atualizar contato
- [x] `contacts.delete()` - Soft delete
- [x] `contacts.bulkDelete()` - Deletar múltiplos
- [x] LocalStorage persistence
- [x] Simula latência de rede (200-500ms)
- [x] Validações (email único, campos obrigatórios)

### ✅ Dados Mock
- 4 usuários (owners)
- 4 contas (empresas B2B)
- 5 contatos com Lead Scores variados
- 1 pipeline com 5 stages
- 4 deals em diferentes stages
- 4 atividades (email, call, meeting, system event)

## 🎯 Próximas Implementações (Roadmap)

### Frontend (Fase 2)
- [ ] Modal de criar/editar contato
- [ ] Filtros avançados (sidebar)
- [ ] Timeline de atividades (tab)
- [ ] Página de Accounts
- [ ] Página de Deals
- [ ] Pipeline Kanban (drag & drop)
- [ ] Dashboard com charts

### Backend Integration (Fase 3)
- [ ] Substituir Mock API por Axios real
- [ ] Conectar com backend .NET
- [ ] Autenticação JWT
- [ ] Upload de arquivos

## 📝 Comandos Úteis

```bash
# Limpar cache do localStorage (reset dados mock)
# Abrir Console do navegador e executar:
localStorage.clear()

# Lint
npm run lint

# Type checking
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@mui/material'"
```bash
npm install
```

### Porta 3000 já em uso
Editar `vite.config.ts` e mudar a porta:
```typescript
server: {
  port: 3001, // Mudar aqui
}
```

### Dados mock não aparecem
Limpar localStorage e recarregar página:
```javascript
localStorage.clear()
location.reload()
```

## 📚 Documentação

- **User Stories Frontend:** `@CRM/user-stories/frontend/`
- **Specs Técnicas:** `@CRM/specs/SPEC_MASTER_UNIFICADA_v2.0.md`
- **Design System:** `@CRM/specs/` (Foursys theme)

## 👥 Time

- **Desenvolvido por:** AI Agent + Cursor IDE
- **Data:** Fevereiro 2026
- **Cliente:** Foursys Tecnologia

---

**Status:** ✅ MVP Mock Completo e Funcional
**Versão:** 1.0.0
