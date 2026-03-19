// InvoicesListPage.tsx - Lista de faturas com filtros e ações
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { InvoiceListItem, InvoiceListFilters, InvoiceStatus } from '../types';

const statusColorMap: Record<InvoiceStatus, 'default' | 'info' | 'warning' | 'error' | 'success'> = {
  draft: 'default',
  open: 'info',
  partial: 'warning',
  paid: 'success',
  overdue: 'error',
  cancelled: 'default',
};

const statusLabelMap: Record<InvoiceStatus, string> = {
  draft: 'Rascunho',
  open: 'Em aberto',
  partial: 'Parcial',
  paid: 'Paga',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

const InvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [filters, setFilters] = useState<InvoiceListFilters>({ status: 'all' });
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

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Faturas
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Recarregar">
            <IconButton onClick={loadInvoices} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/billing/invoices/new')}
          >
            Nova Fatura
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Buscar"
            size="small"
            sx={{ minWidth: 240 }}
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Número, empresa..."
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || 'all'}
              label="Status"
              onChange={(e) =>
                setFilters({ ...filters, status: (e.target.value as InvoiceStatus | 'all') || 'all' })
              }
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="draft">Rascunho</MenuItem>
              <MenuItem value="open">Em aberto</MenuItem>
              <MenuItem value="partial">Parcial</MenuItem>
              <MenuItem value="paid">Paga</MenuItem>
              <MenuItem value="overdue">Vencida</MenuItem>
              <MenuItem value="cancelled">Cancelada</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Emissão de"
            type="date"
            size="small"
            sx={{ minWidth: 160 }}
            InputLabelProps={{ shrink: true }}
            value={filters.issueFrom || ''}
            onChange={(e) => setFilters({ ...filters, issueFrom: e.target.value || null })}
          />
          <TextField
            label="Emissão até"
            type="date"
            size="small"
            sx={{ minWidth: 160 }}
            InputLabelProps={{ shrink: true }}
            value={filters.issueTo || ''}
            onChange={(e) => setFilters({ ...filters, issueTo: e.target.value || null })}
          />
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Negócio</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Saldo</TableCell>
                <TableCell>Emissão</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell align="center">Ações</TableCell>
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
                invoices.map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {inv.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {inv.invoiceCode} • {inv.installmentNumber}/{inv.installmentTotal}
                      </Typography>
                    </TableCell>
                    <TableCell>{inv.dealTitle}</TableCell>
                    <TableCell>{inv.accountName}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabelMap[inv.status]}
                        color={statusColorMap[inv.status]}
                        size="small"
                      />
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
                    <TableCell>{inv.issueDate}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={inv.status === 'overdue' ? 'error.main' : 'text.primary'}
                        fontWeight={inv.status === 'overdue' ? 700 : 400}
                      >
                        {inv.dueDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
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
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleCancelInvoice(inv.id)}
                              >
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
