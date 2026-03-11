import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { Badge } from './ui/badge';
import { SafeChartContainer } from './ui/safe-chart-container';

interface ParetoScenario {
  id: string;
  name: string;
  npv: number;
  waterCut: number;
  recovery: number;
  risk: 'Low' | 'Medium' | 'High';
  isRecommended?: boolean;
}

interface ParetoFrontChartProps {
  scenarios: ParetoScenario[];
  onScenarioSelect?: (scenario: ParetoScenario) => void;
}

export function ParetoFrontChart({ scenarios, onScenarioSelect }: ParetoFrontChartProps) {
  const getColorByRisk = (risk: string) => {
    switch (risk) {
      case 'Low': return '#22C55E'; // success
      case 'Medium': return '#F59E0B'; // warning
      case 'High': return '#EF4444'; // danger
      default: return '#0047BA'; // primary
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-card-border rounded-lg p-4 shadow-2xl">
          <div className="font-semibold text-text-primary mb-2">{data.name}</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">NPV:</span>
              <span className="text-text-primary font-medium">${(data.npv / 1000).toFixed(1)}B</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Water Cut:</span>
              <span className="text-text-primary font-medium">{data.waterCut}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Recovery:</span>
              <span className="text-text-primary font-medium">{data.recovery}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Risk:</span>
              <Badge 
                className={`${
                  data.risk === 'Low' ? 'bg-success/10 text-success border-success/30' :
                  data.risk === 'Medium' ? 'bg-warning/10 text-warning border-warning/30' :
                  'bg-danger/10 text-danger border-danger/30'
                }`}
                size="sm"
              >
                {data.risk}
              </Badge>
            </div>
            {data.isRecommended && (
              <div className="pt-2 mt-2 border-t border-card-border">
                <Badge variant="info" size="sm">
                  ✨ AI Recommended
                </Badge>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-text-primary font-semibold mb-1">Optimization Trade-offs (NPV vs Water Cut)</h3>
          <p className="text-sm text-text-secondary">NPV vs Water Cut across {scenarios.length} AI-generated scenarios</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs text-text-secondary">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger" />
            <span className="text-xs text-text-secondary">High Risk</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] bg-background-secondary rounded-lg p-4 border border-card-border">
        <SafeChartContainer width="100%" height="100%" minHeight={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="npv"
              name="NPV"
              stroke="#7B8CA8"
              tick={{ fill: '#7B8CA8', fontSize: 12 }}
              label={{ 
                value: 'Net Present Value ($ Billions)', 
                position: 'bottom', 
                offset: 20,
                fill: '#7B8CA8',
                fontSize: 12
              }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}B`}
            />
            <YAxis 
              type="number" 
              dataKey="waterCut"
              name="Water Cut"
              stroke="#7B8CA8"
              tick={{ fill: '#7B8CA8', fontSize: 12 }}
              label={{ 
                value: 'Water Cut (%)', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#7B8CA8',
                fontSize: 12,
                offset: 40
              }}
              domain={[0, 50]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Reference lines for targets */}
            <ReferenceLine 
              y={40} 
              stroke="#F59E0B" 
              strokeDasharray="5 5" 
              label={{ value: 'Water Cut Threshold', fill: '#F59E0B', fontSize: 11 }}
            />
            
            <Scatter 
              data={scenarios} 
              fill="#0047BA"
              onClick={onScenarioSelect}
              cursor="pointer"
            >
              {scenarios.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColorByRisk(entry.risk)}
                  stroke={entry.isRecommended ? '#FFFFFF' : 'none'}
                  strokeWidth={entry.isRecommended ? 3 : 0}
                  r={entry.isRecommended ? 10 : 6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </SafeChartContainer>
      </div>

      {/* AI Explanation */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
        <div className="flex items-start gap-2">
          <span className="text-primary text-lg">✨</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-primary mb-1">AI Recommendation</div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">
                {scenarios.find(s => s.isRecommended)?.name || 'Scenario B'}
              </span> offers optimal trade-off between NPV and water cut. 
              Increased injector rate in Zone B drives higher recovery while maintaining water production below threshold. 
              Expected NPV: <span className="font-semibold text-text-primary">
                ${((scenarios.find(s => s.isRecommended)?.npv || 1400) / 1000).toFixed(1)}B
              </span>, 
              Water Cut: <span className="font-semibold text-text-primary">
                {scenarios.find(s => s.isRecommended)?.waterCut || 32}%
              </span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}