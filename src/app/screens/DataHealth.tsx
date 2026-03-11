import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DataProvenance } from '../components/DataProvenance';
import { LayerContainer } from '../components/layers/LayerContainer';
import { LayerIndicator } from '../components/layers/LayerIndicator';
import { LayerNavigation } from '../components/layers/LayerNavigation';
import { HoverPreview } from '../components/layers/HoverPreview';
import { WithDepthIndicator } from '../components/layers/DepthIndicator';
import { Database, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Activity, Download, Sparkles, RefreshCw } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { useLayer } from '../context/LayerContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { toast } from 'sonner';
import { useState } from 'react';

const categoryCards = [
  {
    id: 'static-model',
    title: 'Static Model',
    icon: Database,
    iconColor: '#3B82F6',
    status: 'Loaded & Validated',
    statusColor: 'bg-green-500',
    validated: true,
    metrics: '8/8 items complete | Last validated: 3 days ago',
    provenance: 'Layer 1: Ground Truth',
    hasAI: true,
    path: '/data-health/static-model'
  },
  {
    id: 'well-data',
    title: 'Well Data',
    icon: CheckCircle2,
    iconColor: '#22C55E',
    status: '100% Complete',
    statusColor: 'bg-green-500',
    validated: true,
    metrics: '24 wells | Trajectories + completions loaded',
    provenance: 'Layer 1: Ground Truth'
  },
  {
    id: 'petro-logs',
    title: 'Petrophysical Logs',
    icon: Activity,
    iconColor: '#F59E0B',
    status: '72% Complete',
    statusColor: 'bg-amber-500',
    validated: false,
    metrics: '18/25 logs loaded | 3 critical gaps in Zone C',
    warning: '3 Missing',
    provenance: 'Layer 1: Ground Truth'
  },
  {
    id: 'geological',
    title: 'Geological Interpretations',
    icon: AlertTriangle,
    iconColor: '#F59E0B',
    status: '65% Complete',
    statusColor: 'bg-amber-500',
    validated: false,
    metrics: 'Sedimentology reports partial | Carbonate analysis pending',
    provenance: 'Layer 2: Interpreted'
  },
  {
    id: 'geophysical',
    title: 'Geophysical Data',
    icon: Database,
    iconColor: '#22C55E',
    status: 'Complete',
    statusColor: 'bg-green-500',
    validated: true,
    metrics: 'Seismic volume loaded | Processing quality: Good',
    provenance: 'Layer 1: Ground Truth'
  },
  {
    id: 'production',
    title: 'Production History',
    icon: TrendingUp,
    iconColor: '#EF4444',
    status: '45% Complete',
    statusColor: 'bg-red-500',
    validated: false,
    metrics: 'Historical data sparse for Wells 15–24',
    warning: 'Action Required',
    provenance: 'Layer 1: Ground Truth'
  }
];

