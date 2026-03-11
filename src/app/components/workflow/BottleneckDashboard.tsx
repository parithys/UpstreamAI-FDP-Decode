import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useWorkflow, WorkflowBottleneck } from '../../context/WorkflowContext';

interface BottleneckCardProps {
  bottleneck: WorkflowBottleneck;
}

function BottleneckCard({ bottleneck }: BottleneckCardProps) {
  const { resolveBottleneck } = useWorkflow();
  const [expanded, setExpanded] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    setIsResolving(true);
    await resolveBottleneck(bottleneck.id);
    setIsResolving(false);
  };

  const getSeverityColor = () => {
    switch (bottleneck.severity) {
      case 'critical': return 'border-danger bg-danger/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-warning bg-warning/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-card-border bg-card';
    }
  };

  const getSeverityBadge = () => {
    switch (bottleneck.severity) {
      case 'critical':
        return <Badge className="bg-danger/10 text-danger border-danger/30">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Low</Badge>;
    }
  };

  const getTypeIcon = () => {
    switch (bottleneck.type) {
      case 'dependency': return AlertCircle;
      case 'quality': return TrendingUp;
      case 'resource': return Clock;
      case 'approval': return CheckCircle;
      case 'data-gap': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className={`rounded-lg border-2 ${getSeverityColor()} transition-all`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              bottleneck.severity === 'critical' ? 'bg-danger text-white' :
              bottleneck.severity === 'high' ? 'bg-orange-500 text-white' :
              bottleneck.severity === 'medium' ? 'bg-warning text-white' :
              'bg-blue-500 text-white'
            }`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text-primary mb-1">{bottleneck.description}</div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {getSeverityBadge()}
                <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                  {bottleneck.type}
                </Badge>
                <Badge className="bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30 text-xs">
                  {bottleneck.stageName}
                </Badge>
              </div>
              <div className="text-sm text-text-secondary mb-2">
                <span className="font-medium text-text-primary">Impact:</span> {bottleneck.impact}
              </div>
              <div className="text-xs text-text-tertiary">
                Detected {new Date(bottleneck.detectedAt).toLocaleString()} • Est. delay: {bottleneck.estimatedDelay} days
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {bottleneck.autoResolvable && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleResolve}
                disabled={isResolving}
              >
                {isResolving ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Auto-Resolve
                  </>
                )}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-card-border">
            <div className="flex items-start gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-text-primary mb-2">Recommendations</div>
                <ul className="space-y-1">
                  {bottleneck.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {!bottleneck.autoResolvable && (
              <div className="bg-warning/10 rounded p-3 border border-warning/30 text-sm text-text-secondary">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                This bottleneck requires manual intervention
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function BottleneckDashboard() {
  const { activeBottlenecks, detectBottlenecks } = useWorkflow();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    detectBottlenecks();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const criticalBottlenecks = activeBottlenecks.filter(b => b.severity === 'critical');
  const highBottlenecks = activeBottlenecks.filter(b => b.severity === 'high');
  const mediumBottlenecks = activeBottlenecks.filter(b => b.severity === 'medium');
  const lowBottlenecks = activeBottlenecks.filter(b => b.severity === 'low');

  const totalEstimatedDelay = activeBottlenecks.reduce((sum, b) => sum + b.estimatedDelay, 0);
  const autoResolvableCount = activeBottlenecks.filter(b => b.autoResolvable).length;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="text-xs text-text-tertiary mb-1">Total Bottlenecks</div>
          <div className="text-2xl font-bold text-text-primary">{activeBottlenecks.length}</div>
          <div className="text-xs text-text-secondary mt-1">Active issues</div>
        </div>
        <div className="bg-danger/10 rounded-lg border border-danger/30 p-4">
          <div className="text-xs text-text-tertiary mb-1">Critical</div>
          <div className="text-2xl font-bold text-danger">{criticalBottlenecks.length}</div>
          <div className="text-xs text-danger mt-1">Immediate action</div>
        </div>
        <div className="bg-orange-500/10 rounded-lg border border-orange-500/30 p-4">
          <div className="text-xs text-text-tertiary mb-1">High Priority</div>
          <div className="text-2xl font-bold text-orange-500">{highBottlenecks.length}</div>
          <div className="text-xs text-orange-500 mt-1">Needs attention</div>
        </div>
        <div className="bg-warning/10 rounded-lg border border-warning/30 p-4">
          <div className="text-xs text-text-tertiary mb-1">Est. Delay</div>
          <div className="text-2xl font-bold text-warning">{totalEstimatedDelay}</div>
          <div className="text-xs text-warning mt-1">Total days</div>
        </div>
        <div className="bg-accent/10 rounded-lg border border-accent/30 p-4">
          <div className="text-xs text-text-tertiary mb-1">Auto-Resolvable</div>
          <div className="text-2xl font-bold text-accent">{autoResolvableCount}</div>
          <div className="text-xs text-accent mt-1">Can be fixed</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Active Bottlenecks</h3>
          <p className="text-sm text-text-secondary">Automatically detected workflow issues</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Detection
            </>
          )}
        </Button>
      </div>

      {/* Bottlenecks List */}
      {activeBottlenecks.length === 0 ? (
        <div className="bg-success/10 rounded-lg border border-success/30 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
          <div className="font-semibold text-text-primary mb-1">No Bottlenecks Detected</div>
          <div className="text-sm text-text-secondary">Workflow is progressing smoothly</div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Critical First */}
          {criticalBottlenecks.map(bottleneck => (
            <BottleneckCard key={bottleneck.id} bottleneck={bottleneck} />
          ))}
          
          {/* High Priority */}
          {highBottlenecks.map(bottleneck => (
            <BottleneckCard key={bottleneck.id} bottleneck={bottleneck} />
          ))}
          
          {/* Medium Priority */}
          {mediumBottlenecks.map(bottleneck => (
            <BottleneckCard key={bottleneck.id} bottleneck={bottleneck} />
          ))}
          
          {/* Low Priority */}
          {lowBottlenecks.map(bottleneck => (
            <BottleneckCard key={bottleneck.id} bottleneck={bottleneck} />
          ))}
        </div>
      )}
    </div>
  );
}
