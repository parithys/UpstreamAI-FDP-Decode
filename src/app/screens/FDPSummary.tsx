import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FileText, Download, Share2, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useLayer } from '../context/LayerContext';
import { LayerNavigation } from '../components/layers/LayerNavigation';
import { useAsset } from '../context/AssetContext';
import {
  calculateNPVSimplified,
  calculateRecoveryFactor,
  calculateIRR,
  calculateAIConfidence,
  formatNPV,
} from '../utils/calculations';

const actionItems = [
  {
    num: 1,
    action: 'Acquire Zone C petrophysical logs',
    owner: 'A. Rahman',
    dueDate: 'Mar 15',
    status: 'Pending',
    statusColor: 'bg-warning',
    priority: 'High',
    priorityColor: 'bg-danger'
  },
  {
    num: 2,
    action: 'Submit FDP to technical review',
    owner: 'S. Chen',
    dueDate: 'Mar 20',
    status: 'Pending',
    statusColor: 'bg-warning',
    priority: 'Critical',
    priorityColor: 'bg-danger'
  },
  {
    num: 3,
    action: 'Prepare Tier 1 presentation',
    owner: 'J. Park',
    dueDate: 'Mar 25',
    status: 'Not Started',
    statusColor: 'bg-text-tertiary',
    priority: 'High',
    priorityColor: 'bg-danger'
  },
  {
    num: 4,
    action: 'Budget approval submission',
    owner: 'Asset Mgr',
    dueDate: 'Apr 1',
    status: 'Not Started',
    statusColor: 'bg-text-tertiary',
    priority: 'Critical',
    priorityColor: 'bg-danger'
  }
];

const journeySteps = [
  { phase: 'M2', name: 'Data Health', status: 'complete', metric: '54/54 items' },
  { phase: 'M3', name: 'History Matching', status: 'complete', metric: 'Baseline: 12 wells' },
  { phase: 'M4', name: 'Uncertainty', status: 'complete', metric: '12.4M AI led scenarios' },
  { phase: 'M5', name: 'Insights', status: 'complete', metric: '8 insights, 87% conf.' },
  { phase: 'M6', name: 'Summary', status: 'complete', metric: 'Approved' }
];

