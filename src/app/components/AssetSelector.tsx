import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Building2, MapPin, Droplet, Check } from 'lucide-react';
import { useAsset, type Asset } from '../context/AssetContext';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export function AssetSelector() {
  const { selectedAsset, setSelectedAsset, availableAssets } = useAsset();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortedAssets = useMemo(() => {
    return [...availableAssets].sort((a, b) => a.name.localeCompare(b.name));
  }, [availableAssets]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsOpen(false);
    toast.success(`Switched to ${asset.name}`, {
      description: `Context updated to ${asset.code} - ${asset.location}`
    });
  };

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'planning':
        return 'bg-warning';
      case 'development':
        return 'bg-primary';
      default:
        return 'bg-text-tertiary';
    }
  };

  const getStatusLabel = (status: Asset['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'planning':
        return 'Planning';
      case 'development':
        return 'Development';
      default:
        return status;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-card rounded-lg hover:bg-card-hover transition-colors min-w-[280px]"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-text-tertiary">Current Asset</div>
          <div className="text-sm font-semibold text-text-primary">{selectedAsset.name}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[420px] bg-popover border border-card-border rounded-lg shadow-2xl z-50 max-h-[600px] overflow-y-auto">
          <div className="p-3 border-b border-card-border bg-background-secondary/50 dark:bg-background-secondary">
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
              Available Assets ({availableAssets.length})
            </div>
          </div>

          <div className="p-2">
            {sortedAssets.map((asset) => {
              const isSelected = asset.id === selectedAsset.id;
              
              return (
                <button
                  key={asset.id}
                  onClick={() => handleAssetChange(asset)}
                  className={`w-full p-3 rounded-lg transition-colors mb-1 ${
                    isSelected 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-card-hover border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary/20' : 'bg-background-secondary'
                    }`}>
                      {asset.type === 'offshore' ? (
                        <Droplet className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                      ) : (
                        <Building2 className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                      )}
                    </div>

                    {/* Asset Details */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                          {asset.name}
                        </span>
                        <span className="text-xs text-text-tertiary">({asset.code})</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary ml-auto" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3 h-3 text-text-tertiary" />
                        <span className="text-xs text-text-secondary">{asset.location}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge 
                          className={`${getStatusColor(asset.status)} text-white border-0`}
                          size="sm"
                        >
                          {getStatusLabel(asset.status)}
                        </Badge>
                        <span className="text-xs text-text-tertiary">{asset.wells} wells</span>
                        <span className="text-xs text-text-tertiary">•</span>
                        <span className="text-xs text-text-tertiary">{asset.reserves}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-card-border bg-background-secondary">
            <p className="text-xs text-text-tertiary text-center">
              Switching assets will update all modules with the selected field's data
            </p>
          </div>
        </div>
      )}
    </div>
  );
}