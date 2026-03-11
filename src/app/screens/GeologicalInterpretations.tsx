import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { CheckCircle2, Clock, Eye, AlertTriangle, Download, Sparkles, FileCheck, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAsset } from '../context/AssetContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { useNotifications } from '../context/NotificationsContext';
import { toast } from 'sonner';
import { useState } from 'react';

interface GeologicalItem {
  num: number;
  item: string;
  discipline: string;
  status: 'Complete' | 'Partial' | 'Pending';
  completeness: string;
  confidence: 'High' | 'Medium' | 'Low' | '-';
  source: string;
  reviewer: string;
  updated: string;
  validated?: boolean;
}

const initialGeologicalItems: GeologicalItem[] = [
  {
    num: 1,
    item: 'Sedimentology Report - Zone A',
    discipline: 'Geology',
    status: 'Complete',
    completeness: '100%',
    confidence: 'High',
    source: 'Core Analysis',
    reviewer: 'Dr. M. Torres',
    updated: 'Feb 3',
    validated: true
  },
  {
    num: 2,
    item: 'Sedimentology Report - Zone B',
    discipline: 'Geology',
    status: 'Partial',
    completeness: '60%',
    confidence: 'Medium',
    source: 'Core Analysis',
    reviewer: 'Dr. M. Torres',
    updated: 'Feb 1',
    validated: false
  },
  {
    num: 3,
    item: 'Sedimentology Report - Zone C',
    discipline: 'Geology',
    status: 'Pending',
    completeness: '25%',
    confidence: 'Low',
    source: 'Core Analysis',
    reviewer: 'In Progress',
    updated: 'Jan 28',
    validated: false
  },
  {
    num: 4,
    item: 'Carbonate Analysis - Primary',
    discipline: 'Geochemistry',
    status: 'Pending',
    completeness: '0%',
    confidence: '-',
    source: 'Lab Reports',
    reviewer: 'Awaiting Data',
    updated: 'Jan 25',
    validated: false
  },
  {
    num: 5,
    item: 'Carbonate Analysis - Secondary',
    discipline: 'Geochemistry',
    status: 'Pending',
    completeness: '0%',
    confidence: '-',
    source: 'Lab Reports',
    reviewer: 'Awaiting Data',
    updated: 'Jan 25',
    validated: false
  },
  {
    num: 6,
    item: 'Stratigraphic Framework',
    discipline: 'Geology',
    status: 'Complete',
    completeness: '100%',
    confidence: 'High',
    source: 'Seismic + Wells',
    reviewer: 'Dr. M. Torres',
    updated: 'Feb 4',
    validated: true
  },
  {
    num: 7,
    item: 'Depositional Environment Model',
    discipline: 'Geology',
    status: 'Complete',
    completeness: '100%',
    confidence: 'High',
    source: 'Integrated',
    reviewer: 'Dr. M. Torres',
    updated: 'Feb 2',
    validated: true
  },
  {
    num: 8,
    item: 'Diagenesis Assessment',
    discipline: 'Geochemistry',
    status: 'Partial',
    completeness: '55%',
    confidence: 'Medium',
    source: 'Thin Sections',
    reviewer: 'Dr. A. Khalid',
    updated: 'Jan 30',
    validated: false
  }
];

const aiSuggestions = [
  {
    id: 1,
    title: 'Complete Zone B & C Sedimentology',
    priority: 'High',
    description: 'Sedimentology reports for Zone B and Zone C are incomplete. These interpretations are critical for understanding reservoir quality and heterogeneity distribution.',
    impact: 'Will improve reservoir model accuracy by 15-20%',
    effort: '3-4 weeks',
    confidence: '92%'
  },
  {
    id: 2,
    title: 'Expedite Carbonate Analysis',
    priority: 'Critical',
    description: 'Both primary and secondary carbonate analyses are pending. This data is essential for understanding diagenesis and porosity evolution.',
    impact: 'Critical for uncertainty quantification in static model',
    effort: '2-3 weeks (lab dependent)',
    confidence: '88%'
  },
  {
    id: 3,
    title: 'Cross-Validate with Analog Fields',
    priority: 'Medium',
    description: 'Consider using interpretations from Field Delta (similar carbonate reservoir) as a proxy for pending analyses.',
    impact: 'Can reduce uncertainty by 8-12% as interim solution',
    effort: '1 week',
    confidence: '75%'
  }
];

