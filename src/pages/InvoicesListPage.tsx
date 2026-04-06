import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Snackbar,
  Alert,
  ButtonGroup,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  ViewKanban as KanbanIcon,
  TableRows as TableIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { InvoiceListItem, InvoiceListFilters, InvoiceStatus } from '../types';

type ViewMode = 'kanban' | 'table';

const statusColorMap: Record<InvoiceStatus, 'default' | 'info' | 'warning' | 'error' | 'success'> = {
  provisioned: 'default',
  approved: 'info',
  issued: 'warning',
  paid: 'success',
  cancelled: 'error',
};

// Status que usam variant='outlined' para maior visibilidade (fundo claro)
const statusVariantMap: Record<InvoiceStatus, 'filled' | 'outlined'> = {
  provisioned: 'outlined',
  approved: 'outlined',
  issued: 'filled',
  paid: 'filled',
  cancelled: 'filled',
};

const statusLabelMap: Record<InvoiceStatus, string> = {
  provisioned: 'Provisionada',
  approved: 'Aprovada para Emissão',
  issued: 'Fatura Emitida',
  paid: 'Fatura Paga',
  cancelled: 'Fatura Cancelada',
};

const STATUS_COLUMN_COLORS: Record<InvoiceStatus, string> = {
  provisioned: '#9E9E9E',
  approved: '#2196F3',
  issued: '#FF9800',
  paid: '#4CAF50',
  cancelled: '#757575',
};

const STATUS_COLUMN_ORDER: InvoiceStatus[] = ['provisioned', 'approved', 'issued', 'paid', 'cancelled'];

const isOverdue = (inv: { status: InvoiceStatus; dueDate: string }) => {
  if (inv.status === 'paid' || inv.status === 'cancelled') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(inv.dueDate + 'T00:00:00');
  return due < today;
};

const formatCurrency = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatCurrencyCompact = (v: number) =>
  v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `R$ ${(v / 1_000).toFixed(1)}K`
    : formatCurrency(v);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

// ── Invoice Kanban Card ──────────────────────────────────────────────────────

