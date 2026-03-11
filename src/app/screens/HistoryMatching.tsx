import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, BarChart, Bar } from 'recharts';
import { PlayCircle, CheckCircle2, Settings, TrendingUp, AlertCircle, Calendar, Target, ChevronRight, Save, FolderOpen, Download, Upload, Loader2, X, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLayer } from '../context/LayerContext';
import { LayerNavigation } from '../components/layers/LayerNavigation';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';
import { useAsset } from '../context/AssetContext';
import { generateMatchChartData, calculateHistoryMatchQuality } from '../utils/calculations';

interface SavedSimulation {
  id: string;
  name: string;
  timestamp: string;
  permeability: number;
  faultTrans: number;
  aquiferStrength: number;
  confidence: number;
  status: 'completed' | 'in-progress' | 'failed';
}

const initialSavedSimulations: SavedSimulation[] = [
  {
    id: '1',
    name: 'Baseline Match v1.0',
    timestamp: 'Feb 10, 2026 14:32',
    permeability: 1.2,
    faultTrans: 0.65,
    aquiferStrength: 0.95,
    confidence: 89,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Optimized Match v2.1',
    timestamp: 'Feb 11, 2026 09:15',
    permeability: 1.3,
    faultTrans: 0.7,
    aquiferStrength: 1.0,
    confidence: 92,
    status: 'completed'
  },
  {
    id: '3',
    name: 'High Perm Scenario',
    timestamp: 'Feb 11, 2026 16:48',
    permeability: 1.45,
    faultTrans: 0.75,
    aquiferStrength: 1.05,
    confidence: 87,
    status: 'completed'
  }
];

