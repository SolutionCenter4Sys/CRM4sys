import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import AccountFormModal from './AccountFormModal';
import type { Account, Contact, Deal, DealFormData, DeliveryModel, Stage } from '../types';

interface DealFormModalProps {
  open: boolean;
  mode?: 'create' | 'edit';
  initialData?: Deal | null;
  onClose: () => void;
  onSubmit: (data: DealFormData) => Promise<void>;
  pipelineId: string;
  stages: Stage[];
}

const DEAL_SOURCES = [
  'Prospecção ativa',
  'Indicação de cliente',
  'Indicação interna',
  'LinkedIn',
  'Website / Inbound',
  'Evento',
  'Parceiro',
  'Licitação / Edital',
  'Renovação',
  'Outro',
];

const DELIVERY_MODELS: { value: DeliveryModel; label: string }[] = [
  { value: 'alocacao', label: 'Alocação' },
  { value: 'projetos', label: 'Projetos' },
  { value: 'produtos', label: 'Produtos' },
  { value: 'ams', label: 'AMS' },
  { value: 'squad', label: 'Squad' },
  { value: 'outsourcing', label: 'Outsourcing' },
];

const BUSINESS_UNITS = [
  'Comercial',
  'Delivery',
  'Produto',
  'Infraestrutura',
  'Consultoria',
  'Suporte',
  'Financeiro',
];

const PORTFOLIO_ITEMS = [
  'CRM / Força de Vendas',
  'ERP',
  'BI / Analytics',
  'Desenvolvimento de Software',
  'Infraestrutura / Cloud',
  'Segurança da Informação',
  'RPA / Automação',
  'Inteligência Artificial',
  'Consultoria',
  'Suporte / AMS',
  'Treinamento',
  'Squad as a Service',
  'Outsourcing de TI',
];

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ fontWeight: 700, fontSize: 10, letterSpacing: 1, display: 'block', mb: 0.5 }}
  >
    {children}
  </Typography>
);

