import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import type { ExportJob } from '../types';

const ExportsPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [entity, setEntity] = useState<ExportJob['entity']>('deals');
  const [format, setFormat] = useState<ExportJob['format']>('csv');
  const [records, setRecords] = useState(1000);

  const load = async () => {
    try {
      const response = await mockApi.exports.listJobs();
      setJobs(response.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar exportações');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const requestExport = async () => {
    try {
      setError(null);
      await mockApi.exports.requestJob({
        entity,
        format,
        records,
        requestedBy: '550e8400-e29b-41d4-a716-446655440001',
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao solicitar exportação');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Data Export
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Exportações pontuais e em lote (CSV/Excel/JSON/PDF), com histórico de jobs.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Solicitar exportação
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <FormControl fullWidth>
              <InputLabel>Entidade</InputLabel>
              <Select value={entity} label="Entidade" onChange={(event) => setEntity(event.target.value as ExportJob['entity'])}>
                <MenuItem value="contacts">Contacts</MenuItem>
                <MenuItem value="accounts">Accounts</MenuItem>
                <MenuItem value="deals">Deals</MenuItem>
                <MenuItem value="leads">Leads</MenuItem>
                <MenuItem value="reports">Reports</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select value={format} label="Formato" onChange={(event) => setFormat(event.target.value as ExportJob['format'])}>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Qtd. registros"
              value={records}
              onChange={(event) => setRecords(Number(event.target.value || 0))}
              fullWidth
            />
            <Button variant="contained" onClick={requestExport}>
              Solicitar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Histórico de exportações
          </Typography>
          <Stack spacing={1}>
            {jobs.map((job) => (
              <Paper key={job.id} variant="outlined" sx={{ p: 1.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {job.entity} • {job.format.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(job.requestedAt).toLocaleString('pt-BR')} • {job.records} registros
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="small"
                      label={job.status}
                      color={
                        job.status === 'done'
                          ? 'success'
                          : job.status === 'failed'
                          ? 'error'
                          : 'warning'
                      }
                    />
                    {job.downloadUrl && (
                      <Button size="small" variant="outlined" href={job.downloadUrl}>
                        Download
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExportsPage;
