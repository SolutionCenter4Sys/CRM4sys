import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon,
  PlayArrowOutlined as PlayArrowOutlinedIcon,
  SaveOutlined as SaveOutlinedIcon,
} from '@mui/icons-material';
import type { NurtureSequence, SequenceStep, SequenceTestRun } from '../types';
import { mockApi } from '../mock/api';

const stepTypeLabel: Record<SequenceStep['type'], string> = {
  email: 'Email',
  task: 'Task',
  wait: 'Wait',
};

const EMAIL_TEMPLATES: Array<{ id: string; name: string; preview: string }> = [
  {
    id: 'tpl-crm-guide',
    name: 'Guia de CRM',
    preview: 'Olá, {{firstName}}. Separamos um guia prático para acelerar seu funil comercial.',
  },
  {
    id: 'tpl-case-study',
    name: 'Case Study',
    preview: 'Veja como uma empresa semelhante aumentou em 37% as conversões com nosso playbook.',
  },
  {
    id: 'tpl-demo-offer',
    name: 'Convite para Demo',
    preview: 'Podemos mostrar uma demo de 20 minutos com foco no seu cenário atual.',
  },
];

const NurtureSequencesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [sequences, setSequences] = useState<NurtureSequence[]>([]);
  const [activeSequenceId, setActiveSequenceId] = useState<string>('');
  const [draft, setDraft] = useState<NurtureSequence | null>(null);
  const [testRuns, setTestRuns] = useState<SequenceTestRun[]>([]);

  const loadSequences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.nurtureSequences.list();
      const data = response.data || [];
      setSequences(data);
      const selectedId = activeSequenceId || data[0]?.id || '';
      setActiveSequenceId(selectedId);
      setDraft(data.find((item) => item.id === selectedId) || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar sequências');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSequences();
  }, []);

  const selectedSequence = useMemo(
    () => sequences.find((sequence) => sequence.id === activeSequenceId) || null,
    [sequences, activeSequenceId]
  );

  useEffect(() => {
    setDraft(selectedSequence);
  }, [selectedSequence]);

  const loadTestRuns = async (sequenceId: string) => {
    if (!sequenceId) {
      setTestRuns([]);
      return;
    }
    const response = await mockApi.nurtureSequences.listTestRuns(sequenceId);
    setTestRuns(response.data || []);
  };

  useEffect(() => {
    loadTestRuns(activeSequenceId);
  }, [activeSequenceId]);

  const upsertStep = (stepId: string, updater: (current: SequenceStep) => SequenceStep) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.map((step) => (step.id === stepId ? updater(step) : step)),
      };
    });
  };

  const addStep = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      const newStep: SequenceStep = {
        id: `${Date.now()}-step`,
        order: prev.steps.length + 1,
        type: 'email',
        delayDays: 3,
        delayHours: 0,
        emailSubject: 'Novo passo de nutrição',
      };
      return { ...prev, steps: [...prev.steps, newStep] };
    });
  };

  const removeStep = (stepId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: prev.steps.filter((step) => step.id !== stepId).map((step, idx) => ({ ...step, order: idx + 1 })),
      };
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      setError(null);
      await mockApi.nurtureSequences.save(draft);
      setToast({ open: true, message: 'Sequência salva com sucesso', severity: 'success' });
      await loadSequences();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar sequência');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await mockApi.nurtureSequences.create(`Nova sequência ${new Date().toLocaleTimeString('pt-BR')}`);
      if (response.data) {
        setActiveSequenceId(response.data.id);
      }
      setToast({ open: true, message: 'Sequência criada com sucesso', severity: 'success' });
      await loadSequences();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar sequência');
    }
  };

  const handleDelete = async () => {
    if (!draft) return;
    try {
      await mockApi.nurtureSequences.delete(draft.id);
      await loadSequences();
      setToast({ open: true, message: 'Sequência removida', severity: 'success' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao remover sequência');
    }
  };

  const handleTest = async () => {
    if (!draft) return;
    try {
      const response = await mockApi.nurtureSequences.testSequence(draft.id);
      setToast({
        open: true,
        message: response.message || 'Teste disparado',
        severity: 'info',
      });
      await loadTestRuns(draft.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao testar sequência');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            📧 Nurture Sequences
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Builder visual MVP para campanhas drip com passos e delays.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nova Sequência
        </Button>
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
      ) : (
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
          <Paper sx={{ width: { xs: '100%', lg: 320 }, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Sequências
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Sequência ativa</InputLabel>
              <Select
                value={activeSequenceId}
                label="Sequência ativa"
                onChange={(event) => setActiveSequenceId(event.target.value)}
              >
                {sequences.map((sequence) => (
                  <MenuItem key={sequence.id} value={sequence.id}>
                    {sequence.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {draft && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={draft.isActive ? 'Ativa' : 'Inativa'}
                  color={draft.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip label={`${draft.stats.enrollments} enrollments`} size="small" variant="outlined" />
              </Box>
            )}
          </Paper>

          <Box sx={{ flex: 1 }}>
            {!draft ? (
              <Paper sx={{ p: 4 }}>
                <Typography>Selecione uma sequência para editar.</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                <Paper sx={{ p: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                      size="small"
                      label="Nome da sequência"
                      value={draft.name}
                      fullWidth
                      onChange={(event) =>
                        setDraft((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                      }
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption">Ativa</Typography>
                      <Switch
                        checked={draft.isActive}
                        onChange={(event) =>
                          setDraft((prev) => (prev ? { ...prev, isActive: event.target.checked } : prev))
                        }
                      />
                    </Stack>
                    <Button startIcon={<SaveOutlinedIcon />} variant="contained" onClick={handleSave}>
                      Salvar
                    </Button>
                    <Button startIcon={<PlayArrowOutlinedIcon />} variant="outlined" onClick={handleTest}>
                      Test Sequence
                    </Button>
                    <Button color="error" variant="outlined" onClick={handleDelete}>
                      Excluir
                    </Button>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Workflow Builder
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={addStep}>
                      Adicionar Step
                    </Button>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1.5}>
                    {draft.steps.map((step) => (
                      <Card key={step.id} variant="outlined">
                        <CardContent>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                            <Chip label={`Step ${step.order}`} size="small" />
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                              <InputLabel>Tipo</InputLabel>
                              <Select
                                label="Tipo"
                                value={step.type}
                                onChange={(event) =>
                                  upsertStep(step.id, (current) => ({
                                    ...current,
                                    type: event.target.value as SequenceStep['type'],
                                  }))
                                }
                              >
                                {Object.entries(stepTypeLabel).map(([value, label]) => (
                                  <MenuItem key={value} value={value}>
                                    {label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <TextField
                              size="small"
                              type="number"
                              label="Delay (dias)"
                              value={step.delayDays}
                              onChange={(event) =>
                                upsertStep(step.id, (current) => ({
                                  ...current,
                                  delayDays: Number(event.target.value),
                                }))
                              }
                              sx={{ width: 120 }}
                            />
                            <TextField
                              size="small"
                              type="number"
                              label="Delay (horas)"
                              value={step.delayHours || 0}
                              onChange={(event) =>
                                upsertStep(step.id, (current) => ({
                                  ...current,
                                  delayHours: Number(event.target.value),
                                }))
                              }
                              sx={{ width: 130 }}
                            />
                            <TextField
                              size="small"
                              label="Assunto Email"
                              value={step.emailSubject || ''}
                              onChange={(event) =>
                                upsertStep(step.id, (current) => ({
                                  ...current,
                                  emailSubject: event.target.value,
                                }))
                              }
                              sx={{ flex: 1 }}
                            />
                            {step.type === 'email' && (
                              <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Template</InputLabel>
                                <Select
                                  label="Template"
                                  value={step.emailTemplateId || ''}
                                  onChange={(event) =>
                                    upsertStep(step.id, (current) => ({
                                      ...current,
                                      emailTemplateId: event.target.value,
                                      emailSubject:
                                        current.emailSubject ||
                                        EMAIL_TEMPLATES.find((item) => item.id === event.target.value)?.name,
                                    }))
                                  }
                                >
                                  <MenuItem value="">Selecionar...</MenuItem>
                                  {EMAIL_TEMPLATES.map((template) => (
                                    <MenuItem key={template.id} value={template.id}>
                                      {template.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                            <IconButton color="error" onClick={() => removeStep(step.id)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Stack>
                          {step.type === 'email' && step.emailTemplateId && (
                            <Paper variant="outlined" sx={{ mt: 1, p: 1.2, bgcolor: 'grey.50' }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                Preview de template
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {EMAIL_TEMPLATES.find((item) => item.id === step.emailTemplateId)?.preview ||
                                  'Template sem preview'}
                              </Typography>
                            </Paper>
                          )}
                          {step.stats && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={`Enviados: ${step.stats.sent}`} size="small" variant="outlined" />
                              <Chip
                                label={`Open: ${step.stats.sent ? ((step.stats.opened / step.stats.sent) * 100).toFixed(1) : '0'}%`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip label={`Clicks: ${step.stats.clicked}`} size="small" variant="outlined" />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Performance
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`Enrollments: ${draft.stats.enrollments}`} />
                    <Chip label={`Ativos: ${draft.stats.active}`} />
                    <Chip label={`Completos: ${draft.stats.completed}`} />
                    <Chip label={`Unsubscribed: ${draft.stats.unsubscribed}`} />
                    <Chip label={`Conversões: ${draft.stats.conversions}`} color="success" />
                    <Chip label={`Taxa: ${draft.stats.overallConversionRate}%`} color="success" variant="outlined" />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Histórico de testes simulados
                  </Typography>
                  {testRuns.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum teste executado ainda.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {testRuns.slice(0, 8).map((run) => (
                        <Paper key={run.id} variant="outlined" sx={{ p: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {new Date(run.startedAt).toLocaleString('pt-BR')}
                            </Typography>
                            <Chip
                              size="small"
                              label={run.status}
                              color={
                                run.status === 'delivered'
                                  ? 'success'
                                  : run.status === 'sent'
                                  ? 'info'
                                  : 'warning'
                              }
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {run.message}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Stack>
            )}
          </Box>
        </Stack>
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
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
    </Box>
  );
};

export default NurtureSequencesPage;
