import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import type {
  Contact,
  ContactFormData,
  ContactCompanyLink,
  LifecycleStage,
  WorkModel,
} from '../types';

interface ContactFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: Contact | null;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  accounts?: Array<{ id: string; name: string }>;
}

const lifecycleOptions: { value: LifecycleStage; label: string }[] = [
  { value: 'subscriber', label: 'Assinante' },
  { value: 'lead', label: 'Lead' },
  { value: 'mql', label: 'MQL' },
  { value: 'sql', label: 'SQL' },
  { value: 'opportunity', label: 'Oportunidade' },
  { value: 'customer', label: 'Cliente' },
  { value: 'evangelist', label: 'Evangelista' },
];

const workModelOptions: { value: WorkModel; label: string }[] = [
  { value: 'remote', label: 'Remoto' },
  { value: 'on-site', label: 'Presencial' },
  { value: 'hybrid', label: 'Híbrido' },
];

const LEAD_SOURCE_OPTIONS = [
  'Website',
  'LinkedIn',
  'Indicação',
  'Evento',
  'Webinar',
  'Download de conteúdo',
  'Prospecção ativa',
  'Outro',
];

const defaultForm: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobilePhone: '',
  linkedin: '',
  birthDate: '',
  lifecycleStage: 'lead',
  leadSource: '',
  tags: [],
  companyLinks: [],
};

