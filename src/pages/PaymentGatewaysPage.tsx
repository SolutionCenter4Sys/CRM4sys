import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as LinkIcon, Refresh as RefreshIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { ConnectorCredentials, ConnectorViewModel } from '../types';

const PaymentGatewaysPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ConnectorViewModel[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState<ConnectorCredentials>({
    connector: 'stripe',
    apiKey: null,
    secret: null,
    webhookSecret: null,
    environment: 'sandbox',
    rotateKeys: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await mockApi.paymentGateways.listConnectors();
      setRows(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar conectores', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openConfig = (row: ConnectorViewModel) => {
    setCredentials((prev) => ({ ...prev, connector: row.connector }));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await mockApi.paymentGateways.saveCredentials(credentials);
      const test = await mockApi.paymentGateways.testConnection(credentials.connector);
      setSnackbar({
        open: true,
        message: test.data?.message || 'Credenciais salvas',
        severity: test.data?.ok ? 'success' : 'error',
      });
      setDialogOpen(false);
      load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const toggle = async (connector: ConnectorViewModel['connector']) => {
    try {
      await mockApi.paymentGateways.toggleConnector(connector);
      setSnackbar({ open: true, message: 'Status do conector atualizado', severity: 'success' });
      load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Gateways de Pagamento
        </Typography>
        <Tooltip title="Recarregar">
          <IconButton onClick={load} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Conector</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Último sync</TableCell>
                <TableCell>Detalhes</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.connector} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status}
                      color={row.status === 'connected' ? 'success' : row.status === 'error' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleString('pt-BR') : '-'}</TableCell>
                  <TableCell>{row.details || '-'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton size="small" onClick={() => openConfig(row)}>
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                      <Button size="small" variant="outlined" onClick={() => toggle(row.connector)}>
                        {row.status === 'connected' ? 'Desconectar' : 'Conectar'}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<LinkIcon />}
                        onClick={() => (window.location.href = '/billing/payment-links')}
                      >
                        Links
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurar conector</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="API Key" value={credentials.apiKey || ''} onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value || null })} />
            <TextField label="Secret" value={credentials.secret || ''} onChange={(e) => setCredentials({ ...credentials, secret: e.target.value || null })} />
            <TextField label="Webhook Secret" value={credentials.webhookSecret || ''} onChange={(e) => setCredentials({ ...credentials, webhookSecret: e.target.value || null })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar e testar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentGatewaysPage;
