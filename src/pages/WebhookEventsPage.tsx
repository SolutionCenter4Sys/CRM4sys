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
  MenuItem,
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
import { Replay as ReplayIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { WebhookEvent, WebhookEventFilters, WebhookPayloadView } from '../types';

const WebhookEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<WebhookEvent[]>([]);
  const [filters, setFilters] = useState<WebhookEventFilters>({
    connector: null,
    status: null,
    periodFrom: null,
    periodTo: null,
    query: '',
    page: 1,
    pageSize: 20,
  });
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [payload, setPayload] = useState<WebhookPayloadView | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await mockApi.paymentGateways.listWebhookEvents(filters);
      setRows(res.data?.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters]);

  const openPayload = async (eventId: string) => {
    try {
      const res = await mockApi.paymentGateways.getWebhookPayload(eventId);
      setPayload(res.data || null);
      setPayloadOpen(true);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const retry = async (eventId: string) => {
    try {
      const res = await mockApi.paymentGateways.retryWebhookEvent(eventId);
      setSnackbar({ open: true, message: res.message || 'Reprocessado', severity: 'success' });
      load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Eventos de Webhook
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            label="Busca"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
          <TextField
            size="small"
            select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: (e.target.value || null) as any })}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="received">received</MenuItem>
            <MenuItem value="processed">processed</MenuItem>
            <MenuItem value="failed">failed</MenuItem>
            <MenuItem value="retried">retried</MenuItem>
          </TextField>
          <Button variant="outlined" onClick={load}>
            Atualizar
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Conector</TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tentativas</TableCell>
                <TableCell>Recebido em</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum evento encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.eventId}>
                    <TableCell>{row.eventId.slice(0, 10)}...</TableCell>
                    <TableCell>{row.connector}</TableCell>
                    <TableCell>{row.eventType}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === 'failed' ? 'error' : row.status === 'processed' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{row.attempts}</TableCell>
                    <TableCell>{new Date(row.receivedAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver payload">
                        <IconButton size="small" onClick={() => openPayload(row.eventId)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Retry">
                        <IconButton size="small" onClick={() => retry(row.eventId)}>
                          <ReplayIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={payloadOpen} onClose={() => setPayloadOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payload mascarado</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline minRows={12} value={payload?.maskedJson || ''} InputProps={{ readOnly: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayloadOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WebhookEventsPage;
