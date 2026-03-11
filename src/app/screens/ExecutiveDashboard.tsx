import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LoadingState } from '../components/ui/loading-state';
import { InlineErrorState } from '../components/ui/error-state';
import { ScreenWrapper } from '../components/ui/screen-wrapper';
import { useAsyncData } from '../hooks/useAsyncData';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  CheckCircle2, 
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useNotifications } from '../context/NotificationsContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { NotificationsModal } from '../components/modals/NotificationsModal';
import { exportToCSV, exportToExcel, exportToJSON } from '../utils/exportUtils';
import { toast } from 'sonner';
import { useState } from 'react';

const kpis = [
  { label: 'Portfolio NPV', value: '$2.4B', trend: '+12%', trendUp: true, sparkline: true },
  { label: 'Risk-Adjusted Return', value: '18.3%', trend: 'amber', trendUp: false, sparkline: false },
  { label: 'Capital Efficiency', value: '0.87x', trend: 'green', trendUp: true, sparkline: false },
  { label: 'FDP Completion', value: '42%', trend: null, trendUp: false, sparkline: false, progress: true }
];

const fdpPipeline = [
  { asset: 'Field Alpha', phase: 'M5: Insights', status: 'In Progress', daysRemaining: 12, risk: 'Low', engineer: 'S. Chen' },
  { asset: 'Field Beta', phase: 'M4: Uncertainty', status: 'On Track', daysRemaining: 28, risk: 'Medium', engineer: 'A. Rahman' },
  { asset: 'Field Gamma', phase: 'M2: Data Health', status: 'Delayed', daysRemaining: 45, risk: 'High', engineer: 'M. Torres' },
  { asset: 'Field Delta', phase: 'M3: History Match', status: 'On Track', daysRemaining: 22, risk: 'Low', engineer: 'J. Park' }
];

interface DecisionQueueItem {
  id: string;
  item: string;
  status: 'Awaiting your approval' | 'Review needed' | 'Pending review';
  time: string;
  category: 'validation' | 'parameters' | 'model' | 'forecast';
  navigationUrl: string;
  approved?: boolean;
  rejected?: boolean;
}

const initialDecisionQueue: DecisionQueueItem[] = [
  { 
    id: 'dec-001',
    item: 'Static Model Validation – Zone A', 
    status: 'Awaiting your approval', 
    time: '2 hours ago',
    category: 'validation',
    navigationUrl: '/data-health/geological-interpretations'
  },
  { 
    id: 'dec-002',
    item: 'Uncertainty Parameters – Market Volatility', 
    status: 'Review needed', 
    time: '1 day ago',
    category: 'parameters',
    navigationUrl: '/uncertainty/market-volatility'
  },
  {
    id: 'dec-003',
    item: 'Production Forecast – Field Beta Q1 2025',
    status: 'Pending review',
    time: '3 hours ago',
    category: 'forecast',
    navigationUrl: '/insights'
  },
  {
    id: 'dec-004',
    item: 'Reservoir Model Update – Field Gamma',
    status: 'Awaiting your approval',
    time: '5 hours ago',
    category: 'model',
    navigationUrl: '/history-matching'
  }
];

