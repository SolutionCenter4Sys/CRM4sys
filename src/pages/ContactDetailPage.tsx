import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  Tag as TagIcon,
  OpenInNew as OpenInNewIcon,
  WorkOutline as WorkOutlineIcon,
  AccountBalance as AccountBalanceIcon,
  ContactPage as ContactPageIcon,
  CameraAlt as CameraAltIcon,
  CheckCircleOutline as CheckCircleIcon,
  PersonOff as PersonOffIcon,
  Work as WorkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Contact, Activity, Deal, ContactFormData } from '../types';
import { ContactFormModal } from '../components/ContactFormModal';

// ── helpers ─────────────────────────────────────────────────────────────────

const fmtCurrency = (v?: number) =>
  v != null
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : '—';

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');
const fmtDateTime = (d?: string) => (d ? new Date(d).toLocaleString('pt-BR') : '—');

const LIFECYCLE_LABEL: Record<string, string> = {
  subscriber: 'Assinante',
  lead: 'Lead',
  mql: 'MQL',
  sql: 'SQL',
  opportunity: 'Oportunidade',
  customer: 'Cliente',
  evangelist: 'Evangelista',
};

const LIFECYCLE_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  subscriber: 'default',
  lead: 'default',
  mql: 'warning',
  sql: 'warning',
  opportunity: 'primary',
  customer: 'success',
  evangelist: 'success',
};

const WORK_MODEL_LABEL: Record<string, string> = {
  remote: 'Remoto',
  'on-site': 'Presencial',
  hybrid: 'Híbrido',
};

const DEAL_STATUS_COLOR: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  open: 'primary',
  won: 'success',
  lost: 'error',
};

const DEAL_STATUS_LABEL: Record<string, string> = {
  open: 'Aberto',
  won: 'Ganho',
  lost: 'Perdido',
};

// ── subcomponents ────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ fontWeight: 700, fontSize: 10, letterSpacing: 1 }}
  >
    {children}
  </Typography>
);

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  href?: string;
}> = ({ icon, label, value, href }) => {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 0.5 }}>
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
            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
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

