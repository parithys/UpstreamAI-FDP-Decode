import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Wrench, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { toast } from 'sonner';

// U2: Operational & Technical Uncertainty Parameters
const operationalParameters = [
  {
    id: 'drilling-efficiency',
    name: 'Drilling Rate of Penetration',
    category: 'Drilling Operations',
    status: 'configured',
    min: 18,
    max: 35,
    mostLikely: 26,
    unit: 'm/hr',
    distribution: 'Triangular',
    confidence: 82,
    dataSource: 'Historical drilling data - Wells 1-16',
    impact: 'High - affects capex and schedule',
    lastUpdated: '2025-02-03',
    updatedBy: 'James Peterson'
  },
  {
    id: 'completion-cost',
    name: 'Well Completion Cost Variance',
    category: 'Completions',
    status: 'configured',
    min: 0.85,
    max: 1.25,
    mostLikely: 1.0,
    unit: 'multiplier',
    distribution: 'Normal',
    confidence: 75,
    dataSource: 'AFE variance analysis - 12 recent completions',
    impact: 'High - direct capex impact',
    lastUpdated: '2025-02-01',
    updatedBy: 'Lisa Chang'
  },
  {
    id: 'production-technology',
    name: 'Artificial Lift Performance',
    category: 'Production Technology',
    status: 'configured',
    min: 0.75,
    max: 0.98,
    mostLikely: 0.88,
    unit: 'efficiency ratio',
    distribution: 'Beta',
    confidence: 70,
    dataSource: 'ESP performance data - analog fields',
    impact: 'Medium - affects production rates',
    lastUpdated: '2025-01-29',
    updatedBy: 'Dr. Ahmed Hassan'
  },
  {
    id: 'facility-uptime',
    name: 'Facility Availability',
    category: 'Facilities Engineering',
    status: 'configured',
    min: 0.90,
    max: 0.98,
    mostLikely: 0.95,
    unit: 'uptime fraction',
    distribution: 'Normal',
    confidence: 88,
    dataSource: 'Historical facility performance - 5 years',
    impact: 'High - affects revenue stream',
    lastUpdated: '2025-02-04',
    updatedBy: 'Mohammed Al-Rashid'
  },
  {
    id: 'pipeline-capacity',
    name: 'Export Pipeline Capacity Limits',
    category: 'Infrastructure',
    status: 'partial',
    min: 45000,
    max: 52000,
    mostLikely: null,
    unit: 'bbl/day',
    distribution: 'Uniform',
    confidence: 55,
    dataSource: 'Pipeline operator specs - final capacity TBD',
    impact: 'Critical - production constraint',
    lastUpdated: '2025-01-28',
    updatedBy: 'David Martinez'
  },
  {
    id: 'workover-frequency',
    name: 'Well Intervention Frequency',
    category: 'Operations',
    status: 'configured',
    min: 1.2,
    max: 2.8,
    mostLikely: 1.8,
    unit: 'per well per year',
    distribution: 'Log-Normal',
    confidence: 68,
    dataSource: 'Field operations history - mature fields',
    impact: 'Medium - affects opex',
    lastUpdated: '2025-02-02',
    updatedBy: 'Sarah Chen'
  },
  {
    id: 'measurement-accuracy',
    name: 'Production Measurement Uncertainty',
    category: 'Metering & Allocation',
    status: 'pending',
    min: null,
    max: null,
    mostLikely: null,
    unit: '% error',
    distribution: 'Normal',
    confidence: 0,
    dataSource: 'Meter calibration data - pending validation',
    impact: 'Low - reporting accuracy',
    lastUpdated: null,
    updatedBy: null
  },
  {
    id: 'eor-recovery',
    name: 'EOR Technology Recovery Factor',
    category: 'Enhanced Recovery',
    status: 'partial',
    min: 0.05,
    max: 0.18,
    mostLikely: null,
    unit: 'incremental RF',
    distribution: 'Triangular',
    confidence: 45,
    dataSource: 'Pilot project results - limited data',
    impact: 'Very High - reserves impact',
    lastUpdated: '2025-01-30',
    updatedBy: 'Dr. John Williams'
  }
];

