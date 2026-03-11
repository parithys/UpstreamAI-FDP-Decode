import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type WorkflowStageStatus = 'not-started' | 'ready' | 'in-progress' | 'blocked' | 'completed' | 'failed';
export type DisciplineStatus = 'connected' | 'disconnected' | 'degraded' | 'syncing';

export interface GateCriteria {
  id: string;
  description: string;
  type: 'data-quality' | 'approval' | 'dependency' | 'deliverable' | 'validation';
  required: boolean;
  status: 'pending' | 'passed' | 'failed' | 'checking';
  checkedAt?: string;
  checkedBy?: string;
  details?: string;
  autoCheck: boolean; // Can be automatically validated
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  status: WorkflowStageStatus;
  disciplines: string[];
  dependencies: string[]; // IDs of stages that must be completed first
  gateCriteria: GateCriteria[];
  deliverables: string[];
  estimatedDuration: number; // in days
  actualDuration?: number;
  startedAt?: string;
  completedAt?: string;
  blockedReason?: string;
  dataExchanges: number;
  qualityScore?: number;
}

export interface DisciplineConnection {
  id: string;
  name: string;
  status: DisciplineStatus;
  quality: number;
  lastSyncAt?: string;
  issues: string[];
}

export interface WorkflowBottleneck {
  id: string;
  type: 'dependency' | 'quality' | 'resource' | 'approval' | 'data-gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  stageId: string;
  stageName: string;
  description: string;
  impact: string;
  detectedAt: string;
  estimatedDelay: number; // in days
  recommendations: string[];
  autoResolvable: boolean;
}

export interface WorkflowMetrics {
  overallProgress: number; // 0-100%
  activeStages: number;
  completedStages: number;
  blockedStages: number;
  totalDataExchanges: number;
  averageQuality: number;
  bottlenecks: WorkflowBottleneck[];
  criticalPath: string[];
  estimatedCompletion: string;
  onSchedule: boolean;
}

interface WorkflowContextType {
  stages: WorkflowStage[];
  disciplines: DisciplineConnection[];
  metrics: WorkflowMetrics;
  activeBottlenecks: WorkflowBottleneck[];
  
  // Workflow control
  startStage: (stageId: string) => Promise<boolean>;
  completeStage: (stageId: string) => Promise<boolean>;
  validateGate: (stageId: string, criteriaId: string) => Promise<boolean>;
  validateAllGates: (stageId: string) => Promise<boolean>;
  forceOverrideGate: (stageId: string, criteriaId: string, reason: string) => Promise<boolean>;
  
  // Bottleneck management
  detectBottlenecks: () => WorkflowBottleneck[];
  resolveBottleneck: (bottleneckId: string) => Promise<boolean>;
  
  // Dependency management
  checkDependencies: (stageId: string) => { satisfied: boolean; missing: string[] };
  canStartStage: (stageId: string) => { allowed: boolean; reasons: string[] };
  
  // Data sync
  syncDiscipline: (disciplineId: string) => Promise<boolean>;
  syncAllDisciplines: () => Promise<boolean>;
  
  // Manual updates
  updateStageQuality: (stageId: string, quality: number) => void;
  updateGateCriteria: (stageId: string, criteriaId: string, status: GateCriteria['status']) => void;
}

// ============================================================================
// INITIAL DATA
// ============================================================================

