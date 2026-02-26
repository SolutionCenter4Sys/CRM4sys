// App.tsx - Aplicação Principal
import React, { Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Divider,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
  Popover,
  MenuList,
  MenuItem,
  Drawer,
  useMediaQuery,
  useTheme as useMuiTheme,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  HomeOutlined as HomeOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  BusinessOutlined as BusinessOutlinedIcon,
  WorkOutline as WorkOutlineIcon,
  TrackChangesOutlined as TrackChangesOutlinedIcon,
  InsightsOutlined as InsightsOutlinedIcon,
  AutoAwesomeMotionOutlined as AutoAwesomeMotionOutlinedIcon,
  Search as SearchIcon,
  SpaceDashboardOutlined as SpaceDashboardOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  EventRepeatOutlined as EventRepeatOutlinedIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  HubOutlined as HubOutlinedIcon,
  ReceiptLongOutlined as ReceiptLongOutlinedIcon,
  GavelOutlined as GavelOutlinedIcon,
  RequestQuoteOutlined as RequestQuoteOutlinedIcon,
  WebhookOutlined as WebhookOutlinedIcon,
  AdminPanelSettingsOutlined as AdminPanelSettingsOutlinedIcon,
  PolicyOutlined as PolicyOutlinedIcon,
  GroupWorkOutlined as GroupWorkOutlinedIcon,
  VerifiedUserOutlined as VerifiedUserOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  Inventory2Outlined as Inventory2OutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  ArticleOutlined as ArticleOutlinedIcon,
  RocketLaunchOutlined as RocketLaunchOutlinedIcon,
  ExtensionOutlined as ExtensionOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  Menu as MenuIcon,
  AccountBalanceOutlined as AccountBalanceOutlinedIcon,
  RequestQuote as RequestQuoteIcon,
  CreditCardOutlined as CreditCardOutlinedIcon,
} from '@mui/icons-material';
import { createAppTheme } from './styles/theme';
import CommandPalette from './components/CommandPalette';
import NotificationCenter from './components/NotificationCenter';

// ── Theme Context ─────────────────────────────────────────────────────────────
interface ThemeCtx { mode: 'light' | 'dark'; toggle: () => void }
const ThemeContext = createContext<ThemeCtx>({ mode: 'light', toggle: () => {} });
export const useAppTheme = () => useContext(ThemeContext);
import { appendRoutePerfMetric } from './utils/perf';
import { mockApi } from './mock/api';

const importDashboardExecutivePage = () => import('./pages/DashboardExecutivePage');
const importDashboardAnalyticsPage = () => import('./pages/DashboardAnalyticsPage');
const importContactsListPage = () => import('./pages/ContactsListPage');
const importContactDetailPage = () => import('./pages/ContactDetailPageModel');
const importAccountsListPage = () => import('./pages/AccountsListPage');
const importAccountDetailPage = () => import('./pages/AccountDetailPage');
const importDealsPipelinePage = () => import('./pages/DealsPipelinePage');
const importDealDetailPage = () => import('./pages/DealDetailPage');
const importActivitiesTimelinePage = () => import('./pages/ActivitiesTimelinePage');
const importLeadsListPage = () => import('./pages/LeadsListPage');
const importLeadDetailPage = () => import('./pages/LeadDetailPage');
const importLifecycleFunnelPage = () => import('./pages/LifecycleFunnelPage');
const importNurtureSequencesPage = () => import('./pages/NurtureSequencesPage');
const importReportsPage = () => import('./pages/ReportsPage');
const importReportBuilderPage = () => import('./pages/ReportBuilderPage');
const importScheduledReportsPage = () => import('./pages/ScheduledReportsPage');
const importExportsPage = () => import('./pages/ExportsPage');
const importBIConnectorsPage = () => import('./pages/BIConnectorsPage');
const importInvoicesListPage = () => import('./pages/InvoicesListPage');
const importInvoiceDetailPage = () => import('./pages/InvoiceDetailPage');
const importInvoiceFormPage = () => import('./pages/InvoiceFormPage');
const importCollectionRulesPage = () => import('./pages/CollectionRulesPage');
const importCollectionTemplatesPage = () => import('./pages/CollectionTemplatesPage');
const importCollectionJobsPage = () => import('./pages/CollectionJobsPage');
const importReceivablesDashboardPage = () => import('./pages/ReceivablesDashboardPage');
const importPaymentGatewaysPage = () => import('./pages/PaymentGatewaysPage');
const importPaymentLinksPage = () => import('./pages/PaymentLinksPage');
const importWebhookEventsPage = () => import('./pages/WebhookEventsPage');
const importPermissionsMatrixPage = () => import('./pages/PermissionsMatrixPage');
const importAuditTrailPage = () => import('./pages/AuditTrailPage');
const importComplianceExportsPage = () => import('./pages/ComplianceExportsPage');
const importAccessGroupsPage = () => import('./pages/AccessGroupsPage');
const importUsersManagementPage = () => import('./pages/UsersManagementPage');
const importAccessUserAccessPage = () => import('./pages/AccessUserAccessPage');
const importAccessApprovalsPage = () => import('./pages/AccessApprovalsPage');
const importAccessAuditReportsPage = () => import('./pages/AccessAuditReportsPage');
const importCustomerSuccessPage = () => import('./pages/CustomerSuccessPage');
const importAccountHealthDetailPage = () => import('./pages/AccountHealthDetailPage');
const importProductCatalogPage = () => import('./pages/ProductCatalogPage');
const importProposalsPage = () => import('./pages/ProposalsPage');
const importContractsPage = () => import('./pages/ContractsPage');
const importProjectsPage = () => import('./pages/ProjectsPage');
const importProjectDetailPage = () => import('./pages/ProjectDetailPage');
const importIntegrationsPage = () => import('./pages/IntegrationsPage');
const importSsoConfigPage = () => import('./pages/SsoConfigPage');

