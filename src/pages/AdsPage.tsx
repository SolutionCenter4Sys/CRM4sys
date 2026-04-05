import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  Grid,
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
  Typography,
} from '@mui/material';
import {
  CampaignOutlined as CampaignIcon,
  ExpandLess,
  ExpandMore,
  Google as GoogleIcon,
  Groups as GroupsIcon,
  LinkOutlined as LinkIcon,
  SearchOutlined as SearchIcon,
  SyncOutlined as SyncIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Ad, AdAccount, AdAudience, AdPlatform, AdStatus } from '../types';

const platformLabel: Record<AdPlatform, string> = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  linkedin: 'LinkedIn Ads',
  tiktok: 'TikTok Ads',
};

const platformColor: Record<AdPlatform, string> = {
  google: '#EA4335',
  meta: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#010101',
};

const platformLetter: Record<AdPlatform, string> = {
  google: 'G',
  meta: 'f',
  linkedin: 'in',
  tiktok: 'T',
};

const statusLabel: Record<AdStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
};

const statusColor: Record<AdStatus, 'default' | 'success' | 'warning' | 'info'> = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
};

const typeLabel: Record<string, string> = {
  search: 'Search',
  display: 'Display',
  social: 'Social',
  video: 'Vídeo',
  carousel: 'Carrossel',
};

const journeyLabel: Record<string, string> = {
  awareness: 'Descoberta',
  consideration: 'Consideração',
  decision: 'Decisão',
};

const journeyColor: Record<string, 'info' | 'warning' | 'success'> = {
  awareness: 'info',
  consideration: 'warning',
  decision: 'success',
};

const audienceTypeLabel: Record<string, string> = {
  crm_list: 'Lista CRM',
  retargeting: 'Retargeting',
  lookalike: 'Lookalike',
  custom: 'Custom',
};

const syncStatusColor: Record<string, 'success' | 'warning' | 'error'> = {
  synced: 'success',
  syncing: 'warning',
  error: 'error',
};

const syncStatusLabel: Record<string, string> = {
  synced: 'Sincronizado',
  syncing: 'Sincronizando',
  error: 'Erro',
};

const fmt = (v: number) => v.toLocaleString('pt-BR');
const fmtCur = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtPct = (v: number) => `${v.toFixed(2)}%`;

