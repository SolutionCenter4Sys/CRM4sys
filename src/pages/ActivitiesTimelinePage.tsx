import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Groups as MeetingIcon,
  Notes as NoteIcon,
  CheckCircleOutline as TaskIcon,
  SwapHoriz as StageChangeIcon,
  TrackChanges as StatusChangeIcon,
  Search as SearchIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Activity, ActivityType } from '../types';

// ── Config visual por tipo ────────────────────────────────────────────────────

interface TypeConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const TYPE_CONFIG: Record<ActivityType, TypeConfig> = {
  email: {
    label: 'E-mail',
    icon: <EmailIcon sx={{ fontSize: 15 }} />,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
  },
  call: {
    label: 'Ligação',
    icon: <PhoneIcon sx={{ fontSize: 15 }} />,
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.1)',
  },
  meeting: {
    label: 'Reunião',
    icon: <MeetingIcon sx={{ fontSize: 15 }} />,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
  },
  note: {
    label: 'Nota',
    icon: <NoteIcon sx={{ fontSize: 15 }} />,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
  },
  task: {
    label: 'Tarefa',
    icon: <TaskIcon sx={{ fontSize: 15 }} />,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.1)',
  },
  stage_change: {
    label: 'Mudança de estágio',
    icon: <StageChangeIcon sx={{ fontSize: 15 }} />,
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.1)',
  },
  status_change: {
    label: 'Mudança de status',
    icon: <StatusChangeIcon sx={{ fontSize: 15 }} />,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
  },
};

const ALL_TYPES: ActivityType[] = ['email', 'call', 'meeting', 'note', 'task', 'stage_change', 'status_change'];

// ── helpers ───────────────────────────────────────────────────────────────────

