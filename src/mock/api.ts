// CRM B2B Tech Foursys - Mock API Service
// Simula chamadas HTTP com localStorage e delays realistas

import { mockData } from './data';
import type {
  Contact,
  Account,
  Deal,
  Activity,
  User,
  Pipeline,
  Stage,
  Lead,
  LeadFilters,
  LeadFormData,
  LeadScoreDetails,
  ConvertLeadPayload,
  ConvertLeadResult,
  LifecycleFunnel,
  LifecycleFunnelRequest,
  NurtureSequence,
  SequenceStep,
  SequenceTestRun,
  ExecutiveDashboardData,
  DashboardSegmentFilters,
  DashboardDrilldownResult,
  DashboardKpiMetric,
  ReportDefinition,
  ReportRunResult,
  ReportSchedule,
  ReportExecutionLog,
  ExportJob,
  BiConnectorStatus,
  Invoice,
  InvoiceStatus,
  InvoiceFormData,
  InvoiceListFilters,
  InvoiceListItem,
  RecurrenceRuleForm,
  RecurrencePreviewItem,
  CollectionRule,
  CollectionRuleFilters,
  TemplateModel,
  CollectionJob,
  CollectionJobFilters,
  ReceivablesFilters,
  ReceivablesKpi,
  ComparisonMetric,
  AgingFilters,
  AgingBucket,
  AgingDetailRow,
  ManualPaymentForm,
  PartialPaymentInput,
  AllocationEntry,
  RemainingBalance,
  HistoryFilters,
  InvoiceHistoryEvent,
  ConnectorViewModel,
  ConnectorCredentials,
  ConnectionTestResult,
  PaymentLinkRequest,
  PaymentLinkResponse,
  LinkStatus,
  WebhookEventFilters,
  WebhookEvent,
  WebhookPayloadView,
  RolePermissionMatrixModel,
  PermissionChange,
  AuditFilters,
  AuditEvent,
  ComplianceExportRequest,
  ComplianceExportJob,
  AccessPermissionCatalogItem,
  AccessGroup,
  AccessGroupFilters,
  AccessUserGroupMembership,
  DirectUserPermissionGrant,
  EffectiveUserPermission,
  EffectiveAccessSummary,
  AccessPermissionConflict,
  AccessSimulationResult,
  AccessElevationRequest,
  AccessAuditEvent,
  AccessExportRecord,
  AccessPermissionKey,
  PaginatedResponse,
  ListFilters,
  ApiResponse,
  ContactFormData,
  AccountFormData,
  DealFormData,
  SaasDashboardData,
  AccountHealthScore,
  AccountHealthFilters,
  AccountHealthHistory,
  CsOverviewData,
  CsAlert,
  CsPlaybook,
  Product,
  ProductFilters,
  Proposal,
  ProposalFilters,
  Contract,
  ContractFilters,
  Project,
  ProjectFilters,
  ProjectSummaryKpis,
  Integration,
  SsoConfig,
} from '../types';

// ============================================================================
// HELPERS
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Simula erro de rede
const shouldSimulateError = (errorRate: number = 0.05): boolean => {
  return Math.random() < errorRate;
};

// ============================================================================
// LOCAL STORAGE MANAGEMENT
// ============================================================================

class MockStorage {
  private static KEYS = {
    CONTACTS: 'crm_mock_contacts',
    ACCOUNTS: 'crm_mock_accounts',
    DEALS: 'crm_mock_deals',
    ACTIVITIES: 'crm_mock_activities',
    LEADS: 'crm_mock_leads',
    LEAD_SCORE_DETAILS: 'crm_mock_lead_score_details',
    NURTURE_SEQUENCES: 'crm_mock_nurture_sequences',
    NURTURE_TEST_RUNS: 'crm_mock_nurture_test_runs',
    REPORTS: 'crm_mock_reports',
    REPORT_SCHEDULES: 'crm_mock_report_schedules',
    REPORT_EXEC_LOGS: 'crm_mock_report_execution_logs',
    EXPORT_JOBS: 'crm_mock_export_jobs',
    BI_CONNECTORS: 'crm_mock_bi_connectors',
    INVOICES: 'crm_mock_invoices',
    RECURRENCE_RULES: 'crm_mock_invoice_recurrence_rules',
    COLLECTION_RULES: 'crm_mock_collection_rules',
    COLLECTION_TEMPLATES: 'crm_mock_collection_templates',
    COLLECTION_JOBS: 'crm_mock_collection_jobs',
    ALLOCATIONS: 'crm_mock_invoice_allocations',
    INVOICE_HISTORY: 'crm_mock_invoice_history_events',
    PAYMENT_CONNECTORS: 'crm_mock_payment_connectors',
    PAYMENT_LINKS: 'crm_mock_payment_links',
    WEBHOOK_EVENTS: 'crm_mock_webhook_events',
    WEBHOOK_PAYLOADS: 'crm_mock_webhook_payloads',
    ROLE_PERMISSION_MATRIX: 'crm_mock_role_permission_matrix',
    PERMISSION_CHANGES: 'crm_mock_permission_changes',
    AUDIT_EVENTS: 'crm_mock_audit_events',
    COMPLIANCE_EXPORT_JOBS: 'crm_mock_compliance_export_jobs',
    ACCESS_PERMISSION_CATALOG: 'crm_mock_access_permission_catalog',
    ACCESS_GROUPS: 'crm_mock_access_groups',
    ACCESS_USER_GROUPS: 'crm_mock_access_user_groups',
    ACCESS_DIRECT_GRANTS: 'crm_mock_access_direct_grants',
    ACCESS_EFFECTIVE_SUMMARY: 'crm_mock_access_effective_summary',
    ACCESS_EFFECTIVE_PERMISSIONS: 'crm_mock_access_effective_permissions',
    ACCESS_CONFLICTS: 'crm_mock_access_conflicts',
    ACCESS_ELEVATION_REQUESTS: 'crm_mock_access_elevation_requests',
    ACCESS_AUDIT_EVENTS: 'crm_mock_access_audit_events',
    ACCESS_EXPORT_HISTORY: 'crm_mock_access_export_history',
  };

  static getContacts(): Contact[] {
    const stored = localStorage.getItem(this.KEYS.CONTACTS);
    return stored ? JSON.parse(stored) : mockData.contacts;
  }

  static setContacts(contacts: Contact[]): void {
    localStorage.setItem(this.KEYS.CONTACTS, JSON.stringify(contacts));
  }

  static getAccounts(): Account[] {
    const stored = localStorage.getItem(this.KEYS.ACCOUNTS);
    return stored ? JSON.parse(stored) : mockData.accounts;
  }

  static setAccounts(accounts: Account[]): void {
    localStorage.setItem(this.KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  static getDeals(): Deal[] {
    const stored = localStorage.getItem(this.KEYS.DEALS);
    if (stored) {
      const parsed = JSON.parse(stored) as Deal[];
      // Reset automático se o cache tem menos deals que o mock atual (atualização de dados)
      if (parsed.length < mockData.deals.length * 0.8) {
        localStorage.removeItem(this.KEYS.DEALS);
        return mockData.deals;
      }
      return parsed;
    }
    return mockData.deals;
  }

  static setDeals(deals: Deal[]): void {
    localStorage.setItem(this.KEYS.DEALS, JSON.stringify(deals));
  }

  static getLeads(): Lead[] {
    const stored = localStorage.getItem(this.KEYS.LEADS);
    return stored ? JSON.parse(stored) : mockData.leads;
  }

  static setLeads(leads: Lead[]): void {
    localStorage.setItem(this.KEYS.LEADS, JSON.stringify(leads));
  }

  static getLeadScoreDetails(): Record<string, LeadScoreDetails> {
    const stored = localStorage.getItem(this.KEYS.LEAD_SCORE_DETAILS);
    return stored ? JSON.parse(stored) : mockData.leadScoreDetails;
  }

  static setLeadScoreDetails(scoreDetails: Record<string, LeadScoreDetails>): void {
    localStorage.setItem(this.KEYS.LEAD_SCORE_DETAILS, JSON.stringify(scoreDetails));
  }

  static getNurtureSequences(): NurtureSequence[] {
    const stored = localStorage.getItem(this.KEYS.NURTURE_SEQUENCES);
    return stored ? JSON.parse(stored) : mockData.nurtureSequences;
  }

  static setNurtureSequences(sequences: NurtureSequence[]): void {
    localStorage.setItem(this.KEYS.NURTURE_SEQUENCES, JSON.stringify(sequences));
  }

  static getNurtureTestRuns(): SequenceTestRun[] {
    const stored = localStorage.getItem(this.KEYS.NURTURE_TEST_RUNS);
    return stored ? JSON.parse(stored) : [];
  }

  static setNurtureTestRuns(runs: SequenceTestRun[]): void {
    localStorage.setItem(this.KEYS.NURTURE_TEST_RUNS, JSON.stringify(runs));
  }

  static getReports(): ReportDefinition[] {
    const stored = localStorage.getItem(this.KEYS.REPORTS);
    return stored ? JSON.parse(stored) : mockData.savedReports;
  }

  static setReports(reports: ReportDefinition[]): void {
    localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(reports));
  }

  static getReportSchedules(): ReportSchedule[] {
    const stored = localStorage.getItem(this.KEYS.REPORT_SCHEDULES);
    return stored ? JSON.parse(stored) : mockData.reportSchedules;
  }

  static setReportSchedules(schedules: ReportSchedule[]): void {
    localStorage.setItem(this.KEYS.REPORT_SCHEDULES, JSON.stringify(schedules));
  }

  static getReportExecutionLogs(): ReportExecutionLog[] {
    const stored = localStorage.getItem(this.KEYS.REPORT_EXEC_LOGS);
    return stored ? JSON.parse(stored) : mockData.reportExecutionLogs;
  }

  static setReportExecutionLogs(logs: ReportExecutionLog[]): void {
    localStorage.setItem(this.KEYS.REPORT_EXEC_LOGS, JSON.stringify(logs));
  }

  static getExportJobs(): ExportJob[] {
    const stored = localStorage.getItem(this.KEYS.EXPORT_JOBS);
    return stored ? JSON.parse(stored) : mockData.exportJobs;
  }

  static setExportJobs(jobs: ExportJob[]): void {
    localStorage.setItem(this.KEYS.EXPORT_JOBS, JSON.stringify(jobs));
  }

  static getBiConnectors(): BiConnectorStatus[] {
    const stored = localStorage.getItem(this.KEYS.BI_CONNECTORS);
    return stored ? JSON.parse(stored) : mockData.biConnectors;
  }

  static setBiConnectors(connectors: BiConnectorStatus[]): void {
    localStorage.setItem(this.KEYS.BI_CONNECTORS, JSON.stringify(connectors));
  }

  static reset(): void {
    localStorage.removeItem(this.KEYS.CONTACTS);
    localStorage.removeItem(this.KEYS.ACCOUNTS);
    localStorage.removeItem(this.KEYS.DEALS);
    localStorage.removeItem(this.KEYS.ACTIVITIES);
    localStorage.removeItem(this.KEYS.LEADS);
    localStorage.removeItem(this.KEYS.LEAD_SCORE_DETAILS);
    localStorage.removeItem(this.KEYS.NURTURE_SEQUENCES);
    localStorage.removeItem(this.KEYS.NURTURE_TEST_RUNS);
    localStorage.removeItem(this.KEYS.REPORTS);
    localStorage.removeItem(this.KEYS.REPORT_SCHEDULES);
    localStorage.removeItem(this.KEYS.REPORT_EXEC_LOGS);
    localStorage.removeItem(this.KEYS.EXPORT_JOBS);
    localStorage.removeItem(this.KEYS.BI_CONNECTORS);
    localStorage.removeItem(this.KEYS.INVOICES);
    localStorage.removeItem(this.KEYS.RECURRENCE_RULES);
    localStorage.removeItem(this.KEYS.COLLECTION_RULES);
    localStorage.removeItem(this.KEYS.COLLECTION_TEMPLATES);
    localStorage.removeItem(this.KEYS.COLLECTION_JOBS);
    localStorage.removeItem(this.KEYS.ALLOCATIONS);
    localStorage.removeItem(this.KEYS.INVOICE_HISTORY);
    localStorage.removeItem(this.KEYS.PAYMENT_CONNECTORS);
    localStorage.removeItem(this.KEYS.PAYMENT_LINKS);
    localStorage.removeItem(this.KEYS.WEBHOOK_EVENTS);
    localStorage.removeItem(this.KEYS.WEBHOOK_PAYLOADS);
    localStorage.removeItem(this.KEYS.ROLE_PERMISSION_MATRIX);
    localStorage.removeItem(this.KEYS.PERMISSION_CHANGES);
    localStorage.removeItem(this.KEYS.AUDIT_EVENTS);
    localStorage.removeItem(this.KEYS.COMPLIANCE_EXPORT_JOBS);
    localStorage.removeItem(this.KEYS.ACCESS_PERMISSION_CATALOG);
    localStorage.removeItem(this.KEYS.ACCESS_GROUPS);
    localStorage.removeItem(this.KEYS.ACCESS_USER_GROUPS);
    localStorage.removeItem(this.KEYS.ACCESS_DIRECT_GRANTS);
    localStorage.removeItem(this.KEYS.ACCESS_EFFECTIVE_SUMMARY);
    localStorage.removeItem(this.KEYS.ACCESS_EFFECTIVE_PERMISSIONS);
    localStorage.removeItem(this.KEYS.ACCESS_CONFLICTS);
    localStorage.removeItem(this.KEYS.ACCESS_ELEVATION_REQUESTS);
    localStorage.removeItem(this.KEYS.ACCESS_AUDIT_EVENTS);
    localStorage.removeItem(this.KEYS.ACCESS_EXPORT_HISTORY);
  }

  static getInvoices(): Invoice[] {
    const stored = localStorage.getItem(this.KEYS.INVOICES);
    return stored ? JSON.parse(stored) : (mockData as any).invoices;
  }

  static setInvoices(invoices: Invoice[]): void {
    localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(invoices));
  }

  static getRecurrenceRules(): RecurrenceRuleForm[] {
    const stored = localStorage.getItem(this.KEYS.RECURRENCE_RULES);
    return stored ? JSON.parse(stored) : [];
  }

  static setRecurrenceRules(rules: RecurrenceRuleForm[]): void {
    localStorage.setItem(this.KEYS.RECURRENCE_RULES, JSON.stringify(rules));
  }

  static getCollectionRules(): CollectionRule[] {
    const stored = localStorage.getItem(this.KEYS.COLLECTION_RULES);
    return stored ? JSON.parse(stored) : (mockData as any).collectionRules;
  }

  static setCollectionRules(rules: CollectionRule[]): void {
    localStorage.setItem(this.KEYS.COLLECTION_RULES, JSON.stringify(rules));
  }

  static getCollectionTemplates(): TemplateModel[] {
    const stored = localStorage.getItem(this.KEYS.COLLECTION_TEMPLATES);
    return stored ? JSON.parse(stored) : (mockData as any).collectionTemplates;
  }

  static setCollectionTemplates(templates: TemplateModel[]): void {
    localStorage.setItem(this.KEYS.COLLECTION_TEMPLATES, JSON.stringify(templates));
  }

  static getCollectionJobs(): CollectionJob[] {
    const stored = localStorage.getItem(this.KEYS.COLLECTION_JOBS);
    return stored ? JSON.parse(stored) : (mockData as any).collectionJobs;
  }

  static setCollectionJobs(jobs: CollectionJob[]): void {
    localStorage.setItem(this.KEYS.COLLECTION_JOBS, JSON.stringify(jobs));
  }

  static getAllocations(): AllocationEntry[] {
    const stored = localStorage.getItem(this.KEYS.ALLOCATIONS);
    return stored ? JSON.parse(stored) : (mockData as any).allocations;
  }

  static setAllocations(rows: AllocationEntry[]): void {
    localStorage.setItem(this.KEYS.ALLOCATIONS, JSON.stringify(rows));
  }

  static getInvoiceHistoryEvents(): InvoiceHistoryEvent[] {
    const stored = localStorage.getItem(this.KEYS.INVOICE_HISTORY);
    return stored ? JSON.parse(stored) : (mockData as any).invoiceHistoryEvents;
  }

  static setInvoiceHistoryEvents(rows: InvoiceHistoryEvent[]): void {
    localStorage.setItem(this.KEYS.INVOICE_HISTORY, JSON.stringify(rows));
  }

  static getPaymentConnectors(): ConnectorViewModel[] {
    const stored = localStorage.getItem(this.KEYS.PAYMENT_CONNECTORS);
    return stored ? JSON.parse(stored) : (mockData as any).paymentConnectors;
  }