const DashboardExecutivePage = lazy(importDashboardExecutivePage);
const DashboardAnalyticsPage = lazy(importDashboardAnalyticsPage);
const ContactsListPage = lazy(importContactsListPage);
const ContactDetailPage = lazy(importContactDetailPage);
const AccountsListPage = lazy(importAccountsListPage);
const AccountDetailPage = lazy(importAccountDetailPage);
const DealsPipelinePage = lazy(importDealsPipelinePage);
const DealDetailPage = lazy(importDealDetailPage);
const ActivitiesTimelinePage = lazy(importActivitiesTimelinePage);
const LeadsListPage = lazy(importLeadsListPage);
const LeadDetailPage = lazy(importLeadDetailPage);
const LifecycleFunnelPage = lazy(importLifecycleFunnelPage);
const NurtureSequencesPage = lazy(importNurtureSequencesPage);
const ReportsPage = lazy(importReportsPage);
const ReportBuilderPage = lazy(importReportBuilderPage);
const ScheduledReportsPage = lazy(importScheduledReportsPage);
const ExportsPage = lazy(importExportsPage);
const BIConnectorsPage = lazy(importBIConnectorsPage);
const InvoicesListPage = lazy(importInvoicesListPage);
const InvoiceDetailPage = lazy(importInvoiceDetailPage);
const InvoiceFormPage = lazy(importInvoiceFormPage);
const CollectionRulesPage = lazy(importCollectionRulesPage);
const CollectionTemplatesPage = lazy(importCollectionTemplatesPage);
const CollectionJobsPage = lazy(importCollectionJobsPage);
const ReceivablesDashboardPage = lazy(importReceivablesDashboardPage);
const PaymentGatewaysPage = lazy(importPaymentGatewaysPage);
const PaymentLinksPage = lazy(importPaymentLinksPage);
const WebhookEventsPage = lazy(importWebhookEventsPage);
const PermissionsMatrixPage = lazy(importPermissionsMatrixPage);
const AuditTrailPage = lazy(importAuditTrailPage);
const ComplianceExportsPage = lazy(importComplianceExportsPage);
const AccessGroupsPage = lazy(importAccessGroupsPage);
const UsersManagementPage = lazy(importUsersManagementPage);
const AccessUserAccessPage = lazy(importAccessUserAccessPage);
const AccessApprovalsPage = lazy(importAccessApprovalsPage);
const AccessAuditReportsPage = lazy(importAccessAuditReportsPage);
const CustomerSuccessPage = lazy(importCustomerSuccessPage);
const AccountHealthDetailPage = lazy(importAccountHealthDetailPage);
const ProductCatalogPage = lazy(importProductCatalogPage);
const ProposalsPage = lazy(importProposalsPage);
const ContractsPage = lazy(importContractsPage);
const ProjectsPage = lazy(importProjectsPage);
const ProjectDetailPage = lazy(importProjectDetailPage);
const IntegrationsPage = lazy(importIntegrationsPage);
const SsoConfigPage = lazy(importSsoConfigPage);

const preloadedRoutes = new Set<string>();

