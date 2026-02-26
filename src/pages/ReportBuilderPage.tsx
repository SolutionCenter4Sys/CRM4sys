import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { ReportDefinition, ReportRunResult } from '../types';

const steps = ['Dados', 'Campos e filtros', 'Visualização', 'Preview e salvar'];

const dataSourceFields: Record<string, string[]> = {
  deals: ['title', 'owner', 'amount', 'status', 'stage'],
  leads: ['fullName', 'source', 'leadScore', 'status'],
  contacts: ['fullName', 'email', 'owner', 'lifecycleStage'],
  activities: ['type', 'subject', 'date'],
  accounts: ['name', 'industry', 'tier'],
};

const ReportBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReportRunResult | null>(null);
  const [form, setForm] = useState<Omit<ReportDefinition, 'createdAt' | 'updatedAt'>>({
    id: '',
    name: '',
    description: '',
    category: 'custom',
    dataSource: 'deals',
    filters: {},
    columns: ['title', 'owner', 'amount'],
    groupBy: 'owner',
    aggregations: [{ field: 'amount', fn: 'sum' }],
    visualization: 'table',
    isTemplate: false,
    isShared: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440001',
  });

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        setLoading(true);
        const response = await mockApi.reports.getById(id as string);
        if (response.data) {
          const { createdAt, updatedAt, ...base } = response.data;
          void createdAt;
          void updatedAt;
          setForm(base);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar relatório');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew]);

  const availableFields = useMemo(() => dataSourceFields[form.dataSource] || [], [form.dataSource]);

  const toggleColumn = (field: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      columns: checked ? [...new Set([...prev.columns, field])] : prev.columns.filter((item) => item !== field),
    }));
  };

  const runPreview = async () => {
    try {
      setError(null);
      if (isNew) {
        const saved = await mockApi.reports.save({ ...form, id: undefined });
        if (!saved.data) return;
        const result = await mockApi.reports.run(saved.data.id);
        setPreview(result.data || null);
        setForm((prev) => ({ ...prev, id: saved.data!.id }));
      } else {
        const result = await mockApi.reports.run(id as string);
        setPreview(result.data || null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao gerar preview');
    }
  };

  const saveReport = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = { ...form, id: isNew ? undefined : id };
      const response = await mockApi.reports.save(payload);
      if (response.data) navigate('/reports');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Report Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wizard para montar relatórios customizados com filtros e agregações.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/reports')}>
          Voltar
        </Button>
      </Box>

      <Stepper activeStep={step} sx={{ mb: 2 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Nome do relatório"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Descrição"
              value={form.description || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={form.category}
                  label="Categoria"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value as ReportDefinition['category'] }))
                  }
                >
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="abm">ABM</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Fonte</InputLabel>
                <Select
                  value={form.dataSource}
                  label="Fonte"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, dataSource: event.target.value as ReportDefinition['dataSource'], columns: [] }))
                  }
                >
                  <MenuItem value="deals">Deals</MenuItem>
                  <MenuItem value="leads">Leads</MenuItem>
                  <MenuItem value="contacts">Contacts</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                  <MenuItem value="accounts">Accounts</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Visualização</InputLabel>
                <Select
                  value={form.visualization}
                  label="Visualização"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, visualization: event.target.value as ReportDefinition['visualization'] }))
                  }
                >
                  <MenuItem value="table">Table</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="pie">Pie</MenuItem>
                  <MenuItem value="funnel">Funnel</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Typography variant="subtitle2">Campos</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {availableFields.map((field) => (
                <Button
                  key={field}
                  variant={form.columns.includes(field) ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => toggleColumn(field, !form.columns.includes(field))}
                >
                  {field}
                </Button>
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Filtro data (de)"
                type="date"
                value={form.filters.dateFrom || ''}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, filters: { ...prev.filters, dateFrom: event.target.value || undefined } }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Filtro data (até)"
                type="date"
                value={form.filters.dateTo || ''}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, filters: { ...prev.filters, dateTo: event.target.value || undefined } }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Agrupar por"
                value={form.groupBy || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, groupBy: event.target.value || undefined }))}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Compartilhar com time</Typography>
              <Switch
                checked={Boolean(form.isShared)}
                onChange={(event) => setForm((prev) => ({ ...prev, isShared: event.target.checked }))}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setStep((prev) => Math.max(0, prev - 1))}>
                Voltar etapa
              </Button>
              <Button variant="outlined" onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}>
                Próxima etapa
              </Button>
              <Button variant="contained" onClick={runPreview}>
                Rodar preview
              </Button>
              <Button variant="contained" color="success" onClick={saveReport} disabled={saving || !form.name.trim()}>
                {saving ? 'Salvando...' : 'Salvar relatório'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {preview && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Preview ({preview.rows.length} linhas)
            </Typography>
            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(preview.rows.slice(0, 10), null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ReportBuilderPage;
