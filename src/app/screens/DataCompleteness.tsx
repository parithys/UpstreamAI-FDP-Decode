import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, Eye, FileCheck, Download, AlertCircle, Loader2, Upload, Trash2, RefreshCw, X, CheckSquare, Square } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

interface DataItem {
  num: number;
  item: string;
  discipline: string;
  status: 'Available' | 'Partial' | 'Missing';
  completeness: string;
  source: string;
  format: string;
  location: string;
  updated: string;
  updatedBy: string;
  provenance: string;
  validated?: boolean;
}

const initialDataItems: DataItem[] = [
  {
    num: 1,
    item: 'Porosity Grid',
    discipline: 'Petrophysics',
    status: 'Available',
    completeness: '100%',
    source: 'OSD Portal',
    format: 'GRDECL',
    location: '/osd/field-alpha/static/',
    updated: 'Jan 28',
    updatedBy: 'A. Rahman',
    provenance: 'Layer 1',
    validated: false
  },
  {
    num: 2,
    item: 'Permeability Model',
    discipline: 'Reservoir Eng',
    status: 'Available',
    completeness: '100%',
    source: 'Internal',
    format: 'GRDECL',
    location: '/models/r4/perm/',
    updated: 'Jan 30',
    updatedBy: 'S. Chen',
    provenance: 'Layer 1',
    validated: false
  },
  {
    num: 3,
    item: 'Fault Framework',
    discipline: 'Geology',
    status: 'Available',
    completeness: '100%',
    source: 'GeoData 5',
    format: 'Shape',
    location: 'Linked',
    updated: 'Feb 1',
    updatedBy: 'M. Torres',
    provenance: 'Layer 2',
    validated: true
  },
  {
    num: 4,
    item: 'Net-to-Gross',
    discipline: 'Petrophysics',
    status: 'Available',
    completeness: '100%',
    source: 'OSD Portal',
    format: 'GRDECL',
    location: '/osd/field-alpha/static/',
    updated: 'Jan 28',
    updatedBy: 'A. Rahman',
    provenance: 'Layer 1',
    validated: false
  },
  {
    num: 5,
    item: 'Water Saturation',
    discipline: 'Petrophysics',
    status: 'Available',
    completeness: '100%',
    source: 'Internal',
    format: 'GRDECL',
    location: '/models/r4/saturation/',
    updated: 'Jan 29',
    updatedBy: 'S. Chen',
    provenance: 'Layer 1',
    validated: false
  },
  {
    num: 6,
    item: 'PVT Data',
    discipline: 'Reservoir Eng',
    status: 'Available',
    completeness: '100%',
    source: 'Lab Reports',
    format: 'Excel',
    location: '/lab-data/pvt/',
    updated: 'Jan 25',
    updatedBy: 'A. Rahman',
    provenance: 'Layer 1',
    validated: true
  },
  {
    num: 7,
    item: 'Rock Properties',
    discipline: 'Geology',
    status: 'Available',
    completeness: '95%',
    source: 'Core Analysis',
    format: 'Database',
    location: '/lab-data/rock/',
    updated: 'Jan 27',
    updatedBy: 'M. Torres',
    provenance: 'Layer 1',
    validated: false
  },
  {
    num: 8,
    item: 'Structural Model',
    discipline: 'Geology',
    status: 'Available',
    completeness: '100%',
    source: 'GeoData 5',
    format: 'GRDECL',
    location: 'Linked',
    updated: 'Feb 1',
    updatedBy: 'M. Torres',
    provenance: 'Layer 2',
    validated: false
  }
];

