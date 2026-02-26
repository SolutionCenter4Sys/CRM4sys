// CRM B2B Tech Foursys - TypeScript Types
// Data: 14/02/2026 - PostgreSQL/Supabase

// ============================================================================
// CONTACT TYPES
// ============================================================================

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Generated field
  email: string;
  phone?: string;
  mobilePhone?: string;
  jobTitle?: string;
  department?: string;
  accountId?: string;
  account?: Account; // Populated
  ownerId: string;
  owner?: User; // Populated
  lifecycleStage: LifecycleStage;
  leadScore: number; // 0-100
  leadSource?: string;
  tags: string[];
  customFields?: Record<string, any>;
  buyingCommitteeRole?: BuyingCommitteeRole;
  lastContactedAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type LifecycleStage =
  | 'subscriber'
  | 'lead'
  | 'mql'
  | 'sql'
  | 'opportunity'
  | 'customer'
  | 'evangelist';

export type BuyingCommitteeRole =
  | 'DecisionMaker'
  | 'Champion'
  | 'Influencer'
  | 'Blocker'
  | 'Coach';

// ============================================================================
// ACCOUNT TYPES
// ============================================================================

export interface BillingConditions {
  paymentTerms?: string;       // ex: "30 dias", "NET30", "À vista"
  billingCycle?: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  paymentMethod?: string;      // ex: "Boleto", "PIX", "Cartão de Crédito", "Transferência"
  creditLimit?: number;
  currency?: string;           // ex: "BRL", "USD"
  billingEmail?: string;
  billingContact?: string;
  invoiceFormat?: 'nfe' | 'nfse' | 'recibo';
  taxRegime?: string;          // ex: "Simples Nacional", "Lucro Presumido", "Lucro Real"
  notes?: string;
}

