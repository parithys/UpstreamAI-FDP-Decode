import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Bot,
  Database,
  Activity,
  Target,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  Brain,
  Shield,
  GitBranch,
  FileText,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Eye,
  Settings,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// AI Agent Definitions (AG-01 through AG-12)
export interface AIAgent {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastRun: string;
  confidence: number;
  tasksCompleted: number;
  module: string;
  capabilities: string[];
  inputs: string[];
  outputs: string[];
  dependencies: string[];
}

export const aiAgents: AIAgent[] = [
  {
    id: 'ag-01',
    code: 'AG-01',
    name: 'Data Quality Agent',
    description: 'Monitors data completeness, validates inputs, identifies gaps, and ensures data integrity across all modules',
    icon: Database,
    iconColor: '#0047BA',
    status: 'active',
    lastRun: '2025-02-06 14:30:15',
    confidence: 98,
    tasksCompleted: 1247,
    module: 'Data Health (M2)',
    capabilities: [
      'Data completeness validation',
      'Gap identification and reporting',
      'Quality scoring (0-100)',
      'Automated data reconciliation',
      'Cross-source validation'
    ],
    inputs: ['Petrel Static Model', 'Well Data', 'Petrophysical Logs', 'Production History'],
    outputs: ['Quality Score', 'Gap Analysis Report', 'Validation Warnings'],
    dependencies: []
  },
  {
    id: 'ag-02',
    code: 'AG-02',
    name: 'History Matching Agent',
    description: 'Performs automated history matching, calibrates reservoir models, and validates simulation accuracy',
    icon: Activity,
    iconColor: '#00BCD4',
    status: 'active',
    lastRun: '2025-02-06 13:45:22',
    confidence: 94,
    tasksCompleted: 856,
    module: 'History Matching (M3)',
    capabilities: [
      'Automated parameter adjustment',
      'Multi-objective optimization',
      'Mismatch analysis',
      'Uncertainty quantification',
      'Model calibration'
    ],
    inputs: ['Production History', 'Simulation Model', 'Well Performance Data'],
    outputs: ['Matched Model', 'Calibration Report', 'Uncertainty Ranges'],
    dependencies: ['AG-01']
  },
  {
    id: 'ag-03',
    code: 'AG-03',
    name: 'Subsurface Uncertainty Agent',
    description: 'Quantifies geological and reservoir uncertainties including permeability, porosity, and net-to-gross variations',
    icon: Target,
    iconColor: '#F59E0B',
    status: 'active',
    lastRun: '2025-02-06 14:15:30',
    confidence: 91,
    tasksCompleted: 623,
    module: 'Uncertainty (M4)',
    capabilities: [
      'P10/P50/P90 analysis',
      'Monte Carlo simulation',
      'Sensitivity analysis',
      'Spatial uncertainty modeling',
      'Risk quantification'
    ],
    inputs: ['Static Model', 'Core Data', 'Log Data', 'Seismic Attributes'],
    outputs: ['Uncertainty Ranges', 'Probability Distributions', 'Risk Profiles'],
    dependencies: ['AG-01', 'AG-02']
  },
  {
    id: 'ag-04',
    code: 'AG-04',
    name: 'Operational Uncertainty Agent',
    description: 'Analyzes operational risks including well performance variability, equipment reliability, and facility constraints',
    icon: Zap,
    iconColor: '#8B5CF6',
    status: 'active',
    lastRun: '2025-02-06 12:20:45',
    confidence: 88,
    tasksCompleted: 534,
    module: 'Uncertainty (M4)',
    capabilities: [
      'Well productivity analysis',
      'Facility constraint modeling',
      'Equipment reliability assessment',
      'Operational risk scoring',
      'Contingency planning'
    ],
    inputs: ['Well Performance History', 'Facility Specs', 'Maintenance Records'],
    outputs: ['Operational Risk Score', 'Constraint Analysis', 'Mitigation Strategies'],
    dependencies: ['AG-01', 'AG-02']
  },
  {
    id: 'ag-05',
    code: 'AG-05',
    name: 'Market Volatility Agent',
    description: 'Forecasts oil/gas price scenarios, analyzes economic uncertainties, and evaluates fiscal impacts',
    icon: TrendingUp,
    iconColor: '#22C55E',
    status: 'active',
    lastRun: '2025-02-06 10:30:18',
    confidence: 85,
    tasksCompleted: 412,
    module: 'Uncertainty (M4)',
    capabilities: [
      'Price forecast modeling',
      'Market trend analysis',
      'Economic scenario generation',
      'Fiscal regime sensitivity',
      'Contract term analysis'
    ],
    inputs: ['Market Data Feeds', 'Historical Prices', 'Fiscal Terms', 'Contract Agreements'],
    outputs: ['Price Scenarios', 'Economic Sensitivity', 'NPV Risk Profiles'],
    dependencies: ['AG-01']
  },
  {
    id: 'ag-06',
    code: 'AG-06',
    name: 'Cross-Domain Integration Agent',
    description: 'Integrates uncertainties across subsurface, operational, and economic domains for holistic risk assessment',
    icon: GitBranch,
    iconColor: '#EC4899',
    status: 'active',
    lastRun: '2025-02-06 14:00:33',
    confidence: 92,
    tasksCompleted: 387,
    module: 'Uncertainty (M4)',
    capabilities: [
      'Multi-domain correlation analysis',
      'Combined uncertainty propagation',
      'Holistic risk assessment',
      'Scenario clustering',
      'Integrated P10/P50/P90 analysis'
    ],
    inputs: ['Subsurface Uncertainties', 'Operational Risks', 'Economic Scenarios'],
    outputs: ['Integrated Risk Profile', 'Cross-Domain Correlations', 'Combined Scenarios'],
    dependencies: ['AG-03', 'AG-04', 'AG-05']
  },
  {
    id: 'ag-07',
    code: 'AG-07',
    name: 'AI Led Simulation Agent',
    description: 'Executes rapid AI-powered proxy models to generate millions of scenarios for optimization',
    icon: Brain,
    iconColor: '#0047BA',
    status: 'processing',
    lastRun: '2025-02-06 14:32:05',
    confidence: 96,
    tasksCompleted: 2847,
    module: 'AI Led Integration (M5)',
    capabilities: [
      'Proxy model execution (12.4M scenarios)',
      'Physics-informed neural networks',
      'Rapid scenario generation',
      'Real-time optimization',
      'Pattern recognition'
    ],
    inputs: ['Calibrated Model', 'Training Dataset', 'Uncertainty Ranges', 'Constraints'],
    outputs: ['12.4M Scenarios', 'Optimal Solutions', 'Performance Clusters'],
    dependencies: ['AG-02', 'AG-06']
  },
  {
    id: 'ag-08',
    code: 'AG-08',
    name: 'Traditional Simulation Agent',
    description: 'Manages Eclipse/tNavigator traditional simulations for validation and benchmarking',
    icon: BarChart3,
    iconColor: '#6366F1',
    status: 'active',
    lastRun: '2025-02-06 11:15:40',
    confidence: 99,
    tasksCompleted: 156,
    module: 'AI Led Integration (M5)',
    capabilities: [
      'Eclipse simulation management',
      'tNavigator coordination',
      'High-fidelity validation',
      'Benchmark comparison',
      'Quality assurance'
    ],
    inputs: ['Simulation Grid', 'Well Models', 'Fluid Properties', 'Schedule'],
    outputs: ['3,847 Traditional Scenarios', 'Validation Results', 'Benchmark Metrics'],
    dependencies: ['AG-01', 'AG-02']
  },
  {
    id: 'ag-09',
    code: 'AG-09',
    name: 'Insight Generation Agent',
    description: 'Analyzes scenario results, identifies optimal solutions, and generates actionable insights',
    icon: Zap,
    iconColor: '#FDB913',
    status: 'active',
    lastRun: '2025-02-06 14:35:12',
    confidence: 89,
    tasksCompleted: 734,
    module: 'Insights & Decisions (M5)',
    capabilities: [
      'Pattern recognition across scenarios',
      'Optimization recommendation',
      'Risk-return analysis',
      'Trade-off identification',
      'Confidence scoring'
    ],
    inputs: ['AI Led Scenarios', 'Traditional Scenarios', 'Constraints', 'Objectives'],
    outputs: ['Top Insights', 'Recommendations', 'Confidence Scores', 'Trade-off Analysis'],
    dependencies: ['AG-07', 'AG-08']
  },
  {
    id: 'ag-10',
    code: 'AG-10',
    name: 'Decision Support Agent',
    description: 'Provides interactive decision support, scenario ranking, and multi-criteria optimization',
    icon: Target,
    iconColor: '#10B981',
    status: 'active',
    lastRun: '2025-02-06 14:28:50',
    confidence: 93,
    tasksCompleted: 589,
    module: 'Insights & Decisions (M5)',
    capabilities: [
      'Multi-criteria decision analysis',
      'Scenario ranking and filtering',
      'What-if analysis',
      'Trade-off optimization',
      'Sensitivity exploration'
    ],
    inputs: ['Insights', 'User Preferences', 'Constraints', 'Objectives'],
    outputs: ['Ranked Scenarios', 'Optimal Solutions', 'Decision Recommendations'],
    dependencies: ['AG-09']
  },
  {
    id: 'ag-11',
    code: 'AG-11',
    name: 'Governance & Audit Agent',
    description: 'Tracks all actions, ensures compliance, maintains audit trails, and monitors data lineage',
    icon: Shield,
    iconColor: '#DC2626',
    status: 'active',
    lastRun: '2025-02-06 14:36:00',
    confidence: 100,
    tasksCompleted: 15624,
    module: 'Governance & Audit (M5)',
    capabilities: [
      'Comprehensive audit logging',
      'Data lineage tracking',
      'Compliance monitoring',
      'User activity tracking',
      'Version control'
    ],
    inputs: ['All System Events', 'User Actions', 'Data Changes', 'Approvals'],
    outputs: ['Audit Logs', 'Compliance Reports', 'Lineage Graphs', 'Activity Dashboards'],
    dependencies: []
  },
  {
    id: 'ag-12',
    code: 'AG-12',
    name: 'Report Generation Agent',
    description: 'Automatically generates comprehensive FDP reports, executive summaries, and export packages',
    icon: FileText,
    iconColor: '#0EA5E9',
    status: 'active',
    lastRun: '2025-02-06 09:45:30',
    confidence: 97,
    tasksCompleted: 267,
    module: 'FDP Summary (M6)',
    capabilities: [
      'Automated report generation',
      'PDF/PowerPoint export',
      'Executive summary creation',
      'Chart and visualization generation',
      'Multi-format support'
    ],
    inputs: ['All Module Results', 'Insights', 'Decisions', 'Audit Trail'],
    outputs: ['FDP Report', 'Executive Summary', 'Technical Appendices', 'Export Files'],
    dependencies: ['AG-01', 'AG-09', 'AG-11']
  }
];

