import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popover,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  NotificationsOutlined as NotificationsIcon,
  WarningAmberOutlined as WarningIcon,
  TrackChangesOutlined as LeadIcon,
  WorkOutline as DealIcon,
  EventBusy as OverdueIcon,
  CheckCircleOutline as WonIcon,
  InfoOutlined as InfoIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';

export type NotifSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  severity: NotifSeverity;
  category: 'deal' | 'lead' | 'task' | 'system';
  route?: string;
  read: boolean;
  createdAt: Date;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Negócio parado há 12 dias',
    body: 'TechCorp — Renovação Anual está sem atividade. Risco de perda.',
    severity: 'critical',
    category: 'deal',
    route: '/deals',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'n2',
    title: '3 leads sem follow-up',
    body: 'Marina Costa, João Alves e +1 aguardam resposta há mais de 48h.',
    severity: 'warning',
    category: 'lead',
    route: '/leads',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'n3',
    title: 'Negócio parado há 8 dias',
    body: 'Inova Solutions — Projeto Piloto sem atividade recente.',
    severity: 'warning',
    category: 'deal',
    route: '/deals',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: 'n4',
    title: 'Novo lead capturado',
    body: 'Felipe Martins — origem: formulário site. Score: Quente.',
    severity: 'info',
    category: 'lead',
    route: '/leads',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'n5',
    title: 'Negócio ganho! 🎉',
    body: 'Global Finance — Licença Enterprise fechada. R$ 48.000.',
    severity: 'success',
    category: 'deal',
    route: '/deals',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'n6',
    title: 'Tarefa vencida ontem',
    body: 'Enviar proposta revisada para StartupXYZ.',
    severity: 'critical',
    category: 'task',
    route: '/activities',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25),
  },
  {
    id: 'n7',
    title: 'Relatório semanal disponível',
    body: 'Pipeline da semana: 14 deals, R$ 320k em aberto.',
    severity: 'info',
    category: 'system',
    route: '/reports',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

const severityConfig: Record<NotifSeverity, { color: string; bg: string }> = {
  critical: { color: '#DC2626', bg: '#FEF2F2' },
  warning:  { color: '#D97706', bg: '#FFFBEB' },
  info:     { color: '#2563EB', bg: '#EFF6FF' },
  success:  { color: '#16A34A', bg: '#F0FDF4' },
};

const categoryIcon: Record<AppNotification['category'], React.ReactNode> = {
  deal:   <DealIcon fontSize="small" />,
  lead:   <LeadIcon fontSize="small" />,
  task:   <OverdueIcon fontSize="small" />,
  system: <InfoIcon fontSize="small" />,
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return `${Math.floor(hrs / 24)}d atrás`;
}

const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState(0);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  const displayed = tab === 0 ? notifications : notifications.filter((n) => !n.read);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleClick = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.route) navigate(notif.route);
    setAnchorEl(null);
  };

  // Simulate a new notification arriving after 20s (demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((prev) => [
        {
          id: 'live-1',
          title: 'Lead quente detectado',
          body: 'Ana Ribeiro visitou a página de preços 3x hoje.',
          severity: 'warning',
          category: 'lead',
          route: '/leads',
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Tooltip title={unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}>
        <IconButton
          ref={bellRef}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: 'text.secondary' }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: 10,
                minWidth: 18,
                height: 18,
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                },
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 380,
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            mt: 0.5,
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Notificações
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{ ml: 1, height: 18, fontSize: 11 }}
              />
            )}
          </Typography>
          {unreadCount > 0 && (
            <Tooltip title="Marcar todas como lidas">
              <IconButton size="small" onClick={markAllRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, minHeight: 36, '& .MuiTab-root': { minHeight: 36, fontSize: 12 } }}
        >
          <Tab label="Todas" />
          <Tab label={`Não lidas (${unreadCount})`} />
        </Tabs>
        <Divider />

        {/* List */}
        <List disablePadding sx={{ maxHeight: 420, overflowY: 'auto' }}>
          {displayed.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <WonIcon sx={{ fontSize: 40, color: '#16A34A', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Tudo em dia! Sem notificações pendentes.
              </Typography>
            </Box>
          ) : (
            displayed.map((notif, idx) => {
              const cfg = severityConfig[notif.severity];
              return (
                <React.Fragment key={notif.id}>
                  <ListItemButton
                    onClick={() => handleClick(notif)}
                    sx={{
                      px: 2,
                      py: 1.2,
                      alignItems: 'flex-start',
                      bgcolor: notif.read ? 'transparent' : `${cfg.bg}`,
                      '&:hover': { bgcolor: `${cfg.bg}CC` },
                      gap: 1.5,
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 36, mt: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: cfg.bg,
                          color: cfg.color,
                          border: `1.5px solid ${cfg.color}40`,
                        }}
                      >
                        {notif.severity === 'critical' ? (
                          <WarningIcon sx={{ fontSize: 16 }} />
                        ) : (
                          categoryIcon[notif.category]
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: notif.read ? 500 : 700, lineHeight: 1.3 }}
                          >
                            {notif.title}
                          </Typography>
                          {!notif.read && (
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: cfg.color,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                            {notif.body}
                          </Typography>
                          <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 600, mt: 0.3, display: 'block' }}>
                            {timeAgo(notif.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                  {idx < displayed.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })
          )}
        </List>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { navigate('/activities'); setAnchorEl(null); }}
          >
            Ver todas as atividades →
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
