import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
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
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { SsoConfig, SsoStatus } from '../types';

const statusConfig: Record<SsoStatus, { label: string; color: 'success' | 'default' | 'warning' }> = {
  active: { label: 'Ativo', color: 'success' },
  inactive: { label: 'Inativo', color: 'default' },
  testing: { label: 'Em teste', color: 'warning' },
};

const SsoConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SsoConfig | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await mockApi.sso.getConfig();
        setConfig(res.data || null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar SSO');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await mockApi.sso.testConnection();
      setTestResult(res.data || null);
    } catch {
      setTestResult({ success: false, message: 'Falha no teste de conexão' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!config) return <Box sx={{ p: 3 }}><Alert severity="warning">Configuração SSO não encontrada.</Alert></Box>;

  const sc = statusConfig[config.status];

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
        <SecurityIcon sx={{ fontSize: 32, color: '#7C3AED' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>SSO / SAML</Typography>
          <Typography variant="body2" color="text.secondary">
            Configuração de Single Sign-On para autenticação enterprise.
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 3 }}>
        {/* Config card */}
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Configuração</Typography>
              <Chip label={sc.label} color={sc.color} />
            </Stack>

            <Stack spacing={2}>
              <TextField size="small" label="Protocolo" value={config.protocol.toUpperCase()} disabled fullWidth />
              <TextField size="small" label="Provedor" value={config.providerName} disabled fullWidth />
              <TextField size="small" label="Entity ID" value={config.entityId} disabled fullWidth />
              <TextField size="small" label="SSO URL" value={config.ssoUrl} disabled fullWidth />
              <TextField size="small" label="Certificado" value={config.certificate || 'Não configurado'} disabled fullWidth />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Obrigatório para todos</Typography>
                  <Typography variant="caption" color="text.secondary">Forçar SSO para todos os usuários</Typography>
                </Box>
                <Switch checked={config.enforceForAllUsers} disabled />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Fallback por senha</Typography>
                  <Typography variant="caption" color="text.secondary">Permitir login por senha se SSO falhar</Typography>
                </Box>
                <Switch checked={config.allowPasswordFallback} disabled />
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" color="text.secondary">
              Configurado por {config.configuredBy} em {new Date(config.configuredAt).toLocaleDateString('pt-BR')}
            </Typography>
          </CardContent>
        </Card>

        {/* Mappings + Test */}
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Mapeamento de Atributos</Typography>
              <Stack spacing={1}>
                {config.mappings.map((m) => (
                  <Stack key={m.crmField} direction="row" spacing={1} alignItems="center">
                    <TextField size="small" label="SSO Attribute" value={m.ssoAttribute.split('/').pop() || m.ssoAttribute} disabled sx={{ flex: 1 }} />
                    <Typography variant="body2" sx={{ px: 1 }}>→</Typography>
                    <TextField size="small" label="CRM Field" value={m.crmField} disabled sx={{ flex: 0.5 }} />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Teste de Conexão</Typography>

              {config.lastTestedAt && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  {config.lastTestResult === 'success' ? (
                    <CheckCircleIcon fontSize="small" sx={{ color: '#16A34A' }} />
                  ) : (
                    <Alert severity="error" sx={{ flex: 1, py: 0 }}>Último teste falhou</Alert>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Último teste: {new Date(config.lastTestedAt).toLocaleString('pt-BR')} — {config.lastTestResult === 'success' ? 'Sucesso' : 'Falha'}
                  </Typography>
                </Stack>
              )}

              <Button variant="contained" onClick={handleTest} disabled={testing} fullWidth>
                {testing ? <CircularProgress size={20} /> : 'Testar Conexão SAML'}
              </Button>

              {testResult && (
                <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mt: 1.5 }}>
                  {testResult.message}
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ bgcolor: '#F5F3FF' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#7C3AED' }}>
                Provisionamento automático
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quando habilitado, novos usuários que fizerem login via SSO serão criados automaticamente no CRM com permissões do grupo padrão.
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Switch checked disabled />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>SCIM Provisioning ativo</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default SsoConfigPage;
