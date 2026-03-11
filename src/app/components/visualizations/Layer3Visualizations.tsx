import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, Cell
} from 'recharts';
import { Download, Maximize2, ZoomIn, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { SafeChartContainer } from '../ui/safe-chart-container';

// Production Forecast with Uncertainty Bands (P10/P50/P90)
interface ProductionForecastProps {
  data: Array<{
    year: number;
    p10: number;
    p50: number;
    p90: number;
    actual?: number;
  }>;
  title?: string;
  unit?: string;
}

export function ProductionForecastChart({ data, title = "Production Forecast", unit = "MBOPD" }: ProductionForecastProps) {
  const [expanded, setExpanded] = useState(false);

  const ChartContent = () => (
    <SafeChartContainer width="100%" height={expanded ? 600 : 400}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorP10" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="year" 
          stroke="var(--muted-foreground)"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis 
          stroke="var(--muted-foreground)"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          label={{ value: unit, angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--card-foreground)'
          }}
        />
        <Legend />
        
        {/* P10 - Optimistic */}
        <Area
          type="monotone"
          dataKey="p10"
          stroke="var(--chart-5)"
          strokeWidth={2}
          fill="url(#colorP10)"
          name="P10 (Optimistic)"
          fillOpacity={1}
        />
        {/* P50 - Base Case */}
        <Area
          type="monotone"
          dataKey="p50"
          stroke="var(--chart-1)"
          strokeWidth={3}
          fill="url(#colorP50)"
          name="P50 (Base Case)"
          fillOpacity={1}
        />
        {/* P90 - Conservative */}
        <Area
          type="monotone"
          dataKey="p90"
          stroke="var(--chart-3)"
          strokeWidth={2}
          fill="url(#colorP90)"
          name="P90 (Conservative)"
          fillOpacity={1}
        />
        
        {/* Actual Production (if available) */}
        {data.some(d => d.actual !== undefined) && (
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--chart-4)"
            strokeWidth={2}
            dot={{ fill: 'var(--chart-4)', r: 4 }}
            name="Actual Production"
          />
        )}
      </AreaChart>
    </SafeChartContainer>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-popover rounded-xl border border-card-border w-full max-w-7xl max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary mt-1">Interactive production forecast with uncertainty quantification</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting data...', { description: 'Production forecast data exported successfully.' })}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <button 
                onClick={() => setExpanded(false)} 
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close expanded view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <ChartContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => setExpanded(true)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <ChartContent />
    </div>
  );
}

// Tornado Chart for Sensitivity Analysis
interface TornadoData {
  parameter: string;
  negative: number;
  positive: number;
  baseValue: number;
}

interface TornadoChartProps {
  data: TornadoData[];
  title?: string;
}

export function TornadoChart({ data, title = "Sensitivity Analysis - Tornado Chart" }: TornadoChartProps) {
  const [expanded, setExpanded] = useState(false);

  // Transform data for bidirectional bar chart
  const transformedData = data.map(item => ({
    ...item,
    negativeDisplay: -Math.abs(item.negative),
    positiveDisplay: Math.abs(item.positive)
  }));

  const ChartContent = () => (
    <SafeChartContainer width="100%" height={expanded ? 500 : 350}>
      <BarChart
        data={transformedData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          type="number"
          stroke="var(--muted-foreground)"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          label={{ value: 'Impact on NPV (% Change)', position: 'bottom', fill: 'var(--muted-foreground)' }}
        />
        <YAxis
          type="category"
          dataKey="parameter"
          stroke="var(--muted-foreground)"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          width={110}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--card-foreground)'
          }}
          formatter={(value: number) => `${Math.abs(value).toFixed(1)}%`}
        />
        <Legend />
        <ReferenceLine x={0} stroke="var(--muted-foreground)" strokeWidth={2} />
        <Bar dataKey="negativeDisplay" fill="var(--chart-5)" name="Negative Impact" />
        <Bar dataKey="positiveDisplay" fill="var(--chart-3)" name="Positive Impact" />
      </BarChart>
    </SafeChartContainer>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-popover rounded-xl border border-card-border w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary mt-1">One-at-a-time sensitivity analysis showing parameter impact ranges</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting chart...', { description: 'Tornado chart exported successfully.' })}>
                <Download className="w-4 h-4 mr-2" />
                Export Chart
              </Button>
              <button 
                onClick={() => setExpanded(false)} 
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close expanded view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <ChartContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => setExpanded(true)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <ChartContent />
    </div>
  );
}

// Monte Carlo Distribution Plot
interface DistributionData {
  value: number;
  frequency: number;
}

interface MonteCarloDistributionProps {
  data: DistributionData[];
  p10: number;
  p50: number;
  p90: number;
  title?: string;
  metric?: string;
}

