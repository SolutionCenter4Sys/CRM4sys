import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { FinancePermissionKey, RolePermissionMatrixModel, RoleType } from '../types';

const PermissionsMatrixPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState<RolePermissionMatrixModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await mockApi.compliance.getRolePermissionMatrix();
        setMatrix(res.data || null);
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (role: RoleType, key: FinancePermissionKey) => {
    if (!matrix) return;
    setMatrix({
      ...matrix,
      grants: {
        ...matrix.grants,
        [role]: {
          ...matrix.grants[role],
          [key]: !matrix.grants[role][key],
        },
      },
    });
  };

  const save = async () => {
    if (!matrix) return;
    setSaving(true);
    try {
      await mockApi.compliance.saveRolePermissionMatrix(matrix);
      setSnackbar({ open: true, message: 'Permissões salvas com sucesso', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Matriz de Permissões Financeiras
      </Typography>

      {loading || !matrix ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Última atualização: {matrix.lastUpdatedAt ? new Date(matrix.lastUpdatedAt).toLocaleString('pt-BR') : '-'} por{' '}
            {matrix.lastUpdatedByName || '-'}
          </Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Permissão</TableCell>
                  {matrix.roles.map((role) => (
                    <TableCell key={role.role} align="center">
                      {role.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {matrix.permissions.map((perm) => (
                  <TableRow key={perm.key}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {perm.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {perm.description}
                      </Typography>
                    </TableCell>
                    {matrix.roles.map((role) => (
                      <TableCell key={`${perm.key}-${role.role}`} align="center">
                        <Checkbox
                          checked={matrix.grants[role.role][perm.key]}
                          onChange={() => toggle(role.role, perm.key)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </Stack>
        </Paper>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PermissionsMatrixPage;
