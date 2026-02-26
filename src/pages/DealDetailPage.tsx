import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AutoAwesome as AIIcon,
  BusinessOutlined as BusinessIcon,
  CallOutlined as CallIcon,
  CheckCircle as CheckCircleIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  EventOutlined as EventIcon,
  FlagOutlined as FlagIcon,
  NoteOutlined as NoteIcon,
  PersonOutlined as PersonIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Activity, Deal, DealFormData, Stage } from '../types';
import DealFormModal from '../components/DealFormModal';

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;

function daysBetween(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function activityIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    email: <EmailIcon sx={{ fontSize: 16 }} />,
    call: <CallIcon sx={{ fontSize: 16 }} />,
    meeting: <EventIcon sx={{ fontSize: 16 }} />,
    note: <NoteIcon sx={{ fontSize: 16 }} />,
    task: <FlagIcon sx={{ fontSize: 16 }} />,
    stage_change: <TrendingUpIcon sx={{ fontSize: 16 }} />,
  };
  return icons[type] || <NoteIcon sx={{ fontSize: 16 }} />;
}

function activityColor(type: string): string {
  const colors: Record<string, string> = {
    email: '#3B82F6', call: '#10B981', meeting: '#8B5CF6',
    note: '#F59E0B', task: '#EF4444', stage_change: '#6366F1',
  };
  return colors[type] || '#6B7280';
}

interface TabPanelProps { value: number; index: number; children: React.ReactNode }
const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) =>
  value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;

// ── Componente principal ─────────────────────────────────────────────────────

