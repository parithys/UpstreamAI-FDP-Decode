import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, Eye, FileCheck, MapPin } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { toast } from 'sonner';
import { useState } from 'react';

const wellDataItems = [
  {
    num: 1,
    wellName: 'Well-001',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone A',
    updated: 'Feb 5',
    updatedBy: 'K. Johnson'
  },
  {
    num: 2,
    wellName: 'Well-002',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone A',
    updated: 'Feb 5',
    updatedBy: 'K. Johnson'
  },
  {
    num: 3,
    wellName: 'Well-003',
    type: 'Injector',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone B',
    updated: 'Feb 4',
    updatedBy: 'M. Hassan'
  },
  {
    num: 4,
    wellName: 'Well-004',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone B',
    updated: 'Feb 3',
    updatedBy: 'K. Johnson'
  },
  {
    num: 5,
    wellName: 'Well-005',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone C',
    updated: 'Feb 3',
    updatedBy: 'M. Hassan'
  },
  {
    num: 6,
    wellName: 'Well-006',
    type: 'Injector',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone C',
    updated: 'Feb 2',
    updatedBy: 'K. Johnson'
  },
  {
    num: 7,
    wellName: 'Well-007',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone A',
    updated: 'Feb 2',
    updatedBy: 'M. Hassan'
  },
  {
    num: 8,
    wellName: 'Well-008',
    type: 'Producer',
    status: 'Complete',
    completeness: '100%',
    trajectory: 'Available',
    completion: 'Available',
    location: 'Zone B',
    updated: 'Feb 1',
    updatedBy: 'K. Johnson'
  }
];

export default function WellData() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();
  const [selectedWell, setSelectedWell] = useState<typeof wellDataItems[0] | null>(null);

  const handleExportReport = () => {
    toast.success('Exporting report...', {
      description: 'Your well data report is being generated.'
    });
  };

  const handleViewWell = (item: typeof wellDataItems[0]) => {
    setSelectedWell(item);
    toast.info('Opening well details...', {
      description: `Loading ${item.wellName} trajectory and completion data.`
    });
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Well Data – {selectedAsset.name}
            </h1>
            <p className="text-sm text-text-secondary">{selectedAsset.activeWells} wells tracked | {selectedAsset.activeWells} complete</p>
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
            <div className="text-sm text-text-secondary mb-1">Total Wells</div>
            <div className="text-3xl font-bold text-success">{selectedAsset.activeWells}</div>
            <div className="text-sm text-text-tertiary mt-1">100% complete</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Producers</div>
            <div className="text-3xl font-bold text-text-primary">{Math.floor(selectedAsset.activeWells * 0.7)}</div>
            <div className="text-sm text-text-tertiary mt-1">Active</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Injectors</div>
            <div className="text-3xl font-bold text-text-primary">{Math.floor(selectedAsset.activeWells * 0.3)}</div>
            <div className="text-sm text-text-tertiary mt-1">Active</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Data Quality</div>
            <div className="text-3xl font-bold text-success">A+</div>
            <div className="text-sm text-text-tertiary mt-1">All validated</div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-text-primary">✨ AI Insight</span>
            <Badge variant="info" size="sm">AI</Badge>
          </div>
          <p className="text-sm text-text-secondary">
            All well trajectory and completion data is complete and validated. Current well spacing is optimal for reservoir drainage. 
            Consider adding 2 infill wells in Zone C to improve recovery by estimated 3.2%.
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-card-border rounded-lg shadow-glow">
          <div className="p-4 border-b border-card-border">
            <h2 className="text-lg font-semibold text-text-primary">Well Inventory</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Well Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trajectory</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wellDataItems.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="font-medium">{item.num}</TableCell>
                  <TableCell className="font-semibold text-text-primary">{item.wellName}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'Producer' ? 'success' : 'info'} size="sm">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success text-white border-0" size="sm">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-text-secondary">{item.trajectory}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-text-secondary">{item.completion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span className="text-text-secondary">{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-tertiary">{item.updated}</TableCell>
                  <TableCell className="text-text-tertiary">{item.updatedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewWell(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
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
