import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SafeChartContainer } from '../components/ui/safe-chart-container';
import { RefreshCw, Download, Upload, TrendingUp, AlertCircle, Clock, X, Loader2, Save, RotateCcw, Calendar, CheckCircle2 } from 'lucide-react';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';
import { toast } from 'sonner';

interface PriceDataPoint {
  year: number;
  optimistic: number;
  base: number;
  pessimistic: number;
}

interface Parameter {
  name: string;
  min: number;
  mostLikely: number;
  max: number;
  distribution: string;
  confidence: number;
}

interface GeopoliticalScenario {
  id: string;
  name: string;
  enabled: boolean;
  impact: string;
}

const initialPriceData: PriceDataPoint[] = [
  { year: 2020, optimistic: 55, base: 42, pessimistic: 32 },
  { year: 2021, optimistic: 65, base: 52, pessimistic: 38 },
  { year: 2022, optimistic: 85, base: 68, pessimistic: 48 },
  { year: 2023, optimistic: 90, base: 75, pessimistic: 52 },
  { year: 2024, optimistic: 88, base: 72, pessimistic: 50 },
  { year: 2025, optimistic: 95, base: 78, pessimistic: 58 },
  { year: 2026, optimistic: 100, base: 80, pessimistic: 60 },
  { year: 2027, optimistic: 105, base: 82, pessimistic: 58 },
  { year: 2028, optimistic: 110, base: 85, pessimistic: 55 },
  { year: 2029, optimistic: 108, base: 83, pessimistic: 52 },
  { year: 2030, optimistic: 112, base: 86, pessimistic: 50 }
];

const initialParameters: Parameter[] = [
  { name: 'Brent Crude ($/bbl)', min: 45, mostLikely: 72, max: 110, distribution: 'Triangular', confidence: 75 },
  { name: 'Gas Price ($/MMBtu)', min: 2.5, mostLikely: 4.2, max: 8.0, distribution: 'Log-normal', confidence: 68 },
  { name: 'OPEX Inflation (%)', min: 1.5, mostLikely: 3.2, max: 6.5, distribution: 'Normal', confidence: 80 }
];

const initialScenarios: GeopoliticalScenario[] = [
  { 
    id: 'opec', 
    name: 'OPEC Production Cut', 
    enabled: true,
    impact: 'Potential +$8-15/bbl price increase' 
  },
  { 
    id: 'geopolitical', 
    name: 'Geopolitical Disruption', 
    enabled: false,
    impact: 'High volatility, ±$20/bbl swings' 
  },
  { 
    id: 'transition', 
    name: 'Energy Transition Acceleration', 
    enabled: false,
    impact: 'Long-term bearish pressure, -$10-25/bbl' 
  }
];

// Forecast update sources
const forecastSources = [
  { id: 'eia', name: 'EIA (Energy Information Administration)', lastUpdate: 'Jan 15, 2026' },
  { id: 'iea', name: 'IEA (International Energy Agency)', lastUpdate: 'Jan 10, 2026' },
  { id: 'opec', name: 'OPEC Monthly Oil Market Report', lastUpdate: 'Feb 5, 2026' },
  { id: 'world-bank', name: 'World Bank Commodities Forecast', lastUpdate: 'Dec 20, 2025' },
  { id: 'bloomberg', name: 'Bloomberg Energy Outlook', lastUpdate: 'Feb 1, 2026' }
];

