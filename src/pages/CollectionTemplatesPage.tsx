// CollectionTemplatesPage.tsx - Templates de cobrança (F2)
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { TemplateModel } from '../types';

const CollectionTemplatesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<TemplateModel[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await mockApi.collections.listTemplates();
      setTemplates(res.data || []);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao carregar templates', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handlePreview = (template: TemplateModel) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const channelLabelMap = { email: 'E-mail', sms: 'SMS', whatsapp: 'WhatsApp' };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Templates de Cobrança
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Recarregar">
            <IconButton onClick={loadTemplates} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => alert('Criar template (MVP)')}>
            Novo Template
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
                <TableCell>Canal</TableCell>
                <TableCell>Versões</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhum template configurado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((tpl) => (
                  <TableRow key={tpl.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {tpl.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={channelLabelMap[tpl.channel]} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{tpl.versions.length} versões</TableCell>
                    <TableCell>
                      <Chip label={tpl.isActive ? 'Ativo' : 'Inativo'} color={tpl.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => handlePreview(tpl)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => alert('Editar template (MVP)')}>
                            <EditIcon fontSize="small" />
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview do Template</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Stack spacing={2}>
              <Typography variant="h6">{selectedTemplate.name}</Typography>
              <Chip label={channelLabelMap[selectedTemplate.channel]} size="small" />
              {selectedTemplate.versions.length > 0 && (
                <>
                  {selectedTemplate.channel === 'email' && selectedTemplate.versions[0].subject && (
                    <TextField label="Assunto" fullWidth value={selectedTemplate.versions[0].subject} InputProps={{ readOnly: true }} />
                  )}
                  <TextField
                    label="Corpo"
                    fullWidth
                    multiline
                    rows={6}
                    value={selectedTemplate.versions[0].body}
                    InputProps={{ readOnly: true }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Variáveis disponíveis: {selectedTemplate.variables.map((v) => v.key).join(', ')}
                  </Typography>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

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

export default CollectionTemplatesPage;