export interface Branch {
  id: string;
  name: string;
  cnpj?: string;
  type: 'matriz' | 'filial' | 'subsidiaria';
  address?: Address;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface Account {
  id: string;
  name: string;
  legalName?: string;
  tradeName?: string;
  cnpj?: string;
  domain?: string;
  website?: string;
  phone?: string;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  address?: Address;
  branches?: Branch[];
  tier: AccountTier;
  icpScore: number; // 0-100
  targetAccount: boolean;
  parentAccountId?: string;
  parentAccount?: Account;
  childAccounts?: Account[];
  ownerId: string;
  owner?: User;
  techStack?: string[];
  billingConditions?: BillingConditions;
  customFields?: Record<string, any>;
  enrichedAt?: string;
  enrichmentSource?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Stats (computed)
  contactCount?: number;
  openDealsCount?: number;
  totalDealsValue?: number;
}

export type AccountTier = 'SMB' | 'MidMarket' | 'Enterprise';

export interface Address {
  street?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// ============================================================================
// DEAL TYPES
// ============================================================================

export interface Deal {
  id: string;
  title: string;
  description?: string;
  amount: number;
  probability: number; // 0-100 (from stage)
  weightedAmount: number; // Generated: amount * probability / 100
  expectedCloseDate?: string;
  actualCloseDate?: string;
  pipelineId: string;
  pipeline?: Pipeline;
  stageId: string;
  stage?: Stage;
  accountId: string;
  account?: Account;
  primaryContactId?: string;
  primaryContact?: Contact;
  ownerId: string;
  owner?: User;
  status: DealStatus;
  lostReason?: string;
  products?: DealProduct[];
  tags: string[];
  customFields?: Record<string, any>;
  rottingDays?: number; // Days since last activity
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type DealStatus = 'open' | 'won' | 'lost';

export interface DealProduct {
  id: string;
  dealId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  totalPrice: number;
  recurring: boolean;
  recurringPeriod?: 'monthly' | 'quarterly' | 'annual';
}

// ============================================================================
// LEAD MANAGEMENT TYPES (EP03)
// ============================================================================

export type LeadSource =
  | 'website'
  | 'linkedin'
  | 'referral'
  | 'event'
  | 'webinar'
  | 'content_download'
  | 'cold_outreach';

export type LeadStatus = 'new' | 'working' | 'nurturing' | 'unqualified' | 'converted';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: LeadSource;
  status: LeadStatus;
  leadScore: number;
  lifecycle: 'subscriber' | 'lead' | 'mql';
  ownerId: string;
  owner?: User;
  tags: string[];
  customFields: Record<string, unknown>;
  isConverted: boolean;
  convertedToContactId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadScoreFactor {
  name: string;
  value: number;
  reason: string;
}

export interface LeadScoreComponent {
  score: number;
  maxScore: number;
  factors: LeadScoreFactor[];
}

export interface LeadScoreTrigger {
  event: string;
  timestamp: string;
  points: number;
  icon: string;
}

export interface LeadScoreDetails {
  total: number;
  classification: 'hot' | 'warm' | 'cold';
  breakdown: {
    demographicFit: LeadScoreComponent;
    behavioralEngagement: LeadScoreComponent;
  };
  triggers: LeadScoreTrigger[];
  lastCalculatedAt: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: LeadSource;
  status: LeadStatus;
  ownerId: string;
  lifecycle: 'subscriber' | 'lead' | 'mql';
  tags: string[];
  customFields: Record<string, unknown>;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  lifecycle?: Lead['lifecycle'] | '';
  ownerId?: string;
  scoreMin?: number;
  scoreMax?: number;
}

export interface ConvertLeadPayload {
  leadId: string;
  createAccount: boolean;
  accountName?: string;
  ownerId: string;
  lifecycleStage: 'mql' | 'sql';
  createDeal?: {
    name: string;
    amount: number;
    pipelineId: string;
  };
}

export interface ConvertLeadResult {
  contactId: string;
  accountId?: string;
  dealId?: string;
  activitiesTransferred: number;
}

export interface LifecycleStageData {
  stage: Exclude<LifecycleStage, 'evangelist'>;
  count: number;
  percentage: number;
  avgDaysInStage: number;
  topSources?: Array<{ source: string; count: number }>;
  topOwners?: Array<{ ownerName: string; count: number }>;
  conversionToNext?: {
    rate: number;
    avgDays: number;
    count: number;
  };
}

export interface FunnelInsight {
  type: 'bottleneck' | 'success' | 'warning';
  message: string;
  from: Exclude<LifecycleStage, 'evangelist'>;
  to?: Exclude<LifecycleStage, 'evangelist'>;
  value: number;
}

export interface LifecycleFunnel {
  period: { from: string; to: string };
  stages: LifecycleStageData[];
  insights: FunnelInsight[];
}

export interface LifecycleFunnelRequest {
  period: 'current_quarter' | 'last_quarter' | 'ytd' | 'custom_range';
  customRange?: {
    from: string;
    to: string;
  };
}

export interface NurtureSequence {
  id: string;
  name: string;
  isActive: boolean;
  steps: SequenceStep[];
  enrollmentTrigger: EnrollmentTrigger;
  stopConditions: StopCondition[];
  stats: SequenceStats;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStep {
  id: string;
  order: number;
  type: 'email' | 'task' | 'wait';
  delayDays: number;
  delayHours?: number;
  emailTemplateId?: string;
  emailSubject?: string;
  stats?: StepStats;
}

export interface StepStats {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
}

export interface EnrollmentTrigger {
  type: 'manual' | 'form_submit' | 'lifecycle_change' | 'lead_score';
  config: Record<string, unknown>;
}

export interface StopCondition {
  type: 'replied' | 'unsubscribed' | 'converted' | 'score_increased';
  config: Record<string, unknown>;
}

export interface SequenceStats {
  enrollments: number;
  active: number;
  completed: number;
  unsubscribed: number;
  conversions: number;
  overallConversionRate: number;
}

export interface SequenceTestRun {
  id: string;
  sequenceId: string;
  startedAt: string;
  status: 'queued' | 'sent' | 'delivered';
  message: string;
}

// ============================================================================
// ANALYTICS, REPORTING E BI TYPES (EP06)
// ============================================================================

export interface DashboardKpiMetric {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  comparisonValue: number;
  comparisonLabel: string;
  trend: 'up' | 'down' | 'neutral';
  segmentKey: string;
}

export interface DashboardChartPoint {
  label: string;
  value: number;
  comparisonValue?: number;
  segmentKey?: string;
}

export interface DashboardChartSeries {
  id: string;
  label: string;
  type: 'bar' | 'line' | 'pie' | 'table';
  points: DashboardChartPoint[];
}

export interface DashboardSegmentFilters {
  datePreset: 'this_month' | 'this_quarter' | 'this_year' | 'custom';
  dateFrom?: string;
  dateTo?: string;
  team?: string;
  pipelineId?: string;
  ownerId?: string;
  compareTo?: 'previous_period' | 'last_year' | 'custom' | 'none';
  compareFrom?: string;
  compareToDate?: string;
}

export interface DashboardDrilldownRecord {
  id: string;
  title: string;
  subtitle?: string;
  amount?: number;
  ownerName?: string;
  stageName?: string;
  status?: string;
  createdAt?: string;
}

export interface DashboardDrilldownResult {
  path: string[];
  metricKey: string;
  records: DashboardDrilldownRecord[];
}

export interface DashboardInsights {
  summary: string[];
  varianceHighlights: string[];
}

export interface ExecutiveDashboardData {
  generatedAt: string;
  filters: DashboardSegmentFilters;
  kpis: DashboardKpiMetric[];
  charts: DashboardChartSeries[];
  topPerformers: Array<{ userId: string; name: string; wins: number; revenue: number }>;
  insights: DashboardInsights;
}

export type ReportCategory = 'sales' | 'marketing' | 'abm' | 'custom';
export type ReportDataSource = 'deals' | 'leads' | 'contacts' | 'activities' | 'accounts';
export type ReportVisualization = 'table' | 'bar' | 'line' | 'pie' | 'funnel' | 'both';

export interface ReportFilterSet {
  dateFrom?: string;
  dateTo?: string;
  ownerIds?: string[];
  pipelineIds?: string[];
  teamIds?: string[];
  productIds?: string[];
  tags?: string[];
  status?: string[];
}

export interface ReportAggregation {
  field: string;
  fn: 'sum' | 'count' | 'avg' | 'min' | 'max';
}

export interface ReportDefinition {
  id: string;
  name: string;
  description?: string;
  category: ReportCategory;
  dataSource: ReportDataSource;
  filters: ReportFilterSet;
  columns: string[];
  groupBy?: string;
  aggregations?: ReportAggregation[];
  visualization: ReportVisualization;
  isTemplate?: boolean;
  isShared?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRunResult {
  reportId: string;
  generatedAt: string;
  rows: Array<Record<string, unknown>>;
  totals?: Record<string, number>;
  chart?: DashboardChartSeries;
}

export interface ReportSchedule {
  id: string;
  reportId: string;
  reportName: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  subject?: string;
  message?: string;
  nextRunAt: string;
}

export interface ReportExecutionLog {
  id: string;
  scheduleId: string;
  reportId: string;
  executedAt: string;
  status: 'success' | 'failure';
  recipients: string[];
  message: string;
}

export interface ExportJob {
  id: string;
  entity: 'contacts' | 'accounts' | 'deals' | 'leads' | 'reports' | 'receivables' | 'compliance';
  format: 'csv' | 'excel' | 'json' | 'pdf';
  status: 'queued' | 'processing' | 'done' | 'failed';
  records: number;
  requestedBy: string;
  requestedAt: string;
  downloadUrl?: string;
}

export interface BiConnectorStatus {
  connector: 'power_bi' | 'google_sheets' | 'api';
  connected: boolean;
  lastSyncAt?: string;
  details?: string;
}

// ============================================================================
// PIPELINE & STAGE TYPES
// ============================================================================

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  pipelineId: string;
  name: string;
  description?: string;
  probability: number; // 0-100
  displayOrder: number;
  color: string; // Hex color
  automations?: StageAutomation[];
  rotAfterDays?: number; // Mark as rotting if no activity
  createdAt: string;
  updatedAt: string;
}

export interface StageAutomation {
  type: 'email' | 'task' | 'notification' | 'webhook';
  trigger: 'on_enter' | 'on_exit' | 'on_stay_days';
  config: Record<string, any>;
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  relatedContactId?: string;
  relatedAccountId?: string;
  relatedDealId?: string;
  userId: string;
  user?: User;
  activityDate: string;
  duration?: number; // minutes
  metadata?: Record<string, any>;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'email'
  | 'call'
  | 'meeting'
  | 'note'
  | 'task'
  | 'sms'
  | 'whatsapp'
  | 'status_change'
  | 'stage_change'
  | 'deal_won'
  | 'deal_lost'
  | 'contact_created'
  | 'account_created'
  | 'enrichment'
  | 'file_upload'
  | 'merged_from';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'sales' | 'marketing';

// ============================================================================
// LEAD SCORE & ICP SCORE BREAKDOWN
// ============================================================================

export interface ScoreBreakdown {
  total: number; // 0-100
  demographic: number;
  behavioral: number;
  engagement: number;
  fit: number;
  factors: ScoreFactor[];
}

export interface ScoreFactor {
  name: string;
  value: number;
  weight: number;
  description: string;
}

// ============================================================================
// FILTERS & PAGINATION
// ============================================================================

export interface ListFilters {
  search?: string;
  lifecycleStage?: LifecycleStage[];
  leadScoreMin?: number;
  leadScoreMax?: number;
  ownerId?: string[];
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}

export interface Pagination {
  page: number; // 1-indexed
  limit: number; // default 20
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  traceId?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  jobTitle?: string;
  department?: string;
  accountId?: string;
  ownerId?: string;
  lifecycleStage?: LifecycleStage;
  leadSource?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface AccountFormData {
  name: string;
  legalName?: string;
  tradeName?: string;
  cnpj?: string;
  phone?: string;
  domain?: string;
  website?: string;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  address?: Address;
  branches?: Branch[];
  billingConditions?: BillingConditions;
  tier?: AccountTier;
  targetAccount?: boolean;
  ownerId?: string;
  customFields?: Record<string, any>;
}

export interface DealFormData {
  title: string;
  description?: string;
  amount: number;
  expectedCloseDate?: string;
  pipelineId: string;
  stageId: string;
  accountId: string;
  primaryContactId?: string;
  ownerId?: string;
  products?: DealProduct[];
  tags?: string[];
  customFields?: Record<string, any>;
}

// ============================================================================
// EP07 - FATURAMENTO, RECEBÍVEIS, COBRANÇA E COMPLIANCE
// ============================================================================

// -----------------------------
// Invoices (F1)
// -----------------------------

export type InvoiceStatus = 'draft' | 'open' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'pix' | 'boleto' | 'transfer' | 'card' | 'cash' | 'other';

export interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRatePct?: number;
  discountValue?: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountOpen: number;
}

export interface InvoiceFormData {
  accountId: string;
  contactId?: string | null;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  currency: 'BRL';
  notes?: string | null;
  items: InvoiceItemForm[];
  discountValue?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  accountId: string;
  accountName: string;
  contactId?: string | null;
  contactName?: string | null;
  status: InvoiceStatus;
  currency: 'BRL';
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: Array<InvoiceItemForm & { id: string }>;
  totals: InvoiceTotals;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface InvoiceListFilters {
  search?: string;
  status?: InvoiceStatus | 'all';
  accountId?: string | null;
  issueFrom?: string | null;
  issueTo?: string | null;
  dueFrom?: string | null;
  dueTo?: string | null;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  accountName: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  amountTotal: number;
  amountOpen: number;
}

export interface RecurrenceRuleForm {
  invoiceId: string;
  enabled: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  dayOfMonth: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null;
  nextRunAt?: string | null; // ISO
}

export interface RecurrencePreviewItem {
  runDate: string; // YYYY-MM-DD
  expectedIssueDate: string; // YYYY-MM-DD
  expectedDueDate: string; // YYYY-MM-DD
  conflict: boolean;
  conflictReason?: string | null;
}

export interface ConflictCheckResult {
  ok: boolean;
  conflictsCount: number;
  conflicts?: Array<{ date: string; reason: string }>;
}

// -----------------------------
// Collections (F2)
// -----------------------------

export type CollectionChannel = 'email' | 'sms' | 'whatsapp';

export interface CollectionRuleFilters {
  search?: string;
  isActive?: boolean | null;
  channel?: CollectionChannel | null;
}

export interface CollectionRuleStep {
  id: string;
  order: number;
  delayDays: number;
  channel: CollectionChannel;
  templateId: string;
  isBlocking: boolean;
}

export interface CollectionRule {
  id: string;
  name: string;
  isActive: boolean;
  appliesToStatus: Array<'open' | 'overdue' | 'partial'>;
  minDaysOverdue?: number | null;
  maxDaysOverdue?: number | null;
  steps: CollectionRuleStep[];
  createdAt: string;
  updatedAt: string;
}

export type TemplateChannel = CollectionChannel;

export interface TemplateVariable {
  key: string;
  label: string;
  example: string;
}

export interface TemplateVersion {
  id: string;
  version: number;
  subject?: string | null;
  body: string;
  createdAt: string;
  createdByName: string;
}

export interface TemplateModel {
  id: string;
  name: string;
  channel: TemplateChannel;
  isActive: boolean;
  variables: TemplateVariable[];
  versions: TemplateVersion[];
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionJobError {
  code: string;
  message: string;
  invoiceId?: string | null;
}

export interface CollectionJobFilters {
  status?: 'queued' | 'processing' | 'done' | 'error' | 'all';
  periodFrom?: string | null;
  periodTo?: string | null;
}

export interface CollectionJob {
  id: string;
  ruleId: string;
  ruleName: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  startedAt: string;
  finishedAt?: string | null;
  totalInvoices: number;
  processedInvoices: number;
  sentCount: number;
  errorCount: number;
  errors?: CollectionJobError[];
}

// -----------------------------
// Receivables & Aging (F3)
// -----------------------------

export interface ReceivablesFilters {
  asOfDate: string; // YYYY-MM-DD
  accountId?: string | null;
  status?: Array<'open' | 'partial' | 'overdue'>;
}

export interface ComparisonMetric {
  label: string;
  currentValue: number;
  previousValue: number;
  deltaPct: number;
}

export interface ReceivablesKpi {
  key: 'amount_open' | 'amount_overdue' | 'invoices_open' | 'avg_days_overdue';
  label: string;
  value: number;
  formattedValue: string;
  comparison?: ComparisonMetric;
}

export interface AgingFilters {
  asOfDate: string; // YYYY-MM-DD
  accountId?: string | null;
  status?: Array<'open' | 'partial' | 'overdue'>;
}

export interface AgingBucket {
  bucket: '0_30' | '31_60' | '61_90' | '90_plus';
  label: string;
  invoicesCount: number;
  amountOpen: number;
}

export interface AgingDetailRow {
  invoiceId: string;
  invoiceNumber: string;
  accountName: string;
  dueDate: string;
  daysOverdue: number;
  amountOpen: number;
  status: InvoiceStatus;
}

// -----------------------------
// Payments & History (F4)
// -----------------------------

export interface ManualPaymentForm {
  invoiceId: string;
  receivedAt: string; // YYYY-MM-DD
  amountReceived: number;
  method: PaymentMethod;
  reference: string | null;
  notes: string | null;
  confirmPolicy: boolean;
}

export interface InvoiceStatusUpdate {
  invoiceId: string;
  previousStatus: 'open' | 'overdue' | 'partial';
  newStatus: 'paid';
  amountOpenBefore: number;
  amountOpenAfter: number;
  updatedAt: string; // ISO
}

export interface PartialPaymentInput {
  invoiceId: string;
  receivedAt: string; // YYYY-MM-DD
  amountReceived: number;
  method: PaymentMethod;
  reference: string | null;
  notes: string | null;
}

export interface AllocationEntry {
  allocationId: string;
  invoiceId: string;
  receivedAt: string; // YYYY-MM-DD
  amount: number;
  method: PaymentMethod;
  createdByName: string;
  createdAt: string; // ISO
}

export interface RemainingBalance {
  invoiceId: string;
  amountTotal: number;
  amountPaid: number;
  amountOpen: number;
  status: 'partial' | 'open' | 'paid' | 'overdue';
}

export interface HistoryFilters {
  periodFrom: string | null;
  periodTo: string | null;
  types: Array<'payment' | 'reversal' | 'status_change' | 'note'>;
  userId: string | null;
}

export interface InvoiceHistoryEvent {
  eventId: string;
  invoiceId: string;
  type: 'payment' | 'reversal' | 'status_change' | 'note';
  title: string;
  description: string | null;
  amount: number | null;
  previousStatus: string | null;
  newStatus: string | null;
  createdByName: string;
  createdAt: string; // ISO
}

export interface ReversalDetail {
  reversalId: string;
  originalPaymentRef: string | null;
  reasonCode: 'duplicate' | 'chargeback' | 'entry_error' | 'other';
  reasonText: string | null;
  amountReversed: number;
  reversedAt: string; // ISO/date
}

// -----------------------------
// Gateways, Payment Links, Webhooks (F5)
// -----------------------------

export type ConnectorType = 'stripe' | 'pagarme' | 'manual' | 'stub';
export type ConnectorStatus = 'connected' | 'disconnected' | 'error';

export interface ConnectorCredentials {
  connector: ConnectorType;
  apiKey: string | null;
  secret: string | null;
  webhookSecret: string | null;
  environment: 'sandbox' | 'production';
  rotateKeys: boolean;
}

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  checkedAt: string; // ISO
}

export interface ConnectorViewModel {
  connector: ConnectorType;
  label: string;
  status: ConnectorStatus;
  lastSyncAt: string | null;
  details: string | null;
  canEdit: boolean;
}

export type LinkStatus = 'active' | 'expired' | 'revoked';

export interface PaymentLinkRequest {
  invoiceId: string;
  amount: number;
  currency: 'BRL';
  expiresInDays: number;
  allowPartial: boolean;
  customerEmail: string | null;
  customerName: string | null;
  description: string | null;
}

export interface PaymentLinkResponse {
  linkId: string;
  url: string;
  status: LinkStatus;
  expiresAt: string; // ISO
  createdAt: string; // ISO
}

export type WebhookEventStatus = 'received' | 'processed' | 'failed' | 'retried';

export interface WebhookEventFilters {
  connector: ConnectorType | null;
  status: WebhookEventStatus | null;
  periodFrom: string | null;
  periodTo: string | null;
  query: string;
  page: number;
  pageSize: number;
}

export interface WebhookEvent {
  eventId: string;
  connector: ConnectorType;
  eventType: string;
  invoiceId: string | null;
  status: WebhookEventStatus;
  receivedAt: string; // ISO
  processedAt: string | null; // ISO
  errorMessage: string | null;
  attempts: number;
}

export interface WebhookPayloadView {
  eventId: string;
  maskedJson: string;
  rawSizeBytes: number;
  maskedFields: string[];
}

// -----------------------------
// Permissions, Audit & Compliance (F6)
// -----------------------------

export type RoleType = 'admin' | 'finance' | 'sales' | 'auditor' | 'viewer';

export type FinancePermissionKey =
  | 'billing.invoice.create'
  | 'billing.invoice.edit'
  | 'billing.invoice.cancel'
  | 'billing.payment.record'
  | 'billing.payment.reverse'
  | 'billing.collections.manage'
  | 'billing.audit.view'
  | 'billing.compliance.export';

export interface RolePermissionMatrixModel {
  roles: Array<{ role: RoleType; label: string }>;
  permissions: Array<{ key: FinancePermissionKey; label: string; description: string }>;
  grants: Record<RoleType, Record<FinancePermissionKey, boolean>>;
  lastUpdatedAt: string | null;
  lastUpdatedByName: string | null;
}

export interface PermissionChange {
  role: RoleType;
  permissionKey: FinancePermissionKey;
  from: boolean;
  to: boolean;
  changedAt: string; // ISO
  changedByName: string;
  justification: string | null;
}

export type AuditEntityType =
  | 'invoice'
  | 'payment'
  | 'collection_rule'
  | 'template'
  | 'connector'
  | 'permission';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'status_change'
  | 'export'
  | 'login'
  | 'permission_change';

export interface AuditFilters {
  periodFrom: string | null;
  periodTo: string | null;
  userId: string | null;
  entityType: AuditEntityType | null;
  action: AuditAction | null;
  severity: AuditSeverity | null;
  query: string;
  page: number;
  pageSize: number;
}

export interface AuditEventDiff {
  field: string;
  before: unknown | null;
  after: unknown | null;
  isSensitive: boolean;
}

export interface AuditEvent {
  auditId: string;
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  severity: AuditSeverity;
  summary: string;
  actorUserId: string | null;
  actorName: string;
  actorIp: string | null;
  occurredAt: string; // ISO
  diffs: AuditEventDiff[];
}

export type ComplianceExportFormat = 'csv' | 'xlsx';
export type ComplianceExportJobStatus = 'queued' | 'processing' | 'done' | 'error';

export interface ComplianceExportRequest {
  format: ComplianceExportFormat;
  filters: AuditFilters;
  includeDiffs: boolean;
  maskSensitive: boolean;
  requestedByUserId: string | null;
}

export interface ComplianceExportJob {
  jobId: string;
  status: ComplianceExportJobStatus;
  requestedAt: string;
  finishedAt: string | null;
  fileName: string | null;
  downloadUrl: string | null;
  errorMessage: string | null;
  totalRows: number | null;
}

// ============================================================================
// PRODUCT CATALOG TYPES (EP11)
// ============================================================================

export type ProductCategory = 'license' | 'saas' | 'squad' | 'consulting' | 'support' | 'training';
export type PricingModel = 'per_user' | 'per_feature' | 'flat' | 'hourly' | 'per_squad' | 'tiered' | 'usage_based';
export type RecurrenceInterval = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'one_time';

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  category: ProductCategory;
  pricingModel: PricingModel;
  basePrice: number;
  currency: string;
  recurrence: RecurrenceInterval;
  isActive: boolean;
  marginPercent: number;
  costPrice: number;
  features: string[];
  tiers?: ProductTier[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductTier {
  name: string;
  minUnits: number;
  maxUnits: number | null;
  pricePerUnit: number;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory | '';
  pricingModel?: PricingModel | '';
  isActive?: boolean | null;
  recurrence?: RecurrenceInterval | '';
}

// ============================================================================
// PROPOSAL TYPES (EP12)
// ============================================================================

export type ProposalStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface ProposalLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  recurrence: RecurrenceInterval;
  notes?: string;
}

export interface Proposal {
  id: string;
  code: string;
  title: string;
  accountId: string;
  accountName: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealTitle?: string;
  ownerId: string;
  ownerName: string;
  status: ProposalStatus;
  lineItems: ProposalLineItem[];
  totalOneTime: number;
  totalMrr: number;
  totalArr: number;
  validUntil: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  respondedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalFilters {
  search?: string;
  status?: ProposalStatus | '';
  ownerId?: string;
  accountId?: string;
}

// ============================================================================
// CONTRACT TYPES (EP13)
// ============================================================================

export type ContractStatus = 'draft' | 'active' | 'expiring_soon' | 'expired' | 'renewed' | 'cancelled';
export type ContractType = 'new' | 'renewal' | 'amendment' | 'upsell';

export interface Contract {
  id: string;
  code: string;
  title: string;
  accountId: string;
  accountName: string;
  proposalId?: string;
  dealId?: string;
  ownerId: string;
  ownerName: string;
  type: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  renewalNoticeDays: number;
  mrr: number;
  totalContractValue: number;
  lineItems: ProposalLineItem[];
  signedAt?: string;
  signedByClient?: string;
  signedByUs?: string;
  parentContractId?: string;
  amendments: ContractAmendment[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractAmendment {
  id: string;
  description: string;
  mrrDelta: number;
  effectiveDate: string;
  createdAt: string;
}

export interface ContractFilters {
  search?: string;
  status?: ContractStatus | '';
  type?: ContractType | '';
  ownerId?: string;
  expiringWithinDays?: number;
}

// ============================================================================
// PROJECT / DELIVERY TYPES (EP14)
// ============================================================================

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';
export type ProjectHealthColor = 'green' | 'yellow' | 'red';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  accountId: string;
  accountName: string;
  contractId?: string;
  dealId?: string;
  ownerId: string;
  ownerName: string;
  status: ProjectStatus;
  health: ProjectHealthColor;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budget: number;
  spent: number;
  milestones: Milestone[];
  teamSize: number;
  methodology: 'scrum' | 'kanban' | 'waterfall' | 'hybrid';
  sprintCount?: number;
  currentSprint?: number;
  velocityAvg?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  dueDate: string;
  completedDate?: string;
  deliverables: string[];
  completionPercent: number;
  order: number;
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | '';
  health?: ProjectHealthColor | '';
  ownerId?: string;
  accountId?: string;
}

export interface ProjectSummaryKpis {
  totalProjects: number;
  activeProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  totalBudget: number;
  totalSpent: number;
  avgCompletion: number;
}

// ============================================================================
// INTEGRATIONS TYPES (EP15)
// ============================================================================

export type IntegrationStatus = 'connected' | 'disconnected' | 'error';
export type IntegrationType = 'slack' | 'teams' | 'webhook' | 'jira' | 'email';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  configuredAt?: string;
  configuredBy?: string;
  settings: Record<string, string>;
  events: IntegrationEvent[];
}

export interface IntegrationEvent {
  id: string;
  eventType: string;
  label: string;
  enabled: boolean;
  channel?: string;
}

// ============================================================================
// SSO / SAML TYPES (EP16)
// ============================================================================

export type SsoProtocol = 'saml' | 'oidc';
export type SsoStatus = 'active' | 'inactive' | 'testing';

export interface SsoConfig {
  id: string;
  protocol: SsoProtocol;
  status: SsoStatus;
  providerName: string;
  entityId: string;
  ssoUrl: string;
  certificate?: string;
  mappings: SsoAttributeMapping[];
  enforceForAllUsers: boolean;
  allowPasswordFallback: boolean;
  configuredAt: string;
  configuredBy: string;
  lastTestedAt?: string;
  lastTestResult?: 'success' | 'failure';
}

export interface SsoAttributeMapping {
  ssoAttribute: string;
  crmField: string;
}

// ============================================================================
// SAAS METRICS TYPES (EP09)
// ============================================================================

export interface SaasMetricsSnapshot {
  period: string;
  mrr: number;
  arr: number;
  mrrGrowthRate: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  netNewMrr: number;
  logoChurnRate: number;
  revenueChurnRate: number;
  netRevenueRetention: number;
  grossRevenueRetention: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  avgRevenuePerAccount: number;
  totalActiveAccounts: number;
  newAccounts: number;
  churnedAccounts: number;
}

export interface SaasMetricsTrend {
  month: string;
  mrr: number;
  arr: number;
  newMrr: number;
  churnedMrr: number;
  netNewMrr: number;
  logoChurnRate: number;
  revenueChurnRate: number;
  netRevenueRetention: number;
  activeAccounts: number;
}

export interface SaasDashboardData {
  current: SaasMetricsSnapshot;
  previous: SaasMetricsSnapshot;
  trend: SaasMetricsTrend[];
  generatedAt: string;
}

// ============================================================================
// CUSTOMER SUCCESS TYPES (EP10)
// ============================================================================

export type HealthScoreLevel = 'healthy' | 'attention' | 'at_risk' | 'critical';

export interface HealthScoreDimension {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  signals: HealthSignal[];
}

export interface HealthSignal {
  label: string;
  value: string;
  status: 'positive' | 'neutral' | 'negative';
}

export interface AccountHealthScore {
  accountId: string;
  accountName: string;
  accountTier: AccountTier;
  ownerId: string;
  ownerName: string;
  overallScore: number;
  level: HealthScoreLevel;
  dimensions: HealthScoreDimension[];
  mrr: number;
  contractEndDate: string;
  daysSinceLastContact: number;
  openTickets: number;
  npsScore: number | null;
  csatScore: number | null;
  lastNpsDate: string | null;
  riskFactors: string[];
  opportunities: string[];
  lastUpdatedAt: string;
}

export interface AccountHealthFilters {
  search?: string;
  level?: HealthScoreLevel | '';
  tier?: AccountTier | '';
  ownerId?: string;
  sortBy?: 'score_asc' | 'score_desc' | 'mrr_desc' | 'contract_end' | 'days_since_contact';
}

export interface CsOverviewData {
  totalAccounts: number;
  healthDistribution: Record<HealthScoreLevel, number>;
  avgHealthScore: number;
  accountsAtRisk: number;
  renewalsNext30Days: number;
  renewalsNext90Days: number;
  totalMrrAtRisk: number;
  avgNps: number | null;
  npsRespondents: number;
  recentAlerts: CsAlert[];
}

export interface CsAlert {
  id: string;
  accountId: string;
  accountName: string;
  type: 'churn_risk' | 'nps_drop' | 'no_contact' | 'ticket_spike' | 'contract_expiring' | 'usage_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface CsPlaybook {
  id: string;
  name: string;
  targetLevel: HealthScoreLevel;
  steps: CsPlaybookStep[];
  isActive: boolean;
}

export interface CsPlaybookStep {
  order: number;
  action: string;
  owner: 'csm' | 'sales' | 'support' | 'product';
  dueInDays: number;
}

export interface AccountHealthHistory {
  date: string;
  score: number;
  level: HealthScoreLevel;
  event?: string;
}

// -----------------------------
// Access Management (EP08)
// -----------------------------

export type AccessPermissionKey =
  | 'contacts.view'
  | 'contacts.create'
  | 'contacts.edit'
  | 'contacts.delete'
  | 'deals.view'
  | 'deals.create'
  | 'deals.edit'
  | 'deals.delete'
  | 'reports.view'
  | 'reports.export'
  | 'billing.view'
  | 'billing.manage'
  | 'iam.groups.manage'
  | 'iam.users.manage'
  | 'iam.audit.view'
  | 'iam.approvals.manage';

export interface AccessPermissionCatalogItem {
  key: AccessPermissionKey;
  label: string;
  description: string;
  module: string;
  isCritical: boolean;
}

export interface AccessGroup {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  permissionKeys: AccessPermissionKey[];
  membersCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface AccessGroupFilters {
  search: string | null;
  isActive: boolean | null;
  page: number;
  pageSize: number;
}

export interface AccessUserGroupMembership {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  groupId: string;
  groupName: string;
  addedAt: string;
  addedBy: string;
}

export interface DirectUserPermissionGrant {
  id: string;
  userId: string;
  permissionKey: AccessPermissionKey;
  permissionLabel: string;
  justification: string;
  grantedAt: string;
  grantedBy: string;
  expiresAt: string | null;
  isActive: boolean;
}

export type EffectivePermissionOrigin = 'direct' | 'group';
export type EffectivePermissionStatus = 'active' | 'expiring_soon' | 'expired';

export interface EffectiveUserPermission {
  permissionKey: AccessPermissionKey;
  permissionLabel: string;
  module: string;
  origin: EffectivePermissionOrigin;
  sourceId: string | null;
  sourceName: string;
  status: EffectivePermissionStatus;
  grantedAt: string;
  expiresAt: string | null;
  canRevoke: boolean;
}

export interface EffectiveAccessSummary {
  userId: string;
  groupsCount: number;
  inheritedPermissionsCount: number;
  directPermissionsCount: number;
  totalEffectivePermissions: number;
  conflictsCount: number;
  calculatedAt: string;
}

export interface AccessPermissionConflict {
  conflictId: string;
  userId: string;
  permissionKey: AccessPermissionKey;
  reason: string;
  sources: Array<{
    origin: EffectivePermissionOrigin;
    sourceName: string;
    grantedAt: string;
    expiresAt: string | null;
  }>;
  severity: 'low' | 'medium' | 'high';
}

export interface AccessSimulationResult {
  userId: string;
  currentPermissions: AccessPermissionKey[];
  projectedPermissions: AccessPermissionKey[];
  diff: {
    added: AccessPermissionKey[];
    removed: AccessPermissionKey[];
    unchanged: AccessPermissionKey[];
    criticalChanges: AccessPermissionKey[];
  };
}

export type AccessElevationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export interface AccessElevationRequest {
  requestId: string;
  userId: string;
  userName: string;
  permissionKey: AccessPermissionKey;
  permissionLabel: string;
  isCritical: boolean;
  justification: string;
  validFrom: string;
  validUntil: string;
  status: AccessElevationStatus;
  approverId: string | null;
  approverName: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  reviewObservation: string | null;
  canCancel: boolean;
}

export interface AccessAuditEvent {
  eventId: string;
  timestamp: string;
  actor: string;
  actorId: string;
  action: 'created' | 'updated' | 'deleted' | 'granted' | 'revoked' | 'approved' | 'rejected';
  entityType: 'user' | 'group' | 'permission' | 'request';
  entityId: string;
  entityName: string;
  details: string | null;
  ipAddress: string | null;
  severity: 'low' | 'medium' | 'high';
}

export interface AccessExportRecord {
  exportId: string;
  type: 'audit_trail' | 'users_by_group' | 'direct_permissions' | 'requests';
  format: 'pdf' | 'xlsx' | 'csv';
  status: 'processing' | 'completed' | 'expired' | 'failed';
  generatedAt: string;
  expiresAt: string;
  downloadUrl: string | null;
  sizeBytes: number | null;
  generatedBy: string;
}
