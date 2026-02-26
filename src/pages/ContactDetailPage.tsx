// Contact Detail Page - Estilo próximo da referência anexada
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Contact, Activity, Deal } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) =>
  value === index ? <Box sx={{ py: 2 }}>{children}</Box> : null;

const rowSurfaceSx = {
  border: '1px solid',
  borderColor: '#D8E1EB',
  bgcolor: '#FFFFFF',
};

const tinyBarSx = {
  height: 8,
  borderRadius: 2,
  bgcolor: '#E4ECF3',
};

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (id) {
      loadContact(id);
    }
  }, [id]);

  const loadContact = async (contactId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockApi.contacts.getById(contactId);
      setContact(response.data || null);
      const [activitiesRes, dealsRes] = await Promise.all([
        mockApi.activities.listByContact(contactId),
        mockApi.deals.listByContact(contactId),
      ]);
      setActivities(activitiesRes.data || []);
      setDeals(dealsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contato');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const activitiesByMonth = useMemo(() => {
    const groups = new Map<string, Activity[]>();
    [...activities]
      .sort(
        (a, b) =>
          new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
      )
      .forEach((activity) => {
        const monthKey = new Intl.DateTimeFormat('pt-BR', {
          month: 'long',
          year: 'numeric',
        }).format(new Date(activity.activityDate));
        const current = groups.get(monthKey) || [];
        current.push(activity);
        groups.set(monthKey, current);
      });
    return Array.from(groups.entries());
  }, [activities]);

  const rightPanels = [
    { label: 'Participantes da lista', count: 0, accent: false },
    { label: 'Empresas', count: contact?.account ? 1 : 0, accent: true },
    { label: 'Negócios', count: deals.length, accent: false },
    { label: 'Tickets', count: 0, accent: false },
    { label: 'Anexos', count: 0, accent: false },
    { label: 'Participante do fluxo de...', count: 0, accent: false },
    { label: 'Manuais de atividades', count: activities.length, accent: true },
    { label: 'Carrinhos', count: 0, accent: false },
    { label: 'Atribuição de criação de...', count: 0, accent: false },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !contact) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Contato não encontrado'}
          <Button
            size="small"
            onClick={() => navigate('/contacts')}
            sx={{ ml: 2 }}
          >
            Voltar para lista
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.25, md: 2 }, bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/contacts')}
        size="small"
        sx={{ color: '#2A8BA8', mb: 1 }}
      >
        Contatos
      </Button>

      <Box
        sx={{
          ...rowSurfaceSx,
          borderRadius: 1,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '280px 1fr 260px' },
        }}
      >
        <Box sx={{ borderRight: { lg: '1px solid #D8E1EB' }, bgcolor: '#FBFCFD' }}>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
              &lt; Contatos
            </Typography>
            <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
              Ações <ExpandMoreIcon sx={{ fontSize: 14, ml: 0.2, mb: -0.2 }} />
            </Typography>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar
                src="/mock-contact-photo.svg"
                alt={contact.fullName}
                sx={{ width: 54, height: 54, border: '1px solid #D8E1EB' }}
              />
              <Box>
                <Typography variant="h6" sx={{ color: '#31556E', fontWeight: 700 }}>
                  {contact.fullName}
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 88, mt: 0.8 }} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.2, mt: 2 }}>
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#B7CBD8',
                      mx: 'auto',
                      mb: 0.6,
                    }}
                  />
                  <Box sx={{ ...tinyBarSx, width: 20 }} />
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#2A8BA8', fontWeight: 700 }}>
              <ExpandMoreIcon sx={{ fontSize: 16, mb: -0.4 }} /> Sobre este contato
            </Typography>

            <Box sx={{ mt: 1.5, display: 'grid', gap: 1.4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                  E-mail
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 130, mt: 0.4 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                  Número de telefone
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 116, mt: 0.4 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                  Proprietário do contato
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 122, mt: 0.4 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                  Status do lead
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 96, mt: 0.4 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                  Fase do ciclo de vida
                </Typography>
                <Box sx={{ ...tinyBarSx, width: 110, mt: 0.4 }} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button variant="outlined" size="small" fullWidth>
                Exibir todas as...
              </Button>
              <Button variant="outlined" size="small" fullWidth>
                Exibir histórico da...
              </Button>
            </Box>
          </Box>

          <Divider />
          <List disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Informações de cliente"
                primaryTypographyProps={{ variant: 'body2', sx: { color: '#31556E' } }}
              />
              <ChevronRightIcon fontSize="small" sx={{ color: '#2A8BA8' }} />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText
                primary="Atividade do website"
                primaryTypographyProps={{ variant: 'body2', sx: { color: '#31556E' } }}
              />
              <ChevronRightIcon fontSize="small" sx={{ color: '#2A8BA8' }} />
            </ListItemButton>
          </List>
        </Box>

        <Box sx={{ borderRight: { lg: '1px solid #D8E1EB' }, bgcolor: '#F3F7FA' }}>
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#FFFFFF', borderBottom: '1px solid #D8E1EB' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1.1 }}>
              <Button size="small" variant="text" sx={{ color: '#31556E', minWidth: 'auto' }}>
                Ações <ExpandMoreIcon fontSize="small" />
              </Button>
              <TextField
                size="small"
                placeholder="Pesquisar atividades"
                sx={{ width: 230 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: '#2A8BA8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 36,
                '& .MuiTab-root': {
                  minHeight: 36,
                  px: 1.25,
                  color: '#4F7188',
                  fontWeight: 600,
                },
                '& .Mui-selected': { color: '#31556E' },
                '& .MuiTabs-indicator': { bgcolor: '#1F3447', height: 3 },
              }}
            >
              <Tab label="Atividade" />
              <Tab label="Observações" />
              <Tab label="E-mails" />
              <Tab label="Chamadas" />
              <Tab label="Tarefas" />
              <Tab label="Reuniões" />
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#4F7188', fontWeight: 600 }}>
                Filtrar por:
              </Typography>
              <Box sx={{ ...tinyBarSx, width: 62, bgcolor: '#15B8B0' }} />
              <Box sx={{ ...tinyBarSx, width: 48, bgcolor: '#15B8B0' }} />
              <Box sx={{ ...tinyBarSx, width: 42, bgcolor: '#15B8B0' }} />
            </Box>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Box sx={{ px: 2, pb: 1 }}>
              {activitiesByMonth.length === 0 ? (
                <Box sx={{ ...rowSurfaceSx, p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4F7188' }}>
                    Nenhuma atividade encontrada para este contato.
                  </Typography>
                </Box>
              ) : (
                activitiesByMonth.map(([month, monthActivities]) => (
                  <Box key={month} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#31556E',
                        fontWeight: 700,
                        mb: 1,
                        textTransform: 'capitalize',
                      }}
                    >
                      {month}
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      {monthActivities.map((activity) => (
                        <Box key={activity.id} sx={{ ...rowSurfaceSx, p: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#31556E' }}>
                              {activity.subject}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#4F7188', fontWeight: 600 }}>
                              {new Date(activity.activityDate).toLocaleString('pt-BR')}
                            </Typography>
                          </Box>
                          <Box sx={{ ...tinyBarSx, width: '56%', mt: 1 }} />
                          <Box sx={{ ...tinyBarSx, width: '62%', mt: 0.8 }} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </TabPanel>

          {[1, 2, 3, 4, 5].map((index) => (
            <TabPanel key={index} value={currentTab} index={index}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ ...rowSurfaceSx, p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#4F7188' }}>
                    Conteúdo mock desta aba será exibido aqui.
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          ))}
        </Box>

        <Box sx={{ bgcolor: '#FBFCFD' }}>
          <List disablePadding>
            {rightPanels.map((panel, idx) => (
              <React.Fragment key={panel.label}>
                <ListItemButton sx={{ py: 1.4 }}>
                  <ChevronRightIcon fontSize="small" sx={{ mr: 0.8, color: '#2A8BA8' }} />
                  <ListItemText
                    primary={`${panel.label} (${panel.count})`}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: '#31556E', fontWeight: 600, whiteSpace: 'nowrap' },
                    }}
                  />
                  <Box
                    sx={{
                      width: 26,
                      height: 6,
                      borderRadius: 2,
                      bgcolor: panel.accent ? '#15B8B0' : '#D8E1EB',
                      ml: 0.8,
                    }}
                  />
                </ListItemButton>
                {idx < rightPanels.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactDetailPage;
