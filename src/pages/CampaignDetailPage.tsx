import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Chip, CircularProgress, IconButton,
  Stack, Tab, Tabs, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, Checkbox, Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Campaign as CampaignIcon, AutoAwesome as AIIcon,
  Email as EmailIcon, Event as EventIcon,
  People as PeopleIcon, Task as TaskIcon,
  AdsClick as AdsIcon, Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Campaign } from '../types';

// ── Constantes ──────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho', active: 'Ativa', paused: 'Pausada', completed: 'Concluída',
};
const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  draft: 'default', active: 'info', paused: 'warning', completed: 'success',
};
const TYPE_LABELS: Record<string, string> = {
  email: 'E-mail', social: 'Social', event: 'Evento',
  multi_channel: 'Multicanal', ads: 'Anúncios', content: 'Conteúdo',
};
const MEMBER_STATUS_LABELS: Record<string, string> = {
  sent: 'Enviado', responded: 'Respondeu', attended: 'Participou', converted: 'Convertido',
};
const MEMBER_STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  sent: 'default', responded: 'info', attended: 'warning', converted: 'success',
};
const ATTRIBUTION_OPTIONS = [
  { value: 'first_touch', label: 'First Touch' },
  { value: 'last_touch', label: 'Last Touch' },
  { value: 'linear', label: 'Linear' },
  { value: 'full_path', label: 'Full Path' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const fmtK = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `R$ ${(v / 1_000).toFixed(0)}K` : fmt(v);
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');

function budgetColor(spent: number, budget: number): 'success' | 'warning' | 'error' {
  const ratio = budget > 0 ? spent / budget : 0;
  if (ratio >= 0.95) return 'error';
  if (ratio >= 0.75) return 'warning';
  return 'success';
}

// ── KPI Card ────────────────────────────────────────────────────────────────

const KpiCard: React.FC<{
  label: string; value: string; sub?: string; color: string;
}> = ({ label, value, sub, color }) => (
  <Paper
    elevation={0}
    sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, flex: 1, minWidth: 140 }}
  >
    <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
    <Typography variant="h6" fontWeight={700} sx={{ color }}>{value}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Paper>
);

// ── Tab Panel ───────────────────────────────────────────────────────────────

const TabPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({ value, index, children }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

// ── Componente Principal ────────────────────────────────────────────────────

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [attribution, setAttribution] = useState('first_touch');

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const res = await mockApi.marketingCampaigns.getById(id);
      if (res.isSuccess && res.data) setCampaign(res.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Voltar</Button>
        <Typography variant="h6" color="text.secondary" mt={4} textAlign="center">
          Campanha não encontrada
        </Typography>
      </Box>
    );
  }

  const spendPct = campaign.budget > 0 ? (campaign.actualSpend / campaign.budget) * 100 : 0;
  const budgetRemaining = campaign.budget - campaign.actualSpend;
  const conversionRate = campaign.kpis.leadsGenerated > 0
    ? (campaign.kpis.closedDeals / campaign.kpis.leadsGenerated) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <CampaignIcon sx={{ fontSize: 28, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" fontWeight={700}>{campaign.name}</Typography>
            <Chip label={STATUS_LABELS[campaign.status]} size="small" color={STATUS_COLORS[campaign.status]} />
            <Chip label={TYPE_LABELS[campaign.type]} size="small" variant="outlined" />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} mt={0.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>
                {campaign.ownerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Avatar>
              <Typography variant="body2" color="text.secondary">{campaign.ownerName}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {fmtDate(campaign.startDate)} — {fmtDate(campaign.endDate)}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* AI Summary */}
      {campaign.aiSummary && (
        <Paper
          elevation={0}
          sx={{
            p: 2, mb: 3, borderRadius: 2,
            bgcolor: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <AIIcon sx={{ color: '#7C3AED', mt: 0.25 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#7C3AED' }} mb={0.5}>
                Resumo IA
              </Typography>
              <Typography variant="body2" color="text.secondary">{campaign.aiSummary}</Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* KPIs Row 1 */}
      <Stack direction="row" spacing={2} mb={2} sx={{ overflowX: 'auto' }}>
        <KpiCard label="Contatos Alcançados" value={campaign.kpis.contactsReached.toLocaleString('pt-BR')} color="#1976D2" />
        <KpiCard label="Novos Contatos" value={campaign.kpis.newContacts.toLocaleString('pt-BR')} color="#0288D1" />
        <KpiCard label="Leads Gerados" value={campaign.kpis.leadsGenerated.toLocaleString('pt-BR')} color="#2E7D32" />
        <KpiCard label="Deals Criados" value={campaign.kpis.dealsCreated.toLocaleString('pt-BR')} color="#ED6C02" />
      </Stack>

      {/* KPIs Row 2 */}
      <Stack direction="row" spacing={2} mb={3} sx={{ overflowX: 'auto' }}>
        <KpiCard label="Receita Influenciada" value={fmtK(campaign.kpis.revenueInfluenced)} color="#7C3AED" />
        <KpiCard label="ROI" value={`${campaign.kpis.roi.toFixed(1)}x`} color={campaign.kpis.roi >= 2 ? '#2E7D32' : '#ED6C02'} />
        <KpiCard
          label="Orçamento Restante"
          value={fmtK(budgetRemaining)}
          sub={`${spendPct.toFixed(0)}% utilizado`}
          color={budgetRemaining > 0 ? '#2E7D32' : '#D32F2F'}
        />
        <KpiCard label="Taxa Conversão" value={`${conversionRate.toFixed(1)}%`} sub="deals / leads" color="#1976D2" />
      </Stack>

      {/* Budget Progress */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" fontWeight={700}>Orçamento</Typography>
          <Typography variant="body2" fontWeight={600}>
            {fmtK(campaign.actualSpend)} / {fmtK(campaign.budget)} ({spendPct.toFixed(1)}%)
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min(spendPct, 100)}
          color={budgetColor(campaign.actualSpend, campaign.budget)}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Paper>

      {/* Attribution Model */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>Modelo de Atribuição</Typography>
        <Stack direction="row" spacing={1}>
          {ATTRIBUTION_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              clickable
              color={attribution === opt.value ? 'primary' : 'default'}
              variant={attribution === opt.value ? 'filled' : 'outlined'}
              onClick={() => setAttribution(opt.value)}
            />
          ))}
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<VisibilityIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Visão Geral" />
          <Tab icon={<EmailIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="E-mails" />
          <Tab icon={<AdsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Anúncios" />
          <Tab icon={<EventIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Eventos" />
          <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Membros" />
          <Tab icon={<TaskIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Tarefas" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* Visão Geral */}
          <TabPanel value={tab} index={0}>
            <Typography variant="body2" color="text.secondary" mb={2}>{campaign.description}</Typography>

            {campaign.goals.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Objetivos</Typography>
                <Stack spacing={0.5}>
                  {campaign.goals.map((g, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      <Typography variant="body2">{g}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}

            {campaign.tags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Tags</Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {campaign.tags.map(t => (
                    <Chip key={t} label={t} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                  ))}
                </Stack>
              </Box>
            )}
          </TabPanel>

          {/* E-mails */}
          <TabPanel value={tab} index={1}>
            {campaign.associatedEmails.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhum e-mail associado
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>ID do E-mail</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.associatedEmails.map(eid => (
                      <TableRow key={eid} hover>
                        <TableCell><Typography variant="body2" fontWeight={600}>{eid}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">E-mail vinculado à campanha</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Anúncios */}
          <TabPanel value={tab} index={2}>
            {campaign.associatedAds.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhum anúncio associado
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>ID do Anúncio</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.associatedAds.map(aid => (
                      <TableRow key={aid} hover>
                        <TableCell><Typography variant="body2" fontWeight={600}>{aid}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">Anúncio vinculado à campanha</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Eventos */}
          <TabPanel value={tab} index={3}>
            {campaign.associatedEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhum evento associado
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>ID do Evento</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.associatedEvents.map(eid => (
                      <TableRow key={eid} hover>
                        <TableCell><Typography variant="body2" fontWeight={600}>{eid}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">Evento vinculado à campanha</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Membros */}
          <TabPanel value={tab} index={4}>
            {campaign.members.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhum membro na campanha
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Adicionado em</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.members.map(m => (
                      <TableRow key={m.contactId} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 11 }}>
                              {m.contactName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>{m.contactName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={MEMBER_STATUS_LABELS[m.memberStatus] || m.memberStatus}
                            size="small"
                            color={MEMBER_STATUS_COLORS[m.memberStatus] || 'default'}
                          />
                        </TableCell>
                        <TableCell><Typography variant="body2">{fmtDate(m.addedAt)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Tarefas */}
          <TabPanel value={tab} index={5}>
            {campaign.tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Nenhuma tarefa registrada
              </Typography>
            ) : (
              <Stack spacing={1}>
                {campaign.tasks.map(t => (
                  <Paper
                    key={t.id}
                    elevation={0}
                    sx={{
                      p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2,
                      opacity: t.completed ? 0.6 : 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Checkbox checked={t.completed} size="small" sx={{ p: 0 }} readOnly />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ textDecoration: t.completed ? 'line-through' : 'none' }}
                        >
                          {t.title}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="caption" color="text.secondary">
                            Responsável: {t.assignee}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Prazo: {fmtDate(t.dueDate)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Chip
                        label={t.completed ? 'Concluída' : 'Pendente'}
                        size="small"
                        color={t.completed ? 'success' : 'default'}
                        sx={{ fontSize: 11 }}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default CampaignDetailPage;
