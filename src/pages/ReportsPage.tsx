import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  BubbleChart as ScatterIcon,
  Assessment as DefaultChartIcon,
  Search as SearchIcon,
  PlayArrow as RunIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  FileDownload as ExportIcon,
  Bookmark as SavedIcon,
  ContentCopy as TemplateIcon,
  AccessTime as ClockIcon,
  TableRows as RowsIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { ReportDefinition, ReportRunResult } from '../types';

// ── Config visual ──────────────────────────────────────────────────────────────

const CATEGORY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  sales:     { label: 'Sales',     color: '#2563EB', bg: 'rgba(37,99,235,0.1)'  },
  marketing: { label: 'Marketing', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  abm:       { label: 'ABM',       color: '#D97706', bg: 'rgba(217,119,6,0.1)'  },
  custom:    { label: 'Custom',    color: '#16A34A', bg: 'rgba(22,163,74,0.1)'  },
};
const catCfg = (cat: string) =>
  CATEGORY_CFG[cat] ?? { label: cat, color: '#64748B', bg: 'rgba(100,116,139,0.1)' };

const VIZ_ICONS: Record<string, React.ReactNode> = {
  bar:     <BarChartIcon sx={{ fontSize: 15 }} />,
  line:    <LineChartIcon sx={{ fontSize: 15 }} />,
  table:   <TableChartIcon sx={{ fontSize: 15 }} />,
  pie:     <PieChartIcon sx={{ fontSize: 15 }} />,
  scatter: <ScatterIcon sx={{ fontSize: 15 }} />,
  both:    <BarChartIcon sx={{ fontSize: 15 }} />,
};
const vizIcon = (viz?: string) => VIZ_ICONS[viz ?? ''] ?? <DefaultChartIcon sx={{ fontSize: 15 }} />;
const vizLabel = (viz?: string): string =>
  ({ bar: 'Barras', line: 'Linha', table: 'Tabela', pie: 'Pizza', scatter: 'Dispersão', both: 'Multi' }[viz ?? ''] ?? viz ?? '—');

const SOURCE_CFG: Record<string, { color: string }> = {
  deals:    { color: '#7C3AED' },
  leads:    { color: '#2563EB' },
  contacts: { color: '#16A34A' },
  accounts: { color: '#D97706' },
  pipeline: { color: '#0891B2' },
};
const srcColor = (src?: string) => SOURCE_CFG[src ?? '']?.color ?? '#64748B';

// ── Subcomponents ──────────────────────────────────────────────────────────────

interface ReportCardProps {
  item: ReportDefinition;
  type: 'template' | 'saved';
  onRun: () => void;
  onEdit: () => void;
  running?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ item, type, onRun, onEdit, running }) => {
  const cc = catCfg(item.category);
  const sc = srcColor(item.dataSource);
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        transition: 'all 0.15s',
        '&:hover': { boxShadow: 2, borderColor: cc.color },
        borderLeft: `3px solid ${cc.color}`,
      }}
    >
      {/* Top row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.8 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.3 }}>
            {item.name}
          </Typography>
          {item.description && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
              {item.description}
            </Typography>
          )}
        </Box>
        <Chip
          label={cc.label}
          size="small"
          sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: cc.bg, color: cc.color, border: 'none', ml: 1, flexShrink: 0 }}
        />
      </Box>

      {/* Meta badges */}
      <Box sx={{ display: 'flex', gap: 0.6, mb: 1.2, flexWrap: 'wrap', alignItems: 'center' }}>
        {item.dataSource && (
          <Chip
            label={item.dataSource}
            size="small"
            sx={{ height: 18, fontSize: 10, fontWeight: 600, bgcolor: `${sc}15`, color: sc, border: 'none' }}
          />
        )}
        {item.visualization && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.secondary' }}>
            {vizIcon(item.visualization)}
            <Typography variant="caption" sx={{ fontSize: 10 }}>{vizLabel(item.visualization)}</Typography>
          </Box>
        )}
        {type === 'saved' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.disabled', ml: 'auto' }}>
            <SavedIcon sx={{ fontSize: 11 }} />
            <Typography variant="caption" sx={{ fontSize: 10 }}>Salvo</Typography>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.8 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={running ? <CircularProgress size={11} color="inherit" /> : <RunIcon sx={{ fontSize: 14 }} />}
          disabled={running}
          onClick={onRun}
          sx={{ height: 28, fontSize: 11, fontWeight: 700, px: 1.5 }}
        >
          {running ? 'Executando…' : 'Executar'}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon sx={{ fontSize: 13 }} />}
          onClick={onEdit}
          sx={{ height: 28, fontSize: 11, px: 1.2 }}
        >
          {type === 'template' ? 'Personalizar' : 'Editar'}
        </Button>
      </Box>
    </Paper>
  );
};

