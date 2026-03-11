import { useState, useMemo } from 'react';
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
import { useAsset } from '../context/AssetContext';
import {
  generateAnnualForecast,
  hyperbolicDecline,
  runMonteCarloNPV,
  buildHistogramBins,
  getPercentile,
  calculateOATSensitivity,
  calculateNPVSimplified,
  calculateR2,
  calculateMAPE,
  generateMatchChartData,
} from '../utils/calculations';

export function DeepDiveAnalytics() {
  const [selectedTab, setSelectedTab] = useState<'production' | 'sensitivity' | 'uncertainty' | 'correlation' | 'history'>('production');
  const { selectedAsset } = useAsset();

  // ── Production Forecast P10/P50/P90 using Arps decline ───────────────
  const productionForecastData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const baseRate = selectedAsset.production.oil;
    const Di = selectedAsset.declineRate;
    const b = selectedAsset.declineExponent;
    const years = selectedAsset.fieldLifeYears;

    return Array.from({ length: Math.min(years, 12) }, (_, i) => {
      const year = currentYear + i;
      const ageFromNow = i;
      const p50Rate = hyperbolicDecline(baseRate, Di, b, ageFromNow) / 1000; // kbpd
      const p10Rate = hyperbolicDecline(baseRate * 1.15, Di * 0.85, b, ageFromNow) / 1000;
      const p90Rate = hyperbolicDecline(baseRate * 0.85, Di * 1.15, b, ageFromNow) / 1000;
      // Actual = slightly below simulated with seasonal noise (deterministic)
      const noise = 1 + 0.015 * Math.sin((2 * Math.PI * i) / 4);
      return {
        year,
        p10: parseFloat(p10Rate.toFixed(1)),
        p50: parseFloat(p50Rate.toFixed(1)),
        p90: parseFloat(p90Rate.toFixed(1)),
        ...(i < 4 ? { actual: parseFloat((p50Rate * noise * 0.98).toFixed(1)) } : {})
      };
    });
  }, [selectedAsset]);

  // ── OAT Sensitivity for Tornado Chart ────────────────────────────────
  const tornadoData = useMemo(() => {
    const baseNPV = calculateNPVSimplified(
      selectedAsset.production.oil, 80, selectedAsset.opexPerBbl,
      selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55
    ) * 1000;
    const oat = calculateOATSensitivity(baseNPV, {
      'Oil Price':          { lowNPV: calculateNPVSimplified(selectedAsset.production.oil, 64, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil, 96, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'Permeability':       { lowNPV: calculateNPVSimplified(selectedAsset.production.oil * 0.85, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil * 1.15, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'Recovery Factor':    { lowNPV: calculateNPVSimplified(selectedAsset.production.oil * 0.88, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil * 1.12, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'Water Cut':          { lowNPV: calculateNPVSimplified(selectedAsset.production.oil * 1.05, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil * 0.95, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'CAPEX':              { lowNPV: calculateNPVSimplified(selectedAsset.production.oil, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM * 0.80, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM * 1.20, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'Reservoir Pressure': { lowNPV: calculateNPVSimplified(selectedAsset.production.oil * 0.92, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil * 1.08, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'Well Count':         { lowNPV: calculateNPVSimplified(selectedAsset.production.oil * 0.90, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil * 1.10, 80, selectedAsset.opexPerBbl, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
      'OPEX':               { lowNPV: calculateNPVSimplified(selectedAsset.production.oil, 80, selectedAsset.opexPerBbl * 0.80, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000, highNPV: calculateNPVSimplified(selectedAsset.production.oil, 80, selectedAsset.opexPerBbl * 1.20, selectedAsset.remainingCapexMM, 0.10, selectedAsset.fieldLifeYears, 0.05, 0.55) * 1000 },
    });
    return oat.slice(0, 8).map(r => ({
      parameter: r.parameter,
      negative: parseFloat(r.negative.toFixed(1)),
      positive: parseFloat(r.positive.toFixed(1)),
      baseValue: 0,
    }));
  }, [selectedAsset]);

  // ── Monte Carlo NPV Distribution (n=5000 for performance) ────────────
  const { mcDistribution, mcP10, mcP50, mcP90 } = useMemo(() => {
    const sortedNPVs = runMonteCarloNPV({
      ooip:           { min: selectedAsset.ooip * 0.75, mode: selectedAsset.ooip, max: selectedAsset.ooip * 1.25 },
      recoveryFactor: { min: 0.30, mode: (selectedAsset.cumulativeOil / selectedAsset.ooip) + 0.10, max: 0.65 },
      oilPrice:       { mean: 80, cv: 0.20 },
      opexPerBbl:     { mean: selectedAsset.opexPerBbl, cv: 0.15 },
      capexMM:        { mean: selectedAsset.remainingCapexMM, cv: 0.20 },
      discountRate:   0.10,
      fieldLifeYears: selectedAsset.fieldLifeYears,
      royaltyRate:    0.05,
      taxRate:        0.55,
    }, 5000);
    return {
      mcDistribution: buildHistogramBins(sortedNPVs, 50),
      mcP10: Math.round(getPercentile(sortedNPVs, 90)),
      mcP50: Math.round(getPercentile(sortedNPVs, 50)),
      mcP90: Math.round(getPercentile(sortedNPVs, 10)),
    };
  }, [selectedAsset]);

  // ── Correlation scatter (deterministic seed via asset ID hash) ────────
  const generateCorrelationData = () => {
    const data = [];
    // Use simple deterministic sequence derived from asset parameters
    const seed = selectedAsset.ooip * 0.001 + selectedAsset.production.oil * 0.0001;
    for (let i = 0; i < 200; i++) {
      const t = (seed + i * 0.618) % 1; // golden ratio sequence
      const permeability = 50 + t * 150;
      const recoveryFactor = 0.25 + ((i * 0.137) % 1) * 0.25;
      const npv = mcP50 + permeability * 0.8 + recoveryFactor * 500 + Math.sin(i * 0.3) * 80;
      data.push({ param1: parseFloat(permeability.toFixed(1)), param2: parseFloat(recoveryFactor.toFixed(3)), npv: Math.round(npv) });
    }
    return data;
  };

  // ── History Match time series (last 12 months of actuals vs sim) ──────
  const timeSeriesData = useMemo(() => {
    const chartData = generateMatchChartData(
      selectedAsset.production.oil,
      selectedAsset.declineRate,
      selectedAsset.declineExponent,
      selectedAsset.firstOilYear,
      new Date().getFullYear() - 1, 0, new Date().getFullYear(),
      1, selectedAsset.historyMatchR2
    );
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    return chartData.filter(p => p.observed !== null).slice(-12).map((p, i) => {
      const m = (now.getMonth() - 12 + i + 12) % 12;
      const y = new Date().getFullYear() - 1 + Math.floor((now.getMonth() - 12 + i + 12) / 12);
      return { date: `${monthNames[m]} ${y}`, actual: Math.round(p.observed! / 1000), simulated: Math.round(p.simulated / 1000) };
    });
  }, [selectedAsset]);

  // ── Compute R² and MAPE from history series ───────────────────────────
  const hmR2 = calculateR2(timeSeriesData.map(d => d.actual), timeSeriesData.map(d => d.simulated));
  const hmMape = calculateMAPE(timeSeriesData.map(d => d.actual), timeSeriesData.map(d => d.simulated));

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
            <div className="text-2xl font-bold text-success">{selectedAsset.historyMatchR2.toFixed(2)}</div>
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
                  title={`${selectedAsset.name} – Oil Production Forecast with Uncertainty Bands`}
                  unit="kBOPD"
                />
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-primary">Insight:</span> P50 forecast shows decline from{' '}
                    {productionForecastData[0]?.p50.toFixed(0)} to {productionForecastData[productionForecastData.length - 1]?.p50.toFixed(0)} kBOPD
                    over {productionForecastData.length} years (Arps b={selectedAsset.declineExponent}, Di={(selectedAsset.declineRate * 100).toFixed(1)}%/yr).
                    The P10–P90 range widens post-{productionForecastData[3]?.year} due to increased geological uncertainty in deeper reservoir sections.
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
                    <div className="text-lg font-semibold text-text-primary">{tornadoData[0]?.parameter ?? '—'}</div>
                    <div className="text-xs text-text-secondary mt-1">±{tornadoData[0] ? Math.abs(tornadoData[0].positive - tornadoData[0].negative).toFixed(0) : '—'}% impact on NPV</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">2nd Largest Driver</div>
                    <div className="text-lg font-semibold text-text-primary">{tornadoData[1]?.parameter ?? '—'}</div>
                    <div className="text-xs text-text-secondary mt-1">±{tornadoData[1] ? Math.abs(tornadoData[1].positive - tornadoData[1].negative).toFixed(0) : '—'}% NPV variance</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">Least Sensitive</div>
                    <div className="text-lg font-semibold text-text-primary">{tornadoData[tornadoData.length - 1]?.parameter ?? '—'}</div>
                    <div className="text-xs text-text-secondary mt-1">±{tornadoData[tornadoData.length - 1] ? Math.abs(tornadoData[tornadoData.length - 1].positive - tornadoData[tornadoData.length - 1].negative).toFixed(0) : '—'}% impact range</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'uncertainty' && (
              <div className="space-y-6">
                <MonteCarloDistribution
                  data={mcDistribution}
                  p10={mcP10}
                  p50={mcP50}
                  p90={mcP90}
                  title={`NPV Distribution — Monte Carlo (n=5,000) — ${selectedAsset.name}`}
                  metric="NPV ($MM)"
                />
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-accent">Monte Carlo Results:</span> Based on 5,000 scenarios, the expected NPV (P50) is ${mcP50.toLocaleString()}M{' '}
                    with a 10% probability of exceeding ${mcP10.toLocaleString()}M and a 90% confidence of achieving at least ${mcP90.toLocaleString()}M.
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
                  title={`History Match Quality: Actual vs AI Simulation — ${selectedAsset.name}`}
                  metric="Oil Production (kBOPD)"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">R² Score</div>
                    <div className="text-2xl font-semibold text-success">{hmR2.toFixed(2)}</div>
                    <div className="text-xs text-text-secondary mt-1">Excellent match quality</div>
                  </div>
                  <div className="bg-card rounded-lg border border-card-border p-4">
                    <div className="text-xs text-text-tertiary mb-2">MAPE</div>
                    <div className="text-2xl font-semibold text-primary">{hmMape.toFixed(1)}%</div>
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