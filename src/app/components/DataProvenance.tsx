import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Database,
  GitBranch,
  ArrowRight,
  Box,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Layers,
  Network,
  Search,
  Filter,
  TrendingUp,
  Zap
} from 'lucide-react';

// Layer 1: High-Level Provenance (System-to-System)
interface HighLevelProvenance {
  id: string;
  dataAsset: string;
  sourceSystem: string;
  targetSystem: string;
  transformationType: string;
  timestamp: string;
  recordCount: number;
  quality: number;
  status: 'success' | 'warning' | 'failed';
  dependencies: string[];
}

// Layer 2: Detailed Provenance (Field-Level)
interface DetailedProvenance {
  id: string;
  field: string;
  sourceField: string;
  sourceSystem: string;
  transformation: string;
  formula?: string;
  timestamp: string;
  modifiedBy: string;
  validationRules: string[];
  previousValue?: string;
  currentValue: string;
  confidence: number;
  dataQuality: number;
}

interface DataLineageNode {
  id: string;
  name: string;
  type: 'source' | 'transformation' | 'storage' | 'output';
  system: string;
  recordCount?: number;
  quality?: number;
  timestamp?: string;
  children?: string[];
}

const highLevelProvenance: HighLevelProvenance[] = [
  {
    id: 'HL-001',
    dataAsset: 'Geological Static Model',
    sourceSystem: 'Petrel v2023.4',
    targetSystem: 'Eclipse Reservoir Simulator',
    transformationType: 'Grid Export & Upscaling',
    timestamp: '2025-02-06 12:48:30',
    recordCount: 1200000,
    quality: 96,
    status: 'success',
    dependencies: ['Seismic Interpretation', 'Well Log Data', 'Core Analysis']
  },
  {
    id: 'HL-002',
    dataAsset: 'Production History',
    sourceSystem: 'PI System / SCADA',
    targetSystem: 'Eclipse History Matching',
    transformationType: 'Time-Series Aggregation',
    timestamp: '2025-02-06 08:15:22',
    recordCount: 48000,
    quality: 98,
    status: 'success',
    dependencies: ['Flow Meters', 'Pressure Gauges', 'Operations Database']
  },
  {
    id: 'HL-003',
    dataAsset: 'Well Completion Data',
    sourceSystem: 'Operations Database',
    targetSystem: 'tNavigator Well Models',
    transformationType: 'Data Standardization',
    timestamp: '2025-02-05 16:20:15',
    recordCount: 342,
    quality: 94,
    status: 'success',
    dependencies: ['Drilling Reports', 'Completion Diagrams', 'Equipment Specs']
  },
  {
    id: 'HL-004',
    dataAsset: 'Economic Parameters',
    sourceSystem: 'Corporate Planning System',
    targetSystem: 'AI FDP Economics Module',
    transformationType: 'Price Curve Interpolation',
    timestamp: '2025-02-06 10:30:45',
    recordCount: 240,
    quality: 92,
    status: 'success',
    dependencies: ['Market Data Feed', 'Contract Terms', 'Fiscal Models']
  },
  {
    id: 'HL-005',
    dataAsset: 'Seismic Attributes',
    sourceSystem: 'Petrel Seismic Interpretation',
    targetSystem: 'Uncertainty Analysis Module',
    transformationType: 'Attribute Extraction',
    timestamp: '2025-02-06 14:10:33',
    recordCount: 850000,
    quality: 88,
    status: 'warning',
    dependencies: ['3D Seismic Survey', 'Velocity Model', 'Horizon Picks']
  },
  {
    id: 'HL-006',
    dataAsset: 'AI Training Dataset',
    sourceSystem: 'Eclipse Simulation Results',
    targetSystem: 'AI Led Model Training',
    transformationType: 'Feature Engineering',
    timestamp: '2025-02-06 09:18:45',
    recordCount: 12400000,
    quality: 95,
    status: 'success',
    dependencies: ['Simulation Grid', 'Production Forecasts', 'Uncertainty Ranges']
  }
];

