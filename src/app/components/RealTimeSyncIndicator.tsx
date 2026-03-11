import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface RealTimeSyncIndicatorProps {
  variant?: 'full' | 'compact' | 'icon-only';
  dataSources?: string[];
  showLastSync?: boolean;
}

interface SyncStatus {
  connected: boolean;
  syncing: boolean;
  lastSync: string;
  nextSync: string;
  activeSources: number;
  totalSources: number;
  errors: number;
}

export function RealTimeSyncIndicator({ 
  variant = 'compact',
  dataSources = ['OSD Corporate DB', 'Eclipse Sim Server', 'GeoData 5', 'SPE OnePetro'],
  showLastSync = true
}: RealTimeSyncIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: true,
    syncing: false,
    lastSync: new Date().toLocaleTimeString(),
    nextSync: new Date(Date.now() + 120000).toLocaleTimeString(), // 2 minutes
    activeSources: dataSources.length,
    totalSources: dataSources.length,
    errors: 0
  });

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Simulate real-time sync updates
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // Simulate a sync event every 30 seconds
      setSyncStatus(prev => ({
        ...prev,
        syncing: true
      }));

      setTimeout(() => {
        const now = new Date();
        setSyncStatus(prev => ({
          ...prev,
          syncing: false,
          lastSync: now.toLocaleTimeString(),
          nextSync: new Date(Date.now() + 120000).toLocaleTimeString()
        }));
        setLastSyncTime(now);
      }, 2000); // Sync takes 2 seconds
    }, 30000); // Every 30 seconds

    return () => clearInterval(syncInterval);
  }, []);

  // Calculate time since last sync
  const [timeSinceSync, setTimeSinceSync] = useState('Just now');
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      if (seconds < 60) {
        setTimeSinceSync('Just now');
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceSync(`${minutes}m ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeSinceSync(`${hours}h ago`);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [lastSyncTime]);

  if (variant === 'icon-only') {
    return (
      <div className="relative">
        {syncStatus.syncing ? (
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
        ) : syncStatus.connected ? (
          <Wifi className="w-4 h-4 text-success" />
        ) : (
          <WifiOff className="w-4 h-4 text-danger" />
        )}
        {syncStatus.connected && !syncStatus.syncing && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success animate-pulse" />
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return null;
  }

  // Full variant
  return (
    <div className="bg-card rounded-lg border border-card-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {syncStatus.syncing ? (
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          ) : syncStatus.connected ? (
            <div className="relative">
              <Wifi className="w-4 h-4 text-success" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          ) : (
            <WifiOff className="w-4 h-4 text-danger" />
          )}
          <h4 className="text-sm font-semibold text-text-primary">
            {syncStatus.syncing ? 'Syncing Data...' : 'Real-Time Sync'}
          </h4>
        </div>
        <Badge className={
          syncStatus.syncing 
            ? 'bg-primary/10 text-primary border-primary/30'
            : syncStatus.connected 
            ? 'bg-success/10 text-success border-success/30'
            : 'bg-danger/10 text-danger border-danger/30'
        }>
          {syncStatus.syncing ? 'Syncing' : syncStatus.connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Sync Status */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-success" />
            <div>
              <div className="text-text-tertiary">Active Sources</div>
              <div className="text-text-primary font-medium">
                {syncStatus.activeSources}/{syncStatus.totalSources}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-accent" />
            <div>
              <div className="text-text-tertiary">Last Sync</div>
              <div className="text-text-primary font-medium">{timeSinceSync}</div>
            </div>
          </div>
        </div>

        {/* Data Sources Status */}
        <div className="pt-3 border-t border-card-border">
          <div className="text-xs text-text-tertiary mb-2">Connected Sources:</div>
          <div className="space-y-1">
            {dataSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${syncStatus.syncing && idx === 0 ? 'bg-primary animate-pulse' : 'bg-success'}`} />
                  <span className="text-text-secondary">{source}</span>
                </div>
                <span className="text-text-tertiary">
                  {syncStatus.syncing && idx === 0 ? 'Syncing...' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {syncStatus.errors > 0 && (
          <div className="flex items-center gap-2 p-2 bg-danger/10 rounded-lg">
            <AlertCircle className="w-3 h-3 text-danger" />
            <span className="text-xs text-danger">
              {syncStatus.errors} sync error{syncStatus.errors > 1 ? 's' : ''} detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}