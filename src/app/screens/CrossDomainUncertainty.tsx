import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { GitMerge, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const interactionEffects = [
  {
    id: 'subsurface-market',
    category1: 'Subsurface',
    category2: 'Market Volatility',
    interaction: 'Recovery Factor × Oil Price',
    description: 'Higher recovery uncertainty compounds with price volatility in NPV calculations',
    magnitude: 'High',
    correlation: '+0.78',
    impact: 'Amplifies NPV uncertainty by 35-40% vs. independent assumptions',
    color: '#EF4444'
  },
  {
    id: 'operational-subsurface',
    category1: 'Operational',
    category2: 'Subsurface',
    interaction: 'Facility Uptime × Reservoir Productivity',
    description: 'Production facility constraints interact with well productivity decline',
    magnitude: 'Medium-High',
    correlation: '+0.62',
    impact: 'Combined effect reduces peak production realization by 8-12%',
    color: '#F59E0B'
  },
  {
    id: 'market-operational',
    category1: 'Market Volatility',
    category2: 'Operational',
    interaction: 'Price Scenarios × Capex Efficiency',
    description: 'Low price scenarios drive cost reduction, affecting drilling/completion efficiency',
    magnitude: 'Medium',
    correlation: '-0.45',
    impact: 'Cost pressure in low-price scenarios may reduce operational efficiency',
    color: '#8B5CF6'
  },
  {
    id: 'all-three',
    category1: 'All Categories',
    category2: 'Combined Effect',
    interaction: 'Triple Interaction: Reservoir × Operations × Market',
    description: 'Compounding effects when all three uncertainty categories align unfavorably',
    magnitude: 'Very High',
    correlation: 'Non-linear',
    impact: 'Tail-risk scenarios: P10 NPV 55% lower than independent uncertainty model',
    color: '#6366F1'
  }
];

const riskScenarios = [
  {
    id: 'base-case',
    name: 'Base Case (Independent)',
    p10: '$1.2B',
    p50: '$2.4B',
    p90: '$3.8B',
    scenarios: '12.4M scenarios',
    assumptions: 'Assumes no correlation between uncertainty categories'
  },
  {
    id: 'correlated',
    name: 'Cross-Domain Correlated',
    p10: '$0.7B',
    p50: '$2.3B',
    p90: '$4.1B',
    scenarios: '12.4M scenarios',
    assumptions: 'Includes interaction effects and correlations'
  }
];

export function CrossDomainUncertainty() {
  const { openChat } = useChat();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
              <GitMerge className="w-6 h-6" style={{ color: '#6366F1' }} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-1">
                Cross-Domain Uncertainty Interactions
              </h1>
              <p className="text-sm text-text-secondary">
                Interaction effects and compounding uncertainty factors (U1–U3)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={openChat}>
              ✨ AI Analysis
            </Button>
          </div>
        </div>

        {/* Dependency Alert */}
        <div className="bg-warning/10 rounded-lg p-5 mb-6 border-l-4 border-warning">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-text-primary font-semibold mb-2">
                Configuration Dependencies
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Cross-domain interaction analysis requires completion of U1 (Subsurface), U2 (Operational), 
                and U3 (Market Volatility) first. Current status:
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning text-white border-0" size="sm">65%</Badge>
                  <span className="text-text-secondary">U1: Subsurface</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning text-white border-0" size="sm">75%</Badge>
                  <span className="text-text-secondary">U2: Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-white border-0" size="sm">100%</Badge>
                  <span className="text-text-secondary">U3: Market Volatility</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Effects Matrix */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Identified Interaction Effects
          </h2>
          <div className="space-y-4">
            {interactionEffects.map((effect) => (
              <div
                key={effect.id}
                className="bg-card border border-card-border rounded-lg p-5"
                style={{ borderLeftWidth: '4px', borderLeftColor: effect.color }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-text-primary font-semibold text-lg">
                        {effect.interaction}
                      </div>
                      <Badge 
                        className={`${
                          effect.magnitude === 'Very High' ? 'bg-error' :
                          effect.magnitude === 'High' ? 'bg-warning' :
                          effect.magnitude === 'Medium-High' ? 'bg-warning' :
                          'bg-accent'
                        } text-white border-0`}
                        size="sm"
                      >
                        {effect.magnitude}
                      </Badge>
                    </div>
                    <div className="text-sm text-text-secondary mb-1">
                      {effect.category1} ↔ {effect.category2}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-tertiary mb-1">Correlation</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {effect.correlation}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-3">
                  {effect.description}
                </p>

                <div className="bg-background-secondary rounded p-3">
                  <div className="text-xs text-text-tertiary mb-1">Impact Assessment</div>
                  <div className="text-sm text-text-primary">
                    {effect.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Profile Comparison */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            NPV Risk Profile: Independent vs. Correlated
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {riskScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`bg-card border rounded-lg p-5 ${
                  scenario.id === 'correlated' 
                    ? 'border-primary border-2' 
                    : 'border-card-border'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-text-primary font-semibold text-lg">
                    {scenario.name}
                  </div>
                  {scenario.id === 'correlated' && (
                    <Badge className="bg-primary text-white border-0" size="sm">
                      Recommended
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-text-tertiary mb-1">P10 (Low)</div>
                    <div className="text-xl font-semibold text-error">{scenario.p10}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-tertiary mb-1">P50 (Base)</div>
                    <div className="text-xl font-semibold text-text-primary">{scenario.p50}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-tertiary mb-1">P90 (High)</div>
                    <div className="text-xl font-semibold text-success">{scenario.p90}</div>
                  </div>
                </div>

                <div className="text-xs text-text-secondary mb-2">
                  {scenario.scenarios} evaluated
                </div>
                <div className="text-xs text-text-tertiary">
                  {scenario.assumptions}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-text-secondary">
                <strong className="text-text-primary">Key Insight:</strong> Cross-domain correlations 
                significantly widen the risk profile. P10 scenario is 42% lower when interactions are 
                modeled, while P90 increases by 8%. This asymmetry reflects compounding downside risks.
              </div>
            </div>
          </div>
        </div>

        {/* Correlation Matrix Visual */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Parameter Correlation Matrix (Preliminary)
          </h2>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="grid grid-cols-4 gap-3 text-center text-sm">
              {/* Header Row */}
              <div></div>
              <div className="text-text-tertiary font-medium">Subsurface</div>
              <div className="text-text-tertiary font-medium">Operational</div>
              <div className="text-text-tertiary font-medium">Market</div>

              {/* Subsurface Row */}
              <div className="text-text-tertiary font-medium text-right">Subsurface</div>
              <div className="bg-background-secondary rounded p-2 text-text-primary">1.00</div>
              <div className="bg-warning/20 rounded p-2 text-text-primary font-medium">+0.62</div>
              <div className="bg-error/20 rounded p-2 text-text-primary font-medium">+0.78</div>

              {/* Operational Row */}
              <div className="text-text-tertiary font-medium text-right">Operational</div>
              <div className="bg-warning/20 rounded p-2 text-text-primary font-medium">+0.62</div>
              <div className="bg-background-secondary rounded p-2 text-text-primary">1.00</div>
              <div className="bg-accent/20 rounded p-2 text-text-primary">-0.45</div>

              {/* Market Row */}
              <div className="text-text-tertiary font-medium text-right">Market</div>
              <div className="bg-error/20 rounded p-2 text-text-primary font-medium">+0.78</div>
              <div className="bg-accent/20 rounded p-2 text-text-primary">-0.45</div>
              <div className="bg-background-secondary rounded p-2 text-text-primary">1.00</div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-error/20 rounded"></div>
                <span className="text-text-tertiary">Strong positive (0.7+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-warning/20 rounded"></div>
                <span className="text-text-tertiary">Moderate positive (0.4-0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent/20 rounded"></div>
                <span className="text-text-tertiary">Moderate negative (-0.4 to -0.7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monte Carlo Configuration */}
        <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-text-primary font-semibold mb-2">
                AI Led Simulation with Correlated Sampling
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                When all categories are complete, the AI engine will use correlated sampling to preserve 
                interaction effects across 12.4 million scenarios. This provides a realistic 
                risk-adjusted distribution rather than overly optimistic independent assumptions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-text-primary font-medium mb-1">Sampling Method</div>
              <p className="text-text-secondary">
                Latin Hypercube with Cholesky decomposition for correlation structure
              </p>
            </div>
            <div>
              <div className="text-text-primary font-medium mb-1">Scenario Generation</div>
              <p className="text-text-secondary">
                12.4M scenarios preserving specified correlation matrix
              </p>
            </div>
            <div>
              <div className="text-text-primary font-medium mb-1">Validation</div>
              <p className="text-text-secondary">
                Rank correlation verification against target matrix (tolerance: ±0.05)
              </p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-text-primary font-semibold mb-2">AI Assistant Recommendations</div>
              <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
                <li>
                  <strong>Complete U1 & U2:</strong> Finish subsurface and operational configurations 
                  to enable full cross-domain analysis.
                </li>
                <li>
                  <strong>Correlation Validation:</strong> Review preliminary correlation estimates 
                  with SMEs. Strong +0.78 subsurface-market correlation drives tail risk.
                </li>
                <li>
                  <strong>Scenario Testing:</strong> Once configured, run comparison: independent vs. 
                  correlated to quantify impact on investment decision thresholds.
                </li>
                <li>
                  <strong>Risk Mitigation:</strong> Strong positive correlations suggest considering 
                  risk mitigation strategies (hedging, phased development) for downside scenarios.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to="/uncertainty/market-volatility">
            <Button variant="ghost">
              ← Back to Market Volatility
            </Button>
          </Link>
          <Link to="/uncertainty/simulation-comparison">
            <Button variant="primary" disabled>
              Proceed to Simulation →
              <span className="ml-2 text-xs">(Complete U1-U3 first)</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}