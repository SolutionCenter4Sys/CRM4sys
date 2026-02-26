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
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  PauseCircle as PauseCircleIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Project, Milestone, MilestoneStatus, ProjectHealthColor } from '../types';

const healthConfig: Record<ProjectHealthColor, { label: string; color: string }> = {
  green: { label: 'No Prazo', color: '#16A34A' },
  yellow: { label: 'Atenção', color: '#F59E0B' },
  red: { label: 'Atrasado', color: '#DC2626' },
};

const milestoneIcon: Record<MilestoneStatus, React.ReactNode> = {
  completed: <CheckCircleIcon fontSize="small" sx={{ color: '#16A34A' }} />,
  in_progress: <ScheduleIcon fontSize="small" sx={{ color: '#2563EB' }} />,
  delayed: <WarningIcon fontSize="small" sx={{ color: '#DC2626' }} />,
  pending: <PauseCircleIcon fontSize="small" sx={{ color: '#94A3B8' }} />,
};

const milestoneColor: Record<MilestoneStatus, string> = {
  completed: '#16A34A',
  in_progress: '#2563EB',
  delayed: '#DC2626',
  pending: '#94A3B8',
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await mockApi.projects.get(id);
        setProject(res.data || null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!project) return <Box sx={{ p: 3 }}><Alert severity="warning">Projeto não encontrado.</Alert><Button sx={{ mt: 2 }} onClick={() => navigate('/projects')}>Voltar</Button></Box>;

  const hc = healthConfig[project.health];
  const completedMs = project.milestones.filter((m) => m.status === 'completed').length;
  const totalMs = project.milestones.length;
  const overallProgress = totalMs > 0 ? (completedMs / totalMs) * 100 : 0;
  const budgetPct = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const daysTotal = Math.ceil((new Date(project.targetEndDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((Date.now() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, daysTotal - daysElapsed);
  const timePct = daysTotal > 0 ? Math.min(100, (daysElapsed / daysTotal) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} size="small" sx={{ mb: 1 }}>
        Projetos
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{project.name}</Typography>
            <Chip label={project.status === 'in_progress' ? 'Em Andamento' : project.status === 'completed' ? 'Concluído' : project.status === 'on_hold' ? 'Pausado' : project.status} color={project.status === 'in_progress' ? 'success' : project.status === 'on_hold' ? 'warning' : 'default'} />
            <Chip label={`${hc.label}`} sx={{ bgcolor: `${hc.color}15`, color: hc.color, fontWeight: 600 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {project.code} · {project.accountName} · Owner: {project.ownerName} · {project.methodology.toUpperCase()} · {project.teamSize} pessoas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{project.description}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<OpenInNewIcon />} onClick={() => navigate(`/accounts/${project.accountId}`)}>Ver Conta</Button>
      </Stack>

      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 3 }}>
        <SummaryCard label="Progresso" value={`${overallProgress.toFixed(0)}%`} subtitle={`${completedMs}/${totalMs} milestones`} color={hc.color} />
        <SummaryCard label="Budget" value={`R$ ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k`} subtitle={`${budgetPct.toFixed(0)}% consumido`} color={budgetPct > 90 ? '#DC2626' : budgetPct > 75 ? '#F59E0B' : '#16A34A'} />
        <SummaryCard label="Prazo" value={`${daysRemaining} dias restantes`} subtitle={`${timePct.toFixed(0)}% do tempo`} color={timePct > overallProgress + 15 ? '#DC2626' : '#16A34A'} />
        {project.velocityAvg !== undefined && (
          <SummaryCard label="Velocidade" value={`${project.velocityAvg} pts/sprint`} subtitle={project.currentSprint ? `Sprint ${project.currentSprint}/${project.sprintCount}` : ''} />
        )}
      </Box>

      {/* Timeline / progress bars */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Progresso vs Tempo</Typography>
            <Stack spacing={1}>
              <BarRow label="Milestones" value={overallProgress} color={hc.color} />
              <BarRow label="Tempo decorrido" value={timePct} color={timePct > overallProgress + 15 ? '#DC2626' : '#94A3B8'} />
              <BarRow label="Budget consumido" value={budgetPct} color={budgetPct > 90 ? '#DC2626' : budgetPct > 75 ? '#F59E0B' : '#7C3AED'} />
            </Stack>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Info do Projeto</Typography>
            <Stack spacing={0.5}>
              <InfoLine label="Início" value={new Date(project.startDate).toLocaleDateString('pt-BR')} />
              <InfoLine label="Prazo" value={new Date(project.targetEndDate).toLocaleDateString('pt-BR')} />
              {project.actualEndDate && <InfoLine label="Encerrado" value={new Date(project.actualEndDate).toLocaleDateString('pt-BR')} />}
              <InfoLine label="Metodologia" value={project.methodology.toUpperCase()} />
              <InfoLine label="Time" value={`${project.teamSize} pessoas`} />
              {project.contractId && <InfoLine label="Contrato" value={project.contractId} />}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Milestones */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Milestones</Typography>
      <Stack spacing={1.5}>
        {project.milestones.sort((a, b) => a.order - b.order).map((ms) => (
          <MilestoneCard key={ms.id} milestone={ms} />
        ))}
      </Stack>

      {project.tags.length > 0 && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 3 }} flexWrap="wrap">
          {project.tags.map((t) => <Chip key={t} size="small" label={t} variant="outlined" />)}
        </Stack>
      )}
    </Box>
  );
};

const SummaryCard: React.FC<{ label: string; value: string; subtitle?: string; color?: string }> = ({ label, value, subtitle, color }) => (
  <Card variant="outlined">
    <CardContent sx={{ pb: '12px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: color || 'text.primary' }}>{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </CardContent>
  </Card>
);

const BarRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>{value.toFixed(0)}%</Typography>
    </Stack>
    <LinearProgress variant="determinate" value={Math.min(100, value)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
  </Box>
);

const InfoLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="caption" sx={{ fontWeight: 600 }}>{value}</Typography>
  </Stack>
);

const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone: ms }) => (
  <Card variant="outlined" sx={{ borderLeft: `4px solid ${milestoneColor[ms.status]}` }}>
    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          {milestoneIcon[ms.status]}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{ms.name}</Typography>
            {ms.description && <Typography variant="caption" color="text.secondary">{ms.description}</Typography>}
          </Box>
        </Stack>
        <Stack alignItems="flex-end">
          <Tooltip title={ms.completedDate ? `Concluído: ${new Date(ms.completedDate).toLocaleDateString('pt-BR')}` : `Prazo: ${new Date(ms.dueDate).toLocaleDateString('pt-BR')}`}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: ms.status === 'delayed' ? '#DC2626' : 'text.secondary' }}>
              {new Date(ms.dueDate).toLocaleDateString('pt-BR')}
            </Typography>
          </Tooltip>
          <Typography variant="caption" sx={{ fontWeight: 700, color: milestoneColor[ms.status] }}>{ms.completionPercent}%</Typography>
        </Stack>
      </Stack>
      <LinearProgress variant="determinate" value={ms.completionPercent} sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: milestoneColor[ms.status], borderRadius: 3 } }} />
      {ms.deliverables.length > 0 && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} flexWrap="wrap">
          {ms.deliverables.map((d) => <Chip key={d} size="small" label={d} variant="outlined" sx={{ fontSize: '0.65rem' }} />)}
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default ProjectDetailPage;