const KpiCard: React.FC<{ label: string; value: React.ReactNode; color?: string }> = ({
  label, value, color,
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
      minWidth: 110,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 700, color: color || 'text.primary', lineHeight: 1.2 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {label}
    </Typography>
  </Box>
);

// ── Birthday alert helper ────────────────────────────────────────────────────

const getBirthdayAlert = (birthDate?: string): string | null => {
  if (!birthDate) return null;
  const today = new Date();
  const bday = new Date(birthDate);
  const nextBirthday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const diffDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '🎂 Aniversário hoje!';
  if (diffDays <= 7) return `🎂 Aniversário em ${diffDays} dia(s)!`;
  if (diffDays <= 30) return `Aniversário em ${diffDays} dias`;
  return null;
};

// ── Main Page ────────────────────────────────────────────────────────────────

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id) loadContact(id);
  }, [id]);

  const loadContact = async (contactId: string) => {
    try {
      setLoading(true);
      setError(null);
      const [contactRes, activitiesRes, dealsRes] = await Promise.all([
        mockApi.contacts.getById(contactId),
        mockApi.activities.listByContact(contactId),
        mockApi.deals.listByContact(contactId),
      ]);
      setContact(contactRes.data || null);
      setAvatarSrc(contactRes.data?.avatar);
      setActivities(activitiesRes.data || []);
      setDeals(dealsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contato');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ContactFormData) => {
    if (!id) return;
    await mockApi.contacts.update(id, data);
    await loadContact(id);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setAvatarSrc(src);
      if (id) mockApi.contacts.update(id, { avatar: src });
    };
    reader.readAsDataURL(file);
  };

  const activitiesByMonth = useMemo(() => {
    const groups = new Map<string, Activity[]>();
    [...activities]
      .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
      .forEach((activity) => {
        const key = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
          .format(new Date(activity.activityDate));
        const cur = groups.get(key) || [];
        cur.push(activity);
        groups.set(key, cur);
      });
    return Array.from(groups.entries());
  }, [activities]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !contact) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Contato não encontrado.'}
          <Button size="small" onClick={() => navigate('/contacts')} sx={{ ml: 2 }}>
            Voltar para lista
          </Button>
        </Alert>
      </Box>
    );
  }

  const birthdayAlert = getBirthdayAlert(contact.birthDate);
  const activeCompany = (contact.companyLinks || []).find((l) => l.isActive);
  const allCompanies = contact.companyLinks || [];
  const openDeals = deals.filter((d) => d.status === 'open');

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* ── Topo ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/contacts')} size="small">
          Voltar para Contatos
        </Button>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)} size="small">
          Editar
        </Button>
      </Box>

      {savedAlert && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSavedAlert(false)}>
          Alterações salvas com sucesso.
        </Alert>
      )}

      {birthdayAlert && (
        <Alert
          severity={birthdayAlert.startsWith('🎂 Aniversário hoje') ? 'success' : 'info'}
          sx={{ mb: 2 }}
          action={
            <Button size="small" color="inherit">
              Enviar mensagem
            </Button>
          }
        >
          {birthdayAlert}
        </Alert>
      )}

      {/* ── Hero Card ── */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar editável */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={avatarSrc}
                sx={{ width: 72, height: 72, fontSize: 28, fontWeight: 700, bgcolor: 'primary.main' }}
              >
                {contact.firstName.charAt(0)}
              </Avatar>
              <Tooltip title="Trocar foto">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: 24,
                    height: 24,
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </Box>

            {/* Info principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {contact.fullName}
                </Typography>
                {contact.contactCode && (
                  <Chip
                    label={contact.contactCode}
                    size="small"
                    variant="outlined"
                    icon={<TagIcon sx={{ fontSize: 12 }} />}
                    sx={{ height: 20, fontSize: 11, fontFamily: 'monospace' }}
                  />
                )}
                <Chip
                  label={LIFECYCLE_LABEL[contact.lifecycleStage] || contact.lifecycleStage}
                  color={LIFECYCLE_COLOR[contact.lifecycleStage] || 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              {/* Empresa ativa */}
              {activeCompany && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                  {activeCompany.jobTitle && `${activeCompany.jobTitle} · `}
                  {activeCompany.companyName}
                  {activeCompany.department && ` · ${activeCompany.department}`}
                </Typography>
              )}

              {/* Links rápidos */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {contact.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography
                      variant="caption"
                      component="a"
                      href={`mailto:${contact.email}`}
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {contact.email}
                    </Typography>
                  </Box>
                )}
                {contact.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{contact.phone}</Typography>
                  </Box>
                )}
                {contact.linkedin && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LinkedInIcon sx={{ fontSize: 14, color: '#0A66C2' }} />
                    <Typography
                      variant="caption"
                      component="a"
                      href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#0A66C2', textDecoration: 'none' }}
                    >
                      LinkedIn
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Lead Score */}
            <Box sx={{ textAlign: 'center', minWidth: 70 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={contact.leadScore}
                  size={56}
                  thickness={5}
                  color={contact.leadScore >= 70 ? 'success' : contact.leadScore >= 40 ? 'warning' : 'error'}
                />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{contact.leadScore}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                Lead Score
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* KPI strip */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <KpiCard label="Negócios abertos" value={openDeals.length} color={openDeals.length ? 'primary.main' : undefined} />
            <KpiCard
              label="Valor em negócios"
              value={fmtCurrency(openDeals.reduce((s, d) => s + d.amount, 0))}
              color="success.main"
            />
            <KpiCard label="Atividades" value={activities.length} />
            <KpiCard label="Empresas" value={allCompanies.length} />
            <KpiCard label="Empresas ativas" value={allCompanies.filter((c) => c.isActive).length} color="primary.main" />
          </Box>
        </CardContent>
      </Card>

      {/* ── Tabs ── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<ContactPageIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Sobre" />
          <Tab icon={<StarIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Timeline" />
          <Tab icon={<WorkOutlineIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Negócios (${deals.length})`} />
          <Tab icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Faturamento" />
          <Tab icon={<WorkIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Comportamento Digital" />
        </Tabs>
      </Box>

      {/* ── Tab 0 — Sobre ── */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          {/* Dados Pessoais */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <SectionTitle>Dados Pessoais</SectionTitle>
                </Box>
                <Stack spacing={0.2}>
                  {contact.contactCode && (
                    <InfoRow
                      icon={<TagIcon sx={{ fontSize: 18 }} />}
                      label="Código do contato"
                      value={contact.contactCode}
                    />
                  )}
                  <InfoRow
                    icon={<EmailIcon sx={{ fontSize: 18 }} />}
                    label="E-mail pessoal"
                    value={contact.email}
                    href={`mailto:${contact.email}`}
                  />
                  {contact.phone && (
                    <InfoRow icon={<PhoneIcon sx={{ fontSize: 18 }} />} label="Telefone" value={contact.phone} />
                  )}
                  {contact.mobilePhone && (
                    <InfoRow icon={<PhoneIcon sx={{ fontSize: 18 }} />} label="Celular" value={contact.mobilePhone} />
                  )}
                  {contact.linkedin && (
                    <InfoRow
                      icon={<LinkedInIcon sx={{ fontSize: 18, color: '#0A66C2' }} />}
                      label="LinkedIn"
                      value={contact.linkedin}
                      href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                    />
                  )}
                  {contact.birthDate && (
                    <InfoRow
                      icon={<CakeIcon sx={{ fontSize: 18 }} />}
                      label="Aniversário"
                      value={fmtDate(contact.birthDate)}
                    />
                  )}
                  {contact.address && (contact.address.city || contact.address.street) && (
                    <InfoRow
                      icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
                      label="Endereço"
                      value={[contact.address.street, contact.address.city, contact.address.state]
                        .filter(Boolean)
                        .join(', ')}
                    />
                  )}
                  <InfoRow
                    icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                    label="Criado em"
                    value={fmtDate(contact.createdAt)}
                  />
                  {contact.lastContactedAt && (
                    <InfoRow
                      icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                      label="Último contato"
                      value={fmtDateTime(contact.lastContactedAt)}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Classificação */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <SectionTitle>Classificação</SectionTitle>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Lead Score</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{contact.leadScore}/100</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={contact.leadScore}
                      color={contact.leadScore >= 70 ? 'success' : contact.leadScore >= 40 ? 'warning' : 'error'}
                      sx={{ borderRadius: 4, height: 6 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
                    <Chip
                      label={LIFECYCLE_LABEL[contact.lifecycleStage] || contact.lifecycleStage}
                      color={LIFECYCLE_COLOR[contact.lifecycleStage] || 'default'}
                      size="small"
                    />
                    {contact.leadSource && (
                      <Chip label={contact.leadSource} size="small" variant="outlined" />
                    )}
                    {contact.buyingCommitteeRole && (
                      <Chip label={contact.buyingCommitteeRole} size="small" variant="outlined" color="primary" />
                    )}
                  </Box>
                  {contact.tags?.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {contact.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {contact.owner && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Proprietário
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={contact.owner.avatar} sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {contact.owner.fullName?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{contact.owner.fullName}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Empresas de Atuação */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box>
                    <SectionTitle>Empresas de Atuação</SectionTitle>
                    <Typography variant="caption" color="text.secondary">
                      {allCompanies.length} empresa(s) · {allCompanies.filter((c) => c.isActive).length} ativa(s)
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
                    Gerenciar
                  </Button>
                </Box>

                {allCompanies.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <BusinessIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      Nenhuma empresa de atuação cadastrada
                    </Typography>
                    <Button variant="outlined" size="small" onClick={() => setEditOpen(true)}>
                      Adicionar empresa
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {allCompanies.map((link) => (
                      <Card
                        key={link.id}
                        variant="outlined"
                        sx={{
                          borderColor: link.isActive ? 'primary.main' : 'divider',
                          opacity: link.isActive ? 1 : 0.65,
                        }}
                      >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon
                                sx={{ fontSize: 18, color: link.isActive ? 'primary.main' : 'text.secondary' }}
                              />
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {link.companyName}
                                  </Typography>
                                  {link.isActive ? (
                                    <Chip label="Ativo" size="small" color="success" sx={{ height: 18, fontSize: 10 }} />
                                  ) : (
                                    <Chip label="Inativo" size="small" color="default" sx={{ height: 18, fontSize: 10 }} />
                                  )}
                                </Box>
                                {link.jobTitle && (
                                  <Typography variant="caption" color="text.secondary">
                                    {link.jobTitle}
                                    {link.department && ` · ${link.department}`}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {link.workModel && (
                                <Chip
                                  label={WORK_MODEL_LABEL[link.workModel]}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: 10 }}
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Details grid */}
                          <Grid container spacing={1} sx={{ mt: 0.5 }}>
                            {link.professionalEmail && (
                              <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">E-mail profissional</Typography>
                                <Typography
                                  variant="body2"
                                  component="a"
                                  href={`mailto:${link.professionalEmail}`}
                                  sx={{ display: 'block', color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}
                                >
                                  {link.professionalEmail}
                                </Typography>
                              </Grid>
                            )}
                            {link.startDate && (
                              <Grid item xs={12} sm={3}>
                                <Typography variant="caption" color="text.secondary">Início</Typography>
                                <Typography variant="body2">{fmtDate(link.startDate)}</Typography>
                              </Grid>
                            )}
                            {link.endDate && !link.isActive && (
                              <Grid item xs={12} sm={3}>
                                <Typography variant="caption" color="text.secondary">Saída</Typography>
                                <Typography variant="body2">{fmtDate(link.endDate)}</Typography>
                              </Grid>
                            )}
                            {link.competitors && (
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">Concorrentes</Typography>
                                <Typography variant="body2">{link.competitors}</Typography>
                              </Grid>
                            )}
                            {link.departmentObjective && (
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">Objetivo do departamento</Typography>
                                <Typography variant="body2">{link.departmentObjective}</Typography>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ── Tab 1 — Timeline ── */}
      {activeTab === 1 && (
        <Stack spacing={1.5}>
          {activitiesByMonth.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <StarIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Nenhuma atividade registrada para este contato.</Typography>
            </Box>
          ) : (
            activitiesByMonth.map(([month, monthActivities]) => (
              <Box key={month}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'capitalize', mb: 1 }}
                >
                  {month}
                </Typography>
                <Stack spacing={1}>
                  {monthActivities.map((activity) => (
                    <Card key={activity.id} variant="outlined">
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {activity.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fmtDateTime(activity.activityDate)}
                          </Typography>
                        </Box>
                        {activity.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                            {activity.description}
                          </Typography>
                        )}
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5, height: 18, fontSize: 10 }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      )}

      {/* ── Tab 2 — Negócios ── */}
      {activeTab === 2 && (
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <KpiCard label="Abertos" value={openDeals.length} color="primary.main" />
            <KpiCard label="Ganhos" value={deals.filter((d) => d.status === 'won').length} color="success.main" />
            <KpiCard label="Perdidos" value={deals.filter((d) => d.status === 'lost').length} color="error.main" />
            <KpiCard
              label="Valor (abertos)"
              value={fmtCurrency(openDeals.reduce((s, d) => s + d.amount, 0))}
              color="primary.main"
            />
          </Box>

          {deals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <WorkOutlineIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Nenhum negócio vinculado a este contato.</Typography>
            </Box>
          ) : (
            <Card variant="outlined">
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Stack divider={<Divider />}>
                  {deals.map((deal) => (
                    <Box
                      key={deal.id}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{deal.title}</Typography>
                          <Chip
                            label={DEAL_STATUS_LABEL[deal.status] || deal.status}
                            color={DEAL_STATUS_COLOR[deal.status] || 'default'}
                            size="small"
                            sx={{ height: 20, fontSize: 11 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {fmtCurrency(deal.amount)}
                          {deal.stage?.name && ` · ${deal.stage.name}`}
                          {deal.account?.name && ` · ${deal.account.name}`}
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => navigate(`/deals/${deal.id}`)}>
                        Ver negócio
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}

      {/* ── Tab 3 — Faturamento ── */}
      {activeTab === 3 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AccountBalanceIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Informações de faturamento serão exibidas aqui.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/billing/invoices')}>
            Ver faturas
          </Button>
        </Box>
      )}

      {/* ── Tab 4 — Comportamento Digital ── */}
      {activeTab === 4 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">
            Dados de comportamento digital (visitas, cliques, e-mails abertos) serão exibidos aqui.
          </Typography>
        </Box>
      )}

      {/* ── Edit Modal ── */}
      <ContactFormModal
        open={editOpen}
        mode="edit"
        initialData={contact}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSave}
      />
    </Box>
  );
};

export default ContactDetailPage;
