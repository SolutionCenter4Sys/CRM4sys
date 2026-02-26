import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type {
  AccountHealthScore,
  AccountHealthHistory,
  CsPlaybook,
  HealthScoreLevel,
  HealthSignal,
} from '../types';

const levelConfig: Record<
  HealthScoreLevel,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  healthy: { label: 'Saudável', color: '#16A34A', bgColor: '#DCFCE7', icon: <CheckCircleIcon sx={{ color: '#16A34A' }} /> },
  attention: { label: 'Atenção', color: '#F59E0B', bgColor: '#FEF3C7', icon: <InfoIcon sx={{ color: '#F59E0B' }} /> },
  at_risk: { label: 'Em Risco', color: '#DC2626', bgColor: '#FEE2E2', icon: <WarningIcon sx={{ color: '#DC2626' }} /> },
  critical: { label: 'Crítico', color: '#7F1D1D', bgColor: '#FCA5A5', icon: <ErrorIcon sx={{ color: '#7F1D1D' }} /> },
};

const AccountHealthDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<AccountHealthScore | null>(null);
  const [history, setHistory] = useState<AccountHealthHistory[]>([]);
  const [playbooks, setPlaybooks] = useState<CsPlaybook[]>([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [healthRes, historyRes, playbooksRes] = await Promise.all([
          mockApi.customerSuccess.getAccountHealth(id),
          mockApi.customerSuccess.getAccountHealthHistory(id),
          mockApi.customerSuccess.listPlaybooks(),
        ]);
        setHealth(healthRes.data || null);
        setHistory(historyRes.data || []);
        setPlaybooks(playbooksRes.data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!health) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Conta não encontrada.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/cs')}>
          Voltar
        </Button>
      </Box>
    );
  }

  const config = levelConfig[health.level];
  const applicablePlaybook = playbooks.find((pb) => pb.targetLevel === health.level && pb.isActive);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cs')} size="small">
          Customer Success
        </Button>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {health.accountName}
            </Typography>
            <Chip label={health.accountTier} variant="outlined" />
            <Chip
              icon={<>{config.icon}</>}
              label={config.label}
              sx={{ bgcolor: config.bgColor, color: config.color, fontWeight: 600 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Owner: {health.ownerName} · Atualizado em{' '}
            {new Date(health.lastUpdatedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={() => navigate(`/accounts/${health.accountId}`)}
        >
          Ver Conta
        </Button>
      </Stack>

      {/* Score + Summary */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '280px 1fr' },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ textAlign: 'center', borderLeft: `5px solid ${config.color}` }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Health Score
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: config.color,
                my: 1,
                fontSize: { xs: 'clamp(2rem, 12vw, 2.8rem)', md: '3.75rem' },
                lineHeight: 1.05,
              }}
            >
              {health.overallScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              de 100
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
              <InfoRow label="MRR" value={`R$ ${health.mrr.toLocaleString('pt-BR')}`} />
              <InfoRow label="Contrato até" value={new Date(health.contractEndDate).toLocaleDateString('pt-BR')} />
              <InfoRow
                label="Último contato"
                value={`${health.daysSinceLastContact} dias atrás`}
                alert={health.daysSinceLastContact > 14}
              />
              <InfoRow label="Tickets abertos" value={String(health.openTickets)} alert={health.openTickets > 3} />
              <InfoRow label="NPS" value={health.npsScore !== null ? String(health.npsScore) : 'N/A'} />
              <InfoRow label="CSAT" value={health.csatScore !== null ? `${health.csatScore}/5` : 'N/A'} />
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {/* Dimensions */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Dimensões do Health Score
              </Typography>
              <Stack spacing={2}>
                {health.dimensions.map((dim) => (
                  <Box key={dim.name}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dim.name}
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          (peso: {(dim.weight * 100).toFixed(0)}%)
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: dim.score >= 7 ? '#16A34A' : dim.score >= 5 ? '#F59E0B' : '#DC2626',
                        }}
                      >
                        {dim.score}/{dim.maxScore}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(dim.score / dim.maxScore) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        mb: 0.5,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: dim.score >= 7 ? '#16A34A' : dim.score >= 5 ? '#F59E0B' : '#DC2626',
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {dim.signals.map((signal) => (
                        <SignalChip key={signal.label} signal={signal} />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Risk Factors + Opportunities */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card variant="outlined" sx={{ borderColor: health.riskFactors.length > 0 ? '#FEE2E2' : undefined }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#DC2626' }}>
              Fatores de Risco ({health.riskFactors.length})
            </Typography>
            {health.riskFactors.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhum fator de risco identificado.
              </Typography>
            ) : (
              <Stack spacing={0.8}>
                {health.riskFactors.map((risk, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 1, bgcolor: '#FEF2F2' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WarningIcon fontSize="small" sx={{ color: '#DC2626' }} />
                      <Typography variant="body2">{risk}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderColor: health.opportunities.length > 0 ? '#DCFCE7' : undefined }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#16A34A' }}>
              Oportunidades ({health.opportunities.length})
            </Typography>
            {health.opportunities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma oportunidade identificada neste momento.
              </Typography>
            ) : (
              <Stack spacing={0.8}>
                {health.opportunities.map((opp, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 1, bgcolor: '#F0FDF4' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" sx={{ color: '#16A34A' }} />
                      <Typography variant="body2">{opp}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* History */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Histórico de Health Score (6 meses)
          </Typography>
          <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 120 }}>
            {history.map((h) => {
              const barHeight = Math.max((h.score / 100) * 100, 8);
              const barColor =
                h.score >= 75 ? '#16A34A' : h.score >= 50 ? '#F59E0B' : '#DC2626';
              return (
                <Tooltip
                  key={h.date}
                  title={`${h.date}: ${h.score}/100 (${levelConfig[h.level].label})${h.event ? ` — ${h.event}` : ''}`}
                >
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                      {h.score}
                    </Typography>
                    <Box
                      sx={{
                        height: barHeight,
                        bgcolor: barColor,
                        borderRadius: '4px 4px 0 0',
                        mx: 'auto',
                        width: '80%',
                        transition: 'height 0.3s',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                      {h.date.replace('2025-', '').replace('2026-', '')}
                    </Typography>
                    {h.event && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', fontSize: '0.55rem', lineHeight: 1.2 }}
                      >
                        {h.event}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Playbook */}
      {applicablePlaybook && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Playbook Recomendado: {applicablePlaybook.name}
            </Typography>
            <Stack spacing={1}>
              {applicablePlaybook.steps.map((step) => (
                <Paper key={step.order} variant="outlined" sx={{ p: 1.2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip size="small" label={`#${step.order}`} variant="outlined" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {step.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Responsável: {step.owner.toUpperCase()} · Prazo: {step.dueInDays} dias
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const InfoRow: React.FC<{ label: string; value: string; alert?: boolean }> = ({ label, value, alert }) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="caption" sx={{ fontWeight: 600, color: alert ? '#DC2626' : 'text.primary' }}>
      {value}
    </Typography>
  </Stack>
);

const SignalChip: React.FC<{ signal: HealthSignal }> = ({ signal }) => {
  const colorMap: Record<HealthSignal['status'], 'success' | 'warning' | 'default'> = {
    positive: 'success',
    neutral: 'default',
    negative: 'warning',
  };

  return (
    <Chip
      size="small"
      label={`${signal.label}: ${signal.value}`}
      color={colorMap[signal.status]}
      variant="outlined"
      sx={{ fontSize: '0.7rem' }}
    />
  );
};

export default AccountHealthDetailPage;
