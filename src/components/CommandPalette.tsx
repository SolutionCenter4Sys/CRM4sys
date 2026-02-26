import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  HomeOutlined as HomeOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  BusinessOutlined as BusinessOutlinedIcon,
  WorkOutline as WorkOutlineIcon,
  TrackChangesOutlined as TrackChangesOutlinedIcon,
  InsightsOutlined as InsightsOutlinedIcon,
  AutoAwesomeMotionOutlined as AutoAwesomeMotionOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  ArticleOutlined as ArticleOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  PersonAdd as PersonAddIcon,
  BusinessCenter as BusinessCenterIcon,
  NoteAdd as NoteAddIcon,
  SpaceDashboardOutlined as SpaceDashboardOutlinedIcon,
  Keyboard as KeyboardIcon,
} from '@mui/icons-material';

interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  group: 'Páginas' | 'Ações Rápidas';
  keywords: string[];
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const go = useCallback(
    (to: string) => {
      navigate(to);
      onClose();
    },
    [navigate, onClose]
  );

  const allItems: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Visão executiva e KPIs',
      icon: <HomeOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['dashboard', 'home', 'inicio', 'kpi', 'mrr'],
      action: () => go('/dashboard'),
    },
    {
      id: 'analytics',
      label: 'Dashboard Analítico',
      subtitle: 'Análises e métricas avançadas',
      icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['analytics', 'analitico', 'metricas', 'analise'],
      action: () => go('/dashboard/analytics'),
    },
    {
      id: 'contacts',
      label: 'Contatos',
      subtitle: 'Gerenciar pessoas e contatos',
      icon: <ContactsOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['contatos', 'contacts', 'pessoas', 'clientes'],
      action: () => go('/contacts'),
      shortcut: 'G C',
    },
    {
      id: 'accounts',
      label: 'Empresas',
      subtitle: 'Contas e organizações',
      icon: <BusinessOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['empresas', 'accounts', 'organizacoes', 'contas'],
      action: () => go('/accounts'),
      shortcut: 'G E',
    },
    {
      id: 'deals',
      label: 'Negócios',
      subtitle: 'Pipeline de vendas',
      icon: <WorkOutlineIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['negocios', 'deals', 'pipeline', 'oportunidades', 'vendas'],
      action: () => go('/deals'),
      shortcut: 'G N',
    },
    {
      id: 'leads',
      label: 'Leads',
      subtitle: 'Gestão de leads e prospecção',
      icon: <TrackChangesOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['leads', 'prospeccao', 'prospectos'],
      action: () => go('/leads'),
      shortcut: 'G L',
    },
    {
      id: 'lifecycle',
      label: 'Lifecycle Funnel',
      subtitle: 'Funil de ciclo de vida',
      icon: <InsightsOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['lifecycle', 'funil', 'ciclo', 'vida', 'conversao'],
      action: () => go('/lifecycle'),
    },
    {
      id: 'nurture',
      label: 'Nurture Sequences',
      subtitle: 'Sequências de nutrição e automação',
      icon: <AutoAwesomeMotionOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['nurture', 'sequencias', 'nutricao', 'automacao', 'email'],
      action: () => go('/nurture'),
    },
    {
      id: 'activities',
      label: 'Atividades',
      subtitle: 'Timeline de atividades e tarefas',
      icon: <TimelineOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['atividades', 'activities', 'tarefas', 'timeline', 'agenda'],
      action: () => go('/activities'),
    },
    {
      id: 'proposals',
      label: 'Propostas',
      subtitle: 'Criar e gerenciar propostas comerciais',
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['propostas', 'proposals', 'comercial', 'orcamento'],
      action: () => go('/proposals'),
    },
    {
      id: 'contracts',
      label: 'Contratos',
      subtitle: 'Gestão de contratos e assinaturas',
      icon: <ArticleOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['contratos', 'contracts', 'assinaturas'],
      action: () => go('/contracts'),
    },
    {
      id: 'reports',
      label: 'Relatórios',
      subtitle: 'Reports e análises de desempenho',
      icon: <AssessmentOutlinedIcon fontSize="small" />,
      group: 'Páginas',
      keywords: ['relatorios', 'reports', 'analise', 'desempenho', 'resultados'],
      action: () => go('/reports'),
    },
    {
      id: 'new-contact',
      label: 'Novo Contato',
      subtitle: 'Criar um novo contato',
      icon: <PersonAddIcon fontSize="small" />,
      group: 'Ações Rápidas',
      keywords: ['novo contato', 'criar contato', 'add contact', 'new contact'],
      action: () => go('/contacts?action=new'),
      shortcut: 'N C',
    },
    {
      id: 'new-deal',
      label: 'Novo Negócio',
      subtitle: 'Criar uma nova oportunidade de venda',
      icon: <BusinessCenterIcon fontSize="small" />,
      group: 'Ações Rápidas',
      keywords: ['novo negocio', 'criar negocio', 'nova oportunidade', 'new deal'],
      action: () => go('/deals?action=new'),
      shortcut: 'N N',
    },
    {
      id: 'new-lead',
      label: 'Novo Lead',
      subtitle: 'Registrar um novo lead',
      icon: <AddCircleOutlineIcon fontSize="small" />,
      group: 'Ações Rápidas',
      keywords: ['novo lead', 'criar lead', 'add lead', 'new lead'],
      action: () => go('/leads?action=new'),
      shortcut: 'N L',
    },
    {
      id: 'new-proposal',
      label: 'Nova Proposta',
      subtitle: 'Criar uma nova proposta comercial',
      icon: <NoteAddIcon fontSize="small" />,
      group: 'Ações Rápidas',
      keywords: ['nova proposta', 'criar proposta', 'new proposal'],
      action: () => go('/proposals?action=new'),
    },
  ];

  const filtered = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const searchable = [item.label, item.subtitle ?? '', ...item.keywords]
          .join(' ')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return searchable.includes(q);
      })
    : allItems;

  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  const flatFiltered = groups.flatMap((g) => filtered.filter((i) => i.group === g));

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatFiltered[activeIndex]) {
        flatFiltered[activeIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  let flatIndex = 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          mt: '10vh',
          verticalAlign: 'top',
        },
      }}
      BackdropProps={{ sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.4)' } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <InputAdornment position="start" sx={{ mr: 1.5 }}>
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
          </InputAdornment>
          <InputBase
            inputRef={inputRef}
            fullWidth
            placeholder="Buscar páginas, ações, contatos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ fontSize: 16, '& input': { p: 0 } }}
          />
          <Chip
            label="ESC"
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, height: 22, cursor: 'pointer', color: 'text.disabled', borderColor: 'divider' }}
            onClick={onClose}
          />
        </Box>

        {/* Results */}
        <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
          {flatFiltered.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nenhum resultado para <strong>"{query}"</strong>
              </Typography>
            </Box>
          ) : (
            <List ref={listRef} dense disablePadding>
              {groups.map((group, gi) => {
                const groupItems = filtered.filter((i) => i.group === group);
                return (
                  <React.Fragment key={group}>
                    {gi > 0 && <Divider />}
                    <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8 }}
                      >
                        {group}
                      </Typography>
                    </Box>
                    {groupItems.map((item) => {
                      const currentIndex = flatIndex++;
                      const isActive = currentIndex === activeIndex;
                      return (
                        <ListItemButton
                          key={item.id}
                          selected={isActive}
                          onClick={item.action}
                          onMouseEnter={() => setActiveIndex(currentIndex)}
                          sx={{
                            px: 2,
                            py: 0.75,
                            mx: 1,
                            borderRadius: 1.5,
                            mb: 0.25,
                            '&.Mui-selected': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                              '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' },
                              '&:hover': { bgcolor: 'primary.dark' },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            secondary={item.subtitle}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          {item.shortcut && (
                            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                              {item.shortcut.split(' ').map((k) => (
                                <Chip
                                  key={k}
                                  label={k}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 11,
                                    bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'action.hover',
                                    color: 'inherit',
                                    fontFamily: 'monospace',
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </ListItemButton>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <KeyboardIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { keys: ['↑', '↓'], label: 'navegar' },
              { keys: ['↵'], label: 'selecionar' },
              { keys: ['ESC'], label: 'fechar' },
            ].map(({ keys, label }) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {keys.map((k) => (
                  <Chip
                    key={k}
                    label={k}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: 10, fontFamily: 'monospace', color: 'text.disabled', borderColor: 'divider' }}
                  />
                ))}
                <Typography variant="caption" color="text.disabled">
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