export default function DataCompleteness() {
  const { openChat } = useChat();
  const { confirmSuccess, confirmWarning, confirmDanger } = useConfirmation();
  const { addNotification } = useNotifications();
  const [dataItems, setDataItems] = useState<DataItem[]>(initialDataItems);
  const [selectedDataset, setSelectedDataset] = useState<DataItem | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validatingItem, setValidatingItem] = useState<DataItem | null>(null);
  const [isValidatingAll, setIsValidatingAll] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  // Bulk operations state
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  
  // Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validatedCount = dataItems.filter(item => item.validated).length;
  const totalItems = dataItems.length;

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedItems.length === dataItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(dataItems.map(item => item.num));
    }
  };

  const handleSelectItem = (num: number) => {
    setSelectedItems(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const isAllSelected = selectedItems.length === dataItems.length && dataItems.length > 0;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < dataItems.length;

  // Bulk operations
  const handleBulkValidate = async () => {
    const itemsToValidate = dataItems.filter(item => 
      selectedItems.includes(item.num) && !item.validated
    );

    if (itemsToValidate.length === 0) {
      toast.info('No Items to Validate', {
        description: 'All selected items are already validated'
      });
      return;
    }

    const confirmed = await confirmSuccess({
      title: 'Bulk Validate Selected Items',
      message: `Validate ${itemsToValidate.length} selected datasets? This will run comprehensive quality checks on each item.`,
      confirmLabel: `Validate ${itemsToValidate.length} Items`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsValidatingAll(true);
      setValidationProgress(0);
      
      toast.loading('Starting bulk validation...', { id: 'bulk-validate' });
      
      let currentIndex = 0;
      const validationInterval = setInterval(() => {
        currentIndex++;
        const progress = Math.round((currentIndex / itemsToValidate.length) * 100);
        setValidationProgress(progress);
        
        toast.loading(`Validating... ${progress}% (${currentIndex}/${itemsToValidate.length})`, { 
          id: 'bulk-validate' 
        });

        if (currentIndex >= itemsToValidate.length) {
          clearInterval(validationInterval);
          
          setDataItems(prev => 
            prev.map(item => 
              selectedItems.includes(item.num) ? { ...item, validated: true } : item
            )
          );
          
          setIsValidatingAll(false);
          setValidationProgress(0);
          setSelectedItems([]);
          setShowBulkMenu(false);
          
          toast.success('Bulk Validation Complete', {
            id: 'bulk-validate',
            description: `${itemsToValidate.length} datasets validated successfully`
          });
          
          addNotification({
            type: 'success',
            priority: 'high',
            category: 'data',
            title: 'Bulk Validation Complete',
            message: `${itemsToValidate.length} datasets validated - all quality checks passed`,
            actionLabel: 'View Results',
            actionUrl: '/data-health/static-model'
          });
        }
      }, 300);
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirmDanger({
      title: 'Delete Selected Datasets',
      message: `Permanently delete ${selectedItems.length} selected datasets? This action cannot be undone. Consider archiving instead.`,
      confirmLabel: `Delete ${selectedItems.length} Items`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      const deletedItems = dataItems.filter(item => selectedItems.includes(item.num));
      
      setDataItems(prev => prev.filter(item => !selectedItems.includes(item.num)));
      setSelectedItems([]);
      setShowBulkMenu(false);
      
      toast.success('Items Deleted', {
        description: `${deletedItems.length} datasets removed from inventory`
      });
      
      addNotification({
        type: 'warning',
        priority: 'medium',
        category: 'data',
        title: 'Datasets Deleted',
        message: `${deletedItems.length} datasets removed from data completeness inventory`,
        actionLabel: 'View Changes',
        actionUrl: '/data-health/static-model'
      });
    }
  };

  const handleBulkRefresh = async () => {
    const confirmed = await confirmSuccess({
      title: 'Refresh Selected Datasets',
      message: `Refresh ${selectedItems.length} selected datasets from their original sources? This will update completeness status and metadata.`,
      confirmLabel: `Refresh ${selectedItems.length} Items`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Refreshing datasets...', { id: 'bulk-refresh' });
      
      setTimeout(() => {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        setDataItems(prev => 
          prev.map(item => 
            selectedItems.includes(item.num) 
              ? { ...item, updated: today, updatedBy: 'System Refresh' }
              : item
          )
        );
        
        setSelectedItems([]);
        setShowBulkMenu(false);
        
        toast.success('Refresh Complete', {
          id: 'bulk-refresh',
          description: `${selectedItems.length} datasets refreshed from source`
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'data',
          title: 'Datasets Refreshed',
          message: `${selectedItems.length} datasets updated from original sources`,
          actionLabel: 'View Updates',
          actionUrl: '/data-health/static-model'
        });
      }, 2000);
    }
  };

  // Upload handlers
  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) {
      toast.error('No Files Selected', {
        description: 'Please select at least one file to upload'
      });
      return;
    }

    const confirmed = await confirmSuccess({
      title: 'Upload Datasets',
      message: `Upload ${uploadFiles.length} file(s) to the data completeness inventory? Files will be validated and added to the system.`,
      confirmLabel: `Upload ${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsUploading(true);
      setUploadProgress(0);
      
      toast.loading('Uploading files...', { id: 'upload-files' });
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          
          if (next >= 100) {
            clearInterval(uploadInterval);
            
            // Add uploaded files to data items
            const newItems = uploadFiles.map((file, index) => ({
              num: dataItems.length + index + 1,
              item: file.name.replace(/\.[^/.]+$/, ''),
              discipline: 'Various',
              status: 'Available' as const,
              completeness: '100%',
              source: 'User Upload',
              format: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
              location: `/uploads/${file.name}`,
              updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              updatedBy: 'Current User',
              provenance: 'Layer 1',
              validated: false
            }));
            
            setDataItems(prev => [...prev, ...newItems]);
            setIsUploading(false);
            setUploadProgress(0);
            setUploadFiles([]);
            setShowUploadModal(false);
            
            toast.success('Upload Complete', {
              id: 'upload-files',
              description: `${uploadFiles.length} file(s) uploaded successfully`
            });
            
            addNotification({
              type: 'success',
              priority: 'medium',
              category: 'data',
              title: 'Datasets Uploaded',
              message: `${uploadFiles.length} new datasets added to inventory`,
              actionLabel: 'View Datasets',
              actionUrl: '/data-health/static-model'
            });
            
            return 100;
          }
          
          toast.loading(`Uploading... ${next}%`, { id: 'upload-files' });
          return next;
        });
      }, 200);
    }
  };

  const handleExportReport = async () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Data Completeness Report',
      message: `Export comprehensive data completeness report in ${exportFormat.toUpperCase()} format? This will include all ${totalItems} datasets with validation status, provenance, and quality metrics.`,
      confirmLabel: 'Export',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsExporting(true);
      setShowExportModal(false);

      toast.loading('Preparing export...', { id: 'export-toast' });
      
      setTimeout(() => {
        toast.success('Export Complete', {
          id: 'export-toast',
          description: `Data completeness report exported as ${exportFormat.toUpperCase()}`
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'data',
          title: 'Export Completed',
          message: `Data Completeness Report exported successfully (${exportFormat.toUpperCase()})`,
          actionLabel: 'Download',
          actionUrl: '#'
        });
        
        setIsExporting(false);
      }, 2000);
    }
  };

  const handleExportMatrix = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Completeness Matrix',
      message: 'Export the data completeness matrix with cross-reference to all disciplines and validation status?',
      confirmLabel: 'Export Matrix',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.loading('Generating matrix...', { id: 'matrix-export' });
      
      setTimeout(() => {
        toast.success('Matrix Exported', {
          id: 'matrix-export',
          description: 'Completeness matrix exported successfully as Excel file'
        });
        
        addNotification({
          type: 'success',
          priority: 'low',
          category: 'data',
          title: 'Matrix Export Complete',
          message: 'Data completeness matrix has been exported',
          actionLabel: 'Download',
          actionUrl: '#'
        });
      }, 1500);
    }
  };

  const handleFlagForReview = async () => {
    const confirmed = await confirmWarning({
      title: 'Flag for Senior Review',
      message: 'Flag this data completeness assessment for senior engineer review? This will create a high-priority review request.',
      confirmLabel: 'Flag for Review',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.info('Flagged for Review', {
        description: 'Senior engineer has been notified for review'
      });
      
      addNotification({
        type: 'info',
        priority: 'high',
        category: 'system',
        title: 'Review Request Created',
        message: 'Data completeness flagged for senior engineer review',
        actionLabel: 'View Request',
        actionUrl: '/data-health/static-model'
      });
    }
  };

  const handleValidateAll = async () => {
    const unvalidatedCount = dataItems.filter(item => !item.validated).length;
    
    if (unvalidatedCount === 0) {
      toast.info('All Datasets Validated', {
        description: 'All datasets have already been validated'
      });
      return;
    }

    const confirmed = await confirmSuccess({
      title: 'Validate All Datasets',
      message: `Run comprehensive validation on all ${unvalidatedCount} unvalidated datasets? This will check format, completeness, data integrity, and provenance for each item.`,
      confirmLabel: `Validate ${unvalidatedCount} Datasets`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsValidatingAll(true);
      setValidationProgress(0);
      
      toast.loading('Starting validation...', { id: 'validate-all' });
      
      const unvalidatedItems = dataItems.filter(item => !item.validated);
      const totalToValidate = unvalidatedItems.length;
      let currentIndex = 0;

      const validationInterval = setInterval(() => {
        currentIndex++;
        const progress = Math.round((currentIndex / totalToValidate) * 100);
        setValidationProgress(progress);
        
        toast.loading(`Validating... ${progress}% (${currentIndex}/${totalToValidate})`, { 
          id: 'validate-all' 
        });

        if (currentIndex >= totalToValidate) {
          clearInterval(validationInterval);
          
          setDataItems(prev => 
            prev.map(item => ({ ...item, validated: true }))
          );
          
          setIsValidatingAll(false);
          setValidationProgress(0);
          
          toast.success('Validation Complete', {
            id: 'validate-all',
            description: `All ${totalToValidate} datasets validated successfully`
          });
          
          addNotification({
            type: 'success',
            priority: 'high',
            category: 'data',
            title: 'Bulk Validation Complete',
            message: `${totalToValidate} datasets validated successfully - all quality checks passed`,
            actionLabel: 'View Results',
            actionUrl: '/data-health/static-model'
          });
        }
      }, 300);
    }
  };

  const handleViewDataset = (item: DataItem) => {
    setSelectedDataset(item);
  };

  const handleValidateDataset = async (item: DataItem) => {
    if (item.validated) {
      toast.info('Already Validated', {
        description: `${item.item} has already been validated`
      });
      return;
    }

    setValidatingItem(item);
    
    toast.loading('Running validation checks...', { id: `validate-${item.num}` });
    
    setTimeout(() => {
      setShowValidationModal(true);
      
      setDataItems(prev =>
        prev.map(d => d.num === item.num ? { ...d, validated: true } : d)
      );
      
      toast.success('Validation Successful', {
        id: `validate-${item.num}`,
        description: `${item.item} passed all quality checks`
      });
    }, 1500);
  };

  const handleReferenceClick = (reference: string) => {
    toast.info('Opening reference...', {
      description: `Loading ${reference}`
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Static Model – Data Completeness
            </h1>
            <p className="text-sm text-text-secondary">
              {totalItems} items tracked | 42 available, 3 partial, 9 missing | {validatedCount}/{totalItems} validated
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Dataset
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="primary" onClick={openChat}>
              ✨ AI Analysis
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-text-primary">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkValidate}
                  disabled={isValidatingAll}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Validate Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkRefresh}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Selected
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Progress Bar */}
        {isValidatingAll && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-medium text-text-primary">
                  Validating... {validationProgress}%
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {Math.round((validationProgress / 100) * (totalItems - validatedCount))} / {totalItems - validatedCount} items
              </span>
            </div>
            <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${validationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Available</div>
            <div className="text-3xl font-bold text-success">42</div>
            <div className="text-sm text-text-tertiary mt-1">78%</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Partial</div>
            <div className="text-3xl font-bold text-warning">3</div>
            <div className="text-sm text-text-tertiary mt-1">5.6%</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Missing</div>
            <div className="text-3xl font-bold text-danger">9</div>
            <div className="text-sm text-text-tertiary mt-1">16.7%</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Validated</div>
            <div className="text-3xl font-bold text-primary">{validatedCount}/{totalItems}</div>
            <div className="text-sm text-text-tertiary mt-1">
              {Math.round((validatedCount / totalItems) * 100)}% complete
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left - Table */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border border-card-border overflow-hidden shadow-glow">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-white/5">
                    <TableHead className="w-12">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center justify-center w-full"
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : isSomeSelected ? (
                          <Square className="w-4 h-4 text-primary opacity-50" />
                        ) : (
                          <Square className="w-4 h-4 text-text-tertiary" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-text-secondary">#</TableHead>
                    <TableHead className="text-text-secondary">Item</TableHead>
                    <TableHead className="text-text-secondary">Discipline</TableHead>
                    <TableHead className="text-text-secondary">Status</TableHead>
                    <TableHead className="text-text-secondary">Completeness</TableHead>
                    <TableHead className="text-text-secondary">Provenance</TableHead>
                    <TableHead className="text-text-secondary">Validated</TableHead>
                    <TableHead className="text-text-secondary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataItems.map((item) => (
                    <TableRow key={item.num} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <button
                          onClick={() => handleSelectItem(item.num)}
                          className="flex items-center justify-center w-full"
                        >
                          {selectedItems.includes(item.num) ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4 text-text-tertiary" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-text-secondary">{item.num}</TableCell>
                      <TableCell className="text-text-primary font-medium">{item.item}</TableCell>
                      <TableCell className="text-text-secondary">{item.discipline}</TableCell>
                      <TableCell>
                        <Badge variant="success" size="sm">
                          ✓ {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-primary">{item.completeness}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={item.provenance === 'Layer 1' 
                            ? 'text-primary border-primary/30' 
                            : 'text-warning border-warning/30'
                          }
                          size="sm"
                        >
                          {item.provenance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.validated ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Validated
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm" className="text-text-tertiary">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-primary" 
                            onClick={() => handleViewDataset(item)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={`h-7 px-2 ${item.validated ? 'text-success opacity-50' : 'text-success'}`}
                            onClick={() => handleValidateDataset(item)}
                            disabled={item.validated}
                          >
                            <FileCheck className="w-3 h-3 mr-1" />
                            {item.validated ? 'Validated' : 'Validate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div className="w-80">
            <div className="bg-accent/10 rounded-lg p-4 border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-text-primary font-medium">✨ AI Data Discovery Agent</span>
              </div>
              <div className="space-y-4">
                <div className="bg-card rounded p-3 border border-card-border">
                  <p className="text-sm text-text-secondary leading-relaxed mb-2">
                    For missing petrophysical logs in Zone C, previous engineers on Field Beta resolved similar gaps 
                    using the Southeast Asia OSD regional portal.
                  </p>
                  <Badge variant="warning" size="sm">
                    82% confidence
                  </Badge>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-text-tertiary mb-2">Source references:</p>
                    <div className="space-y-1">
                      <button className="text-xs text-accent hover:underline" onClick={() => handleReferenceClick('SPE-198234')}>SPE-198234</button>
                      <button className="text-xs text-accent hover:underline block" onClick={() => handleReferenceClick('Internal Report: FR-2022-017')}>Internal Report: FR-2022-017</button>
                    </div>
                  </div>
                </div>

                {validatedCount < totalItems && (
                  <div className="bg-primary/10 rounded p-3 border border-primary/30">
                    <p className="text-sm text-text-primary font-medium mb-2">
                      💡 AI Suggestion
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">
                      {totalItems - validatedCount} datasets pending validation. Run bulk validation to ensure data quality before proceeding to uncertainty analysis.
                    </p>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="w-full"
                      onClick={handleValidateAll}
                      disabled={isValidatingAll}
                    >
                      {isValidatingAll ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-3 h-3 mr-2" />
                          Validate All Now
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {validatedCount === totalItems && (
                  <div className="bg-success/10 rounded p-3 border border-success/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <p className="text-sm text-success font-medium">
                        All Datasets Validated
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      All {totalItems} datasets have passed validation. Ready to proceed to uncertainty analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-6 bg-card rounded-lg p-4 border border-card-border shadow-glow">
          <Button variant="ghost" onClick={handleExportMatrix}>
            <Download className="w-4 h-4 mr-2" />
            Export Matrix
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">AI Confidence for proceeding:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-success">
                {Math.round((validatedCount / totalItems) * 100)}%
              </span>
              <div className="w-32 h-2 bg-background-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success to-warning transition-all" 
                  style={{ width: `${(validatedCount / totalItems) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFlagForReview}>
              Flag for Review
            </Button>
            <Button 
              variant="primary" 
              onClick={handleValidateAll}
              disabled={isValidatingAll || validatedCount === totalItems}
            >
              {isValidatingAll ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : validatedCount === totalItems ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  All Validated
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Validate All ({totalItems - validatedCount})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !isUploading && setShowUploadModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">Upload Datasets</h3>
                {!isUploading && (
                  <button onClick={() => setShowUploadModal(false)} className="text-text-secondary hover:text-text-primary">
                    ✕
                  </button>
                )}
              </div>
              
              {!isUploading ? (
                <>
                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${
                      isDragging 
                        ? 'border-primary bg-primary/10' 
                        : 'border-card-border hover:border-card-hover'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-primary font-medium mb-2">
                        Drag and drop files here
                      </p>
                      <p className="text-sm text-text-secondary mb-4">
                        or click to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".grdecl,.dat,.xlsx,.xls,.csv,.shp,.json"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Files
                      </Button>
                      <p className="text-xs text-text-tertiary mt-3">
                        Supported formats: GRDECL, Excel, CSV, Shape, JSON
                      </p>
                    </div>
                  </div>

                  {/* File List */}
                  {uploadFiles.length > 0 && (
                    <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                      <p className="text-sm text-text-secondary mb-2">
                        {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''} selected:
                      </p>
                      {uploadFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border border-card-border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-text-tertiary">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="ml-3 text-text-secondary hover:text-danger"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleUploadFiles}
                      disabled={uploadFiles.length === 0}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {uploadFiles.length > 0 ? `${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : 'Files'}
                    </Button>
                  </div>
                </>
              ) : (
                /* Upload Progress */
                <div className="py-8">
                  <div className="text-center mb-6">
                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                    <p className="text-text-primary font-medium mb-2">
                      Uploading files...
                    </p>
                    <p className="text-sm text-text-secondary">
                      Please wait while we upload and validate your datasets
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-text-primary font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Export Options Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Export Report</h3>
                <button onClick={() => setShowExportModal(false)} className="text-text-secondary hover:text-text-primary">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Select Format</label>
                  <div className="space-y-2">
                    {(['pdf', 'excel', 'csv'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          exportFormat === format
                            ? 'border-primary bg-primary/10 text-text-primary'
                            : 'border-card-border hover:border-card-hover text-text-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium uppercase">{format}</span>
                          {exportFormat === format && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-text-tertiary mt-1">
                          {format === 'pdf' && 'Comprehensive report with charts and analysis'}
                          {format === 'excel' && 'Detailed data tables with formulas'}
                          {format === 'csv' && 'Raw data for further processing'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowExportModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as {exportFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dataset Details Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedDataset(null)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Dataset Details</h3>
                <button onClick={() => setSelectedDataset(null)} className="text-text-secondary hover:text-text-primary">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Item Name</p>
                    <p className="text-text-primary font-medium">{selectedDataset.item}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Discipline</p>
                    <p className="text-text-primary">{selectedDataset.discipline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Source</p>
                    <p className="text-text-primary">{selectedDataset.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Format</p>
                    <p className="text-text-primary">{selectedDataset.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Location</p>
                    <p className="text-text-primary font-mono text-sm">{selectedDataset.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Completeness</p>
                    <p className="text-success font-semibold">{selectedDataset.completeness}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Last Updated</p>
                    <p className="text-text-primary">{selectedDataset.updated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Updated By</p>
                    <p className="text-text-primary">{selectedDataset.updatedBy}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-card-border flex items-center justify-between">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {selectedDataset.provenance}
                  </Badge>
                  {selectedDataset.validated ? (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Validated
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-text-tertiary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Validated
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setSelectedDataset(null)}>Close</Button>
                <Button 
                  variant="primary" 
                  onClick={() => { 
                    handleValidateDataset(selectedDataset); 
                    setSelectedDataset(null); 
                  }}
                  disabled={selectedDataset.validated}
                >
                  {selectedDataset.validated ? 'Already Validated' : 'Validate Dataset'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Modal */}
        {showValidationModal && validatingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowValidationModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Validation Results</h3>
                <button onClick={() => setShowValidationModal(false)} className="text-text-secondary hover:text-text-primary">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <div>
                    <p className="text-text-primary font-medium">Validation Successful</p>
                    <p className="text-sm text-text-secondary">{validatingItem.item} passed all quality checks</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-card-border">
                    <span className="text-sm text-text-secondary">Format Check</span>
                    <Badge variant="success" size="sm">✓ Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-card-border">
                    <span className="text-sm text-text-secondary">Completeness Check</span>
                    <Badge variant="success" size="sm">✓ Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-card-border">
                    <span className="text-sm text-text-secondary">Data Integrity</span>
                    <Badge variant="success" size="sm">✓ Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-text-secondary">Provenance Verified</span>
                    <Badge variant="success" size="sm">✓ {validatingItem.provenance}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowValidationModal(false)}>Close</Button>
                <Button variant="primary" onClick={() => { 
                  toast.success('Dataset approved'); 
                  setShowValidationModal(false); 
                  addNotification({
                    type: 'success',
                    priority: 'medium',
                    category: 'data',
                    title: 'Dataset Approved',
                    message: `${validatingItem.item} has been approved and validated`,
                    actionLabel: 'View Details',
                    actionUrl: '/data-health/static-model'
                  });
                }}>
                  Approve Dataset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
