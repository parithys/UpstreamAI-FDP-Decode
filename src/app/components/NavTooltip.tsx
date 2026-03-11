import { useState, useEffect, useRef } from 'react';

interface NavTooltipProps {
  label: string;
  show: boolean;
  targetRef: React.RefObject<HTMLElement>;
}

export function NavTooltip({ label, show, targetRef }: NavTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (show) {
      // 300ms delay before showing tooltip
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 300);
    } else {
      // Clear timeout and hide immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isVisible]);

  if (!isVisible || !targetRef.current) {
    return null;
  }

  return (
    <div
      className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg pointer-events-none"
      style={{
        left: '72px', // 64px sidebar + 8px gap
        top: `${targetRef.current.getBoundingClientRect().top + targetRef.current.offsetHeight / 2}px`,
        transform: 'translateY(-50%)',
        maxWidth: '200px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      role="tooltip"
    >
      {label}
    </div>
  );
}
