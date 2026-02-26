import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import type { Lead } from '../types';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ScoreFactor {
  label: string;
  score: number;       // 0-100
  weight: number;      // peso relativo
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface AIInsight {
  type: 'opportunity' | 'risk' | 'action';
  text: string;
}

// ── Funções de cálculo (simulam um modelo de ML) ───────────────────────────────

function deriveFactors(lead: Lead): ScoreFactor[] {
  const score = lead.leadScore ?? 50;

  return [
    {
      label: 'Engajamento',
      score: Math.min(100, score + (lead.email ? 15 : -10)),
      weight: 0.25,
      trend: score > 60 ? 'up' : 'stable',
      insight: score > 60 ? 'Alta interação recente com conteúdos' : 'Pouca atividade nos últimos 7 dias',
    },
    {
      label: 'Fit de Empresa',
      score: Math.min(100, score + (lead.company ? 20 : -15)),
      weight: 0.20,
      trend: lead.company ? 'up' : 'down',
      insight: lead.company ? `${lead.company} é o perfil-alvo` : 'Empresa não identificada — qualifique antes',
    },
    {
      label: 'Intenção',
      score: Math.min(100, Math.max(10, score - 5 + (lead.source === 'website' ? 20 : lead.source === 'referral' ? 15 : 0))),
      weight: 0.25,
      trend: ['website', 'referral'].includes(lead.source ?? '') ? 'up' : 'stable',
      insight: lead.source === 'website' ? 'Visitou página de preços 3x' : lead.source === 'referral' ? 'Indicação qualificada' : 'Sinal de intenção não detectado',
    },
    {
      label: 'Recência',
      score: Math.min(100, score + (lead.createdAt ? 25 : 0)),
      weight: 0.15,
      trend: 'stable',
      insight: 'Captado nos últimos 30 dias — janela de oportunidade aberta',
    },
    {
      label: 'Histórico',
      score: Math.min(100, Math.max(10, score - 10)),
      weight: 0.15,
      trend: 'stable',
      insight: 'Sem histórico de negócios anteriores',
    },
  ];
}

function deriveInsights(lead: Lead, factors: ScoreFactor[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const score = lead.leadScore ?? 50;
  const topFactor = [...factors].sort((a, b) => b.score - a.score)[0];
  const weakFactor = [...factors].sort((a, b) => a.score - b.score)[0];

  if (score >= 70) {
    insights.push({ type: 'opportunity', text: 'Lead quente: agende demo nos próximos 48h para maximizar conversão.' });
  } else if (score >= 40) {
    insights.push({ type: 'action', text: 'Envie case study relevante para elevar intenção de compra.' });
  } else {
    insights.push({ type: 'risk', text: 'Lead frio: qualifique por email antes de investir tempo de SDR.' });
  }

  if (topFactor.score >= 75) {
    insights.push({ type: 'opportunity', text: `Ponto forte: "${topFactor.label}" com ${topFactor.score}pts — use como abertura da conversa.` });
  }

  if (weakFactor.score < 40) {
    insights.push({ type: 'risk', text: `Gargalo: "${weakFactor.label}" com ${weakFactor.score}pts — risco de churn no funil.` });
  }

  if (!lead.email) {
    insights.push({ type: 'action', text: 'E-mail não capturado — adicione para habilitar sequências de nurture.' });
  }

  return insights.slice(0, 4);
}

function compositeScore(factors: ScoreFactor[]): number {
  return Math.round(factors.reduce((sum, f) => sum + f.score * f.weight, 0));
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? '#16A34A' : score >= 40 ? '#D97706' : '#DC2626';
  const label = score >= 70 ? 'Quente 🔥' : score >= 40 ? 'Morno ⚡' : 'Frio ❄️';

  return (
    <Box sx={{ textAlign: 'center', py: 1 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: '50%',
          border: `6px solid ${color}`,
          bgcolor: `${color}12`,
          mb: 1,
          position: 'relative',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
            {score}
          </Typography>
          <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
            / 100
          </Typography>
        </Box>
      </Box>
      <Chip label={label} size="small" sx={{ bgcolor: `${color}20`, color, fontWeight: 700, border: `1px solid ${color}40` }} />
    </Box>
  );
};

const InsightItem: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const config = {
    opportunity: { color: '#16A34A', bg: '#F0FDF4', icon: <CheckIcon sx={{ fontSize: 14 }} /> },
    risk:        { color: '#DC2626', bg: '#FEF2F2', icon: <WarningIcon sx={{ fontSize: 14 }} /> },
    action:      { color: '#2563EB', bg: '#EFF6FF', icon: <ScheduleIcon sx={{ fontSize: 14 }} /> },
  }[insight.type];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 1.2,
        borderRadius: 2,
        bgcolor: config.bg,
        border: `1px solid ${config.color}25`,
      }}
    >
      <Box sx={{ color: config.color, mt: 0.1, flexShrink: 0 }}>{config.icon}</Box>
      <Typography variant="caption" sx={{ color: config.color, lineHeight: 1.5, fontWeight: 500 }}>
        {insight.text}
      </Typography>
    </Box>
  );
};

// ── Componente principal ───────────────────────────────────────────────────────

interface AILeadInsightsProps {
  lead: Lead;
}

const AILeadInsights: React.FC<AILeadInsightsProps> = ({ lead }) => {
  const factors = useMemo(() => deriveFactors(lead), [lead]);
  const insights = useMemo(() => deriveInsights(lead, factors), [lead, factors]);
  const score = useMemo(() => compositeScore(factors), [factors]);

  const radarData = factors.map((f) => ({ subject: f.label, score: f.score, fullMark: 100 }));

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AIIcon sx={{ color: '#7C3AED', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            AI Lead Score
          </Typography>
          <Chip
            label="IA"
            size="small"
            sx={{ fontSize: 10, height: 18, bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 700 }}
          />
        </Box>

        {/* Score + Radar lado a lado */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <ScoreGauge score={score} />
          <Box sx={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B' }} />
                <RechartsTooltip formatter={(v: number) => [`${v}pts`, 'Score']} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.18}
                  dot={{ r: 3, fill: '#7C3AED' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Fatores detalhados */}
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8, mb: 1, display: 'block' }}>
          Fatores de Score
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {factors.map((f) => {
            const color = f.score >= 70 ? '#16A34A' : f.score >= 40 ? '#D97706' : '#DC2626';
            return (
              <Tooltip key={f.label} title={f.insight} placement="right">
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {f.label}
                      </Typography>
                      {f.trend === 'up' && <TrendingUpIcon sx={{ fontSize: 12, color: '#16A34A' }} />}
                      {f.trend === 'down' && <TrendingDownIcon sx={{ fontSize: 12, color: '#DC2626' }} />}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color }}>
                      {f.score}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={f.score}
                    sx={{
                      height: 5,
                      borderRadius: 99,
                      bgcolor: `${color}18`,
                      '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 99 },
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Insights */}
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8, mb: 1, display: 'block' }}>
          Recomendações da IA
        </Typography>
        <Stack spacing={0.8}>
          {insights.map((ins, i) => (
            <InsightItem key={i} insight={ins} />
          ))}
        </Stack>

        <Typography variant="caption" color="text.disabled" sx={{ mt: 1.5, display: 'block', textAlign: 'right' }}>
          Atualizado por IA • agora
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AILeadInsights;
