import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Contact, ContactFormData, LifecycleStage } from '../types';

interface ContactFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: Contact | null;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

const lifecycleOptions: LifecycleStage[] = [
  'subscriber',
  'lead',
  'mql',
  'sql',
  'opportunity',
  'customer',
  'evangelist',
];

const defaultForm: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobilePhone: '',
  jobTitle: '',
  department: '',
  lifecycleStage: 'lead',
  leadSource: '',
  tags: [],
};

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ContactFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        mobilePhone: initialData.mobilePhone,
        jobTitle: initialData.jobTitle,
        department: initialData.department,
        lifecycleStage: initialData.lifecycleStage,
        leadSource: initialData.leadSource,
        tags: initialData.tags,
        ownerId: initialData.ownerId,
        accountId: initialData.accountId,
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [mode, initialData, open]);

  const setField = <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.firstName?.trim()) return 'First Name é obrigatório.';
    if (!form.lastName?.trim()) return 'Last Name é obrigatório.';
    if (!form.email?.trim()) return 'Email é obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Email inválido.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSubmit(form);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar contato');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === 'create' ? '✨ Novo Contato' : '✏️ Editar Contato'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="First Name *"
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name *"
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Email *"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              fullWidth
            />
            <TextField
              label="Mobile Phone"
              value={form.mobilePhone}
              onChange={(e) => setField('mobilePhone', e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Job Title"
            value={form.jobTitle}
            onChange={(e) => setField('jobTitle', e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Department"
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Lifecycle Stage</InputLabel>
              <Select
                label="Lifecycle Stage"
                value={form.lifecycleStage || 'lead'}
                onChange={(e) =>
                  setField('lifecycleStage', e.target.value as LifecycleStage)
                }
              >
                {lifecycleOptions.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Lead Source"
            value={form.leadSource}
            onChange={(e) => setField('leadSource', e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving
            ? 'Salvando...'
            : mode === 'create'
            ? 'Salvar Contato'
            : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactFormModal;
