import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, XCircle, Eye, TrendingUp, AlertCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { toast } from 'sonner';

const productionDataItems = [
  {
    num: 1,
    wellName: 'Well-001',
    type: 'Producer',
    status: 'Complete',
    dataPoints: 2847,
    startDate: '2018-03',
    endDate: '2025-02',
    oilRate: 'Available',
    waterRate: 'Available',
    gasRate: 'Available',
    pressure: 'Available',
    completeness: '100%'
  },
  {
    num: 2,
    wellName: 'Well-002',
    type: 'Producer',
    status: 'Complete',
    dataPoints: 2610,
    startDate: '2018-06',
    endDate: '2025-02',
    oilRate: 'Available',
    waterRate: 'Available',
    gasRate: 'Available',
    pressure: 'Available',
    completeness: '100%'
  },
  {
    num: 3,
    wellName: 'Well-003',
    type: 'Injector',
    status: 'Complete',
    dataPoints: 2521,
    startDate: '2018-08',
    endDate: '2025-02',
    oilRate: 'N/A',
    waterRate: 'Available',
    gasRate: 'N/A',
    pressure: 'Available',
    completeness: '100%'
  },
  {
    num: 4,
    wellName: 'Well-004',
    type: 'Producer',
    status: 'Partial',
    dataPoints: 1205,
    startDate: '2020-01',
    endDate: '2023-06',
    oilRate: 'Available',
    waterRate: 'Partial',
    gasRate: 'Available',
    pressure: 'Missing',
    completeness: '65%'
  },
  {
    num: 5,
    wellName: 'Well-005',
    type: 'Producer',
    status: 'Sparse',
    dataPoints: 487,
    startDate: '2021-03',
    endDate: '2024-01',
    oilRate: 'Partial',
    waterRate: 'Missing',
    gasRate: 'Partial',
    pressure: 'Missing',
    completeness: '35%'
  },
  {
    num: 6,
    wellName: 'Well-006',
    type: 'Injector',
    status: 'Complete',
    dataPoints: 2156,
    startDate: '2019-02',
    endDate: '2025-02',
    oilRate: 'N/A',
    waterRate: 'Available',
    gasRate: 'N/A',
    pressure: 'Available',
    completeness: '100%'
  },
  {
    num: 7,
    wellName: 'Well-007',
    type: 'Producer',
    status: 'Sparse',
    dataPoints: 312,
    startDate: '2022-01',
    endDate: '2023-12',
    oilRate: 'Partial',
    waterRate: 'Missing',
    gasRate: 'Missing',
    pressure: 'Missing',
    completeness: '25%'
  },
  {
    num: 8,
    wellName: 'Well-008',
    type: 'Producer',
    status: 'Sparse',
    dataPoints: 198,
    startDate: '2022-06',
    endDate: '2024-03',
    oilRate: 'Partial',
    waterRate: 'Missing',
    gasRate: 'Partial',
    pressure: 'Missing',
    completeness: '30%'
  }
];

export default function ProductionHistory() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();

  const handleExportReport = () => {
    toast.success('Exporting report...', {
      description: 'Your production history report is being generated.'
    });
  };

  const handleViewHistory = (item: typeof productionDataItems[0]) => {
    toast.info('Opening production history...', {
      description: `Loading ${item.wellName} production data.`
    });
  };

  const handleRequestData = () => {
    toast.info('Data request submitted', {
      description: 'Request for missing production data has been sent to Operations team.'
    });
  };

  const completeWells = productionDataItems.filter(item => item.status === 'Complete').length;
  const partialWells = productionDataItems.filter(item => item.status === 'Partial').length;
  const sparseWells = productionDataItems.filter(item => item.status === 'Sparse').length;
  const avgCompletion = Math.round(
    productionDataItems.reduce((acc, item) => acc + parseInt(item.completeness), 0) / productionDataItems.length
  );

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Production History – {selectedAsset.name}
            </h1>
            <p className="text-sm text-text-secondary">{productionDataItems.length} wells tracked | {avgCompletion}% average completeness</p>
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
            <div className="text-sm text-text-tertiary mt-1">Full history available</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Partial</div>
            <div className="text-3xl font-bold text-warning">{partialWells}</div>
            <div className="text-sm text-text-tertiary mt-1">Some gaps</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Sparse</div>
            <div className="text-3xl font-bold text-danger">{sparseWells}</div>
            <div className="text-sm text-text-tertiary mt-1">Critical gaps</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Avg. Completeness</div>
            <div className="text-3xl font-bold text-warning">{avgCompletion}%</div>
            <div className="text-sm text-text-tertiary mt-1">Overall</div>
          </div>
        </div>

        {/* AI Warning */}
        <div className="bg-danger/10 border-l-4 border-danger rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-danger" />
            <span className="text-sm font-medium text-text-primary">Critical Data Gaps in Production History</span>
            <Badge variant="danger" size="sm">Action Required</Badge>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Wells 5, 7, and 8 have sparse production history with significant data gaps. Missing pressure and water rate data 
            will severely impact history matching accuracy. Recommend acquiring missing data from Operations database or 
            SCADA system before proceeding to simulation phase.
          </p>
          <Button variant="danger" size="sm" onClick={handleRequestData}>
            Request Missing Data
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-card-border rounded-lg shadow-glow">
          <div className="p-4 border-b border-card-border">
            <h2 className="text-lg font-semibold text-text-primary">Production Data Inventory</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Well Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Points</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Oil Rate</TableHead>
                <TableHead>Water Rate</TableHead>
                <TableHead>Pressure</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionDataItems.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="font-medium">{item.num}</TableCell>
                  <TableCell className="font-semibold text-text-primary">{item.wellName}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'Producer' ? 'success' : 'info'} size="sm">
                      {item.type}
                    </Badge>
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
                  <TableCell className="text-text-secondary">{item.dataPoints.toLocaleString()}</TableCell>
                  <TableCell className="text-text-secondary text-xs">{item.startDate}</TableCell>
                  <TableCell className="text-text-secondary text-xs">{item.endDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.oilRate === 'Available' && <CheckCircle2 className="w-4 h-4 text-success" />}
                      {item.oilRate === 'Partial' && <AlertCircle className="w-4 h-4 text-warning" />}
                      {item.oilRate === 'Missing' && <XCircle className="w-4 h-4 text-danger" />}
                      {item.oilRate === 'N/A' && <span className="text-text-tertiary text-xs">N/A</span>}
                      {item.oilRate !== 'N/A' && <span className="text-text-secondary text-xs">{item.oilRate}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.waterRate === 'Available' && <CheckCircle2 className="w-4 h-4 text-success" />}
                      {item.waterRate === 'Partial' && <AlertCircle className="w-4 h-4 text-warning" />}
                      {item.waterRate === 'Missing' && <XCircle className="w-4 h-4 text-danger" />}
                      <span className="text-text-secondary text-xs">{item.waterRate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.pressure === 'Available' && <CheckCircle2 className="w-4 h-4 text-success" />}
                      {item.pressure === 'Partial' && <AlertCircle className="w-4 h-4 text-warning" />}
                      {item.pressure === 'Missing' && <XCircle className="w-4 h-4 text-danger" />}
                      <span className="text-text-secondary text-xs">{item.pressure}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" />
                      <span className="text-text-secondary font-medium">{item.completeness}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewHistory(item)}>
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
