interface TornadoDataItem {
  variable: string;
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
}

interface TornadoChartProps {
  data: TornadoDataItem[];
  title?: string;
}

export function TornadoChart({ data, title = "Sensitivity Analysis" }: TornadoChartProps) {
  const maxImpact = Math.max(...data.map(d => d.impact));

  return (
    <div className="bg-card rounded-lg p-6 border border-card-border shadow-glow">
      <h3 className="text-text-primary font-semibold mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-6">Impact on NPV Variance (%)</p>

      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = (item.impact / maxImpact) * 100;
          const isHigh = item.impact > 50;
          const isMedium = item.impact > 25 && item.impact <= 50;
          const barColor = isHigh 
            ? 'bg-danger' 
            : isMedium 
            ? 'bg-warning' 
            : 'bg-success';

          return (
            <div key={index} className="space-y-2">
              {/* Variable Name and Impact Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{item.variable}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isHigh ? 'bg-danger/10 text-danger' :
                    isMedium ? 'bg-warning/10 text-warning' :
                    'bg-success/10 text-success'
                  }`}>
                    {isHigh ? 'High Impact' : isMedium ? 'Medium' : 'Low'}
                  </span>
                </div>
                <span className="text-sm font-bold text-text-primary">{item.impact}%</span>
              </div>

              {/* Tornado Bar */}
              <div className="flex items-center gap-2">
                {/* Left side (negative impact) */}
                <div className="flex-1 flex justify-end">
                  {item.direction === 'negative' && (
                    <div 
                      className={`h-8 ${barColor} rounded-l transition-all duration-300 flex items-center justify-end pr-3`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        -{item.impact}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Center line */}
                <div className="w-px h-10 bg-card-border" />

                {/* Right side (positive impact) */}
                <div className="flex-1">
                  {item.direction === 'positive' && (
                    <div 
                      className={`h-8 ${barColor} rounded-r transition-all duration-300 flex items-center justify-start pl-3`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        +{item.impact}%
                      </span>
                    </div>
                  )}
                  {item.direction === 'neutral' && (
                    <div 
                      className={`h-8 ${barColor} rounded-r transition-all duration-300 flex items-center justify-start pl-3`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {item.impact}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ranking */}
              <div className="flex items-center gap-2 pl-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isHigh ? 'bg-danger/20 text-danger' :
                  isMedium ? 'bg-warning/20 text-warning' :
                  'bg-success/20 text-success'
                }`}>
                  {index + 1}
                </div>
                <span className="text-xs text-text-tertiary">Sensitivity Rank</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
        <div className="flex items-start gap-2">
          <span className="text-accent text-lg">💡</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-accent mb-1">AI Summary</div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">{data[0]?.variable}</span> contributes{' '}
              <span className="font-semibold text-text-primary">{data[0]?.impact}%</span> of forecast variance,
              making it the dominant uncertainty factor. Focus data acquisition and risk mitigation efforts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
