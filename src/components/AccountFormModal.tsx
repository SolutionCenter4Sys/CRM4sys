import React, { useState } from 'react';
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
import { mockApi } from '../mock/api';
import type { Account, AccountFormData, AccountTier } from '../types';

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (account: Account) => void;
}

const defaultForm: AccountFormData = {
  name: '',
  legalName: '',
  cnpj: '',
  domain: '',
  website: '',
  industry: '',
  numberOfEmployees: undefined,
  tier: 'SMB',
};

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState<AccountFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setError(null);
    setForm(defaultForm);
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      setError('Nome da empresa é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.accounts.create(form);
      if (response.data) {
        onCreated?.(response.data);
      }
      setForm(defaultForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Nova Empresa</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Nome fantasia *"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Razão social"
              value={form.legalName || ''}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, legalName: event.target.value }))
              }
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <TextField
              label="CNPJ"
              value={form.cnpj || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, cnpj: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Domínio"
              placeholder="empresa.com.br"
              value={form.domain || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, domain: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Website"
              placeholder="https://empresa.com.br"
              value={form.website || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <TextField
              label="Indústria"
              value={form.industry || ''}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, industry: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Nº de funcionários"
              type="number"
              value={form.numberOfEmployees || ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  numberOfEmployees: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                }))
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tier</InputLabel>
              <Select
                label="Tier"
                value={form.tier || 'SMB'}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tier: event.target.value as AccountTier }))
                }
              >
                <MenuItem value="SMB">SMB</MenuItem>
                <MenuItem value="MidMarket">MidMarket</MenuItem>
                <MenuItem value="Enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Criando...' : 'Criar empresa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountFormModal;