const relativeTime = (iso: string): string => {
  const delta = Date.now() - new Date(iso).getTime();
  const min = Math.floor(delta / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ontem';
  return `${d}d atrás`;
};

const dayLabel = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return 'Hoje';
  if (sameDay(date, yesterday)) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

const groupByDay = (activities: Activity[]): Array<{ label: string; items: Activity[] }> => {
  const groups: Record<string, Activity[]> = {};
  for (const act of activities) {
    const d = new Date(act.activityDate);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(act);
  }
  return Object.entries(groups).map(([, items]) => ({
    label: dayLabel(items[0].activityDate),
    items,
  }));
};

// ── ActivityCard ─────────────────────────────────────────────────────────────

const ActivityCard: React.FC<{ activity: Activity; isLast: boolean }> = ({ activity, isLast }) => {
  const cfg = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.note;
  const user = activity.user;

  return (
    <Box sx={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Timeline stem */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, flexShrink: 0 }}>
        {/* Dot */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: cfg.bg,
            border: `2px solid ${cfg.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: cfg.color,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          {cfg.icon}
        </Box>
        {/* Vertical line */}
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 20,
              bgcolor: 'divider',
              my: 0.5,
            }}
          />
        )}
      </Box>

      {/* Card content */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          mb: isLast ? 0 : 1.5,
          borderRadius: 2,
          borderLeft: `3px solid ${cfg.color}`,
          p: '10px 14px',
          '&:hover': { boxShadow: 1 },
          transition: 'box-shadow 0.15s',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          {/* Left: info */}
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap', mb: 0.3 }}>
              <Chip
                label={cfg.label}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: cfg.bg,
                  color: cfg.color,
                  border: 'none',
                }}
              />
              {activity.isSystemGenerated && (
                <Chip
                  label="Sistema"
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: 10 }}
                />
              )}
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {activity.subject}
            </Typography>

            {activity.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.4, lineHeight: 1.4 }}
              >
                {activity.description}
              </Typography>
            )}

            {/* Context chips (deal/contact/account) */}
            {(activity.dealId || activity.contactId || activity.accountId) && (
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.8, flexWrap: 'wrap' }}>
                {activity.dealId && (
                  <Chip label="Deal" size="small" icon={<EventIcon sx={{ fontSize: 11 }} />}
                    variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                )}
                {activity.contactId && (
                  <Chip label="Contato" size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                )}
                {activity.accountId && (
                  <Chip label="Empresa" size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                )}
              </Box>
            )}
          </Box>

          {/* Right: user + time */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title={user?.fullName || 'Sistema'}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 28, height: 28, fontSize: 12, bgcolor: cfg.color }}
              >
                {user?.fullName?.charAt(0) ?? 'S'}
              </Avatar>
            </Tooltip>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, whiteSpace: 'nowrap' }}>
              {relativeTime(activity.activityDate)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const ActivitiesTimelinePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await mockApi.activities.list();
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
      );
      setActivities(sorted);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter((act) => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(act.type);
      const matchesSearch =
        !q ||
        act.subject.toLowerCase().includes(q) ||
        act.description?.toLowerCase().includes(q) ||
        act.user?.fullName?.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [activities, search, selectedTypes]);

  // KPIs
  const todayCount = useMemo(() => {
    const today = new Date();
    return activities.filter((a) => {
      const d = new Date(a.activityDate);
      return d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
    }).length;
  }, [activities]);

  const byType = useMemo(() => {
    const counts: Partial<Record<ActivityType, number>> = {};
    for (const act of activities) {
      counts[act.type] = (counts[act.type] ?? 0) + 1;
    }
    return counts;
  }, [activities]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);

  const handleTypeToggle = (_: React.MouseEvent, newTypes: ActivityType[]) => {
    setSelectedTypes(newTypes);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 860, mx: 'auto' }}>
      {/* ── Header ── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.3 }}>
          Feed de Atividades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Registro unificado de todas as ações e eventos do CRM em tempo real.
        </Typography>
      </Box>

      {/* ── KPI Strip ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: activities.length, color: undefined },
          { label: 'Hoje', value: todayCount, color: '#7C3AED' },
          { label: 'E-mails', value: byType.email ?? 0, color: TYPE_CONFIG.email.color },
          { label: 'Ligações', value: byType.call ?? 0, color: TYPE_CONFIG.call.color },
          { label: 'Reuniões', value: byType.meeting ?? 0, color: TYPE_CONFIG.meeting.color },
          { label: 'Estágio', value: (byType.stage_change ?? 0) + (byType.status_change ?? 0), color: TYPE_CONFIG.stage_change.color },
        ].map((kpi) => (
          <Paper
            key={kpi.label}
            variant="outlined"
            sx={{ px: 2, py: 1, borderRadius: 2, textAlign: 'center', minWidth: 80 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: kpi.color || 'text.primary', lineHeight: 1.1 }}>
              {kpi.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Filtros ── */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar por assunto, descrição ou usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtros por tipo — toggle visual com ícones */}
        <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
          <ToggleButtonGroup
            value={selectedTypes}
            onChange={handleTypeToggle}
            size="small"
            sx={{ gap: 0.5, flexWrap: 'nowrap' }}
          >
            {ALL_TYPES.map((type) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <ToggleButton
                  key={type}
                  value={type}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '20px !important',
                    px: 1.5,
                    py: 0.4,
                    gap: 0.5,
                    whiteSpace: 'nowrap',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      bgcolor: cfg.bg,
                      color: cfg.color,
                      borderColor: cfg.color,
                    },
                  }}
                >
                  <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>{cfg.icon}</Box>
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                    {cfg.label}
                  </Typography>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      </Stack>

      {/* ── Timeline ── */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontSize: 40 }}>🔍</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Nenhuma atividade encontrada para os filtros aplicados.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={0}>
          {groups.map((group) => (
            <Box key={group.label} sx={{ mb: 3 }}>
              {/* Day label */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.label}
                </Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                  {group.items.length} {group.items.length === 1 ? 'evento' : 'eventos'}
                </Typography>
              </Box>

              {/* Activities for this day */}
              <Box>
                {group.items.map((act, idx) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    isLast={idx === group.items.length - 1}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ActivitiesTimelinePage;
