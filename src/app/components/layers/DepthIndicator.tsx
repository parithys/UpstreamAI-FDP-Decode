import { LayerLevel } from '../../context/LayerContext';

interface DepthIndicatorProps {
  layer: LayerLevel;
  variant?: 'bar' | 'multi-bar' | 'subtle';
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

const layerColors = {
  1: 'bg-blue-500',
  2: 'bg-purple-500',
  3: 'bg-amber-500'
} as const;

const layerBorderColors = {
  1: 'border-blue-500',
  2: 'border-purple-500',
  3: 'border-amber-500'
} as const;

export function DepthIndicator({
  layer,
  variant = 'bar',
  position = 'left',
  className = ''
}: DepthIndicatorProps) {
  if (variant === 'subtle') {
    // Subtle gradient bar
    const gradientClass = 
      layer === 1 ? 'from-blue-500/20 to-transparent' :
      layer === 2 ? 'from-purple-500/20 to-transparent' :
      'from-amber-500/20 to-transparent';

    return (
      <div 
        className={`absolute ${position}-0 top-0 bottom-0 w-1 bg-gradient-to-r ${gradientClass} ${className}`}
        aria-label={`Layer ${layer} indicator`}
      />
    );
  }

  if (variant === 'multi-bar') {
    // Multiple bars showing hierarchy (1 bar for L1, 2 for L2, 3 for L3)
    return (
      <div 
        className={`absolute ${position}-0 top-0 bottom-0 flex ${position === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-0.5 ${className}`}
        aria-label={`Layer ${layer} depth indicator`}
      >
        {Array.from({ length: layer }).map((_, index) => (
          <div
            key={index}
            className={`w-1 ${layerColors[layer]} ${index === 0 ? 'opacity-100' : 'opacity-60'}`}
          />
        ))}
      </div>
    );
  }

  // Default bar variant - single colored bar
  const positionClasses = {
    left: 'left-0 top-0 bottom-0 w-1',
    right: 'right-0 top-0 bottom-0 w-1',
    top: 'top-0 left-0 right-0 h-1',
    bottom: 'bottom-0 left-0 right-0 h-1'
  };

  const borderClasses = {
    left: `border-l-4 ${layerBorderColors[layer]}`,
    right: `border-r-4 ${layerBorderColors[layer]}`,
    top: `border-t-4 ${layerBorderColors[layer]}`,
    bottom: `border-b-4 ${layerBorderColors[layer]}`
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} ${layerColors[layer]} ${className}`}
      aria-label={`Layer ${layer} indicator`}
    />
  );
}

// Wrapper component that adds depth indicator to children
interface WithDepthIndicatorProps {
  layer: LayerLevel;
  variant?: 'bar' | 'multi-bar' | 'subtle';
  position?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

export function WithDepthIndicator({
  layer,
  variant = 'bar',
  position = 'left',
  children,
  className = ''
}: WithDepthIndicatorProps) {
  return (
    <div className={`relative ${className}`}>
      <DepthIndicator layer={layer} variant={variant} position={position} />
      <div className={position === 'left' || position === 'right' ? 'pl-4' : ''}>
        {children}
      </div>
    </div>
  );
}
