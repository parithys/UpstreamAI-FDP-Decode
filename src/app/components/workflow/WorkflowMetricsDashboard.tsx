import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Activity,
  CheckCircle,
  Lock,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Database,
  BarChart3,
  Download
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { toast } from 'sonner';

export function WorkflowMetricsDashboard() {
  const { metrics, stages, disciplines } = useWorkflow();

  const handleExportReport = () => {
    toast.success('Exporting workflow report...', {
      description: 'Comprehensive workflow status report will download as PDF'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysUntilCompletion = Math.ceil(
    (new Date(metrics.estimatedCompletion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress Bar */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Overall Workflow Progress</h3>
            <p className="text-sm text-text-secondary">
              {stages.filter(s => s.status === 'completed').length} of {stages.length} stages completed
            </p>
          </div>
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
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>Progress</span>
            <span className="font-semibold text-text-primary">{Math.round(metrics.overallProgress)}%</span>
          </div>
          <div className="h-3 bg-background-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${metrics.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            <span className="text-text-secondary">Estimated Completion:</span>{' '}
            <span className="font-medium text-text-primary">{formatDate(metrics.estimatedCompletion)}</span>
            <span className="text-text-tertiary ml-2">({daysUntilCompletion} days)</span>
          </div>
          <div className="text-sm">
            <span className="text-text-secondary">Critical Path:</span>{' '}
            <span className="font-medium text-text-primary">{metrics.criticalPath.length} stages</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary">Active Stages</div>
              <div className="text-2xl font-bold text-primary">{metrics.activeStages}</div>
            </div>
          </div>
          <div className="text-xs text-text-secondary">In progress</div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary">Completed</div>
              <div className="text-2xl font-bold text-success">{metrics.completedStages}</div>
            </div>
          </div>
          <div className="text-xs text-text-secondary">
            {Math.round((metrics.completedStages / stages.length) * 100)}% of total
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-danger/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-danger" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary">Blocked</div>
              <div className="text-2xl font-bold text-danger">{metrics.blockedStages}</div>
            </div>
          </div>
          <div className="text-xs text-text-secondary">
            {metrics.blockedStages > 0 ? 'Needs attention' : 'None blocked'}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary">Bottlenecks</div>
              <div className="text-2xl font-bold text-accent">{metrics.bottlenecks.length}</div>
            </div>
          </div>
          <div className="text-xs text-text-secondary">
            {metrics.bottlenecks.filter(b => b.severity === 'critical').length} critical
          </div>
        </div>
      </div>

      {/* Data Quality & Integration Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-card-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-text-primary">Data Quality</h4>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-secondary">Average Quality Score</span>
              <span className={`font-semibold ${
                metrics.averageQuality >= 90 ? 'text-success' :
                metrics.averageQuality >= 75 ? 'text-warning' :
                'text-danger'
              }`}>
                {Math.round(metrics.averageQuality)}%
              </span>
            </div>
            <div className="h-2 bg-background-primary rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  metrics.averageQuality >= 90 ? 'bg-success' :
                  metrics.averageQuality >= 75 ? 'bg-warning' :
                  'bg-danger'
                }`}
                style={{ width: `${metrics.averageQuality}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            {disciplines.slice(0, 5).map(disc => (
              <div key={disc.id} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{disc.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-background-primary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        disc.quality >= 90 ? 'bg-success' :
                        disc.quality >= 75 ? 'bg-warning' :
                        'bg-danger'
                      }`}
                      style={{ width: `${disc.quality}%` }}
                    />
                  </div>
                  <span className="font-medium text-text-primary w-10 text-right">{disc.quality}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-text-primary">Data Integration</h4>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-text-tertiary mb-1">Total Data Exchanges</div>
              <div className="text-3xl font-bold text-text-primary">{metrics.totalDataExchanges}</div>
              <div className="text-xs text-text-secondary mt-1">Cross-discipline transfers</div>
            </div>
            <div>
              <div className="text-xs text-text-tertiary mb-1">Connected Disciplines</div>
              <div className="text-3xl font-bold text-success">
                {disciplines.filter(d => d.status === 'connected').length}/{disciplines.length}
              </div>
              <div className="text-xs text-success mt-1">100% connectivity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Status Breakdown */}
      <div className="bg-card rounded-lg border border-card-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-text-primary">Stage Status Breakdown</h4>
          </div>
          <Button size="sm" variant="outline" onClick={handleExportReport}>
            <Download className="w-3 h-3 mr-2" />
            Export Report
          </Button>
        </div>
        <div className="space-y-3">
          {stages.map(stage => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-text-tertiary">
                {stage.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{stage.name}</div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{stage.estimatedDuration} days</span>
                  {stage.qualityScore && (
                    <>
                      <span>•</span>
                      <span>Quality: {stage.qualityScore}%</span>
                    </>
                  )}
                </div>
              </div>
              <Badge className={`${
                stage.status === 'completed' ? 'bg-success/10 text-success border-success/30' :
                stage.status === 'in-progress' ? 'bg-primary/10 text-primary border-primary/30' :
                stage.status === 'ready' ? 'bg-accent/10 text-accent border-accent/30' :
                stage.status === 'blocked' ? 'bg-danger/10 text-danger border-danger/30' :
                'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30'
              } text-xs`}>
                {stage.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Path Visualization */}
      {metrics.criticalPath.length > 0 && (
        <div className="bg-card rounded-lg border border-card-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-text-primary">Critical Path</h4>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {metrics.criticalPath.map((stageId, idx) => {
              const stage = stages.find(s => s.id === stageId);
              if (!stage) return null;
              return (
                <div key={stageId} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`px-3 py-2 rounded-lg border-2 ${
                    stage.status === 'completed' ? 'border-success/30 bg-success/10' :
                    stage.status === 'in-progress' ? 'border-primary bg-primary/10' :
                    'border-card-border bg-background-secondary'
                  }`}>
                    <div className="text-xs font-medium text-text-primary whitespace-nowrap">
                      Stage {stage.order}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {stage.estimatedDuration}d
                    </div>
                  </div>
                  {idx < metrics.criticalPath.length - 1 && (
                    <div className="w-4 h-0.5 bg-card-border" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-text-secondary">
            Total estimated duration: {stages
              .filter(s => metrics.criticalPath.includes(s.id))
              .reduce((sum, s) => sum + s.estimatedDuration, 0)} days
          </div>
        </div>
      )}
    </div>
  );
}
