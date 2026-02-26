import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type {
  AccountHealthScore,
  AccountHealthFilters,
  CsOverviewData,
  CsAlert,
  HealthScoreLevel,
} from '../types';

const levelConfig: Record<
  HealthScoreLevel,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  healthy: { label: 'Saudável', color: '#16A34A', bgColor: '#DCFCE7', icon: <CheckCircleIcon fontSize="small" sx={{ color: '#16A34A' }} /> },
  attention: { label: 'Atenção', color: '#F59E0B', bgColor: '#FEF3C7', icon: <InfoIcon fontSize="small" sx={{ color: '#F59E0B' }} /> },
  at_risk: { label: 'Em Risco', color: '#DC2626', bgColor: '#FEE2E2', icon: <WarningIcon fontSize="small" sx={{ color: '#DC2626' }} /> },
  critical: { label: 'Crítico', color: '#7F1D1D', bgColor: '#FCA5A5', icon: <ErrorIcon fontSize="small" sx={{ color: '#7F1D1D' }} /> },
};

const CustomerSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<CsOverviewData | null>(null);
  const [healthScores, setHealthScores] = useState<AccountHealthScore[]>([]);
  const [filters, setFilters] = useState<AccountHealthFilters>({
    sortBy: 'score_asc',
  });

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewRes, healthRes] = await Promise.all([
        mockApi.customerSuccess.getOverview(),
        mockApi.customerSuccess.listHealthScores(filters),
      ]);
      setOverview(overviewRes.data || null);
      setHealthScores(healthRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar Customer Success');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.level, filters.tier, filters.sortBy, filters.ownerId]);

  useEffect(() => {
    if (!filters.search && filters.search !== undefined) return;
    const timer = window.setTimeout(() => load(), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = <K extends keyof AccountHealthFilters>(key: K, value: AccountHealthFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Customer Success
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Saúde dos clientes, alertas de churn e indicadores de retenção.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Dashboard Executivo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading || !overview ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
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
            <OverviewCard label="Score Médio" value={`${overview.avgHealthScore}/100`} subtitle={`${overview.totalAccounts} contas`} />
            <OverviewCard
              label="Contas em Risco"
              value={String(overview.accountsAtRisk)}
              subtitle={`R$ ${overview.totalMrrAtRisk.toLocaleString('pt-BR')} MRR`}
              color="#DC2626"
            />
            <OverviewCard label="NPS Médio" value={overview.avgNps !== null ? overview.avgNps.toFixed(1) : 'N/A'} subtitle={`${overview.npsRespondents} respondentes`} />
            <OverviewCard label="Renovações 30d" value={String(overview.renewalsNext30Days)} subtitle="contratos expirando" color="#F59E0B" />
            <OverviewCard label="Renovações 90d" value={String(overview.renewalsNext90Days)} subtitle="contratos expirando" />
          </Box>

          {/* Health Distribution */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Distribuição de Saúde
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {(Object.entries(overview.healthDistribution) as [HealthScoreLevel, number][]).map(
                  ([level, count]) => {
                    const config = levelConfig[level];
                    const pct = overview.totalAccounts > 0 ? (count / overview.totalAccounts) * 100 : 0;
                    return (
                      <Box key={level} sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                          {config.icon}
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {config.label}
                          </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: config.color }}>
                          {count}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': { bgcolor: config.color, borderRadius: 3 },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {pct.toFixed(0)}%
                        </Typography>
                      </Box>
                    );
                  }
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Alerts */}
          {overview.recentAlerts.filter((a) => !a.acknowledged).length > 0 && (
            <Card variant="outlined" sx={{ mb: 2, borderColor: '#FEE2E2' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#DC2626' }}>
                  Alertas Ativos ({overview.recentAlerts.filter((a) => !a.acknowledged).length})
                </Typography>
                <Stack spacing={1}>
                  {overview.recentAlerts
                    .filter((a) => !a.acknowledged)
                    .slice(0, 5)
                    .map((alert) => (
                      <AlertRow key={alert.id} alert={alert} onNavigate={() => navigate(`/cs/${alert.accountId}`)} />
                    ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                size="small"
                placeholder="Buscar conta ou owner..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              />
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 140 } }}>
                <InputLabel>Saúde</InputLabel>
                <Select
                  value={filters.level || ''}
                  label="Saúde"
                  onChange={(e) => updateFilter('level', e.target.value as AccountHealthFilters['level'])}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="healthy">Saudável</MenuItem>
                  <MenuItem value="attention">Atenção</MenuItem>
                  <MenuItem value="at_risk">Em Risco</MenuItem>
                  <MenuItem value="critical">Crítico</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 140 } }}>
                <InputLabel>Tier</InputLabel>
                <Select
                  value={filters.tier || ''}
                  label="Tier"
                  onChange={(e) => updateFilter('tier', e.target.value as AccountHealthFilters['tier'])}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                  <MenuItem value="MidMarket">MidMarket</MenuItem>
                  <MenuItem value="SMB">SMB</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 } }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.sortBy || 'score_asc'}
                  label="Ordenar por"
                  onChange={(e) => updateFilter('sortBy', e.target.value as AccountHealthFilters['sortBy'])}
                >
                  <MenuItem value="score_asc">Score (menor primeiro)</MenuItem>
                  <MenuItem value="score_desc">Score (maior primeiro)</MenuItem>
                  <MenuItem value="mrr_desc">MRR (maior primeiro)</MenuItem>
                  <MenuItem value="contract_end">Contrato (mais próximo)</MenuItem>
                  <MenuItem value="days_since_contact">Sem contato (mais dias)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Health Score Table */}
          <Stack spacing={1.5}>
            {healthScores.map((account) => (
              <HealthScoreRow
                key={account.accountId}
                account={account}
                onClick={() => navigate(`/cs/${account.accountId}`)}
              />
            ))}
            {healthScores.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Nenhuma conta encontrada com os filtros aplicados.
              </Typography>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const OverviewCard: React.FC<{
  label: string;
  value: string;
  subtitle: string;
  color?: string;
}> = ({ label, value, subtitle, color }) => (
  <Card variant="outlined">
    <CardContent sx={{ pb: '12px !important' }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: color || 'text.primary',
          fontSize: { xs: 'clamp(1.15rem, 4.8vw, 1.45rem)', sm: '1.5rem' },
          lineHeight: 1.15,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const AlertRow: React.FC<{ alert: CsAlert; onNavigate: () => void }> = ({ alert, onNavigate }) => {
  const severityColor: Record<CsAlert['severity'], 'error' | 'warning' | 'info' | 'default'> = {
    critical: 'error',
    high: 'error',
    medium: 'warning',
    low: 'info',
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
        <Chip size="small" label={alert.severity} color={severityColor[alert.severity]} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {alert.accountName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {alert.message}
          </Typography>
        </Box>
      </Stack>
      <Button size="small" onClick={onNavigate}>
        Ver conta
      </Button>
    </Paper>
  );
};

const HealthScoreRow: React.FC<{
  account: AccountHealthScore;
  onClick: () => void;
}> = ({ account, onClick }) => {
  const config = levelConfig[account.level];

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
        borderLeft: `4px solid ${config.color}`,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {account.accountName}
              </Typography>
              <Chip size="small" label={account.accountTier} variant="outlined" />
              <Chip
                size="small"
                label={config.label}
                sx={{ bgcolor: config.bgColor, color: config.color, fontWeight: 600 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Owner: {account.ownerName} · MRR: R$ {account.mrr.toLocaleString('pt-BR')} · Contrato até{' '}
              {new Date(account.contractEndDate).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Health Score">
              <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: config.color }}>
                  {account.overallScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /100
                </Typography>
              </Box>
            </Tooltip>
            <Stack spacing={0.3} sx={{ minWidth: 120 }}>
              {account.dimensions.map((dim) => (
                <Tooltip key={dim.name} title={`${dim.name}: ${dim.score}/${dim.maxScore}`}>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {dim.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(dim.score / dim.maxScore) * 100}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: dim.score >= 7 ? '#16A34A' : dim.score >= 5 ? '#F59E0B' : '#DC2626',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Stack>
            <Stack sx={{ minWidth: 90, textAlign: 'right' }}>
              {account.riskFactors.length > 0 && (
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                  {account.riskFactors.length} risco{account.riskFactors.length > 1 ? 's' : ''}
                </Typography>
              )}
              {account.daysSinceLastContact > 14 && (
                <Typography variant="caption" color="warning.main">
                  {account.daysSinceLastContact}d sem contato
                </Typography>
              )}
              {account.openTickets > 3 && (
                <Typography variant="caption" color="error.main">
                  {account.openTickets} tickets
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CustomerSuccessPage;
