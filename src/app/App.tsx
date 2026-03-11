import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { AssetProvider } from './context/AssetContext';
import { UserProvider } from './context/UserContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { LayerProvider } from './context/LayerContext';
import { CollaborationProvider, useCollaboration } from './context/CollaborationContext';
import { ConfirmationProvider } from './context/ConfirmationContext';
import { SearchProvider } from './context/SearchContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AIOracle } from './components/AIOracle';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/toaster';
import { DataAnnotationToolbar } from './components/collaboration/DataAnnotationToolbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalSearch } from './components/GlobalSearch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { ExecutiveDashboard } from './screens/ExecutiveDashboard';
import { DataHealth } from './screens/DataHealth';
import DataCompleteness from './screens/DataCompleteness';
import WellData from './screens/WellData';
import PetrophysicalLogs from './screens/PetrophysicalLogs';
import GeologicalInterpretations from './screens/GeologicalInterpretations';
import GeophysicalData from './screens/GeophysicalData';
import ProductionHistory from './screens/ProductionHistory';
import { HistoryMatching } from './screens/HistoryMatching';
import { Uncertainty } from './screens/Uncertainty';
import { SubsurfaceUncertainty } from './screens/SubsurfaceUncertainty';
import { OperationalUncertainty } from './screens/OperationalUncertainty';
import { CrossDomainUncertainty } from './screens/CrossDomainUncertainty';
import { MarketVolatility } from './screens/MarketVolatility';
import { Insights } from './screens/Insights';
import { DeepDiveAnalytics } from './screens/DeepDiveAnalytics';
import { MultidisciplinaryWorkflow } from './screens/MultidisciplinaryWorkflow';
import { GovernanceAudit } from './screens/GovernanceAudit';
import { DecisionApproval } from './screens/DecisionApproval';
import { FDPSummary } from './screens/FDPSummary';
import { AIAgentsManagement } from './screens/AIAgentsManagement';
import { AILedIntegration } from './screens/AILedIntegration';
import { SimulationComparison } from './screens/SimulationComparison';
import { CrossDisciplineVisibility } from './screens/CrossDisciplineVisibility';
import { DiscussionForum } from './screens/DiscussionForum';

