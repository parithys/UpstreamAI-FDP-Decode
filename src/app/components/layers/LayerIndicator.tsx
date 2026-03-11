import { Badge } from '../ui/badge';
import { Layers, CheckCircle } from 'lucide-react';
import { LayerLevel } from '../../context/LayerContext';

interface LayerIndicatorProps {
  availableLayers: LayerLevel[];
  currentLayer?: LayerLevel;
  variant?: 'full' | 'compact' | 'badge-only';
  showLabels?: boolean;
  className?: string;
}

const layerInfo = {
  1: { label: 'Overview', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  2: { label: 'Detailed', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  3: { label: 'Deep-Dive', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' }
} as const;

export function LayerIndicator({
  availableLayers,
  currentLayer,
  variant = 'full',
  showLabels = true,
  className = ''
}: LayerIndicatorProps) {
  if (variant === 'badge-only') {
    const maxLayer = Math.max(...availableLayers);
    return (
      <Badge className={`${layerInfo[maxLayer as LayerLevel].color} text-xs`}>
        <Layers className="w-3 h-3 mr-1" />
        Layer {maxLayer}
      </Badge>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Layers className="w-3 h-3 text-text-tertiary" />
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map((layer) => {
            const isAvailable = availableLayers.includes(layer as LayerLevel);
            const isCurrent = currentLayer === layer;
            return (
              <div
                key={layer}
                className={`w-1.5 h-1.5 rounded-full ${
                  isCurrent
                    ? 'bg-primary'
                    : isAvailable
                    ? 'bg-text-secondary'
                    : 'bg-background-tertiary'
                }`}
                title={`Layer ${layer}${isAvailable ? '' : ' (not available)'}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Layers className="w-4 h-4 text-text-tertiary" />
      <div className="flex items-center gap-1.5">
        {availableLayers.map((layer) => {
          const isCurrent = currentLayer === layer;
          const info = layerInfo[layer];
          return (
            <Badge
              key={layer}
              className={`${info.color} text-xs ${isCurrent ? 'ring-2 ring-primary ring-offset-1' : ''}`}
            >
              {isCurrent && <CheckCircle className="w-3 h-3 mr-1" />}
              L{layer}
              {showLabels && `: ${info.label}`}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