const initialStages: WorkflowStage[] = [
  {
    id: 'stage-1',
    name: 'Stage 1: Data Acquisition & Model Building',
    order: 1,
    status: 'completed',
    disciplines: ['geology', 'geophysics', 'petrophysics'],
    dependencies: [],
    gateCriteria: [
      {
        id: 'gate-1-1',
        description: 'All well log data validated and quality checked',
        type: 'data-quality',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-01T14:30:00',
        checkedBy: 'System'
      },
      {
        id: 'gate-1-2',
        description: 'Structural framework approved by Chief Geoscientist',
        type: 'approval',
        required: true,
        status: 'passed',
        autoCheck: false,
        checkedAt: '2025-02-01T16:45:00',
        checkedBy: 'Dr. Sarah Mitchell'
      },
      {
        id: 'gate-1-3',
        description: 'Property models meet minimum quality threshold (>90%)',
        type: 'validation',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-01T18:20:00',
        checkedBy: 'System'
      },
      {
        id: 'gate-1-4',
        description: 'Seismic interpretation completed for all zones',
        type: 'deliverable',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-01T15:10:00',
        checkedBy: 'System'
      }
    ],
    deliverables: [
      'Structural framework',
      'Property models',
      'Seismic interpretation',
      'Petrophysical analysis'
    ],
    estimatedDuration: 21,
    actualDuration: 19,
    startedAt: '2025-01-10T08:00:00',
    completedAt: '2025-02-01T18:30:00',
    dataExchanges: 5,
    qualityScore: 94
  },
  {
    id: 'stage-2',
    name: 'Stage 2: Reservoir Simulation Setup',
    order: 2,
    status: 'completed',
    disciplines: ['reservoir', 'production', 'facilities'],
    dependencies: ['stage-1'],
    gateCriteria: [
      {
        id: 'gate-2-1',
        description: 'Static model successfully imported to Eclipse',
        type: 'dependency',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-03T10:15:00',
        checkedBy: 'System'
      },
      {
        id: 'gate-2-2',
        description: 'History match achieves R² > 0.90',
        type: 'validation',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-05T14:45:00',
        checkedBy: 'System',
        details: 'R² = 0.94'
      },
      {
        id: 'gate-2-3',
        description: 'Facility constraints validated with Engineering team',
        type: 'approval',
        required: true,
        status: 'passed',
        autoCheck: false,
        checkedAt: '2025-02-05T16:00:00',
        checkedBy: 'John Martinez'
      },
      {
        id: 'gate-2-4',
        description: 'Production data synchronized (last 48 months)',
        type: 'data-quality',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-02T09:30:00',
        checkedBy: 'System'
      }
    ],
    deliverables: [
      'Base case simulation',
      'History match report',
      'Facility integration',
      'Production forecasts'
    ],
    estimatedDuration: 28,
    actualDuration: 26,
    startedAt: '2025-02-02T08:00:00',
    completedAt: '2025-02-05T17:00:00',
    dataExchanges: 8,
    qualityScore: 92
  },
  {
    id: 'stage-3',
    name: 'Stage 3: Uncertainty Analysis & AI Led Simulation',
    order: 3,
    status: 'in-progress',
    disciplines: ['reservoir', 'economics', 'geomechanics'],
    dependencies: ['stage-2'],
    gateCriteria: [
      {
        id: 'gate-3-1',
        description: 'All uncertainty parameters defined with distributions',
        type: 'deliverable',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-06T11:20:00',
        checkedBy: 'System'
      },
      {
        id: 'gate-3-2',
        description: 'Economic scenarios validated (min 3 price scenarios)',
        type: 'validation',
        required: true,
        status: 'passed',
        autoCheck: true,
        checkedAt: '2025-02-06T14:30:00',
        checkedBy: 'System'
      },
      {
        id: 'gate-3-3',
        description: 'AI Led model training completed with R² > 0.90',
        type: 'validation',
        required: true,
        status: 'checking',
        autoCheck: true,
        details: 'Training in progress - 78% complete'
      },
      {
        id: 'gate-3-4',
        description: 'Monte Carlo scenarios > 10,000 runs',
        type: 'validation',
        required: true,
        status: 'pending',
        autoCheck: true
      },
      {
        id: 'gate-3-5',
        description: 'Subsurface uncertainty framework approved',
        type: 'approval',
        required: true,
        status: 'passed',
        autoCheck: false,
        checkedAt: '2025-02-07T09:45:00',
        checkedBy: 'Dr. Sarah Mitchell'
      }
    ],
    deliverables: [
      'Uncertainty ranges',
      'Monte Carlo results',
      'AI Led scenarios',
      'Risk profiles'
    ],
    estimatedDuration: 14,
    startedAt: '2025-02-06T08:00:00',
    dataExchanges: 12,
    qualityScore: 88
  },
  {
    id: 'stage-4',
    name: 'Stage 4: Optimization & Decision Support',
    order: 4,
    status: 'blocked',
    disciplines: ['reservoir', 'drilling', 'facilities', 'economics', 'operations'],
    dependencies: ['stage-3'],
    gateCriteria: [
      {
        id: 'gate-4-1',
        description: 'Insights generated and ranked by AI',
        type: 'deliverable',
        required: true,
        status: 'pending',
        autoCheck: true
      },
      {
        id: 'gate-4-2',
        description: 'Well placement optimization completed',
        type: 'deliverable',
        required: true,
        status: 'pending',
        autoCheck: true
      },
      {
        id: 'gate-4-3',
        description: 'NPV calculations validated across all scenarios',
        type: 'validation',
        required: true,
        status: 'pending',
        autoCheck: true
      },
      {
        id: 'gate-4-4',
        description: 'Multi-disciplinary review meeting conducted',
        type: 'approval',
        required: true,
        status: 'pending',
        autoCheck: false
      },
      {
        id: 'gate-4-5',
        description: 'Executive summary prepared',
        type: 'deliverable',
        required: false,
        status: 'pending',
        autoCheck: false
      }
    ],
    deliverables: [
      'Optimal well placement',
      'Development strategy',
      'Final recommendations',
      'Executive summary'
    ],
    estimatedDuration: 14,
    blockedReason: 'Waiting for Stage 3 completion',
    dataExchanges: 15
  },
  {
    id: 'stage-5',
    name: 'Stage 5: Final Approval & Documentation',
    order: 5,
    status: 'not-started',
    disciplines: ['economics', 'operations'],
    dependencies: ['stage-4'],
    gateCriteria: [
      {
        id: 'gate-5-1',
        description: 'FDP document prepared and reviewed',
        type: 'deliverable',
        required: true,
        status: 'pending',
        autoCheck: false
      },
      {
        id: 'gate-5-2',
        description: 'Asset Manager approval obtained',
        type: 'approval',
        required: true,
        status: 'pending',
        autoCheck: false
      },
      {
        id: 'gate-5-3',
        description: 'Executive team sign-off',
        type: 'approval',
        required: true,
        status: 'pending',
        autoCheck: false
      },
      {
        id: 'gate-5-4',
        description: 'All audit trail records complete',
        type: 'validation',
        required: true,
        status: 'pending',
        autoCheck: true
      }
    ],
    deliverables: [
      'Final FDP Report',
      'Executive summary',
      'Technical appendices',
      'Approval documentation'
    ],
    estimatedDuration: 7,
    dataExchanges: 5
  }
];

