import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  AutoAwesome as AIIcon,
  CallOutlined as CallOutlinedIcon,
  ChevronRight as ChevronRightIcon,
  EditNoteOutlined as EditNoteOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  EventOutlined as EventOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  LinkedIn as LinkedInIcon,
  LockOutlined as LockOutlinedIcon,
  MailOutline as MailOutlineIcon,
  MoreHoriz as MoreHorizIcon,
  OpenInNew as OpenInNewIcon,
  PersonOutlined as PersonIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  PostAddOutlined as PostAddOutlinedIcon,
  Search as SearchIcon,
  SmsOutlined as SmsOutlinedIcon,
  TaskAltOutlined as TaskAltOutlinedIcon,
  WhatsApp as WhatsAppIcon,
  WorkOutline as WorkIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import AccountFormModal from '../components/AccountFormModal';
import type {
  Account,
  Activity,
  Contact,
  ContactFormData,
  Deal,
  LifecycleStage,
  User,
} from '../types';
import { getMockContactPhoto, MOCK_CONTACT_PHOTO_FALLBACK } from '../utils/mockContactPhoto';

// ── Constantes de estilo ─────────────────────────────────────────────────────

interface TabPanelProps { children?: React.ReactNode; index: number; value: number }
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) =>
  value === index ? <Box sx={{ py: 1.5 }}>{children}</Box> : null;

const lifecycleLabel: Record<Contact['lifecycleStage'], string> = {
  subscriber: 'Subscriber', lead: 'Lead', mql: 'MQL', sql: 'SQL',
  opportunity: 'Oportunidade', customer: 'Cliente', evangelist: 'Evangelista',
};

const lifecycleColor: Record<Contact['lifecycleStage'], 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
  subscriber: 'default', lead: 'info', mql: 'warning', sql: 'warning',
  opportunity: 'secondary', customer: 'success', evangelist: 'success',
};

// ── Componente ──────────────────────────────────────────────────────────────

