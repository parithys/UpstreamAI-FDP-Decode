import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Layers, Maximize2, Minimize2 } from 'lucide-react';
import { LayerLevel } from '../../context/LayerContext';

interface LayerNavigationProps {
  currentLayer: LayerLevel;
  availableLayers: LayerLevel[];
  onLayerChange: (layer: LayerLevel) => void;
  variant?: 'buttons' | 'toggle' | 'minimal';
  className?: string;
}

const layerLabels = {
  1: 'Overview',
  2: 'Detailed',
  3: 'Deep-Dive'
} as const;

export function LayerNavigation({
  currentLayer,
  availableLayers,
  onLayerChange,
  variant = 'buttons',
  className = ''
}: LayerNavigationProps) {
  const canGoUp = availableLayers.some(l => l > currentLayer);
  const canGoDown = availableLayers.some(l => l < currentLayer);
  const maxLayer = Math.max(...availableLayers);
  const minLayer = Math.min(...availableLayers);

  const handlePrevious = () => {
    const lowerLayers = availableLayers.filter(l => l < currentLayer).sort((a, b) => b - a);
    if (lowerLayers.length > 0) {
      onLayerChange(lowerLayers[0]);
    }
  };

  const handleNext = () => {
    const higherLayers = availableLayers.filter(l => l > currentLayer).sort((a, b) => a - b);
    if (higherLayers.length > 0) {
      onLayerChange(higherLayers[0]);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={!canGoDown}
          className="p-1 hover:bg-white/5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous layer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-text-secondary min-w-[60px] text-center">
          Layer {currentLayer}/{maxLayer}
        </span>
        <button
          onClick={handleNext}
          disabled={!canGoUp}
          className="p-1 hover:bg-white/5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next layer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (variant === 'toggle') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {currentLayer > minLayer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLayerChange(minLayer)}
          >
            <Minimize2 className="w-4 h-4 mr-2" />
            Collapse to Overview
          </Button>
        )}
        {currentLayer < maxLayer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLayerChange(maxLayer)}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Expand to {layerLabels[maxLayer]}
          </Button>
        )}
      </div>
    );
  }

  // Buttons variant (default)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Layers className="w-4 h-4 text-text-tertiary" />
      <div className="flex gap-1">
        {availableLayers.map((layer) => {
          const isActive = currentLayer === layer;
          return (
            <Button
              key={layer}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onLayerChange(layer)}
              className="min-w-[100px]"
            >
              L{layer}: {layerLabels[layer]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
