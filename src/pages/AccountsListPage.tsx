import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Add as AddIcon,
  TrendingUp as DealsIcon,
  Group as ContactsIcon,
  Business as BusinessIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Account } from '../types';
import AccountFormModal from '../components/AccountFormModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

type TierKey = 'Strategic' | 'Enterprise' | 'MidMarket' | 'SMB' | string;

const TIER_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Strategic:  { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)',  label: 'Strategic'  },
  Enterprise: { color: '#2563EB', bg: 'rgba(37,99,235,0.1)',   label: 'Enterprise' },
  MidMarket:  { color: '#0891B2', bg: 'rgba(8,145,178,0.1)',   label: 'MidMarket'  },
  SMB:        { color: '#16A34A', bg: 'rgba(22,163,74,0.1)',   label: 'SMB'        },
};

const tierCfg = (tier: string) =>
  TIER_CONFIG[tier] ?? { color: '#64748B', bg: 'rgba(100,116,139,0.1)', label: tier };

const icpColor = (score: number) =>
  score >= 80 ? '#16A34A' : score >= 60 ? '#D97706' : '#DC2626';

const icpBg = (score: number) =>
  score >= 80 ? 'rgba(22,163,74,0.1)' : score >= 60 ? 'rgba(217,119,6,0.1)' : 'rgba(220,38,38,0.08)';

