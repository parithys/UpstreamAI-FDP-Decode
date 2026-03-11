import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  ProductionForecastChart,
  TornadoChart,
  MonteCarloDistribution,
  CorrelationScatter,
  TimeSeriesComparison
} from '../components/visualizations/Layer3Visualizations';
import {
  TrendingUp,
  BarChart3,
  Layers,
  Activity,
  Download,
  FileText,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for Production Forecast
const productionForecastData = [
  { year: 2024, p10: 145, p50: 120, p90: 95, actual: 118 },
  { year: 2025, p10: 152, p50: 128, p90: 102, actual: 125 },
  { year: 2026, p10: 158, p50: 135, p90: 110, actual: 132 },
  { year: 2027, p10: 162, p50: 140, p90: 115, actual: 138 },
  { year: 2028, p10: 168, p50: 145, p90: 120 },
  { year: 2029, p10: 172, p50: 148, p90: 124 },
  { year: 2030, p10: 175, p50: 150, p90: 127 },
  { year: 2031, p10: 178, p50: 152, p90: 129 },
  { year: 2032, p10: 180, p50: 154, p90: 131 },
  { year: 2033, p10: 182, p50: 155, p90: 132 },
  { year: 2034, p10: 183, p50: 156, p90: 133 },
  { year: 2035, p10: 184, p50: 157, p90: 134 }
];

// Mock data for Tornado Chart
const tornadoData = [
  { parameter: 'Oil Price', negative: -18.5, positive: 22.3, baseValue: 0 },
  { parameter: 'Permeability', negative: -15.2, positive: 18.8, baseValue: 0 },
  { parameter: 'Recovery Factor', negative: -12.8, positive: 16.4, baseValue: 0 },
  { parameter: 'Water Cut', negative: -10.5, positive: 9.2, baseValue: 0 },
  { parameter: 'CAPEX', negative: -9.8, positive: 8.6, baseValue: 0 },
  { parameter: 'Reservoir Pressure', negative: -8.3, positive: 10.1, baseValue: 0 },
  { parameter: 'Well Count', negative: -7.5, positive: 12.5, baseValue: 0 },
  { parameter: 'OPEX', negative: -5.2, positive: 4.8, baseValue: 0 }
];

// Mock data for Monte Carlo Distribution
const generateDistributionData = () => {
  const data = [];
  for (let i = 800; i <= 3200; i += 40) {
    const x = (i - 2000) / 400;
    const frequency = Math.exp(-0.5 * x * x) * (1 + 0.3 * Math.sin(x * 2));
    data.push({ value: i, frequency: frequency * 100 });
  }
  return data;
};

// Mock data for Correlation Scatter
const generateCorrelationData = () => {
  const data = [];
  for (let i = 0; i < 200; i++) {
    const permeability = 50 + Math.random() * 150;
    const recoveryFactor = 0.25 + Math.random() * 0.25;
    const npv = 1200 + permeability * 8 + recoveryFactor * 2000 + (Math.random() - 0.5) * 400;
    data.push({
      param1: permeability,
      param2: recoveryFactor,
      npv: npv
    });
  }
  return data;
};

// Mock data for Time Series
const timeSeriesData = [
  { date: 'Jan 2023', actual: 98, simulated: 95 },
  { date: 'Feb 2023', actual: 102, simulated: 100 },
  { date: 'Mar 2023', actual: 105, simulated: 106 },
  { date: 'Apr 2023', actual: 108, simulated: 109 },
  { date: 'May 2023', actual: 112, simulated: 110 },
  { date: 'Jun 2023', actual: 115, simulated: 114 },
  { date: 'Jul 2023', actual: 118, simulated: 117 },
  { date: 'Aug 2023', actual: 120, simulated: 121 },
  { date: 'Sep 2023', actual: 122, simulated: 123 },
  { date: 'Oct 2023', actual: 125, simulated: 124 },
  { date: 'Nov 2023', actual: 127, simulated: 126 },
  { date: 'Dec 2023', actual: 130, simulated: 129 }
];

export function DeepDiveAnalytics() {
  const [selectedTab, setSelectedTab] = useState<'production' | 'sensitivity' | 'uncertainty' | 'correlation' | 'history'>('production');

  const handleShareDashboard = () => {
    toast.info('Share Dashboard', {
      description: 'Dashboard link copied to clipboard'
    });
  };

  const handleExportAll = () => {
    toast.success('Exporting all visualizations...', {
      description: 'Complete analytics package will download as ZIP file with all charts and data'
    });
  };

  const handleGenerateReport = () => {
    toast.success('Generating analytical report...', {
      description: 'Comprehensive deep dive analytics report will download as PDF'
    });
  };

  const tabs = [
    { id: 'production' as const, label: 'Production Forecast', icon: TrendingUp },
    { id: 'sensitivity' as const, label: 'Sensitivity Analysis', icon: BarChart3 },
    { id: 'uncertainty' as const, label: 'Uncertainty Quantification', icon: Layers },
    { id: 'correlation' as const, label: 'Parameter Correlation', icon: Activity },
    { id: 'history' as const, label: 'History Matching', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                Layer 3: Deep Dive Analytics
              </h1>
              <Badge className="bg-accent text-white border-0">
                Interactive Visualizations
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">
              Advanced data visualization and scenario exploration for Field Alpha
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleShareDashboard}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Dashboard
            </Button>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="primary" onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Analysis Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Scenarios Analyzed</div>
            <div className="text-2xl font-bold text-primary">12.4M</div>
            <div className="text-xs text-success mt-1">↑ AI Led Simulation</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Parameters Varied</div>
            <div className="text-2xl font-bold text-text-primary">24</div>
            <div className="text-xs text-text-secondary mt-1">Subsurface + Operational</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Computation Time</div>
            <div className="text-2xl font-bold text-accent">4.2 days</div>
            <div className="text-xs text-success mt-1">85% faster than traditional</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Match Quality (R²)</div>
            <div className="text-2xl font-bold text-success">0.94</div>
            <div className="text-xs text-text-secondary mt-1">History match score</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-lg border border-card-border mb-6">
          <div className="flex items-center border-b border-card-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-card-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="p-6">
            {selectedTab === 'production' && (
              <div className="space-y-6">
                <ProductionForecastChart
                  data={productionForecastData}
                  title="Oil Production Forecast with Uncertainty Bands"
                  unit="MBOPD"
                />
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-primary">Insight:</span> P50 forecast shows steady production increase from 120 to 157 MBOPD over 12 years. 
                    The P10-P90 range widens post-2028 due to increased geological uncertainty in deeper reservoir sections.
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'sensitivity' && (
              <div className="space-y-6">
                <TornadoChart
                  data={tornadoData}
                  title="Tornado Chart: One-at-a-Time Sensitivity Analysis"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Most Sensitive Parameter</div>
                    <div className="text-lg font-semibold text-text-primary">Oil Price</div>
                    <div className="text-xs text-text-secondary mt-1">±20% impact on NPV</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Top Subsurface Factor</div>
                    <div className="text-lg font-semibold text-text-primary">Permeability</div>
                    <div className="text-xs text-text-secondary mt-1">±17% NPV variance</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Least Sensitive</div>
                    <div className="text-lg font-semibold text-text-primary">OPEX</div>
                    <div className="text-xs text-text-secondary mt-1">±5% impact range</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'uncertainty' && (
              <div className="space-y-6">
                <MonteCarloDistribution
                  data={generateDistributionData()}
                  p10={2450}
                  p50={1850}
                  p90={1320}
                  title="NPV Distribution from Monte Carlo Simulation"
                  metric="NPV ($MM)"
                />
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-accent">Monte Carlo Results:</span> Based on 12.4M scenarios, the expected NPV (P50) is $1,850M 
                    with a 10% probability of exceeding $2,450M and a 90% confidence of achieving at least $1,320M.
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'correlation' && (
              <div className="space-y-6">
                <CorrelationScatter
                  data={generateCorrelationData()}
                  param1Name="Permeability (mD)"
                  param2Name="Recovery Factor"
                  title="Cross-Parameter Correlation: Permeability vs Recovery Factor"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Correlation Coefficient</div>
                    <div className="text-2xl font-semibold text-primary">0.72</div>
                    <div className="text-xs text-text-secondary mt-1">Strong positive correlation</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Optimal Range Identified</div>
                    <div className="text-lg font-semibold text-success">High NPV Zone</div>
                    <div className="text-xs text-text-secondary mt-1">Permeability &gt;120mD, RF &gt;0.35</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'history' && (
              <div className="space-y-6">
                <TimeSeriesComparison
                  data={timeSeriesData}
                  title="History Match Quality: Actual vs AI Led Simulation"
                  metric="Oil Production (MBOPD)"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">R² Score</div>
                    <div className="text-2xl font-semibold text-success">0.94</div>
                    <div className="text-xs text-text-secondary mt-1">Excellent match quality</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Average Error</div>
                    <div className="text-2xl font-semibold text-primary">2.3%</div>
                    <div className="text-xs text-text-secondary mt-1">Within acceptable range</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Calibration Time</div>
                    <div className="text-2xl font-semibold text-accent">18 hrs</div>
                    <div className="text-xs text-success mt-1">↓ 92% vs traditional</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Ready to proceed with analysis?</h3>
              <p className="text-sm text-text-secondary">
                Export these visualizations or proceed to Decision Support module for scenario comparison
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Package
              </Button>
              <Link to="/insights">
                <Button variant="primary">
                  Proceed to Decision Support →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}