import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  OpenInNew as OpenInNewIcon,
  Receipt as ReceiptIcon,
  Group as GroupIcon,
  ContactPage as ContactPageIcon,
  WorkOutline as WorkOutlineIcon,
  CheckCircleOutline as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Star as StarIcon,
  Place as PlaceIcon,
  AccountBalance as AccountBalanceIcon,
  Apartment as ApartmentIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Account, Contact, BillingConditions, Branch, ContactFormData, User } from '../types';

// ── helpers ─────────────────────────────────────────────────────────────────

const fmtCurrency = (v?: number) =>
  v != null
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : '—';

const fmtAddress = (a?: Account['address']) => {
  if (!a) return '—';
  const parts = [a.street, a.complement, a.neighborhood].filter(Boolean).join(', ');
  const city = [a.city, a.state].filter(Boolean).join(' – ');
  return [parts, city, a.zipCode, a.country].filter(Boolean).join(' · ');
};

const BILLING_CYCLE_LABEL: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
};

const INVOICE_FORMAT_LABEL: Record<string, string> = {
  nfe: 'NF-e',
  nfse: 'NFS-e',
  recibo: 'Recibo',
};

const TIER_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  SMB: 'default',
  MidMarket: 'warning',
  Enterprise: 'primary',
};

// ── subcomponents ────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  href?: string;
}> = ({ icon, label, value, href }) => {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 0.6 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.1, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
          {label}
        </Typography>
        {href ? (
          <Typography
            variant="body2"
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {value} <OpenInNewIcon sx={{ fontSize: 11, verticalAlign: 'middle' }} />
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
        )}
      </Box>
    </Box>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>
    {children}
  </Typography>
);

