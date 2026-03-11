import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Database,
  GitBranch,
  ArrowRight,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  TrendingUp
} from 'lucide-react';

interface DataLineageNode {
  id: string;
  name: string;
  type: 'source' | 'transformation' | 'output';
  status: 'validated' | 'processing' | 'pending' | 'error';
  timestamp: string;
  dataSource?: string;
  recordCount?: number;
  transformations?: string[];
  qualityScore?: number;
  lastUpdatedBy?: string;
  downstream?: string[];
}

interface DataLineageProps {
  dataPoint?: string;
  variant?: 'full' | 'compact' | 'inline';
}

const sampleLineageData: { [key: string]: DataLineageNode[] } = {
  'recovery-factor': [
    {
      id: 'src-1',
      name: 'OSD Corporate DB',
      type: 'source',
      status: 'validated',
      timestamp: '2025-02-08 12:00:00',
      dataSource: 'Oracle Production Database',
      recordCount: 54000,
      qualityScore: 98.5,
      lastUpdatedBy: 'System Sync'
    },
    {
      id: 'trans-1',
      name: 'Data Validation',
      type: 'transformation',
      status: 'validated',
      timestamp: '2025-02-08 12:15:00',
      transformations: [
        'Remove null values',
        'Normalize units to SI',
        'Apply quality filters (>95% confidence)'
      ],
      recordCount: 52800,
      lastUpdatedBy: 'AI Validation Engine'
    },
    {
      id: 'trans-2',
      name: 'Recovery Factor Calculation',
      type: 'transformation',
      status: 'validated',
      timestamp: '2025-02-08 12:30:00',
      transformations: [
        'Calculate OOIP (Original Oil in Place)',
        'Calculate cumulative production',
        'Compute RF = Cumulative / OOIP'
      ],
      recordCount: 1,
      lastUpdatedBy: 'AG-02: Reservoir Analyst'
    },
    {
      id: 'out-1',
      name: 'Dashboard KPI',
      type: 'output',
      status: 'validated',
      timestamp: '2025-02-08 12:35:00',
      dataSource: 'Dashboard Display',
      recordCount: 1,
      qualityScore: 99.2,
      lastUpdatedBy: 'Dashboard Service',
      downstream: ['Executive Dashboard', 'FDP Summary Report']
    }
  ],
  'water-cut': [
    {
      id: 'src-2',
      name: 'Eclipse Sim Server',
      type: 'source',
      status: 'validated',
      timestamp: '2025-02-08 11:45:00',
      dataSource: 'Eclipse v2024.1 Simulation Results',
      recordCount: 12000,
      qualityScore: 97.8,
      lastUpdatedBy: 'System Sync'
    },
    {
      id: 'trans-3',
      name: 'Water Cut Aggregation',
      type: 'transformation',
      status: 'validated',
      timestamp: '2025-02-08 12:00:00',
      transformations: [
        'Aggregate well-level data',
        'Weight by production rate',
        'Calculate field average'
      ],
      recordCount: 42,
      lastUpdatedBy: 'Production Analytics Engine'
    },
    {
      id: 'out-2',
      name: 'Dashboard KPI',
      type: 'output',
      status: 'validated',
      timestamp: '2025-02-08 12:10:00',
      dataSource: 'Dashboard Display',
      recordCount: 1,
      qualityScore: 98.1,
      lastUpdatedBy: 'Dashboard Service',
      downstream: ['Production Dashboard', 'Field Performance Reports']
    }
  ],
  'npv': [
    {
      id: 'src-3a',
      name: 'Production Forecast',
      type: 'source',
      status: 'validated',
      timestamp: '2025-02-08 10:00:00',
      dataSource: 'Eclipse Simulation Results',
      recordCount: 240,
      qualityScore: 96.5,
      lastUpdatedBy: 'AG-03: Production Forecaster'
    },
    {
      id: 'src-3b',
      name: 'Economic Parameters',
      type: 'source',
      status: 'validated',
      timestamp: '2025-02-08 09:30:00',
      dataSource: 'SPE OnePetro Market Data',
      recordCount: 480,
      qualityScore: 95.2,
      lastUpdatedBy: 'Market Data Feed'
    },
    {
      id: 'trans-4',
      name: 'NPV Calculation Engine',
      type: 'transformation',
      status: 'validated',
      timestamp: '2025-02-08 10:30:00',
      transformations: [
        'Apply discount rate (10%)',
        'Calculate CAPEX & OPEX',
        'Apply oil price scenarios',
        'Compute net cash flows'
      ],
      recordCount: 20,
      lastUpdatedBy: 'AG-08: Economic Evaluator'
    },
    {
      id: 'out-3',
      name: 'Dashboard KPI',
      type: 'output',
      status: 'validated',
      timestamp: '2025-02-08 11:00:00',
      dataSource: 'Dashboard Display',
      recordCount: 1,
      qualityScore: 97.3,
      lastUpdatedBy: 'Dashboard Service',
      downstream: ['Executive Dashboard', 'Investment Decision Board']
    }
  ]
};

const statusColors = {
  validated: 'bg-success/10 text-success border-success/30',
  processing: 'bg-warning/10 text-warning border-warning/30',
  pending: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30',
  error: 'bg-danger/10 text-danger border-danger/30'
};