const prefetchRoute = (routeKey: string, importer: () => Promise<unknown>) => {
  if (preloadedRoutes.has(routeKey)) return;
  preloadedRoutes.add(routeKey);
  importer().catch(() => {
    preloadedRoutes.delete(routeKey);
  });
};

type RoutePrefetchItem = {
  key: string;
  importer: () => Promise<unknown>;
};

const PREFETCH_PRIORITY_BY_ROUTE: Record<string, RoutePrefetchItem[]> = {
  '/dashboard': [
    { key: 'dashboard-analytics', importer: importDashboardAnalyticsPage },
    { key: 'reports', importer: importReportsPage },
    { key: 'deals', importer: importDealsPipelinePage },
    { key: 'contacts', importer: importContactsListPage },
    { key: 'activities', importer: importActivitiesTimelinePage },
  ],
  '/dashboard/analytics': [
    { key: 'dashboard', importer: importDashboardExecutivePage },
    { key: 'reports', importer: importReportsPage },
    { key: 'deals', importer: importDealsPipelinePage },
    { key: 'activities', importer: importActivitiesTimelinePage },
  ],
  '/reports': [
    { key: 'report-builder', importer: importReportBuilderPage },
    { key: 'scheduled-reports', importer: importScheduledReportsPage },
    { key: 'exports', importer: importExportsPage },
    { key: 'bi-connectors', importer: importBIConnectorsPage },
  ],
  '/reports/scheduled': [
    { key: 'reports', importer: importReportsPage },
    { key: 'exports', importer: importExportsPage },
  ],
  '/exports': [
    { key: 'reports', importer: importReportsPage },
    { key: 'bi-connectors', importer: importBIConnectorsPage },
  ],
  '/bi/connectors': [
    { key: 'exports', importer: importExportsPage },
    { key: 'reports', importer: importReportsPage },
  ],
  '/billing/invoices': [
    { key: 'invoice-new', importer: importInvoiceFormPage },
    { key: 'collections-rules', importer: importCollectionRulesPage },
    { key: 'receivables-dashboard', importer: importReceivablesDashboardPage },
  ],
  '/billing/collections/rules': [
    { key: 'collections-templates', importer: importCollectionTemplatesPage },
    { key: 'collections-jobs', importer: importCollectionJobsPage },
  ],
  '/billing/gateways': [
    { key: 'payment-links', importer: importPaymentLinksPage },
    { key: 'webhook-events', importer: importWebhookEventsPage },
  ],
  '/billing/permissions': [
    { key: 'audit-trail', importer: importAuditTrailPage },
    { key: 'compliance-exports', importer: importComplianceExportsPage },
  ],
  '/access/groups': [
    { key: 'access-users', importer: importUsersManagementPage },
    { key: 'access-approvals', importer: importAccessApprovalsPage },
  ],
  '/access/users': [
    { key: 'access-groups', importer: importAccessGroupsPage },
    { key: 'access-user-detail', importer: importAccessUserAccessPage },
  ],
  '/access/user': [
    { key: 'access-users', importer: importUsersManagementPage },
    { key: 'access-user-detail', importer: importAccessUserAccessPage },
  ],
  '/access/user/detail': [
    { key: 'access-users', importer: importUsersManagementPage },
    { key: 'access-groups', importer: importAccessGroupsPage },
  ],
  '/access/approvals': [
    { key: 'access-user', importer: importAccessUserAccessPage },
    { key: 'access-audit', importer: importAccessAuditReportsPage },
  ],
  '/access/audit': [
    { key: 'access-groups', importer: importAccessGroupsPage },
    { key: 'access-approvals', importer: importAccessApprovalsPage },
  ],
  '/cs': [
    { key: 'dashboard', importer: importDashboardExecutivePage },
    { key: 'accounts', importer: importAccountsListPage },
  ],
  '/products': [
    { key: 'proposals', importer: importProposalsPage },
    { key: 'contracts', importer: importContractsPage },
  ],
  '/proposals': [
    { key: 'products', importer: importProductCatalogPage },
    { key: 'contracts', importer: importContractsPage },
    { key: 'deals', importer: importDealsPipelinePage },
  ],
  '/contracts': [
    { key: 'proposals', importer: importProposalsPage },
    { key: 'customer-success', importer: importCustomerSuccessPage },
    { key: 'accounts', importer: importAccountsListPage },
  ],
  '/projects': [
    { key: 'contracts', importer: importContractsPage },
    { key: 'customer-success', importer: importCustomerSuccessPage },
  ],
  '/settings/integrations': [
    { key: 'sso', importer: importSsoConfigPage },
  ],
  '/settings/sso': [
    { key: 'integrations', importer: importIntegrationsPage },
    { key: 'access-users', importer: importUsersManagementPage },
  ],
  '/deals': [
    { key: 'dashboard', importer: importDashboardExecutivePage },
    { key: 'accounts', importer: importAccountsListPage },
    { key: 'activities', importer: importActivitiesTimelinePage },
  ],
  '/leads': [
    { key: 'lifecycle-funnel', importer: importLifecycleFunnelPage },
    { key: 'nurture-sequences', importer: importNurtureSequencesPage },
    { key: 'contacts', importer: importContactsListPage },
    { key: 'dashboard', importer: importDashboardExecutivePage },
  ],
  '/lifecycle': [
    { key: 'leads', importer: importLeadsListPage },
    { key: 'dashboard', importer: importDashboardExecutivePage },
    { key: 'deals', importer: importDealsPipelinePage },
  ],
  '/nurture': [
    { key: 'leads', importer: importLeadsListPage },
    { key: 'lifecycle-funnel', importer: importLifecycleFunnelPage },
    { key: 'dashboard', importer: importDashboardExecutivePage },
  ],
  '/contacts': [
    { key: 'accounts', importer: importAccountsListPage },
    { key: 'deals', importer: importDealsPipelinePage },
    { key: 'dashboard', importer: importDashboardExecutivePage },
  ],
  '/accounts': [
    { key: 'contacts', importer: importContactsListPage },
    { key: 'deals', importer: importDealsPipelinePage },
    { key: 'dashboard', importer: importDashboardExecutivePage },
  ],
  '/activities': [
    { key: 'dashboard', importer: importDashboardExecutivePage },
    { key: 'deals', importer: importDealsPipelinePage },
    { key: 'contacts', importer: importContactsListPage },
  ],
};

