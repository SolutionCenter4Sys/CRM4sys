// ReceivablesDashboardPage.tsx - Dashboard de recebíveis (F3)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FileDownload as FileDownloadIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { ReceivablesKpi, AgingBucket, AgingDetailRow, ReceivablesFilters } from '../types';

const ReceivablesDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<ReceivablesKpi[]>([]);
  const [agingBuckets, setAgingBuckets] = useState<AgingBucket[]>([]);
  const [filters, setFilters] = useState<ReceivablesFilters>({
    asOfDate: new Date().toISOString().slice(0, 10),
    accountId: null,
    status: ['open', 'partial', 'overdue'],
  });
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownBucket, setDrilldownBucket] = useState<AgingBucket['bucket'] | null>(null);
  const [drilldownRows, setDrilldownRows] = useState<AgingDetailRow[]>([]);
  const [drilldownLoading, setDrilldownLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpisRes, agingRes] = await Promise.all([
        mockApi.receivables.getKpis(filters),
        mockApi.receivables.getAgingBuckets(filters),
      ]);
      setKpis(kpisRes.data || []);
      setAgingBuckets(agingRes.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar recebíveis', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleBucketClick = async (bucket: AgingBucket['bucket']) => {
    setDrilldownBucket(bucket);
    setDrilldownOpen(true);
    setDrilldownLoading(true);
    try {
      const res = await mockApi.receivables.getAgingDetails(bucket, filters);
      setDrilldownRows(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setDrilldownLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await mockApi.receivables.requestReceivablesExport('csv');
      setSnackbar({ open: true, message: res.message || 'Exportação solicitada', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Painel de Recebíveis
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Recarregar">
            <IconButton onClick={loadData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Exportar
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Data de corte"
            type="date"
            size="small"
            sx={{ minWidth: 180 }}
            InputLabelProps={{ shrink: true }}
            value={filters.asOfDate}
            onChange={(e) => setFilters({ ...filters, asOfDate: e.target.value })}
          />
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid item xs={12} md={6} lg={3} key={kpi.key}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ my: 1 }}>
                    {kpi.formattedValue}
                  </Typography>
                  {kpi.comparison && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {kpi.comparison.deltaPct >= 0 ? (
                        <TrendingUpIcon fontSize="small" color="error" />
                      ) : (
                        <TrendingDownIcon fontSize="small" color="success" />
                      )}
                      <Typography variant="caption" color={kpi.comparison.deltaPct >= 0 ? 'error.main' : 'success.main'}>
                        {Math.abs(kpi.comparison.deltaPct).toFixed(1)}% {kpi.comparison.label}
                      </Typography>
                    </Stack>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Aging de Recebíveis (por dias em atraso)
            </Typography>
            <Grid container spacing={2}>
              {agingBuckets.map((bucket) => (
                <Grid item xs={12} md={6} lg={3} key={bucket.bucket}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => handleBucketClick(bucket.bucket)}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {bucket.label} dias
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {formatCurrency(bucket.amountOpen)}
                    </Typography>
                    <Chip label={`${bucket.invoicesCount} faturas`} size="small" sx={{ mt: 1 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}

      {/* Drawer de Drill-down */}
      <Drawer anchor="right" open={drilldownOpen} onClose={() => setDrilldownOpen(false)}>
        <Box sx={{ width: 700, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Detalhes do bucket:{' '}
              {drilldownBucket === '0_30'
                ? '0–30 dias'
                : drilldownBucket === '31_60'
                ? '31–60 dias'
                : drilldownBucket === '61_90'
                ? '61–90 dias'
                : '90+ dias'}
            </Typography>
            <IconButton onClick={() => setDrilldownOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {drilldownLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fatura</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell align="right">Dias</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drilldownRows.map((row) => (
                    <TableRow key={row.invoiceId} hover>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell>{row.accountName}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell align="right">
                        <Chip label={row.daysOverdue} size="small" color="error" />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatCurrency(row.amountOpen)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Drawer>

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

export default ReceivablesDashboardPage;
