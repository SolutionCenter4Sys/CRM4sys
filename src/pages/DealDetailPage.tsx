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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
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
  ContentCopy as RecurrenceIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  EventOutlined as EventIcon,
  FlagOutlined as FlagIcon,
  NoteOutlined as NoteIcon,
  PersonOutlined as PersonIcon,
  PostAdd as AdditiveIcon,
  Receipt as ProposalIcon,
  Schedule as ScheduleIcon,
  Tag as TagIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  WorkOutline as DeliveryIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Activity, Deal, DealFormData, LostReasonType, Stage } from '../types';
import DealFormModal from '../components/DealFormModal';

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');
const fmtDateTime = (d?: string) => (d ? new Date(d).toLocaleString('pt-BR') : '—');

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

const LOST_REASON_LABELS: Record<LostReasonType, string> = {
  preco: 'Preço / Valor',
  concorrencia: 'Concorrência',
  budget: 'Falta de orçamento',
  timing: 'Timing / Não é prioridade agora',
  requisitos_tecnicos: 'Requisitos técnicos não atendidos',
  relacionamento: 'Relacionamento / Stakeholder',
  nao_respondeu: 'Cliente não respondeu',
  cancelamento_interno: 'Cancelamento interno',
  outro: 'Outro',
};

const DELIVERY_LABEL: Record<string, string> = {
  alocacao: 'Alocação', projetos: 'Projetos', produtos: 'Produtos',
  ams: 'AMS', squad: 'Squad', outsourcing: 'Outsourcing',
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8, display: 'block', mb: 0.5 }}>
    {children}
  </Typography>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

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

  // Lost dialog
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lostReasonType, setLostReasonType] = useState<LostReasonType | ''>('');
  const [lostObservation, setLostObservation] = useState('');

  // Recurrence dialog
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [recurrenceTitle, setRecurrenceTitle] = useState('');
  const [recurrenceAmount, setRecurrenceAmount] = useState(0);
  const [savingRecurrence, setSavingRecurrence] = useState(false);

  // Additive dialog
  const [additiveOpen, setAdditiveOpen] = useState(false);
  const [additiveTitle, setAdditiveTitle] = useState('');
  const [additiveAmount, setAdditiveAmount] = useState(0);
  const [savingAdditive, setSavingAdditive] = useState(false);

  // Quick note
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

  const handleSetStatus = async (status: 'open' | 'won' | 'lost', reason?: string, reasonType?: string, observation?: string) => {
    if (!deal) return;
    try {
      await mockApi.deals.setStatus(deal.id, status, reason);
      if ((reasonType || observation) && status === 'lost') {
        await mockApi.deals.update(deal.id, {
          ...(reasonType ? { customFields: { ...deal.customFields, lostReasonType: reasonType, lostObservation: observation } } : {}),
        } as Partial<DealFormData>);
      }
      await loadData(deal.id);
      setInfoMessage(
        status === 'won' ? '✅ Negócio marcado como ganho!' :
        status === 'lost' ? '❌ Negócio marcado como perdido.' :
        'Negócio reaberto com sucesso.'
      );
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
    } catch { setActionError('Erro ao salvar nota'); }
    finally { setSavingNote(false); }
  };

  const openRecurrenceDialog = () => {
    if (!deal) return;
    const allDeals = []; // We'll compute recurrence number from deal
    setRecurrenceTitle(`[Recorrência] ${deal.title}`);
    setRecurrenceAmount(deal.amount);
    setRecurrenceOpen(true);
  };

  const handleCreateRecurrence = async () => {
    if (!deal) return;
    try {
      setSavingRecurrence(true);
      const existingRecurrences = 0; // In a real system, query related deals
      await (mockApi.deals.create as Function)({
        title: recurrenceTitle,
        description: `Recorrência do negócio ${deal.dealCode || deal.title}. Negócio original criado em ${fmtDate(deal.createdAt)}.`,
        amount: recurrenceAmount,
        pipelineId: deal.pipelineId,
        stageId: deal.stageId,
        accountId: deal.accountId,
        primaryContactId: deal.primaryContactId,
        ownerId: deal.ownerId,
        deliveryModel: deal.deliveryModel,
        portfolioItems: deal.portfolioItems,
        businessUnit: deal.businessUnit,
        dealSource: 'Renovação',
        parentDealId: deal.id,
        parentDealTitle: deal.title,
        relationType: 'recurrence',
        recurrenceNumber: existingRecurrences + 1,
        tags: deal.tags,
      });
      setRecurrenceOpen(false);
      setInfoMessage('Negócio de recorrência criado com sucesso! Acesse o Pipeline para visualizá-lo.');
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erro ao criar recorrência.');
    } finally { setSavingRecurrence(false); }
  };

  const openAdditiveDialog = () => {
    if (!deal) return;
    setAdditiveTitle(`[Aditivo] ${deal.title}`);
    setAdditiveAmount(0);
    setAdditiveOpen(true);
  };

  const handleCreateAdditive = async () => {
    if (!deal) return;
    try {
      setSavingAdditive(true);
      await (mockApi.deals.create as Function)({
        title: additiveTitle,
        description: `Aditivo (change request) do negócio ${deal.dealCode || deal.title}. Negócio base criado em ${fmtDate(deal.createdAt)}.`,
        amount: additiveAmount,
        pipelineId: deal.pipelineId,
        stageId: deal.stageId,
        accountId: deal.accountId,
        primaryContactId: deal.primaryContactId,
        ownerId: deal.ownerId,
        deliveryModel: deal.deliveryModel,
        portfolioItems: deal.portfolioItems,
        businessUnit: deal.businessUnit,
        dealSource: deal.dealSource,
        parentDealId: deal.id,
        parentDealTitle: deal.title,
        relationType: 'additive',
        additiveNumber: 1,
        tags: deal.tags,
      });
      setAdditiveOpen(false);
      setInfoMessage('Aditivo (change request) criado com sucesso! Acesse o Pipeline para visualizá-lo.');
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erro ao criar aditivo.');
    } finally { setSavingAdditive(false); }
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

  const weightedAmount = Math.round((deal.amount * deal.probability) / 100);
  const daysToClose = deal.expectedCloseDate ? daysBetween(deal.expectedCloseDate) : null;
  const daysOpen = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / 86400000);
  const stageIndex = stages.findIndex((s) => s.id === deal.stageId);
  const currentStageObj = stages[stageIndex];
  const rottingDays = deal.rottingDays || 0;
  const urgency = daysToClose !== null && daysToClose < 0 ? 'overdue'
    : daysToClose !== null && daysToClose <= 7 ? 'critical'
    : daysToClose !== null && daysToClose <= 21 ? 'warning' : 'normal';
  const urgencyColor = { overdue: 'error', critical: 'error', warning: 'warning', normal: 'success' }[urgency] as 'error' | 'warning' | 'success';

  const lostReasonTypeDisplay = deal.customFields?.lostReasonType as LostReasonType | undefined;
  const lostObservationDisplay = deal.customFields?.lostObservation as string | undefined;
  const isRecurrence = deal.relationType === 'recurrence';
  const isAdditive = deal.relationType === 'additive';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* ── Topbar ── */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/deals')} size="small" sx={{ color: 'text.secondary' }}>
          Voltar para Pipeline
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Editar
          </Button>
          <Tooltip title="Criar um novo negócio como recorrência deste">
            <Button variant="outlined" size="small" color="primary" startIcon={<RecurrenceIcon />} onClick={openRecurrenceDialog}>
              Recorrência
            </Button>
          </Tooltip>
          <Tooltip title="Criar um aditivo (change request) vinculado a este negócio">
            <Button variant="outlined" size="small" color="secondary" startIcon={<AdditiveIcon />} onClick={openAdditiveDialog}>
              Aditivo
            </Button>
          </Tooltip>
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
        {infoMessage && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setInfoMessage(null)}>{infoMessage}</Alert>}
        {actionError && <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setActionError(null)}>{actionError}</Alert>}

        {/* Vínculo com negócio pai */}
        {deal.parentDealId && (
          <Alert
            severity={isRecurrence ? 'info' : 'warning'}
            sx={{ mb: 1.5 }}
            icon={isRecurrence ? <RecurrenceIcon /> : <AdditiveIcon />}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isRecurrence ? `Recorrência #${deal.recurrenceNumber || 1}` : `Aditivo #${deal.additiveNumber || 1}`} vinculado ao negócio:
            </Typography>
            <Typography variant="body2">
              "{deal.parentDealTitle}" — criado em {fmtDate(deal.createdAt)}
            </Typography>
          </Alert>
        )}

        {/* ── Header ── */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {deal.title}
                </Typography>
                {deal.dealCode && (
                  <Chip
                    label={deal.dealCode}
                    size="small"
                    variant="outlined"
                    icon={<TagIcon sx={{ fontSize: 12 }} />}
                    sx={{ fontFamily: 'monospace', fontSize: 11, height: 22 }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {deal.account?.name || 'Conta não informada'}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
              <Chip label={deal.stage?.name || '—'} size="small"
                sx={{ fontWeight: 700, bgcolor: `${currentStageObj?.color || '#6366F1'}22`, color: currentStageObj?.color || '#6366F1', border: 'none' }}
              />
              <Chip label={`${deal.probability}%`} size="small" variant="outlined" />
              <Chip
                label={deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Aberto'}
                size="small"
                color={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'error' : 'default'}
                variant="outlined"
              />
              {deal.deliveryModel && (
                <Chip label={DELIVERY_LABEL[deal.deliveryModel] || deal.deliveryModel} size="small" variant="outlined" color="primary" />
              )}
              {isRecurrence && <Chip label={`Recorrência #${deal.recurrenceNumber || 1}`} size="small" color="info" />}
              {isAdditive && <Chip label={`Aditivo #${deal.additiveNumber || 1}`} size="small" color="secondary" />}
              {deal.tags?.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: 11 }} />)}
            </Stack>
          </Box>

          {stages.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                {stages.filter((s) => s.name !== 'Perdido').map((stage, idx) => {
                  const isActive = stage.id === deal.stageId;
                  const isPast = idx < stageIndex;
                  return (
                    <Tooltip key={stage.id} title={`${stage.name} · ${stage.probability}%`}>
                      <Box sx={{ flex: 1, height: 5, borderRadius: 1, bgcolor: isActive ? stage.color : isPast ? `${stage.color}60` : 'action.disabledBackground' }} />
                    </Tooltip>
                  );
                })}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, display: 'block' }}>
                {currentStageObj?.name} · {currentStageObj?.probability}%
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Layout 2 colunas ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 300px' }, gap: 2, alignItems: 'start' }}>

          {/* Coluna esquerda: tabs */}
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, pt: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontWeight: 600 } }}>
                <Tab label="Visão Geral" />
                <Tab label={`Atividades${nonStageActivities.length > 0 ? ` (${nonStageActivities.length})` : ''}`} />
                <Tab label="Propostas" icon={<ProposalIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
                <Tab label="Faturamento" />
                <Tab label="Histórico de Estágio" />
              </Tabs>
            </Box>

            {/* ── Tab 0: Visão Geral ── */}
            <TabPanel value={tab} index={0}>
              <Box sx={{ px: 2, pb: 2 }}>
                <SectionLabel>Descrição</SectionLabel>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                  {deal.description || 'Sem descrição cadastrada.'}
                </Typography>

                <Divider sx={{ my: 2 }} />
                <SectionLabel>Dados do Negócio</SectionLabel>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  {[
                    { label: 'Código', value: deal.dealCode, icon: <TagIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Responsável', value: deal.owner?.fullName, icon: <PersonIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Contato principal', value: deal.primaryContact?.fullName, icon: <PersonIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Empresa', value: deal.account?.name, icon: <BusinessIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Fechamento previsto', value: fmtDate(deal.expectedCloseDate), icon: <ScheduleIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Criado em', value: fmtDate(deal.createdAt), icon: <ScheduleIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Atualizado em', value: fmtDate(deal.updatedAt), icon: <ScheduleIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Fechado em', value: fmtDate(deal.closedAt), icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Fonte do negócio', value: deal.dealSource, icon: <FlagIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Indicação', value: deal.referral, icon: <PersonIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Unidade', value: deal.businessUnit, icon: <BusinessIcon sx={{ fontSize: 14 }} /> },
                    { label: 'Modalidade entrega', value: deal.deliveryModel ? DELIVERY_LABEL[deal.deliveryModel] : undefined, icon: <DeliveryIcon sx={{ fontSize: 14 }} /> },
                  ].filter((item) => item.value).map(({ label, value, icon }) => (
                    <Grid item xs={12} sm={6} md={4} key={label}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.secondary', mb: 0.2 }}>
                          {icon}
                          <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 10 }}>
                            {label}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Portfólio */}
                {deal.portfolioItems && deal.portfolioItems.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <SectionLabel>Itens do Portfólio</SectionLabel>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {deal.portfolioItems.map((item) => (
                        <Chip key={item} label={item} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Alocação */}
                {deal.deliveryModel === 'alocacao' && (
                  <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.50' }}>
                    <SectionLabel>Detalhes de Alocação</SectionLabel>
                    <Grid container spacing={1.5} sx={{ mt: 0.3 }}>
                      {deal.allocationQty && (
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Quantidade</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.allocationQty} alocação(ões)</Typography>
                        </Grid>
                      )}
                      {deal.allocationTerm && (
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Prazo</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.allocationTerm}</Typography>
                        </Grid>
                      )}
                      {deal.allocationHours && (
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Horas</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.allocationHours}h</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {/* Perda */}
                {deal.status === 'lost' && (lostReasonTypeDisplay || lostObservationDisplay || deal.lostReason) && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Motivo da perda</Typography>
                    {lostReasonTypeDisplay && (
                      <Typography variant="body2">{LOST_REASON_LABELS[lostReasonTypeDisplay]}</Typography>
                    )}
                    {(lostObservationDisplay || deal.lostReason) && (
                      <Typography variant="body2" sx={{ mt: 0.3 }}>
                        {lostObservationDisplay || deal.lostReason}
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>
            </TabPanel>

            {/* ── Tab 1: Atividades ── */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.8, display: 'block', mb: 0.8 }}>
                    Registrar nota rápida
                  </Typography>
                  <TextField
                    fullWidth multiline minRows={2} size="small"
                    placeholder="Registre uma observação, próximo passo…"
                    value={quickNote} onChange={(e) => setQuickNote(e.target.value)} sx={{ mb: 0.8 }}
                  />
                  <Button size="small" variant="contained" onClick={handleQuickNote} disabled={!quickNote.trim() || savingNote}>
                    {savingNote ? 'Salvando…' : 'Salvar nota'}
                  </Button>
                </Box>

                {nonStageActivities.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">Nenhuma atividade registrada.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, bgcolor: 'divider' }} />
                    <Stack spacing={0}>
                      {nonStageActivities.map((activity, idx) => (
                        <Box key={activity.id} sx={{ display: 'flex', gap: 1.5, pb: idx < nonStageActivities.length - 1 ? 2 : 0, position: 'relative' }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, zIndex: 1, bgcolor: activityColor(activity.type), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {activityIcon(activity.type)}
                          </Box>
                          <Box sx={{ flex: 1, pt: 0.3, pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{activity.subject}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, fontSize: 11 }}>
                                {new Date(activity.activityDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                            <Chip label={activity.type} size="small" sx={{ height: 16, fontSize: 10, mb: 0.5, bgcolor: `${activityColor(activity.type)}20`, color: activityColor(activity.type), border: 'none' }} />
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

            {/* ── Tab 2: Propostas ── */}
            <TabPanel value={tab} index={2}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Propostas vinculadas a este negócio</Typography>
                  <Button size="small" variant="outlined" startIcon={<ProposalIcon />}>
                    Nova Proposta
                  </Button>
                </Box>
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <ProposalIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    Nenhuma proposta vinculada a este negócio.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Crie propostas formais e as associe a este negócio para controle de versões.
                  </Typography>
                </Box>
              </Box>
            </TabPanel>

            {/* ── Tab 3: Faturamento ── */}
            <TabPanel value={tab} index={3}>
              <Box sx={{ px: 2, pb: 2, textAlign: 'center', py: 5 }}>
                <Typography color="text.secondary">Informações de faturamento serão exibidas aqui.</Typography>
                <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/billing/invoices')}>
                  Ver faturas
                </Button>
              </Box>
            </TabPanel>

            {/* ── Tab 4: Histórico de Estágio ── */}
            <TabPanel value={tab} index={4}>
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

          {/* ── Coluna direita ── */}
          <Stack spacing={1.5}>
            {/* KPIs */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AIIcon sx={{ fontSize: 15, color: '#7C3AED' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                  Métricas
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { label: 'Valor total', value: fmt(deal.amount), color: 'text.primary', bold: true },
                  { label: 'Valor ponderado', value: fmt(weightedAmount), color: '#7C3AED', bold: true },
                  { label: 'Dias em aberto', value: `${daysOpen}d`, color: 'text.primary', bold: false },
                  { label: 'Rotting', value: rottingDays > 0 ? `${rottingDays}d` : 'Normal', color: rottingDays >= 14 ? 'error.main' : rottingDays >= 9 ? 'warning.main' : 'success.main', bold: rottingDays >= 9 },
                ].map(({ label, value, color, bold }) => (
                  <Box key={label} sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', fontSize: 10 }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: bold ? 800 : 500, color, mt: 0.2 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ px: 1.5, pb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Probabilidade</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{deal.probability}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={deal.probability}
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: deal.probability >= 75 ? 'success.main' : deal.probability >= 50 ? '#F59E0B' : 'primary.main' } }}
                />
              </Box>
            </Paper>

            {/* Alertas */}
            {(urgency === 'critical' || urgency === 'overdue' || rottingDays >= 9) && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'warning.main', borderRadius: 2, bgcolor: '#FFFBEB' }}>
                <Box sx={{ px: 1.5, py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 0.8 }}>
                    <WarningIcon sx={{ fontSize: 15, color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }}>Atenção necessária</Typography>
                  </Box>
                  <Stack spacing={0.4}>
                    {urgency === 'overdue' && <Typography variant="caption" color="error.main">• Fechamento {Math.abs(daysToClose!)}d em atraso</Typography>}
                    {urgency === 'critical' && <Typography variant="caption" color="error.main">• {daysToClose}d para o fechamento</Typography>}
                    {rottingDays >= 9 && <Typography variant="caption" color={rottingDays >= 14 ? 'error.main' : 'warning.dark'}>• Rotting: {rottingDays}d sem movimentação</Typography>}
                  </Stack>
                </Box>
              </Paper>
            )}

            {/* Empresa */}
            {deal.account && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Empresa</Typography>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.account.name}</Typography>
                  {deal.account.industry && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{deal.account.industry}</Typography>}
                  <Button size="small" sx={{ mt: 0.5, p: 0 }} onClick={() => navigate(`/accounts/${deal.account!.id}`)}>
                    Ver conta
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Contato */}
            {deal.primaryContact && (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Contato Principal</Typography>
                </Box>
                <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                  <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{deal.primaryContact.fullName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.primaryContact.fullName}</Typography>
                    {deal.primaryContact.jobTitle && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{deal.primaryContact.jobTitle}</Typography>}
                    {deal.primaryContact.email && <Typography variant="caption" sx={{ color: 'primary.main', display: 'block' }}>{deal.primaryContact.email}</Typography>}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Tooltip title="Ligar">
                        <IconButton size="small" sx={{ bgcolor: '#10B98110', color: '#10B981' }}><CallIcon sx={{ fontSize: 14 }} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Enviar e-mail">
                        <IconButton size="small" sx={{ bgcolor: '#3B82F610', color: '#3B82F6' }}><EmailIcon sx={{ fontSize: 14 }} /></IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Infos */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>Informações</Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Stack spacing={0.8}>
                  {[
                    { label: 'Código', value: deal.dealCode || '—' },
                    { label: 'Criado em', value: fmtDate(deal.createdAt) },
                    { label: 'Atualizado em', value: fmtDate(deal.updatedAt) },
                    { label: 'Fechado em', value: fmtDate(deal.closedAt) },
                    { label: 'Pipeline', value: deal.pipeline?.name || '—' },
                    { label: 'Atividades', value: `${nonStageActivities.length}` },
                    ...(deal.deliveryModel ? [{ label: 'Entrega', value: DELIVERY_LABEL[deal.deliveryModel] || deal.deliveryModel }] : []),
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

      {/* ── Edit Modal ── */}
      <DealFormModal open={editOpen} mode="edit" initialData={deal}
        onClose={() => setEditOpen(false)} onSubmit={handleUpdateDeal}
        pipelineId={deal.pipelineId} stages={stages}
      />

      {/* ── Lost Dialog ── */}
      <Dialog open={lostDialogOpen} onClose={() => setLostDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Marcar negócio como perdido</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Motivo da perda *</InputLabel>
              <Select
                label="Motivo da perda *"
                value={lostReasonType}
                onChange={(e) => setLostReasonType(e.target.value as LostReasonType)}
              >
                {Object.entries(LOST_REASON_LABELS).map(([v, label]) => (
                  <MenuItem key={v} value={v}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth multiline minRows={3} size="small"
              label="Observações"
              placeholder="Descreva o contexto da perda, o que foi feito e próximos passos…"
              value={lostObservation}
              onChange={(e) => setLostObservation(e.target.value)}
              helperText="Esta informação alimenta os relatórios de análise de perdas."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setLostDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button color="error" variant="contained" disabled={!lostReasonType}
            onClick={async () => {
              await handleSetStatus('lost', lostObservation, lostReasonType, lostObservation);
              setLostDialogOpen(false);
              setLostReasonType('');
              setLostObservation('');
            }}>
            Confirmar perda
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Recurrence Dialog ── */}
      <Dialog open={recurrenceOpen} onClose={() => setRecurrenceOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          Criar Recorrência
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.2 }}>
            Um novo negócio será criado vinculado a este como recorrência
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Negócio original: <strong>{deal.title}</strong> ({deal.dealCode}) — {fmt(deal.amount)}
            </Alert>
            <TextField
              label="Título da recorrência *"
              fullWidth size="small"
              value={recurrenceTitle}
              onChange={(e) => setRecurrenceTitle(e.target.value)}
            />
            <TextField
              label="Valor (R$) *"
              type="number" fullWidth size="small"
              value={recurrenceAmount || ''}
              onChange={(e) => setRecurrenceAmount(Number(e.target.value))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRecurrenceOpen(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" disabled={savingRecurrence || !recurrenceTitle.trim()}
            startIcon={savingRecurrence ? <CircularProgress size={14} color="inherit" /> : <RecurrenceIcon />}
            onClick={handleCreateRecurrence}>
            {savingRecurrence ? 'Criando…' : 'Criar recorrência'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Additive Dialog ── */}
      <Dialog open={additiveOpen} onClose={() => setAdditiveOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          Criar Aditivo (Change Request)
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.2 }}>
            Um novo negócio será criado como aditivo vinculado a este
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Negócio base: <strong>{deal.title}</strong> ({deal.dealCode}) — {fmt(deal.amount)}
              <br />
              <Typography variant="caption">O valor do aditivo será somado ao valor base para cálculo do total.</Typography>
            </Alert>
            <TextField
              label="Título do aditivo *"
              fullWidth size="small"
              value={additiveTitle}
              onChange={(e) => setAdditiveTitle(e.target.value)}
            />
            <TextField
              label="Valor do aditivo (R$) *"
              type="number" fullWidth size="small"
              value={additiveAmount || ''}
              onChange={(e) => setAdditiveAmount(Number(e.target.value))}
              helperText={`Valor total após aditivo: ${fmt((deal.amount || 0) + (additiveAmount || 0))}`}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAdditiveOpen(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="secondary" disabled={savingAdditive || !additiveTitle.trim() || !additiveAmount}
            startIcon={savingAdditive ? <CircularProgress size={14} color="inherit" /> : <AdditiveIcon />}
            onClick={handleCreateAdditive}>
            {savingAdditive ? 'Criando…' : 'Criar aditivo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealDetailPage;