// ── Preview Table ──────────────────────────────────────────────────────────────

const PreviewTable: React.FC<{ result: ReportRunResult }> = ({ result }) => {
  const columns = useMemo(
    () => (result.rows.length > 0 ? Object.keys(result.rows[0]) : []),
    [result.rows]
  );

  if (columns.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
        Resultado sem dados para exibir.
      </Typography>
    );
  }

  const formatCell = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') return value.toLocaleString('pt-BR');
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    return String(value);
  };

  return (
    <TableContainer sx={{ maxHeight: 340 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  bgcolor: 'action.hover',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.replace(/_/g, ' ')}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {result.rows.map((row, i) => (
            <TableRow key={i} hover>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontSize: 12, py: 0.8 }}>
                  {formatCell((row as Record<string, unknown>)[col])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ReportDefinition[]>([]);
  const [reports, setReports] = useState<ReportDefinition[]>([]);
  const [preview, setPreview] = useState<ReportRunResult | null>(null);
  const [previewName, setPreviewName] = useState<string>('');
  const [category, setCategory] = useState<'all' | ReportDefinition['category']>('all');
  const [search, setSearch] = useState('');
  const [runningId, setRunningId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesRes, listRes] = await Promise.all([
        mockApi.reports.templates(),
        mockApi.reports.list(),
      ]);
      setTemplates(templatesRes.data || []);
      setReports(listRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filterItems = (items: ReportDefinition[]) => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = category === 'all' || item.category === category;
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  };

  const filteredTemplates = useMemo(() => filterItems(templates), [templates, category, search]);
  const filteredReports   = useMemo(() => filterItems(reports),   [reports,   category, search]);

  const runReport = async (item: ReportDefinition) => {
    try {
      setRunningId(item.id);
      const result = await mockApi.reports.run(item.id);
      setPreview(result.data || null);
      setPreviewName(item.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao executar relatório');
    } finally {
      setRunningId(null);
    }
  };

  const CATEGORIES: Array<{ key: 'all' | ReportDefinition['category']; label: string }> = [
    { key: 'all',       label: 'Todos' },
    { key: 'sales',     label: 'Sales' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'abm',       label: 'ABM' },
    { key: 'custom',    label: 'Custom' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Reports & BI</Typography>
          <Typography variant="body2" color="text.secondary">
            Inteligência de dados — execute templates, acesse relatórios salvos e exporte resultados.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/reports/new')}>
          Novo Relatório
        </Button>
      </Box>

      {/* ── Stats Strip ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          {
            icon: <TemplateIcon sx={{ fontSize: 16 }} />,
            label: 'Templates',
            value: templates.length,
            color: '#7C3AED',
            onClick: undefined,
          },
          {
            icon: <SavedIcon sx={{ fontSize: 16 }} />,
            label: 'Relatórios salvos',
            value: reports.length,
            color: '#2563EB',
            onClick: undefined,
          },
          {
            icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
            label: 'Agendados',
            value: '→',
            color: '#D97706',
            onClick: () => navigate('/reports/scheduled'),
          },
          {
            icon: <ExportIcon sx={{ fontSize: 16 }} />,
            label: 'Exportações',
            value: '→',
            color: '#16A34A',
            onClick: () => navigate('/exports'),
          },
        ].map((kpi) => (
          <Paper
            key={kpi.label}
            variant="outlined"
            onClick={kpi.onClick}
            sx={{
              px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1,
              cursor: kpi.onClick ? 'pointer' : 'default',
              '&:hover': kpi.onClick ? { boxShadow: 1, borderColor: kpi.color } : {},
              transition: 'all 0.15s',
            }}
          >
            <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1 }}>{kpi.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: kpi.color, lineHeight: 1.2 }}>{kpi.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Filtros: categorias + busca ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(({ key, label }) => {
            const active = category === key;
            const cfg = key !== 'all' ? catCfg(key) : null;
            return (
              <Chip
                key={key}
                label={label}
                size="small"
                onClick={() => setCategory(key)}
                sx={{
                  cursor: 'pointer',
                  height: 26,
                  fontWeight: 700,
                  fontSize: 11,
                  bgcolor: active ? (cfg ? cfg.bg : 'action.selected') : 'transparent',
                  color: active ? (cfg ? cfg.color : 'text.primary') : 'text.secondary',
                  border: '1px solid',
                  borderColor: active ? (cfg ? cfg.color : 'divider') : 'divider',
                }}
              />
            );
          })}
        </Box>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextField
            size="small"
            placeholder="Buscar relatório…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ── Grid principal: Templates | Salvos ── */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
              mb: 3,
              alignItems: 'start',
            }}
          >
            {/* Templates */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TemplateIcon sx={{ fontSize: 16, color: '#7C3AED' }} />
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1 }}>
                  Templates
                </Typography>
                <Chip label={filteredTemplates.length} size="small"
                  sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: 'rgba(124,58,237,0.1)', color: '#7C3AED', border: 'none' }} />
              </Box>
              <Stack spacing={1.5}>
                {filteredTemplates.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'Nenhum template encontrado para esta busca.' : 'Nenhum template disponível.'}
                    </Typography>
                  </Paper>
                ) : (
                  filteredTemplates.map((item) => (
                    <ReportCard
                      key={item.id}
                      item={item}
                      type="template"
                      running={runningId === item.id}
                      onRun={() => runReport(item)}
                      onEdit={() => navigate(`/reports/${item.id}`)}
                    />
                  ))
                )}
              </Stack>
            </Box>

            {/* Relatórios Salvos */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SavedIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1 }}>
                  Relatórios Salvos
                </Typography>
                <Chip label={filteredReports.length} size="small"
                  sx={{ height: 18, fontSize: 10, fontWeight: 700, bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', border: 'none' }} />
              </Box>
              <Stack spacing={1.5}>
                {filteredReports.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 36, mb: 1 }}>📊</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {search ? 'Nenhum relatório encontrado.' : 'Nenhum relatório salvo ainda.'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      {!search && 'Personalize um template e salve para acesso rápido.'}
                    </Typography>
                    {!search && (
                      <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/reports/new')}>
                        Criar relatório
                      </Button>
                    )}
                  </Paper>
                ) : (
                  filteredReports.map((item) => (
                    <ReportCard
                      key={item.id}
                      item={item}
                      type="saved"
                      running={runningId === item.id}
                      onRun={() => runReport(item)}
                      onEdit={() => navigate(`/reports/${item.id}`)}
                    />
                  ))
                )}
              </Stack>
            </Box>
          </Box>

          {/* ── Resultado da execução ── */}
          <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
            {/* Header do painel */}
            <Box sx={{
              px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5,
              borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover',
            }}>
              <DefaultChartIcon sx={{ fontSize: 18, color: preview ? '#7C3AED' : 'text.disabled' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {preview ? previewName : 'Resultado da execução'}
                </Typography>
                {preview && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.secondary' }}>
                      <ClockIcon sx={{ fontSize: 12 }} />
                      <Typography variant="caption" sx={{ fontSize: 11 }}>
                        {new Date(preview.generatedAt).toLocaleString('pt-BR')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: 'text.secondary' }}>
                      <RowsIcon sx={{ fontSize: 12 }} />
                      <Typography variant="caption" sx={{ fontSize: 11 }}>
                        {preview.rows.length} {preview.rows.length === 1 ? 'linha' : 'linhas'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              {preview && (
                <Tooltip title="Exportar resultado">
                  <IconButton size="small" onClick={() => {}}>
                    <ExportIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Corpo do preview */}
            <Box sx={{ p: preview ? 0 : 4, textAlign: preview ? 'left' : 'center' }}>
              {!preview ? (
                <>
                  <Typography sx={{ fontSize: 40, mb: 1 }}>📈</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Nenhuma execução ainda</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clique em "Executar" em qualquer template ou relatório salvo.
                  </Typography>
                </>
              ) : (
                <PreviewTable result={preview} />
              )}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ReportsPage;