export default function GeologicalInterpretations() {
  const { openChat } = useChat();
  const { selectedAsset } = useAsset();
  const { confirmSuccess, confirmWarning } = useConfirmation();
  const { addNotification } = useNotifications();
  const [geologicalItems, setGeologicalItems] = useState<GeologicalItem[]>(initialGeologicalItems);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'excel'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false);
  const [isValidatingAll, setIsValidatingAll] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Geological Interpretations Report',
      message: `Export comprehensive geological interpretations report in ${exportFormat.toUpperCase()} format? This will include all interpretation items, confidence levels, and review status.`,
      confirmLabel: 'Export Report',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsExporting(true);
      setShowExportModal(false);

      toast.loading('Generating report...', { id: 'export-geo' });
      
      setTimeout(() => {
        toast.success('Report Exported', {
          id: 'export-geo',
          description: `Geological interpretations report exported as ${exportFormat.toUpperCase()}`
        });
        
        addNotification({
          type: 'success',
          priority: 'medium',
          category: 'data',
          title: 'Geological Report Exported',
          message: `Complete interpretations report exported successfully (${exportFormat.toUpperCase()})`,
          actionLabel: 'Download',
          actionUrl: '#'
        });
        
        setIsExporting(false);
      }, 2000);
    }
  };

  const handleViewInterpretation = (item: GeologicalItem) => {
    toast.info('Opening interpretation...', {
      description: `Loading ${item.item}`
    });
  };

  const handleRequestCompletion = async () => {
    const confirmed = await confirmWarning({
      title: 'Request Completion Priority',
      message: 'Request priority completion for pending carbonate analyses and Zone B/C sedimentology reports? This will create high-priority work orders for the Geology and Geochemistry teams.',
      confirmLabel: 'Request Priority',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.success('Priority Request Sent', {
        description: 'Geochemistry and Geology teams have been notified'
      });
      
      addNotification({
        type: 'info',
        priority: 'high',
        category: 'collaboration',
        title: 'Priority Completion Requested',
        message: 'Geological interpretations completion request sent to Geology and Geochemistry teams',
        actionLabel: 'Track Progress',
        actionUrl: '/insights/multidisciplinary-workflow'
      });
    }
  };

  const handleValidateAll = async () => {
    const unvalidatedItems = geologicalItems.filter(item => !item.validated && item.status === 'Complete');
    
    if (unvalidatedItems.length === 0) {
      toast.info('No Items to Validate', {
        description: 'All completed items have been validated. Complete pending interpretations first.'
      });
      return;
    }

    const confirmed = await confirmSuccess({
      title: 'Validate All Complete Items',
      message: `Run validation on all ${unvalidatedItems.length} complete interpretation items? This will verify confidence levels, data sources, and reviewer sign-offs.`,
      confirmLabel: `Validate ${unvalidatedItems.length} Items`,
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setIsValidatingAll(true);
      setValidationProgress(0);
      
      toast.loading('Starting validation...', { id: 'validate-all-geo' });
      
      let currentIndex = 0;
      const totalToValidate = unvalidatedItems.length;

      const validationInterval = setInterval(() => {
        currentIndex++;
        const progress = Math.round((currentIndex / totalToValidate) * 100);
        setValidationProgress(progress);
        
        toast.loading(`Validating... ${progress}% (${currentIndex}/${totalToValidate})`, { 
          id: 'validate-all-geo' 
        });

        if (currentIndex >= totalToValidate) {
          clearInterval(validationInterval);
          
          // Update completed items as validated
          setGeologicalItems(prev => 
            prev.map(item => 
              item.status === 'Complete' ? { ...item, validated: true } : item
            )
          );
          
          setIsValidatingAll(false);
          setValidationProgress(0);
          
          toast.success('Validation Complete', {
            id: 'validate-all-geo',
            description: `${totalToValidate} interpretation items validated successfully`
          });
          
          addNotification({
            type: 'success',
            priority: 'high',
            category: 'data',
            title: 'Geological Interpretations Validated',
            message: `${totalToValidate} complete interpretation items validated - all quality checks passed`,
            actionLabel: 'View Results',
            actionUrl: '/data-health/geological'
          });
        }
      }, 400);
    }
  };

  const handleShowAISuggestions = () => {
    setShowAISuggestionsModal(true);
  };

  const handleApplySuggestion = async (suggestion: typeof aiSuggestions[0]) => {
    const confirmed = await confirmSuccess({
      title: 'Apply AI Suggestion',
      message: `Apply "${suggestion.title}"? This will create action items and notify relevant team members.`,
      confirmLabel: 'Apply Suggestion',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      toast.success('Suggestion Applied', {
        description: `Action items created for: ${suggestion.title}`
      });
      
      addNotification({
        type: 'ai',
        priority: suggestion.priority === 'Critical' ? 'critical' : 'high',
        category: 'ai',
        title: 'AI Suggestion Applied',
        message: `${suggestion.title} - action items created and teams notified`,
        actionLabel: 'Track Progress',
        actionUrl: '/ai-agents-management'
      });
      
      setShowAISuggestionsModal(false);
    }
  };

  const completeItems = geologicalItems.filter(item => item.status === 'Complete').length;
  const partialItems = geologicalItems.filter(item => item.status === 'Partial').length;
  const pendingItems = geologicalItems.filter(item => item.status === 'Pending').length;
  const totalCompletion = Math.round((completeItems / geologicalItems.length) * 100);
  const validatedCount = geologicalItems.filter(item => item.validated).length;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Geological Interpretations – {selectedAsset.name}
            </h1>
            <p className="text-sm text-text-secondary">
              {geologicalItems.length} interpretation items | {totalCompletion}% complete | {validatedCount} validated
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleShowAISuggestions}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestions
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

        {/* Validation Progress */}
        {isValidatingAll && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-medium text-text-primary">
                  Validating Interpretations... {validationProgress}%
                </span>
              </div>
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
            <div className="text-sm text-text-secondary mb-1">Complete</div>
            <div className="text-3xl font-bold text-success">{completeItems}</div>
            <div className="text-sm text-text-tertiary mt-1">High confidence</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Partial</div>
            <div className="text-3xl font-bold text-warning">{partialItems}</div>
            <div className="text-sm text-text-tertiary mt-1">In progress</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Pending</div>
            <div className="text-3xl font-bold text-danger">{pendingItems}</div>
            <div className="text-sm text-text-tertiary mt-1">Awaiting data</div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4 shadow-glow">
            <div className="text-sm text-text-secondary mb-1">Overall</div>
            <div className="text-3xl font-bold text-warning">{totalCompletion}%</div>
            <div className="text-sm text-text-tertiary mt-1">Total completion</div>
          </div>
        </div>

        {/* AI Warning */}
        <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-text-primary">Interpretation Gaps Detected</span>
              <Badge variant="warning" size="sm">Attention Needed</Badge>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
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
                  Validate All Complete
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Carbonate analysis pending for primary and secondary zones. Sedimentology reports for Zone B and Zone C are incomplete. 
            These interpretations are critical for understanding reservoir quality and heterogeneity.
          </p>
          <Button variant="warning" size="sm" onClick={handleRequestCompletion}>
            Request Completion Priority
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-card-border rounded-lg shadow-glow">
          <div className="p-4 border-b border-card-border">
            <h2 className="text-lg font-semibold text-text-primary">Interpretation Inventory</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Interpretation Item</TableHead>
                <TableHead>Discipline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geologicalItems.map((item) => (
                <TableRow key={item.num}>
                  <TableCell className="font-medium">{item.num}</TableCell>
                  <TableCell className="font-semibold text-text-primary max-w-xs">
                    <div className="flex items-center gap-2">
                      {item.item}
                      {item.validated && (
                        <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" title="Validated" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      {item.discipline}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'Complete' ? 'success' : 
                        item.status === 'Partial' ? 'warning' : 
                        'default'
                      } 
                      size="sm"
                    >
                      {item.status === 'Complete' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {item.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">{item.completeness}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.confidence === 'High' ? 'success' : 
                        item.confidence === 'Medium' ? 'warning' : 
                        'default'
                      } 
                      size="sm"
                    >
                      {item.confidence}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">{item.source}</TableCell>
                  <TableCell className="text-text-secondary">{item.reviewer}</TableCell>
                  <TableCell className="text-text-tertiary">{item.updated}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewInterpretation(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Export Geological Report</h3>
                <button onClick={() => setShowExportModal(false)} className="text-text-secondary hover:text-text-primary">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Select Format</label>
                  <div className="space-y-2">
                    {(['pdf', 'word', 'excel'] as const).map((format) => (
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
                          {format === 'pdf' && 'Comprehensive report with interpretations'}
                          {format === 'word' && 'Editable document for collaboration'}
                          {format === 'excel' && 'Data tables with confidence metrics'}
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

        {/* AI Suggestions Modal */}
        {showAISuggestionsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAISuggestionsModal(false)}>
            <div className="bg-card rounded-lg border border-card-border p-6 max-w-3xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold text-text-primary">AI Suggestions</h3>
                </div>
                <button onClick={() => setShowAISuggestionsModal(false)} className="text-text-secondary hover:text-text-primary">
                  ✕
                </button>
              </div>
              
              <p className="text-sm text-text-secondary mb-6">
                AI-powered recommendations to improve geological interpretations completeness and quality
              </p>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className="bg-background-secondary rounded-lg p-5 border border-card-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-text-primary">{suggestion.title}</h4>
                          <Badge 
                            variant={
                              suggestion.priority === 'Critical' ? 'danger' :
                              suggestion.priority === 'High' ? 'warning' :
                              'default'
                            }
                            size="sm"
                          >
                            {suggestion.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{suggestion.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Impact</p>
                            <p className="text-sm text-text-primary">{suggestion.impact}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">Effort</p>
                            <p className="text-sm text-text-primary">{suggestion.effort}</p>
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary mb-1">AI Confidence</p>
                            <p className="text-sm text-success font-semibold">{suggestion.confidence}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-3 border-t border-card-border">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={openChat}
                      >
                        Discuss with AI
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-card-border">
                <Button variant="ghost" onClick={() => setShowAISuggestionsModal(false)}>Close</Button>
                <Button variant="primary" onClick={() => {
                  openChat();
                  setShowAISuggestionsModal(false);
                }}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discuss All with AI Agent
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