const detailedProvenance: DetailedProvenance[] = [
  {
    id: 'DT-001',
    field: 'Permeability_X',
    sourceField: 'PERM_I',
    sourceSystem: 'Petrel Static Model',
    transformation: 'Unit Conversion & Upscaling',
    formula: 'PERM_X = AVERAGE(PERM_I) * 1.0 (mD)',
    timestamp: '2025-02-06 12:48:30',
    modifiedBy: 'David Chen',
    validationRules: ['Range: 1-500 mD', 'Log-Normal Distribution', 'Spatial Continuity Check'],
    previousValue: '125.4 mD',
    currentValue: '132.8 mD',
    confidence: 94,
    dataQuality: 96
  },
  {
    id: 'DT-002',
    field: 'Porosity',
    sourceField: 'PHIT',
    sourceSystem: 'Petrophysical Analysis',
    transformation: 'Quality Filtering & Averaging',
    formula: 'PORO = FILTER(PHIT, quality>0.8) → AVERAGE',
    timestamp: '2025-02-06 12:45:18',
    modifiedBy: 'Sarah Mitchell',
    validationRules: ['Range: 0.05-0.35', 'Cross-Validation with Core Data', 'Outlier Detection'],
    previousValue: '0.186',
    currentValue: '0.192',
    confidence: 98,
    dataQuality: 97
  },
  {
    id: 'DT-003',
    field: 'Oil_Production_Rate',
    sourceField: 'WOPR',
    sourceSystem: 'PI System',
    transformation: 'Time-Series Smoothing',
    formula: 'QOIL = MOVING_AVERAGE(WOPR, window=7days)',
    timestamp: '2025-02-06 08:15:22',
    modifiedBy: 'Auto Sync',
    validationRules: ['Non-Negative', 'Rate of Change < 20%/day', 'Material Balance Check'],
    previousValue: '8450 bbl/d',
    currentValue: '8680 bbl/d',
    confidence: 99,
    dataQuality: 98
  },
  {
    id: 'DT-004',
    field: 'Oil_Price_Forecast',
    sourceField: 'Brent_Crude_Future',
    sourceSystem: 'Market Data Feed',
    transformation: 'Price Adjustment & Interpolation',
    formula: 'PRICE = Brent * 0.95 + DIFFERENTIAL',
    timestamp: '2025-02-06 10:30:45',
    modifiedBy: 'Economics Team',
    validationRules: ['Range: $40-$120/bbl', 'Consistency with Historical Trends'],
    previousValue: '$78.50/bbl',
    currentValue: '$82.30/bbl',
    confidence: 85,
    dataQuality: 92
  },
  {
    id: 'DT-005',
    field: 'Net_to_Gross',
    sourceField: 'NTG_LOGS',
    sourceSystem: 'Well Log Interpretation',
    transformation: 'Cutoff Application & Averaging',
    formula: 'NTG = (VSH < 0.4) ? 1.0 : 0.0 → AVERAGE',
    timestamp: '2025-02-06 11:20:55',
    modifiedBy: 'David Chen',
    validationRules: ['Range: 0.0-1.0', 'Core Calibration', 'Facies Consistency'],
    previousValue: '0.72',
    currentValue: '0.68',
    confidence: 91,
    dataQuality: 94
  },
  {
    id: 'DT-006',
    field: 'Water_Saturation',
    sourceField: 'SW_ARCHIE',
    sourceSystem: 'Petrophysical Model',
    transformation: 'Archie Equation Application',
    formula: 'SW = (a*Rw / (PHI^m * Rt))^(1/n)',
    timestamp: '2025-02-06 11:25:12',
    modifiedBy: 'Sarah Mitchell',
    validationRules: ['Range: 0.0-1.0', 'SW + SH = 1.0', 'Capillary Pressure Validation'],
    previousValue: '0.28',
    currentValue: '0.25',
    confidence: 88,
    dataQuality: 93
  }
];

const lineageGraph: DataLineageNode[] = [
  {
    id: 'source-1',
    name: 'Petrel Static Model',
    type: 'source',
    system: 'Petrel v2023.4',
    recordCount: 1200000,
    quality: 96,
    timestamp: '2025-02-06 12:00',
    children: ['transform-1', 'transform-2']
  },
  {
    id: 'source-2',
    name: 'PI System',
    type: 'source',
    system: 'SCADA',
    recordCount: 48000,
    quality: 98,
    timestamp: '2025-02-06 08:00',
    children: ['transform-3']
  },
  {
    id: 'source-3',
    name: 'Operations DB',
    type: 'source',
    system: 'SQL Database',
    recordCount: 342,
    quality: 94,
    timestamp: '2025-02-05 16:00',
    children: ['transform-4']
  },
  {
    id: 'transform-1',
    name: 'Grid Upscaling',
    type: 'transformation',
    system: 'Petrel',
    children: ['storage-1']
  },
  {
    id: 'transform-2',
    name: 'Property Mapping',
    type: 'transformation',
    system: 'Petrel',
    children: ['storage-1']
  },
  {
    id: 'transform-3',
    name: 'Time-Series Aggregation',
    type: 'transformation',
    system: 'Python Script',
    children: ['storage-2']
  },
  {
    id: 'transform-4',
    name: 'Data Standardization',
    type: 'transformation',
    system: 'ETL Pipeline',
    children: ['storage-3']
  },
  {
    id: 'storage-1',
    name: 'Simulation Grid',
    type: 'storage',
    system: 'Eclipse',
    recordCount: 1200000,
    quality: 96,
    children: ['output-1', 'output-2']
  },
  {
    id: 'storage-2',
    name: 'Production History',
    type: 'storage',
    system: 'Data Warehouse',
    recordCount: 48000,
    quality: 98,
    children: ['output-1']
  },
  {
    id: 'storage-3',
    name: 'Well Models',
    type: 'storage',
    system: 'tNavigator',
    recordCount: 342,
    quality: 94,
    children: ['output-1']
  },
  {
    id: 'output-1',
    name: 'Reservoir Simulation',
    type: 'output',
    system: 'Eclipse/tNavigator',
    children: ['output-3']
  },
  {
    id: 'output-2',
    name: 'Uncertainty Analysis',
    type: 'output',
    system: 'Monte Carlo Engine',
    children: ['output-3']
  },
  {
    id: 'output-3',
    name: 'AI Training Dataset',
    type: 'output',
    system: 'AI FDP Platform',
    recordCount: 12400000,
    quality: 95
  }
];

