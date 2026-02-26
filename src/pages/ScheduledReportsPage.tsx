import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { ReportExecutionLog, ReportSchedule } from '../types';

const emptyForm: Omit<ReportSchedule, 'id' | 'nextRunAt'> = {
  reportId: '',
  reportName: '',
  enabled: true,
  frequency: 'weekly',
  time: '09:00',
  dayOfWeek: 1,
  recipients: [],
  format: 'pdf',
  subject: '',
  message: '',
};

const ScheduledReportsPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [logs, setLogs] = useState<ReportExecutionLog[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setError(null);
      const [schedulesRes, logsRes] = await Promise.all([mockApi.reportSchedules.list(), mockApi.reportSchedules.logs()]);
      setSchedules(schedulesRes.data || []);
      setLogs(logsRes.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar agendamentos');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    try {
      if (!form.reportId || !form.reportName) {
        setError('Preencha reportId e nome do relatório');
        return;
      }
      await mockApi.reportSchedules.save({
        ...form,
        recipients: form.recipients,
      });
      setDialogOpen(false);
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar agendamento');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Scheduled Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agendamento de relatórios por e-mail com histórico de execução.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Novo agendamento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Agendamentos ativos
            </Typography>
            <Stack spacing={1}>
              {schedules.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum agendamento cadastrado.
                </Typography>
              ) : (
                schedules.map((schedule) => (
                  <Paper key={schedule.id} variant="outlined" sx={{ p: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {schedule.reportName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {schedule.frequency} • {schedule.time} • {schedule.recipients.join(', ')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip size="small" label={schedule.enabled ? 'Ativo' : 'Pausado'} color={schedule.enabled ? 'success' : 'default'} />
                      <Chip size="small" label={`Próx: ${new Date(schedule.nextRunAt).toLocaleString('pt-BR')}`} variant="outlined" />
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Log de execuções
            </Typography>
            <Stack spacing={1}>
              {logs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sem execuções registradas.
                </Typography>
              ) : (
                logs.slice(0, 12).map((log) => (
                  <Paper key={log.id} variant="outlined" sx={{ p: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {new Date(log.executedAt).toLocaleString('pt-BR')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.message}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip size="small" label={log.status} color={log.status === 'success' ? 'success' : 'error'} />
                    </Box>
                  </Paper>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 0.5 }}>
            <TextField
              label="Report ID"
              value={form.reportId}
              onChange={(event) => setForm((prev) => ({ ...prev, reportId: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Nome do relatório"
              value={form.reportName}
              onChange={(event) => setForm((prev) => ({ ...prev, reportName: event.target.value }))}
              fullWidth
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel>Frequência</InputLabel>
                <Select
                  value={form.frequency}
                  label="Frequência"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, frequency: event.target.value as ReportSchedule['frequency'] }))
                  }
                >
                  <MenuItem value="daily">Diário</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="monthly">Mensal</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Horário"
                type="time"
                value={form.time}
                onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select
                value={form.format}
                label="Formato"
                onChange={(event) => setForm((prev) => ({ ...prev, format: event.target.value as ReportSchedule['format'] }))}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Destinatários (separados por vírgula)"
              value={form.recipients.join(', ')}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  recipients: event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledReportsPage;
