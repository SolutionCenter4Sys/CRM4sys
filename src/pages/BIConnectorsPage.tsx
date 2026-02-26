import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { BiConnectorStatus } from '../types';

const connectorLabel: Record<BiConnectorStatus['connector'], string> = {
  power_bi: 'Power BI',
  google_sheets: 'Google Sheets',
  api: 'Public API',
};

const BIConnectorsPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BiConnectorStatus[]>([]);

  const load = async () => {
    try {
      const response = await mockApi.biConnectors.list();
      setItems(response.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar conectores');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleConnector = async (connector: BiConnectorStatus['connector']) => {
    try {
      setError(null);
      await mockApi.biConnectors.toggle(connector);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar conector');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        BI Connectors
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Conectores para Power BI, Google Sheets e API (modo stub/mock).
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={1}>
            {items.map((item) => (
              <Paper key={item.connector} variant="outlined" sx={{ p: 1.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {connectorLabel[item.connector]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.details || 'Sem detalhes'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={item.connected ? 'Conectado' : 'Desconectado'} color={item.connected ? 'success' : 'default'} />
                    <Button size="small" variant="outlined" onClick={() => toggleConnector(item.connector)}>
                      {item.connected ? 'Desconectar' : 'Conectar'}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BIConnectorsPage;