interface DataProvenanceProps {
  variant?: 'full' | 'summary' | 'lineage';
  assetId?: string;
}

export function DataProvenance({ variant = 'full', assetId }: DataProvenanceProps) {
  const [selectedLayer, setSelectedLayer] = useState<'high-level' | 'detailed'>('high-level');
  const [selectedAsset, setSelectedAsset] = useState<HighLevelProvenance | null>(null);
  const [selectedField, setSelectedField] = useState<DetailedProvenance | null>(null);
  const [showLineage, setShowLineage] = useState(false);

  if (variant === 'summary') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Data Provenance</h3>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30">
            2-Layer System
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">High-Level Provenance</span>
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {highLevelProvenance.length}
            </div>
            <div className="text-xs text-text-secondary">System-to-system data flows</div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4 border border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-text-primary">Detailed Provenance</span>
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {detailedProvenance.length}
            </div>
            <div className="text-xs text-text-secondary">Field-level transformations</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'lineage') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Data Lineage Graph</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Graph
          </Button>
        </div>
        <div className="bg-background-secondary rounded-lg p-6 border border-card-border">
          <div className="space-y-8">
            {/* Sources */}
            <div>
              <div className="text-xs text-text-tertiary mb-3">SOURCE SYSTEMS</div>
              <div className="flex gap-4">
                {lineageGraph.filter(n => n.type === 'source').map((node) => (
                  <div
                    key={node.id}
                    className="bg-card rounded-lg p-3 border-2 border-primary/50 flex-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-text-primary">{node.name}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{node.system}</div>
                    {node.quality && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex-1 h-1.5 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${node.quality}%` }} />
                        </div>
                        <span className="text-xs text-text-primary">{node.quality}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-text-tertiary" />
            </div>

            {/* Transformations */}
            <div>
              <div className="text-xs text-text-tertiary mb-3">TRANSFORMATIONS</div>
              <div className="grid grid-cols-4 gap-3">
                {lineageGraph.filter(n => n.type === 'transformation').map((node) => (
                  <div
                    key={node.id}
                    className="bg-card rounded-lg p-3 border border-accent/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-accent" />
                      <span className="text-xs font-semibold text-text-primary">{node.name}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{node.system}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-text-tertiary" />
            </div>

            {/* Storage */}
            <div>
              <div className="text-xs text-text-tertiary mb-3">DATA STORAGE</div>
              <div className="flex gap-4">
                {lineageGraph.filter(n => n.type === 'storage').map((node) => (
                  <div
                    key={node.id}
                    className="bg-card rounded-lg p-3 border border-card-border flex-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Box className="w-4 h-4 text-text-primary" />
                      <span className="text-sm font-semibold text-text-primary">{node.name}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{node.system}</div>
                    {node.quality && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex-1 h-1.5 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${node.quality}%` }} />
                        </div>
                        <span className="text-xs text-text-primary">{node.quality}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-text-tertiary" />
            </div>

            {/* Outputs */}
            <div>
              <div className="text-xs text-text-tertiary mb-3">OUTPUTS & DECISIONS</div>
              <div className="flex gap-4">
                {lineageGraph.filter(n => n.type === 'output').map((node) => (
                  <div
                    key={node.id}
                    className="bg-card rounded-lg p-3 border-2 border-success/50 flex-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm font-semibold text-text-primary">{node.name}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{node.system}</div>
                    {node.quality && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex-1 h-1.5 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${node.quality}%` }} />
                        </div>
                        <span className="text-xs text-text-primary">{node.quality}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* Layer Selection */}
      <div className="bg-card rounded-lg border border-card-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Provenance Layer:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedLayer === 'high-level' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedLayer('high-level')}
              >
                <Network className="w-4 h-4 mr-2" />
                Layer 1: High-Level
              </Button>
              <Button
                variant={selectedLayer === 'detailed' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedLayer('detailed')}
              >
                <Database className="w-4 h-4 mr-2" />
                Layer 2: Detailed
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowLineage(!showLineage)}>
            <GitBranch className="w-4 h-4 mr-2" />
            {showLineage ? 'Hide' : 'Show'} Lineage Graph
          </Button>
        </div>
      </div>

      {/* Lineage Graph */}
      {showLineage && <DataProvenance variant="lineage" />}

      {/* Layer 1: High-Level Provenance */}
      {selectedLayer === 'high-level' && (
        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Layer 1: High-Level Data Provenance (System-to-System)
            </h3>
            <Badge className="bg-primary/10 text-primary border-primary/30">
              {highLevelProvenance.length} data flows tracked
            </Badge>
          </div>

          <div className="space-y-3">
            {highLevelProvenance.map((item) => (
              <div
                key={item.id}
                className="bg-background-secondary rounded-lg p-4 border border-card-border hover:border-card-hover transition-all cursor-pointer"
                onClick={() => setSelectedAsset(selectedAsset?.id === item.id ? null : item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-text-primary">{item.dataAsset}</h4>
                      <Badge className={
                        item.status === 'success'
                          ? 'bg-success/10 text-success border-success/30'
                          : item.status === 'warning'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : 'bg-danger/10 text-danger border-danger/30'
                      } size="sm">
                        {item.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {item.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-primary" />
                        <span>{item.sourceSystem}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" />
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span>{item.transformationType}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" />
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-success" />
                        <span>{item.targetSystem}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-text-tertiary">Records</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {item.recordCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-tertiary">Quality</div>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${item.quality}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{item.quality}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAsset?.id === item.id && (
                  <div className="mt-4 pt-4 border-t border-card-border">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-text-tertiary mb-2">Timestamp</div>
                        <div className="flex items-center gap-2 text-sm text-text-primary">
                          <Clock className="w-4 h-4 text-text-tertiary" />
                          {item.timestamp}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary mb-2">Upstream Dependencies</div>
                        <div className="flex flex-wrap gap-1">
                          {item.dependencies.map((dep, idx) => (
                            <Badge key={idx} className="bg-primary/10 text-primary border-primary/30 text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 2: Detailed Provenance */}
      {selectedLayer === 'detailed' && (
        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Layer 2: Detailed Data Provenance (Field-Level)
            </h3>
            <Badge className="bg-accent/10 text-accent border-accent/30">
              {detailedProvenance.length} field transformations tracked
            </Badge>
          </div>

          <div className="space-y-3">
            {detailedProvenance.map((item) => (
              <div
                key={item.id}
                className="bg-background-secondary rounded-lg p-4 border border-card-border hover:border-card-hover transition-all cursor-pointer"
                onClick={() => setSelectedField(selectedField?.id === item.id ? null : item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-text-primary">{item.field}</h4>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm text-text-secondary">{item.sourceField}</span>
                    </div>
                    <div className="text-xs text-text-secondary mb-1">
                      {item.transformation} • {item.sourceSystem}
                    </div>
                    {item.formula && (
                      <div className="bg-background-primary rounded px-2 py-1 text-xs text-text-primary font-mono mt-2">
                        {item.formula}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-text-tertiary">Confidence</div>
                      <div className="text-sm font-semibold text-text-primary">{item.confidence}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-tertiary">Quality</div>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-2 bg-background-primary rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${item.dataQuality}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{item.dataQuality}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedField?.id === item.id && (
                  <div className="mt-4 pt-4 border-t border-card-border space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-text-tertiary mb-1">Previous Value</div>
                        <div className="text-sm text-danger line-through">{item.previousValue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary mb-1">Current Value</div>
                        <div className="text-sm text-success font-semibold">{item.currentValue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-tertiary mb-1">Modified By</div>
                        <div className="text-sm text-text-primary">{item.modifiedBy}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-tertiary mb-2">Validation Rules Applied</div>
                      <div className="flex flex-wrap gap-1">
                        {item.validationRules.map((rule, idx) => (
                          <Badge key={idx} className="bg-success/10 text-success border-success/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
