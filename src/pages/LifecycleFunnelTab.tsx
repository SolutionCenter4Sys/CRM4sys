import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ArrowDownward as ArrowDownwardIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Contact, Lead, LifecycleFunnel, LifecycleFunnelRequest, LifecycleStageData } from '../types';

type FunnelPeriod = LifecycleFunnelRequest['period'];

// ── constants ─────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<LifecycleStageData['stage'], string> = {
  subscriber: 'Subscriber',
  lead: 'Lead',
  mql: 'MQL',
  sql: 'SQL',
  opportunity: 'Opportunity',
  customer: 'Customer',
};

const STAGE_DESCRIPTION: Record<LifecycleStageData['stage'], string> = {
  subscriber: 'Entrou no radar — ainda não identificado como prospect',
  lead: 'Demonstrou interesse — em qualificação inicial',
  mql: 'Marketing Qualified — fit de mercado confirmado',
  sql: 'Sales Qualified — pronto para abordagem comercial',
  opportunity: 'Em negociação — deal aberto no pipeline',
  customer: 'Cliente ativo — conversão concluída',
};

const STAGE_COLORS: Record<LifecycleStageData['stage'], string> = {
  subscriber: '#64748B',
  lead: '#3B82F6',
  mql: '#F59E0B',
  sql: '#EF4444',
  opportunity: '#8B5CF6',
  customer: '#16A34A',
};

const STAGE_BG: Record<LifecycleStageData['stage'], string> = {
  subscriber: 'rgba(100,116,139,0.08)',
  lead: 'rgba(59,130,246,0.08)',
  mql: 'rgba(245,158,11,0.08)',
  sql: 'rgba(239,68,68,0.08)',
  opportunity: 'rgba(139,92,246,0.08)',
  customer: 'rgba(22,163,74,0.08)',
};

const PERIOD_LABELS: Record<FunnelPeriod, string> = {
  current_quarter: 'Q1 2026',
  last_quarter: 'Q4 2025',
  ytd: 'YTD 2026',
  custom_range: 'Período customizado',
};

// ── helpers ───────────────────────────────────────────────────────────────────

const fmtNum = (n: number) => n.toLocaleString('pt-BR');

const conversionHealth = (rate: number): 'error' | 'warning' | 'success' => {
  if (rate < 0.3) return 'error';
  if (rate < 0.5) return 'warning';
  return 'success';
};

const conversionColor = (rate: number): string => {
  if (rate < 0.3) return '#EF4444';
  if (rate < 0.5) return '#F59E0B';
  return '#16A34A';
};

// ── KpiCard ───────────────────────────────────────────────────────────────────

const KpiCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  color?: string;
  borderColor?: string;
}> = ({ label, value, sub, color, borderColor }) => (
  <Paper
    variant="outlined"
    sx={{
      flex: 1,
      minWidth: 120,
      p: 2,
      textAlign: 'center',
      borderColor: borderColor || 'divider',
      borderRadius: 2,
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 800, color: color || 'text.primary', lineHeight: 1.1 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, fontWeight: 500 }}>
      {label}
    </Typography>
    {sub && (
      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
        {sub}
      </Typography>
    )}
  </Paper>
);

// ── InsightCard ───────────────────────────────────────────────────────────────

const InsightCard: React.FC<{
  type: 'bottleneck' | 'warning' | 'success';
  message: string;
}> = ({ type, message }) => {
  const config = {
    bottleneck: {
      icon: <TrendingDownIcon sx={{ fontSize: 18 }} />,
      color: 'error' as const,
      bg: 'rgba(239,68,68,0.06)',
      border: 'rgba(239,68,68,0.25)',
      label: 'Gargalo',
    },
    warning: {
      icon: <WarningIcon sx={{ fontSize: 18 }} />,
      color: 'warning' as const,
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.25)',
      label: 'Atenção',
    },
    success: {
      icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
      color: 'success' as const,
      bg: 'rgba(22,163,74,0.06)',
      border: 'rgba(22,163,74,0.25)',
      label: 'Saudável',
    },
  }[type];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: config.bg,
        border: '1px solid',
        borderColor: config.border,
        flex: '1 1 280px',
      }}
    >
      <Box sx={{ color: `${config.color}.main`, mt: 0.1, flexShrink: 0 }}>{config.icon}</Box>
      <Box>
        <Chip label={config.label} color={config.color} size="small" sx={{ height: 18, fontSize: 10, mb: 0.5 }} />
        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

// ── main component ────────────────────────────────────────────────────────────

