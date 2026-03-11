import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Database, ClockArrowDown, ScatterChart, Lightbulb, FileText, Server, 
  CheckCircle2, XCircle, Shield, TrendingUp, TrendingDown, DollarSign, 
  Droplet, ArrowUpRight, Activity, PieChart, BarChart3, Target, Gauge, 
  Zap, Layers 
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { AILedIntegrationFlow } from '../components/AILedIntegrationFlow';
import { MultidisciplinaryIntegration } from '../components/MultidisciplinaryIntegration';
import { AIAgents } from '../components/AIAgents';
import { DataLineage } from '../components/DataLineage';
import { RealTimeSyncIndicator } from '../components/RealTimeSyncIndicator';
import { LayerNavigation } from '../components/layers/LayerNavigation';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { useLayer } from '../context/LayerContext';
import { useState } from 'react';
import { toast } from 'sonner';

const dataSources = [
  { name: 'OSD Corporate DB', status: 'connected', time: '2h ago' },
  { name: 'GeoData 5', status: 'connected', time: null },
  { name: 'Eclipse Sim Server', status: 'connected', time: null },
  { name: 'SPE OnePetro', status: 'pending', time: null }
];

export function Dashboard() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const [showBriefing, setShowBriefing] = useState(true);
  const [showDataSourcesModal, setShowDataSourcesModal] = useState(false);

  // Calculate NPV based on oil production (simplified formula for demonstration)
  const estimatedNPV = (selectedAsset.production.oil / 1000) * 3.1; // Rough NPV in billions
  const npvFormatted = estimatedNPV >= 1 ? `$${estimatedNPV.toFixed(1)}B` : `$${(estimatedNPV * 1000).toFixed(0)}M`;

  // Dynamic Module Cards
  const dynamicModuleCards = [
    {
      id: 'data-health',
      title: 'Data Health',
      icon: Database,
      iconColor: '#3B82F6',
      status: '78% Complete',
      statusColor: 'bg-amber-500',
      metrics: [`${selectedAsset.activeWells} of ${selectedAsset.wells} items validated`, '3 critical gaps'],
      progress: 78,
      hasAI: true,
      path: '/data-health'
    },
    {
      id: 'history-matching',
      title: 'History Matching & Forecasting',
      icon: ClockArrowDown,
      iconColor: '#6B7280',
      status: 'Baseline Ready',
      statusColor: 'bg-green-500',
      metrics: ['Eclipse v2024.1', `${selectedAsset.activeWells} wells matched`],
      layer: 'Layer 1 Only',
      path: '/history-matching'
    },
    {
      id: 'uncertainty',
      title: 'Uncertainty Analysis',
      icon: ScatterChart,
      iconColor: '#8B5CF6',
      status: 'In Progress',
      statusColor: 'bg-amber-500',
      metrics: ['4 categories', '2/4 configured', 'AI Ready'],
      highlight: 'AI Enabled',
      path: '/uncertainty'
    },
    {
      id: 'insights',
      title: 'Insights & Decisions',
      icon: Lightbulb,
      iconColor: '#F59E0B',
      status: 'Awaiting M4',
      statusColor: 'bg-text-tertiary',
      metrics: ['— insights pending simulation results'],
      path: '/insights'
    },
    {
      id: 'fdp-summary',
      title: 'FDP Summary',
      icon: FileText,
      iconColor: '#6B7280',
      status: 'Not Started',
      statusColor: 'bg-text-tertiary',
      metrics: ['Will generate after M5 approval'],
      path: '/fdp-summary'
    },
    {
      id: 'data-sources',
      title: 'Data Sources',
      icon: Server,
      iconColor: '#22C55E',
      status: '5/6 Connected',
      statusColor: 'bg-green-500',
      metrics: [],
      isDataSources: true,
      path: null
    }
  ];

  const handleDataSourcesClick = () => {
    toast.info('Data Sources Modal', {
      description: 'Connection status: 5/6 sources connected'
    });
  };

  // Define KPI sets based on Role/Layer
  const getKPIs = () => {
    switch (globalLayerPreference) {
      case 1: // L1: Executive (Strategic/Financial)
        return [
          {
            id: 'l1-recovery',
            title: 'Est. Ultimate Recovery',
            value: `${selectedAsset.recovery}%`,
            trend: '+2.3%',
            trendUp: true,
            icon: TrendingUp,
            iconColor: 'text-success',
            iconBg: 'bg-success/10'
          },
          {
            id: 'l1-npv',
            title: 'Net Present Value',
            value: npvFormatted,
            trend: '+8.2%',
            trendUp: true,
            icon: DollarSign,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10'
          },
          {
            id: 'l1-roi',
            title: 'Capital Efficiency (ROI)',
            value: '22%',
            trend: '+1.5%',
            trendUp: true,
            icon: PieChart,
            iconColor: 'text-accent',
            iconBg: 'bg-accent/10'
          }
        ];
      case 2: // L2: Asset Manager (Operational/Tactical)
        return [
          {
            id: 'l2-production',
            title: 'Daily Production (Avg)',
            value: '85.2 kbpd',
            trend: '+4.1%',
            trendUp: true,
            icon: BarChart3,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10'
          },
          {
            id: 'l2-water-cut',
            title: 'Water Cut',
            value: `${selectedAsset.waterCut}%`,
            trend: '-1.5%',
            trendUp: true,
            icon: Droplet,
            iconColor: 'text-accent',
            iconBg: 'bg-accent/10'
          },
          {
            id: 'l2-wells',
            title: 'Active Well Count',
            value: `${selectedAsset.activeWells}/${selectedAsset.wells}`,
            trend: '92% Uptime',
            trendUp: true,
            icon: Zap,
            iconColor: 'text-success',
            iconBg: 'bg-success/10'
          }
        ];
      case 3: // L3: Reservoir Engineer (Technical/Model)
        return [
          {
            id: 'l3-hm',
            title: 'Global HM Quality',
            value: '98.5%',
            trend: '+0.5%',
            trendUp: true,
            icon: Target,
            iconColor: 'text-success',
            iconBg: 'bg-success/10',
            source: 'Eclipse Sim Server',
            updated: '12:00:00',
            quality: '98.5%'
          },
          {
            id: 'l3-pressure',
            title: 'Avg Res Pressure',
            value: '3,450 psi',
            trend: '-12 psi',
            trendUp: false,
            icon: Gauge,
            iconColor: 'text-warning',
            iconBg: 'bg-warning/10',
            source: 'OSD Corporate DB',
            updated: '11:45:00',
            quality: '99.2%'
          },
          {
            id: 'l3-sweep',
            title: 'Sweep Efficiency',
            value: '62%',
            trend: '+1.5%',
            trendUp: true,
            icon: Layers,
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            source: 'Sim Model v4.2',
            updated: '10:30:00',
            quality: '95.0%'
          }
        ];
      default:
        return [];
    }
  };

  const kpiData = getKPIs();

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-h2 text-text-primary mb-1">Good morning, Demo User</h1>
              <p className="text-body text-text-secondary">{selectedAsset.name} – {selectedAsset.code} | FDP Cycle 2025-Q1</p>
            </div>
            <LayerNavigation
              currentLayer={globalLayerPreference}
              availableLayers={[1, 2, 3]}
              onLayerChange={(layer) => setGlobalLayerPreference(layer)}
              variant="buttons"
            />
          </div>
        </div>

        {/* AI Briefing Panel - Adaptive Content */}
        {showBriefing && (
          <div className="bg-accent/10 rounded-lg p-4 mb-6 border-l-4 border-accent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-body text-text-primary">✨ AI Briefing</span>
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                {/* L1: Executive Overview */}
                {globalLayerPreference === 1 && (
                  <p className="text-body text-text-secondary leading-relaxed">
                    <span className="text-text-primary font-medium">Overall Status: On Track.</span> FDP Workflow is currently at the M2 validation stage. 
                    Key milestones are proceeding as scheduled.
                  </p>
                )}
                
                {/* L2: Asset Manager - Action Oriented */}
                {globalLayerPreference === 2 && (
                  <p className="text-body text-text-secondary leading-relaxed">
                    <span className="text-text-primary font-medium">Management by Exception:</span> <span className="text-text-primary font-medium">Data Health</span> requires attention (3 critical gaps in Zone C). 
                    Recommended: Complete M2 validation before proceeding to history matching to avoid simulation errors.
                  </p>
                )}

                {/* L3: Reservoir Engineer - Technical Detail */}
                {globalLayerPreference === 3 && (
                  <p className="text-body text-text-secondary leading-relaxed">
                    <span className="text-text-primary font-medium">Technical Status:</span> Market volatility module updated with latest Brent crude forecasts (v4.2). 
                    <span className="text-text-primary font-medium"> 5 AI agents active</span> across history matching and uncertainty quantification layers. 
                    Eclipse Sim Server connected with 98.5% data confidence.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowBriefing(false)}>
                  Dismiss
                </Button>
                <Button variant="ghost" size="sm" onClick={openChat}>
                  Expand
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* KPI Summary Cards - Adaptive Design */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            
            return (
              <div key={kpi.id} className="bg-card border border-card-border rounded-lg p-5 hover:border-card-hover hover:shadow-glow-hover transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${kpi.iconBg} rounded-lg p-2.5`}>
                      <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trendUp ? 'text-success' : 'text-danger'}`}>
                        {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {kpi.trend}
                      </div>

                      {/* L2: Drill-down Icon */}
                      {globalLayerPreference === 2 && (
                        <ArrowUpRight className="w-4 h-4 text-text-tertiary" />
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-sm text-text-secondary font-medium mb-1">
                      {kpi.title
                        .replace('Est.', 'Estimated')
                        .replace('Avg', 'Average')
                        .replace('Res', 'Reservoir')
                        .replace('HM', 'History Match')}
                    </div>
                    <div className="text-3xl font-bold text-text-primary tracking-tight">{kpi.value}</div>
                  </div>
                </div>

                {/* L3: Technical Footer */}
                {globalLayerPreference === 3 && (
                  <div className="mt-4 pt-4 border-t border-card-border grid grid-cols-3 gap-2">
                    <div>
                      <span className="block text-xs text-text-tertiary mb-1">Source</span>
                      <span className="block text-xs font-medium text-text-primary truncate" title={kpi.source}>{kpi.source}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-text-tertiary mb-1">Quality</span>
                      <span className="block text-xs font-medium text-success">{kpi.quality}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-text-tertiary mb-1">Updated</span>
                      <span className="block text-xs font-medium text-text-primary">{kpi.updated}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Divider */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-text-primary">FDP Workflow Modules</h2>
            <div className="flex-1 h-px bg-card-border"></div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {dynamicModuleCards.map((card) => {
            const Icon = card.icon;
            const isLink = !!card.path;
            const CardComponent = isLink ? Link : 'button';
            
            const commonClasses = "bg-card border border-card-border rounded-lg p-4 hover:border-card-hover hover:shadow-glow-hover transition-all text-left w-full";
            
            const cardProps = isLink ? { to: card.path, className: commonClasses } : { 
              onClick: card.isDataSources ? handleDataSourcesClick : undefined,
              className: `${commonClasses} ${card.isDataSources ? 'cursor-pointer' : ''}`,
              type: "button" as const
            };

            return (
              <CardComponent
                key={card.id}
                {...cardProps as any}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                  {card.hasAI && (
                    <Badge variant="info" size="sm">
                      ✨ AI
                    </Badge>
                  )}
                  {card.highlight && (
                    <Badge variant="info" size="sm">
                      {card.highlight}
                    </Badge>
                  )}
                  {card.layer && (
                    <Badge variant="neutral" size="sm">
                      {card.layer}
                    </Badge>
                  )}
                </div>

                <h3 className="text-text-primary font-semibold mb-2">{card.title}</h3>
                
                <Badge className={`${card.statusColor} text-white border-0 mb-3`} size="sm">
                  {card.status}
                </Badge>

                {card.isDataSources ? (
                  <div className="space-y-2 text-xs">
                    {dataSources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-text-secondary">
                        {source.status === 'connected' ? (
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        ) : (
                          <XCircle className="w-3 h-3 text-danger" />
                        )}
                        <span>{source.name}</span>
                        {source.time && (
                          <span className="text-text-tertiary ml-auto">{source.time}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {card.metrics.map((metric, idx) => (
                      <p key={idx} className="text-sm text-text-secondary">{metric}</p>
                    ))}
                  </div>
                )}

                {card.progress !== undefined && (
                  <div className="mt-3">
                    <Progress value={card.progress} className="h-1.5" />
                  </div>
                )}
              </CardComponent>
            );
          })}
        </div>

        {/* Workflow Progress */}
        {globalLayerPreference >= 2 && (
          <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow mb-8">
            <h3 className="text-text-primary font-medium mb-4">FDP Workflow Progress</h3>
            <AILedIntegrationFlow variant="compact" />
          </div>
        )}

        {/* Bottom Section - Two Columns */}
        {globalLayerPreference >= 2 && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Cross-Discipline Integration - 2 columns */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Cross-Discipline Data Integration</h3>
                <Link to="/cross-discipline-visibility">
                  <Button variant="outline" size="sm">
                    View Full Integration →
                  </Button>
                </Link>
              </div>
              <MultidisciplinaryIntegration variant="compact" />
            </div>

            {/* Audit Trail - 1 column */}
            <div className="col-span-1">
              <Link to="/insights/governance-audit">
                <div className="bg-card rounded-lg border border-card-border p-6 hover:border-card-hover hover:shadow-glow-hover transition-all h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-success/10 rounded-lg p-3">
                      <Shield className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h4 className="text-text-primary font-semibold">Governance</h4>
                      <p className="text-xs text-text-secondary">100% Compliant</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    All data validation steps completed. Full audit trail maintained.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Audit Trail →
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* AI Agents Status */}
        {globalLayerPreference >= 3 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">AI Agents Status</h3>
              <Link to="/ai-agents-management">
                <Button variant="outline" size="sm">
                  Manage All Agents →
                </Button>
              </Link>
            </div>
            <AIAgents variant="compact" />
          </div>
        )}

        {/* Real-Time Sync Indicator */}
        <div className="mt-6">
          <RealTimeSyncIndicator />
        </div>
      </div>
    </div>
  );
}