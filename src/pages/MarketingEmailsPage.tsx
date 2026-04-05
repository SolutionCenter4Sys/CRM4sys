import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  MailOutline,
  InfoOutlined,
  LocalOffer,
  Event,
  Newspaper,
  Search as SearchIcon,
  ExpandMore,
  ExpandLess,
  Close as CloseIcon,
  EmojiEvents,
  TrendingUp,
  AdsClick,
  ErrorOutline,
  AttachMoney,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { MarketingEmail, MarketingEmailStatus, EmailTemplateType } from '../types';

const STATUS_LABEL: Record<MarketingEmailStatus, string> = {
  draft: 'Rascunho',
  scheduled: 'Agendado',
  sending: 'Enviando',
  sent: 'Enviado',
  failed: 'Falha',
};

const STATUS_COLOR: Record<MarketingEmailStatus, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  draft: 'default',
  scheduled: 'info',
  sending: 'warning',
  sent: 'success',
  failed: 'error',
};

const TEMPLATE_LABEL: Record<EmailTemplateType, string> = {
  simple: 'Simples',
  informative: 'Informativo',
  promotional: 'Promocional',
  event: 'Evento',
  newsletter: 'Newsletter',
};

const TEMPLATE_COLOR: Record<EmailTemplateType, string> = {
  simple: '#9e9e9e',
  informative: '#1976d2',
  promotional: '#ed6c02',
  event: '#9c27b0',
  newsletter: '#2e7d32',
};

const TEMPLATE_GRADIENT: Record<EmailTemplateType, string> = {
  simple: 'linear-gradient(135deg, #9e9e9e 0%, #616161 100%)',
  informative: 'linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)',
  promotional: 'linear-gradient(135deg, #ffa726 0%, #e65100 100%)',
  event: 'linear-gradient(135deg, #ab47bc 0%, #6a1b9a 100%)',
  newsletter: 'linear-gradient(135deg, #66bb6a 0%, #1b5e20 100%)',
};

const TEMPLATE_ICON: Record<EmailTemplateType, React.ReactNode> = {
  simple: <MailOutline sx={{ fontSize: 32, color: '#fff' }} />,
  informative: <InfoOutlined sx={{ fontSize: 32, color: '#fff' }} />,
  promotional: <LocalOffer sx={{ fontSize: 32, color: '#fff' }} />,
  event: <Event sx={{ fontSize: 32, color: '#fff' }} />,
  newsletter: <Newspaper sx={{ fontSize: 32, color: '#fff' }} />,
};

const TEMPLATE_DESC: Record<EmailTemplateType, string> = {
  simple: 'Texto direto, ideal para comunicados rápidos.',
  informative: 'Layout com seções para conteúdo educativo.',
  promotional: 'Destaque para ofertas, CTAs e descontos.',
  event: 'Convite com data, horário e botão de inscrição.',
  newsletter: 'Curadoria de conteúdo com múltiplas seções.',
};

const ENGAGEMENT_LABEL: Record<string, string> = { high: 'Alto', medium: 'Médio', low: 'Baixo', unknown: '—' };
const ENGAGEMENT_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  high: 'success',
  medium: 'warning',
  low: 'error',
  unknown: 'default',
};

