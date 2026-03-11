import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayerLevel } from '../../context/LayerContext';

interface HoverPreviewProps {
  // Layer 1 content (always visible)
  layer1Content: ReactNode;
  
  // Layer 2 preview content (shown on hover)
  layer2Preview: ReactNode;
  
  // Optional: Full layer 2 content for click
  layer2Full?: ReactNode;
  
  // Configuration
  previewDelay?: number; // ms to wait before showing preview
  previewPosition?: 'top' | 'bottom' | 'left' | 'right';
  previewWidth?: string;
  showClickHint?: boolean;
  
  // Callbacks
  onPreviewShow?: () => void;
  onPreviewHide?: () => void;
  onClick?: () => void;
  
  className?: string;
}

export function HoverPreview({
  layer1Content,
  layer2Preview,
  layer2Full,
  previewDelay = 300,
  previewPosition = 'right',
  previewWidth = '320px',
  showClickHint = true,
  onPreviewShow,
  onPreviewHide,
  onClick,
  className = ''
}: HoverPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovering) {
      timeoutRef.current = setTimeout(() => {
        setShowPreview(true);
        onPreviewShow?.();
      }, previewDelay);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowPreview(false);
      onPreviewHide?.();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, previewDelay, onPreviewShow, onPreviewHide]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (layer2Full) {
      setIsClicked(!isClicked);
    }
  };

  const positionClasses = {
    top: 'bottom-full left-0 mb-2',
    bottom: 'top-full left-0 mt-2',
    left: 'right-full top-0 mr-2',
    right: 'left-full top-0 ml-2'
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Layer 1 Content */}
      <div
        onClick={handleClick}
        className={`${onClick || layer2Full ? 'cursor-pointer' : ''} transition-all ${
          isHovering ? 'ring-2 ring-primary/30' : ''
        }`}
      >
        {layer1Content}
      </div>

      {/* Hover Preview Portal */}
      <AnimatePresence>
        {showPreview && !isClicked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[previewPosition]} z-50`}
            style={{ width: previewWidth }}
          >
            <div className="bg-background-secondary border border-card-border rounded-lg shadow-2xl overflow-hidden">
              {/* Preview Header */}
              <div className="bg-purple-500/10 border-b border-purple-500/30 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-text-primary">Layer 2 Preview</span>
                </div>
                {showClickHint && (
                  <span className="text-xs text-text-tertiary">Click for details</span>
                )}
              </div>

              {/* Preview Content */}
              <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {layer2Preview}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Layer 2 Content (on click) */}
      <AnimatePresence>
        {isClicked && layer2Full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
            onClick={() => setIsClicked(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-background-primary rounded-lg border border-card-border max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-background-primary border-b border-card-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="text-lg font-semibold text-text-primary">Layer 2 Details</h3>
                </div>
                <button
                  onClick={() => setIsClicked(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
                {layer2Full}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simpler variant for inline expansion
interface InlineHoverPreviewProps {
  layer1Content: ReactNode;
  layer2Content: ReactNode;
  previewDelay?: number;
  className?: string;
}

export function InlineHoverPreview({
  layer1Content,
  layer2Content,
  previewDelay = 300,
  className = ''
}: InlineHoverPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovering) {
      timeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, previewDelay);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowPreview(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, previewDelay]);

  return (
    <div
      className={`${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Layer 1 */}
      <div className={`transition-all ${isHovering ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
        {layer1Content}
      </div>

      {/* Layer 2 - Inline Expansion */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-purple-500/5 border border-purple-500/30 rounded-lg">
              {layer2Content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
