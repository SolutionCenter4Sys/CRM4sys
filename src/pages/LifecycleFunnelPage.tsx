import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Contact, Lead, LifecycleFunnel, LifecycleFunnelRequest, LifecycleStageData } from '../types';

type FunnelPeriod = LifecycleFunnelRequest['period'];

const stageLabels: Record<LifecycleStageData['stage'], string> = {
  subscriber: 'Subscriber',
  lead: 'Lead',
  mql: 'MQL',
  sql: 'SQL',
  opportunity: 'Opportunity',
  customer: 'Customer',
};

const stageColors: Record<LifecycleStageData['stage'], string> = {
  subscriber: '#6B7280',
  lead: '#3B82F6',
  mql: '#F59E0B',
  sql: '#DC2626',
  opportunity: '#7C3AED',
  customer: '#16A34A',
};

const periodLabels: Record<FunnelPeriod, string> = {
  current_quarter: 'Q1 2026',
  last_quarter: 'Q4 2025',
  ytd: 'YTD 2026',
  custom_range: 'Custom Range',
};

const LifecycleFunnelPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<FunnelPeriod>('current_quarter');
  const [funnel, setFunnel] = useState<LifecycleFunnel | null>(null);
  const [customRange, setCustomRange] = useState<{ from: string; to: string }>({
    from: '2026-01-01',
    to: '2026-03-31',
  });
  const [drillDownStage, setDrillDownStage] = useState<LifecycleStageData | null>(null);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillLeads, setDrillLeads] = useState<Lead[]>([]);
  const [drillContacts, setDrillContacts] = useState<Contact[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const loadFunnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.leads.getLifecycleFunnel({
        period,
        customRange: period === 'custom_range' ? customRange : undefined,
      });
      setFunnel(response.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar funil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunnel();
  }, [period, customRange.from, customRange.to]);

  const maxCount = useMemo(() => funnel?.stages[0]?.count || 1, [funnel]);

  const exportCsv = () => {
    if (!funnel) return;
    const header = ['Stage', 'Count', 'Percentual', 'AvgDays', 'ConversionRate', 'ConversionAvgDays'];
    const rows = funnel.stages.map((stage) => [
      stageLabels[stage.stage],
      String(stage.count),
      stage.percentage.toFixed(1),
      String(stage.avgDaysInStage),
      stage.conversionToNext ? `${(stage.conversionToNext.rate * 100).toFixed(1)}%` : '',
      stage.conversionToNext ? String(stage.conversionToNext.avgDays) : '',
    ]);
    const csv = [header, ...rows].map((row) => row.map((col) => `"${col}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifecycle-funnel-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast({ open: true, message: 'CSV exportado com sucesso', severity: 'success' });
  };

  const handleDrillDown = async (stage: LifecycleStageData) => {
    setDrillDownStage(stage);
    setDrillLoading(true);
    setDrillLeads([]);
    setDrillContacts([]);
    try {
      if (stage.stage === 'subscriber' || stage.stage === 'lead' || stage.stage === 'mql') {
        const response = await mockApi.leads.list({ lifecycle: stage.stage }, 1, 200);
        setDrillLeads(response.data?.data || []);
      } else {
        const response = await mockApi.contacts.list({ lifecycleStage: [stage.stage] }, 1, 200);
        setDrillContacts(response.data?.data || []);
      }
    } finally {
      setDrillLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            📊 Lifecycle Funnel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversão por estágio de lifecycle para identificar gargalos de marketing.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={period}
              label="Período"
              onChange={(event) => setPeriod(event.target.value as FunnelPeriod)}
            >
              {Object.entries(periodLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {period === 'custom_range' && (
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                type="date"
                label="De"
                value={customRange.from}
                onChange={(event) =>
                  setCustomRange((prev) => ({ ...prev, from: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="Até"
                value={customRange.to}
                onChange={(event) =>
                  setCustomRange((prev) => ({ ...prev, to: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          )}
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv}>
            Exportar CSV
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      ) : !funnel ? (
        <Paper sx={{ p: 4 }}>Sem dados de funil.</Paper>
      ) : (
        <>
          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            {funnel.stages.map((stage) => {
              const widthPercentage = Math.max(16, (stage.count / maxCount) * 100);
              const conversionRate = stage.conversionToNext
                ? (stage.conversionToNext.rate * 100).toFixed(1)
                : null;
              return (
                <Box key={stage.stage} sx={{ mb: 1.5 }}>
                  <Tooltip
                    arrow
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                          Breakdown
                        </Typography>
                        {(stage.topSources || []).slice(0, 2).map((item) => (
                          <Typography key={`${stage.stage}-source-${item.source}`} variant="caption" sx={{ display: 'block' }}>
                            Source: {item.source} ({item.count})
                          </Typography>
                        ))}
                        {(stage.topOwners || []).slice(0, 2).map((item) => (
                          <Typography key={`${stage.stage}-owner-${item.ownerName}`} variant="caption" sx={{ display: 'block' }}>
                            Owner: {item.ownerName} ({item.count})
                          </Typography>
                        ))}
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.9 }}>
                          Clique para drill-down
                        </Typography>
                      </Box>
                    }
                  >
                    <Button
                      onClick={() => handleDrillDown(stage)}
                      sx={{
                        width: `${widthPercentage}%`,
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        color: '#fff',
                        backgroundColor: stageColors[stage.stage],
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: stageColors[stage.stage],
                          filter: 'brightness(1.08)',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {stageLabels[stage.stage]}
                        </Typography>
                        <Typography variant="body2">
                          {stage.count.toLocaleString('pt-BR')} contatos ({stage.percentage.toFixed(1)}%)
                        </Typography>
                        <Typography variant="caption">Avg Time: {stage.avgDaysInStage} dias</Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                  {stage.conversionToNext && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.4,
                        ml: 1,
                        display: 'block',
                        color: stage.conversionToNext.rate < 0.3 ? 'error.main' : 'text.secondary',
                        fontWeight: stage.conversionToNext.rate < 0.3 ? 700 : 500,
                      }}
                    >
                      ↓ {conversionRate}% conversion ({stage.conversionToNext.avgDays} dias médios)
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Paper>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                💡 Insights
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {funnel.insights.map((insight) => (
                  <Chip
                    key={insight.message}
                    label={insight.message}
                    color={
                      insight.type === 'bottleneck'
                        ? 'error'
                        : insight.type === 'warning'
                        ? 'warning'
                        : 'success'
                    }
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={2400}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Drawer
        anchor="right"
        open={Boolean(drillDownStage)}
        onClose={() => setDrillDownStage(null)}
        PaperProps={{ sx: { width: { xs: '100%', md: 500 }, p: 2 } }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Drill-down • {drillDownStage ? stageLabels[drillDownStage.stage] : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {drillDownStage
            ? `${drillDownStage.count.toLocaleString('pt-BR')} registros no estágio`
            : ''}
        </Typography>

        {drillLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : drillDownStage &&
          (drillDownStage.stage === 'subscriber' ||
            drillDownStage.stage === 'lead' ||
            drillDownStage.stage === 'mql') ? (
          <Box>
            {drillLeads.length === 0 ? (
              <Alert severity="info">Nenhum lead encontrado para este estágio.</Alert>
            ) : (
              <Stack spacing={1}>
                {drillLeads.slice(0, 20).map((lead) => (
                  <Paper key={lead.id} variant="outlined" sx={{ p: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {lead.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.email} • Score {lead.leadScore}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        ) : (
          <Box>
            {drillContacts.length === 0 ? (
              <Alert severity="info">Nenhum contato encontrado para este estágio.</Alert>
            ) : (
              <Stack spacing={1}>
                {drillContacts.slice(0, 20).map((contact) => (
                  <Paper key={contact.id} variant="outlined" sx={{ p: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {contact.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contact.email} • Score {contact.leadScore}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default LifecycleFunnelPage;
