// CRM B2B Tech Foursys - Mock Data
// Data: 14/02/2026
// PostgreSQL/Supabase UUIDs format

import type {
  Contact,
  Account,
  Deal,
  User,
  Pipeline,
  Stage,
  Activity,
  Lead,
  LeadScoreDetails,
  LifecycleFunnel,
  NurtureSequence,
  ReportDefinition,
  ReportSchedule,
  ReportExecutionLog,
  ExportJob,
  BiConnectorStatus,
  Invoice,
  ConnectorViewModel,
  CollectionRule,
  TemplateModel,
  CollectionJob,
  AllocationEntry,
  InvoiceHistoryEvent,
  AuditEvent,
  RolePermissionMatrixModel,
  ComplianceExportJob,
  AccessPermissionCatalogItem,
  AccessGroup,
  AccessUserGroupMembership,
  DirectUserPermissionGrant,
  EffectiveUserPermission,
  EffectiveAccessSummary,
  AccessPermissionConflict,
  AccessElevationRequest,
  AccessAuditEvent,
  AccessExportRecord,
  Campaign,
  MarketingEmail,
  EmailMetrics,
  Ad,
  AdAccount,
  AdAudience,
  MarketingEvent,
  EventIntegration,
  RateCard,
} from '../types';
import { createMockContacts } from './contacts-data';

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'Maria',
    lastName: 'Santos',
    fullName: 'Maria Santos',
    email: 'maria.santos@foursys.com.br',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'manager',
    isActive: true,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    firstName: 'Pedro',
    lastName: 'Oliveira',
    fullName: 'Pedro Oliveira',
    email: 'pedro.oliveira@foursys.com.br',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'sales',
    isActive: true,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    firstName: 'Ana',
    lastName: 'Silva',
    fullName: 'Ana Silva',
    email: 'ana.silva@foursys.com.br',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'sales',
    isActive: true,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    firstName: 'João',
    lastName: 'Costa',
    fullName: 'João Costa',
    email: 'joao.costa@foursys.com.br',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'marketing',
    isActive: true,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
];

// ============================================================================
// MOCK ACCOUNTS
// ============================================================================

