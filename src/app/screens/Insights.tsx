import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { ParetoFrontChart } from '../components/ParetoFrontChart';
import { HoverPreview } from '../components/layers/HoverPreview';
import { WithDepthIndicator } from '../components/layers/DepthIndicator';
import { TrendingUp, AlertTriangle, Lightbulb, DollarSign, BarChart3, Zap, CheckCircle, Sparkles, Download, RefreshCw, FileText, Save, X, Loader2, Settings, Clock, Brain } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLayer } from '../context/LayerContext';
import { LayerNavigation } from '../components/layers/LayerNavigation';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';

interface Insight {
  id: number;
  type: string;
  icon: any;
  borderColor: string;
  title: string;
  headline: string;
  confidence: number | null;
  confidenceColor: string | null;
  source: string;
  metrics: any;
  isWarning?: boolean;
  timestamp?: string;
}

const initialInsights: Insight[] = [
  {
    id: 1,
    type: 'optimization',
    icon: TrendingUp,
    borderColor: 'border-green-500',
    title: 'Production Optimization',
    headline: 'Optimal well placement configuration identified with 47% recovery factor — 5% above traditional analysis.',
    confidence: 92,
    confidenceColor: 'bg-green-500',
    source: 'AI Led Scenario Cluster #4',
    metrics: { npv: '$2.4B', capex: '$1.2B', irr: '22%' },
    timestamp: 'Feb 12, 2026, 9:30 AM'
  },
  {
    id: 2,
    type: 'risk',
    icon: AlertTriangle,
    borderColor: 'border-amber-500',
    title: 'Risk Identification',
    headline: 'Price sensitivity is the dominant risk factor, accounting for 38% of NPV variance across all scenarios.',
    confidence: 85,
    confidenceColor: 'bg-amber-500',
    source: 'Sensitivity analysis across U1–U4',
    metrics: null,
    timestamp: 'Feb 12, 2026, 9:25 AM'
  },
  {
    id: 3,
    type: 'capital',
    icon: Lightbulb,
    borderColor: 'border-blue-500',
    title: 'Capital Efficiency',
    headline: 'Phased development (3 stages) reduces upfront CapEx by 30% while maintaining 95% of peak NPV.',
    confidence: 78,
    confidenceColor: 'bg-blue-500',
    source: 'Economic optimization module',
    metrics: null,
    timestamp: 'Feb 12, 2026, 9:20 AM'
  },
  {
    id: 4,
    type: 'warning',
    icon: DollarSign,
    borderColor: 'border-red-500',
    title: 'Data Gap Warning',
    headline: 'Insight confidence limited by incomplete petrophysical data in Zone C. Recommend data acquisition before final decision.',
    confidence: null,
    confidenceColor: null,
    source: 'Data Health Agent',
    metrics: null,
    isWarning: true,
    timestamp: 'Feb 12, 2026, 9:15 AM'
  }
];

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [selectedInsight, setSelectedInsight] = useState(insights[0]);
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const { confirmSuccess, confirmWarning } = useConfirmation();
  const { addNotification } = useNotifications();

  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [insightType, setInsightType] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [scenarioCount, setScenarioCount] = useState(12400000);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  // History
  const [generationHistory, setGenerationHistory] = useState([
    { id: '1', timestamp: 'Feb 12, 2026, 9:30 AM', insightCount: 8, confidence: 87 },
    { id: '2', timestamp: 'Feb 11, 2026, 3:45 PM', insightCount: 7, confidence: 84 },
    { id: '3', timestamp: 'Feb 10, 2026, 10:15 AM', insightCount: 6, confidence: 82 }
  ]);

  const paretoScenarios = [
    { id: 'A', name: 'Scenario A', npv: 1300, waterCut: 28, recovery: 44, risk: 'Low' as const },
    { id: 'B', name: 'Scenario B', npv: 1400, waterCut: 32, recovery: 46, risk: 'Medium' as const, isRecommended: true },
    { id: 'C', name: 'Scenario C', npv: 1500, waterCut: 38, recovery: 47, risk: 'High' as const },
    { id: 'D', name: 'Scenario D', npv: 1100, waterCut: 24, recovery: 41, risk: 'Low' as const },
    { id: 'E', name: 'Scenario E', npv: 1600, waterCut: 42, recovery: 48, risk: 'High' as const },
    { id: 'F', name: 'Scenario F', npv: 1250, waterCut: 30, recovery: 43, risk: 'Low' as const },
    { id: 'G', name: 'Scenario G', npv: 1450, waterCut: 35, recovery: 46, risk: 'Medium' as const },
    { id: 'H', name: 'Scenario H', npv: 1350, waterCut: 34, recovery: 45, risk: 'Medium' as const }
  ];

  // Generate AI insights
  const handleGenerateInsights = async () => {
    const confirmed = await confirmSuccess({
      title: 'Generate AI Insights',
      message: `Generate new insights from ${(scenarioCount / 1000000).toFixed(1)}M scenarios with ${confidenceThreshold}% minimum confidence threshold? This will analyze all simulation results and create actionable recommendations.`,
      confirmLabel: 'Generate Insights',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsGenerating(true);
      setGenerationProgress(0);
      setShowGenerateModal(false);
      
      toast.loading('Starting AI insight generation...', { id: 'generate-insights' });
      
      // Simulate AI processing with stages
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const next = prev + 5;
          
          if (next >= 100) {
            clearInterval(interval);
            
            // Generate new insights
            const newInsights: Insight[] = [
              {
                id: Date.now(),
                type: 'optimization',
                icon: TrendingUp,
                borderColor: 'border-green-500',
                title: 'Enhanced Recovery Strategy',
                headline: 'AI analysis identifies 3-phase water injection strategy that increases recovery to 49%, 7% above baseline.',
                confidence: 94,
                confidenceColor: 'bg-green-500',
                source: 'AI Led Scenario Cluster #7',
                metrics: { npv: '$2.6B', capex: '$1.3B', irr: '24%' },
                timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
              },
              {
                id: Date.now() + 1,
                type: 'risk',
                icon: AlertTriangle,
                borderColor: 'border-amber-500',
                title: 'Operational Risk Mitigation',
                headline: 'Diversifying drilling schedule across 2 rigs reduces project completion risk by 22% with minimal cost increase.',
                confidence: 88,
                confidenceColor: 'bg-amber-500',
                source: 'Risk optimization analysis',
                metrics: null,
                timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
              },
              {
                id: Date.now() + 2,
                type: 'market',
                icon: DollarSign,
                borderColor: 'border-purple-500',
                title: 'Market Timing Opportunity',
                headline: 'Current oil price forecasts favor project initiation in Q3 2026, maximizing NPV by $180M vs immediate start.',
                confidence: 82,
                confidenceColor: 'bg-purple-500',
                source: 'Market volatility analysis',
                metrics: null,
                timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
              }
            ];
            
            // Add to existing insights
            setInsights(prev => [...newInsights, ...prev]);
            
            // Update history
            const newHistory = {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
              insightCount: newInsights.length + insights.length,
              confidence: 89
            };
            setGenerationHistory(prev => [newHistory, ...prev]);
            
            setIsGenerating(false);
            setGenerationProgress(0);
            
            toast.success('Insights Generated', {
              id: 'generate-insights',
              description: `${newInsights.length} new insights created from ${(scenarioCount / 1000000).toFixed(1)}M scenarios`
            });
            
            addNotification({
              type: 'success',
              priority: 'high',
              category: 'simulation',
              title: 'AI Insights Generated',
              message: `${newInsights.length} new actionable insights created`,
              actionLabel: 'View Insights',
              actionUrl: '/insights'
            });
            
            return 100;
          }
          
          const stage = next < 20 ? 'Analyzing scenarios...' : 
                       next < 40 ? 'Identifying patterns...' : 
                       next < 60 ? 'Calculating confidence...' :
                       next < 80 ? 'Generating recommendations...' : 
                       'Finalizing insights...';
          toast.loading(`${stage} ${next}%`, { id: 'generate-insights' });
          return next;
        });
      }, 100);
    }
  };

  // Regenerate specific insight
  const handleRegenerateInsight = async (insight: Insight) => {
    const confirmed = await confirmSuccess({
      title: 'Regenerate Insight',
      message: `Regenerate "${insight.title}" using latest simulation data? This will update the insight with fresh analysis.`,
      confirmLabel: 'Regenerate',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Regenerating insight...', { id: 'regen-insight' });
      
      setTimeout(() => {
        // Update the insight
        setInsights(prev => prev.map(i => {
          if (i.id === insight.id) {
            return {
              ...i,
              confidence: Math.min((i.confidence || 0) + 3, 98),
              timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
            };
          }
          return i;
        }));
        
        toast.success('Insight Regenerated', {
          id: 'regen-insight',
          description: `${insight.title} updated with latest data`
        });
      }, 2000);
    }
  };

  // Export insights
  const handleExportInsights = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Insights Report',
      message: `Export all ${insights.length} insights as ${exportFormat.toUpperCase()} report?${includeCharts ? ' Charts and visualizations will be included.' : ''}`,
      confirmLabel: 'Export Report',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsExporting(true);
      setShowExportModal(false);
      toast.loading('Preparing export...', { id: 'export-insights' });
      
      setTimeout(() => {
        setIsExporting(false);
        
        toast.success('Export Complete', {
          id: 'export-insights',
          description: `Insights report exported as ${exportFormat.toUpperCase()}`
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'data',
          title: 'Insights Report Exported',
          message: `${insights.length} insights exported as ${exportFormat.toUpperCase()}`,
          actionLabel: 'Download',
          actionUrl: '#'
        });
      }, 2000);
    }
  };

  // Save insight to library
  const handleSaveInsight = async (insight: Insight) => {
    toast.success('Insight Saved', {
      description: `${insight.title} saved to your library`
    });
  };

  // Delete insight
  const handleDeleteInsight = async (insight: Insight) => {
    const confirmed = await confirmWarning({
      title: 'Delete Insight',
      message: `Remove "${insight.title}" from insights? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setInsights(prev => prev.filter(i => i.id !== insight.id));
      
      toast.info('Insight Deleted', {
        description: `${insight.title} removed`
      });
    }
  };

  const handleScenarioSelect = (scenario: any) => {
    toast.info(`Scenario ${scenario.id} selected`, {
      description: `NPV: $${(scenario.npv / 1000).toFixed(1)}B, Water Cut: ${scenario.waterCut}%`
    });
  };

  const handleViewInsightDetails = (insight: any) => {
    toast.info(`Viewing details for: ${insight.title}`, {
      description: `Source: ${insight.source}, Confidence: ${insight.confidence}%`
    });
  };

  const overallConfidence = Math.round(
    insights.filter(i => i.confidence).reduce((sum, i) => sum + (i.confidence || 0), 0) / 
    insights.filter(i => i.confidence).length
  );

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">
        {/* Breadcrumb Row with Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-text-secondary">
            <Link to="/dashboard" className="hover:text-text-primary">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">Insights & Decisions</span>
          </div>
          <Badge className="bg-success/10 text-success border-success/30 text-lg px-4 py-2">
            Overall Confidence: {overallConfidence}%
          </Badge>
        </div>

        {/* Header with Layer Navigation */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">Insight Generation & Decision Support</h1>
            <p className="text-sm text-text-secondary">
              {insights.length} insights generated from {(scenarioCount / 1000000).toFixed(1)}M AI Led scenarios + 3,847 traditional scenarios
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowGenerateModal(true)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating... {generationProgress}%
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExportModal(true)}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
            <LayerNavigation
              currentLayer={globalLayerPreference}
              availableLayers={[1, 2, 3]}
              onLayerChange={(layer) => setGlobalLayerPreference(layer)}
              variant="buttons"
            />
          </div>
        </div>

        {/* Generation Progress Bar */}
        {isGenerating && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-text-primary">
                  AI Generating Insights... {generationProgress}%
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Analyzing {(scenarioCount / 1000000).toFixed(1)}M scenarios...
              </span>
            </div>
            <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* LAYER 1 (L1): EXECUTIVE VIEW - High-level summary with top recommendation */}
        {globalLayerPreference === 1 && (
          <div className="space-y-6">
            {/* Top Recommendation Card */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Recommended Development Strategy</h3>
                <Badge variant="success" size="lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready for Decision
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                  <div className="text-sm text-text-secondary mb-1">NPV</div>
                  <div className="text-3xl font-bold text-success">$2.4B</div>
                  <div className="text-xs text-text-tertiary mt-1">Best case</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Recovery</div>
                  <div className="text-3xl font-bold text-text-primary">47%</div>
                  <div className="text-xs text-text-tertiary mt-1">+5% vs traditional</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">CapEx</div>
                  <div className="text-3xl font-bold text-text-primary">$1.2B</div>
                  <div className="text-xs text-text-tertiary mt-1">Phased approach</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Risk Level</div>
                  <div className="text-3xl font-bold text-success">Low</div>
                  <div className="text-xs text-text-tertiary mt-1">{overallConfidence}% confidence</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/insights/decision-approval" className="flex-1">
                  <Button className="w-full bg-success hover:bg-success/90 text-white">
                    Proceed to Review →
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={() => setGlobalLayerPreference(2)}>
                  View Details
                </Button>
              </div>
            </div>

            {/* Key Insights Summary */}
            <div className="grid grid-cols-3 gap-6">
              {insights.slice(0, 3).map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.id} className={`bg-card rounded-lg p-5 border-l-4 ${insight.borderColor} border border-card-border`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5" style={{ color: insight.borderColor.replace('border-', '') }} />
                      <h3 className="text-text-primary font-semibold">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {insight.headline}
                    </p>
                    {insight.confidence && (
                      <Badge className={`${insight.confidenceColor}/10 text-${insight.confidenceColor?.replace('bg-', '')} border-${insight.confidenceColor?.replace('bg-', '')}/30 mt-3`} size="sm">
                        {insight.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Executive Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✨</span>
                <h3 className="text-text-primary font-semibold">Executive Summary</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                AI-powered analysis of {(scenarioCount / 1000000).toFixed(1)} million scenarios recommends Scenario Cluster #4 as the optimal development strategy. 
                This approach delivers $2.4B NPV with 47% recovery factor and low risk profile. Phased implementation reduces initial 
                capital requirements while maintaining economic value. One data quality concern identified in Zone C requiring attention 
                before final approval.
              </p>
            </div>
          </div>
        )}

        {/* LAYER 2 (L2): ASSET MANAGER VIEW - Insights overview with simplified decision support */}
        {globalLayerPreference === 2 && (
          <div className="space-y-6">
            {/* Pareto Chart */}
            <ParetoFrontChart 
              scenarios={paretoScenarios}
              onScenarioSelect={handleScenarioSelect}
            />

            <div className="grid grid-cols-3 gap-6">
              {/* Main Insights */}
              <div className="col-span-2 space-y-4">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={insight.id}
                      className={`bg-card rounded-lg p-5 border-l-4 ${insight.borderColor} border border-card-border`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${insight.isWarning ? 'bg-danger/10' : 'bg-background-secondary'}`}>
                          <Icon className={`w-6 h-6 ${insight.isWarning ? 'text-danger' : 'text-text-primary'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-text-primary font-semibold mb-1">{insight.title}</h3>
                              <p className="text-xs text-text-tertiary mb-2">
                                {insight.source}
                                {insight.timestamp && ` • ${insight.timestamp}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRegenerateInsight(insight)}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Regenerate
                              </Button>
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveInsight(insight)}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed mb-3">
                            {insight.headline}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {insight.confidence && (
                                <Badge variant="success" size="sm">
                                  {insight.confidence}% confidence
                                </Badge>
                              )}
                              {insight.metrics && (
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-text-tertiary">NPV:</span>
                                  <span className="text-text-primary font-semibold">{insight.metrics.npv}</span>
                                  <span className="text-text-tertiary">•</span>
                                  <span className="text-text-tertiary">IRR:</span>
                                  <span className="text-text-primary font-semibold">{insight.metrics.irr}</span>
                                </div>
                              )}
                            </div>
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewInsightDetails(insight)}
                            >
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Generation History */}
                <div className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary font-semibold">Generation History</h3>
                    <Badge variant="info" size="sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {generationHistory.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {generationHistory.map((gen, index) => (
                      <div 
                        key={gen.id}
                        className={`p-3 rounded border ${
                          index === 0 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'bg-background-secondary border-card-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-text-primary">
                            {gen.insightCount} insights
                          </span>
                          {index === 0 && (
                            <Badge variant="primary" size="sm">Current</Badge>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary">{gen.timestamp}</div>
                        <div className="text-xs text-text-tertiary mt-1">
                          Confidence: {gen.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
                  <h3 className="text-text-primary font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowGenerateModal(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate New Insights
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowExportModal(true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Link to="/insights/decision-approval" className="block">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit for Approval
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* AI Agent Status */}
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-accent" />
                    <h3 className="text-text-primary font-semibold">AI Agent Status</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Active Agents:</span>
                      <Badge variant="success" size="sm">5/5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Scenarios Analyzed:</span>
                      <span className="text-xs text-text-primary font-semibold">
                        {(scenarioCount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Last Update:</span>
                      <span className="text-xs text-text-primary">
                        {generationHistory[0]?.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 3 (L3): RESERVOIR ENGINEER - Full technical details */}
        {globalLayerPreference === 3 && (
          <div className="space-y-6">
            {/* Detailed view similar to L2 but with more technical controls */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Insight Management</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setShowGenerateModal(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Generation
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={insight.id}
                      className={`bg-background-secondary rounded-lg p-4 border-l-4 ${insight.borderColor}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${insight.isWarning ? 'bg-danger/10' : 'bg-card'}`}>
                            <Icon className={`w-5 h-5 ${insight.isWarning ? 'text-danger' : 'text-text-primary'}`} />
                          </div>
                          <div>
                            <h4 className="text-text-primary font-semibold mb-1">{insight.title}</h4>
                            <p className="text-xs text-text-tertiary">
                              ID: {insight.id} • {insight.source} • {insight.timestamp}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRegenerateInsight(insight)}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveInsight(insight)}
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteInsight(insight)}
                            className="text-danger hover:text-danger"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-text-secondary mb-3">{insight.headline}</p>

                      {insight.metrics && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="bg-card rounded p-2">
                            <div className="text-xs text-text-tertiary">NPV</div>
                            <div className="text-sm font-semibold text-text-primary">{insight.metrics.npv}</div>
                          </div>
                          <div className="bg-card rounded p-2">
                            <div className="text-xs text-text-tertiary">CapEx</div>
                            <div className="text-sm font-semibold text-text-primary">{insight.metrics.capex}</div>
                          </div>
                          <div className="bg-card rounded p-2">
                            <div className="text-xs text-text-tertiary">IRR</div>
                            <div className="text-sm font-semibold text-text-primary">{insight.metrics.irr}</div>
                          </div>
                        </div>
                      )}

                      {insight.confidence && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${insight.confidenceColor}`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary">{insight.confidence}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isGenerating && setShowGenerateModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-text-primary">Generate AI Insights</h3>
                </div>
                {!isGenerating && (
                  <button onClick={() => setShowGenerateModal(false)} className="text-text-secondary hover:text-text-primary">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Insight Type</label>
                  <Select value={insightType} onValueChange={setInsightType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="optimization">Optimization Only</SelectItem>
                      <SelectItem value="risk">Risk Only</SelectItem>
                      <SelectItem value="capital">Capital Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">
                    Confidence Threshold: {confidenceThreshold}%
                  </label>
                  <Slider 
                    value={[confidenceThreshold]}
                    onValueChange={(value) => setConfidenceThreshold(value[0])}
                    min={50}
                    max={95}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Scenarios to Analyze</label>
                  <Input 
                    type="number"
                    value={scenarioCount}
                    onChange={(e) => setScenarioCount(parseInt(e.target.value) || 12400000)}
                    min="1000000"
                    step="100000"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {(scenarioCount / 1000000).toFixed(1)} million scenarios
                  </p>
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-sm text-text-secondary mb-2">Current Insights:</div>
                  <div className="text-2xl font-bold text-text-primary mb-1">{insights.length}</div>
                  <div className="text-xs text-text-tertiary">
                    Overall confidence: {overallConfidence}%
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-text-secondary">
                  <strong className="text-primary">Note:</strong> AI will analyze all simulation results and generate actionable insights based on your specified criteria. This typically takes 2-3 minutes.
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowGenerateModal(false)} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleGenerateInsights} disabled={isGenerating}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isExporting && setShowExportModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-text-primary">Export Insights Report</h3>
                </div>
                {!isExporting && (
                  <button onClick={() => setShowExportModal(false)} className="text-text-secondary hover:text-text-primary">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="docx">Word Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-text-secondary block">Include in Export:</label>
                  
                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span className="text-sm text-text-primary">Charts & Visualizations</span>
                    <input 
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                    <span className="text-sm text-text-primary">Recommendations</span>
                    <input 
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-sm text-text-secondary mb-2">Export Contents:</div>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• {insights.length} insights with confidence scores</li>
                    <li>• Overall analysis and recommendations</li>
                    {includeCharts && <li>• Pareto front chart and visualizations</li>}
                    {includeRecommendations && <li>• AI-generated recommendations</li>}
                    <li>• Generation history and metadata</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowExportModal(false)} disabled={isExporting}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleExportInsights} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