/** Gera cor de avatar baseada na inicial da empresa */
const AVATAR_COLORS = [
  '#7C3AED', '#2563EB', '#DC2626', '#D97706',
  '#16A34A', '#0891B2', '#DB2777', '#EA580C',
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

type ViewMode = 'grid' | 'list';
type TierFilter = 'all' | TierKey;

// ── ICP Ring ──────────────────────────────────────────────────────────────────

const IcpRing: React.FC<{ score: number; size?: number }> = ({ score, size = 36 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = icpColor(score);
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          strokeWidth={3} style={{ color: 'rgba(0,0,0,0.08)' }} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={3} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`} />
      </svg>
      <Typography sx={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, fontWeight: 800, color,
      }}>
        {score}
      </Typography>
    </Box>
  );
};

// ── AccountCard (grid) ────────────────────────────────────────────────────────

const AccountCard: React.FC<{ account: Account; onClick: () => void }> = ({ account, onClick }) => {
  const tc = tierCfg(account.tier || '');
  const color = avatarColor(account.name);

  return (
    <Paper
      onClick={onClick}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2.5,
        cursor: 'pointer',
        transition: 'all 0.18s',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%',
      }}
    >
      {/* Top row: avatar + name + tier */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: color,
            fontSize: 18,
            fontWeight: 800,
            flexShrink: 0,
            borderRadius: 1.5,
          }}
        >
          {account.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mb: 0.2 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.name}
            </Typography>
            <Chip
              label={tc.label}
              size="small"
              sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: tc.bg, color: tc.color, border: 'none', flexShrink: 0 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {account.industry || '—'} · {account.domain || '—'}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* KPIs + ICP */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ContactsIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{account.contactCount ?? 0}</Typography>
            <Typography variant="caption" color="text.secondary">contatos</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DealsIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{account.openDealsCount ?? 0}</Typography>
            <Typography variant="caption" color="text.secondary">deals</Typography>
          </Box>
        </Stack>
        <Tooltip title={`ICP Score: ${account.icpScore}`}>
          <Box><IcpRing score={account.icpScore} /></Box>
        </Tooltip>
      </Box>
    </Paper>
  );
};

// ── AccountRow (list) ─────────────────────────────────────────────────────────

const AccountRow: React.FC<{ account: Account; onClick: () => void }> = ({ account, onClick }) => {
  const tc = tierCfg(account.tier || '');
  const color = avatarColor(account.name);
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.2,
        cursor: 'pointer',
        borderRadius: 1.5,
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'background 0.12s',
      }}
    >
      <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: 13, fontWeight: 800, borderRadius: 1, flexShrink: 0 }}>
        {account.name.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 2, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {account.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {account.industry || '—'} · {account.domain || '—'}
        </Typography>
      </Box>

      <Chip
        label={tc.label}
        size="small"
        sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: tc.bg, color: tc.color, border: 'none', flexShrink: 0 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 80 }}>
        <ContactsIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.secondary">{account.contactCount ?? 0}</Typography>
        <DealsIcon sx={{ fontSize: 12, color: 'text.disabled', ml: 0.5 }} />
        <Typography variant="caption" color="text.secondary">{account.openDealsCount ?? 0}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Box sx={{
          width: 6, height: 6, borderRadius: '50%',
          bgcolor: icpColor(account.icpScore),
        }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: icpColor(account.icpScore) }}>
          ICP {account.icpScore}
        </Typography>
      </Box>
    </Box>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const AccountsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    const response = await mockApi.accounts.list();
    setAccounts(response.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAccounts(); }, []);

  const tiers = useMemo(() => {
    const set = new Set(accounts.map((a) => a.tier).filter(Boolean));
    return Array.from(set) as string[];
  }, [accounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      const matchesTier = tierFilter === 'all' || a.tier === tierFilter;
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.domain?.toLowerCase().includes(q) ||
        a.industry?.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
    });
  }, [accounts, search, tierFilter]);

  // KPIs
  const totalDeals = useMemo(() => accounts.reduce((s, a) => s + (a.openDealsCount ?? 0), 0), [accounts]);
  const avgIcp = useMemo(() => accounts.length === 0 ? 0 : Math.round(accounts.reduce((s, a) => s + a.icpScore, 0) / accounts.length), [accounts]);
  const enterpriseCount = useMemo(() => accounts.filter((a) => a.tier === 'Enterprise' || a.tier === 'Strategic').length, [accounts]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Cabeçalho ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.2 }}>Empresas</Typography>
          <Typography variant="body2" color="text.secondary">
            Portfólio de contas com fit de ICP e cobertura comercial.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
          Nova Empresa
        </Button>
      </Box>

      {/* ── KPI Strip ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          { icon: <BusinessIcon sx={{ fontSize: 16 }} />, label: 'Total', value: accounts.length, color: undefined },
          { icon: <StarIcon sx={{ fontSize: 16 }} />,    label: 'Enterprise+', value: enterpriseCount, color: '#7C3AED' },
          { icon: <DealsIcon sx={{ fontSize: 16 }} />,   label: 'Deals abertos', value: totalDeals, color: '#2563EB' },
          { icon: <ContactsIcon sx={{ fontSize: 16 }} />,label: 'ICP médio', value: `${avgIcp}`, color: icpColor(avgIcp) },
        ].map((kpi) => (
          <Paper
            key={kpi.label}
            variant="outlined"
            sx={{ px: 2, py: 1.2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}
          >
            <Box sx={{ color: kpi.color ?? 'text.secondary' }}>{kpi.icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1 }}>{kpi.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: kpi.color ?? 'text.primary', lineHeight: 1.2 }}>{kpi.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Barra de busca + controles ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por nome, domínio ou indústria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: '1 1 260px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtros de tier */}
        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {(['all', ...tiers] as Array<'all' | string>).map((t) => {
            const cfg = t === 'all' ? null : tierCfg(t);
            const active = tierFilter === t;
            return (
              <Chip
                key={t}
                label={t === 'all' ? 'Todos' : cfg!.label}
                size="small"
                onClick={() => setTierFilter(t as TierFilter)}
                sx={{
                  cursor: 'pointer',
                  height: 26,
                  fontWeight: 700,
                  fontSize: 11,
                  bgcolor: active ? (cfg ? cfg.bg : 'action.selected') : 'transparent',
                  color: active ? (cfg ? cfg.color : 'text.primary') : 'text.secondary',
                  border: '1px solid',
                  borderColor: active ? (cfg ? cfg.color : 'divider') : 'divider',
                  '&:hover': { opacity: 0.85 },
                }}
              />
            );
          })}
        </Box>

        {/* View toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="grid" sx={{ px: 1.2 }}>
            <Tooltip title="Grid"><GridIcon sx={{ fontSize: 18 }} /></Tooltip>
          </ToggleButton>
          <ToggleButton value="list" sx={{ px: 1.2 }}>
            <Tooltip title="Lista"><ListIcon sx={{ fontSize: 18 }} /></Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ── Contador de resultados ── */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        {filtered.length} {filtered.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
        {tierFilter !== 'all' && ` · filtro: ${tierCfg(tierFilter).label}`}
      </Typography>

      {/* ── Conteúdo ── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ fontSize: 48, mb: 1 }}>🏢</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {search || tierFilter !== 'all' ? 'Nenhuma empresa encontrada' : 'Sem empresas ainda'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {search || tierFilter !== 'all'
              ? 'Tente ajustar os filtros ou a busca.'
              : 'Cadastre a primeira empresa para começar.'}
          </Typography>
          {!search && tierFilter === 'all' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
              Nova Empresa
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {filtered.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onClick={() => navigate(`/accounts/${account.id}`)}
            />
          ))}
        </Box>
      ) : (
        /* List view */
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, bgcolor: 'action.hover' }}>
            <Box sx={{ width: 32, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, flex: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>Empresa</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, minWidth: 90 }}>Tier</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, minWidth: 80 }}>Contatos / Deals</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, minWidth: 70 }}>ICP</Typography>
          </Box>
          <Divider />
          {filtered.map((account, idx) => (
            <React.Fragment key={account.id}>
              <AccountRow
                account={account}
                onClick={() => navigate(`/accounts/${account.id}`)}
              />
              {idx < filtered.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      )}

      <AccountFormModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={async (account) => {
          setCreateModalOpen(false);
          await loadAccounts();
          navigate(`/accounts/${account.id}`);
        }}
      />
    </Box>
  );
};

export default AccountsListPage;
