import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Square, Pause, Loader2, CheckCircle, TrendingUp, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmation } from '../context/ConfirmationContext';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

export function SimulationControls() {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [scenariosProcessed, setScenariosProcessed] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('--:--');
  
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const { confirmWarning, confirmDanger } = useConfirmation();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  // Update progress when simulation is running
  useEffect(() => {
    if (simulationStatus === 'running') {
      simulationTimerRef.current = setInterval(() => {
        progressRef.current += 1;
        
        if (progressRef.current >= 100) {
          progressRef.current = 100;
          setSimulationProgress(100);
          setScenariosProcessed(3847);
          setSimulationStatus('completed');
          setEstimatedTimeRemaining('00:00');
          
          if (simulationTimerRef.current) {
            clearInterval(simulationTimerRef.current);
          }
          
          toast.success('Simulation completed!', {
            description: '3,847 AI-led scenarios successfully generated with 94% accuracy'
          });
        } else {
          setSimulationProgress(progressRef.current);
          setScenariosProcessed(Math.floor(progressRef.current * 38.47));
          
          // Calculate estimated time remaining (100 increments at 150ms each = 15 seconds total)
          const remainingSeconds = Math.ceil((100 - progressRef.current) * 0.15);
          const minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          setEstimatedTimeRemaining(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }
      }, 150); // Update every 150ms for smooth progress

      return () => {
        if (simulationTimerRef.current) {
          clearInterval(simulationTimerRef.current);
        }
      };
    } else if (simulationStatus === 'paused') {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    }
  }, [simulationStatus]);

  const handleStartSimulation = () => {
    setSimulationStatus('running');
    progressRef.current = 0;
    setSimulationProgress(0);
    setScenariosProcessed(0);
    toast.info('AI-led simulation started', {
      description: 'Running physics-informed neural network simulations across 3,847 scenarios'
    });
  };

  const handlePauseSimulation = () => {
    setSimulationStatus('paused');
    toast.info('Simulation paused', {
      description: `Paused at ${scenariosProcessed} scenarios (${simulationProgress}% complete)`
    });
  };

  const handleResumeSimulation = () => {
    setSimulationStatus('running');
    toast.info('Simulation resumed', {
      description: 'Continuing AI-led scenario generation'
    });
  };

  const handleStopSimulation = async () => {
    const confirmed = await confirmWarning({
      title: 'Stop Simulation?',
      message: `Are you sure you want to stop the simulation at ${simulationProgress}% complete?`,
      details: `${scenariosProcessed} scenarios have been processed so far. All progress will be lost.`,
      confirmLabel: 'Stop Simulation',
      cancelLabel: 'Continue Running'
    });

    if (confirmed) {
      setSimulationStatus('idle');
      progressRef.current = 0;
      setSimulationProgress(0);
      setScenariosProcessed(0);
      setEstimatedTimeRemaining('--:--');
      
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
      
      toast.warning('Simulation stopped', {
        description: 'All progress has been reset'
      });
    }
  };

  const handleReset = async () => {
    const confirmed = await confirmWarning({
      title: 'Reset Simulation?',
      message: 'This will clear the current simulation results and prepare for a new run.',
      confirmLabel: 'Reset',
      cancelLabel: 'Keep Results'
    });

    if (confirmed) {
      setSimulationStatus('idle');
      progressRef.current = 0;
      setSimulationProgress(0);
      setScenariosProcessed(0);
      setEstimatedTimeRemaining('--:--');
      
      toast.success('Simulation reset', {
        description: 'Ready to start a new AI-led simulation run'
      });
    }
  };

  const handleExportResults = (format: 'csv' | 'excel') => {
    // Generate sample simulation results
    const results = Array.from({ length: 100 }, (_, i) => ({
      'Scenario ID': `AI-${String(i + 1).padStart(4, '0')}`,
      'Oil Rate (bbl/d)': (5000 + Math.random() * 2000).toFixed(0),
      'Gas Rate (MMscf/d)': (15 + Math.random() * 5).toFixed(2),
      'Water Cut (%)': (Math.random() * 30).toFixed(1),
      'Pressure (psia)': (2500 + Math.random() * 500).toFixed(0),
      'NPV (MM$)': (250 + Math.random() * 100).toFixed(2),
      'Recovery Factor (%)': (35 + Math.random() * 10).toFixed(2),
      'Confidence Level': (85 + Math.random() * 12).toFixed(1),
      'Model Accuracy': 'R² = 0.94'
    }));

    const success = format === 'csv' 
      ? exportToCSV(results, `ai_simulation_results_${new Date().toISOString().split('T')[0]}`)
      : exportToExcel(results, `ai_simulation_results_${new Date().toISOString().split('T')[0]}`);

    if (success) {
      toast.success('Results exported successfully', {
        description: `100 AI-led scenario results exported as ${format.toUpperCase()}`
      });
    } else {
      toast.error('Export failed', {
        description: 'There was an error exporting the simulation results'
      });
    }
  };

  // Status badge configuration
  const statusConfig = {
    idle: {
      badge: 'bg-background-secondary text-text-tertiary border-card-border',
      icon: Play,
      text: 'Ready'
    },
    running: {
      badge: 'bg-success/10 text-success border-success/30',
      icon: Loader2,
      text: 'Running'
    },
    paused: {
      badge: 'bg-warning/10 text-warning border-warning/30',
      icon: Pause,
      text: 'Paused'
    },
    completed: {
      badge: 'bg-primary/10 text-primary border-primary/30',
      icon: CheckCircle,
      text: 'Completed'
    }
  };

  const StatusIcon = statusConfig[simulationStatus].icon;

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-lg font-semibold text-text-primary">
          AI-Led Simulation Controls
        </h3>
        <Badge className={statusConfig[simulationStatus].badge}>
          <StatusIcon className={`w-3 h-3 mr-1 ${simulationStatus === 'running' ? 'animate-spin' : ''}`} />
          {statusConfig[simulationStatus].text}
        </Badge>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Simulation Progress</span>
          <span className="text-sm font-semibold text-text-primary">{simulationProgress}%</span>
        </div>
        <div className="w-full h-3 bg-background-secondary rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-300 ${ 
              simulationStatus === 'completed' ? 'bg-primary' : 'bg-success'
            }`}
            style={{ width: `${simulationProgress}%` }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background-secondary rounded-lg p-3 border border-card-border">
            <div className="text-xs text-text-tertiary mb-1">Scenarios Processed</div>
            <div className="text-xl font-bold text-text-primary">{scenariosProcessed.toLocaleString()}</div>
            <div className="text-xs text-text-secondary">of 3,847 total</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-3 border border-card-border">
            <div className="text-xs text-text-tertiary mb-1">Time Remaining</div>
            <div className="text-xl font-bold text-text-primary">{estimatedTimeRemaining}</div>
            <div className="text-xs text-text-secondary">estimated</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-3 border border-card-border">
            <div className="text-xs text-text-tertiary mb-1">Validation Accuracy</div>
            <div className="text-xl font-bold text-success">R² = 0.94</div>
            <div className="text-xs text-text-secondary">production match</div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {simulationStatus === 'idle' && (
          <Button 
            variant="primary" 
            onClick={handleStartSimulation}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Start AI-Led Simulation
          </Button>
        )}

        {simulationStatus === 'running' && (
          <>
            <Button 
              variant="outline" 
              onClick={handlePauseSimulation}
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button 
              variant="outline" 
              onClick={handleStopSimulation}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {simulationStatus === 'paused' && (
          <>
            <Button 
              variant="primary" 
              onClick={handleResumeSimulation}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button 
              variant="outline" 
              onClick={handleStopSimulation}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {simulationStatus === 'completed' && (
          <>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Run New Simulation
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportResults('csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportResults('excel')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button 
              variant="primary"
              onClick={() => toast.info('Opening results', { description: 'Navigating to simulation results dashboard' })}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Results
            </Button>
          </>
        )}
      </div>

      {/* Status Message */}
      {simulationStatus !== 'idle' && (
        <div className={`mt-4 p-3 rounded-lg border ${ 
          simulationStatus === 'completed' 
            ? 'bg-primary/10 border-primary/30' 
            : simulationStatus === 'paused'
            ? 'bg-warning/10 border-warning/30'
            : 'bg-success/10 border-success/30'
        }`}>
          <p className="text-sm text-text-secondary">
            {simulationStatus === 'completed' && (
              <span className="font-semibold text-primary">Simulation Complete: </span>
            )}
            {simulationStatus === 'paused' && (
              <span className="font-semibold text-warning">Simulation Paused: </span>
            )}
            {simulationStatus === 'running' && (
              <span className="font-semibold text-success">Simulation Running: </span>
            )}
            {simulationStatus === 'completed' && 
              '3,847 scenarios successfully generated using physics-informed neural networks with 94% validation accuracy. Results are ready for analysis.'
            }
            {simulationStatus === 'paused' && 
              `Progress saved at ${scenariosProcessed} scenarios. Click Resume to continue or Stop to reset.`
            }
            {simulationStatus === 'running' && 
              'AI surrogate models are actively generating scenarios using physics-constrained predictions. Progress updates in real-time.'
            }
          </p>
        </div>
      )}
    </div>
  );
}