const fmtNum = (n: number) => n.toLocaleString('pt-BR');
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtBRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const fmtDate = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const MarketingEmailsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<MarketingEmail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<MarketingEmail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');

  const loadEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mockApi.marketingEmails.list();
      setEmails(res.data || []);
    } catch {
      setError('Erro ao carregar e-mails de marketing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEmails(); }, [loadEmails]);

  const filtered = useMemo(() => {
    let list = [...emails];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.subject.toLowerCase().includes(q) || e.recipientListName.toLowerCase().includes(q));
    }
    if (filterTemplate !== 'all') list = list.filter(e => e.templateType === filterTemplate);
    if (filterStatus !== 'all') list = list.filter(e => e.status === filterStatus);
    if (filterCampaign !== 'all') list = list.filter(e => e.campaignId === filterCampaign);
    return list;
  }, [emails, search, filterTemplate, filterStatus, filterCampaign]);

  const campaigns = useMemo(() => {
    const map = new Map<string, string>();
    emails.forEach(e => { if (e.campaignId && e.campaignName) map.set(e.campaignId, e.campaignName); });
    return Array.from(map.entries());
  }, [emails]);

  const sentEmails = useMemo(() => emails.filter(e => e.status === 'sent'), [emails]);

  const kpis = useMemo(() => {
    const totalSent = sentEmails.reduce((s, e) => s + e.metrics.sent, 0);
    const deliveryRateAvg = sentEmails.length
      ? sentEmails.reduce((s, e) => s + e.metrics.deliveryRate, 0) / sentEmails.length
      : 0;
    const openRateAvg = sentEmails.length
      ? sentEmails.reduce((s, e) => s + e.metrics.openRate, 0) / sentEmails.length
      : 0;
    const clickRateAvg = sentEmails.length
      ? sentEmails.reduce((s, e) => s + e.metrics.clickRate, 0) / sentEmails.length
      : 0;
    const ctorAvg = sentEmails.length
      ? sentEmails.reduce((s, e) => s + e.metrics.clickToOpenRate, 0) / sentEmails.length
      : 0;
    const totalBounced = sentEmails.reduce((s, e) => s + e.metrics.bounced, 0);
    const softBounced = sentEmails.reduce((s, e) => s + e.metrics.softBounced, 0);
    const hardBounced = sentEmails.reduce((s, e) => s + e.metrics.hardBounced, 0);
    const totalRevenue = sentEmails.reduce((s, e) => s + e.revenueAttributed, 0);
    const revenuePerEmail = totalSent > 0 ? totalRevenue / totalSent : 0;

    return { totalSent, deliveryRateAvg, openRateAvg, clickRateAvg, ctorAvg, totalBounced, softBounced, hardBounced, totalRevenue, revenuePerEmail };
  }, [sentEmails]);

  const handleRowClick = async (email: MarketingEmail) => {
    const res = await mockApi.marketingEmails.getById(email.id);
    setSelectedEmail(res.data || email);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>E-mail Marketing</Typography>
        <Typography variant="body2" color="text.secondary">
          {fmtNum(emails.length)} e-mail{emails.length !== 1 ? 's' : ''} cadastrado{emails.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Template Gallery */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, cursor: 'pointer' }}
          onClick={() => setGalleryOpen(p => !p)}
        >
          <Typography variant="subtitle1" fontWeight={600}>Galeria de Templates</Typography>
          <IconButton size="small">{galleryOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
        </Box>
        <Collapse in={galleryOpen}>
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            {(['simple', 'informative', 'promotional', 'event', 'newsletter'] as EmailTemplateType[]).map(tpl => (
              <Grid item xs={12} sm={6} md={2.4} key={tpl}>
                <Card variant="outlined" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {tpl === 'promotional' && (
                    <Chip
                      label="Recomendado"
                      size="small"
                      color="warning"
                      sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, fontWeight: 600, fontSize: 11 }}
                    />
                  )}
                  <Box
                    sx={{
                      height: 80,
                      background: TEMPLATE_GRADIENT[tpl],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {TEMPLATE_ICON[tpl]}
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>{TEMPLATE_LABEL[tpl]}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                      {TEMPLATE_DESC[tpl]}
                    </Typography>
                    <Button variant="outlined" size="small" fullWidth sx={{ mt: 1 }}>
                      Usar modelo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Paper>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <KpiCard
            icon={<TrendingUp />}
            color="#1976d2"
            title="Total Enviados"
            value={fmtNum(kpis.totalSent)}
            sub={`Taxa de entrega: ${fmtPct(kpis.deliveryRateAvg)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KpiCard
            icon={<MailOutline />}
            color="#2e7d32"
            title="Taxa de Abertura"
            value={fmtPct(kpis.openRateAvg)}
            sub="Média do setor: ~25%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KpiCard
            icon={<AdsClick />}
            color="#ed6c02"
            title="Taxa de Cliques"
            value={fmtPct(kpis.clickRateAvg)}
            sub={`CTOR médio: ${fmtPct(kpis.ctorAvg)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KpiCard
            icon={<ErrorOutline />}
            color="#d32f2f"
            title="Bounces"
            value={fmtNum(kpis.totalBounced)}
            sub={`${fmtNum(kpis.softBounced)} soft / ${fmtNum(kpis.hardBounced)} hard`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <KpiCard
            icon={<AttachMoney />}
            color="#9c27b0"
            title="Receita Atribuída"
            value={fmtBRL(kpis.totalRevenue)}
            sub={`${fmtBRL(kpis.revenuePerEmail)} por email`}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar assunto ou lista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Template</InputLabel>
              <Select value={filterTemplate} label="Template" onChange={e => setFilterTemplate(e.target.value)}>
                <MenuItem value="all">Todos</MenuItem>
                {Object.entries(TEMPLATE_LABEL).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} label="Status" onChange={e => setFilterStatus(e.target.value)}>
                <MenuItem value="all">Todos</MenuItem>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Campanha</InputLabel>
              <Select value={filterCampaign} label="Campanha" onChange={e => setFilterCampaign(e.target.value)}>
                <MenuItem value="all">Todas</MenuItem>
                {campaigns.map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell>Assunto</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Campanha</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Destinatários</TableCell>
              <TableCell align="right">Open Rate</TableCell>
              <TableCell align="right">Click Rate</TableCell>
              <TableCell>Engajamento</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum e-mail encontrado.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(email => (
                <TableRow
                  key={email.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(email)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {email.subject}
                      {email.isABTest && (
                        <Tooltip title="Teste A/B">
                          <span style={{ fontSize: 16 }}>🧪</span>
                        </Tooltip>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={TEMPLATE_LABEL[email.templateType]}
                      size="small"
                      sx={{ bgcolor: `${TEMPLATE_COLOR[email.templateType]}18`, color: TEMPLATE_COLOR[email.templateType], fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{email.campaignName || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={STATUS_LABEL[email.status]} size="small" color={STATUS_COLOR[email.status]} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{fmtNum(email.recipientCount)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: email.metrics.openRate > 30 ? '#2e7d32' : email.metrics.openRate > 20 ? '#ed6c02' : '#d32f2f' }}
                    >
                      {fmtPct(email.metrics.openRate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{fmtPct(email.metrics.clickRate)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ENGAGEMENT_LABEL[email.engagementPrediction]}
                      size="small"
                      color={ENGAGEMENT_COLOR[email.engagementPrediction]}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {fmtDate(email.sentAt || email.scheduledAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <EmailDetailDialog open={dialogOpen} email={selectedEmail} onClose={() => setDialogOpen(false)} />
    </Box>
  );
};

/* ======================== KPI Card ======================== */

interface KpiCardProps {
  icon: React.ReactNode;
  color: string;
  title: string;
  value: string;
  sub: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, color, title, value, sub }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          bgcolor: `${color}14`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" noWrap>{title}</Typography>
        <Typography variant="h6" fontWeight={700} noWrap>{value}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{sub}</Typography>
      </Box>
    </CardContent>
  </Card>
);

/* ======================== Detail Dialog ======================== */

interface EmailDetailDialogProps {
  open: boolean;
  email: MarketingEmail | null;
  onClose: () => void;
}

const EmailDetailDialog: React.FC<EmailDetailDialogProps> = ({ open, email, onClose }) => {
  if (!email) return null;

  const m = email.metrics;
  const funnel = [
    { label: 'Enviados', value: m.sent, color: '#1976d2' },
    { label: 'Entregues', value: m.delivered, color: '#0288d1' },
    { label: 'Abertos', value: m.opened, color: '#2e7d32' },
    { label: 'Clicados', value: m.clicked, color: '#ed6c02' },
  ];
  const maxFunnel = funnel[0].value || 1;

  const totalClicks = email.clickMap.reduce((s, l) => s + l.clicks, 0) || 1;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>{email.subject}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Chip label={STATUS_LABEL[email.status]} size="small" color={STATUS_COLOR[email.status]} />
            <Chip
              label={TEMPLATE_LABEL[email.templateType]}
              size="small"
              sx={{ bgcolor: `${TEMPLATE_COLOR[email.templateType]}18`, color: TEMPLATE_COLOR[email.templateType], fontWeight: 600 }}
            />
            {email.isABTest && <Chip label="🧪 Teste A/B" size="small" variant="outlined" />}
          </Stack>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Funnel */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Funil de Engajamento</Typography>
        <Stack spacing={1} sx={{ mb: 3 }}>
          {funnel.map(step => (
            <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right', fontWeight: 500 }}>
                {step.label}
              </Typography>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <LinearProgress
                  variant="determinate"
                  value={(step.value / maxFunnel) * 100}
                  sx={{
                    height: 24,
                    borderRadius: 1,
                    bgcolor: '#f5f5f5',
                    '& .MuiLinearProgress-bar': { bgcolor: step.color, borderRadius: 1 },
                  }}
                />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {fmtNum(step.value)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 50 }}>
                {fmtPct((step.value / maxFunnel) * 100)}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* A/B Test Comparison */}
        {email.isABTest && email.abTestVariants && email.abTestVariants.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Comparação de Variantes A/B</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                    <TableCell>Variante</TableCell>
                    <TableCell>Assunto</TableCell>
                    <TableCell align="right">Enviados</TableCell>
                    <TableCell align="right">Open Rate</TableCell>
                    <TableCell align="right">Click Rate</TableCell>
                    <TableCell align="right">CTOR</TableCell>
                    <TableCell align="center">Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {email.abTestVariants.map(v => (
                    <TableRow key={v.id} sx={v.isWinner ? { bgcolor: '#e8f5e9' } : undefined}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{v.variantName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {v.subject}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{fmtNum(v.metrics.sent)}</TableCell>
                      <TableCell align="right">{fmtPct(v.metrics.openRate)}</TableCell>
                      <TableCell align="right">{fmtPct(v.metrics.clickRate)}</TableCell>
                      <TableCell align="right">{fmtPct(v.metrics.clickToOpenRate)}</TableCell>
                      <TableCell align="center">
                        {v.isWinner ? (
                          <Chip
                            icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                            label="Vencedor"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Click Map */}
        {email.clickMap.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Mapa de Cliques</Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {email.clickMap.map((link, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link.label || link.url}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fmtNum(link.clicks)} cliques ({fmtPct((link.clicks / totalClicks) * 100)})
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(link.clicks / totalClicks) * 100}
                    sx={{ height: 8, borderRadius: 1, bgcolor: '#f5f5f5', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }}
                  />
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Personalization Tokens */}
        {email.personalizationTokens.length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Tokens de Personalização</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              {email.personalizationTokens.map(token => (
                <Chip key={token} label={token} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: 12 }} />
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarketingEmailsPage;