interface AIAgentsProps {
  variant?: 'grid' | 'list' | 'summary';
  filterModule?: string;
  showDetails?: boolean;
}

export function AIAgents({ variant = 'grid', filterModule, showDetails = false }: AIAgentsProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAgents = aiAgents.filter(agent => {
    if (filterModule && agent.module !== filterModule) return false;
    if (selectedStatus !== 'all' && agent.status !== selectedStatus) return false;
    return true;
  });

  if (variant === 'summary') {
    const activeCount = aiAgents.filter(a => a.status === 'active').length;
    const processingCount = aiAgents.filter(a => a.status === 'processing').length;
    const avgConfidence = Math.round(aiAgents.reduce((sum, a) => sum + a.confidence, 0) / aiAgents.length);
    const totalTasks = aiAgents.reduce((sum, a) => sum + a.tasksCompleted, 0);

    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">AI Agents Status</h3>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30">
            {aiAgents.length} Agents
          </Badge>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-text-primary">Active</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{activeCount}</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-text-primary">Processing</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{processingCount}</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-text-primary">Avg Confidence</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{avgConfidence}%</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Tasks Today</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{totalTasks.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          const isExpanded = expandedAgent === agent.id;
          
          return (
            <div
              key={agent.id}
              className="bg-card rounded-lg border border-card-border hover:border-card-hover transition-all"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-background-secondary" style={{ backgroundColor: `${agent.iconColor}10` }}>
                      <Icon className="w-5 h-5" style={{ color: agent.iconColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text-primary">{agent.name}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                          {agent.code}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-text-tertiary mb-1">Confidence</div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${agent.confidence}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{agent.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        agent.status === 'active'
                          ? 'bg-success/10 text-success border-success/30'
                          : agent.status === 'processing'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : agent.status === 'idle'
                          ? 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30'
                          : 'bg-danger/10 text-danger border-danger/30'
                      }>
                        {agent.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {agent.status === 'processing' && <Activity className="w-3 h-3 mr-1" />}
                        {agent.status}
                      </Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-text-tertiary" /> : <ChevronDown className="w-5 h-5 text-text-tertiary" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-card-border pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-text-tertiary mb-2">CAPABILITIES</div>
                      <ul className="space-y-1">
                        {agent.capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-text-tertiary mb-2">INPUTS</div>
                        <div className="flex flex-wrap gap-1">
                          {agent.inputs.map((input, idx) => (
                            <Badge key={idx} className="bg-primary/10 text-primary border-primary/30 text-xs">
                              {input}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary mb-2">OUTPUTS</div>
                        <div className="flex flex-wrap gap-1">
                          {agent.outputs.map((output, idx) => (
                            <Badge key={idx} className="bg-accent/10 text-accent border-accent/30 text-xs">
                              {output}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary mb-2">STATISTICS</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background-secondary rounded p-2">
                            <div className="text-xs text-text-tertiary">Tasks Completed</div>
                            <div className="text-sm font-semibold text-text-primary">{agent.tasksCompleted.toLocaleString()}</div>
                          </div>
                          <div className="bg-background-secondary rounded p-2">
                            <div className="text-xs text-text-tertiary">Last Run</div>
                            <div className="text-sm font-semibold text-text-primary">{agent.lastRun.split(' ')[1]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {agent.dependencies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-card-border">
                      <div className="text-xs text-text-tertiary mb-2">DEPENDENCIES</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.dependencies.map((dep, idx) => (
                          <Badge key={idx} className="bg-warning/10 text-warning border-warning/30 text-xs">
                            <GitBranch className="w-3 h-3 mr-1" />
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Grid variant
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary">Filter by status:</span>
        <div className="flex gap-2">
          {['all', 'active', 'processing', 'idle'].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          
          return (
            <div
              key={agent.id}
              className="bg-card rounded-lg border border-card-border p-5 hover:border-card-hover hover:shadow-glow-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-lg bg-background-secondary" style={{ backgroundColor: `${agent.iconColor}10` }}>
                  <Icon className="w-6 h-6" style={{ color: agent.iconColor }} />
                </div>
                <Badge className={
                  agent.status === 'active'
                    ? 'bg-success/10 text-success border-success/30'
                    : agent.status === 'processing'
                    ? 'bg-warning/10 text-warning border-warning/30'
                    : 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30'
                }>
                  {agent.status}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-text-primary">{agent.name}</h4>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/30 text-xs mb-2">
                  {agent.code}
                </Badge>
                <p className="text-sm text-text-secondary line-clamp-2">{agent.description}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-tertiary">Confidence</span>
                    <span className="text-text-primary font-semibold">{agent.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-background-primary rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${agent.confidence}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">Tasks Completed</span>
                  <span className="text-text-primary font-semibold">{agent.tasksCompleted.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Clock className="w-3 h-3" />
                  {agent.lastRun}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
