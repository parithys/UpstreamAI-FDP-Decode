import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Layers,
  Droplet,
  Activity,
  DollarSign,
  Wrench,
  Database,
  ArrowRight,
  Network,
  GitMerge,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Drill,
  Mountain,
  Filter,
  X,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';

interface MultidisciplinaryIntegrationProps {
  variant?: 'full' | 'compact';
  showInteractions?: boolean;
  userRole?: string;
}

const disciplines = [
  {
    id: 'geology',
    name: 'Geology',
    icon: Layers,
    color: '#EF4444',
    bgColor: 'bg-[#EF4444]/10',
    borderColor: 'border-[#EF4444]/30',
    team: 'Geoscience Team',
    tools: ['Petrel', 'SeisWare', 'GeoFrame'],
    dataOutputs: [
      'Structural framework',
      'Facies distribution',
      'Net-to-gross maps',
      'Depth maps'
    ],
    dataInputs: ['Seismic data', 'Well tops', 'Core data'],
    status: 'connected',
    quality: 92,
    category: 'subsurface'
  },
  {
    id: 'geophysics',
    name: 'Geophysics',
    icon: Activity,
    color: '#DC2626',
    bgColor: 'bg-[#DC2626]/10',
    borderColor: 'border-[#DC2626]/30',
    team: 'Geophysics Team',
    tools: ['SeisWare', 'Petrel', 'HRS'],
    dataOutputs: [
      'Seismic interpretation',
      'Velocity models',
      'Attribute analysis',
      'Fault identification'
    ],
    dataInputs: ['3D seismic', '2D seismic', 'Well velocities'],
    status: 'connected',
    quality: 90,
    category: 'subsurface'
  },
  {
    id: 'petrophysics',
    name: 'Petrophysics',
    icon: Database,
    color: '#F59E0B',
    bgColor: 'bg-[#F59E0B]/10',
    borderColor: 'border-[#F59E0B]/30',
    team: 'Petrophysics Team',
    tools: ['Techlog', 'Geolog', 'PowerLog'],
    dataOutputs: [
      'Rock properties',
      'Fluid saturations',
      'Pay zones',
      'PVT parameters'
    ],
    dataInputs: ['Well logs', 'Core analysis', 'Lab tests'],
    status: 'connected',
    quality: 96,
    category: 'subsurface'
  },
  {
    id: 'reservoir',
    name: 'Reservoir Engineering',
    icon: Droplet,
    color: '#0047BA',
    bgColor: 'bg-[#0047BA]/10',
    borderColor: 'border-[#0047BA]/30',
    team: 'Reservoir Engineering',
    tools: ['Eclipse', 'Intersect', 'tNavigator'],
    dataOutputs: [
      'Production forecasts',
      'Recovery factors',
      'Pressure predictions',
      'Well performance'
    ],
    dataInputs: ['Geological model', 'Rock properties', 'Production data', 'Well constraints'],
    status: 'connected',
    quality: 94,
    category: 'subsurface'
  },
  {
    id: 'geomechanics',
    name: 'Geomechanics',
    icon: Mountain,
    color: '#7C3AED',
    bgColor: 'bg-[#7C3AED]/10',
    borderColor: 'border-[#7C3AED]/30',
    team: 'Geomechanics Team',
    tools: ['Visage', 'ELFEN', 'FLAC3D'],
    dataOutputs: [
      'Stress analysis',
      'Fault stability',
      'Subsidence predictions',
      'Sand production risk'
    ],
    dataInputs: ['Geological model', 'Rock mechanics tests', 'Well logs'],
    status: 'connected',
    quality: 88,
    category: 'subsurface'
  },
  {
    id: 'production',
    name: 'Production Engineering',
    icon: TrendingUp,
    color: '#10B981',
    bgColor: 'bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/30',
    team: 'Production Engineering',
    tools: ['PIPESIM', 'PROSPER', 'OLGA'],
    dataOutputs: [
      'Well performance analysis',
      'Artificial lift design',
      'Flow assurance',
      'Production optimization'
    ],
    dataInputs: ['Well rates', 'Fluid properties', 'Equipment specs', 'Reservoir data'],
    status: 'connected',
    quality: 93,
    category: 'surface'
  },
  {
    id: 'facilities',
    name: 'Facilities Engineering',
    icon: Building2,
    color: '#059669',
    bgColor: 'bg-[#059669]/10',
    borderColor: 'border-[#059669]/30',
    team: 'Facilities Engineering',
    tools: ['GAP', 'HYSYS', 'Aspen Plus'],
    dataOutputs: [
      'Processing capacity',
      'Pipeline capacity',
      'Surface constraints',
      'Infrastructure design'
    ],
    dataInputs: ['Production forecasts', 'Fluid compositions', 'Equipment specs'],
    status: 'connected',
    quality: 89,
    category: 'surface'
  },
  {
    id: 'drilling',
    name: 'Drilling & Completions',
    icon: Drill,
    color: '#EA580C',
    bgColor: 'bg-[#EA580C]/10',
    borderColor: 'border-[#EA580C]/30',
    team: 'Drilling Team',
    tools: ['DrillPlan', 'Drilling Office', 'WellView'],
    dataOutputs: [
      'Well trajectories',
      'Drilling programs',
      'Completion designs',
      'Cost estimates'
    ],
    dataInputs: ['Geological models', 'Geomechanics data', 'Target zones'],
    status: 'connected',
    quality: 91,
    category: 'operations'
  },
  {
    id: 'economics',
    name: 'Economics & Planning',
    icon: DollarSign,
    color: '#8B5CF6',
    bgColor: 'bg-[#8B5CF6]/10',
    borderColor: 'border-[#8B5CF6]/30',
    team: 'Commercial Team',
    tools: ['DecisionSpace', 'ARIES', 'Excel'],
    dataOutputs: [
      'NPV calculations',
      'Economic indicators',
      'Cost estimates',
      'Price forecasts'
    ],
    dataInputs: ['Production forecasts', 'CAPEX/OPEX', 'Market data'],
    status: 'connected',
    quality: 91,
    category: 'business'
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: Wrench,
    color: '#00BCD4',
    bgColor: 'bg-[#00BCD4]/10',
    borderColor: 'border-[#00BCD4]/30',
    team: 'Operations Team',
    tools: ['SAP', 'SCADA', 'PI System'],
    dataOutputs: [
      'Real-time production',
      'Well status',
      'Maintenance schedules',
      'Operational constraints'
    ],
    dataInputs: ['Field measurements', 'Equipment status', 'Historical performance'],
    status: 'connected',
    quality: 98,
    category: 'operations'
  }
];