export function DataHealth() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const { confirm } = useConfirmation();
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handle Validate All action
  const handleValidateAll = async () => {
    const confirmed = await confirm({
      title: 'Validate All Data',
      message: 'This will run comprehensive validation checks across all data categories. This process may take several minutes. Continue?',
      confirmLabel: 'Validate All',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsValidating(true);
      
      // Simulate validation process
      toast.info('Starting validation...', {
        description: 'Running checks across 6 data categories'
      });

      setTimeout(() => {
        setIsValidating(false);
        toast.success('Validation Complete', {
          description: '42/54 items validated. 3 critical gaps identified.',
          duration: 5000
        });
      }, 3000);
    }
  };

  // Handle Export action
  const handleExport = async () => {
    const confirmed = await confirm({
      title: 'Export Data Health Report',
      message: 'Generate a comprehensive data health report in Excel format including all metrics, validation status, and recommendations?',
      confirmLabel: 'Export Report',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsExporting(true);
      
      toast.info('Generating report...', {
        description: 'Compiling data from all categories'
      });

      setTimeout(() => {
        setIsExporting(false);
        
        // Simulate file download
        const reportName = `DataHealth_${selectedAsset.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        toast.success('Export Complete', {
          description: `${reportName} has been downloaded`,
          duration: 5000
        });
      }, 2500);
    }
  };

  // Handle AI Suggestions action
  const handleAISuggestions = () => {
    openChat();
    
    // Send AI prompt
    setTimeout(() => {
      toast.success('AI Analysis Ready', {
        description: 'View AI-powered recommendations in the chat panel',
        duration: 4000
      });
    }, 500);
  };

  // Create dynamic category cards based on selected asset
  const dynamicCategoryCards = [
    {
      id: 'static-model',
      title: 'Static Model',
      icon: Database,
      iconColor: '#3B82F6',
      status: 'Loaded & Validated',
      statusColor: 'bg-green-500',
      validated: true,
      metrics: '8/8 items complete | Last validated: 3 days ago',
      provenance: 'Layer 1: Ground Truth',
      hasAI: true,
      path: '/data-health/static-model'
    },
    {
      id: 'well-data',
      title: 'Well Data',
      icon: CheckCircle2,
      iconColor: '#22C55E',
      status: '100% Complete',
      statusColor: 'bg-green-500',
      validated: true,
      metrics: `${selectedAsset.activeWells} wells | Trajectories + completions loaded`,
      provenance: 'Layer 1: Ground Truth',
      path: '/data-health/well-data'
    },
    {
      id: 'petro-logs',
      title: 'Petrophysical Logs',
      icon: Activity,
      iconColor: '#F59E0B',
      status: '72% Complete',
      statusColor: 'bg-amber-500',
      validated: false,
      metrics: `${Math.floor(selectedAsset.activeWells * 0.72)}/${selectedAsset.activeWells} logs loaded | 3 critical gaps in Zone C`,
      warning: '3 Missing',
      provenance: 'Layer 1: Ground Truth',
      path: '/data-health/petrophysical-logs'
    },
    {
      id: 'geological',
      title: 'Geological Interpretations',
      icon: AlertTriangle,
      iconColor: '#F59E0B',
      status: '65% Complete',
      statusColor: 'bg-amber-500',
      validated: false,
      metrics: 'Sedimentology reports partial | Carbonate analysis pending',
      provenance: 'Layer 2: Interpreted',
      path: '/data-health/geological'
    },
    {
      id: 'geophysical',
      title: 'Geophysical Data',
      icon: Database,
      iconColor: '#22C55E',
      status: 'Complete',
      statusColor: 'bg-green-500',
      validated: true,
      metrics: 'Seismic volume loaded | Processing quality: Good',
      provenance: 'Layer 1: Ground Truth',
      path: '/data-health/geophysical'
    },
    {
      id: 'production',
      title: 'Production History',
      icon: TrendingUp,
      iconColor: '#EF4444',
      status: '45% Complete',
      statusColor: 'bg-red-500',
      validated: false,
      metrics: `Historical data sparse for Wells ${selectedAsset.activeWells - 10}–${selectedAsset.activeWells}`,
      warning: 'Action Required',
      provenance: 'Layer 1: Ground Truth',
      path: '/data-health/production-history'
    }
  ];

  // Layer 1: Overview - Summary cards with key metrics
  const layer1Content = (
    <div className="space-y-6">
      {/* Overall Health Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-card-border rounded-lg p-5">
          <div className="text-sm text-text-secondary mb-1">Overall Completeness</div>
          <div className="text-3xl font-bold text-text-primary">78%</div>
          <div className="text-xs text-success mt-1">+5% vs. last month</div>
        </div>
        <div className="bg-card border border-card-border rounded-lg p-5">
          <div className="text-sm text-text-secondary mb-1">Validated Items</div>
          <div className="text-3xl font-bold text-success">42/54</div>
          <div className="text-xs text-text-secondary mt-1">3 pending review</div>
        </div>
        <div className="bg-card border border-card-border rounded-lg p-5">
          <div className="text-sm text-text-secondary mb-1">Critical Gaps</div>
          <div className="text-3xl font-bold text-danger">3</div>
          <div className="text-xs text-text-secondary mt-1">Requires attention</div>
        </div>
      </div>

      {/* AI Briefing */}
      <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-text-primary">✨ AI Briefing</span>
          <Badge variant="info" size="sm">
            ✨ AI
          </Badge>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          3 static model items flagged: Zone C missing petrophysical logs for Wells 14, 15, 16. 
          Uncertainty framework is 85% complete. Recommend acquiring missing data before M3 approval.
        </p>
      </div>

      {/* Category Cards Grid - Simplified for Layer 1 */}
      <div className="grid grid-cols-2 gap-4">
        {dynamicCategoryCards.map((card) => {
          const Icon = card.icon;
          const CardComponent = card.path ? Link : 'div';
          const cardProps = card.path ? { to: card.path } : {};

          return (
            <CardComponent
              key={card.id}
              {...cardProps}
              className="bg-card border border-card-border rounded-lg p-5 hover:border-card-hover hover:shadow-glow-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                <div className="flex items-center gap-1">
                  {card.validated && <CheckCircle2 className="w-4 h-4 text-success" />}
                  <LayerIndicator availableLayers={[1, 2]} variant="compact" />
                </div>
              </div>

              <h3 className="text-text-primary font-semibold mb-2">{card.title}</h3>
              
              <Badge className={`${card.statusColor} text-white border-0 mb-2`} size="sm">
                {card.status}
              </Badge>

              <p className="text-xs text-text-secondary">{card.metrics}</p>
            </CardComponent>
          );
        })}
      </div>
    </div>
  );

  // Layer 2: Detailed - Full category cards with provenance
  const layer2Content = (
    <div className="space-y-6">
      {/* Category Cards Grid - Full Detail */}
      <div className="grid grid-cols-2 gap-4">
        {dynamicCategoryCards.map((card) => {
          const Icon = card.icon;
          const CardComponent = card.path ? Link : 'div';
          const cardProps = card.path ? { to: card.path } : {};

          return (
            <CardComponent
              key={card.id}
              {...cardProps}
              className="bg-card border border-card-border rounded-lg p-5 hover:border-card-hover hover:shadow-glow-hover transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-7 h-7" style={{ color: card.iconColor }} />
                <div className="flex flex-col items-end gap-1">
                  {card.validated && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  {card.hasAI && (
                    <Badge variant="info" size="sm">
                      ✨ AI Validated
                    </Badge>
                  )}
                  {card.warning && (
                    <Badge variant="danger" size="sm">
                      {card.warning}
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="text-text-primary font-semibold mb-2">{card.title}</h3>
              
              <Badge className={`${card.statusColor} text-white border-0 mb-3`} size="sm">
                {card.status}
              </Badge>

              <p className="text-sm text-text-secondary mb-3">{card.metrics}</p>

              <Badge variant="outline" size="sm" className="text-accent border-accent/30">
                {card.provenance}
              </Badge>
            </CardComponent>
          );
        })}
      </div>

      {/* AI Recommendation Bar */}
      <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-text-primary font-semibold">✨ AI Agent Suggestions</span>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Zone C petrophysical data gaps can significantly impact uncertainty quantification. 
          Recommend acquiring logs from Wells 7, 12, 19 (est. cost $180K). Alternative: 
          Use analog field data from Block 14 (confidence reduction: 12%).
        </p>
        <Button variant="primary" onClick={openChat}>
          View AI Recommendations
        </Button>
      </div>

      {/* Data Provenance - Summary */}
      <DataProvenance variant="summary" />

      {/* Action Link */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              View Cross-Discipline Data Workflow
            </h3>
            <p className="text-sm text-text-secondary">
              See how data flows between Geology, Petrophysics, Reservoir Engineering, and other teams
            </p>
          </div>
          <Button variant="primary" asChild>
            <Link to="/insights/multidisciplinary-workflow">
              View Workflow Details →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  // Layer 3: Deep-Dive - Full provenance and lineage
  const layer3Content = (
    <div className="space-y-6">
      {/* Full Data Provenance */}
      <DataProvenance />
      
      {/* Detailed Category Analysis */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Detailed Category Analysis
        </h3>
        <div className="space-y-4">
          {dynamicCategoryCards.map((card) => (
            <div key={card.id} className="border-b border-card-border pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-text-primary">{card.title}</h4>
                <Badge className={`${card.statusColor} text-white border-0`} size="sm">
                  {card.status}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mb-2">{card.metrics}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm" className="text-accent border-accent/30">
                  {card.provenance}
                </Badge>
                {card.validated && (
                  <Badge className="bg-success/10 text-success border-success/30" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Validated
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header with Actions and Layer Navigation */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-1">Data Health Navigator</h1>
              <p className="text-sm text-text-secondary">{selectedAsset.name} – Track data completeness across multiple layers</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Action Buttons */}
              <Button
                variant="outline"
                onClick={handleValidateAll}
                disabled={isValidating}
                className="flex items-center gap-2"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Validate All
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </Button>

              <Button
                variant="primary"
                onClick={handleAISuggestions}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Suggestions
              </Button>

              <LayerNavigation
                currentLayer={globalLayerPreference}
                availableLayers={[1, 2, 3]}
                onLayerChange={(layer) => setGlobalLayerPreference(layer)}
                variant="buttons"
              />
            </div>
          </div>
        </div>

        {/* Content based on current layer */}
        {globalLayerPreference === 1 && layer1Content}
        {globalLayerPreference === 2 && layer2Content}
        {globalLayerPreference === 3 && layer3Content}
      </div>
    </div>
  );
}