export const mockAccounts: Account[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    clientCode: 'CLI-0001',
    name: 'Foursys Tecnologia',
    legalName: 'FOURSYS TECNOLOGIA LTDA',
    tradeName: 'Foursys',
    cnpj: '12.345.678/0001-90',
    domain: 'foursys.com.br',
    emailDomain: 'foursys.com.br',
    emailGroup: 'contato@foursys.com.br',
    linkedin: 'linkedin.com/company/foursys',
    website: 'https://www.foursys.com.br',
    phone: '+55 (11) 3000-4000',
    industry: 'Tecnologia',
    segment: 'Tecnologia da Informação',
    accountStatus: 'active',
    numberOfEmployees: 500,
    annualRevenue: 25000000,
    address: {
      street: 'Av. Paulista, 1000',
      complement: '10º andar',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil',
    },
    branches: [
      {
        id: 'branch-001',
        name: 'Foursys Tecnologia — Filial Rio de Janeiro',
        cnpj: '12.345.678/0002-71',
        type: 'filial',
        address: {
          street: 'Av. Rio Branco, 181',
          complement: 'Sala 1200',
          neighborhood: 'Centro',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20040-007',
          country: 'Brasil',
        },
        phone: '+55 (21) 3200-5000',
        email: 'rj@foursys.com.br',
        isActive: true,
      },
      {
        id: 'branch-002',
        name: 'Foursys Tecnologia — Filial Campinas',
        cnpj: '12.345.678/0003-52',
        type: 'filial',
        address: {
          street: 'Rua José de Alencar, 500',
          complement: '4º andar',
          neighborhood: 'Cambuí',
          city: 'Campinas',
          state: 'SP',
          zipCode: '13025-130',
          country: 'Brasil',
        },
        phone: '+55 (19) 3100-2000',
        email: 'campinas@foursys.com.br',
        isActive: true,
      },
    ],
    billingConditions: {
      paymentTerms: '30 dias',
      billingCycle: 'monthly',
      paymentMethod: 'Boleto',
      creditLimit: 500000,
      currency: 'BRL',
      billingEmail: 'financeiro@foursys.com.br',
      billingContact: 'Carla Mendes',
      invoiceFormat: 'nfse',
      taxRegime: 'Lucro Presumido',
      invoiceEmissionLimit: 'R$ 100.000 / mês',
      invoicePaymentTerm: '30 dias após emissão',
      requiresPO: false,
      invoiceEmail: 'nf@foursys.com.br',
      invoiceDescription: 'Serviços de tecnologia conforme contrato vigente',
      additionalInfo: 'Enviar NF até o 5º dia útil do mês. Aprovação interna obrigatória acima de R$ 100.000.',
      notes: 'Emissão NFS-e até o 5º dia útil do mês. Aprovação interna necessária para faturas acima de R$ 100.000.',
    },
    tier: 'Enterprise',
    icpScore: 90,
    targetAccount: true,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    owner: mockUsers[0],
    techStack: ['.NET', 'Azure', 'React', 'SQL Server'],
    enrichedAt: '2026-02-10T10:00:00Z',
    enrichmentSource: 'BrasilAPI',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    contactCount: 30,
    openDealsCount: 3,
    totalDealsValue: 1500000,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    clientCode: 'CLI-0002',
    name: 'Tech Corp Solutions',
    legalName: 'TECH CORP SOLUTIONS LTDA',
    cnpj: '23.456.789/0001-01',
    domain: 'techcorp.com.br',
    emailDomain: 'techcorp.com.br',
    linkedin: 'linkedin.com/company/techcorp-solutions',
    website: 'https://techcorp.com.br',
    phone: '+55 (11) 4000-5000',
    industry: 'Consultoria',
    segment: 'Serviços Profissionais',
    accountStatus: 'active',
    numberOfEmployees: 250,
    annualRevenue: 12000000,
    address: {
      street: 'Rua Augusta, 500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01304-000',
      country: 'Brasil',
    },
    billingConditions: {
      paymentTerms: '45 dias',
      billingCycle: 'monthly',
      paymentMethod: 'PIX',
      creditLimit: 200000,
      currency: 'BRL',
      billingEmail: 'ap@techcorp.com.br',
      billingContact: 'Ricardo Alves',
      invoiceFormat: 'nfe',
      taxRegime: 'Lucro Presumido',
      invoicePaymentTerm: '45 dias corridos',
      requiresPO: true,
      invoiceEmail: 'nf@techcorp.com.br',
      invoiceDescription: 'Consultoria e serviços de TI',
    },
    tier: 'MidMarket',
    icpScore: 75,
    targetAccount: true,
    ownerId: '550e8400-e29b-41d4-a716-446655440002',
    owner: mockUsers[1],
    techStack: ['Java', 'AWS', 'Angular'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    contactCount: 22,
    openDealsCount: 2,
    totalDealsValue: 800000,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    clientCode: 'CLI-0003',
    name: 'StartupX Inovação',
    legalName: 'STARTUPX INOVACAO LTDA',
    cnpj: '34.567.890/0001-12',
    domain: 'startupx.com.br',
    emailDomain: 'startupx.com.br',
    website: 'https://startupx.com.br',
    phone: '+55 (11) 9800-1234',
    industry: 'SaaS',
    segment: 'Tecnologia da Informação',
    accountStatus: 'prospection',
    numberOfEmployees: 50,
    annualRevenue: 3000000,
    address: {
      street: 'Av. Faria Lima, 1200',
      complement: 'Sala 300',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01451-000',
      country: 'Brasil',
    },
    billingConditions: {
      paymentTerms: 'À vista',
      billingCycle: 'monthly',
      paymentMethod: 'Cartão de Crédito',
      creditLimit: 50000,
      currency: 'BRL',
      billingEmail: 'finance@startupx.com.br',
      billingContact: 'Ana Lima',
      invoiceFormat: 'nfse',
      taxRegime: 'Simples Nacional',
    },
    tier: 'SMB',
    icpScore: 60,
    targetAccount: false,
    ownerId: '550e8400-e29b-41d4-a716-446655440003',
    owner: mockUsers[2],
    techStack: ['Node.js', 'React', 'MongoDB'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    contactCount: 15,
    openDealsCount: 1,
    totalDealsValue: 150000,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    clientCode: 'CLI-0004',
    name: 'BigCo Enterprises',
    legalName: 'BIGCO ENTERPRISES SA',
    cnpj: '45.678.901/0001-23',
    domain: 'bigco.com.br',
    emailDomain: 'bigco.com.br',
    emailGroup: 'comercial@bigco.com.br',
    linkedin: 'linkedin.com/company/bigco-enterprises',
    website: 'https://bigco.com.br',
    phone: '+55 (21) 2000-8000',
    industry: 'Telecomunicações',
    segment: 'Telecomunicações',
    accountStatus: 'active',
    numberOfEmployees: 2000,
    annualRevenue: 150000000,
    address: {
      street: 'Av. Brasil, 3000',
      complement: 'Torre A, 5º andar',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-000',
      country: 'Brasil',
    },
    branches: [
      {
        id: 'branch-bigco-001',
        name: 'BigCo Enterprises — Unidade São Paulo',
        cnpj: '45.678.901/0002-04',
        type: 'filial',
        address: {
          street: 'Av. das Nações Unidas, 12901',
          complement: '18º andar',
          neighborhood: 'Brooklin',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04578-000',
          country: 'Brasil',
        },
        phone: '+55 (11) 5000-9000',
        email: 'sp@bigco.com.br',
        isActive: true,
        isBillingAddress: true,
      },
      {
        id: 'branch-bigco-002',
        name: 'BigCo Enterprises — Unidade Belo Horizonte',
        cnpj: '45.678.901/0003-85',
        type: 'filial',
        address: {
          street: 'Av. Afonso Pena, 4000',
          complement: 'Sala 800',
          neighborhood: 'Serra',
          city: 'Belo Horizonte',
          state: 'MG',
          zipCode: '30130-009',
          country: 'Brasil',
        },
        phone: '+55 (31) 3400-6000',
        email: 'bh@bigco.com.br',
        isActive: true,
      },
      {
        id: 'branch-bigco-003',
        name: 'BigCo Enterprises — Unidade Brasília (inativa)',
        cnpj: '45.678.901/0004-66',
        type: 'filial',
        address: {
          street: 'SHN Quadra 2, Bl. F',
          neighborhood: 'Asa Norte',
          city: 'Brasília',
          state: 'DF',
          zipCode: '70702-905',
          country: 'Brasil',
        },
        isActive: false,
      },
    ],
    billingConditions: {
      paymentTerms: '60 dias',
      billingCycle: 'quarterly',
      paymentMethod: 'Transferência Bancária',
      creditLimit: 2000000,
      currency: 'BRL',
      billingEmail: 'contas-pagar@bigco.com.br',
      billingContact: 'Fernanda Costa',
      invoiceFormat: 'nfe',
      taxRegime: 'Lucro Real',
      invoiceEmissionLimit: 'R$ 500.000 / trimestre',
      invoicePaymentTerm: '60 dias após entrega da NF',
      requiresPO: true,
      invoiceEmail: 'notasfiscais@bigco.com.br',
      invoiceDescription: 'Serviços de telecomunicações e infraestrutura',
      additionalInfo: 'Necessário envio do PO antes da emissão. Consolidação trimestral de faturas.',
      notes: 'Pedido de compra (PO) obrigatório antes da emissão. Faturamento consolidado por trimestre.',
    },
    tier: 'Enterprise',
    icpScore: 85,
    targetAccount: true,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    owner: mockUsers[0],
    techStack: ['.NET', 'Oracle', 'SAP'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    contactCount: 40,
    openDealsCount: 5,
    totalDealsValue: 5000000,
  },
];

// ============================================================================
// MOCK CONTACTS - 109 contatos gerados via factory (contacts-data.ts)
// ============================================================================

export const mockContacts: Contact[] = createMockContacts(mockAccounts, mockUsers);

// ============================================================================
// MOCK PIPELINES & STAGES
// ============================================================================

export const mockPipelines: Pipeline[] = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Pipeline de Vendas B2B',
    description: 'Pipeline padrão para vendas B2B complexas',
    isDefault: true,
    stages: [],
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
];

export const mockStages: Stage[] = [
  {
    id: '990e8400-e29b-41d4-a716-446655440001',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Prospecção',
    description: 'Identificação de oportunidades',
    probability: 10,
    displayOrder: 1,
    color: '#4C8BF5',
    rotAfterDays: 30,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440002',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Qualificação',
    description: 'Qualificação de fit e interest',
    probability: 25,
    displayOrder: 2,
    color: '#00B4D8',
    rotAfterDays: 20,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440006',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Viabilidade',
    description: 'Validação técnica e financeira da oportunidade',
    probability: 40,
    displayOrder: 3,
    color: '#7C5CFF',
    rotAfterDays: 18,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440003',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Proposta',
    description: 'Envio de proposta comercial',
    probability: 50,
    displayOrder: 4,
    color: '#FFB800',
    rotAfterDays: 15,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440004',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'FUP',
    description: 'Follow-up e negociação de termos e condições',
    probability: 75,
    displayOrder: 5,
    color: '#FF8C00',
    rotAfterDays: 10,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440005',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Vencido',
    description: 'Contrato assinado e negócio vencido',
    probability: 90,
    displayOrder: 6,
    color: '#00B341',
    rotAfterDays: 7,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440007',
    pipelineId: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Perdido',
    description: 'Negócio perdido para concorrência ou sem continuidade',
    probability: 0,
    displayOrder: 7,
    color: '#E53935',
    rotAfterDays: 0,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
];

// Add stages to pipeline
mockPipelines[0].stages = mockStages;

// ============================================================================
// MOCK DEALS
// ============================================================================

// ── Deal generator para simular 120 oportunidades simultâneas ────────────────
const _PIPELINE_ID = '880e8400-e29b-41d4-a716-446655440001';
const _STAGES = [
  { id: '990e8400-e29b-41d4-a716-446655440001', prob: 10, name: 'Prospecção' },
  { id: '990e8400-e29b-41d4-a716-446655440002', prob: 25, name: 'Qualificação' },
  { id: '990e8400-e29b-41d4-a716-446655440006', prob: 40, name: 'Viabilidade' },
  { id: '990e8400-e29b-41d4-a716-446655440003', prob: 50, name: 'Proposta' },
  { id: '990e8400-e29b-41d4-a716-446655440004', prob: 75, name: 'FUP' },
  { id: '990e8400-e29b-41d4-a716-446655440005', prob: 90, name: 'Fechamento' },
];
const _COMPANIES = [
  'Foursys Tecnologia','BigCo Enterprises','StartupX Inovação','Tech Corp Solutions',
  'Vinci Automação','Ágora Digital','Nexus IT','Plataforma B','DataSphere',
  'CloudNative Co.','FinTech Hub','Logística 4.0','MedTech Partners','RetailMax',
  'EduSoft','GovTech SP','Indústria 5.0','SmartCity Solutions','BioData AI','SeguraBank',
];
const _TITLES = [
  'CRM Enterprise', 'Cloud Migration', 'DevOps Platform', 'Análise de Dados',
  'ERP Integration', 'Cybersecurity Suite', 'Data Warehouse', 'BI Dashboard',
  'Microserviços', 'App Mobile B2B', 'API Gateway', 'AI/ML Platform',
  'Infra Modernização', 'Transformação Digital', 'SaaS Licenças', 'IoT Platform',
  'RPA Automação', 'LGPD Compliance', 'HR Tech Suite', 'Supply Chain AI',
];
const _TAGS_POOL = [
  ['Enterprise','High Value'],['Cloud','AWS'],['Cloud','Azure'],['SaaS','Recorrente'],
  ['Custom Dev','Backend'],['BI','Analytics'],['Mobile','iOS/Android'],['AI','ML'],
  ['DevOps','CI/CD'],['Security','Compliance'],['ERP','SAP'],['Integration','API'],
];
const _OWNERS = mockUsers.slice(0, 4);
const _ACCOUNTS = mockAccounts.slice(0, 4);

// Valores reais por estágio: early stages têm deals menores, late stages têm deals maiores
const _AMOUNTS_BY_STAGE = [
  [30000, 45000, 60000, 80000, 50000, 75000, 40000, 90000, 35000, 55000],   // Prospecção
  [80000, 120000, 150000, 200000, 100000, 180000, 90000, 250000, 130000, 160000], // Qualificação
  [200000, 300000, 400000, 500000, 250000, 450000, 320000, 380000, 280000, 420000], // Viabilidade
  [350000, 500000, 650000, 800000, 420000, 600000, 750000, 550000, 700000, 480000], // Proposta
  [600000, 900000, 1200000, 1500000, 800000, 1100000, 700000, 1300000, 950000, 1050000], // Negociação
  [1000000, 1500000, 1800000, 2000000, 1200000, 1600000, 900000, 2200000, 1400000, 1700000], // Fechamento
];
// Rotting realista: deals novos têm baixo rotting, deals parados têm alto
const _ROTTING_BY_STAGE = [
  [1, 3, 5, 8, 2, 12, 4, 6, 9, 1],   // Prospecção: mistura (alguns parados)
  [2, 5, 8, 11, 3, 7, 14, 4, 6, 9],  // Qualificação
  [1, 4, 6, 9, 2, 8, 5, 11, 3, 7],   // Viabilidade
  [2, 5, 7, 10, 3, 6, 8, 4, 9, 5],   // Proposta
  [1, 3, 5, 7, 2, 4, 6, 3, 8, 5],    // Negociação: urgência, rotting mais baixo
  [0, 1, 2, 3, 1, 2, 0, 4, 1, 2],    // Fechamento: quase fechando, rotting baixo
];

function _genDeal(idx: number): Deal {
  const stageIdx = idx < 25 ? 0 : idx < 48 ? 1 : idx < 68 ? 2 : idx < 85 ? 3 : idx < 100 ? 4 : 5;
  const stage = _STAGES[stageIdx];
  const stageRef = mockStages.find((s) => s.id === stage.id)!;
  const amountPool = _AMOUNTS_BY_STAGE[stageIdx];
  const amount = amountPool[idx % 10];
  const rottingPool = _ROTTING_BY_STAGE[stageIdx];
  const rotting = rottingPool[idx % 10];
  // Apenas 10% dos deals têm rotting crítico (realista)
  const finalRotting = (idx % 10 === 3) ? rotting + 8 : rotting;
  const isWon = idx >= 110 && idx < 116;
  const isLost = idx >= 116;
  const account = _ACCOUNTS[idx % 4];
  const owner = _OWNERS[idx % 4];
  const monthsAhead = stageIdx <= 1 ? 3 + (idx % 3) : stageIdx <= 3 ? 1 + (idx % 2) : 0 + (idx % 2);
  const closeDate = new Date(2026, 1 + monthsAhead, 10 + (idx % 18));
  const daysAgo = stageIdx === 0 ? 5 + (idx % 20) : stageIdx === 1 ? 10 + (idx % 25) : 20 + (idx % 30);
  const created = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return {
    id: `110e8400-e29b-41d4-a716-4466554400${String(idx + 5).padStart(2, '0')}`,
    title: `${_TITLES[idx % 20]} — ${_COMPANIES[idx % 20]}`,
    description: `Oportunidade ${idx + 1}: ${_TITLES[idx % 20]} para ${_COMPANIES[idx % 20]}`,
    amount,
    probability: stage.prob,
    weightedAmount: Math.round((amount * stage.prob) / 100),
    expectedCloseDate: closeDate.toISOString().split('T')[0],
    pipelineId: _PIPELINE_ID,
    pipeline: mockPipelines[0],
    stageId: stage.id,
    stage: stageRef,
    accountId: account.id,
    account,
    ownerId: owner.id,
    owner,
    status: isWon ? 'won' : isLost ? 'lost' : 'open',
    tags: _TAGS_POOL[idx % 12],
    rottingDays: finalRotting,
    createdAt: created.toISOString(),
    updatedAt: new Date(Date.now() - (idx % 5) * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export const mockDeals: Deal[] = [
  // Deals originais (IDs preservados para compatibilidade)
  {
    id: '110e8400-e29b-41d4-a716-446655440001',
    title: 'Implementação Sistema CRM Customizado',
    description: 'Desenvolvimento de CRM B2B customizado para Foursys',
    amount: 500000, probability: 50, weightedAmount: 250000,
    expectedCloseDate: '2026-03-30', pipelineId: _PIPELINE_ID, pipeline: mockPipelines[0],
    stageId: '990e8400-e29b-41d4-a716-446655440003',
    stage: mockStages.find((s) => s.id === '990e8400-e29b-41d4-a716-446655440003'),
    accountId: '660e8400-e29b-41d4-a716-446655440001', account: mockAccounts[0],
    primaryContactId: '770e8400-e29b-41d4-a716-446655440001', primaryContact: mockContacts[0],
    ownerId: '550e8400-e29b-41d4-a716-446655440001', owner: mockUsers[0],
    status: 'open', tags: ['Enterprise', 'Custom Development'], rottingDays: 5,
    createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-02-09T15:00:00Z',
  },
  {
    id: '110e8400-e29b-41d4-a716-446655440002',
    title: 'Consultoria Azure Cloud Migration',
    description: 'Migração de infraestrutura on-premise para Azure',
    amount: 300000, probability: 75, weightedAmount: 225000,
    expectedCloseDate: '2026-04-15', pipelineId: _PIPELINE_ID, pipeline: mockPipelines[0],
    stageId: '990e8400-e29b-41d4-a716-446655440004',
    stage: mockStages.find((s) => s.id === '990e8400-e29b-41d4-a716-446655440004'),
    accountId: '660e8400-e29b-41d4-a716-446655440002', account: mockAccounts[1],
    primaryContactId: '770e8400-e29b-41d4-a716-446655440002', primaryContact: mockContacts[1],
    ownerId: '550e8400-e29b-41d4-a716-446655440002', owner: mockUsers[1],
    status: 'open', tags: ['Cloud', 'Consultoria'], rottingDays: 8,
    createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-02-06T12:00:00Z',
  },
  {
    id: '110e8400-e29b-41d4-a716-446655440003',
    title: 'Licenças SaaS - Plano Enterprise',
    description: 'Contratação anual de plataforma SaaS',
    amount: 100000, probability: 25, weightedAmount: 25000,
    expectedCloseDate: '2026-05-01', pipelineId: _PIPELINE_ID, pipeline: mockPipelines[0],
    stageId: '990e8400-e29b-41d4-a716-446655440002',
    stage: mockStages.find((s) => s.id === '990e8400-e29b-41d4-a716-446655440002'),
    accountId: '660e8400-e29b-41d4-a716-446655440003', account: mockAccounts[2],
    primaryContactId: '770e8400-e29b-41d4-a716-446655440003', primaryContact: mockContacts[2],
    ownerId: '550e8400-e29b-41d4-a716-446655440003', owner: mockUsers[2],
    status: 'open', tags: ['SaaS', 'Recorrente'], rottingDays: 12,
    createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-02T14:00:00Z',
  },
  {
    id: '110e8400-e29b-41d4-a716-446655440004',
    title: 'Modernização Sistema Legado',
    description: 'Refatoração de sistema legado para arquitetura moderna',
    amount: 800000, probability: 90, weightedAmount: 720000,
    expectedCloseDate: '2026-03-15', pipelineId: _PIPELINE_ID, pipeline: mockPipelines[0],
    stageId: '990e8400-e29b-41d4-a716-446655440005',
    stage: mockStages.find((s) => s.id === '990e8400-e29b-41d4-a716-446655440005'),
    accountId: '660e8400-e29b-41d4-a716-446655440004', account: mockAccounts[3],
    primaryContactId: '770e8400-e29b-41d4-a716-446655440004', primaryContact: mockContacts[3],
    ownerId: '550e8400-e29b-41d4-a716-446655440001', owner: mockUsers[0],
    status: 'open', tags: ['Enterprise', 'Modernization', 'Hot Deal'], rottingDays: 2,
    createdAt: '2026-01-25T10:00:00Z', updatedAt: '2026-02-12T17:00:00Z',
  },
  // 120 oportunidades geradas para simular pipeline real com alto volume
  ...Array.from({ length: 120 }, (_, i) => _genDeal(i)),
];

// ============================================================================
// MOCK ACTIVITIES
// ============================================================================

export const mockActivities: Activity[] = [
  {
    id: '220e8400-e29b-41d4-a716-446655440001',
    type: 'email',
    subject: 'Proposta Comercial - CRM Customizado',
    description: 'Envio de proposta detalhada com escopo, cronograma e preços',
    relatedContactId: '770e8400-e29b-41d4-a716-446655440001',
    relatedAccountId: '660e8400-e29b-41d4-a716-446655440001',
    relatedDealId: '110e8400-e29b-41d4-a716-446655440001',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    user: mockUsers[0],
    activityDate: '2026-02-13T14:30:00Z',
    isSystemGenerated: false,
    createdAt: '2026-02-13T14:30:00Z',
    updatedAt: '2026-02-13T14:30:00Z',
  },
  {
    id: '220e8400-e29b-41d4-a716-446655440002',
    type: 'call',
    subject: 'Discovery Call - Necessidades Cloud',
    description: 'Ligação de 45min discutindo necessidades de migração cloud',
    relatedContactId: '770e8400-e29b-41d4-a716-446655440002',
    relatedAccountId: '660e8400-e29b-41d4-a716-446655440002',
    relatedDealId: '110e8400-e29b-41d4-a716-446655440002',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    user: mockUsers[1],
    activityDate: '2026-02-12T10:00:00Z',
    duration: 45,
    isSystemGenerated: false,
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-02-12T10:00:00Z',
  },
  {
    id: '220e8400-e29b-41d4-a716-446655440003',
    type: 'meeting',
    subject: 'Reunião de Fechamento - Contrato',
    description: 'Reunião presencial para assinatura de contrato',
    relatedContactId: '770e8400-e29b-41d4-a716-446655440004',
    relatedAccountId: '660e8400-e29b-41d4-a716-446655440004',
    relatedDealId: '110e8400-e29b-41d4-a716-446655440004',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    user: mockUsers[0],
    activityDate: '2026-02-12T14:00:00Z',
    duration: 120,
    isSystemGenerated: false,
    createdAt: '2026-02-12T14:00:00Z',
    updatedAt: '2026-02-12T14:00:00Z',
  },
  {
    id: '220e8400-e29b-41d4-a716-446655440004',
    type: 'stage_change',
    subject: 'Deal movido: Negociação → Fechamento',
    description: 'Deal "Modernização Sistema Legado" avançou para Fechamento',
    relatedDealId: '110e8400-e29b-41d4-a716-446655440004',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    user: mockUsers[0],
    activityDate: '2026-02-12T17:00:00Z',
    isSystemGenerated: true,
    metadata: {
      from_stage: 'Negociação',
      to_stage: 'Fechamento',
      from_probability: 75,
      to_probability: 90,
    },
    createdAt: '2026-02-12T17:00:00Z',
    updatedAt: '2026-02-12T17:00:00Z',
  },
];

// ============================================================================
// MOCK LEADS + LEAD SCORE DETAILS (EP03)
// ============================================================================

export const mockLeads: Lead[] = [
  {
    id: '330e8400-e29b-41d4-a716-446655440001',
    firstName: 'Bruno',
    lastName: 'Azevedo',
    fullName: 'Bruno Azevedo',
    email: 'bruno.azevedo@novadata.com.br',
    phone: '+55 11 97777-1234',
    company: 'NovaData Analytics',
    jobTitle: 'Head de Dados',
    source: 'linkedin',
    status: 'new',
    leadScore: 85,
    lifecycle: 'mql',
    ownerId: '550e8400-e29b-41d4-a716-446655440004',
    owner: mockUsers[3],
    tags: ['Enterprise', 'Hot Lead'],
    customFields: {
      budgetRange: '100k-250k',
      techStack: ['Azure', 'Power BI'],
    },
    isConverted: false,
    createdAt: '2026-02-11T09:10:00Z',
    updatedAt: '2026-02-14T12:40:00Z',
  },
  {
    id: '330e8400-e29b-41d4-a716-446655440002',
    firstName: 'Larissa',
    lastName: 'Melo',
    fullName: 'Larissa Melo',
    email: 'larissa.melo@scaleup.io',
    phone: '+55 11 98888-1010',
    company: 'ScaleUp SaaS',
    jobTitle: 'Marketing Ops Manager',
    source: 'website',
    status: 'working',
    leadScore: 72,
    lifecycle: 'mql',
    ownerId: '550e8400-e29b-41d4-a716-446655440004',
    owner: mockUsers[3],
    tags: ['SaaS', 'Demo Requested'],
    customFields: {
      interest: 'Automacao comercial',
    },
    isConverted: false,
    createdAt: '2026-02-10T13:20:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: '330e8400-e29b-41d4-a716-446655440003',
    firstName: 'Diego',
    lastName: 'Prado',
    fullName: 'Diego Prado',
    email: 'diego.prado@finbiz.com.br',
    company: 'FinBiz',
    source: 'referral',
    status: 'nurturing',
    leadScore: 45,
    lifecycle: 'lead',
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    owner: mockUsers[0],
    tags: ['Fintech', 'Warm Lead'],
    customFields: {},
    isConverted: false,
    createdAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-02-13T16:05:00Z',
  },
  {
    id: '330e8400-e29b-41d4-a716-446655440004',
    firstName: 'Aline',
    lastName: 'Ferraz',
    fullName: 'Aline Ferraz',
    email: 'aline.ferraz@industrialx.com',
    company: 'Industrial X',
    source: 'event',
    status: 'converted',
    leadScore: 88,
    lifecycle: 'mql',
    ownerId: '550e8400-e29b-41d4-a716-446655440002',
    owner: mockUsers[1],
    tags: ['Industrial', 'Converted'],
    customFields: {
      eventName: 'Future Tech Expo',
    },
    isConverted: true,
    convertedToContactId: '770e8400-e29b-41d4-a716-446655440004',
    convertedAt: '2026-02-12T11:20:00Z',
    createdAt: '2026-02-02T11:00:00Z',
    updatedAt: '2026-02-12T11:20:00Z',
  },
];

export const mockLeadScoreDetails: Record<string, LeadScoreDetails> = {
  '330e8400-e29b-41d4-a716-446655440001': {
    total: 85,
    classification: 'hot',
    breakdown: {
      demographicFit: {
        score: 42,
        maxScore: 50,
        factors: [
          { name: 'jobTitle', value: 20, reason: 'Cargo aderente ao ICP (Head de Dados)' },
          { name: 'companySize', value: 15, reason: 'Empresa mid-enterprise' },
          { name: 'industry', value: 10, reason: 'Segmento alvo: tecnologia' },
          { name: 'location', value: -3, reason: 'Regiao fora da priorizacao principal' },
        ],
      },
      behavioralEngagement: {
        score: 43,
        maxScore: 50,
        factors: [
          { name: 'emailOpened', value: 15, reason: 'Abriu emails 3x na ultima semana' },
          { name: 'ctaClicks', value: 10, reason: 'Clicou em 2 CTAs' },
          { name: 'contentDownload', value: 8, reason: 'Baixou whitepaper tecnico' },
          { name: 'pricingVisits', value: 10, reason: 'Visitou pagina de precos 2x' },
        ],
      },
    },
    triggers: [
      { event: 'Visitou pagina de precos', timestamp: '2026-02-14T11:00:00Z', points: 10, icon: '🔥' },
      { event: 'Abriu email duas vezes em 48h', timestamp: '2026-02-14T09:30:00Z', points: 6, icon: '🔥' },
      { event: 'Download de case study', timestamp: '2026-02-11T16:00:00Z', points: 4, icon: '⚡' },
    ],
    lastCalculatedAt: '2026-02-14T12:30:00Z',
  },
  '330e8400-e29b-41d4-a716-446655440002': {
    total: 72,
    classification: 'hot',
    breakdown: {
      demographicFit: {
        score: 35,
        maxScore: 50,
        factors: [
          { name: 'role', value: 15, reason: 'Marketing Ops com fit para automacao' },
          { name: 'segment', value: 12, reason: 'SaaS em crescimento' },
          { name: 'companySize', value: 8, reason: 'Porte compativel com ICP' },
        ],
      },
      behavioralEngagement: {
        score: 37,
        maxScore: 50,
        factors: [
          { name: 'trial', value: 20, reason: 'Solicitou demo' },
          { name: 'email', value: 9, reason: 'Abertura recorrente de emails' },
          { name: 'content', value: 8, reason: 'Interacao com comparativo de CRM' },
        ],
      },
    },
    triggers: [
      { event: 'Solicitou demo no formulario', timestamp: '2026-02-14T08:00:00Z', points: 15, icon: '🔥' },
      { event: 'Clicou CTA de agendamento', timestamp: '2026-02-13T19:20:00Z', points: 8, icon: '⚡' },
    ],
    lastCalculatedAt: '2026-02-14T09:00:00Z',
  },
};

// ============================================================================
// MOCK LIFECYCLE FUNNEL (EP03)
// ============================================================================

export const mockLifecycleFunnel: LifecycleFunnel = {
  period: { from: '2026-01-01', to: '2026-03-31' },
  stages: [
    {
      stage: 'subscriber',
      count: 2340,
      percentage: 100,
      avgDaysInStage: 5,
      topSources: [
        { source: 'Website', count: 1100 },
        { source: 'Content Download', count: 760 },
      ],
      topOwners: [
        { ownerName: 'João Costa', count: 980 },
        { ownerName: 'Maria Santos', count: 650 },
      ],
      conversionToNext: { rate: 0.325, avgDays: 12, count: 761 },
    },
    {
      stage: 'lead',
      count: 761,
      percentage: 32.5,
      avgDaysInStage: 8,
      topSources: [
        { source: 'LinkedIn', count: 280 },
        { source: 'Referral', count: 190 },
      ],
      topOwners: [
        { ownerName: 'João Costa', count: 310 },
        { ownerName: 'Ana Silva', count: 220 },
      ],
      conversionToNext: { rate: 0.45, avgDays: 8, count: 342 },
    },
    {
      stage: 'mql',
      count: 342,
      percentage: 14.6,
      avgDaysInStage: 6,
      topSources: [
        { source: 'Website', count: 140 },
        { source: 'Webinar', count: 92 },
      ],
      topOwners: [
        { ownerName: 'Maria Santos', count: 148 },
        { ownerName: 'Pedro Oliveira', count: 101 },
      ],
      conversionToNext: { rate: 0.55, avgDays: 7, count: 188 },
    },
    {
      stage: 'sql',
      count: 188,
      percentage: 8.0,
      avgDaysInStage: 10,
      topSources: [
        { source: 'Referral', count: 74 },
        { source: 'LinkedIn', count: 60 },
      ],
      topOwners: [
        { ownerName: 'Pedro Oliveira', count: 77 },
        { ownerName: 'Maria Santos', count: 58 },
      ],
      conversionToNext: { rate: 0.42, avgDays: 15, count: 79 },
    },
    {
      stage: 'opportunity',
      count: 79,
      percentage: 3.4,
      avgDaysInStage: 12,
      topSources: [
        { source: 'Referral', count: 31 },
        { source: 'Website', count: 19 },
      ],
      topOwners: [
        { ownerName: 'Maria Santos', count: 34 },
        { ownerName: 'Pedro Oliveira', count: 26 },
      ],
      conversionToNext: { rate: 0.67, avgDays: 10, count: 53 },
    },
    {
      stage: 'customer',
      count: 53,
      percentage: 2.3,
      avgDaysInStage: 0,
      topSources: [
        { source: 'Referral', count: 20 },
        { source: 'LinkedIn', count: 14 },
      ],
      topOwners: [
        { ownerName: 'Maria Santos', count: 25 },
        { ownerName: 'Pedro Oliveira', count: 17 },
      ],
    },
  ],
  insights: [
    {
      type: 'bottleneck',
      message: 'Maior drop-off: Subscriber para Lead (67.5%)',
      from: 'subscriber',
      to: 'lead',
      value: 67.5,
    },
    {
      type: 'warning',
      message: 'Gargalo secundario: SQL para Opportunity com 58% de perda',
      from: 'sql',
      to: 'opportunity',
      value: 58,
    },
    {
      type: 'success',
      message: 'Melhor conversao: MQL para SQL com 55%',
      from: 'mql',
      to: 'sql',
      value: 55,
    },
  ],
};

// ============================================================================
// MOCK NURTURE SEQUENCES (EP03)
// ============================================================================

export const mockNurtureSequences: NurtureSequence[] = [
  {
    id: '440e8400-e29b-41d4-a716-446655440001',
    name: 'Nurture Leads Frios Tech',
    isActive: true,
    enrollmentTrigger: {
      type: 'lead_score',
      config: { min: 20, max: 45 },
    },
    stopConditions: [
      { type: 'converted', config: {} },
      { type: 'unsubscribed', config: {} },
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        type: 'email',
        delayDays: 0,
        emailTemplateId: 'tpl-crm-guide',
        emailSubject: 'Guia prático de CRM para times B2B',
        stats: {
          sent: 45,
          opened: 28,
          clicked: 12,
          replied: 2,
          bounced: 1,
          unsubscribed: 0,
        },
      },
      {
        id: 'step-2',
        order: 2,
        type: 'email',
        delayDays: 3,
        emailTemplateId: 'tpl-case-study',
        emailSubject: 'Case de modernização comercial',
        stats: {
          sent: 40,
          opened: 22,
          clicked: 8,
          replied: 1,
          bounced: 0,
          unsubscribed: 2,
        },
      },
      {
        id: 'step-3',
        order: 3,
        type: 'email',
        delayDays: 7,
        emailTemplateId: 'tpl-demo-offer',
        emailSubject: 'Quer ver o CRM em ação?',
        stats: {
          sent: 35,
          opened: 18,
          clicked: 9,
          replied: 1,
          bounced: 0,
          unsubscribed: 3,
        },
      },
    ],
    stats: {
      enrollments: 45,
      active: 12,
      completed: 28,
      unsubscribed: 5,
      conversions: 5,
      overallConversionRate: 11.1,
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-14T17:00:00Z',
  },
];

// ============================================================================
// MOCK REPORTS, SCHEDULES E EXPORTS (EP06)
// ============================================================================

export const mockReportTemplates: ReportDefinition[] = [
  {
    id: 'rp-template-1',
    name: 'Deals Won/Lost Analysis',
    description: 'Análise de ganhos/perdas por período e owner',
    category: 'sales',
    dataSource: 'deals',
    filters: {},
    columns: ['title', 'owner', 'amount', 'status', 'stage'],
    groupBy: 'owner',
    aggregations: [{ field: 'amount', fn: 'sum' }, { field: 'id', fn: 'count' }],
    visualization: 'both',
    isTemplate: true,
    isShared: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'rp-template-2',
    name: 'Lead Sources Performance',
    description: 'Conversão e volume por origem dos leads',
    category: 'marketing',
    dataSource: 'leads',
    filters: {},
    columns: ['fullName', 'source', 'leadScore', 'status'],
    groupBy: 'source',
    aggregations: [{ field: 'id', fn: 'count' }],
    visualization: 'bar',
    isTemplate: true,
    isShared: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440004',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
];

export const mockSavedReports: ReportDefinition[] = [
  {
    id: 'rp-saved-1',
    name: 'Pipeline por Owner - Q1',
    description: 'Visão consolidada por responsável',
    category: 'sales',
    dataSource: 'deals',
    filters: {
      dateFrom: '2026-01-01',
      dateTo: '2026-03-31',
    },
    columns: ['title', 'owner', 'amount', 'stage', 'status'],
    groupBy: 'owner',
    aggregations: [{ field: 'amount', fn: 'sum' }],
    visualization: 'both',
    isShared: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2026-02-12T09:00:00Z',
    updatedAt: '2026-02-14T11:00:00Z',
  },
];

export const mockReportSchedules: ReportSchedule[] = [
  {
    id: 'rps-1',
    reportId: 'rp-saved-1',
    reportName: 'Pipeline por Owner - Q1',
    enabled: true,
    frequency: 'weekly',
    time: '09:00',
    dayOfWeek: 1,
    recipients: ['maria@foursys.com.br', 'pedro@foursys.com.br'],
    format: 'pdf',
    subject: 'Resumo semanal de pipeline',
    message: 'Segue o relatório semanal.',
    nextRunAt: '2026-02-16T09:00:00Z',
  },
];

export const mockReportExecutionLogs: ReportExecutionLog[] = [
  {
    id: 'rpl-1',
    scheduleId: 'rps-1',
    reportId: 'rp-saved-1',
    executedAt: '2026-02-09T09:00:00Z',
    status: 'success',
    recipients: ['maria@foursys.com.br', 'pedro@foursys.com.br'],
    message: 'Relatório enviado com sucesso.',
  },
];

export const mockExportJobs: ExportJob[] = [
  {
    id: 'exp-1',
    entity: 'deals',
    format: 'csv',
    status: 'done',
    records: 2400,
    requestedBy: '550e8400-e29b-41d4-a716-446655440001',
    requestedAt: '2026-02-14T16:20:00Z',
    downloadUrl: '/downloads/exports/deals-q1.csv',
  },
  {
    id: 'exp-2',
    entity: 'leads',
    format: 'excel',
    status: 'processing',
    records: 15400,
    requestedBy: '550e8400-e29b-41d4-a716-446655440004',
    requestedAt: '2026-02-15T10:15:00Z',
  },
];

export const mockBiConnectors: BiConnectorStatus[] = [
  {
    connector: 'power_bi',
    connected: true,
    lastSyncAt: '2026-02-15T08:30:00Z',
    details: 'Conector read-only ativo',
  },
  {
    connector: 'google_sheets',
    connected: false,
    details: 'Não autenticado',
  },
  {
    connector: 'api',
    connected: true,
    details: 'API key gerada para integrações',
  },
];

// ============================================================================
// MOCK BILLING (EP07)
// ============================================================================

// ── Invoice generator: 100 faturas coerentes com negócios ──────────────────────
// Status possíveis: provisioned | approved | issued | paid | cancelled
// 'Vencida' NÃO é status — é indicador dinâmico (dueDate < hoje E status ≠ paid/cancelled)
function _generateInvoices(): Invoice[] {
  const inv: Invoice[] = [];
  let seq = 0;

  const _d = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  function push(
    dealIdx: number, status: InvoiceStatus, issueDate: string, dueDate: string,
    amount: number, paid: number, desc: string, nf: string | null, inst: number, instTotal: number,
  ) {
    seq++;
    const deal = mockDeals[dealIdx];
    if (!deal) return;
    const accIdx = dealIdx < 4 ? dealIdx : (dealIdx - 4) % 4;
    const account = mockAccounts[accIdx < 4 ? accIdx : 0];
    const contact = mockContacts[accIdx < 4 ? accIdx : 0];
    const invNum = `INV2026${String(seq).padStart(4, '0')}`;
    inv.push({
      id: `inv-2026-${String(seq).padStart(4, '0')}`,
      invoiceNumber: `${invNum}-${String(inst).padStart(2, '0')}`,
      invoiceCode: invNum,
      installmentNumber: inst,
      installmentTotal: instTotal,
      dealId: deal.id,
      dealTitle: deal.title,
      accountId: account.id,
      accountName: account.name,
      contactId: contact.id,
      contactName: contact.fullName,
      status,
      currency: 'BRL',
      issueDate,
      dueDate,
      originalIssueDate: issueDate,
      issuePostponementReason: null,
      originalDueDate: dueDate,
      duePostponementReason: null,
      nfNumber: nf,
      cancelledNfNumber: null,
      billingAddressSnapshot: { ...account.address },
      invoiceDescription: account.billingConditions?.invoiceDescription || null,
      items: [{ id: `inv-${seq}-it-1`, description: desc, quantity: 1, unitPrice: amount, taxRatePct: 0, discountValue: 0 }],
      totals: { subtotal: amount, discountTotal: 0, taxTotal: 0, total: amount, amountPaid: paid, amountOpen: amount - paid },
      createdAt: issueDate + 'T10:00:00Z',
      updatedAt: dueDate + 'T10:00:00Z',
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEAL 0 — Implementação CRM (Foursys, R$500k) — 5 parcelas
  // Stage: Proposta (open) — 2 pagas, 1 emitida vencida, 1 aprovada vencida, 1 provisionada
  // ═══════════════════════════════════════════════════════════════════
  push(0, 'paid',        _d(2025,11,15), _d(2025,12,15), 100000, 100000, 'CRM Customizado - Sprint 1-2',  'NF-2025-01088', 1, 5);
  push(0, 'paid',        _d(2025,12,15), _d(2026,1,15),  100000, 100000, 'CRM Customizado - Sprint 3-4',  'NF-2026-00015', 2, 5);
  push(0, 'issued',      _d(2026,1,15),  _d(2026,2,15),  100000, 0,      'CRM Customizado - Sprint 5-6',  'NF-2026-00142', 3, 5);
  push(0, 'approved',    _d(2026,2,15),  _d(2026,3,15),  100000, 0,      'CRM Customizado - Sprint 7-8',  null,             4, 5);
  push(0, 'provisioned', _d(2026,3,15),  _d(2026,4,15),  100000, 0,      'CRM Customizado - Sprint 9-10', null,             5, 5);

  // ═══════════════════════════════════════════════════════════════════
  // DEAL 1 — Consultoria Azure (TechCorp, R$300k) — 4 parcelas
  // Stage: FUP (open) — 1 paga, 2 emitidas vencidas, 1 provisionada
  // ═══════════════════════════════════════════════════════════════════
  push(1, 'paid',        _d(2025,12,10), _d(2026,1,10), 75000, 75000, 'Cloud Migration - Fase 1 Discovery',  'NF-2026-00022', 1, 4);
  push(1, 'issued',      _d(2026,1,10),  _d(2026,2,10), 75000, 0,     'Cloud Migration - Fase 2 Planning',   'NF-2026-00089', 2, 4);
  push(1, 'issued',      _d(2026,2,10),  _d(2026,3,10), 75000, 0,     'Cloud Migration - Fase 3 Execution',  'NF-2026-00198', 3, 4);
  push(1, 'provisioned', _d(2026,3,10),  _d(2026,4,10), 75000, 0,     'Cloud Migration - Fase 4 Go-live',    null,             4, 4);

  // ═══════════════════════════════════════════════════════════════════
  // DEAL 2 — Licenças SaaS (StartupX, R$100k) — 2 parcelas
  // Stage: Qualificação (open) — 1 paga, 1 provisionada futura
  // ═══════════════════════════════════════════════════════════════════
  push(2, 'paid',        _d(2026,1,5),  _d(2026,1,20), 50000, 50000, 'SaaS Enterprise - Setup + Licenças',  'NF-2026-00045', 1, 2);
  push(2, 'provisioned', _d(2026,4,5),  _d(2026,4,20), 50000, 0,     'SaaS Enterprise - Renovação anual',   null,             2, 2);

  // ═══════════════════════════════════════════════════════════════════
  // DEAL 3 — Modernização Legado (BigCo, R$800k) — 6 parcelas
  // Stage: Vencido — 3 pagas, 2 emitidas vencidas, 1 aprovada
  // ═══════════════════════════════════════════════════════════════════
  push(3, 'paid',     _d(2025,10,20), _d(2025,11,20), 133000, 133000, 'Legado - Fase 1 Discovery',   'NF-2025-00988', 1, 6);
  push(3, 'paid',     _d(2025,11,20), _d(2025,12,20), 133000, 133000, 'Legado - Fase 2 Refactoring', 'NF-2025-01102', 2, 6);
  push(3, 'paid',     _d(2025,12,20), _d(2026,1,20),  133000, 133000, 'Legado - Fase 3 Migration',   'NF-2026-00012', 3, 6);
  push(3, 'issued',   _d(2026,1,20),  _d(2026,2,20),  133000, 0,      'Legado - Fase 4 Integration', 'NF-2026-00078', 4, 6);
  push(3, 'issued',   _d(2026,2,20),  _d(2026,3,20),  134000, 0,      'Legado - Fase 5 Testing',     'NF-2026-00205', 5, 6);
  push(3, 'approved', _d(2026,3,20),  _d(2026,4,20),  134000, 0,      'Legado - Fase 6 Go-live',     null,             6, 6);

  // ═══════════════════════════════════════════════════════════════════
  // DEALS 'Vencido' (stage Fechamento/Vencido) — idx 100-109 → mockDeals[104..113]
  // Negócios vencidos → mix de paid + issued (vencidas) + provisioned
  // ═══════════════════════════════════════════════════════════════════
  const vDescs = [
    'Serviços profissionais', 'Desenvolvimento customizado', 'Consultoria técnica',
    'Implementação de sistema', 'Suporte especializado', 'Licenças de software',
    'Migração de dados', 'Treinamento corporativo', 'Auditoria de segurança', 'Integração de sistemas',
  ];
  for (let i = 0; i < 10; i++) {
    const dIdx = 104 + i;
    const parcelas = 2 + (i % 3);
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const baseAmt = Math.round(deal.amount / parcelas);
    for (let p = 0; p < parcelas; p++) {
      const issM = Math.max(1, Math.min(12, (11 + p + i) % 12 + 1));
      const issY = issM <= 10 && p === 0 ? 2025 : 2026;
      const dueM = issM === 12 ? 1 : issM + 1;
      const dueY = issM === 12 ? issY + 1 : issY;
      const issDate = _d(issY, issM, 5 + (i * 3) % 20);
      const dueDate = _d(dueY, dueM, 5 + (i * 3) % 20);
      const isPast = new Date(dueDate) < new Date('2026-04-05');
      let st: InvoiceStatus;
      if (p < parcelas - 2) st = 'paid';
      else if (p === parcelas - 2) st = isPast ? 'issued' : 'approved';
      else st = isPast ? 'issued' : 'provisioned';
      const pd = st === 'paid' ? baseAmt : 0;
      const nfNum = (st === 'paid' || st === 'issued') ? `NF-${issY}-${String(300 + seq).padStart(5, '0')}` : null;
      push(dIdx, st, issDate, dueDate, baseAmt, pd, `${vDescs[i]} - Parcela ${p + 1}`, nfNum, p + 1, parcelas);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEALS 'won' (idx 110-115) → mockDeals[114..119]
  // Negócios ganhos → faturas 100% pagas
  // ═══════════════════════════════════════════════════════════════════
  const wonD = ['Projeto concluído', 'Entrega final', 'Contrato executado',
    'Serviço entregue', 'Implantação concluída', 'Consultoria finalizada'];
  for (let i = 0; i < 6; i++) {
    const dIdx = 114 + i;
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const parcelas = 1 + (i % 2);
    const baseAmt = Math.round(deal.amount / parcelas);
    for (let p = 0; p < parcelas; p++) {
      const issM = 10 + (i % 3);
      push(dIdx, 'paid', _d(2025, issM, 10 + i), _d(2025, issM + 1, 10 + i), baseAmt, baseAmt,
        `${wonD[i]} - Parcela ${p + 1}`, `NF-2025-${String(800 + seq).padStart(5, '0')}`, p + 1, parcelas);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEALS 'lost' (idx 116-119) → mockDeals[120..123]
  // Negócios perdidos → faturas canceladas
  // ═══════════════════════════════════════════════════════════════════
  for (let i = 0; i < 4; i++) {
    const dIdx = 120 + i;
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const amt = Math.round(deal.amount / 2);
    push(dIdx, 'cancelled', _d(2026, 1 + i, 1), _d(2026, 2 + i, 1), amt, 0, 'Serviços cancelados - Negócio perdido', null, 1, 2);
    push(dIdx, 'cancelled', _d(2026, 2 + i, 1), _d(2026, 3 + i, 1), amt, 0, 'Serviços cancelados - Parcela 2', null, 2, 2);
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEALS Stage 'FUP' — idx 85-99 → mockDeals[89..103]
  // Negócios em negociação avançada → faturas provisionadas / aprovadas
  // ═══════════════════════════════════════════════════════════════════
  const fupD = ['Serviços sob demanda', 'Consultoria mensal', 'Desenvolvimento ágil',
    'Manutenção corretiva', 'Suporte premium'];
  const fupIdxs = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103];
  for (let i = 0; i < fupIdxs.length; i++) {
    const dIdx = fupIdxs[i];
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const amt = Math.round(deal.amount / 2);
    const st: InvoiceStatus = i % 3 === 0 ? 'approved' : 'provisioned';
    push(dIdx, st, _d(2026, 3 + (i % 3), 10 + i), _d(2026, 4 + (i % 3), 10 + i), amt, 0,
      fupD[i % 5] + ' - Previsão', null, 1, 2);
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEALS Stage 'Proposta' — idx 68-84 → mockDeals[72..88]
  // Negócios em proposta → faturas provisionadas / aprovadas
  // ═══════════════════════════════════════════════════════════════════
  const propIdxs = [72, 73, 75, 76, 78, 79, 81, 82, 84, 85, 87, 88];
  for (let i = 0; i < propIdxs.length; i++) {
    const dIdx = propIdxs[i];
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const amt = Math.round(deal.amount / 3);
    const st: InvoiceStatus = i % 4 === 0 ? 'approved' : 'provisioned';
    push(dIdx, st, _d(2026, 4 + (i % 2), 15 + (i % 10)), _d(2026, 5 + (i % 2), 15 + (i % 10)), amt, 0,
      'Serviços profissionais - Provisão', null, 1, 3);
  }

  // ═══════════════════════════════════════════════════════════════════
  // DEALS Stage 'Viabilidade' — idx 48-67 → mockDeals[52..71]
  // Negócios em validação → faturas provisionadas iniciais
  // ═══════════════════════════════════════════════════════════════════
  const viabIdxs = [52, 54, 56, 58, 60, 62, 64, 66, 68, 70];
  for (let i = 0; i < viabIdxs.length; i++) {
    const dIdx = viabIdxs[i];
    const deal = mockDeals[dIdx];
    if (!deal) continue;
    const amt = Math.round(deal.amount / 4);
    push(dIdx, 'provisioned', _d(2026, 5 + (i % 3), 1 + i * 2), _d(2026, 6 + (i % 3), 1 + i * 2), amt, 0,
      'Análise e planejamento - Provisão', null, 1, 4);
  }

  return inv;
}

export const mockInvoices: Invoice[] = _generateInvoices();

export const mockPaymentConnectors: ConnectorViewModel[] = [
  {
    connector: 'pagarme',
    label: 'Pagar.me',
    status: 'connected',
    lastSyncAt: '2026-02-15T08:10:00Z',
    details: 'Sandbox conectado',
    canEdit: true,
  },
  {
    connector: 'stripe',
    label: 'Stripe',
    status: 'disconnected',
    lastSyncAt: null,
    details: 'Não configurado',
    canEdit: true,
  },
  {
    connector: 'manual',
    label: 'Manual',
    status: 'connected',
    lastSyncAt: '2026-02-14T18:00:00Z',
    details: 'Baixa manual habilitada',
    canEdit: false,
  },
];

export const mockCollectionTemplates: TemplateModel[] = [
  {
    id: 'tpl-collect-1',
    name: 'Cobrança amigável (D-3)',
    channel: 'email',
    isActive: true,
    variables: [
      { key: '{{invoiceNumber}}', label: 'Número da fatura', example: 'INV-2026-0002' },
      { key: '{{amountOpen}}', label: 'Saldo em aberto', example: 'R$ 10.000' },
      { key: '{{dueDate}}', label: 'Vencimento', example: '2026-02-05' },
      { key: '{{paymentLink}}', label: 'Link de pagamento', example: 'https://pay.example/abc' },
    ],
    versions: [
      {
        id: 'tpl-collect-1-v1',
        version: 1,
        subject: 'Lembrete amigável • Fatura {{invoiceNumber}}',
        body: 'Olá, tudo bem? Sua fatura {{invoiceNumber}} vence em {{dueDate}}. Saldo: {{amountOpen}}. Link: {{paymentLink}}',
        createdAt: '2026-02-01T10:00:00Z',
        createdByName: 'Maria Santos',
      },
    ],
    currentVersionId: 'tpl-collect-1-v1',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'tpl-collect-2',
    name: 'Cobrança formal (D+5)',
    channel: 'whatsapp',
    isActive: true,
    variables: [
      { key: '{{accountName}}', label: 'Empresa', example: 'Tech Corp Solutions' },
      { key: '{{invoiceNumber}}', label: 'Número da fatura', example: 'INV-2026-0004' },
      { key: '{{daysOverdue}}', label: 'Dias em atraso', example: '12' },
    ],
    versions: [
      {
        id: 'tpl-collect-2-v1',
        version: 1,
        subject: null,
        body: 'Olá {{accountName}}. Identificamos a fatura {{invoiceNumber}} com {{daysOverdue}} dias em atraso. Podemos ajudar?',
        createdAt: '2026-02-03T10:00:00Z',
        createdByName: 'Pedro Oliveira',
      },
    ],
    currentVersionId: 'tpl-collect-2-v1',
    createdAt: '2026-02-03T10:00:00Z',
    updatedAt: '2026-02-03T10:00:00Z',
  },
];

export const mockCollectionRules: CollectionRule[] = [
  {
    id: 'rule-1',
    name: 'Régua padrão - Atraso leve',
    isActive: true,
    appliesToStatus: ['overdue', 'partial'],
    minDaysOverdue: 1,
    maxDaysOverdue: 15,
    steps: [
      {
        id: 'rule-1-step-1',
        order: 1,
        delayDays: 0,
        channel: 'email',
        templateId: 'tpl-collect-1',
        isBlocking: false,
      },
      {
        id: 'rule-1-step-2',
        order: 2,
        delayDays: 5,
        channel: 'whatsapp',
        templateId: 'tpl-collect-2',
        isBlocking: false,
      },
    ],
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-12T10:00:00Z',
  },
];

export const mockCollectionJobs: CollectionJob[] = [
  {
    id: 'job-1',
    ruleId: 'rule-1',
    ruleName: 'Régua padrão - Atraso leve',
    status: 'done',
    startedAt: '2026-02-14T08:00:00Z',
    finishedAt: '2026-02-14T08:02:30Z',
    totalInvoices: 12,
    processedInvoices: 12,
    sentCount: 19,
    errorCount: 0,
    errors: [],
  },
  {
    id: 'job-2',
    ruleId: 'rule-1',
    ruleName: 'Régua padrão - Atraso leve',
    status: 'error',
    startedAt: '2026-02-15T08:00:00Z',
    finishedAt: '2026-02-15T08:01:10Z',
    totalInvoices: 8,
    processedInvoices: 6,
    sentCount: 9,
    errorCount: 2,
    errors: [
      { code: 'WHATSAPP_RATE_LIMIT', message: 'Rate limit do provedor', invoiceId: 'inv-2026-0004' },
      { code: 'EMAIL_BOUNCE', message: 'E-mail inválido', invoiceId: 'inv-2026-0002' },
    ],
  },
];

export const mockAllocations: AllocationEntry[] = [
  {
    allocationId: 'alloc-1',
    invoiceId: 'inv-2026-0002',
    receivedAt: '2026-02-10',
    amount: 5000,
    method: 'pix',
    createdByName: 'Maria Santos',
    createdAt: '2026-02-10T12:00:00Z',
  },
];

export const mockInvoiceHistoryEvents: InvoiceHistoryEvent[] = [
  {
    eventId: 'evt-1',
    invoiceId: 'inv-2026-0002',
    type: 'payment',
    title: 'Pagamento parcial registrado',
    description: 'Recebimento via PIX',
    amount: 5000,
    previousStatus: 'overdue',
    newStatus: 'partial',
    createdByName: 'Maria Santos',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    eventId: 'evt-2',
    invoiceId: 'inv-2026-0003',
    type: 'status_change',
    title: 'Fatura quitada',
    description: null,
    amount: null,
    previousStatus: 'open',
    newStatus: 'paid',
    createdByName: 'Pedro Oliveira',
    createdAt: '2026-01-18T15:20:00Z',
  },
];

export const mockRolePermissionMatrix: RolePermissionMatrixModel = {
  roles: [
    { role: 'admin', label: 'Admin' },
    { role: 'finance', label: 'Financeiro' },
    { role: 'sales', label: 'Vendas' },
    { role: 'auditor', label: 'Auditoria' },
    { role: 'viewer', label: 'Leitura' },
  ],
  permissions: [
    { key: 'billing.invoice.create', label: 'Criar fatura', description: 'Criar fatura avulsa/recorrente' },
    { key: 'billing.invoice.edit', label: 'Editar fatura', description: 'Editar faturas em rascunho' },
    { key: 'billing.invoice.cancel', label: 'Cancelar fatura', description: 'Cancelar fatura' },
    { key: 'billing.payment.record', label: 'Registrar pagamento', description: 'Baixa manual/parcial' },
    { key: 'billing.payment.reverse', label: 'Estornar pagamento', description: 'Registrar estorno' },
    { key: 'billing.collections.manage', label: 'Cobrança', description: 'Régua e templates' },
    { key: 'billing.audit.view', label: 'Auditoria', description: 'Ver trilha de auditoria' },
    { key: 'billing.compliance.export', label: 'Export compliance', description: 'Exportar logs filtrados' },
  ],
  grants: {
    admin: {
      'billing.invoice.create': true,
      'billing.invoice.edit': true,
      'billing.invoice.cancel': true,
      'billing.payment.record': true,
      'billing.payment.reverse': true,
      'billing.collections.manage': true,
      'billing.audit.view': true,
      'billing.compliance.export': true,
    },
    finance: {
      'billing.invoice.create': true,
      'billing.invoice.edit': true,
      'billing.invoice.cancel': true,
      'billing.payment.record': true,
      'billing.payment.reverse': true,
      'billing.collections.manage': true,
      'billing.audit.view': true,
      'billing.compliance.export': true,
    },
    sales: {
      'billing.invoice.create': false,
      'billing.invoice.edit': false,
      'billing.invoice.cancel': false,
      'billing.payment.record': false,
      'billing.payment.reverse': false,
      'billing.collections.manage': false,
      'billing.audit.view': false,
      'billing.compliance.export': false,
    },
    auditor: {
      'billing.invoice.create': false,
      'billing.invoice.edit': false,
      'billing.invoice.cancel': false,
      'billing.payment.record': false,
      'billing.payment.reverse': false,
      'billing.collections.manage': false,
      'billing.audit.view': true,
      'billing.compliance.export': true,
    },
    viewer: {
      'billing.invoice.create': false,
      'billing.invoice.edit': false,
      'billing.invoice.cancel': false,
      'billing.payment.record': false,
      'billing.payment.reverse': false,
      'billing.collections.manage': false,
      'billing.audit.view': true,
      'billing.compliance.export': false,
    },
  },
  lastUpdatedAt: '2026-02-12T10:00:00Z',
  lastUpdatedByName: 'Maria Santos',
};

export const mockAuditEvents: AuditEvent[] = [
  {
    auditId: 'aud-1',
    entityType: 'invoice',
    entityId: 'inv-2026-0001',
    action: 'create',
    severity: 'info',
    summary: 'Fatura criada INV-2026-0001',
    actorUserId: mockUsers[0].id,
    actorName: mockUsers[0].fullName,
    actorIp: '127.0.0.1',
    occurredAt: '2026-02-01T10:00:00Z',
    diffs: [],
  },
  {
    auditId: 'aud-2',
    entityType: 'payment',
    entityId: 'alloc-1',
    action: 'create',
    severity: 'warning',
    summary: 'Pagamento parcial registrado para INV-2026-0002',
    actorUserId: mockUsers[0].id,
    actorName: mockUsers[0].fullName,
    actorIp: '127.0.0.1',
    occurredAt: '2026-02-10T12:00:00Z',
    diffs: [{ field: 'amount', before: null, after: 5000, isSensitive: false }],
  },
];

export const mockComplianceExportJobs: ComplianceExportJob[] = [
  {
    jobId: 'cpexp-1',
    status: 'done',
    requestedAt: '2026-02-14T10:00:00Z',
    finishedAt: '2026-02-14T10:00:10Z',
    fileName: 'audit-2026-02.csv',
    downloadUrl: '/downloads/compliance/audit-2026-02.csv',
    errorMessage: null,
    totalRows: 42,
  },
];

// ============================================================================
// MOCK ACCESS MANAGEMENT (EP08)
// ============================================================================

export const mockAccessPermissionCatalog: AccessPermissionCatalogItem[] = [
  { key: 'contacts.view', label: 'Visualizar contatos', description: 'Permite visualizar contatos', module: 'Contatos', isCritical: false },
  { key: 'contacts.create', label: 'Criar contatos', description: 'Permite criar contatos', module: 'Contatos', isCritical: false },
  { key: 'contacts.edit', label: 'Editar contatos', description: 'Permite editar contatos', module: 'Contatos', isCritical: false },
  { key: 'contacts.delete', label: 'Excluir contatos', description: 'Permite excluir contatos', module: 'Contatos', isCritical: true },
  { key: 'deals.view', label: 'Visualizar negócios', description: 'Permite visualizar negócios', module: 'Negócios', isCritical: false },
  { key: 'deals.create', label: 'Criar negócios', description: 'Permite criar negócios', module: 'Negócios', isCritical: false },
  { key: 'deals.edit', label: 'Editar negócios', description: 'Permite editar negócios', module: 'Negócios', isCritical: false },
  { key: 'deals.delete', label: 'Excluir negócios', description: 'Permite excluir negócios', module: 'Negócios', isCritical: true },
  { key: 'reports.view', label: 'Visualizar relatórios', description: 'Permite visualizar relatórios', module: 'Relatórios', isCritical: false },
  { key: 'reports.export', label: 'Exportar relatórios', description: 'Permite exportar relatórios', module: 'Relatórios', isCritical: false },
  { key: 'billing.view', label: 'Visualizar faturamento', description: 'Permite visualizar faturamento', module: 'Faturamento', isCritical: false },
  { key: 'billing.manage', label: 'Gerenciar faturamento', description: 'Permite editar faturamento', module: 'Faturamento', isCritical: true },
  { key: 'iam.groups.manage', label: 'Gerenciar grupos', description: 'Permite gerenciar grupos de acesso', module: 'IAM', isCritical: true },
  { key: 'iam.users.manage', label: 'Gerenciar usuários', description: 'Permite gerenciar usuários e vínculos', module: 'IAM', isCritical: true },
  { key: 'iam.audit.view', label: 'Consultar auditoria IAM', description: 'Permite consultar logs de auditoria IAM', module: 'IAM', isCritical: false },
  { key: 'iam.approvals.manage', label: 'Aprovar elevações', description: 'Permite aprovar solicitações de elevação', module: 'IAM', isCritical: true },
];

export const mockAccessGroups: AccessGroup[] = [
  {
    id: 'grp-admin',
    name: 'Administradores',
    description: 'Grupo administrativo completo',
    isActive: true,
    permissionKeys: mockAccessPermissionCatalog.map((p) => p.key),
    membersCount: 2,
    createdAt: '2026-02-10T09:00:00Z',
    createdBy: 'Maria Santos',
    updatedAt: '2026-02-14T11:00:00Z',
    updatedBy: 'Maria Santos',
  },
  {
    id: 'grp-gerente-comercial',
    name: 'Gerente Comercial',
    description: 'Acessos para liderança comercial',
    isActive: true,
    permissionKeys: ['contacts.view', 'contacts.create', 'contacts.edit', 'deals.view', 'deals.create', 'deals.edit', 'reports.view', 'reports.export'],
    membersCount: 3,
    createdAt: '2026-02-10T09:30:00Z',
    createdBy: 'Maria Santos',
    updatedAt: '2026-02-15T10:10:00Z',
    updatedBy: 'Pedro Oliveira',
  },
  {
    id: 'grp-financeiro',
    name: 'Financeiro',
    description: 'Acessos financeiros e compliance',
    isActive: true,
    permissionKeys: ['billing.view', 'billing.manage', 'iam.audit.view', 'reports.view'],
    membersCount: 1,
    createdAt: '2026-02-11T10:00:00Z',
    createdBy: 'Maria Santos',
    updatedAt: '2026-02-11T10:00:00Z',
    updatedBy: 'Maria Santos',
  },
];

export const mockAccessUserGroupMemberships: AccessUserGroupMembership[] = [
  {
    userId: mockUsers[0].id,
    userName: mockUsers[0].fullName,
    userEmail: mockUsers[0].email,
    avatarUrl: mockUsers[0].avatar || null,
    groupId: 'grp-admin',
    groupName: 'Administradores',
    addedAt: '2026-02-10T09:10:00Z',
    addedBy: 'Sistema',
  },
  {
    userId: mockUsers[1].id,
    userName: mockUsers[1].fullName,
    userEmail: mockUsers[1].email,
    avatarUrl: mockUsers[1].avatar || null,
    groupId: 'grp-gerente-comercial',
    groupName: 'Gerente Comercial',
    addedAt: '2026-02-11T11:00:00Z',
    addedBy: 'Maria Santos',
  },
  {
    userId: mockUsers[2].id,
    userName: mockUsers[2].fullName,
    userEmail: mockUsers[2].email,
    avatarUrl: mockUsers[2].avatar || null,
    groupId: 'grp-gerente-comercial',
    groupName: 'Gerente Comercial',
    addedAt: '2026-02-11T11:05:00Z',
    addedBy: 'Maria Santos',
  },
  {
    userId: mockUsers[3].id,
    userName: mockUsers[3].fullName,
    userEmail: mockUsers[3].email,
    avatarUrl: mockUsers[3].avatar || null,
    groupId: 'grp-financeiro',
    groupName: 'Financeiro',
    addedAt: '2026-02-11T11:10:00Z',
    addedBy: 'Maria Santos',
  },
];

export const mockDirectUserPermissionGrants: DirectUserPermissionGrant[] = [
  {
    id: 'dpg-1',
    userId: mockUsers[1].id,
    permissionKey: 'deals.delete',
    permissionLabel: 'Excluir negócios',
    justification: 'Acesso temporário para saneamento de pipeline.',
    grantedAt: '2026-02-15T09:00:00Z',
    grantedBy: 'Maria Santos',
    expiresAt: '2026-02-20T23:59:59Z',
    isActive: true,
  },
];

export const mockEffectiveAccessSummaryByUser: EffectiveAccessSummary[] = [
  {
    userId: mockUsers[1].id,
    groupsCount: 1,
    inheritedPermissionsCount: 8,
    directPermissionsCount: 1,
    totalEffectivePermissions: 9,
    conflictsCount: 1,
    calculatedAt: '2026-02-15T10:00:00Z',
  },
];

export const mockEffectivePermissions: EffectiveUserPermission[] = [
  {
    permissionKey: 'deals.delete',
    permissionLabel: 'Excluir negócios',
    module: 'Negócios',
    origin: 'direct',
    sourceId: null,
    sourceName: 'Direta',
    status: 'expiring_soon',
    grantedAt: '2026-02-15T09:00:00Z',
    expiresAt: '2026-02-20T23:59:59Z',
    canRevoke: true,
  },
  {
    permissionKey: 'deals.view',
    permissionLabel: 'Visualizar negócios',
    module: 'Negócios',
    origin: 'group',
    sourceId: 'grp-gerente-comercial',
    sourceName: 'Gerente Comercial',
    status: 'active',
    grantedAt: '2026-02-11T11:00:00Z',
    expiresAt: null,
    canRevoke: false,
  },
];

export const mockAccessPermissionConflicts: AccessPermissionConflict[] = [
  {
    conflictId: 'conf-1',
    userId: mockUsers[1].id,
    permissionKey: 'deals.delete',
    reason: 'Permissão crítica concedida diretamente enquanto há papel equivalente em grupo.',
    sources: [
      { origin: 'direct', sourceName: 'Direta', grantedAt: '2026-02-15T09:00:00Z', expiresAt: '2026-02-20T23:59:59Z' },
      { origin: 'group', sourceName: 'Gerente Comercial', grantedAt: '2026-02-11T11:00:00Z', expiresAt: null },
    ],
    severity: 'medium',
  },
];

export const mockAccessElevationRequests: AccessElevationRequest[] = [
  {
    requestId: 'req-1',
    userId: mockUsers[2].id,
    userName: mockUsers[2].fullName,
    permissionKey: 'billing.manage',
    permissionLabel: 'Gerenciar faturamento',
    isCritical: true,
    justification: 'Fechamento financeiro mensal do cliente Enterprise.',
    validFrom: '2026-02-16T00:00:00Z',
    validUntil: '2026-02-20T23:59:59Z',
    status: 'pending',
    approverId: mockUsers[0].id,
    approverName: mockUsers[0].fullName,
    requestedAt: '2026-02-15T14:00:00Z',
    reviewedAt: null,
    reviewObservation: null,
    canCancel: true,
  },
];

export const mockAccessAuditEvents: AccessAuditEvent[] = [
  {
    eventId: 'aa-1',
    timestamp: '2026-02-15T14:01:00Z',
    actor: mockUsers[2].fullName,
    actorId: mockUsers[2].id,
    action: 'created',
    entityType: 'request',
    entityId: 'req-1',
    entityName: 'Solicitação de elevação',
    details: 'Solicitou billing.manage por 5 dias',
    ipAddress: '127.0.0.1',
    severity: 'medium',
  },
];

export const mockAccessExportHistory: AccessExportRecord[] = [
  {
    exportId: 'aexp-1',
    type: 'audit_trail',
    format: 'csv',
    status: 'completed',
    generatedAt: '2026-02-15T13:00:00Z',
    expiresAt: '2026-02-22T13:00:00Z',
    downloadUrl: '/downloads/access/audit-trail-2026-02-15.csv',
    sizeBytes: 32000,
    generatedBy: mockUsers[0].fullName,
  },
];

// ============================================================================
// PRODUCT CATALOG (EP11)
// ============================================================================

import type {
  Product,
  Proposal,
  Contract,
  Project,
  Integration,
  SsoConfig,
  SaasMetricsSnapshot,
  SaasMetricsTrend,
  SaasDashboardData,
  AccountHealthScore,
  CsOverviewData,
  CsAlert,
  CsPlaybook,
  AccountHealthHistory,
} from '../types';

export const mockProducts: Product[] = [
  {
    id: 'prod-001', name: 'Squad Dedicada', code: 'SQD-DED', description: 'Time completo alocado (Tech Lead + 3 Devs + QA + Scrum Master)',
    category: 'squad', pricingModel: 'per_squad', basePrice: 85000, currency: 'BRL', recurrence: 'monthly',
    isActive: true, marginPercent: 32, costPrice: 57800,
    features: ['Tech Lead sênior', '3 Devs full-stack', 'QA dedicado', 'Scrum Master', 'Daily + Sprint Review', 'Métricas de delivery'],
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'prod-002', name: 'Licença Plataforma SaaS', code: 'LIC-SAAS', description: 'Acesso à plataforma SaaS com módulos base',
    category: 'saas', pricingModel: 'per_user', basePrice: 189, currency: 'BRL', recurrence: 'monthly',
    isActive: true, marginPercent: 78, costPrice: 42,
    features: ['Dashboard analytics', 'Gestão de projetos', 'Integrações API', 'Suporte 8x5'],
    tiers: [
      { name: 'Starter', minUnits: 1, maxUnits: 10, pricePerUnit: 189 },
      { name: 'Business', minUnits: 11, maxUnits: 50, pricePerUnit: 159 },
      { name: 'Enterprise', minUnits: 51, maxUnits: null, pricePerUnit: 129 },
    ],
    createdAt: '2025-03-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'prod-003', name: 'Consultoria Estratégica', code: 'CON-EST', description: 'Horas de consultoria com especialistas sênior',
    category: 'consulting', pricingModel: 'hourly', basePrice: 450, currency: 'BRL', recurrence: 'one_time',
    isActive: true, marginPercent: 55, costPrice: 202,
    features: ['Arquiteto sênior', 'Diagnóstico técnico', 'Roadmap estratégico', 'Documentação'],
    createdAt: '2025-04-01T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'prod-004', name: 'Suporte Premium 24x7', code: 'SUP-PRM', description: 'Suporte técnico 24x7 com SLA garantido',
    category: 'support', pricingModel: 'flat', basePrice: 12000, currency: 'BRL', recurrence: 'monthly',
    isActive: true, marginPercent: 45, costPrice: 6600,
    features: ['SLA 4h resposta', 'SLA 8h resolução', 'Canal Slack dedicado', 'Relatório mensal'],
    createdAt: '2025-05-01T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'prod-005', name: 'Treinamento Tech', code: 'TRN-TCH', description: 'Programa de capacitação técnica customizado',
    category: 'training', pricingModel: 'flat', basePrice: 8500, currency: 'BRL', recurrence: 'one_time',
    isActive: true, marginPercent: 60, costPrice: 3400,
    features: ['40h de conteúdo', 'Labs práticos', 'Certificação', 'Material digital'],
    createdAt: '2025-07-01T10:00:00Z', updatedAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'prod-006', name: 'Licença Enterprise', code: 'LIC-ENT', description: 'Licença enterprise com módulos avançados + BI + SSO',
    category: 'license', pricingModel: 'tiered', basePrice: 349, currency: 'BRL', recurrence: 'monthly',
    isActive: true, marginPercent: 82, costPrice: 63,
    features: ['Todos módulos', 'BI avançado', 'SSO/SAML', 'API ilimitada', 'Suporte prioritário', 'SLA 99.9%'],
    tiers: [
      { name: 'até 25 users', minUnits: 1, maxUnits: 25, pricePerUnit: 349 },
      { name: '26-100 users', minUnits: 26, maxUnits: 100, pricePerUnit: 299 },
      { name: '101+ users', minUnits: 101, maxUnits: null, pricePerUnit: 249 },
    ],
    createdAt: '2025-08-01T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop-001', code: 'PROP-2026-001', title: 'Proposta Squad + SaaS - Foursys',
    accountId: mockAccounts[0].id, accountName: mockAccounts[0].name,
    contactId: mockContacts[0]?.id, contactName: mockContacts[0]?.fullName,
    ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    status: 'accepted',
    lineItems: [
      { id: 'li-1', productId: 'prod-001', productName: 'Squad Dedicada', quantity: 1, unitPrice: 85000, discount: 5, totalPrice: 80750, recurrence: 'monthly' },
      { id: 'li-2', productId: 'prod-002', productName: 'Licença Plataforma SaaS', quantity: 30, unitPrice: 159, discount: 0, totalPrice: 4770, recurrence: 'monthly' },
    ],
    totalOneTime: 0, totalMrr: 85520, totalArr: 1026240,
    validUntil: '2026-03-15', approvedBy: 'Diretor Comercial', approvedAt: '2026-01-20T10:00:00Z',
    sentAt: '2026-01-21T10:00:00Z', respondedAt: '2026-01-28T10:00:00Z',
    createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'prop-002', code: 'PROP-2026-002', title: 'Consultoria + Treinamento - Tech Corp',
    accountId: mockAccounts[1].id, accountName: mockAccounts[1].name,
    ownerId: mockUsers[1].id, ownerName: mockUsers[1].fullName,
    status: 'sent',
    lineItems: [
      { id: 'li-3', productId: 'prod-003', productName: 'Consultoria Estratégica', quantity: 80, unitPrice: 450, discount: 10, totalPrice: 32400, recurrence: 'one_time' },
      { id: 'li-4', productId: 'prod-005', productName: 'Treinamento Tech', quantity: 2, unitPrice: 8500, discount: 0, totalPrice: 17000, recurrence: 'one_time' },
    ],
    totalOneTime: 49400, totalMrr: 0, totalArr: 0,
    validUntil: '2026-03-30',
    sentAt: '2026-02-10T10:00:00Z',
    createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'prop-003', code: 'PROP-2026-003', title: 'Enterprise + Suporte Premium - BigCo',
    accountId: mockAccounts[3].id, accountName: mockAccounts[3].name,
    ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    status: 'pending_approval',
    lineItems: [
      { id: 'li-5', productId: 'prod-006', productName: 'Licença Enterprise', quantity: 80, unitPrice: 299, discount: 8, totalPrice: 22006, recurrence: 'monthly' },
      { id: 'li-6', productId: 'prod-004', productName: 'Suporte Premium 24x7', quantity: 1, unitPrice: 12000, discount: 0, totalPrice: 12000, recurrence: 'monthly' },
      { id: 'li-7', productId: 'prod-003', productName: 'Consultoria Estratégica', quantity: 40, unitPrice: 450, discount: 15, totalPrice: 15300, recurrence: 'one_time' },
    ],
    totalOneTime: 15300, totalMrr: 34006, totalArr: 408072,
    validUntil: '2026-04-15',
    createdAt: '2026-02-14T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'prop-004', code: 'PROP-2026-004', title: 'SaaS Starter - StartupX',
    accountId: mockAccounts[2].id, accountName: mockAccounts[2].name,
    ownerId: mockUsers[2].id, ownerName: mockUsers[2].fullName,
    status: 'draft',
    lineItems: [
      { id: 'li-8', productId: 'prod-002', productName: 'Licença Plataforma SaaS', quantity: 8, unitPrice: 189, discount: 0, totalPrice: 1512, recurrence: 'monthly' },
    ],
    totalOneTime: 0, totalMrr: 1512, totalArr: 18144,
    validUntil: '2026-03-20',
    createdAt: '2026-02-18T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z',
  },
];

export const mockContracts: Contract[] = [
  {
    id: 'ctr-001', code: 'CTR-2026-001', title: 'Contrato Squad + SaaS - Foursys',
    accountId: mockAccounts[0].id, accountName: mockAccounts[0].name,
    proposalId: 'prop-001', ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    type: 'new', status: 'active',
    startDate: '2026-02-01', endDate: '2027-01-31', autoRenew: true, renewalNoticeDays: 60,
    mrr: 85520, totalContractValue: 1026240,
    lineItems: mockProposals[0].lineItems,
    signedAt: '2026-01-30T10:00:00Z', signedByClient: 'Carlos Mendes (CTO)', signedByUs: 'Maria Santos',
    amendments: [],
    createdAt: '2026-01-30T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'ctr-002', code: 'CTR-2025-014', title: 'Licenças Enterprise - BigCo',
    accountId: mockAccounts[3].id, accountName: mockAccounts[3].name,
    ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    type: 'renewal', status: 'active',
    startDate: '2025-04-01', endDate: '2026-03-31', autoRenew: true, renewalNoticeDays: 90,
    mrr: 68000, totalContractValue: 816000,
    lineItems: [
      { id: 'li-c1', productId: 'prod-006', productName: 'Licença Enterprise', quantity: 200, unitPrice: 249, discount: 12, totalPrice: 43824, recurrence: 'monthly' },
      { id: 'li-c2', productId: 'prod-004', productName: 'Suporte Premium 24x7', quantity: 1, unitPrice: 12000, discount: 0, totalPrice: 12000, recurrence: 'monthly' },
    ],
    signedAt: '2025-03-20T10:00:00Z', signedByClient: 'Roberto Lima (VP TI)', signedByUs: 'Maria Santos',
    amendments: [
      { id: 'amd-1', description: 'Adição de 50 licenças', mrrDelta: 12450, effectiveDate: '2025-10-01', createdAt: '2025-09-15T10:00:00Z' },
    ],
    createdAt: '2025-03-20T10:00:00Z', updatedAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'ctr-003', code: 'CTR-2025-020', title: 'SaaS Business - Tech Corp',
    accountId: mockAccounts[1].id, accountName: mockAccounts[1].name,
    ownerId: mockUsers[1].id, ownerName: mockUsers[1].fullName,
    type: 'new', status: 'expiring_soon',
    startDate: '2025-07-01', endDate: '2026-06-30', autoRenew: false, renewalNoticeDays: 60,
    mrr: 22000, totalContractValue: 264000,
    lineItems: [
      { id: 'li-c3', productId: 'prod-002', productName: 'Licença Plataforma SaaS', quantity: 40, unitPrice: 159, discount: 5, totalPrice: 6042, recurrence: 'monthly' },
      { id: 'li-c4', productId: 'prod-001', productName: 'Squad Dedicada', quantity: 0.5, unitPrice: 85000, discount: 10, totalPrice: 38250, recurrence: 'monthly' },
    ],
    signedAt: '2025-06-25T10:00:00Z', signedByClient: 'Ana Beatriz (Diretora)', signedByUs: 'Pedro Oliveira',
    amendments: [],
    createdAt: '2025-06-25T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'ctr-004', code: 'CTR-2025-025', title: 'SaaS Starter - StartupX',
    accountId: mockAccounts[2].id, accountName: mockAccounts[2].name,
    ownerId: mockUsers[2].id, ownerName: mockUsers[2].fullName,
    type: 'new', status: 'expiring_soon',
    startDate: '2025-05-01', endDate: '2026-04-30', autoRenew: false, renewalNoticeDays: 30,
    mrr: 8500, totalContractValue: 102000,
    lineItems: [
      { id: 'li-c5', productId: 'prod-002', productName: 'Licença Plataforma SaaS', quantity: 15, unitPrice: 189, discount: 0, totalPrice: 2835, recurrence: 'monthly' },
    ],
    signedAt: '2025-04-28T10:00:00Z', signedByClient: 'Lucas Ferreira (CEO)', signedByUs: 'Ana Silva',
    amendments: [],
    createdAt: '2025-04-28T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z',
  },
];

// ============================================================================
// PROJECTS / DELIVERY (EP14)
// ============================================================================

export const mockProjects: Project[] = [
  {
    id: 'proj-001', code: 'PRJ-2026-001', name: 'Modernização Plataforma Core',
    description: 'Migração do monólito .NET para microserviços com React frontend',
    accountId: mockAccounts[0].id, accountName: mockAccounts[0].name,
    contractId: 'ctr-001', dealId: mockDeals[0]?.id,
    ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    status: 'in_progress', health: 'green',
    startDate: '2026-02-01', targetEndDate: '2026-07-31',
    budget: 510000, spent: 127500, teamSize: 6,
    methodology: 'scrum', sprintCount: 12, currentSprint: 3, velocityAvg: 42,
    milestones: [
      { id: 'ms-1', name: 'Discovery & Arquitetura', status: 'completed', dueDate: '2026-02-14', completedDate: '2026-02-13', deliverables: ['Documentação arquitetural', 'ADRs', 'Spike técnico'], completionPercent: 100, order: 1 },
      { id: 'ms-2', name: 'MVP — Módulo Autenticação', status: 'in_progress', dueDate: '2026-03-15', deliverables: ['SSO/SAML', 'RBAC', 'Audit trail'], completionPercent: 55, order: 2 },
      { id: 'ms-3', name: 'Módulo Dashboard & Analytics', status: 'pending', dueDate: '2026-04-30', deliverables: ['Dashboard executivo', 'Reports engine', 'Exports'], completionPercent: 0, order: 3 },
      { id: 'ms-4', name: 'Módulo Core Business', status: 'pending', dueDate: '2026-06-15', deliverables: ['CRUD entidades', 'Workflow engine', 'Integrações'], completionPercent: 0, order: 4 },
      { id: 'ms-5', name: 'Go-Live & Estabilização', status: 'pending', dueDate: '2026-07-31', deliverables: ['Deploy produção', 'Migração dados', 'Treinamento'], completionPercent: 0, order: 5 },
    ],
    tags: ['modernização', 'react', 'microserviços'],
    createdAt: '2026-01-30T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z',
  },
  {
    id: 'proj-002', code: 'PRJ-2026-002', name: 'Implementação BI Self-Service',
    description: 'Plataforma de BI com dashboards customizáveis e data lake',
    accountId: mockAccounts[3].id, accountName: mockAccounts[3].name,
    contractId: 'ctr-002',
    ownerId: mockUsers[0].id, ownerName: mockUsers[0].fullName,
    status: 'in_progress', health: 'yellow',
    startDate: '2025-11-01', targetEndDate: '2026-04-30',
    budget: 380000, spent: 285000, teamSize: 4,
    methodology: 'kanban',
    milestones: [
      { id: 'ms-6', name: 'Data Lake Setup', status: 'completed', dueDate: '2025-12-15', completedDate: '2025-12-20', deliverables: ['AWS S3/Glue setup', 'ETL pipelines'], completionPercent: 100, order: 1 },
      { id: 'ms-7', name: 'Dashboard Engine', status: 'completed', dueDate: '2026-02-01', completedDate: '2026-02-05', deliverables: ['Metabase embed', 'Custom widgets'], completionPercent: 100, order: 2 },
      { id: 'ms-8', name: 'Self-Service Portal', status: 'in_progress', dueDate: '2026-03-15', deliverables: ['Drag-drop builder', 'Saved views', 'Sharing'], completionPercent: 40, order: 3, description: 'Atrasado 1 semana — dependência de API do fornecedor' },
      { id: 'ms-9', name: 'Go-Live', status: 'pending', dueDate: '2026-04-30', deliverables: ['Deploy', 'Treinamento 200 users', 'Rollout faseado'], completionPercent: 0, order: 4 },
    ],
    tags: ['bi', 'data', 'analytics'],
    createdAt: '2025-10-20T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z',
  },
  {
    id: 'proj-003', code: 'PRJ-2025-015', name: 'App Mobile Tech Corp',
    description: 'Aplicativo mobile React Native para gestão de field service',
    accountId: mockAccounts[1].id, accountName: mockAccounts[1].name,
    contractId: 'ctr-003',
    ownerId: mockUsers[1].id, ownerName: mockUsers[1].fullName,
    status: 'on_hold', health: 'red',
    startDate: '2025-09-01', targetEndDate: '2026-02-28',
    budget: 220000, spent: 176000, teamSize: 3,
    methodology: 'scrum', sprintCount: 10, currentSprint: 8, velocityAvg: 28,
    milestones: [
      { id: 'ms-10', name: 'Design & Protótipo', status: 'completed', dueDate: '2025-10-15', completedDate: '2025-10-14', deliverables: ['Figma completo', 'Design system mobile'], completionPercent: 100, order: 1 },
      { id: 'ms-11', name: 'Core Features', status: 'completed', dueDate: '2025-12-15', completedDate: '2025-12-20', deliverables: ['Login/SSO', 'Lista OS', 'Check-in/out'], completionPercent: 100, order: 2 },
      { id: 'ms-12', name: 'Offline Mode + Sync', status: 'delayed', dueDate: '2026-01-31', deliverables: ['SQLite local', 'Sync engine', 'Conflict resolution'], completionPercent: 65, order: 3, description: 'Bloqueado — cliente pausou por reestruturação interna' },
      { id: 'ms-13', name: 'Release App Stores', status: 'pending', dueDate: '2026-02-28', deliverables: ['iOS App Store', 'Google Play', 'MDM config'], completionPercent: 0, order: 4 },
    ],
    tags: ['mobile', 'react-native', 'field-service'],
    createdAt: '2025-08-25T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'proj-004', code: 'PRJ-2025-022', name: 'Integração SAP - StartupX',
    description: 'Integração bidirecional CRM <-> SAP B1 via API REST',
    accountId: mockAccounts[2].id, accountName: mockAccounts[2].name,
    ownerId: mockUsers[2].id, ownerName: mockUsers[2].fullName,
    status: 'completed', health: 'green',
    startDate: '2025-08-01', targetEndDate: '2025-11-30', actualEndDate: '2025-11-28',
    budget: 95000, spent: 88000, teamSize: 2,
    methodology: 'kanban',
    milestones: [
      { id: 'ms-14', name: 'Mapeamento APIs', status: 'completed', dueDate: '2025-08-31', completedDate: '2025-08-28', deliverables: ['API mapping doc', 'Auth flow'], completionPercent: 100, order: 1 },
      { id: 'ms-15', name: 'Sync Engine', status: 'completed', dueDate: '2025-10-15', completedDate: '2025-10-12', deliverables: ['Sync bidimensional', 'Error handling', 'Retry logic'], completionPercent: 100, order: 2 },
      { id: 'ms-16', name: 'Go-Live', status: 'completed', dueDate: '2025-11-30', completedDate: '2025-11-28', deliverables: ['Deploy prod', 'Monitoramento', 'Docs'], completionPercent: 100, order: 3 },
    ],
    tags: ['integração', 'sap', 'api'],
    createdAt: '2025-07-25T10:00:00Z', updatedAt: '2025-11-28T10:00:00Z',
  },
];

// ============================================================================
// INTEGRATIONS (EP15)
// ============================================================================

export const mockIntegrations: Integration[] = [
  {
    id: 'int-slack', type: 'slack', name: 'Slack', description: 'Notificações em canais Slack',
    status: 'connected', configuredAt: '2026-01-10T10:00:00Z', configuredBy: 'Maria Santos',
    settings: { workspace: 'foursys-crm.slack.com', botToken: '••••••••' },
    events: [
      { id: 'ev-1', eventType: 'deal_won', label: 'Deal ganho', enabled: true, channel: '#vendas-wins' },
      { id: 'ev-2', eventType: 'deal_lost', label: 'Deal perdido', enabled: true, channel: '#vendas-alerts' },
      { id: 'ev-3', eventType: 'cs_alert', label: 'Alerta CS (risco churn)', enabled: true, channel: '#cs-alerts' },
      { id: 'ev-4', eventType: 'contract_expiring', label: 'Contrato expirando', enabled: true, channel: '#renovacoes' },
      { id: 'ev-5', eventType: 'project_milestone', label: 'Milestone concluída', enabled: false, channel: '' },
      { id: 'ev-6', eventType: 'invoice_overdue', label: 'Fatura em atraso', enabled: true, channel: '#financeiro' },
    ],
  },
  {
    id: 'int-teams', type: 'teams', name: 'Microsoft Teams', description: 'Notificações via Teams',
    status: 'disconnected', settings: {},
    events: [
      { id: 'ev-7', eventType: 'deal_won', label: 'Deal ganho', enabled: false },
      { id: 'ev-8', eventType: 'cs_alert', label: 'Alerta CS', enabled: false },
    ],
  },
  {
    id: 'int-webhook', type: 'webhook', name: 'Webhook Customizado', description: 'HTTP POST para endpoints externos',
    status: 'connected', configuredAt: '2026-02-01T10:00:00Z', configuredBy: 'Pedro Oliveira',
    settings: { url: 'https://hooks.example.com/crm-events', secret: '••••••••' },
    events: [
      { id: 'ev-9', eventType: 'deal_stage_change', label: 'Mudança de stage', enabled: true },
      { id: 'ev-10', eventType: 'contact_created', label: 'Contato criado', enabled: true },
      { id: 'ev-11', eventType: 'invoice_paid', label: 'Fatura paga', enabled: true },
    ],
  },
  {
    id: 'int-jira', type: 'jira', name: 'Jira Cloud', description: 'Sync de projetos CRM <-> Jira',
    status: 'connected', configuredAt: '2026-01-15T10:00:00Z', configuredBy: 'Maria Santos',
    settings: { instance: 'foursys.atlassian.net', project: 'CRM' },
    events: [
      { id: 'ev-12', eventType: 'project_created', label: 'Projeto criado → Jira board', enabled: true },
      { id: 'ev-13', eventType: 'milestone_completed', label: 'Milestone → Jira release', enabled: true },
    ],
  },
];

// ============================================================================
// SSO / SAML (EP16)
// ============================================================================

export const mockSsoConfig: SsoConfig = {
  id: 'sso-001', protocol: 'saml', status: 'active',
  providerName: 'Azure AD', entityId: 'https://login.microsoftonline.com/tenant-id',
  ssoUrl: 'https://login.microsoftonline.com/tenant-id/saml2',
  certificate: '••• certificado SAML •••',
  mappings: [
    { ssoAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', crmField: 'email' },
    { ssoAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname', crmField: 'firstName' },
    { ssoAttribute: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname', crmField: 'lastName' },
    { ssoAttribute: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groups', crmField: 'groups' },
  ],
  enforceForAllUsers: false,
  allowPasswordFallback: true,
  configuredAt: '2026-01-05T10:00:00Z', configuredBy: 'Maria Santos',
  lastTestedAt: '2026-02-18T14:00:00Z', lastTestResult: 'success',
};

// ============================================================================
// SAAS METRICS (EP09)
// ============================================================================

export const mockSaasMetricsCurrent: SaasMetricsSnapshot = {
  period: '2026-02',
  mrr: 487500,
  arr: 5850000,
  mrrGrowthRate: 8.2,
  newMrr: 62000,
  expansionMrr: 28000,
  contractionMrr: 12000,
  churnedMrr: 38500,
  netNewMrr: 39500,
  logoChurnRate: 2.1,
  revenueChurnRate: 3.4,
  netRevenueRetention: 112,
  grossRevenueRetention: 92.1,
  ltv: 185000,
  cac: 32000,
  ltvCacRatio: 5.78,
  avgRevenuePerAccount: 12187.5,
  totalActiveAccounts: 40,
  newAccounts: 4,
  churnedAccounts: 1,
};

export const mockSaasMetricsPrevious: SaasMetricsSnapshot = {
  period: '2026-01',
  mrr: 448000,
  arr: 5376000,
  mrrGrowthRate: 6.5,
  newMrr: 55000,
  expansionMrr: 18000,
  contractionMrr: 8000,
  churnedMrr: 36000,
  netNewMrr: 29000,
  logoChurnRate: 2.6,
  revenueChurnRate: 4.1,
  netRevenueRetention: 108,
  grossRevenueRetention: 91.5,
  ltv: 172000,
  cac: 34000,
  ltvCacRatio: 5.06,
  avgRevenuePerAccount: 12108,
  totalActiveAccounts: 37,
  newAccounts: 3,
  churnedAccounts: 1,
};

export const mockSaasMetricsTrend: SaasMetricsTrend[] = [
  { month: '2025-09', mrr: 360000, arr: 4320000, newMrr: 42000, churnedMrr: 28000, netNewMrr: 14000, logoChurnRate: 3.2, revenueChurnRate: 5.0, netRevenueRetention: 104, activeAccounts: 30 },
  { month: '2025-10', mrr: 382000, arr: 4584000, newMrr: 48000, churnedMrr: 26000, netNewMrr: 22000, logoChurnRate: 2.9, revenueChurnRate: 4.6, netRevenueRetention: 106, activeAccounts: 32 },
  { month: '2025-11', mrr: 405000, arr: 4860000, newMrr: 45000, churnedMrr: 22000, netNewMrr: 23000, logoChurnRate: 2.8, revenueChurnRate: 4.2, netRevenueRetention: 107, activeAccounts: 34 },
  { month: '2025-12', mrr: 419000, arr: 5028000, newMrr: 38000, churnedMrr: 24000, netNewMrr: 14000, logoChurnRate: 2.5, revenueChurnRate: 4.0, netRevenueRetention: 108, activeAccounts: 35 },
  { month: '2026-01', mrr: 448000, arr: 5376000, newMrr: 55000, churnedMrr: 36000, netNewMrr: 29000, logoChurnRate: 2.6, revenueChurnRate: 4.1, netRevenueRetention: 108, activeAccounts: 37 },
  { month: '2026-02', mrr: 487500, arr: 5850000, newMrr: 62000, churnedMrr: 38500, netNewMrr: 39500, logoChurnRate: 2.1, revenueChurnRate: 3.4, netRevenueRetention: 112, activeAccounts: 40 },
];

export const mockSaasDashboard: SaasDashboardData = {
  current: mockSaasMetricsCurrent,
  previous: mockSaasMetricsPrevious,
  trend: mockSaasMetricsTrend,
  generatedAt: '2026-02-19T10:00:00Z',
};

// ============================================================================
// CUSTOMER SUCCESS (EP10)
// ============================================================================

export const mockAccountHealthScores: AccountHealthScore[] = [
  {
    accountId: mockAccounts[0].id,
    accountName: mockAccounts[0].name,
    accountTier: 'Enterprise',
    ownerId: mockUsers[0].id,
    ownerName: mockUsers[0].fullName,
    overallScore: 92,
    level: 'healthy',
    dimensions: [
      { name: 'Uso do Produto', score: 9, maxScore: 10, weight: 0.3, signals: [{ label: 'Logins/semana', value: '45', status: 'positive' }, { label: 'Features adotadas', value: '87%', status: 'positive' }] },
      { name: 'Engajamento', score: 9, maxScore: 10, weight: 0.25, signals: [{ label: 'Reuniões QBR', value: 'Em dia', status: 'positive' }, { label: 'Resposta a emails', value: '<2h', status: 'positive' }] },
      { name: 'Suporte', score: 10, maxScore: 10, weight: 0.2, signals: [{ label: 'Tickets abertos', value: '1', status: 'positive' }, { label: 'CSAT suporte', value: '4.8/5', status: 'positive' }] },
      { name: 'Financeiro', score: 9, maxScore: 10, weight: 0.25, signals: [{ label: 'Pagamento em dia', value: 'Sim', status: 'positive' }, { label: 'Expansão recente', value: '+2 licenças', status: 'positive' }] },
    ],
    mrr: 45000,
    contractEndDate: '2026-12-31',
    daysSinceLastContact: 3,
    openTickets: 1,
    npsScore: 9,
    csatScore: 4.8,
    lastNpsDate: '2026-02-01',
    riskFactors: [],
    opportunities: ['Expansão para squad adicional', 'Upsell módulo analytics'],
    lastUpdatedAt: '2026-02-19T08:00:00Z',
  },
  {
    accountId: mockAccounts[1].id,
    accountName: mockAccounts[1].name,
    accountTier: 'MidMarket',
    ownerId: mockUsers[1].id,
    ownerName: mockUsers[1].fullName,
    overallScore: 68,
    level: 'attention',
    dimensions: [
      { name: 'Uso do Produto', score: 6, maxScore: 10, weight: 0.3, signals: [{ label: 'Logins/semana', value: '12', status: 'neutral' }, { label: 'Features adotadas', value: '52%', status: 'negative' }] },
      { name: 'Engajamento', score: 7, maxScore: 10, weight: 0.25, signals: [{ label: 'Reuniões QBR', value: 'Atrasada 1 mês', status: 'negative' }, { label: 'Resposta a emails', value: '<24h', status: 'neutral' }] },
      { name: 'Suporte', score: 8, maxScore: 10, weight: 0.2, signals: [{ label: 'Tickets abertos', value: '3', status: 'neutral' }, { label: 'CSAT suporte', value: '4.2/5', status: 'neutral' }] },
      { name: 'Financeiro', score: 6, maxScore: 10, weight: 0.25, signals: [{ label: 'Pagamento em dia', value: 'Atraso 5 dias', status: 'negative' }, { label: 'Expansão recente', value: 'Nenhuma', status: 'neutral' }] },
    ],
    mrr: 22000,
    contractEndDate: '2026-06-30',
    daysSinceLastContact: 18,
    openTickets: 3,
    npsScore: 7,
    csatScore: 4.2,
    lastNpsDate: '2026-01-15',
    riskFactors: ['QBR atrasada', 'Baixa adoção de features', 'Contrato vence em 4 meses'],
    opportunities: ['Treinamento para aumentar adoção'],
    lastUpdatedAt: '2026-02-19T08:00:00Z',
  },
  {
    accountId: mockAccounts[2].id,
    accountName: mockAccounts[2].name,
    accountTier: 'SMB',
    ownerId: mockUsers[2].id,
    ownerName: mockUsers[2].fullName,
    overallScore: 42,
    level: 'at_risk',
    dimensions: [
      { name: 'Uso do Produto', score: 3, maxScore: 10, weight: 0.3, signals: [{ label: 'Logins/semana', value: '2', status: 'negative' }, { label: 'Features adotadas', value: '25%', status: 'negative' }] },
      { name: 'Engajamento', score: 4, maxScore: 10, weight: 0.25, signals: [{ label: 'Reuniões QBR', value: 'Nunca realizou', status: 'negative' }, { label: 'Resposta a emails', value: '>3 dias', status: 'negative' }] },
      { name: 'Suporte', score: 5, maxScore: 10, weight: 0.2, signals: [{ label: 'Tickets abertos', value: '7', status: 'negative' }, { label: 'CSAT suporte', value: '3.1/5', status: 'negative' }] },
      { name: 'Financeiro', score: 5, maxScore: 10, weight: 0.25, signals: [{ label: 'Pagamento em dia', value: 'Atraso 15 dias', status: 'negative' }, { label: 'Expansão recente', value: 'Downgrade solicitado', status: 'negative' }] },
    ],
    mrr: 8500,
    contractEndDate: '2026-04-15',
    daysSinceLastContact: 32,
    openTickets: 7,
    npsScore: 4,
    csatScore: 3.1,
    lastNpsDate: '2025-12-10',
    riskFactors: ['Uso caindo 60%', 'Downgrade solicitado', '7 tickets abertos', 'Sem contato há 32 dias', 'Contrato vence em 2 meses'],
    opportunities: [],
    lastUpdatedAt: '2026-02-19T08:00:00Z',
  },
  {
    accountId: mockAccounts[3].id,
    accountName: mockAccounts[3].name,
    accountTier: 'Enterprise',
    ownerId: mockUsers[0].id,
    ownerName: mockUsers[0].fullName,
    overallScore: 85,
    level: 'healthy',
    dimensions: [
      { name: 'Uso do Produto', score: 8, maxScore: 10, weight: 0.3, signals: [{ label: 'Logins/semana', value: '38', status: 'positive' }, { label: 'Features adotadas', value: '78%', status: 'positive' }] },
      { name: 'Engajamento', score: 9, maxScore: 10, weight: 0.25, signals: [{ label: 'Reuniões QBR', value: 'Em dia', status: 'positive' }, { label: 'Resposta a emails', value: '<4h', status: 'positive' }] },
      { name: 'Suporte', score: 8, maxScore: 10, weight: 0.2, signals: [{ label: 'Tickets abertos', value: '2', status: 'neutral' }, { label: 'CSAT suporte', value: '4.5/5', status: 'positive' }] },
      { name: 'Financeiro', score: 9, maxScore: 10, weight: 0.25, signals: [{ label: 'Pagamento em dia', value: 'Sim', status: 'positive' }, { label: 'Expansão recente', value: '+5 licenças', status: 'positive' }] },
    ],
    mrr: 68000,
    contractEndDate: '2027-03-15',
    daysSinceLastContact: 5,
    openTickets: 2,
    npsScore: 8,
    csatScore: 4.5,
    lastNpsDate: '2026-02-05',
    riskFactors: [],
    opportunities: ['Cross-sell módulo BI', 'Expansão para nova BU'],
    lastUpdatedAt: '2026-02-19T08:00:00Z',
  },
];

export const mockCsAlerts: CsAlert[] = [
  { id: 'alert-1', accountId: mockAccounts[2].id, accountName: mockAccounts[2].name, type: 'churn_risk', severity: 'critical', message: 'Score caiu de 58 para 42 nos últimos 30 dias. Downgrade solicitado.', createdAt: '2026-02-18T10:00:00Z', acknowledged: false },
  { id: 'alert-2', accountId: mockAccounts[2].id, accountName: mockAccounts[2].name, type: 'no_contact', severity: 'high', message: 'Sem contato há 32 dias. Última interação foi ticket de suporte.', createdAt: '2026-02-17T08:00:00Z', acknowledged: false },
  { id: 'alert-3', accountId: mockAccounts[1].id, accountName: mockAccounts[1].name, type: 'contract_expiring', severity: 'medium', message: 'Contrato expira em 4 meses (30/06/2026). Iniciar renovação.', createdAt: '2026-02-15T09:00:00Z', acknowledged: true },
  { id: 'alert-4', accountId: mockAccounts[2].id, accountName: mockAccounts[2].name, type: 'usage_drop', severity: 'high', message: 'Uso caiu 60% comparado ao mês anterior.', createdAt: '2026-02-14T14:00:00Z', acknowledged: false },
  { id: 'alert-5', accountId: mockAccounts[1].id, accountName: mockAccounts[1].name, type: 'nps_drop', severity: 'medium', message: 'NPS caiu de 8 para 7. Verificar motivos.', createdAt: '2026-02-12T11:00:00Z', acknowledged: true },
];

export const mockCsOverview: CsOverviewData = {
  totalAccounts: 40,
  healthDistribution: { healthy: 22, attention: 12, at_risk: 5, critical: 1 },
  avgHealthScore: 74,
  accountsAtRisk: 6,
  renewalsNext30Days: 2,
  renewalsNext90Days: 8,
  totalMrrAtRisk: 52500,
  avgNps: 7.8,
  npsRespondents: 32,
  recentAlerts: mockCsAlerts,
};

export const mockCsPlaybooks: CsPlaybook[] = [
  {
    id: 'pb-1',
    name: 'Resgate de Conta em Risco',
    targetLevel: 'at_risk',
    isActive: true,
    steps: [
      { order: 1, action: 'Ligação imediata com sponsor do cliente', owner: 'csm', dueInDays: 1 },
      { order: 2, action: 'Agendar reunião de diagnóstico presencial/remota', owner: 'csm', dueInDays: 3 },
      { order: 3, action: 'Escalar para Gerente de CS se score < 30', owner: 'csm', dueInDays: 3 },
      { order: 4, action: 'Criar plano de ação com owner do produto', owner: 'product', dueInDays: 7 },
      { order: 5, action: 'Oferecer treinamento adicional gratuito', owner: 'csm', dueInDays: 10 },
      { order: 6, action: 'Review semanal de progresso por 4 semanas', owner: 'csm', dueInDays: 30 },
    ],
  },
  {
    id: 'pb-2',
    name: 'Atenção Preventiva',
    targetLevel: 'attention',
    isActive: true,
    steps: [
      { order: 1, action: 'Enviar email de check-in personalizado', owner: 'csm', dueInDays: 2 },
      { order: 2, action: 'Analisar métricas de uso e identificar gaps', owner: 'csm', dueInDays: 5 },
      { order: 3, action: 'Agendar QBR se atrasada', owner: 'csm', dueInDays: 7 },
      { order: 4, action: 'Compartilhar caso de sucesso similar', owner: 'csm', dueInDays: 10 },
    ],
  },
];

export const mockAccountHealthHistory: Record<string, AccountHealthHistory[]> = {
  [mockAccounts[0].id]: [
    { date: '2025-09', score: 88, level: 'healthy' },
    { date: '2025-10', score: 89, level: 'healthy' },
    { date: '2025-11', score: 91, level: 'healthy' },
    { date: '2025-12', score: 90, level: 'healthy', event: 'Renovação contrato' },
    { date: '2026-01', score: 91, level: 'healthy' },
    { date: '2026-02', score: 92, level: 'healthy', event: 'Expansão +2 licenças' },
  ],
  [mockAccounts[1].id]: [
    { date: '2025-09', score: 82, level: 'healthy' },
    { date: '2025-10', score: 78, level: 'attention' },
    { date: '2025-11', score: 75, level: 'attention' },
    { date: '2025-12', score: 72, level: 'attention', event: 'QBR cancelada pelo cliente' },
    { date: '2026-01', score: 70, level: 'attention' },
    { date: '2026-02', score: 68, level: 'attention', event: 'Atraso pagamento' },
  ],
  [mockAccounts[2].id]: [
    { date: '2025-09', score: 71, level: 'attention' },
    { date: '2025-10', score: 65, level: 'attention' },
    { date: '2025-11', score: 58, level: 'attention', event: 'Ticket spike' },
    { date: '2025-12', score: 52, level: 'at_risk', event: 'Uso caiu 40%' },
    { date: '2026-01', score: 48, level: 'at_risk' },
    { date: '2026-02', score: 42, level: 'at_risk', event: 'Downgrade solicitado' },
  ],
  [mockAccounts[3].id]: [
    { date: '2025-09', score: 80, level: 'healthy' },
    { date: '2025-10', score: 82, level: 'healthy' },
    { date: '2025-11', score: 83, level: 'healthy' },
    { date: '2025-12', score: 84, level: 'healthy' },
    { date: '2026-01', score: 84, level: 'healthy', event: 'Expansão +5 licenças' },
    { date: '2026-02', score: 85, level: 'healthy' },
  ],
};

// ============================================================================
// MOCK CAMPAIGNS
// ============================================================================

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Lançamento SaaS Q1 2026',
    type: 'multi_channel',
    status: 'active',
    description: 'Campanha multicanal para lançamento da nova versão da plataforma SaaS.',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    budget: 150000,
    actualSpend: 87500,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: null,
    parentCampaignName: null,
    attributionModel: 'linear',
    goals: ['Gerar 500 leads qualificados', 'Aumentar awareness em 30%', 'Fechar 15 deals'],
    kpis: { contactsReached: 12500, newContacts: 3200, emailsSent: 8500, emailOpenRate: 32.5, emailClickRate: 8.2, adsImpressions: 450000, adsClicks: 12800, adsCTR: 2.84, eventsHeld: 2, eventAttendees: 380, leadsGenerated: 420, dealsCreated: 18, revenueInfluenced: 680000, closedDeals: 8, roi: 353 },
    members: [
      { contactId: 'c1', contactName: 'Ana Rodrigues', memberStatus: 'converted', addedAt: '2026-01-15T10:00:00Z' },
      { contactId: 'c2', contactName: 'Pedro Santos', memberStatus: 'responded', addedAt: '2026-01-16T09:00:00Z' },
      { contactId: 'c3', contactName: 'Maria Oliveira', memberStatus: 'attended', addedAt: '2026-01-20T14:00:00Z' },
    ],
    tasks: [
      { id: 'task-1', title: 'Criar landing page', assignee: 'Carlos Silva', dueDate: '2026-01-20', completed: true },
      { id: 'task-2', title: 'Configurar automação de emails', assignee: 'Ana Rodrigues', dueDate: '2026-01-25', completed: true },
      { id: 'task-3', title: 'Revisar criativos de ads', assignee: 'Pedro Santos', dueDate: '2026-02-01', completed: false },
    ],
    associatedEmails: ['mkt-email-001', 'mkt-email-002', 'mkt-email-003'],
    associatedAds: ['ad-001', 'ad-002', 'ad-003'],
    associatedEvents: ['evt-001'],
    tags: ['saas', 'lancamento', 'q1-2026'],
    aiSummary: 'Campanha multicanal com excelente desempenho. ROI de 353% impulsionado por email marketing (32.5% open rate) e ads no Google/LinkedIn. 420 de 500 leads meta atingidos (84%). Recomendação: aumentar investimento em LinkedIn Ads que apresenta melhor CPA.',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-15T16:30:00Z',
  },
  {
    id: 'camp-002',
    name: 'Webinar Series - Cloud Migration',
    type: 'event',
    status: 'active',
    description: 'Série de webinars sobre migração para nuvem direcionada a CTOs e CIOs.',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    budget: 45000,
    actualSpend: 22000,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: 'camp-001',
    parentCampaignName: 'Lançamento SaaS Q1 2026',
    attributionModel: 'first_touch',
    goals: ['Realizar 4 webinars', 'Captar 200 registros por evento'],
    kpis: { contactsReached: 3200, newContacts: 850, emailsSent: 2400, emailOpenRate: 38.2, emailClickRate: 12.5, adsImpressions: 85000, adsClicks: 2400, adsCTR: 2.82, eventsHeld: 2, eventAttendees: 310, leadsGenerated: 180, dealsCreated: 5, revenueInfluenced: 220000, closedDeals: 2, roi: 388 },
    members: [
      { contactId: 'c4', contactName: 'Roberto Lima', memberStatus: 'attended', addedAt: '2026-02-01T10:00:00Z' },
      { contactId: 'c5', contactName: 'Fernanda Costa', memberStatus: 'converted', addedAt: '2026-02-05T09:00:00Z' },
    ],
    tasks: [
      { id: 'task-4', title: 'Preparar slides webinar 3', assignee: 'Carlos Silva', dueDate: '2026-03-15', completed: false },
      { id: 'task-5', title: 'Confirmar palestrante externo', assignee: 'Ana Rodrigues', dueDate: '2026-03-10', completed: true },
    ],
    associatedEmails: ['mkt-email-004', 'mkt-email-005'],
    associatedAds: ['ad-004'],
    associatedEvents: ['evt-002', 'evt-003'],
    tags: ['webinar', 'cloud', 'enterprise'],
    aiSummary: 'Série de webinars com alta taxa de engajamento (38.2% open rate em convites). 2 de 4 webinars realizados com 310 participantes totais. Taxa de conversão de registro para participação: 78%.',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'camp-003',
    name: 'Black Friday Tech 2025',
    type: 'ads',
    status: 'completed',
    description: 'Campanha de Black Friday com foco em desconto para novas assinaturas.',
    startDate: '2025-11-15',
    endDate: '2025-12-05',
    budget: 80000,
    actualSpend: 78500,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: null,
    parentCampaignName: null,
    attributionModel: 'last_touch',
    goals: ['Gerar 300 trials', 'Converter 50 assinaturas pagas'],
    kpis: { contactsReached: 28000, newContacts: 5200, emailsSent: 15000, emailOpenRate: 28.1, emailClickRate: 6.8, adsImpressions: 1200000, adsClicks: 38000, adsCTR: 3.17, eventsHeld: 0, eventAttendees: 0, leadsGenerated: 680, dealsCreated: 45, revenueInfluenced: 520000, closedDeals: 38, roi: 562 },
    members: [],
    tasks: [],
    associatedEmails: ['mkt-email-006'],
    associatedAds: ['ad-005', 'ad-006'],
    associatedEvents: [],
    tags: ['black-friday', 'promocao', 'saas'],
    aiSummary: 'Campanha de Black Friday com ROI excepcional de 562%. Ads no Meta geraram o maior volume de leads (420), enquanto Google Search teve melhor conversão (4.2% CTR). Total de 38 deals fechados de 45 criados (84% win rate).',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2025-12-10T18:00:00Z',
  },
  {
    id: 'camp-004',
    name: 'Nurture Leads Inbound Q2',
    type: 'email',
    status: 'draft',
    description: 'Sequência de nutrição para leads inbound do trimestre.',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    budget: 25000,
    actualSpend: 0,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: null,
    parentCampaignName: null,
    attributionModel: 'linear',
    goals: ['Nutrir 1000 leads', 'Converter 100 MQLs em SQLs'],
    kpis: { contactsReached: 0, newContacts: 0, emailsSent: 0, emailOpenRate: 0, emailClickRate: 0, adsImpressions: 0, adsClicks: 0, adsCTR: 0, eventsHeld: 0, eventAttendees: 0, leadsGenerated: 0, dealsCreated: 0, revenueInfluenced: 0, closedDeals: 0, roi: 0 },
    members: [],
    tasks: [
      { id: 'task-6', title: 'Definir segmentos de audiência', assignee: 'Ana Rodrigues', dueDate: '2026-03-25', completed: false },
      { id: 'task-7', title: 'Criar templates de email', assignee: 'Carlos Silva', dueDate: '2026-03-28', completed: false },
    ],
    associatedEmails: [],
    associatedAds: [],
    associatedEvents: [],
    tags: ['nurture', 'inbound', 'q2-2026'],
    aiSummary: null,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'camp-005',
    name: 'Evento Presencial - Tech Summit SP',
    type: 'event',
    status: 'completed',
    description: 'Participação como patrocinador no Tech Summit São Paulo.',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    budget: 120000,
    actualSpend: 115000,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: null,
    parentCampaignName: null,
    attributionModel: 'full_path',
    goals: ['Gerar 200 leads no estande', 'Realizar 2 palestras'],
    kpis: { contactsReached: 5500, newContacts: 1800, emailsSent: 3200, emailOpenRate: 42.0, emailClickRate: 15.3, adsImpressions: 200000, adsClicks: 5600, adsCTR: 2.8, eventsHeld: 1, eventAttendees: 450, leadsGenerated: 320, dealsCreated: 22, revenueInfluenced: 890000, closedDeals: 12, roi: 674 },
    members: [],
    tasks: [],
    associatedEmails: ['mkt-email-007'],
    associatedAds: ['ad-007'],
    associatedEvents: ['evt-004'],
    tags: ['evento-presencial', 'tech-summit', 'sao-paulo'],
    aiSummary: 'Tech Summit SP superou todas as metas. ROI de 674% com 320 leads captados (60% acima da meta). Os follow-ups pós-evento tiveram 42% de abertura. 12 deals já fechados com receita influenciada de R$ 890K.',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-11-15T18:00:00Z',
  },
  {
    id: 'camp-006',
    name: 'Social Media Awareness H1',
    type: 'social',
    status: 'paused',
    description: 'Campanha de awareness em redes sociais para o primeiro semestre.',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    budget: 60000,
    actualSpend: 28000,
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    ownerName: 'Carlos Silva',
    parentCampaignId: null,
    parentCampaignName: null,
    attributionModel: 'first_touch',
    goals: ['Aumentar seguidores em 20%', 'Gerar 1000 visitantes via social'],
    kpis: { contactsReached: 45000, newContacts: 2100, emailsSent: 0, emailOpenRate: 0, emailClickRate: 0, adsImpressions: 680000, adsClicks: 18500, adsCTR: 2.72, eventsHeld: 0, eventAttendees: 0, leadsGenerated: 280, dealsCreated: 8, revenueInfluenced: 180000, closedDeals: 3, roi: 200 },
    members: [],
    tasks: [],
    associatedEmails: [],
    associatedAds: ['ad-008'],
    associatedEvents: [],
    tags: ['social-media', 'awareness', 'h1-2026'],
    aiSummary: 'Campanha pausada em março para revisão de estratégia. Resultados parciais: 280 leads gerados, ROI de 200%. LinkedIn performou melhor que Meta em qualidade de leads (CPL 40% menor).',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2026-03-05T14:00:00Z',
  },
];

// ============================================================================
// MOCK MARKETING EMAILS
// ============================================================================

const zeroMetrics: EmailMetrics = { sent: 0, delivered: 0, opened: 0, uniqueOpens: 0, clicked: 0, uniqueClicks: 0, bounced: 0, softBounced: 0, hardBounced: 0, unsubscribed: 0, spamReports: 0, openRate: 0, clickRate: 0, clickToOpenRate: 0, bounceRate: 0, unsubscribeRate: 0, deliveryRate: 0 };

export const mockMarketingEmails: MarketingEmail[] = [
  {
    id: 'mkt-email-001', subject: 'Conheça a nova plataforma SaaS - Transforme sua operação', previewText: 'Descubra como nossa plataforma pode revolucionar...', templateType: 'promotional', status: 'sent', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', senderName: 'Foursys Marketing', senderEmail: 'marketing@foursys.com.br', replyTo: 'contato@foursys.com.br', recipientListName: 'Base Ativa - Decisores TI', recipientCount: 3500, scheduledAt: '2026-01-20T09:00:00Z', sentAt: '2026-01-20T09:00:00Z', timezone: 'America/Sao_Paulo', isABTest: true,
    abTestVariants: [
      { id: 'var-a', variantName: 'A', subject: 'Conheça a nova plataforma SaaS - Transforme sua operação', senderName: 'Foursys Marketing', sendPercentage: 50, metrics: { sent: 1750, delivered: 1715, opened: 612, uniqueOpens: 580, clicked: 168, uniqueClicks: 145, bounced: 35, softBounced: 20, hardBounced: 15, unsubscribed: 8, spamReports: 1, openRate: 35.7, clickRate: 9.8, clickToOpenRate: 27.4, bounceRate: 2.0, unsubscribeRate: 0.46, deliveryRate: 98.0 }, isWinner: true },
      { id: 'var-b', variantName: 'B', subject: '🚀 Nova plataforma SaaS: agende sua demo gratuita', senderName: 'Carlos Silva - Foursys', sendPercentage: 50, metrics: { sent: 1750, delivered: 1710, opened: 530, uniqueOpens: 502, clicked: 142, uniqueClicks: 128, bounced: 40, softBounced: 25, hardBounced: 15, unsubscribed: 12, spamReports: 2, openRate: 31.0, clickRate: 8.3, clickToOpenRate: 26.8, bounceRate: 2.3, unsubscribeRate: 0.70, deliveryRate: 97.7 }, isWinner: false },
    ],
    abTestWinnerCriteria: 'open_rate', abTestSampleSize: 30, engagementPrediction: 'high',
    clickMap: [
      { url: '/demo', label: 'Agendar Demo', clicks: 185, uniqueClicks: 162, clickRate: 5.3 },
      { url: '/features', label: 'Ver Funcionalidades', clicks: 95, uniqueClicks: 82, clickRate: 2.7 },
      { url: '/pricing', label: 'Ver Preços', clicks: 30, uniqueClicks: 29, clickRate: 0.9 },
    ],
    personalizationTokens: ['{{first_name}}', '{{company}}', '{{industry}}'],
    metrics: { sent: 3500, delivered: 3425, opened: 1142, uniqueOpens: 1082, clicked: 310, uniqueClicks: 273, bounced: 75, softBounced: 45, hardBounced: 30, unsubscribed: 20, spamReports: 3, openRate: 33.3, clickRate: 9.0, clickToOpenRate: 27.1, bounceRate: 2.1, unsubscribeRate: 0.58, deliveryRate: 97.9 },
    revenueAttributed: 125000, tags: ['lancamento', 'saas'], createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-01-22T14:00:00Z',
  },
  {
    id: 'mkt-email-002', subject: 'Case de Sucesso: Como a TechCorp migrou para nuvem em 30 dias', previewText: 'Veja como nosso cliente reduziu custos em 40%...', templateType: 'informative', status: 'sent', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', senderName: 'Foursys Marketing', senderEmail: 'marketing@foursys.com.br', replyTo: 'contato@foursys.com.br', recipientListName: 'Leads Qualificados', recipientCount: 1800, scheduledAt: '2026-02-05T10:00:00Z', sentAt: '2026-02-05T10:00:00Z', timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'high',
    clickMap: [
      { url: '/case-study/techcorp', label: 'Ler Case Completo', clicks: 245, uniqueClicks: 218, clickRate: 13.6 },
      { url: '/demo', label: 'Solicitar Demo', clicks: 62, uniqueClicks: 58, clickRate: 3.4 },
    ],
    personalizationTokens: ['{{first_name}}'],
    metrics: { sent: 1800, delivered: 1764, opened: 652, uniqueOpens: 615, clicked: 307, uniqueClicks: 276, bounced: 36, softBounced: 22, hardBounced: 14, unsubscribed: 5, spamReports: 0, openRate: 36.9, clickRate: 17.4, clickToOpenRate: 47.1, bounceRate: 2.0, unsubscribeRate: 0.28, deliveryRate: 98.0 },
    revenueAttributed: 85000, tags: ['case-study', 'cloud'], createdAt: '2026-02-03T09:00:00Z', updatedAt: '2026-02-07T12:00:00Z',
  },
  {
    id: 'mkt-email-003', subject: 'Newsletter Foursys - Março 2026', previewText: 'Novidades, eventos e insights do mês...', templateType: 'newsletter', status: 'sent', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', senderName: 'Foursys', senderEmail: 'newsletter@foursys.com.br', replyTo: 'contato@foursys.com.br', recipientListName: 'Newsletter Subscribers', recipientCount: 5200, scheduledAt: '2026-03-01T08:00:00Z', sentAt: '2026-03-01T08:00:00Z', timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'medium',
    clickMap: [
      { url: '/blog/trends-2026', label: 'Tendências 2026', clicks: 320, uniqueClicks: 298, clickRate: 6.1 },
      { url: '/events', label: 'Próximos Eventos', clicks: 185, uniqueClicks: 172, clickRate: 3.6 },
      { url: '/careers', label: 'Vagas Abertas', clicks: 92, uniqueClicks: 88, clickRate: 1.8 },
    ],
    personalizationTokens: ['{{first_name}}'],
    metrics: { sent: 5200, delivered: 5096, opened: 1478, uniqueOpens: 1380, clicked: 597, uniqueClicks: 558, bounced: 104, softBounced: 68, hardBounced: 36, unsubscribed: 42, spamReports: 5, openRate: 29.0, clickRate: 11.7, clickToOpenRate: 40.4, bounceRate: 2.0, unsubscribeRate: 0.82, deliveryRate: 98.0 },
    revenueAttributed: 0, tags: ['newsletter', 'mensal'], createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-03T08:00:00Z',
  },
  {
    id: 'mkt-email-004', subject: 'Webinar: Migração para Nuvem sem Downtime - Inscreva-se!', previewText: 'Aprenda com especialistas como migrar...', templateType: 'event', status: 'sent', campaignId: 'camp-002', campaignName: 'Webinar Series - Cloud Migration', senderName: 'Foursys Events', senderEmail: 'eventos@foursys.com.br', replyTo: 'eventos@foursys.com.br', recipientListName: 'CTOs e CIOs', recipientCount: 1200, scheduledAt: '2026-02-10T09:00:00Z', sentAt: '2026-02-10T09:00:00Z', timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'high',
    clickMap: [
      { url: '/webinar/register', label: 'Inscrever-se', clicks: 198, uniqueClicks: 185, clickRate: 16.5 },
    ],
    personalizationTokens: ['{{first_name}}', '{{company}}'],
    metrics: { sent: 1200, delivered: 1176, opened: 482, uniqueOpens: 448, clicked: 198, uniqueClicks: 185, bounced: 24, softBounced: 16, hardBounced: 8, unsubscribed: 3, spamReports: 0, openRate: 40.8, clickRate: 16.8, clickToOpenRate: 41.3, bounceRate: 2.0, unsubscribeRate: 0.25, deliveryRate: 98.0 },
    revenueAttributed: 45000, tags: ['webinar', 'convite'], createdAt: '2026-02-08T10:00:00Z', updatedAt: '2026-02-12T08:00:00Z',
  },
  {
    id: 'mkt-email-005', subject: 'Lembrete: Webinar amanhã às 14h - Cloud Migration', previewText: 'Não perca! Seu webinar é amanhã...', templateType: 'simple', status: 'sent', campaignId: 'camp-002', campaignName: 'Webinar Series - Cloud Migration', senderName: 'Foursys Events', senderEmail: 'eventos@foursys.com.br', replyTo: 'eventos@foursys.com.br', recipientListName: 'Inscritos Webinar #1', recipientCount: 185, scheduledAt: '2026-02-19T09:00:00Z', sentAt: '2026-02-19T09:00:00Z', timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'high',
    clickMap: [
      { url: '/webinar/join', label: 'Acessar Webinar', clicks: 142, uniqueClicks: 138, clickRate: 76.2 },
    ],
    personalizationTokens: ['{{first_name}}'],
    metrics: { sent: 185, delivered: 184, opened: 158, uniqueOpens: 152, clicked: 142, uniqueClicks: 138, bounced: 1, softBounced: 1, hardBounced: 0, unsubscribed: 0, spamReports: 0, openRate: 85.9, clickRate: 77.2, clickToOpenRate: 89.9, bounceRate: 0.5, unsubscribeRate: 0, deliveryRate: 99.5 },
    revenueAttributed: 0, tags: ['webinar', 'lembrete'], createdAt: '2026-02-18T16:00:00Z', updatedAt: '2026-02-19T10:00:00Z',
  },
  {
    id: 'mkt-email-006', subject: '🔥 Black Friday: 50% OFF na plataforma SaaS', previewText: 'Oferta imperdível por tempo limitado...', templateType: 'promotional', status: 'sent', campaignId: 'camp-003', campaignName: 'Black Friday Tech 2025', senderName: 'Foursys Ofertas', senderEmail: 'ofertas@foursys.com.br', replyTo: 'vendas@foursys.com.br', recipientListName: 'Base Completa', recipientCount: 15000, scheduledAt: '2025-11-25T06:00:00Z', sentAt: '2025-11-25T06:00:00Z', timezone: 'America/Sao_Paulo', isABTest: true,
    abTestVariants: [
      { id: 'var-c', variantName: 'A', subject: '🔥 Black Friday: 50% OFF na plataforma SaaS', senderName: 'Foursys Ofertas', sendPercentage: 50, metrics: { sent: 7500, delivered: 7350, opened: 2352, uniqueOpens: 2205, clicked: 735, uniqueClicks: 662, bounced: 150, softBounced: 95, hardBounced: 55, unsubscribed: 45, spamReports: 8, openRate: 32.0, clickRate: 10.0, clickToOpenRate: 31.2, bounceRate: 2.0, unsubscribeRate: 0.6, deliveryRate: 98.0 }, isWinner: true },
      { id: 'var-d', variantName: 'B', subject: 'Última chance: desconto exclusivo Black Friday', senderName: 'Foursys Ofertas', sendPercentage: 50, metrics: { sent: 7500, delivered: 7350, opened: 1985, uniqueOpens: 1838, clicked: 588, uniqueClicks: 530, bounced: 150, softBounced: 100, hardBounced: 50, unsubscribed: 52, spamReports: 10, openRate: 27.0, clickRate: 8.0, clickToOpenRate: 29.6, bounceRate: 2.0, unsubscribeRate: 0.7, deliveryRate: 98.0 }, isWinner: false },
    ],
    abTestWinnerCriteria: 'click_rate', abTestSampleSize: 20, engagementPrediction: 'high',
    clickMap: [
      { url: '/black-friday', label: 'Ver Oferta', clicks: 1050, uniqueClicks: 945, clickRate: 7.0 },
      { url: '/pricing', label: 'Comparar Planos', clicks: 215, uniqueClicks: 195, clickRate: 1.4 },
      { url: '/trial', label: 'Iniciar Trial', clicks: 58, uniqueClicks: 52, clickRate: 0.4 },
    ],
    personalizationTokens: ['{{first_name}}', '{{company}}'],
    metrics: { sent: 15000, delivered: 14700, opened: 4337, uniqueOpens: 4043, clicked: 1323, uniqueClicks: 1192, bounced: 300, softBounced: 195, hardBounced: 105, unsubscribed: 97, spamReports: 18, openRate: 29.5, clickRate: 9.0, clickToOpenRate: 30.5, bounceRate: 2.0, unsubscribeRate: 0.66, deliveryRate: 98.0 },
    revenueAttributed: 380000, tags: ['black-friday', 'promocao'], createdAt: '2025-11-22T10:00:00Z', updatedAt: '2025-11-28T18:00:00Z',
  },
  {
    id: 'mkt-email-007', subject: 'Obrigado por visitar nosso estande no Tech Summit!', previewText: 'Foi um prazer te receber...', templateType: 'simple', status: 'sent', campaignId: 'camp-005', campaignName: 'Evento Presencial - Tech Summit SP', senderName: 'Carlos Silva', senderEmail: 'carlos.silva@foursys.com.br', replyTo: 'carlos.silva@foursys.com.br', recipientListName: 'Leads Tech Summit', recipientCount: 320, scheduledAt: '2025-10-14T09:00:00Z', sentAt: '2025-10-14T09:00:00Z', timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'high',
    clickMap: [
      { url: '/demo', label: 'Agendar Demo', clicks: 85, uniqueClicks: 78, clickRate: 26.6 },
      { url: '/materials', label: 'Materiais do Evento', clicks: 112, uniqueClicks: 105, clickRate: 35.0 },
    ],
    personalizationTokens: ['{{first_name}}', '{{company}}'],
    metrics: { sent: 320, delivered: 318, opened: 245, uniqueOpens: 232, clicked: 197, uniqueClicks: 183, bounced: 2, softBounced: 1, hardBounced: 1, unsubscribed: 1, spamReports: 0, openRate: 77.0, clickRate: 62.0, clickToOpenRate: 80.4, bounceRate: 0.6, unsubscribeRate: 0.3, deliveryRate: 99.4 },
    revenueAttributed: 210000, tags: ['tech-summit', 'follow-up'], createdAt: '2025-10-13T16:00:00Z', updatedAt: '2025-10-16T10:00:00Z',
  },
  {
    id: 'mkt-email-008', subject: 'Convite: Workshop de Automação de Processos', previewText: 'Participe do nosso workshop exclusivo...', templateType: 'event', status: 'scheduled', campaignId: null, campaignName: null, senderName: 'Foursys Events', senderEmail: 'eventos@foursys.com.br', replyTo: 'eventos@foursys.com.br', recipientListName: 'Gestores de TI', recipientCount: 2200, scheduledAt: '2026-04-10T09:00:00Z', sentAt: null, timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'medium',
    clickMap: [], personalizationTokens: ['{{first_name}}', '{{company}}'],
    metrics: { ...zeroMetrics }, revenueAttributed: 0, tags: ['workshop', 'convite'], createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'mkt-email-009', subject: 'Guia Completo: Segurança na Nuvem em 2026', previewText: 'Baixe nosso guia gratuito...', templateType: 'informative', status: 'scheduled', campaignId: null, campaignName: null, senderName: 'Foursys Marketing', senderEmail: 'marketing@foursys.com.br', replyTo: 'contato@foursys.com.br', recipientListName: 'Leads - Segurança', recipientCount: 1500, scheduledAt: '2026-04-15T10:00:00Z', sentAt: null, timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'high',
    clickMap: [], personalizationTokens: ['{{first_name}}'],
    metrics: { ...zeroMetrics }, revenueAttributed: 0, tags: ['guia', 'seguranca', 'cloud'], createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 'mkt-email-010', subject: 'Pesquisa de Satisfação - Sua opinião importa!', previewText: 'Nos ajude a melhorar nossos serviços...', templateType: 'simple', status: 'draft', campaignId: null, campaignName: null, senderName: 'Foursys', senderEmail: 'pesquisa@foursys.com.br', replyTo: 'pesquisa@foursys.com.br', recipientListName: 'Clientes Ativos', recipientCount: 800, scheduledAt: null, sentAt: null, timezone: 'America/Sao_Paulo', isABTest: false, abTestVariants: null, abTestWinnerCriteria: null, abTestSampleSize: null, engagementPrediction: 'unknown',
    clickMap: [], personalizationTokens: ['{{first_name}}', '{{company}}'],
    metrics: { ...zeroMetrics }, revenueAttributed: 0, tags: ['pesquisa', 'nps'], createdAt: '2026-04-03T10:00:00Z', updatedAt: '2026-04-03T10:00:00Z',
  },
];

// ============================================================================
// MOCK AD ACCOUNTS
// ============================================================================

export const mockAdAccounts: AdAccount[] = [
  { id: 'adacc-001', platform: 'google', accountName: 'Foursys - Google Ads', accountExternalId: '123-456-7890', connected: true, lastSync: '2026-04-05T08:30:00Z', currency: 'BRL', totalSpend: 185000, totalConversions: 1250 },
  { id: 'adacc-002', platform: 'meta', accountName: 'Foursys - Meta Business', accountExternalId: 'act_9876543210', connected: true, lastSync: '2026-04-05T07:45:00Z', currency: 'BRL', totalSpend: 142000, totalConversions: 980 },
  { id: 'adacc-003', platform: 'linkedin', accountName: 'Foursys Technology - LinkedIn', accountExternalId: '501234567', connected: true, lastSync: '2026-04-04T22:00:00Z', currency: 'BRL', totalSpend: 95000, totalConversions: 420 },
  { id: 'adacc-004', platform: 'tiktok', accountName: '', accountExternalId: '', connected: false, lastSync: null, currency: 'BRL', totalSpend: 0, totalConversions: 0 },
];

// ============================================================================
// MOCK AD AUDIENCES
// ============================================================================

export const mockAdAudiences: AdAudience[] = [
  { id: 'aud-001', name: 'Decisores TI - Enterprise', type: 'crm_list', platform: 'linkedin', size: 8500, syncStatus: 'synced', lastSynced: '2026-04-05T06:00:00Z', sourceDescription: 'Lista CRM: Contatos com cargo CTO/CIO/VP de TI em empresas 500+' },
  { id: 'aud-002', name: 'Visitantes Demo Page', type: 'retargeting', platform: 'google', size: 12300, syncStatus: 'synced', lastSynced: '2026-04-05T06:00:00Z', sourceDescription: 'Visitantes que acessaram /demo nos últimos 30 dias' },
  { id: 'aud-003', name: 'Lookalike - Clientes Ativos', type: 'lookalike', platform: 'meta', size: 2500000, syncStatus: 'synced', lastSynced: '2026-04-04T18:00:00Z', sourceDescription: 'Público semelhante baseado nos 200 melhores clientes' },
  { id: 'aud-004', name: 'Leads Webinar - Retargeting', type: 'retargeting', platform: 'meta', size: 4200, syncStatus: 'syncing', lastSynced: null, sourceDescription: 'Leads registrados em webinars que não converteram' },
];

// ============================================================================
// MOCK ADS
// ============================================================================

export const mockAds: Ad[] = [
  { id: 'ad-001', name: 'SaaS Launch - Google Search Brand', platform: 'google', type: 'search', status: 'active', journeyStage: 'decision', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', accountId: 'adacc-001', audienceId: 'aud-002', audienceName: 'Visitantes Demo Page', budget: 25000, budgetPacing: 'on_track', metrics: { impressions: 85000, reach: 42000, clicks: 3800, conversions: 245, leads: 180, spend: 18500, ctr: 4.47, cpc: 4.87, cpm: 217.65, cpa: 75.51, cpl: 102.78, roas: 8.2, frequency: 2.0 }, attribution: { model: 'linear', contactsCreated: 180, dealsCreated: 8, revenueAttributed: 152000 }, startDate: '2026-01-20', endDate: '2026-03-31', targetAudience: 'Profissionais de TI buscando soluções SaaS', creativePreview: 'Anúncio de texto - Busca de marca e termos relacionados', tags: ['search', 'brand'], createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { id: 'ad-002', name: 'SaaS Launch - LinkedIn Decision Makers', platform: 'linkedin', type: 'social', status: 'active', journeyStage: 'consideration', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', accountId: 'adacc-003', audienceId: 'aud-001', audienceName: 'Decisores TI - Enterprise', budget: 30000, budgetPacing: 'underspend', metrics: { impressions: 120000, reach: 35000, clicks: 2800, conversions: 120, leads: 95, spend: 22000, ctr: 2.33, cpc: 7.86, cpm: 183.33, cpa: 183.33, cpl: 231.58, roas: 5.8, frequency: 3.4 }, attribution: { model: 'linear', contactsCreated: 95, dealsCreated: 5, revenueAttributed: 128000 }, startDate: '2026-01-20', endDate: '2026-03-31', targetAudience: 'CTOs, CIOs e VPs de TI', creativePreview: 'Sponsored Content - Carrossel de features da plataforma', tags: ['linkedin', 'enterprise'], createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { id: 'ad-003', name: 'SaaS Launch - Meta Awareness', platform: 'meta', type: 'social', status: 'active', journeyStage: 'awareness', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', accountId: 'adacc-002', audienceId: 'aud-003', audienceName: 'Lookalike - Clientes Ativos', budget: 20000, budgetPacing: 'overspend', metrics: { impressions: 245000, reach: 180000, clicks: 6200, conversions: 85, leads: 145, spend: 22000, ctr: 2.53, cpc: 3.55, cpm: 89.80, cpa: 258.82, cpl: 151.72, roas: 3.1, frequency: 1.4 }, attribution: { model: 'linear', contactsCreated: 145, dealsCreated: 3, revenueAttributed: 68000 }, startDate: '2026-01-20', endDate: '2026-03-31', targetAudience: 'Público semelhante aos melhores clientes', creativePreview: 'Video Ad - Demo da plataforma (30s)', tags: ['meta', 'awareness', 'video'], createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { id: 'ad-004', name: 'Webinar Cloud - LinkedIn Invite', platform: 'linkedin', type: 'social', status: 'active', journeyStage: 'consideration', campaignId: 'camp-002', campaignName: 'Webinar Series - Cloud Migration', accountId: 'adacc-003', audienceId: 'aud-001', audienceName: 'Decisores TI - Enterprise', budget: 8000, budgetPacing: 'on_track', metrics: { impressions: 85000, reach: 28000, clicks: 2400, conversions: 180, leads: 160, spend: 6500, ctr: 2.82, cpc: 2.71, cpm: 76.47, cpa: 36.11, cpl: 40.63, roas: 12.5, frequency: 3.0 }, attribution: { model: 'first_touch', contactsCreated: 160, dealsCreated: 5, revenueAttributed: 82000 }, startDate: '2026-02-01', endDate: '2026-04-30', targetAudience: 'CTOs e CIOs interessados em cloud', creativePreview: 'Event Ad - Convite para webinar com foto do palestrante', tags: ['linkedin', 'webinar'], createdAt: '2026-01-28T10:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { id: 'ad-005', name: 'Black Friday - Google Search', platform: 'google', type: 'search', status: 'completed', journeyStage: 'decision', campaignId: 'camp-003', campaignName: 'Black Friday Tech 2025', accountId: 'adacc-001', audienceId: null, audienceName: null, budget: 35000, budgetPacing: 'on_track', metrics: { impressions: 520000, reach: 280000, clicks: 18500, conversions: 380, leads: 420, spend: 34000, ctr: 3.56, cpc: 1.84, cpm: 65.38, cpa: 89.47, cpl: 80.95, roas: 7.6, frequency: 1.9 }, attribution: { model: 'last_touch', contactsCreated: 420, dealsCreated: 25, revenueAttributed: 258000 }, startDate: '2025-11-15', endDate: '2025-12-05', targetAudience: 'Buscas por SaaS, ERP, CRM com desconto', creativePreview: 'Anúncio de texto - Black Friday com countdown', tags: ['black-friday', 'search'], createdAt: '2025-11-10T10:00:00Z', updatedAt: '2025-12-06T08:00:00Z' },
  { id: 'ad-006', name: 'Black Friday - Meta Retargeting', platform: 'meta', type: 'display', status: 'completed', journeyStage: 'decision', campaignId: 'camp-003', campaignName: 'Black Friday Tech 2025', accountId: 'adacc-002', audienceId: null, audienceName: null, budget: 40000, budgetPacing: 'on_track', metrics: { impressions: 680000, reach: 320000, clicks: 19500, conversions: 260, leads: 260, spend: 38500, ctr: 2.87, cpc: 1.97, cpm: 56.62, cpa: 148.08, cpl: 148.08, roas: 5.4, frequency: 2.1 }, attribution: { model: 'last_touch', contactsCreated: 260, dealsCreated: 18, revenueAttributed: 208000 }, startDate: '2025-11-15', endDate: '2025-12-05', targetAudience: 'Retargeting visitantes do site últimos 60 dias', creativePreview: 'Banner dinâmico - Countdown Black Friday + depoimentos', tags: ['black-friday', 'retargeting'], createdAt: '2025-11-10T10:00:00Z', updatedAt: '2025-12-06T08:00:00Z' },
  { id: 'ad-007', name: 'Tech Summit SP - Awareness', platform: 'meta', type: 'video', status: 'completed', journeyStage: 'awareness', campaignId: 'camp-005', campaignName: 'Evento Presencial - Tech Summit SP', accountId: 'adacc-002', audienceId: null, audienceName: null, budget: 15000, budgetPacing: 'on_track', metrics: { impressions: 200000, reach: 150000, clicks: 5600, conversions: 120, leads: 85, spend: 14200, ctr: 2.80, cpc: 2.54, cpm: 71.00, cpa: 118.33, cpl: 167.06, roas: 4.2, frequency: 1.3 }, attribution: { model: 'full_path', contactsCreated: 85, dealsCreated: 4, revenueAttributed: 60000 }, startDate: '2025-09-20', endDate: '2025-10-10', targetAudience: 'Profissionais de TI em São Paulo', creativePreview: 'Video Ad - Convite Tech Summit SP (15s)', tags: ['tech-summit', 'video'], createdAt: '2025-09-18T10:00:00Z', updatedAt: '2025-10-11T08:00:00Z' },
  { id: 'ad-008', name: 'Social Awareness - LinkedIn Thought Leadership', platform: 'linkedin', type: 'social', status: 'paused', journeyStage: 'awareness', campaignId: 'camp-006', campaignName: 'Social Media Awareness H1', accountId: 'adacc-003', audienceId: null, audienceName: null, budget: 20000, budgetPacing: 'underspend', metrics: { impressions: 180000, reach: 95000, clicks: 4800, conversions: 65, leads: 120, spend: 12000, ctr: 2.67, cpc: 2.50, cpm: 66.67, cpa: 184.62, cpl: 100.00, roas: 3.5, frequency: 1.9 }, attribution: { model: 'first_touch', contactsCreated: 120, dealsCreated: 3, revenueAttributed: 42000 }, startDate: '2026-01-01', endDate: '2026-06-30', targetAudience: 'Profissionais de TI e gestão', creativePreview: 'Artigo patrocinado - Thought leadership sobre tendências tech', tags: ['linkedin', 'thought-leadership'], createdAt: '2025-12-28T10:00:00Z', updatedAt: '2026-03-05T14:00:00Z' },
];

// ============================================================================
// MOCK EVENT INTEGRATIONS
// ============================================================================

export const mockEventIntegrations: EventIntegration[] = [
  { id: 'int-zoom', platform: 'zoom', name: 'Zoom', description: 'Use Zoom para webinars, reuniões e eventos virtuais. Sincronize participantes automaticamente.', connected: true, installCount: '57 mil instalações', logoColor: '#2D8CFF' },
  { id: 'int-teams', platform: 'teams', name: 'Microsoft Teams', description: 'Integre com Teams para webinars corporativos. Sincronize dados de participação automaticamente.', connected: true, installCount: '32 mil instalações', logoColor: '#6264A7' },
  { id: 'int-eventbrite', platform: 'eventbrite', name: 'Eventbrite', description: 'Gerencie eventos presenciais e virtuais com Eventbrite. Sincronize registros e check-ins.', connected: false, installCount: '18 mil instalações', logoColor: '#F05537' },
  { id: 'int-meet', platform: 'google_meet', name: 'Google Meet', description: 'Integre com Google Meet para videoconferências e webinars simples.', connected: false, installCount: '12 mil instalações', logoColor: '#00897B' },
];

// ============================================================================
// MOCK MARKETING EVENTS
// ============================================================================

export const mockMarketingEvents: MarketingEvent[] = [
  {
    id: 'evt-001', name: 'Webinar: IA Aplicada ao CRM - Transforme seus Resultados', type: 'webinar', status: 'completed', description: 'Webinar sobre aplicações práticas de IA no CRM para aumentar vendas e retenção.', campaignId: 'camp-001', campaignName: 'Lançamento SaaS Q1 2026', date: '2026-02-20', startTime: '14:00', endTime: '15:30', timezone: 'America/Sao_Paulo', location: null, virtualUrl: 'https://zoom.us/j/123456789', isVirtual: true, capacity: 300, registrations: 245, attendees: 188, noShows: 57, attendanceRate: 76.7, integrationPlatform: 'zoom', speakerName: 'Dr. Ricardo Mendes', speakerTitle: 'Head of AI - Foursys',
    costPerAttendee: 85.00, revenueInfluenced: 180000,
    eventAttendees: [
      { id: 'att-001', contactId: 'c1', contactName: 'Ana Rodrigues', contactEmail: 'ana@techcorp.com.br', status: 'attended', registeredAt: '2026-02-10T10:00:00Z', checkedInAt: '2026-02-20T13:55:00Z', engagementScore: 92, source: 'Email' },
      { id: 'att-002', contactId: 'c2', contactName: 'Pedro Santos', contactEmail: 'pedro@innovatech.com.br', status: 'attended', registeredAt: '2026-02-12T09:00:00Z', checkedInAt: '2026-02-20T14:02:00Z', engagementScore: 78, source: 'LinkedIn' },
      { id: 'att-003', contactId: 'c3', contactName: 'Maria Oliveira', contactEmail: 'maria@bigcorp.com.br', status: 'no_show', registeredAt: '2026-02-15T14:00:00Z', checkedInAt: null, engagementScore: null, source: 'Landing Page' },
      { id: 'att-004', contactId: 'c4', contactName: 'Roberto Lima', contactEmail: 'roberto@startup.io', status: 'attended', registeredAt: '2026-02-18T11:00:00Z', checkedInAt: '2026-02-20T13:58:00Z', engagementScore: 65, source: 'Email' },
    ],
    automations: [
      { id: 'auto-1', trigger: 'registration', actionType: 'email', description: 'Enviar confirmação de inscrição com link do Zoom', enabled: true },
      { id: 'auto-2', trigger: 'reminder_24h', actionType: 'email', description: 'Lembrete 24h antes com agenda e materiais', enabled: true },
      { id: 'auto-3', trigger: 'reminder_1h', actionType: 'email', description: 'Lembrete 1h antes com link direto', enabled: true },
      { id: 'auto-4', trigger: 'post_event', actionType: 'email', description: 'Enviar gravação e materiais para participantes', enabled: true },
      { id: 'auto-5', trigger: 'no_show', actionType: 'email', description: 'Enviar gravação e oferta de reagendamento para ausentes', enabled: true },
    ],
    tags: ['webinar', 'ia', 'crm'], createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-22T16:00:00Z',
  },
  {
    id: 'evt-002', name: 'Webinar: Migração para Nuvem sem Downtime', type: 'webinar', status: 'completed', description: 'Como realizar migração cloud com zero tempo de inatividade.', campaignId: 'camp-002', campaignName: 'Webinar Series - Cloud Migration', date: '2026-02-20', startTime: '14:00', endTime: '15:00', timezone: 'America/Sao_Paulo', location: null, virtualUrl: 'https://zoom.us/j/987654321', isVirtual: true, capacity: 200, registrations: 185, attendees: 142, noShows: 43, attendanceRate: 76.8, integrationPlatform: 'zoom', speakerName: 'Eng. Marcos Tavares', speakerTitle: 'Cloud Architect - Foursys',
    costPerAttendee: 42.00, revenueInfluenced: 120000,
    eventAttendees: [
      { id: 'att-005', contactId: 'c5', contactName: 'Fernanda Costa', contactEmail: 'fernanda@empresa.com', status: 'attended', registeredAt: '2026-02-08T10:00:00Z', checkedInAt: '2026-02-20T13:55:00Z', engagementScore: 88, source: 'Email' },
      { id: 'att-006', contactId: 'c6', contactName: 'Lucas Almeida', contactEmail: 'lucas@corp.com.br', status: 'no_show', registeredAt: '2026-02-15T16:00:00Z', checkedInAt: null, engagementScore: null, source: 'Landing Page' },
    ],
    automations: [
      { id: 'auto-6', trigger: 'registration', actionType: 'email', description: 'Confirmação de inscrição', enabled: true },
      { id: 'auto-7', trigger: 'reminder_24h', actionType: 'email', description: 'Lembrete 24h', enabled: true },
      { id: 'auto-8', trigger: 'post_event', actionType: 'email', description: 'Enviar gravação', enabled: true },
      { id: 'auto-9', trigger: 'no_show', actionType: 'email', description: 'Follow-up no-show', enabled: false },
    ],
    tags: ['webinar', 'cloud', 'migration'], createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-22T12:00:00Z',
  },
  {
    id: 'evt-003', name: 'Webinar: Segurança em Ambientes Multi-Cloud', type: 'webinar', status: 'scheduled', description: 'Best practices de segurança para ambientes multi-cloud.', campaignId: 'camp-002', campaignName: 'Webinar Series - Cloud Migration', date: '2026-04-15', startTime: '14:00', endTime: '15:00', timezone: 'America/Sao_Paulo', location: null, virtualUrl: 'https://zoom.us/j/111222333', isVirtual: true, capacity: 250, registrations: 98, attendees: 0, noShows: 0, attendanceRate: 0, integrationPlatform: 'zoom', speakerName: 'Dra. Juliana Ferreira', speakerTitle: 'CISO - Foursys',
    costPerAttendee: 0, revenueInfluenced: 0,
    eventAttendees: [
      { id: 'att-007', contactId: 'c1', contactName: 'Ana Rodrigues', contactEmail: 'ana@techcorp.com.br', status: 'registered', registeredAt: '2026-04-01T10:00:00Z', checkedInAt: null, engagementScore: null, source: 'Email' },
      { id: 'att-008', contactId: 'c7', contactName: 'Gustavo Mendes', contactEmail: 'gustavo@securecorp.com', status: 'confirmed', registeredAt: '2026-04-02T14:00:00Z', checkedInAt: null, engagementScore: null, source: 'LinkedIn' },
    ],
    automations: [
      { id: 'auto-10', trigger: 'registration', actionType: 'email', description: 'Confirmação de inscrição', enabled: true },
      { id: 'auto-11', trigger: 'reminder_24h', actionType: 'email', description: 'Lembrete 24h', enabled: true },
      { id: 'auto-12', trigger: 'reminder_1h', actionType: 'email', description: 'Lembrete 1h', enabled: true },
      { id: 'auto-13', trigger: 'post_event', actionType: 'email', description: 'Enviar gravação', enabled: true },
      { id: 'auto-14', trigger: 'no_show', actionType: 'email', description: 'Follow-up no-show', enabled: true },
    ],
    tags: ['webinar', 'seguranca', 'multi-cloud'], createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-04-05T08:00:00Z',
  },
  {
    id: 'evt-004', name: 'Tech Summit São Paulo 2025', type: 'conference', status: 'completed', description: 'Maior evento de tecnologia do ano. Foursys como patrocinadora platinum.', campaignId: 'camp-005', campaignName: 'Evento Presencial - Tech Summit SP', date: '2025-10-10', startTime: '09:00', endTime: '18:00', timezone: 'America/Sao_Paulo', location: 'Centro de Convenções São Paulo Expo', virtualUrl: null, isVirtual: false, capacity: 500, registrations: 480, attendees: 450, noShows: 30, attendanceRate: 93.8, integrationPlatform: null, speakerName: 'Carlos Silva', speakerTitle: 'CEO - Foursys',
    costPerAttendee: 255.56, revenueInfluenced: 890000,
    eventAttendees: [],
    automations: [
      { id: 'auto-15', trigger: 'registration', actionType: 'email', description: 'Confirmação + badge digital', enabled: true },
      { id: 'auto-16', trigger: 'post_event', actionType: 'email', description: 'Follow-up com materiais', enabled: true },
    ],
    tags: ['conference', 'presencial', 'tech-summit'], createdAt: '2025-09-01T10:00:00Z', updatedAt: '2025-10-15T18:00:00Z',
  },
  {
    id: 'evt-005', name: 'Workshop: Automação de Processos com Low-Code', type: 'workshop', status: 'scheduled', description: 'Workshop hands-on sobre automação de processos usando plataformas low-code.', campaignId: null, campaignName: null, date: '2026-04-22', startTime: '10:00', endTime: '12:00', timezone: 'America/Sao_Paulo', location: null, virtualUrl: 'https://teams.microsoft.com/l/meetup-join/abc123', isVirtual: true, capacity: 50, registrations: 38, attendees: 0, noShows: 0, attendanceRate: 0, integrationPlatform: 'teams', speakerName: 'Eng. Patricia Souza', speakerTitle: 'Tech Lead - Foursys',
    costPerAttendee: 0, revenueInfluenced: 0,
    eventAttendees: [
      { id: 'att-009', contactId: 'c2', contactName: 'Pedro Santos', contactEmail: 'pedro@innovatech.com.br', status: 'confirmed', registeredAt: '2026-04-05T10:00:00Z', checkedInAt: null, engagementScore: null, source: 'Email' },
    ],
    automations: [
      { id: 'auto-17', trigger: 'registration', actionType: 'email', description: 'Confirmação + pré-requisitos', enabled: true },
      { id: 'auto-18', trigger: 'reminder_24h', actionType: 'email', description: 'Lembrete com link do Teams', enabled: true },
    ],
    tags: ['workshop', 'low-code', 'automacao'], createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-05T08:00:00Z',
  },
  {
    id: 'evt-006', name: 'Meetup: DevOps & SRE - Melhores Práticas', type: 'meetup', status: 'live', description: 'Meetup da comunidade DevOps com palestras sobre observabilidade e SRE.', campaignId: null, campaignName: null, date: '2026-04-05', startTime: '19:00', endTime: '21:00', timezone: 'America/Sao_Paulo', location: 'Foursys HQ - Av. Paulista, 1234', virtualUrl: 'https://zoom.us/j/444555666', isVirtual: false, capacity: 80, registrations: 72, attendees: 58, noShows: 14, attendanceRate: 80.6, integrationPlatform: 'zoom', speakerName: 'Vários palestrantes', speakerTitle: 'Comunidade DevOps SP',
    costPerAttendee: 35.00, revenueInfluenced: 45000,
    eventAttendees: [
      { id: 'att-010', contactId: 'c4', contactName: 'Roberto Lima', contactEmail: 'roberto@startup.io', status: 'attended', registeredAt: '2026-03-28T10:00:00Z', checkedInAt: '2026-04-05T18:50:00Z', engagementScore: 85, source: 'Direto' },
    ],
    automations: [
      { id: 'auto-19', trigger: 'registration', actionType: 'email', description: 'Confirmação + mapa do local', enabled: true },
      { id: 'auto-20', trigger: 'post_event', actionType: 'email', description: 'Slides e fotos do meetup', enabled: true },
    ],
    tags: ['meetup', 'devops', 'sre', 'presencial'], createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-04-05T19:30:00Z',
  },
];

// ============================================================================
// MOCK RATE CARDS
// ============================================================================

export const mockRateCards: RateCard[] = [
  {
    id: 'rc-001',
    accountId: '660e8400-e29b-41d4-a716-446655440001',
    accountName: 'Foursys Tecnologia',
    version: '2026.1',
    status: 'active',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    entries: [
      { id: 'rce-001', profileName: 'Desenvolvedor Full Stack', category: 'Desenvolvimento', rates: { junior: 85, pleno: 120, senior: 165, especialista: 210 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-002', profileName: 'Desenvolvedor Front-end', category: 'Desenvolvimento', rates: { junior: 80, pleno: 115, senior: 155, especialista: 200 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-003', profileName: 'Desenvolvedor Back-end', category: 'Desenvolvimento', rates: { junior: 82, pleno: 118, senior: 160, especialista: 205 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-004', profileName: 'Desenvolvedor Mobile', category: 'Desenvolvimento', rates: { junior: 88, pleno: 125, senior: 170, especialista: 220 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-005', profileName: 'Engenheiro de Dados', category: 'Dados & IA', rates: { junior: 90, pleno: 130, senior: 180, especialista: 240 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-006', profileName: 'Cientista de Dados', category: 'Dados & IA', rates: { junior: 95, pleno: 140, senior: 190, especialista: 250 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-007', profileName: 'Analista de QA', category: 'Qualidade', rates: { junior: 70, pleno: 100, senior: 140, especialista: 180 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-008', profileName: 'DevOps / SRE', category: 'Infraestrutura', rates: { junior: 90, pleno: 130, senior: 175, especialista: 230 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-009', profileName: 'Tech Lead', category: 'Gestão Técnica', rates: { junior: 0, pleno: 150, senior: 200, especialista: 260 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-010', profileName: 'Scrum Master', category: 'Gestão Técnica', rates: { junior: 0, pleno: 130, senior: 170, especialista: 210 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-011', profileName: 'UX/UI Designer', category: 'Design', rates: { junior: 75, pleno: 110, senior: 150, especialista: 195 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-012', profileName: 'Arquiteto de Soluções', category: 'Arquitetura', rates: { junior: 0, pleno: 0, senior: 220, especialista: 300 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
    ],
    approvedBy: 'Carlos Silva',
    approvedAt: '2025-12-20T10:00:00Z',
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'rc-002',
    accountId: '660e8400-e29b-41d4-a716-446655440002',
    accountName: 'Tech Corp Solutions',
    version: '2026.1',
    status: 'active',
    validFrom: '2026-01-01',
    validUntil: '2026-06-30',
    entries: [
      { id: 'rce-020', profileName: 'Desenvolvedor Full Stack', category: 'Desenvolvimento', rates: { junior: 90, pleno: 130, senior: 175, especialista: 225 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-021', profileName: 'Desenvolvedor Front-end', category: 'Desenvolvimento', rates: { junior: 85, pleno: 120, senior: 165, especialista: 210 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-022', profileName: 'Analista de QA', category: 'Qualidade', rates: { junior: 75, pleno: 105, senior: 145, especialista: 185 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-023', profileName: 'DevOps / SRE', category: 'Infraestrutura', rates: { junior: 95, pleno: 135, senior: 185, especialista: 240 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-024', profileName: 'Scrum Master', category: 'Gestão Técnica', rates: { junior: 0, pleno: 135, senior: 175, especialista: 215 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-025', profileName: 'UX/UI Designer', category: 'Design', rates: { junior: 78, pleno: 112, senior: 155, especialista: 200 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
    ],
    approvedBy: 'Ana Costa',
    approvedAt: '2025-12-28T14:00:00Z',
    createdAt: '2025-12-22T10:00:00Z',
    updatedAt: '2025-12-28T14:00:00Z',
  },
  {
    id: 'rc-003',
    accountId: '660e8400-e29b-41d4-a716-446655440003',
    accountName: 'StartupX Inovação',
    version: '2025.2',
    status: 'active',
    validFrom: '2025-07-01',
    validUntil: '2026-06-30',
    entries: [
      { id: 'rce-030', profileName: 'Desenvolvedor Full Stack', category: 'Desenvolvimento', rates: { junior: 75, pleno: 105, senior: 145, especialista: 185 }, currency: 'BRL', unit: 'hora', validFrom: '2025-07-01', validUntil: null },
      { id: 'rce-031', profileName: 'Desenvolvedor Mobile', category: 'Desenvolvimento', rates: { junior: 80, pleno: 110, senior: 150, especialista: 195 }, currency: 'BRL', unit: 'hora', validFrom: '2025-07-01', validUntil: null },
      { id: 'rce-032', profileName: 'UX/UI Designer', category: 'Design', rates: { junior: 70, pleno: 100, senior: 140, especialista: 180 }, currency: 'BRL', unit: 'hora', validFrom: '2025-07-01', validUntil: null },
      { id: 'rce-033', profileName: 'Analista de QA', category: 'Qualidade', rates: { junior: 65, pleno: 90, senior: 125, especialista: 160 }, currency: 'BRL', unit: 'hora', validFrom: '2025-07-01', validUntil: null },
    ],
    approvedBy: 'Pedro Oliveira',
    approvedAt: '2025-06-25T10:00:00Z',
    createdAt: '2025-06-20T10:00:00Z',
    updatedAt: '2025-06-25T10:00:00Z',
  },
  {
    id: 'rc-004',
    accountId: '660e8400-e29b-41d4-a716-446655440004',
    accountName: 'BigCo Enterprises',
    version: '2026.1',
    status: 'active',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    entries: [
      { id: 'rce-040', profileName: 'Desenvolvedor Full Stack', category: 'Desenvolvimento', rates: { junior: 95, pleno: 140, senior: 190, especialista: 250 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-041', profileName: 'Desenvolvedor Front-end', category: 'Desenvolvimento', rates: { junior: 90, pleno: 130, senior: 175, especialista: 230 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-042', profileName: 'Desenvolvedor Back-end', category: 'Desenvolvimento', rates: { junior: 92, pleno: 135, senior: 180, especialista: 240 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-043', profileName: 'Engenheiro de Dados', category: 'Dados & IA', rates: { junior: 100, pleno: 145, senior: 200, especialista: 270 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-044', profileName: 'Cientista de Dados', category: 'Dados & IA', rates: { junior: 105, pleno: 155, senior: 210, especialista: 280 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-045', profileName: 'Analista de QA', category: 'Qualidade', rates: { junior: 80, pleno: 115, senior: 155, especialista: 200 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-046', profileName: 'DevOps / SRE', category: 'Infraestrutura', rates: { junior: 100, pleno: 145, senior: 195, especialista: 255 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-047', profileName: 'Tech Lead', category: 'Gestão Técnica', rates: { junior: 0, pleno: 165, senior: 220, especialista: 290 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-048', profileName: 'Scrum Master', category: 'Gestão Técnica', rates: { junior: 0, pleno: 145, senior: 185, especialista: 235 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-049', profileName: 'Arquiteto de Soluções', category: 'Arquitetura', rates: { junior: 0, pleno: 0, senior: 250, especialista: 340 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-050', profileName: 'UX/UI Designer', category: 'Design', rates: { junior: 85, pleno: 125, senior: 170, especialista: 220 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
      { id: 'rce-051', profileName: 'Gerente de Projetos', category: 'Gestão Técnica', rates: { junior: 0, pleno: 155, senior: 210, especialista: 275 }, currency: 'BRL', unit: 'hora', validFrom: '2026-01-01', validUntil: null },
    ],
    approvedBy: 'Roberto Lima',
    approvedAt: '2025-12-18T10:00:00Z',
    createdAt: '2025-12-10T10:00:00Z',
    updatedAt: '2025-12-18T10:00:00Z',
  },
];

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
  users: mockUsers,
  accounts: mockAccounts,
  contacts: mockContacts,
  pipelines: mockPipelines,
  stages: mockStages,
  deals: mockDeals,
  activities: mockActivities,
  leads: mockLeads,
  leadScoreDetails: mockLeadScoreDetails,
  lifecycleFunnel: mockLifecycleFunnel,
  nurtureSequences: mockNurtureSequences,
  reportTemplates: mockReportTemplates,
  savedReports: mockSavedReports,
  reportSchedules: mockReportSchedules,
  reportExecutionLogs: mockReportExecutionLogs,
  exportJobs: mockExportJobs,
  biConnectors: mockBiConnectors,
  invoices: mockInvoices,
  paymentConnectors: mockPaymentConnectors,
  collectionTemplates: mockCollectionTemplates,
  collectionRules: mockCollectionRules,
  collectionJobs: mockCollectionJobs,
  allocations: mockAllocations,
  invoiceHistoryEvents: mockInvoiceHistoryEvents,
  rolePermissionMatrix: mockRolePermissionMatrix,
  auditEvents: mockAuditEvents,
  complianceExportJobs: mockComplianceExportJobs,
  accessPermissionCatalog: mockAccessPermissionCatalog,
  accessGroups: mockAccessGroups,
  accessUserGroupMemberships: mockAccessUserGroupMemberships,
  directUserPermissionGrants: mockDirectUserPermissionGrants,
  effectiveAccessSummaryByUser: mockEffectiveAccessSummaryByUser,
  effectivePermissions: mockEffectivePermissions,
  accessPermissionConflicts: mockAccessPermissionConflicts,
  accessElevationRequests: mockAccessElevationRequests,
  accessAuditEvents: mockAccessAuditEvents,
  accessExportHistory: mockAccessExportHistory,
  products: mockProducts,
  proposals: mockProposals,
  rateCards: mockRateCards,
  contracts: mockContracts,
  projects: mockProjects,
  integrations: mockIntegrations,
  ssoConfig: mockSsoConfig,
  saasDashboard: mockSaasDashboard,
  accountHealthScores: mockAccountHealthScores,
  csOverview: mockCsOverview,
  csAlerts: mockCsAlerts,
  csPlaybooks: mockCsPlaybooks,
  accountHealthHistory: mockAccountHealthHistory,
  campaigns: mockCampaigns,
  marketingEmails: mockMarketingEmails,
  adAccounts: mockAdAccounts,
  adAudiences: mockAdAudiences,
  ads: mockAds,
  eventIntegrations: mockEventIntegrations,
  marketingEvents: mockMarketingEvents,
};

export default mockData;