export const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lostReason, setLostReason] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadData = async (dealId: string) => {
    try {
      setLoading(true); setError(null); setActionError(null);
      const dealRes = await mockApi.deals.getById(dealId);
      if (!dealRes.data) throw new Error('Deal não encontrado');
      const currentDeal = dealRes.data;
      setDeal(currentDeal);
      const [activitiesRes, stagesRes] = await Promise.all([
        mockApi.activities.listByDeal(dealId),
        mockApi.pipelines.listStages(currentDeal.pipelineId),
      ]);
      setActivities((activitiesRes.data || []).sort(
        (a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
      ));
      setStages(stagesRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar deal');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) loadData(id); }, [id]);

  const stageHistory = useMemo(() => activities.filter((a) => a.type === 'stage_change'), [activities]);
  const nonStageActivities = useMemo(() => activities.filter((a) => a.type !== 'stage_change'), [activities]);

  const handleUpdateDeal = async (payload: DealFormData) => {
    if (!deal) return;
    await mockApi.deals.update(deal.id, payload);
    await loadData(deal.id);
  };

  const handleSetStatus = async (status: 'open' | 'won' | 'lost', reason?: string) => {
    if (!deal) return;
    try {
      await mockApi.deals.setStatus(deal.id, status, reason);
      await loadData(deal.id);
      setInfoMessage(status === 'won' ? 'Deal marcado como ganho!' : status === 'lost' ? 'Deal marcado como perdido.' : 'Deal reaberto com sucesso.');
    } catch (e) { setActionError(e instanceof Error ? e.message : 'Falha ao atualizar status'); }
  };

  const handleQuickNote = async () => {
    if (!deal || !quickNote.trim()) return;
    try {
      setSavingNote(true);
      await mockApi.activities.create({
        type: 'note', subject: 'Nota rápida', description: quickNote.trim(),
        relatedDealId: deal.id, relatedAccountId: deal.accountId,
        userId: deal.ownerId || '', user: deal.owner,
        isSystemGenerated: false, metadata: { source: 'deal_quick_note' },
      });
      setQuickNote('');
      await loadData(deal.id);
      setInfoMessage('Nota registrada com sucesso.');
    } catch (e) { setActionError('Erro ao salvar nota'); }
    finally { setSavingNote(false); }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error || !deal) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error || 'Deal não encontrado'}</Alert>
      <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/deals')}>Voltar</Button>
    </Box>
  );

  // Cálculos derivados
  const weightedAmount = Math.round((deal.amount * deal.probability) / 100);
  const daysToClose = deal.expectedCloseDate ? daysBetween(deal.expectedCloseDate) : null;
  const daysOpen = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / 86400000);
  const stageIndex = stages.findIndex((s) => s.id === deal.stageId);
  const currentStageObj = stages[stageIndex];
  const rottingDays = deal.rottingDays || 0;

  const urgency = daysToClose !== null && daysToClose < 0
    ? 'overdue'
    : daysToClose !== null && daysToClose <= 7
    ? 'critical'
    : daysToClose !== null && daysToClose <= 21
    ? 'warning'
    : 'normal';

  const urgencyColor = { overdue: 'error', critical: 'error', warning: 'warning', normal: 'success' }[urgency] as 'error' | 'warning' | 'success';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/deals')} size="small" sx={{ color: 'text.secondary' }}>
          Voltar para Pipeline
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Editar Deal
          </Button>
          <Button variant="contained" size="small" color="success" onClick={() => handleSetStatus('won')} disabled={deal.status === 'won'}>
            Marcar ganho
          </Button>
          <Button variant="contained" size="small" color="error" onClick={() => setLostDialogOpen(true)} disabled={deal.status === 'lost'}>
            Marcar perdido
          </Button>
          {deal.status !== 'open' && (
            <Button variant="outlined" size="small" onClick={() => handleSetStatus('open')}>Reabrir</Button>
          )}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 }, py: 2, maxWidth: 1400, mx: 'auto' }}>

        {/* Alertas */}
        {infoMessage && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setInfoMessage(null)}>{infoMessage}</Alert>}
        {actionError && <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setActionError(null)}>{actionError}</Alert>}

        {/* ── Header do deal ──────────────────────────────────────────── */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {deal.title.split('—')[0].trim()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {deal.account?.name || 'Conta não informada'}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
              <Chip
                label={deal.stage?.name || '—'}
                size="small"
                sx={{ fontWeight: 700, bgcolor: `${currentStageObj?.color || '#6366F1'}22`, color: currentStageObj?.color || '#6366F1', border: 'none' }}
              />
              <Chip
                label={`${deal.probability}% prob.`}
                size="small" variant="outlined"
              />
              <Chip
                label={deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Aberto'}
                size="small"
                color={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'error' : 'default'}
                variant="outlined"
              />
              {deal.tags?.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: 11 }} />
              ))}
            </Stack>
          </Box>

          {/* Barra de progresso no funil */}
          {stages.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                {stages.map((stage, idx) => {
                  const isActive = stage.id === deal.stageId;
                  const isPast = idx < stageIndex;
                  return (
                    <Tooltip key={stage.id} title={`${stage.name} · ${stage.probability}%`}>
                      <Box sx={{
                        flex: 1, height: 5, borderRadius: 1,
                        bgcolor: isActive ? stage.color : isPast ? `${stage.color}60` : 'action.disabledBackground',
                        transition: 'background-color 0.2s',
                        cursor: 'default',
                      }} />
                    </Tooltip>
                  );
                })}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, display: 'block' }}>
                Estágio {stageIndex + 1} de {stages.length} · {currentStageObj?.name}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Layout 2 colunas ────────────────────────────────────────── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' }, gap: 2, alignItems: 'start' }}>

          {/* Coluna esquerda: tabs */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, pt: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontWeight: 600 } }}>
                <Tab label="Visão Geral" />
                <Tab label={`Atividades${nonStageActivities.length > 0 ? ` (${nonStageActivities.length})` : ''}`} />
                <Tab label="Histórico de Estágio" />
              </Tabs>
            </Box>

            {/* ── Aba: Visão Geral ── */}
            <TabPanel value={tab} index={0}>
              <Box sx={{ px: 2, pb: 2 }}>
                {/* Descrição */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8 }}>
                    Descrição
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7, color: 'text.primary' }}>
                    {deal.description || 'Sem descrição cadastrada para esta oportunidade.'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Grid de campos */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {[
                    {
                      icon: <PersonIcon sx={{ fontSize: 14 }} />,
                      label: 'Responsável',
                      value: (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.2 }}>
                          <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>{deal.owner?.fullName?.charAt(0)}</Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{deal.owner?.fullName || '—'}</Typography>
                        </Box>
                      ),
                    },
                    {
                      icon: <PersonIcon sx={{ fontSize: 14 }} />,
                      label: 'Contato principal',
                      value: <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.2 }}>{deal.primaryContact?.fullName || '—'}</Typography>,
                    },
                    {
                      icon: <BusinessIcon sx={{ fontSize: 14 }} />,
                      label: 'Empresa',
                      value: (
                        <Box sx={{ mt: 0.2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{deal.account?.name || '—'}</Typography>
                          {deal.account?.industry && (
                            <Typography variant="caption" color="text.secondary">{deal.account.industry}</Typography>
                          )}
                        </Box>
                      ),
                    },
                    {
                      icon: <ScheduleIcon sx={{ fontSize: 14 }} />,
                      label: 'Fechamento previsto',
                      value: (
                        <Box sx={{ mt: 0.2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR') : '—'}
                          </Typography>
                          {daysToClose !== null && (
                            <Typography variant="caption" color={urgency === 'normal' ? 'text.secondary' : `${urgencyColor}.main`} sx={{ fontWeight: 600 }}>
                              {daysToClose < 0 ? `${Math.abs(daysToClose)}d em atraso` : daysToClose === 0 ? 'Vence hoje' : `${daysToClose}d restantes`}
                            </Typography>
                          )}
                        </Box>
                      ),
                    },
                    {
                      icon: <TrendingUpIcon sx={{ fontSize: 14 }} />,
                      label: 'Dias em aberto',
                      value: (
                        <Box sx={{ mt: 0.2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{daysOpen}d no pipeline</Typography>
                          {rottingDays > 0 && (
                            <Typography variant="caption" color={rottingDays >= 14 ? 'error.main' : rottingDays >= 9 ? 'warning.main' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                              Rotting: {rottingDays}d {rottingDays >= 14 ? '⚠' : ''}
                            </Typography>
                          )}
                        </Box>
                      ),
                    },
                    {
                      icon: <FlagIcon sx={{ fontSize: 14 }} />,
                      label: 'Fonte do lead',
                      value: <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.2 }}>{deal.leadSource || '—'}</Typography>,
                    },
                  ].map(({ icon, label, value }) => (
                    <Box key={label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.secondary', mb: 0.2 }}>
                        {icon}
                        <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 10 }}>
                          {label}
                        </Typography>
                      </Box>
                      {value}
                    </Box>
                  ))}
                </Box>

                {deal.lostReason && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Motivo da perda</Typography>
                    {deal.lostReason}
                  </Alert>
                )}
              </Box>
            </TabPanel>

            {/* ── Aba: Atividades ── */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ px: 2, pb: 2 }}>
                {/* Nota rápida */}
                <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.8, display: 'block', mb: 0.8 }}>
                    Registrar nota rápida
                  </Typography>
                  <TextField
                    fullWidth multiline minRows={2} size="small" placeholder="Registre uma observação, próximo passo ou resultado de contato…"
                    value={quickNote} onChange={(e) => setQuickNote(e.target.value)}
                    sx={{ mb: 0.8 }}
                  />
                  <Button size="small" variant="contained" onClick={handleQuickNote} disabled={!quickNote.trim() || savingNote}>
                    {savingNote ? 'Salvando…' : 'Salvar nota'}
                  </Button>
                </Box>

                {/* Timeline de atividades */}
                {nonStageActivities.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">Nenhuma atividade registrada.</Typography>
                    <Typography variant="caption" color="text.secondary">Use o campo acima para registrar a primeira nota.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    {/* Linha vertical da timeline */}
                    <Box sx={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, bgcolor: 'divider' }} />
                    <Stack spacing={0} sx={{ pl: 0 }}>
                      {nonStageActivities.map((activity, idx) => (
                        <Box key={activity.id} sx={{ display: 'flex', gap: 1.5, pb: idx < nonStageActivities.length - 1 ? 2 : 0, position: 'relative' }}>
                          {/* Ícone na timeline */}
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                            bgcolor: activityColor(activity.type), color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {activityIcon(activity.type)}
                          </Box>
                          {/* Conteúdo */}
                          <Box sx={{ flex: 1, pt: 0.3, pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{activity.subject}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, fontSize: 11 }}>
                                {new Date(activity.activityDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                            <Chip label={activity.type} size="small" sx={{ height: 16, fontSize: 10, mb: activity.description ? 0.5 : 0, bgcolor: `${activityColor(activity.type)}20`, color: activityColor(activity.type), border: 'none' }} />
                            {activity.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, lineHeight: 1.5 }}>
                                {activity.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* ── Aba: Histórico de Estágio ── */}
            <TabPanel value={tab} index={2}>
              <Box sx={{ px: 2, pb: 2 }}>
                {stageHistory.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">Nenhuma movimentação de estágio registrada.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {stageHistory.map((activity) => (
                      <Box key={activity.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#6366F110', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <TrendingUpIcon sx={{ fontSize: 14 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {activity.metadata?.from_stage || '—'} → {activity.metadata?.to_stage || '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.activityDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>
          </Paper>

          {/* ── Coluna direita: KPIs + relacionamentos ───────────────── */}
          <Stack spacing={1.5}>

            {/* KPIs financeiros */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AIIcon sx={{ fontSize: 15, color: '#7C3AED' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                  Métricas do Deal
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { label: 'Valor total', value: fmt(deal.amount), color: 'text.primary', bold: true },
                  { label: 'Valor ponderado', value: fmt(weightedAmount), color: '#7C3AED', bold: true },
                  {
                    label: 'Fechar em',
                    value: daysToClose === null ? '—' : daysToClose < 0 ? `${Math.abs(daysToClose)}d atrasado` : `${daysToClose}d`,
                    color: urgency === 'normal' ? 'success.main' : `${urgencyColor}.main`,
                    bold: urgency !== 'normal',
                  },
                  {
                    label: 'Rotting',
                    value: rottingDays > 0 ? `${rottingDays}d` : 'Normal',
                    color: rottingDays >= 14 ? 'error.main' : rottingDays >= 9 ? 'warning.main' : 'success.main',
                    bold: rottingDays >= 9,
                  },
                ].map(({ label, value, color, bold }) => (
                  <Box key={label} sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', fontSize: 10 }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: bold ? 800 : 500, color, mt: 0.2 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Barra de probabilidade */}
              <Box sx={{ px: 1.5, pb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Probabilidade de fechamento</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{deal.probability}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate" value={deal.probability}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: deal.probability >= 75 ? 'success.main' : deal.probability >= 50 ? '#F59E0B' : 'primary.main' } }}
                />
              </Box>
            </Paper>

            {/* Alertas de atenção */}
            {(urgency === 'critical' || urgency === 'overdue' || rottingDays >= 9) && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'warning.main', borderRadius: 2, bgcolor: '#FFFBEB' }}>
                <Box sx={{ px: 1.5, py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 0.8, alignItems: 'center' }}>
                    <WarningIcon sx={{ fontSize: 15, color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }}>Atenção necessária</Typography>
                  </Box>
                  <Stack spacing={0.4}>
                    {urgency === 'overdue' && (
                      <Typography variant="caption" color="error.main">• Fechamento está {Math.abs(daysToClose!)}d em atraso</Typography>
                    )}
                    {urgency === 'critical' && (
                      <Typography variant="caption" color="error.main">• Apenas {daysToClose}d para o fechamento previsto</Typography>
                    )}
                    {rottingDays >= 14 && (
                      <Typography variant="caption" color="error.main">• Deal sem movimentação há {rottingDays} dias</Typography>
                    )}
                    {rottingDays >= 9 && rottingDays < 14 && (
                      <Typography variant="caption" color="warning.dark">• Rotting de {rottingDays}d — considere retomar o contato</Typography>
                    )}
                  </Stack>
                </Box>
              </Paper>
            )}

            {/* Conta associada */}
            {deal.account && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Empresa</Typography>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.account.name}</Typography>
                  {deal.account.industry && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{deal.account.industry}</Typography>
                  )}
                  {deal.account.website && (
                    <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.3 }}>{deal.account.website}</Typography>
                  )}
                  {deal.account.numberOfEmployees && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                      {deal.account.numberOfEmployees.toLocaleString('pt-BR')} colaboradores
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}

            {/* Contato principal */}
            {deal.primaryContact && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Contato Principal</Typography>
                </Box>
                <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{deal.primaryContact.fullName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.primaryContact.fullName}</Typography>
                    {deal.primaryContact.jobTitle && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{deal.primaryContact.jobTitle}</Typography>
                    )}
                    {deal.primaryContact.email && (
                      <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.2 }}>{deal.primaryContact.email}</Typography>
                    )}
                    {deal.primaryContact.mobilePhone && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{deal.primaryContact.mobilePhone}</Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.8 }}>
                      <Tooltip title="Ligar">
                        <IconButton size="small" sx={{ bgcolor: '#10B98110', color: '#10B981', '&:hover': { bgcolor: '#10B98120' } }}>
                          <CallIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Enviar e-mail">
                        <IconButton size="small" sx={{ bgcolor: '#3B82F610', color: '#3B82F6', '&:hover': { bgcolor: '#3B82F620' } }}>
                          <EmailIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Informações adicionais */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Informações</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Stack spacing={1}>
                  {[
                    { label: 'Criado em', value: new Date(deal.createdAt).toLocaleDateString('pt-BR') },
                    { label: 'Atualizado', value: new Date(deal.updatedAt).toLocaleDateString('pt-BR') },
                    { label: 'Atividades', value: `${nonStageActivities.length} registradas` },
                    { label: 'Pipeline', value: deal.pipeline?.name || '—' },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>

          </Stack>
        </Box>
      </Box>

      {/* ── Modais ───────────────────────────────────────────────────── */}
      <DealFormModal
        open={editOpen} mode="edit" initialData={deal}
        onClose={() => setEditOpen(false)} onSubmit={handleUpdateDeal}
        pipelineId={deal.pipelineId} stages={stages}
      />

      <Dialog open={lostDialogOpen} onClose={() => setLostDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Marcar deal como perdido</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth multiline minRows={3} sx={{ mt: 1 }}
            label="Motivo da perda (obrigatório)" value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            helperText="Esta informação alimenta os relatórios de análise de perdas." />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLostDialogOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" disabled={!lostReason.trim()}
            onClick={async () => { await handleSetStatus('lost', lostReason); setLostDialogOpen(false); setLostReason(''); }}>
            Confirmar perda
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealDetailPage;