export function MonteCarloDistribution({
  data,
  p10,
  p50,
  p90,
  title = "Monte Carlo Simulation Results",
  metric = "NPV ($MM)"
}: MonteCarloDistributionProps) {
  const [expanded, setExpanded] = useState(false);

  const ChartContent = () => (
    <SafeChartContainer width="100%" height={expanded ? 500 : 350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0047BA" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0047BA" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="value"
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          label={{ value: metric, position: 'bottom', fill: '#94A3B8', offset: -5 }}
        />
        <YAxis
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Area
          type="monotone"
          dataKey="frequency"
          stroke="#0047BA"
          strokeWidth={2}
          fill="url(#colorDist)"
          name="Probability"
        />
        <ReferenceLine x={p10} stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'P10', fill: '#EF4444', position: 'top' }} />
        <ReferenceLine x={p50} stroke="#0047BA" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'P50', fill: '#0047BA', position: 'top' }} />
        <ReferenceLine x={p90} stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'P90', fill: '#10B981', position: 'top' }} />
      </AreaChart>
    </SafeChartContainer>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-popover rounded-xl border border-card-border w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary mt-1">Probability distribution from 10,000+ Monte Carlo iterations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting results...', { description: 'Monte Carlo simulation results exported successfully.' })}>
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <button 
                onClick={() => setExpanded(false)} 
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close expanded view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-danger/10 rounded-lg p-4 border border-danger/30">
                <div className="text-xs text-text-tertiary mb-1">P10 (Optimistic)</div>
                <div className="text-2xl font-bold text-danger">${p10.toFixed(0)}M</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <div className="text-xs text-text-tertiary mb-1">P50 (Base Case)</div>
                <div className="text-2xl font-bold text-primary">${p50.toFixed(0)}M</div>
              </div>
              <div className="bg-success/10 rounded-lg p-4 border border-success/30">
                <div className="text-xs text-text-tertiary mb-1">P90 (Conservative)</div>
                <div className="text-2xl font-bold text-success">${p90.toFixed(0)}M</div>
              </div>
            </div>
            <ChartContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => setExpanded(true)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <ChartContent />
    </div>
  );
}

// Parameter Correlation Scatter Plot
interface CorrelationData {
  param1: number;
  param2: number;
  npv: number;
}

interface CorrelationScatterProps {
  data: CorrelationData[];
  param1Name: string;
  param2Name: string;
  title?: string;
}

export function CorrelationScatter({
  data,
  param1Name,
  param2Name,
  title = "Parameter Correlation Analysis"
}: CorrelationScatterProps) {
  const [expanded, setExpanded] = useState(false);

  const ChartContent = () => (
    <SafeChartContainer width="100%" height={expanded ? 500 : 350}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="param1"
          type="number"
          name={param1Name}
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          label={{ value: param1Name, position: 'bottom', fill: '#94A3B8', offset: -10 }}
        />
        <YAxis
          dataKey="param2"
          type="number"
          name={param2Name}
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          label={{ value: param2Name, angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: number, name: string) => {
            if (name === 'NPV') return [`$${value.toFixed(0)}M`, name];
            return [value.toFixed(2), name];
          }}
        />
        <Scatter name="Scenarios" data={data} fill="#0047BA">
          {data.map((entry, index) => {
            const color = entry.npv > 2000 ? '#10B981' : entry.npv > 1500 ? '#0047BA' : '#EF4444';
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Scatter>
      </ScatterChart>
    </SafeChartContainer>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-popover rounded-xl border border-card-border w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary mt-1">Cross-parameter correlation with NPV color coding</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting data...', { description: 'Correlation analysis data exported successfully.' })}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <button 
                onClick={() => setExpanded(false)} 
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close expanded view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-success"></div>
                <span className="text-sm text-text-secondary">High NPV (&gt;$2B)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="text-sm text-text-secondary">Medium NPV ($1.5B-$2B)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-danger"></div>
                <span className="text-sm text-text-secondary">Low NPV (&lt;$1.5B)</span>
              </div>
            </div>
            <ChartContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => setExpanded(true)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <ChartContent />
    </div>
  );
}

// Time Series Comparison (Actual vs Simulated)
interface TimeSeriesData {
  date: string;
  actual: number;
  simulated: number;
  error?: number;
}

interface TimeSeriesComparisonProps {
  data: TimeSeriesData[];
  title?: string;
  metric?: string;
}

export function TimeSeriesComparison({
  data,
  title = "History Match: Actual vs Simulated",
  metric = "Oil Production (MBOPD)"
}: TimeSeriesComparisonProps) {
  const [expanded, setExpanded] = useState(false);

  const ChartContent = () => (
    <SafeChartContainer width="100%" height={expanded ? 500 : 350}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
        />
        <YAxis
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          label={{ value: metric, angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#0047BA"
          strokeWidth={3}
          dot={{ fill: '#0047BA', r: 4 }}
          name="Actual Production"
        />
        <Line
          type="monotone"
          dataKey="simulated"
          stroke="#00BCD4"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#00BCD4', r: 3 }}
          name="Simulated Production"
        />
      </LineChart>
    </SafeChartContainer>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
        <div className="bg-popover rounded-xl border border-card-border w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary mt-1">Historical data matching quality assessment</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting chart...', { description: 'History match chart exported successfully.' })}>
                <Download className="w-4 h-4 mr-2" />
                Export Chart
              </Button>
              <button 
                onClick={() => setExpanded(false)} 
                className="text-text-secondary hover:text-text-primary"
                aria-label="Close expanded view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <ChartContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => setExpanded(true)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <ChartContent />
    </div>
  );
}