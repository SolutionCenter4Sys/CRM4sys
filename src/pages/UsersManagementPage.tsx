import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  GroupWork as GroupWorkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import type { AccessUserGroupMembership, User, UserRole } from '../types';

type UserFormData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

const defaultForm: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'sales',
  isActive: true,
};

const UsersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [userGroups, setUserGroups] = useState<Map<string, AccessUserGroupMembership[]>>(new Map());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openForm, setOpenForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserFormData>(defaultForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await mockApi.users.list();
      const usersRows = res.data || [];
      setUsers(usersRows);

      const groupsMap = new Map<string, AccessUserGroupMembership[]>();
      await Promise.all(
        usersRows.map(async (user) => {
          try {
            const groupsRes = await mockApi.access.listUserGroups(user.id);
            groupsMap.set(user.id, groupsRes.data || []);
          } catch {
            groupsMap.set(user.id, []);
          }
        })
      );
      setUserGroups(groupsMap);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar usuários', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      !search ||
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive : !user.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const handleOpenCreate = () => {
    setForm(defaultForm);
    setOpenForm(true);
  };

  const handleOpenEdit = (user: User) => {
    setForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setOpenForm(true);
  };

  const handleSaveUser = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setSnackbar({ open: true, message: 'Preencha todos os campos obrigatórios.', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<User> = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        role: form.role,
        isActive: form.isActive,
        updatedAt: new Date().toISOString(),
      };

      if (form.id) {
        // Simula update (mock não tem endpoint específico, então apenas atualiza localmente)
        const index = users.findIndex((u) => u.id === form.id);
        if (index >= 0) {
          const updated = [...users];
          updated[index] = { ...users[index], ...payload };
          setUsers(updated);
          setSnackbar({ open: true, message: 'Usuário atualizado com sucesso.', severity: 'success' });
        }
      } else {
        // Simula create
        const newUser: User = {
          id: `user-${Date.now()}`,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          role: form.role,
          isActive: form.isActive,
          avatar: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers([newUser, ...users]);
        setSnackbar({ open: true, message: 'Usuário criado com sucesso.', severity: 'success' });
      }

      setOpenForm(false);
      setForm(defaultForm);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao salvar usuário', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSnackbar({ open: true, message: 'Usuário excluído com sucesso.', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao excluir usuário', severity: 'error' });
    }
  };

  const handleManageAccess = (userId: string) => {
    navigate(`/access/user/detail?userId=${userId}`);
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gerente',
      sales: 'Vendedor',
      marketing: 'Marketing',
      support: 'Suporte',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
      admin: 'error',
      manager: 'warning',
      sales: 'info',
      marketing: 'success',
      support: 'default',
    };
    return colors[role] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Gestão de Usuários
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie usuários, perfis e permissões de acesso ao sistema.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Novo usuário
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Buscar por nome ou email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Perfil"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="manager">Gerente</MenuItem>
            <MenuItem value="sales">Vendedor</MenuItem>
            <MenuItem value="marketing">Marketing</MenuItem>
            <MenuItem value="support">Suporte</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
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
                <TableCell>Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Criado em</TableCell>
                <TableCell>Grupos de acesso</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum usuário encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const groups = userGroups.get(user.id) || [];
                  return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.avatar || undefined} sx={{ width: 32, height: 32 }}>
                          {user.fullName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {user.fullName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip size="small" label={getRoleLabel(user.role)} color={getRoleColor(user.role)} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={user.isActive ? 'Ativo' : 'Inativo'} color={user.isActive ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {groups.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Sem grupos
                        </Typography>
                      ) : (
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                Grupos de {user.fullName}:
                              </Typography>
                              {groups.map((g) => (
                                <Typography key={g.groupId} variant="caption" display="block">
                                  • {g.groupName}
                                </Typography>
                              ))}
                            </Box>
                          }
                        >
                          <Button size="small" startIcon={<GroupWorkIcon />} onClick={() => handleManageAccess(user.id)}>
                            {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Gerenciar acesso">
                        <IconButton size="small" color="primary" onClick={() => handleManageAccess(user.id)}>
                          <SecurityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Visualizar">
                        <IconButton size="small" onClick={() => handleOpenEdit(user)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenEdit(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Sobrenome"
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              select
              label="Perfil"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
              required
              fullWidth
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="manager">Gerente</MenuItem>
              <MenuItem value="sales">Vendedor</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
              <MenuItem value="support">Suporte</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(_, checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
                />
              }
              label="Usuário ativo"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveUser} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
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

export default UsersManagementPage;