interface InvoiceCardProps {
  invoice: InvoiceListItem;
  onView: () => void;
  onPayment: () => void;
  onDuplicate: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onView,
  onPayment,
  onDuplicate,
  onCancel,
  onDelete,
}) => {
  const overdue = isOverdue(invoice);
  const hasBalance = invoice.amountOpen > 0;
  const canAct = invoice.status !== 'paid' && invoice.status !== 'cancelled';

  return (
    <Paper
      elevation={0}
      onClick={onView}
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: overdue ? 'error.light' : 'divider',
        borderRadius: 1.5,
        p: '10px 12px',
        transition: 'box-shadow 0.15s, transform 0.1s',
        '&:hover': { boxShadow: 2, transform: 'translateY(-1px)' },
        bgcolor: overdue ? 'rgba(244,67,54,0.04)' : 'background.paper',
        position: 'relative',
      }}
    >
      {overdue && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            bgcolor: 'error.main',
            borderRadius: '6px 0 0 6px',
          }}
        />
      )}

      <Box sx={{ pl: overdue ? 0.5 : 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.6 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12.5 }}
            >
              {invoice.invoiceNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
              {invoice.invoiceCode} · {invoice.installmentNumber}/{invoice.installmentTotal}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary', flexShrink: 0 }}>
            {formatCurrencyCompact(invoice.amountTotal)}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.4, fontSize: 11 }}
        >
          {invoice.accountName}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.6, fontSize: 10.5, opacity: 0.8 }}
        >
          {invoice.dealTitle}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: 10.5, color: overdue ? 'error.main' : 'text.secondary', fontWeight: overdue ? 700 : 400 }}>
              Venc: {formatDate(invoice.dueDate)}
            </Typography>
            {overdue && <WarningIcon sx={{ fontSize: 12, color: 'error.main' }} />}
            {overdue && (
              <Chip
                label="Vencida"
                size="small"
                color="error"
                sx={{ height: 16, fontSize: 9, fontWeight: 700, '& .MuiChip-label': { px: 0.5 } }}
              />
            )}
          </Box>
          {hasBalance && (
            <Chip
              label={formatCurrencyCompact(invoice.amountOpen)}
              size="small"
              color={overdue ? 'error' : 'warning'}
              variant="outlined"
              sx={{ height: 18, fontSize: 10, '& .MuiChip-label': { px: 0.6 } }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 0.3,
            mt: 0.6,
            pt: 0.6,
            borderTop: '1px solid',
            borderColor: 'divider',
            opacity: 0.6,
            '&:hover': { opacity: 1 },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Ver detalhes">
            <IconButton size="small" sx={{ p: 0.3 }} onClick={onView}>
              <VisibilityIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicar">
            <IconButton size="small" sx={{ p: 0.3 }} onClick={onDuplicate}>
              <DuplicateIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          {canAct && (
            <>
              <Tooltip title="Registrar pagamento">
                <IconButton size="small" sx={{ p: 0.3 }} color="success" onClick={onPayment}>
                  <PaymentIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancelar">
                <IconButton size="small" sx={{ p: 0.3 }} color="error" onClick={onCancel}>
                  <CancelIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Excluir">
            <IconButton size="small" sx={{ p: 0.3 }} color="error" onClick={onDelete}>
              <DeleteIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

// ── Kanban Column ────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  status: InvoiceStatus;
  invoices: InvoiceListItem[];
  onView: (id: string) => void;
  onPayment: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

const CARD_HEIGHT = 155;
const COLUMN_MAX_CARDS = 5;

const InvoiceKanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  invoices,
  onView,
  onPayment,
  onDuplicate,
  onCancel,
  onDelete,
}) => {
  const color = STATUS_COLUMN_COLORS[status];
  const label = statusLabelMap[status];
  const totalValue = invoices.reduce((s, inv) => s + inv.amountTotal, 0);
  const totalOpen = invoices.reduce((s, inv) => s + inv.amountOpen, 0);
  const gap = 8;
  const colMaxHeight = COLUMN_MAX_CARDS * (CARD_HEIGHT + gap) + 16;

  return (
    <Box
      sx={{
        width: 260,
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
      <Box
        sx={{
          p: '10px 12px 8px',
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderTop: `3px solid ${color}`,
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap' }}>
              {label}
            </Typography>
          </Box>
          <Chip
            label={invoices.length}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontWeight: 800,
              bgcolor: `${color}18`,
              color,
              border: 'none',
              ml: 0.5,
              flexShrink: 0,
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 11, display: 'block' }}>
          {formatCurrencyCompact(totalValue)}
          {totalOpen > 0 && status !== 'paid' && status !== 'cancelled' && (
            <Typography component="span" variant="caption" sx={{ color: 'error.main', fontSize: 10, ml: 0.5 }}>
              · {formatCurrencyCompact(totalOpen)} em aberto
            </Typography>
          )}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: colMaxHeight,
          bgcolor: 'background.default',
          p: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
        }}
      >
        {invoices.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 80,
              gap: 0.5,
              opacity: 0.35,
            }}
          >
            <Typography sx={{ fontSize: 18, lineHeight: 1 }}>📄</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textAlign: 'center' }}>
              Nenhuma fatura
            </Typography>
          </Box>
        ) : (
          invoices.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onView={() => onView(inv.id)}
              onPayment={() => onPayment(inv.id)}
              onDuplicate={() => onDuplicate(inv.id)}
              onCancel={() => onCancel(inv.id)}
              onDelete={() => onDelete(inv.id)}
            />
          ))
        )}
      </Box>

      {invoices.length > COLUMN_MAX_CARDS && (
        <Box sx={{ px: 1.5, py: 0.6, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
            ↕ Role para ver {invoices.length - COLUMN_MAX_CARDS} faturas adicionais
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ── Página principal ─────────────────────────────────────────────────────────

const InvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [filters, setFilters] = useState<InvoiceListFilters>({ status: 'all', dealId: searchParams.get('dealId') || null });
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await mockApi.billingInvoices.list(filters, 1, 100);
      if (res.isSuccess && res.data) {
        setInvoices(res.data.data);
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar faturas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [filters]);

  const handleCancelInvoice = async (invoiceId: string) => {
    if (!confirm('Cancelar esta fatura?')) return;
    try {
      await mockApi.billingInvoices.cancel(invoiceId, 'Cancelamento via UI');
      setSnackbar({ open: true, message: 'Fatura cancelada', severity: 'success' });
      loadInvoices();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleDuplicateInvoice = async (invoiceId: string) => {
    try {
      const res = await mockApi.billingInvoices.duplicate(invoiceId);
      setSnackbar({ open: true, message: res.message || 'Fatura duplicada', severity: 'success' });
      loadInvoices();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao duplicar fatura', severity: 'error' });
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Excluir esta fatura permanentemente?')) return;
    try {
      await mockApi.billingInvoices.remove(invoiceId);
      setSnackbar({ open: true, message: 'Fatura excluída', severity: 'success' });
      loadInvoices();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao excluir fatura', severity: 'error' });
    }
  };

  // ── KPIs ──
  const kpis = useMemo(() => {
    const totalFaturas = invoices.length;
    const totalGeral = invoices.reduce((s, inv) => s + inv.amountTotal, 0);
    const emAberto = invoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled');
    const totalEmAberto = emAberto.reduce((s, inv) => s + inv.amountOpen, 0);
    const vencidas = invoices.filter((inv) => isOverdue(inv));
    const totalVencido = vencidas.reduce((s, inv) => s + inv.amountOpen, 0);
    const pagas = invoices.filter((inv) => inv.status === 'paid');
    const totalPago = pagas.reduce((s, inv) => s + inv.amountTotal, 0);
    return { totalFaturas, totalGeral, totalEmAberto, totalVencido, totalPago, emAbertoCount: emAberto.length, vencidasCount: vencidas.length, pagasCount: pagas.length };
  }, [invoices]);

  // ── Invoices grouped by status (for Kanban) ──
  const invoicesByStatus = useMemo(() => {
    const grouped: Record<InvoiceStatus, InvoiceListItem[]> = {
      provisioned: [],
      approved: [],
      issued: [],
      paid: [],
      cancelled: [],
    };
    invoices.forEach((inv) => {
      if (grouped[inv.status]) {
        grouped[inv.status].push(inv);
      }
    });
    Object.keys(grouped).forEach((key) => {
      grouped[key as InvoiceStatus].sort((a, b) => b.amountTotal - a.amountTotal);
    });
    return grouped;
  }, [invoices]);

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Faturas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {invoices.length} faturas · {viewMode === 'kanban' ? 'Visualização Kanban' : 'Visualização em Tabela'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Recarregar">
            <IconButton onClick={loadInvoices} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/billing/invoices/new')}>
            Nova Fatura
          </Button>
        </Stack>
      </Box>

      {/* ── KPIs ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1 }}>
        {[
          { label: 'Total geral', value: formatCurrencyCompact(kpis.totalGeral), sub: `${kpis.totalFaturas} faturas`, color: 'primary.main', icon: <MoneyIcon sx={{ fontSize: 16 }} /> },
          { label: 'Em aberto', value: formatCurrencyCompact(kpis.totalEmAberto), sub: `${kpis.emAbertoCount} faturas`, color: '#2196F3', icon: <TrendingUpIcon sx={{ fontSize: 16 }} /> },
          { label: 'Vencidas', value: formatCurrencyCompact(kpis.totalVencido), sub: `${kpis.vencidasCount} faturas`, color: 'error.main', icon: <WarningIcon sx={{ fontSize: 16 }} /> },
          { label: 'Pagas', value: formatCurrencyCompact(kpis.totalPago), sub: `${kpis.pagasCount} faturas`, color: 'success.main', icon: <PaymentIcon sx={{ fontSize: 16 }} /> },
        ].map(({ label, value, sub, color, icon }) => (
          <Paper key={label} elevation={0} sx={{ p: '12px 14px', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
              <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color, lineHeight: 1.2, mt: 0.2 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Filters & View Toggle ──────────────────────────────────────── */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: '10px 14px', display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar por número, empresa..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ flex: '1 1 240px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || 'all'}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: (e.target.value as InvoiceStatus | 'all') || 'all' })}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="provisioned">Provisionada</MenuItem>
              <MenuItem value="approved">Aprovada para Emissão</MenuItem>
              <MenuItem value="issued">Fatura Emitida</MenuItem>
              <MenuItem value="paid">Fatura Paga</MenuItem>
              <MenuItem value="cancelled">Fatura Cancelada</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Emissão de"
            type="date"
            size="small"
            sx={{ minWidth: 155 }}
            InputLabelProps={{ shrink: true }}
            value={filters.issueFrom || ''}
            onChange={(e) => setFilters({ ...filters, issueFrom: e.target.value || null })}
          />
          <TextField
            label="Emissão até"
            type="date"
            size="small"
            sx={{ minWidth: 155 }}
            InputLabelProps={{ shrink: true }}
            value={filters.issueTo || ''}
            onChange={(e) => setFilters({ ...filters, issueTo: e.target.value || null })}
          />

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
        </Box>
      </Paper>

      {filters.dealId && (
        <Alert severity="info" icon={false} sx={{ py: 0.5 }}
          action={<Button size="small" onClick={() => setFilters({ ...filters, dealId: null })}>Limpar filtro</Button>}>
          Exibindo faturas do negócio selecionado
        </Alert>
      )}

      {/* ── Alerta de vencidas ─────────────────────────────────────────── */}
      {kpis.vencidasCount > 0 && (
        <Alert severity="warning" icon={<WarningIcon />}>
          <strong>{kpis.vencidasCount}</strong> fatura(s) vencida(s) totalizando{' '}
          <strong>{formatCurrency(kpis.totalVencido)}</strong> em aberto — ação imediata recomendada.
        </Alert>
      )}

      {/* ── Loading ────────────────────────────────────────────────────── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ── VIEW: KANBAN ──────────────────────────────────────────── */}
          {viewMode === 'kanban' && (
            <Box sx={{ overflowX: 'auto', pb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', minWidth: 'max-content' }}>
                {STATUS_COLUMN_ORDER.map((status) => (
                  <InvoiceKanbanColumn
                    key={status}
                    status={status}
                    invoices={invoicesByStatus[status]}
                    onView={(id) => navigate(`/billing/invoices/${id}`)}
                    onPayment={(id) => navigate(`/billing/invoices/${id}?action=payment`)}
                    onDuplicate={handleDuplicateInvoice}
                    onCancel={handleCancelInvoice}
                    onDelete={handleDeleteInvoice}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* ── VIEW: TABLE ───────────────────────────────────────────── */}
          {viewMode === 'table' && (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Número</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Negócio</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Empresa</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Saldo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Emissão</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vencimento</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          Nenhuma fatura encontrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => {
                      const overdueRow = isOverdue(inv);
                      return (
                      <TableRow key={inv.id} hover sx={{ cursor: 'pointer', bgcolor: overdueRow ? 'rgba(244,67,54,0.04)' : undefined }} onClick={() => navigate(`/billing/invoices/${inv.id}`)}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {inv.invoiceNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {inv.invoiceCode} · {inv.installmentNumber}/{inv.installmentTotal}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inv.dealTitle}
                          </Typography>
                        </TableCell>
                        <TableCell>{inv.accountName}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Chip
                              label={statusLabelMap[inv.status] ?? inv.status}
                              color={statusColorMap[inv.status] ?? 'default'}
                              variant={statusVariantMap[inv.status] ?? 'outlined'}
                              size="small"
                            />
                            {overdueRow && (
                              <Chip label="Vencida" color="error" size="small" sx={{ fontWeight: 700 }} icon={<WarningIcon sx={{ fontSize: 14 }} />} />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(inv.amountTotal)}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={inv.amountOpen > 0 ? 700 : 400}
                            color={inv.amountOpen > 0 ? 'error.main' : 'text.secondary'}
                          >
                            {formatCurrency(inv.amountOpen)}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(inv.issueDate)}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={overdueRow ? 'error.main' : 'text.primary'}
                            fontWeight={overdueRow ? 700 : 400}
                          >
                            {formatDate(inv.dueDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Tooltip title="Ver detalhes">
                              <IconButton size="small" onClick={() => navigate(`/billing/invoices/${inv.id}`)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplicar">
                              <IconButton size="small" onClick={() => handleDuplicateInvoice(inv.id)}>
                                <DuplicateIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <>
                                <Tooltip title="Registrar pagamento">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => navigate(`/billing/invoices/${inv.id}?action=payment`)}
                                  >
                                    <PaymentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                  <IconButton size="small" color="error" onClick={() => handleCancelInvoice(inv.id)}>
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Excluir">
                              <IconButton size="small" color="error" onClick={() => handleDeleteInvoice(inv.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Exibindo <strong>{invoices.length}</strong> faturas · Total:{' '}
                  <strong>{formatCurrency(kpis.totalGeral)}</strong>
                </Typography>
              </Box>
            </TableContainer>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoicesListPage;