const KpiCard: React.FC<{ label: string; value: React.ReactNode; sub?: string; color?: string }> = ({
  label,
  value,
  sub,
  color,
}) => (
  <Box
    sx={{
      textAlign: 'center',
      px: 2,
      py: 1,
      borderRadius: 2,
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      minWidth: 120,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 700, color: color || 'text.primary', lineHeight: 1.2 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {label}
    </Typography>
    {sub && (
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>
        {sub}
      </Typography>
    )}
  </Box>
);

// ── BranchCard ───────────────────────────────────────────────────────────────

const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => (
  <Card
    variant="outlined"
    sx={{
      opacity: branch.isActive ? 1 : 0.6,
      borderColor: branch.type === 'matriz' ? 'primary.main' : 'divider',
    }}
  >
    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {branch.type === 'matriz' ? (
            <AccountBalanceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          ) : (
            <ApartmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {branch.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Chip
            label={branch.type.charAt(0).toUpperCase() + branch.type.slice(1)}
            size="small"
            color={branch.type === 'matriz' ? 'primary' : 'default'}
            variant="outlined"
            sx={{ height: 20, fontSize: 11 }}
          />
          {!branch.isActive && (
            <Chip label="Inativa" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
          )}
        </Box>
      </Box>
      {branch.cnpj && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          CNPJ: {branch.cnpj}
        </Typography>
      )}
      {branch.address && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {fmtAddress(branch.address)}
        </Typography>
      )}
      {(branch.phone || branch.email) && (
        <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
          {branch.phone && (
            <Typography variant="caption" color="text.secondary">
              {branch.phone}
            </Typography>
          )}
          {branch.email && (
            <Typography
              variant="caption"
              component="a"
              href={`mailto:${branch.email}`}
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              {branch.email}
            </Typography>
          )}
        </Box>
      )}
    </CardContent>
  </Card>
);

// ── EditDialog ───────────────────────────────────────────────────────────────

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  account: Account;
  onSave: (updated: Partial<Account>) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, account, onSave }) => {
  const [form, setForm] = useState({
    name: account.name,
    legalName: account.legalName ?? '',
    tradeName: account.tradeName ?? '',
    cnpj: account.cnpj ?? '',
    phone: account.phone ?? '',
    website: account.website ?? '',
    domain: account.domain ?? '',
    industry: account.industry ?? '',
    numberOfEmployees: account.numberOfEmployees?.toString() ?? '',
    annualRevenue: account.annualRevenue?.toString() ?? '',
    // Endereço
    street: account.address?.street ?? '',
    complement: account.address?.complement ?? '',
    neighborhood: account.address?.neighborhood ?? '',
    city: account.address?.city ?? '',
    state: account.address?.state ?? '',
    zipCode: account.address?.zipCode ?? '',
    // Faturamento
    paymentTerms: account.billingConditions?.paymentTerms ?? '',
    billingCycle: account.billingConditions?.billingCycle ?? '',
    paymentMethod: account.billingConditions?.paymentMethod ?? '',
    creditLimit: account.billingConditions?.creditLimit?.toString() ?? '',
    billingEmail: account.billingConditions?.billingEmail ?? '',
    billingContact: account.billingConditions?.billingContact ?? '',
    taxRegime: account.billingConditions?.taxRegime ?? '',
    invoiceFormat: account.billingConditions?.invoiceFormat ?? '',
    billingNotes: account.billingConditions?.notes ?? '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    onSave({
      name: form.name,
      legalName: form.legalName || undefined,
      tradeName: form.tradeName || undefined,
      cnpj: form.cnpj || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      domain: form.domain || undefined,
      industry: form.industry || undefined,
      numberOfEmployees: form.numberOfEmployees ? Number(form.numberOfEmployees) : undefined,
      annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : undefined,
      address: {
        street: form.street,
        complement: form.complement,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: account.address?.country ?? 'Brasil',
      },
      billingConditions: {
        paymentTerms: form.paymentTerms || undefined,
        billingCycle: (form.billingCycle as BillingConditions['billingCycle']) || undefined,
        paymentMethod: form.paymentMethod || undefined,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : undefined,
        billingEmail: form.billingEmail || undefined,
        billingContact: form.billingContact || undefined,
        taxRegime: form.taxRegime || undefined,
        invoiceFormat: (form.invoiceFormat as BillingConditions['invoiceFormat']) || undefined,
        notes: form.billingNotes || undefined,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Editar Empresa
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.3 }}>
          {account.name}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Identificação */}
          <Box>
            <SectionTitle>Identificação</SectionTitle>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField label="Nome fantasia *" fullWidth value={form.name} onChange={set('name')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Razão social" fullWidth value={form.legalName} onChange={set('legalName')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Nome comercial" fullWidth value={form.tradeName} onChange={set('tradeName')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="CNPJ" fullWidth value={form.cnpj} onChange={set('cnpj')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Telefone" fullWidth value={form.phone} onChange={set('phone')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Website" fullWidth value={form.website} onChange={set('website')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Domínio" fullWidth value={form.domain} onChange={set('domain')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Indústria" fullWidth value={form.industry} onChange={set('industry')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Nº funcionários" fullWidth type="number" value={form.numberOfEmployees} onChange={set('numberOfEmployees')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Receita anual (R$)" fullWidth type="number" value={form.annualRevenue} onChange={set('annualRevenue')} size="small" />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Endereço */}
          <Box>
            <SectionTitle>Endereço — Sede</SectionTitle>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField label="Logradouro" fullWidth value={form.street} onChange={set('street')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Complemento" fullWidth value={form.complement} onChange={set('complement')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Bairro" fullWidth value={form.neighborhood} onChange={set('neighborhood')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Cidade" fullWidth value={form.city} onChange={set('city')} size="small" />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="UF" fullWidth value={form.state} onChange={set('state')} size="small" />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="CEP" fullWidth value={form.zipCode} onChange={set('zipCode')} size="small" />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Condições de Faturamento */}
          <Box>
            <SectionTitle>Condições de Faturamento</SectionTitle>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={4}>
                <TextField label="Prazo de pagamento" fullWidth value={form.paymentTerms} onChange={set('paymentTerms')} size="small" placeholder="ex: 30 dias" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Ciclo de faturamento"
                  fullWidth
                  select
                  value={form.billingCycle}
                  onChange={set('billingCycle')}
                  size="small"
                >
                  <MenuItem value="">Não definido</MenuItem>
                  <MenuItem value="monthly">Mensal</MenuItem>
                  <MenuItem value="quarterly">Trimestral</MenuItem>
                  <MenuItem value="semiannual">Semestral</MenuItem>
                  <MenuItem value="annual">Anual</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Forma de pagamento" fullWidth value={form.paymentMethod} onChange={set('paymentMethod')} size="small" placeholder="ex: Boleto, PIX" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Limite de crédito (R$)" fullWidth type="number" value={form.creditLimit} onChange={set('creditLimit')} size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Formato de nota"
                  fullWidth
                  select
                  value={form.invoiceFormat}
                  onChange={set('invoiceFormat')}
                  size="small"
                >
                  <MenuItem value="">Não definido</MenuItem>
                  <MenuItem value="nfe">NF-e</MenuItem>
                  <MenuItem value="nfse">NFS-e</MenuItem>
                  <MenuItem value="recibo">Recibo</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Regime tributário" fullWidth value={form.taxRegime} onChange={set('taxRegime')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="E-mail financeiro" fullWidth value={form.billingEmail} onChange={set('billingEmail')} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Contato financeiro" fullWidth value={form.billingContact} onChange={set('billingContact')} size="small" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Observações de faturamento" fullWidth multiline minRows={2} value={form.billingNotes} onChange={set('billingNotes')} size="small" />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar alterações</Button>
      </DialogActions>
    </Dialog>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const BLANK_CONTACT_FORM: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobilePhone: '',
  jobTitle: '',
  department: '',
  lifecycleStage: 'customer',
  leadSource: 'referral',
  tags: [],
  customFields: {},
};

export const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  // ── Novo Contato ──
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [newContactForm, setNewContactForm] = useState<ContactFormData>(BLANK_CONTACT_FORM);
  const [newContactSaving, setNewContactSaving] = useState(false);
  const [newContactError, setNewContactError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const [accountRes, contactsRes, usersRes] = await Promise.all([
        mockApi.accounts.getById(id),
        mockApi.contacts.listByAccount(id),
        mockApi.users.list(),
      ]);
      setAccount(accountRes.data || null);
      setContacts(contactsRes.data || []);
      setUsers(usersRes.data || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const reloadContacts = async () => {
    if (!id) return;
    const res = await mockApi.contacts.listByAccount(id);
    setContacts(res.data || []);
  };

  const handleSave = (updated: Partial<Account>) => {
    setAccount((prev) => prev ? { ...prev, ...updated } : prev);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  const openNewContact = () => {
    setNewContactForm({
      ...BLANK_CONTACT_FORM,
      accountId: id,
      ownerId: users[0]?.id || '',
    });
    setNewContactError(null);
    setNewContactOpen(true);
  };

  const handleSaveNewContact = async () => {
    if (!newContactForm.firstName.trim() || !newContactForm.lastName.trim() || !newContactForm.email.trim()) {
      setNewContactError('Nome, sobrenome e e-mail são obrigatórios.');
      return;
    }
    try {
      setNewContactSaving(true);
      setNewContactError(null);
      await mockApi.contacts.create({ ...newContactForm, accountId: id });
      setNewContactOpen(false);
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
      await reloadContacts();
    } catch (e) {
      setNewContactError(e instanceof Error ? e.message : 'Erro ao criar contato.');
    } finally {
      setNewContactSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!account) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Conta não encontrada.</Typography>
        <Button onClick={() => navigate('/accounts')} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  const bc = account.billingConditions;
  const icpColor = account.icpScore >= 80 ? 'success' : account.icpScore >= 60 ? 'warning' : 'error';

  // Sede + filiais unificadas para a aba de endereços
  const allAddresses: Branch[] = [
    {
      id: 'sede',
      name: `${account.name} — Sede`,
      cnpj: account.cnpj,
      type: 'matriz',
      address: account.address,
      phone: account.phone,
      isActive: true,
    },
    ...(account.branches ?? []),
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* ── Topo ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/accounts')} size="small">
          Voltar para Contas
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setEditOpen(true)}
          size="small"
        >
          Editar
        </Button>
      </Box>

      {savedAlert && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSavedAlert(false)}>
          Alterações salvas com sucesso.
        </Alert>
      )}

      {/* ── Hero Card ── */}
      <Card sx={{ mb: 2.5, overflow: 'visible' }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                fontSize: 22,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {account.name.charAt(0)}
            </Avatar>

            {/* Identificação */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {account.name}
                </Typography>
                <Chip
                  label={account.tier}
                  color={TIER_COLOR[account.tier]}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                {account.targetAccount && (
                  <Tooltip title="Conta alvo (Target Account)">
                    <StarIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                {account.legalName || 'Razão social não informada'}
                {account.tradeName && account.tradeName !== account.name && (
                  <span> · {account.tradeName}</span>
                )}
              </Typography>

              {/* Contatos rápidos inline */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {account.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{account.phone}</Typography>
                  </Box>
                )}
                {account.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LanguageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography
                      variant="caption"
                      component="a"
                      href={account.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {account.domain || account.website}
                    </Typography>
                  </Box>
                )}
                {account.address?.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {account.address.city}, {account.address.state}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* ICP Score */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={account.icpScore}
                  size={60}
                  thickness={5}
                  color={icpColor}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {account.icpScore}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                ICP Score
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* KPI strip */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <KpiCard
              label="Negócios abertos"
              value={account.openDealsCount ?? 0}
              color={account.openDealsCount ? 'primary.main' : undefined}
            />
            <KpiCard
              label="Valor em negócios"
              value={fmtCurrency(account.totalDealsValue)}
              color="success.main"
            />
            <KpiCard
              label="Contatos"
              value={account.contactCount ?? contacts.length}
            />
            <KpiCard
              label="Receita anual"
              value={fmtCurrency(account.annualRevenue)}
            />
            <KpiCard
              label="Funcionários"
              value={account.numberOfEmployees?.toLocaleString('pt-BR') ?? '—'}
            />
            <KpiCard
              label="Filiais"
              value={(account.branches ?? []).length}
            />
          </Box>
        </CardContent>
      </Card>

      {/* ── Tabs ── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<BusinessIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Geral" />
          <Tab icon={<PlaceIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Endereços (${allAddresses.length})`} />
          <Tab icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Faturamento" />
          <Tab icon={<GroupIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Grupo" />
          <Tab icon={<ContactPageIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Contatos (${contacts.length})`} />
        </Tabs>
      </Box>

      {/* ── Tab 0 — Geral ── */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <SectionTitle>Dados Cadastrais</SectionTitle>
                <Box sx={{ mt: 1 }}>
                  <InfoRow icon={<BusinessIcon sx={{ fontSize: 18 }} />} label="CNPJ" value={account.cnpj} />
                  <InfoRow icon={<BusinessIcon sx={{ fontSize: 18 }} />} label="Indústria" value={account.industry} />
                  <InfoRow
                    icon={<LanguageIcon sx={{ fontSize: 18 }} />}
                    label="Website"
                    value={account.website}
                    href={account.website}
                  />
                  <InfoRow icon={<PhoneIcon sx={{ fontSize: 18 }} />} label="Telefone" value={account.phone} />
                  <InfoRow icon={<EmailIcon sx={{ fontSize: 18 }} />} label="Domínio" value={account.domain} />
                  {account.enrichedAt && (
                    <InfoRow
                      icon={<CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />}
                      label="Enriquecido via"
                      value={`${account.enrichmentSource} · ${new Date(account.enrichedAt).toLocaleDateString('pt-BR')}`}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <SectionTitle>Responsável & Classificação</SectionTitle>
                <Box sx={{ mt: 1 }}>
                  {account.owner && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar
                        src={account.owner.avatar}
                        sx={{ width: 36, height: 36, fontSize: 14 }}
                      >
                        {account.owner.fullName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {account.owner.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.owner.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">ICP Score</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: `${icpColor}.main` }}>
                        {account.icpScore}/100
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={account.icpScore}
                      color={icpColor}
                      sx={{ borderRadius: 4, height: 6 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    <Chip label={`Tier: ${account.tier}`} size="small" color={TIER_COLOR[account.tier]} />
                    {account.targetAccount && (
                      <Chip label="Target Account" size="small" color="warning" icon={<StarIcon sx={{ fontSize: 14 }} />} />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {account.techStack && account.techStack.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <SectionTitle>Tech Stack</SectionTitle>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                    {account.techStack.map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <SectionTitle>Metadados</SectionTitle>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Criado em</Typography>
                    <Typography variant="body2">{new Date(account.createdAt).toLocaleDateString('pt-BR')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Atualizado em</Typography>
                    <Typography variant="body2">{new Date(account.updatedAt).toLocaleDateString('pt-BR')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                      {account.id}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ── Tab 1 — Endereços ── */}
      {activeTab === 1 && (
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {allAddresses.length} {allAddresses.length === 1 ? 'endereço cadastrado' : 'endereços cadastrados'} ·{' '}
              {allAddresses.filter((b) => b.isActive).length} ativo(s)
            </Typography>
            <Tooltip title="Editar endereços na tela de edição">
              <IconButton size="small" onClick={() => setEditOpen(true)}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
          {allAddresses.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
          {allAddresses.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LocationOnIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Nenhum endereço cadastrado</Typography>
            </Box>
          )}
        </Stack>
      )}

      {/* ── Tab 2 — Faturamento ── */}
      {activeTab === 2 && (
        <Grid container spacing={2}>
          {!bc ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Nenhuma condição de faturamento cadastrada
                </Typography>
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
                  Adicionar condições
                </Button>
              </Box>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <SectionTitle>Condições de Pagamento</SectionTitle>
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Prazo de pagamento</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{bc.paymentTerms || '—'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Ciclo de faturamento</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {bc.billingCycle ? BILLING_CYCLE_LABEL[bc.billingCycle] : '—'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Forma de pagamento</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{bc.paymentMethod || '—'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Limite de crédito</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {fmtCurrency(bc.creditLimit)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Moeda</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{bc.currency || 'BRL'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <SectionTitle>Emissão Fiscal</SectionTitle>
                    <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Formato de nota</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {bc.invoiceFormat ? INVOICE_FORMAT_LABEL[bc.invoiceFormat] : '—'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Regime tributário</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{bc.taxRegime || '—'}</Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">E-mail financeiro</Typography>
                        {bc.billingEmail ? (
                          <Typography
                            variant="body2"
                            component="a"
                            href={`mailto:${bc.billingEmail}`}
                            sx={{ display: 'block', fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}
                          >
                            {bc.billingEmail}
                          </Typography>
                        ) : (
                          <Typography variant="body2">—</Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Contato financeiro</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{bc.billingContact || '—'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {bc.notes && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderColor: 'warning.light', bgcolor: 'warning.50' }}>
                    <CardContent sx={{ py: '12px !important' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <ErrorOutlineIcon sx={{ fontSize: 18, color: 'warning.main', mt: 0.2 }} />
                        <Box>
                          <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 700 }}>
                            Observações de Faturamento
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.3 }}>{bc.notes}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" size="small" startIcon={<ReceiptIcon />} onClick={() => navigate('/billing/invoices')}>
                    Ver faturas desta conta
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {/* ── Tab 3 — Grupo ── */}
      {activeTab === 3 && (
        <Stack spacing={2}>
          {account.parentAccount && (
            <Card variant="outlined">
              <CardContent>
                <SectionTitle>Empresa Controladora</SectionTitle>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 16, fontWeight: 700 }}>
                      {account.parentAccount.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {account.parentAccount.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {account.parentAccount.industry} · {account.parentAccount.tier}
                      </Typography>
                    </Box>
                  </Box>
                  <Button size="small" onClick={() => navigate(`/accounts/${account.parentAccount!.id}`)}>
                    Ver empresa
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {account.childAccounts && account.childAccounts.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <SectionTitle>Empresas do Grupo / Subsidiárias</SectionTitle>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {account.childAccounts.map((child) => (
                    <Box
                      key={child.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                          {child.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{child.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {child.cnpj && `CNPJ: ${child.cnpj} · `}
                            {child.industry}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={child.tier} size="small" color={TIER_COLOR[child.tier]} />
                        <Button size="small" onClick={() => navigate(`/accounts/${child.id}`)}>
                          Ver
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {!account.parentAccount && (!account.childAccounts || account.childAccounts.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <GroupIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">
                Esta empresa não possui vínculo com grupo empresarial
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      {/* ── Tab 4 — Contatos ── */}
      {activeTab === 4 && (
        <Card variant="outlined">
          <CardContent>
            {/* Header da aba com botão de adicionar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: contacts.length > 0 ? 1.5 : 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {contacts.length === 0 ? 'Nenhum contato vinculado' : `${contacts.length} contato${contacts.length > 1 ? 's' : ''}`}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                onClick={openNewContact}
              >
                Adicionar contato
              </Button>
            </Box>

            {contacts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <ContactPageIcon sx={{ fontSize: 44, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Esta empresa ainda não tem contatos vinculados.
                </Typography>
                <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={openNewContact}>
                  Adicionar primeiro contato
                </Button>
              </Box>
            ) : (
              <Stack divider={<Divider />} spacing={0}>
                {contacts.map((contact) => (
                  <Box
                    key={contact.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={contact.avatar} sx={{ width: 38, height: 38, fontSize: 15 }}>
                        {contact.fullName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {contact.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.jobTitle || 'Cargo não informado'}
                          {contact.email && ` · ${contact.email}`}
                        </Typography>
                      </Box>
                    </Box>
                    <Button size="small" onClick={() => navigate(`/contacts/${contact.id}`)}>
                      Ver contato
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Modal Novo Contato ── */}
      <Dialog open={newContactOpen} onClose={() => setNewContactOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>
          Novo Contato
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400, mt: 0.2 }}>
            Vinculado a {account?.name}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            {newContactError && (
              <Alert severity="error" onClose={() => setNewContactError(null)}>{newContactError}</Alert>
            )}

            {/* Indicador de vínculo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.2, borderRadius: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
              <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                Empresa: {account?.name} — vínculo automático
              </Typography>
            </Box>

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome *"
                  size="small"
                  fullWidth
                  value={newContactForm.firstName}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, firstName: e.target.value }))}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sobrenome *"
                  size="small"
                  fullWidth
                  value={newContactForm.lastName}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="E-mail *"
                  size="small"
                  fullWidth
                  type="email"
                  value={newContactForm.email}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  size="small"
                  fullWidth
                  value={newContactForm.phone || ''}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Celular"
                  size="small"
                  fullWidth
                  value={newContactForm.mobilePhone || ''}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, mobilePhone: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cargo"
                  size="small"
                  fullWidth
                  value={newContactForm.jobTitle || ''}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, jobTitle: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Departamento"
                  size="small"
                  fullWidth
                  value={newContactForm.department || ''}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, department: e.target.value }))}
                />
              </Grid>
              {users.length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    label="Responsável"
                    size="small"
                    fullWidth
                    select
                    value={newContactForm.ownerId || ''}
                    onChange={(e) => setNewContactForm((p) => ({ ...p, ownerId: e.target.value }))}
                  >
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setNewContactOpen(false)} disabled={newContactSaving} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveNewContact}
            disabled={newContactSaving || !newContactForm.firstName.trim() || !newContactForm.email.trim()}
            startIcon={newContactSaving ? <CircularProgress size={14} color="inherit" /> : <PersonAddIcon />}
          >
            {newContactSaving ? 'Salvando...' : 'Criar contato'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <EditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        account={account}
        onSave={handleSave}
      />
    </Box>
  );
};

export default AccountDetailPage;