const emptyForm = (pid: string, stageId: string): DealFormData => ({
  title: '',
  description: '',
  amount: 0,
  expectedCloseDate: '',
  pipelineId: pid,
  stageId,
  accountId: '',
  primaryContactId: '',
  portfolioItems: [],
  businessUnit: '',
  dealSource: '',
  referral: '',
  deliveryModel: undefined,
  allocationQty: undefined,
  allocationTerm: '',
  allocationHours: undefined,
});

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
  const [users, setUsers] = useState<Array<{ id: string; fullName: string }>>([]);
  const [loading, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const defaultStageId = stages.find((s) => s.name !== 'Perdido')?.id || stages[0]?.id || '';

  const [form, setForm] = useState<DealFormData>(emptyForm(pipelineId, defaultStageId));

  const resetForm = () => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || '',
        amount: initialData.amount,
        expectedCloseDate: initialData.expectedCloseDate || '',
        pipelineId: initialData.pipelineId,
        stageId: initialData.stageId,
        accountId: initialData.accountId,
        primaryContactId: initialData.primaryContactId || '',
        ownerId: initialData.ownerId,
        portfolioItems: initialData.portfolioItems || [],
        businessUnit: initialData.businessUnit || '',
        dealSource: initialData.dealSource || '',
        referral: initialData.referral || '',
        deliveryModel: initialData.deliveryModel,
        allocationQty: initialData.allocationQty,
        allocationTerm: initialData.allocationTerm || '',
        allocationHours: initialData.allocationHours,
      });
    } else {
      setForm(emptyForm(pipelineId, defaultStageId));
    }
    setFieldErrors({});
    setGlobalError(null);
  };

  useEffect(() => { if (open) resetForm(); }, [open, mode, initialData, pipelineId, stages]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      const [accountsRes, usersRes] = await Promise.all([
        mockApi.accounts.list(),
        mockApi.users.list(),
      ]);
      setAccounts(accountsRes.data || []);
      setUsers((usersRes.data || []).map((u) => ({ id: u.id, fullName: u.fullName })));
    };
    load();
  }, [open]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, pipelineId, stageId: prev.stageId || defaultStageId }));
  }, [pipelineId, stages]);

  useEffect(() => {
    if (!form.accountId) { setContacts([]); return; }
    mockApi.contacts.listByAccount(form.accountId).then((r) => setContacts(r.data || []));
  }, [form.accountId]);

  const set = <K extends keyof DealFormData>(key: K, value: DealFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Título é obrigatório.';
    if (!form.accountId) errs.accountId = 'Selecione uma conta.';
    if (!form.stageId) errs.stageId = 'Selecione um estágio.';
    if (!form.amount || form.amount <= 0) errs.amount = 'Informe um valor maior que zero.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setGlobalError(null);
      await onSubmit(form);
      onClose();
      resetForm();
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : 'Erro ao salvar negócio.');
    } finally {
      setSaving(false);
    }
  };

  const selectedStage = useMemo(() => stages.find((s) => s.id === form.stageId), [form.stageId, stages]);
  const isAllocation = form.deliveryModel === 'alocacao';

  // Exclude "Perdido" from stage selector in the form
  const selectableStages = stages.filter((s) => s.name !== 'Perdido');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {mode === 'create' ? 'Novo Negócio' : 'Editar Negócio'}
        {initialData?.dealCode && (
          <Chip
            label={initialData.dealCode}
            size="small"
            variant="outlined"
            sx={{ ml: 1.5, fontFamily: 'monospace', fontSize: 11 }}
          />
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.2 }}>
          Campos marcados com * são obrigatórios
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {globalError && (
            <Alert severity="error" onClose={() => setGlobalError(null)}>{globalError}</Alert>
          )}

          {/* ── Identificação ── */}
          <Box>
            <SectionTitle>Identificação</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Título do negócio *"
                  fullWidth
                  size="small"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  error={!!fieldErrors.title}
                  helperText={fieldErrors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  multiline
                  minRows={2}
                  fullWidth
                  size="small"
                  value={form.description || ''}
                  onChange={(e) => set('description', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ── Valores e Datas ── */}
          <Box>
            <SectionTitle>Valores e Datas</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor (R$) *"
                  type="number"
                  fullWidth
                  size="small"
                  value={form.amount || ''}
                  onChange={(e) => set('amount', Number(e.target.value))}
                  error={!!fieldErrors.amount}
                  helperText={fieldErrors.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Previsão de fechamento"
                  type="date"
                  fullWidth
                  size="small"
                  value={form.expectedCloseDate || ''}
                  onChange={(e) => set('expectedCloseDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ── Empresa e Contato ── */}
          <Box>
            <SectionTitle>Empresa e Contato</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={accounts}
                  getOptionLabel={(o) => o.name}
                  value={accounts.find((a) => a.id === form.accountId) || null}
                  onChange={(_, v) => set('accountId', v?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Conta *"
                      placeholder="Buscar conta..."
                      error={!!fieldErrors.accountId}
                      helperText={fieldErrors.accountId}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ height: 40 }}
                  onClick={() => setAccountModalOpen(true)}
                >
                  + Nova conta
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  size="small"
                  disabled={!form.accountId}
                  options={contacts}
                  getOptionLabel={(o) => o.fullName}
                  value={contacts.find((c) => c.id === form.primaryContactId) || null}
                  onChange={(_, v) => set('primaryContactId', v?.id || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Contato principal" placeholder="Buscar contato..." />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Responsável</InputLabel>
                  <Select
                    label="Responsável"
                    value={form.ownerId || ''}
                    onChange={(e) => set('ownerId', e.target.value)}
                  >
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ── Pipeline e Estágio ── */}
          <Box>
            <SectionTitle>Pipeline e Estágio</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" error={!!fieldErrors.stageId}>
                  <InputLabel>Estágio *</InputLabel>
                  <Select
                    label="Estágio *"
                    value={form.stageId}
                    onChange={(e) => set('stageId', e.target.value)}
                  >
                    {selectableStages.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name} ({s.probability}%)
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.stageId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.3, ml: 1.5 }}>
                      {fieldErrors.stageId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {selectedStage && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">Probabilidade do estágio</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedStage.probability}% · Valor ponderado:{' '}
                      {((form.amount || 0) * selectedStage.probability / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      })}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider />

          {/* ── Classificação Comercial ── */}
          <Box>
            <SectionTitle>Classificação Comercial</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fonte do negócio</InputLabel>
                  <Select
                    label="Fonte do negócio"
                    value={form.dealSource || ''}
                    onChange={(e) => set('dealSource', e.target.value)}
                  >
                    <MenuItem value="">Não definido</MenuItem>
                    {DEAL_SOURCES.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Indicação (profissional interno)</InputLabel>
                  <Select
                    label="Indicação (profissional interno)"
                    value={form.referral || ''}
                    onChange={(e) => set('referral', e.target.value)}
                  >
                    <MenuItem value="">Nenhum</MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.fullName}>{u.fullName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Unidade da empresa</InputLabel>
                  <Select
                    label="Unidade da empresa"
                    value={form.businessUnit || ''}
                    onChange={(e) => set('businessUnit', e.target.value)}
                  >
                    <MenuItem value="">Não definido</MenuItem>
                    {BUSINESS_UNITS.map((u) => (
                      <MenuItem key={u} value={u}>{u}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Modalidade de entrega</InputLabel>
                  <Select
                    label="Modalidade de entrega"
                    value={form.deliveryModel || ''}
                    onChange={(e) => set('deliveryModel', (e.target.value || undefined) as DeliveryModel | undefined)}
                  >
                    <MenuItem value="">Não definido</MenuItem>
                    {DELIVERY_MODELS.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  size="small"
                  options={PORTFOLIO_ITEMS}
                  value={form.portfolioItems || []}
                  onChange={(_, v) => set('portfolioItems', v)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Itens do portfólio" placeholder="Selecionar itens..." />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ── Seção de Alocação (condicional) ── */}
          <Collapse in={isAllocation}>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              }}
            >
              <SectionTitle>Detalhes de Alocação</SectionTitle>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Quantidade de alocações"
                    type="number"
                    fullWidth
                    size="small"
                    value={form.allocationQty || ''}
                    onChange={(e) => set('allocationQty', e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Prazo"
                    fullWidth
                    size="small"
                    value={form.allocationTerm || ''}
                    onChange={(e) => set('allocationTerm', e.target.value)}
                    placeholder="ex: 6 meses, 12 meses"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Quantidade de horas"
                    type="number"
                    fullWidth
                    size="small"
                    value={form.allocationHours || ''}
                    onChange={(e) => set('allocationHours', e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar Negócio' : 'Salvar alterações'}
        </Button>
      </DialogActions>

      <AccountFormModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onCreated={async (createdAccount) => {
          const accountsRes = await mockApi.accounts.list();
          setAccounts(accountsRes.data || []);
          set('accountId', createdAccount.id);
          setAccountModalOpen(false);
        }}
      />
    </Dialog>
  );
};

export default DealFormModal;
