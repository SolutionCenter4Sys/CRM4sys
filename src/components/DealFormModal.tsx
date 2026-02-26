import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
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
import AccountFormModal from './AccountFormModal';
import type { Account, Contact, Deal, DealFormData, Stage } from '../types';

interface DealFormModalProps {
  open: boolean;
  mode?: 'create' | 'edit';
  initialData?: Deal | null;
  onClose: () => void;
  onSubmit: (data: DealFormData) => Promise<void>;
  pipelineId: string;
  stages: Stage[];
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  open,
  mode = 'create',
  initialData,
  onClose,
  onSubmit,
  pipelineId,
  stages,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [form, setForm] = useState<DealFormData>({
    title: '',
    description: '',
    amount: 0,
    expectedCloseDate: '',
    pipelineId,
    stageId: stages[0]?.id || '',
    accountId: '',
    primaryContactId: '',
  });

  const resetForm = () => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        amount: initialData.amount,
        expectedCloseDate: initialData.expectedCloseDate,
        pipelineId: initialData.pipelineId,
        stageId: initialData.stageId,
        accountId: initialData.accountId,
        primaryContactId: initialData.primaryContactId,
        ownerId: initialData.ownerId,
      });
    } else {
      setForm({
        title: '',
        description: '',
        amount: 0,
        expectedCloseDate: '',
        pipelineId,
        stageId: stages[0]?.id || '',
        accountId: '',
        primaryContactId: '',
      });
    }
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, mode, initialData, pipelineId, stages]);

  useEffect(() => {
    if (!open) return;
    const loadData = async () => {
      const accountsRes = await mockApi.accounts.list();
      setAccounts(accountsRes.data || []);
    };
    loadData();
  }, [open]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      pipelineId,
      stageId: prev.stageId || stages[0]?.id || '',
    }));
  }, [pipelineId, stages]);

  useEffect(() => {
    if (!form.accountId) {
      setContacts([]);
      return;
    }
    const loadContacts = async () => {
      const contactsRes = await mockApi.contacts.listByAccount(form.accountId);
      setContacts(contactsRes.data || []);
    };
    loadContacts();
  }, [form.accountId]);

  const selectedStageLabel = useMemo(
    () => stages.find((s) => s.id === form.stageId)?.name || '—',
    [form.stageId, stages]
  );

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Título é obrigatório.');
      return;
    }
    if (!form.accountId) {
      setError('Selecione uma conta.');
      return;
    }
    if (!form.stageId) {
      setError('Selecione um estágio.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(form);
      onClose();
      resetForm();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : mode === 'create'
          ? 'Erro ao criar deal'
          : 'Erro ao atualizar deal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === 'create' ? '💼 Novo Deal' : '✏️ Editar Deal'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <TextField
            label="Título *"
            fullWidth
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            label="Descrição"
            multiline
            minRows={2}
            fullWidth
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Valor (R$)"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
            />
            <TextField
              label="Previsão de fechamento"
              type="date"
              value={form.expectedCloseDate || ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, expectedCloseDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Autocomplete
                fullWidth
                size="small"
                options={accounts}
                getOptionLabel={(option) => option.name}
                value={accounts.find((account) => account.id === form.accountId) || null}
                onChange={(_, value) =>
                  setForm((prev) => ({
                    ...prev,
                    accountId: value?.id || '',
                    primaryContactId: '',
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Conta *" placeholder="Buscar conta..." />
                )}
              />
              <Button
                variant="outlined"
                onClick={() => setAccountModalOpen(true)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Nova
              </Button>
            </Box>
            <Autocomplete
              fullWidth
              size="small"
              disabled={!form.accountId}
              options={contacts}
              getOptionLabel={(option) => option.fullName}
              value={contacts.find((contact) => contact.id === form.primaryContactId) || null}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, primaryContactId: value?.id || '' }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Contato principal"
                  placeholder="Buscar contato..."
                />
              )}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Estágio *</InputLabel>
            <Select
              label="Estágio *"
              value={form.stageId}
              onChange={(e) => setForm((prev) => ({ ...prev, stageId: e.target.value }))}
            >
              {stages.map((stage) => (
                <MenuItem key={stage.id} value={stage.id}>
                  {stage.name} ({stage.probability}%)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            Pipeline: padrão • Estágio selecionado: {selectedStageLabel}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar Deal' : 'Salvar alterações'}
        </Button>
      </DialogActions>

      <AccountFormModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onCreated={async (createdAccount) => {
          const accountsRes = await mockApi.accounts.list();
          setAccounts(accountsRes.data || []);
          setForm((prev) => ({
            ...prev,
            accountId: createdAccount.id,
            primaryContactId: '',
          }));
          setAccountModalOpen(false);
        }}
      />
    </Dialog>
  );
};

export default DealFormModal;
