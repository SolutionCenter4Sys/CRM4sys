// InvoiceFormPage.tsx - Criar fatura vinculada ao negócio com parcelamento
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  IconButton,
  Stack,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Account, Deal, InvoiceFormData, InvoiceItemForm } from '../types';

const ISSUE_POSTPONEMENT_REASONS = [
  'Aguardando aprovação interna do cliente',
  'Pendência contratual',
  'Solicitação comercial do cliente',
  'Ajuste operacional interno',
  'Outro',
];

const DUE_POSTPONEMENT_REASONS = [
  'Renegociação comercial',
  'Prazo solicitado pelo cliente',
  'Dependência de aceite/entrega',
  'Ajuste financeiro interno',
  'Outro',
];

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [form, setForm] = useState<InvoiceFormData>({
    dealId: '',
    accountId: '',
    contactId: null,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
    installmentCount: 1,
    currency: 'BRL',
    notes: null,
    originalIssueDate: null,
    issuePostponementReason: null,
    originalDueDate: null,
    duePostponementReason: null,
    nfNumber: null,
    cancelledNfNumber: null,
    billingAddressSnapshot: null,
    invoiceDescription: null,
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [accountsRes, dealsRes] = await Promise.all([mockApi.accounts.list(), mockApi.deals.list()]);
        setAccounts(accountsRes.data || []);
        setDeals((dealsRes.data || []).filter((deal) => deal.status === 'open'));
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] });
  };

  const handleRemoveItem = (index: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemForm, value: any) => {
    const updated = [...form.items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const calculateSubtotal = () => {
    return form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
  };

  const handleDealChange = (dealId: string) => {
    const selectedDeal = deals.find((deal) => deal.id === dealId);
    if (!selectedDeal) {
      setForm({ ...form, dealId: '', accountId: '', billingAddressSnapshot: null });
      return;
    }
    const selectedAccount = accounts.find((account) => account.id === selectedDeal.accountId);
    setForm({
      ...form,
      dealId,
      accountId: selectedDeal.accountId,
      billingAddressSnapshot: selectedAccount?.address || null,
      invoiceDescription: selectedAccount?.billingConditions?.invoiceDescription || form.invoiceDescription || null,
    });
  };

  const handleSubmit = async () => {
    if (!form.dealId) {
      setSnackbar({ open: true, message: 'Selecione um negócio', severity: 'error' });
      return;
    }
    if (!form.accountId) {
      setSnackbar({ open: true, message: 'Negócio sem empresa vinculada', severity: 'error' });
      return;
    }
    if (form.items.length === 0 || form.items.some((it) => !it.description || it.unitPrice <= 0)) {
      setSnackbar({ open: true, message: 'Preencha todos os itens corretamente', severity: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await mockApi.billingInvoices.create({
        ...form,
        installmentCount: Math.max(1, Number(form.installmentCount || 1)),
      });
      setSnackbar({
        open: true,
        message: res.message || 'Fatura criada com sucesso',
        severity: 'success',
      });
      setTimeout(() => navigate('/billing/invoices'), 1200);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao criar fatura', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/billing/invoices')} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {id ? 'Editar Fatura' : 'Nova Fatura'}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações gerais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  select
                  label="Negócio"
                  fullWidth
                  required
                  value={form.dealId}
                  onChange={(e) => handleDealChange(e.target.value)}
                >
                  {deals.map((deal) => (
                    <MenuItem key={deal.id} value={deal.id}>
                      {deal.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Quantidade de parcelas"
                  type="number"
                  fullWidth
                  required
                  value={form.installmentCount || 1}
                  onChange={(e) => setForm({ ...form, installmentCount: Number(e.target.value) })}
                  InputProps={{ inputProps: { min: 1, max: 60 } }}
                  helperText="Parcelas mensais com o mesmo valor e mesmo dia"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Empresa vinculada"
                  fullWidth
                  value={accounts.find((account) => account.id === form.accountId)?.name || ''}
                  InputProps={{ readOnly: true }}
                  helperText="Definida automaticamente pelo negócio"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Data de emissão"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Data de vencimento"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Código da fatura"
                  fullWidth
                  value="Gerado automaticamente no formato INV[ano][0000]-[parcela]"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Prorrogações de emissão e vencimento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Data original da emissão"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.originalIssueDate || ''}
                  onChange={(e) => setForm({ ...form, originalIssueDate: e.target.value || null })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Motivo de prorrogação da emissão"
                  fullWidth
                  value={form.issuePostponementReason || ''}
                  onChange={(e) => setForm({ ...form, issuePostponementReason: e.target.value || null })}
                >
                  <MenuItem value="">Não informado</MenuItem>
                  {ISSUE_POSTPONEMENT_REASONS.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Data original do vencimento"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.originalDueDate || ''}
                  onChange={(e) => setForm({ ...form, originalDueDate: e.target.value || null })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Motivo de prorrogação do vencimento"
                  fullWidth
                  value={form.duePostponementReason || ''}
                  onChange={(e) => setForm({ ...form, duePostponementReason: e.target.value || null })}
                >
                  <MenuItem value="">Não informado</MenuItem>
                  {DUE_POSTPONEMENT_REASONS.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Descrição sobre Nota Fiscal
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Número da NF"
                  fullWidth
                  value={form.nfNumber || ''}
                  onChange={(e) => setForm({ ...form, nfNumber: e.target.value || null })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Número da NF cancelada"
                  fullWidth
                  value={form.cancelledNfNumber || ''}
                  onChange={(e) => setForm({ ...form, cancelledNfNumber: e.target.value || null })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Endereço de faturamento - Rua"
                  fullWidth
                  value={form.billingAddressSnapshot?.street || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      billingAddressSnapshot: { ...(form.billingAddressSnapshot || {}), street: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Cidade"
                  fullWidth
                  value={form.billingAddressSnapshot?.city || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      billingAddressSnapshot: { ...(form.billingAddressSnapshot || {}), city: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="UF"
                  fullWidth
                  value={form.billingAddressSnapshot?.state || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      billingAddressSnapshot: { ...(form.billingAddressSnapshot || {}), state: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.invoiceDescription || ''}
                  onChange={(e) => setForm({ ...form, invoiceDescription: e.target.value || null })}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Itens da fatura</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddItem}>
                Adicionar Item
              </Button>
            </Stack>
            <Stack spacing={2}>
              {form.items.map((item, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Descrição"
                        fullWidth
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        label="Quantidade"
                        type="number"
                        fullWidth
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        label="Preço unitário"
                        type="number"
                        fullWidth
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      />
                    </Grid>
                    <Grid item xs={10} md={1}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} md={1}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(index)}
                        disabled={form.items.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatCurrency(calculateSubtotal())}
              </Typography>
            </Stack>
          </Paper>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={() => navigate('/billing/invoices')} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <CircularProgress size={20} /> : 'Salvar Fatura'}
            </Button>
          </Stack>
        </Stack>
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

export default InvoiceFormPage;
