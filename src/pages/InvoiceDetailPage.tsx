// InvoiceDetailPage.tsx - Detalhes da fatura + pagamento + histórico
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type {
  Invoice,
  ManualPaymentForm,
  PartialPaymentInput,
  InvoiceHistoryEvent,
  RecurrenceRuleForm,
  PaymentMethod,
  InvoiceStatus,
} from '../types';

const statusLabelMap: Record<InvoiceStatus, string> = {
  draft: 'Rascunho',
  open: 'Em aberto',
  partial: 'Parcial',
  paid: 'Paga',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

const statusColorMap: Record<InvoiceStatus, 'default' | 'info' | 'warning' | 'error' | 'success'> = {
  draft: 'default',
  open: 'info',
  partial: 'warning',
  paid: 'success',
  overdue: 'error',
  cancelled: 'default',
};

type PaymentFormState = {
  receivedAt: string;
  method: PaymentMethod;
  reference?: string | null;
  notes?: string | null;
  amountReceived?: number;
  confirmPolicy?: boolean;
};

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [history, setHistory] = useState<InvoiceHistoryEvent[]>([]);
  const [recurrence, setRecurrence] = useState<RecurrenceRuleForm | null>(null);
  const [tab, setTab] = useState<'details' | 'history' | 'recurrence'>('details');

  // Modal de pagamento
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial'>('full');
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>({
    receivedAt: new Date().toISOString().slice(0, 10),
    method: 'pix',
    confirmPolicy: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [invRes, histRes, recRes] = await Promise.all([
          mockApi.billingInvoices.getById(id),
          mockApi.payments.listHistory(id),
          mockApi.billingInvoices.getRecurrenceRule(id),
        ]);
        setInvoice(invRes.data || null);
        setHistory(histRes.data || []);
        setRecurrence(recRes.data || null);

        if (searchParams.get('action') === 'payment') {
          setPaymentModalOpen(true);
        }
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message || 'Erro ao carregar fatura', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, searchParams]);

  const handleSubmitPayment = async () => {
    if (!invoice) return;
    setSubmitting(true);
    try {
      if (paymentMode === 'full') {
        const form: ManualPaymentForm = {
          invoiceId: invoice.id,
          receivedAt: paymentForm.receivedAt || new Date().toISOString().slice(0, 10),
          amountReceived: invoice.totals.amountOpen,
          method: (paymentForm.method as PaymentMethod) || 'pix',
          reference: paymentForm.reference || null,
          notes: paymentForm.notes || null,
          confirmPolicy: paymentForm.confirmPolicy || false,
        };
        await mockApi.payments.recordManualPayment(form);
      } else {
        const form: PartialPaymentInput = {
          invoiceId: invoice.id,
          receivedAt: paymentForm.receivedAt || new Date().toISOString().slice(0, 10),
          amountReceived: Number(paymentForm.amountReceived || 0),
          method: (paymentForm.method as PaymentMethod) || 'pix',
          reference: paymentForm.reference || null,
          notes: paymentForm.notes || null,
        };
        await mockApi.payments.recordPartialPayment(form);
      }
      setSnackbar({ open: true, message: 'Pagamento registrado', severity: 'success' });
      setPaymentModalOpen(false);
      setPaymentForm({ receivedAt: new Date().toISOString().slice(0, 10), method: 'pix', confirmPolicy: false });
      // Reload
      const [invRes, histRes] = await Promise.all([
        mockApi.billingInvoices.getById(invoice.id),
        mockApi.payments.listHistory(invoice.id),
      ]);
      setInvoice(invRes.data || null);
      setHistory(histRes.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao registrar pagamento', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Fatura não encontrada</Typography>
        <Button onClick={() => navigate('/billing/invoices')} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/billing/invoices')} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {invoice.invoiceNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.accountName}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={statusLabelMap[invoice.status]} color={statusColorMap[invoice.status]} />
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={() => setPaymentModalOpen(true)}
              >
                Registrar Pagamento
              </Button>
            )}
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Emissão
            </Typography>
            <Typography variant="body1">{invoice.issueDate}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Vencimento
            </Typography>
            <Typography variant="body1" color={invoice.status === 'overdue' ? 'error.main' : 'inherit'}>
              {invoice.dueDate}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatCurrency(invoice.totals.total)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Saldo em aberto
            </Typography>
            <Typography variant="body1" fontWeight={700} color={invoice.totals.amountOpen > 0 ? 'error.main' : 'success.main'}>
              {formatCurrency(invoice.totals.amountOpen)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Detalhes" value="details" />
        <Tab label={`Histórico (${history.length})`} value="history" icon={<HistoryIcon />} iconPosition="start" />
        <Tab label="Recorrência" value="recurrence" icon={<RepeatIcon />} iconPosition="start" />
      </Tabs>

      {tab === 'details' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Itens da fatura
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Qtd</TableCell>
                  <TableCell align="right">Preço Unit.</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>{formatCurrency(invoice.totals.subtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Impostos</Typography>
              <Typography>{formatCurrency(invoice.totals.taxTotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700}>{formatCurrency(invoice.totals.total)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Pago</Typography>
              <Typography color="success.main">{formatCurrency(invoice.totals.amountPaid)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700} color="error.main">
                Saldo em aberto
              </Typography>
              <Typography fontWeight={700} color="error.main">
                {formatCurrency(invoice.totals.amountOpen)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}

      {tab === 'history' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Histórico de eventos
          </Typography>
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum evento registrado
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {history.map((evt) => (
                <Paper key={evt.eventId} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                      {evt.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={evt.type}
                      color={evt.type === 'payment' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(evt.createdAt).toLocaleString('pt-BR')} • {evt.createdByName}
                  </Typography>
                  {evt.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {evt.description}
                    </Typography>
                  )}
                  {evt.amount && (
                    <Typography variant="body2" fontWeight={600} color="success.main" sx={{ mt: 0.5 }}>
                      {formatCurrency(evt.amount)}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      )}

      {tab === 'recurrence' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Configuração de recorrência
          </Typography>
          {recurrence ? (
            <Box>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip label={recurrence.enabled ? 'Ativa' : 'Inativa'} color={recurrence.enabled ? 'success' : 'default'} size="small" />
                </Stack>
                <Typography variant="body2">
                  Frequência: {recurrence.frequency === 'monthly' ? 'Mensal' : recurrence.frequency === 'quarterly' ? 'Trimestral' : 'Anual'}
                </Typography>
                <Typography variant="body2">Intervalo: a cada {recurrence.interval} período(s)</Typography>
                <Typography variant="body2">Dia do mês: {recurrence.dayOfMonth}</Typography>
              </Stack>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => alert('Editar recorrência (MVP)')}>
                Editar recorrência
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma recorrência configurada para esta fatura.
            </Typography>
          )}
        </Paper>
      )}

      {/* Modal de Pagamento */}
      <Dialog open={paymentModalOpen} onClose={() => !submitting && setPaymentModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={paymentMode === 'full'}
                  onChange={(e) => setPaymentMode(e.target.checked ? 'full' : 'partial')}
                />
              }
              label="Baixa integral (quitar saldo total)"
            />
            {paymentMode === 'partial' && (
              <TextField
                label="Valor recebido"
                type="number"
                fullWidth
                value={paymentForm.amountReceived || ''}
                onChange={(e) => setPaymentForm({ ...paymentForm, amountReceived: Number(e.target.value) })}
                InputProps={{ inputProps: { min: 0, max: invoice?.totals.amountOpen || 0, step: 0.01 } }}
                helperText={`Saldo em aberto: ${formatCurrency(invoice?.totals.amountOpen || 0)}`}
              />
            )}
            {paymentMode === 'full' && (
              <TextField
                label="Valor a quitar"
                fullWidth
                value={formatCurrency(invoice?.totals.amountOpen || 0)}
                InputProps={{ readOnly: true }}
              />
            )}
            <TextField
              label="Data de recebimento"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={paymentForm.receivedAt || ''}
              onChange={(e) => setPaymentForm({ ...paymentForm, receivedAt: e.target.value })}
            />
            <TextField
              select
              label="Método de pagamento"
              fullWidth
              value={paymentForm.method || 'pix'}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as PaymentMethod })}
            >
              <MenuItem value="pix">PIX</MenuItem>
              <MenuItem value="boleto">Boleto</MenuItem>
              <MenuItem value="transfer">Transferência</MenuItem>
              <MenuItem value="card">Cartão</MenuItem>
              <MenuItem value="cash">Dinheiro</MenuItem>
              <MenuItem value="other">Outro</MenuItem>
            </TextField>
            <TextField
              label="Referência (NSU, TxID, etc.)"
              fullWidth
              value={paymentForm.reference || ''}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
            />
            <TextField
              label="Observações"
              fullWidth
              multiline
              rows={2}
              value={paymentForm.notes || ''}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
            />
            {paymentMode === 'full' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentForm.confirmPolicy || false}
                    onChange={(e) => setPaymentForm({ ...paymentForm, confirmPolicy: e.target.checked })}
                  />
                }
                label="Confirmo a baixa integral desta fatura (obrigatório)"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmitPayment} disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default InvoiceDetailPage;
