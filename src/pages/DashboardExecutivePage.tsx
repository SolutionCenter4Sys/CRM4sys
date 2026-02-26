import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { mockApi } from '../mock/api';
import type {
  DashboardDrilldownResult,
  DashboardSegmentFilters,
  ExecutiveDashboardData,
  SaasDashboardData,
} from '../types';

const compareLabel: Record<NonNullable<DashboardSegmentFilters['compareTo']>, string> = {
  previous_period: 'Período anterior',
  last_year: 'Mesmo período ano anterior',
  custom: 'Range customizado',
  none: 'Sem comparação',
};

const DashboardExecutivePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [drilldownStack, setDrilldownStack] = useState<DashboardDrilldownResult[]>([]);
  const [drilldownLoading, setDrilldownLoading] = useState(false);
  const [saasData, setSaasData] = useState<SaasDashboardData | null>(null);

  const filters: DashboardSegmentFilters = useMemo(
    () => ({
      datePreset:
        (searchParams.get('datePreset') as DashboardSegmentFilters['datePreset']) ||
        'this_quarter',
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      team: searchParams.get('team') || undefined,
      pipelineId: searchParams.get('pipelineId') || undefined,
      ownerId: searchParams.get('ownerId') || undefined,
      compareTo:
        (searchParams.get('compareTo') as DashboardSegmentFilters['compareTo']) ||
        'previous_period',
      compareFrom: searchParams.get('compareFrom') || undefined,
      compareToDate: searchParams.get('compareToDate') || undefined,
    }),
    [searchParams]
  );

  const updateFilter = (key: keyof DashboardSegmentFilters, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [response, saasResponse] = await Promise.all([
        mockApi.analytics.getExecutiveDashboard(filters),
        mockApi.saasMetrics.getDashboard(),
      ]);
      setData(response.data || null);
      setSaasData(saasResponse.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [searchParams.toString()]);

  const openDrilldown = async (metricKey: string) => {
    try {
      setDrilldownLoading(true);
      const response = await mockApi.analytics.getDrilldown(metricKey, filters);
      if (response.data) {
        setDrilldownStack((prev) => [...prev, response.data as DashboardDrilldownResult]);
      }
    } finally {
      setDrilldownLoading(false);
    }
  };

  const currentDrilldown = drilldownStack[drilldownStack.length - 1];

  const exportSegment = () => {
    if (!currentDrilldown) return;
    const header = ['Title', 'Owner', 'Stage', 'Status', 'Amount'];
    const rows = currentDrilldown.records.map((record) => [
      record.title,
      record.ownerName || '',
      record.stageName || '',
      record.status || '',
      String(record.amount || ''),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((field) => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `segment-${currentDrilldown.metricKey}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard Executivo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            KPIs e tendências para gestão comercial e reporting executivo.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate('/reports')}>
            Reports
          </Button>
          <Button variant="contained" onClick={() => navigate('/dashboard/analytics')}>
            Dashboard Analítico
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={filters.datePreset}
              label="Período"
              onChange={(event) =>
                updateFilter('datePreset', event.target.value)
              }
            >
              <MenuItem value="this_month">Mês atual</MenuItem>
              <MenuItem value="this_quarter">Trimestre atual</MenuItem>
              <MenuItem value="this_year">Ano atual</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          {filters.datePreset === 'custom' && (
            <>
              <TextField
                size="small"
                type="date"
                label="De"
                value={filters.dateFrom || ''}
                onChange={(event) => updateFilter('dateFrom', event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="Até"
                value={filters.dateTo || ''}
                onChange={(event) => updateFilter('dateTo', event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Comparação</InputLabel>
            <Select
              value={filters.compareTo || 'previous_period'}
              label="Comparação"
              onChange={(event) => updateFilter('compareTo', event.target.value)}
            >
              <MenuItem value="previous_period">{compareLabel.previous_period}</MenuItem>
              <MenuItem value="last_year">{compareLabel.last_year}</MenuItem>
              <MenuItem value="custom">{compareLabel.custom}</MenuItem>
              <MenuItem value="none">{compareLabel.none}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Pipeline ID"
            value={filters.pipelineId || ''}
            onChange={(event) => updateFilter('pipelineId', event.target.value || undefined)}
          />
          <TextField
            size="small"
            label="Owner ID"
            value={filters.ownerId || ''}
            onChange={(event) => updateFilter('ownerId', event.target.value || undefined)}
          />
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading || !data ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(5, minmax(170px, 1fr))',
              },
              gap: 1.5,
              mb: 2,
            }}
          >
            {data.kpis.map((kpi) => (
              <Card key={kpi.key} variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {kpi.formattedValue}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${kpi.comparisonValue >= 0 ? '+' : ''}${kpi.comparisonValue.toFixed(1)} ${kpi.comparisonLabel}`}
                    color={kpi.trend === 'up' ? 'success' : kpi.trend === 'down' ? 'error' : 'default'}
                    variant="outlined"
                    sx={{ mt: 0.7 }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" onClick={() => openDrilldown(kpi.segmentKey)}>
                      Drill-down
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {saasData && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Métricas SaaS
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <SaasKpiCard
                  label="MRR"
                  value={saasData.current.mrr}
                  previousValue={saasData.previous.mrr}
                  format="currency"
                />
                <SaasKpiCard
                  label="ARR"
                  value={saasData.current.arr}
                  previousValue={saasData.previous.arr}
                  format="currency"
                />
                <SaasKpiCard
                  label="Net Revenue Retention"
                  value={saasData.current.netRevenueRetention}
                  previousValue={saasData.previous.netRevenueRetention}
                  format="percent"
                  goodDirection="up"
                />
                <SaasKpiCard
                  label="Logo Churn Rate"
                  value={saasData.current.logoChurnRate}
                  previousValue={saasData.previous.logoChurnRate}
                  format="percent"
                  goodDirection="down"
                />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <SaasKpiCard
                  label="LTV / CAC"
                  value={saasData.current.ltvCacRatio}
                  previousValue={saasData.previous.ltvCacRatio}
                  format="ratio"
                  goodDirection="up"
                />
                <SaasKpiCard
                  label="Revenue Churn Rate"
                  value={saasData.current.revenueChurnRate}
                  previousValue={saasData.previous.revenueChurnRate}
                  format="percent"
                  goodDirection="down"
                />
                <SaasKpiCard
                  label="Net New MRR"
                  value={saasData.current.netNewMrr}
                  previousValue={saasData.previous.netNewMrr}
                  format="currency"
                />
                <SaasKpiCard
                  label="Contas Ativas"
                  value={saasData.current.totalActiveAccounts}
                  previousValue={saasData.previous.totalActiveAccounts}
                  format="number"
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                      Decomposição MRR
                    </Typography>
                    <Stack spacing={1.2}>
                      <MrrBreakdownRow label="Novo MRR" value={saasData.current.newMrr} color="#16A34A" />
                      <MrrBreakdownRow label="Expansão" value={saasData.current.expansionMrr} color="#2563EB" />
                      <MrrBreakdownRow label="Contração" value={-saasData.current.contractionMrr} color="#F59E0B" />
                      <MrrBreakdownRow label="Churned" value={-saasData.current.churnedMrr} color="#DC2626" />
                      <Divider />
                      <MrrBreakdownRow label="Net New MRR" value={saasData.current.netNewMrr} color="#000" bold />
                    </Stack>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                      Tendência MRR (6 meses)
                    </Typography>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={saasData.trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis
                          tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 11 }}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'MRR']}
                        />
                        <Area
                          type="monotone"
                          dataKey="mrr"
                          stroke="#7C3AED"
                          strokeWidth={2}
                          fill="url(#mrrGradient)"
                          dot={{ r: 3, fill: '#7C3AED' }}
                          activeDot={{ r: 5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Box>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                  Pipeline por estágio
                </Typography>
                {(() => {
                  const stageColors = ['#4C1D95', '#6D28D9', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'];
                  const points = data.charts.find((c) => c.id === 'pipeline_by_stage')?.points || [];
                  return (
                    <ResponsiveContainer width="100%" height={points.length * 44 + 20}>
                      <BarChart
                        data={points}
                        layout="vertical"
                        margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                        <XAxis
                          type="number"
                          tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={110} />
                        <RechartsTooltip
                          formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                          cursor={{ fill: 'rgba(124,58,237,0.06)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} onClick={(d) => openDrilldown(d.segmentKey || d.label)}>
                          {points.map((_: unknown, idx: number) => (
                            <Cell key={idx} fill={stageColors[idx % stageColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1.2 }}>
                  Top performers
                </Typography>
                <Stack spacing={1}>
                  {data.topPerformers.map((item, index) => (
                    <Paper key={item.userId} variant="outlined" sx={{ p: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {index + 1}. {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.wins} wins • R$ {item.revenue.toLocaleString('pt-BR')}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </>
      )}

      <Drawer
        anchor="right"
        open={Boolean(currentDrilldown)}
        onClose={() => setDrilldownStack([])}
        PaperProps={{ sx: { width: { xs: '100%', md: 520 }, p: 2 } }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {drilldownStack.length > 0 ? drilldownStack[drilldownStack.length - 1].path.join(' > ') : ''}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Segmento detalhado
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          {drilldownStack.length > 1 && (
            <Button variant="outlined" onClick={() => setDrilldownStack((prev) => prev.slice(0, -1))}>
              Voltar nível
            </Button>
          )}
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportSegment}>
            Exportar segmento
          </Button>
        </Stack>

        {drilldownLoading ? (
          <CircularProgress size={22} />
        ) : currentDrilldown ? (
          <Stack spacing={1}>
            {currentDrilldown.records.map((record) => (
              <Paper key={record.id} variant="outlined" sx={{ p: 1.2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {record.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {record.ownerName || 'Sem owner'} • {record.stageName || 'Sem estágio'} •{' '}
                  {record.status || 'N/A'} • R$ {(record.amount || 0).toLocaleString('pt-BR')}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : null}
      </Drawer>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SaasKpiCardProps {
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'percent' | 'ratio' | 'number';
  goodDirection?: 'up' | 'down';
}

const SaasKpiCard: React.FC<SaasKpiCardProps> = ({
  label,
  value,
  previousValue,
  format,
  goodDirection = 'up',
}) => {
  const delta = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = delta >= 0;
  const isGood = goodDirection === 'up' ? isPositive : !isPositive;

  const formatted = (() => {
    switch (format) {
      case 'currency':
        return `R$ ${value.toLocaleString('pt-BR')}`;
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return `${value.toFixed(2)}x`;
      case 'number':
        return value.toLocaleString('pt-BR');
    }
  })();

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: '12px !important' }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 'clamp(1.25rem, 5vw, 1.55rem)', sm: '1.5rem' },
            lineHeight: 1.15,
            overflowWrap: 'anywhere',
          }}
        >
          {formatted}
        </Typography>
        <Tooltip title={`Anterior: ${format === 'currency' ? 'R$ ' : ''}${previousValue.toLocaleString('pt-BR')}${format === 'percent' ? '%' : ''}`}>
          <Chip
            size="small"
            icon={isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            label={`${isPositive ? '+' : ''}${delta.toFixed(1)}%`}
            color={isGood ? 'success' : 'error'}
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Tooltip>
      </CardContent>
    </Card>
  );
};

interface MrrBreakdownRowProps {
  label: string;
  value: number;
  color: string;
  bold?: boolean;
}

const MrrBreakdownRow: React.FC<MrrBreakdownRowProps> = ({ label, value, color, bold }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400 }}>
        {label}
      </Typography>
    </Stack>
    <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 600, color }}>
      {value >= 0 ? '+' : ''}R$ {value.toLocaleString('pt-BR')}
    </Typography>
  </Stack>
);

export default DashboardExecutivePage;
