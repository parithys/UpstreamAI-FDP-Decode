import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, Eye, Layers } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { toast } from 'sonner';

const geophysicalItems = [
  {
    num: 1,
    item: '3D Seismic Volume - Primary',
    type: 'Seismic',
    status: 'Complete',
    quality: 'Excellent',
    coverage: '100%',
    resolution: '12.5m x 12.5m',
    acquisition: '2023-Q2',
    processing: 'Pre-Stack Depth Migration',
    updated: 'Jan 15',
    size: '2.4 TB'
  },
  {
    num: 2,
    item: '3D Seismic Volume - Enhanced',
    type: 'Seismic',
    status: 'Complete',
    quality: 'Excellent',
    coverage: '100%',
    resolution: '12.5m x 12.5m',
    acquisition: '2023-Q2',
    processing: 'Full Waveform Inversion',
    updated: 'Jan 20',
    size: '3.1 TB'
  },
  {
    num: 3,
    item: 'Seismic Attributes - Structural',
    type: 'Attributes',
    status: 'Complete',
    quality: 'Good',
    coverage: '100%',
    resolution: '12.5m x 12.5m',
    acquisition: 'Derived',
    processing: 'Coherency, Curvature',
    updated: 'Jan 25',
    size: '450 GB'
  },
  {
    num: 4,
    item: 'Seismic Attributes - Reservoir',
    type: 'Attributes',
    status: 'Complete',
    quality: 'Good',
    coverage: '100%',
    resolution: '12.5m x 12.5m',
    acquisition: 'Derived',
    processing: 'Acoustic Impedance',
    updated: 'Jan 27',
    size: '380 GB'
  },
  {
    num: 5,
    item: 'Horizon Interpretations',
    type: 'Interpretation',
    status: 'Complete',
    quality: 'Excellent',
    coverage: '100%',
    resolution: 'Variable',
    acquisition: 'Manual + AI',
    processing: 'QC Complete',
    updated: 'Feb 1',
    size: '12 GB'
  },
  {
    num: 6,
    item: 'Fault Framework Model',
    type: 'Interpretation',
    status: 'Complete',
    quality: 'Good',
    coverage: '95%',
    resolution: 'Variable',
    acquisition: 'Manual',
    processing: 'Validated',
    updated: 'Feb 2',
    size: '8 GB'
  },
  {
    num: 7,
    item: 'Velocity Model',
    type: 'Model',
    status: 'Complete',
    quality: 'Excellent',
    coverage: '100%',
    resolution: '25m x 25m x 10m',
    acquisition: 'Derived',
    processing: 'Tomography',
    updated: 'Jan 18',
    size: '890 GB'
  },
  {
    num: 8,
    item: 'Seismic Inversion - AI',
    type: 'Inversion',
    status: 'Complete',
    quality: 'Excellent',
    coverage: '100%',
    resolution: '12.5m x 12.5m',
    acquisition: 'Derived',
    processing: 'Deep Learning',
    updated: 'Jan 30',
    size: '1.8 TB'
  }
];

export default function GeophysicalData() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();

  const handleExportReport = () => {
    toast.success('Exporting report...', {
      description: 'Your geophysical data report is being generated.'
    });
  };

  const handleViewData = (item: typeof geophysicalItems[0]) => {
    toast.info('Opening data viewer...', {
      description: `Loading ${item.item}.`
    });
  };

  const totalSize = geophysicalItems.reduce((acc, item) => {
    const sizeValue = parseFloat(item.size.split(' ')[0]);
    const sizeUnit = item.size.split(' ')[1];
    if (sizeUnit === 'TB') {
      return acc + (sizeValue * 1000);
    }
    return acc + sizeValue;
  }, 0);

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Geophysical Data – {selectedAsset.name}
            </h1>
            <p className="text-sm text-text-secondary">{geophysicalItems.length} datasets | 100% complete | {(totalSize / 1000).toFixed(1)} TB total</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportReport}>
              Export Report
            </Button>
            <Button variant="primary" onClick={openChat}>
              ✨ AI Analysis
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Seismic Volumes</div>
            <div className="text-3xl font-bold text-success">2</div>
            <div className="text-sm text-text-tertiary mt-1">Primary + Enhanced</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Attributes</div>
            <div className="text-3xl font-bold text-success">2</div>
            <div className="text-sm text-text-tertiary mt-1">Structural + Reservoir</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Interpretations</div>
            <div className="text-3xl font-bold text-success">2</div>
            <div className="text-sm text-text-tertiary mt-1">Horizons + Faults</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Data Quality</div>
            <div className="text-3xl font-bold text-success">A+</div>
            <div className="text-sm text-text-tertiary mt-1">Excellent</div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-text-primary">✨ AI Insight</span>
            <Badge variant="info" size="sm">AI</Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Seismic data quality is excellent across all volumes. Full Waveform Inversion provides superior velocity model 
            for depth conversion. AI-driven seismic inversion shows strong correlation with well data (R² = 0.89). 
            Recommend using enhanced volume for detailed reservoir characterization.
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-card-border rounded-lg shadow-glow">
          <div className="p-4 border-b border-card-border">
            <h2 className="text-lg font-semibold text-text-primary">Geophysical Data Inventory</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Processing</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geophysicalItems.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="font-medium">{item.num}</TableCell>
                  <TableCell className="font-semibold text-text-primary">{item.item}</TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      <Layers className="w-3 h-3 mr-1" />
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success text-white border-0" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.quality === 'Excellent' ? 'success' : 'default'} 
                      size="sm"
                    >
                      {item.quality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">{item.coverage}</TableCell>
                  <TableCell className="text-text-secondary text-xs">{item.resolution}</TableCell>
                  <TableCell className="text-text-secondary text-xs">{item.processing}</TableCell>
                  <TableCell className="text-text-secondary font-medium">{item.size}</TableCell>
                  <TableCell className="text-text-tertiary">{item.updated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewData(item)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