const scheduleIdle = (callback: () => void) => {
  const win = globalThis as Window & typeof globalThis;
  if ('requestIdleCallback' in win) {
    const id = win.requestIdleCallback(callback, { timeout: 1200 });
    return () => win.cancelIdleCallback(id);
  }
  const id = globalThis.setTimeout(callback, 200);
  return () => globalThis.clearTimeout(id);
};

const RoutePrefetcher: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const items =
      PREFETCH_PRIORITY_BY_ROUTE[location.pathname] ||
      PREFETCH_PRIORITY_BY_ROUTE['/dashboard'];

    const cancel = scheduleIdle(() => {
      items.forEach((item) => prefetchRoute(item.key, item.importer));
    });

    return cancel;
  }, [location.pathname]);

  return null;
};

const RoutePerfTracker: React.FC = () => {
  const location = useLocation();
  const previousPathRef = React.useRef(location.pathname);

  React.useEffect(() => {
    const from = previousPathRef.current;
    const to = location.pathname;
    const start = performance.now();

    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const durationMs = performance.now() - start;
        appendRoutePerfMetric({
          from,
          to,
          durationMs,
          timestamp: Date.now(),
        });
      });
    });

    previousPathRef.current = location.pathname;

    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [location.pathname]);

  return null;
};

// ── SidebarContent ───────────────────────────────────────────────────────────
interface SidebarContentProps {
  isActiveRoute: (to: string) => boolean;
  settingsOpen: boolean;
  settingsAnchorEl: HTMLElement | null;
  setSettingsAnchorEl: (el: HTMLElement | null) => void;
  onNavClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isActiveRoute,
  settingsOpen,
  settingsAnchorEl,
  setSettingsAnchorEl,
  onNavClick,
}) => {
  const [financialAnchorEl, setFinancialAnchorEl] = useState<HTMLElement | null>(null);
  const financialOpen = Boolean(financialAnchorEl);

  const close = (el: null) => { setSettingsAnchorEl(el); onNavClick?.(); };
  const closeFinancial = () => { setFinancialAnchorEl(null); onNavClick?.(); };

  const isFinancialActive = ['/billing'].some((p) => isActiveRoute(p));

  const financialItems = [
    { label: 'Faturas', sublabel: 'Emitir e gerenciar faturas', to: '/billing/invoices', icon: <ReceiptLongOutlinedIcon fontSize="small" />, prefetchKey: 'billing-invoices', importer: importInvoicesListPage },
    { label: 'Recebíveis', sublabel: 'Dashboard de recebimentos', to: '/billing/receivables', icon: <RequestQuoteIcon fontSize="small" />, prefetchKey: 'receivables-dashboard', importer: importReceivablesDashboardPage },
    { label: 'Régua de Cobrança', sublabel: 'Automação de cobranças', to: '/billing/collections/rules', icon: <GavelOutlinedIcon fontSize="small" />, prefetchKey: 'collections-rules', importer: importCollectionRulesPage },
    { label: 'Gateways de Pagamento', sublabel: 'Configurar meios de pagamento', to: '/billing/gateways', icon: <CreditCardOutlinedIcon fontSize="small" />, prefetchKey: 'payment-gateways', importer: importPaymentGatewaysPage },
  ];

  return (
    <Box
      sx={{
        width: 76,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 40%, #5B0D5A 100%)',
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1.5,
        gap: 1.2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 0.5 }}>CRM</Typography>
      <Tooltip title="Dashboard"><IconButton component={NavLink} to="/dashboard" onClick={onNavClick} onMouseEnter={() => prefetchRoute('dashboard', importDashboardExecutivePage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/dashboard') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><HomeOutlinedIcon /></IconButton></Tooltip>
      <Divider sx={{ width: 28, borderColor: 'rgba(255,255,255,0.4)' }} />
      <Tooltip title="Empresas"><IconButton component={NavLink} to="/accounts" onClick={onNavClick} onMouseEnter={() => prefetchRoute('accounts', importAccountsListPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/accounts') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><BusinessOutlinedIcon /></IconButton></Tooltip>
      <Tooltip title="Contatos"><IconButton component={NavLink} to="/contacts" onClick={onNavClick} onMouseEnter={() => prefetchRoute('contacts', importContactsListPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/contacts') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><ContactsOutlinedIcon /></IconButton></Tooltip>
      <Tooltip title="Negócios"><IconButton component={NavLink} to="/deals" onClick={onNavClick} onMouseEnter={() => prefetchRoute('deals', importDealsPipelinePage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/deals') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><WorkOutlineIcon /></IconButton></Tooltip>
      <Tooltip title="Leads"><IconButton component={NavLink} to="/leads" onClick={onNavClick} onMouseEnter={() => prefetchRoute('leads', importLeadsListPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/leads') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><TrackChangesOutlinedIcon /></IconButton></Tooltip>
      <Tooltip title="Feed de Atividades"><IconButton component={NavLink} to="/activities" onClick={onNavClick} onMouseEnter={() => prefetchRoute('activities', importActivitiesTimelinePage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/activities') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><TimelineOutlinedIcon /></IconButton></Tooltip>
      <Divider sx={{ width: 28, borderColor: 'rgba(255,255,255,0.4)' }} />

      <Tooltip title="Propostas"><IconButton component={NavLink} to="/proposals" onClick={onNavClick} onMouseEnter={() => prefetchRoute('proposals', importProposalsPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/proposals') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><DescriptionOutlinedIcon /></IconButton></Tooltip>
      <Tooltip title="Contratos"><IconButton component={NavLink} to="/contracts" onClick={onNavClick} onMouseEnter={() => prefetchRoute('contracts', importContractsPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/contracts') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><ArticleOutlinedIcon /></IconButton></Tooltip>

      {/* ── Ícone Financeiro com flyout ─────────────────────────────── */}
      <Tooltip title="Financeiro" placement="right">
        <IconButton
          onClick={(e) => setFinancialAnchorEl(e.currentTarget)}
          sx={{
            color: 'inherit',
            bgcolor: isFinancialActive || financialOpen ? 'rgba(255,255,255,0.18)' : 'transparent',
            border: isFinancialActive ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          <AccountBalanceOutlinedIcon />
        </IconButton>
      </Tooltip>

      {/* Flyout financeiro */}
      <Popover
        open={financialOpen}
        anchorEl={financialAnchorEl}
        onClose={() => setFinancialAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        PaperProps={{
          sx: {
            ml: 1,
            borderRadius: 2.5,
            minWidth: 280,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header do flyout */}
        <Box sx={{ px: 2, py: 1.5, background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>Financeiro</Typography>
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.75, fontSize: 11 }}>
            Faturas, cobranças e recebimentos
          </Typography>
        </Box>

        {/* Itens do flyout */}
        <MenuList dense sx={{ py: 0.5 }}>
          {financialItems.map((item, idx) => (
            <React.Fragment key={item.to}>
              <MenuItem
                component={NavLink}
                to={item.to}
                onClick={closeFinancial}
                onMouseEnter={() => prefetchRoute(item.prefetchKey, item.importer)}
                selected={isActiveRoute(item.to)}
                sx={{
                  py: 1.2,
                  px: 2,
                  '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main' },
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ color: isActiveRoute(item.to) ? 'primary.main' : 'text.secondary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{item.sublabel}</Typography>
                </Box>
              </MenuItem>
              {idx < financialItems.length - 1 && <Divider sx={{ mx: 1.5 }} />}
            </React.Fragment>
          ))}
        </MenuList>
      </Popover>

      <Divider sx={{ width: 28, borderColor: 'rgba(255,255,255,0.4)' }} />
      <Tooltip title="Relatórios"><IconButton component={NavLink} to="/reports" onClick={onNavClick} onMouseEnter={() => prefetchRoute('reports', importReportsPage)} sx={{ color: 'inherit', bgcolor: isActiveRoute('/reports') || isActiveRoute('/exports') ? 'rgba(255,255,255,0.18)' : 'transparent' }}><AssessmentOutlinedIcon /></IconButton></Tooltip>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ width: 28, borderColor: 'rgba(255,255,255,0.4)' }} />
      <Tooltip title="Configurações">
        <IconButton onClick={(e) => setSettingsAnchorEl(e.currentTarget)} sx={{ color: 'inherit', mb: 0.5, bgcolor: settingsOpen ? 'rgba(255,255,255,0.18)' : 'transparent' }}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover open={settingsOpen} anchorEl={settingsAnchorEl} onClose={() => setSettingsAnchorEl(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }} PaperProps={{ sx: { borderRadius: 2, minWidth: 220, boxShadow: 6 } }}>
        <MenuList dense sx={{ py: 1 }}>
          <MenuItem component={NavLink} to="/products" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('products', importProductCatalogPage)}><ListItemIcon><Inventory2OutlinedIcon fontSize="small" /></ListItemIcon>Produtos & Serviços</MenuItem>
          <MenuItem component={NavLink} to="/projects" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('projects', importProjectsPage)}><ListItemIcon><RocketLaunchOutlinedIcon fontSize="small" /></ListItemIcon>Projetos & Delivery</MenuItem>
          <MenuItem component={NavLink} to="/cs" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('customer-success', importCustomerSuccessPage)}><ListItemIcon><FavoriteBorderOutlinedIcon fontSize="small" /></ListItemIcon>Customer Success</MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {/* Seção Automações */}
          <Box component="li" sx={{ px: 2, pt: 0.5, pb: 0.2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', textTransform: 'uppercase' }}>
              Automações
            </Typography>
          </Box>
          <MenuItem component={NavLink} to="/nurture" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('nurture-sequences', importNurtureSequencesPage)}><ListItemIcon><AutoAwesomeMotionOutlinedIcon fontSize="small" /></ListItemIcon>Nurture Sequences</MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {/* Seção Analytics */}
          <Box component="li" sx={{ px: 2, pt: 0.5, pb: 0.2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', textTransform: 'uppercase' }}>
              Analytics
            </Typography>
          </Box>
          <MenuItem component={NavLink} to="/reports/scheduled" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('scheduled-reports', importScheduledReportsPage)}><ListItemIcon><EventRepeatOutlinedIcon fontSize="small" /></ListItemIcon>Relatórios Agendados</MenuItem>
          <MenuItem component={NavLink} to="/exports" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('exports', importExportsPage)}><ListItemIcon><FileDownloadOutlinedIcon fontSize="small" /></ListItemIcon>Exportações</MenuItem>
          <MenuItem component={NavLink} to="/bi/connectors" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('bi-connectors', importBIConnectorsPage)}><ListItemIcon><HubOutlinedIcon fontSize="small" /></ListItemIcon>BI Connectors</MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {/* Seção Acesso */}
          <Box component="li" sx={{ px: 2, pt: 0.5, pb: 0.2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', textTransform: 'uppercase' }}>
              Acesso & Segurança
            </Typography>
          </Box>
          <MenuItem component={NavLink} to="/access/users" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('access-users', importUsersManagementPage)}><ListItemIcon><PeopleOutlinedIcon fontSize="small" /></ListItemIcon>IAM · Usuários</MenuItem>
          <MenuItem component={NavLink} to="/access/groups" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('access-groups', importAccessGroupsPage)}><ListItemIcon><GroupWorkOutlinedIcon fontSize="small" /></ListItemIcon>IAM · Grupos</MenuItem>
          <MenuItem component={NavLink} to="/access/approvals" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('access-approvals', importAccessApprovalsPage)}><ListItemIcon><VerifiedUserOutlinedIcon fontSize="small" /></ListItemIcon>IAM · Aprovações</MenuItem>
          <MenuItem component={NavLink} to="/billing/permissions" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('permissions-matrix', importPermissionsMatrixPage)}><ListItemIcon><AdminPanelSettingsOutlinedIcon fontSize="small" /></ListItemIcon>Permissões</MenuItem>
          <MenuItem component={NavLink} to="/billing/audit" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('audit-trail', importAuditTrailPage)}><ListItemIcon><PolicyOutlinedIcon fontSize="small" /></ListItemIcon>Auditoria</MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {/* Seção Integrações */}
          <Box component="li" sx={{ px: 2, pt: 0.5, pb: 0.2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', textTransform: 'uppercase' }}>
              Integrações
            </Typography>
          </Box>
          <MenuItem component={NavLink} to="/settings/integrations" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('integrations', importIntegrationsPage)}><ListItemIcon><ExtensionOutlinedIcon fontSize="small" /></ListItemIcon>Integrações & Plugins</MenuItem>
          <MenuItem component={NavLink} to="/settings/sso" onClick={() => close(null)} onMouseEnter={() => prefetchRoute('sso', importSsoConfigPage)}><ListItemIcon><LockOutlinedIcon fontSize="small" /></ListItemIcon>SSO / SAML</MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggle: toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; label: string; subtitle: string; to: string; type: string }>
  >([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchReqId = useRef(0);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<HTMLElement | null>(null);
  const settingsOpen = Boolean(settingsAnchorEl);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const isActiveRoute = (to: string) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const currentReqId = ++searchReqId.current;
    const timer = window.setTimeout(async () => {
      try {
        const [contactsRes, accountsRes, dealsRes, leadsRes] = await Promise.all([
          mockApi.contacts.list({ search: query }, 1, 5),
          mockApi.accounts.search(query),
          mockApi.deals.list(),
          mockApi.leads.list({ search: query }, 1, 5),
        ]);

        if (currentReqId !== searchReqId.current) return;

        const queryLower = query.toLowerCase();

        const contactItems = (contactsRes.data?.data || []).slice(0, 4).map((contact) => ({
          id: `contact-${contact.id}`,
          label: contact.fullName,
          subtitle: `Contato • ${contact.email}`,
          to: `/contacts/${contact.id}`,
          type: 'Contato',
        }));

        const accountItems = (accountsRes.data || []).slice(0, 4).map((account) => ({
          id: `account-${account.id}`,
          label: account.name,
          subtitle: `Empresa • ${account.domain || 'sem domínio'}`,
          to: `/accounts/${account.id}`,
          type: 'Empresa',
        }));

        const dealItems = (dealsRes.data || [])
          .filter(
            (deal) =>
              deal.title.toLowerCase().includes(queryLower) ||
              deal.account?.name?.toLowerCase().includes(queryLower)
          )
          .slice(0, 4)
          .map((deal) => ({
            id: `deal-${deal.id}`,
            label: deal.title,
            subtitle: `Negócio • ${deal.account?.name || 'sem empresa'}`,
            to: `/deals/${deal.id}`,
            type: 'Negócio',
          }));

        const leadItems = (leadsRes.data?.data || []).slice(0, 4).map((lead) => ({
          id: `lead-${lead.id}`,
          label: lead.fullName,
          subtitle: `Lead • ${lead.email}`,
          to: `/leads/${lead.id}`,
          type: 'Lead',
        }));

        const merged = [...contactItems, ...accountItems, ...dealItems, ...leadItems].slice(0, 10);
        setSearchResults(merged);
        setSearchOpen(merged.length > 0);
      } catch {
        if (currentReqId !== searchReqId.current) return;
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 220);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectSearchResult = (to: string) => {
    navigate(to);
    setSearchTerm('');
    setSearchOpen(false);
    setSearchResults([]);
  };

  return (
    <>
      <RoutePrefetcher />
      <RoutePerfTracker />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* ── Sidebar mobile (Drawer) ──────────────────────────────────────── */}
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 76, boxSizing: 'border-box' } }}
        >
          <SidebarContent
            isActiveRoute={isActiveRoute}
            settingsOpen={settingsOpen}
            settingsAnchorEl={settingsAnchorEl}
            setSettingsAnchorEl={(el) => { setSettingsAnchorEl(el); if (!el) setMobileDrawerOpen(false); }}
            onNavClick={() => setMobileDrawerOpen(false)}
          />
        </Drawer>

        {/* ── Sidebar desktop (fixo) ──────────────────────────────────────── */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SidebarContent isActiveRoute={isActiveRoute} settingsOpen={settingsOpen} settingsAnchorEl={settingsAnchorEl} setSettingsAnchorEl={setSettingsAnchorEl} />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              height: 56,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton onClick={() => setMobileDrawerOpen(true)} size="small">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                CRM Foursys • Mock
              </Typography>
            </Box>
            <Box
              onClick={() => setCmdPaletteOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                width: { xs: 200, md: 300 },
                color: 'text.secondary',
                bgcolor: 'action.hover',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'background.paper' },
              }}
            >
              <SearchIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.disabled' }}>
                Pesquisar ou navegar…
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Chip
                  label="Ctrl"
                  size="small"
                  sx={{ height: 20, fontSize: 10, fontFamily: 'monospace', bgcolor: 'background.default' }}
                />
                <Chip
                  label="K"
                  size="small"
                  sx={{ height: 20, fontSize: 10, fontFamily: 'monospace', bgcolor: 'background.default' }}
                />
              </Box>
              </Box>
              <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
                <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
              <NotificationCenter />
            </Box>

          <Suspense
            fallback={
              <Box
                sx={{
                  minHeight: '60vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardExecutivePage />} />
              <Route path="/dashboard/analytics" element={<DashboardAnalyticsPage />} />
              <Route path="/contacts" element={<ContactsListPage />} />
              <Route path="/contacts/:id" element={<ContactDetailPage />} />
              <Route path="/accounts" element={<AccountsListPage />} />
              <Route path="/accounts/:id" element={<AccountDetailPage />} />
              <Route path="/deals" element={<DealsPipelinePage />} />
              <Route path="/deals/:id" element={<DealDetailPage />} />
              <Route path="/leads" element={<LeadsListPage />} />
              <Route path="/leads/:id" element={<LeadDetailPage />} />
              <Route path="/lifecycle" element={<LifecycleFunnelPage />} />
              <Route path="/nurture" element={<NurtureSequencesPage />} />
              <Route path="/activities" element={<ActivitiesTimelinePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/new" element={<ReportBuilderPage />} />
              <Route path="/reports/:id" element={<ReportBuilderPage />} />
              <Route path="/reports/scheduled" element={<ScheduledReportsPage />} />
              <Route path="/exports" element={<ExportsPage />} />
              <Route path="/bi/connectors" element={<BIConnectorsPage />} />
              <Route path="/billing/invoices" element={<InvoicesListPage />} />
              <Route path="/billing/invoices/new" element={<InvoiceFormPage />} />
              <Route path="/billing/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/billing/collections/rules" element={<CollectionRulesPage />} />
              <Route path="/billing/collections/templates" element={<CollectionTemplatesPage />} />
              <Route path="/billing/collections/jobs" element={<CollectionJobsPage />} />
              <Route path="/billing/receivables" element={<ReceivablesDashboardPage />} />
              <Route path="/billing/gateways" element={<PaymentGatewaysPage />} />
              <Route path="/billing/payment-links" element={<PaymentLinksPage />} />
              <Route path="/billing/webhooks" element={<WebhookEventsPage />} />
              <Route path="/billing/permissions" element={<PermissionsMatrixPage />} />
              <Route path="/billing/audit" element={<AuditTrailPage />} />
              <Route path="/billing/compliance-exports" element={<ComplianceExportsPage />} />
              <Route path="/access/users" element={<UsersManagementPage />} />
              <Route path="/access/groups" element={<AccessGroupsPage />} />
              <Route path="/access/user" element={<Navigate to="/access/users" replace />} />
              <Route path="/access/user/detail" element={<AccessUserAccessPage />} />
              <Route path="/access/approvals" element={<AccessApprovalsPage />} />
              <Route path="/access/audit" element={<AccessAuditReportsPage />} />
              <Route path="/cs" element={<CustomerSuccessPage />} />
              <Route path="/cs/:id" element={<AccountHealthDetailPage />} />
              <Route path="/products" element={<ProductCatalogPage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/settings/integrations" element={<IntegrationsPage />} />
              <Route path="/settings/sso" element={<SsoConfigPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
      <CommandPalette open={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
    </>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('crm-theme') as 'light' | 'dark') || 'light';
  });

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('crm-theme', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;