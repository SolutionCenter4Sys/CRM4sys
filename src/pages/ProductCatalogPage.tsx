import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { mockApi } from '../mock/api';
import type { Product, ProductCategory, ProductFilters, PricingModel } from '../types';

const categoryLabels: Record<ProductCategory, { label: string; color: string }> = {
  license: { label: 'Licença', color: '#2563EB' },
  saas: { label: 'SaaS', color: '#7C3AED' },
  squad: { label: 'Squad', color: '#16A34A' },
  consulting: { label: 'Consultoria', color: '#F59E0B' },
  support: { label: 'Suporte', color: '#DC2626' },
  training: { label: 'Treinamento', color: '#EC4899' },
};

const pricingLabels: Record<PricingModel, string> = {
  per_user: 'Por usuário',
  per_feature: 'Por feature',
  flat: 'Valor fixo',
  hourly: 'Por hora',
  per_squad: 'Por squad',
  tiered: 'Escalonado',
  usage_based: 'Por uso',
};

const recurrenceLabels: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
  one_time: 'Único',
};

const ProductCatalogPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mockApi.products.list(filters);
      setProducts(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.category, filters.pricingModel, filters.recurrence]);

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalMrr = products
    .filter((p) => p.isActive && p.recurrence !== 'one_time')
    .reduce((sum, p) => sum + p.basePrice, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Catálogo de Produtos & Serviços
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Produtos, licenças, squads e serviços disponíveis para composição de propostas.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* KPIs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <MiniKpi label="Produtos Ativos" value={String(products.filter((p) => p.isActive).length)} />
        <MiniKpi label="Categorias" value={String(new Set(products.map((p) => p.category)).size)} />
        <MiniKpi label="Base Price MRR" value={`R$ ${totalMrr.toLocaleString('pt-BR')}`} />
        <MiniKpi label="Margem Média" value={`${(products.reduce((s, p) => s + p.marginPercent, 0) / (products.length || 1)).toFixed(0)}%`} />
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Buscar produto..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: { xs: '100%', md: 220 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Categoria</InputLabel>
            <Select value={filters.category || ''} label="Categoria" onChange={(e) => updateFilter('category', e.target.value as ProductFilters['category'])}>
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(categoryLabels).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Precificação</InputLabel>
            <Select value={filters.pricingModel || ''} label="Precificação" onChange={(e) => updateFilter('pricingModel', e.target.value as ProductFilters['pricingModel'])}>
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(pricingLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 140 } }}>
            <InputLabel>Recorrência</InputLabel>
            <Select value={filters.recurrence || ''} label="Recorrência" onChange={(e) => updateFilter('recurrence', e.target.value as ProductFilters['recurrence'])}>
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(recurrenceLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(auto-fill, minmax(360px, 1fr))' },
            gap: 2,
          }}
        >
          {products.map((product) => {
            const cat = categoryLabels[product.category];
            return (
              <Card
                key={product.id}
                variant="outlined"
                sx={{
                  borderLeft: `4px solid ${cat.color}`,
                  opacity: product.isActive ? 1 : 0.6,
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.code}
                      </Typography>
                    </Box>
                    <Chip size="small" label={cat.label} sx={{ bgcolor: cat.color, color: '#fff', fontWeight: 600 }} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1.5 }}>
                    {product.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
                    <Chip size="small" label={pricingLabels[product.pricingModel]} variant="outlined" />
                    <Chip size="small" label={recurrenceLabels[product.recurrence]} variant="outlined" />
                    {!product.isActive && <Chip size="small" label="Inativo" color="default" />}
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        R$ {product.basePrice.toLocaleString('pt-BR')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.pricingModel === 'per_user' ? '/usuário' : product.pricingModel === 'hourly' ? '/hora' : product.pricingModel === 'per_squad' ? '/squad' : ''}
                        {product.recurrence !== 'one_time' ? ` /${recurrenceLabels[product.recurrence].toLowerCase()}` : ' (único)'}
                      </Typography>
                    </Box>
                    <Tooltip title={`Custo: R$ ${product.costPrice.toLocaleString('pt-BR')}`}>
                      <Chip
                        size="small"
                        label={`Margem ${product.marginPercent}%`}
                        color={product.marginPercent >= 50 ? 'success' : product.marginPercent >= 30 ? 'warning' : 'error'}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Stack>

                  {product.tiers && product.tiers.length > 0 && (
                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Faixas de preço:</Typography>
                      <Stack spacing={0.3} sx={{ mt: 0.5 }}>
                        {product.tiers.map((tier) => (
                          <Stack key={tier.name} direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">
                              {tier.name} ({tier.minUnits}-{tier.maxUnits ?? '∞'})
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              R$ {tier.pricePerUnit}/user
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {product.features.length > 0 && (
                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {product.features.map((f) => (
                          <Chip key={f} size="small" label={f} variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const MiniKpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card variant="outlined">
    <CardContent sx={{ pb: '12px !important' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 'clamp(1.1rem, 4.5vw, 1.35rem)', sm: '1.25rem' },
          lineHeight: 1.2,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default ProductCatalogPage;
