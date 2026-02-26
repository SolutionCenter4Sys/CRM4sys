import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type {
  AccessGroup,
  AccessPermissionCatalogItem,
  AccessPermissionKey,
  AccessPermissionConflict,
  AccessSimulationResult,
  AccessUserGroupMembership,
  DirectUserPermissionGrant,
  EffectiveAccessSummary,
  EffectiveUserPermission,
  User,
} from '../types';

const AccessUserAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('userId');
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<AccessGroup[]>([]);
  const [catalog, setCatalog] = useState<AccessPermissionCatalogItem[]>([]);
  const [userId, setUserId] = useState(userIdFromUrl || '');
  const [memberships, setMemberships] = useState<AccessUserGroupMembership[]>([]);
  const [direct, setDirect] = useState<DirectUserPermissionGrant[]>([]);
  const [summary, setSummary] = useState<EffectiveAccessSummary | null>(null);
  const [effective, setEffective] = useState<EffectiveUserPermission[]>([]);
  const [conflicts, setConflicts] = useState<AccessPermissionConflict[]>([]);
  const [openGrant, setOpenGrant] = useState(false);
  const [grantPermissionKey, setGrantPermissionKey] = useState<AccessPermissionKey>('deals.view');
  const [grantJustification, setGrantJustification] = useState('');
  const [grantExpiresAt, setGrantExpiresAt] = useState('');
  const [groupToAdd, setGroupToAdd] = useState('');
  const [simulation, setSimulation] = useState<AccessSimulationResult | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const selectedUser = useMemo(() => users.find((u) => u.id === userId) || null, [users, userId]);

  const loadBase = async () => {
    setLoading(true);
    try {
      const [usersRes, groupsRes, catalogRes] = await Promise.all([
        mockApi.users.list(),
        mockApi.access.listGroups({ search: null, isActive: true, page: 1, pageSize: 200 }),
        mockApi.access.listPermissionCatalog(),
      ]);
      const usersRows = usersRes.data || [];
      setUsers(usersRows);
      setGroups(groupsRes.data?.data || []);
      setCatalog(catalogRes.data || []);
      
      // Se veio userId da URL, usa ele; senão, usa o primeiro usuário
      const targetUserId = userIdFromUrl || usersRows[0]?.id || '';
      if (targetUserId && !userId) {
        setUserId(targetUserId);
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar dados', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserAccess = async (targetUserId: string) => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const [groupsRes, directRes, effectiveRes] = await Promise.all([
        mockApi.access.listUserGroups(targetUserId),
        mockApi.access.listDirectPermissions(targetUserId),
        mockApi.access.getEffectiveAccess(targetUserId),
      ]);
      setMemberships(groupsRes.data || []);
      setDirect(directRes.data || []);
      setSummary(effectiveRes.data?.summary || null);
      setEffective(effectiveRes.data?.permissions || []);
      setConflicts(effectiveRes.data?.conflicts || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar acesso do usuário', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    if (userId) loadUserAccess(userId);
  }, [userId]);

  const addGroup = async () => {
    if (!userId || !groupToAdd) return;
    try {
      await mockApi.access.addUserToGroups(userId, [groupToAdd]);
      setSnackbar({ open: true, message: 'Usuário vinculado ao grupo.', severity: 'success' });
      setGroupToAdd('');
      await loadUserAccess(userId);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao vincular grupo', severity: 'error' });
    }
  };

  const removeGroup = async (groupId: string) => {
    if (!userId) return;
    try {
      await mockApi.access.removeUserFromGroup(userId, groupId);
      setSnackbar({ open: true, message: 'Usuário removido do grupo.', severity: 'success' });
      await loadUserAccess(userId);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao remover grupo', severity: 'error' });
    }
  };

  const grantDirect = async () => {
    if (!userId || !grantJustification.trim()) {
      setSnackbar({ open: true, message: 'Preencha justificativa para conceder acesso.', severity: 'error' });
      return;
    }
    try {
      await mockApi.access.grantDirectPermission({
        userId,
        permissionKey: grantPermissionKey,
        justification: grantJustification.trim(),
        expiresAt: grantExpiresAt || null,
      });
      setOpenGrant(false);
      setGrantJustification('');
      setGrantExpiresAt('');
      setSnackbar({ open: true, message: 'Permissão direta concedida.', severity: 'success' });
      await loadUserAccess(userId);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao conceder permissão', severity: 'error' });
    }
  };

  const revokeDirect = async (grantId: string) => {
    if (!userId) return;
    try {
      await mockApi.access.revokeDirectPermission(grantId);
      setSnackbar({ open: true, message: 'Permissão revogada.', severity: 'success' });
      await loadUserAccess(userId);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao revogar permissão', severity: 'error' });
    }
  };

  const resolveConflict = async (conflictId: string) => {
    if (!userId) return;
    try {
      await mockApi.access.resolveConflict(conflictId, 'revoke_direct');
      setSnackbar({ open: true, message: 'Conflito resolvido.', severity: 'success' });
      await loadUserAccess(userId);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao resolver conflito', severity: 'error' });
    }
  };

  const runSimulation = async (action: 'grant_permission' | 'revoke_permission') => {
    if (!userId) return;
    try {
      const res = await mockApi.access.simulateChange(userId, action);
      setSimulation(res.data || null);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha na simulação', severity: 'error' });
    }
  };

  const availableGroups = groups.filter((g) => !memberships.some((m) => m.groupId === g.id));

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate('/access/users')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            Gestão de Acesso — {selectedUser?.fullName || 'Usuário'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure grupos, permissões diretas e visualize o acesso efetivo.
          </Typography>
        </Box>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label="Usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            sx={{ minWidth: 320 }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" onClick={() => setOpenGrant(true)} disabled={!selectedUser}>
            Conceder permissão direta
          </Button>
          <Button variant="outlined" onClick={() => runSimulation('grant_permission')} disabled={!selectedUser}>
            Simular concessão
          </Button>
          <Button variant="outlined" onClick={() => runSimulation('revoke_permission')} disabled={!selectedUser}>
            Simular revogação
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Resumo de acesso efetivo</Typography>
            {summary ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip label={`Grupos: ${summary.groupsCount}`} />
                <Chip label={`Diretas: ${summary.directPermissionsCount}`} />
                <Chip label={`Herdadas: ${summary.inheritedPermissionsCount}`} />
                <Chip label={`Total: ${summary.totalEffectivePermissions}`} color="primary" />
                <Chip label={`Conflitos: ${summary.conflictsCount}`} color={summary.conflictsCount > 0 ? 'warning' : 'default'} />
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selecione um usuário para calcular o acesso efetivo.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Grupos vinculados</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ my: 1 }}>
              <TextField
                select
                size="small"
                label="Adicionar em grupo"
                value={groupToAdd}
                onChange={(e) => setGroupToAdd(e.target.value)}
                sx={{ minWidth: 260 }}
              >
                <MenuItem value="">Selecione...</MenuItem>
                {availableGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" onClick={addGroup} disabled={!groupToAdd}>
                Adicionar
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {memberships.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sem grupos vinculados.
                </Typography>
              ) : (
                memberships.map((m) => (
                  <Chip key={`${m.userId}-${m.groupId}`} label={m.groupName} onDelete={() => removeGroup(m.groupId)} />
                ))
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Permissões diretas
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Permissão</TableCell>
                    <TableCell>Justificativa</TableCell>
                    <TableCell>Válida até</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {direct.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          Nenhuma permissão direta ativa.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    direct.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.permissionLabel}</TableCell>
                        <TableCell>{row.justification}</TableCell>
                        <TableCell>{row.expiresAt ? new Date(row.expiresAt).toLocaleDateString('pt-BR') : 'Sem validade'}</TableCell>
                        <TableCell align="right">
                          <Button color="error" size="small" onClick={() => revokeDirect(row.id)}>
                            Revogar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Permissões efetivas (diretas e herdadas)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {effective.map((perm) => (
                <Chip
                  key={`${perm.permissionKey}-${perm.origin}-${perm.sourceName}`}
                  label={`${perm.permissionLabel} (${perm.origin === 'direct' ? 'Direta' : `Grupo: ${perm.sourceName}`})`}
                  color={perm.origin === 'direct' ? 'primary' : 'default'}
                  variant={perm.origin === 'direct' ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Conflitos de permissão
            </Typography>
            {conflicts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhum conflito identificado.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {conflicts.map((conflict) => (
                  <Paper key={conflict.conflictId} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{conflict.reason}</Typography>
                      <Button size="small" variant="outlined" onClick={() => resolveConflict(conflict.conflictId)}>
                        Resolver
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          {simulation && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Resultado da simulação</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Impacto previsto antes de aplicar mudanças.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`Adicionadas: ${simulation.diff.added.length}`} color="success" />
                <Chip label={`Removidas: ${simulation.diff.removed.length}`} color="warning" />
                <Chip label={`Críticas: ${simulation.diff.criticalChanges.length}`} color={simulation.diff.criticalChanges.length > 0 ? 'error' : 'default'} />
              </Stack>
            </Paper>
          )}
        </Stack>
      )}

      <Dialog open={openGrant} onClose={() => setOpenGrant(false)} fullWidth maxWidth="sm">
        <DialogTitle>Conceder permissão direta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Permissão"
              value={grantPermissionKey}
              onChange={(e) => setGrantPermissionKey(e.target.value as AccessPermissionKey)}
            >
              {catalog.map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Justificativa"
              multiline
              minRows={3}
              value={grantJustification}
              onChange={(e) => setGrantJustification(e.target.value)}
            />
            <TextField
              label="Válida até (opcional)"
              type="date"
              value={grantExpiresAt}
              onChange={(e) => setGrantExpiresAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGrant(false)}>Cancelar</Button>
          <Button variant="contained" onClick={grantDirect}>
            Conceder
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

export default AccessUserAccessPage;
