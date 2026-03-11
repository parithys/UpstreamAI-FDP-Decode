import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useChat } from '../context/ChatContext';
import {
  Brain,
  Database,
  TrendingUp,
  BarChart3,
  Activity,
  Layers,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  FileText,
  GitMerge
} from 'lucide-react';
import { toast } from 'sonner';
import { TornadoChart } from '../components/TornadoChart';
import { SimulationPathwayComparison } from '../components/SimulationPathwayComparison';
import { useLayer } from '../context/LayerContext';
import { LayerNavigation } from '../components/layers/LayerNavigation';

const uncertaintyCategories = [
  {
    id: 'subsurface',
    title: 'Subsurface Uncertainty',
    icon: Layers,
    iconColor: '#EF4444',
    status: 'Partially Configured',
    statusColor: 'bg-warning',
    parameters: '12 parameters defined | 4 pending',
    readiness: 65,
    note: 'Detailed config in future phase',
    path: '/uncertainty/subsurface'
  },
  {
    id: 'operational',
    title: 'Operational & Technical',
    icon: Activity,
    iconColor: '#F59E0B',
    status: 'In Progress',
    statusColor: 'bg-warning',
    parameters: '8 parameters | 6 configured',
    readiness: 75,
    path: '/uncertainty/operational'
  },
  {
    id: 'market',
    title: 'Market Volatility',
    icon: TrendingUp,
    iconColor: '#8B5CF6',
    status: 'Configured',
    statusColor: 'bg-success',
    parameters: 'Brent crude: $65–$95 range | 3 geopolitical scenarios',
    readiness: 100,
    highlight: true,
    demoReady: true,
    path: '/uncertainty/market-volatility'
  },
  {
    id: 'cross-domain',
    title: 'Cross-Domain Interactions',
    icon: GitMerge,
    iconColor: '#6366F1',
    status: 'Pending U1–U3 Completion',
    statusColor: 'bg-text-tertiary',
    parameters: 'Requires all other categories first',
    readiness: 0,
    path: '/uncertainty/cross-domain'
  }
];

