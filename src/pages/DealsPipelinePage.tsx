import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  TableRows as TableIcon,
  ViewKanban as KanbanIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Deal, Pipeline, Stage, DealFormData } from '../types';
import DealFormModal from '../components/DealFormModal';
import { PipelineSkeleton } from '../components/SkeletonLoader';

// ── Constantes ──────────────────────────────────────────────────────────────

type ViewMode = 'kanban' | 'table';
type SortField = 'amount' | 'rottingDays' | 'expectedCloseDate' | 'title' | 'stage' | 'owner' | 'status';
type SortDir = 'asc' | 'desc';

/** Ícone fixo por nome de estágio — identidade visual de cada etapa do pipeline */
const STAGE_ICONS: Record<string, string> = {
  'Prospecção':  '🔍',
  'Qualificação':'✅',
  'Viabilidade': '🧪',
  'Proposta':    '📄',
  'FUP':         '📞',
  'Fechamento':  '🏆',
  'Vencido':     '🏆',
  'Perdido':     '❌',
};
type QuickFilter = 'all' | 'mine' | 'rotting' | 'highvalue' | 'closing';

// ── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
const fmtK = (v: number) => v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `R$ ${(v / 1_000).toFixed(0)}K` : fmt(v);

function rottingColor(days: number): 'default' | 'warning' | 'error' {
  if (days >= 14) return 'error';
  if (days >= 9) return 'warning';
  return 'default';
}

// Prioridade = (valor * probabilidade%) / 100 / 1000
// Retorna: 'hot' (>= 500K ponderado), 'warm' (>= 150K), 'normal'
function dealPriority(amount: number, probability: number): 'hot' | 'warm' | 'normal' {
  const weighted = (amount * probability) / 100;
  if (weighted >= 500000) return 'hot';
  if (weighted >= 100000) return 'warm';
  return 'normal';
}

// ── Componente de card compacto ──────────────────────────────────────────────

