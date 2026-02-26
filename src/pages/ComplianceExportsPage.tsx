import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { ComplianceExportJob, ComplianceExportRequest } from '../types';

const ComplianceExportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lastJob, setLastJob] = useState<ComplianceExportJob | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const requestExport = async (format: 'csv' | 'xlsx') => {
    setLoading(true);
    try {
      const req: ComplianceExportRequest = {
        format,
        filters: {
          periodFrom: null,
          periodTo: null,
          userId: null,
          entityType: null,
          action: null,
          severity: null,
          query: '',
          page: 1,
          pageSize: 100,
        },
        includeDiffs: true,
        maskSensitive: true,
        requestedByUserId: null,
      };
      const res = await mockApi.compliance.requestComplianceExport(req);
      setLastJob(res.data || null);
      setSnackbar({ open: true, message: res.message || 'Exportação solicitada', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Exportar Logs de Compliance
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Gere um arquivo com os logs de auditoria respeitando mascaramento de dados sensíveis.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => requestExport('csv')}
            disabled={loading}
          >
            Exportar CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => requestExport('xlsx')}
            disabled={loading}
          >
            Exportar XLSX
          </Button>
        </Stack>

        {lastJob && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Último job de exportação</Typography>
              <Chip
                size="small"
                label={lastJob.status}
                color={lastJob.status === 'done' ? 'success' : lastJob.status === 'error' ? 'error' : 'default'}
              />
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Solicitado em: {new Date(lastJob.requestedAt).toLocaleString('pt-BR')}
            </Typography>
            {lastJob.fileName && (
              <Typography variant="body2">
                Arquivo: {lastJob.fileName}
              </Typography>
            )}
            {lastJob.downloadUrl && (
              <Button size="small" sx={{ mt: 1 }} href={lastJob.downloadUrl} target="_blank">
                Baixar arquivo
              </Button>
            )}
          </Paper>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplianceExportsPage;
