// Contacts List Page - Lista de Contatos com Tabela
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Chip,
  Paper,
  Typography,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Tooltip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Drawer,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  ContentCopy as DuplicateIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { LeadScoreBadge } from '../components/LeadScoreBadge';
import { LifecycleStageBadge } from '../components/LifecycleStageBadge';
import { TableSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { mockApi } from '../mock/api';
import type { Contact, LifecycleStage, ListFilters, ContactFormData } from '../types';
import {
  getMockContactPhoto,
  MOCK_CONTACT_PHOTO_FALLBACK,
} from '../utils/mockContactPhoto';

// ── Design helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#7C3AED','#2563EB','#DC2626','#D97706','#16A34A','#0891B2','#DB2777','#EA580C'];
const avatarBg = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const LIFECYCLE_CFG: Record<string, { label: string; color: string; bg: string }> = {
  subscriber:  { label: 'Subscriber',  color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
  lead:        { label: 'Lead',        color: '#2563EB', bg: 'rgba(37,99,235,0.1)'   },
  mql:         { label: 'MQL',         color: '#7C3AED', bg: 'rgba(124,58,237,0.1)'  },
  sql:         { label: 'SQL',         color: '#0891B2', bg: 'rgba(8,145,178,0.1)'   },
  opportunity: { label: 'Opportunity', color: '#D97706', bg: 'rgba(217,119,6,0.1)'   },
  customer:    { label: 'Customer',    color: '#16A34A', bg: 'rgba(22,163,74,0.1)'   },
  evangelist:  { label: 'Evangelist',  color: '#DB2777', bg: 'rgba(219,39,119,0.1)'  },
};

const lcCfg = (stage: string) =>
  LIFECYCLE_CFG[stage] ?? { label: stage, color: '#64748B', bg: 'rgba(100,116,139,0.1)' };

export const ContactsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStage | ''>('');
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);

  // Load contacts
  useEffect(() => {
    loadContacts();
  }, [page, rowsPerPage, searchTerm, lifecycleFilter, scoreRange]);

  useEffect(() => {
    const lifecycleFromQuery = searchParams.get('lifecycleStage');
    if (
      lifecycleFromQuery === 'subscriber' ||
      lifecycleFromQuery === 'lead' ||
      lifecycleFromQuery === 'mql' ||
      lifecycleFromQuery === 'sql' ||
      lifecycleFromQuery === 'opportunity' ||
      lifecycleFromQuery === 'customer' ||
      lifecycleFromQuery === 'evangelist'
    ) {
      setLifecycleFilter(lifecycleFromQuery);
    }
  }, [searchParams]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: ListFilters = {
        search: searchTerm,
        leadScoreMin: scoreRange[0],
        leadScoreMax: scoreRange[1],
      };
      if (lifecycleFilter) {
        filters.lifecycleStage = [lifecycleFilter];
      }
      const response = await mockApi.contacts.list(
        filters,
        page + 1,
        rowsPerPage
      );
      setContacts(response.data?.data || []);
      setTotal(response.data?.pagination.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(contacts.map((c) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    contact: Contact
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const openCreateModal = () => {
    navigate('/contacts/new');
  };

  const handleDelete = async (id: string) => {
    try {
      await mockApi.contacts.delete(id);
      loadContacts();
      handleMenuClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar contato');
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Deseja deletar ${selected.length} contato(s) selecionado(s)?`
      )
    ) {
      return;
    }

    try {
      await mockApi.contacts.bulkDelete(selected);
      setSelected([]);
      loadContacts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar contatos');
    }
  };

  const handleExportSelected = () => {
    const selectedContacts = contacts.filter((c) => selected.includes(c.id));
    if (!selectedContacts.length) return;

    const header = ['Nome', 'Email', 'Cargo', 'Empresa', 'Score', 'Lifecycle'];
    const rows = selectedContacts.map((c) => [
      c.fullName,
      c.email,
      c.jobTitle || '',
      c.account?.name || '',
      String(c.leadScore),
      c.lifecycleStage,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((field) => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contatos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.includes(id);
  const numSelected = selected.length;
  const rowCount = contacts.length;

  // KPIs
  const customerCount    = useMemo(() => contacts.filter((c) => c.lifecycleStage === 'customer').length, [contacts]);
  const hotCount         = useMemo(() => contacts.filter((c) => c.leadScore >= 70).length, [contacts]);
  const opportunityCount = useMemo(() => contacts.filter((c) => c.lifecycleStage === 'opportunity' || c.lifecycleStage === 'sql').length, [contacts]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Contatos</Typography>
          <Typography variant="body2" color="text.secondary">
            {total} contato(s) no portfólio comercial.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterOpen(true)}>
            Filtros avançados
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
            Novo Contato
          </Button>
        </Box>
      </Box>

      {/* ── KPI Strip ── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {[
          { icon: <GroupIcon sx={{ fontSize: 16 }} />,      label: 'Total',       value: total,           color: undefined },
          { icon: <StarIcon sx={{ fontSize: 16 }} />,       label: 'Customers',   value: customerCount,   color: '#16A34A' },
          { icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, label: 'SQL/Opp.',    value: opportunityCount, color: '#D97706' },
          { icon: <BusinessIcon sx={{ fontSize: 16 }} />,   label: 'Score ≥ 70',  value: hotCount,        color: '#DC2626' },
        ].map((kpi) => (
          <Paper key={kpi.label} variant="outlined"
            sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: kpi.color ?? 'text.secondary' }}>{kpi.icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1 }}>{kpi.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: kpi.color ?? 'text.primary', lineHeight: 1.2 }}>{kpi.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Barra de busca + filtros rápidos de lifecycle ── */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nome, email ou cargo..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flex: '1 1 260px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          {numSelected > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 2, px: 1.5, py: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C3AED' }}>{numSelected} selecionado(s)</Typography>
              <Tooltip title="Deletar selecionados">
                <IconButton size="small" color="error" onClick={handleBulkDelete}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exportar CSV">
                <IconButton size="small" onClick={handleExportSelected}>
                  <FileDownloadIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Chips de filtro rápido por lifecycle */}
        <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
          {(['', 'lead', 'mql', 'sql', 'opportunity', 'customer', 'evangelist'] as Array<LifecycleStage | ''>).map((lc) => {
            const cfg = lc ? lcCfg(lc) : null;
            const active = lifecycleFilter === lc;
            return (
              <Chip
                key={lc || 'all'}
                label={lc ? cfg!.label : 'Todos'}
                size="small"
                onClick={() => { setLifecycleFilter(lc); setPage(0); }}
                sx={{
                  cursor: 'pointer',
                  height: 24,
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
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* ── Tabela ── */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell padding="checkbox">
                <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount} onChange={handleSelectAll} size="small" />
              </TableCell>
              {['Nome', 'Cargo', 'Empresa', 'Lead Score', 'Lifecycle', 'Owner', ''].map((h) => (
                <TableCell key={h} align={h === '' ? 'right' : 'left'}
                  sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', py: 1 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={10} cols={8} />
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ border: 0, p: 0 }}>
                  <EmptyState variant={searchTerm ? 'search' : 'contacts'}
                    onAction={searchTerm ? () => setSearchTerm('') : () => navigate('/contacts?action=new')}
                    actionLabel={searchTerm ? 'Limpar busca' : 'Novo Contato'} />
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => {
                const isItemSelected = isSelected(contact.id);
                const lc = lcCfg(contact.lifecycleStage);
                const ownerInitial = contact.owner?.fullName?.charAt(0) ?? '?';
                const ownerColor  = contact.owner ? avatarBg(contact.owner.fullName) : '#94A3B8';

                return (
                  <TableRow key={contact.id} hover selected={isItemSelected}
                    sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: 'rgba(124,58,237,0.04)' } }}
                    onClick={() => navigate(`/contacts/${contact.id}?edit=1`)}>

                    <TableCell padding="checkbox">
                      <Checkbox size="small" checked={isItemSelected}
                        onClick={(e) => e.stopPropagation()} onChange={() => handleSelectOne(contact.id)} />
                    </TableCell>

                    {/* Nome + email + avatar */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Avatar src={getMockContactPhoto(contact.id)} alt={contact.fullName}
                          sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 800,
                            bgcolor: avatarBg(contact.fullName), borderRadius: 1.5 }}
                          imgProps={{
                            referrerPolicy: 'no-referrer',
                            onError: (e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.src = MOCK_CONTACT_PHOTO_FALLBACK;
                            },
                          }}>
                          {contact.firstName.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {contact.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary"
                            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {contact.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Cargo */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {contact.jobTitle || '—'}
                      </Typography>
                    </TableCell>

                    {/* Empresa */}
                    <TableCell>
                      {contact.account?.name ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{contact.account.name}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    {/* Lead Score */}
                    <TableCell>
                      <LeadScoreBadge score={contact.leadScore} size="small" />
                    </TableCell>

                    {/* Lifecycle */}
                    <TableCell>
                      <Chip label={lc.label} size="small"
                        sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: lc.bg, color: lc.color, border: 'none' }} />
                    </TableCell>

                    {/* Owner */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Avatar sx={{ width: 22, height: 22, fontSize: 10, fontWeight: 800, bgcolor: ownerColor, borderRadius: 0.8 }}>
                          {ownerInitial}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {contact.owner?.fullName || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Ações */}
                    <TableCell align="right" sx={{ pr: 1 }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, contact); }}
                        sx={{ opacity: 0.45, '&:hover': { opacity: 1 } }}>
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination rowsPerPageOptions={[10, 20, 50, 100]} component="div" count={total}
          rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} />
      </TableContainer>

      {/* ── Menu contextual ── */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180, boxShadow: 4 } }}>
        <MenuItem onClick={() => { if (selectedContact) navigate(`/contacts/${selectedContact.id}`); handleMenuClose(); }}>
          <ViewIcon sx={{ fontSize: 16, mr: 1.2, color: 'text.secondary' }} />
          <Typography variant="body2">Ver detalhes</Typography>
        </MenuItem>
        <MenuItem onClick={() => { if (selectedContact) navigate(`/contacts/${selectedContact.id}?edit=1`); handleMenuClose(); }}>
          <EditIcon sx={{ fontSize: 16, mr: 1.2, color: 'text.secondary' }} />
          <Typography variant="body2">Editar</Typography>
        </MenuItem>
        <MenuItem onClick={async () => {
          if (selectedContact) {
            const clonePayload: ContactFormData = {
              firstName: `${selectedContact.firstName} (Cópia)`, lastName: selectedContact.lastName,
              email: `copia+${Date.now()}_${selectedContact.email}`, phone: selectedContact.phone,
              mobilePhone: selectedContact.mobilePhone, jobTitle: selectedContact.jobTitle,
              department: selectedContact.department, accountId: selectedContact.accountId,
              ownerId: selectedContact.ownerId, lifecycleStage: selectedContact.lifecycleStage,
              leadSource: selectedContact.leadSource, tags: selectedContact.tags,
            };
            await mockApi.contacts.create(clonePayload);
            await loadContacts();
          }
          handleMenuClose();
        }}>
          <DuplicateIcon sx={{ fontSize: 16, mr: 1.2, color: 'text.secondary' }} />
          <Typography variant="body2">Duplicar</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => selectedContact && handleDelete(selectedContact.id)} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon sx={{ fontSize: 16, mr: 1.2 }} />
          <Typography variant="body2" color="error">Deletar</Typography>
        </MenuItem>
      </Menu>

      {/* ── Drawer de filtros avançados ── */}
      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}
        PaperProps={{ sx: { width: 340, p: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Filtros avançados</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>Refine a lista de contatos</Typography>
        <Stack spacing={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Lifecycle</InputLabel>
            <Select label="Lifecycle" value={lifecycleFilter}
              onChange={(e) => setLifecycleFilter((e.target.value as LifecycleStage) || '')}>
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(LIFECYCLE_CFG).map(([key, cfg]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color }} />
                    {cfg.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Lead Score: {scoreRange[0]}–{scoreRange[1]}
            </Typography>
            <Slider value={scoreRange} min={0} max={100} valueLabelDisplay="auto"
              onChange={(_, v) => setScoreRange(v as number[])} sx={{ color: '#7C3AED' }} />
          </Box>

          <Divider />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={() => { setLifecycleFilter(''); setScoreRange([0, 100]); }}>
              Limpar
            </Button>
            <Button variant="contained" fullWidth onClick={() => setFilterOpen(false)}>
              Aplicar
            </Button>
          </Box>
        </Stack>
      </Drawer>

    </Box>
  );
};

export default ContactsListPage;
