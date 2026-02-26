// CollectionJobsPage.tsx - Monitoramento de execuções de régua (F2)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { CollectionJob, CollectionJobFilters } from '../types';

const CollectionJobsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [filters, setFilters] = useState<CollectionJobFilters>({ status: 'all' });
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await mockApi.collections.listJobs(filters);
      setJobs(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar jobs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const statusColorMap = {
    queued: 'default' as const,
    processing: 'info' as const,
    done: 'success' as const,
    error: 'error' as const,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Execuções de Régua
        </Typography>
        <Tooltip title="Recarregar">
          <IconButton onClick={loadJobs} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            select
            label="Status"
            size="small"
            sx={{ minWidth: 160 }}
            value={filters.status || 'all'}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="queued">Aguardando</MenuItem>
            <MenuItem value="processing">Processando</MenuItem>
            <MenuItem value="done">Concluído</MenuItem>
            <MenuItem value="error">Erro</MenuItem>
          </TextField>
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
                <TableCell>Régua</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Início</TableCell>
                <TableCell>Fim</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Processadas</TableCell>
                <TableCell align="right">Enviadas</TableCell>
                <TableCell align="right">Erros</TableCell>
                <TableCell align="center">Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhuma execução encontrada
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <TableRow hover>
                      <TableCell>{job.ruleName}</TableCell>
                      <TableCell>
                        <Chip label={job.status} color={statusColorMap[job.status]} size="small" />
                      </TableCell>
                      <TableCell>{new Date(job.startedAt).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{job.finishedAt ? new Date(job.finishedAt).toLocaleString('pt-BR') : '-'}</TableCell>
                      <TableCell align="right">{job.totalInvoices}</TableCell>
                      <TableCell align="right">{job.processedInvoices}</TableCell>
                      <TableCell align="right">{job.sentCount}</TableCell>
                      <TableCell align="right">
                        <Chip label={job.errorCount} color={job.errorCount > 0 ? 'error' : 'default'} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        >
                          <ExpandMoreIcon
                            sx={{
                              transform: expandedJob === job.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: '0.2s',
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={9} sx={{ py: 0 }}>
                        <Collapse in={expandedJob === job.id}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                              Erros ({job.errorCount})
                            </Typography>
                            {job.errors && job.errors.length > 0 ? (
                              <Stack spacing={1}>
                                {job.errors.map((err, idx) => (
                                  <Paper key={idx} variant="outlined" sx={{ p: 1 }}>
                                    <Typography variant="caption" color="error.main" fontWeight={600}>
                                      {err.code}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      {err.message}
                                    </Typography>
                                    {err.invoiceId && (
                                      <Typography variant="caption" color="text.secondary">
                                        Fatura: {err.invoiceId}
                                      </Typography>
                                    )}
                                  </Paper>
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                Nenhum erro registrado
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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

export default CollectionJobsPage;