const BREADCRUMB_MAP: Record<string, string> = {
  'dashboard': 'Dashboard',
  'executive-dashboard': 'Executive Dashboard',
  'data-health': 'Data Health',
  'static-model': 'Static Model',
  'well-data': 'Well Data',
  'petrophysical-logs': 'Petrophysical Logs',
  'geological-interpretations': 'Geological Interpretations',
  'geophysical-data': 'Geophysical Data',
  'production-history': 'Production History',
  'history-matching': 'History Matching',
  'ai-led': 'AI-Led Integration',
  'comparison': 'Simulation Comparison',
  'uncertainty': 'Uncertainty & Sensitivity',
  'subsurface': 'Subsurface Uncertainty',
  'operational': 'Operational Uncertainty',
  'cross-domain': 'Cross-Domain Uncertainty',
  'market-volatility': 'Market Volatility',
  'simulation-comparison': 'Simulation Comparison',
  'insights': 'Insights & Decisions',
  'deep-dive': 'Deep Dive Analytics',
  'deep-dive-analytics': 'Deep Dive Analytics',
  'multidisciplinary-workflow': 'Multidisciplinary Workflow',
  'governance-audit': 'Governance Audit',
  'decision-approval': 'Decision Approval',
  'ai-led-integration': 'AI-Led Integration',
  'fdp-summary': 'FDP Summary',
  'ai-agents-management': 'AI Agents Management',
  'cross-discipline-visibility': 'Cross-Discipline Visibility',
  'collaboration': 'Collaboration',
  'forum': 'Discussion Forum',
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isChatOpen, openChat, closeChat } = useChat();
  const { isCollapsed } = useSidebar();
  const { isAnnotationToolbarVisible, setAnnotationToolbarVisible } = useCollaboration();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen">
      <Sidebar onChatOpen={openChat} />
      <TopBar />
      <main 
        className={isCollapsed ? "pl-16 pt-16" : "pl-60 pt-16"}
        style={{ transition: 'padding-left 200ms ease-in-out' }}
      >
        {pathSegments.length > 0 && (
          <div className="px-6 py-3 border-b border-card-border bg-background/50 backdrop-blur-sm sticky top-16 z-20">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const name = BREADCRUMB_MAP[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  const isLast = index === pathSegments.length - 1;

                  return [
                    <BreadcrumbSeparator key={`${href}-sep`} />,
                    <BreadcrumbItem key={`${href}-item`}>
                      {isLast ? (
                        <BreadcrumbPage>{name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={href}>{name}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ];
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        {children}
        {isAnnotationToolbarVisible && (
          <DataAnnotationToolbar 
            onClose={() => setAnnotationToolbarVisible(false)}
          />
        )}
      </main>
      <AIOracle isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <ThemeProvider>
          <ConfirmationProvider>
            <NotificationsProvider>
              <SearchProvider>
                <SidebarProvider>
                  <ChatProvider>
                    <Toaster />
                    <AssetProvider>
                      <UserProvider>
                        <WorkflowProvider>
                          <LayerProvider>
                            <CollaborationProvider>
                              <GlobalSearch />
                              <ErrorBoundary>
                                <Routes>
                                  {/* Login Route - Entry Point */}
                                  <Route path="/" element={<Login />} />
                                
                                {/* Dashboard Routes */}
                                  <Route path="/dashboard" element={<AppLayout><ErrorBoundary><Dashboard /></ErrorBoundary></AppLayout>} />
                                  <Route path="/executive-dashboard" element={<AppLayout><ErrorBoundary><ExecutiveDashboard /></ErrorBoundary></AppLayout>} />
                                  
                                {/* Data Health Module (M2) */}
                                  <Route path="/data-health" element={<AppLayout><ErrorBoundary><DataHealth /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/static-model" element={<AppLayout><ErrorBoundary><DataCompleteness /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/well-data" element={<AppLayout><ErrorBoundary><WellData /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/petrophysical-logs" element={<AppLayout><ErrorBoundary><PetrophysicalLogs /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/geological-interpretations" element={<AppLayout><ErrorBoundary><GeologicalInterpretations /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/geophysical-data" element={<AppLayout><ErrorBoundary><GeophysicalData /></ErrorBoundary></AppLayout>} />
                                  <Route path="/data-health/production-history" element={<AppLayout><ErrorBoundary><ProductionHistory /></ErrorBoundary></AppLayout>} />
                                  
                                {/* History Matching Module (M3) */}
                                  <Route path="/history-matching" element={<AppLayout><ErrorBoundary><HistoryMatching /></ErrorBoundary></AppLayout>} />
                                  <Route path="/history-matching/ai-led" element={<AppLayout><ErrorBoundary><AILedIntegration /></ErrorBoundary></AppLayout>} />
                                  <Route path="/history-matching/comparison" element={<AppLayout><ErrorBoundary><SimulationComparison /></ErrorBoundary></AppLayout>} />
                                  
                                {/* Uncertainty & Sensitivity Module (M4) */}
                                  <Route path="/uncertainty" element={<AppLayout><ErrorBoundary><Uncertainty /></ErrorBoundary></AppLayout>} />
                                  <Route path="/uncertainty/subsurface" element={<AppLayout><ErrorBoundary><SubsurfaceUncertainty /></ErrorBoundary></AppLayout>} />
                                  <Route path="/uncertainty/operational" element={<AppLayout><ErrorBoundary><OperationalUncertainty /></ErrorBoundary></AppLayout>} />
                                  <Route path="/uncertainty/cross-domain" element={<AppLayout><ErrorBoundary><CrossDomainUncertainty /></ErrorBoundary></AppLayout>} />
                                  <Route path="/uncertainty/market-volatility" element={<AppLayout><ErrorBoundary><MarketVolatility /></ErrorBoundary></AppLayout>} />
                                  <Route path="/uncertainty/simulation-comparison" element={<AppLayout><ErrorBoundary><SimulationComparison /></ErrorBoundary></AppLayout>} />
                                  
                                {/* Insights & Decisions Module (M5) */}
                                  <Route path="/insights" element={<AppLayout><ErrorBoundary><Insights /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/deep-dive" element={<AppLayout><ErrorBoundary><DeepDiveAnalytics /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/deep-dive-analytics" element={<AppLayout><ErrorBoundary><DeepDiveAnalytics /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/multidisciplinary-workflow" element={<AppLayout><ErrorBoundary><MultidisciplinaryWorkflow /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/governance-audit" element={<AppLayout><ErrorBoundary><GovernanceAudit /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/decision-approval" element={<AppLayout><ErrorBoundary><DecisionApproval /></ErrorBoundary></AppLayout>} />
                                  <Route path="/insights/ai-led-integration" element={<AppLayout><ErrorBoundary><AILedIntegration /></ErrorBoundary></AppLayout>} />
                                  
                                {/* FDP Summary Module (M6) */}
                                  <Route path="/fdp-summary" element={<AppLayout><ErrorBoundary><FDPSummary /></ErrorBoundary></AppLayout>} />
                                  
                                {/* AI Agents Management */}
                                  <Route path="/ai-agents-management" element={<AppLayout><ErrorBoundary><AIAgentsManagement /></ErrorBoundary></AppLayout>} />
                                  
                                {/* Cross-Discipline Data Visibility */}
                                  <Route path="/cross-discipline-visibility" element={<AppLayout><ErrorBoundary><CrossDisciplineVisibility /></ErrorBoundary></AppLayout>} />
                                  
                                {/* Collaboration */}
                                  <Route path="/forum" element={<AppLayout><ErrorBoundary><DiscussionForum /></ErrorBoundary></AppLayout>} />

                                  {/* Redirect unknown routes to dashboard instead of login */}
                                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                              </ErrorBoundary>
                            </CollaborationProvider>
                          </LayerProvider>
                        </WorkflowProvider>
                      </UserProvider>
                    </AssetProvider>
                  </ChatProvider>
                </SidebarProvider>
              </SearchProvider>
            </NotificationsProvider>
          </ConfirmationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}