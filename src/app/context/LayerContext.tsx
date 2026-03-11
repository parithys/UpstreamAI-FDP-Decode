import React, { createContext, useContext, useState, useCallback } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type LayerLevel = 1 | 2 | 3;

export interface LayerConfig {
  itemId: string;
  availableLayers: LayerLevel[];
  defaultLayer?: LayerLevel;
  layer1Title?: string;
  layer2Title?: string;
  layer3Title?: string;
}

export interface LayerState {
  itemId: string;
  currentLayer: LayerLevel;
  availableLayers: LayerLevel[];
}

interface LayerContextType {
  // Current layer state
  currentLayers: Record<string, LayerState>;
  
  // Layer management
  setLayer: (itemId: string, layer: LayerLevel) => void;
  getLayer: (itemId: string) => LayerLevel;
  registerItem: (config: LayerConfig) => void;
  getAvailableLayers: (itemId: string) => LayerLevel[];
  
  // Layer navigation
  navigateToLayer: (itemId: string, layer: LayerLevel) => void;
  canNavigateToLayer: (itemId: string, layer: LayerLevel) => boolean;
  
  // Global layer view preference
  globalLayerPreference: LayerLevel;
  setGlobalLayerPreference: (layer: LayerLevel) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function LayerProvider({ children }: { children: React.ReactNode }) {
  const [currentLayers, setCurrentLayers] = useState<Record<string, LayerState>>({});
  const [globalLayerPreference, setGlobalLayerPreference] = useState<LayerLevel>(1);

  const registerItem = useCallback((config: LayerConfig) => {
    setCurrentLayers(prev => {
      // Don't re-register if already exists
      if (prev[config.itemId]) return prev;
      
      return {
        ...prev,
        [config.itemId]: {
          itemId: config.itemId,
          currentLayer: config.defaultLayer || config.availableLayers[0] || 1,
          availableLayers: config.availableLayers
        }
      };
    });
  }, []);

  const setLayer = useCallback((itemId: string, layer: LayerLevel) => {
    setCurrentLayers(prev => {
      const item = prev[itemId];
      if (!item) return prev;
      
      // Check if layer is available
      if (!item.availableLayers.includes(layer)) {
        console.warn(`Layer ${layer} not available for item ${itemId}`);
        return prev;
      }
      
      return {
        ...prev,
        [itemId]: {
          ...item,
          currentLayer: layer
        }
      };
    });
  }, []);

  const getLayer = useCallback((itemId: string): LayerLevel => {
    return currentLayers[itemId]?.currentLayer || 1;
  }, [currentLayers]);

  const getAvailableLayers = useCallback((itemId: string): LayerLevel[] => {
    return currentLayers[itemId]?.availableLayers || [1];
  }, [currentLayers]);

  const navigateToLayer = useCallback((itemId: string, layer: LayerLevel) => {
    setLayer(itemId, layer);
  }, [setLayer]);

  const canNavigateToLayer = useCallback((itemId: string, layer: LayerLevel): boolean => {
    const item = currentLayers[itemId];
    if (!item) return false;
    return item.availableLayers.includes(layer);
  }, [currentLayers]);

  const value: LayerContextType = {
    currentLayers,
    setLayer,
    getLayer,
    registerItem,
    getAvailableLayers,
    navigateToLayer,
    canNavigateToLayer,
    globalLayerPreference,
    setGlobalLayerPreference
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error('useLayer must be used within a LayerProvider');
  }
  return context;
}
