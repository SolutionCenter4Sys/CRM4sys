// InvoiceFormPage.tsx - Criar/editar fatura avulsa com itens e recorrência
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
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { InvoiceFormData, InvoiceItemForm, RecurrenceRuleForm, Account } from '../types';

const InvoiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<InvoiceFormData>({
    accountId: '',
    contactId: null,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
    currency: 'BRL',
    notes: null,
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
  });
  const [recurrence, setRecurrence] = useState<RecurrenceRuleForm>({
    invoiceId: '',
    enabled: false,
    frequency: 'monthly',
    interval: 1,
    dayOfMonth: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const accountsRes = await mockApi.accounts.list();
        setAccounts(accountsRes.data || []);
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

  const handleSubmit = async () => {
    if (!form.accountId) {
      setSnackbar({ open: true, message: 'Selecione uma empresa', severity: 'error' });
      return;
    }
    if (form.items.length === 0 || form.items.some((it) => !it.description || it.unitPrice <= 0)) {
      setSnackbar({ open: true, message: 'Preencha todos os itens corretamente', severity: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await mockApi.billingInvoices.create(form);
      if (res.isSuccess && res.data && recurrence.enabled) {
        const recRule: RecurrenceRuleForm = { ...recurrence, invoiceId: res.data.id };
        await mockApi.billingInvoices.saveRecurrenceRule(recRule);
      }
      setSnackbar({ open: true, message: 'Fatura criada com sucesso', severity: 'success' });
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
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Empresa"
                  fullWidth
                  required
                  value={form.accountId}
                  onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </MenuItem>
                  ))}
                </TextField>
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

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Configurar Recorrência (Opcional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={recurrence.enabled}
                      onChange={(e) => setRecurrence({ ...recurrence, enabled: e.target.checked })}
                    />
                  }
                  label="Ativar faturamento recorrente"
                />
                {recurrence.enabled && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          select
                          label="Frequência"
                          fullWidth
                          value={recurrence.frequency}
                          onChange={(e) =>
                            setRecurrence({ ...recurrence, frequency: e.target.value as any })
                          }
                        >
                          <MenuItem value="monthly">Mensal</MenuItem>
                          <MenuItem value="quarterly">Trimestral</MenuItem>
                          <MenuItem value="yearly">Anual</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Intervalo"
                          type="number"
                          fullWidth
                          value={recurrence.interval}
                          onChange={(e) => setRecurrence({ ...recurrence, interval: Number(e.target.value) })}
                          InputProps={{ inputProps: { min: 1 } }}
                          helperText="A cada quantos períodos"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Dia do mês"
                          type="number"
                          fullWidth
                          value={recurrence.dayOfMonth}
                          onChange={(e) =>
                            setRecurrence({ ...recurrence, dayOfMonth: Number(e.target.value) })
                          }
                          InputProps={{ inputProps: { min: 1, max: 28 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Início"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={recurrence.startDate}
                          onChange={(e) => setRecurrence({ ...recurrence, startDate: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Fim (opcional)"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={recurrence.endDate || ''}
                          onChange={(e) => setRecurrence({ ...recurrence, endDate: e.target.value || null })}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

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
