import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Lead, LeadFormData, LeadSource, LeadStatus, User } from '../types';
import { mockApi } from '../mock/api';
import AILeadInsights from '../components/AILeadInsights';

const sourceOptions: Array<{ value: LeadSource; label: string }> = [
  { value: 'website', label: 'Website' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral' },
  { value: 'event', label: 'Evento' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'content_download', label: 'Content Download' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
];

const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: 'new', label: 'Novo' },
  { value: 'working', label: 'Trabalhando' },
  { value: 'nurturing', label: 'Nurturing' },
  { value: 'unqualified', label: 'Desqualificado' },
  { value: 'converted', label: 'Convertido' },
];

const LeadDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [lead, setLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadFormData | null>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [leadRes, usersRes] = await Promise.all([mockApi.leads.getById(id), mockApi.users.list()]);
      const loadedLead = leadRes.data as Lead;
      setLead(loadedLead);
      setUsers(usersRes.data || []);
      setForm({
        firstName: loadedLead.firstName,
        lastName: loadedLead.lastName,
        email: loadedLead.email,
        phone: loadedLead.phone || '',
        company: loadedLead.company || '',
        jobTitle: loadedLead.jobTitle || '',
        source: loadedLead.source,
        status: loadedLead.status,
        ownerId: loadedLead.ownerId,
        lifecycle: loadedLead.lifecycle,
        tags: loadedLead.tags || [],
        customFields: loadedLead.customFields || {},
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!id || !form) return;
    try {
      setSaving(true);
      setError(null);
      await mockApi.leads.update(id, form);
      setToast({ open: true, message: 'Lead atualizado com sucesso', severity: 'success' });
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar lead');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead || !form) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Lead não encontrado.</Alert>
      </Box>
    );
  }

  const isReadOnly = lead.isConverted;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {lead.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detalhe e manutenção de lead
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate('/leads')}>
            Voltar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || isReadOnly}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {isReadOnly && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Este lead já foi convertido e está em modo somente leitura.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 2.5, alignItems: 'start', mb: 0 }}>
        <Box>

      <Paper sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Nome"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.firstName}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, firstName: event.target.value } : prev))}
            />
            <TextField
              label="Sobrenome"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.lastName}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, lastName: event.target.value } : prev))}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Email"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.email}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, email: event.target.value } : prev))}
            />
            <TextField
              label="Telefone"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.phone || ''}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, phone: event.target.value } : prev))}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Empresa"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.company || ''}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, company: event.target.value } : prev))}
            />
            <TextField
              label="Cargo"
              size="small"
              fullWidth
              disabled={isReadOnly}
              value={form.jobTitle || ''}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, jobTitle: event.target.value } : prev))}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                label="Source"
                value={form.source}
                disabled={isReadOnly}
                onChange={(event) =>
                  setForm((prev) => (prev ? { ...prev, source: event.target.value as LeadSource } : prev))
                }
              >
                {sourceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                disabled={isReadOnly}
                onChange={(event) =>
                  setForm((prev) => (prev ? { ...prev, status: event.target.value as LeadStatus } : prev))
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Owner</InputLabel>
              <Select
                label="Owner"
                value={form.ownerId}
                disabled={isReadOnly}
                onChange={(event) => setForm((prev) => (prev ? { ...prev, ownerId: event.target.value } : prev))}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Tags atuais
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              {lead.tags.length > 0 ? (
                lead.tags.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)
              ) : (
                <Typography variant="caption">Sem tags</Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Paper>
        </Box>{/* fim col esquerda */}
        <AILeadInsights lead={lead} />
      </Box>{/* fim grid */}

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

export default LeadDetailPage;
