import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { CheckCircle2, Database, ScatterChart, TrendingUp, Lightbulb, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const auditTrail = [
  {
    date: 'Feb 1',
    action: 'Data validation completed',
    actor: 'S. Chen',
    icon: Database,
    color: '#22C55E'
  },
  {
    date: 'Feb 3',
    action: 'Uncertainty framework approved',
    actor: 'S. Chen',
    icon: CheckCircle2,
    color: '#3B82F6'
  },
  {
    date: 'Feb 4',
    action: 'AI Led Simulation completed',
    actor: 'AI Agent',
    icon: ScatterChart,
    color: '#8B5CF6',
    detail: '12.4M scenarios'
  },
  {
    date: 'Feb 5',
    action: 'Insights generated',
    actor: 'AI Agent',
    icon: Lightbulb,
    color: '#F59E0B',
    detail: '8 insights'
  },
  {
    date: 'Feb 5',
    action: 'Decision pending',
    actor: 'Current',
    icon: FileCheck,
    color: '#6366F1',
    current: true
  }
];

export function DecisionApproval() {
  const navigate = useNavigate();
  const [rationale, setRationale] = useState("Scenario #4 selected based on optimal NPV-risk balance with acceptable CapEx within budget. The configuration demonstrates superior performance across all key metrics while maintaining operational feasibility. AI led simulation validated robustness across 12.4M scenarios.");
  const [decision, setDecision] = useState("accept");
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Draft saved successfully', {
        description: 'Your decision has been saved and can be resumed later.'
      });
    }, 1000);
  };

  const handlePeerReview = () => {
    toast.info('Peer review request sent', {
      description: 'Review request sent to senior engineers for validation.'
    });
  };

  const handleGenerateExecutiveSummary = () => {
    toast.info('Generating executive summary', {
      description: 'AI is preparing Tier 2 executive summary...'
    });
    setTimeout(() => {
      toast.success('Executive summary generated', {
        description: 'Summary is ready for review in the FDP Summary module.'
      });
    }, 2000);
  };

  const handleApproveDecision = () => {
    if (!rationale.trim()) {
      toast.error('Rationale required', {
        description: 'Please provide a decision rationale before approving.'
      });
      return;
    }

    setIsApproving(true);
    
    // Simulate approval process
    setTimeout(() => {
      setIsApproving(false);
      toast.success('Decision approved and recorded', {
        description: 'Scenario #4 has been approved. Redirecting to FDP Summary...'
      });
      
      setTimeout(() => {
        navigate('/fdp-summary');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Selected Scenario Summary */}
        <div className="bg-warning/10 rounded-lg p-6 border-l-4 border-warning mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            Recommended FDP Configuration: Scenario Cluster #4
          </h2>
          <div className="grid grid-cols-4 gap-6 mb-3">
            <div>
              <div className="text-sm text-text-secondary">NPV</div>
              <div className="text-2xl font-bold text-text-primary">$2.4B</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">Recovery Factor</div>
              <div className="text-2xl font-bold text-text-primary">47%</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">CapEx</div>
              <div className="text-2xl font-bold text-text-primary">$1.2B</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary">IRR</div>
              <div className="text-2xl font-bold text-text-primary">22%</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <Badge variant="success">
              +14% vs Traditional Best
            </Badge>
            <Badge variant="info">
              +$310M NPV
            </Badge>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Panel - Decision Details */}
          <div className="flex-1 space-y-6">
            {/* Trace-back Flow */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-6">Decision Trace-back</h3>
              <div className="relative flex items-center justify-between gap-4">
                {['Data Sources', 'Static Model', 'Uncertainty', 'AI Sim', 'Insights', 'Decision'].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 relative">
                    {/* Connecting Line */}
                    {idx < 5 && (
                      <div className="absolute left-1/2 top-6 w-full h-0.5 bg-success z-0" />
                    )}
                    
                    <button
                      onClick={() => {
                        const routes = ['/data-health', '/data-health/static-model', '/uncertainty', '/uncertainty/simulation-comparison', '/insights', '/insights/decision-approval'];
                        if (idx < 5) navigate(routes[idx]);
                      }}
                      className="w-12 h-12 rounded-full bg-success flex items-center justify-center mb-3 hover:bg-success/80 transition-colors relative z-10"
                      title={`Navigate to ${step}`}
                      disabled={idx === 5}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-xs text-text-secondary text-center whitespace-nowrap">{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-tertiary text-center mt-6">
                Click any node to trace back to source screen
              </p>
            </div>

            {/* Decision Rationale */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-text-primary font-semibold">Decision Rationale</h3>
                <Badge variant="info" size="sm">
                  ✨ AI Suggested
                </Badge>
              </div>
              <Textarea
                className="min-h-[120px]"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Enter your decision rationale..."
              />
              <p className="text-xs text-text-tertiary mt-2">
                Pre-populated by AI. Edit as needed to add your expertise.
              </p>
            </div>

            {/* Override Section */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Override AI Recommendation?</h3>
              <RadioGroup value={decision} onValueChange={setDecision}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="accept" id="accept" />
                  <Label htmlFor="accept">
                    Accept AI Recommendation
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="modify" id="modify" />
                  <Label htmlFor="modify">
                    Modify Parameters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alternative" id="alternative" />
                  <Label htmlFor="alternative">
                    Select Alternative Scenario
                  </Label>
                </div>
              </RadioGroup>
              {decision === 'modify' && (
                <div className="mt-4 p-3 bg-warning/10 rounded border-l-2 border-warning">
                  <p className="text-sm text-text-secondary">
                    Parameter modification requires recalculation. This will trigger a new AI Led Simulation run.
                  </p>
                </div>
              )}
              {decision === 'alternative' && (
                <div className="mt-4 p-3 bg-primary/10 rounded border-l-2 border-primary">
                  <p className="text-sm text-text-secondary">
                    Alternative scenarios are available in the Simulation Comparison module.
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => navigate('/uncertainty/simulation-comparison')}
                    className="mt-2 p-0 h-auto"
                  >
                    View alternatives →
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Audit Trail */}
          <div className="w-96">
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow sticky top-8">
              <h3 className="text-text-primary font-semibold mb-4">Audit Trail</h3>
              <div className="space-y-4">
                {auditTrail.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 pb-4 ${
                        idx < auditTrail.length - 1 ? 'border-b border-card-border' : ''
                      } ${item.current ? 'bg-primary/5 -m-2 p-2 rounded' : ''}`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-text-primary font-medium">{item.action}</div>
                        {item.detail && (
                          <div className="text-xs text-text-secondary mb-1">{item.detail}</div>
                        )}
                        <div className="text-xs text-text-tertiary">
                          {item.date} · {item.actor}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-card-border">
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft}
            disabled={isSaving}
            isLoading={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handlePeerReview}
            >
              Request Peer Review
            </Button>
            <Button 
              variant="outline"
              onClick={handleGenerateExecutiveSummary}
            >
              Generate Tier 2 Executive Summary
            </Button>
            <Button 
              variant="default" 
              className="bg-success hover:bg-success/90"
              onClick={handleApproveDecision}
              disabled={isApproving}
              isLoading={isApproving}
            >
              {isApproving ? 'Processing...' : 'Approve & Record Decision'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}