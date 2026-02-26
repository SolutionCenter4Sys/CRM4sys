import React from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  AutoAwesome as AiIcon,
  DrawOutlined as TemplateIcon,
  PictureAsPdfOutlined as PdfIcon,
  ApprovalOutlined as ApprovalIcon,
  LinkOutlined as IntegrationIcon,
  BarChartOutlined as AnalyticsIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as TodoIcon,
  RadioButtonChecked as InProgressIcon,
} from '@mui/icons-material';

// ── Feature cards ──────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bg: string;
  tag?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, bg, tag }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      borderRadius: 2.5,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.2,
      '&:hover': { boxShadow: 2, borderColor: color },
      transition: 'all 0.2s',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        {icon}
      </Box>
      {tag && (
        <Chip
          label={tag}
          size="small"
          sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: bg, color, border: 'none' }}
        />
      )}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.3 }}>{title}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
        {description}
      </Typography>
    </Box>
  </Paper>
);

// ── Roadmap item ───────────────────────────────────────────────────────────────

interface RoadmapItemProps {
  label: string;
  status: 'done' | 'in_progress' | 'todo';
  description: string;
}

const STATUS_CONFIG = {
  done:        { icon: <CheckIcon sx={{ fontSize: 16 }} />,       color: '#16A34A', label: 'Concluído' },
  in_progress: { icon: <InProgressIcon sx={{ fontSize: 16 }} />,  color: '#7C3AED', label: 'Em desenvolvimento' },
  todo:        { icon: <TodoIcon sx={{ fontSize: 16 }} />,         color: '#94A3B8', label: 'Planejado' },
};

const RoadmapItem: React.FC<RoadmapItemProps> = ({ label, status, description }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: cfg.color, mt: 0.1, flexShrink: 0 }}>{cfg.icon}</Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>{label}</Typography>
          <Chip
            label={cfg.label}
            size="small"
            sx={{ height: 18, fontSize: 10, fontWeight: 600, bgcolor: `${cfg.color}15`, color: cfg.color, border: 'none' }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">{description}</Typography>
      </Box>
    </Box>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const ProposalsPage: React.FC = () => (
  <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>

    {/* ── Header ── */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>Propostas Comerciais</Typography>
      <Typography variant="body2" color="text.secondary">
        Nova funcionalidade em desenvolvimento — confira o que está chegando.
      </Typography>
    </Box>

    {/* ── Hero Banner ── */}
    <Box
      sx={{
        mb: 4,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1E0A4C 0%, #4C1D95 50%, #7C3AED 100%)',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
      }}
    >
      <Box sx={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
      <Box sx={{ position: 'absolute', bottom: -30, right: 100, width: 130, height: 130, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
      <Box sx={{ position: 'absolute', top: 20, right: 260, width: 70, height: 70, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />

      <Box sx={{ px: 4, py: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
          {/* Ícone */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AiIcon sx={{ fontSize: 34, color: '#E9D5FF' }} />
          </Box>

          {/* Texto */}
          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>
                Geração de Propostas com IA
              </Typography>
              <Chip
                label="🚀 Março 2026"
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#E9D5FF',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, maxWidth: 560 }}>
              Crie propostas comerciais completas em segundos. A IA vai analisar o perfil do cliente,
              o histórico de negociações e os produtos selecionados para gerar uma proposta personalizada,
              pronta para enviar.
            </Typography>

            {/* Pills */}
            <Stack direction="row" sx={{ mt: 2, gap: 0.8, flexWrap: 'wrap' }}>
              {['Geração automática', 'PDF com identidade visual', 'Aprovação integrada', 'Assinatura digital'].map((feat) => (
                <Chip
                  key={feat}
                  label={feat}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.88)',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* ── Feature Preview Grid ── */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
        O que está chegando
      </Typography>
      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        <FeatureCard
          icon={<AiIcon />}
          title="Geração com IA"
          description="Descreva o negócio e a IA monta o escopo, preços e condições comerciais automaticamente."
          color="#7C3AED"
          bg="rgba(124,58,237,0.1)"
          tag="Destaque"
        />
        <FeatureCard
          icon={<TemplateIcon />}
          title="Templates Inteligentes"
          description="Biblioteca de templates por segmento e tipo de venda, personalizáveis com a identidade da empresa."
          color="#2563EB"
          bg="rgba(37,99,235,0.1)"
        />
        <FeatureCard
          icon={<PdfIcon />}
          title="PDF Profissional"
          description="Geração automática de PDF com logo, cores da marca e layout editável — pronto para enviar ao cliente."
          color="#DC2626"
          bg="rgba(220,38,38,0.08)"
        />
        <FeatureCard
          icon={<ApprovalIcon />}
          title="Fluxo de Aprovação"
          description="Defina aprovadores internos, notificações automáticas e histórico de revisões antes do envio."
          color="#D97706"
          bg="rgba(217,119,6,0.1)"
        />
        <FeatureCard
          icon={<IntegrationIcon />}
          title="Link de Aceite Digital"
          description="O cliente recebe um link seguro, visualiza a proposta no navegador e assina eletronicamente."
          color="#16A34A"
          bg="rgba(22,163,74,0.1)"
        />
        <FeatureCard
          icon={<AnalyticsIcon />}
          title="Analytics de Propostas"
          description="Veja taxa de abertura, tempo médio de resposta, conversão por tipo de proposta e motivos de perda."
          color="#0891B2"
          bg="rgba(8,145,178,0.1)"
        />
      </Box>
    </Box>

    {/* ── Roadmap ── */}
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
        Roadmap de entrega
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <RoadmapItem
          status="done"
          label="Estrutura de dados e tipos"
          description="Modelagem de Proposta, itens de linha, aprovadores e versionamento definidos."
        />
        <RoadmapItem
          status="done"
          label="Integração com Pipeline de Deals"
          description="Propostas vinculadas a Negócios, com rastreamento de status e valores MRR/ARR."
        />
        <RoadmapItem
          status="in_progress"
          label="Engine de IA para geração de conteúdo"
          description="Treinamento do modelo com base em propostas históricas e catálogo de produtos."
        />
        <RoadmapItem
          status="todo"
          label="Editor visual de proposta"
          description="Interface drag-and-drop para customizar seções, imagens e tabelas de preço."
        />
        <RoadmapItem
          status="todo"
          label="Fluxo de aprovação e assinatura digital"
          description="Workflow configurável com notificações e link de aceite para o cliente."
        />
      </Stack>
    </Paper>

  </Box>
);

export default ProposalsPage;