const statusIcons = {
  validated: Check,
  processing: Clock,
  pending: Clock,
  error: AlertCircle
};

const typeColors = {
  source: 'bg-primary/10 text-primary',
  transformation: 'bg-accent/10 text-accent',
  output: 'bg-success/10 text-success'
};

export function DataLineage({ dataPoint = 'recovery-factor', variant = 'full' }: DataLineageProps) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  
  const lineageData = sampleLineageData[dataPoint] || sampleLineageData['recovery-factor'];

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  if (variant === 'inline') {
    const sourceNode = lineageData.find(n => n.type === 'source');
    return (
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Database className="w-3 h-3" />
        <span>Source: {sourceNode?.name || 'Unknown'}</span>
        <span>•</span>
        <Clock className="w-3 h-3" />
        <span>Updated: {sourceNode?.timestamp.split(' ')[1] || 'N/A'}</span>
        {sourceNode?.qualityScore && (
          <>
            <span>•</span>
            <TrendingUp className="w-3 h-3" />
            <span>Quality: {sourceNode.qualityScore}%</span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-text-primary">Data Lineage</h4>
          </div>
          <Badge className="bg-success/10 text-success border-success/30 text-xs">
            {lineageData.filter(n => n.status === 'validated').length}/{lineageData.length} validated
          </Badge>
        </div>

        <div className="space-y-2">
          {lineageData.map((node, index) => {
            const StatusIcon = statusIcons[node.status];
            return (
              <div key={node.id}>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`p-1.5 rounded ${typeColors[node.type]}`}>
                    <Database className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="text-text-primary font-medium">{node.name}</div>
                    <div className="text-text-tertiary">{node.timestamp}</div>
                  </div>
                  <StatusIcon className={`w-3 h-3 ${node.status === 'validated' ? 'text-success' : 'text-warning'}`} />
                </div>
                {index < lineageData.length - 1 && (
                  <div className="ml-4 my-1">
                    <ArrowRight className="w-3 h-3 text-text-tertiary rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Data Lineage & Provenance</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Complete traceability from source to output
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Lineage
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {lineageData.map((node, index) => {
          const StatusIcon = statusIcons[node.status];
          const isExpanded = expandedNodes.includes(node.id);

          return (
            <div key={node.id} className="relative">
              <div 
                className={`bg-background-secondary rounded-lg border border-card-border p-4 hover:border-card-hover transition-all cursor-pointer`}
                onClick={() => toggleNode(node.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${typeColors[node.type]}`}>
                    <Database className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-text-primary">{node.name}</h4>
                      <Badge className={`${statusColors[node.status]} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {node.status}
                      </Badge>
                      <Badge className={`${typeColors[node.type]} border-0 text-xs`}>
                        {node.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                      <div>
                        <span className="text-text-tertiary">Timestamp: </span>
                        <span className="text-text-primary">{node.timestamp}</span>
                      </div>
                      {node.recordCount && (
                        <div>
                          <span className="text-text-tertiary">Records: </span>
                          <span className="text-text-primary">{node.recordCount.toLocaleString()}</span>
                        </div>
                      )}
                      {node.dataSource && (
                        <div>
                          <span className="text-text-tertiary">Source: </span>
                          <span className="text-text-primary">{node.dataSource}</span>
                        </div>
                      )}
                      {node.qualityScore && (
                        <div>
                          <span className="text-text-tertiary">Quality Score: </span>
                          <span className="text-success font-medium">{node.qualityScore}%</span>
                        </div>
                      )}
                      {node.lastUpdatedBy && (
                        <div className="col-span-2">
                          <span className="text-text-tertiary">Last Updated By: </span>
                          <span className="text-text-primary">{node.lastUpdatedBy}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-card-border space-y-2">
                        {node.transformations && (
                          <div>
                            <div className="text-xs font-medium text-text-secondary mb-1">Transformations Applied:</div>
                            <ul className="space-y-1 ml-4">
                              {node.transformations.map((trans, idx) => (
                                <li key={idx} className="text-xs text-text-primary list-disc">
                                  {trans}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {node.downstream && (
                          <div>
                            <div className="text-xs font-medium text-text-secondary mb-1">Downstream Consumers:</div>
                            <div className="flex gap-2">
                              {node.downstream.map((consumer, idx) => (
                                <Badge key={idx} className="bg-primary/10 text-primary border-primary/30 text-xs">
                                  {consumer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button className="p-1 hover:bg-white/5 rounded transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                </div>
              </div>

              {index < lineageData.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-text-tertiary rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-card-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {lineageData.filter(n => n.type === 'source').length}
          </div>
          <div className="text-xs text-text-secondary">Data Sources</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {lineageData.filter(n => n.type === 'transformation').length}
          </div>
          <div className="text-xs text-text-secondary">Transformations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {(lineageData.reduce((acc, n) => acc + (n.qualityScore || 0), 0) / lineageData.filter(n => n.qualityScore).length).toFixed(1)}%
          </div>
          <div className="text-xs text-text-secondary">Avg Quality Score</div>
        </div>
      </div>
    </div>
  );
}
