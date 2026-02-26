import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Slider,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  FormatListBulleted as ListIcon,
  Insights as FunnelIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  People as ReferralIcon,
  Event as EventIcon,
  VideoCall as WebinarIcon,
  Download as DownloadIcon,
  AlternateEmail as ColdIcon,
  Search as SearchIcon,
  Transform as TransformIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  LocalFireDepartment as HotIcon,
  BoltOutlined as WarmIcon,
  AcUnit as ColdScoreIcon,
} from '@mui/icons-material';
import LifecycleFunnelTab from './LifecycleFunnelTab';
import { mockApi } from '../mock/api';
import { TableSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import type {
  ConvertLeadPayload,
  Lead,
  LeadFilters,
  LeadFormData,
  LeadScoreDetails,
  LeadSource,
  LeadStatus,
  Pipeline,
  User,
} from '../types';

// ── Design helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#7C3AED','#2563EB','#DC2626','#D97706','#16A34A','#0891B2','#DB2777','#EA580C'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const SOURCE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  website:          { label: 'Website',          icon: <WebsiteIcon sx={{ fontSize: 13 }} />,  color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  linkedin:         { label: 'LinkedIn',         icon: <LinkedInIcon sx={{ fontSize: 13 }} />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  referral:         { label: 'Referral',         icon: <ReferralIcon sx={{ fontSize: 13 }} />, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  event:            { label: 'Evento',           icon: <EventIcon sx={{ fontSize: 13 }} />,    color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  webinar:          { label: 'Webinar',          icon: <WebinarIcon sx={{ fontSize: 13 }} />,  color: '#EA580C', bg: 'rgba(234,88,12,0.1)' },
  content_download: { label: 'Content',          icon: <DownloadIcon sx={{ fontSize: 13 }} />, color: '#0891B2', bg: 'rgba(8,145,178,0.1)' },
  cold_outreach:    { label: 'Cold Outreach',    icon: <ColdIcon sx={{ fontSize: 13 }} />,     color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:          { label: 'Novo',           color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  working:      { label: 'Trabalhando',    color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  nurturing:    { label: 'Nurturing',      color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  unqualified:  { label: 'Desqualificado', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  converted:    { label: 'Convertido',     color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
};

const LIFECYCLE_CONFIG: Record<string, { label: string; color: string }> = {
  subscriber: { label: 'Subscriber', color: '#64748B' },
  lead:       { label: 'Lead',       color: '#2563EB' },
  mql:        { label: 'MQL',        color: '#7C3AED' },
  sql:        { label: 'SQL',        color: '#16A34A' },
};

const sourceLabels: Record<LeadSource, string> = {
  website: 'Website',
  linkedin: 'LinkedIn',
  referral: 'Referral',
  event: 'Evento',
  webinar: 'Webinar',
  content_download: 'Content Download',
  cold_outreach: 'Cold Outreach',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'Novo',
  working: 'Trabalhando',
  nurturing: 'Nurturing',
  unqualified: 'Desqualificado',
  converted: 'Convertido',
};

const sourceOptions = Object.entries(sourceLabels) as Array<[LeadSource, string]>;
const statusOptions = Object.entries(statusLabels) as Array<[LeadStatus, string]>;

const relativeTime = (isoDate?: string): string => {
  if (!isoDate) return 'agora';
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.floor(deltaMs / (1000 * 60)));
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
};

const scoreColor = (score: number): { label: string; color: 'error' | 'warning' | 'info' } => {
  if (score >= 70) return { label: '🔥 Hot', color: 'error' };
  if (score >= 40) return { label: '⚡ Warm', color: 'warning' };
  return { label: '❄️ Cold', color: 'info' };
};

const LeadScoreTooltipContent: React.FC<{
  details?: LeadScoreDetails;
  isLoading: boolean;
  onRecalculate: () => void;
  recalculating: boolean;
}> = ({ details, isLoading, onRecalculate, recalculating }) => {
  if (isLoading) {
    return (
      <Box sx={{ width: 340, p: 1.5 }}>
        <Typography variant="body2">Carregando breakdown...</Typography>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ width: 340, p: 1.5 }}>
        <Typography variant="body2">Breakdown indisponível</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 360, p: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Lead Score Breakdown
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AutorenewIcon fontSize="small" />}
          onClick={onRecalculate}
          disabled={recalculating}
        >
          Recalcular
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Total: <strong>{details.total}/100</strong> ({details.classification.toUpperCase()})
      </Typography>

      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        Demographic Fit: {details.breakdown.demographicFit.score}/
        {details.breakdown.demographicFit.maxScore}
      </Typography>
      <Box sx={{ my: 0.5 }}>
        {details.breakdown.demographicFit.factors.slice(0, 4).map((factor) => (
          <Typography key={factor.name} variant="caption" sx={{ display: 'block' }}>
            {factor.value >= 0 ? '✅' : '⚠️'} {factor.reason} ({factor.value >= 0 ? '+' : ''}
            {factor.value})
          </Typography>
        ))}
      </Box>

      <Typography variant="caption" sx={{ fontWeight: 700, mt: 1, display: 'block' }}>
        Behavioral Engagement: {details.breakdown.behavioralEngagement.score}/
        {details.breakdown.behavioralEngagement.maxScore}
      </Typography>
      <Box sx={{ my: 0.5 }}>
        {details.breakdown.behavioralEngagement.factors.slice(0, 4).map((factor) => (
          <Typography key={factor.name} variant="caption" sx={{ display: 'block' }}>
            ✅ {factor.reason} (+{factor.value})
          </Typography>
        ))}
      </Box>

      {details.triggers.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Triggers recentes
          </Typography>
          {details.triggers.slice(0, 3).map((trigger) => (
            <Typography key={`${trigger.event}-${trigger.timestamp}`} variant="caption" sx={{ display: 'block' }}>
              {trigger.icon} {trigger.event} ({relativeTime(trigger.timestamp)})
            </Typography>
          ))}
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Última atualização: {relativeTime(details.lastCalculatedAt)}
      </Typography>
    </Box>
  );
};

const LeadsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [ownerId, setOwnerId] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<Lead['lifecycle'] | ''>('');
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);

  const [scoreDetails, setScoreDetails] = useState<Record<string, LeadScoreDetails>>({});
  const [scoreLoadingByLeadId, setScoreLoadingByLeadId] = useState<Record<string, boolean>>({});
  const [scoreRecalculatingByLeadId, setScoreRecalculatingByLeadId] = useState<Record<string, boolean>>({});

  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [convertSaving, setConvertSaving] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);
  const [accountName, setAccountName] = useState('');
  const [convertOwnerId, setConvertOwnerId] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState<'mql' | 'sql'>('mql');
  const [createDeal, setCreateDeal] = useState(false);
  const [dealName, setDealName] = useState('');
  const [dealAmount, setDealAmount] = useState(50000);
  const [pipelineId, setPipelineId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    source: 'website',
    status: 'new',
    ownerId: '',
    lifecycle: 'lead',
    tags: [],
    customFields: {},
  });

  const currentFilters: LeadFilters = useMemo(
    () => ({
      search,
      status,
      source,
      lifecycle: lifecycleFilter,
      ownerId: ownerId || undefined,
      scoreMin: scoreRange[0],
      scoreMax: scoreRange[1],
    }),
    [search, status, source, lifecycleFilter, ownerId, scoreRange]
  );

  useEffect(() => {
    const lifecycleFromQuery = searchParams.get('lifecycle');
    if (
      lifecycleFromQuery === 'subscriber' ||
      lifecycleFromQuery === 'lead' ||
      lifecycleFromQuery === 'mql'
    ) {
      setLifecycleFilter(lifecycleFromQuery);
    }
  }, [searchParams]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const [leadsRes, usersRes, pipelinesRes] = await Promise.all([
        mockApi.leads.list(currentFilters, page + 1, rowsPerPage),
        mockApi.users.list(),
        mockApi.pipelines.list(),
      ]);
      setLeads(leadsRes.data?.data || []);
      setTotal(leadsRes.data?.pagination.total || 0);
      setUsers(usersRes.data || []);
      setPipelines(pipelinesRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [page, rowsPerPage, currentFilters]);

  useEffect(() => {
    if (!leadForm.ownerId && users[0]) {
      setLeadForm((prev) => ({ ...prev, ownerId: users[0].id }));
    }
  }, [users]);

  const ensureScoreDetails = async (leadId: string) => {
    if (scoreDetails[leadId] || scoreLoadingByLeadId[leadId]) return;
    setScoreLoadingByLeadId((prev) => ({ ...prev, [leadId]: true }));
    try {
      const response = await mockApi.leads.getScoreDetails(leadId);
      if (response.data) {
        setScoreDetails((prev) => ({ ...prev, [leadId]: response.data as LeadScoreDetails }));
      }
    } finally {
      setScoreLoadingByLeadId((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  const handleRecalculate = async (leadId: string) => {
    setScoreRecalculatingByLeadId((prev) => ({ ...prev, [leadId]: true }));
    try {
      const response = await mockApi.leads.recalculateScore(leadId);
      if (response.data) {
        setScoreDetails((prev) => ({ ...prev, [leadId]: response.data as LeadScoreDetails }));
      }
      await loadLeads();
    } finally {
      setScoreRecalculatingByLeadId((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  const openConvertDialog = (lead: Lead) => {
    setConvertingLead(lead);
    setCreateAccount(true);
    setAccountName(lead.company || '');
    setConvertOwnerId(lead.ownerId);
    setLifecycleStage('mql');
    setCreateDeal(false);
    setDealName(
      lead.company
        ? `Oportunidade - ${lead.company}`
        : `Oportunidade - ${lead.firstName} ${lead.lastName}`
    );
    setPipelineId(pipelines[0]?.id || '');
    setDealAmount(50000);
  };

  const handleConvert = async () => {
    if (!convertingLead) return;
    try {
      setConvertSaving(true);
      const payload: ConvertLeadPayload = {
        leadId: convertingLead.id,
        createAccount,
        accountName: createAccount ? accountName : undefined,
        ownerId: convertOwnerId || convertingLead.ownerId,
        lifecycleStage,
        createDeal: createDeal
          ? {
              name: dealName,
              amount: Number(dealAmount) || 0,
              pipelineId: pipelineId || pipelines[0]?.id || '',
            }
          : undefined,
      };
      const response = await mockApi.leads.convert(payload);
      setConvertingLead(null);
      await loadLeads();
      setToast({ open: true, message: 'Lead convertido com sucesso', severity: 'success' });
      if (response.data?.contactId) {
        navigate(`/contacts/${response.data.contactId}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao converter lead');
    } finally {
      setConvertSaving(false);
    }
  };

  const openCreateDialog = () => {
    setEditingLead(null);
    setLeadForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      source: 'website',
      status: 'new',
      ownerId: users[0]?.id || '',
      lifecycle: 'lead',
      tags: [],
      customFields: {},
    });
    setFormOpen(true);
  };

  const openEditDialog = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      jobTitle: lead.jobTitle || '',
      source: lead.source,
      status: lead.status,
      ownerId: lead.ownerId,
      lifecycle: lead.lifecycle,
      tags: lead.tags || [],
      customFields: lead.customFields || {},
    });
    setFormOpen(true);
  };

  const handleSaveLead = async () => {
    try {
      setFormSaving(true);
      if (editingLead) {
        await mockApi.leads.update(editingLead.id, leadForm);
        setToast({ open: true, message: 'Lead atualizado com sucesso', severity: 'success' });
      } else {
        await mockApi.leads.create(leadForm);
        setToast({ open: true, message: 'Lead criado com sucesso', severity: 'success' });
      }
      setFormOpen(false);
      await loadLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar lead');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (lead.isConverted) {
      setError('Lead convertido não pode ser removido nesta etapa.');
      return;
    }
    if (!window.confirm(`Deseja remover o lead "${lead.fullName}"?`)) return;
    try {
      await mockApi.leads.delete(lead.id);
      await loadLeads();
      setToast({ open: true, message: 'Lead removido com sucesso', severity: 'success' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir lead');
    }
  };

  // KPIs derivados dos leads carregados
  const hotCount  = leads.filter((l) => l.leadScore >= 70).length;
  const warmCount = leads.filter((l) => l.leadScore >= 40 && l.leadScore < 70).length;
  const coldCount = leads.filter((l) => l.leadScore < 40).length;
  const convCount = leads.filter((l) => l.isConverted).length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Leads</Typography>
          <Typography variant="body2" color="text.secondary">
            Gestão de leads com scoring, qualificação e conversão para contato.
          </Typography>
        </Box>
        {activeTab === 0 && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            Novo Lead
          </Button>
        )}
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<ListIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Lista de Leads" sx={{ minHeight: 42, fontSize: 13 }} />
          <Tab icon={<FunnelIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Funil de Lifecycle" sx={{ minHeight: 42, fontSize: 13 }} />
        </Tabs>
      </Box>

      {/* ── Funil Tab ── */}
      {activeTab === 1 && <LifecycleFunnelTab />}

      {/* ── Lista Tab ── */}
      {activeTab === 0 && <>

      {/* KPI Strip */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          { icon: <HotIcon sx={{ fontSize: 15 }} />,       label: 'Hot (≥70)',    value: hotCount,  color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
          { icon: <WarmIcon sx={{ fontSize: 15 }} />,      label: 'Warm (40-69)', value: warmCount, color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
          { icon: <ColdScoreIcon sx={{ fontSize: 15 }} />, label: 'Cold (<40)',   value: coldCount, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { icon: <TransformIcon sx={{ fontSize: 15 }} />, label: 'Convertidos',  value: convCount, color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
          { icon: null,                                     label: 'Total página', value: leads.length, color: undefined, bg: undefined },
        ].map((kpi) => (
          <Paper key={kpi.label} variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: kpi.bg ?? 'background.paper' }}>
            {kpi.icon && <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1 }}>{kpi.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: kpi.color ?? 'text.primary', lineHeight: 1.2 }}>{kpi.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Filtros ── */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        {/* Linha 1: busca + dropdowns principais */}
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} sx={{ mb: 1.5 }}>
          <TextField
            size="small"
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={(e) => { setPage(0); setSearch(e.target.value); }}
            sx={{ flex: '1 1 240px' }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment>,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => { setPage(0); setStatus(e.target.value as LeadStatus | ''); }}>
              <MenuItem value="">Todos</MenuItem>
              {statusOptions.map(([key, label]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Canal</InputLabel>
            <Select value={source} label="Canal" onChange={(e) => { setPage(0); setSource(e.target.value as LeadSource | ''); }}>
              <MenuItem value="">Todos</MenuItem>
              {sourceOptions.map(([key, label]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Owner</InputLabel>
            <Select value={ownerId} label="Owner" onChange={(e) => { setPage(0); setOwnerId(e.target.value); }}>
              <MenuItem value="">Todos</MenuItem>
              {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Lifecycle</InputLabel>
            <Select value={lifecycleFilter} label="Lifecycle" onChange={(e) => { setPage(0); setLifecycleFilter(e.target.value as Lead['lifecycle'] | ''); }}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="subscriber">Subscriber</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="mql">MQL</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {/* Linha 2: score slider compacto */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 380 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', minWidth: 90 }}>
            Score: {scoreRange[0]}–{scoreRange[1]}
          </Typography>
          <Slider size="small" value={scoreRange} min={0} max={100} step={1} valueLabelDisplay="auto"
            onChange={(_, v) => { setPage(0); setScoreRange(v as number[]); }}
            sx={{ color: '#7C3AED' }}
          />
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* ── Tabela ── */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', pl: 2 }}>Lead</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>Canal</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', minWidth: 110 }}>Score</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>Owner</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', pr: 2 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={8} cols={6} />
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0, p: 0 }}>
                  <EmptyState variant="leads" title="Nenhum lead encontrado"
                    description="Ajuste os filtros ou adicione um novo lead para começar."
                    actionLabel="Novo Lead" onAction={() => navigate('/leads?action=new')} />
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const scoreInfo  = scoreColor(lead.leadScore);
                const srcCfg     = SOURCE_CONFIG[lead.source] ?? { label: sourceLabels[lead.source], icon: null, color: '#64748B', bg: 'transparent' };
                const stCfg      = lead.isConverted ? STATUS_CONFIG.converted : (STATUS_CONFIG[lead.status] ?? { label: statusLabels[lead.status], color: '#64748B', bg: 'transparent' });
                const lcCfg      = LIFECYCLE_CONFIG[lead.lifecycle] ?? { label: lead.lifecycle, color: '#64748B' };
                const scoreColor2 = lead.leadScore >= 70 ? '#DC2626' : lead.leadScore >= 40 ? '#D97706' : '#2563EB';

                return (
                  <TableRow key={lead.id} hover sx={{ '&:hover .lead-actions': { opacity: 1 } }}>

                    {/* Lead: avatar + nome + email + lifecycle */}
                    <TableCell sx={{ pl: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Avatar
                          sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 800, bgcolor: avatarColor(lead.fullName), borderRadius: 1, flexShrink: 0 }}
                        >
                          {lead.firstName.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                              onClick={() => navigate(`/leads/${lead.id}`)}>
                              {lead.fullName}
                            </Typography>
                            <Chip label={lcCfg.label} size="small"
                              sx={{ height: 16, fontSize: 9, fontWeight: 700, bgcolor: `${lcCfg.color}18`, color: lcCfg.color, border: 'none' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                            {lead.email}{lead.company ? ` · ${lead.company}` : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Canal */}
                    <TableCell>
                      <Chip
                        icon={<Box sx={{ color: `${srcCfg.color} !important`, display: 'flex' }}>{srcCfg.icon}</Box>}
                        label={srcCfg.label}
                        size="small"
                        sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: srcCfg.bg, color: srcCfg.color, border: 'none', '& .MuiChip-icon': { ml: '6px' } }}
                      />
                    </TableCell>

                    {/* Score: número + barra + badge */}
                    <TableCell>
                      <Tooltip placement="bottom-start" enterDelay={200} arrow
                        onOpen={() => ensureScoreDetails(lead.id)}
                        title={
                          <LeadScoreTooltipContent details={scoreDetails[lead.id]}
                            isLoading={Boolean(scoreLoadingByLeadId[lead.id])}
                            onRecalculate={() => handleRecalculate(lead.id)}
                            recalculating={Boolean(scoreRecalculatingByLeadId[lead.id])} />
                        }>
                        <Box sx={{ cursor: 'pointer', minWidth: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: scoreColor2, lineHeight: 1 }}>
                              {lead.leadScore}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: 10, color: scoreColor2, lineHeight: 1 }}>
                              {scoreInfo.label.split(' ').slice(1).join(' ')}
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={lead.leadScore}
                            sx={{ height: 4, borderRadius: 2, bgcolor: `${scoreColor2}22`,
                              '& .MuiLinearProgress-bar': { bgcolor: scoreColor2, borderRadius: 2 } }} />
                        </Box>
                      </Tooltip>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip label={stCfg.label} size="small"
                        sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: stCfg.bg, color: stCfg.color, border: 'none' }} />
                    </TableCell>

                    {/* Owner */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{lead.owner?.fullName || '—'}</Typography>
                    </TableCell>

                    {/* Ações */}
                    <TableCell align="right" sx={{ pr: 1.5 }}>
                      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.3}>
                        <Tooltip title="Ver detalhe">
                          <IconButton size="small" sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                            onClick={() => navigate(`/leads/${lead.id}`)}>
                            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <span>
                            <IconButton size="small" sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                              onClick={() => openEditDialog(lead)} disabled={lead.isConverted}>
                              <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Remover">
                          <span>
                            <IconButton size="small" color="error" sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}
                              onClick={() => handleDeleteLead(lead)} disabled={lead.isConverted}>
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {lead.isConverted ? (
                          <Chip label="Convertido" size="small"
                            sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: 'rgba(22,163,74,0.1)', color: '#16A34A', border: 'none' }} />
                        ) : (
                          <Tooltip title="Converter em Contato">
                            <Button variant="contained" size="small" startIcon={<TransformIcon sx={{ fontSize: 13 }} />}
                              onClick={() => openConvertDialog(lead)}
                              sx={{ height: 26, fontSize: 11, fontWeight: 700, px: 1.2, minWidth: 0 }}>
                              Converter
                            </Button>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination component="div" count={total} rowsPerPage={rowsPerPage} page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]} labelRowsPerPage="Itens por página"
        />
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                size="small"
                label="Nome"
                value={leadForm.firstName}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, firstName: event.target.value }))}
                fullWidth
              />
              <TextField
                size="small"
                label="Sobrenome"
                value={leadForm.lastName}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, lastName: event.target.value }))}
                fullWidth
              />
            </Stack>
            <TextField
              size="small"
              label="Email"
              value={leadForm.email}
              onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                size="small"
                label="Telefone"
                value={leadForm.phone || ''}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                fullWidth
              />
              <TextField
                size="small"
                label="Empresa"
                value={leadForm.company || ''}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, company: event.target.value }))}
                fullWidth
              />
            </Stack>
            <TextField
              size="small"
              label="Cargo"
              value={leadForm.jobTitle || ''}
              onChange={(event) => setLeadForm((prev) => ({ ...prev, jobTitle: event.target.value }))}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl size="small" fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={leadForm.source}
                  label="Source"
                  onChange={(event) =>
                    setLeadForm((prev) => ({ ...prev, source: event.target.value as LeadSource }))
                  }
                >
                  {sourceOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={leadForm.status}
                  label="Status"
                  onChange={(event) =>
                    setLeadForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))
                  }
                >
                  {statusOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <FormControl size="small" fullWidth>
              <InputLabel>Owner</InputLabel>
              <Select
                value={leadForm.ownerId}
                label="Owner"
                onChange={(event) => setLeadForm((prev) => ({ ...prev, ownerId: event.target.value }))}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={formSaving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLead}
            disabled={
              formSaving ||
              !leadForm.firstName.trim() ||
              !leadForm.lastName.trim() ||
              !leadForm.email.trim() ||
              !leadForm.ownerId
            }
          >
            {formSaving ? 'Salvando...' : editingLead ? 'Salvar alterações' : 'Criar lead'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(convertingLead)} onClose={() => setConvertingLead(null)} maxWidth="sm" fullWidth>
        <DialogTitle>✨ Converter Lead em Contact</DialogTitle>
        <DialogContent>
          {convertingLead && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {convertingLead.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {convertingLead.email} • Score {convertingLead.leadScore}
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Vendedor responsável</InputLabel>
                <Select
                  label="Vendedor responsável"
                  value={convertOwnerId}
                  onChange={(event) => setConvertOwnerId(event.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Lifecycle do Contact</InputLabel>
                <Select
                  label="Lifecycle do Contact"
                  value={lifecycleStage}
                  onChange={(event) => setLifecycleStage(event.target.value as 'mql' | 'sql')}
                >
                  <MenuItem value="mql">MQL</MenuItem>
                  <MenuItem value="sql">SQL</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={createAccount ? 'contained' : 'outlined'}
                  onClick={() => setCreateAccount((prev) => !prev)}
                >
                  {createAccount ? 'Conta: Sim' : 'Conta: Não'}
                </Button>
                <Button
                  variant={createDeal ? 'contained' : 'outlined'}
                  onClick={() => setCreateDeal((prev) => !prev)}
                >
                  {createDeal ? 'Deal: Sim' : 'Deal: Não'}
                </Button>
              </Box>

              {createAccount && (
                <TextField
                  size="small"
                  label="Nome da conta"
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                />
              )}

              {createDeal && (
                <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5}>
                  <TextField
                    size="small"
                    label="Nome do deal"
                    value={dealName}
                    onChange={(event) => setDealName(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Valor"
                    type="number"
                    value={dealAmount}
                    onChange={(event) => setDealAmount(Number(event.target.value))}
                  />
                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel>Pipeline</InputLabel>
                    <Select
                      label="Pipeline"
                      value={pipelineId}
                      onChange={(event) => setPipelineId(event.target.value)}
                    >
                      {pipelines.map((pipeline) => (
                        <MenuItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              )}

              <Alert severity="info">
                Serão transferidos para o contato: score, tags e campos customizados do lead.
              </Alert>
              <Alert severity="warning">
                O lead será marcado como <strong>Converted</strong> e ficará read-only.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertingLead(null)} disabled={convertSaving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConvert} disabled={convertSaving || !convertingLead}>
            {convertSaving ? 'Convertendo...' : 'Converter Lead'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      </> /* fim activeTab === 0 */}
    </Box>
  );
};

export default LeadsListPage;
