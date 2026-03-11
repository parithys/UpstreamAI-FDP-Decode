import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AuditTrail } from '../components/AuditTrail';
import { DataProvenance } from '../components/DataProvenance';
import { LoadingState, PageLoadingState } from '../components/ui/loading-state';
import { ErrorState, PageErrorState } from '../components/ui/error-state';
import { useAsyncData } from '../hooks/useAsyncData';
import { exportComplianceReport, exportToCSV, exportToExcel, exportToJSON } from '../utils/exportUtils';
import {
  Shield,
  Lock,
  Users,
  FileText,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  GitBranch,
  Clock,
  TrendingUp,
  BarChart3,
  Filter,
  X,
  Calendar,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

// Compliance metrics
const complianceMetrics = [
  {
    category: 'Data Governance',
    score: 98,
    status: 'compliant',
    checks: [
      { name: 'Data lineage tracking', status: 'passed' },
      { name: 'Version control', status: 'passed' },
      { name: 'Access controls', status: 'passed' },
      { name: 'Backup & recovery', status: 'passed' }
    ]
  },
  {
    category: 'Audit Logging',
    score: 100,
    status: 'compliant',
    checks: [
      { name: 'All actions logged', status: 'passed' },
      { name: 'User attribution', status: 'passed' },
      { name: 'Timestamp accuracy', status: 'passed' },
      { name: 'Immutable logs', status: 'passed' }
    ]
  },
  {
    category: 'Access Control',
    score: 95,
    status: 'compliant',
    checks: [
      { name: 'Role-based access', status: 'passed' },
      { name: 'Multi-factor auth', status: 'passed' },
      { name: 'Session management', status: 'passed' },
      { name: 'Password policy', status: 'warning' }
    ]
  },
  {
    category: 'Data Quality',
    score: 93,
    status: 'compliant',
    checks: [
      { name: 'Validation rules', status: 'passed' },
      { name: 'Quality thresholds', status: 'passed' },
      { name: 'Anomaly detection', status: 'passed' },
      { name: 'Manual reviews', status: 'warning' }
    ]
  }
];

// Data lineage examples
const dataLineage = [
  {
    id: 1,
    asset: 'Geological Model',
    source: 'Petrel v2023.4',
    created: '2025-01-15',
    createdBy: 'David Chen',
    versions: 12,
    lastModified: '2025-02-05',
    modifiedBy: 'Sarah Mitchell',
    downstream: ['Reservoir Simulation', 'Uncertainty Analysis', 'AI Training Dataset'],
    qualityScore: 96
  },
  {
    id: 2,
    asset: 'Production History',
    source: 'PI System / SCADA',
    created: '2020-03-01',
    createdBy: 'System Import',
    versions: 487,
    lastModified: '2025-02-06',
    modifiedBy: 'Auto Sync',
    downstream: ['History Matching', 'Production Forecasts', 'Economic Analysis'],
    qualityScore: 98
  },
  {
    id: 3,
    asset: 'Well Completion Data',
    source: 'Operations Database',
    created: '2024-11-20',
    createdBy: 'Lisa Rodriguez',
    versions: 8,
    lastModified: '2025-01-28',
    modifiedBy: 'Lisa Rodriguez',
    downstream: ['Well Models', 'Production Constraints', 'Cost Estimates'],
    qualityScore: 94
  }
];

// User activity summary
const userActivitySummary = [
  { user: 'Sarah Mitchell', role: 'Reservoir Engineer', actions: 247, lastActive: '14:32 UTC', riskLevel: 'low' },
  { user: 'Mohammed Al-Rashid', role: 'Asset Manager', actions: 89, lastActive: '13:15 UTC', riskLevel: 'low' },
  { user: 'David Chen', role: 'Geoscientist', actions: 156, lastActive: '12:48 UTC', riskLevel: 'low' },
  { user: 'Lisa Rodriguez', role: 'Production Engineer', actions: 134, lastActive: '11:22 UTC', riskLevel: 'low' },
  { user: 'Ahmed Hassan', role: 'Executive', actions: 45, lastActive: '10:05 UTC', riskLevel: 'low' },
  { user: 'System', role: 'Automated', actions: 1853, lastActive: '09:18 UTC', riskLevel: 'low' }
];

// Version control tracking
const versionHistory = [
  {
    id: 1,
    asset: 'Uncertainty Framework',
    version: 'v3.2',
    date: '2025-02-06 14:32',
    author: 'Sarah Mitchell',
    changes: 'Updated subsurface uncertainty ranges',
    approved: true,
    approver: 'Mohammed Al-Rashid'
  },
  {
    id: 2,
    asset: 'Development Scenario 3A',
    version: 'v2.1',
    date: '2025-02-06 13:15',
    author: 'Mohammed Al-Rashid',
    changes: 'Approved for executive review',
    approved: true,
    approver: 'Ahmed Hassan'
  },
  {
    id: 3,
    asset: 'Static Model',
    version: 'v2025.Q1',
    date: '2025-02-06 12:48',
    author: 'David Chen',
    changes: 'Integrated new seismic interpretation',
    approved: true,
    approver: 'Sarah Mitchell'
  }
];

export function GovernanceAudit() {
  const handleGenerateComplianceReport = () => {
    // Sample audit logs for the report
    const sampleAuditLogs = [
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
        ipAddress: '10.45.67.123'
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
        ipAddress: '10.45.67.98'
      }
    ];

    const success = exportComplianceReport(complianceMetrics, sampleAuditLogs, 'pdf');
    
    if (success) {
      toast.success('Compliance report generated', {
        description: 'Opening report in new window for printing/saving as PDF'
      });
    } else {
      toast.error('Export failed', {
        description: 'Please ensure popups are allowed and try again'
      });
    }
  };

  const handleExportAuditLogs = () => {
    // Sample audit logs for export
    const sampleAuditLogs = [
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
        riskLevel: 'medium' as const,
        affectedRecords: 342
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
        riskLevel: 'high' as const,
        affectedRecords: 1
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
        riskLevel: 'medium' as const,
        affectedRecords: 1200000
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
        riskLevel: 'low' as const,
        affectedRecords: 240
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
        riskLevel: 'low' as const
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
        riskLevel: 'low' as const,
        affectedRecords: 12400000
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
        riskLevel: 'medium' as const
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
        riskLevel: 'high' as const
      }
    ];

    const success = exportToCSV(
      sampleAuditLogs.map(log => ({
        'Log ID': log.id,
        'Timestamp': log.timestamp,
        'User': log.user,
        'Role': log.userRole,
        'Action': log.action,
        'Action Type': log.actionType,
        'Module': log.module,
        'Details': log.details,
        'Status': log.status,
        'IP Address': log.ipAddress,
        'Risk Level': log.riskLevel || 'N/A',
        'Affected Records': log.affectedRecords || 0
      })),
      `audit_logs_${new Date().toISOString().split('T')[0]}`
    );

    if (success) {
      toast.success('Audit logs exported', {
        description: `${sampleAuditLogs.length} records exported as CSV`
      });
    } else {
      toast.error('Export failed', {
        description: 'There was an error exporting the audit logs'
      });
    }
  };

  const handleExportDataLineage = () => {
    const success = exportToExcel(
      dataLineage.map(item => ({
        'Asset': item.asset,
        'Source': item.source,
        'Created': item.created,
        'Created By': item.createdBy,
        'Versions': item.versions,
        'Last Modified': item.lastModified,
        'Modified By': item.modifiedBy,
        'Downstream Dependencies': item.downstream.join(', '),
        'Quality Score': `${item.qualityScore}%`
      })),
      `data_lineage_${new Date().toISOString().split('T')[0]}`
    );

    if (success) {
      toast.success('Data lineage exported', {
        description: 'Data lineage tracking exported to Excel'
      });
    }
  };

  const handleExportUserActivity = () => {
    const success = exportToCSV(
      userActivitySummary.map(user => ({
        'User': user.user,
        'Role': user.role,
        'Actions (24h)': user.actions,
        'Last Active': user.lastActive,
        'Risk Level': user.riskLevel
      })),
      `user_activity_${new Date().toISOString().split('T')[0]}`
    );

    if (success) {
      toast.success('User activity exported', {
        description: 'User activity summary exported to CSV'
      });
    }
  };

  const handleViewFullLineageMap = () => {
    toast.info('Opening lineage visualization', {
      description: 'Interactive data lineage graph will open in new window'
    });
  };

  const handleViewUserDetails = (userName: string) => {
    toast.info(`Viewing details for ${userName}`, {
      description: 'Opening user activity audit trail'
    });
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                Governance & Audit Trail
              </h1>
              <Badge className="bg-success/10 text-success border-success/30">
                <Shield className="w-3 h-3 mr-1" />
                Fully Compliant
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">
              Comprehensive audit logging, data lineage tracking, and compliance monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleGenerateComplianceReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Compliance Report
            </Button>
            <Button variant="primary" onClick={handleExportAuditLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export Audit Logs
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Compliance Score</div>
            <div className="text-2xl font-bold text-success">96.5%</div>
            <div className="text-xs text-text-secondary mt-1">Above target (95%)</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Total Audit Logs</div>
            <div className="text-2xl font-bold text-text-primary">24,891</div>
            <div className="text-xs text-success mt-1">+342 today</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Active Users</div>
            <div className="text-2xl font-bold text-text-primary">41</div>
            <div className="text-xs text-text-secondary mt-1">32 active now</div>
          </div>
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="text-xs text-text-tertiary mb-1">Security Incidents</div>
            <div className="text-2xl font-bold text-success">0</div>
            <div className="text-xs text-text-secondary mt-1">Last 30 days</div>
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="bg-card rounded-lg border border-card-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Compliance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {complianceMetrics.map((metric) => (
              <div
                key={metric.category}
                className="bg-background-secondary rounded-lg p-4 border border-card-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-text-primary">{metric.category}</h4>
                  <Badge className={
                    metric.status === 'compliant' 
                      ? 'bg-success/10 text-success border-success/30' 
                      : 'bg-warning/10 text-warning border-warning/30'
                  }>
                    {metric.score}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  {metric.checks.map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{check.name}</span>
                      {check.status === 'passed' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Audit Trail */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Audit Trail Logs</h3>
          <AuditTrail variant="full" showFilters={true} />
        </div>

        {/* Data Provenance - Two Layer System */}
        <div className="mb-6">
          <DataProvenance variant="full" />
        </div>

        {/* Data Lineage Tracking */}
        <div className="bg-card rounded-lg border border-card-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Data Lineage Tracking</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportDataLineage}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewFullLineageMap}>
                <GitBranch className="w-4 h-4 mr-2" />
                View Full Map
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {dataLineage.map((item) => (
              <div
                key={item.id}
                className="bg-background-secondary rounded-lg p-4 border border-card-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-text-primary">{item.asset}</h4>
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                        {item.versions} versions
                      </Badge>
                    </div>
                    <div className="text-xs text-text-secondary">Source: {item.source}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">Quality:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-background-primary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success"
                          style={{ width: `${item.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">{item.qualityScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-3 text-xs">
                  <div>
                    <div className="text-text-tertiary">Created</div>
                    <div className="text-text-primary">{item.created}</div>
                    <div className="text-text-secondary">by {item.createdBy}</div>
                  </div>
                  <div>
                    <div className="text-text-tertiary">Last Modified</div>
                    <div className="text-text-primary">{item.lastModified}</div>
                    <div className="text-text-secondary">by {item.modifiedBy}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-text-tertiary mb-1">Downstream Dependencies</div>
                    <div className="flex flex-wrap gap-1">
                      {item.downstream.map((dep, idx) => (
                        <Badge key={idx} className="bg-accent/10 text-accent border-accent/30 text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Summary */}
        <div className="bg-card rounded-lg border border-card-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">User Activity Summary</h3>
            <Button variant="outline" size="sm" onClick={handleExportUserActivity}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary border-b border-card-border">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">User</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Role</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Actions (Last 24h)</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Last Active</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Risk Level</th>
                  <th className="text-left p-3 text-xs font-semibold text-text-secondary">Details</th>
                </tr>
              </thead>
              <tbody>
                {userActivitySummary.map((user, idx) => (
                  <tr key={idx} className="border-b border-card-border hover:bg-background-secondary">
                    <td className="p-3 text-sm text-text-primary font-medium">{user.user}</td>
                    <td className="p-3 text-xs text-text-secondary">{user.role}</td>
                    <td className="p-3 text-sm text-text-primary">{user.actions}</td>
                    <td className="p-3 text-xs text-text-secondary">{user.lastActive}</td>
                    <td className="p-3">
                      <Badge className="bg-success/10 text-success border-success/30 text-xs">
                        {user.riskLevel}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => handleViewUserDetails(user.user)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Version Control */}
        <div className="bg-card rounded-lg border border-card-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Version Control History</h3>
          <div className="space-y-3">
            {versionHistory.map((version) => (
              <div
                key={version.id}
                className="bg-background-secondary rounded-lg p-4 border border-card-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text-primary">{version.asset}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                          {version.version}
                        </Badge>
                        {version.approved && (
                          <Badge className="bg-success/10 text-success border-success/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary mb-1">{version.changes}</div>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary">
                        <span>{version.author}</span>
                        <span>•</span>
                        <span>{version.date}</span>
                        {version.approved && (
                          <>
                            <span>•</span>
                            <span>Approved by {version.approver}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/dashboard">
              ← Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/insights/multidisciplinary-workflow">
                View Integration Workflow
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link to="/data-health">
                Check Data Health →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}