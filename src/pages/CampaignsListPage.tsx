import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, MenuItem, Select, FormControl,
  InputLabel, CircularProgress, Tooltip, Stack, Snackbar, Alert,
  ButtonGroup, InputAdornment, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Campaign as CampaignIcon,
  ViewKanban as KanbanIcon, TableRows as TableIcon,
  Search as SearchIcon, TrendingUp as TrendingUpIcon, AttachMoney as MoneyIcon,
  People as PeopleIcon, Email as EmailIcon, Event as EventIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Campaign, CampaignStatus, CampaignType } from '../types';

// ── Constantes ──────────────────────────────────────────────────────────────

type ViewMode = 'kanban' | 'table';

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: 'Rascunho', active: 'Ativa', paused: 'Pausada', completed: 'Concluída',
};
const STATUS_COLORS: Record<CampaignStatus, 'default' | 'info' | 'warning' | 'success'> = {
  draft: 'default', active: 'info', paused: 'warning', completed: 'success',
};
const TYPE_LABELS: Record<CampaignType, string> = {
  email: 'E-mail', social: 'Social', event: 'Evento',
  multi_channel: 'Multicanal', ads: 'Anúncios', content: 'Conteúdo',
};

const KANBAN_COLUMNS: { status: CampaignStatus; label: string; color: string; bg: string }[] = [
  { status: 'draft',     label: 'Rascunho',  color: '#78909C', bg: '#ECEFF1' },
  { status: 'active',    label: 'Ativa',      color: '#1976D2', bg: '#E3F2FD' },
  { status: 'paused',    label: 'Pausada',    color: '#ED6C02', bg: '#FFF3E0' },
  { status: 'completed', label: 'Concluída',  color: '#2E7D32', bg: '#E8F5E9' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const fmtK = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `R$ ${(v / 1_000).toFixed(0)}K` : fmt(v);
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');
const pct = (a: number, b: number) => (b > 0 ? ((a / b) * 100).toFixed(1) : '0');

function budgetColor(spent: number, budget: number): 'success' | 'warning' | 'error' {
  const ratio = budget > 0 ? spent / budget : 0;
  if (ratio >= 0.95) return 'error';
  if (ratio >= 0.75) return 'warning';
  return 'success';
}

// ── KPI Card ────────────────────────────────────────────────────────────────

const KpiCard: React.FC<{
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string;
}> = ({ icon, label, value, sub, color }) => (
  <Paper
    elevation={0}
    sx={{ flex: 1, minWidth: 160, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
      <Box sx={{ color }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
    </Stack>
    <Typography variant="h5" fontWeight={700}>{value}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Paper>
);

// ── Campaign Card (Kanban) ──────────────────────────────────────────────────

const CampaignCard: React.FC<{ campaign: Campaign; onClick: () => void }> = ({ campaign, onClick }) => {
  const spendRatio = campaign.budget > 0 ? (campaign.actualSpend / campaign.budget) * 100 : 0;
  const bColor = budgetColor(campaign.actualSpend, campaign.budget);

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 2, mb: 1.5, cursor: 'pointer', border: '1px solid', borderColor: 'divider',
        borderRadius: 2, transition: 'all 0.2s',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>{campaign.name}</Typography>
        {campaign.aiSummary && (
          <Tooltip title="Resumo IA disponível">
            <AIIcon sx={{ fontSize: 16, color: '#7C3AED', ml: 0.5 }} />
          </Tooltip>
        )}
      </Stack>

      <Chip label={TYPE_LABELS[campaign.type]} size="small" sx={{ mb: 1, fontSize: 11 }} />

      <Box mb={1}>
        <Stack direction="row" justifyContent="space-between" mb={0.25}>
          <Typography variant="caption" color="text.secondary">Orçamento</Typography>
          <Typography variant="caption" fontWeight={600}>{pct(campaign.actualSpend, campaign.budget)}%</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min(spendRatio, 100)}
          color={bColor}
          sx={{ height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" color="text.secondary" mt={0.25}>
          {fmtK(campaign.actualSpend)} / {fmtK(campaign.budget)}
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Chip
          icon={<PeopleIcon sx={{ fontSize: 14 }} />}
          label={`${campaign.kpis.leadsGenerated} leads`}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11 }}
        />
        <Chip
          icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
          label={`ROI ${campaign.kpis.roi.toFixed(1)}x`}
          size="small"
          color={campaign.kpis.roi >= 2 ? 'success' : campaign.kpis.roi >= 1 ? 'info' : 'default'}
          sx={{ fontSize: 11 }}
        />
      </Stack>

      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        {fmtDate(campaign.startDate)} — {fmtDate(campaign.endDate)}
      </Typography>
    </Paper>
  );
};

// ── Componente Principal ────────────────────────────────────────────────────

const CampaignsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await mockApi.marketingCampaigns.list();
      if (res.isSuccess && res.data) setCampaigns(res.data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = [...campaigns];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (filterType !== 'all') list = list.filter(c => c.type === filterType);
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus);
    return list;
  }, [campaigns, search, filterType, filterStatus]);

  // ── KPIs agregados ──
  const kpis = useMemo(() => {
    const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
    const totalSpend = campaigns.reduce((s, c) => s + c.actualSpend, 0);
    const totalLeads = campaigns.reduce((s, c) => s + c.kpis.leadsGenerated, 0);
    const totalRevenue = campaigns.reduce((s, c) => s + c.kpis.revenueInfluenced, 0);
    const avgRoi = campaigns.length > 0
      ? campaigns.reduce((s, c) => s + c.kpis.roi, 0) / campaigns.length : 0;
    const totalClosed = campaigns.reduce((s, c) => s + c.kpis.closedDeals, 0);
    const conversionRate = totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0;
    const totalEmails = campaigns.reduce((s, c) => s + c.kpis.emailsSent, 0);
    const avgOpenRate = campaigns.filter(c => c.kpis.emailsSent > 0).length > 0
      ? campaigns.filter(c => c.kpis.emailsSent > 0).reduce((s, c) => s + c.kpis.emailOpenRate, 0)
        / campaigns.filter(c => c.kpis.emailsSent > 0).length : 0;
    const totalEvents = campaigns.reduce((s, c) => s + c.kpis.eventsHeld, 0);
    const totalAttendees = campaigns.reduce((s, c) => s + c.kpis.eventAttendees, 0);
    const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;

    return {
      totalBudget, totalSpend, totalLeads, totalRevenue, avgRoi,
      conversionRate, totalEmails, avgOpenRate, totalEvents, totalAttendees, costPerLead,
    };
  }, [campaigns]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <CampaignIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>Campanhas de Marketing</Typography>
          <Chip label={campaigns.length} size="small" color="primary" />
        </Stack>
        <Stack direction="row" spacing={1}>
          <ButtonGroup size="small" variant="outlined">
            <Button
              startIcon={<KanbanIcon />}
              variant={viewMode === 'kanban' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
            <Button
              startIcon={<TableIcon />}
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
            >
              Tabela
            </Button>
          </ButtonGroup>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSnack({ open: true, msg: 'Criar campanha (em breve)', severity: 'success' })}>
            Nova Campanha
          </Button>
        </Stack>
      </Stack>

      {/* KPIs */}
      <Stack direction="row" spacing={2} mb={3} sx={{ overflowX: 'auto', pb: 1 }}>
        <KpiCard icon={<MoneyIcon />} label="Total Investido" value={fmtK(kpis.totalBudget)} sub={`Gasto real: ${fmtK(kpis.totalSpend)}`} color="#2E7D32" />
        <KpiCard icon={<PeopleIcon />} label="Leads Gerados" value={kpis.totalLeads.toLocaleString('pt-BR')} sub={`Custo/lead: ${fmt(kpis.costPerLead)}`} color="#1976D2" />
        <KpiCard icon={<TrendingUpIcon />} label="Receita Influenciada" value={fmtK(kpis.totalRevenue)} sub={`ROI médio: ${kpis.avgRoi.toFixed(1)}x`} color="#7C3AED" />
        <KpiCard icon={<TrendingUpIcon />} label="Taxa Conversão" value={`${kpis.conversionRate.toFixed(1)}%`} sub={`Deals fechados / leads`} color="#ED6C02" />
        <KpiCard icon={<EmailIcon />} label="Emails Enviados" value={kpis.totalEmails.toLocaleString('pt-BR')} sub={`Avg open rate: ${kpis.avgOpenRate.toFixed(1)}%`} color="#0288D1" />
        <KpiCard icon={<EventIcon />} label="Eventos" value={String(kpis.totalEvents)} sub={`${kpis.totalAttendees.toLocaleString('pt-BR')} participantes`} color="#C62828" />
      </Stack>

      {/* Filtros */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Buscar campanhas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Tipo</InputLabel>
            <Select value={filterType} label="Tipo" onChange={e => setFilterType(e.target.value)}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="email">E-mail</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="event">Evento</MenuItem>
              <MenuItem value="multi_channel">Multicanal</MenuItem>
              <MenuItem value="ads">Anúncios</MenuItem>
              <MenuItem value="content">Conteúdo</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={e => setFilterStatus(e.target.value)}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="draft">Rascunho</MenuItem>
              <MenuItem value="active">Ativa</MenuItem>
              <MenuItem value="paused">Pausada</MenuItem>
              <MenuItem value="completed">Concluída</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2, minHeight: 400 }}>
          {KANBAN_COLUMNS.map(col => {
            const colCampaigns = filtered.filter(c => c.status === col.status);
            return (
              <Box key={col.status} sx={{ minWidth: 300, maxWidth: 320, flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: col.bg,
                    borderLeft: `4px solid ${col.color}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: col.color }}>
                      {col.label}
                    </Typography>
                    <Chip label={colCampaigns.length} size="small" sx={{ bgcolor: col.color, color: '#fff', fontWeight: 700 }} />
                  </Stack>
                </Paper>
                <Box sx={{ maxHeight: 'calc(100vh - 420px)', overflowY: 'auto', pr: 0.5 }}>
                  {colCampaigns.map(c => (
                    <CampaignCard key={c.id} campaign={c} onClick={() => navigate(`/marketing/campaigns/${c.id}`)} />
                  ))}
                  {colCampaigns.length === 0 && (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                      Nenhuma campanha
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Orçamento</TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Gasto</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Leads</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Receita</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">ROI</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Responsável</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Período</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(c => {
                const spendPct = c.budget > 0 ? (c.actualSpend / c.budget) * 100 : 0;
                return (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                    onClick={() => navigate(`/marketing/campaigns/${c.id}`)}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                        {c.aiSummary && <AIIcon sx={{ fontSize: 14, color: '#7C3AED' }} />}
                      </Stack>
                    </TableCell>
                    <TableCell><Chip label={TYPE_LABELS[c.type]} size="small" sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell><Chip label={STATUS_LABELS[c.status]} size="small" color={STATUS_COLORS[c.status]} /></TableCell>
                    <TableCell align="right">{fmtK(c.budget)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(spendPct, 100)}
                          color={budgetColor(c.actualSpend, c.budget)}
                          sx={{ height: 6, borderRadius: 3, width: '100%' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {fmtK(c.actualSpend)} ({spendPct.toFixed(0)}%)
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{c.kpis.leadsGenerated}</TableCell>
                    <TableCell align="right">{fmtK(c.kpis.revenueInfluenced)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${c.kpis.roi.toFixed(1)}x`}
                        size="small"
                        color={c.kpis.roi >= 2 ? 'success' : c.kpis.roi >= 1 ? 'info' : 'default'}
                        sx={{ fontSize: 11, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{c.ownerName}</TableCell>
                    <TableCell>
                      <Typography variant="caption">{fmtDate(c.startDate)} — {fmtDate(c.endDate)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">Nenhuma campanha encontrada</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignsListPage;
