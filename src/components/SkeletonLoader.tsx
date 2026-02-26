import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack, TableCell, TableRow } from '@mui/material';

/** Skeleton para uma linha de tabela com N colunas */
export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 6 }) => (
  <TableRow>
    {Array.from({ length: cols }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton variant="text" width={i === 0 ? 32 : '80%'} height={20} animation="wave" />
      </TableCell>
    ))}
  </TableRow>
);

/** Skeleton para lista de linhas de tabela */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 8,
  cols = 6,
}) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} cols={cols} />
    ))}
  </>
);

/** Skeleton para card de KPI */
export const KpiCardSkeleton: React.FC = () => (
  <Card sx={{ minWidth: 180 }}>
    <CardContent sx={{ pb: '16px !important' }}>
      <Skeleton variant="text" width="60%" height={14} animation="wave" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={36} animation="wave" />
      <Skeleton variant="text" width="50%" height={20} animation="wave" sx={{ mt: 0.5 }} />
    </CardContent>
  </Card>
);

/** Skeleton para o grid de KPIs do dashboard */
export const KpiGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 2,
      mb: 3,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <KpiCardSkeleton key={i} />
    ))}
  </Box>
);

/** Skeleton para card de deal no kanban */
export const DealCardSkeleton: React.FC = () => (
  <Box
    sx={{
      p: 1.5,
      mb: 1,
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Skeleton variant="text" width="75%" height={18} animation="wave" />
    <Skeleton variant="text" width="50%" height={14} animation="wave" sx={{ mt: 0.5 }} />
    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
      <Skeleton variant="text" width={60} height={14} animation="wave" />
      <Skeleton variant="circular" width={24} height={24} animation="wave" />
    </Stack>
  </Box>
);

/** Skeleton para coluna do Kanban */
export const KanbanColumnSkeleton: React.FC<{ cards?: number }> = ({ cards = 3 }) => (
  <Box
    sx={{
      minWidth: 280,
      bgcolor: 'grey.50',
      borderRadius: 2,
      p: 1.5,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Skeleton variant="text" width={100} height={20} animation="wave" />
      <Skeleton variant="rounded" width={40} height={20} animation="wave" />
    </Box>
    {Array.from({ length: cards }).map((_, i) => (
      <DealCardSkeleton key={i} />
    ))}
  </Box>
);

/** Skeleton para o pipeline inteiro */
export const PipelineSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
    {Array.from({ length: columns }).map((_, i) => (
      <KanbanColumnSkeleton key={i} cards={3 + (i % 2)} />
    ))}
  </Box>
);

/** Skeleton para chart / gráfico */
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <Skeleton
    variant="rounded"
    width="100%"
    height={height}
    animation="wave"
    sx={{ borderRadius: 2 }}
  />
);

/** Skeleton para linha de lista (contato/empresa) */
export const ListItemSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Skeleton variant="circular" width={36} height={36} animation="wave" />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" height={16} animation="wave" />
      <Skeleton variant="text" width="60%" height={14} animation="wave" />
    </Box>
    <Skeleton variant="rounded" width={60} height={22} animation="wave" />
  </Box>
);

/** Skeleton genérico de página (header + KPIs + tabela) */
export const PageSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Skeleton variant="text" width={220} height={36} animation="wave" />
        <Skeleton variant="text" width={320} height={20} animation="wave" sx={{ mt: 0.5 }} />
      </Box>
      <Skeleton variant="rounded" width={130} height={36} animation="wave" />
    </Box>
    <KpiGridSkeleton count={4} />
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <React.Fragment key={i}>
          <ListItemSkeleton />
        </React.Fragment>
      ))}
    </Box>
  </Box>
);