export function HistoryMatching() {
  const [permeability, setPermeability] = useState(1.3);
  const [faultTrans, setFaultTrans] = useState(0.7);
  const [aquiferStrength, setAquiferStrength] = useState(1.0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [_confidenceOverride, setConfidenceOverride] = useState<number | null>(null);
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const { confirmSuccess, confirmWarning, confirmDanger } = useConfirmation();
  const { addNotification } = useNotifications();
  const { selectedAsset } = useAsset();

  // ── Generate chart data deterministically from asset parameters ──────
  const matchData = generateMatchChartData(
    selectedAsset.production.oil,
    selectedAsset.declineRate,
    selectedAsset.declineExponent,
    selectedAsset.firstOilYear,
    selectedAsset.firstOilYear,            // chart start = first oil
    0,                                      // January
    new Date().getFullYear() + 5,           // 5-year forecast horizon
    3,                                      // quarterly steps
    selectedAsset.historyMatchR2
  );

  // ── Computed match quality adjusted by slider parameters ─────────────
  const baseR2 = selectedAsset.historyMatchR2;
  const confidence = Math.round(Math.min(98, Math.max(80,
    baseR2 * 100 + (permeability - 1.3) * 5 + (faultTrans - 0.7) * 3
  )));

  // Save/Load state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(initialSavedSimulations);
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulation control state
  const [showSimulationControls, setShowSimulationControls] = useState(false);
  const [iterations, setIterations] = useState(1000);
  const [timeHorizon, setTimeHorizon] = useState(10);

  // Run full simulation
  const handleRunSimulation = async () => {
    const confirmed = await confirmSuccess({
      title: 'Run History Matching Simulation',
      message: `Execute full simulation with ${iterations} iterations over ${timeHorizon} years? This will update the production forecast and match quality.`,
      confirmLabel: `Run Simulation`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsRunningSimulation(true);
      setSimulationProgress(0);
      
      toast.loading('Starting simulation...', { id: 'run-simulation' });
      
      // Simulate progress
      const simulationInterval = setInterval(() => {
        setSimulationProgress(prev => {
          const next = prev + 5;
          
          if (next >= 100) {
            clearInterval(simulationInterval);
            
            // confidence is now computed from asset + slider state (no override needed)
            const newConfidence = Math.min(98, Math.max(80,
              selectedAsset.historyMatchR2 * 100 + (permeability - 1.3) * 5 + (faultTrans - 0.7) * 3
            ));
            setConfidenceOverride(Math.round(newConfidence));
            
            setIsRunningSimulation(false);
            setSimulationProgress(0);
            
            toast.success('Simulation Complete', {
              id: 'run-simulation',
              description: `${iterations} iterations completed successfully`
            });
            
            addNotification({
              type: 'success',
              priority: 'high',
              category: 'simulation',
              title: 'History Matching Complete',
              message: `Simulation completed with ${Math.round(newConfidence)}% match quality`,
              actionLabel: 'View Results',
              actionUrl: '/history-matching'
            });
            
            return 100;
          }
          
          const stage = next < 33 ? 'Initializing...' : next < 66 ? 'Matching history...' : 'Forecasting...';
          toast.loading(`${stage} ${next}%`, { id: 'run-simulation' });
          return next;
        });
      }, 150);
    }
  };

  // Pause simulation
  const handlePauseSimulation = () => {
    setIsRunningSimulation(false);
    toast.info('Simulation Paused', {
      description: 'You can resume or cancel the simulation'
    });
  };

  // Run AI optimization
  const handleRunOptimization = async () => {
    const confirmed = await confirmSuccess({
      title: 'Run AI Optimization',
      message: 'AI will automatically adjust parameters to achieve the best history match. This typically takes 2-3 minutes.',
      confirmLabel: 'Run Optimization',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsOptimizing(true);
      toast.loading('Running AI optimization...', { id: 'optimize' });

      setTimeout(() => {
        // Optimize parameters
        const optimizedPerm = 1.35 + (Math.random() - 0.5) * 0.1;
        const optimizedFault = 0.72 + (Math.random() - 0.5) * 0.05;
        const optimizedAquifer = 1.02 + (Math.random() - 0.5) * 0.05;
        
        setPermeability(optimizedPerm);
        setFaultTrans(optimizedFault);
        setAquiferStrength(optimizedAquifer);
        
        // confidence is now computed — no setter needed
        const _newConf = 94 + Math.floor(Math.random() * 3);
        setConfidenceOverride(_newConf);
        
        setIsOptimizing(false);
        
        toast.success('Optimization Complete', {
          id: 'optimize',
          description: `Best match achieved with ${_newConf}% confidence`
        });

        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'simulation',
          title: 'AI Optimization Complete',
          message: `Parameters optimized to ${_newConf}% match quality`,
          actionLabel: 'View Details',
          actionUrl: '/history-matching'
        });
      }, 2500);
    }
  };

  // Save simulation
  const handleSaveSimulation = () => {
    const timestamp = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setSaveName(`History Match ${timestamp}`);
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!saveName.trim()) {
      toast.error('Name Required', {
        description: 'Please enter a name for this simulation'
      });
      return;
    }

    setIsSaving(true);
    toast.loading('Saving simulation...', { id: 'save-sim' });
    
    setTimeout(() => {
      const newSimulation: SavedSimulation = {
        id: Date.now().toString(),
        name: saveName,
        timestamp: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        permeability,
        faultTrans,
        aquiferStrength,
        confidence,
        status: 'completed'
      };
      
      setSavedSimulations(prev => [newSimulation, ...prev]);
      setIsSaving(false);
      setShowSaveModal(false);
      setSaveName('');
      
      toast.success('Simulation Saved', {
        id: 'save-sim',
        description: `"${newSimulation.name}" saved successfully`
      });
      
      addNotification({
        type: 'success',
        priority: 'low',
        category: 'system',
        title: 'Simulation Saved',
        message: `History matching simulation "${newSimulation.name}" saved to library`,
        actionLabel: 'View Library',
        actionUrl: '/history-matching'
      });
    }, 1000);
  };

  // Load simulation
  const handleLoadSimulation = (sim: SavedSimulation) => {
    setPermeability(sim.permeability);
    setFaultTrans(sim.faultTrans);
    setAquiferStrength(sim.aquiferStrength);
    setConfidenceOverride(sim.confidence);
    setShowLoadModal(false);
    
    toast.success('Simulation Loaded', {
      description: `"${sim.name}" loaded successfully`
    });
  };

  // Delete simulation
  const handleDeleteSimulation = async (sim: SavedSimulation) => {
    const confirmed = await confirmDanger({
      title: 'Delete Simulation',
      message: `Permanently delete "${sim.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setSavedSimulations(prev => prev.filter(s => s.id !== sim.id));
      
      toast.success('Simulation Deleted', {
        description: `"${sim.name}" has been removed`
      });
    }
  };

  // Export simulation data
  const handleExportSimulation = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Simulation Data',
      message: 'Export current simulation parameters, history match results, and forecast data as Excel file?',
      confirmLabel: 'Export',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Preparing export...', { id: 'export-sim' });
      
      setTimeout(() => {
        toast.success('Export Complete', {
          id: 'export-sim',
          description: 'History matching data exported successfully'
        });
        
        addNotification({
          type: 'success',
          priority: 'low',
          category: 'data',
          title: 'Export Complete',
          message: 'History matching simulation data exported as Excel file',
          actionLabel: 'Download',
          actionUrl: '#'
        });
      }, 1500);
    }
  };

  // Import simulation
  const handleImportSimulation = async () => {
    toast.info('Import Simulation', {
      description: 'Select a simulation file to import'
    });
    
    // In a real implementation, this would trigger a file picker
    setTimeout(() => {
      toast.success('Simulation Imported', {
        description: 'Parameters loaded from file'
      });
    }, 1000);
  };

  // Reset parameters
  const handleResetParameters = async () => {
    const confirmed = await confirmWarning({
      title: 'Reset Parameters',
      message: 'Reset all parameters to their default values? Current progress will be lost.',
      confirmLabel: 'Reset',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setPermeability(1.3);
      setFaultTrans(0.7);
      setAquiferStrength(1.0);
      setConfidenceOverride(null); // reset to computed value
      
      toast.info('Parameters Reset', {
        description: 'All parameters restored to defaults'
      });
    }
  };

  const handleAcceptModel = async () => {
    const confirmed = await confirmSuccess({
      title: 'Accept History Match',
      message: `Accept this history match model with ${confidence}% confidence? This will lock these parameters and allow you to proceed to uncertainty analysis.`,
      confirmLabel: 'Accept Model',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.success('Model Accepted', {
        description: 'History match parameters saved successfully'
      });
      
      addNotification({
        type: 'success',
        priority: 'high',
        category: 'simulation',
        title: 'History Match Accepted',
        message: `Model accepted with ${confidence}% confidence - ready for uncertainty analysis`,
        actionLabel: 'Proceed',
        actionUrl: '/uncertainty'
      });
    }
  };

  const handleRefineParameters = () => {
    setShowSimulationControls(true);
    toast.info('Refinement Mode', {
      description: 'Adjust parameters and re-run simulation'
    });
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header with Layer Navigation */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">History Matching & Forecasting</h1>
            <p className="text-sm text-text-secondary">Automated parameter optimization with AI assistance</p>
          </div>
          <LayerNavigation
            currentLayer={globalLayerPreference}
            availableLayers={[1, 2, 3]}
            onLayerChange={(layer) => setGlobalLayerPreference(layer)}
            variant="buttons"
          />
        </div>

        {/* LAYER 1 (L1): EXECUTIVE VIEW - High-level summary only */}
        {globalLayerPreference === 1 && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">History Match Status</h3>
                <Badge variant="success" size="lg">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Model Accepted
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                  <div className="text-sm text-text-secondary mb-1">Match Quality</div>
                  <div className="text-3xl font-bold text-success">{confidence}%</div>
                  <div className="text-xs text-text-tertiary mt-1">Excellent confidence</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Wells Matched</div>
                  <div className="text-3xl font-bold text-text-primary">12/12</div>
                  <div className="text-xs text-text-tertiary mt-1">100% coverage</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">RMSE</div>
                  <div className="text-3xl font-bold text-success">0.08</div>
                  <div className="text-xs text-text-tertiary mt-1">Low error</div>
                </div>
              </div>
            </div>

            {/* Strategic Outlook & Milestones */}
            <div className="grid grid-cols-2 gap-6">
              {/* Production Forecast vs Target */}
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Strategic Outlook</h3>
                    <p className="text-sm text-text-secondary">5-Year Production Forecast vs Corporate Target</p>
                  </div>
                  <Badge variant="success" size="sm">On Target</Badge>
                </div>
                
                <div className="h-[200px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { year: '2025', target: 1780, forecast: 1792 },
                      { year: '2026', target: 1800, forecast: 1805 },
                      { year: '2027', target: 1810, forecast: 1815 },
                      { year: '2028', target: 1815, forecast: 1820 },
                      { year: '2029', target: 1820, forecast: 1825 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="year" stroke="#7B8CA8" tick={{ fill: '#7B8CA8', fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0D1932', border: '1px solid #1E293B', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#7B8CA8' }} />
                      <Bar dataKey="target" name="Corporate Target" fill="#334155" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="forecast" name="Model Forecast" fill="#15A955" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Workflow Milestone Tracker */}
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
                <h3 className="text-lg font-semibold text-text-primary mb-1">FDP Workflow Milestones</h3>
                <p className="text-sm text-text-secondary mb-6">Current phase progress</p>

                <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-card-border" />

                  {/* Step 1: Data Health */}
                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center z-10 border-2 border-success">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h4 className="text-text-primary font-medium">Data Health Check</h4>
                      <p className="text-xs text-text-secondary">Completed on Oct 12, 2025</p>
                    </div>
                  </div>

                  {/* Step 2: History Matching (Current) */}
                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center z-10 border-2 border-success">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-text-primary font-medium">History Matching</h4>
                        <Badge variant="success" size="sm">Completed</Badge>
                      </div>
                      <p className="text-xs text-text-secondary">Model accepted with {confidence}% confidence.</p>
                      <Link to="/uncertainty" className="inline-block mt-2">
                         <Button size="sm" variant="primary">
                           Proceed to Uncertainty <ChevronRight className="w-3 h-3 ml-1" />
                         </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Step 3: Uncertainty */}
                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center z-10 border-2 border-card-border">
                      <span className="text-text-tertiary font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-text-tertiary font-medium">Uncertainty Analysis</h4>
                      <p className="text-xs text-text-tertiary">Next Phase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Impact Metrics */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">Business Impact Metrics</h3>
                  <p className="text-sm text-text-secondary">Financial implications of optimized forecasting</p>
                </div>
                <Badge variant="success" size="sm">Positive Impact</Badge>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* NPV Impact */}
                <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-xs text-text-tertiary">NPV Impact (5Y)</span>
                  </div>
                  <div className="text-2xl font-bold text-success mb-1">$0.0M</div>
                  <div className="text-xs text-text-secondary">vs. baseline forecast</div>
                </div>

                {/* Annual Revenue */}
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs text-text-tertiary">Est. Revenue (2026)</span>
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">$0.0M</div>
                  <div className="text-xs text-text-secondary">Based on forecast</div>
                </div>

                {/* Capital Efficiency */}
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-xs text-text-tertiary">Time Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">18 days</div>
                  <div className="text-xs text-text-secondary">vs. manual matching</div>
                </div>

                {/* Confidence Level */}
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-xs text-text-tertiary">Decision Confidence</span>
                  </div>
                  <div className="text-2xl font-bold text-success mb-1">{confidence}%</div>
                  <div className="text-xs text-text-secondary">Match quality</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 2 (L2): ASSET MANAGER - More details, simplified controls */}
        {globalLayerPreference === 2 && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-card-border shadow-glow">
              <div className="flex items-center gap-3">
                <Button 
                  variant="primary"
                  onClick={handleRunSimulation}
                  disabled={isRunningSimulation}
                >
                  {isRunningSimulation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running... {simulationProgress}%
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                
                {isRunningSimulation && (
                  <Button 
                    variant="outline"
                    onClick={handlePauseSimulation}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={handleRunOptimization}
                  disabled={isOptimizing || isRunningSimulation}
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      AI Optimize
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleSaveSimulation}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoadModal(true)}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleExportSimulation}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleResetParameters}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Simulation Progress Bar */}
            {isRunningSimulation && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm font-medium text-text-primary">
                      Simulation Running... {simulationProgress}%
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {Math.round((simulationProgress / 100) * iterations)} / {iterations} iterations
                  </span>
                </div>
                <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Match Quality</div>
                <div className="text-3xl font-bold text-success">{confidence}%</div>
                <Badge variant="success" size="sm" className="mt-2">Excellent</Badge>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
                <div className="text-sm text-text-secondary mb-1">RMSE</div>
                <div className="text-3xl font-bold text-success">0.08</div>
                <div className="text-xs text-text-tertiary mt-1">Low error</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Wells Matched</div>
                <div className="text-3xl font-bold text-text-primary">12/12</div>
                <div className="text-xs text-text-tertiary mt-1">100% coverage</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
                <div className="text-sm text-text-secondary mb-1">Iterations</div>
                <div className="text-3xl font-bold text-primary">{iterations}</div>
                <div className="text-xs text-text-tertiary mt-1">Current run</div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-1">Production History Match</h3>
              <p className="text-sm text-text-secondary mb-6">Historical vs Simulated Production Data (2021-2030)</p>

              <div className="h-[400px] bg-background-secondary rounded-lg p-4 border border-card-border min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={matchData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#7B8CA8"
                      tick={{ fill: '#7B8CA8', fontSize: 11 }}
                      interval={3}
                    />
                    <YAxis 
                      stroke="#7B8CA8"
                      tick={{ fill: '#7B8CA8', fontSize: 11 }}
                      label={{ value: 'Oil Production (MBOPD)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                        border: '1px solid rgba(0, 200, 200, 0.3)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />

                    {/* Confidence Band */}
                    <Area
                      dataKey="confidenceHigh"
                      stroke="none"
                      fill="#0047BA"
                      fillOpacity={0.1}
                      name="Confidence Band"
                    />
                    <Area
                      dataKey="confidenceLow"
                      stroke="none"
                      fill="#0047BA"
                      fillOpacity={0.1}
                    />

                    {/* Historical Data */}
                    <Line 
                      dataKey="observed" 
                      stroke="#00C8C8" 
                      strokeWidth={2}
                      dot={{ fill: '#00C8C8', r: 3 }}
                      name="Historical Production"
                      connectNulls={false}
                    />

                    {/* Simulated Match */}
                    <Line 
                      dataKey="simulated" 
                      stroke="#0047BA" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={false}
                      name="Simulated Match"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleAcceptModel}
                  className="flex-1 bg-success hover:bg-success/90 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Model
                </Button>
                <Button 
                  onClick={handleRefineParameters}
                  variant="outline"
                  className="flex-1"
                >
                  Refine Parameters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 3 (L3): RESERVOIR ENGINEER - Full technical details */}
        {globalLayerPreference === 3 && (
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT PANEL - Controls & Chart */}
            <div className="col-span-9 space-y-6">
              {/* Simulation Controls */}
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-text-primary font-semibold">Simulation Controls</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleImportSimulation}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleExportSimulation}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  {/* Iterations */}
                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Iterations</label>
                    <Input 
                      type="number"
                      value={iterations}
                      onChange={(e) => setIterations(parseInt(e.target.value) || 1000)}
                      className="w-full"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Monte Carlo iterations</p>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Time Horizon (years)</label>
                    <Input 
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 10)}
                      className="w-full"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Forecast period</p>
                  </div>

                  {/* Confidence Target */}
                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Target Confidence</label>
                    <Input 
                      type="number"
                      value="90"
                      className="w-full"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Minimum match quality</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="primary"
                    onClick={handleRunSimulation}
                    disabled={isRunningSimulation}
                    className="flex-1"
                  >
                    {isRunningSimulation ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Simulation... {simulationProgress}%
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Run Full Simulation
                      </>
                    )}
                  </Button>
                  
                  {isRunningSimulation && (
                    <Button 
                      variant="outline"
                      onClick={handlePauseSimulation}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={handleRunOptimization}
                    disabled={isOptimizing || isRunningSimulation}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        AI Optimize
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="ghost"
                    onClick={handleResetParameters}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Progress Bar */}
                {isRunningSimulation && (
                  <div className="mt-4 pt-4 border-t border-card-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">Progress</span>
                      <span className="text-sm text-text-primary font-medium">
                        {Math.round((simulationProgress / 100) * iterations)} / {iterations} iterations
                      </span>
                    </div>
                    <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${simulationProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Parameter Controls */}
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-text-primary font-semibold">Parameter Adjustment</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleSaveSimulation}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLoadModal(true)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Load
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Permeability Multiplier */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-text-primary">Permeability Multiplier</label>
                      <Badge variant="info" size="sm">{permeability.toFixed(2)}</Badge>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.01" 
                      value={permeability}
                      onChange={(e) => setPermeability(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary mt-1">
                      <span>0.5</span>
                      <span>2.0</span>
                    </div>
                  </div>

                  {/* Fault Transmissibility */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-text-primary">Fault Transmissibility</label>
                      <Badge variant="info" size="sm">{faultTrans.toFixed(2)}</Badge>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.01" 
                      value={faultTrans}
                      onChange={(e) => setFaultTrans(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary mt-1">
                      <span>0.1</span>
                      <span>1.0</span>
                    </div>
                  </div>

                  {/* Aquifer Strength */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-text-primary">Aquifer Strength</label>
                      <Badge variant="info" size="sm">{aquiferStrength.toFixed(2)}</Badge>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.01" 
                      value={aquiferStrength}
                      onChange={(e) => setAquiferStrength(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary mt-1">
                      <span>0.5</span>
                      <span>1.5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Comparison Chart */}
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
                <h3 className="text-text-primary font-semibold mb-1">Production Comparison</h3>
                <p className="text-sm text-text-secondary mb-6">Historical vs Simulated Production Data (2021-2030)</p>

                <div className="h-[500px] bg-background-secondary rounded-lg p-4 border border-card-border min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={matchData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#7B8CA8"
                        tick={{ fill: '#7B8CA8', fontSize: 11 }}
                        interval={3}
                      />
                      <YAxis 
                        stroke="#7B8CA8"
                        tick={{ fill: '#7B8CA8', fontSize: 11 }}
                        label={{ value: 'Oil Production (MBOPD)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(13, 25, 50, 0.95)', 
                          border: '1px solid rgba(0, 200, 200, 0.3)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />

                      {/* Confidence Band */}
                      <Area
                        dataKey="confidenceHigh"
                        stroke="none"
                        fill="#0047BA"
                        fillOpacity={0.1}
                        name="P90-P10 Range"
                      />
                      <Area
                        dataKey="confidenceLow"
                        stroke="none"
                        fill="#0047BA"
                        fillOpacity={0.1}
                      />

                      {/* Historical Data */}
                      <Line 
                        dataKey="observed" 
                        stroke="#00C8C8" 
                        strokeWidth={3}
                        dot={{ fill: '#00C8C8', r: 4 }}
                        name="Historical Production"
                        connectNulls={false}
                      />

                      {/* Simulated Match */}
                      <Line 
                        dataKey="simulated" 
                        stroke="#0047BA" 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={false}
                        name="Simulated Match"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="p-3 bg-background-secondary rounded-lg border border-card-border">
                    <div className="text-xs text-text-secondary mb-1">Match Quality</div>
                    <div className="text-xl font-bold text-success">{confidence}%</div>
                  </div>
                  <div className="p-3 bg-background-secondary rounded-lg border border-card-border">
                    <div className="text-xs text-text-secondary mb-1">RMSE</div>
                    <div className="text-xl font-bold text-success">0.08</div>
                  </div>
                  <div className="p-3 bg-background-secondary rounded-lg border border-card-border">
                    <div className="text-xs text-text-secondary mb-1">R² Score</div>
                    <div className="text-xl font-bold text-primary">0.94</div>
                  </div>
                  <div className="p-3 bg-background-secondary rounded-lg border border-card-border">
                    <div className="text-xs text-text-secondary mb-1">Wells</div>
                    <div className="text-xl font-bold text-text-primary">12/12</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={handleAcceptModel}
                    className="flex-1 bg-success hover:bg-success/90 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Accept Model
                  </Button>
                  <Button 
                    onClick={handleRefineParameters}
                    variant="outline"
                    className="flex-1"
                  >
                    Refine Parameters
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - AI Insights */}
            <div className="col-span-3">
              <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">✨</span>
                  <h3 className="text-text-primary font-semibold">AI Insights</h3>
                </div>

                <div className="space-y-4">
                  {/* Best Match Recommendation */}
                  <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                    <div className="text-sm font-medium text-success mb-2">Best Match Achieved</div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Optimal parameters identified:
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Permeability:</span>
                        <span className="font-semibold text-text-primary">{permeability.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Fault Trans:</span>
                        <span className="font-semibold text-text-primary">{faultTrans.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Aquifer:</span>
                        <span className="font-semibold text-text-primary">{aquiferStrength.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <div className="text-sm font-medium text-primary mb-2">Confidence Score</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">{confidence}%</span>
                      <span className="text-sm text-text-tertiary">match quality</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                      Based on historical data comparison and statistical analysis
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                    <div className="text-sm font-medium text-accent mb-2">💡 Recommendations</div>
                    <ul className="text-xs text-text-secondary space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Current match quality is excellent ({confidence}%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Consider accepting model to proceed to uncertainty</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Save current configuration before proceeding</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Simulation Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isSaving && setShowSaveModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Save Simulation</h3>
                {!isSaving && (
                  <button onClick={() => setShowSaveModal(false)} className="text-text-secondary hover:text-text-primary">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Simulation Name</label>
                  <Input 
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter simulation name..."
                    className="w-full"
                    disabled={isSaving}
                  />
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-xs text-text-secondary mb-2">Current Parameters:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Permeability:</span>
                      <span className="text-text-primary font-medium">{permeability.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Fault Trans:</span>
                      <span className="text-text-primary font-medium">{faultTrans.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Aquifer:</span>
                      <span className="text-text-primary font-medium">{aquiferStrength.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-card-border mt-2">
                      <span className="text-text-tertiary">Confidence:</span>
                      <span className="text-success font-semibold">{confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowSaveModal(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Simulation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Load Simulation Modal */}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLoadModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Load Simulation</h3>
                <button onClick={() => setShowLoadModal(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {savedSimulations.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                    <p className="text-text-secondary">No saved simulations found</p>
                  </div>
                ) : (
                  savedSimulations.map((sim) => (
                    <div 
                      key={sim.id}
                      className="bg-background-secondary rounded-lg p-4 border border-card-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleLoadSimulation(sim)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-text-primary font-medium mb-1">{sim.name}</h4>
                          <p className="text-xs text-text-tertiary">{sim.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success" size="sm">{sim.confidence}%</Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSimulation(sim);
                            }}
                            className="text-text-tertiary hover:text-danger"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-text-tertiary text-xs">Perm:</span>
                          <span className="text-text-primary font-medium ml-1">{sim.permeability.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-text-tertiary text-xs">Fault:</span>
                          <span className="text-text-primary font-medium ml-1">{sim.faultTrans.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-text-tertiary text-xs">Aquifer:</span>
                          <span className="text-text-primary font-medium ml-1">{sim.aquiferStrength.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-card-border">
                <Button variant="ghost" onClick={() => setShowLoadModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