const initialDisciplines: DisciplineConnection[] = [
  { id: 'geology', name: 'Geology', status: 'connected', quality: 92, lastSyncAt: '2025-02-08T10:15:00', issues: [] },
  { id: 'geophysics', name: 'Geophysics', status: 'connected', quality: 90, lastSyncAt: '2025-02-08T10:15:00', issues: [] },
  { id: 'petrophysics', name: 'Petrophysics', status: 'connected', quality: 96, lastSyncAt: '2025-02-08T10:15:00', issues: [] },
  { id: 'reservoir', name: 'Reservoir Engineering', status: 'connected', quality: 94, lastSyncAt: '2025-02-08T10:20:00', issues: [] },
  { id: 'geomechanics', name: 'Geomechanics', status: 'connected', quality: 88, lastSyncAt: '2025-02-08T09:45:00', issues: ['Minor data lag'] },
  { id: 'production', name: 'Production Engineering', status: 'connected', quality: 93, lastSyncAt: '2025-02-08T10:18:00', issues: [] },
  { id: 'facilities', name: 'Facilities Engineering', status: 'connected', quality: 89, lastSyncAt: '2025-02-08T10:10:00', issues: [] },
  { id: 'drilling', name: 'Drilling & Completions', status: 'connected', quality: 91, lastSyncAt: '2025-02-08T10:05:00', issues: [] },
  { id: 'economics', name: 'Economics & Planning', status: 'connected', quality: 91, lastSyncAt: '2025-02-08T10:22:00', issues: [] },
  { id: 'operations', name: 'Operations', status: 'connected', quality: 98, lastSyncAt: '2025-02-08T10:25:00', issues: [] }
];

