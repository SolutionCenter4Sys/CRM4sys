import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Videocam as VideocamIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Link as LinkIcon,
  Groups as GroupsIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { MarketingEvent, EventIntegration, EventStatus, EventType } from '../types';

const STATUS_LABEL: Record<EventStatus, string> = {
  draft: 'Rascunho', scheduled: 'Agendado', live: 'Ao Vivo', completed: 'Concluído', cancelled: 'Cancelado',
};
const STATUS_COLOR: Record<EventStatus, 'default' | 'info' | 'error' | 'success'> = {
  draft: 'default', scheduled: 'info', live: 'error', completed: 'success', cancelled: 'default',
};
const TYPE_LABEL: Record<EventType, string> = {
  webinar: 'Webinar', conference: 'Conferência', workshop: 'Workshop', meetup: 'Meetup', tradeshow: 'Feira',
};
const TYPE_COLOR: Record<EventType, 'info' | 'primary' | 'warning' | 'success' | 'default'> = {
  webinar: 'info', conference: 'primary', workshop: 'warning', meetup: 'success', tradeshow: 'default',
};
const ATTENDEE_STATUS_LABEL: Record<string, string> = {
  registered: 'Registrado', confirmed: 'Confirmado', attended: 'Presente', no_show: 'Ausente', cancelled: 'Cancelado',
};
const ATTENDEE_STATUS_COLOR: Record<string, 'default' | 'info' | 'success' | 'error'> = {
  registered: 'default', confirmed: 'info', attended: 'success', no_show: 'error', cancelled: 'default',
};
const AUTOMATION_LABELS: Record<string, string> = {
  registration: 'E-mail de registro', reminder_24h: 'Lembrete 24h', reminder_1h: 'Lembrete 1h',
  post_event: 'Pós-evento', no_show: 'Follow-up no-show',
};

const INTEGRATION_META: Record<string, { bg: string; icon: string }> = {
  zoom: { bg: '#2D8CFF', icon: '🎥' },
  teams: { bg: '#6264A7', icon: '👥' },
  eventbrite: { bg: '#F05537', icon: '🎫' },
  google_meet: { bg: '#00897B', icon: '📹' },
};

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
const fmtCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type TabFilter = 'proximos' | 'ao_vivo' | 'passados' | 'todos';

const MarketingEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [integrations, setIntegrations] = useState<EventIntegration[]>([]);
  const [integrationsOpen, setIntegrationsOpen] = useState(true);
  const [tab, setTab] = useState<TabFilter>('todos');
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null);
  const [dialogTab, setDialogTab] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [evRes, intRes] = await Promise.all([
        mockApi.marketingEvents.list(),
        mockApi.marketingEvents.listIntegrations(),
      ]);
      setEvents(evRes.data || []);
      setIntegrations(intRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredEvents = useMemo(() => {
    switch (tab) {
      case 'proximos': return events.filter(e => e.status === 'scheduled');
      case 'ao_vivo': return events.filter(e => e.status === 'live');
      case 'passados': return events.filter(e => e.status === 'completed');
      default: return events;
    }
  }, [events, tab]);

  const kpis = useMemo(() => {
    const completed = events.filter(e => e.status === 'completed');
    const scheduled = events.filter(e => e.status === 'scheduled');
    const totalRegistrations = events.reduce((s, e) => s + e.registrations, 0);
    const totalAttendees = events.reduce((s, e) => s + e.attendees, 0);
    const totalNoShows = events.reduce((s, e) => s + e.noShows, 0);
    const avgAttendanceRate = completed.length
      ? completed.reduce((s, e) => s + e.attendanceRate, 0) / completed.length : 0;
    const completedWithAttendees = completed.filter(e => e.attendees > 0);
    const avgCostPerAttendee = completedWithAttendees.length
      ? completedWithAttendees.reduce((s, e) => s + e.costPerAttendee, 0) / completedWithAttendees.length : 0;
    const totalRevenue = events.reduce((s, e) => s + e.revenueInfluenced, 0);
    const totalInvestment = completedWithAttendees.reduce((s, e) => s + (e.costPerAttendee * e.attendees), 0);

    return [
      {
        label: 'Eventos Realizados', value: completed.length,
        sub: `${scheduled.length} próximos agendados`,
        icon: <EventIcon />, color: '#7C3AED',
      },
      {
        label: 'Total de Registros', value: totalRegistrations,
        sub: `média ${events.length ? Math.round(totalRegistrations / events.length) : 0} por evento`,
        icon: <PeopleIcon />, color: '#2563EB',
      },
      {
        label: 'Total de Participantes', value: totalAttendees,
        sub: `média ${events.length ? Math.round(totalAttendees / events.length) : 0} por evento`,
        icon: <GroupsIcon />, color: '#059669',
      },
      {
        label: 'Taxa de Comparecimento', value: `${avgAttendanceRate.toFixed(1)}%`,
        sub: `${totalNoShows} no-shows total`,
        icon: <BarChartIcon />, color: '#D97706',
      },
      {
        label: 'Custo por Participante', value: fmtCurrency(avgCostPerAttendee),
        sub: `investimento total ${fmtCurrency(totalInvestment)}`,
        icon: <MoneyIcon />, color: '#DC2626',
      },
      {
        label: 'Receita Influenciada', value: fmtCurrency(totalRevenue),
        sub: `ROI ${events.length ? fmtCurrency(totalRevenue / events.length) : 'R$ 0'} por evento`,
        icon: <TrendingUpIcon />, color: '#0891B2',
      },
    ];
  }, [events]);

  const capacityColor = (regs: number, cap: number) => {
    const pct = cap > 0 ? (regs / cap) * 100 : 0;
    if (pct >= 90) return 'error';
    if (pct >= 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1440, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Eventos de Marketing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie webinars, conferências e meetups integrados às suas campanhas de marketing
        </Typography>
      </Box>

      {/* Integrations Section */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 3, py: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
          }}
          onClick={() => setIntegrationsOpen(p => !p)}
        >
          <Typography variant="h6" fontWeight={600}>Integrações de Plataforma</Typography>
          <IconButton size="small">
            {integrationsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={integrationsOpen}>
          <Box sx={{ px: 3, pb: 3 }}>
            <Grid container spacing={2}>
              {integrations.map(integ => {
                const meta = INTEGRATION_META[integ.platform] || { bg: '#666', icon: '🔗' };
                return (
                  <Grid item xs={12} sm={6} md={3} key={integ.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderLeft: `4px solid ${meta.bg}`,
                        height: '100%',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 4 },
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="subtitle1" fontWeight={600}>{integ.name}</Typography>
                          <Chip label={integ.installCount} size="small" sx={{ bgcolor: `${meta.bg}22`, color: meta.bg, fontWeight: 600 }} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5, minHeight: 40 }}>
                          {integ.description}
                        </Typography>
                        {integ.connected ? (
                          <Chip label="Conectado" size="small" color="success" variant="filled" />
                        ) : (
                          <Button variant="outlined" size="small">Conectar</Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Collapse>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ color: kpi.color, display: 'flex' }}>{kpi.icon}</Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} noWrap>
                    {kpi.label}
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700}>{kpi.value}</Typography>
                <Typography variant="caption" color="text.secondary">{kpi.sub}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 0.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ px: 2 }}
        >
          <Tab value="proximos" label={`Próximos (${events.filter(e => e.status === 'scheduled').length})`} />
          <Tab value="ao_vivo" label={`Ao Vivo (${events.filter(e => e.status === 'live').length})`} />
          <Tab value="passados" label={`Passados (${events.filter(e => e.status === 'completed').length})`} />
          <Tab value="todos" label={`Todos (${events.length})`} />
        </Tabs>
      </Paper>

      {/* Events Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 600, whiteSpace: 'nowrap' } }}>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Local/Link</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Registros/Capacidade</TableCell>
              <TableCell align="center">Participantes</TableCell>
              <TableCell align="center">No-shows</TableCell>
              <TableCell align="center">Taxa</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum evento encontrado para este filtro</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map(ev => {
                const capPct = ev.capacity > 0 ? (ev.registrations / ev.capacity) * 100 : 0;
                return (
                  <TableRow
                    key={ev.id}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    onClick={() => { setSelectedEvent(ev); setDialogTab(0); }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{ev.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={TYPE_LABEL[ev.type]} size="small" color={TYPE_COLOR[ev.type]} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{fmtDate(ev.date)}</Typography>
                      <Typography variant="caption" color="text.secondary">{ev.startTime}–{ev.endTime}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {ev.isVirtual
                          ? <VideocamIcon fontSize="small" color="primary" />
                          : <LocationOnIcon fontSize="small" color="action" />}
                        <Tooltip title={ev.isVirtual ? (ev.virtualUrl || '') : (ev.location || '')}>
                          <Typography variant="body2" noWrap>
                            {ev.isVirtual ? (ev.virtualUrl || '—') : (ev.location || '—')}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {ev.integrationPlatform ? (
                        <Chip
                          label={ev.integrationPlatform}
                          size="small"
                          sx={{
                            bgcolor: `${INTEGRATION_META[ev.integrationPlatform]?.bg || '#666'}22`,
                            color: INTEGRATION_META[ev.integrationPlatform]?.bg || '#666',
                            fontWeight: 500,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Typography variant="body2">{ev.registrations}/{ev.capacity}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(capPct, 100)}
                        color={capacityColor(ev.registrations, ev.capacity)}
                        sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                      />
                    </TableCell>
                    <TableCell align="center">{ev.attendees}</TableCell>
                    <TableCell align="center">{ev.noShows}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={500}>{ev.attendanceRate}%</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={ev.status === 'live' ? (
                          <DotIcon sx={{
                            fontSize: 10,
                            animation: 'pulse 1.4s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.3 },
                              '100%': { opacity: 1 },
                            },
                          }} />
                        ) : undefined}
                        label={STATUS_LABEL[ev.status]}
                        size="small"
                        color={STATUS_COLOR[ev.status]}
                        variant={ev.status === 'live' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          dialogTab={dialogTab}
          onTabChange={setDialogTab}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Box>
  );
};

interface EventDetailDialogProps {
  event: MarketingEvent;
  dialogTab: number;
  onTabChange: (t: number) => void;
  onClose: () => void;
}

const EventDetailDialog: React.FC<EventDetailDialogProps> = ({ event, dialogTab, onTabChange, onClose }) => {
  const registered = event.eventAttendees.filter(a => a.status === 'registered').length;
  const confirmed = event.eventAttendees.filter(a => a.status === 'confirmed').length;
  const attended = event.eventAttendees.filter(a => a.status === 'attended').length;
  const noShow = event.eventAttendees.filter(a => a.status === 'no_show').length;
  const total = event.eventAttendees.length || 1;

  const funnelBars = [
    { label: 'Registrados', value: registered, color: '#93C5FD' },
    { label: 'Confirmados', value: confirmed, color: '#60A5FA' },
    { label: 'Presentes', value: attended, color: '#34D399' },
    { label: 'No-shows', value: noShow, color: '#F87171' },
  ];

  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="h6" fontWeight={700}>{event.name}</Typography>
              <Chip label={TYPE_LABEL[event.type]} size="small" color={TYPE_COLOR[event.type]} />
              <Chip
                label={STATUS_LABEL[event.status]}
                size="small"
                color={STATUS_COLOR[event.status]}
                variant={event.status === 'live' ? 'filled' : 'outlined'}
              />
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                {fmtDate(event.date)} &bull; {event.startTime}–{event.endTime}
              </Typography>
              {event.isVirtual ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LinkIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="primary.main" sx={{ maxWidth: 250 }} noWrap>
                    {event.virtualUrl || 'Link virtual'}
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">{event.location}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Attendance Funnel */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Funil de Presença</Typography>
          <Stack spacing={1}>
            {funnelBars.map(bar => (
              <Stack key={bar.label} direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="caption" sx={{ width: 90, textAlign: 'right' }}>{bar.label}</Typography>
                <Box sx={{ flex: 1, position: 'relative', height: 22, bgcolor: '#F3F4F6', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{
                    height: '100%', borderRadius: 1,
                    width: `${(bar.value / total) * 100}%`,
                    bgcolor: bar.color, transition: 'width 0.5s',
                  }} />
                </Box>
                <Typography variant="caption" fontWeight={600} sx={{ width: 36, textAlign: 'right' }}>{bar.value}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Automations */}
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Automações</Typography>
          <Grid container spacing={1}>
            {event.automations.map(auto => (
              <Grid item xs={12} sm={6} md={4} key={auto.id}>
                <Stack direction="row" alignItems="center" justifyContent="space-between"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'action.hover' }}
                >
                  <Typography variant="body2">
                    {AUTOMATION_LABELS[auto.trigger] || auto.description}
                  </Typography>
                  <Switch checked={auto.enabled} size="small" />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Dialog Tabs */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <Tabs value={dialogTab} onChange={(_, v) => onTabChange(v)} sx={{ px: 3 }}>
            <Tab label="Participantes" />
            <Tab label="Métricas" />
          </Tabs>
        </Box>

        {dialogTab === 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 600 } }}>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Registrado em</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell align="center">Engajamento</TableCell>
                  <TableCell>Origem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {event.eventAttendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Nenhum participante registrado</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  event.eventAttendees.map(att => (
                    <TableRow key={att.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{att.contactName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{att.contactEmail}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ATTENDEE_STATUS_LABEL[att.status] || att.status}
                          size="small"
                          color={ATTENDEE_STATUS_COLOR[att.status] || 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{fmtDate(att.registeredAt.split('T')[0])}</Typography>
                      </TableCell>
                      <TableCell>
                        {att.checkedInAt ? (
                          <Typography variant="body2">{fmtDate(att.checkedInAt.split('T')[0])}</Typography>
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {att.engagementScore != null ? (
                          <Tooltip title={`${att.engagementScore}%`}>
                            <Box sx={{ display: 'inline-flex', position: 'relative' }}>
                              <CircularProgress
                                variant="determinate"
                                value={att.engagementScore}
                                size={32}
                                thickness={4}
                                color={att.engagementScore >= 70 ? 'success' : att.engagementScore >= 40 ? 'warning' : 'error'}
                              />
                              <Box sx={{
                                position: 'absolute', inset: 0, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Typography variant="caption" fontSize={9} fontWeight={600}>
                                  {att.engagementScore}
                                </Typography>
                              </Box>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{att.source}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {dialogTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">Receita Influenciada</Typography>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                      {fmtCurrency(event.revenueInfluenced)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">Custo por Participante</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {fmtCurrency(event.costPerAttendee)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">Taxa de Comparecimento</Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {event.attendanceRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {event.speakerName && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>Palestrante</Typography>
                      <Typography variant="body1" fontWeight={500}>{event.speakerName}</Typography>
                      {event.speakerTitle && (
                        <Typography variant="body2" color="text.secondary">{event.speakerTitle}</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">Registros / Capacidade</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {event.registrations} / {event.capacity}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((event.registrations / (event.capacity || 1)) * 100, 100)}
                      color={event.capacity > 0
                        ? ((event.registrations / event.capacity) >= 0.9 ? 'error'
                          : (event.registrations / event.capacity) >= 0.7 ? 'warning' : 'success')
                        : 'primary'}
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">No-shows</Typography>
                    <Typography variant="h5" fontWeight={700} color="error.main">{event.noShows}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      de {event.registrations} registrados
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarketingEventsPage;
