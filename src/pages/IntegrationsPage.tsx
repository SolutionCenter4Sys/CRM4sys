import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { mockApi } from '../mock/api';
import type { Integration, IntegrationStatus, IntegrationType } from '../types';

const typeConfig: Record<IntegrationType, { label: string; color: string; icon: string }> = {
  slack: { label: 'Slack', color: '#4A154B', icon: '💬' },
  teams: { label: 'Microsoft Teams', color: '#6264A7', icon: '👥' },
  webhook: { label: 'Webhook', color: '#2563EB', icon: '🔗' },
  jira: { label: 'Jira', color: '#0052CC', icon: '📋' },
  email: { label: 'Email', color: '#16A34A', icon: '📧' },
};

const statusChip: Record<IntegrationStatus, { label: string; color: 'success' | 'default' | 'error' }> = {
  connected: { label: 'Conectado', color: 'success' },
  disconnected: { label: 'Desconectado', color: 'default' },
  error: { label: 'Erro', color: 'error' },
};

const IntegrationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await mockApi.integrations.list();
        setIntegrations(res.data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar integrações');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggle = async (integrationId: string, eventId: string) => {
    try {
      const res = await mockApi.integrations.toggleEvent(integrationId, eventId);
      if (res.data) {
        setIntegrations((prev) =>
          prev.map((i) => (i.id === integrationId ? res.data as Integration : i))
        );
      }
    } catch {
      setError('Erro ao atualizar evento');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Integrações</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure notificações e integrações com ferramentas externas.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {integrations.map((integration) => {
            const tc = typeConfig[integration.type];
            const sc = statusChip[integration.status];
            return (
              <Card key={integration.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="h5">{tc.icon}</Typography>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{tc.label}</Typography>
                          <Chip size="small" label={sc.label} color={sc.color} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{integration.description}</Typography>
                      </Box>
                    </Stack>
                    {integration.configuredAt && (
                      <Typography variant="caption" color="text.secondary">
                        Configurado por {integration.configuredBy} em {new Date(integration.configuredAt).toLocaleDateString('pt-BR')}
                      </Typography>
                    )}
                  </Stack>

                  {Object.keys(integration.settings).length > 0 && integration.status === 'connected' && (
                    <Box sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={2}>
                        {Object.entries(integration.settings).map(([key, value]) => (
                          <TextField key={key} size="small" label={key} value={value} disabled variant="outlined" sx={{ minWidth: 200 }} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Eventos</Typography>
                  <Stack spacing={0.8}>
                    {integration.events.map((event) => (
                      <Stack key={event.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5, px: 1, borderRadius: 1, bgcolor: event.enabled ? 'success.light' : 'grey.50' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: event.enabled ? 600 : 400 }}>{event.label}</Typography>
                          {event.channel && (
                            <Typography variant="caption" color="text.secondary">{event.channel}</Typography>
                          )}
                        </Box>
                        <Switch
                          size="small"
                          checked={event.enabled}
                          onChange={() => handleToggle(integration.id, event.id)}
                          disabled={integration.status !== 'connected'}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default IntegrationsPage;
