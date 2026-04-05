import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  RequestQuote as RequestQuoteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Account, RateCard } from '../types';
import AccountFormModal from '../components/AccountFormModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Gera cor de avatar baseada na inicial da empresa */
const AVATAR_COLORS = [
  '#7C3AED', '#2563EB', '#DC2626', '#D97706',
  '#16A34A', '#0891B2', '#DB2777', '#EA580C',
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

type ViewMode = 'grid' | 'list';

// ── AccountCard (grid) ────────────────────────────────────────────────────────

const AccountCard: React.FC<{ account: Account; onClick: () => void; onRateCard: (accountId: string) => void }> = ({ account, onClick, onRateCard }) => {
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
          <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.2 }}>
            {account.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {account.industry || '—'} · {account.domain || '—'}
          </Typography>
        </Box>
      </Box>

      <Divider />

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
        <Button
          size="small"
          variant="text"
          startIcon={<RequestQuoteIcon sx={{ fontSize: 14 }} />}
          onClick={(e) => { e.stopPropagation(); onRateCard(account.id); }}
          sx={{ fontSize: 11, textTransform: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Rate Card
        </Button>
      </Box>
    </Paper>
  );
};

// ── AccountRow (list) ─────────────────────────────────────────────────────────

const AccountRow: React.FC<{ account: Account; onClick: () => void; onRateCard: (accountId: string) => void }> = ({ account, onClick, onRateCard }) => {
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 80 }}>
        <ContactsIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.secondary">{account.contactCount ?? 0}</Typography>
        <DealsIcon sx={{ fontSize: 12, color: 'text.disabled', ml: 0.5 }} />
        <Typography variant="caption" color="text.secondary">{account.openDealsCount ?? 0}</Typography>
      </Box>

      <Button
        size="small"
        variant="text"
        onClick={(e) => { e.stopPropagation(); onRateCard(account.id); }}
        sx={{ fontSize: 11, textTransform: 'none', color: 'text.secondary', minWidth: 'auto', '&:hover': { color: 'primary.main' } }}
      >
        Rate Card
      </Button>
    </Box>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const AccountsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rateCardOpen, setRateCardOpen] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);
  const [rateCardsLoading, setRateCardsLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    const response = await mockApi.accounts.list();
    setAccounts(response.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAccounts(); }, []);

  const handleOpenRateCard = async (accountId: string) => {
    setRateCardsLoading(true);
    setRateCardOpen(true);
    const res = await mockApi.rateCards.listByAccount(accountId);
    if (res.isSuccess && res.data && res.data.length > 0) {
      setSelectedRateCard(res.data[0]);
    } else {
      setSelectedRateCard(null);
    }
    setRateCardsLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.domain?.toLowerCase().includes(q) ||
      a.industry?.toLowerCase().includes(q),
    );
  }, [accounts, search]);

  // KPIs
  const totalDeals = useMemo(() => accounts.reduce((s, a) => s + (a.openDealsCount ?? 0), 0), [accounts]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Cabeçalho ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.2 }}>Empresas</Typography>
          <Typography variant="body2" color="text.secondary">
            Portfólio de contas e cobertura comercial.
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
          { icon: <DealsIcon sx={{ fontSize: 16 }} />,   label: 'Deals abertos', value: totalDeals, color: '#2563EB' },
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
            {search ? 'Nenhuma empresa encontrada' : 'Sem empresas ainda'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {search
              ? 'Tente ajustar a busca.'
              : 'Cadastre a primeira empresa para começar.'}
          </Typography>
          {!search && (
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
              onRateCard={handleOpenRateCard}
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
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, minWidth: 80 }}>Contatos / Deals</Typography>
          </Box>
          <Divider />
          {filtered.map((account, idx) => (
            <React.Fragment key={account.id}>
              <AccountRow
                account={account}
                onClick={() => navigate(`/accounts/${account.id}`)}
                onRateCard={handleOpenRateCard}
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

      <Dialog
        open={rateCardOpen}
        onClose={() => setRateCardOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedRateCard ? `Rate Card — ${selectedRateCard.accountName}` : 'Rate Card'}
            </Typography>
            {selectedRateCard && (
              <Typography variant="caption" color="text.secondary">
                Versão {selectedRateCard.version} · Vigência: {new Date(selectedRateCard.validFrom).toLocaleDateString('pt-BR')}
                {selectedRateCard.validUntil ? ` até ${new Date(selectedRateCard.validUntil).toLocaleDateString('pt-BR')}` : ''}
                {selectedRateCard.approvedBy && ` · Aprovado por ${selectedRateCard.approvedBy}`}
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => setRateCardOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {rateCardsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : !selectedRateCard ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">Nenhum Rate Card homologado para esta empresa.</Typography>
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Perfil</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Júnior</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Pleno</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Sênior</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Especialista</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Un.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRateCard.entries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{entry.profileName}</TableCell>
                    <TableCell>
                      <Chip label={entry.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right" sx={{ color: entry.rates.junior === 0 ? 'text.disabled' : 'inherit' }}>
                      {entry.rates.junior === 0 ? '—' : `R$ ${entry.rates.junior}`}
                    </TableCell>
                    <TableCell align="right" sx={{ color: entry.rates.pleno === 0 ? 'text.disabled' : 'inherit' }}>
                      {entry.rates.pleno === 0 ? '—' : `R$ ${entry.rates.pleno}`}
                    </TableCell>
                    <TableCell align="right" sx={{ color: entry.rates.senior === 0 ? 'text.disabled' : 'inherit' }}>
                      {entry.rates.senior === 0 ? '—' : `R$ ${entry.rates.senior}`}
                    </TableCell>
                    <TableCell align="right" sx={{ color: entry.rates.especialista === 0 ? 'text.disabled' : 'inherit' }}>
                      {entry.rates.especialista === 0 ? '—' : `R$ ${entry.rates.especialista}`}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">/{entry.unit}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AccountsListPage;
