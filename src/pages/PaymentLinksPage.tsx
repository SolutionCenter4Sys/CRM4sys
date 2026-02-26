import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Link as LinkIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { InvoiceListItem, PaymentLinkResponse } from '../types';

const PaymentLinksPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState(0);
  const [expiresInDays, setExpiresInDays] = useState(3);
  const [result, setResult] = useState<PaymentLinkResponse | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await mockApi.billingInvoices.list({ status: 'all' }, 1, 200);
        const data = (res.data?.data || []).filter((i) => i.amountOpen > 0);
        setInvoices(data);
        if (data[0]) {
          setInvoiceId(data[0].id);
          setAmount(data[0].amountOpen);
        }
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const generate = async () => {
    if (!invoiceId) return;
    try {
      const res = await mockApi.paymentGateways.generatePaymentLink({
        invoiceId,
        amount,
        currency: 'BRL',
        expiresInDays,
        allowPartial: false,
        customerEmail: null,
        customerName: null,
        description: null,
      });
      setResult(res.data || null);
      setSnackbar({ open: true, message: 'Link gerado com sucesso', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const copy = async () => {
    if (!result?.url) return;
    await navigator.clipboard.writeText(result.url);
    setSnackbar({ open: true, message: 'Link copiado', severity: 'success' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Gerar Link de Pagamento
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              select
              label="Fatura"
              value={invoiceId}
              onChange={(e) => {
                setInvoiceId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(inv.amountOpen);
              }}
            >
              {invoices.map((inv) => (
                <MenuItem key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} • {inv.accountName} • Saldo R$ {inv.amountOpen.toLocaleString('pt-BR')}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Valor" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <TextField label="Validade (dias)" type="number" value={expiresInDays} onChange={(e) => setExpiresInDays(Number(e.target.value))} />
            <Button variant="contained" startIcon={<LinkIcon />} onClick={generate}>
              Gerar link
            </Button>
          </Stack>

          {result && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle2">Link gerado</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <TextField fullWidth value={result.url} InputProps={{ readOnly: true }} />
                <IconButton onClick={copy}>
                  <ContentCopyIcon />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Expira em: {new Date(result.expiresAt).toLocaleString('pt-BR')}
              </Typography>
            </Paper>
          )}
        </Paper>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentLinksPage;
