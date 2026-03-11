import { X, Send, Paperclip, Mic } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PromptChip } from './ui/prompt-chip';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AIOracleProps {
  isOpen: boolean;
  onClose: () => void;
}

const messages = [
  {
    type: 'ai',
    content: "I'm your asset-specific AI Assistant, trained on all data and interpretations for Field Alpha. I can answer questions about reservoir characteristics, data sources, historical analyses, and recommend actions. What would you like to know?",
    quickActions: ['Data gaps summary', 'Reservoir characteristics', 'Analogous fields']
  },
  {
    type: 'user',
    content: 'What is the porosity range for Zone C?'
  },
  {
    type: 'ai',
    content: 'Based on available petrophysical data (Layer 1: Ground Truth), Zone C porosity ranges from 12–18% with a mean of 15.2%. Note: This is based on 18 of 25 available logs. 3 wells in the eastern sector are missing data, which may affect the distribution tail.',
    source: 'OSD-FA-PETRO-2024',
    confidence: 82
  },
  {
    type: 'user',
    content: 'can you tell me about decline rate in well 15?'
  },
  {
    type: 'ai',
    content: 'Well 15 shows an exponential decline rate of 8.2% annually based on production data from 2021–2024. The decline is consistent with typical carbonate reservoir behavior in this region.',
    confidence: 89
  }
];

export function AIOracle({ isOpen, onClose }: AIOracleProps) {
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Handle mounting/unmounting with delay for animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay unmounting to allow slide-out animation
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (inputValue.trim()) {
      toast.info(`AI Assistant is processing: "${inputValue}"`);
      setInputValue('');
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={`fixed right-0 top-0 h-screen w-[480px] bg-background-secondary border-l border-card-border z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-lg text-text-primary">✨ AI Assistant</span>
            </div>
            <button 
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-text-secondary mb-2">Field Alpha – Reservoir R-4</div>
          <Badge variant="info" size="sm">
            Subsurface Specialist
          </Badge>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-primary">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-card border border-card-border text-text-primary shadow-glow'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.quickActions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.quickActions.map((action, i) => (
                      <PromptChip key={i} className="text-xs px-3 py-1">
                        {action}
                      </PromptChip>
                    ))}
                  </div>
                )}
                
                {message.source && (
                  <button className="text-xs text-accent hover:underline mt-2">
                    {message.source}
                  </button>
                )}
                
                {message.confidence && (
                  <Badge 
                    variant={message.confidence >= 80 ? 'success' : 'warning'}
                    size="sm"
                    className="mt-2"
                  >
                    {message.confidence}% confidence
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-background-secondary">
          <div className="text-[10px] text-text-tertiary mb-2 text-center">
            Powered by Domain-Fenced SLM | Trained on Field Alpha data corpus
          </div>
          <div className="flex gap-2">
            <Input
              variant="chat"
              placeholder="Ask the AI Assistant..."
              className="flex-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSend={handleSend}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="ghost" onClick={() => toast.info('File attachment coming soon')}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Voice input coming soon')}>
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}