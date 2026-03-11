import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { toast } from 'sonner';

const petroLogItems = [
  {
    num: 1,
    wellName: 'Well-001',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Available',
    status: 'Complete',
    completeness: '100%',
    zone: 'Zone A',
    updated: 'Feb 4'
  },
  {
    num: 2,
    wellName: 'Well-002',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Available',
    status: 'Complete',
    completeness: '100%',
    zone: 'Zone A',
    updated: 'Feb 4'
  },
  {
    num: 3,
    wellName: 'Well-003',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Missing',
    resistivity: 'Available',
    status: 'Partial',
    completeness: '75%',
    zone: 'Zone B',
    updated: 'Feb 3'
  },
  {
    num: 4,
    wellName: 'Well-004',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Available',
    status: 'Complete',
    completeness: '100%',
    zone: 'Zone B',
    updated: 'Feb 3'
  },
  {
    num: 5,
    wellName: 'Well-005',
    gamma: 'Available',
    density: 'Missing',
    neutron: 'Missing',
    resistivity: 'Available',
    status: 'Critical',
    completeness: '50%',
    zone: 'Zone C',
    updated: 'Feb 2'
  },
  {
    num: 6,
    wellName: 'Well-006',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Available',
    status: 'Complete',
    completeness: '100%',
    zone: 'Zone C',
    updated: 'Feb 2'
  },
  {
    num: 7,
    wellName: 'Well-007',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Missing',
    status: 'Partial',
    completeness: '75%',
    zone: 'Zone A',
    updated: 'Feb 1'
  },
  {
    num: 8,
    wellName: 'Well-008',
    gamma: 'Available',
    density: 'Available',
    neutron: 'Available',
    resistivity: 'Available',
    status: 'Complete',
    completeness: '100%',
    zone: 'Zone B',
    updated: 'Jan 31'
  }
];

export default function PetrophysicalLogs() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();

  const handleExportReport = () => {
    toast.success('Exporting report...', {
      description: 'Your petrophysical logs report is being generated.'
    });
  };

  const handleViewLog = (item: typeof petroLogItems[0]) => {
    toast.info('Opening log viewer...', {
      description: `Loading ${item.wellName} petrophysical logs.`
    });
  };

  const handleRequestData = () => {
    toast.info('Data acquisition request sent', {
      description: 'Request for missing petrophysical logs has been submitted for approval.'
    });
  };

  const completeWells = petroLogItems.filter(item => item.status === 'Complete').length;
  const partialWells = petroLogItems.filter(item => item.status === 'Partial').length;
  const criticalWells = petroLogItems.filter(item => item.status === 'Critical').length;
  const totalCompletion = Math.round((completeWells / petroLogItems.length) * 100);

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Petrophysical Logs – {selectedAsset.name}
            </h1>
            <p className="text-sm text-text-secondary">{petroLogItems.length} wells tracked | {totalCompletion}% complete</p>
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
            <div className="text-sm text-text-secondary mb-1">Complete</div>
            <div className="text-3xl font-bold text-success">{completeWells}</div>
            <div className="text-sm text-text-tertiary mt-1">{Math.round((completeWells / petroLogItems.length) * 100)}%</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Partial</div>
            <div className="text-3xl font-bold text-warning">{partialWells}</div>
            <div className="text-sm text-text-tertiary mt-1">{Math.round((partialWells / petroLogItems.length) * 100)}%</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Critical Gaps</div>
            <div className="text-3xl font-bold text-danger">{criticalWells}</div>
            <div className="text-sm text-text-tertiary mt-1">Needs attention</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Overall</div>
            <div className="text-3xl font-bold text-warning">{totalCompletion}%</div>
            <div className="text-sm text-text-tertiary mt-1">Total completion</div>
          </div>
        </div>

        {/* AI Warning */}
        <div className="bg-danger/10 border-l-4 border-danger rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-sm font-medium text-text-primary">Critical Data Gaps Detected</span>
            <Badge variant="danger" size="sm">Action Required</Badge>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            3 critical gaps in Zone C petrophysical logs (Wells 5, 14, 16). Missing density and neutron logs significantly 
            impact porosity estimation. Recommend acquiring missing data before proceeding to uncertainty quantification.
          </p>
          <Button variant="danger" size="sm" onClick={handleRequestData}>
            Request Missing Data
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-card-border rounded-lg shadow-glow">
          <div className="p-4 border-b border-card-border">
            <h2 className="text-lg font-semibold text-text-primary">Log Inventory by Well</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Well Name</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Gamma Ray</TableHead>
                <TableHead>Density</TableHead>
                <TableHead>Neutron</TableHead>
                <TableHead>Resistivity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {petroLogItems.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="font-medium">{item.num}</TableCell>
                  <TableCell className="font-semibold text-text-primary">{item.wellName}</TableCell>
                  <TableCell className="text-text-secondary">{item.zone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.gamma === 'Available' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger" />
                      )}
                      <span className="text-text-secondary text-sm">{item.gamma}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.density === 'Available' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger" />
                      )}
                      <span className="text-text-secondary text-sm">{item.density}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.neutron === 'Available' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger" />
                      )}
                      <span className="text-text-secondary text-sm">{item.neutron}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.resistivity === 'Available' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger" />
                      )}
                      <span className="text-text-secondary text-sm">{item.resistivity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'Complete' ? 'success' : 
                        item.status === 'Partial' ? 'warning' : 
                        'danger'
                      } 
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">{item.completeness}</TableCell>
                  <TableCell className="text-text-tertiary">{item.updated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewLog(item)}>
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
