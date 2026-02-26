// CollectionRulesPage.tsx - Régua de cobrança (F2)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { CollectionRule } from '../types';

const CollectionRulesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<CollectionRule[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await mockApi.collections.listRules();
      setRules(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar réguas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleToggleActive = async (rule: CollectionRule) => {
    try {
      await mockApi.collections.saveRule({ ...rule, isActive: !rule.isActive });
      setSnackbar({ open: true, message: `Régua ${!rule.isActive ? 'ativada' : 'desativada'}`, severity: 'success' });
      loadRules();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta régua?')) return;
    try {
      await mockApi.collections.removeRule(id);
      setSnackbar({ open: true, message: 'Régua removida', severity: 'success' });
      loadRules();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Réguas de Cobrança
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Recarregar">
            <IconButton onClick={loadRules} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => alert('Criar régua (MVP)')}>
            Nova Régua
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Etapas</TableCell>
                <TableCell>Aplica-se a</TableCell>
                <TableCell align="center">Ativa</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhuma régua configurada
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {rule.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={rule.isActive ? 'Ativa' : 'Inativa'} color={rule.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>{rule.steps.length} etapas</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {rule.appliesToStatus.map((st) => (
                          <Chip key={st} label={st} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Switch checked={rule.isActive} onChange={() => handleToggleActive(rule)} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => alert('Editar régua (MVP)')}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" color="error" onClick={() => handleDelete(rule.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollectionRulesPage;