  static setPaymentConnectors(connectors: ConnectorViewModel[]): void {
    localStorage.setItem(this.KEYS.PAYMENT_CONNECTORS, JSON.stringify(connectors));
  }

  static getPaymentLinks(): PaymentLinkResponse[] {
    const stored = localStorage.getItem(this.KEYS.PAYMENT_LINKS);
    return stored ? JSON.parse(stored) : [];
  }

  static setPaymentLinks(links: PaymentLinkResponse[]): void {
    localStorage.setItem(this.KEYS.PAYMENT_LINKS, JSON.stringify(links));
  }

  static getWebhookEvents(): WebhookEvent[] {
    const stored = localStorage.getItem(this.KEYS.WEBHOOK_EVENTS);
    return stored ? JSON.parse(stored) : [];
  }

  static setWebhookEvents(events: WebhookEvent[]): void {
    localStorage.setItem(this.KEYS.WEBHOOK_EVENTS, JSON.stringify(events));
  }

  static getWebhookPayloads(): Record<string, WebhookPayloadView> {
    const stored = localStorage.getItem(this.KEYS.WEBHOOK_PAYLOADS);
    return stored ? JSON.parse(stored) : {};
  }

  static setWebhookPayloads(payloads: Record<string, WebhookPayloadView>): void {
    localStorage.setItem(this.KEYS.WEBHOOK_PAYLOADS, JSON.stringify(payloads));
  }

  static getRolePermissionMatrix(): RolePermissionMatrixModel {
    const stored = localStorage.getItem(this.KEYS.ROLE_PERMISSION_MATRIX);
    return stored ? JSON.parse(stored) : (mockData as any).rolePermissionMatrix;
  }

  static setRolePermissionMatrix(matrix: RolePermissionMatrixModel): void {
    localStorage.setItem(this.KEYS.ROLE_PERMISSION_MATRIX, JSON.stringify(matrix));
  }

  static getPermissionChanges(): PermissionChange[] {
    const stored = localStorage.getItem(this.KEYS.PERMISSION_CHANGES);
    return stored ? JSON.parse(stored) : [];
  }

  static setPermissionChanges(rows: PermissionChange[]): void {
    localStorage.setItem(this.KEYS.PERMISSION_CHANGES, JSON.stringify(rows));
  }

  static getAuditEvents(): AuditEvent[] {
    const stored = localStorage.getItem(this.KEYS.AUDIT_EVENTS);
    return stored ? JSON.parse(stored) : (mockData as any).auditEvents;
  }

  static setAuditEvents(rows: AuditEvent[]): void {
    localStorage.setItem(this.KEYS.AUDIT_EVENTS, JSON.stringify(rows));
  }

  static getComplianceExportJobs(): ComplianceExportJob[] {
    const stored = localStorage.getItem(this.KEYS.COMPLIANCE_EXPORT_JOBS);
    return stored ? JSON.parse(stored) : (mockData as any).complianceExportJobs;
  }

  static setComplianceExportJobs(rows: ComplianceExportJob[]): void {
    localStorage.setItem(this.KEYS.COMPLIANCE_EXPORT_JOBS, JSON.stringify(rows));
  }

  static getAccessPermissionCatalog(): AccessPermissionCatalogItem[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_PERMISSION_CATALOG);
    return stored ? JSON.parse(stored) : (mockData as any).accessPermissionCatalog;
  }

  static setAccessPermissionCatalog(rows: AccessPermissionCatalogItem[]): void {
    localStorage.setItem(this.KEYS.ACCESS_PERMISSION_CATALOG, JSON.stringify(rows));
  }

  static getAccessGroups(): AccessGroup[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_GROUPS);
    return stored ? JSON.parse(stored) : (mockData as any).accessGroups;
  }

  static setAccessGroups(rows: AccessGroup[]): void {
    localStorage.setItem(this.KEYS.ACCESS_GROUPS, JSON.stringify(rows));
  }

  static getAccessUserGroups(): AccessUserGroupMembership[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_USER_GROUPS);
    return stored ? JSON.parse(stored) : (mockData as any).accessUserGroupMemberships;
  }

  static setAccessUserGroups(rows: AccessUserGroupMembership[]): void {
    localStorage.setItem(this.KEYS.ACCESS_USER_GROUPS, JSON.stringify(rows));
  }

  static getAccessDirectGrants(): DirectUserPermissionGrant[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_DIRECT_GRANTS);
    return stored ? JSON.parse(stored) : (mockData as any).directUserPermissionGrants;
  }

  static setAccessDirectGrants(rows: DirectUserPermissionGrant[]): void {
    localStorage.setItem(this.KEYS.ACCESS_DIRECT_GRANTS, JSON.stringify(rows));
  }

  static getAccessEffectiveSummary(): EffectiveAccessSummary[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_EFFECTIVE_SUMMARY);
    return stored ? JSON.parse(stored) : (mockData as any).effectiveAccessSummaryByUser;
  }

  static setAccessEffectiveSummary(rows: EffectiveAccessSummary[]): void {
    localStorage.setItem(this.KEYS.ACCESS_EFFECTIVE_SUMMARY, JSON.stringify(rows));
  }

  static getAccessEffectivePermissions(): EffectiveUserPermission[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_EFFECTIVE_PERMISSIONS);
    return stored ? JSON.parse(stored) : (mockData as any).effectivePermissions;
  }

  static setAccessEffectivePermissions(rows: EffectiveUserPermission[]): void {
    localStorage.setItem(this.KEYS.ACCESS_EFFECTIVE_PERMISSIONS, JSON.stringify(rows));
  }

  static getAccessConflicts(): AccessPermissionConflict[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_CONFLICTS);
    return stored ? JSON.parse(stored) : (mockData as any).accessPermissionConflicts;
  }

  static setAccessConflicts(rows: AccessPermissionConflict[]): void {
    localStorage.setItem(this.KEYS.ACCESS_CONFLICTS, JSON.stringify(rows));
  }

  static getAccessElevationRequests(): AccessElevationRequest[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_ELEVATION_REQUESTS);
    return stored ? JSON.parse(stored) : (mockData as any).accessElevationRequests;
  }

  static setAccessElevationRequests(rows: AccessElevationRequest[]): void {
    localStorage.setItem(this.KEYS.ACCESS_ELEVATION_REQUESTS, JSON.stringify(rows));
  }

  static getAccessAuditEvents(): AccessAuditEvent[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_AUDIT_EVENTS);
    return stored ? JSON.parse(stored) : (mockData as any).accessAuditEvents;
  }

  static setAccessAuditEvents(rows: AccessAuditEvent[]): void {
    localStorage.setItem(this.KEYS.ACCESS_AUDIT_EVENTS, JSON.stringify(rows));
  }

  static getAccessExportHistory(): AccessExportRecord[] {
    const stored = localStorage.getItem(this.KEYS.ACCESS_EXPORT_HISTORY);
    return stored ? JSON.parse(stored) : (mockData as any).accessExportHistory;
  }

  static setAccessExportHistory(rows: AccessExportRecord[]): void {
    localStorage.setItem(this.KEYS.ACCESS_EXPORT_HISTORY, JSON.stringify(rows));
  }

  static getActivities(): Activity[] {
    const stored = localStorage.getItem(this.KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : mockData.activities;
  }

  static setActivities(activities: Activity[]): void {
    localStorage.setItem(this.KEYS.ACTIVITIES, JSON.stringify(activities));
  }
}

// ============================================================================
// CONTACTS API
// ============================================================================

export const contactsApi = {
  // Lista contatos com filtros e paginação
  async list(
    filters: ListFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Contact>>> {
    await delay(300); // Simula latência de rede

    if (shouldSimulateError()) {
      throw new Error('Erro ao carregar contatos');
    }

    let contacts = MockStorage.getContacts();

    // Aplicar filtros
    if (filters.search) {
      const search = filters.search.toLowerCase();
      contacts = contacts.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.jobTitle?.toLowerCase().includes(search)
      );
    }

    if (filters.lifecycleStage && filters.lifecycleStage.length > 0) {
      contacts = contacts.filter((c) =>
        filters.lifecycleStage!.includes(c.lifecycleStage)
      );
    }

    if (filters.leadScoreMin !== undefined) {
      contacts = contacts.filter((c) => c.leadScore >= filters.leadScoreMin!);
    }

    if (filters.leadScoreMax !== undefined) {
      contacts = contacts.filter((c) => c.leadScore <= filters.leadScoreMax!);
    }

    if (filters.ownerId && filters.ownerId.length > 0) {
      contacts = contacts.filter((c) => filters.ownerId!.includes(c.ownerId));
    }

    if (filters.tags && filters.tags.length > 0) {
      contacts = contacts.filter((c) =>
        filters.tags!.some((tag) => c.tags.includes(tag))
      );
    }

    // Paginação
    const total = contacts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedContacts = contacts.slice(start, end);

    return {
      isSuccess: true,
      data: {
        data: paginatedContacts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      message: 'Contatos carregados com sucesso',
    };
  },

  // Buscar contato por ID
  async getById(id: string): Promise<ApiResponse<Contact>> {
    await delay(200);

    const contacts = MockStorage.getContacts();
    const contact = contacts.find((c) => c.id === id);

    if (!contact) {
      throw new Error('Contato não encontrado');
    }

    return {
      isSuccess: true,
      data: contact,
      message: 'Contato encontrado',
    };
  },

  async listByAccount(accountId: string): Promise<ApiResponse<Contact[]>> {
    await delay(200);
    const contacts = MockStorage.getContacts().filter(
      (c) => !c.deletedAt && c.accountId === accountId
    );
    return {
      isSuccess: true,
      data: contacts,
      message: 'Contatos por conta carregados',
    };
  },

  // Criar contato
  async create(data: ContactFormData): Promise<ApiResponse<Contact>> {
    await delay(500);

    const contacts = MockStorage.getContacts();
    const accounts = MockStorage.getAccounts();
    const users = mockData.users;

    // Verificar email duplicado
    if (contacts.some((c) => c.email === data.email)) {
      throw new Error('Email já cadastrado no sistema');
    }

    const account = data.accountId
      ? accounts.find((a) => a.id === data.accountId)
      : undefined;

    const owner = users.find((u) => u.id === data.ownerId);

    const contactCodeNum = contacts.length + 1;
    const contactCode = `CON-${String(contactCodeNum).padStart(4, '0')}`;

    // Derive legacy accountId/jobTitle from companyLinks if present
    const activeLink = (data.companyLinks || []).find((l) => l.isActive);
    const resolvedAccountId = activeLink?.accountId || data.accountId;
    const resolvedAccount = resolvedAccountId
      ? accounts.find((a) => a.id === resolvedAccountId)
      : account;

    const newContact: Contact = {
      id: generateId(),
      contactCode,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      mobilePhone: data.mobilePhone,
      linkedin: data.linkedin,
      avatar: data.avatar,
      birthDate: data.birthDate,
      address: data.address,
      companyLinks: data.companyLinks || [],
      jobTitle: activeLink?.jobTitle || data.jobTitle,
      department: activeLink?.department || data.department,
      accountId: resolvedAccountId,
      account: resolvedAccount,
      ownerId: data.ownerId || users[0].id,
      owner: owner || users[0],
      lifecycleStage: data.lifecycleStage || 'lead',
      leadScore: 0,
      leadSource: data.leadSource,
      tags: data.tags || [],
      customFields: data.customFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contacts.push(newContact);
    MockStorage.setContacts(contacts);

    return {
      isSuccess: true,
      data: newContact,
      message: 'Contato criado com sucesso',
    };
  },

  // Atualizar contato
  async update(
    id: string,
    data: Partial<ContactFormData>
  ): Promise<ApiResponse<Contact>> {
    await delay(500);

    const contacts = MockStorage.getContacts();
    const accounts = MockStorage.getAccounts();
    const users = mockData.users;
    const index = contacts.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error('Contato não encontrado');
    }

    // Verificar email duplicado (exceto o próprio contato)
    if (data.email && data.email !== contacts[index].email) {
      if (contacts.some((c) => c.id !== id && c.email === data.email)) {
        throw new Error('Email já cadastrado no sistema');
      }
    }

    // Derive active company link for legacy fields
    const activeLink = (data.companyLinks || contacts[index].companyLinks || []).find((l) => l.isActive);
      const resolvedAccountId = activeLink?.accountId || (data.accountId ?? contacts[index].accountId);

    const updatedContact: Contact = {
      ...contacts[index],
      ...data,
      companyLinks: data.companyLinks !== undefined ? data.companyLinks : contacts[index].companyLinks,
      jobTitle: activeLink?.jobTitle ?? (data.jobTitle !== undefined ? data.jobTitle : contacts[index].jobTitle),
      department: activeLink?.department ?? (data.department !== undefined ? data.department : contacts[index].department),
      accountId: resolvedAccountId,
      account:
        resolvedAccountId !== undefined
          ? accounts.find((a) => a.id === resolvedAccountId)
          : contacts[index].account,
      owner:
        data.ownerId !== undefined
          ? users.find((u) => u.id === data.ownerId)
          : contacts[index].owner,
      fullName:
        data.firstName || data.lastName
          ? `${data.firstName || contacts[index].firstName} ${
              data.lastName || contacts[index].lastName
            }`
          : contacts[index].fullName,
      updatedAt: new Date().toISOString(),
    };

    contacts[index] = updatedContact;
    MockStorage.setContacts(contacts);

    return {
      isSuccess: true,
      data: updatedContact,
      message: 'Contato atualizado com sucesso',
    };
  },

  // Deletar contato (soft delete)
  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300);

    const contacts = MockStorage.getContacts();
    const index = contacts.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error('Contato não encontrado');
    }

    contacts[index].deletedAt = new Date().toISOString();
    MockStorage.setContacts(contacts);

    return {
      isSuccess: true,
      message: 'Contato deletado com sucesso',
    };
  },

  // Deletar múltiplos contatos
  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    await delay(500);

    const contacts = MockStorage.getContacts();
    const now = new Date().toISOString();

    ids.forEach((id) => {
      const index = contacts.findIndex((c) => c.id === id);
      if (index !== -1) {
        contacts[index].deletedAt = now;
      }
    });

    MockStorage.setContacts(contacts);

    return {
      isSuccess: true,
      message: `${ids.length} contatos deletados com sucesso`,
    };
  },
};

// ============================================================================
// ACCOUNTS API
// ============================================================================

export const accountsApi = {
  async list(): Promise<ApiResponse<Account[]>> {
    await delay(200);
    return {
      isSuccess: true,
      data: MockStorage.getAccounts(),
      message: 'Contas carregadas com sucesso',
    };
  },

  async getById(id: string): Promise<ApiResponse<Account>> {
    await delay(200);
    const accounts = MockStorage.getAccounts();
    const account = accounts.find((a) => a.id === id);

    if (!account) {
      throw new Error('Conta não encontrada');
    }

    return {
      isSuccess: true,
      data: account,
      message: 'Conta encontrada',
    };
  },

  async search(query: string): Promise<ApiResponse<Account[]>> {
    await delay(150);
    const accounts = MockStorage.getAccounts();
    const search = query.toLowerCase();

    const filtered = accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.domain?.toLowerCase().includes(search)
    );

    return {
      isSuccess: true,
      data: filtered,
      message: 'Busca realizada',
    };
  },

  async create(data: AccountFormData): Promise<ApiResponse<Account>> {
    await delay(250);

    if (!data.name?.trim()) {
      throw new Error('Nome da conta é obrigatório');
    }

    const accounts = MockStorage.getAccounts();
    const users = mockData.users;
    const owner = users.find((user) => user.id === data.ownerId) || users[0];
    const nowIso = new Date().toISOString();

    const clientCodeNum = accounts.length + 1;
    const clientCode = `CLI-${String(clientCodeNum).padStart(4, '0')}`;

    const createdAccount: Account = {
      id: generateId(),
      clientCode,
      name: data.name.trim(),
      legalName: data.legalName?.trim() || data.name.trim(),
      tradeName: data.tradeName?.trim() || undefined,
      cnpj: data.cnpj?.trim() || undefined,
      domain: data.domain?.trim() || undefined,
      emailDomain: data.emailDomain?.trim() || undefined,
      website: data.website?.trim() || undefined,
      linkedin: data.linkedin?.trim() || undefined,
      emailGroup: data.emailGroup?.trim() || undefined,
      industry: data.industry?.trim() || undefined,
      segment: data.segment || undefined,
      accountStatus: data.accountStatus || 'prospection',
      numberOfEmployees: data.numberOfEmployees,
      annualRevenue: data.annualRevenue,
      address: data.address,
      branches: data.branches,
      billingConditions: data.billingConditions,
      tier: data.tier || 'SMB',
      icpScore: 60,
      targetAccount: Boolean(data.targetAccount),
      ownerId: owner.id,
      owner,
      customFields: data.customFields,
      createdAt: nowIso,
      updatedAt: nowIso,
      contactCount: 0,
      openDealsCount: 0,
      totalDealsValue: 0,
    };

    accounts.unshift(createdAccount);
    MockStorage.setAccounts(accounts);

    return {
      isSuccess: true,
      data: createdAccount,
      message: 'Conta criada com sucesso',
    };
  },
};

