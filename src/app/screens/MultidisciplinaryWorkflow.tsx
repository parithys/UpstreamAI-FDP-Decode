import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MultidisciplinaryIntegration } from '../components/MultidisciplinaryIntegration';
import { WorkflowOrchestrationPanel } from '../components/workflow/WorkflowOrchestration';
import { BottleneckDashboard } from '../components/workflow/BottleneckDashboard';
import { WorkflowMetricsDashboard } from '../components/workflow/WorkflowMetricsDashboard';
import {
  Users,
  Database,
  Activity,
  CheckCircle,
  Download,
  RefreshCw,
  AlertTriangle,
  Play,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export function MultidisciplinaryWorkflow() {
  const { metrics, syncAllDisciplines, disciplines, activeBottlenecks } = useWorkflow();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'bottlenecks' | 'metrics' | 'integration'>('workflow');

  const handleSyncAllData = async () => {
    setIsSyncing(true);
    await syncAllDisciplines();
    setIsSyncing(false);
  };

  const handleExportIntegrationReport = () => {
    toast.success('Exporting integration report...', {
      description: 'Multidisciplinary workflow report will download as PDF'
    });
  };

  const connectedDisciplines = disciplines.filter(d => d.status === 'connected').length;
  const activeContributors = 32; // Calculated from team collaboration

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                Workflow Orchestration & Control
              </h1>
              <Badge className={metrics.onSchedule ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}>
                {metrics.onSchedule ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    On Schedule
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Delayed
                  </>
                )}
              </Badge>
              {activeBottlenecks.length > 0 && (
                <Badge className="bg-warning/10 text-warning border-warning/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {activeBottlenecks.length} Bottleneck{activeBottlenecks.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary">
              Automated workflow management with dependency enforcement, gate checks, and bottleneck detection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSyncAllData} disabled={isSyncing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync All Data
            </Button>
            <Button variant="primary" onClick={handleExportIntegrationReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Overall Progress</div>
            <div className="text-2xl font-bold text-primary">{Math.round(metrics.overallProgress)}%</div>
            <div className="text-xs text-success mt-1">
              {metrics.completedStages}/{metrics.completedStages + metrics.activeStages + metrics.blockedStages} stages
            </div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Active Stages</div>
            <div className="text-2xl font-bold text-primary">{metrics.activeStages}</div>
            <div className="text-xs text-text-secondary mt-1">In progress</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Disciplines</div>
            <div className="text-2xl font-bold text-text-primary">{connectedDisciplines} / {disciplines.length}</div>
            <div className="text-xs text-success mt-1">100% connected</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Data Quality</div>
            <div className="text-2xl font-bold text-success">{Math.round(metrics.averageQuality)}%</div>
            <div className="text-xs text-text-secondary mt-1">Avg. across sources</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Bottlenecks</div>
            <div className="text-2xl font-bold text-warning">{activeBottlenecks.length}</div>
            <div className="text-xs text-text-secondary mt-1">
              {activeBottlenecks.filter(b => b.severity === 'critical').length} critical
            </div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Team Members</div>
            <div className="text-2xl font-bold text-text-primary">41</div>
            <div className="text-xs text-success mt-1">{activeContributors} active</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-lg border border-card-border mb-6">
          <div className="flex items-center border-b border-card-border">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'workflow'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Workflow Stages
              </div>
              {activeTab === 'workflow' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bottlenecks')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'bottlenecks'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Bottleneck Detection
                {activeBottlenecks.length > 0 && (
                  <Badge className="bg-warning/10 text-warning border-warning/30 ml-1">
                    {activeBottlenecks.length}
                  </Badge>
                )}
              </div>
              {activeTab === 'bottlenecks' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'metrics'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Metrics Dashboard
              </div>
              {activeTab === 'metrics' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('integration')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'integration'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Discipline Integration
              </div>
              {activeTab === 'integration' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === 'workflow' && (
            <div>
              <div className="mb-4 bg-accent/10 rounded-lg p-4 border border-accent/30">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary mb-1">Workflow Orchestration Active</div>
                    <p className="text-sm text-text-secondary">
                      Dependencies are automatically enforced. Gate criteria must be satisfied before stage completion. 
                      Click "Start Stage" to begin a stage when ready, or "Complete Stage" to finish and unlock dependent stages.
                    </p>
                  </div>
                </div>
              </div>
              <WorkflowOrchestrationPanel />
            </div>
          )}
          
          {activeTab === 'bottlenecks' && (
            <div>
              <div className="mb-4 bg-warning/10 rounded-lg p-4 border border-warning/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary mb-1">Automatic Bottleneck Detection</div>
                    <p className="text-sm text-text-secondary">
                      System continuously monitors workflow for dependency blocks, quality issues, approval delays, 
                      data gaps, and schedule overruns. Critical issues are flagged immediately.
                    </p>
                  </div>
                </div>
              </div>
              <BottleneckDashboard />
            </div>
          )}
          
          {activeTab === 'metrics' && (
            <WorkflowMetricsDashboard />
          )}
          
          {activeTab === 'integration' && (
            <div>
              <div className="mb-4 bg-primary/10 rounded-lg p-4 border border-primary/30">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary mb-1">Cross-Discipline Data Integration</div>
                    <p className="text-sm text-text-secondary">
                      Real-time data linking across all disciplines with automatic quality monitoring and sync status tracking.
                    </p>
                  </div>
                </div>
              </div>
              <MultidisciplinaryIntegration variant="full" showInteractions={true} />
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">
              ← Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/insights/ai-led-integration">
                View AI Led Integration
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link to="/data-health">
                Check Data Health →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
