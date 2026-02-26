import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { mockApi } from '../mock/api';
import type { AccessElevationRequest, AccessPermissionCatalogItem, AccessPermissionKey, User } from '../types';

const AccessApprovalsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [catalog, setCatalog] = useState<AccessPermissionCatalogItem[]>([]);
  const [rows, setRows] = useState<AccessElevationRequest[]>([]);
  const [status, setStatus] = useState<'all' | AccessElevationRequest['status']>('all');
  const [myUserId, setMyUserId] = useState('');
  const [permissionKey, setPermissionKey] = useState<AccessPermissionKey>('billing.manage');
  const [justification, setJustification] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadBase = async () => {
    try {
      const [usersRes, catalogRes] = await Promise.all([mockApi.users.list(), mockApi.access.listPermissionCatalog()]);
      const usersRows = usersRes.data || [];
      setUsers(usersRows);
      setCatalog(catalogRes.data || []);
      if (!myUserId && usersRows[0]) setMyUserId(usersRows[0].id);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar base', severity: 'error' });
    }
  };

  const loadRequests = async () => {
    try {
      const res = await mockApi.access.listElevationRequests({ status });
      setRows(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao carregar solicitações', severity: 'error' });
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [status]);

  const requestElevation = async () => {
    if (!myUserId || !justification.trim() || !validFrom || !validUntil) {
      setSnackbar({ open: true, message: 'Preencha todos os campos da solicitação.', severity: 'error' });
      return;
    }
    try {
      await mockApi.access.requestElevation({
        userId: myUserId,
        permissionKey,
        justification: justification.trim(),
        validFrom: `${validFrom}T00:00:00Z`,
        validUntil: `${validUntil}T23:59:59Z`,
      });
      setJustification('');
      setSnackbar({ open: true, message: 'Solicitação criada com sucesso.', severity: 'success' });
      await loadRequests();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao criar solicitação', severity: 'error' });
    }
  };

  const review = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await mockApi.access.reviewElevationRequest(requestId, action, null);
      setSnackbar({
        open: true,
        message: action === 'approve' ? 'Solicitação aprovada.' : 'Solicitação rejeitada.',
        severity: 'success',
      });
      await loadRequests();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao revisar solicitação', severity: 'error' });
    }
  };

  const cancel = async (requestId: string) => {
    try {
      await mockApi.access.cancelElevationRequest(requestId);
      setSnackbar({ open: true, message: 'Solicitação cancelada.', severity: 'success' });
      await loadRequests();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Falha ao cancelar solicitação', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        Workflow de Elevação de Privilégios
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Nova solicitação
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField select label="Usuário solicitante" size="small" value={myUserId} onChange={(e) => setMyUserId(e.target.value)} sx={{ minWidth: 280 }}>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.fullName}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Permissão" size="small" value={permissionKey} onChange={(e) => setPermissionKey(e.target.value as AccessPermissionKey)} sx={{ minWidth: 280 }}>
            {catalog.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField size="small" type="date" label="Início" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField size="small" type="date" label="Fim" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Stack>
        <TextField
          fullWidth
          label="Justificativa"
          multiline
          minRows={2}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={requestElevation}>
          Solicitar elevação
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="approved">Aprovado</MenuItem>
            <MenuItem value="rejected">Rejeitado</MenuItem>
            <MenuItem value="cancelled">Cancelado</MenuItem>
            <MenuItem value="expired">Expirado</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Solicitante</TableCell>
              <TableCell>Permissão</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Justificativa</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    Nenhuma solicitação encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.requestId}>
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>{row.permissionLabel}</TableCell>
                  <TableCell>
                    {new Date(row.validFrom).toLocaleDateString('pt-BR')} a {new Date(row.validUntil).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{row.justification}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} color={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'error' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'pending' ? (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" color="success" onClick={() => review(row.requestId, 'approve')}>
                          Aprovar
                        </Button>
                        <Button size="small" color="error" onClick={() => review(row.requestId, 'reject')}>
                          Rejeitar
                        </Button>
                        {row.canCancel && (
                          <Button size="small" onClick={() => cancel(row.requestId)}>
                            Cancelar
                          </Button>
                        )}
                      </Stack>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default AccessApprovalsPage;