// ============================================================================
// DEALS API
// ============================================================================

export const dealsApi = {
  async list(): Promise<ApiResponse<Deal[]>> {
    await delay(300);
    return {
      isSuccess: true,
      data: MockStorage.getDeals(),
      message: 'Deals carregados com sucesso',
    };
  },

  async getById(id: string): Promise<ApiResponse<Deal>> {
    await delay(200);
    const deals = MockStorage.getDeals();
    const deal = deals.find((d) => d.id === id);

    if (!deal) {
      throw new Error('Deal não encontrado');
    }

    return {
      isSuccess: true,
      data: deal,
      message: 'Deal encontrado',
    };
  },
  async listByContact(contactId: string): Promise<ApiResponse<Deal[]>> {
    await delay(200);
    const deals = MockStorage.getDeals().filter(
      (d) => d.primaryContactId === contactId
    );
    return {
      isSuccess: true,
      data: deals,
      message: 'Deals por contato carregados',
    };
  },

  async create(data: DealFormData & {
    parentDealId?: string;
    parentDealTitle?: string;
    relationType?: import('../types').DealRelationType;
    recurrenceNumber?: number;
    additiveNumber?: number;
  }): Promise<ApiResponse<Deal>> {
    await delay(350);

    const deals = MockStorage.getDeals();
    const accounts = MockStorage.getAccounts();
    const contacts = MockStorage.getContacts();
    const stages = mockData.stages;
    const pipelines = mockData.pipelines;
    const users = mockData.users;

    const stage = stages.find((s) => s.id === data.stageId);
    if (!stage) {
      throw new Error('Estágio não encontrado');
    }

    const account = accounts.find((a) => a.id === data.accountId);
    const primaryContact = data.primaryContactId
      ? contacts.find((c) => c.id === data.primaryContactId)
      : undefined;
    const owner = users.find((u) => u.id === data.ownerId);
    const pipeline = pipelines.find((p) => p.id === data.pipelineId);

    // Generate dealCode: P{year}{4-digit sequential per year}
    const year = new Date().getFullYear();
    const yearDeals = deals.filter((d) => d.dealCode?.startsWith(`P${year}`));
    const seq = String(yearDeals.length + 1).padStart(4, '0');
    const dealCode = `P${year}${seq}`;

    const amount = Number(data.amount) || 0;
    const newDeal: Deal = {
      id: generateId(),
      dealCode,
      title: data.title,
      description: data.description,
      amount,
      probability: stage.probability,
      weightedAmount: (amount * stage.probability) / 100,
      expectedCloseDate: data.expectedCloseDate,
      pipelineId: data.pipelineId,
      pipeline,
      stageId: data.stageId,
      stage,
      accountId: data.accountId,
      account,
      primaryContactId: data.primaryContactId,
      primaryContact,
      ownerId: data.ownerId || users[0].id,
      owner: owner || users[0],
      createdBy: users[0]?.id,
      status: 'open',
      portfolioItems: data.portfolioItems,
      businessUnit: data.businessUnit,
      dealSource: data.dealSource,
      referral: data.referral,
      deliveryModel: data.deliveryModel,
      allocationQty: data.allocationQty,
      allocationTerm: data.allocationTerm,
      allocationHours: data.allocationHours,
      parentDealId: data.parentDealId,
      parentDealTitle: data.parentDealTitle,
      relationType: data.relationType,
      recurrenceNumber: data.recurrenceNumber,
      additiveNumber: data.additiveNumber,
      tags: data.tags || [],
      customFields: data.customFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    deals.push(newDeal);
    MockStorage.setDeals(deals);

    return {
      isSuccess: true,
      data: newDeal,
      message: 'Deal criado com sucesso',
    };
  },

  async update(id: string, data: Partial<DealFormData>): Promise<ApiResponse<Deal>> {
    await delay(300);
    const deals = MockStorage.getDeals();
    const index = deals.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('Deal não encontrado');
    }

    const stages = mockData.stages;
    const accounts = MockStorage.getAccounts();
    const contacts = MockStorage.getContacts();
    const users = mockData.users;

    const stage = data.stageId
      ? stages.find((s) => s.id === data.stageId)
      : deals[index].stage;
    if (!stage) {
      throw new Error('Estágio não encontrado');
    }

    const amount = data.amount !== undefined ? Number(data.amount) : deals[index].amount;
    const account = data.accountId
      ? accounts.find((a) => a.id === data.accountId)
      : deals[index].account;
    const primaryContact =
      data.primaryContactId !== undefined
        ? contacts.find((c) => c.id === data.primaryContactId)
        : deals[index].primaryContact;
    const owner = data.ownerId
      ? users.find((u) => u.id === data.ownerId)
      : deals[index].owner;

    const nowIso = new Date().toISOString();
    const isClosing =
      (data as Partial<Deal>).status === 'won' || (data as Partial<Deal>).status === 'lost';
    const updatedDeal: Deal = {
      ...deals[index],
      ...data,
      stageId: stage.id,
      stage,
      amount,
      account,
      primaryContact,
      owner,
      probability: stage.probability,
      weightedAmount: (amount * stage.probability) / 100,
      closedAt: isClosing && !deals[index].closedAt ? nowIso : deals[index].closedAt,
      updatedAt: nowIso,
    };

    deals[index] = updatedDeal;
    MockStorage.setDeals(deals);

    return {
      isSuccess: true,
      data: updatedDeal,
      message: 'Deal atualizado com sucesso',
    };
  },

  async moveToStage(dealId: string, stageId: string): Promise<ApiResponse<Deal>> {
    await delay(200);
    const deals = MockStorage.getDeals();
    const dealIndex = deals.findIndex((d) => d.id === dealId);
    if (dealIndex === -1) {
      throw new Error('Deal não encontrado');
    }

    const stage = mockData.stages.find((s) => s.id === stageId);
    if (!stage) {
      throw new Error('Estágio não encontrado');
    }

    const previousDeal = deals[dealIndex];
    const updatedDeal: Deal = {
      ...previousDeal,
      stageId: stage.id,
      stage,
      probability: stage.probability,
      weightedAmount: (previousDeal.amount * stage.probability) / 100,
      updatedAt: new Date().toISOString(),
    };

    deals[dealIndex] = updatedDeal;
    MockStorage.setDeals(deals);

    const activities = MockStorage.getActivities();
    const stageChangeActivity: Activity = {
      id: generateId(),
      type: 'stage_change',
      subject: `Deal movido: ${previousDeal.stage?.name || 'Stage'} -> ${stage.name}`,
      description: `Movimentado no pipeline para ${stage.name}`,
      relatedDealId: updatedDeal.id,
      relatedAccountId: updatedDeal.accountId,
      relatedContactId: updatedDeal.primaryContactId,
      userId: updatedDeal.ownerId,
      user: updatedDeal.owner,
      activityDate: new Date().toISOString(),
      isSystemGenerated: true,
      metadata: {
        from_stage: previousDeal.stage?.name,
        to_stage: stage.name,
        from_probability: previousDeal.probability,
        to_probability: stage.probability,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    activities.push(stageChangeActivity);
    MockStorage.setActivities(activities);

    return {
      isSuccess: true,
      data: updatedDeal,
      message: 'Deal movido com sucesso',
    };
  },

  async setStatus(
    dealId: string,
    status: 'open' | 'won' | 'lost',
    lostReason?: string
  ): Promise<ApiResponse<Deal>> {
    await delay(220);
    const deals = MockStorage.getDeals();
    const dealIndex = deals.findIndex((d) => d.id === dealId);
    if (dealIndex === -1) {
      throw new Error('Deal não encontrado');
    }

    const nowIso = new Date().toISOString();
    const previousDeal = deals[dealIndex];

    // Move deal to the "Perdido" stage when marking as lost
    const perdidoStage = mockData.stages.find((s) => s.name === 'Perdido');
    const openStage = mockData.stages.find((s) => s.name !== 'Perdido' && s.name !== 'Vencido');
    const stageId =
      status === 'lost' && perdidoStage ? perdidoStage.id :
      status === 'open' && previousDeal.stageId === perdidoStage?.id && openStage ? openStage.id :
      previousDeal.stageId;
    const stage =
      status === 'lost' && perdidoStage ? perdidoStage :
      status === 'open' && previousDeal.stageId === perdidoStage?.id && openStage ? openStage :
      previousDeal.stage;

    const updatedDeal: Deal = {
      ...previousDeal,
      status,
      stageId,
      stage,
      lostReason: status === 'lost' ? lostReason : undefined,
      actualCloseDate: status === 'open' ? undefined : nowIso,
      closedAt: status !== 'open' && !previousDeal.closedAt ? nowIso : (status === 'open' ? undefined : previousDeal.closedAt),
      updatedAt: nowIso,
    };
    deals[dealIndex] = updatedDeal;
    MockStorage.setDeals(deals);

    const activities = MockStorage.getActivities();
    const statusActivity: Activity = {
      id: generateId(),
      type: status === 'won' ? 'deal_won' : status === 'lost' ? 'deal_lost' : 'status_change',
      subject:
        status === 'won'
          ? `Deal marcado como ganho: ${updatedDeal.title}`
          : status === 'lost'
          ? `Deal marcado como perdido: ${updatedDeal.title}`
          : `Deal reaberto: ${updatedDeal.title}`,
      description:
        status === 'lost' && lostReason
          ? `Motivo da perda: ${lostReason}`
          : 'Status atualizado no detalhe do deal',
      relatedDealId: updatedDeal.id,
      relatedAccountId: updatedDeal.accountId,
      relatedContactId: updatedDeal.primaryContactId,
      userId: updatedDeal.ownerId,
      user: updatedDeal.owner,
      activityDate: nowIso,
      isSystemGenerated: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    activities.push(statusActivity);
    MockStorage.setActivities(activities);

    return {
      isSuccess: true,
      data: updatedDeal,
      message: 'Status do deal atualizado',
    };
  },
};

export const activitiesApi = {
  async list(): Promise<ApiResponse<Activity[]>> {
    await delay(200);
    return {
      isSuccess: true,
      data: MockStorage.getActivities(),
      message: 'Atividades carregadas',
    };
  },

  async listByContact(contactId: string): Promise<ApiResponse<Activity[]>> {
    await delay(200);
    const activities = MockStorage.getActivities().filter(
      (a) => a.relatedContactId === contactId
    );
    return {
      isSuccess: true,
      data: activities,
      message: 'Atividades por contato carregadas',
    };
  },

  async listByDeal(dealId: string): Promise<ApiResponse<Activity[]>> {
    await delay(200);
    const activities = MockStorage.getActivities().filter(
      (a) => a.relatedDealId === dealId
    );
    return {
      isSuccess: true,
      data: activities,
      message: 'Atividades por deal carregadas',
    };
  },

  async create(
    data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'activityDate'> & {
      activityDate?: string;
    }
  ): Promise<ApiResponse<Activity>> {
    await delay(160);
    const nowIso = new Date().toISOString();
    const activity: Activity = {
      ...data,
      id: generateId(),
      activityDate: data.activityDate || nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const activities = MockStorage.getActivities();
    activities.push(activity);
    MockStorage.setActivities(activities);
    return {
      isSuccess: true,
      data: activity,
      message: 'Atividade criada com sucesso',
    };
  },
};

// ============================================================================
// LEADS API (EP03)
// ============================================================================

const classifyLeadScore = (score: number): LeadScoreDetails['classification'] => {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
};

export const leadsApi = {
  async list(
    filters: LeadFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Lead>>> {
    await delay(260);
    let leads = MockStorage.getLeads();

    if (filters.search) {
      const search = filters.search.toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.company?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      leads = leads.filter((lead) => lead.status === filters.status);
    }

    if (filters.source) {
      leads = leads.filter((lead) => lead.source === filters.source);
    }

    if (filters.lifecycle) {
      leads = leads.filter((lead) => lead.lifecycle === filters.lifecycle);
    }

    if (filters.ownerId) {
      leads = leads.filter((lead) => lead.ownerId === filters.ownerId);
    }

    if (filters.scoreMin !== undefined) {
      leads = leads.filter((lead) => lead.leadScore >= filters.scoreMin!);
    }

    if (filters.scoreMax !== undefined) {
      leads = leads.filter((lead) => lead.leadScore <= filters.scoreMax!);
    }

    const total = leads.length;
    const start = (page - 1) * limit;
    const data = leads.slice(start, start + limit);

    return {
      isSuccess: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<Lead>> {
    await delay(140);
    const lead = MockStorage.getLeads().find((item) => item.id === id);
    if (!lead) {
      throw new Error('Lead não encontrado');
    }
    return { isSuccess: true, data: lead };
  },

  async create(payload: LeadFormData): Promise<ApiResponse<Lead>> {
    await delay(320);
    const leads = MockStorage.getLeads();
    if (leads.some((lead) => lead.email === payload.email)) {
      throw new Error('Email de lead já cadastrado');
    }
    const owner = mockData.users.find((user) => user.id === payload.ownerId) || mockData.users[0];
    const nowIso = new Date().toISOString();
    const lead: Lead = {
      id: generateId(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      jobTitle: payload.jobTitle,
      source: payload.source,
      status: payload.status,
      leadScore: 0,
      lifecycle: payload.lifecycle,
      ownerId: owner.id,
      owner,
      tags: payload.tags || [],
      customFields: payload.customFields || {},
      isConverted: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    leads.unshift(lead);
    MockStorage.setLeads(leads);
    return { isSuccess: true, data: lead, message: 'Lead criado com sucesso' };
  },

  async update(id: string, payload: Partial<LeadFormData>): Promise<ApiResponse<Lead>> {
    await delay(260);
    const leads = MockStorage.getLeads();
    const index = leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error('Lead não encontrado');
    }
    if (leads[index].isConverted) {
      throw new Error('Lead convertido não pode ser editado');
    }
    if (
      payload.email &&
      payload.email !== leads[index].email &&
      leads.some((lead) => lead.id !== id && lead.email === payload.email)
    ) {
      throw new Error('Email de lead já cadastrado');
    }

    const owner =
      payload.ownerId !== undefined
        ? mockData.users.find((user) => user.id === payload.ownerId)
        : leads[index].owner;

    const updatedLead: Lead = {
      ...leads[index],
      ...payload,
      fullName:
        payload.firstName || payload.lastName
          ? `${payload.firstName || leads[index].firstName} ${
              payload.lastName || leads[index].lastName
            }`
          : leads[index].fullName,
      ownerId: payload.ownerId || leads[index].ownerId,
      owner: owner || leads[index].owner,
      updatedAt: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    MockStorage.setLeads(leads);
    return { isSuccess: true, data: updatedLead, message: 'Lead atualizado com sucesso' };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(180);
    const leads = MockStorage.getLeads();
    const index = leads.findIndex((lead) => lead.id === id);
    if (index === -1) {
      throw new Error('Lead não encontrado');
    }
    leads.splice(index, 1);
    MockStorage.setLeads(leads);
    return { isSuccess: true, message: 'Lead removido com sucesso' };
  },

  async getScoreDetails(leadId: string): Promise<ApiResponse<LeadScoreDetails>> {
    await delay(120);
    const scoreDetailsMap = MockStorage.getLeadScoreDetails();
    const lead = MockStorage.getLeads().find((item) => item.id === leadId);
    if (!lead) {
      throw new Error('Lead não encontrado');
    }
    const details = scoreDetailsMap[leadId];
    if (details) {
      return { isSuccess: true, data: details };
    }
    const fallback: LeadScoreDetails = {
      total: lead.leadScore,
      classification: classifyLeadScore(lead.leadScore),
      breakdown: {
        demographicFit: { score: Math.min(lead.leadScore, 50), maxScore: 50, factors: [] },
        behavioralEngagement: {
          score: Math.max(0, lead.leadScore - 50),
          maxScore: 50,
          factors: [],
        },
      },
      triggers: [],
      lastCalculatedAt: lead.updatedAt,
    };
    return { isSuccess: true, data: fallback };
  },

  async recalculateScore(leadId: string): Promise<ApiResponse<LeadScoreDetails>> {
    await delay(280);
    const leads = MockStorage.getLeads();
    const scoreDetailsMap = MockStorage.getLeadScoreDetails();
    const index = leads.findIndex((item) => item.id === leadId);
    if (index === -1) {
      throw new Error('Lead não encontrado');
    }
    const variation = Math.floor(Math.random() * 11) - 5;
    const nextScore = Math.max(0, Math.min(100, leads[index].leadScore + variation));
    leads[index] = {
      ...leads[index],
      leadScore: nextScore,
      updatedAt: new Date().toISOString(),
    };
    MockStorage.setLeads(leads);

    const currentDetails = scoreDetailsMap[leadId];
    const updatedDetails: LeadScoreDetails = {
      ...(currentDetails || {
        total: nextScore,
        classification: classifyLeadScore(nextScore),
        breakdown: {
          demographicFit: { score: Math.min(nextScore, 50), maxScore: 50, factors: [] },
          behavioralEngagement: {
            score: Math.max(0, nextScore - 50),
            maxScore: 50,
            factors: [],
          },
        },
        triggers: [],
        lastCalculatedAt: leads[index].updatedAt,
      }),
      total: nextScore,
      classification: classifyLeadScore(nextScore),
      lastCalculatedAt: leads[index].updatedAt,
    };
    scoreDetailsMap[leadId] = updatedDetails;
    MockStorage.setLeadScoreDetails(scoreDetailsMap);

    return { isSuccess: true, data: updatedDetails, message: 'Score recalculado com sucesso' };
  },

  async convert(payload: ConvertLeadPayload): Promise<ApiResponse<ConvertLeadResult>> {
    await delay(400);
    const leads = MockStorage.getLeads();
    const leadIndex = leads.findIndex((item) => item.id === payload.leadId);
    if (leadIndex === -1) {
      throw new Error('Lead não encontrado');
    }
    const lead = leads[leadIndex];
    if (lead.isConverted) {
      throw new Error('Lead já convertido');
    }

    const users = mockData.users;
    const owner = users.find((user) => user.id === payload.ownerId) || users[0];

    const accounts = MockStorage.getAccounts();
    let accountId: string | undefined;
    let accountName: string | undefined;
    if (payload.createAccount) {
      const nextAccount = {
        id: generateId(),
        name: payload.accountName || lead.company || `${lead.fullName} Company`,
        legalName: payload.accountName || lead.company || `${lead.fullName} Company`,
        domain: undefined,
        website: undefined,
        industry: 'Tecnologia',
        tier: 'SMB' as const,
        icpScore: Math.min(100, lead.leadScore),
        targetAccount: lead.leadScore >= 70,
        ownerId: owner.id,
        owner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      accounts.push(nextAccount);
      MockStorage.setAccounts(accounts);
      accountId = nextAccount.id;
      accountName = nextAccount.name;
    }

    const contacts = MockStorage.getContacts();
    const newContact: Contact = {
      id: generateId(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      accountId,
      account: accountId ? accounts.find((item) => item.id === accountId) : undefined,
      ownerId: owner.id,
      owner,
      lifecycleStage: payload.lifecycleStage,
      leadScore: lead.leadScore,
      leadSource: lead.source,
      tags: [...lead.tags],
      customFields: { ...lead.customFields, migratedFromLeadId: lead.id },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contacts.push(newContact);
    MockStorage.setContacts(contacts);

    let dealId: string | undefined;
    if (payload.createDeal) {
      const deals = MockStorage.getDeals();
      const stages = mockData.stages;
      const defaultStage = stages[0];
      if (defaultStage) {
        const deal: Deal = {
          id: generateId(),
          title: payload.createDeal.name,
          amount: payload.createDeal.amount,
          probability: defaultStage.probability,
          weightedAmount: (payload.createDeal.amount * defaultStage.probability) / 100,
          pipelineId: payload.createDeal.pipelineId,
          pipeline: mockData.pipelines.find((p) => p.id === payload.createDeal!.pipelineId),
          stageId: defaultStage.id,
          stage: defaultStage,
          accountId: accountId || accounts[0].id,
          account:
            (accountId && accounts.find((item) => item.id === accountId)) || accounts[0] || undefined,
          primaryContactId: newContact.id,
          primaryContact: newContact,
          ownerId: owner.id,
          owner,
          status: 'open',
          tags: ['Lead Conversion', ...lead.tags].slice(0, 6),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        deals.push(deal);
        MockStorage.setDeals(deals);
        dealId = deal.id;
      }
    }

    leads[leadIndex] = {
      ...lead,
      status: 'converted',
      isConverted: true,
      convertedToContactId: newContact.id,
      convertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: owner.id,
      owner,
    };
    MockStorage.setLeads(leads);

    const activities = MockStorage.getActivities();
    const conversionActivity: Activity = {
      id: generateId(),
      type: 'contact_created',
      subject: `Lead convertido: ${lead.fullName}`,
      description: `Lead convertido para contato${accountName ? ` na conta ${accountName}` : ''}.`,
      relatedContactId: newContact.id,
      relatedAccountId: accountId,
      relatedDealId: dealId,
      userId: owner.id,
      user: owner,
      activityDate: new Date().toISOString(),
      isSystemGenerated: true,
      metadata: {
        leadId: lead.id,
        transferredTags: lead.tags,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    activities.push(conversionActivity);
    MockStorage.setActivities(activities);

    return {
      isSuccess: true,
      data: {
        contactId: newContact.id,
        accountId,
        dealId,
        activitiesTransferred: 1,
      },
      message: 'Lead convertido com sucesso',
    };
  },

  async getLifecycleFunnel(request: LifecycleFunnelRequest): Promise<ApiResponse<LifecycleFunnel>> {
    await delay(180);
    const from = request.period === 'custom_range' ? request.customRange?.from : undefined;
    const to = request.period === 'custom_range' ? request.customRange?.to : undefined;
    const funnel =
      request.period === 'custom_range' && from && to
        ? {
            ...mockData.lifecycleFunnel,
            period: { from, to },
          }
        : mockData.lifecycleFunnel;
    return {
      isSuccess: true,
      data: funnel,
      message: 'Funil de lifecycle carregado',
    };
  },
};

export const nurtureSequencesApi = {
  async list(): Promise<ApiResponse<NurtureSequence[]>> {
    await delay(180);
    return {
      isSuccess: true,
      data: MockStorage.getNurtureSequences(),
      message: 'Sequências carregadas',
    };
  },

  async getById(id: string): Promise<ApiResponse<NurtureSequence>> {
    await delay(140);
    const sequence = MockStorage.getNurtureSequences().find((item) => item.id === id);
    if (!sequence) {
      throw new Error('Sequência não encontrada');
    }
    return {
      isSuccess: true,
      data: sequence,
      message: 'Sequência encontrada',
    };
  },

  async save(sequence: NurtureSequence): Promise<ApiResponse<NurtureSequence>> {
    await delay(260);
    const sequences = MockStorage.getNurtureSequences();
    const index = sequences.findIndex((item) => item.id === sequence.id);
    const normalizedSteps: SequenceStep[] = sequence.steps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    const payload: NurtureSequence = {
      ...sequence,
      steps: normalizedSteps,
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) {
      sequences[index] = payload;
    } else {
      sequences.unshift(payload);
    }
    MockStorage.setNurtureSequences(sequences);
    return {
      isSuccess: true,
      data: payload,
      message: 'Sequência salva com sucesso',
    };
  },

  async create(name: string): Promise<ApiResponse<NurtureSequence>> {
    await delay(220);
    const nowIso = new Date().toISOString();
    const newSequence: NurtureSequence = {
      id: generateId(),
      name,
      isActive: false,
      enrollmentTrigger: {
        type: 'manual',
        config: {},
      },
      stopConditions: [{ type: 'converted', config: {} }],
      steps: [
        {
          id: generateId(),
          order: 1,
          type: 'email',
          delayDays: 0,
          delayHours: 0,
          emailSubject: 'Primeiro email de nutrição',
        },
      ],
      stats: {
        enrollments: 0,
        active: 0,
        completed: 0,
        unsubscribed: 0,
        conversions: 0,
        overallConversionRate: 0,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const sequences = MockStorage.getNurtureSequences();
    sequences.unshift(newSequence);
    MockStorage.setNurtureSequences(sequences);
    return {
      isSuccess: true,
      data: newSequence,
      message: 'Sequência criada com sucesso',
    };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(180);
    const sequences = MockStorage.getNurtureSequences();
    const index = sequences.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Sequência não encontrada');
    }
    sequences.splice(index, 1);
    MockStorage.setNurtureSequences(sequences);
    return { isSuccess: true, message: 'Sequência removida' };
  },

  async listTestRuns(sequenceId: string): Promise<ApiResponse<SequenceTestRun[]>> {
    await delay(120);
    const runs = MockStorage.getNurtureTestRuns()
      .filter((run) => run.sequenceId === sequenceId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return {
      isSuccess: true,
      data: runs,
      message: 'Histórico de testes carregado',
    };
  },

  async testSequence(id: string): Promise<ApiResponse<{ ok: true; run: SequenceTestRun }>> {
    await delay(160);
    const sequence = MockStorage.getNurtureSequences().find((item) => item.id === id);
    if (!sequence) {
      throw new Error('Sequência não encontrada');
    }
    const statusPool: Array<SequenceTestRun['status']> = ['queued', 'sent', 'delivered'];
    const status = statusPool[Math.floor(Math.random() * statusPool.length)];
    const run: SequenceTestRun = {
      id: generateId(),
      sequenceId: id,
      startedAt: new Date().toISOString(),
      status,
      message:
        status === 'delivered'
          ? 'Disparo concluído com sucesso em ambiente de teste.'
          : status === 'sent'
          ? 'Disparo enviado; aguardando confirmação de entrega.'
          : 'Teste enfileirado para processamento.',
    };
    const runs = MockStorage.getNurtureTestRuns();
    runs.unshift(run);
    MockStorage.setNurtureTestRuns(runs.slice(0, 25));

    return {
      isSuccess: true,
      data: { ok: true, run },
      message: `Teste da sequência "${sequence.name}" disparado`,
    };
  },
};

// ============================================================================
// ANALYTICS, REPORTS E EXPORTS API (EP06)
// ============================================================================

const formatCurrencyBr = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

const normalizeDashboardFilters = (
  filters: Partial<DashboardSegmentFilters> = {}
): DashboardSegmentFilters => ({
  datePreset: filters.datePreset || 'this_quarter',
  dateFrom: filters.dateFrom,
  dateTo: filters.dateTo,
  team: filters.team,
  pipelineId: filters.pipelineId,
  ownerId: filters.ownerId,
  compareTo: filters.compareTo || 'previous_period',
  compareFrom: filters.compareFrom,
  compareToDate: filters.compareToDate,
});

const applyDealFilters = (deals: Deal[], filters: DashboardSegmentFilters): Deal[] =>
  deals.filter((deal) => {
    if (filters.pipelineId && deal.pipelineId !== filters.pipelineId) return false;
    if (filters.ownerId && deal.ownerId !== filters.ownerId) return false;
    return true;
  });

export const analyticsApi = {
  async getExecutiveDashboard(
    incomingFilters: Partial<DashboardSegmentFilters> = {}
  ): Promise<ApiResponse<ExecutiveDashboardData>> {
    await delay(180);
    const filters = normalizeDashboardFilters(incomingFilters);
    const allDeals = MockStorage.getDeals();
    const deals = applyDealFilters(allDeals, filters);
    const openDeals = deals.filter((deal) => deal.status === 'open');
    const wonDeals = deals.filter((deal) => deal.status === 'won');
    const lostDeals = deals.filter((deal) => deal.status === 'lost');
    const leads = MockStorage.getLeads();

    const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const forecastValue = openDeals.reduce((sum, deal) => sum + deal.weightedAmount, 0);
    const winRate = wonDeals.length + lostDeals.length === 0 ? 0 : (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100;
    const avgDealSize = deals.length === 0 ? 0 : deals.reduce((sum, deal) => sum + deal.amount, 0) / deals.length;
    const leadsGenerated = leads.length;

    const kpis: DashboardKpiMetric[] = [
      {
        key: 'pipeline_value',
        label: 'Pipeline Value',
        value: pipelineValue,
        formattedValue: formatCurrencyBr(pipelineValue),
        comparisonValue: 12.4,
        comparisonLabel: 'vs período anterior',
        trend: 'up' as const,
        segmentKey: 'pipeline_value',
      },
      {
        key: 'forecast_month',
        label: 'Forecast (mês)',
        value: forecastValue,
        formattedValue: formatCurrencyBr(forecastValue),
        comparisonValue: 8.1,
        comparisonLabel: 'vs período anterior',
        trend: 'up' as const,
        segmentKey: 'forecast_month',
      },
      {
        key: 'win_rate',
        label: 'Win Rate',
        value: winRate,
        formattedValue: `${winRate.toFixed(1)}%`,
        comparisonValue: -1.8,
        comparisonLabel: 'pp vs período anterior',
        trend: winRate >= 35 ? 'up' : 'down',
        segmentKey: 'win_rate',
      },
      {
        key: 'avg_deal_size',
        label: 'Ticket Médio',
        value: avgDealSize,
        formattedValue: formatCurrencyBr(avgDealSize),
        comparisonValue: 5.2,
        comparisonLabel: 'vs período anterior',
        trend: 'up' as const,
        segmentKey: 'avg_deal_size',
      },
      {
        key: 'leads_generated',
        label: 'Leads Gerados',
        value: leadsGenerated,
        formattedValue: String(leadsGenerated),
        comparisonValue: 6.7,
        comparisonLabel: 'vs período anterior',
        trend: 'up' as const,
        segmentKey: 'leads_generated',
      },
    ];

    const stageMap = new Map<string, { label: string; value: number }>();
    openDeals.forEach((deal) => {
      const label = deal.stage?.name || 'Sem estágio';
      const current = stageMap.get(label) || { label, value: 0 };
      current.value += deal.amount;
      stageMap.set(label, current);
    });

    const ownerMap = new Map<string, number>();
    wonDeals.forEach((deal) => {
      const label = deal.owner?.fullName || 'Sem owner';
      ownerMap.set(label, (ownerMap.get(label) || 0) + 1);
    });

    const sourceMap = new Map<string, number>();
    leads.forEach((lead) => {
      sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
    });

    const charts = [
      {
        id: 'pipeline_by_stage',
        label: 'Pipeline por estágio',
        type: 'bar' as const,
        points: Array.from(stageMap.values()).map((item) => ({
          label: item.label,
          value: item.value,
          comparisonValue: item.value * 0.9,
          segmentKey: `stage:${item.label}`,
        })),
      },
      {
        id: 'revenue_trend',
        label: 'Tendência de receita',
        type: 'line' as const,
        points: [
          { label: 'Out', value: 420000, comparisonValue: 390000 },
          { label: 'Nov', value: 460000, comparisonValue: 410000 },
          { label: 'Dez', value: 510000, comparisonValue: 460000 },
          { label: 'Jan', value: 540000, comparisonValue: 520000 },
          { label: 'Fev', value: 590000, comparisonValue: 560000 },
        ],
      },
      {
        id: 'win_rate_by_rep',
        label: 'Win rate por vendedor',
        type: 'bar' as const,
        points: Array.from(ownerMap.entries()).map(([label, value]) => ({
          label,
          value,
          comparisonValue: Math.max(0, value - 1),
          segmentKey: `owner:${label}`,
        })),
      },
      {
        id: 'lead_sources',
        label: 'Origem de leads',
        type: 'pie' as const,
        points: Array.from(sourceMap.entries()).map(([label, value]) => ({
          label,
          value,
          segmentKey: `source:${label}`,
        })),
      },
    ];

    const topPerformers = mockData.users
      .filter((user) => user.role === 'sales' || user.role === 'manager')
      .map((user) => ({
        userId: user.id,
        name: user.fullName,
        wins: wonDeals.filter((deal) => deal.ownerId === user.id).length,
        revenue: wonDeals
          .filter((deal) => deal.ownerId === user.id)
          .reduce((sum, deal) => sum + deal.amount, 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      isSuccess: true,
      data: {
        generatedAt: new Date().toISOString(),
        filters,
        kpis,
        charts,
        topPerformers,
        insights: {
          summary: ['Receita em crescimento no período atual.', 'Pipeline saudável com foco em negociação.'],
          varianceHighlights: [
            'Win rate caiu 1.8pp no período comparado.',
            'Leads gerados aumentaram 6.7%.',
          ],
        },
      },
    };
  },

  async getDrilldown(
    metricKey: string,
    filters: Partial<DashboardSegmentFilters> = {}
  ): Promise<ApiResponse<DashboardDrilldownResult>> {
    await delay(120);
    const normalized = normalizeDashboardFilters(filters);
    const deals = applyDealFilters(MockStorage.getDeals(), normalized);
    const records = deals.slice(0, 50).map((deal) => ({
      id: deal.id,
      title: deal.title,
      subtitle: deal.account?.name,
      amount: deal.amount,
      ownerName: deal.owner?.fullName,
      stageName: deal.stage?.name,
      status: deal.status,
      createdAt: deal.createdAt,
    }));
    return {
      isSuccess: true,
      data: {
        path: ['Dashboard', metricKey],
        metricKey,
        records,
      },
    };
  },
};

export const reportsApi = {
  async templates(): Promise<ApiResponse<ReportDefinition[]>> {
    await delay(140);
    return { isSuccess: true, data: mockData.reportTemplates };
  },

  async list(): Promise<ApiResponse<ReportDefinition[]>> {
    await delay(140);
    return { isSuccess: true, data: MockStorage.getReports() };
  },

  async getById(reportId: string): Promise<ApiResponse<ReportDefinition>> {
    await delay(120);
    const allReports = [...mockData.reportTemplates, ...MockStorage.getReports()];
    const report = allReports.find((item) => item.id === reportId);
    if (!report) throw new Error('Relatório não encontrado');
    return { isSuccess: true, data: report };
  },

  async save(report: Omit<ReportDefinition, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<ApiResponse<ReportDefinition>> {
    await delay(190);
    const reports = MockStorage.getReports();
    const nowIso = new Date().toISOString();
    if (report.id) {
      const index = reports.findIndex((item) => item.id === report.id);
      if (index === -1) throw new Error('Relatório não encontrado');
      const updated: ReportDefinition = {
        ...reports[index],
        ...report,
        updatedAt: nowIso,
      };
      reports[index] = updated;
      MockStorage.setReports(reports);
      return { isSuccess: true, data: updated, message: 'Relatório atualizado' };
    }
    const created: ReportDefinition = {
      ...report,
      id: generateId(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    reports.unshift(created);
    MockStorage.setReports(reports);
    return { isSuccess: true, data: created, message: 'Relatório criado' };
  },

  async remove(reportId: string): Promise<ApiResponse<void>> {
    await delay(120);
    const reports = MockStorage.getReports();
    const index = reports.findIndex((item) => item.id === reportId);
    if (index === -1) throw new Error('Relatório não encontrado');
    reports.splice(index, 1);
    MockStorage.setReports(reports);
    return { isSuccess: true, message: 'Relatório removido' };
  },

  async run(reportId: string): Promise<ApiResponse<ReportRunResult>> {
    await delay(220);
    const report = [...mockData.reportTemplates, ...MockStorage.getReports()].find(
      (item) => item.id === reportId
    );
    if (!report) throw new Error('Relatório não encontrado');

    let rows: Array<Record<string, unknown>> = [];
    if (report.dataSource === 'deals') {
      rows = MockStorage.getDeals().map((deal) => ({
        id: deal.id,
        title: deal.title,
        owner: deal.owner?.fullName || 'Sem owner',
        amount: deal.amount,
        stage: deal.stage?.name || 'Sem estágio',
        status: deal.status,
      }));
    } else if (report.dataSource === 'leads') {
      rows = MockStorage.getLeads().map((lead) => ({
        id: lead.id,
        fullName: lead.fullName,
        source: lead.source,
        score: lead.leadScore,
        status: lead.status,
      }));
    } else if (report.dataSource === 'contacts') {
      rows = MockStorage.getContacts().map((contact) => ({
        id: contact.id,
        fullName: contact.fullName,
        email: contact.email,
        lifecycleStage: contact.lifecycleStage,
        owner: contact.owner?.fullName || 'Sem owner',
      }));
    } else if (report.dataSource === 'activities') {
      rows = MockStorage.getActivities().map((activity) => ({
        id: activity.id,
        type: activity.type,
        subject: activity.subject,
        date: activity.activityDate,
      }));
    } else {
      rows = MockStorage.getAccounts().map((account) => ({
        id: account.id,
        name: account.name,
        industry: account.industry,
        tier: account.tier,
      }));
    }

    const totals = rows.reduce<{ totalAmount: number; totalRows: number }>(
      (acc, row) => {
        const amount = Number(row.amount || 0);
        acc.totalAmount += amount;
        acc.totalRows += 1;
        return acc;
      },
      { totalAmount: 0, totalRows: 0 }
    );

    return {
      isSuccess: true,
      data: {
        reportId,
        generatedAt: new Date().toISOString(),
        rows: rows.slice(0, 200),
        totals,
        chart: {
          id: 'report_overview',
          label: report.name,
          type: 'bar',
          points: [
            { label: 'Registros', value: totals.totalRows },
            { label: 'Valor Total', value: totals.totalAmount },
          ],
        },
      },
    };
  },
};

export const reportSchedulesApi = {
  async list(): Promise<ApiResponse<ReportSchedule[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getReportSchedules() };
  },

  async save(schedule: Omit<ReportSchedule, 'id' | 'nextRunAt'> & { id?: string }): Promise<ApiResponse<ReportSchedule>> {
    await delay(180);
    const schedules = MockStorage.getReportSchedules();
    const nowIso = new Date().toISOString();
    const payload: ReportSchedule = {
      ...schedule,
      id: schedule.id || generateId(),
      nextRunAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    };
    const index = schedules.findIndex((item) => item.id === payload.id);
    if (index >= 0) schedules[index] = payload;
    else schedules.unshift(payload);
    MockStorage.setReportSchedules(schedules);

    const logs = MockStorage.getReportExecutionLogs();
    logs.unshift({
      id: generateId(),
      scheduleId: payload.id,
      reportId: payload.reportId,
      executedAt: nowIso,
      status: 'success',
      recipients: payload.recipients,
      message: 'Agendamento salvo e execução inicial simulada.',
    });
    MockStorage.setReportExecutionLogs(logs.slice(0, 100));
    return { isSuccess: true, data: payload };
  },

  async remove(scheduleId: string): Promise<ApiResponse<void>> {
    await delay(120);
    const schedules = MockStorage.getReportSchedules().filter((item) => item.id !== scheduleId);
    MockStorage.setReportSchedules(schedules);
    return { isSuccess: true, message: 'Agendamento removido' };
  },

  async logs(): Promise<ApiResponse<ReportExecutionLog[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getReportExecutionLogs() };
  },
};

export const exportsApi = {
  async listJobs(): Promise<ApiResponse<ExportJob[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getExportJobs() };
  },

  async requestJob(
    payload: Pick<ExportJob, 'entity' | 'format' | 'records' | 'requestedBy'>
  ): Promise<ApiResponse<ExportJob>> {
    await delay(170);
    const jobs = MockStorage.getExportJobs();
    const isLarge = payload.records > 10000;
    const job: ExportJob = {
      id: generateId(),
      entity: payload.entity,
      format: payload.format,
      status: isLarge ? 'processing' : 'done',
      records: payload.records,
      requestedBy: payload.requestedBy,
      requestedAt: new Date().toISOString(),
      downloadUrl: isLarge ? undefined : `/downloads/exports/${payload.entity}-${Date.now()}.${payload.format}`,
    };
    jobs.unshift(job);
    MockStorage.setExportJobs(jobs.slice(0, 100));
    return { isSuccess: true, data: job, message: 'Exportação solicitada' };
  },
};

export const biConnectorsApi = {
  async list(): Promise<ApiResponse<BiConnectorStatus[]>> {
    await delay(100);
    return { isSuccess: true, data: MockStorage.getBiConnectors() };
  },

  async toggle(connector: BiConnectorStatus['connector']): Promise<ApiResponse<BiConnectorStatus>> {
    await delay(140);
    const connectors = MockStorage.getBiConnectors();
    const index = connectors.findIndex((item) => item.connector === connector);
    if (index === -1) throw new Error('Conector não encontrado');
    connectors[index] = {
      ...connectors[index],
      connected: !connectors[index].connected,
      lastSyncAt: new Date().toISOString(),
    };
    MockStorage.setBiConnectors(connectors);
    return { isSuccess: true, data: connectors[index] };
  },
};

// ============================================================================
// BILLING / RECEBÍVEIS / COBRANÇA / COMPLIANCE (EP07)
// ============================================================================

const toDateOnly = (isoOrDate: string) => isoOrDate.slice(0, 10);

const calcInvoiceTotals = (
  items: Array<{ quantity: number; unitPrice: number; taxRatePct?: number; discountValue?: number }>,
  invoiceDiscountValue: number = 0,
  amountPaid: number = 0
) => {
  const subtotal = items.reduce((sum, it) => sum + Number(it.quantity || 0) * Number(it.unitPrice || 0), 0);
  const discountTotal =
    Number(invoiceDiscountValue || 0) +
    items.reduce((sum, it) => sum + Number(it.discountValue || 0), 0);
  const taxTotal = items.reduce(
    (sum, it) => sum + (Number(it.taxRatePct || 0) / 100) * (Number(it.quantity || 0) * Number(it.unitPrice || 0)),
    0
  );
  const total = Math.max(0, subtotal - discountTotal + taxTotal);
  const nextAmountPaid = Math.max(0, Math.min(total, amountPaid));
  const amountOpen = Math.max(0, total - nextAmountPaid);
  return { subtotal, discountTotal, taxTotal, total, amountPaid: nextAmountPaid, amountOpen };
};

const computeInvoiceStatus = (invoice: Invoice): InvoiceStatus => {
  if (invoice.status === 'cancelled' || invoice.status === 'draft' || invoice.status === 'paid') return invoice.status;
  const today = toDateOnly(new Date().toISOString());
  const isLate = invoice.dueDate < today && invoice.totals.amountOpen > 0;
  if (invoice.totals.amountOpen === 0) return 'paid';
  if (invoice.totals.amountPaid > 0 && invoice.totals.amountOpen > 0) return isLate ? 'overdue' : 'partial';
  return isLate ? 'overdue' : 'open';
};

const pushAudit = (event: Omit<AuditEvent, 'auditId' | 'occurredAt'>) => {
  const rows = MockStorage.getAuditEvents();
  rows.unshift({
    ...event,
    auditId: generateId(),
    occurredAt: new Date().toISOString(),
  });
  MockStorage.setAuditEvents(rows.slice(0, 500));
};

export const billingInvoicesApi = {
  async list(
    filters: InvoiceListFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<InvoiceListItem>>> {
    await delay(200);
    let invoices = MockStorage.getInvoices();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      invoices = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.accountName.toLowerCase().includes(q) ||
          (inv.contactName || '').toLowerCase().includes(q)
      );
    }
    if (filters.status && filters.status !== 'all') {
      invoices = invoices.filter((inv) => computeInvoiceStatus(inv) === filters.status);
    }
    if (filters.accountId) {
      invoices = invoices.filter((inv) => inv.accountId === filters.accountId);
    }
    if (filters.issueFrom) invoices = invoices.filter((inv) => inv.issueDate >= filters.issueFrom!);
    if (filters.issueTo) invoices = invoices.filter((inv) => inv.issueDate <= filters.issueTo!);
    if (filters.dueFrom) invoices = invoices.filter((inv) => inv.dueDate >= filters.dueFrom!);
    if (filters.dueTo) invoices = invoices.filter((inv) => inv.dueDate <= filters.dueTo!);

    invoices = invoices
      .map((inv) => ({ ...inv, status: computeInvoiceStatus(inv) }))
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate));

    const total = invoices.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const slice = invoices.slice(start, start + limit);
    const items: InvoiceListItem[] = slice.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      accountName: inv.accountName,
      status: inv.status,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      amountTotal: inv.totals.total,
      amountOpen: inv.totals.amountOpen,
    }));

    return {
      isSuccess: true,
      data: {
        data: items,
        pagination: { page, limit, total, totalPages },
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<Invoice>> {
    await delay(140);
    const invoices = MockStorage.getInvoices();
    const invoice = invoices.find((inv) => inv.id === id);
    if (!invoice) throw new Error('Fatura não encontrada');
    const normalized: Invoice = { ...invoice, status: computeInvoiceStatus(invoice) };
    return { isSuccess: true, data: normalized };
  },

  async create(payload: InvoiceFormData): Promise<ApiResponse<Invoice>> {
    await delay(260);
    const invoices = MockStorage.getInvoices();
    const accounts = MockStorage.getAccounts();
    const contacts = MockStorage.getContacts();
    const account = accounts.find((a) => a.id === payload.accountId);
    if (!account) throw new Error('Empresa não encontrada');
    const contact = payload.contactId ? contacts.find((c) => c.id === payload.contactId) : undefined;

    const nextSeq = invoices.length + 1;
    const nowIso = new Date().toISOString();
    const items = (payload.items || []).map((it) => ({
      id: generateId(),
      description: it.description,
      quantity: Number(it.quantity || 0),
      unitPrice: Number(it.unitPrice || 0),
      taxRatePct: it.taxRatePct,
      discountValue: it.discountValue,
    }));
    const totals = calcInvoiceTotals(items, Number(payload.discountValue || 0), 0);

    const invoice: Invoice = {
      id: generateId(),
      invoiceNumber: `INV-2026-${String(nextSeq).padStart(4, '0')}`,
      accountId: account.id,
      accountName: account.name,
      contactId: payload.contactId || null,
      contactName: contact?.fullName || null,
      status: 'open',
      currency: 'BRL',
      issueDate: payload.issueDate,
      dueDate: payload.dueDate,
      items,
      totals,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    invoice.status = computeInvoiceStatus(invoice);

    invoices.unshift(invoice);
    MockStorage.setInvoices(invoices);

    pushAudit({
      entityType: 'invoice',
      entityId: invoice.id,
      action: 'create',
      severity: 'info',
      summary: `Fatura criada ${invoice.invoiceNumber}`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [],
    });

    return { isSuccess: true, data: invoice, message: 'Fatura criada com sucesso' };
  },

  async cancel(invoiceId: string, reason?: string): Promise<ApiResponse<Invoice>> {
    await delay(180);
    const invoices = MockStorage.getInvoices();
    const index = invoices.findIndex((inv) => inv.id === invoiceId);
    if (index === -1) throw new Error('Fatura não encontrada');
    const nowIso = new Date().toISOString();
    invoices[index] = { ...invoices[index], status: 'cancelled', updatedAt: nowIso };
    MockStorage.setInvoices(invoices);

    const history = MockStorage.getInvoiceHistoryEvents();
    history.unshift({
      eventId: generateId(),
      invoiceId,
      type: 'status_change',
      title: 'Fatura cancelada',
      description: reason || null,
      amount: null,
      previousStatus: 'open',
      newStatus: 'cancelled',
      createdByName: mockData.users[0].fullName,
      createdAt: nowIso,
    });
    MockStorage.setInvoiceHistoryEvents(history.slice(0, 500));

    pushAudit({
      entityType: 'invoice',
      entityId: invoiceId,
      action: 'status_change',
      severity: 'warning',
      summary: `Fatura cancelada (${invoices[index].invoiceNumber})`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [{ field: 'status', before: 'open', after: 'cancelled', isSensitive: false }],
    });

    return { isSuccess: true, data: invoices[index], message: 'Fatura cancelada' };
  },

  async getRecurrenceRule(invoiceId: string): Promise<ApiResponse<RecurrenceRuleForm | null>> {
    await delay(120);
    const rules = MockStorage.getRecurrenceRules();
    return { isSuccess: true, data: rules.find((r) => r.invoiceId === invoiceId) || null };
  },

  async saveRecurrenceRule(rule: RecurrenceRuleForm): Promise<ApiResponse<RecurrenceRuleForm>> {
    await delay(180);
    const rules = MockStorage.getRecurrenceRules();
    const index = rules.findIndex((r) => r.invoiceId === rule.invoiceId);
    if (index >= 0) rules[index] = rule;
    else rules.unshift(rule);
    MockStorage.setRecurrenceRules(rules);

    pushAudit({
      entityType: 'invoice',
      entityId: rule.invoiceId,
      action: 'update',
      severity: 'info',
      summary: `Recorrência ${rule.enabled ? 'ativada' : 'desativada'} para fatura`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [{ field: 'recurrence.enabled', before: null, after: rule.enabled, isSensitive: false }],
    });

    return { isSuccess: true, data: rule, message: 'Recorrência salva' };
  },

  async previewRecurrence(rule: RecurrenceRuleForm): Promise<ApiResponse<RecurrencePreviewItem[]>> {
    await delay(140);
    const items: RecurrencePreviewItem[] = [];
    const start = new Date(`${rule.startDate}T00:00:00Z`).getTime();
    const monthMs = 1000 * 60 * 60 * 24 * 30;
    for (let i = 0; i < 6; i++) {
      const runDate = new Date(start + i * monthMs * Math.max(1, rule.interval || 1));
      const runDateStr = toDateOnly(runDate.toISOString());
      items.push({
        runDate: runDateStr,
        expectedIssueDate: runDateStr,
        expectedDueDate: toDateOnly(new Date(runDate.getTime() + 1000 * 60 * 60 * 24 * 10).toISOString()),
        conflict: false,
        conflictReason: null,
      });
    }
    return { isSuccess: true, data: items };
  },
};

export const paymentsApi = {
  async listAllocations(invoiceId: string): Promise<ApiResponse<AllocationEntry[]>> {
    await delay(120);
    const rows = MockStorage.getAllocations().filter((a) => a.invoiceId === invoiceId);
    return { isSuccess: true, data: rows };
  },

  async listHistory(invoiceId: string, filters: Partial<HistoryFilters> = {}): Promise<ApiResponse<InvoiceHistoryEvent[]>> {
    await delay(120);
    let rows = MockStorage.getInvoiceHistoryEvents().filter((e) => e.invoiceId === invoiceId);
    if (filters.types && filters.types.length > 0) rows = rows.filter((e) => filters.types!.includes(e.type));
    if (filters.periodFrom) rows = rows.filter((e) => e.createdAt >= `${filters.periodFrom}T00:00:00`);
    if (filters.periodTo) rows = rows.filter((e) => e.createdAt <= `${filters.periodTo}T23:59:59`);
    return { isSuccess: true, data: rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 200) };
  },

  async recordManualPayment(form: ManualPaymentForm): Promise<ApiResponse<{ invoice: Invoice }>> {
    await delay(220);
    if (!form.confirmPolicy) throw new Error('Confirme a política para registrar a baixa.');
    const invoices = MockStorage.getInvoices();
    const index = invoices.findIndex((inv) => inv.id === form.invoiceId);
    if (index === -1) throw new Error('Fatura não encontrada');
    const inv = { ...invoices[index] };
    if (inv.status === 'paid' || inv.totals.amountOpen === 0) throw new Error('Fatura já quitada');

    const amount = Number(form.amountReceived || 0);
    if (!(amount > 0)) throw new Error('Informe um valor maior que zero');
    if (amount > inv.totals.amountOpen) throw new Error('Valor acima do saldo em aberto');
    if (amount !== inv.totals.amountOpen) throw new Error('Nesta tela, a baixa deve ser integral.');

    const allocations = MockStorage.getAllocations();
    const nowIso = new Date().toISOString();
    allocations.unshift({
      allocationId: generateId(),
      invoiceId: inv.id,
      receivedAt: form.receivedAt,
      amount,
      method: form.method,
      createdByName: mockData.users[0].fullName,
      createdAt: nowIso,
    });
    MockStorage.setAllocations(allocations.slice(0, 500));

    const totals = calcInvoiceTotals(inv.items, 0, inv.totals.amountPaid + amount);
    const previousStatus = inv.status;
    const updated: Invoice = {
      ...inv,
      totals,
      status: computeInvoiceStatus({ ...inv, totals }),
      updatedAt: nowIso,
    };
    invoices[index] = updated;
    MockStorage.setInvoices(invoices);

    const history = MockStorage.getInvoiceHistoryEvents();
    history.unshift({
      eventId: generateId(),
      invoiceId: inv.id,
      type: 'payment',
      title: 'Baixa manual integral registrada',
      description: form.method ? `Método: ${form.method}` : null,
      amount,
      previousStatus,
      newStatus: updated.status,
      createdByName: mockData.users[0].fullName,
      createdAt: nowIso,
    });
    MockStorage.setInvoiceHistoryEvents(history.slice(0, 500));

    pushAudit({
      entityType: 'payment',
      entityId: updated.id,
      action: 'create',
      severity: 'info',
      summary: `Baixa manual integral (${updated.invoiceNumber})`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [{ field: 'amountPaid', before: inv.totals.amountPaid, after: totals.amountPaid, isSensitive: false }],
    });

    return { isSuccess: true, data: { invoice: updated }, message: 'Baixa registrada' };
  },

  async recordPartialPayment(input: PartialPaymentInput): Promise<ApiResponse<{ balance: RemainingBalance; allocation: AllocationEntry; invoice: Invoice }>> {
    await delay(220);
    const invoices = MockStorage.getInvoices();
    const index = invoices.findIndex((inv) => inv.id === input.invoiceId);
    if (index === -1) throw new Error('Fatura não encontrada');
    const inv = { ...invoices[index] };
    const amount = Number(input.amountReceived || 0);
    if (!(amount > 0)) throw new Error('Informe um valor maior que zero');
    if (amount >= inv.totals.amountOpen) throw new Error('Use baixa integral para quitar o saldo total');

    const nowIso = new Date().toISOString();
    const allocations = MockStorage.getAllocations();
    const allocation: AllocationEntry = {
      allocationId: generateId(),
      invoiceId: inv.id,
      receivedAt: input.receivedAt,
      amount,
      method: input.method,
      createdByName: mockData.users[0].fullName,
      createdAt: nowIso,
    };
    allocations.unshift(allocation);
    MockStorage.setAllocations(allocations.slice(0, 500));

    const totals = calcInvoiceTotals(inv.items, 0, inv.totals.amountPaid + amount);
    const updated: Invoice = {
      ...inv,
      totals,
      status: computeInvoiceStatus({ ...inv, totals }),
      updatedAt: nowIso,
    };
    invoices[index] = updated;
    MockStorage.setInvoices(invoices);

    const history = MockStorage.getInvoiceHistoryEvents();
    history.unshift({
      eventId: generateId(),
      invoiceId: inv.id,
      type: 'payment',
      title: 'Pagamento parcial registrado',
      description: input.method ? `Método: ${input.method}` : null,
      amount,
      previousStatus: inv.status,
      newStatus: updated.status,
      createdByName: mockData.users[0].fullName,
      createdAt: nowIso,
    });
    MockStorage.setInvoiceHistoryEvents(history.slice(0, 500));

    return {
      isSuccess: true,
      data: {
        balance: {
          invoiceId: updated.id,
          amountTotal: updated.totals.total,
          amountPaid: updated.totals.amountPaid,
          amountOpen: updated.totals.amountOpen,
          status: updated.status === 'paid' ? 'paid' : updated.status === 'overdue' ? 'overdue' : 'partial',
        },
        allocation,
        invoice: updated,
      },
      message: 'Pagamento parcial registrado',
    };
  },
};

export const receivablesApi = {
  async getKpis(filters: ReceivablesFilters): Promise<ApiResponse<ReceivablesKpi[]>> {
    await delay(160);
    const invoices = MockStorage.getInvoices().map((inv) => ({ ...inv, status: computeInvoiceStatus(inv) }));
    const rows = invoices.filter((inv) => {
      if (filters.accountId && inv.accountId !== filters.accountId) return false;
      if (filters.status && filters.status.length > 0) return filters.status.includes(inv.status as any);
      return true;
    });
    const amountOpen = rows.reduce((sum, inv) => sum + inv.totals.amountOpen, 0);
    const amountOverdue = rows.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totals.amountOpen, 0);
    const invoicesOpen = rows.filter((inv) => inv.totals.amountOpen > 0).length;
    const today = toDateOnly(new Date().toISOString());
    const avgDaysOverdue =
      rows.filter((inv) => inv.dueDate < today && inv.totals.amountOpen > 0).length === 0
        ? 0
        : rows
            .filter((inv) => inv.dueDate < today && inv.totals.amountOpen > 0)
            .reduce((sum, inv) => sum + Math.max(0, Math.floor((Date.now() - new Date(`${inv.dueDate}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24))), 0) /
          rows.filter((inv) => inv.dueDate < today && inv.totals.amountOpen > 0).length;

    const cmp = (label: string, currentValue: number): ComparisonMetric => ({
      label,
      currentValue,
      previousValue: Math.max(0, currentValue * 0.92),
      deltaPct: currentValue === 0 ? 0 : ((currentValue - currentValue * 0.92) / currentValue) * 100,
    });

    const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
    return {
      isSuccess: true,
      data: [
        { key: 'amount_open', label: 'Saldo em aberto', value: amountOpen, formattedValue: fmt(amountOpen), comparison: cmp('vs período anterior', amountOpen) },
        { key: 'amount_overdue', label: 'Em atraso', value: amountOverdue, formattedValue: fmt(amountOverdue), comparison: cmp('vs período anterior', amountOverdue) },
        { key: 'invoices_open', label: 'Faturas em aberto', value: invoicesOpen, formattedValue: String(invoicesOpen), comparison: cmp('vs período anterior', invoicesOpen) },
        { key: 'avg_days_overdue', label: 'Média dias em atraso', value: avgDaysOverdue, formattedValue: `${avgDaysOverdue.toFixed(1)}`, comparison: cmp('vs período anterior', avgDaysOverdue) },
      ],
    };
  },

  async getAgingBuckets(filters: AgingFilters): Promise<ApiResponse<AgingBucket[]>> {
    await delay(160);
    const today = toDateOnly(new Date().toISOString());
    const invoices = MockStorage.getInvoices().map((inv) => ({ ...inv, status: computeInvoiceStatus(inv) }));
    const rows = invoices.filter((inv) => inv.totals.amountOpen > 0).filter((inv) => {
      if (filters.accountId && inv.accountId !== filters.accountId) return false;
      if (filters.status && filters.status.length > 0) return filters.status.includes(inv.status as any);
      return true;
    });

    const buckets: AgingBucket[] = [
      { bucket: '0_30', label: '0–30', invoicesCount: 0, amountOpen: 0 },
      { bucket: '31_60', label: '31–60', invoicesCount: 0, amountOpen: 0 },
      { bucket: '61_90', label: '61–90', invoicesCount: 0, amountOpen: 0 },
      { bucket: '90_plus', label: '90+', invoicesCount: 0, amountOpen: 0 },
    ];

    rows.forEach((inv) => {
      const days = inv.dueDate < today ? Math.max(0, Math.floor((Date.now() - new Date(`${inv.dueDate}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24))) : 0;
      const bucket =
        days <= 30 ? buckets[0] : days <= 60 ? buckets[1] : days <= 90 ? buckets[2] : buckets[3];
      bucket.invoicesCount += 1;
      bucket.amountOpen += inv.totals.amountOpen;
    });

    return { isSuccess: true, data: buckets };
  },

  async getAgingDetails(bucket: AgingBucket['bucket'], filters: AgingFilters): Promise<ApiResponse<AgingDetailRow[]>> {
    await delay(160);
    const today = toDateOnly(new Date().toISOString());
    const invoices = MockStorage.getInvoices().map((inv) => ({ ...inv, status: computeInvoiceStatus(inv) }));
    const rows = invoices.filter((inv) => inv.totals.amountOpen > 0).filter((inv) => {
      if (filters.accountId && inv.accountId !== filters.accountId) return false;
      if (filters.status && filters.status.length > 0) return filters.status.includes(inv.status as any);
      return true;
    });

    const matchBucket = (days: number) => {
      if (days <= 30) return '0_30';
      if (days <= 60) return '31_60';
      if (days <= 90) return '61_90';
      return '90_plus';
    };

    const details: AgingDetailRow[] = rows
      .map((inv) => {
        const daysOverdue = inv.dueDate < today ? Math.max(0, Math.floor((Date.now() - new Date(`${inv.dueDate}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24))) : 0;
        return {
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          accountName: inv.accountName,
          dueDate: inv.dueDate,
          daysOverdue,
          amountOpen: inv.totals.amountOpen,
          status: inv.status,
        };
      })
      .filter((row) => matchBucket(row.daysOverdue) === bucket)
      .sort((a, b) => b.amountOpen - a.amountOpen)
      .slice(0, 200);

    return { isSuccess: true, data: details };
  },

  async requestReceivablesExport(format: ExportJob['format']): Promise<ApiResponse<ExportJob>> {
    return exportsApi.requestJob({ entity: 'receivables', format, records: 1200, requestedBy: mockData.users[0].id });
  },
};

export const collectionsApi = {
  async listRules(filters: CollectionRuleFilters = {}): Promise<ApiResponse<CollectionRule[]>> {
    await delay(160);
    let rules = MockStorage.getCollectionRules();
    if (filters.search) {
      const q = filters.search.toLowerCase();
      rules = rules.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (filters.isActive !== null && filters.isActive !== undefined) {
      rules = rules.filter((r) => r.isActive === filters.isActive);
    }
    if (filters.channel) {
      rules = rules.filter((r) => r.steps.some((s) => s.channel === filters.channel));
    }
    return { isSuccess: true, data: rules.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
  },

  async saveRule(rule: Omit<CollectionRule, 'createdAt' | 'updatedAt'> & { id?: string }): Promise<ApiResponse<CollectionRule>> {
    await delay(220);
    const rules = MockStorage.getCollectionRules();
    const nowIso = new Date().toISOString();
    const payload: CollectionRule = {
      ...rule,
      id: rule.id || generateId(),
      createdAt: rule.id ? rules.find((r) => r.id === rule.id)?.createdAt || nowIso : nowIso,
      updatedAt: nowIso,
    };
    payload.steps = (payload.steps || []).map((s, idx) => ({ ...s, order: idx + 1 }));
    const index = rules.findIndex((r) => r.id === payload.id);
    if (index >= 0) rules[index] = payload;
    else rules.unshift(payload);
    MockStorage.setCollectionRules(rules);

    pushAudit({
      entityType: 'collection_rule',
      entityId: payload.id,
      action: rule.id ? 'update' : 'create',
      severity: 'info',
      summary: `${rule.id ? 'Atualizou' : 'Criou'} régua de cobrança "${payload.name}"`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [],
    });

    return { isSuccess: true, data: payload, message: 'Régua salva' };
  },

  async removeRule(id: string): Promise<ApiResponse<void>> {
    await delay(160);
    const rules = MockStorage.getCollectionRules().filter((r) => r.id !== id);
    MockStorage.setCollectionRules(rules);
    return { isSuccess: true, message: 'Régua removida' };
  },

  async listTemplates(): Promise<ApiResponse<TemplateModel[]>> {
    await delay(160);
    return { isSuccess: true, data: MockStorage.getCollectionTemplates() };
  },

  async saveTemplate(template: Omit<TemplateModel, 'createdAt' | 'updatedAt'> & { id?: string }): Promise<ApiResponse<TemplateModel>> {
    await delay(220);
    const templates = MockStorage.getCollectionTemplates();
    const nowIso = new Date().toISOString();
    const payload: TemplateModel = {
      ...template,
      id: template.id || generateId(),
      createdAt: template.id ? templates.find((t) => t.id === template.id)?.createdAt || nowIso : nowIso,
      updatedAt: nowIso,
    };
    const index = templates.findIndex((t) => t.id === payload.id);
    if (index >= 0) templates[index] = payload;
    else templates.unshift(payload);
    MockStorage.setCollectionTemplates(templates);
    return { isSuccess: true, data: payload, message: 'Template salvo' };
  },

  async listJobs(filters: CollectionJobFilters = {}): Promise<ApiResponse<CollectionJob[]>> {
    await delay(140);
    let jobs = MockStorage.getCollectionJobs();
    if (filters.status && filters.status !== 'all') jobs = jobs.filter((j) => j.status === filters.status);
    if (filters.periodFrom) jobs = jobs.filter((j) => j.startedAt >= `${filters.periodFrom}T00:00:00`);
    if (filters.periodTo) jobs = jobs.filter((j) => j.startedAt <= `${filters.periodTo}T23:59:59`);
    return { isSuccess: true, data: jobs.sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 200) };
  },
};

export const paymentGatewaysApi = {
  async listConnectors(): Promise<ApiResponse<ConnectorViewModel[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getPaymentConnectors() };
  },

  async saveCredentials(payload: ConnectorCredentials): Promise<ApiResponse<{ ok: true }>> {
    await delay(180);
    // MVP: apenas registra em auditoria (credenciais não são persistidas em claro)
    pushAudit({
      entityType: 'connector',
      entityId: payload.connector,
      action: 'update',
      severity: 'warning',
      summary: `Credenciais atualizadas para conector ${payload.connector} (mascaradas)`,
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [{ field: 'credentials', before: null, after: '***', isSensitive: true }],
    });
    return { isSuccess: true, data: { ok: true }, message: 'Credenciais salvas (mascaradas)' };
  },

  async testConnection(connector: ConnectorViewModel['connector']): Promise<ApiResponse<ConnectionTestResult>> {
    await delay(220);
    const ok = Math.random() > 0.15;
    const label = connector === 'manual' ? 'Manual' : connector === 'pagarme' ? 'Pagar.me' : 'Stub';
    return {
      isSuccess: true,
      data: { ok, message: ok ? `Conexão OK (${label}, stub).` : `Falha ao autenticar (${label}, stub).`, checkedAt: new Date().toISOString() },
    };
  },

  async toggleConnector(connector: ConnectorViewModel['connector']): Promise<ApiResponse<ConnectorViewModel>> {
    await delay(160);
    const connectors = MockStorage.getPaymentConnectors();
    const index = connectors.findIndex((c) => c.connector === connector);
    if (index === -1) throw new Error('Conector não encontrado');
    const next: ConnectorViewModel = {
      ...connectors[index],
      status: connectors[index].status === 'connected' ? 'disconnected' : 'connected',
      lastSyncAt: new Date().toISOString(),
      details: connectors[index].status === 'connected' ? 'Desconectado' : 'Conectado (stub)',
    };
    connectors[index] = next;
    MockStorage.setPaymentConnectors(connectors);
    return { isSuccess: true, data: next };
  },

  async generatePaymentLink(req: PaymentLinkRequest): Promise<ApiResponse<PaymentLinkResponse>> {
    await delay(220);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * Math.max(1, req.expiresInDays || 3));
    const res: PaymentLinkResponse = {
      linkId: generateId(),
      url: `https://pay.mock/${Math.random().toString(36).slice(2)}`,
      status: 'active',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    const links = MockStorage.getPaymentLinks();
    links.unshift(res);
    MockStorage.setPaymentLinks(links.slice(0, 200));
    return { isSuccess: true, data: res, message: 'Link gerado' };
  },

  async invalidatePaymentLink(linkId: string): Promise<ApiResponse<{ status: LinkStatus }>> {
    await delay(140);
    const links = MockStorage.getPaymentLinks();
    const index = links.findIndex((l) => l.linkId === linkId);
    if (index === -1) throw new Error('Link não encontrado');
    links[index] = { ...links[index], status: 'revoked' };
    MockStorage.setPaymentLinks(links);
    return { isSuccess: true, data: { status: 'revoked' }, message: 'Link invalidado' };
  },

  async listWebhookEvents(filters: WebhookEventFilters): Promise<ApiResponse<PaginatedResponse<WebhookEvent>>> {
    await delay(160);
    let events = MockStorage.getWebhookEvents();
    if (filters.connector) events = events.filter((e) => e.connector === filters.connector);
    if (filters.status) events = events.filter((e) => e.status === filters.status);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      events = events.filter(
        (e) =>
          e.eventId.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          (e.invoiceId || '').toLowerCase().includes(q)
      );
    }
    const total = events.length;
    const start = (filters.page - 1) * filters.pageSize;
    const data = events
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
      .slice(start, start + filters.pageSize);
    return {
      isSuccess: true,
      data: { data, pagination: { page: filters.page, limit: filters.pageSize, total, totalPages: Math.ceil(total / filters.pageSize) || 1 } },
    };
  },

  async getWebhookPayload(eventId: string): Promise<ApiResponse<WebhookPayloadView>> {
    await delay(120);
    const payloads = MockStorage.getWebhookPayloads();
    const payload = payloads[eventId];
    if (payload) return { isSuccess: true, data: payload };
    const fallback: WebhookPayloadView = {
      eventId,
      maskedJson: JSON.stringify({ eventId, masked: true, note: 'Payload não encontrado; exibindo stub.' }, null, 2),
      rawSizeBytes: 120,
      maskedFields: ['token', 'cardNumber'],
    };
    payloads[eventId] = fallback;
    MockStorage.setWebhookPayloads(payloads);
    return { isSuccess: true, data: fallback };
  },

  async retryWebhookEvent(eventId: string): Promise<ApiResponse<WebhookEvent>> {
    await delay(180);
    const events = MockStorage.getWebhookEvents();
    const index = events.findIndex((e) => e.eventId === eventId);
    if (index === -1) throw new Error('Evento não encontrado');
    const ok = Math.random() > 0.25;
    const next: WebhookEvent = {
      ...events[index],
      attempts: (events[index].attempts || 1) + 1,
      status: ok ? 'processed' : 'failed',
      processedAt: new Date().toISOString(),
      errorMessage: ok ? null : 'Falha simulada ao reprocessar',
    };
    events[index] = next;
    MockStorage.setWebhookEvents(events);
    return { isSuccess: true, data: next, message: ok ? 'Reprocessado com sucesso' : 'Falha ao reprocessar' };
  },
};

export const complianceApi = {
  async getRolePermissionMatrix(): Promise<ApiResponse<RolePermissionMatrixModel>> {
    await delay(140);
    return { isSuccess: true, data: MockStorage.getRolePermissionMatrix() };
  },

  async saveRolePermissionMatrix(matrix: RolePermissionMatrixModel): Promise<ApiResponse<RolePermissionMatrixModel>> {
    await delay(200);
    const payload: RolePermissionMatrixModel = {
      ...matrix,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedByName: mockData.users[0].fullName,
    };
    MockStorage.setRolePermissionMatrix(payload);
    const changes = MockStorage.getPermissionChanges();
    changes.unshift({
      role: 'admin',
      permissionKey: 'billing.audit.view',
      from: true,
      to: true,
      changedAt: payload.lastUpdatedAt!,
      changedByName: payload.lastUpdatedByName!,
      justification: null,
    });
    MockStorage.setPermissionChanges(changes.slice(0, 200));
    pushAudit({
      entityType: 'permission',
      entityId: 'matrix',
      action: 'permission_change',
      severity: 'critical',
      summary: 'Matriz de permissões atualizada',
      actorUserId: mockData.users[0].id,
      actorName: mockData.users[0].fullName,
      actorIp: '127.0.0.1',
      diffs: [],
    });
    return { isSuccess: true, data: payload, message: 'Permissões salvas' };
  },

  async searchAuditEvents(filters: AuditFilters): Promise<ApiResponse<PaginatedResponse<AuditEvent>>> {
    await delay(160);
    let rows = MockStorage.getAuditEvents();
    if (filters.periodFrom) rows = rows.filter((e) => e.occurredAt >= `${filters.periodFrom}T00:00:00`);
    if (filters.periodTo) rows = rows.filter((e) => e.occurredAt <= `${filters.periodTo}T23:59:59`);
    if (filters.entityType) rows = rows.filter((e) => e.entityType === filters.entityType);
    if (filters.action) rows = rows.filter((e) => e.action === filters.action);
    if (filters.severity) rows = rows.filter((e) => e.severity === filters.severity);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      rows = rows.filter((e) => e.summary.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q));
    }
    const total = rows.length;
    const start = (filters.page - 1) * filters.pageSize;
    const data = rows.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(start, start + filters.pageSize);
    return { isSuccess: true, data: { data, pagination: { page: filters.page, limit: filters.pageSize, total, totalPages: Math.ceil(total / filters.pageSize) || 1 } } };
  },

  async requestComplianceExport(req: ComplianceExportRequest): Promise<ApiResponse<ComplianceExportJob>> {
    await delay(220);
    const jobs = MockStorage.getComplianceExportJobs();
    const nowIso = new Date().toISOString();
    const job: ComplianceExportJob = {
      jobId: generateId(),
      status: 'done',
      requestedAt: nowIso,
      finishedAt: nowIso,
      fileName: `compliance-${toDateOnly(nowIso)}.${req.format}`,
      downloadUrl: `/downloads/compliance/${toDateOnly(nowIso)}.${req.format}`,
      errorMessage: null,
      totalRows: 120,
    };
    jobs.unshift(job);
    MockStorage.setComplianceExportJobs(jobs.slice(0, 100));
    return { isSuccess: true, data: job, message: 'Exportação de compliance solicitada' };
  },
};

export const accessApi = {
  async listPermissionCatalog(): Promise<ApiResponse<AccessPermissionCatalogItem[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getAccessPermissionCatalog() };
  },

  async listGroups(filters: AccessGroupFilters): Promise<ApiResponse<PaginatedResponse<AccessGroup>>> {
    await delay(140);
    let rows = MockStorage.getAccessGroups();
    if (filters.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter((g) => g.name.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q));
    }
    if (filters.isActive !== null) {
      rows = rows.filter((g) => g.isActive === filters.isActive);
    }
    const total = rows.length;
    const start = (filters.page - 1) * filters.pageSize;
    const data = rows.slice(start, start + filters.pageSize);
    return {
      isSuccess: true,
      data: {
        data,
        pagination: {
          page: filters.page,
          limit: filters.pageSize,
          total,
          totalPages: Math.ceil(total / filters.pageSize) || 1,
        },
      },
    };
  },

  async saveGroup(group: Partial<AccessGroup> & { name: string }): Promise<ApiResponse<AccessGroup>> {
    await delay(180);
    const rows = MockStorage.getAccessGroups();
    const nowIso = new Date().toISOString();
    const existing = group.id ? rows.find((r) => r.id === group.id) : null;
    const payload: AccessGroup = {
      id: group.id || generateId(),
      name: group.name,
      description: group.description || null,
      isActive: group.isActive ?? true,
      permissionKeys: group.permissionKeys || existing?.permissionKeys || [],
      membersCount: existing?.membersCount || 0,
      createdAt: existing?.createdAt || nowIso,
      createdBy: existing?.createdBy || mockData.users[0].fullName,
      updatedAt: nowIso,
      updatedBy: mockData.users[0].fullName,
    };
    const index = rows.findIndex((r) => r.id === payload.id);
    if (index >= 0) rows[index] = payload;
    else rows.unshift(payload);
    MockStorage.setAccessGroups(rows);
    return { isSuccess: true, data: payload, message: 'Grupo salvo com sucesso' };
  },

  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    await delay(120);
    const rows = MockStorage.getAccessGroups().filter((g) => g.id !== groupId);
    const memberships = MockStorage.getAccessUserGroups().filter((m) => m.groupId !== groupId);
    MockStorage.setAccessGroups(rows);
    MockStorage.setAccessUserGroups(memberships);
    return { isSuccess: true, message: 'Grupo removido com sucesso' };
  },

  async getGroupPermissions(groupId: string): Promise<ApiResponse<AccessPermissionKey[]>> {
    await delay(100);
    const group = MockStorage.getAccessGroups().find((g) => g.id === groupId);
    if (!group) throw new Error('Grupo não encontrado');
    return { isSuccess: true, data: group.permissionKeys };
  },

  async saveGroupPermissions(groupId: string, permissionKeys: AccessPermissionKey[]): Promise<ApiResponse<AccessGroup>> {
    await delay(180);
    const rows = MockStorage.getAccessGroups();
    const index = rows.findIndex((g) => g.id === groupId);
    if (index < 0) throw new Error('Grupo não encontrado');
    rows[index] = {
      ...rows[index],
      permissionKeys: Array.from(new Set(permissionKeys)),
      updatedAt: new Date().toISOString(),
      updatedBy: mockData.users[0].fullName,
    };
    MockStorage.setAccessGroups(rows);
    return { isSuccess: true, data: rows[index], message: 'Permissões do grupo atualizadas' };
  },

  async listGroupMembers(groupId: string): Promise<ApiResponse<AccessUserGroupMembership[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getAccessUserGroups().filter((m) => m.groupId === groupId) };
  },

  async listUserGroups(userId: string): Promise<ApiResponse<AccessUserGroupMembership[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getAccessUserGroups().filter((m) => m.userId === userId) };
  },

  async addUserToGroups(userId: string, groupIds: string[]): Promise<ApiResponse<AccessUserGroupMembership[]>> {
    await delay(180);
    const users = mockData.users;
    const groups = MockStorage.getAccessGroups();
    const memberships = MockStorage.getAccessUserGroups();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('Usuário não encontrado');
    const created: AccessUserGroupMembership[] = [];
    groupIds.forEach((groupId) => {
      const group = groups.find((g) => g.id === groupId);
      const exists = memberships.some((m) => m.userId === userId && m.groupId === groupId);
      if (!group || exists) return;
      const row: AccessUserGroupMembership = {
        userId,
        userName: user.fullName,
        userEmail: user.email,
        avatarUrl: user.avatar || null,
        groupId,
        groupName: group.name,
        addedAt: new Date().toISOString(),
        addedBy: mockData.users[0].fullName,
      };
      memberships.unshift(row);
      created.push(row);
    });
    MockStorage.setAccessUserGroups(memberships);
    // refresh counters
    const nextGroups = groups.map((g) => ({
      ...g,
      membersCount: memberships.filter((m) => m.groupId === g.id).length,
    }));
    MockStorage.setAccessGroups(nextGroups);
    return { isSuccess: true, data: created, message: 'Vínculos adicionados' };
  },

  async removeUserFromGroup(userId: string, groupId: string): Promise<ApiResponse<void>> {
    await delay(150);
    const memberships = MockStorage.getAccessUserGroups().filter((m) => !(m.userId === userId && m.groupId === groupId));
    MockStorage.setAccessUserGroups(memberships);
    const groups = MockStorage.getAccessGroups().map((g) => ({
      ...g,
      membersCount: memberships.filter((m) => m.groupId === g.id).length,
    }));
    MockStorage.setAccessGroups(groups);
    return { isSuccess: true, message: 'Usuário removido do grupo' };
  },

  async listDirectPermissions(userId: string): Promise<ApiResponse<DirectUserPermissionGrant[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getAccessDirectGrants().filter((g) => g.userId === userId) };
  },

  async grantDirectPermission(payload: {
    userId: string;
    permissionKey: AccessPermissionKey;
    justification: string;
    expiresAt: string | null;
  }): Promise<ApiResponse<DirectUserPermissionGrant>> {
    await delay(180);
    const catalog = MockStorage.getAccessPermissionCatalog();
    const label = catalog.find((p) => p.key === payload.permissionKey)?.label || payload.permissionKey;
    const rows = MockStorage.getAccessDirectGrants();
    const grant: DirectUserPermissionGrant = {
      id: generateId(),
      userId: payload.userId,
      permissionKey: payload.permissionKey,
      permissionLabel: label,
      justification: payload.justification,
      grantedAt: new Date().toISOString(),
      grantedBy: mockData.users[0].fullName,
      expiresAt: payload.expiresAt,
      isActive: true,
    };
    rows.unshift(grant);
    MockStorage.setAccessDirectGrants(rows);
    return { isSuccess: true, data: grant, message: 'Permissão direta concedida' };
  },

  async revokeDirectPermission(grantId: string): Promise<ApiResponse<void>> {
    await delay(120);
    const rows = MockStorage.getAccessDirectGrants().filter((r) => r.id !== grantId);
    MockStorage.setAccessDirectGrants(rows);
    return { isSuccess: true, message: 'Permissão direta revogada' };
  },

  async getEffectiveAccess(userId: string): Promise<
    ApiResponse<{ summary: EffectiveAccessSummary; permissions: EffectiveUserPermission[]; conflicts: AccessPermissionConflict[] }>
  > {
    await delay(160);
    const summaryRows = MockStorage.getAccessEffectiveSummary();
    const summary =
      summaryRows.find((s) => s.userId === userId) ||
      ({
        userId,
        groupsCount: 0,
        inheritedPermissionsCount: 0,
        directPermissionsCount: 0,
        totalEffectivePermissions: 0,
        conflictsCount: 0,
        calculatedAt: new Date().toISOString(),
      } as EffectiveAccessSummary);
    const permissions = MockStorage.getAccessEffectivePermissions();
    const conflicts = MockStorage.getAccessConflicts().filter((c) => c.userId === userId);
    return { isSuccess: true, data: { summary, permissions, conflicts } };
  },

  async resolveConflict(conflictId: string, action: 'revoke_direct' | 'keep_both' | 'remove_from_group'): Promise<ApiResponse<void>> {
    await delay(160);
    const conflicts = MockStorage.getAccessConflicts().filter((c) => c.conflictId !== conflictId);
    MockStorage.setAccessConflicts(conflicts);
    if (action === 'revoke_direct') {
      const first = MockStorage.getAccessDirectGrants();
      if (first.length > 0) {
        first.shift();
        MockStorage.setAccessDirectGrants(first);
      }
    }
    return { isSuccess: true, message: 'Conflito resolvido' };
  },

  async simulateChange(userId: string, action: 'add_to_group' | 'remove_from_group' | 'grant_permission' | 'revoke_permission'): Promise<ApiResponse<AccessSimulationResult>> {
    await delay(120);
    const current = MockStorage.getAccessEffectivePermissions().map((p) => p.permissionKey);
    const added: AccessPermissionKey[] = action === 'grant_permission' ? ['deals.delete'] : [];
    const removed: AccessPermissionKey[] = action === 'revoke_permission' ? ['deals.delete'] : [];
    const projected = Array.from(new Set([...current, ...added])).filter((k) => !removed.includes(k));
    return {
      isSuccess: true,
      data: {
        userId,
        currentPermissions: current,
        projectedPermissions: projected,
        diff: {
          added,
          removed,
          unchanged: current.filter((k) => !removed.includes(k)),
          criticalChanges: added.includes('deals.delete') ? ['deals.delete'] : [],
        },
      },
    };
  },

  async requestElevation(payload: {
    userId: string;
    permissionKey: AccessPermissionKey;
    justification: string;
    validFrom: string;
    validUntil: string;
  }): Promise<ApiResponse<AccessElevationRequest>> {
    await delay(180);
    const users = mockData.users;
    const requester = users.find((u) => u.id === payload.userId);
    if (!requester) throw new Error('Usuário não encontrado');
    const catalog = MockStorage.getAccessPermissionCatalog();
    const permission = catalog.find((p) => p.key === payload.permissionKey);
    const rows = MockStorage.getAccessElevationRequests();
    const req: AccessElevationRequest = {
      requestId: generateId(),
      userId: requester.id,
      userName: requester.fullName,
      permissionKey: payload.permissionKey,
      permissionLabel: permission?.label || payload.permissionKey,
      isCritical: permission?.isCritical || false,
      justification: payload.justification,
      validFrom: payload.validFrom,
      validUntil: payload.validUntil,
      status: 'pending',
      approverId: users[0].id,
      approverName: users[0].fullName,
      requestedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewObservation: null,
      canCancel: true,
    };
    rows.unshift(req);
    MockStorage.setAccessElevationRequests(rows);
    return { isSuccess: true, data: req, message: 'Solicitação enviada para aprovação' };
  },

  async listElevationRequests(filters?: { status?: AccessElevationRequest['status'] | 'all'; mineUserId?: string }): Promise<ApiResponse<AccessElevationRequest[]>> {
    await delay(140);
    let rows = MockStorage.getAccessElevationRequests();
    if (filters?.mineUserId) rows = rows.filter((r) => r.userId === filters.mineUserId);
    if (filters?.status && filters.status !== 'all') rows = rows.filter((r) => r.status === filters.status);
    return { isSuccess: true, data: rows };
  },

  async reviewElevationRequest(requestId: string, action: 'approve' | 'reject', observation: string | null): Promise<ApiResponse<AccessElevationRequest>> {
    await delay(180);
    const rows = MockStorage.getAccessElevationRequests();
    const index = rows.findIndex((r) => r.requestId === requestId);
    if (index < 0) throw new Error('Solicitação não encontrada');
    rows[index] = {
      ...rows[index],
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewObservation: observation,
      canCancel: false,
    };
    MockStorage.setAccessElevationRequests(rows);
    return { isSuccess: true, data: rows[index], message: action === 'approve' ? 'Solicitação aprovada' : 'Solicitação rejeitada' };
  },

  async cancelElevationRequest(requestId: string): Promise<ApiResponse<void>> {
    await delay(120);
    const rows = MockStorage.getAccessElevationRequests();
    const index = rows.findIndex((r) => r.requestId === requestId);
    if (index < 0) throw new Error('Solicitação não encontrada');
    rows[index] = { ...rows[index], status: 'cancelled', canCancel: false, reviewedAt: new Date().toISOString() };
    MockStorage.setAccessElevationRequests(rows);
    return { isSuccess: true, message: 'Solicitação cancelada' };
  },

  async listAuditEvents(query: string): Promise<ApiResponse<AccessAuditEvent[]>> {
    await delay(130);
    let rows = MockStorage.getAccessAuditEvents();
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => r.actor.toLowerCase().includes(q) || r.entityName.toLowerCase().includes(q) || (r.details || '').toLowerCase().includes(q));
    }
    return { isSuccess: true, data: rows };
  },

  async requestAuditExport(format: 'csv' | 'xlsx' | 'pdf'): Promise<ApiResponse<AccessExportRecord>> {
    await delay(170);
    const rows = MockStorage.getAccessExportHistory();
    const nowIso = new Date().toISOString();
    const rec: AccessExportRecord = {
      exportId: generateId(),
      type: 'audit_trail',
      format,
      status: 'completed',
      generatedAt: nowIso,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: `/downloads/access/audit-${toDateOnly(nowIso)}.${format}`,
      sizeBytes: 20480,
      generatedBy: mockData.users[0].fullName,
    };
    rows.unshift(rec);
    MockStorage.setAccessExportHistory(rows.slice(0, 100));
    return { isSuccess: true, data: rec, message: 'Exportação gerada' };
  },

  async listExportHistory(): Promise<ApiResponse<AccessExportRecord[]>> {
    await delay(120);
    return { isSuccess: true, data: MockStorage.getAccessExportHistory() };
  },

  async regenerateExport(exportId: string): Promise<ApiResponse<AccessExportRecord>> {
    await delay(160);
    const rows = MockStorage.getAccessExportHistory();
    const index = rows.findIndex((r) => r.exportId === exportId);
    if (index < 0) throw new Error('Exportação não encontrada');
    rows[index] = {
      ...rows[index],
      status: 'completed',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    MockStorage.setAccessExportHistory(rows);
    return { isSuccess: true, data: rows[index], message: 'Exportação renovada' };
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
  async list(): Promise<ApiResponse<User[]>> {
    await delay(100);
    return {
      isSuccess: true,
      data: mockData.users,
      message: 'Usuários carregados',
    };
  },
};

export const pipelinesApi = {
  async list(): Promise<ApiResponse<Pipeline[]>> {
    await delay(120);
    return {
      isSuccess: true,
      data: mockData.pipelines,
      message: 'Pipelines carregados',
    };
  },

  async listStages(pipelineId: string): Promise<ApiResponse<Stage[]>> {
    await delay(120);
    const stages = mockData.stages
      .filter((s) => s.pipelineId === pipelineId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return {
      isSuccess: true,
      data: stages,
      message: 'Estágios carregados',
    };
  },
};

// ============================================================================
// PRODUCT CATALOG API (EP11)
// ============================================================================

export const productsApi = {
  async list(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    await delay(150);
    let items = [...mockData.products];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (filters?.category) items = items.filter((p) => p.category === filters.category);
    if (filters?.pricingModel) items = items.filter((p) => p.pricingModel === filters.pricingModel);
    if (filters?.isActive !== undefined && filters?.isActive !== null) items = items.filter((p) => p.isActive === filters.isActive);
    if (filters?.recurrence) items = items.filter((p) => p.recurrence === filters.recurrence);

    return { isSuccess: true, data: items, message: 'Produtos carregados' };
  },

  async get(id: string): Promise<ApiResponse<Product | null>> {
    await delay(100);
    const found = mockData.products.find((p) => p.id === id) || null;
    return { isSuccess: true, data: found, message: found ? 'Produto encontrado' : 'Não encontrado' };
  },
};

// ============================================================================
// PROPOSALS API (EP12)
// ============================================================================

export const proposalsApi = {
  async list(filters?: ProposalFilters): Promise<ApiResponse<Proposal[]>> {
    await delay(180);
    let items = [...mockData.proposals];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.accountName.toLowerCase().includes(q)
      );
    }
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    if (filters?.ownerId) items = items.filter((p) => p.ownerId === filters.ownerId);
    if (filters?.accountId) items = items.filter((p) => p.accountId === filters.accountId);

    return { isSuccess: true, data: items, message: 'Propostas carregadas' };
  },

  async get(id: string): Promise<ApiResponse<Proposal | null>> {
    await delay(120);
    const found = mockData.proposals.find((p) => p.id === id) || null;
    return { isSuccess: true, data: found, message: found ? 'Proposta encontrada' : 'Não encontrada' };
  },
};

// ============================================================================
// CONTRACTS API (EP13)
// ============================================================================

export const contractsApi = {
  async list(filters?: ContractFilters): Promise<ApiResponse<Contract[]>> {
    await delay(180);
    let items = [...mockData.contracts];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.accountName.toLowerCase().includes(q)
      );
    }
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.type) items = items.filter((c) => c.type === filters.type);
    if (filters?.ownerId) items = items.filter((c) => c.ownerId === filters.ownerId);
    if (filters?.expiringWithinDays) {
      const limit = new Date();
      limit.setDate(limit.getDate() + filters.expiringWithinDays);
      items = items.filter((c) => new Date(c.endDate) <= limit);
    }

    return { isSuccess: true, data: items, message: 'Contratos carregados' };
  },

  async get(id: string): Promise<ApiResponse<Contract | null>> {
    await delay(120);
    const found = mockData.contracts.find((c) => c.id === id) || null;
    return { isSuccess: true, data: found, message: found ? 'Contrato encontrado' : 'Não encontrado' };
  },
};

// ============================================================================
// PROJECTS / DELIVERY API (EP14)
// ============================================================================

export const projectsApi = {
  async list(filters?: ProjectFilters): Promise<ApiResponse<Project[]>> {
    await delay(180);
    let items = [...mockData.projects];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.accountName.toLowerCase().includes(q)
      );
    }
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    if (filters?.health) items = items.filter((p) => p.health === filters.health);
    if (filters?.ownerId) items = items.filter((p) => p.ownerId === filters.ownerId);
    if (filters?.accountId) items = items.filter((p) => p.accountId === filters.accountId);

    return { isSuccess: true, data: items, message: 'Projetos carregados' };
  },

  async get(id: string): Promise<ApiResponse<Project | null>> {
    await delay(120);
    const found = mockData.projects.find((p) => p.id === id) || null;
    return { isSuccess: true, data: found, message: found ? 'Projeto encontrado' : 'Não encontrado' };
  },

  async getKpis(): Promise<ApiResponse<ProjectSummaryKpis>> {
    await delay(100);
    const projects = mockData.projects;
    const active = projects.filter((p) => p.status === 'in_progress' || p.status === 'planning');
    const allMilestones = projects.flatMap((p) => p.milestones);
    const completedMilestones = allMilestones.filter((m) => m.status === 'completed').length;
    const totalMilestones = allMilestones.length;

    return {
      isSuccess: true,
      data: {
        totalProjects: projects.length,
        activeProjects: active.length,
        onTrack: projects.filter((p) => p.health === 'green' && p.status === 'in_progress').length,
        atRisk: projects.filter((p) => p.health === 'yellow').length,
        delayed: projects.filter((p) => p.health === 'red').length,
        totalBudget: projects.reduce((s, p) => s + p.budget, 0),
        totalSpent: projects.reduce((s, p) => s + p.spent, 0),
        avgCompletion: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
      },
      message: 'KPIs carregados',
    };
  },
};

// ============================================================================
// INTEGRATIONS API (EP15)
// ============================================================================

export const integrationsApi = {
  async list(): Promise<ApiResponse<Integration[]>> {
    await delay(120);
    return { isSuccess: true, data: mockData.integrations, message: 'Integrações carregadas' };
  },

  async toggleEvent(integrationId: string, eventId: string): Promise<ApiResponse<Integration>> {
    await delay(100);
    const integration = mockData.integrations.find((i) => i.id === integrationId);
    if (!integration) throw new Error('Integração não encontrada');
    const event = integration.events.find((e) => e.id === eventId);
    if (event) event.enabled = !event.enabled;
    return { isSuccess: true, data: integration, message: 'Evento atualizado' };
  },
};

// ============================================================================
// SSO / SAML API (EP16)
// ============================================================================

export const ssoApi = {
  async getConfig(): Promise<ApiResponse<SsoConfig>> {
    await delay(100);
    return { isSuccess: true, data: mockData.ssoConfig, message: 'Configuração SSO carregada' };
  },

  async testConnection(): Promise<ApiResponse<{ success: boolean; message: string }>> {
    await delay(800);
    return { isSuccess: true, data: { success: true, message: 'Conexão SAML validada com sucesso' }, message: 'Teste concluído' };
  },
};

// ============================================================================
// SAAS METRICS API (EP09)
// ============================================================================

export const saasMetricsApi = {
  async getDashboard(): Promise<ApiResponse<SaasDashboardData>> {
    await delay(200);
    return {
      isSuccess: true,
      data: mockData.saasDashboard,
      message: 'Métricas SaaS carregadas',
    };
  },
};

// ============================================================================
// CUSTOMER SUCCESS API (EP10)
// ============================================================================

export const customerSuccessApi = {
  async getOverview(): Promise<ApiResponse<CsOverviewData>> {
    await delay(180);
    return {
      isSuccess: true,
      data: mockData.csOverview,
      message: 'Visão geral CS carregada',
    };
  },

  async listHealthScores(filters?: AccountHealthFilters): Promise<ApiResponse<AccountHealthScore[]>> {
    await delay(200);
    let items = [...mockData.accountHealthScores];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (h) => h.accountName.toLowerCase().includes(q) || h.ownerName.toLowerCase().includes(q)
      );
    }
    if (filters?.level) {
      items = items.filter((h) => h.level === filters.level);
    }
    if (filters?.tier) {
      items = items.filter((h) => h.accountTier === filters.tier);
    }
    if (filters?.ownerId) {
      items = items.filter((h) => h.ownerId === filters.ownerId);
    }
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'score_asc':
          items.sort((a, b) => a.overallScore - b.overallScore);
          break;
        case 'score_desc':
          items.sort((a, b) => b.overallScore - a.overallScore);
          break;
        case 'mrr_desc':
          items.sort((a, b) => b.mrr - a.mrr);
          break;
        case 'contract_end':
          items.sort((a, b) => a.contractEndDate.localeCompare(b.contractEndDate));
          break;
        case 'days_since_contact':
          items.sort((a, b) => b.daysSinceLastContact - a.daysSinceLastContact);
          break;
      }
    }

    return { isSuccess: true, data: items, message: 'Health scores carregados' };
  },

  async getAccountHealth(accountId: string): Promise<ApiResponse<AccountHealthScore | null>> {
    await delay(150);
    const found = mockData.accountHealthScores.find((h) => h.accountId === accountId) || null;
    return { isSuccess: true, data: found, message: found ? 'Health score encontrado' : 'Conta não encontrada' };
  },

  async getAccountHealthHistory(accountId: string): Promise<ApiResponse<AccountHealthHistory[]>> {
    await delay(150);
    const history = mockData.accountHealthHistory[accountId] || [];
    return { isSuccess: true, data: history, message: 'Histórico carregado' };
  },

  async listAlerts(): Promise<ApiResponse<CsAlert[]>> {
    await delay(120);
    return { isSuccess: true, data: mockData.csAlerts, message: 'Alertas carregados' };
  },

  async acknowledgeAlert(alertId: string): Promise<ApiResponse<CsAlert>> {
    await delay(100);
    const alert = mockData.csAlerts.find((a) => a.id === alertId);
    if (!alert) throw new Error('Alerta não encontrado');
    alert.acknowledged = true;
    return { isSuccess: true, data: alert, message: 'Alerta confirmado' };
  },

  async listPlaybooks(): Promise<ApiResponse<CsPlaybook[]>> {
    await delay(100);
    return { isSuccess: true, data: mockData.csPlaybooks, message: 'Playbooks carregados' };
  },
};

// ============================================================================
// UTILITY
// ============================================================================

export const mockApi = {
  contacts: contactsApi,
  accounts: accountsApi,
  deals: dealsApi,
  leads: leadsApi,
  nurtureSequences: nurtureSequencesApi,
  analytics: analyticsApi,
  reports: reportsApi,
  reportSchedules: reportSchedulesApi,
  exports: exportsApi,
  biConnectors: biConnectorsApi,
  billingInvoices: billingInvoicesApi,
  payments: paymentsApi,
  receivables: receivablesApi,
  collections: collectionsApi,
  paymentGateways: paymentGatewaysApi,
  compliance: complianceApi,
  access: accessApi,
  pipelines: pipelinesApi,
  activities: activitiesApi,
  users: usersApi,
  saasMetrics: saasMetricsApi,
  customerSuccess: customerSuccessApi,
  products: productsApi,
  proposals: proposalsApi,
  contracts: contractsApi,
  projects: projectsApi,
  integrations: integrationsApi,
  sso: ssoApi,
  resetData: () => MockStorage.reset(),
};

export default mockApi;