function PlatformAvatar({ platform, size = 36 }: { platform: AdPlatform; size?: number }) {
  if (platform === 'google') {
    return <GoogleIcon sx={{ fontSize: size, color: platformColor.google }} />;
  }
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: platformColor[platform],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.45,
      }}
    >
      {platformLetter[platform]}
    </Box>
  );
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [audiences, setAudiences] = useState<AdAudience[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [journeyFilter, setJourneyFilter] = useState('');
  const [audiencesOpen, setAudiencesOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [adsRes, accRes, audRes] = await Promise.all([
        mockApi.marketingAds.list(),
        mockApi.marketingAds.listAccounts(),
        mockApi.marketingAds.listAudiences(),
      ]);
      setAds(adsRes.data ?? []);
      setAccounts(accRes.data ?? []);
      setAudiences(audRes.data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = [...ads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q));
    }
    if (platformFilter) result = result.filter(a => a.platform === platformFilter);
    if (statusFilter) result = result.filter(a => a.status === statusFilter);
    if (journeyFilter) result = result.filter(a => a.journeyStage === journeyFilter);
    return result;
  }, [ads, search, platformFilter, statusFilter, journeyFilter]);

  const kpis = useMemo(() => {
    const activeAds = ads.filter(a => a.status === 'active' || a.status === 'completed');
    const totalSpend = activeAds.reduce((s, a) => s + a.metrics.spend, 0);
    const totalBudget = activeAds.reduce((s, a) => s + a.budget, 0);
    const impressions = activeAds.reduce((s, a) => s + a.metrics.impressions, 0);
    const reach = activeAds.reduce((s, a) => s + a.metrics.reach, 0);
    const clicks = activeAds.reduce((s, a) => s + a.metrics.clicks, 0);
    const conversions = activeAds.reduce((s, a) => s + a.metrics.conversions, 0);
    const leads = activeAds.reduce((s, a) => s + a.metrics.leads, 0);
    const revenue = activeAds.reduce((s, a) => s + a.attribution.revenueAttributed, 0);
    const avgCtr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgCpa = conversions > 0 ? totalSpend / conversions : 0;
    const avgCpl = leads > 0 ? totalSpend / leads : 0;
    const weightedRoas =
      totalSpend > 0
        ? activeAds.reduce((s, a) => s + a.metrics.roas * a.metrics.spend, 0) / totalSpend
        : 0;
    const pacing =
      totalBudget > 0
        ? totalSpend / totalBudget >= 0.9
          ? 'On Track'
          : totalSpend / totalBudget >= 0.7
            ? 'Underspend'
            : 'Baixo gasto'
        : '—';

    return { totalSpend, impressions, reach, clicks, conversions, leads, revenue, avgCtr, avgCpa, avgCpl, weightedRoas, pacing };
  }, [ads]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1440, mx: 'auto' }}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
        <CampaignIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>Anúncios</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie campanhas pagas, contas conectadas e audiências do CRM
          </Typography>
        </Box>
      </Stack>

      {/* ===== CONNECTED ACCOUNTS ===== */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
        Contas Conectadas
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {accounts.map(acc => (
          <Grid item xs={12} sm={6} md={3} key={acc.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <PlatformAvatar platform={acc.platform} />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle2" noWrap>{acc.accountName}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      ID: {acc.accountExternalId}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: acc.connected ? 'success.main' : 'grey.400',
                      flexShrink: 0,
                    }}
                  />
                </Stack>
                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Última sincronização:{' '}
                    {acc.lastSync ? new Date(acc.lastSync).toLocaleDateString('pt-BR') : '—'}
                  </Typography>
                  <Typography variant="body2">
                    Gasto total: <strong>{fmtCur(acc.totalSpend)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Conversões: <strong>{fmt(acc.totalConversions)}</strong>
                  </Typography>
                </Stack>
                {acc.connected ? (
                  <Button size="small" variant="outlined" startIcon={<SyncIcon />} fullWidth>
                    Sincronizar
                  </Button>
                ) : (
                  <Button size="small" variant="contained" startIcon={<LinkIcon />} fullWidth>
                    Conectar
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== CRM AUDIENCES ===== */}
      <Paper variant="outlined" sx={{ mb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5, cursor: 'pointer' }}
          onClick={() => setAudiencesOpen(o => !o)}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <GroupsIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Audiências CRM
            </Typography>
            <Chip label={audiences.length} size="small" color="primary" />
          </Stack>
          {audiencesOpen ? <ExpandLess /> : <ExpandMore />}
        </Stack>
        <Collapse in={audiencesOpen}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Plataforma</TableCell>
                  <TableCell align="right">Tamanho</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Origem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audiences.map(aud => (
                  <TableRow key={aud.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{aud.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={audienceTypeLabel[aud.type] ?? aud.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PlatformAvatar platform={aud.platform} size={20} />
                        <Typography variant="body2">{platformLabel[aud.platform]}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{fmt(aud.size)}</TableCell>
                    <TableCell>
                      <Chip
                        label={syncStatusLabel[aud.syncStatus] ?? aud.syncStatus}
                        size="small"
                        color={syncStatusColor[aud.syncStatus] ?? 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{aud.sourceDescription}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" size="small">Criar Audiência</Button>
          </Box>
        </Collapse>
      </Paper>

      {/* ===== KPIs ===== */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {([
          { title: 'Total Investido', value: fmtCur(kpis.totalSpend), sub: `Pacing: ${kpis.pacing}` },
          { title: 'Impressões', value: fmt(kpis.impressions), sub: `Alcance único: ${fmt(kpis.reach)}` },
          { title: 'Cliques', value: fmt(kpis.clicks), sub: `CTR médio: ${fmtPct(kpis.avgCtr)}` },
          { title: 'Conversões', value: fmt(kpis.conversions), sub: `CPA médio: ${fmtCur(kpis.avgCpa)}` },
          { title: 'Leads Gerados', value: fmt(kpis.leads), sub: `CPL médio: ${fmtCur(kpis.avgCpl)}` },
          { title: 'ROAS Médio', value: kpis.weightedRoas.toFixed(2) + 'x', sub: `Receita atribuída: ${fmtCur(kpis.revenue)}` },
        ] as const).map(k => (
          <Grid item xs={12} sm={6} md={2} key={k.title}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary">{k.title}</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ my: 0.25 }}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary">{k.sub}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== FILTERS ===== */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar anúncio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 0.5, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Plataforma</InputLabel>
              <Select
                value={platformFilter}
                label="Plataforma"
                onChange={e => setPlatformFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {(Object.keys(platformLabel) as AdPlatform[]).map(p => (
                  <MenuItem value={p} key={p}>{platformLabel[p]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {(Object.keys(statusLabel) as AdStatus[]).map(s => (
                  <MenuItem value={s} key={s}>{statusLabel[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Funil</InputLabel>
              <Select
                value={journeyFilter}
                label="Funil"
                onChange={e => setJourneyFilter(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(journeyLabel).map(([k, v]) => (
                  <MenuItem value={k} key={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== ADS TABLE ===== */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Funil</TableCell>
              <TableCell>Campanha</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Orçamento / Gasto</TableCell>
              <TableCell align="right">Impressões</TableCell>
              <TableCell align="right">Cliques</TableCell>
              <TableCell align="right">CTR</TableCell>
              <TableCell align="right">Conversões</TableCell>
              <TableCell align="right">ROAS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum anúncio encontrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(ad => {
                const spentPct = ad.budget > 0 ? Math.min((ad.metrics.spend / ad.budget) * 100, 100) : 0;
                const pacingColor =
                  ad.budgetPacing === 'on_track'
                    ? 'success'
                    : ad.budgetPacing === 'underspend'
                      ? 'warning'
                      : 'error';
                const roasColor =
                  ad.metrics.roas >= 5 ? 'success.main' : ad.metrics.roas >= 2 ? 'warning.main' : 'error.main';

                return (
                  <TableRow key={ad.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{ad.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PlatformAvatar platform={ad.platform} size={20} />
                        <Typography variant="body2">{platformLabel[ad.platform]}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={typeLabel[ad.type] ?? ad.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={journeyLabel[ad.journeyStage] ?? ad.journeyStage}
                        size="small"
                        color={journeyColor[ad.journeyStage] ?? 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ad.campaignName ?? '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel[ad.status]}
                        size="small"
                        color={statusColor[ad.status]}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
                      <Typography variant="caption">
                        {fmtCur(ad.metrics.spend)} / {fmtCur(ad.budget)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={spentPct}
                        color={pacingColor as 'success' | 'warning' | 'error'}
                        sx={{ height: 4, borderRadius: 2, my: 0.5 }}
                      />
                      <Typography variant="caption" color={`${pacingColor}.main`}>
                        {ad.budgetPacing === 'on_track'
                          ? 'On Track'
                          : ad.budgetPacing === 'underspend'
                            ? 'Underspend'
                            : 'Overspend'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{fmt(ad.metrics.impressions)}</TableCell>
                    <TableCell align="right">{fmt(ad.metrics.clicks)}</TableCell>
                    <TableCell align="right">{fmtPct(ad.metrics.ctr)}</TableCell>
                    <TableCell align="right">{fmt(ad.metrics.conversions)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} sx={{ color: roasColor }}>
                        {ad.metrics.roas.toFixed(2)}x
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {filtered.length} anúncio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </Typography>
    </Box>
  );
}
