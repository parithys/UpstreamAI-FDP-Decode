import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MultidisciplinaryIntegration } from '../components/MultidisciplinaryIntegration';
import { useUser } from '../context/UserContext';
import {
  Network,
  Users,
  Lock,
  Unlock,
  Shield,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export function CrossDisciplineVisibility() {
  const { user, hasAccessToDiscipline, canViewAllDisciplines } = useUser();
  const [showAccessMatrix, setShowAccessMatrix] = useState(false);

  const disciplineList = [
    { id: 'geology', name: 'Geology', access: hasAccessToDiscipline('geology') },
    { id: 'geophysics', name: 'Geophysics', access: hasAccessToDiscipline('geophysics') },
    { id: 'petrophysics', name: 'Petrophysics', access: hasAccessToDiscipline('petrophysics') },
    { id: 'reservoir', name: 'Reservoir Engineering', access: hasAccessToDiscipline('reservoir') },
    { id: 'geomechanics', name: 'Geomechanics', access: hasAccessToDiscipline('geomechanics') },
    { id: 'production', name: 'Production Engineering', access: hasAccessToDiscipline('production') },
    { id: 'facilities', name: 'Facilities Engineering', access: hasAccessToDiscipline('facilities') },
    { id: 'drilling', name: 'Drilling & Completions', access: hasAccessToDiscipline('drilling') }
  ];

  const accessibleCount = disciplineList.filter(d => d.access).length;

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Cross-Discipline Data Visibility
              </h1>
              <p className="text-text-secondary">
                Access and explore data across all technical disciplines involved in field development planning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/30">
                <Network className="w-3 h-3 mr-1" />
                {accessibleCount}/8 Disciplines
              </Badge>
              <Button
                variant={showAccessMatrix ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAccessMatrix(!showAccessMatrix)}
              >
                <Shield className="w-4 h-4 mr-2" />
                {showAccessMatrix ? 'Hide' : 'Show'} Access Matrix
              </Button>
            </div>
          </div>
        </div>

        {/* Current User Role Banner */}
        <div className="bg-card rounded-lg border border-card-border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-text-tertiary">Current Role</div>
                <div className="text-lg font-semibold text-text-primary">{user.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-text-tertiary">Access Level</div>
                <div className="flex items-center gap-2">
                  {canViewAllDisciplines() ? (
                    <>
                      <Unlock className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Full Access</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-warning">Limited Access</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-tertiary">Accessible Disciplines</div>
                <div className="text-sm font-medium text-text-primary">{accessibleCount} of 8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Matrix */}
        {showAccessMatrix && (
          <div className="bg-card rounded-lg border border-card-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Discipline Access Matrix</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Your role determines which disciplines you can view and interact with
                </p>
              </div>
              <Badge className={canViewAllDisciplines() ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}>
                {canViewAllDisciplines() ? 'All Access Granted' : 'Restricted Access'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {disciplineList.map(discipline => (
                <div
                  key={discipline.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    discipline.access
                      ? 'bg-success/5 border-success/30'
                      : 'bg-background-secondary border-card-border opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {discipline.access ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-text-tertiary" />
                    )}
                    <span className="text-sm font-medium text-text-primary">{discipline.name}</span>
                  </div>
                  <Badge className={discipline.access ? 'bg-success/10 text-success border-success/30 text-xs' : 'bg-background-secondary text-text-tertiary border-card-border text-xs'}>
                    {discipline.access ? 'Accessible' : 'Restricted'}
                  </Badge>
                </div>
              ))}
            </div>

            {!canViewAllDisciplines() && (
              <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/30">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <div className="text-sm text-warning">
                    <strong>Limited Access:</strong> Your current role ({user.role}) provides access to {accessibleCount} of 8 disciplines.
                    Contact your administrator to request additional access.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multidisciplinary Integration Component */}
        <MultidisciplinaryIntegration variant="full" showInteractions={true} userRole={user.role} />

        {/* Integration Statistics */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 rounded-lg p-2">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{accessibleCount}</div>
                <div className="text-xs text-text-secondary">Accessible Disciplines</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-success/10 rounded-lg p-2">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">16</div>
                <div className="text-xs text-text-secondary">Active Data Links</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent/10 rounded-lg p-2">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">92.4%</div>
                <div className="text-xs text-text-secondary">Avg Data Quality</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-success/10 rounded-lg p-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">10/10</div>
                <div className="text-xs text-text-secondary">Systems Connected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Actions */}
        <div className="mt-6 bg-card rounded-lg border border-card-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Role-Based Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => toast.info('Opening data export wizard...')}
              disabled={!hasAccessToDiscipline('reservoir')}
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Opening collaboration tools...')}
            >
              Collaborate
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Opening access request form...')}
              disabled={canViewAllDisciplines()}
            >
              Request Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}