import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type EmptyVariant = 'contacts' | 'deals' | 'leads' | 'companies' | 'reports' | 'notifications' | 'search' | 'generic';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const illustrations: Record<EmptyVariant, React.ReactNode> = {
  contacts: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <circle cx="60" cy="35" r="22" fill="#EDE9FE" />
      <circle cx="60" cy="30" r="12" fill="#C4B5FD" />
      <ellipse cx="60" cy="55" rx="22" ry="14" fill="#C4B5FD" opacity="0.5" />
      <circle cx="30" cy="42" r="14" fill="#EDE9FE" />
      <circle cx="30" cy="38" r="8" fill="#DDD6FE" />
      <ellipse cx="30" cy="55" rx="14" ry="9" fill="#DDD6FE" opacity="0.4" />
      <circle cx="90" cy="42" r="14" fill="#EDE9FE" />
      <circle cx="90" cy="38" r="8" fill="#DDD6FE" />
      <ellipse cx="90" cy="55" rx="14" ry="9" fill="#DDD6FE" opacity="0.4" />
      <rect x="20" y="72" width="80" height="6" rx="3" fill="#EDE9FE" />
      <rect x="30" y="83" width="60" height="4" rx="2" fill="#F5F3FF" />
    </svg>
  ),
  deals: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="10" y="60" width="18" height="28" rx="3" fill="#C4B5FD" />
      <rect x="34" y="44" width="18" height="44" rx="3" fill="#8B5CF6" />
      <rect x="58" y="30" width="18" height="58" rx="3" fill="#7C3AED" />
      <rect x="82" y="48" width="18" height="40" rx="3" fill="#8B5CF6" opacity="0.6" />
      <circle cx="19" cy="56" r="5" fill="#7C3AED" />
      <circle cx="43" cy="40" r="5" fill="#7C3AED" />
      <circle cx="67" cy="26" r="5" fill="#5B21B6" />
      <circle cx="91" cy="44" r="5" fill="#7C3AED" opacity="0.8" />
      <polyline points="19,56 43,40 67,26 91,44" stroke="#5B21B6" strokeWidth="2" fill="none" strokeDasharray="4 2"/>
    </svg>
  ),
  leads: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <circle cx="60" cy="38" r="24" fill="#EDE9FE" />
      <circle cx="60" cy="34" r="14" fill="#8B5CF6" opacity="0.7" />
      <circle cx="60" cy="34" r="7" fill="#5B21B6" />
      <circle cx="60" cy="34" r="3" fill="#fff" />
      <path d="M60 14 L60 8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M78 20 L82 16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M84 38 L90 38" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M42 20 L38 16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M36 38 L30 38" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <rect x="20" y="72" width="80" height="6" rx="3" fill="#EDE9FE" />
      <rect x="35" y="83" width="50" height="4" rx="2" fill="#F5F3FF" />
    </svg>
  ),
  companies: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="30" y="30" width="60" height="55" rx="4" fill="#EDE9FE" />
      <rect x="38" y="40" width="12" height="12" rx="2" fill="#C4B5FD" />
      <rect x="54" y="40" width="12" height="12" rx="2" fill="#C4B5FD" />
      <rect x="70" y="40" width="12" height="12" rx="2" fill="#C4B5FD" />
      <rect x="38" y="58" width="12" height="12" rx="2" fill="#A78BFA" />
      <rect x="54" y="58" width="12" height="12" rx="2" fill="#A78BFA" />
      <rect x="70" y="58" width="12" height="12" rx="2" fill="#A78BFA" />
      <rect x="46" y="74" width="28" height="11" rx="2" fill="#8B5CF6" />
      <rect x="28" y="25" width="64" height="8" rx="2" fill="#7C3AED" />
    </svg>
  ),
  reports: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="25" y="20" width="70" height="68" rx="5" fill="#EDE9FE" />
      <rect x="35" y="34" width="50" height="5" rx="2" fill="#C4B5FD" />
      <rect x="35" y="44" width="38" height="5" rx="2" fill="#C4B5FD" />
      <rect x="35" y="54" width="44" height="5" rx="2" fill="#C4B5FD" />
      <rect x="35" y="66" width="20" height="12" rx="2" fill="#8B5CF6" />
      <rect x="60" y="58" width="20" height="20" rx="2" fill="#A78BFA" />
      <rect x="65" y="20" width="10" height="8" rx="2" fill="#7C3AED" />
    </svg>
  ),
  notifications: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <path d="M60 20 C45 20 35 32 35 48 L35 62 L25 72 L95 72 L85 62 L85 48 C85 32 75 20 60 20Z" fill="#EDE9FE" />
      <circle cx="60" cy="80" r="8" fill="#C4B5FD" />
      <circle cx="60" cy="16" r="6" fill="#16A34A" />
      <path d="M57 16 L59 18 L64 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <circle cx="52" cy="44" r="26" stroke="#C4B5FD" strokeWidth="4" fill="#EDE9FE" />
      <line x1="70" y1="63" x2="90" y2="83" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
      <line x1="44" y1="44" x2="60" y2="44" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="36" x2="52" y2="52" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  generic: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="20" y="20" width="80" height="65" rx="8" fill="#EDE9FE" />
      <rect x="33" y="36" width="54" height="6" rx="3" fill="#C4B5FD" />
      <rect x="33" y="48" width="40" height="6" rx="3" fill="#DDD6FE" />
      <rect x="33" y="60" width="48" height="6" rx="3" fill="#DDD6FE" />
      <circle cx="60" cy="10" r="8" fill="#8B5CF6" opacity="0.3" />
    </svg>
  ),
};

