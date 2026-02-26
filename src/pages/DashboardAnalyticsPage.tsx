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
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { mockApi } from '../mock/api';
import { getRoutePerfSummary } from '../utils/perf';
import type { Account, Activity, Deal, ExecutiveDashboardData, Stage } from '../types';

interface StageAggregate {
  stageId: string;
  stageName: string;
  count: number;
  value: number;
  probability: number;
  color: string;
}

export const DashboardAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [routePerfSummary, setRoutePerfSummary] = useState(() => getRoutePerfSummary());
  const [globalSnapshot, setGlobalSnapshot] = useState<ExecutiveDashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [accountsRes, dealsRes, activitiesRes, pipelinesRes, analyticsRes] = await Promise.all([
          mockApi.accounts.list(),
          mockApi.deals.list(),
          mockApi.activities.list(),
          mockApi.pipelines.list(),
          mockApi.analytics.getExecutiveDashboard({
            datePreset: (searchParams.get('datePreset') as 'this_month' | 'this_quarter' | 'this_year' | 'custom') || 'this_quarter',
            compareTo: (searchParams.get('compareTo') as 'previous_period' | 'last_year' | 'custom' | 'none') || 'previous_period',
          }),
        ]);

        const currentPipeline = (pipelinesRes.data || [])[0];
        const stagesRes = currentPipeline
          ? await mockApi.pipelines.listStages(currentPipeline.id)
          : { data: [] };

        setAccounts(accountsRes.data || []);
        setDeals(dealsRes.data || []);
        setActivities(activitiesRes.data || []);
        setStages(stagesRes.data || []);
        setGlobalSnapshot(analyticsRes.data || null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar dashboard analítico');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams.toString()]);

  useEffect(() => {
    const refresh = () => setRoutePerfSummary(getRoutePerfSummary());
    const id = window.setInterval(refresh, 1500);
    return () => window.clearInterval(id);
  }, []);

  const openDeals = useMemo(() => deals.filter((d) => d.status === 'open'), [deals]);
  const wonDeals = useMemo(() => deals.filter((d) => d.status === 'won'), [deals]);
  const lostDeals = useMemo(() => deals.filter((d) => d.status === 'lost'), [deals]);

  const openValue = useMemo(
    () => openDeals.reduce((sum, deal) => sum + deal.amount, 0),
    [openDeals]
  );
  const forecastValue = useMemo(
    () => openDeals.reduce((sum, deal) => sum + deal.weightedAmount, 0),
    [openDeals]
  );
  const wonValue = useMemo(
    () => wonDeals.reduce((sum, deal) => sum + deal.amount, 0),
    [wonDeals]
  );
  const winRate = useMemo(() => {
    const denominator = wonDeals.length + lostDeals.length;
    return denominator === 0 ? 0 : (wonDeals.length / denominator) * 100;
  }, [wonDeals.length, lostDeals.length]);
  const agingAverage = useMemo(() => {
    if (openDeals.length === 0) return 0;
    return (
      openDeals.reduce((sum, deal) => sum + (deal.rottingDays || 0), 0) / openDeals.length
    );
  }, [openDeals]);

  const recentActivities = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    return activities.filter((a) => new Date(a.activityDate).getTime() >= sevenDaysAgo).length;
  }, [activities]);

  const pipelineByStage = useMemo<StageAggregate[]>(() => {
    const base = stages.map((stage) => ({
      stageId: stage.id,
      stageName: stage.name,
      count: 0,
      value: 0,
      probability: stage.probability,
      color: stage.color,
    }));

    openDeals.forEach((deal) => {
      const item = base.find((s) => s.stageId === deal.stageId);
      if (item) {
        item.count += 1;
        item.value += deal.amount;
      }
    });

    return base;
  }, [openDeals, stages]);

  const biggestStageValue = useMemo(
    () => Math.max(1, ...pipelineByStage.map((s) => s.value)),
    [pipelineByStage]
  );

  const topAccounts = useMemo(() => {
    const map = new Map<string, { account: Account; value: number; deals: number }>();

    openDeals.forEach((deal) => {
      const account = deal.account || accounts.find((a) => a.id === deal.accountId);
      if (!account) return;
      const current = map.get(account.id) || { account, value: 0, deals: 0 };
      current.value += deal.amount;
      current.deals += 1;
      map.set(account.id, current);
    });

    return Array.from(map.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [openDeals, accounts]);

  const criticalDeals = useMemo(
    () =>
      openDeals
        .filter((d) => (d.rottingDays || 0) >= 7)
        .sort((a, b) => (b.rottingDays || 0) - (a.rottingDays || 0))
        .slice(0, 6),
    [openDeals]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard Analítico
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Métricas e monitoramento comercial consolidados.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            Voltar para Home
          </Button>
          <Button variant="contained" onClick={() => navigate('/deals')}>
            Abrir Pipeline
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(140px, 1fr))',
          gap: 1.5,
          mb: 2,
        }}
      >
        {globalSnapshot && (
          <Chip
            label={`Comparação global: ${globalSnapshot.filters.compareTo || 'previous_period'}`}
            color="secondary"
            variant="outlined"
          />
        )}
        <Chip label={`Open Pipeline: R$ ${openValue.toLocaleString('pt-BR')}`} color="primary" />
        <Chip label={`Forecast: R$ ${forecastValue.toLocaleString('pt-BR')}`} color="info" />
        <Chip label={`Ganhos: R$ ${wonValue.toLocaleString('pt-BR')}`} color="success" />
        <Chip
          label={`Win Rate: ${winRate.toFixed(1)}%`}
          color={winRate >= 35 ? 'success' : 'warning'}
        />
        <Chip
          label={`Aging médio: ${agingAverage.toFixed(1)}d`}
          color={agingAverage >= 8 ? 'warning' : 'default'}
        />
        <Chip label={`Atividades 7d: ${recentActivities}`} color="secondary" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Funil por Estágio
            </Typography>
            <ResponsiveContainer width="100%" height={pipelineByStage.length * 44 + 20}>
              <BarChart
                data={pipelineByStage.map((s) => ({ name: s.stageName, value: s.value, count: s.count, color: s.color }))}
                layout="vertical"
                margin={{ top: 0, right: 70, left: 0, bottom: 0 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                <RechartsTooltip
                  formatter={(value: number, _: string, entry: { payload?: { count?: number } }) => [
                    `R$ ${value.toLocaleString('pt-BR')} • ${entry?.payload?.count ?? 0} deal(s)`,
                    'Pipeline',
                  ]}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {pipelineByStage.map((stage) => (
                    <Cell key={stage.stageId} fill={stage.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Distribuição de Status
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Abertos', value: openDeals.length, color: '#6D28D9' },
                    { name: 'Ganhos', value: wonDeals.length, color: '#16A34A' },
                    { name: 'Perdidos', value: lostDeals.length, color: '#DC2626' },
                  ]}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {[
                    { name: 'Abertos', value: openDeals.length, color: '#6D28D9' },
                    { name: 'Ganhos', value: wonDeals.length, color: '#16A34A' },
                    { name: 'Perdidos', value: lostDeals.length, color: '#DC2626' },
                  ].map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={10} />
                <RechartsTooltip formatter={(value: number, name: string) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              Total monitorado: {deals.length} deals
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Top Contas por Pipeline Aberto
            </Typography>
            {topAccounts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sem contas com deals abertos.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={topAccounts.length * 44 + 20}>
                <BarChart
                  data={topAccounts.map((item) => ({ name: item.account.name, value: item.value, deals: item.deals }))}
                  layout="vertical"
                  margin={{ top: 0, right: 70, left: 0, bottom: 0 }}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <RechartsTooltip
                    formatter={(value: number, _: string, entry: { payload?: { deals?: number } }) => [
                      `R$ ${value.toLocaleString('pt-BR')} • ${entry?.payload?.deals ?? 0} deal(s)`,
                      'Pipeline',
                    ]}
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  />
                  <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Prioridades (Rotting)
            </Typography>
            {criticalDeals.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhum deal crítico no momento.
              </Typography>
            ) : (
              criticalDeals.map((deal, index) => (
                <Box key={deal.id} sx={{ py: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {deal.title}
                    </Typography>
                    <Chip
                      size="small"
                      color={(deal.rottingDays || 0) >= 10 ? 'error' : 'warning'}
                      label={`${deal.rottingDays || 0}d`}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {deal.account?.name || 'Conta não definida'}
                  </Typography>
                  {index < criticalDeals.length - 1 && <Divider sx={{ mt: 1.2 }} />}
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Performance de Navegação (local)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
              <Chip label={`Medições: ${routePerfSummary.count}`} variant="outlined" />
              <Chip
                label={`Média: ${routePerfSummary.avgMs.toFixed(1)}ms`}
                color={routePerfSummary.avgMs <= 120 ? 'success' : 'warning'}
                variant="outlined"
              />
              <Chip
                label={`P95: ${routePerfSummary.p95Ms.toFixed(1)}ms`}
                color={routePerfSummary.p95Ms <= 220 ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>

            {routePerfSummary.recent.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sem dados ainda. Navegue entre as telas para coletar métricas.
              </Typography>
            ) : (
              routePerfSummary.recent.map((item, index) => (
                <Box key={`${item.timestamp}-${index}`} sx={{ py: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.from} {'->'} {item.to}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.durationMs.toFixed(1)}ms •{' '}
                    {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
                  </Typography>
                  {index < routePerfSummary.recent.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardAnalyticsPage;
