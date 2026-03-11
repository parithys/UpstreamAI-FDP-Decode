import React, { useState } from 'react';
import { 
  MousePointer2, 
  Pencil, 
  MessageSquarePlus, 
  Eraser, 
  Camera, 
  X,
  Highlighter
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

interface DataAnnotationToolbarProps {
  onToolSelect?: (tool: string) => void;
  className?: string;
  onClose?: () => void;
}

export function DataAnnotationToolbar({ onToolSelect, className, onClose }: DataAnnotationToolbarProps) {
  const [activeTool, setActiveTool] = useState<string>('pointer');

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    if (onToolSelect) onToolSelect(tool);
    
    if (tool === 'camera') {
      toast.success('Snapshot captured');
      setActiveTool('pointer');
    }
  };

  return (
    <div className={cn(
      "fixed bottom-8 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md border border-card-border rounded-full shadow-lg p-1.5 flex items-center gap-1 z-50 animate-in slide-in-from-bottom-10",
      className
    )}>
      <Button
        variant={activeTool === 'pointer' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-full w-9 h-9"
        onClick={() => handleToolClick('pointer')}
        title="Select"
      >
        <MousePointer2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-4 bg-card-border mx-1" />

      <Button
        variant={activeTool === 'pen' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-full w-9 h-9"
        onClick={() => handleToolClick('pen')}
        title="Draw"
      >
        <Pencil className="w-4 h-4" />
      </Button>

      <Button
        variant={activeTool === 'highlight' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-full w-9 h-9"
        onClick={() => handleToolClick('highlight')}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </Button>

      <Button
        variant={activeTool === 'comment' ? 'secondary' : 'ghost'}
        size="icon"
        className="rounded-full w-9 h-9"
        onClick={() => handleToolClick('comment')}
        title="Add Note"
      >
        <MessageSquarePlus className="w-4 h-4" />
      </Button>

      <div className="w-px h-4 bg-card-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9 hover:text-danger"
        onClick={() => handleToolClick('eraser')}
        title="Clear All"
      >
        <Eraser className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9"
        onClick={() => handleToolClick('camera')}
        title="Snapshot"
      >
        <Camera className="w-4 h-4" />
      </Button>

      <div className="w-px h-4 bg-card-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9 text-text-tertiary hover:text-text-primary"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}