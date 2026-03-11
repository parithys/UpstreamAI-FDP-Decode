import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { exportAuditLogs, AuditLogExport } from '../utils/exportUtils';
import { toast } from 'sonner';
import {
  Shield,
  Clock,
  User,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Eye,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Upload,
  Settings,
  ArrowRight,
  Calendar,
  X
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  actionType: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'export' | 'login' | 'logout';
  module: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  affectedRecords?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditTrailProps {
  variant?: 'full' | 'compact' | 'widget';
  module?: string;
  limit?: number;
  showFilters?: boolean;
}

const sampleAuditLogs: AuditLog[] = [
  {
    id: 'AUD-2025-001234',
    timestamp: '2025-02-06 14:32:15 UTC',
    user: 'Sarah Mitchell',
    userRole: 'Reservoir Engineer',
    action: 'Updated uncertainty parameters',
    actionType: 'update',
    module: 'Uncertainty & Sensitivity',
    details: 'Modified subsurface uncertainty ranges for permeability (Zone B)',
    status: 'success',
    ipAddress: '10.45.67.123',
    changes: [
      { field: 'Permeability Min', oldValue: '50 mD', newValue: '45 mD' },
      { field: 'Permeability Max', oldValue: '200 mD', newValue: '220 mD' }
    ],
    affectedRecords: 342,
    riskLevel: 'medium'
  },
  {
    id: 'AUD-2025-001235',
    timestamp: '2025-02-06 13:15:42 UTC',
    user: 'Mohammed Al-Rashid',
    userRole: 'Asset Manager',
    action: 'Approved development scenario',
    actionType: 'approve',
    module: 'Insights & Decisions',
    details: 'Approved Scenario 3A: Accelerated Development with infill drilling',
    status: 'success',
    ipAddress: '10.45.67.98',
    affectedRecords: 1,
    riskLevel: 'high'
  },
  {
    id: 'AUD-2025-001236',
    timestamp: '2025-02-06 12:48:30 UTC',
    user: 'David Chen',
    userRole: 'Geoscientist',
    action: 'Uploaded geological model',
    actionType: 'create',
    module: 'Data Health',
    details: 'Uploaded updated Petrel static model (v2025.Q1)',
    status: 'success',
    ipAddress: '10.45.67.145',
    affectedRecords: 1200000,
    riskLevel: 'medium'
  },
  {
    id: 'AUD-2025-001237',
    timestamp: '2025-02-06 11:22:18 UTC',
    user: 'Lisa Rodriguez',
    userRole: 'Production Engineer',
    action: 'Exported production forecast',
    actionType: 'export',
    module: 'FDP Summary',
    details: 'Exported 20-year production forecast to Excel',
    status: 'success',
    ipAddress: '10.45.67.201',
    affectedRecords: 240,
    riskLevel: 'low'
  },
  {
    id: 'AUD-2025-001238',
    timestamp: '2025-02-06 10:05:33 UTC',
    user: 'Ahmed Hassan',
    userRole: 'Executive',
    action: 'Viewed executive dashboard',
    actionType: 'read',
    module: 'Executive Dashboard',
    details: 'Accessed strategic overview for Field Alpha',
    status: 'success',
    ipAddress: '10.45.67.55',
    riskLevel: 'low'
  },
  {
    id: 'AUD-2025-001239',
    timestamp: '2025-02-06 09:18:45 UTC',
    user: 'System',
    userRole: 'System',
    action: 'AI model training completed',
    actionType: 'update',
    module: 'AI Led Integration',
    details: 'Completed training cycle 247 with 12.4M scenarios',
    status: 'success',
    ipAddress: '10.45.67.10',
    affectedRecords: 12400000,
    riskLevel: 'low'
  },
  {
    id: 'AUD-2025-001240',
    timestamp: '2025-02-06 08:42:11 UTC',
    user: 'Sarah Mitchell',
    userRole: 'Reservoir Engineer',
    action: 'Failed login attempt',
    actionType: 'login',
    module: 'Authentication',
    details: 'Invalid password attempt',
    status: 'failed',
    ipAddress: '10.45.67.123',
    riskLevel: 'medium'
  },
  {
    id: 'AUD-2025-001241',
    timestamp: '2025-02-05 16:55:20 UTC',
    user: 'System Admin',
    userRole: 'Administrator',
    action: 'Modified user permissions',
    actionType: 'update',
    module: 'User Management',
    details: 'Granted AI Led Simulation access to Sarah Mitchell',
    status: 'success',
    ipAddress: '10.45.67.5',
    changes: [
      { field: 'Permission: AI Led Access', oldValue: 'No', newValue: 'Yes' }
    ],
    riskLevel: 'high'
  }
];

const actionIcons = {
  create: Upload,
  read: Eye,
  update: Edit,
  delete: Trash2,
  approve: CheckCircle,
  reject: XCircle,
  export: Download,
  login: Lock,
  logout: Unlock
};

const actionColors = {
  create: 'text-success',
  read: 'text-primary',
  update: 'text-warning',
  delete: 'text-danger',
  approve: 'text-success',
  reject: 'text-danger',
  export: 'text-accent',
  login: 'text-primary',
  logout: 'text-text-tertiary'
};

const riskColors = {
  low: 'bg-success/10 text-success border-success/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  high: 'bg-danger/10 text-danger border-danger/30',
  critical: 'bg-danger/20 text-danger border-danger/50'
};

export function AuditTrail({ 
  variant = 'full', 
  module, 
  limit, 
  showFilters = true 
}: AuditTrailProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const logs = module 
    ? sampleAuditLogs.filter(log => log.module === module).slice(0, limit || 5)
    : sampleAuditLogs.slice(0, limit || 20);

  const filteredLogs = logs.filter(log => {
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (filterType !== 'all' && log.actionType !== filterType) return false;
    if (filterRisk !== 'all' && log.riskLevel !== filterRisk) return false;
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = (format: 'csv' | 'excel' | 'json' = 'csv') => {
    const exportData: AuditLogExport[] = filteredLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      user: log.user,
      userRole: log.userRole,
      action: log.action,
      actionType: log.actionType,
      module: log.module,
      details: log.details,
      status: log.status,
      ipAddress: log.ipAddress,
      riskLevel: log.riskLevel,
      affectedRecords: log.affectedRecords
    }));

    const success = exportAuditLogs(exportData, format);
    
    if (success) {
      toast.success(`Audit logs exported successfully`, {
        description: `${filteredLogs.length} records exported as ${format.toUpperCase()}`
      });
    } else {
      toast.error('Export failed', {
        description: 'There was an error exporting the audit logs'
      });
    }
  };

  if (variant === 'widget') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-text-primary">Recent Activity</h4>
          </div>
          <Badge className="bg-success/10 text-success border-success/30 text-xs">
            {logs.length} events
          </Badge>
        </div>
        <div className="space-y-2">
          {logs.slice(0, 3).map((log) => {
            const Icon = actionIcons[log.actionType];
            return (
              <div key={log.id} className="flex items-start gap-2 text-xs">
                <Icon className={`w-3 h-3 mt-0.5 ${actionColors[log.actionType]}`} />
                <div className="flex-1">
                  <div className="text-text-primary">{log.action}</div>
                  <div className="text-text-tertiary">{log.user} • {log.timestamp.split(' ')[1]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Audit Trail</h3>
            <p className="text-sm text-text-secondary mt-1">
              {module ? `Recent activity in ${module}` : 'Recent platform activity'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExport()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-2">
          {logs.map((log) => {
            const Icon = actionIcons[log.actionType];
            return (
              <div
                key={log.id}
                className="bg-background-secondary rounded-lg p-3 border border-card-border hover:border-card-hover transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-success/10' : 'bg-danger/10'}`}>
                    <Icon className={`w-4 h-4 ${actionColors[log.actionType]}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-text-primary text-sm">{log.action}</div>
                      {log.riskLevel && (
                        <Badge className={`${riskColors[log.riskLevel]} text-xs`}>
                          {log.riskLevel}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mb-1">{log.details}</div>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>{log.user} ({log.userRole})</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                      <span>•</span>
                      <span>{log.module}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="bg-card rounded-lg border border-card-border p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-tertiary" />
              <span className="text-sm text-text-secondary">Filters:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-background-secondary border border-card-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-background-secondary border border-card-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="read">Read</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="export">Export</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-background-secondary border border-card-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <div className="flex-1" />
            <div className="flex items-center gap-2 bg-background-secondary border border-card-border rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-sm text-text-primary w-64"
              />
            </div>
            {/* Clear Filters Button */}
            {(filterStatus !== 'all' || filterType !== 'all' || filterRisk !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterRisk('all');
                  setSearchQuery('');
                  toast.info('Filters cleared');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
            {/* Export Menu */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
          {/* Filter Summary */}
          {filteredLogs.length !== logs.length && (
            <div className="mt-3 text-xs text-text-secondary">
              Showing {filteredLogs.length} of {logs.length} records
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-card rounded-lg border border-card-border overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No logs found</h3>
            <p className="text-sm text-text-secondary mb-4">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' || filterRisk !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'No audit logs available'}
            </p>
            {(filterStatus !== 'all' || filterType !== 'all' || filterRisk !== 'all' || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterRisk('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-card-border">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Timestamp</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">User</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Action</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Module</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Details</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Risk</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => {
                  const Icon = actionIcons[log.actionType];
                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-card-border hover:bg-background-secondary transition-colors ${
                        index % 2 === 0 ? 'bg-background-primary' : ''
                      }`}
                    >
                      <td className="p-3 text-xs text-text-secondary">
                        <div>{log.timestamp.split(' ')[0]}</div>
                        <div className="text-text-tertiary">{log.timestamp.split(' ')[1]}</div>
                      </td>
                      <td className="p-3 text-xs">
                        <div className="text-text-primary font-medium">{log.user}</div>
                        <div className="text-text-tertiary">{log.userRole}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${actionColors[log.actionType]}`} />
                          <span className="text-xs text-text-primary">{log.action}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-text-secondary">{log.module}</td>
                      <td className="p-3 text-xs text-text-secondary max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="p-3">
                        {log.riskLevel && (
                          <Badge className={`${riskColors[log.riskLevel]} text-xs`}>
                            {log.riskLevel}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge className={
                          log.status === 'success' 
                            ? 'bg-success/10 text-success border-success/30' 
                            : log.status === 'failed'
                            ? 'bg-danger/10 text-danger border-danger/30'
                            : 'bg-warning/10 text-warning border-warning/30'
                        } size="sm">
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedLog(null)}>
          <div className="bg-popover rounded-lg border border-card-border p-6 max-w-2xl w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Audit Log Details</h3>
              <button onClick={() => setSelectedLog(null)} className="text-text-secondary hover:text-text-primary">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Log ID</div>
                  <div className="text-sm text-text-primary font-mono">{selectedLog.id}</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Timestamp</div>
                  <div className="text-sm text-text-primary">{selectedLog.timestamp}</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary mb-1">User</div>
                  <div className="text-sm text-text-primary">{selectedLog.user} ({selectedLog.userRole})</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary mb-1">IP Address</div>
                  <div className="text-sm text-text-primary font-mono">{selectedLog.ipAddress}</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Module</div>
                  <div className="text-sm text-text-primary">{selectedLog.module}</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Action Type</div>
                  <Badge className={`${actionColors[selectedLog.actionType]} text-xs`}>
                    {selectedLog.actionType}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-xs text-text-tertiary mb-1">Action Details</div>
                <div className="text-sm text-text-primary bg-background-secondary rounded-lg p-3">
                  {selectedLog.details}
                </div>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <div className="text-xs text-text-tertiary mb-2">Changes Made</div>
                  <div className="space-y-2">
                    {selectedLog.changes.map((change, idx) => (
                      <div key={idx} className="bg-background-secondary rounded-lg p-3">
                        <div className="text-sm font-medium text-text-primary mb-1">{change.field}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-danger line-through">{change.oldValue}</span>
                          <ArrowRight className="w-3 h-3 text-text-tertiary" />
                          <span className="text-success">{change.newValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.affectedRecords && (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm text-text-secondary">Affected Records</span>
                  <span className="text-sm font-semibold text-primary">
                    {selectedLog.affectedRecords.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}