const newCompanyLink = (): ContactCompanyLink => ({
  id: `link-${Date.now()}`,
  companyName: '',
  isActive: true,
  workModel: 'remote',
});

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ fontWeight: 700, fontSize: 10, letterSpacing: 1, display: 'block', mb: 1 }}
  >
    {children}
  </Typography>
);

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  accounts = [],
}) => {
  const [form, setForm] = useState<ContactFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const links: ContactCompanyLink[] = initialData.companyLinks?.length
        ? initialData.companyLinks
        : initialData.accountId
        ? [
            {
              id: `link-legacy-${initialData.accountId}`,
              accountId: initialData.accountId,
              account: initialData.account,
              companyName: initialData.account?.name || '',
              professionalEmail: initialData.email,
              jobTitle: initialData.jobTitle,
              department: initialData.department,
              isActive: true,
              workModel: 'remote',
            },
          ]
        : [];
      setForm({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone || '',
        mobilePhone: initialData.mobilePhone || '',
        linkedin: initialData.linkedin || '',
        birthDate: initialData.birthDate || '',
        address: initialData.address,
        lifecycleStage: initialData.lifecycleStage,
        leadSource: initialData.leadSource || '',
        tags: initialData.tags || [],
        ownerId: initialData.ownerId,
        companyLinks: links,
      });
      const initExpanded: Record<string, boolean> = {};
      links.forEach((l) => { initExpanded[l.id] = true; });
      setExpandedLinks(initExpanded);
    } else {
      setForm(defaultForm);
      setExpandedLinks({});
    }
    setFieldErrors({});
    setGlobalError(null);
  }, [mode, initialData, open]);

  const setField = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.firstName?.trim()) errors.firstName = 'Nome é obrigatório.';
    if (!form.lastName?.trim()) errors.lastName = 'Sobrenome é obrigatório.';
    if (!form.email?.trim()) {
      errors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'E-mail inválido.';
    }
    (form.companyLinks || []).forEach((link, i) => {
      if (!link.companyName.trim()) errors[`link_${i}_company`] = 'Nome da empresa é obrigatório.';
      if (link.professionalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link.professionalEmail)) {
        errors[`link_${i}_email`] = 'E-mail profissional inválido.';
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setGlobalError(null);
      await onSubmit(form);
      onClose();
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : 'Erro ao salvar contato.');
    } finally {
      setSaving(false);
    }
  };

  // ── Company Links helpers ────────────────────────────────────────────────
  const addCompanyLink = () => {
    const link = newCompanyLink();
    setForm((prev) => ({ ...prev, companyLinks: [...(prev.companyLinks || []), link] }));
    setExpandedLinks((prev) => ({ ...prev, [link.id]: true }));
  };

  const removeCompanyLink = (id: string) => {
    setForm((prev) => ({
      ...prev,
      companyLinks: (prev.companyLinks || []).filter((l) => l.id !== id),
    }));
  };

  const updateLink = (id: string, patch: Partial<ContactCompanyLink>) => {
    setForm((prev) => ({
      ...prev,
      companyLinks: (prev.companyLinks || []).map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  };

  const toggleLink = (id: string) =>
    setExpandedLinks((prev) => ({ ...prev, [id]: !prev[id] }));

  const activeLinks = (form.companyLinks || []).filter((l) => l.isActive).length;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {mode === 'create' ? 'Novo Contato' : 'Editar Contato'}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.2 }}>
          Campos marcados com * são obrigatórios
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {globalError && (
            <Alert severity="error" onClose={() => setGlobalError(null)}>
              {globalError}
            </Alert>
          )}

          {/* ── Dados Pessoais ── */}
          <Box>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome *"
                  fullWidth
                  size="small"
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sobrenome *"
                  fullWidth
                  size="small"
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="E-mail pessoal *"
                  fullWidth
                  size="small"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data de nascimento"
                  fullWidth
                  size="small"
                  type="date"
                  value={form.birthDate || ''}
                  onChange={(e) => setField('birthDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  size="small"
                  value={form.phone || ''}
                  onChange={(e) => setField('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Celular"
                  fullWidth
                  size="small"
                  value={form.mobilePhone || ''}
                  onChange={(e) => setField('mobilePhone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="LinkedIn"
                  fullWidth
                  size="small"
                  value={form.linkedin || ''}
                  onChange={(e) => setField('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/nome"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fase do ciclo de vida</InputLabel>
                  <Select
                    label="Fase do ciclo de vida"
                    value={form.lifecycleStage || 'lead'}
                    onChange={(e) => setField('lifecycleStage', e.target.value as LifecycleStage)}
                  >
                    {lifecycleOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fonte do lead</InputLabel>
                  <Select
                    label="Fonte do lead"
                    value={form.leadSource || ''}
                    onChange={(e) => setField('leadSource', e.target.value)}
                  >
                    <MenuItem value="">Não definido</MenuItem>
                    {LEAD_SOURCE_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* ── Endereço ── */}
          <Box>
            <SectionTitle>Endereço Pessoal</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Logradouro"
                  fullWidth
                  size="small"
                  value={form.address?.street || ''}
                  onChange={(e) => setField('address', { ...form.address, street: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Complemento"
                  fullWidth
                  size="small"
                  value={form.address?.complement || ''}
                  onChange={(e) => setField('address', { ...form.address, complement: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Cidade"
                  fullWidth
                  size="small"
                  value={form.address?.city || ''}
                  onChange={(e) => setField('address', { ...form.address, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="UF"
                  fullWidth
                  size="small"
                  value={form.address?.state || ''}
                  onChange={(e) => setField('address', { ...form.address, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="CEP"
                  fullWidth
                  size="small"
                  value={form.address?.zipCode || ''}
                  onChange={(e) => setField('address', { ...form.address, zipCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="País"
                  fullWidth
                  size="small"
                  value={form.address?.country || 'Brasil'}
                  onChange={(e) => setField('address', { ...form.address, country: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ── Empresas de Atuação ── */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box>
                <SectionTitle>Empresas de Atuação</SectionTitle>
                <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5, display: 'block' }}>
                  {(form.companyLinks || []).length} empresa(s) cadastrada(s) · {activeLinks} ativa(s)
                </Typography>
              </Box>
              <Button size="small" startIcon={<AddIcon />} onClick={addCompanyLink} variant="outlined">
                Adicionar empresa
              </Button>
            </Box>

            {(form.companyLinks || []).length === 0 && (
              <Box
                sx={{
                  p: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <BusinessIcon sx={{ fontSize: 28, color: 'text.disabled', mb: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Nenhuma empresa vinculada. Clique em "Adicionar empresa" para incluir.
                </Typography>
              </Box>
            )}

            <Stack spacing={2}>
              {(form.companyLinks || []).map((link, idx) => (
                <Box
                  key={link.id}
                  sx={{
                    border: '1px solid',
                    borderColor: link.isActive ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    opacity: link.isActive ? 1 : 0.7,
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: link.isActive ? 'primary.50' : 'grey.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleLink(link.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, color: link.isActive ? 'primary.main' : 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {link.companyName || `Empresa ${idx + 1}`}
                      </Typography>
                      <Chip
                        label={link.isActive ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={link.isActive ? 'success' : 'default'}
                        sx={{ height: 18, fontSize: 10 }}
                      />
                      {link.jobTitle && (
                        <Typography variant="caption" color="text.secondary">
                          · {link.jobTitle}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Remover empresa">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeCompanyLink(link.id); }}
                          color="error"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      {expandedLinks[link.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </Box>
                  </Box>

                  {/* Fields */}
                  {expandedLinks[link.id] && (
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Nome da empresa *"
                            fullWidth
                            size="small"
                            value={link.companyName}
                            onChange={(e) => updateLink(link.id, { companyName: e.target.value })}
                            error={!!fieldErrors[`link_${idx}_company`]}
                            helperText={fieldErrors[`link_${idx}_company`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="E-mail profissional"
                            fullWidth
                            size="small"
                            type="email"
                            value={link.professionalEmail || ''}
                            onChange={(e) => updateLink(link.id, { professionalEmail: e.target.value })}
                            error={!!fieldErrors[`link_${idx}_email`]}
                            helperText={fieldErrors[`link_${idx}_email`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Cargo"
                            fullWidth
                            size="small"
                            value={link.jobTitle || ''}
                            onChange={(e) => updateLink(link.id, { jobTitle: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Departamento"
                            fullWidth
                            size="small"
                            value={link.department || ''}
                            onChange={(e) => updateLink(link.id, { department: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Modelo de trabalho</InputLabel>
                            <Select
                              label="Modelo de trabalho"
                              value={link.workModel || 'remote'}
                              onChange={(e) => updateLink(link.id, { workModel: e.target.value as WorkModel })}
                            >
                              {workModelOptions.map((o) => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Data de início"
                            fullWidth
                            size="small"
                            type="date"
                            value={link.startDate || ''}
                            onChange={(e) => updateLink(link.id, { startDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                              label="Status"
                              value={link.isActive ? 'active' : 'inactive'}
                              onChange={(e) => updateLink(link.id, { isActive: e.target.value === 'active' })}
                            >
                              <MenuItem value="active">Ativo</MenuItem>
                              <MenuItem value="inactive">Inativo</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {!link.isActive && (
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Data de saída"
                              fullWidth
                              size="small"
                              type="date"
                              value={link.endDate || ''}
                              onChange={(e) => updateLink(link.id, { endDate: e.target.value })}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <TextField
                            label="Concorrentes"
                            fullWidth
                            size="small"
                            multiline
                            minRows={2}
                            value={link.competitors || ''}
                            onChange={(e) => updateLink(link.id, { competitors: e.target.value })}
                            placeholder="Liste os principais concorrentes deste contato/empresa"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Objetivo do departamento"
                            fullWidth
                            size="small"
                            multiline
                            minRows={2}
                            value={link.departmentObjective || ''}
                            onChange={(e) => updateLink(link.id, { departmentObjective: e.target.value })}
                            placeholder="Descreva o objetivo e metas do departamento"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {saving ? 'Salvando...' : mode === 'create' ? 'Criar Contato' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactFormModal;
