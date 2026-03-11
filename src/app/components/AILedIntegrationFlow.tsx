import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Database, 
  ArrowRight, 
  Cpu, 
  BarChart3, 
  CheckCircle, 
  Clock,
  Zap,
  FileText,
  Network
} from 'lucide-react';

interface IntegrationFlowProps {
  variant?: 'full' | 'compact';
}

export function AILedIntegrationFlow({ variant = 'full' }: IntegrationFlowProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const integrationStages = [
    {
      id: 1,
      phase: 'Data Source',
      title: 'Traditional Reservoir Models',
      icon: Database,
      status: 'completed',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      tools: ['Petrel', 'Eclipse', 'Intersect'],
      details: 'Static & dynamic models validated through traditional simulation',
      metrics: {
        models: '3 reservoir models',
        runs: '3,847 simulation runs',
        duration: '28 days computation'
      }
    },
    {
      id: 2,
      phase: 'Training',
      title: 'AI Led Model Training',
      icon: Cpu,
      status: 'completed',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      tools: ['Physics-Informed Neural Networks', 'Transfer Learning'],
      details: 'AI models trained on Eclipse baseline results with physics constraints',
      metrics: {
        scenarios: '3,847 training scenarios',
        accuracy: 'R² = 0.94 validation',
        training: '18 hours GPU time'
      }
    },
    {
      id: 3,
      phase: 'Execution',
      title: 'AI Led Simulation',
      icon: Zap,
      status: 'active',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      tools: ['AI Engine', 'Uncertainty Quantification'],
      details: 'Rapid scenario generation with physics-constrained predictions',
      metrics: {
        scenarios: '12.4M scenarios explored',
        speed: '4.2 days execution',
        coverage: '3,200× parameter space'
      }
    },
    {
      id: 4,
      phase: 'Output',
      title: 'Decision-Ready Results',
      icon: BarChart3,
      status: 'active',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      tools: ['Analytics Dashboard', 'Export to DecisionSpace'],
      details: 'Comprehensive uncertainty quantification and optimization insights',
      metrics: {
        insights: '8 key insights',
        confidence: '87% average',
        visualizations: '15+ interactive charts'
      }
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">AI Led Integration Pipeline</h3>
          <Badge className="bg-success/10 text-success border-success/30">
            Active
          </Badge>
        </div>
        
        <div className="flex items-start justify-between gap-2">
          {integrationStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1 gap-2">
                  {/* Icon container */}
                  <div className={`${stage.bgColor} ${stage.borderColor} border-2 rounded-lg p-3 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stage.color}`} />
                  </div>
                  {/* Title */}
                  <div className="text-xs font-medium text-text-primary text-center max-w-[120px] leading-tight">
                    {stage.title}
                  </div>
                  {/* Phase label */}
                  <div className="text-xs text-text-tertiary text-center">
                    {stage.phase}
                  </div>
                </div>
                {/* Arrow */}
                {index < integrationStages.length - 1 && (
                  <div className="flex items-center justify-center px-3 pb-8">
                    <ArrowRight className="w-6 h-6 text-text-tertiary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-1">
            AI Led Simulation Integration Architecture
          </h3>
          <p className="text-sm text-text-secondary">
            End-to-end workflow from traditional reservoir simulation to AI-accelerated analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-success/10 text-success border-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Integration Active
          </Badge>
        </div>
      </div>

      {/* Integration Flow Diagram */}
      <div className="relative">
        <div className="flex items-start justify-between mb-8">
          {integrationStages.map((stage, index) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;
            
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Stage Card */}
                  <button
                    onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                    className={`${stage.bgColor} ${stage.borderColor} border-2 rounded-lg p-4 w-full transition-all hover:shadow-glow-hover ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${stage.bgColor} rounded-lg p-2`}>
                        <Icon className={`w-6 h-6 ${stage.color}`} />
                      </div>
                      <Badge className={`${stage.bgColor} ${stage.color} border-0 text-xs`}>
                        {stage.status === 'completed' ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                    
                    <div className="text-left">
                      <div className="text-xs text-text-tertiary mb-1">{stage.phase}</div>
                      <div className="text-sm font-semibold text-text-primary mb-2">
                        {stage.title}
                      </div>
                      <div className="text-xs text-text-secondary leading-relaxed">
                        {stage.details}
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="mt-3 pt-3 border-t border-card-border">
                      <div className="flex flex-wrap gap-1">
                        {stage.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-background-secondary text-text-secondary"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Arrow between stages */}
                {index < integrationStages.length - 1 && (
                  <div className="flex flex-col items-center mx-4 mt-16">
                    <ArrowRight className="w-8 h-8 text-primary" />
                    <div className="text-xs text-text-tertiary mt-2 whitespace-nowrap">
                      {index === 0 && 'Baseline Data'}
                      {index === 1 && 'Trained Model'}
                      {index === 2 && 'Results'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Metrics Panel (shown when stage is selected) */}
        {selectedStage && (
          <div className="bg-background-secondary rounded-lg p-6 border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-text-primary">
                {integrationStages[selectedStage - 1].title} - Detailed Metrics
              </h4>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-text-secondary hover:text-text-primary text-sm"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(integrationStages[selectedStage - 1].metrics).map(([key, value]) => (
                <div key={key} className="bg-card rounded-lg p-4 border border-card-border">
                  <div className="text-xs text-text-tertiary mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Benefits */}
      <div className="mt-6 pt-6 border-t border-card-border">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Integration Benefits</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-success/10 rounded-lg p-2">
              <Zap className="w-4 h-4 text-success" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">85% Faster</div>
              <div className="text-xs text-text-secondary">4 days vs 28 days</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Network className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">3,200× Coverage</div>
              <div className="text-xs text-text-secondary">12.4M scenarios explored</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <CheckCircle className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Physics-Validated</div>
              <div className="text-xs text-text-secondary">R² = 0.94 accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          View Integration Logs
        </Button>
        <Button variant="outline" size="sm">
          <Database className="w-4 h-4 mr-2" />
          Check Data Lineage
        </Button>
        <Button variant="primary" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Results Dashboard
        </Button>
      </div>
    </div>
  );
}