export function MarketVolatility() {
  const { confirmSuccess, confirmWarning, confirmDanger } = useConfirmation();
  const { addNotification } = useNotifications();

  const [priceData, setPriceData] = useState<PriceDataPoint[]>(initialPriceData);
  const [parameters, setParameters] = useState<Parameter[]>(initialParameters);
  const [scenarios, setScenarios] = useState<GeopoliticalScenario[]>(initialScenarios);
  
  // Update state
  const [isUpdatingForecast, setIsUpdatingForecast] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [lastForecastUpdate, setLastForecastUpdate] = useState('Feb 5, 2026, 10:30 AM');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState('eia');
  
  // Import/Export state
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Forecast version history
  const [forecastHistory, setForecastHistory] = useState([
    { id: '1', version: 'v4.2', date: 'Feb 5, 2026, 10:30 AM', source: 'OPEC MOMR', basePrice: 78 },
    { id: '2', version: 'v4.1', date: 'Feb 1, 2026, 2:15 PM', source: 'Bloomberg', basePrice: 76 },
    { id: '3', version: 'v4.0', date: 'Jan 15, 2026, 9:00 AM', source: 'EIA', basePrice: 74 }
  ]);

  // Update forecast from source
  const handleUpdateForecast = async () => {
    const source = forecastSources.find(s => s.id === selectedSource);
    
    const confirmed = await confirmSuccess({
      title: 'Update Price Forecast',
      message: `Pull latest oil price forecast from ${source?.name}? This will update all scenarios (optimistic, base, pessimistic) with the most recent market data.`,
      confirmLabel: 'Update Forecast',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsUpdatingForecast(true);
      setUpdateProgress(0);
      setShowUpdateModal(false);
      
      toast.loading('Fetching latest forecast...', { id: 'update-forecast' });
      
      // Simulate API call with progress
      const interval = setInterval(() => {
        setUpdateProgress(prev => {
          const next = prev + 10;
          
          if (next >= 100) {
            clearInterval(interval);
            
            // Generate updated forecast (simulate new data)
            const updatedData = priceData.map(point => {
              if (point.year >= 2026) {
                const variance = (Math.random() - 0.5) * 5;
                return {
                  ...point,
                  optimistic: Math.round(point.optimistic + variance + 3),
                  base: Math.round(point.base + variance),
                  pessimistic: Math.round(point.pessimistic + variance - 2)
                };
              }
              return point;
            });
            
            setPriceData(updatedData);
            
            // Update parameters
            const updatedParams = [...parameters];
            updatedParams[0] = {
              ...updatedParams[0],
              mostLikely: updatedData.find(d => d.year === 2026)?.base || 80,
              confidence: Math.min(updatedParams[0].confidence + 5, 95)
            };
            setParameters(updatedParams);
            
            // Add to history
            const now = new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            setLastForecastUpdate(now);
            
            const newVersion = {
              id: Date.now().toString(),
              version: `v${4 + forecastHistory.length / 10}`,
              date: now,
              source: source?.name || 'Unknown',
              basePrice: updatedData.find(d => d.year === 2026)?.base || 80
            };
            setForecastHistory(prev => [newVersion, ...prev]);
            
            setIsUpdatingForecast(false);
            setUpdateProgress(0);
            
            toast.success('Forecast Updated', {
              id: 'update-forecast',
              description: `Latest data from ${source?.name} applied successfully`
            });
            
            addNotification({
              type: 'success',
              priority: 'high',
              category: 'data',
              title: 'Market Forecast Updated',
              message: `Oil price forecast updated from ${source?.name}`,
              actionLabel: 'View Changes',
              actionUrl: '/uncertainty/market-volatility'
            });
            
            return 100;
          }
          
          const stage = next < 30 ? 'Connecting to source...' : next < 60 ? 'Downloading data...' : 'Processing forecast...';
          toast.loading(`${stage} ${next}%`, { id: 'update-forecast' });
          return next;
        });
      }, 150);
    }
  };

  // Import data
  const handleImportData = async () => {
    const confirmed = await confirmSuccess({
      title: 'Import Market Data',
      message: 'Import price scenarios from Excel file? This will replace current forecast data.',
      confirmLabel: 'Import',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsImporting(true);
      toast.loading('Importing data...', { id: 'import-data' });
      
      // Simulate file import
      setTimeout(() => {
        // Generate sample imported data
        const importedData = initialPriceData.map(point => ({
          ...point,
          optimistic: point.optimistic + Math.round((Math.random() - 0.5) * 10),
          base: point.base + Math.round((Math.random() - 0.5) * 8),
          pessimistic: point.pessimistic + Math.round((Math.random() - 0.5) * 6)
        }));
        
        setPriceData(importedData);
        setIsImporting(false);
        setShowImportModal(false);
        
        toast.success('Data Imported', {
          id: 'import-data',
          description: 'Market volatility data imported successfully'
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'data',
          title: 'Import Complete',
          message: 'Market volatility scenarios imported from Excel',
          actionLabel: 'View Data',
          actionUrl: '/uncertainty/market-volatility'
        });
      }, 2000);
    }
  };

  // Export data
  const handleExportData = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Market Data',
      message: 'Export current price scenarios and parameters as Excel file?',
      confirmLabel: 'Export',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Preparing export...', { id: 'export-data' });
      
      setTimeout(() => {
        toast.success('Export Complete', {
          id: 'export-data',
          description: 'Market volatility data exported successfully'
        });
        
        addNotification({
          type: 'success',
          priority: 'low',
          category: 'data',
          title: 'Export Complete',
          message: 'Market volatility scenarios exported as Excel',
          actionLabel: 'Download',
          actionUrl: '#'
        });
      }, 1000);
    }
  };

  // Revert to previous version
  const handleRevertToVersion = async (version: any) => {
    const confirmed = await confirmWarning({
      title: 'Revert Forecast',
      message: `Revert to ${version.version} (${version.date})? Current forecast will be replaced.`,
      confirmLabel: 'Revert',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Reverting forecast...', { id: 'revert' });
      
      setTimeout(() => {
        // Simulate reverting data
        const revertedData = initialPriceData.map(point => {
          const variance = (version.basePrice - 78) / 78;
          return {
            ...point,
            optimistic: Math.round(point.optimistic * (1 + variance)),
            base: Math.round(point.base * (1 + variance)),
            pessimistic: Math.round(point.pessimistic * (1 + variance))
          };
        });
        
        setPriceData(revertedData);
        setLastForecastUpdate(version.date);
        
        toast.success('Forecast Reverted', {
          id: 'revert',
          description: `Reverted to ${version.version}`
        });
      }, 1000);
    }
  };

  // Toggle scenario
  const handleToggleScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, enabled: !s.enabled } : s
    ));
    
    const scenario = scenarios.find(s => s.id === scenarioId);
    toast.info(`Scenario ${scenario?.enabled ? 'Disabled' : 'Enabled'}`, {
      description: scenario?.name
    });
  };

  // Update parameter
  const handleParameterChange = (index: number, field: keyof Parameter, value: any) => {
    setParameters(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  // Reset to defaults
  const handleResetToDefaults = async () => {
    const confirmed = await confirmWarning({
      title: 'Reset to Defaults',
      message: 'Reset all market volatility parameters to default values? All changes will be lost.',
      confirmLabel: 'Reset',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setPriceData(initialPriceData);
      setParameters(initialParameters);
      setScenarios(initialScenarios);
      
      toast.info('Settings Reset', {
        description: 'Market volatility parameters reset to defaults'
      });
    }
  };

  // Save configuration
  const handleSaveAndContinue = async () => {
    const confirmed = await confirmSuccess({
      title: 'Save Configuration',
      message: 'Save market volatility parameters? This will update the configuration for AI Led Simulation.',
      confirmLabel: 'Save & Continue',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Saving configuration...', { id: 'save-config' });
      
      setTimeout(() => {
        toast.success('Configuration Saved', {
          id: 'save-config',
          description: 'Market volatility parameters saved successfully'
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'simulation',
          title: 'Configuration Saved',
          message: 'Market volatility parameters ready for simulation',
          actionLabel: 'View',
          actionUrl: '/uncertainty/market-volatility'
        });
      }, 1000);
    }
  };

  const currentPrice = priceData.find(d => d.year === 2026)?.base || 80;
  const activeScenarios = scenarios.filter(s => s.enabled).length;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Market Volatility – Brent Crude Scenarios
            </h1>
            <p className="text-sm text-text-secondary">Configure oil price scenarios for AI Led Simulation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowUpdateModal(true)}
              disabled={isUpdatingForecast}
            >
              {isUpdatingForecast ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating... {updateProgress}%
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Forecast
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleResetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="primary" onClick={handleSaveAndContinue}>
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </div>

        {/* Update Progress Bar */}
        {isUpdatingForecast && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-medium text-text-primary">
                  Updating Forecast... {updateProgress}%
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Fetching latest market data...
              </span>
            </div>
            <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${updateProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">Current Base Price</span>
            </div>
            <div className="text-3xl font-bold text-primary">${currentPrice}</div>
            <div className="text-xs text-text-tertiary mt-1">per barrel (2026)</div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary">Last Update</span>
            </div>
            <div className="text-sm font-bold text-text-primary">{lastForecastUpdate}</div>
            <div className="text-xs text-text-tertiary mt-1">Version {forecastHistory[0]?.version}</div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <span className="text-sm text-text-secondary">Active Scenarios</span>
            </div>
            <div className="text-3xl font-bold text-warning">{activeScenarios}</div>
            <div className="text-xs text-text-tertiary mt-1">of {scenarios.length} enabled</div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-card-border shadow-glow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm text-text-secondary">Configuration</span>
            </div>
            <div className="text-sm font-bold text-success">Ready</div>
            <div className="text-xs text-text-tertiary mt-1">All parameters set</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-2 space-y-6">
            {/* Price Scenario Chart */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Price Scenario Configuration</h3>
              
              <div className="bg-background-secondary rounded-lg p-4 border border-card-border mb-6">
                <div className="h-64 w-full min-w-0">
                  <SafeChartContainer>
                    <AreaChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#7B8CA8"
                        tick={{ fill: '#7B8CA8', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#7B8CA8"
                        tick={{ fill: '#7B8CA8', fontSize: 12 }}
                        label={{ value: 'Brent Crude ($/bbl)', angle: -90, position: 'insideLeft', fill: '#7B8CA8' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(13, 25, 50, 0.9)', 
                          border: '1px solid rgba(0, 200, 200, 0.15)',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="optimistic" 
                        stroke="#15A955" 
                        fill="#15A955" 
                        fillOpacity={0.15}
                        name="Optimistic"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="base" 
                        stroke="#0047BA" 
                        fill="#0047BA" 
                        fillOpacity={0.15}
                        name="Base Case"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pessimistic" 
                        stroke="#FF5252" 
                        fill="#FF5252" 
                        fillOpacity={0.15}
                        name="Pessimistic"
                      />
                    </AreaChart>
                  </SafeChartContainer>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-success" />
                  <span className="text-text-secondary">Optimistic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-text-secondary">Base Case</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-danger" />
                  <span className="text-text-secondary">Pessimistic</span>
                </div>
                <div className="ml-auto">
                  <Badge variant="info" size="sm">
                    Current: ${currentPrice}/bbl
                  </Badge>
                </div>
              </div>

              {/* Parameter Input Table */}
              <div className="bg-background-secondary rounded-lg overflow-hidden border border-card-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5">
                      <TableHead className="text-text-secondary">Parameter</TableHead>
                      <TableHead className="text-text-secondary">Min</TableHead>
                      <TableHead className="text-text-secondary">Most Likely</TableHead>
                      <TableHead className="text-text-secondary">Max</TableHead>
                      <TableHead className="text-text-secondary">Distribution</TableHead>
                      <TableHead className="text-text-secondary">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((param, idx) => (
                      <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-text-primary">{param.name}</TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={param.min} 
                            onChange={(e) => handleParameterChange(idx, 'min', parseFloat(e.target.value))}
                            className="w-20 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={param.mostLikely}
                            onChange={(e) => handleParameterChange(idx, 'mostLikely', parseFloat(e.target.value))}
                            className="w-20 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={param.max}
                            onChange={(e) => handleParameterChange(idx, 'max', parseFloat(e.target.value))}
                            className="w-20 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={param.distribution.toLowerCase()}
                            onValueChange={(value) => handleParameterChange(idx, 'distribution', value.charAt(0).toUpperCase() + value.slice(1))}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="triangular">Triangular</SelectItem>
                              <SelectItem value="log-normal">Log-normal</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" size="sm">
                            {param.confidence}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Forecast History */}
            <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-primary font-semibold">Forecast Version History</h3>
                <Badge variant="info" size="sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {forecastHistory.length} versions
                </Badge>
              </div>

              <div className="space-y-3">
                {forecastHistory.map((version, index) => (
                  <div 
                    key={version.id}
                    className={`p-4 rounded-lg border ${
                      index === 0 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-background-secondary border-card-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary font-medium">{version.version}</span>
                          {index === 0 && (
                            <Badge variant="primary" size="sm">Current</Badge>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {version.date} • {version.source} • Base: ${version.basePrice}/bbl
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRevertToVersion(version)}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Revert
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Geopolitical Scenarios */}
            <div className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Geopolitical Scenario Toggles</h3>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-start gap-3 p-3 bg-background-secondary rounded border border-card-border">
                    <Switch 
                      checked={scenario.enabled}
                      onCheckedChange={() => handleToggleScenario(scenario.id)}
                    />
                    <div className="flex-1">
                      <div className="text-text-primary font-medium text-sm mb-1">{scenario.name}</div>
                      <div className="text-xs text-text-secondary">{scenario.impact}</div>
                      {scenario.enabled && (
                        <Badge variant="warning" size="sm" className="mt-2">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
              <h3 className="text-text-primary font-semibold mb-4">Available Data Sources</h3>
              <div className="space-y-3">
                {forecastSources.map((source) => (
                  <div 
                    key={source.id}
                    className="p-3 bg-background-secondary rounded border border-card-border hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-text-primary text-sm font-medium">{source.name}</span>
                      {selectedSource === source.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Last updated: {source.lastUpdate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-card rounded-lg p-5 border border-card-border shadow-glow">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <h3 className="text-text-primary font-semibold">AI Insights</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-success/10 rounded border border-success/30">
                  <div className="text-sm font-medium text-success mb-2">Market Trend</div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Current forecasts indicate stable oil prices through 2027 with moderate growth. OPEC production cut scenario adds +$10/bbl upside.
                  </p>
                </div>

                <div className="p-3 bg-primary/10 rounded border border-primary/30">
                  <div className="text-sm font-medium text-primary mb-2">Recommendation</div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Consider updating forecast monthly to capture latest market dynamics. Current base case aligns well with IEA and OPEC projections.
                  </p>
                </div>

                <div className="p-3 bg-accent/10 rounded border border-accent/30">
                  <div className="text-sm font-medium text-accent mb-2">💡 Next Steps</div>
                  <ul className="text-xs text-text-secondary space-y-1">
                    <li>• Save current configuration</li>
                    <li>• Review geopolitical scenarios</li>
                    <li>• Proceed to cross-domain analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Forecast Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowUpdateModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Update Forecast</h3>
                <button onClick={() => setShowUpdateModal(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Select Data Source</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {forecastSources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-text-tertiary mt-1">
                    Last update: {forecastSources.find(s => s.id === selectedSource)?.lastUpdate}
                  </p>
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-sm text-text-secondary mb-2">Current forecast:</div>
                  <div className="text-lg font-bold text-text-primary mb-1">
                    {forecastHistory[0]?.version} • ${forecastHistory[0]?.basePrice}/bbl
                  </div>
                  <div className="text-xs text-text-tertiary">
                    Last updated: {lastForecastUpdate}
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-text-secondary">
                  <strong className="text-primary">Note:</strong> This will fetch the latest oil price forecast and update all scenarios (optimistic, base, pessimistic). Previous version will be saved in history.
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateForecast}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Forecast
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isImporting && setShowImportModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Import Market Data</h3>
                {!isImporting && (
                  <button onClick={() => setShowImportModal(false)} className="text-text-secondary hover:text-text-primary">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-card-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-primary font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-text-secondary">Excel file (.xlsx, .xls) up to 10MB</p>
                </div>

                <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                  <div className="text-sm text-text-secondary mb-2">Expected format:</div>
                  <ul className="text-xs text-text-tertiary space-y-1">
                    <li>• Column A: Year</li>
                    <li>• Column B: Optimistic Price</li>
                    <li>• Column C: Base Price</li>
                    <li>• Column D: Pessimistic Price</li>
                  </ul>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs text-text-secondary">
                  <strong className="text-primary">Note:</strong> Importing will replace current forecast data. Previous version will be saved in history.
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowImportModal(false)} disabled={isImporting}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleImportData} disabled={isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
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