export function Uncertainty() {
  const { openChat } = useChat();
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();

  const handleViewDocumentation = () => {
    toast.info('Opening uncertainty documentation', {
      description: 'Loading comprehensive guide to uncertainty framework'
    });
  };

  const handleConfigureParameters = (categoryName: string) => {
    toast.info(`Configure ${categoryName} Parameters`, {
      description: `Opening parameter configuration panel for ${categoryName.toLowerCase()}`
    });
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header with Layer Navigation */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Uncertainty Analysis
            </h1>
            <p className="text-sm text-text-secondary">Configure parameters for AI Led Simulation</p>
          </div>
          <div className="flex items-center gap-3">
            <LayerNavigation
              currentLayer={globalLayerPreference}
              availableLayers={[1, 2, 3]}
              onLayerChange={(layer) => setGlobalLayerPreference(layer)}
              variant="buttons"
            />
            {globalLayerPreference === 3 && (
              <>
                <Button variant="outline" onClick={handleViewDocumentation}>
                  View Documentation
                </Button>
                <Button variant="primary" onClick={openChat}>
                  ✨ AI Recommendations
                </Button>
              </>
            )}
          </div>
        </div>

        {/* LAYER 1 (L1): EXECUTIVE VIEW - High-level summary */}
        {globalLayerPreference === 1 && (
          <div className="space-y-6">
            {/* Overall Status Card */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Uncertainty Analysis Status</h3>
                <Badge variant="warning" size="lg">
                  <Activity className="w-4 h-4 mr-1" />
                  60% Complete
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="text-sm text-text-secondary mb-1">Traditional Scenarios</div>
                  <div className="text-3xl font-bold text-primary">3.8K</div>
                  <div className="text-xs text-text-tertiary mt-1">vs. 12.4M AI Led</div>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
                  <div className="text-sm text-text-secondary mb-1">Traditional Timeline</div>
                  <div className="text-3xl font-bold text-warning">28 Days</div>
                  <div className="text-xs text-text-tertiary mt-1">vs. 4 days AI Led</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Categories</div>
                  <div className="text-3xl font-bold text-text-primary">1/4</div>
                  <div className="text-xs text-text-tertiary mt-1">Ready for simulation</div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="space-y-3">
                {uncertaintyCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        category.readiness === 100 ? 'bg-success' : 
                        category.readiness > 0 ? 'bg-warning' : 'bg-text-tertiary'
                      }`} />
                      <span className="text-sm text-text-primary font-medium">{category.title}</span>
                    </div>
                    <span className="text-sm text-text-secondary">{category.readiness}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✨</span>
                <h3 className="text-text-primary font-semibold">Executive Summary</h3>
              </div>
              <p className="text-text-secondary leading-relaxed mb-3">
                Uncertainty analysis is 60% complete. Market Volatility parameters are fully configured and ready for AI Led simulation. 
                Three additional categories (Subsurface, Operational, Cross-Domain) require completion before full simulation run.
              </p>
              <p className="text-text-secondary leading-relaxed">
                AI Led simulation will provide 3,200× more scenario coverage (12.4M vs 3.8K scenarios) in significantly less time (4 days vs 28+ days), 
                enabling comprehensive risk assessment and optimized field development planning.
              </p>
            </div>

            {/* AI Led Benefits */}
            <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="text-text-primary font-semibold mb-4">AI Led Simulation Benefits</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">7×</div>
                  <div className="text-sm text-text-secondary">Faster completion</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">3,200×</div>
                  <div className="text-sm text-text-secondary">More scenarios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-text-secondary">Physics-constrained</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 2 (L2): ASSET MANAGER VIEW - Category overview with insights */}
        {globalLayerPreference === 2 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="text-text-primary font-medium">AI Led Simulation Framework:</span> Once all uncertainty categories are configured, the AI engine will generate 
                <span className="text-text-primary font-medium"> 12.4 million scenarios</span> in ~4 days (vs. traditional simulation's ~3,800 scenarios in 28+ days).
              </p>
            </div>

            {/* Category Overview Cards */}
            <div className="grid grid-cols-2 gap-6">
              {uncertaintyCategories.map((category) => {
                const Icon = category.icon;
                
                return (
                  <div
                    key={category.id}
                    className="bg-card border border-card-border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-8 h-8" style={{ color: category.iconColor }} />
                      <Badge className={`${category.statusColor} text-white border-0`} size="sm">
                        {category.status}
                      </Badge>
                    </div>

                    <h3 className="text-text-primary font-semibold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm text-text-secondary mb-4">{category.parameters}</p>

                    {/* Readiness Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-tertiary">Readiness</span>
                        <span className="text-text-primary font-medium">{category.readiness}%</span>
                      </div>
                      <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${category.readiness === 100 ? 'bg-success' : 'bg-warning'}`}
                          style={{ width: `${category.readiness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simplified Sensitivity Chart */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-1">Top Sensitivity Drivers</h3>
              <p className="text-sm text-text-secondary mb-6">Parameters with highest impact on production outcomes</p>
              
              <div className="space-y-4">
                {[
                  { name: 'Porosity Variance', impact: 60, color: 'bg-success' },
                  { name: 'Aquifer Strength', impact: 38, color: 'bg-primary' },
                  { name: 'Oil Price Volatility', impact: 25, color: 'bg-warning' }
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-text-primary">{item.name}</span>
                      <span className="text-text-secondary font-medium">{item.impact}% impact</span>
                    </div>
                    <div className="w-full h-3 bg-background-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.impact}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Led Benefits Comparison */}
            <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="text-text-primary font-semibold mb-3">AI Led vs Traditional Simulation</h3>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-text-primary font-medium mb-1">Speed</div>
                  <p className="text-text-secondary">
                    12.4M scenarios in 4 days vs traditional 3.8K in 28+ days
                  </p>
                </div>
                <div>
                  <div className="text-text-primary font-medium mb-1">Coverage</div>
                  <p className="text-text-secondary">
                    3,200× more solution space exploration
                  </p>
                </div>
                <div>
                  <div className="text-text-primary font-medium mb-1">Accuracy</div>
                  <p className="text-text-secondary">
                    Physics-constrained AI models trained on Eclipse baseline
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 3 (L3): RESERVOIR ENGINEER VIEW - Full technical detail */}
        {globalLayerPreference === 3 && (
          <>
            {/* Info Banner */}
            <div className="bg-accent/10 rounded-lg p-4 mb-6 border-l-4 border-accent">
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="text-text-primary font-medium">AI Led Simulation Framework:</span> Once all uncertainty categories are configured, the AI engine will generate 
                <span className="text-text-primary font-medium"> 12.4 million scenarios</span> in ~4 days (vs. traditional simulation's ~3,800 scenarios in 28+ days).
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 gap-6">
              {uncertaintyCategories.map((category) => {
                const Icon = category.icon;
                const CardComponent = category.path ? Link : 'div';
                const cardProps = category.path ? { to: category.path } : {};

                return (
                  <CardComponent
                    key={category.id}
                    {...cardProps}
                    className={`bg-card border border-card-border rounded-lg p-6 transition-all ${
                      category.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:border-card-hover hover:shadow-glow-hover cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-8 h-8" style={{ color: category.iconColor }} />
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${category.statusColor} text-white border-0`} size="sm">
                          {category.status}
                        </Badge>
                        {category.highlight && (
                          <Badge variant="info" size="sm">
                            ✨ Demo Ready
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="text-text-primary font-semibold text-lg mb-2">{category.title}</h3>
                    
                    <p className="text-sm text-text-secondary mb-4">{category.parameters}</p>

                    {/* Readiness Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-tertiary">Readiness</span>
                        <span className="text-text-primary font-medium">{category.readiness}%</span>
                      </div>
                      <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${category.readiness === 100 ? 'bg-success' : 'bg-warning'}`}
                          style={{ width: `${category.readiness}%` }}
                        />
                      </div>
                    </div>

                    {category.note && (
                      <p className="text-xs text-text-tertiary italic">{category.note}</p>
                    )}

                    {category.demoReady && (
                      <div className="mt-4">
                        <Button variant="primary" className="w-full" onClick={() => handleConfigureParameters(category.title)}>
                          Configure Parameters →
                        </Button>
                      </div>
                    )}
                  </CardComponent>
                );
              })}
            </div>

            {/* Tornado Chart - Sensitivity Ranking */}
            <div className="mt-6">
              <TornadoChart 
                title="Sensitivity Analysis - Key Drivers"
                data={[
                  { variable: 'Porosity Variance', impact: 60, direction: 'positive' },
                  { variable: 'Aquifer Strength', impact: 38, direction: 'neutral' },
                  { variable: 'Oil Price Volatility', impact: 25, direction: 'positive' },
                  { variable: 'Saturation Range', impact: 18, direction: 'negative' },
                  { variable: 'Fault Transmissibility', impact: 12, direction: 'neutral' }
                ]}
              />
            </div>

            {/* AI Led Simulation Info Panel */}
            <div className="mt-6 bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="text-text-primary font-semibold mb-3">Why AI Led Simulation?</h3>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-text-primary font-medium mb-1">Speed</div>
                  <p className="text-text-secondary">
                    12.4M scenarios in 4 days vs traditional 3.8K in 28+ days
                  </p>
                </div>
                <div>
                  <div className="text-text-primary font-medium mb-1">Coverage</div>
                  <p className="text-text-secondary">
                    3,200× more solution space exploration
                  </p>
                </div>
                <div>
                  <div className="text-text-primary font-medium mb-1">Accuracy</div>
                  <p className="text-text-secondary">
                    Physics-constrained AI models trained on Eclipse baseline
                  </p>
                </div>
              </div>
            </div>

            {/* Simulation Pathway Comparison */}
            <div className="mt-6">
              <SimulationPathwayComparison variant="compact" showHeader={true} />
            </div>

            {/* Deep Dive Analytics Access */}
            <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    Layer 3: Advanced Visualizations Available
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Access interactive deep-dive charts including production forecasts, tornado charts, Monte Carlo distributions, and parameter correlations
                  </p>
                </div>
                <Link to="/insights/deep-dive-analytics">
                  <Button variant="primary">
                    View Deep Dive Analytics →
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Led Integration Link */}
            <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    AI Led Simulation Integration
                  </h3>
                  <p className="text-sm text-text-secondary">
                    View the complete integration architecture showing how AI Led simulation connects with Eclipse, Petrel, and traditional tools
                  </p>
                </div>
                <Link to="/insights/ai-led-integration">
                  <Button variant="outline">
                    View Integration Details →
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons - Show on all layers */}
        <div className="flex justify-between items-center mt-6">
          <Link to="/history-matching">
            <Button variant="ghost">
              ← Back to History Matching
            </Button>
          </Link>
          <Link to="/uncertainty/simulation-comparison">
            <Button variant="primary">
              View Simulation Comparison →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}