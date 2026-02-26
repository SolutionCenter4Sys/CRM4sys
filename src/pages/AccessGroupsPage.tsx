import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  GroupWork as GroupWorkIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { AccessGroup, AccessPermissionCatalogItem, AccessPermissionKey, AccessUserGroupMembership, User } from '../types';

const defaultForm = { id: '', name: '', description: '', isActive: true };

const AccessGroupsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<AccessGroup[]>([]);
  const [catalog, setCatalog] = useState<AccessPermissionCatalogItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<AccessPermissionKey[]>([]);
  const [managementTab, setManagementTab] = useState<'info' | 'permissions' | 'members'>('info');
  const [groupMembers, setGroupMembers] = useState<AccessUserGroupMembership[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addMemberUserId, setAddMemberUserId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    try {
      const [groupsRes, catalogRes, usersRes] = await Promise.all([
        mockApi.access.listGroups({
          search: search || null,
          isActive: statusFilter === 'all' ? null : statusFilter === 'active',
          page: 1,
          pageSize: 200,
        }),
        mockApi.access.listPermissionCatalog(),
        mockApi.users.list(),
      ]);
      setGroups(groupsRes.data?.data || []);
      setCatalog(catalogRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar grupos', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, statusFilter]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const groupedCatalog = useMemo(() => {
    const map = new Map<string, AccessPermissionCatalogItem[]>();
    catalog.forEach((item) => {
      if (!map.has(item.module)) map.set(item.module, []);
      map.get(item.module)!.push(item);
    });
    return Array.from(map.entries());
  }, [catalog]);

  const handleOpenCreate = () => {
    setForm(defaultForm);
    setOpenForm(true);
  };

  const handleOpenEdit = (row: AccessGroup) => {
    setForm({
      id: row.id,
      name: row.name,
      description: row.description || '',
      isActive: row.isActive,
    });
    setOpenForm(true);
  };

  const handleSaveGroup = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'Informe o nome do grupo.', severity: 'error' });
      return;
    }
    setSaving(true);
    try {
      await mockApi.access.saveGroup({
        id: form.id || undefined,
        name: form.name.trim(),
        description: form.description.trim() || null,
        isActive: form.isActive,
      });
      setOpenForm(false);
      setSnackbar({ open: true, message: 'Grupo salvo com sucesso.', severity: 'success' });
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao salvar grupo', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (groupId: string) => {
    try {
      await mockApi.access.deleteGroup(groupId);
      setSnackbar({ open: true, message: 'Grupo removido com sucesso.', severity: 'success' });
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao remover grupo', severity: 'error' });
    }
  };

  const handleOpenGroupManagement = async (group: AccessGroup, tab: 'info' | 'permissions' | 'members' = 'info') => {
    setSelectedGroupId(group.id);
    setSelectedPermissions(group.permissionKeys);
    setManagementTab(tab);
    if (tab === 'members') {
      await loadGroupMembers(group.id);
    }
  };

  const loadGroupMembers = async (groupId: string) => {
    setLoadingMembers(true);
    try {
      const res = await mockApi.access.listGroupMembers(groupId);
      setGroupMembers(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar membros', severity: 'error' });
    } finally {
      setLoadingMembers(false);
    }
  };

  const togglePermission = (key: AccessPermissionKey) => {
    setSelectedPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const savePermissions = async () => {
    if (!selectedGroupId) return;
    try {
      await mockApi.access.saveGroupPermissions(selectedGroupId, selectedPermissions);
      setSnackbar({ open: true, message: 'Permissões salvas com sucesso.', severity: 'success' });
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao salvar permissões', severity: 'error' });
    }
  };

  const handleAddMember = async () => {
    if (!selectedGroupId || !addMemberUserId) {
      setSnackbar({ open: true, message: 'Selecione um usuário para adicionar.', severity: 'error' });
      return;
    }
    try {
      await mockApi.access.addUserToGroups(addMemberUserId, [selectedGroupId]);
      setSnackbar({ open: true, message: 'Membro adicionado com sucesso.', severity: 'success' });
      setAddMemberUserId('');
      await loadGroupMembers(selectedGroupId);
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao adicionar membro', severity: 'error' });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedGroupId) return;
    try {
      await mockApi.access.removeUserFromGroup(userId, selectedGroupId);
      setSnackbar({ open: true, message: 'Membro removido com sucesso.', severity: 'success' });
      await loadGroupMembers(selectedGroupId);
      await load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao remover membro', severity: 'error' });
    }
  };

  const toggleAllPermissionsInModule = (moduleItems: AccessPermissionCatalogItem[]) => {
    const moduleKeys = moduleItems.map((item) => item.key);
    const allSelected = moduleKeys.every((key) => selectedPermissions.includes(key));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !moduleKeys.includes(k)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...moduleKeys])));
    }
  };

  const availableUsersForGroup = useMemo(() => {
    if (!selectedGroupId) return [];
    const memberIds = groupMembers.map((m) => m.userId);
    return users.filter((u) => !memberIds.includes(u.id));
  }, [users, groupMembers, selectedGroupId]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Gestão de Grupos de Acesso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cadastre grupos, gerencie permissões e acompanhe membros vinculados.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleOpenCreate}>
          Novo grupo
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Buscar por nome/descrição"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Ativos</MenuItem>
            <MenuItem value="inactive">Inativos</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Grupo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Permissões</TableCell>
                <TableCell>Membros</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum grupo encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.description || '-'}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleOpenGroupManagement(row, 'permissions')}>
                        {row.permissionKeys.length} permissões
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleOpenGroupManagement(row, 'members')}>
                        {row.membersCount} membros
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={row.isActive ? 'Ativo' : 'Inativo'} color={row.isActive ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(row)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? 'Editar grupo' : 'Novo grupo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome do grupo"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <TextField
              label="Descrição"
              value={form.description}
              multiline
              minRows={3}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(_, checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
                />
              }
              label="Grupo ativo"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveGroup} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(selectedGroup)} onClose={() => setSelectedGroupId(null)} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <GroupWorkIcon />
              <Typography variant="h6">{selectedGroup?.name}</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setSelectedGroupId(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={managementTab} onChange={(_, v) => setManagementTab(v)} aria-label="Gestão de grupo">
            <Tab icon={<GroupWorkIcon />} iconPosition="start" label="Informações" value="info" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Permissões" value="permissions" />
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Membros" value="members" />
          </Tabs>
        </Box>
        <DialogContent dividers>
          {managementTab === 'info' && selectedGroup && (
            <Stack spacing={2}>
              <TextField label="Nome" value={selectedGroup.name} disabled fullWidth />
              <TextField
                label="Descrição"
                value={selectedGroup.description || ''}
                disabled
                multiline
                minRows={3}
                fullWidth
              />
              <FormControlLabel
                control={<Switch checked={selectedGroup.isActive} disabled />}
                label="Grupo ativo"
              />
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Estatísticas
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Permissões:</strong> {selectedGroup.permissionKeys.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Membros:</strong> {selectedGroup.membersCount}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Criado em:</strong> {new Date(selectedGroup.createdAt).toLocaleString('pt-BR')} por{' '}
                    {selectedGroup.createdBy}
                  </Typography>
                  {selectedGroup.updatedAt && (
                    <Typography variant="body2">
                      <strong>Última atualização:</strong> {new Date(selectedGroup.updatedAt).toLocaleString('pt-BR')}{' '}
                      por {selectedGroup.updatedBy}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Stack>
          )}

          {managementTab === 'permissions' && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Selecione as permissões que os membros deste grupo terão. Você pode marcar/desmarcar permissões
                individualmente ou por módulo completo.
              </Typography>
              {groupedCatalog.map(([module, items]) => {
                const allSelected = items.every((item) => selectedPermissions.includes(item.key));
                const someSelected = items.some((item) => selectedPermissions.includes(item.key));
                return (
                  <Paper key={module} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {module}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onChange={() => toggleAllPermissionsInModule(items)}
                          />
                        }
                        label="Todas"
                      />
                    </Stack>
                    <Divider sx={{ mb: 1 }} />
                    <Stack spacing={0.5}>
                      {items.map((item) => (
                        <FormControlLabel
                          key={item.key}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedPermissions.includes(item.key)}
                              onChange={() => togglePermission(item.key)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">
                                {item.label}
                                {item.isCritical && (
                                  <Chip
                                    size="small"
                                    label="Crítica"
                                    color="error"
                                    sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </Stack>
                  </Paper>
                );
              })}
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
                <Typography variant="body2" fontWeight={600}>
                  Total de permissões selecionadas: {selectedPermissions.length} de {catalog.length}
                </Typography>
              </Paper>
            </Stack>
          )}

          {managementTab === 'members' && (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Adicionar membro
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    select
                    size="small"
                    label="Selecione um usuário"
                    value={addMemberUserId}
                    onChange={(e) => setAddMemberUserId(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    disabled={availableUsersForGroup.length === 0}
                  >
                    {availableUsersForGroup.length === 0 ? (
                      <MenuItem value="">Todos os usuários já são membros</MenuItem>
                    ) : (
                      availableUsersForGroup.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.fullName} ({user.email})
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddMember}
                    disabled={!addMemberUserId}
                  >
                    Adicionar
                  </Button>
                </Stack>
              </Paper>

              {loadingMembers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {groupMembers.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Nenhum membro vinculado a este grupo.
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper variant="outlined">
                      <List>
                        {groupMembers.map((member, index) => (
                          <React.Fragment key={`${member.userId}-${member.groupId}`}>
                            {index > 0 && <Divider />}
                            <ListItem
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() => handleRemoveMember(member.userId)}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              }
                            >
                              <ListItemAvatar>
                                <Avatar src={member.avatarUrl || undefined}>{member.userName.charAt(0)}</Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={member.userName}
                                secondary={
                                  <>
                                    {member.userEmail}
                                    <br />
                                    Adicionado em {new Date(member.addedAt).toLocaleDateString('pt-BR')} por{' '}
                                    {member.addedBy}
                                  </>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  )}
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGroupId(null)}>Fechar</Button>
          {managementTab === 'permissions' && (
            <Button variant="contained" onClick={savePermissions}>
              Salvar permissões
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccessGroupsPage;
