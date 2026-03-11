import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AIAgents, aiAgents } from '../components/AIAgents';
import {
  Bot,
  Activity,
  TrendingUp,
  AlertCircle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLayer } from '../context/LayerContext';
import { LayerNavigation } from '../components/layers/LayerNavigation';

export function AIAgentsManagement() {
  const { globalLayerPreference, setGlobalLayerPreference } = useLayer();
  const activeAgents = aiAgents.filter(a => a.status === 'active').length;
  const processingAgents = aiAgents.filter(a => a.status === 'processing').length;
  const avgConfidence = Math.round(aiAgents.reduce((sum, a) => sum + a.confidence, 0) / aiAgents.length);
  const totalTasks = aiAgents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  const handleExportStatusReport = () => {
    toast.success('Exporting status report...', {
      description: 'AI Agents status report will download shortly as PDF'
    });
  };

  const handleAgentSettings = () => {
    toast.info('Agent Settings', {
      description: 'Opening agent configuration panel'
    });
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header with Layer Navigation */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">AI Agents Management</h1>
            <p className="text-sm text-text-secondary">
              Monitor and manage all 12 AI agents across the UpstreamAI FDP platform
            </p>
          </div>
          <div className="flex gap-3">
            <LayerNavigation
              currentLayer={globalLayerPreference}
              availableLayers={[1, 2, 3]}
              onLayerChange={(layer) => setGlobalLayerPreference(layer)}
              variant="buttons"
            />
            {globalLayerPreference === 3 && (
              <>
                <Button variant="outline" onClick={handleExportStatusReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Status Report
                </Button>
                <Button variant="outline" onClick={handleAgentSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Agent Settings
                </Button>
              </>
            )}
          </div>
        </div>

        {/* LAYER 1 (L1): EXECUTIVE VIEW - High-level AI system status */}
        {globalLayerPreference === 1 && (
          <div className="space-y-6">
            {/* System Health Overview */}
            <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">AI System Status</h3>
                <Badge variant="success" size="lg">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  All Systems Operational
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                  <div className="text-sm text-text-secondary mb-1">Active Agents</div>
                  <div className="text-3xl font-bold text-success">{activeAgents}/{aiAgents.length}</div>
                  <div className="text-xs text-text-tertiary mt-1">{Math.round((activeAgents / aiAgents.length) * 100)}% operational</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Avg Confidence</div>
                  <div className="text-3xl font-bold text-text-primary">{avgConfidence}%</div>
                  <div className="text-xs text-success mt-1">High reliability</div>
                </div>
                <div className="p-4 bg-background-secondary rounded-lg border border-card-border">
                  <div className="text-sm text-text-secondary mb-1">Tasks Today</div>
                  <div className="text-3xl font-bold text-text-primary">{totalTasks.toLocaleString()}</div>
                  <div className="text-xs text-text-tertiary mt-1">Completed</div>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
                  <div className="text-sm text-text-secondary mb-1">Processing</div>
                  <div className="text-3xl font-bold text-warning">{processingAgents}</div>
                  <div className="text-xs text-text-tertiary mt-1">Active workflows</div>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed">
                All 12 AI agents are operational and performing within expected parameters. The AI-powered FDP platform is processing 
                {' '}<span className="text-text-primary font-medium">12.4 million scenarios</span> with an average confidence level of 
                {' '}<span className="text-text-primary font-medium">{avgConfidence}%</span>. System uptime and reliability metrics exceed target thresholds.
              </p>
            </div>

            {/* Key Agent Categories */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-5 border-l-4 border-primary border border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="text-text-primary font-semibold">Data & Analysis</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Foundation agents handling data validation, history matching, and domain-specific analysis
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">5 agents active</span>
                  <Badge variant="success" size="sm">Operational</Badge>
                </div>
              </div>

              <div className="bg-card rounded-lg p-5 border-l-4 border-accent border border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-accent" />
                  <h3 className="text-text-primary font-semibold">Simulation & Integration</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  AI Led simulation engine processing 12.4M scenarios with cross-domain integration
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">3 agents active</span>
                  <Badge variant="warning" size="sm">Processing</Badge>
                </div>
              </div>

              <div className="bg-card rounded-lg p-5 border-l-4 border-success border border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="text-text-primary font-semibold">Decision & Governance</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Insight generation, decision support, governance, and automated report creation
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">4 agents active</span>
                  <Badge variant="success" size="sm">Operational</Badge>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✨</span>
                <h3 className="text-text-primary font-semibold">AI Platform Summary</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                The UpstreamAI FDP platform operates 12 specialized agents working in coordinated layers from data validation through 
                governance. The system has achieved {Math.round((activeAgents / aiAgents.length) * 100)}% operational status with 
                {' '}{avgConfidence}% average confidence across all processing tasks. Today's workload includes {totalTasks.toLocaleString()} completed 
                tasks with {processingAgents} agents actively processing AI Led simulation scenarios.
              </p>
            </div>
          </div>
        )}

        {/* LAYER 2 (L2): ASSET MANAGER VIEW - Agent categories with operational metrics */}
        {globalLayerPreference === 2 && (
          <div className="space-y-6">
            {/* Overall Status Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <Badge className="bg-success/10 text-success border-success/30">
                    {Math.round((activeAgents / aiAgents.length) * 100)}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{activeAgents}/{aiAgents.length}</div>
                <div className="text-sm text-text-secondary">Active Agents</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/30">
                    Live
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{processingAgents}</div>
                <div className="text-sm text-text-secondary">Processing Now</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{avgConfidence}%</div>
                <div className="text-sm text-text-secondary">Average Confidence</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <Badge className="bg-accent/10 text-accent border-accent/30">
                    Today
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{totalTasks.toLocaleString()}</div>
                <div className="text-sm text-text-secondary">Tasks Completed</div>
              </div>
            </div>

            {/* Simplified Agent Categories */}
            <div className="bg-card rounded-lg border border-card-border p-6 shadow-glow min-h-[600px]">
              <h3 className="text-lg font-semibold text-text-primary mb-8">Agent Categories</h3>
              <div className="space-y-10">
                {/* Foundation */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <h4 className="text-text-primary font-semibold text-base">Foundation Layer</h4>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-success/10 text-success border-0 hover:bg-success/20">1/1 Active</Badge>
                  </div>
                  <p className="text-sm text-text-secondary pl-6">Data Quality Agent validating all platform inputs</p>
                </div>

                {/* Domain Analysis */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <h4 className="text-text-primary font-semibold text-base">Domain Analysis Layer</h4>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-success/10 text-success border-0 hover:bg-success/20">4/4 Active</Badge>
                  </div>
                  <p className="text-sm text-text-secondary pl-6">History Matching, Subsurface, Operational, Market Analysis</p>
                </div>

                {/* Integration & Simulation */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                      <h4 className="text-text-primary font-semibold text-base">Integration & Simulation Layer</h4>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-warning/10 text-warning border-0 hover:bg-warning/20">3/3 Processing</Badge>
                  </div>
                  <p className="text-sm text-text-secondary pl-6">Cross-Domain, AI Led Simulation (12.4M), Traditional (3,847)</p>
                </div>

                {/* Decision Support */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <h4 className="text-text-primary font-semibold text-base">Decision Support Layer</h4>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-success/10 text-success border-0 hover:bg-success/20">2/2 Active</Badge>
                  </div>
                  <p className="text-sm text-text-secondary pl-6">Insight Generation, Decision Support</p>
                </div>

                {/* Governance & Reporting */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <h4 className="text-text-primary font-semibold text-base">Governance & Reporting Layer</h4>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-success/10 text-success border-0 hover:bg-success/20">2/2 Active</Badge>
                  </div>
                  <p className="text-sm text-text-secondary pl-6">Governance & Audit, Report Generation</p>
                </div>
              </div>
            </div>

            {/* Agent Performance Highlights */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-card-border p-5">
                <h4 className="text-text-primary font-semibold mb-3">Top Performing Agents</h4>
                <div className="space-y-2">
                  {aiAgents
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 3)
                    .map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                        <span className="text-sm text-text-primary">{agent.name}</span>
                        <Badge variant="success" size="sm">{agent.confidence}%</Badge>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <h4 className="text-text-primary font-semibold mb-3">Most Active Agents</h4>
                <div className="space-y-2">
                  {aiAgents
                    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
                    .slice(0, 3)
                    .map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                        <span className="text-sm text-text-primary">{agent.name}</span>
                        <span className="text-sm text-text-secondary">{agent.tasksCompleted.toLocaleString()} tasks</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYER 3 (L3): RESERVOIR ENGINEER VIEW - Full technical detail with dependency map */}
        {globalLayerPreference === 3 && (
          <>
            {/* Overall Status Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <Badge className="bg-success/10 text-success border-success/30">
                    {Math.round((activeAgents / aiAgents.length) * 100)}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{activeAgents}/{aiAgents.length}</div>
                <div className="text-sm text-text-secondary">Active Agents</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/30">
                    Live
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{processingAgents}</div>
                <div className="text-sm text-text-secondary">Processing Now</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{avgConfidence}%</div>
                <div className="text-sm text-text-secondary">Average Confidence</div>
              </div>

              <div className="bg-card rounded-lg border border-card-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <Badge className="bg-accent/10 text-accent border-accent/30">
                    Today
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{totalTasks.toLocaleString()}</div>
                <div className="text-sm text-text-secondary">Tasks Completed</div>
              </div>
            </div>

            {/* Agent Dependencies Map */}
            <div className="bg-card rounded-lg border border-card-border p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Agent Dependency Flow</h3>
              <div className="bg-background-secondary rounded-lg p-6 border border-card-border">
                <div className="space-y-6">
                  {/* Layer 1: Foundation Agents */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-3">FOUNDATION LAYER</div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-card rounded-lg p-3 border-2 border-primary/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-01: Data Quality</span>
                        </div>
                        <div className="text-xs text-text-secondary">Validates all data inputs</div>
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Domain-Specific Agents */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-3">DOMAIN ANALYSIS LAYER</div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-accent/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-xs font-semibold text-text-primary">AG-02</span>
                        </div>
                        <div className="text-xs text-text-secondary">History Matching</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-accent/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-xs font-semibold text-text-primary">AG-03</span>
                        </div>
                        <div className="text-xs text-text-secondary">Subsurface</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-accent/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-xs font-semibold text-text-primary">AG-04</span>
                        </div>
                        <div className="text-xs text-text-secondary">Operational</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-accent/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-xs font-semibold text-text-primary">AG-05</span>
                        </div>
                        <div className="text-xs text-text-secondary">Market</div>
                      </div>
                    </div>
                  </div>

                  {/* Layer 3: Integration & Simulation */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-3">INTEGRATION & SIMULATION LAYER</div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-primary/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-06</span>
                        </div>
                        <div className="text-xs text-text-secondary">Cross-Domain Integration</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border-2 border-primary/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-warning" />
                          <span className="text-sm font-semibold text-text-primary">AG-07</span>
                        </div>
                        <div className="text-xs text-text-secondary">AI Led Simulation (12.4M)</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-primary/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-08</span>
                        </div>
                        <div className="text-xs text-text-secondary">Traditional Sim (3,847)</div>
                      </div>
                    </div>
                  </div>

                  {/* Layer 4: Decision Support */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-3">DECISION SUPPORT LAYER</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-success/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-09</span>
                        </div>
                        <div className="text-xs text-text-secondary">Insight Generation</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-success/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-10</span>
                        </div>
                        <div className="text-xs text-text-secondary">Decision Support</div>
                      </div>
                    </div>
                  </div>

                  {/* Layer 5: Governance & Reporting */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-3">GOVERNANCE & REPORTING LAYER</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-danger/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-11</span>
                        </div>
                        <div className="text-xs text-text-secondary">Governance & Audit</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-accent/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-semibold text-text-primary">AG-12</span>
                        </div>
                        <div className="text-xs text-text-secondary">Report Generation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Agent List */}
            <div className="bg-card rounded-lg border border-card-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">All AI Agents</h3>
              <AIAgents variant="list" showDetails={true} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}