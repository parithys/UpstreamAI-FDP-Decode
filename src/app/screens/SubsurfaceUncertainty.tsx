import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Layers, ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle2, Edit, Save, X, PlayCircle, Pause, Download, Upload, Loader2, RotateCcw, TrendingUp } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';
import { toast } from 'sonner';

// U1: Subsurface / Geological Uncertainty Parameters
interface Parameter {
  id: string;
  name: string;
  discipline: string;
  status: 'configured' | 'partial' | 'pending';
  min: number | null;
  max: number | null;
  mostLikely: number | null;
  distribution: string;
  confidence: number;
  dataSource: string;
  lastUpdated: string | null;
  updatedBy: string | null;
}

const initialParameters: Parameter[] = [
  {
    id: 'porosity',
    name: 'Porosity Distribution',
    discipline: 'Petrophysics',
    status: 'configured',
    min: 0.18,
    max: 0.28,
    mostLikely: 0.23,
    distribution: 'Normal',
    confidence: 85,
    dataSource: 'Core samples from Wells 1-12',
    lastUpdated: '2025-02-01',
    updatedBy: 'Sarah Chen'
  },
  {
    id: 'permeability',
    name: 'Permeability Range',
    discipline: 'Petrophysics',
    status: 'configured',
    min: 50,
    max: 450,
    mostLikely: 180,
    distribution: 'Log-Normal',
    confidence: 78,
    dataSource: 'Well test data, MRI/CT scanning',
    lastUpdated: '2025-02-02',
    updatedBy: 'Mohammed Al-Rashid'
  },
  {
    id: 'netPay',
    name: 'Net Pay Thickness',
    discipline: 'Geology',
    status: 'pending',
    min: null,
    max: null,
    mostLikely: null,
    distribution: 'Triangular',
    confidence: 0,
    dataSource: 'Seismic interpretation - Zone C incomplete',
    lastUpdated: null,
    updatedBy: null
  },
  {
    id: 'aquifer',
    name: 'Aquifer Strength',
    discipline: 'Reservoir Engineering',
    status: 'configured',
    min: 0.5,
    max: 2.5,
    mostLikely: 1.2,
    distribution: 'Uniform',
    confidence: 65,
    dataSource: 'Analog field data (Block 14)',
    lastUpdated: '2025-01-28',
    updatedBy: 'David Martinez'
  },
  {
    id: 'faultSeal',
    name: 'Fault Seal Quality',
    discipline: 'Geophysics',
    status: 'pending',
    min: null,
    max: null,
    mostLikely: null,
    distribution: 'Discrete',
    confidence: 0,
    dataSource: 'Geophysical processing - quality issues flagged',
    lastUpdated: null,
    updatedBy: null
  },
  {
    id: 'goc',
    name: 'Gas-Oil Contact Depth',
    discipline: 'Geophysics',
    status: 'configured',
    min: 2450,
    max: 2490,
    mostLikely: 2470,
    distribution: 'Normal',
    confidence: 92,
    dataSource: 'Well 3, Well 7, Well 11 logs',
    lastUpdated: '2025-02-03',
    updatedBy: 'Sarah Chen'
  },
  {
    id: 'upscaling',
    name: 'Upscaling Factor',
    discipline: 'Reservoir Engineering',
    status: 'partial',
    min: 0.8,
    max: 1.2,
    mostLikely: null,
    distribution: 'Triangular',
    confidence: 55,
    dataSource: 'Micro-CT scanning - partial coverage',
    lastUpdated: '2025-01-30',
    updatedBy: 'John Williams'
  },
  {
    id: 'pvt',
    name: 'PVT Properties Variation',
    discipline: 'Petrophysics',
    status: 'configured',
    min: 0.92,
    max: 1.08,
    mostLikely: 1.0,
    distribution: 'Normal',
    confidence: 88,
    dataSource: 'Lab analysis from 8 fluid samples',
    lastUpdated: '2025-02-04',
    updatedBy: 'Dr. Ahmed Hassan'
  }
];

