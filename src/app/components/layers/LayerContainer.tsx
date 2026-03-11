import { useEffect, ReactNode } from 'react';
import { useLayer, LayerLevel, LayerConfig } from '../../context/LayerContext';
import { LayerNavigation } from './LayerNavigation';
import { motion, AnimatePresence } from 'motion/react';

interface LayerContainerProps {
  config: LayerConfig;
  children: {
    layer1?: ReactNode;
    layer2?: ReactNode;
    layer3?: ReactNode;
  };
  showNavigation?: boolean;
  navigationVariant?: 'buttons' | 'toggle' | 'minimal';
  indicatorPosition?: 'top' | 'bottom';
  className?: string;
}

export function LayerContainer({
  config,
  children,
  showNavigation = true,
  navigationVariant = 'buttons',
  indicatorPosition = 'top',
  className = ''
}: LayerContainerProps) {
  const { registerItem, getLayer, setLayer, getAvailableLayers } = useLayer();

  // Register this item on mount
  useEffect(() => {
    registerItem(config);
  }, [config.itemId]); // Only re-register if itemId changes

  const currentLayer = getLayer(config.itemId);
  const availableLayers = getAvailableLayers(config.itemId);

  const handleLayerChange = (layer: LayerLevel) => {
    setLayer(config.itemId, layer);
  };

  const layerContent = children[`layer${currentLayer}` as keyof typeof children];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top navigation */}
      {showNavigation && indicatorPosition === 'top' && availableLayers.length > 1 && (
        <div className="flex items-center">
          <LayerNavigation
            currentLayer={currentLayer}
            availableLayers={availableLayers}
            onLayerChange={handleLayerChange}
            variant={navigationVariant}
          />
        </div>
      )}

      {/* Layer content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`layer-${currentLayer}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {layerContent || (
            <div className="bg-card rounded-lg border border-card-border p-8 text-center">
              <p className="text-text-secondary">
                Layer {currentLayer} content not available
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      {showNavigation && indicatorPosition === 'bottom' && availableLayers.length > 1 && (
        <div className="flex items-center pt-4 border-t border-card-border">
          <LayerNavigation
            currentLayer={currentLayer}
            availableLayers={availableLayers}
            onLayerChange={handleLayerChange}
            variant="minimal"
          />
        </div>
      )}
    </div>
  );
}