const defaults: Record<EmptyVariant, { title: string; description: string; actionLabel: string }> = {
  contacts:      { title: 'Nenhum contato encontrado', description: 'Adicione seu primeiro contato ou ajuste os filtros de busca.', actionLabel: 'Novo Contato' },
  deals:         { title: 'Pipeline vazio', description: 'Crie o primeiro negócio e comece a acompanhar seu funil de vendas.', actionLabel: 'Novo Negócio' },
  leads:         { title: 'Nenhum lead ainda', description: 'Capture leads pelo formulário ou importe uma lista para começar.', actionLabel: 'Novo Lead' },
  companies:     { title: 'Nenhuma empresa cadastrada', description: 'Adicione empresas para organizar seus contatos e negócios.', actionLabel: 'Nova Empresa' },
  reports:       { title: 'Nenhum relatório criado', description: 'Crie seu primeiro relatório para visualizar o desempenho da equipe.', actionLabel: 'Criar Relatório' },
  notifications: { title: 'Tudo em dia!', description: 'Não há notificações pendentes no momento.', actionLabel: 'Ver Atividades' },
  search:        { title: 'Nenhum resultado', description: 'Tente palavras-chave diferentes ou verifique os filtros aplicados.', actionLabel: 'Limpar Filtros' },
  generic:       { title: 'Nada por aqui ainda', description: 'Este espaço está esperando por você.', actionLabel: 'Começar' },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) => {
  const def = defaults[variant];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        gap: 1,
      }}
    >
      <Box
        sx={{
          mb: 1,
          opacity: 0.9,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        {illustrations[variant]}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mt: 1 }}>
        {title ?? def.title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 340, lineHeight: 1.6 }}
      >
        {description ?? def.description}
      </Typography>

      {onAction && (
        <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onAction}
            sx={{ borderRadius: 99, px: 3 }}
          >
            {actionLabel ?? def.actionLabel}
          </Button>
          {onSecondary && secondaryLabel && (
            <Button
              variant="outlined"
              onClick={onSecondary}
              sx={{ borderRadius: 99, px: 3 }}
            >
              {secondaryLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