export function ExecutiveDashboard() {
  const { openChat } = useChat();
  const navigate = useNavigate();
  const { addNotification, unreadCount } = useNotifications();
  const { confirmSuccess, confirmWarning, confirmDanger } = useConfirmation();
  const [decisionQueue, setDecisionQueue] = useState<DecisionQueueItem[]>(initialDecisionQueue);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  const handleNotificationsClick = () => {
    // Open the notifications modal directly
    setNotificationsModalOpen(true);
  };

  const handleReview = (decision: DecisionQueueItem) => {
    // Navigate to the specific page for review
    navigate(decision.navigationUrl);
    
    // Add notification about the review action
    addNotification({
      type: 'info',
      priority: 'medium',
      category: 'system',
      title: 'Review Started',
      message: `You are now reviewing: ${decision.item}`,
      actionLabel: 'Continue Review',
      actionUrl: decision.navigationUrl
    });
  };

  const handleApprove = async (decision: DecisionQueueItem) => {
    const confirmed = await confirmSuccess({
      title: 'Approve Decision',
      message: `Are you sure you want to approve "${decision.item}"? This action will finalize the approval and notify all stakeholders.`,
      confirmLabel: 'Approve',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      // Update the decision status
      setDecisionQueue(prev => 
        prev.map(d => 
          d.id === decision.id 
            ? { ...d, approved: true, status: 'Awaiting your approval' as const }
            : d
        )
      );

      // Show success toast
      toast.success('Decision Approved', {
        description: `${decision.item} has been approved successfully`
      });

      // Add notification to the system
      addNotification({
        type: 'success',
        priority: 'high',
        category: 'system',
        title: 'Decision Approved',
        message: `${decision.item} has been approved by Executive`,
        actionLabel: 'View Details',
        actionUrl: decision.navigationUrl
      });

      // Simulate removing from queue after a delay (in production, this would sync with backend)
      setTimeout(() => {
        setDecisionQueue(prev => prev.filter(d => d.id !== decision.id));
      }, 2000);
    }
  };

  const handleReject = async (decision: DecisionQueueItem) => {
    const confirmed = await confirmDanger({
      title: 'Reject Decision',
      message: `Are you sure you want to reject "${decision.item}"? This will send the item back for revision.`,
      confirmLabel: 'Reject',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      // Update the decision status
      setDecisionQueue(prev => 
        prev.map(d => 
          d.id === decision.id 
            ? { ...d, rejected: true }
            : d
        )
      );

      // Show warning toast
      toast.warning('Decision Rejected', {
        description: `${decision.item} has been rejected and sent back for revision`
      });

      // Add notification to the system
      addNotification({
        type: 'warning',
        priority: 'high',
        category: 'system',
        title: 'Decision Rejected',
        message: `${decision.item} has been rejected by Executive - revision required`,
        actionLabel: 'View Details',
        actionUrl: decision.navigationUrl
      });

      // Simulate removing from queue after a delay
      setTimeout(() => {
        setDecisionQueue(prev => prev.filter(d => d.id !== decision.id));
      }, 2000);
    }
  };

  const handleViewFullReport = () => {
    navigate('/fdp-summary');
    toast.info('Navigating to FDP Summary', {
      description: 'Loading comprehensive executive report'
    });
  };

  const handleAssetClick = (asset: string) => {
    // Navigate to asset-specific dashboard
    navigate('/dashboard');
    toast.info(`Viewing ${asset}`, {
      description: 'Loading asset-specific dashboard'
    });
  };

  // Calculate pending approvals count
  const pendingApprovalsCount = decisionQueue.filter(d => !d.approved && !d.rejected).length;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-text-primary mb-1">Good morning, James</h1>
            <p className="text-sm text-text-secondary">Asset Manager – Field Alpha</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={handleNotificationsClick}
              title="View notifications"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <Bell className="w-5 h-5" />
            </Button>

            {/* Pending Approvals Badge */}
            {pendingApprovalsCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Scroll to decision queue
                  const decisionQueueElement = document.getElementById('decision-queue');
                  if (decisionQueueElement) {
                    decisionQueueElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="border-warning/30 bg-warning/10 hover:bg-warning/20 text-warning"
              >
                <Clock className="w-4 h-4 mr-2" />
                {pendingApprovalsCount} Pending Approval{pendingApprovalsCount !== 1 ? 's' : ''}
              </Button>
            )}

            {/* AI Assistant Button */}
            <Button 
              className="bg-warning hover:bg-warning/90 text-background-primary font-semibold" 
              onClick={openChat}
            >
              <span className="mr-2">✨</span>
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Top KPI Strip */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
              <div className="text-sm text-text-secondary mb-2">{kpi.label}</div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-3xl font-bold text-text-primary">{kpi.value}</div>
                {kpi.trendUp !== null && (
                  <div className={`flex items-center gap-1 ${kpi.trendUp ? 'text-success' : 'text-warning'}`}>
                    {kpi.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{kpi.trend}</span>
                  </div>
                )}
              </div>
              {kpi.sparkline && (
                <div className="h-8">
                  <svg className="w-full h-full" viewBox="0 0 100 30">
                    <polyline
                      fill="none"
                      stroke="#15A955"
                      strokeWidth="2"
                      points="0,25 10,22 20,24 30,20 40,18 50,15 60,17 70,14 80,12 90,10 100,8"
                    />
                  </svg>
                </div>
              )}
              {kpi.progress && (
                <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* FDP Pipeline Status */}
          <div className="col-span-2 bg-card rounded-lg border border-card-border shadow-glow overflow-hidden">
            <div className="p-4 border-b border-card-border">
              <h3 className="text-text-primary font-semibold">FDP Pipeline Status</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-card-border">
                  <TableHead className="text-text-secondary">Asset</TableHead>
                  <TableHead className="text-text-secondary">Phase</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Days Left</TableHead>
                  <TableHead className="text-text-secondary">Risk</TableHead>
                  <TableHead className="text-text-secondary">Engineer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fdpPipeline.map((item, idx) => (
                  <TableRow 
                    key={idx} 
                    className="border-card-border hover:bg-card-hover cursor-pointer focus:outline-none focus:bg-card-hover"
                    onClick={() => handleAssetClick(item.asset)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAssetClick(item.asset);
                      }
                    }}
                  >
                    <TableCell className="text-text-primary font-medium">{item.asset}</TableCell>
                    <TableCell className="text-text-secondary">{item.phase}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.status === 'Delayed'
                            ? 'danger'
                            : item.status === 'In Progress'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-primary">{item.daysRemaining}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.risk === 'High'
                            ? 'danger'
                            : item.risk === 'Medium'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {item.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{item.engineer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* AI Executive Brief */}
          <div className="bg-primary/10 rounded-lg p-5 border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-text-primary font-semibold">✨ AI Executive Brief</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              <span className="text-text-primary font-medium">Field Alpha FDP</span> is progressing well. Data validation is 
              <span className="text-text-primary font-medium"> 78% complete</span> with 3 critical gaps in petrophysical data. 
              AI led simulation readiness is pending uncertainty framework completion.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              <span className="text-text-primary font-medium">Estimated time to decision-ready: 12 working days.</span>
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              <span className="text-text-primary font-medium">Key risk:</span> Market volatility scenarios need updating with 
              latest Q1 2025 Brent crude projections.
            </p>
            <Button variant="outline" onClick={handleViewFullReport}>
              <FileText className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>

        {/* Decision Queue */}
        <div id="decision-queue" className="bg-card rounded-lg border border-card-border shadow-glow">
          <div className="p-4 border-b border-card-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-text-primary font-semibold">Decision Queue</h3>
              {pendingApprovalsCount > 0 && (
                <Badge className="bg-warning/10 text-warning border-warning/30">
                  {pendingApprovalsCount} Pending
                </Badge>
              )}
            </div>
            {decisionQueue.length === 0 && (
              <span className="text-xs text-text-tertiary">All decisions processed</span>
            )}
          </div>
          <div className="p-4 space-y-3">
            {decisionQueue.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
                <p className="text-sm text-text-secondary">All decisions have been processed</p>
                <p className="text-xs text-text-tertiary mt-1">No pending approvals at this time</p>
              </div>
            ) : (
              decisionQueue.map((decision) => (
                <div 
                  key={decision.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    decision.approved 
                      ? 'bg-success/5 border-success/30'
                      : decision.rejected
                      ? 'bg-error/5 border-error/30'
                      : 'bg-background-secondary border-card-border hover:bg-card-hover'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {decision.approved ? (
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                    ) : decision.rejected ? (
                      <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-error" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-warning" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-text-primary font-medium text-sm flex items-center gap-2">
                        {decision.item}
                        {decision.approved && (
                          <span className="text-xs text-success font-normal">✓ Approved</span>
                        )}
                        {decision.rejected && (
                          <span className="text-xs text-error font-normal">✗ Rejected</span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary flex items-center gap-2 mt-1">
                        <span>{decision.status}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {decision.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!decision.approved && !decision.rejected && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReview(decision)}
                        title="Review this decision"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReject(decision)}
                        className="text-error hover:text-error hover:bg-error/10"
                        title="Reject this decision"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90 text-white"
                        onClick={() => handleApprove(decision)}
                        title="Approve this decision"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={notificationsModalOpen} 
        onClose={() => setNotificationsModalOpen(false)} 
      />
    </div>
  );
}