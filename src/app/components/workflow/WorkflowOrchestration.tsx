import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Activity,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useWorkflow, WorkflowStage, GateCriteria } from '../../context/WorkflowContext';
import { toast } from 'sonner';

interface GateCheckCardProps {
  stageId: string;
  criteria: GateCriteria;
}

function GateCheckCard({ stageId, criteria }: GateCheckCardProps) {
  const { validateGate, forceOverrideGate } = useWorkflow();
  const [isValidating, setIsValidating] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const handleValidate = async () => {
    if (!criteria.autoCheck) {
      toast.info('Manual validation required', {
        description: 'This gate check requires manual approval'
      });
      return;
    }

    setIsValidating(true);
    await validateGate(stageId, criteria.id);
    setIsValidating(false);
  };

  const handleOverride = async () => {
    if (!overrideReason.trim()) {
      toast.error('Reason required', {
        description: 'Please provide a reason for overriding this gate check'
      });
      return;
    }

    await forceOverrideGate(stageId, criteria.id, overrideReason);
    setShowOverride(false);
    setOverrideReason('');
  };

  const getStatusColor = () => {
    switch (criteria.status) {
      case 'passed': return 'text-success';
      case 'failed': return 'text-danger';
      case 'checking': return 'text-warning';
      default: return 'text-text-tertiary';
    }
  };

  const getStatusIcon = () => {
    switch (criteria.status) {
      case 'passed': return CheckCircle;
      case 'failed': return XCircle;
      case 'checking': return Activity;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          <StatusIcon className={`w-5 h-5 ${getStatusColor()} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <div className="font-medium text-text-primary mb-1">{criteria.description}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${
                criteria.type === 'approval' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' :
                criteria.type === 'data-quality' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                criteria.type === 'validation' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                criteria.type === 'deliverable' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' :
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
              } text-xs`}>
                {criteria.type}
              </Badge>
              {criteria.required && (
                <Badge className="bg-danger/10 text-danger border-danger/30 text-xs">Required</Badge>
              )}
              {criteria.autoCheck && (
                <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Auto-check
                </Badge>
              )}
            </div>
            {criteria.checkedAt && (
              <div className="text-xs text-text-secondary mt-2">
                Checked by {criteria.checkedBy} at {new Date(criteria.checkedAt).toLocaleString()}
              </div>
            )}
            {criteria.details && (
              <div className="text-xs text-text-secondary mt-1 italic">{criteria.details}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {criteria.status === 'pending' && criteria.autoCheck && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleValidate}
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-2" />
                  Validate
                </>
              )}
            </Button>
          )}
          {(criteria.status === 'failed' || (criteria.status === 'pending' && !criteria.autoCheck)) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOverride(!showOverride)}
            >
              <Shield className="w-3 h-3 mr-2" />
              Override
            </Button>
          )}
        </div>
      </div>

      {showOverride && (
        <div className="mt-3 pt-3 border-t border-card-border">
          <textarea
            className="w-full bg-background-primary border border-card-border rounded p-2 text-sm text-text-primary"
            rows={2}
            placeholder="Enter reason for manual override..."
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
          />
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" variant="primary" onClick={handleOverride}>
              Confirm Override
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowOverride(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface WorkflowStageCardProps {
  stage: WorkflowStage;
}

export function WorkflowStageCard({ stage }: WorkflowStageCardProps) {
  const { startStage, completeStage, validateAllGates, canStartStage, checkDependencies } = useWorkflow();
  const [expanded, setExpanded] = useState(stage.status === 'in-progress' || stage.status === 'ready');
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isValidatingAll, setIsValidatingAll] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    await startStage(stage.id);
    setIsStarting(false);
    setExpanded(true);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    const success = await completeStage(stage.id);
    setIsCompleting(false);
    if (success) {
      setExpanded(false);
    }
  };

  const handleValidateAll = async () => {
    setIsValidatingAll(true);
    const allPassed = await validateAllGates(stage.id);
    setIsValidatingAll(false);
    if (allPassed) {
      toast.success('All gate checks passed', {
        description: 'Stage is ready for completion'
      });
    } else {
      toast.warning('Some gate checks failed', {
        description: 'Review failed checks and retry or override'
      });
    }
  };

  const getStatusColor = () => {
    switch (stage.status) {
      case 'completed': return 'border-success/50 bg-success/5';
      case 'in-progress': return 'border-primary bg-primary/5';
      case 'ready': return 'border-accent bg-accent/5';
      case 'blocked': return 'border-danger/50 bg-danger/5';
      case 'failed': return 'border-danger bg-danger/10';
      default: return 'border-card-border bg-card';
    }
  };

  const getStatusIcon = () => {
    switch (stage.status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Activity;
      case 'ready': return Play;
      case 'blocked': return Lock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon();

  const requiredGates = stage.gateCriteria.filter(c => c.required);
  const passedGates = requiredGates.filter(c => c.status === 'passed');
  const gateProgress = requiredGates.length > 0 ? (passedGates.length / requiredGates.length) * 100 : 0;

  const depCheck = checkDependencies(stage.id);
  const startCheck = canStartStage(stage.id);

  return (
    <div className={`rounded-lg border-2 ${getStatusColor()} transition-all`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
              stage.status === 'completed' ? 'bg-success' :
              stage.status === 'in-progress' ? 'bg-primary' :
              stage.status === 'ready' ? 'bg-accent' :
              stage.status === 'blocked' ? 'bg-danger' :
              'bg-text-tertiary'
            }`}>
              {stage.order}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary text-lg mb-2">{stage.name}</h3>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge className={`${
                  stage.status === 'completed' ? 'bg-success/10 text-success border-success/30' :
                  stage.status === 'in-progress' ? 'bg-primary/10 text-primary border-primary/30' :
                  stage.status === 'ready' ? 'bg-accent/10 text-accent border-accent/30' :
                  stage.status === 'blocked' ? 'bg-danger/10 text-danger border-danger/30' :
                  'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30'
                }`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {stage.status}
                </Badge>
                {stage.disciplines.map((disc, idx) => (
                  <Badge key={idx} className="bg-primary/10 text-primary border-primary/30 text-xs">
                    {disc}
                  </Badge>
                ))}
              </div>
              {stage.blockedReason && (
                <div className="text-sm text-danger flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {stage.blockedReason}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {stage.status === 'not-started' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStart}
                disabled={!startCheck.allowed || isStarting}
                title={startCheck.reasons.join('; ')}
              >
                {isStarting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Stage
                  </>
                )}
              </Button>
            )}
            {stage.status === 'ready' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStart}
                disabled={isStarting}
              >
                {isStarting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Stage
                  </>
                )}
              </Button>
            )}
            {stage.status === 'in-progress' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleComplete}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Stage
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-text-tertiary mb-1">Duration</div>
            <div className="text-sm font-medium text-text-primary">
              {stage.actualDuration ? `${stage.actualDuration}` : stage.estimatedDuration} days
            </div>
            {stage.actualDuration && stage.actualDuration !== stage.estimatedDuration && (
              <div className={`text-xs ${stage.actualDuration > stage.estimatedDuration ? 'text-danger' : 'text-success'}`}>
                {stage.actualDuration > stage.estimatedDuration ? '+' : ''}{stage.actualDuration - stage.estimatedDuration} days
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-text-tertiary mb-1">Gate Checks</div>
            <div className="text-sm font-medium text-text-primary">
              {passedGates.length} / {requiredGates.length}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex-1 h-1.5 bg-background-primary rounded-full overflow-hidden">
                <div
                  className={`h-full ${gateProgress === 100 ? 'bg-success' : 'bg-primary'}`}
                  style={{ width: `${gateProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary mb-1">Data Exchanges</div>
            <div className="text-sm font-medium text-text-primary">{stage.dataExchanges}</div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary mb-1">Quality Score</div>
            {stage.qualityScore !== undefined ? (
              <>
                <div className={`text-sm font-medium ${
                  stage.qualityScore >= 90 ? 'text-success' :
                  stage.qualityScore >= 75 ? 'text-warning' :
                  'text-danger'
                }`}>
                  {stage.qualityScore}%
                </div>
              </>
            ) : (
              <div className="text-sm text-text-tertiary">-</div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-card-border p-5 bg-background-primary/50">
          {/* Dependencies */}
          {stage.dependencies.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-text-primary">Dependencies</h4>
                <Badge className={depCheck.satisfied ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}>
                  {depCheck.satisfied ? 'Satisfied' : `${depCheck.missing.length} Missing`}
                </Badge>
              </div>
              {!depCheck.satisfied && depCheck.missing.length > 0 && (
                <div className="bg-warning/10 rounded p-3 border border-warning/30 text-sm text-text-secondary">
                  Waiting for: {depCheck.missing.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Gate Criteria */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-text-primary">Gate Criteria</h4>
              {stage.status === 'in-progress' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleValidateAll}
                  disabled={isValidatingAll}
                >
                  {isValidatingAll ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Validate All
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {stage.gateCriteria.map(criteria => (
                <GateCheckCard key={criteria.id} stageId={stage.id} criteria={criteria} />
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Deliverables</h4>
            <ul className="space-y-2">
              {stage.deliverables.map((deliverable, idx) => (
                <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${stage.status === 'completed' ? 'text-success' : 'text-text-tertiary'}`} />
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>

          {/* Timestamps */}
          {(stage.startedAt || stage.completedAt) && (
            <div className="mt-4 pt-4 border-t border-card-border text-xs text-text-secondary">
              {stage.startedAt && (
                <div>Started: {new Date(stage.startedAt).toLocaleString()}</div>
              )}
              {stage.completedAt && (
                <div>Completed: {new Date(stage.completedAt).toLocaleString()}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WorkflowOrchestrationPanel() {
  const { stages } = useWorkflow();

  return (
    <div className="space-y-4">
      {stages.map(stage => (
        <WorkflowStageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
