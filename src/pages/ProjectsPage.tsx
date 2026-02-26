import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
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
import { Search as SearchIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Project, ProjectFilters, ProjectSummaryKpis, ProjectStatus, ProjectHealthColor } from '../types';

const statusConfig: Record<ProjectStatus, { label: string; color: 'default' | 'info' | 'success' | 'warning' | 'error' }> = {
  planning: { label: 'Planejamento', color: 'info' },
  in_progress: { label: 'Em Andamento', color: 'success' },
  on_hold: { label: 'Pausado', color: 'warning' },
  completed: { label: 'Concluído', color: 'default' },
  cancelled: { label: 'Cancelado', color: 'error' },
};

const healthConfig: Record<ProjectHealthColor, { label: string; color: string; emoji: string }> = {
  green: { label: 'No Prazo', color: '#16A34A', emoji: '🟢' },
  yellow: { label: 'Atenção', color: '#F59E0B', emoji: '🟡' },
  red: { label: 'Atrasado', color: '#DC2626', emoji: '🔴' },
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [kpis, setKpis] = useState<ProjectSummaryKpis | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({});

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsRes, kpisRes] = await Promise.all([
        mockApi.projects.list(filters),
        mockApi.projects.getKpis(),
      ]);
      setProjects(projectsRes.data || []);
      setKpis(kpisRes.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters.status, filters.health]);
  useEffect(() => {
    const timer = window.setTimeout(() => load(), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Projetos & Delivery</Typography>
        <Typography variant="body2" color="text.secondary">
          Acompanhamento de projetos, milestones e saúde do delivery.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {loading || !kpis ? (
        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1.5, mb: 2 }}>
            <KpiCard label="Projetos Ativos" value={String(kpis.activeProjects)} subtitle={`de ${kpis.totalProjects} total`} />
            <KpiCard label="No Prazo" value={String(kpis.onTrack)} color="#16A34A" />
            <KpiCard label="Atenção" value={String(kpis.atRisk)} color="#F59E0B" />
            <KpiCard label="Atrasados" value={String(kpis.delayed)} color="#DC2626" />
            <KpiCard label="Budget Consumido" value={`${((kpis.totalSpent / kpis.totalBudget) * 100).toFixed(0)}%`} subtitle={`R$ ${(kpis.totalSpent / 1000).toFixed(0)}k de ${(kpis.totalBudget / 1000).toFixed(0)}k`} />
          </Box>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField size="small" placeholder="Buscar projeto..." value={filters.search || ''} onChange={(e) => updateFilter('search', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ minWidth: 240 }} />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select value={filters.status || ''} label="Status" onChange={(e) => updateFilter('status', e.target.value as ProjectFilters['status'])}>
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(statusConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Saúde</InputLabel>
                <Select value={filters.health || ''} label="Saúde" onChange={(e) => updateFilter('health', e.target.value as ProjectFilters['health'])}>
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(healthConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.emoji} {v.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            {projects.map((project) => {
              const sc = statusConfig[project.status];
              const hc = healthConfig[project.health];
              const completedMs = project.milestones.filter((m) => m.status === 'completed').length;
              const totalMs = project.milestones.length;
              const progress = totalMs > 0 ? (completedMs / totalMs) * 100 : 0;
              const budgetPct = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

              return (
                <Card key={project.id} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }, borderLeft: `4px solid ${hc.color}` }} onClick={() => navigate(`/projects/${project.id}`)}>
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{project.name}</Typography>
                          <Chip size="small" label={sc.label} color={sc.color} />
                          <Chip size="small" label={`${hc.emoji} ${hc.label}`} sx={{ bgcolor: `${hc.color}15`, color: hc.color, fontWeight: 600 }} />
                          <Chip size="small" label={project.methodology.toUpperCase()} variant="outlined" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {project.code} · {project.accountName} · Owner: {project.ownerName} · {project.teamSize} pessoas
                        </Typography>
                      </Box>
                      <Stack alignItems="flex-end" sx={{ minWidth: 140 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          R$ {(project.budget / 1000).toFixed(0)}k
                        </Typography>
                        <Typography variant="caption" color={budgetPct > 85 ? 'error.main' : 'text.secondary'}>
                          {budgetPct.toFixed(0)}% consumido
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box sx={{ mt: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Milestones: {completedMs}/{totalMs}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(project.startDate).toLocaleDateString('pt-BR')} → {new Date(project.targetEndDate).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: hc.color, borderRadius: 3 } }} />
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                      {project.milestones.map((ms) => (
                        <Tooltip key={ms.id} title={`${ms.name}: ${ms.completionPercent}% — ${ms.status}`}>
                          <Chip size="small" label={ms.name.length > 20 ? ms.name.substring(0, 20) + '...' : ms.name} color={ms.status === 'completed' ? 'success' : ms.status === 'delayed' ? 'error' : ms.status === 'in_progress' ? 'info' : 'default'} variant={ms.status === 'completed' ? 'filled' : 'outlined'} sx={{ fontSize: '0.65rem' }} />
                        </Tooltip>
                      ))}
                      {project.tags.map((t) => (
                        <Chip key={t} size="small" label={t} variant="outlined" sx={{ fontSize: '0.6rem', opacity: 0.7 }} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
            {projects.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Nenhum projeto encontrado.</Typography>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

const KpiCard: React.FC<{ label: string; value: string; subtitle?: string; color?: string }> = ({ label, value, subtitle, color }) => (
  <Card variant="outlined">
    <CardContent sx={{ pb: '12px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: color || 'text.primary' }}>{value}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </CardContent>
  </Card>
);

export default ProjectsPage;