export const ContactDetailPageModel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode = id === 'new';
  const forceEditMode = new URLSearchParams(location.search).get('edit') === '1';

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(isCreateMode || forceEditMode);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<HTMLElement | null>(null);
  const [moreActionsAnchorEl, setMoreActionsAnchorEl] = useState<HTMLElement | null>(null);
  const [moreActionsSearch, setMoreActionsSearch] = useState('');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [activeQuickPanel, setActiveQuickPanel] = useState<'info' | null>(null);
  const [form, setForm] = useState<ContactFormData>({
    firstName: '', lastName: '', email: '', phone: '', mobilePhone: '',
    jobTitle: '', department: '', lifecycleStage: 'lead', leadSource: '',
    accountId: '', ownerId: '', tags: [], customFields: {},
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const [accountsRes, usersRes] = await Promise.all([
          mockApi.accounts.list(), mockApi.users.list(),
        ]);
        setAccounts(accountsRes.data || []);
        setUsers(usersRes.data || []);
        if (isCreateMode) {
          setContact(null); setActivities([]); setDeals([]); setIsEditing(true);
          setForm((prev) => ({
            ...prev,
            ownerId: usersRes.data?.[0]?.id || '',
            accountId: '',
            customFields: {},
          }));
          return;
        }
        setIsEditing(forceEditMode);
        const contactRes = await mockApi.contacts.getById(id);
        const [activityRes, dealsRes] = await Promise.all([
          mockApi.activities.listByContact(id), mockApi.deals.listByContact(id),
        ]);
        const loadedContact = contactRes.data || null;
        setContact(loadedContact);
        setActivities(activityRes.data || []);
        setDeals(dealsRes.data || []);
        if (loadedContact) {
          setForm({
            firstName: loadedContact.firstName, lastName: loadedContact.lastName,
            email: loadedContact.email, phone: loadedContact.phone || '',
            mobilePhone: loadedContact.mobilePhone || '', jobTitle: loadedContact.jobTitle || '',
            department: loadedContact.department || '', lifecycleStage: loadedContact.lifecycleStage,
            leadSource: loadedContact.leadSource || '', accountId: loadedContact.accountId || '',
            ownerId: loadedContact.ownerId || '', tags: loadedContact.tags || [],
            customFields: loadedContact.customFields || {},
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar contato');
      } finally { setLoading(false); }
    };
    load();
  }, [id, isCreateMode, forceEditMode]);

  const groupedActivities = useMemo(() => {
    const groups = new Map<string, Activity[]>();
    [...activities]
      .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
      .forEach((activity) => {
        const key = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
          .format(new Date(activity.activityDate));
        groups.set(key, [...(groups.get(key) || []), activity]);
      });
    return Array.from(groups.entries());
  }, [activities]);

  const openDeals = deals.filter((d) => d.status === 'open');
  const totalOpenValue = openDeals.reduce((acc, d) => acc + d.amount, 0);
  const primaryDeal = deals[0];
  const latestActivity = groupedActivities[0]?.[1]?.[0];

  const displayContact: Contact = contact ?? {
    firstName: form.firstName || 'Novo', lastName: form.lastName || 'Contato',
    fullName: `${form.firstName || 'Novo'} ${form.lastName || 'Contato'}`.trim(),
    email: form.email || 'email@empresa.com', phone: form.phone, mobilePhone: form.mobilePhone,
    jobTitle: form.jobTitle || 'Contato', department: form.department,
    lifecycleStage: (form.lifecycleStage || 'lead') as LifecycleStage,
    leadSource: form.leadSource, ownerId: form.ownerId || users[0]?.id || '',
    owner: users.find((u) => u.id === form.ownerId) || users[0],
    accountId: form.accountId || undefined,
    account: accounts.find((a) => a.id === form.accountId),
    leadScore: 0, tags: form.tags || [],
    customFields: form.customFields || {},
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  } as Contact;

  const aiSummary = latestActivity
    ? `Recentemente, ${displayContact.fullName} interagiu em "${latestActivity.subject}" (${latestActivity.type}). Há ${activities.length} atividade(s) registrada(s) — bom contexto para o próximo passo comercial.`
    : `Ainda não há atividades para ${displayContact.fullName}. Sugerimos iniciar uma ligação de descoberta e registrar as necessidades do cliente.`;

  const setField = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCustomField = (key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      customFields: {
        ...(prev.customFields || {}),
        [key]: value,
      },
    }));

  const moreActions = [
    { id: 'linkedin', label: 'Envolva-se no LinkedIn', icon: <LinkedInIcon fontSize="small" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon fontSize="small" />, locked: true },
    { id: 'sms', label: 'Registrar SMS', icon: <SmsOutlinedIcon fontSize="small" /> },
    { id: 'post', label: 'Registrar correio postal', icon: <PostAddOutlinedIcon fontSize="small" /> },
    { id: 'email', label: 'Registrar e-mail', icon: <MailOutlineIcon fontSize="small" /> },
  ];
  const filteredMoreActions = moreActions.filter((a) =>
    a.label.toLowerCase().includes(moreActionsSearch.trim().toLowerCase())
  );

  const formatFieldValue = (value: unknown, fallback = 'Nao informado'): string => {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value)) {
      const cleaned = value.filter((item) => item !== null && item !== undefined && String(item).trim() !== '');
      return cleaned.length > 0 ? cleaned.map((item) => String(item)).join(', ') : fallback;
    }
    if (typeof value === 'boolean') return value ? 'Sim' : 'Nao';
    const text = String(value).trim();
    return text.length > 0 ? text : fallback;
  };

  const getCustomField = (keys: string[]): unknown => {
    const customFields = (displayContact.customFields || {}) as Record<string, unknown>;
    for (const key of keys) {
      if (customFields[key] !== undefined && customFields[key] !== null) {
        return customFields[key];
      }
    }
    return undefined;
  };

  const socialSellingFields: Array<{ label: string; key: string; multiline?: boolean; rows?: number }> = [
    { label: 'Hobbies', key: 'hobbies' },
    { label: 'Preferencias', key: 'preferencias' },
    { label: 'Lugares que frequenta', key: 'lugaresQueFrequenta' },
    { label: 'Escolas que passou', key: 'escolasQuePassou' },
    { label: 'Estado civil', key: 'estadoCivil' },
    { label: 'Filhos', key: 'nomesFilhos' },
    { label: 'Conjuge', key: 'nomeConjuge' },
    { label: 'Namorado(a)', key: 'nomeNamorado' },
    { label: 'Outros temas do social selling', key: 'outrosTemasSocialSelling', multiline: true, rows: 3 },
  ];

  const handleQuickAction = async (actionId: string) => {
    if (!contact?.id) { setActionError('Salve o contato antes de registrar atividades.'); return; }
    const actionMap: Record<string, { type: Activity['type']; subject: string; description: string }> = {
      linkedin: { type: 'note', subject: 'Interação no LinkedIn', description: 'Engajamento via ação rápida.' },
      whatsapp: { type: 'whatsapp', subject: 'Mensagem de WhatsApp', description: 'WhatsApp iniciado via ação rápida.' },
      sms: { type: 'sms', subject: 'SMS registrado', description: 'Envio de SMS via ação rápida.' },
      post: { type: 'note', subject: 'Correio postal registrado', description: 'Ação de correio postal.' },
      email: { type: 'email', subject: 'E-mail registrado', description: 'Registro de e-mail via ação rápida.' },
    };
    const mapped = actionMap[actionId];
    if (!mapped) return;
    try {
      setActionError(null);
      const created = await mockApi.activities.create({
        type: mapped.type, subject: mapped.subject, description: mapped.description,
        relatedContactId: contact.id, relatedAccountId: contact.accountId,
        relatedDealId: deals[0]?.id, userId: contact.ownerId || users[0]?.id || '',
        user: contact.owner || users[0], isSystemGenerated: false,
        metadata: { source: 'contact_quick_actions', action: actionId },
      });
      if (created.data) { setActivities((prev) => [created.data!, ...prev]); setActionMessage(`${mapped.subject} adicionada.`); }
      setMoreActionsAnchorEl(null); setMoreActionsSearch('');
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Erro ao registrar atividade'); }
  };

  const handleHeaderAction = async (actionId: string) => {
    if (!contact?.id && actionId !== 'export') { setActionError('Salve o contato antes de executar ações.'); return; }
    try {
      setActionError(null); setActionMessage(null);
      if (actionId === 'import_linkedin') {
        const updated = await mockApi.contacts.update(contact!.id, {
          leadSource: 'LinkedIn Import',
          tags: Array.from(new Set([...(contact!.tags || []), 'LinkedIn'])),
          customFields: { ...(contact!.customFields || {}), linkedinImportedAt: new Date().toISOString() },
        });
        if (updated.data) setContact(updated.data);
        const act = await mockApi.activities.create({
          type: 'enrichment', subject: 'Importação LinkedIn', description: 'Dados enriquecidos via LinkedIn.',
          relatedContactId: contact!.id, userId: contact!.ownerId || users[0]?.id || '',
          user: contact!.owner || users[0], isSystemGenerated: false, metadata: { source: 'linkedin_import' },
        });
        if (act.data) setActivities((prev) => [act.data!, ...prev]);
        setActionMessage('Dados do LinkedIn importados.');
      } else if (actionId === 'clone') {
        const c = contact!;
        const created = await mockApi.contacts.create({
          firstName: `${c.firstName} (Cópia)`, lastName: c.lastName, email: `copia+${Date.now()}_${c.email}`,
          phone: c.phone, mobilePhone: c.mobilePhone, jobTitle: c.jobTitle, department: c.department,
          accountId: c.accountId, ownerId: c.ownerId, lifecycleStage: c.lifecycleStage,
          leadSource: c.leadSource, tags: c.tags, customFields: c.customFields,
        });
        if (created.data?.id) navigate(`/contacts/${created.data.id}?edit=1`);
      } else if (actionId === 'delete') {
        if (!window.confirm('Excluir este contato?')) return;
        await mockApi.contacts.delete(contact!.id);
        navigate('/contacts'); return;
      } else if (actionId === 'export') {
        if (!contact) return;
        const blob = new Blob([JSON.stringify(contact, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `contato_${contact.id}.json`; a.click();
        URL.revokeObjectURL(url); setActionMessage('Dados exportados.');
      } else if (actionId === 'google') {
        const q = encodeURIComponent(`${contact!.fullName} ${contact!.email}`);
        window.open(`https://www.google.com/search?q=${q}`, '_blank');
      } else { setActionMessage('Ação registrada.'); }
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Erro ao executar ação'); }
    finally { setActionsAnchorEl(null); }
  };

  const validate = (): string | null => {
    if (!form.firstName?.trim()) return 'Primeiro nome obrigatório.';
    if (!form.lastName?.trim()) return 'Sobrenome obrigatório.';
    if (!form.email?.trim()) return 'E-mail obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'E-mail inválido.';
    return null;
  };

  const handleSave = async () => {
    const ve = validate(); if (ve) { setSaveError(ve); return; }
    try {
      setSaving(true); setSaveError(null); setSaveSuccess(null);
      if (isCreateMode) {
        const created = await mockApi.contacts.create({ ...form, accountId: form.accountId || undefined, ownerId: form.ownerId || undefined });
        if (created.data?.id) { navigate(`/contacts/${created.data.id}`); return; }
      } else if (id) {
        const updated = await mockApi.contacts.update(id, { ...form, accountId: form.accountId || undefined, ownerId: form.ownerId || undefined });
        if (updated.data) setContact(updated.data);
        setIsEditing(false); setSaveSuccess('Contato atualizado com sucesso.');
      }
    } catch (err) { setSaveError(err instanceof Error ? err.message : 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  if (error || (!contact && !isCreateMode)) return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">{error || 'Contato não encontrado'}
        <Button size="small" onClick={() => navigate('/contacts')} sx={{ ml: 1.5 }}>Voltar</Button>
      </Alert>
    </Box>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 1, md: 1.5 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/contacts')} size="small"
        sx={{ color: 'text.secondary', mb: 1, '&:hover': { color: 'primary.main' } }}>
        Contatos
      </Button>

      {/* Layout 3 colunas */}
      <Box sx={{
        border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '340px 1fr 280px' },
        bgcolor: 'background.paper',
      }}>

        {/* ── Coluna esquerda — Perfil ─────────────────────────────────── */}
        <Box sx={{ borderRight: { xl: '1px solid' }, borderColor: { xl: 'divider' }, bgcolor: 'background.default' }}>

          {/* Header coluna esquerda */}
          <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Perfil</Typography>
            <Button size="small" variant="text" color="inherit" sx={{ minWidth: 'auto', p: 0, fontSize: 12, fontWeight: 600 }}
              onClick={(e) => setActionsAnchorEl(e.currentTarget)}>
              Ações <ExpandMoreIcon sx={{ fontSize: 14, ml: 0.2, mb: -0.3 }} />
            </Button>
          </Box>

          {/* Avatar + nome */}
          <Box sx={{ px: 2, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Avatar
                src={getMockContactPhoto(isCreateMode ? form.email || form.firstName : displayContact.id)}
                alt={displayContact.fullName}
                sx={{ width: 60, height: 60, border: '2px solid', borderColor: 'divider' }}
                imgProps={{ referrerPolicy: 'no-referrer', onError: (e) => { (e.currentTarget as HTMLImageElement).src = MOCK_CONTACT_PHOTO_FALLBACK; } }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}>
                  {displayContact.fullName}
                </Typography>
                {displayContact.jobTitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayContact.jobTitle}{displayContact.account?.name ? ` · ${displayContact.account.name}` : ''}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, mt: 0.2, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayContact.email}
                </Typography>
              </Box>
            </Box>

            {/* Lifecycle chip + lead score */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Chip
                label={lifecycleLabel[displayContact.lifecycleStage]}
                color={lifecycleColor[displayContact.lifecycleStage]}
                size="small" variant="outlined"
              />
              {(displayContact.leadScore ?? 0) > 0 && (
                <Chip
                  label={`Score ${displayContact.leadScore}`}
                  size="small"
                  sx={{
                    bgcolor: (displayContact.leadScore ?? 0) >= 70 ? '#F0FDF4' : (displayContact.leadScore ?? 0) >= 40 ? '#FFFBEB' : '#FEF2F2',
                    color: (displayContact.leadScore ?? 0) >= 70 ? '#16A34A' : (displayContact.leadScore ?? 0) >= 40 ? '#D97706' : '#DC2626',
                    border: '1px solid',
                    borderColor: (displayContact.leadScore ?? 0) >= 70 ? '#16A34A40' : (displayContact.leadScore ?? 0) >= 40 ? '#D9770640' : '#DC262640',
                    fontWeight: 700,
                  }}
                />
              )}
            </Stack>

            {/* Ações rápidas */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.6, mt: 1.5 }}>
              {[
                { label: 'Nota', icon: <EditNoteOutlinedIcon sx={{ fontSize: 18 }} />, id: 'note' },
                { label: 'E-mail', icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} />, id: 'email' },
                { label: 'Ligação', icon: <CallOutlinedIcon sx={{ fontSize: 18 }} />, id: 'call' },
                { label: 'Tarefa', icon: <TaskAltOutlinedIcon sx={{ fontSize: 18 }} />, id: 'task' },
                { label: 'Mais', icon: <MoreHorizIcon sx={{ fontSize: 18 }} />, id: 'more' },
              ].map((item) => (
                <Tooltip key={item.id} title={item.label} placement="top">
                  <Box sx={{ textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      sx={{ width: 36, height: 36, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' } }}
                      onClick={(e) => { if (item.id === 'more') setMoreActionsAnchorEl(e.currentTarget); }}
                    >
                      {item.icon}
                    </IconButton>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, fontSize: 10 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Informações essenciais */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8, mb: 1.2, display: 'block' }}>
              Dados de contato
            </Typography>
            <Stack spacing={1.2}>
              {[
                { icon: <EmailOutlinedIcon sx={{ fontSize: 15 }} />, label: 'E-mail', value: displayContact.email },
                { icon: <PhoneOutlinedIcon sx={{ fontSize: 15 }} />, label: 'Telefone', value: displayContact.mobilePhone || displayContact.phone || '--' },
                { icon: <WorkIcon sx={{ fontSize: 15 }} />, label: 'Empresa', value: displayContact.account?.name || '--' },
                { icon: <PersonIcon sx={{ fontSize: 15 }} />, label: 'Proprietário', value: displayContact.owner?.fullName || '--' },
              ].map(({ icon, label, value }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ color: 'text.disabled', mt: 0.1, flexShrink: 0 }}>{icon}</Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.3 }}>{value}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
            {!isCreateMode && !isEditing && (
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1.2 }}
                onClick={() => {
                  setTab(0);
                  setIsEditing(true);
                }}
              >
                Editar contato
              </Button>
            )}
          </Box>

          <Divider />

          {/* Links rápidos */}
          <List disablePadding dense>
            <ListItemButton
              selected={activeQuickPanel === 'info'}
              onClick={() => {
                setActiveQuickPanel((prev) => (prev === 'info' ? null : 'info'));
                setTab(0);
              }}
              sx={{
                py: 1,
                '&.Mui-selected': { bgcolor: '#F0F7FF' },
                '&.Mui-selected:hover': { bgcolor: '#E6F1FE' },
              }}
            >
              <ListItemText primary="Resumo do cliente" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
              <ChevronRightIcon
                fontSize="small"
                sx={{
                  color: activeQuickPanel === 'info' ? 'primary.main' : 'text.disabled',
                  transform: activeQuickPanel === 'info' ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </ListItemButton>
          </List>

          {activeQuickPanel === 'info' && (
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#F8FBFF', borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8 }}>
                  Resumo do cliente
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setTab(0)}
                >
                  Ver detalhes
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'grid', gap: 0.8 }}>
                {[
                  { label: 'Fase do ciclo', value: lifecycleLabel[displayContact.lifecycleStage] },
                  { label: 'Fonte do lead', value: displayContact.leadSource || 'Nao informado' },
                  { label: 'Papel no comite', value: displayContact.buyingCommitteeRole || 'Nao informado' },
                  { label: 'Tags', value: displayContact.tags?.length ? displayContact.tags.join(', ') : 'Nao informado' },
                  {
                    label: 'Ultimo contato',
                    value: displayContact.lastContactedAt
                      ? new Date(displayContact.lastContactedAt).toLocaleDateString('pt-BR')
                      : 'Nao informado',
                  },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1, bgcolor: 'background.paper' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.2 }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.35 }}>
                      {formatFieldValue(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

        </Box>

        {/* ── Coluna central — Conteúdo ────────────────────────────────── */}
        <Box sx={{ borderRight: { xl: '1px solid' }, borderColor: { xl: 'divider' } }}>
          {/* Header com tabs + botões */}
          <Box sx={{ px: 1.5, py: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
              sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, px: 1.5, fontWeight: 600 }, '& .MuiTabs-indicator': { height: 2.5 } }}>
              <Tab label="Sobre" />
              <Tab label="Timeline" />
              <Tab label="Receita" />
              <Tab label="Comportamento Digital" />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              {!isCreateMode && !isEditing && (
                <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>Editar</Button>
              )}
              {(isCreateMode || isEditing) && (
                <>
                  {!isCreateMode && (
                    <Button size="small" variant="text" color="inherit" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  )}
                  <Button size="small" variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando…' : isCreateMode ? 'Criar contato' : 'Salvar'}
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* ── Aba: Sobre ─── */}
          <TabPanel value={tab} index={0}>
            <Box sx={{ px: 1.5 }}>
              {/* Alertas */}
              {[
                actionError && { sev: 'error' as const, msg: actionError, onClose: () => setActionError(null) },
                actionMessage && { sev: 'success' as const, msg: actionMessage, onClose: () => setActionMessage(null) },
                saveError && { sev: 'error' as const, msg: saveError, onClose: () => setSaveError(null) },
                saveSuccess && { sev: 'success' as const, msg: saveSuccess, onClose: () => setSaveSuccess(null) },
              ].filter(Boolean).map((a, i) => a && (
                <Alert key={i} severity={a.sev} sx={{ mb: 1 }} onClose={a.onClose}>{a.msg}</Alert>
              ))}

              {/* AI Summary */}
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AIIcon sx={{ color: '#7C3AED', fontSize: 18 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Resumo inteligente</Typography>
                  </Box>
                  <Chip label="IA" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 700 }} />
                </Box>
                <Box sx={{ bgcolor: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 1.5, p: 1.2 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
                    Gerado em {new Date().toLocaleDateString('pt-BR')}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>{aiSummary}</Typography>
                </Box>
              </Box>

              {/* Dados do contato */}
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Dados do contato</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.4 }}>
                  {/* Nome */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Primeiro nome</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.firstName}</Typography>}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Sobrenome</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.lastName}</Typography>}
                  </Box>

                  {/* E-mail */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>E-mail</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.email} onChange={(e) => setField('email', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3, wordBreak: 'break-word' }}>{displayContact.email}</Typography>}
                  </Box>

                  {/* Celular */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Celular</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.mobilePhone || ''} onChange={(e) => setField('mobilePhone', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.mobilePhone || '--'}</Typography>}
                  </Box>

                  {/* Cargo */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Cargo</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.jobTitle || ''} onChange={(e) => setField('jobTitle', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.jobTitle || '--'}</Typography>}
                  </Box>

                  {/* Departamento */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Departamento</Typography>
                    {isEditing || isCreateMode
                      ? <TextField size="small" fullWidth value={form.department || ''} onChange={(e) => setField('department', e.target.value)} sx={{ mt: 0.5 }} />
                      : <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.department || '--'}</Typography>}
                  </Box>

                  {/* Empresa */}
                  <Box sx={{ gridColumn: { sm: '1 / -1', md: 'auto' } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Empresa</Typography>
                    {isEditing || isCreateMode ? (
                      <Box sx={{ display: 'flex', gap: 0.8, mt: 0.5 }}>
                        <Autocomplete size="small" fullWidth options={accounts} getOptionLabel={(o) => o.name}
                          value={accounts.find((a) => a.id === form.accountId) || null}
                          onChange={(_, v) => setField('accountId', v?.id || '')}
                          renderInput={(params) => <TextField {...params} placeholder="Buscar empresa…" />} />
                        <Button variant="outlined" size="small" onClick={() => setAccountModalOpen(true)} sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Nova</Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3 }}>{displayContact.account?.name || '--'}</Typography>
                    )}
                  </Box>

                  {/* Lifecycle */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Fase do ciclo de vida</Typography>
                    {isEditing || isCreateMode ? (
                      <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                        <Select value={form.lifecycleStage || 'lead'} onChange={(e) => setField('lifecycleStage', e.target.value as LifecycleStage)}>
                          {Object.entries(lifecycleLabel).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                        </Select>
                      </FormControl>
                    ) : (
                      <Box sx={{ mt: 0.3 }}>
                        <Chip label={lifecycleLabel[displayContact.lifecycleStage]} size="small" color={lifecycleColor[displayContact.lifecycleStage]} variant="outlined" />
                      </Box>
                    )}
                  </Box>

                  {/* Proprietário */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Proprietário</Typography>
                    {isEditing || isCreateMode ? (
                      <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                        <Select value={form.ownerId || ''} onChange={(e) => setField('ownerId', e.target.value)}>
                          {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>)}
                        </Select>
                      </FormControl>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                        <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>
                          {displayContact.owner?.fullName?.charAt(0) || '?'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{displayContact.owner?.fullName || '--'}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: 1.5, mt: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.3 }}>Dados pessoais (Social Selling)</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  Use estes campos para registrar contexto pessoal e fortalecer relacionamento.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.2 }}>
                  {socialSellingFields.map(({ label, key, multiline, rows }) => {
                    const rawValue = (form.customFields as Record<string, unknown> | undefined)?.[key];
                    const inputValue =
                      typeof rawValue === 'string'
                        ? rawValue
                        : Array.isArray(rawValue)
                          ? rawValue.join(', ')
                          : rawValue === null || rawValue === undefined
                            ? ''
                            : String(rawValue);

                    return (
                      <Box key={key} sx={{ gridColumn: multiline ? { md: '1 / -1' } : undefined }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {label}
                        </Typography>
                        {(isEditing || isCreateMode) ? (
                          <TextField
                            size="small"
                            fullWidth
                            multiline={Boolean(multiline)}
                            minRows={rows}
                            value={inputValue}
                            placeholder={multiline ? 'Descreva temas e observacoes relevantes...' : 'Digite um valor'}
                            onChange={(e) => setCustomField(key, e.target.value)}
                            sx={{ mt: 0.5 }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.3, lineHeight: 1.35 }}>
                            {formatFieldValue(rawValue)}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* ── Aba: Atividades ─── */}
          <TabPanel value={tab} index={1}>
            <Box sx={{ px: 1.5 }}>
              <TextField size="small" placeholder="Pesquisar atividades…" sx={{ mb: 1.5, width: { xs: '100%', sm: 260 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
              {groupedActivities.length === 0 ? (
                <Box sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 3, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Nenhuma atividade registrada para este contato.</Typography>
                </Box>
              ) : groupedActivities.map(([month, monthActivities]) => (
                <Box key={month} sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', letterSpacing: 0.8, mb: 0.8, display: 'block' }}>
                    {month}
                  </Typography>
                  <Stack spacing={0.8}>
                    {monthActivities.map((activity) => (
                      <Box key={activity.id} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 1.5, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{activity.subject}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                            {new Date(activity.activityDate).toLocaleString('pt-BR')}
                          </Typography>
                        </Box>
                        {activity.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{activity.description}</Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </TabPanel>

          {/* ── Aba: Receita ─── */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ px: 1.5 }}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Receita associada</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                  {[
                    { label: 'Negócios abertos', value: openDeals.length },
                    { label: 'Valor total aberto', value: `R$ ${totalOpenValue.toLocaleString('pt-BR')}` },
                    { label: 'Principal negócio', value: primaryDeal?.title || '--' },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ p: 1.2, bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.3 }}>{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* ── Aba: Comportamento Digital ─── */}
          <TabPanel value={tab} index={3}>
            <Box sx={{ px: 1.5 }}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                  <AIIcon sx={{ color: '#7C3AED', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Comportamento digital do contato</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
                  {[
                    { label: 'Lead Score', value: displayContact.leadScore ?? '--' },
                    { label: 'Fonte do lead', value: displayContact.leadSource || '--' },
                    { label: 'Última atividade', value: displayContact.lastActivityAt ? new Date(displayContact.lastActivityAt).toLocaleDateString('pt-BR') : '--' },
                    { label: 'Total de atividades', value: activities.length },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ p: 1.2, bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.3 }}>{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </Box>

        {/* ── Coluna direita — Relacionamentos ─────────────────────────── */}
        <Box sx={{ bgcolor: 'background.default', p: 1.2 }}>

          {/* Empresas */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', mb: 1.2 }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Empresas {displayContact.account ? <Chip label="1" size="small" sx={{ ml: 0.5, height: 18, fontSize: 10 }} /> : <Chip label="0" size="small" sx={{ ml: 0.5, height: 18, fontSize: 10 }} />}
              </Typography>
              <IconButton size="small" onClick={() => setAccountModalOpen(true)}><AddIcon fontSize="small" /></IconButton>
            </Box>
            <Divider />
            <Box sx={{ p: 1.2 }}>
              {displayContact.account ? (
                <Box sx={{ p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.3 }}>{displayContact.account.name}</Typography>
                  {displayContact.account.domain && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {displayContact.account.domain}
                    </Typography>
                  )}
                  <Button size="small" sx={{ mt: 0.5, p: 0, minWidth: 'auto', fontSize: 12 }} endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}>
                    Ver empresa
                  </Button>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">Nenhuma empresa associada.</Typography>
              )}
            </Box>
          </Box>

          {/* Negócios */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', mb: 1.2 }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Negócios</Typography>
                <Chip label={deals.length} size="small" sx={{ height: 18, fontSize: 10 }} />
              </Box>
              <IconButton size="small" onClick={() => navigate('/deals?action=new')}><AddIcon fontSize="small" /></IconButton>
            </Box>
            <Divider />
            <Box sx={{ p: 1.2 }}>
              {primaryDeal ? (
                <Stack spacing={0.8}>
                  {deals.slice(0, 3).map((deal) => (
                    <Box key={deal.id} sx={{ p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
                      onClick={() => navigate(`/deals/${deal.id}`)}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.3 }}>{deal.title}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{deal.stage?.name || '--'}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>R$ {deal.amount.toLocaleString('pt-BR')}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {deals.length > 3 && (
                    <Button size="small" onClick={() => navigate('/deals')} sx={{ alignSelf: 'flex-start', p: 0, fontSize: 12 }}>
                      +{deals.length - 3} negócios
                    </Button>
                  )}
                </Stack>
              ) : (
                <Typography variant="caption" color="text.secondary">Nenhum negócio associado.</Typography>
              )}
            </Box>
          </Box>

          {/* Atividades resumo */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Atividades</Typography>
                <Chip label={activities.length} size="small" sx={{ height: 18, fontSize: 10 }} />
              </Box>
              <Button size="small" sx={{ fontSize: 12, p: 0, minWidth: 'auto' }} onClick={() => setTab(1)}>Ver todas</Button>
            </Box>
            <Divider />
            <Box sx={{ p: 1.2 }}>
              {latestActivity ? (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.3 }}>Última atividade</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{latestActivity.subject}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(latestActivity.activityDate).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">Sem atividades registradas.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Popovers ─────────────────────────────────────────────────────── */}
      <Popover open={Boolean(actionsAnchorEl)} anchorEl={actionsAnchorEl} onClose={() => setActionsAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 280, borderRadius: 2, border: '1px solid', borderColor: 'divider', mt: 0.8 } }}>
        <List dense disablePadding>
          {[
            { id: 'follow', label: 'Seguir' }, { id: 'all_properties', label: 'Exibir todas as propriedades' },
            { id: 'property_history', label: 'Histórico de propriedade' }, { id: 'summarize', label: 'Resumir' },
          ].map((item, i) => (
            <React.Fragment key={item.id}>
              <ListItemButton onClick={() => handleHeaderAction(item.id)}>
                <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
              {(i === 0 || i === 2) && <Divider />}
            </React.Fragment>
          ))}
          <Divider />
          {[{ id: 'clone', label: 'Clonar' }, { id: 'export', label: 'Exportar dados' }, { id: 'import_linkedin', label: 'Importar LinkedIn' }].map((item) => (
            <ListItemButton key={item.id} onClick={() => handleHeaderAction(item.id)}>
              <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
          <Divider />
          <ListItemButton onClick={() => handleHeaderAction('delete')}>
            <ListItemText primary="Excluir contato" primaryTypographyProps={{ variant: 'body2', color: 'error.main' }} />
          </ListItemButton>
        </List>
      </Popover>

      <Popover open={Boolean(moreActionsAnchorEl)} anchorEl={moreActionsAnchorEl}
        onClose={() => { setMoreActionsAnchorEl(null); setMoreActionsSearch(''); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 360, borderRadius: 2, border: '1px solid', borderColor: 'divider', mt: 0.8 } }}>
        <Box sx={{ p: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField size="small" fullWidth placeholder="Pesquisar" value={moreActionsSearch}
            onChange={(e) => setMoreActionsSearch(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon fontSize="small" /></InputAdornment> }} />
        </Box>
        <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
          {filteredMoreActions.map((action) => (
            <ListItemButton key={action.id} onClick={() => handleQuickAction(action.id)}>
              <ListItemIcon sx={{ minWidth: 32 }}>{action.icon}</ListItemIcon>
              <ListItemText primary={action.label} primaryTypographyProps={{ variant: 'body2' }} />
              {action.locked && <LockOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
              <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            </ListItemButton>
          ))}
        </List>
      </Popover>

      <AccountFormModal open={accountModalOpen} onClose={() => setAccountModalOpen(false)}
        onCreated={async (created) => {
          const res = await mockApi.accounts.list(); setAccounts(res.data || []);
          setField('accountId', created.id); setAccountModalOpen(false);
        }} />
    </Box>
  );
};

export default ContactDetailPageModel;
