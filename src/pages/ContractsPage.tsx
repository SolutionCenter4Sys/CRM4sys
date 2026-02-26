import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Contract, ContractFilters, ContractStatus, ContractType } from '../types';

const statusConfig: Record<ContractStatus, { label: string; color: 'default' | 'info' | 'warning' | 'success' | 'error' }> = {
  draft: { label: 'Rascunho', color: 'default' },
  active: { label: 'Ativo', color: 'success' },
  expiring_soon: { label: 'Expirando', color: 'warning' },
  expired: { label: 'Expirado', color: 'error' },
  renewed: { label: 'Renovado', color: 'info' },
  cancelled: { label: 'Cancelado', color: 'default' },
};

const typeLabels: Record<ContractType, string> = {
  new: 'Novo',
  renewal: 'Renovação',
  amendment: 'Aditivo',
  upsell: 'Upsell',
};

const ContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filters, setFilters] = useState<ContractFilters>({});

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mockApi.contracts.list(filters);
      setContracts(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.status, filters.type, filters.expiringWithinDays]);

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = <K extends keyof ContractFilters>(key: K, value: ContractFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalMrr = contracts
    .filter((c) => c.status === 'active' || c.status === 'expiring_soon')
    .reduce((sum, c) => sum + c.mrr, 0);

  const totalTcv = contracts.reduce((sum, c) => sum + c.totalContractValue, 0);

  const expiringCount = contracts.filter((c) => c.status === 'expiring_soon').length;

  const daysUntilExpiry = (endDate: string): number => {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const contractProgress = (contract: Contract): number => {
    const start = new Date(contract.startDate).getTime();
    const end = new Date(contract.endDate).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return ((now - start) / (end - start)) * 100;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestão de Contratos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contratos ativos, renovações, aditivos e acompanhamento de vigência.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* KPIs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <KpiCard label="Total Contratos" value={String(contracts.length)} />
        <KpiCard label="Ativos" value={String(contracts.filter((c) => c.status === 'active' || c.status === 'expiring_soon').length)} color="#16A34A" />
        <KpiCard label="MRR Contratado" value={`R$ ${totalMrr.toLocaleString('pt-BR')}`} color="#7C3AED" />
        <KpiCard label="TCV Total" value={`R$ ${(totalTcv / 1000000).toFixed(1)}M`} />
        <KpiCard label="Expirando" value={String(expiringCount)} color={expiringCount > 0 ? '#F59E0B' : undefined} />
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Buscar contrato..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: { xs: '100%', md: 240 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status || ''} label="Status" onChange={(e) => updateFilter('status', e.target.value as ContractFilters['status'])}>
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 140 } }}>
            <InputLabel>Tipo</InputLabel>
            <Select value={filters.type || ''} label="Tipo" onChange={(e) => updateFilter('type', e.target.value as ContractFilters['type'])}>
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(typeLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={1.5}>
          {contracts.map((contract) => {
            const sc = statusConfig[contract.status];
            const days = daysUntilExpiry(contract.endDate);
            const progress = contractProgress(contract);

            return (
              <Card
                key={contract.id}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  borderLeft: `4px solid ${sc.color === 'success' ? '#16A34A' : sc.color === 'warning' ? '#F59E0B' : sc.color === 'error' ? '#DC2626' : '#94A3B8'}`,
                }}
                onClick={() => navigate(`/accounts/${contract.accountId}`)}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {contract.title}
                        </Typography>
                        <Chip size="small" label={sc.label} color={sc.color} />
                        <Chip size="small" label={typeLabels[contract.type]} variant="outlined" />
                        {contract.autoRenew && (
                          <Chip size="small" label="Auto-renovação" variant="outlined" color="info" />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {contract.code} · {contract.accountName} · Owner: {contract.ownerName}
                      </Typography>
                    </Box>

                    <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} sx={{ minWidth: { xs: 0, md: 180 } }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                        MRR R$ {contract.mrr.toLocaleString('pt-BR')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        TCV R$ {contract.totalContractValue.toLocaleString('pt-BR')}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Progress bar */}
                  <Box sx={{ mt: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(contract.startDate).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Tooltip title={days > 0 ? `${days} dias restantes` : 'Expirado'}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: days <= 30 ? '#DC2626' : days <= 90 ? '#F59E0B' : 'text.secondary',
                          }}
                        >
                          {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                          {days > 0 ? ` (${days}d)` : ' (expirado)'}
                        </Typography>
                      </Tooltip>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: progress >= 90 ? '#DC2626' : progress >= 75 ? '#F59E0B' : '#7C3AED',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  {/* Line items + amendments */}
                  {(contract.lineItems.length > 0 || contract.amendments.length > 0) && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        {contract.lineItems.slice(0, 3).map((li) => (
                          <Chip
                            key={li.id}
                            size="small"
                            label={`${li.productName} x${li.quantity}`}
                            variant="outlined"
                            sx={{ fontSize: '0.65rem' }}
                          />
                        ))}
                        {contract.amendments.length > 0 && (
                          <Chip
                            size="small"
                            label={`${contract.amendments.length} aditivo(s)`}
                            color="info"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem' }}
                          />
                        )}
                        {contract.signedByClient && (
                          <Typography variant="caption" color="text.secondary">
                            Assinado: {contract.signedByClient}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {contracts.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Nenhum contrato encontrado.
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

const KpiCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <Card variant="outlined">
    <CardContent sx={{ pb: '12px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: color || 'text.primary',
          fontSize: { xs: 'clamp(1.1rem, 4.5vw, 1.35rem)', sm: '1.25rem' },
          lineHeight: 1.2,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default ContractsPage;