interface DealCardProps {
  deal: Deal;
  compact: boolean;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, compact, draggingId, onDragStart, onDragEnd, onClick, onEdit }) => {
  const rotColor = rottingColor(deal.rottingDays || 0);
  const priority = dealPriority(deal.amount, deal.probability);
  const isDragging = draggingId === deal.id;

  const priorityAccent = priority === 'hot'
    ? { borderColor: '#F59E0B', bgcolor: 'rgba(245,158,11,0.08)' }
    : priority === 'warm'
    ? { borderColor: 'divider', bgcolor: 'background.paper' }
    : { borderColor: 'divider', bgcolor: 'background.paper' };

  return (
    <Paper
      draggable
      onDragStart={() => onDragStart(deal.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      elevation={0}
      sx={{
        cursor: 'grab',
        border: '1px solid',
        borderColor: rotColor === 'error'
          ? 'error.light'
          : priority === 'hot'
          ? '#F59E0B'
          : 'divider',
        borderRadius: 1.5,
        p: compact ? '7px 9px' : '10px 12px',
        opacity: isDragging ? 0.4 : 1,
        transition: 'box-shadow 0.15s, transform 0.1s',
        '&:hover': { boxShadow: 2, transform: 'translateY(-1px)' },
        '&:active': { cursor: 'grabbing' },
        bgcolor: rotColor === 'error' ? 'rgba(220,38,38,0.08)' : priorityAccent.bgcolor,
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Indicador lateral de prioridade */}
      {priority === 'hot' && (
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, bgcolor: '#F59E0B', borderRadius: '6px 0 0 6px' }} />
      )}

      {compact ? (
        /* ── Modo compacto ── */
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0.8, pl: priority === 'hot' ? 0.5 : 0 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.1 }}>
              {priority === 'hot' && <Box component="span" sx={{ fontSize: 10 }}>🔥</Box>}
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                {deal.title.split('—')[0].trim()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>
              {deal.account?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.2, flexShrink: 0 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'text.primary' }}>{fmtK(deal.amount)}</Typography>
            {rotColor !== 'default' && (
              <Chip
                label={`${deal.rottingDays}d`}
                size="small"
                color={rotColor}
                variant={rotColor === 'error' ? 'filled' : 'outlined'}
                sx={{ height: 15, fontSize: 10, '& .MuiChip-label': { px: 0.5 } }}
              />
            )}
          </Box>
        </Box>
      ) : (
        /* ── Modo detalhado ── */
        <Box sx={{ pl: priority === 'hot' ? 0.5 : 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.4 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                {priority === 'hot' && <Box component="span" sx={{ fontSize: 12 }}>🔥</Box>}
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.title.split('—')[0].trim()}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{deal.account?.name}</Typography>
            </Box>
            <Tooltip title="Editar deal">
              <IconButton size="small" sx={{ p: 0.2, flexShrink: 0, opacity: 0.4, '&:hover': { opacity: 1 } }} onClick={onEdit}>
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.6 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{fmt(deal.amount)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              {rotColor !== 'default' && (
                <Chip label={`${deal.rottingDays}d`} size="small" color={rotColor} variant={rotColor === 'error' ? 'filled' : 'outlined'}
                  sx={{ height: 18, fontSize: 10 }} />
              )}
              <Tooltip title={deal.owner?.fullName || ''}>
                <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>
                  {deal.owner?.fullName?.charAt(0)}
                </Avatar>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// ── Coluna do Kanban ─────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stage: Stage;
  deals: Deal[];
  compact: boolean;
  draggingId: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDealClick: (id: string) => void;
  onEditDeal: (deal: Deal, e: React.MouseEvent) => void;
}

// Altura do card por modo (para calcular a altura da coluna)
const CARD_HEIGHT_COMPACT = 52;
const CARD_HEIGHT_DETAILED = 78;
const COLUMN_MAX_CARDS = 8; // quantos cards ficam visíveis antes do scroll

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage, deals, compact, draggingId, onDragOver, onDrop,
  onDragStart, onDragEnd, onDealClick, onEditDeal,
}) => {
  const critical = deals.filter((d) => (d.rottingDays || 0) >= 14).length;
  const hot = deals.filter((d) => dealPriority(d.amount, d.probability) === 'hot').length;
  const totalValue = deals.reduce((s, d) => s + d.amount, 0);
  const cardH = compact ? CARD_HEIGHT_COMPACT : CARD_HEIGHT_DETAILED;
  const gap = 6;
  const colMaxHeight = COLUMN_MAX_CARDS * (cardH + gap) + 16; // padding

  return (
    <Box
      sx={{
        width: compact ? 210 : 252,
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Cabeçalho fixo */}
      <Box sx={{
        p: '10px 12px 8px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderTop: `3px solid ${stage.color}`,
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            {STAGE_ICONS[stage.name] && (
              <Box component="span" sx={{ fontSize: 12, lineHeight: 1, flexShrink: 0 }}>
                {STAGE_ICONS[stage.name]}
              </Box>
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap' }}>{stage.name}</Typography>
            {critical > 0 && (
              <Tooltip title={`${critical} com rotting crítico (≥14d)`}>
                <WarningIcon sx={{ fontSize: 13, color: 'error.main', flexShrink: 0 }} />
              </Tooltip>
            )}
            {hot > 0 && (
              <Tooltip title={`${hot} deal(s) prioritário(s)`}>
                <Box component="span" sx={{ fontSize: 11, lineHeight: 1 }}>🔥</Box>
              </Tooltip>
            )}
          </Box>
          <Chip
            label={deals.length}
            size="small"
            sx={{ height: 17, fontSize: 10, fontWeight: 800, bgcolor: `${stage.color}22`, color: stage.color, border: 'none', ml: 0.5, flexShrink: 0 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11 }}>
          {fmtK(totalValue)} · {stage.probability}%
        </Typography>
      </Box>

      {/* Área de cards com scroll interno */}
      <Box
        onDragOver={onDragOver}
        onDrop={onDrop}
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: colMaxHeight,
          bgcolor: 'background.default',
          p: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`,
          // Scrollbar discreta
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
        }}
      >
        {deals.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 80, gap: 0.5, opacity: 0.35 }}>
            <Typography sx={{ fontSize: 22, lineHeight: 1 }}>↓</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textAlign: 'center' }}>
              Arraste deals para cá
            </Typography>
          </Box>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              compact={compact}
              draggingId={draggingId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={() => onDealClick(deal.id)}
              onEdit={(e) => onEditDeal(deal, e)}
            />
          ))
        )}
      </Box>

      {/* Footer com contador de deals além do scroll */}
      {deals.length > COLUMN_MAX_CARDS && (
        <Box sx={{ px: 1.5, py: 0.6, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
            ↕ Role para ver {deals.length - COLUMN_MAX_CARDS} deals adicionais
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────

export const DealsPipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  // Filtros
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'won' | 'lost'>('open');
  const [amountMin, setAmountMin] = useState<string>('');
  const [amountMax, setAmountMax] = useState<string>('');
  const [rottingMin, setRottingMin] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // UI
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [compact, setCompact] = useState(true);
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [draggingDealId, setDraggingDealId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Mock do usuário atual (primeiro owner)
  const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

  const loadData = async () => {
    try {
      setLoading(true); setError(null);
      const pipelinesRes = await mockApi.pipelines.list();
      const currentPipeline = (pipelinesRes.data || [])[0];
      if (!currentPipeline) throw new Error('Nenhum pipeline cadastrado');
      setPipeline(currentPipeline);
      const [stagesRes, dealsRes] = await Promise.all([
        mockApi.pipelines.listStages(currentPipeline.id),
        mockApi.deals.list(),
      ]);
      setStages(stagesRes.data || []);
      setDeals((dealsRes.data || []).filter((d) => d.pipelineId === currentPipeline.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar pipeline');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const owners = useMemo(() => {
    const map = new Map<string, string>();
    deals.forEach((d) => { if (d.ownerId && d.owner?.fullName) map.set(d.ownerId, d.owner.fullName); });
    return Array.from(map.entries()).map(([id, fullName]) => ({ id, fullName }));
  }, [deals]);

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase();
    const today = new Date();
    const in30Days = new Date(); in30Days.setDate(today.getDate() + 30);

    return deals.filter((d) => {
      if (q && !d.title.toLowerCase().includes(q) && !d.account?.name?.toLowerCase().includes(q) && !d.owner?.fullName?.toLowerCase().includes(q)) return false;
      if (ownerFilter && d.ownerId !== ownerFilter) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (amountMin && d.amount < Number(amountMin)) return false;
      if (amountMax && d.amount > Number(amountMax)) return false;
      if (rottingMin && (d.rottingDays || 0) < Number(rottingMin)) return false;
      // Quick filters
      if (quickFilter === 'mine' && d.ownerId !== CURRENT_USER_ID) return false;
      if (quickFilter === 'rotting' && (d.rottingDays || 0) < 10) return false;
      if (quickFilter === 'highvalue' && d.amount < 500000) return false;
      if (quickFilter === 'closing') {
        const close = d.expectedCloseDate ? new Date(d.expectedCloseDate) : null;
        if (!close || close > in30Days) return false;
      }
      return true;
    });
  }, [deals, search, ownerFilter, statusFilter, amountMin, amountMax, rottingMin, quickFilter]);

  const sortedDeals = useMemo(() => {
    return [...filteredDeals].sort((a, b) => {
      let av: number | string = 0; let bv: number | string = 0;
      if (sortField === 'amount') { av = a.amount; bv = b.amount; }
      else if (sortField === 'rottingDays') { av = a.rottingDays || 0; bv = b.rottingDays || 0; }
      else if (sortField === 'expectedCloseDate') { av = a.expectedCloseDate || '9999'; bv = b.expectedCloseDate || '9999'; }
      else if (sortField === 'title') { av = a.title.toLowerCase(); bv = b.title.toLowerCase(); }
      else if (sortField === 'stage') {
        // Ordena pela probabilidade do estágio (proxy para posição no funil)
        av = a.stage?.probability ?? a.probability ?? 0;
        bv = b.stage?.probability ?? b.probability ?? 0;
      }
      else if (sortField === 'owner') {
        av = (a.owner?.fullName || '').toLowerCase();
        bv = (b.owner?.fullName || '').toLowerCase();
      }
      else if (sortField === 'status') {
        // won=0, open=1, lost=2 (ganhados primeiro, perdidos por último)
        const order = { won: 0, open: 1, lost: 2 };
        av = order[a.status as keyof typeof order] ?? 1;
        bv = order[b.status as keyof typeof order] ?? 1;
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [filteredDeals, sortField, sortDir]);

  // KPIs
  const openDeals = filteredDeals.filter((d) => d.status === 'open');
  const totalOpen = openDeals.reduce((s, d) => s + d.amount, 0);
  const totalWeighted = openDeals.reduce((s, d) => s + d.weightedAmount, 0);
  const wonDeals = filteredDeals.filter((d) => d.status === 'won');
  const wonValue = wonDeals.reduce((s, d) => s + d.amount, 0);
  const criticalCount = openDeals.filter((d) => (d.rottingDays || 0) >= 10).length;
  const winRate = (() => {
    const w = wonDeals.length; const l = filteredDeals.filter((d) => d.status === 'lost').length;
    return w + l === 0 ? 0 : (w / (w + l)) * 100;
  })();
  const avgRotting = openDeals.length === 0 ? 0 : openDeals.reduce((s, d) => s + (d.rottingDays || 0), 0) / openDeals.length;

  const activeFilterCount = [ownerFilter, amountMin, amountMax, rottingMin].filter(Boolean).length + (statusFilter !== 'open' ? 1 : 0);

  const handleDropInStage = async (stageId: string) => {
    if (!draggingDealId) return;
    const draggedDeal = deals.find((d) => d.id === draggingDealId);
    if (!draggedDeal || draggedDeal.stageId === stageId) return;
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;
    setDeals((prev) => prev.map((d) => d.id === draggingDealId
      ? { ...d, stageId: stage.id, stage, probability: stage.probability, weightedAmount: Math.round((d.amount * stage.probability) / 100) }
      : d));
    try { await mockApi.deals.moveToStage(draggingDealId, stageId); }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao mover deal'); await loadData(); }
  };

  const handleCreateDeal = async (payload: DealFormData) => { await mockApi.deals.create(payload); await loadData(); };
  const handleEditDeal = async (payload: DealFormData) => { if (!editingDeal) return; await mockApi.deals.update(editingDeal.id, payload); await loadData(); };

  const clearFilters = () => { setOwnerFilter(''); setStatusFilter('open'); setAmountMin(''); setAmountMax(''); setRottingMin(''); setQuickFilter('all'); };

  const handleTableSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  if (loading) return <Box sx={{ p: 3 }}><PipelineSkeleton columns={6} /></Box>;

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* ── Cabeçalho ────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>Pipeline de Deals</Typography>
          <Typography variant="body2" color="text.secondary">{pipeline?.name} · {filteredDeals.length} oportunidades visíveis</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Novo Deal</Button>
      </Box>

      {/* ── KPIs ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1 }}>
        {[
          { label: 'Pipeline aberto', value: fmtK(totalOpen), sub: `${openDeals.length} deals`, color: 'primary.main' },
          { label: 'Valor ponderado', value: fmtK(totalWeighted), sub: 'probabilidade × valor', color: '#7C3AED' },
          { label: 'Ganhos', value: fmtK(wonValue), sub: `${wonDeals.length} deals`, color: 'success.main' },
          { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, sub: 'deals ganhos/fechados', color: winRate >= 35 ? 'success.main' : 'warning.main' },
          { label: 'Aging médio', value: `${avgRotting.toFixed(1)}d`, sub: `${criticalCount} críticos`, color: avgRotting >= 8 ? 'error.main' : 'text.primary' },
        ].map(({ label, value, sub, color }) => (
          <Paper key={label} elevation={0} sx={{ p: '12px 14px', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color, lineHeight: 1.2, mt: 0.2 }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Barra de filtros ─────────────────────────────────────────── */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {/* Linha principal: busca + controles */}
        <Box sx={{ p: '10px 14px', display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar por nome, empresa, responsável…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: '1 1 260px' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button
            size="small"
            variant={filtersOpen ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            onClick={() => setFiltersOpen(!filtersOpen)}
            sx={{ flexShrink: 0 }}
          >
            Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
          <Divider orientation="vertical" flexItem />
          <ButtonGroup size="small" variant="outlined">
            <Tooltip title="Kanban">
              <Button onClick={() => setViewMode('kanban')} variant={viewMode === 'kanban' ? 'contained' : 'outlined'}>
                <KanbanIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Tabela">
              <Button onClick={() => setViewMode('table')} variant={viewMode === 'table' ? 'contained' : 'outlined'}>
                <TableIcon fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>
          {viewMode === 'kanban' && (
            <Tooltip title={compact ? 'Modo detalhado' : 'Modo compacto'}>
              <Button size="small" variant="outlined" onClick={() => setCompact(!compact)} sx={{ flexShrink: 0 }}>
                {compact ? 'Detalhado' : 'Compacto'}
              </Button>
            </Tooltip>
          )}
          {viewMode === 'table' && (
            <FormControl size="small" sx={{ minWidth: 160, flexShrink: 0 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select label="Ordenar por" value={`${sortField}_${sortDir}`}
                onChange={(e) => {
                  const parts = e.target.value.split('_');
                  const dir = parts.pop() as SortDir;
                  setSortField(parts.join('_') as SortField);
                  setSortDir(dir);
                }}>
                <MenuItem value="amount_desc">Maior valor</MenuItem>
                <MenuItem value="amount_asc">Menor valor</MenuItem>
                <MenuItem value="rottingDays_desc">Rotting maior</MenuItem>
                <MenuItem value="rottingDays_asc">Rotting menor</MenuItem>
                <MenuItem value="expectedCloseDate_asc">Fechar primeiro</MenuItem>
                <MenuItem value="expectedCloseDate_desc">Fechar por último</MenuItem>
                <MenuItem value="title_asc">Nome A–Z</MenuItem>
                <MenuItem value="title_desc">Nome Z–A</MenuItem>
                <MenuItem value="stage_asc">Estágio (início→fim)</MenuItem>
                <MenuItem value="stage_desc">Estágio (fim→início)</MenuItem>
                <MenuItem value="owner_asc">Responsável A–Z</MenuItem>
                <MenuItem value="status_asc">Status (ganhos primeiro)</MenuItem>
              </Select>
            </FormControl>
          )}
          {activeFilterCount > 0 && (
            <Button size="small" variant="text" color="inherit" onClick={clearFilters}>Limpar</Button>
          )}
        </Box>

        {/* Quick filters */}
        <Box sx={{ px: '14px', pb: '10px', display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          {([
            { id: 'all', label: 'Todos' },
            { id: 'mine', label: 'Meus deals' },
            { id: 'rotting', label: '⚠ Rotting crítico' },
            { id: 'highvalue', label: '💰 Alto valor (>500k)' },
            { id: 'closing', label: '📅 Fechar em 30d' },
          ] as { id: QuickFilter; label: string }[]).map(({ id, label }) => (
            <Chip
              key={id}
              label={label}
              size="small"
              variant={quickFilter === id ? 'filled' : 'outlined'}
              color={quickFilter === id ? 'primary' : 'default'}
              onClick={() => setQuickFilter(id)}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            />
          ))}
        </Box>

        {/* Filtros avançados (colapsáveis) */}
        <Collapse in={filtersOpen}>
          <Divider />
          <Box sx={{ p: '12px 14px', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Responsável</InputLabel>
              <Select label="Responsável" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                {owners.map((o) => <MenuItem key={o.id} value={o.id}>{o.fullName}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
                <MenuItem value="open">Abertos</MenuItem>
                <MenuItem value="won">Ganhos</MenuItem>
                <MenuItem value="lost">Perdidos</MenuItem>
                <MenuItem value="all">Todos</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Valor mínimo (R$)" type="number" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} sx={{ width: 160 }} />
            <TextField size="small" label="Valor máximo (R$)" type="number" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} sx={{ width: 160 }} />
            <TextField size="small" label="Rotting ≥ dias" type="number" value={rottingMin} onChange={(e) => setRottingMin(e.target.value)} sx={{ width: 130 }} />
          </Box>
        </Collapse>
      </Paper>

      {/* ── Alertas ──────────────────────────────────────────────────── */}
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      {criticalCount > 0 && (
        <Alert severity="warning" icon={<WarningIcon />}>
          <strong>{criticalCount}</strong> deal(s) com rotting crítico (≥ 10 dias) no filtro atual — ação imediata recomendada.
        </Alert>
      )}

      {/* ── VIEW: KANBAN ─────────────────────────────────────────────── */}
      {viewMode === 'kanban' && (
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', minWidth: 'max-content' }}>
            {stages.map((stage) => {
              // Ordena dentro de cada coluna: hot primeiro, depois por valor desc
              const stageDeals = sortedDeals
                .filter((d) => d.stageId === stage.id)
                .sort((a, b) => {
                  const pa = dealPriority(a.amount, a.probability);
                  const pb = dealPriority(b.amount, b.probability);
                  if (pa !== pb) {
                    const order = { hot: 0, warm: 1, normal: 2 };
                    return order[pa] - order[pb];
                  }
                  return b.amount - a.amount;
                });
              return (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  deals={stageDeals}
                  compact={compact}
                  draggingId={draggingDealId}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropInStage(stage.id)}
                  onDragStart={setDraggingDealId}
                  onDragEnd={() => setDraggingDealId(null)}
                  onDealClick={(id) => navigate(`/deals/${id}`)}
                  onEditDeal={(deal, e) => { e.stopPropagation(); setEditingDeal(deal); setEditModalOpen(true); }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* ── VIEW: TABELA ─────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: '32%' }}>
                  <TableSortLabel
                    active={sortField === 'title'}
                    direction={sortField === 'title' ? sortDir : 'asc'}
                    onClick={() => handleTableSort('title')}
                  >
                    Deal
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'stage'}
                    direction={sortField === 'stage' ? sortDir : 'asc'}
                    onClick={() => handleTableSort('stage')}
                  >
                    Estágio
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'amount'}
                    direction={sortField === 'amount' ? sortDir : 'desc'}
                    onClick={() => handleTableSort('amount')}
                  >
                    Valor
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'owner'}
                    direction={sortField === 'owner' ? sortDir : 'asc'}
                    onClick={() => handleTableSort('owner')}
                  >
                    Responsável
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'rottingDays'}
                    direction={sortField === 'rottingDays' ? sortDir : 'desc'}
                    onClick={() => handleTableSort('rottingDays')}
                  >
                    Rotting
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'expectedCloseDate'}
                    direction={sortField === 'expectedCloseDate' ? sortDir : 'asc'}
                    onClick={() => handleTableSort('expectedCloseDate')}
                  >
                    Fechar em
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortField === 'status'}
                    direction={sortField === 'status' ? sortDir : 'asc'}
                    onClick={() => handleTableSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDeals.length === 0 ? (
                <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>Nenhum deal encontrado com os filtros aplicados.</TableCell></TableRow>
              ) : sortedDeals.map((deal) => {
                const rotColor = rottingColor(deal.rottingDays || 0);
                const stageName = stages.find((s) => s.id === deal.stageId)?.name || '—';
                return (
                  <TableRow key={deal.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/deals/${deal.id}`)}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{deal.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{deal.account?.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={stageName} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{fmt(deal.amount)}</Typography>
                      <Typography variant="caption" color="text.secondary">{fmtK(deal.weightedAmount)} pond.</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>{deal.owner?.fullName?.charAt(0)}</Avatar>
                        <Typography variant="caption">{deal.owner?.fullName?.split(' ')[0]}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(deal.rottingDays || 0) > 0
                        ? <Chip label={`${deal.rottingDays}d`} size="small" color={rotColor} variant="outlined" sx={{ fontWeight: 700 }} />
                        : <Typography variant="caption" color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR') : '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={deal.status === 'won' ? 'Ganho' : deal.status === 'lost' ? 'Perdido' : 'Aberto'}
                        size="small"
                        color={deal.status === 'won' ? 'success' : deal.status === 'lost' ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ fontSize: 11 }}
                        onClick={(e) => { e.stopPropagation(); setEditingDeal(deal); setEditModalOpen(true); }}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default', display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Exibindo <strong>{sortedDeals.length}</strong> de <strong>{deals.length}</strong> deals · Pipeline total: <strong>{fmtK(totalOpen)}</strong>
            </Typography>
          </Box>
        </TableContainer>
      )}

      {/* ── Modais ───────────────────────────────────────────────────── */}
      {pipeline && (
        <DealFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateDeal} pipelineId={pipeline.id} stages={stages} />
      )}
      {pipeline && editingDeal && (
        <DealFormModal open={editModalOpen} mode="edit" initialData={editingDeal}
          onClose={() => { setEditModalOpen(false); setEditingDeal(null); }}
          onSubmit={handleEditDeal} pipelineId={pipeline.id} stages={stages} />
      )}
    </Box>
  );
};

export default DealsPipelinePage;