const dataReadinessItems = [
  {
    id: 'core-data',
    name: 'Core Sample Analysis',
    status: 'complete',
    coverage: 100,
    wells: '12/12 wells',
    description: 'Porosity, permeability, saturation from core plugs'
  },
  {
    id: 'seismic',
    name: 'Seismic Interpretation',
    status: 'partial',
    coverage: 75,
    wells: 'Zone A, B complete | Zone C incomplete',
    description: 'Structural interpretation and horizon mapping'
  },
  {
    id: 'well-logs',
    name: 'Petrophysical Logs',
    status: 'partial',
    coverage: 85,
    wells: '14/16 wells | Wells 14, 15 missing Zone C',
    description: 'Gamma ray, resistivity, porosity, density logs'
  },
  {
    id: 'mri-ct',
    name: 'MRI/CT Scanning',
    status: 'partial',
    coverage: 60,
    wells: '7/12 samples scanned',
    description: 'Advanced rock characterization for micro-scale properties'
  },
  {
    id: 'geological-model',
    name: 'Static Geological Model',
    status: 'complete',
    coverage: 100,
    wells: 'Full 3D model built',
    description: 'Structural framework, facies distribution, property modeling'
  }
];

export function SubsurfaceUncertainty() {
  const { openChat } = useChat();
  const { confirmSuccess, confirmWarning, confirmDanger } = useConfirmation();
  const { addNotification } = useNotifications();
  
  const [parameters, setParameters] = useState<Parameter[]>(initialParameters);
  const [expandedParam, setExpandedParam] = useState<string | null>(null);
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Parameter>>({});
  
  // Monte Carlo state
  const [isRunningMonteCarlo, setIsRunningMonteCarlo] = useState(false);
  const [monteCarloProgress, setMonteCarloProgress] = useState(0);
  const [monteCarloIterations, setMonteCarloIterations] = useState(10000);
  const [monteCarloResults, setMonteCarloResults] = useState<any>(null);
  const [showMonteCarloModal, setShowMonteCarloModal] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  const configured = parameters.filter(p => p.status === 'configured').length;
  const partial = parameters.filter(p => p.status === 'partial').length;
  const pending = parameters.filter(p => p.status === 'pending').length;
  const total = parameters.length;
  const readiness = Math.round((configured + partial * 0.5) / total * 100);

  // Edit parameter
  const handleEditParameter = (param: Parameter) => {
    setEditingParam(param.id);
    setEditedValues({
      min: param.min,
      max: param.max,
      mostLikely: param.mostLikely,
      distribution: param.distribution,
      dataSource: param.dataSource
    });
    setExpandedParam(param.id);
  };

  // Save edited parameter
  const handleSaveParameter = async (paramId: string) => {
    const param = parameters.find(p => p.id === paramId);
    if (!param) return;

    // Validation
    if (editedValues.min !== null && editedValues.max !== null && editedValues.min >= editedValues.max) {
      toast.error('Invalid Range', {
        description: 'Minimum value must be less than maximum value'
      });
      return;
    }

    if (editedValues.mostLikely !== null && editedValues.min !== null && editedValues.max !== null) {
      if (editedValues.mostLikely < editedValues.min || editedValues.mostLikely > editedValues.max) {
        toast.error('Invalid Most Likely Value', {
          description: 'Most likely value must be between min and max'
        });
        return;
      }
    }

    const confirmed = await confirmSuccess({
      title: 'Save Parameter Changes',
      message: `Save changes to "${param.name}"? This will update the uncertainty configuration for Monte Carlo simulation.`,
      confirmLabel: 'Save Changes',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Saving parameter...', { id: 'save-param' });
      
      setTimeout(() => {
        const today = new Date().toLocaleDateString('en-US', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        setParameters(prev => prev.map(p => {
          if (p.id === paramId) {
            const hasAllValues = editedValues.min !== null && editedValues.max !== null && editedValues.mostLikely !== null;
            return {
              ...p,
              ...editedValues,
              status: hasAllValues ? 'configured' : editedValues.min !== null && editedValues.max !== null ? 'partial' : 'pending',
              lastUpdated: today,
              updatedBy: 'Current User',
              confidence: hasAllValues ? Math.max(p.confidence, 75) : p.confidence
            } as Parameter;
          }
          return p;
        }));

        setEditingParam(null);
        setEditedValues({});
        
        toast.success('Parameter Saved', {
          id: 'save-param',
          description: `${param.name} updated successfully`
        });

        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'simulation',
          title: 'Parameter Updated',
          message: `${param.name} configuration saved`,
          actionLabel: 'View',
          actionUrl: '/uncertainty/subsurface'
        });
      }, 1000);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingParam(null);
    setEditedValues({});
  };

  // Delete/Reset parameter
  const handleResetParameter = async (param: Parameter) => {
    const confirmed = await confirmWarning({
      title: 'Reset Parameter',
      message: `Reset "${param.name}" to unconfigured state? All values will be cleared.`,
      confirmLabel: 'Reset',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setParameters(prev => prev.map(p => {
        if (p.id === param.id) {
          return {
            ...p,
            min: null,
            max: null,
            mostLikely: null,
            status: 'pending',
            confidence: 0,
            lastUpdated: null,
            updatedBy: null
          };
        }
        return p;
      }));

      toast.info('Parameter Reset', {
        description: `${param.name} cleared`
      });
    }
  };

  // Run Monte Carlo simulation
  const handleRunMonteCarlo = async () => {
    const configuredParams = parameters.filter(p => p.status === 'configured');
    
    if (configuredParams.length === 0) {
      toast.error('No Parameters Configured', {
        description: 'Configure at least one parameter before running Monte Carlo simulation'
      });
      return;
    }

    const confirmed = await confirmSuccess({
      title: 'Run Monte Carlo Simulation',
      message: `Execute Monte Carlo simulation with ${monteCarloIterations.toLocaleString()} iterations using ${configuredParams.length} configured parameters? This will calculate P10, P50, and P90 values.`,
      confirmLabel: `Run ${monteCarloIterations.toLocaleString()} Iterations`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsRunningMonteCarlo(true);
      setMonteCarloProgress(0);
      setShowMonteCarloModal(false);
      
      toast.loading('Starting Monte Carlo simulation...', { id: 'monte-carlo' });
      
      // Simulate progress
      const interval = setInterval(() => {
        setMonteCarloProgress(prev => {
          const next = prev + 5;
          
          if (next >= 100) {
            clearInterval(interval);
            
            // Generate results
            const results = {
              iterations: monteCarloIterations,
              parametersUsed: configuredParams.length,
              p10: 2850,
              p50: 3200,
              p90: 3580,
              mean: 3210,
              stdDev: 245,
              completionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              confidence: 94
            };
            
            setMonteCarloResults(results);
            setIsRunningMonteCarlo(false);
            setMonteCarloProgress(0);
            
            toast.success('Monte Carlo Complete', {
              id: 'monte-carlo',
              description: `${monteCarloIterations.toLocaleString()} iterations completed successfully`
            });
            
            addNotification({
              type: 'success',
              priority: 'high',
              category: 'simulation',
              title: 'Monte Carlo Simulation Complete',
              message: `Completed ${monteCarloIterations.toLocaleString()} iterations with ${configuredParams.length} parameters`,
              actionLabel: 'View Results',
              actionUrl: '/uncertainty/subsurface'
            });
            
            return 100;
          }
          
          const stage = next < 25 ? 'Initializing...' : next < 50 ? 'Sampling parameters...' : next < 75 ? 'Running simulations...' : 'Calculating statistics...';
          toast.loading(`${stage} ${next}%`, { id: 'monte-carlo' });
          return next;
        });
      }, 100);
    }
  };

  // Save all parameters
  const handleSaveAllParameters = async () => {
    const confirmed = await confirmSuccess({
      title: 'Save All Parameters',
      message: `Save all ${parameters.length} subsurface uncertainty parameters? This will update the configuration for AI Led Simulation.`,
      confirmLabel: 'Save All',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsSaving(true);
      toast.loading('Saving parameters...', { id: 'save-all' });

      setTimeout(() => {
        setIsSaving(false);
        toast.success('Parameters Saved', {
          id: 'save-all',
          description: 'All subsurface parameters saved successfully'
        });

        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'simulation',
          title: 'Configuration Saved',
          message: 'Subsurface uncertainty parameters saved',
          actionLabel: 'View',
          actionUrl: '/uncertainty/subsurface'
        });
      }, 1500);
    }
  };

  // Export parameters
  const handleExportParameters = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Parameters',
      message: 'Export all subsurface uncertainty parameters as Excel file?',
      confirmLabel: 'Export',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Preparing export...', { id: 'export-params' });
      
      setTimeout(() => {
        toast.success('Export Complete', {
          id: 'export-params',
          description: 'Parameters exported successfully'
        });

        addNotification({
          type: 'success',
          priority: 'low',
          category: 'data',
          title: 'Parameters Exported',
          message: 'Subsurface uncertainty parameters exported as Excel',
          actionLabel: 'Download',
          actionUrl: '#'
        });
      }, 1000);
    }
  };

  // Import parameters
  const handleImportParameters = () => {
    toast.info('Import Parameters', {
      description: 'Select a parameter file to import'
    });
  };

  // Validate data
  const handleValidateData = async () => {
    const confirmed = await confirmSuccess({
      title: 'Validate Parameters',
      message: 'Run validation checks on all configured parameters? This will verify ranges, distributions, and data consistency.',
      confirmLabel: 'Validate',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Running validation...', { id: 'validate' });

      setTimeout(() => {
        const issues = parameters.filter(p => p.status === 'pending' || p.status === 'partial').length;
        
        if (issues > 0) {
          toast.warning('Validation Complete with Warnings', {
            id: 'validate',
            description: `${issues} parameters need additional configuration`
          });
        } else {
          toast.success('Validation Complete', {
            id: 'validate',
            description: 'All parameters validated successfully'
          });
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              <Layers className="inline w-6 h-6 mr-2 text-danger" />
              Subsurface Uncertainty Configuration
            </h1>
            <p className="text-sm text-text-secondary">
              Define geological and reservoir parameter ranges for Monte Carlo simulation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImportParameters}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportParameters}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" onClick={openChat}>
              ✨ AI Assistant
            </Button>
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center justify-between bg-card rounded-lg p-4 border border-card-border shadow-glow mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="primary"
              onClick={() => setShowMonteCarloModal(true)}
              disabled={isRunningMonteCarlo || configured === 0}
            >
              {isRunningMonteCarlo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running... {monteCarloProgress}%
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Run Monte Carlo
                </>
              )}
            </Button>

            <Button 
              variant="outline"
              onClick={handleValidateData}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validate All
            </Button>

            <Button 
              variant="outline"
              onClick={handleSaveAllParameters}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Readiness:</span>
            <Badge variant={readiness >= 80 ? "success" : readiness >= 50 ? "warning" : "danger"} size="sm">
              {readiness}%
            </Badge>
          </div>
        </div>

        {/* Monte Carlo Progress Bar */}
        {isRunningMonteCarlo && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-medium text-text-primary">
                  Monte Carlo Simulation... {monteCarloProgress}%
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {Math.round((monteCarloProgress / 100) * monteCarloIterations).toLocaleString()} / {monteCarloIterations.toLocaleString()} iterations
              </span>
            </div>
            <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${monteCarloProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Monte Carlo Results */}
        {monteCarloResults && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold text-success">Monte Carlo Results</h3>
              </div>
              <Badge variant="success" size="sm">{monteCarloResults.confidence}% Confidence</Badge>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-secondary mb-1">P10 (Optimistic)</div>
                <div className="text-2xl font-bold text-success">{monteCarloResults.p10}</div>
                <div className="text-xs text-text-tertiary mt-1">MMBOE</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-secondary mb-1">P50 (Most Likely)</div>
                <div className="text-2xl font-bold text-primary">{monteCarloResults.p50}</div>
                <div className="text-xs text-text-tertiary mt-1">MMBOE</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-secondary mb-1">P90 (Conservative)</div>
                <div className="text-2xl font-bold text-warning">{monteCarloResults.p90}</div>
                <div className="text-xs text-text-tertiary mt-1">MMBOE</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-secondary mb-1">Mean</div>
                <div className="text-2xl font-bold text-text-primary">{monteCarloResults.mean}</div>
                <div className="text-xs text-text-tertiary mt-1">MMBOE</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-secondary mb-1">Std Dev</div>
                <div className="text-2xl font-bold text-text-primary">{monteCarloResults.stdDev}</div>
                <div className="text-xs text-text-tertiary mt-1">±MMBOE</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-text-secondary">
              Completed {monteCarloResults.iterations.toLocaleString()} iterations using {monteCarloResults.parametersUsed} parameters at {monteCarloResults.completionTime}
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Configured</div>
            <div className="text-3xl font-bold text-success">{configured}</div>
            <div className="text-xs text-text-tertiary mt-1">Ready for MC</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Partial</div>
            <div className="text-3xl font-bold text-warning">{partial}</div>
            <div className="text-xs text-text-tertiary mt-1">Need values</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Pending</div>
            <div className="text-3xl font-bold text-danger">{pending}</div>
            <div className="text-xs text-text-tertiary mt-1">Not started</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Total Parameters</div>
            <div className="text-3xl font-bold text-text-primary">{total}</div>
            <div className="text-xs text-text-tertiary mt-1">In model</div>
          </div>
        </div>

        {/* Parameters List */}
        <div className="bg-card rounded-lg border border-card-border shadow-glow">
          <div className="p-6 border-b border-card-border">
            <h3 className="text-lg font-semibold text-text-primary">Parameter Configuration</h3>
            <p className="text-sm text-text-secondary mt-1">
              Define min, max, and most likely values for each subsurface parameter
            </p>
          </div>

          <div className="divide-y divide-card-border">
            {parameters.map((param) => (
              <div key={param.id} className="p-4">
                {/* Parameter Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => setExpandedParam(expandedParam === param.id ? null : param.id)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      {expandedParam === param.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-text-primary font-medium">{param.name}</h4>
                        <Badge 
                          variant={param.status === 'configured' ? 'success' : param.status === 'partial' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {param.status === 'configured' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {param.status === 'partial' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {param.status === 'pending' && <Info className="w-3 h-3 mr-1" />}
                          {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                        </Badge>
                        {param.confidence > 0 && (
                          <Badge variant="info" size="sm">
                            {param.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {param.discipline}
                        {param.lastUpdated && (
                          <> • Updated {param.lastUpdated} by {param.updatedBy}</>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingParam === param.id ? (
                      <>
                        <Button 
                          size="sm"
                          variant="primary"
                          onClick={() => handleSaveParameter(param.id)}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditParameter(param)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {param.status !== 'pending' && (
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => handleResetParameter(param)}
                            className="text-danger hover:text-danger"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedParam === param.id && (
                  <div className="mt-4 pl-7 space-y-4">
                    {editingParam === param.id ? (
                      /* Edit Mode */
                      <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">Minimum</label>
                            <Input 
                              type="number"
                              step="any"
                              value={editedValues.min ?? ''}
                              onChange={(e) => setEditedValues({...editedValues, min: e.target.value ? parseFloat(e.target.value) : null})}
                              placeholder="Enter min value"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">Most Likely</label>
                            <Input 
                              type="number"
                              step="any"
                              value={editedValues.mostLikely ?? ''}
                              onChange={(e) => setEditedValues({...editedValues, mostLikely: e.target.value ? parseFloat(e.target.value) : null})}
                              placeholder="Enter most likely"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">Maximum</label>
                            <Input 
                              type="number"
                              step="any"
                              value={editedValues.max ?? ''}
                              onChange={(e) => setEditedValues({...editedValues, max: e.target.value ? parseFloat(e.target.value) : null})}
                              placeholder="Enter max value"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">Distribution</label>
                            <Select 
                              value={editedValues.distribution}
                              onValueChange={(value) => setEditedValues({...editedValues, distribution: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="Log-Normal">Log-Normal</SelectItem>
                                <SelectItem value="Triangular">Triangular</SelectItem>
                                <SelectItem value="Uniform">Uniform</SelectItem>
                                <SelectItem value="Discrete">Discrete</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">Data Source</label>
                            <Input 
                              value={editedValues.dataSource ?? ''}
                              onChange={(e) => setEditedValues({...editedValues, dataSource: e.target.value})}
                              placeholder="Enter data source"
                            />
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-text-secondary">
                          <strong className="text-primary">Tip:</strong> For best Monte Carlo results, ensure min &lt; most likely &lt; max. Distribution type should match your data characteristics.
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-3">
                            <div className="flex justify-between p-2 bg-background-secondary rounded">
                              <span className="text-sm text-text-secondary">Minimum:</span>
                              <span className="text-sm text-text-primary font-medium">
                                {param.min !== null ? param.min : 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-background-secondary rounded">
                              <span className="text-sm text-text-secondary">Most Likely:</span>
                              <span className="text-sm text-text-primary font-medium">
                                {param.mostLikely !== null ? param.mostLikely : 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-background-secondary rounded">
                              <span className="text-sm text-text-secondary">Maximum:</span>
                              <span className="text-sm text-text-primary font-medium">
                                {param.max !== null ? param.max : 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-background-secondary rounded">
                              <span className="text-sm text-text-secondary">Distribution:</span>
                              <span className="text-sm text-text-primary font-medium">
                                {param.distribution}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="bg-background-secondary rounded p-3">
                            <div className="text-xs text-text-secondary mb-2">Data Source:</div>
                            <div className="text-sm text-text-primary leading-relaxed">
                              {param.dataSource}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Readiness */}
        <div className="mt-6 bg-card rounded-lg border border-card-border shadow-glow">
          <div className="p-6 border-b border-card-border">
            <h3 className="text-lg font-semibold text-text-primary">Data Readiness Assessment</h3>
            <p className="text-sm text-text-secondary mt-1">
              Quality and coverage of source data for uncertainty parameters
            </p>
          </div>

          <div className="p-6 space-y-4">
            {dataReadinessItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === 'complete' ? 'bg-success/20' : 'bg-warning/20'
                }`}>
                  {item.status === 'complete' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-text-primary font-medium">{item.name}</h4>
                    <Badge 
                      variant={item.coverage === 100 ? 'success' : item.coverage >= 75 ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {item.coverage}%
                    </Badge>
                  </div>
                  <div className="text-xs text-text-secondary mb-2">{item.wells}</div>
                  <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        item.coverage === 100 ? 'bg-success' : item.coverage >= 75 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${item.coverage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <Link to="/uncertainty">
            <Button variant="ghost">
              ← Back to Uncertainty Overview
            </Button>
          </Link>
          <Link to="/uncertainty/operational">
            <Button variant="primary">
              Continue to Operational Uncertainty →
            </Button>
          </Link>
        </div>

        {/* Monte Carlo Settings Modal */}
        {showMonteCarloModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowMonteCarloModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Monte Carlo Settings</h3>
                <button onClick={() => setShowMonteCarloModal(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Number of Iterations</label>
                  <Input 
                    type="number"
                    value={monteCarloIterations}
                    onChange={(e) => setMonteCarloIterations(parseInt(e.target.value) || 10000)}
                    min="1000"
                    max="100000"
                    step="1000"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    Recommended: 10,000 - 50,000 for accurate results
                  </p>
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-sm text-text-secondary mb-2">Parameters to use:</div>
                  <div className="text-2xl font-bold text-success mb-1">{configured}</div>
                  <div className="text-xs text-text-tertiary">Configured parameters ready for simulation</div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-text-secondary">
                  <strong className="text-primary">Note:</strong> Higher iteration counts provide more accurate P10/P50/P90 values but take longer to compute. 10,000 iterations typically complete in 2-3 minutes.
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowMonteCarloModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleRunMonteCarlo}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Run Simulation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