const crossDisciplineLinks = [
  { from: 'geology', to: 'reservoir', label: 'Geological Model', critical: true },
  { from: 'geophysics', to: 'geology', label: 'Seismic Interpretation', critical: true },
  { from: 'petrophysics', to: 'geology', label: 'Rock Properties', critical: true },
  { from: 'petrophysics', to: 'reservoir', label: 'PVT & Saturation', critical: true },
  { from: 'geology', to: 'geomechanics', label: 'Structural Model', critical: true },
  { from: 'geomechanics', to: 'drilling', label: 'Stress & Stability', critical: true },
  { from: 'reservoir', to: 'production', label: 'Well Rates & IPR', critical: true },
  { from: 'production', to: 'facilities', label: 'Well Streams', critical: true },
  { from: 'reservoir', to: 'drilling', label: 'Target Zones', critical: true },
  { from: 'drilling', to: 'reservoir', label: 'Well Data', critical: false },
  { from: 'reservoir', to: 'economics', label: 'Production Forecasts', critical: true },
  { from: 'facilities', to: 'economics', label: 'CAPEX/OPEX', critical: true },
  { from: 'production', to: 'reservoir', label: 'Facility Constraints', critical: false },
  { from: 'operations', to: 'reservoir', label: 'Historical Data', critical: true },
  { from: 'operations', to: 'production', label: 'Real-time Status', critical: false },
  { from: 'economics', to: 'reservoir', label: 'Economic Scenarios', critical: false }
];

// Role-based access control (optional)
const roleAccess: Record<string, string[]> = {
  'Reservoir Engineer': ['reservoir', 'production', 'facilities', 'geology', 'petrophysics', 'geomechanics'],
  'Geoscientist': ['geology', 'geophysics', 'petrophysics', 'reservoir'],
  'Production Engineer': ['production', 'reservoir', 'operations', 'facilities'],
  'Facilities Engineer': ['facilities', 'production', 'operations', 'economics'],
  'Drilling Engineer': ['drilling', 'reservoir', 'geomechanics', 'geology'],
  'Geomechanics Engineer': ['geomechanics', 'geology', 'drilling'],
  'Executive': ['geology', 'geophysics', 'petrophysics', 'reservoir', 'geomechanics', 'production', 'facilities', 'drilling', 'economics', 'operations'],
  'Administrator': ['geology', 'geophysics', 'petrophysics', 'reservoir', 'geomechanics', 'production', 'facilities', 'drilling', 'economics', 'operations']
};

