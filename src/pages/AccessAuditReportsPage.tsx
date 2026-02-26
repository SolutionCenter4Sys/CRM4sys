import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
  Typography,
} from '@mui/material';
import { FileDownload as FileDownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { AccessAuditEvent, AccessExportRecord } from '../types';

const AccessAuditReportsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<AccessAuditEvent[]>([]);
  const [exportsRows, setExportsRows] = useState<AccessExportRecord[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    try {
      const [eventsRes, exportsRes] = await Promise.all([
        mockApi.access.listAuditEvents(query),
        mockApi.access.listExportHistory(),
      ]);
      setEvents(eventsRes.data || []);
      setExportsRows(exportsRes.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar dados', severity: 'error' });
    }
  };

  useEffect(() => {
    load();
  }, [query]);

  const requestExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await mockApi.access.requestAuditExport(format);
      setSnackbar({ open: true, message: `Exportação ${format.toUpperCase()} gerada.`, severity: 'success' });
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao gerar exportação', severity: 'error' });
    }
  };

  const regenerate = async (exportId: string) => {
    try {
      await mockApi.access.regenerateExport(exportId);
      setSnackbar({ open: true, message: 'Exportação renovada.', severity: 'success' });
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao renovar exportação', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Auditoria IAM e Relatórios
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            fullWidth
            label="Buscar em ator, entidade ou detalhes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={() => requestExport('csv')}>
            CSV
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => requestExport('xlsx')}>
            XLSX
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => requestExport('pdf')}>
            PDF
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Trilha de auditoria IAM
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Ator</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Entidade</TableCell>
                <TableCell>Detalhes</TableCell>
                <TableCell>Severidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum evento encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.eventId}>
                    <TableCell>{new Date(event.timestamp).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{event.actor}</TableCell>
                    <TableCell>{event.action}</TableCell>
                    <TableCell>{event.entityName}</TableCell>
                    <TableCell>{event.details || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={event.severity}
                        color={event.severity === 'high' ? 'error' : event.severity === 'medium' ? 'warning' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Histórico de exportações
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Formato</TableCell>
                <TableCell>Gerado em</TableCell>
                <TableCell>Expira em</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exportsRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhuma exportação no histórico.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                exportsRows.map((row) => (
                  <TableRow key={row.exportId}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.format.toUpperCase()}</TableCell>
                    <TableCell>{new Date(row.generatedAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{new Date(row.expiresAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip size="small" label={row.status} color={row.status === 'completed' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {row.downloadUrl && (
                          <Button size="small" href={row.downloadUrl} target="_blank">
                            Download
                          </Button>
                        )}
                        <Button size="small" startIcon={<RefreshIcon />} onClick={() => regenerate(row.exportId)}>
                          Renovar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccessAuditReportsPage;