export function FDPSummary() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const { selectedAsset } = useAsset();

  // ── Key FDP Metrics — computed from engineering formulas ─────────────
  const npvB = calculateNPVSimplified(
    selectedAsset.production.oil, 80, selectedAsset.opexPerBbl,
    selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55
  );
  const npvLabel = formatNPV(npvB);

  // Future recovery factor = current RF + projected improvement from new wells
  const currentRF = calculateRecoveryFactor(selectedAsset.cumulativeOil, selectedAsset.ooip);
  const projectedRF = Math.min(65, currentRF + 4.0); // FDP targets +4% RF improvement

  const capexLabel = selectedAsset.remainingCapexMM >= 1000
    ? `$${(selectedAsset.remainingCapexMM / 1000).toFixed(1)}B`
    : `$${Math.round(selectedAsset.remainingCapexMM)}M`;

  // Estimated months to first oil based on field development phase
  const firstOilMonths = selectedAsset.status === 'development' ? 12 : 18;

  // AI confidence scoring
  const aiConf = calculateAIConfidence(
    selectedAsset.dataCompleteness,
    selectedAsset.historyMatchR2,
    0.75 // 3/4 uncertainty categories configured
  );

  // Simple IRR estimate using annuity cash flows
  const annualNetCF_M = (selectedAsset.production.oil * 365 * (80 - selectedAsset.opexPerBbl) *
    (1 - 0.05) * (1 - 0.55)) / 1e6;
  const irrCashFlows = [
    -selectedAsset.remainingCapexMM,
    ...Array(selectedAsset.fieldLifeYears).fill(annualNetCF_M)
  ];
  const irr = calculateIRR(irrCashFlows);

  const handleExportPDF = () => {
    setIsExporting('pdf');
    toast.info('Generating PDF report...', {
      description: 'This may take a few moments'
    });
    
    setTimeout(() => {
      setIsExporting(null);
      toast.success('PDF report generated', {
        description: 'FDP_Summary_FieldAlpha.pdf downloaded successfully'
      });
    }, 2500);
  };

  const handleExportPPTX = () => {
    setIsExporting('pptx');
    toast.info('Generating PowerPoint presentation...', {
      description: 'Creating executive summary slides'
    });
    
    setTimeout(() => {
      setIsExporting(null);
      toast.success('Presentation generated', {
        description: 'FDP_Executive_Summary.pptx downloaded successfully'
      });
    }, 3000);
  };

  const handleShareReport = () => {
    setIsSharing(true);
    toast.info('Sharing report...', {
      description: 'Sending to stakeholders via email'
    });
    
    setTimeout(() => {
      setIsSharing(false);
      toast.success('Report shared successfully', {
        description: 'Email sent to 8 stakeholders with secure download link'
      });
    }, 2000);
  };

  const handleSubmitForReview = () => {
    toast.info('Submitting for executive review...', {
      description: 'Preparing document package'
    });
    
    setTimeout(() => {
      toast.success('Submitted for review', {
        description: 'Tier 1 executives will be notified'
      });
    }, 1500);
  };

  const handleArchiveFDP = () => {
    toast.info('Archiving FDP...', {
      description: 'Creating permanent record in document management system'
    });
    
    setTimeout(() => {
      toast.success('FDP archived successfully', {
        description: 'Document ID: FDP-FA-2025-Q1-001'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">
        {/* Breadcrumb Row with Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-text-secondary">
            <Link to="/dashboard" className="hover:text-text-primary">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">FDP Summary</span>
          </div>
          <Badge variant="success" size="lg" className="text-base px-3 py-1.5">
            ✓ Approved
          </Badge>
        </div>

        {/* Header with Layer Navigation */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Field Development Plan – Summary Report
            </h1>
            <p className="text-sm text-text-secondary">Field Alpha – Block 17 | Generated Feb 5, 2025</p>
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
                <Button 
                  variant="outline"
                  onClick={handleExportPDF}
                  disabled={isExporting === 'pdf'}
                  isLoading={isExporting === 'pdf'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting === 'pdf' ? 'Generating...' : 'Export PDF'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleExportPPTX}
                  disabled={isExporting === 'pptx'}
                  isLoading={isExporting === 'pptx'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting === 'pptx' ? 'Generating...' : 'Export PPTX'}
                </Button>
              </>
            )}
            {(globalLayerPreference === 1 || globalLayerPreference === 2) && (
              <Button 
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting === 'pdf'}
                isLoading={isExporting === 'pdf'}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting === 'pdf' ? 'Generating...' : 'Export Summary'}
              </Button>
            )}
          </div>
        </div>

        {/* LAYER 1 (L1): EXECUTIVE VIEW - High-level summary for decision makers */}
        {globalLayerPreference === 1 && (
          <div className="space-y-6">
            {/* Executive Summary Badge */}
            <div className="flex items-center justify-between">
              <Badge className="bg-background-secondary text-text-primary border border-card-border px-3 py-1">
                Executive Summary
              </Badge>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Recommended NPV</div>
                <div className="text-3xl font-bold text-text-primary">{npvLabel}</div>
                <div className="text-sm text-success mt-1">IRR: {irr.toFixed(1)}%</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Target Recovery Factor</div>
                <div className="text-3xl font-bold text-text-primary">{projectedRF.toFixed(0)}%</div>
                <div className="text-sm text-success mt-1">+{(projectedRF - currentRF).toFixed(1)}% improvement</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Total CapEx</div>
                <div className="text-3xl font-bold text-text-primary">{capexLabel}</div>
                <div className="text-sm text-accent mt-1">Within budget</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Time to First Oil</div>
                <div className="text-3xl font-bold text-text-primary">{firstOilMonths}mo</div>
                <div className="text-sm text-accent mt-1">On schedule</div>
              </div>
            </div>

            {/* Report Agent Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-text-primary">✨ AI-Powered FDP Summary</span>
              </div>
              <p className="text-text-secondary leading-relaxed mb-3">
                Field Alpha FDP has been approved with an optimal development strategy delivering <span className="text-text-primary font-medium">$2.4B NPV</span> and 
                <span className="text-text-primary font-medium"> 47% recovery factor</span>. AI-enabled analysis evaluated <span className="text-text-primary font-medium">12.4 million scenarios</span> in 
                4 days, discovering a <span className="text-text-primary font-medium">+14% NPV improvement</span> beyond traditional approaches.
              </p>
              <p className="text-text-secondary leading-relaxed">
                The plan is on schedule with first oil expected in 18 months and stays within the $1.2B CapEx budget. 
                AI confidence level: <span className="text-text-primary font-medium">87%</span> with high recommendation strength validated across all uncertainty frameworks.
              </p>
            </div>

            {/* Simplified Journey */}
            <div className="bg-card border border-card-border rounded-lg p-6 shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Development Plan Status</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold text-text-primary text-center">Data Validation</div>
                  <div className="text-xs text-success text-center">Complete</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold text-text-primary text-center">History Match</div>
                  <div className="text-xs text-success text-center">Complete</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold text-text-primary text-center">AI Simulation</div>
                  <div className="text-xs text-success text-center">Complete</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold text-text-primary text-center">Decision Analysis</div>
                  <div className="text-xs text-success text-center">Complete</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg border-2 border-success">
                  <CheckCircle2 className="w-8 h-8 text-success mb-2" />
                  <div className="text-sm font-semibold text-text-primary text-center">Approved</div>
                  <div className="text-xs text-success text-center">Feb 5, 2025</div>
                </div>
              </div>
            </div>

            {/* Critical Next Steps */}
            <div className="bg-card border border-card-border rounded-lg p-6 shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Critical Next Steps</h3>
              <div className="space-y-3">
                {actionItems.slice(0, 2).map((item) => (
                  <div key={item.num} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex-1">
                      <div className="text-text-primary font-medium mb-1">{item.action}</div>
                      <div className="text-sm text-text-secondary">Due: {item.dueDate} | Owner: {item.owner}</div>
                    </div>
                    <Badge className={`${item.priorityColor} text-white border-0`}>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setGlobalLayerPreference(2)}
              >
                View Detailed Report →
              </Button>
              <Button 
                variant="default"
                onClick={handleSubmitForReview}
                className="bg-primary hover:bg-primary-hover"
              >
                <Mail className="w-4 h-4 mr-2" />
                Submit for Executive Review
              </Button>
            </div>
          </div>
        )}

        {/* LAYER 2 (L2): ASSET MANAGER VIEW - Operational summary with journey and key actions */}
        {globalLayerPreference === 2 && (
          <div className="space-y-6">
            {/* Executive Summary Badge */}
            <div className="flex items-center justify-between">
              <Badge className="bg-background-secondary text-text-primary border border-card-border px-3 py-1">
                Executive Summary
              </Badge>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Recommended NPV</div>
                <div className="text-3xl font-bold text-text-primary">{npvLabel}</div>
                <div className="text-sm text-success mt-1">IRR: {irr.toFixed(1)}%</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Target Recovery Factor</div>
                <div className="text-3xl font-bold text-text-primary">{projectedRF.toFixed(0)}%</div>
                <div className="text-sm text-success mt-1">+{(projectedRF - currentRF).toFixed(1)}% improvement</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Total CapEx</div>
                <div className="text-3xl font-bold text-text-primary">{capexLabel}</div>
                <div className="text-sm text-accent mt-1">Within budget</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Time to First Oil</div>
                <div className="text-3xl font-bold text-text-primary">{firstOilMonths}mo</div>
                <div className="text-sm text-accent mt-1">On schedule</div>
              </div>
            </div>

            {/* FDP Journey Summary */}
            <div className="bg-card border border-card-border rounded-lg p-6 shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">FDP Journey Summary</h3>
              <div className="flex items-center justify-between">
                {journeySteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-success">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-text-primary text-center">{step.phase}</div>
                    <div className="text-xs text-text-secondary text-center">{step.name}</div>
                    <div className="text-xs text-text-tertiary text-center">{step.metric}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Agent Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-text-primary">✨ Report Agent Summary</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                The Field Alpha FDP analysis utilized comprehensive AI-enabled workflows across data validation, uncertainty quantification, and AI led simulation. 
                <span className="text-text-primary font-medium"> 12.4 million scenarios</span> were evaluated in <span className="text-text-primary font-medium">4 days</span> (vs. estimated 28 days for 3,847 traditional scenarios), 
                identifying an optimal configuration with <span className="text-text-primary font-medium">$2.4B NPV</span>.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Key differentiator: AI led simulation discovered <span className="text-text-primary font-medium">+14% NPV improvement</span> beyond traditional reservoir modeling limits, 
                with 87% AI confidence validated across uncertainty frameworks and market volatility scenarios.
              </p>
            </div>

            {/* Action Items Summary */}
            <div className="bg-card rounded-lg border border-card-border shadow-glow overflow-hidden">
              <div className="p-4 border-b border-card-border">
                <h3 className="text-text-primary font-semibold">Post-Approval Action Items</h3>
              </div>
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-card-border hover:bg-card-hover">
                      <TableHead className="text-text-secondary">#</TableHead>
                      <TableHead className="text-text-secondary">Action</TableHead>
                      <TableHead className="text-text-secondary">Owner</TableHead>
                      <TableHead className="text-text-secondary">Due Date</TableHead>
                      <TableHead className="text-text-secondary">Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actionItems.map((item) => (
                      <TableRow key={item.num} className="border-card-border hover:bg-card-hover">
                        <TableCell className="text-text-secondary">{item.num}</TableCell>
                        <TableCell className="text-text-primary">{item.action}</TableCell>
                        <TableCell className="text-text-secondary">{item.owner}</TableCell>
                        <TableCell className="text-text-secondary">{item.dueDate}</TableCell>
                        <TableCell>
                          <Badge className={`${item.priorityColor} text-white border-0`} size="sm">
                            {item.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* AI Validation Quick View */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow">
                <h3 className="text-text-primary font-semibold mb-4">Technical Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Simulator:</span>
                    <span className="text-text-primary font-medium">Eclipse v2024.1 + AI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Scenarios:</span>
                    <span className="text-text-primary font-medium">12,403,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Parameters:</span>
                    <span className="text-text-primary font-medium">18 (4 categories)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Duration:</span>
                    <span className="text-text-primary font-medium">4 days (85% faster)</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow">
                <h3 className="text-text-primary font-semibold mb-4">AI Confidence</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-background-secondary rounded">
                    <span className="text-sm text-text-primary">Data Quality</span>
                    <Badge variant="success">{aiConf.dataQuality.toFixed(0)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-background-secondary rounded">
                    <span className="text-sm text-text-primary">Model Confidence</span>
                    <Badge variant="success">{aiConf.modelConfidence.toFixed(0)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-background-secondary rounded">
                    <span className="text-sm text-text-primary">Insight Reliability</span>
                    <Badge variant="success">{aiConf.insightReliability.toFixed(0)}%</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-card-border">
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleShareReport}
                  disabled={isSharing}
                  isLoading={isSharing}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isSharing ? 'Sharing...' : 'Share Report'}
                </Button>
              </div>
              <Button 
                variant="default"
                onClick={handleSubmitForReview}
                className="bg-primary hover:bg-primary-hover"
              >
                <Mail className="w-4 h-4 mr-2" />
                Submit for Executive Review
              </Button>
            </div>
          </div>
        )}

        {/* LAYER 3 (L3): RESERVOIR ENGINEER VIEW - Full technical detail with all tabs */}
        {globalLayerPreference === 3 && (
          <>
            {/* Executive Summary Badge */}
            <div className="mb-6">
              <Badge className="bg-background-secondary text-text-primary border border-card-border px-3 py-1">
                Executive Summary
              </Badge>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Recommended NPV</div>
                <div className="text-3xl font-bold text-text-primary">$2.4B</div>
                <div className="text-sm text-success mt-1">+14% vs previous</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Recovery Factor</div>
                <div className="text-3xl font-bold text-text-primary">47%</div>
                <div className="text-sm text-success mt-1">+3% improvement</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Total CapEx</div>
                <div className="text-3xl font-bold text-text-primary">$1.2B</div>
                <div className="text-sm text-accent mt-1">Within budget</div>
              </div>
              <div className="bg-card border border-card-border rounded-lg p-5 shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Time to First Oil</div>
                <div className="text-3xl font-bold text-text-primary">18mo</div>
                <div className="text-sm text-accent mt-1">On schedule</div>
              </div>
            </div>

            {/* FDP Journey Summary */}
            <div className="bg-card border border-card-border rounded-lg p-6 mb-6 shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">FDP Journey Summary</h3>
              <div className="flex items-center justify-between">
                {journeySteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-success">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-text-primary text-center">{step.phase}</div>
                    <div className="text-xs text-text-secondary text-center">{step.name}</div>
                    <div className="text-xs text-text-tertiary text-center">{step.metric}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Agent Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-text-primary">✨ Report Agent Summary</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                The Field Alpha FDP analysis utilized comprehensive AI-enabled workflows across data validation, uncertainty quantification, and AI led simulation. 
                <span className="text-text-primary font-medium"> 12.4 million scenarios</span> were evaluated in <span className="text-text-primary font-medium">4 days</span> (vs. estimated 28 days for 3,847 traditional scenarios), 
                identifying an optimal configuration with <span className="text-text-primary font-medium">$2.4B NPV</span>.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Key differentiator: AI led simulation discovered <span className="text-text-primary font-medium">+14% NPV improvement</span> beyond traditional reservoir modeling limits, 
                with 87% AI confidence validated across uncertainty frameworks and market volatility scenarios.
              </p>
            </div>

            {/* Tabs for Detailed Sections */}
            <Tabs defaultValue="action-items" className="mb-6">
              <TabsList className="w-full justify-start border-b border-card-border bg-transparent rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="action-items" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-6 py-3"
                >
                  Action Items
                </TabsTrigger>
                <TabsTrigger 
                  value="technical" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-6 py-3"
                >
                  Technical Details
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-validation" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-6 py-3"
                >
                  AI Validation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="action-items" className="mt-6">
                <div className="bg-card rounded-lg border border-card-border shadow-glow overflow-hidden">
                  <div className="p-4 border-b border-card-border">
                    <h3 className="text-text-primary font-semibold">Post-Approval Action Items</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-card-border hover:bg-card-hover">
                        <TableHead className="text-text-secondary">#</TableHead>
                        <TableHead className="text-text-secondary">Action</TableHead>
                        <TableHead className="text-text-secondary">Owner</TableHead>
                        <TableHead className="text-text-secondary">Due Date</TableHead>
                        <TableHead className="text-text-secondary">Status</TableHead>
                        <TableHead className="text-text-secondary">Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionItems.map((item) => (
                        <TableRow key={item.num} className="border-card-border hover:bg-card-hover">
                          <TableCell className="text-text-secondary">{item.num}</TableCell>
                          <TableCell className="text-text-primary">{item.action}</TableCell>
                          <TableCell className="text-text-secondary">{item.owner}</TableCell>
                          <TableCell className="text-text-secondary">{item.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={`${item.statusColor} text-white border-0`} size="sm">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${item.priorityColor} text-white border-0`} size="sm">
                              {item.priority}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="mt-6">
                <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow">
                  <h3 className="text-text-primary font-semibold mb-4">Technical Configuration Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-text-tertiary">Reservoir Simulator</div>
                        <div className="text-text-primary font-medium">Eclipse v2024.1 + AI Engine</div>
                      </div>
                      <div>
                        <div className="text-text-tertiary">Total Scenarios Evaluated</div>
                        <div className="text-text-primary font-medium">12,403,847</div>
                      </div>
                      <div>
                        <div className="text-text-tertiary">Uncertainty Parameters</div>
                        <div className="text-text-primary font-medium">18 (4 categories)</div>
                      </div>
                      <div>
                        <div className="text-text-tertiary">Simulation Time</div>
                        <div className="text-text-primary font-medium">4 days (85% faster)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-validation" className="mt-6">
                <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow">
                  <h3 className="text-text-primary font-semibold mb-4">AI Confidence & Validation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                      <span className="text-text-primary">Data Quality Score</span>
                      <Badge variant="success">96%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                      <span className="text-text-primary">AI Model Confidence</span>
                      <Badge variant="success">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                      <span className="text-text-primary">Insight Reliability</span>
                      <Badge variant="success">91%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary rounded">
                      <span className="text-text-primary">Recommendation Strength</span>
                      <Badge variant="success">High</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-card-border">
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleShareReport}
                  disabled={isSharing}
                  isLoading={isSharing}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isSharing ? 'Sharing...' : 'Share with Stakeholders'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleArchiveFDP}
                >
                  Archive FDP
                </Button>
              </div>
              <Button 
                variant="default"
                onClick={handleSubmitForReview}
                className="bg-primary hover:bg-primary-hover"
              >
                <Mail className="w-4 h-4 mr-2" />
                Submit for Executive Review
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