export function MultidisciplinaryIntegration({ 
  variant = 'full', 
  showInteractions = true,
  userRole = 'Administrator'
}: MultidisciplinaryIntegrationProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [hoveredDiscipline, setHoveredDiscipline] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredDisciplines, setFilteredDisciplines] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get accessible disciplines based on role
  const accessibleDisciplines = userRole === 'Administrator' || userRole === 'Executive'
    ? disciplines
    : disciplines.filter(d => roleAccess[userRole]?.includes(d.id) || true); // Allow all for demo

  // Apply filters
  const visibleDisciplines = accessibleDisciplines.filter(d => {
    if (filteredDisciplines.length > 0 && !filteredDisciplines.includes(d.id)) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  const visibleLinks = crossDisciplineLinks.filter(link => 
    visibleDisciplines.some(d => d.id === link.from) && 
    visibleDisciplines.some(d => d.id === link.to)
  );

  const getRelatedLinks = (disciplineId: string) => {
    return visibleLinks.filter(
      link => link.from === disciplineId || link.to === disciplineId
    );
  };

  const toggleDisciplineFilter = (disciplineId: string) => {
    setFilteredDisciplines(prev => 
      prev.includes(disciplineId)
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const clearFilters = () => {
    setFilteredDisciplines([]);
    setCategoryFilter('all');
  };

  if (variant === 'compact') {
    return (
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Multidisciplinary Data Integration</h3>
            <p className="text-sm text-text-secondary mt-1">
              {visibleDisciplines.length} disciplines • {visibleLinks.length} active data links
            </p>
          </div>
          <Badge className="bg-success/10 text-success border-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Connected
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {visibleDisciplines.map((discipline) => {
            const Icon = discipline.icon;
            return (
              <div
                key={discipline.id}
                className={`${discipline.bgColor} ${discipline.borderColor} border rounded-lg p-3`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: discipline.color }} />
                  <span className="text-sm font-medium text-text-primary">{discipline.name}</span>
                </div>
                <div className="text-xs text-text-secondary">{discipline.team}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-background-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${discipline.quality}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-tertiary">{discipline.quality}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-card-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-1">
            Cross-Discipline Data Integration Architecture
          </h3>
          <p className="text-sm text-text-secondary">
            Real-time data flow across {visibleDisciplines.length} disciplines with {visibleLinks.length} active integration points
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Badge className="bg-success/10 text-success border-success/30">
            <Network className="w-3 h-3 mr-1" />
            {visibleDisciplines.filter(d => d.status === 'connected').length} / {visibleDisciplines.length} Connected
          </Badge>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-background-secondary rounded-lg p-4 mb-6 border border-card-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-text-primary">Filter Disciplines</h4>
            </div>
            {(filteredDisciplines.length > 0 || categoryFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-3">
            <div className="text-xs text-text-tertiary mb-2">Category:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-background-primary text-text-secondary hover:bg-card-hover'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter('subsurface')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  categoryFilter === 'subsurface'
                    ? 'bg-primary text-white'
                    : 'bg-background-primary text-text-secondary hover:bg-card-hover'
                }`}
              >
                Subsurface
              </button>
              <button
                onClick={() => setCategoryFilter('surface')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  categoryFilter === 'surface'
                    ? 'bg-primary text-white'
                    : 'bg-background-primary text-text-secondary hover:bg-card-hover'
                }`}
              >
                Surface
              </button>
              <button
                onClick={() => setCategoryFilter('operations')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  categoryFilter === 'operations'
                    ? 'bg-primary text-white'
                    : 'bg-background-primary text-text-secondary hover:bg-card-hover'
                }`}
              >
                Operations
              </button>
              <button
                onClick={() => setCategoryFilter('business')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  categoryFilter === 'business'
                    ? 'bg-primary text-white'
                    : 'bg-background-primary text-text-secondary hover:bg-card-hover'
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {/* Individual Discipline Toggles */}
          <div>
            <div className="text-xs text-text-tertiary mb-2">Toggle Disciplines:</div>
            <div className="flex flex-wrap gap-2">
              {accessibleDisciplines.map(discipline => {
                const Icon = discipline.icon;
                const isActive = filteredDisciplines.length === 0 || filteredDisciplines.includes(discipline.id);
                return (
                  <button
                    key={discipline.id}
                    onClick={() => toggleDisciplineFilter(discipline.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      isActive
                        ? `${discipline.borderColor} ${discipline.bgColor} border-2`
                        : 'border-card-border bg-background-primary text-text-tertiary opacity-50'
                    }`}
                    style={isActive ? { color: discipline.color } : {}}
                  >
                    {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <Icon className="w-3 h-3" />
                    {discipline.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role-based Access Notice */}
          {userRole !== 'Administrator' && userRole !== 'Executive' && (
            <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-center gap-2 text-xs text-primary">
                <AlertCircle className="w-3 h-3" />
                <span>Viewing as: <strong>{userRole}</strong> (limited access)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discipline Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {visibleDisciplines.map((discipline) => {
          const Icon = discipline.icon;
          const isSelected = selectedDiscipline === discipline.id;
          const isHovered = hoveredDiscipline === discipline.id;
          const relatedLinks = getRelatedLinks(discipline.id);
          
          return (
            <div
              key={discipline.id}
              onMouseEnter={() => setHoveredDiscipline(discipline.id)}
              onMouseLeave={() => setHoveredDiscipline(null)}
              onClick={() => setSelectedDiscipline(isSelected ? null : discipline.id)}
              className={`${discipline.bgColor} ${discipline.borderColor} border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary shadow-glow-hover' : ''
              } ${isHovered ? 'scale-105 shadow-glow' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${discipline.bgColor} rounded-lg p-2`}>
                  <Icon className="w-6 h-6" style={{ color: discipline.color }} />
                </div>
                <Badge className={`${discipline.bgColor} border-0 text-xs`} style={{ color: discipline.color }}>
                  {relatedLinks.length} links
                </Badge>
              </div>

              <h4 className="font-semibold text-text-primary mb-1">{discipline.name}</h4>
              <p className="text-xs text-text-secondary mb-3">{discipline.team}</p>

              {/* Tools */}
              <div className="mb-3">
                <div className="text-xs text-text-tertiary mb-1">Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {discipline.tools.slice(0, 2).map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded bg-background-secondary text-text-secondary"
                    >
                      {tool}
                    </span>
                  ))}
                  {discipline.tools.length > 2 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-background-secondary text-text-tertiary">
                      +{discipline.tools.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Data Quality */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Quality:</span>
                <div className="flex-1 h-2 bg-background-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${discipline.quality}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-primary">{discipline.quality}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Flow Visualization */}
      {showInteractions && (
        <div className="bg-background-secondary rounded-lg p-6 border border-card-border mb-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Active Data Links</h4>
          <div className="grid grid-cols-3 gap-3">
            {visibleLinks.map((link, idx) => {
              const fromDiscipline = disciplines.find(d => d.id === link.from);
              const toDiscipline = disciplines.find(d => d.id === link.to);
              
              if (!fromDiscipline || !toDiscipline) return null;

              const isHighlighted = 
                selectedDiscipline === link.from || 
                selectedDiscipline === link.to ||
                hoveredDiscipline === link.from ||
                hoveredDiscipline === link.to;

              return (
                <div
                  key={idx}
                  className={`bg-card rounded-lg p-3 border border-card-border transition-all ${
                    isHighlighted ? 'ring-2 ring-primary shadow-glow' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fromDiscipline.color }} />
                    <ArrowRight className="w-3 h-3 text-text-tertiary" />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: toDiscipline.color }} />
                    {link.critical && (
                      <Badge className="bg-danger/10 text-danger border-danger/30 text-xs ml-auto">
                        Critical
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-medium text-text-primary mb-1">{link.label}</div>
                  <div className="text-xs text-text-secondary">
                    {fromDiscipline.name} → {toDiscipline.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Discipline Details */}
      {selectedDiscipline && (
        <div className="bg-background-secondary rounded-lg p-6 border border-card-border">
          {(() => {
            const discipline = disciplines.find(d => d.id === selectedDiscipline);
            if (!discipline) return null;
            
            const Icon = discipline.icon;

            return (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${discipline.bgColor} rounded-lg p-3`}>
                      <Icon className="w-6 h-6" style={{ color: discipline.color }} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">{discipline.name}</h4>
                      <p className="text-sm text-text-secondary">{discipline.team}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDiscipline(null)}
                    className="text-text-secondary hover:text-text-primary text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-semibold text-text-primary mb-2">Data Inputs</h5>
                    <ul className="space-y-1">
                      {discipline.dataInputs.map((input, idx) => (
                        <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-text-primary mb-2">Data Outputs</h5>
                    <ul className="space-y-1">
                      {discipline.dataOutputs.map((output, idx) => (
                        <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-card-border">
                  <h5 className="text-sm font-semibold text-text-primary mb-2">Connected Tools</h5>
                  <div className="flex flex-wrap gap-2">
                    {discipline.tools.map((tool, idx) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-primary/30">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Integration Benefits */}
      <div className="mt-6 pt-6 border-t border-card-border">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Integration Benefits</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-success/10 rounded-lg p-2">
              <GitMerge className="w-4 h-4 text-success" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Unified Model</div>
              <div className="text-xs text-text-secondary">Single source of truth</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Network className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Real-Time Sync</div>
              <div className="text-xs text-text-secondary">Instant data updates</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <CheckCircle className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Data Validation</div>
              <div className="text-xs text-text-secondary">Cross-check integrity</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-warning/10 rounded-lg p-2">
              <TrendingUp className="w-4 h-4 text-warning" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Collaboration</div>
              <div className="text-xs text-text-secondary">Team workflows</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
