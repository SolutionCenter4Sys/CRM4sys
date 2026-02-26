import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
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
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { AuditEvent, AuditFilters } from '../types';

const AuditTrailPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    periodFrom: null,
    periodTo: null,
    userId: null,
    entityType: null,
    action: null,
    severity: null,
    query: '',
    page: 1,
    pageSize: 50,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await mockApi.compliance.searchAuditEvents(filters);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Trilha de Auditoria
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField size="small" label="Busca" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
          <TextField
            size="small"
            select
            label="Entidade"
            sx={{ minWidth: 160 }}
            value={filters.entityType || ''}
            onChange={(e) => setFilters({ ...filters, entityType: (e.target.value || null) as any })}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="invoice">invoice</MenuItem>
            <MenuItem value="payment">payment</MenuItem>
            <MenuItem value="collection_rule">collection_rule</MenuItem>
            <MenuItem value="template">template</MenuItem>
            <MenuItem value="connector">connector</MenuItem>
            <MenuItem value="permission">permission</MenuItem>
          </TextField>
          <TextField
            size="small"
            select
            label="Severidade"
            sx={{ minWidth: 160 }}
            value={filters.severity || ''}
            onChange={(e) => setFilters({ ...filters, severity: (e.target.value || null) as any })}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="info">info</MenuItem>
            <MenuItem value="warning">warning</MenuItem>
            <MenuItem value="critical">critical</MenuItem>
          </TextField>
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
                <TableCell>Data/Hora</TableCell>
                <TableCell>Entidade</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Resumo</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Severidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum log encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.auditId}>
                    <TableCell>{new Date(row.occurredAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{row.entityType}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.summary}</TableCell>
                    <TableCell>{row.actorName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.severity}
                        color={row.severity === 'critical' ? 'error' : row.severity === 'warning' ? 'warning' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditTrailPage;