const technologyReadiness = [
  {
    id: 'esp-systems',
    name: 'Electric Submersible Pumps',
    trl: 9,
    status: 'Proven',
    description: 'Mature technology, extensive field experience',
    uncertainty: 'Low'
  },
  {
    id: 'smart-wells',
    name: 'Smart Well Completions',
    trl: 8,
    status: 'Commercial',
    description: 'Deployed in several UpstreamAI fields',
    uncertainty: 'Low-Medium'
  },
  {
    id: 'polymer-flood',
    name: 'Polymer EOR',
    trl: 6,
    status: 'Pilot Scale',
    description: 'Pilot successful, full-field pending',
    uncertainty: 'High'
  },
  {
    id: 'digital-twin',
    name: 'Real-time Digital Twin',
    trl: 7,
    status: 'Field Trial',
    description: 'Integration with SCADA in progress',
    uncertainty: 'Medium'
  }
];

export function OperationalUncertainty() {
  const { openChat } = useChat();
  const [isSaving, setIsSaving] = useState(false);

  const configured = operationalParameters.filter(p => p.status === 'configured').length;
  const partial = operationalParameters.filter(p => p.status === 'partial').length;
  const pending = operationalParameters.filter(p => p.status === 'pending').length;
  const total = operationalParameters.length;
  const readiness = Math.round((configured + partial * 0.5) / total * 100);

  const handleSaveConfiguration = () => {
    setIsSaving(true);
    toast.info('Saving operational parameters...', {
      description: 'Validating technical constraints'
    });

    setTimeout(() => {
      setIsSaving(false);
      toast.success('Configuration saved', {
        description: 'Operational uncertainty ready for AI Led integration'
      });
    }, 1500);
  };

  const handleRunSensitivity = () => {
    toast.info('Running sensitivity analysis...', {
      description: 'Testing parameter impact on NPV and production'
    });

    setTimeout(() => {
      toast.success('Sensitivity analysis complete', {
        description: 'Facility uptime and EOR recovery are highest impact parameters'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Wrench className="w-6 h-6" style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-1">
                Operational & Technical Uncertainty
              </h1>
              <p className="text-sm text-text-secondary">
                Processing technology, methodology, and tool reliability parameters
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRunSensitivity}>
              Run Sensitivity Analysis
            </Button>
            <Button variant="outline" onClick={openChat}>
              ✨ AI Recommendations
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveConfiguration}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="text-text-tertiary text-sm mb-2">Configuration Status</div>
            <div className="text-2xl font-semibold text-text-primary mb-1">
              {readiness}%
            </div>
            <p className="text-xs text-text-secondary">
              {configured} configured | {partial} partial | {pending} pending
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="text-text-tertiary text-sm mb-2">Average Confidence</div>
            <div className="text-2xl font-semibold text-text-primary mb-1">
              72%
            </div>
            <p className="text-xs text-text-secondary">
              Based on historical data and analog fields
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="text-text-tertiary text-sm mb-2">High Impact Parameters</div>
            <div className="text-2xl font-semibold text-text-primary mb-1">
              4 / 8
            </div>
            <p className="text-xs text-text-secondary">
              Critical parameters affecting capex/opex/revenue
            </p>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Data Sources & Applications</h2>
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-tertiary mb-2">Reservoir Simulation</div>
                <div className="text-text-primary font-semibold mb-1">Eclipse, tNavigator</div>
                <div className="text-xs text-text-secondary">Production forecasting, well performance</div>
              </div>
              <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-tertiary mb-2">Well Planning</div>
                <div className="text-text-primary font-semibold mb-1">DrillPlan</div>
                <div className="text-xs text-text-secondary">Drilling optimization, cost estimation</div>
              </div>
              <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-tertiary mb-2">Production Data</div>
                <div className="text-text-primary font-semibold mb-1">DecisionSpace</div>
                <div className="text-xs text-text-secondary">Historical production, well surveillance</div>
              </div>
              <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
                <div className="text-xs text-text-tertiary mb-2">Next-Gen Simulation</div>
                <div className="text-text-primary font-semibold mb-1">Intersect</div>
                <div className="text-xs text-text-secondary">Advanced physics, complex reservoirs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Readiness Level */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Technology Readiness Assessment
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {technologyReadiness.map((tech) => (
              <div 
                key={tech.id}
                className="bg-card border border-card-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-text-primary font-medium">{tech.name}</div>
                  <Badge 
                    className={`${
                      tech.trl >= 8 ? 'bg-success' : 
                      tech.trl >= 7 ? 'bg-warning' : 
                      'bg-text-tertiary'
                    } text-white border-0`}
                    size="sm"
                  >
                    TRL {tech.trl}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary mb-2">{tech.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">{tech.status}</span>
                  <span className="text-xs text-text-tertiary">
                    Uncertainty: {tech.uncertainty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parameters List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Uncertainty Parameters ({total} total)
          </h2>

          <div className="space-y-3">
            {operationalParameters.map((param) => (
              <div
                key={param.id}
                className="bg-card border border-card-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {param.status === 'configured' ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : param.status === 'partial' ? (
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-text-primary font-medium mb-1">{param.name}</div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>{param.category}</span>
                        <span>•</span>
                        <span>{param.distribution} distribution</span>
                        <span>•</span>
                        <span className={`font-medium ${
                          param.impact === 'Critical' || param.impact === 'Very High' ? 'text-error' :
                          param.impact === 'High' ? 'text-warning' :
                          'text-text-tertiary'
                        }`}>
                          {param.impact} impact
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {param.status === 'configured' && (
                      <div className="text-right">
                        <div className="text-sm text-text-primary font-medium">
                          {param.min} – {param.max} {param.unit}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          ML: {param.mostLikely} | {param.confidence}% confidence
                        </div>
                      </div>
                    )}
                    <Badge 
                      className={`${
                        param.status === 'configured' ? 'bg-success' :
                        param.status === 'partial' ? 'bg-warning' :
                        'bg-text-tertiary'
                      } text-white border-0`}
                      size="sm"
                    >
                      {param.status === 'configured' ? 'Ready' :
                       param.status === 'partial' ? 'Incomplete' :
                       'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-text-secondary mb-2">
                  <span className="text-text-tertiary">Data Source:</span> {param.dataSource}
                </div>

                {param.lastUpdated && (
                  <div className="text-xs text-text-tertiary">
                    Last updated {param.lastUpdated} by {param.updatedBy}
                  </div>
                )}

                {param.status !== 'configured' && (
                  <div className="mt-3 pt-3 border-t border-card-border">
                    <Button variant="primary" size="sm">
                      Configure Parameter
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity Impact Matrix */}
        <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary mb-6">
          <h3 className="text-text-primary font-semibold mb-3">
            Preliminary Sensitivity Ranking
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-text-primary font-medium mb-2">Highest Impact on NPV</div>
              <ol className="text-text-secondary space-y-1 list-decimal list-inside">
                <li>Facility Availability (uptime)</li>
                <li>EOR Technology Recovery</li>
                <li>Export Pipeline Capacity</li>
              </ol>
            </div>
            <div>
              <div className="text-text-primary font-medium mb-2">Highest Impact on Capex</div>
              <ol className="text-text-secondary space-y-1 list-decimal list-inside">
                <li>Well Completion Cost Variance</li>
                <li>Drilling Rate of Penetration</li>
                <li>Workover Frequency</li>
              </ol>
            </div>
            <div>
              <div className="text-text-primary font-medium mb-2">Data Quality Priority</div>
              <ol className="text-text-secondary space-y-1 list-decimal list-inside">
                <li>Pipeline Capacity (finalize specs)</li>
                <li>EOR Recovery Factor (more pilots)</li>
                <li>Production Measurement (validation)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-text-primary font-semibold mb-2">AI Assistant Recommendations</div>
              <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
                <li>
                  <strong>Pipeline Capacity:</strong> Finalize export capacity specifications with pipeline operator. 
                  Current uncertainty creates production constraint risk.
                </li>
                <li>
                  <strong>EOR Recovery Factor:</strong> Consider expanding pilot scope to 2 additional wells 
                  to improve confidence from 45% to target 75%.
                </li>
                <li>
                  <strong>Facility Uptime:</strong> High confidence (88%) and high impact parameter. 
                  Recommend sensitivity analysis on downside scenarios (0.90-0.92 range).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link to="/uncertainty/subsurface">
            <Button variant="ghost">
              ← Back to Subsurface Uncertainty
            </Button>
          </Link>
          <Link to="/uncertainty/market-volatility">
            <Button variant="primary">
              Next: Market Volatility →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}