import { Badge } from './ui/badge';
import { Clock, Cpu, Database, TrendingUp, Zap, Activity } from 'lucide-react';

interface ComparisonMetric {
  label: string;
  traditional: string;
  aiLed: string;
  icon?: React.ElementType;
}

const comparisonMetrics: ComparisonMetric[] = [
  {
    label: 'Simulation Engine',
    traditional: 'Eclipse v2024.1',
    aiLed: 'AI Engine + Eclipse Baseline',
    icon: Cpu
  },
  {
    label: 'Scenarios Evaluated',
    traditional: '3,000 - 4,000 cases',
    aiLed: '12.4M scenarios',
    icon: Database
  },
  {
    label: 'Computation Time',
    traditional: '25-30 days',
    aiLed: '4 days (85% faster)',
    icon: Clock
  },
  {
    label: 'Physics Basis',
    traditional: 'Finite volume numerical solver',
    aiLed: 'Physics-constrained neural networks',
    icon: Activity
  },
  {
    label: 'Uncertainty Coverage',
    traditional: 'Limited parameter sweep',
    aiLed: 'Full probabilistic distribution',
    icon: TrendingUp
  },
  {
    label: 'Validation Method',
    traditional: 'Industry-proven, deterministic',
    aiLed: 'Trained on Eclipse baseline',
    icon: Zap
  }
];

interface SimulationPathwayComparisonProps {
  variant?: 'full' | 'compact';
  showHeader?: boolean;
}

export function SimulationPathwayComparison({ 
  variant = 'full',
  showHeader = true 
}: SimulationPathwayComparisonProps) {
  
  if (variant === 'compact') {
    return (
      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        {showHeader && (
          <div className="bg-background-secondary px-6 py-4 border-b border-card-border">
            <h3 className="text-text-primary font-semibold">Simulation Pathway Comparison</h3>
            <p className="text-sm text-text-secondary mt-1">
              Traditional Eclipse vs. AI Led approaches
            </p>
          </div>
        )}
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Traditional Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Traditional Simulation</div>
                  <div className="text-xs text-text-tertiary">Eclipse Baseline</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Scenarios</div>
                  <div className="text-sm font-medium text-text-primary">3K - 4K cases</div>
                </div>
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Compute Time</div>
                  <div className="text-sm font-medium text-text-primary">25-30 days</div>
                </div>
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Physics</div>
                  <div className="text-sm font-medium text-text-primary">Finite volume solver</div>
                </div>
              </div>
            </div>

            {/* AI Led Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">AI Led Simulation</div>
                  <div className="text-xs text-text-tertiary">Physics-Constrained AI</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="text-xs text-text-tertiary mb-1">Scenarios</div>
                  <div className="text-sm font-medium text-primary">12.4M scenarios</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="text-xs text-text-tertiary mb-1">Compute Time</div>
                  <div className="text-sm font-medium text-primary">4 days (85% faster)</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="text-xs text-text-tertiary mb-1">Physics</div>
                  <div className="text-sm font-medium text-primary">Neural networks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-6 pt-6 border-t border-card-border">
            <div className="flex items-start gap-3 bg-accent/5 rounded-lg p-4 border border-accent/20">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">
                  Complementary Approaches
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  AI Led Simulation is trained on Eclipse baseline results. Traditional simulation provides 
                  validation and physical grounding. AI acceleration enables millions of scenarios for 
                  comprehensive uncertainty quantification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant - detailed comparison table
  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden shadow-glow">
      {showHeader && (
        <div className="bg-gradient-to-r from-background-secondary to-background-secondary/50 px-6 py-4 border-b border-card-border">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Simulation Pathway Comparison
          </h3>
          <p className="text-sm text-text-secondary">
            Side-by-side comparison of Traditional Eclipse vs. AI Led simulation approaches
          </p>
        </div>
      )}

      <div className="p-6">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
            Metric
          </div>
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div className="text-sm font-semibold text-text-primary">Traditional Simulation</div>
            </div>
            <Badge className="bg-blue-500 text-white border-0" size="sm">
              Eclipse Baseline
            </Badge>
          </div>
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <div className="text-sm font-semibold text-text-primary">AI Led Simulation</div>
            </div>
            <Badge className="bg-primary text-white border-0" size="sm">
              ✨ AI Accelerated
            </Badge>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="space-y-3">
          {comparisonMetrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <div 
                key={index}
                className="grid grid-cols-3 gap-4 items-center py-3 border-b border-card-border last:border-0"
              >
                {/* Metric Label */}
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-text-tertiary" />}
                  <span className="text-sm font-medium text-text-primary">{metric.label}</span>
                </div>

                {/* Traditional Value */}
                <div className="bg-background-secondary rounded-lg px-4 py-3">
                  <div className="text-sm text-text-primary">{metric.traditional}</div>
                </div>

                {/* AI Led Value */}
                <div className="bg-primary/5 rounded-lg px-4 py-3 border border-primary/20">
                  <div className="text-sm font-medium text-primary">{metric.aiLed}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Insights Section */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="text-sm font-semibold text-text-primary">Traditional Strengths</div>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Industry-proven, regulatory-accepted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Full physics fidelity, no approximations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Deterministic, repeatable results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>No training data required</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <div className="text-sm font-semibold text-text-primary">AI Led Advantages</div>
            </div>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>85% faster computation (30 days → 4 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>3,000x more scenarios (12.4M vs 4K)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Full uncertainty distribution coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Real-time scenario exploration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Workflow Integration Note */}
        <div className="mt-6 bg-accent/5 rounded-lg p-5 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-text-primary mb-2">
                Hybrid Workflow Strategy
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                UpstreamAI FDP uses a <strong className="text-text-primary">complementary approach</strong>: 
                Traditional Eclipse simulation establishes the baseline and trains the AI model. Once validated, 
                AI Led Simulation accelerates uncertainty exploration across millions of scenarios—impossible 
                with traditional methods alone.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">Layer 1: Eclipse Baseline</Badge>
                <span className="text-text-tertiary">→</span>
                <Badge variant="info" size="sm">Layer 2: AI Training</Badge>
                <span className="text-text-tertiary">→</span>
                <Badge className="bg-primary text-white border-0" size="sm">Layer 3: AI Led Exploration</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}