const LifecycleFunnelTab: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<FunnelPeriod>('current_quarter');
  const [funnel, setFunnel] = useState<LifecycleFunnel | null>(null);
  const [customRange, setCustomRange] = useState({ from: '2026-01-01', to: '2026-03-31' });
  const [drillStage, setDrillStage] = useState<LifecycleStageData | null>(null);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillLeads, setDrillLeads] = useState<Lead[]>([]);
  const [drillContacts, setDrillContacts] = useState<Contact[]>([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'info' | 'warning' | 'error' });

  const loadFunnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mockApi.leads.getLifecycleFunnel({
        period,
        customRange: period === 'custom_range' ? customRange : undefined,
      });
      setFunnel(res.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar funil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFunnel(); }, [period, customRange.from, customRange.to]);

  const maxCount = useMemo(() => funnel?.stages[0]?.count || 1, [funnel]);

  const kpis = useMemo(() => {
    if (!funnel) return null;
    const first = funnel.stages[0];
    const last = funnel.stages[funnel.stages.length - 1];
    const overallRate = first?.count ? ((last?.count || 0) / first.count) * 100 : 0;
    const totalAvgDays = funnel.stages.reduce((sum, s) => sum + (s.conversionToNext?.avgDays || 0), 0);
    return { total: first?.count || 0, customers: last?.count || 0, rate: overallRate, days: totalAvgDays };
  }, [funnel]);

  const exportCsv = () => {
    if (!funnel) return;
    const header = ['Estágio', 'Contatos', 'Percentual', 'Média (dias)', 'Conversão →', 'Dias médios →'];
    const rows = funnel.stages.map((s) => [
      STAGE_LABELS[s.stage],
      String(s.count),
      `${s.percentage.toFixed(1)}%`,
      String(s.avgDaysInStage),
      s.conversionToNext ? `${(s.conversionToNext.rate * 100).toFixed(1)}%` : '',
      s.conversionToNext ? String(s.conversionToNext.avgDays) : '',
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lifecycle-funnel-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
    setToast({ open: true, message: 'CSV exportado!', severity: 'success' });
  };

  const handleDrillDown = async (stage: LifecycleStageData) => {
    setDrillStage(stage);
    setDrillLoading(true);
    setDrillLeads([]); setDrillContacts([]);
    try {
      if (['subscriber', 'lead', 'mql'].includes(stage.stage)) {
        const res = await mockApi.leads.list({ lifecycle: stage.stage as Lead['lifecycle'] }, 1, 200);
        setDrillLeads(res.data?.data || []);
      } else {
        const res = await mockApi.contacts.list({ lifecycleStage: [stage.stage] }, 1, 200);
        setDrillContacts(res.data?.data || []);
      }
    } finally {
      setDrillLoading(false);
    }
  };

  return (
    <Box>
      {/* ── Controles ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Período</InputLabel>
          <Select value={period} label="Período" onChange={(e) => setPeriod(e.target.value as FunnelPeriod)}>
            {Object.entries(PERIOD_LABELS).map(([v, l]) => (
              <MenuItem key={v} value={v}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {period === 'custom_range' && (
          <>
            <TextField size="small" type="date" label="De" value={customRange.from}
              onChange={(e) => setCustomRange((p) => ({ ...p, from: e.target.value }))}
              InputLabelProps={{ shrink: true }} />
            <TextField size="small" type="date" label="Até" value={customRange.to}
              onChange={(e) => setCustomRange((p) => ({ ...p, to: e.target.value }))}
              InputLabelProps={{ shrink: true }} />
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />} onClick={exportCsv}>
          Exportar CSV
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
      ) : !funnel ? (
        <Alert severity="info">Sem dados para o período selecionado.</Alert>
      ) : (
        <>
          {/* ── KPI Strip ── */}
          {kpis && (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              <KpiCard label="Entradas no funil" value={fmtNum(kpis.total)} sub="Subscribers no período" />
              <KpiCard label="Conversão global" value={`${kpis.rate.toFixed(1)}%`}
                sub="Subscriber → Customer"
                color={kpis.rate >= 2 ? '#16A34A' : kpis.rate >= 1 ? '#F59E0B' : '#EF4444'}
                borderColor={kpis.rate >= 2 ? 'rgba(22,163,74,0.3)' : kpis.rate >= 1 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'} />
              <KpiCard label="Clientes gerados" value={fmtNum(kpis.customers)} sub="Convertidos no período"
                color="#16A34A" borderColor="rgba(22,163,74,0.3)" />
              <KpiCard label="Tempo médio total" value={`${kpis.days}d`} sub="Tempo estimado no pipeline" />
            </Box>
          )}

          {/* ── Funil ── */}
          <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center', letterSpacing: 0.5 }}>
              Clique em qualquer estágio para ver os contatos
            </Typography>

            {funnel.stages.map((stage) => {
              const widthPct = Math.max(18, (stage.count / maxCount) * 100);
              const conv = stage.conversionToNext;
              const health = conv ? conversionHealth(conv.rate) : 'success';
              const color = STAGE_COLORS[stage.stage];

              return (
                <Box key={stage.stage} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0 }}>
                  {/* Stage bar — centered = real funnel shape */}
                  <Tooltip
                    arrow
                    title={
                      <Box sx={{ p: 0.5, maxWidth: 240 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                          {STAGE_LABELS[stage.stage]}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.85 }}>
                          {STAGE_DESCRIPTION[stage.stage]}
                        </Typography>
                        {(stage.topSources || []).length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {stage.topSources!.slice(0, 2).map((s) => (
                              <Typography key={s.source} variant="caption" sx={{ display: 'block' }}>
                                Source: {s.source} ({s.count})
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {(stage.topOwners || []).length > 0 && (
                          <Box sx={{ mt: 0.5 }}>
                            {stage.topOwners!.slice(0, 2).map((o) => (
                              <Typography key={o.ownerName} variant="caption" sx={{ display: 'block' }}>
                                Owner: {o.ownerName} ({o.count})
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  >
                    <Box
                      onClick={() => handleDrillDown(stage)}
                      sx={{
                        width: `${widthPct}%`,
                        bgcolor: color,
                        borderRadius: 2,
                        px: 2,
                        py: 1.4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.18s',
                        '&:hover': { filter: 'brightness(1.1)', transform: 'scaleY(1.02)' },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                          {STAGE_LABELS[stage.stage]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                          {fmtNum(stage.count)} contatos · {stage.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block' }}>
                          Avg time
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>
                          {stage.avgDaysInStage}d
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>

                  {/* Conversion arrow entre estágios */}
                  {conv && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        py: 0.7,
                        width: `${widthPct}%`,
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowDownwardIcon sx={{ fontSize: 14, color: conversionColor(conv.rate) }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: conversionColor(conv.rate),
                          fontSize: 11,
                        }}
                      >
                        {(conv.rate * 100).toFixed(1)}% convertido
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 11 }}>
                        · {conv.avgDays} dias médios
                      </Typography>
                      {health === 'error' && (
                        <Chip
                          label="Gargalo"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ height: 16, fontSize: 9, fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Paper>

          {/* ── Insights ── */}
          {funnel.insights && funnel.insights.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                💡 Insights & Alertas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {funnel.insights.map((insight, idx) => (
                  <InsightCard key={idx} type={insight.type as 'bottleneck' | 'warning' | 'success'} message={insight.message} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}

      {/* ── Drill-down Drawer ── */}
      <Drawer
        anchor="right"
        open={Boolean(drillStage)}
        onClose={() => setDrillStage(null)}
        PaperProps={{ sx: { width: { xs: '100%', md: 480 }, display: 'flex', flexDirection: 'column' } }}
      >
        {drillStage && (
          <>
            {/* Drawer Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                bgcolor: STAGE_COLORS[drillStage.stage],
                color: '#fff',
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.75, fontSize: 10, letterSpacing: 1 }}>
                Drill-down · Lifecycle Funnel
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {STAGE_LABELS[drillStage.stage]}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.3 }}>
                {STAGE_DESCRIPTION[drillStage.stage]}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Contatos</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{fmtNum(drillStage.count)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>% do total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{drillStage.percentage.toFixed(1)}%</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Avg time</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>{drillStage.avgDaysInStage}d</Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Drawer Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {drillLoading ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress size={28} /></Box>
              ) : ['subscriber', 'lead', 'mql'].includes(drillStage.stage) ? (
                drillLeads.length === 0 ? (
                  <Alert severity="info">Nenhum lead neste estágio.</Alert>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      Exibindo {Math.min(drillLeads.length, 20)} de {drillLeads.length} leads
                    </Typography>
                    {drillLeads.slice(0, 20).map((lead) => (
                      <Paper
                        key={lead.id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 2,
                        }}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{lead.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.email}{lead.company ? ` · ${lead.company}` : ''}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                            <Chip
                              label={`Score ${lead.leadScore}`}
                              size="small"
                              color={lead.leadScore >= 70 ? 'error' : lead.leadScore >= 40 ? 'warning' : 'default'}
                              sx={{ height: 20, fontSize: 10 }}
                            />
                            <OpenInNewIcon sx={{ fontSize: 12, color: 'text.disabled', display: 'block', mt: 0.3, ml: 'auto' }} />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                    {drillLeads.length > 20 && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setDrillStage(null); navigate(`/leads?lifecycle=${drillStage.stage}`); }}
                      >
                        Ver todos {drillLeads.length} leads →
                      </Button>
                    )}
                  </Stack>
                )
              ) : (
                drillContacts.length === 0 ? (
                  <Alert severity="info">Nenhum contato neste estágio.</Alert>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      Exibindo {Math.min(drillContacts.length, 20)} de {drillContacts.length} contatos
                    </Typography>
                    {drillContacts.slice(0, 20).map((contact) => (
                      <Paper
                        key={contact.id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 2,
                        }}
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{contact.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contact.email}{contact.jobTitle ? ` · ${contact.jobTitle}` : ''}
                            </Typography>
                          </Box>
                          <OpenInNewIcon sx={{ fontSize: 12, color: 'text.disabled', flexShrink: 0, ml: 1, mt: 0.3 }} />
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )
              )}
            </Box>
          </>
        )}
      </Drawer>

      <Snackbar open={toast.open} autoHideDuration={2600} onClose={() => setToast((p) => ({ ...p, open: false }))}>
        <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LifecycleFunnelTab;