// ============================================================================
// CONTEXT
// ============================================================================

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [stages, setStages] = useState<WorkflowStage[]>(initialStages);
  const [disciplines, setDisciplines] = useState<DisciplineConnection[]>(initialDisciplines);
  const [activeBottlenecks, setActiveBottlenecks] = useState<WorkflowBottleneck[]>([]);

  // ============================================================================
  // DEPENDENCY CHECKING
  // ============================================================================

  const checkDependencies = useCallback((stageId: string): { satisfied: boolean; missing: string[] } => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return { satisfied: false, missing: [] };

    const missing = stage.dependencies.filter(depId => {
      const depStage = stages.find(s => s.id === depId);
      return !depStage || depStage.status !== 'completed';
    });

    return {
      satisfied: missing.length === 0,
      missing: missing.map(depId => stages.find(s => s.id === depId)?.name || depId)
    };
  }, [stages]);

  // ============================================================================
  // GATE VALIDATION
  // ============================================================================

  const validateGate = useCallback(async (stageId: string, criteriaId: string): Promise<boolean> => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return false;

    const criteria = stage.gateCriteria.find(c => c.id === criteriaId);
    if (!criteria) return false;

    // Simulate validation logic
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          gateCriteria: s.gateCriteria.map(c => {
            if (c.id === criteriaId) {
              return {
                ...c,
                status: 'checking' as const,
                checkedAt: new Date().toISOString(),
                checkedBy: 'System'
              };
            }
            return c;
          })
        };
      }
      return s;
    }));

    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Auto-validation logic based on type
    let passed = false;
    if (criteria.autoCheck) {
      if (criteria.type === 'data-quality') {
        passed = Math.random() > 0.2; // 80% pass rate for demo
      } else if (criteria.type === 'validation') {
        passed = Math.random() > 0.3; // 70% pass rate
      } else if (criteria.type === 'deliverable') {
        passed = Math.random() > 0.15; // 85% pass rate
      } else if (criteria.type === 'dependency') {
        passed = checkDependencies(stageId).satisfied;
      }
    }

    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          gateCriteria: s.gateCriteria.map(c => {
            if (c.id === criteriaId) {
              return {
                ...c,
                status: passed ? 'passed' : 'failed',
                checkedAt: new Date().toISOString(),
                checkedBy: 'System'
              };
            }
            return c;
          })
        };
      }
      return s;
    }));

    return passed;
  }, [stages, checkDependencies]);

  const validateAllGates = useCallback(async (stageId: string): Promise<boolean> => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return false;

    const autoCheckGates = stage.gateCriteria.filter(c => c.autoCheck && c.status === 'pending');
    
    for (const gate of autoCheckGates) {
      await validateGate(stageId, gate.id);
    }

    const updatedStage = stages.find(s => s.id === stageId);
    const allRequired = updatedStage?.gateCriteria.filter(c => c.required) || [];
    const allPassed = allRequired.every(c => c.status === 'passed');

    return allPassed;
  }, [stages, validateGate]);

  const forceOverrideGate = useCallback(async (stageId: string, criteriaId: string, reason: string): Promise<boolean> => {
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          gateCriteria: s.gateCriteria.map(c => {
            if (c.id === criteriaId) {
              return {
                ...c,
                status: 'passed' as const,
                checkedAt: new Date().toISOString(),
                checkedBy: 'Manual Override',
                details: `Override reason: ${reason}`
              };
            }
            return c;
          })
        };
      }
      return s;
    }));

    toast.warning('Gate check overridden', {
      description: `Manual override applied with reason: ${reason}`
    });

    return true;
  }, []);

  // ============================================================================
  // STAGE CONTROL
  // ============================================================================

  const canStartStage = useCallback((stageId: string): { allowed: boolean; reasons: string[] } => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return { allowed: false, reasons: ['Stage not found'] };

    const reasons: string[] = [];

    // Check if already started or completed
    if (stage.status === 'in-progress') {
      return { allowed: false, reasons: ['Stage is already in progress'] };
    }
    if (stage.status === 'completed') {
      return { allowed: false, reasons: ['Stage is already completed'] };
    }

    // Check dependencies
    const depCheck = checkDependencies(stageId);
    if (!depCheck.satisfied) {
      reasons.push(`Missing dependencies: ${depCheck.missing.join(', ')}`);
    }

    // Check if required disciplines are connected
    const disconnectedDisciplines = stage.disciplines.filter(discId => {
      const disc = disciplines.find(d => d.id === discId);
      return !disc || disc.status === 'disconnected';
    });
    if (disconnectedDisciplines.length > 0) {
      reasons.push(`Disciplines not connected: ${disconnectedDisciplines.join(', ')}`);
    }

    // Check if previous stage gates are all passed
    if (stage.dependencies.length > 0) {
      for (const depId of stage.dependencies) {
        const depStage = stages.find(s => s.id === depId);
        if (depStage) {
          const requiredGates = depStage.gateCriteria.filter(c => c.required);
          const failedGates = requiredGates.filter(c => c.status !== 'passed');
          if (failedGates.length > 0) {
            reasons.push(`Previous stage has ${failedGates.length} failed gate checks`);
          }
        }
      }
    }

    return { allowed: reasons.length === 0, reasons };
  }, [stages, disciplines, checkDependencies]);

  const startStage = useCallback(async (stageId: string): Promise<boolean> => {
    const check = canStartStage(stageId);
    
    if (!check.allowed) {
      toast.error('Cannot start stage', {
        description: check.reasons.join('; ')
      });
      return false;
    }

    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          status: 'in-progress' as const,
          startedAt: new Date().toISOString()
        };
      }
      return s;
    }));

    const stage = stages.find(s => s.id === stageId);
    toast.success('Stage started', {
      description: `${stage?.name} is now in progress`
    });

    return true;
  }, [stages, canStartStage]);

  const completeStage = useCallback(async (stageId: string): Promise<boolean> => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return false;

    // Check if all required gates are passed
    const requiredGates = stage.gateCriteria.filter(c => c.required);
    const failedGates = requiredGates.filter(c => c.status !== 'passed');

    if (failedGates.length > 0) {
      toast.error('Cannot complete stage', {
        description: `${failedGates.length} required gate checks have not passed`
      });
      return false;
    }

    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        const startedAt = s.startedAt ? new Date(s.startedAt) : new Date();
        const completedAt = new Date();
        const actualDuration = Math.ceil((completedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...s,
          status: 'completed' as const,
          completedAt: completedAt.toISOString(),
          actualDuration
        };
      }
      return s;
    }));

    // Update dependent stages from 'blocked' to 'ready'
    setStages(prev => prev.map(s => {
      if (s.dependencies.includes(stageId) && s.status === 'blocked') {
        const allDepsComplete = s.dependencies.every(depId => {
          const depStage = prev.find(stage => stage.id === depId);
          return depStage?.status === 'completed';
        });
        if (allDepsComplete) {
          return { ...s, status: 'ready' as const, blockedReason: undefined };
        }
      }
      return s;
    }));

    toast.success('Stage completed', {
      description: `${stage.name} has been marked as complete`
    });

    return true;
  }, [stages]);

  // ============================================================================
  // BOTTLENECK DETECTION
  // ============================================================================

  const detectBottlenecks = useCallback((): WorkflowBottleneck[] => {
    const bottlenecks: WorkflowBottleneck[] = [];
    const now = new Date();

    stages.forEach(stage => {
      // Check for dependency bottlenecks
      if (stage.status === 'blocked') {
        const depCheck = checkDependencies(stage.id);
        if (!depCheck.satisfied) {
          bottlenecks.push({
            id: `bottleneck-dep-${stage.id}`,
            type: 'dependency',
            severity: 'high',
            stageId: stage.id,
            stageName: stage.name,
            description: `Stage is blocked waiting for dependencies: ${depCheck.missing.join(', ')}`,
            impact: 'Stage cannot start until dependencies are completed',
            detectedAt: now.toISOString(),
            estimatedDelay: 7,
            recommendations: [
              'Review progress of dependent stages',
              'Consider parallel execution if possible',
              'Escalate to project manager'
            ],
            autoResolvable: false
          });
        }
      }

      // Check for quality bottlenecks
      if (stage.qualityScore && stage.qualityScore < 85 && stage.status === 'in-progress') {
        bottlenecks.push({
          id: `bottleneck-quality-${stage.id}`,
          type: 'quality',
          severity: stage.qualityScore < 75 ? 'critical' : 'medium',
          stageId: stage.id,
          stageName: stage.name,
          description: `Data quality is below threshold (${stage.qualityScore}% vs 85% required)`,
          impact: 'May fail gate checks and delay stage completion',
          detectedAt: now.toISOString(),
          estimatedDelay: 3,
          recommendations: [
            'Review data sources and validation rules',
            'Sync missing or outdated data',
            'Contact data owners for updates'
            ],
          autoResolvable: true
        });
      }

      // Check for approval bottlenecks
      const pendingApprovals = stage.gateCriteria.filter(
        c => c.type === 'approval' && c.required && c.status === 'pending' && stage.status === 'in-progress'
      );
      if (pendingApprovals.length > 0) {
        bottlenecks.push({
          id: `bottleneck-approval-${stage.id}`,
          type: 'approval',
          severity: 'medium',
          stageId: stage.id,
          stageName: stage.name,
          description: `${pendingApprovals.length} required approvals pending`,
          impact: 'Stage cannot be completed until approvals are obtained',
          detectedAt: now.toISOString(),
          estimatedDelay: 5,
          recommendations: [
            'Send reminder notifications to approvers',
            'Schedule review meeting',
            'Prepare approval documentation'
          ],
          autoResolvable: false
        });
      }

      // Check for data gap bottlenecks
      const failedDataChecks = stage.gateCriteria.filter(
        c => c.type === 'data-quality' && c.required && c.status === 'failed'
      );
      if (failedDataChecks.length > 0) {
        bottlenecks.push({
          id: `bottleneck-data-${stage.id}`,
          type: 'data-gap',
          severity: 'high',
          stageId: stage.id,
          stageName: stage.name,
          description: `${failedDataChecks.length} data quality checks failed`,
          impact: 'Stage progress blocked by missing or invalid data',
          detectedAt: now.toISOString(),
          estimatedDelay: 10,
          recommendations: [
            'Identify missing data sources',
            'Initiate data acquisition workflows',
            'Consider using analog data as interim solution'
          ],
          autoResolvable: false
        });
      }

      // Check for duration overruns
      if (stage.startedAt && stage.status === 'in-progress') {
        const startDate = new Date(stage.startedAt);
        const daysSinceStart = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceStart > stage.estimatedDuration * 1.2) {
          bottlenecks.push({
            id: `bottleneck-schedule-${stage.id}`,
            type: 'resource',
            severity: daysSinceStart > stage.estimatedDuration * 1.5 ? 'critical' : 'high',
            stageId: stage.id,
            stageName: stage.name,
            description: `Stage is ${daysSinceStart - stage.estimatedDuration} days behind schedule`,
            impact: 'Overall project timeline at risk',
            detectedAt: now.toISOString(),
            estimatedDelay: daysSinceStart - stage.estimatedDuration,
            recommendations: [
              'Allocate additional resources',
              'Review and adjust scope if possible',
              'Escalate to management'
            ],
            autoResolvable: false
          });
        }
      }
    });

    return bottlenecks;
  }, [stages, checkDependencies]);

  const resolveBottleneck = useCallback(async (bottleneckId: string): Promise<boolean> => {
    const bottleneck = activeBottlenecks.find(b => b.id === bottleneckId);
    if (!bottleneck) return false;

    if (!bottleneck.autoResolvable) {
      toast.error('Cannot auto-resolve', {
        description: 'This bottleneck requires manual intervention'
      });
      return false;
    }

    toast.info('Resolving bottleneck...', {
      description: 'Attempting automatic resolution'
    });

    // Simulate resolution
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (bottleneck.type === 'quality') {
      // Trigger data sync
      const stage = stages.find(s => s.id === bottleneck.stageId);
      if (stage) {
        for (const discId of stage.disciplines) {
          await syncDiscipline(discId);
        }
      }
    }

    setActiveBottlenecks(prev => prev.filter(b => b.id !== bottleneckId));

    toast.success('Bottleneck resolved', {
      description: 'Issue has been automatically resolved'
    });

    return true;
  }, [activeBottlenecks, stages]);

  // ============================================================================
  // DATA SYNC
  // ============================================================================

  const syncDiscipline = useCallback(async (disciplineId: string): Promise<boolean> => {
    setDisciplines(prev => prev.map(d => {
      if (d.id === disciplineId) {
        return { ...d, status: 'syncing' as const };
      }
      return d;
    }));

    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500));

    setDisciplines(prev => prev.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          status: 'connected' as const,
          quality: Math.min(100, d.quality + Math.floor(Math.random() * 5)),
          lastSyncAt: new Date().toISOString(),
          issues: []
        };
      }
      return d;
    }));

    return true;
  }, []);

  const syncAllDisciplines = useCallback(async (): Promise<boolean> => {
    toast.info('Syncing all disciplines...', {
      description: 'Synchronizing data across all 10 disciplines'
    });

    for (const disc of disciplines) {
      await syncDiscipline(disc.id);
    }

    toast.success('All disciplines synchronized', {
      description: 'Data sync completed successfully'
    });

    return true;
  }, [disciplines, syncDiscipline]);

  // ============================================================================
  // MANUAL UPDATES
  // ============================================================================

  const updateStageQuality = useCallback((stageId: string, quality: number) => {
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return { ...s, qualityScore: quality };
      }
      return s;
    }));
  }, []);

  const updateGateCriteria = useCallback((stageId: string, criteriaId: string, status: GateCriteria['status']) => {
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          gateCriteria: s.gateCriteria.map(c => {
            if (c.id === criteriaId) {
              return {
                ...c,
                status,
                checkedAt: new Date().toISOString(),
                checkedBy: 'Manual Update'
              };
            }
            return c;
          })
        };
      }
      return s;
    }));
  }, []);

  // ============================================================================
  // METRICS CALCULATION
  // ============================================================================

  const calculateMetrics = useCallback((): WorkflowMetrics => {
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const totalStages = stages.length;
    const overallProgress = (completedStages / totalStages) * 100;

    const activeStages = stages.filter(s => s.status === 'in-progress').length;
    const blockedStages = stages.filter(s => s.status === 'blocked').length;

    const totalDataExchanges = stages.reduce((sum, s) => sum + s.dataExchanges, 0);
    
    const stagesWithQuality = stages.filter(s => s.qualityScore !== undefined);
    const averageQuality = stagesWithQuality.length > 0
      ? stagesWithQuality.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / stagesWithQuality.length
      : 0;

    const bottlenecks = detectBottlenecks();

    // Calculate critical path (simplified)
    const criticalPath = stages
      .filter(s => s.status !== 'completed')
      .sort((a, b) => a.order - b.order)
      .map(s => s.id);

    // Calculate estimated completion
    const remainingDays = stages
      .filter(s => s.status !== 'completed')
      .reduce((sum, s) => sum + s.estimatedDuration, 0);
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + remainingDays);

    // Check if on schedule
    const delayedStages = stages.filter(s => {
      if (s.startedAt && s.status === 'in-progress') {
        const startDate = new Date(s.startedAt);
        const daysSinceStart = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceStart > s.estimatedDuration;
      }
      return false;
    });
    const onSchedule = delayedStages.length === 0;

    return {
      overallProgress,
      activeStages,
      completedStages,
      blockedStages,
      totalDataExchanges,
      averageQuality,
      bottlenecks,
      criticalPath,
      estimatedCompletion: estimatedCompletion.toISOString(),
      onSchedule
    };
  }, [stages, detectBottlenecks]);

  const metrics = calculateMetrics();

  // ============================================================================
  // AUTO-DETECTION
  // ============================================================================

  useEffect(() => {
    // Auto-detect bottlenecks every 30 seconds
    const interval = setInterval(() => {
      const newBottlenecks = detectBottlenecks();
      
      // Only add new bottlenecks that aren't already in the list
      setActiveBottlenecks(prev => {
        const existingIds = new Set(prev.map(b => b.id));
        const trulyNew = newBottlenecks.filter(b => !existingIds.has(b.id));
        
        if (trulyNew.length > 0) {
          // Show toast for critical bottlenecks
          const critical = trulyNew.filter(b => b.severity === 'critical');
          if (critical.length > 0) {
            toast.error('Critical bottleneck detected', {
              description: critical[0].description
            });
          }
        }
        
        return newBottlenecks;
      });
    }, 30000);

    // Initial detection
    setActiveBottlenecks(detectBottlenecks());

    return () => clearInterval(interval);
  }, [detectBottlenecks]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: WorkflowContextType = {
    stages,
    disciplines,
    metrics,
    activeBottlenecks,
    startStage,
    completeStage,
    validateGate,
    validateAllGates,
    forceOverrideGate,
    detectBottlenecks,
    resolveBottleneck,
    checkDependencies,
    canStartStage,
    syncDiscipline,
    syncAllDisciplines,
    updateStageQuality,
    updateGateCriteria
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
}
