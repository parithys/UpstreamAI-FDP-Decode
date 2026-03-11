import { ResponsiveContainer } from 'recharts';
import { useEffect, useState, useRef } from 'react';

interface SafeChartContainerProps {
  width?: string | number;
  height?: string | number;
  minHeight?: number;
  children: React.ReactNode;
}

/**
 * SafeChartContainer - Wrapper around ResponsiveContainer that ensures
 * charts are only rendered when the container has proper dimensions.
 * This prevents the Recharts warning: "width(0) and height(0) should be greater than 0"
 */
export function SafeChartContainer({ 
  width = "100%", 
  height = "100%",
  minHeight = 200,
  children 
}: SafeChartContainerProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to ensure container is mounted and has dimensions
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true);
        } else {
          // Retry after another small delay
          setTimeout(() => setIsReady(true), 100);
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} style={{ width, height, minHeight }}>
      {isReady && (
        <ResponsiveContainer width={width} height={height} minHeight={minHeight}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}
