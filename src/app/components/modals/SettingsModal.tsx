import { X, Settings, User, Bell, Globe, Shield, UserCog, AlertTriangle, Download, Upload, Loader2, CheckCircle2, Clock, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser, getUserByRole, UserRole } from '../../context/UserContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { useNotifications } from '../../context/NotificationsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableRoles: UserRole[] = [
  'Administrator',
  'Executive',
  'Reservoir Engineer',
  'Geoscientist',
  'Production Engineer',
  'Facilities Engineer',
  'Drilling Engineer',
  'Geomechanics Engineer',
  'Petrophysicist',
  'Asset Manager'
];

interface UserSettings {
  profile: {
    name: string;
    email: string;
  };
  notifications: {
    emailNotifications: boolean;
    aiRecommendations: boolean;
    dataValidationAlerts: boolean;
  };
  localization: {
    language: string;
    timezone: string;
  };
  privacy: {
    twoFactorAuth: boolean;
    sessionTimeout: boolean;
  };
  role: UserRole;
  version: string;
  lastSaved?: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    name: 'Shamim Mohammed',
    email: 'user@upstreamai.com'
  },
  notifications: {
    emailNotifications: true,
    aiRecommendations: true,
    dataValidationAlerts: false
  },
  localization: {
    language: 'English',
    timezone: 'UTC+4 (Gulf Standard Time)'
  },
  privacy: {
    twoFactorAuth: true,
    sessionTimeout: false
  },
  role: 'Executive',
  version: '1.0.0'
};

const STORAGE_KEY = 'upstreamai_fdp_settings';
const SETTINGS_VERSION = '1.0.0';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, setUser } = useUser();
  const { confirmWarning, confirmSuccess } = useConfirmation();
  const { addNotification } = useNotifications();
  
  // State
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Load settings from localStorage or use defaults
  const loadSettings = (): UserSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Version migration logic
        if (parsed.version !== SETTINGS_VERSION) {
          console.log('Migrating settings to new version');
          return { ...DEFAULT_SETTINGS, ...parsed, role: user.role, version: SETTINGS_VERSION };
        }
        return { ...DEFAULT_SETTINGS, ...parsed, role: user.role };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings', {
        description: 'Using default settings instead'
      });
    }
    return { ...DEFAULT_SETTINGS, role: user.role };
  };

  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<UserSettings>(loadSettings());
  const [lastSaveTime, setLastSaveTime] = useState<string | null>(null);

  // Reload settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const loaded = loadSettings();
      setSettings(loaded);
      setOriginalSettings(loaded);
      setHasUnsavedChanges(false);
      setLastSaveTime(loaded.lastSaved || null);
    }
  }, [isOpen]);

  // Keyboard accessibility: ESC to close with confirmation if unsaved changes
  useEffect(() => {
    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        await handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasUnsavedChanges]);

  // Auto-save notification
  useEffect(() => {
    if (hasUnsavedChanges && isOpen) {
      const timer = setTimeout(() => {
        toast.info('You have unsaved changes', {
          description: 'Remember to save your settings before closing',
          duration: 3000
        });
      }, 30000); // Remind after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, isOpen]);

  // Track changes
  const updateProfile = (field: keyof UserSettings['profile'], value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateNotification = (field: keyof UserSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updateLocalization = (field: keyof UserSettings['localization'], value: string) => {
    setSettings(prev => ({
      ...prev,
      localization: { ...prev.localization, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const updatePrivacy = (field: keyof UserSettings['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleRoleChange = async (role: UserRole) => {
    const confirmed = await confirmWarning({
      title: 'Change Role',
      message: `Are you sure you want to change your role to "${role}"? This will update your discipline access and visible features.`,
      confirmLabel: 'Change Role',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      setSettings(prev => ({ ...prev, role }));
      const newUser = getUserByRole(role);
      setUser(newUser);
      setHasUnsavedChanges(true);
      
      toast.success(`Role changed to: ${role}`, {
        description: 'Discipline access updated based on role'
      });
    }
  };

  const handleSave = async () => {
    const confirmed = await confirmSuccess({
      title: 'Save Settings',
      message: 'Save your current settings? These will be applied immediately and persist across sessions.',
      confirmLabel: 'Save Settings',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) return;

    setIsSaving(true);
    toast.loading('Saving settings...', { id: 'save-settings' });

    // Simulate async save
    setTimeout(() => {
      try {
        const timestamp = new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        const settingsToSave = {
          ...settings,
          lastSaved: timestamp,
          version: SETTINGS_VERSION
        };

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
        
        // Update original settings to match current
        setOriginalSettings(settingsToSave);
        setHasUnsavedChanges(false);
        setLastSaveTime(timestamp);
        setIsSaving(false);
        
        toast.success('Settings Saved', {
          id: 'save-settings',
          description: 'Your preferences have been saved and will be applied across all sessions'
        });

        // Add system notification
        addNotification({
          type: 'success',
          priority: 'low',
          category: 'system',
          title: 'Settings Saved',
          message: 'Your user preferences have been updated successfully',
          actionLabel: 'View Settings',
          actionUrl: '#'
        });
        
        onClose();
      } catch (error) {
        console.error('Failed to save settings:', error);
        setIsSaving(false);
        toast.error('Failed to Save Settings', {
          id: 'save-settings',
          description: 'An error occurred while saving your preferences. Please try again.'
        });
      }
    }, 1000);
  };

  const handleClose = async () => {
    if (hasUnsavedChanges) {
      const confirmed = await confirmWarning({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to close without saving?',
        confirmLabel: 'Discard Changes',
        cancelLabel: 'Keep Editing'
      });

      if (!confirmed) {
        return;
      }

      // Revert to original settings
      setSettings(originalSettings);
      setHasUnsavedChanges(false);
    }
    
    onClose();
  };

  const handleResetToDefaults = async () => {
    const confirmed = await confirmWarning({
      title: 'Reset to Defaults',
      message: 'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
      confirmLabel: 'Reset to Defaults',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      const defaults = { ...DEFAULT_SETTINGS, role: user.role, version: SETTINGS_VERSION };
      setSettings(defaults);
      setHasUnsavedChanges(true);
      
      toast.success('Settings Reset to Defaults', {
        description: 'All preferences have been reset. Click "Save Changes" to apply.'
      });
    }
  };

  // Export settings
  const handleExportSettings = async () => {
    const confirmed = await confirmSuccess({
      title: 'Export Settings',
      message: 'Export your current settings as a JSON file? You can use this to backup or transfer your preferences.',
      confirmLabel: 'Export',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) return;

    setIsExporting(true);
    toast.loading('Preparing export...', { id: 'export-settings' });

    setTimeout(() => {
      try {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `upstreamai-fdp-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        toast.success('Settings Exported', {
          id: 'export-settings',
          description: 'Your settings have been downloaded as a JSON file'
        });

        addNotification({
          type: 'success',
          priority: 'low',
          category: 'data',
          title: 'Settings Exported',
          message: 'User settings exported successfully',
          actionLabel: 'View',
          actionUrl: '#'
        });
      } catch (error) {
        console.error('Export failed:', error);
        setIsExporting(false);
        toast.error('Export Failed', {
          id: 'export-settings',
          description: 'Failed to export settings'
        });
      }
    }, 1000);
  };

  // Import settings
  const handleImportSettings = async () => {
    const confirmed = await confirmWarning({
      title: 'Import Settings',
      message: 'Import settings from a JSON file? This will replace your current settings. Make sure to export your current settings first if you want to keep them.',
      confirmLabel: 'Import',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      toast.loading('Importing settings...', { id: 'import-settings' });

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importedSettings = JSON.parse(event.target?.result as string);
          
          // Validate imported settings
          if (!importedSettings.profile || !importedSettings.notifications) {
            throw new Error('Invalid settings file');
          }

          // Merge with defaults to ensure all fields exist
          const validatedSettings = {
            ...DEFAULT_SETTINGS,
            ...importedSettings,
            role: user.role, // Keep current role
            version: SETTINGS_VERSION
          };

          setSettings(validatedSettings);
          setHasUnsavedChanges(true);
          setIsImporting(false);

          toast.success('Settings Imported', {
            id: 'import-settings',
            description: 'Settings imported successfully. Click "Save Changes" to apply.'
          });

          addNotification({
            type: 'success',
            priority: 'low',
            category: 'data',
            title: 'Settings Imported',
            message: 'User settings imported from file',
            actionLabel: 'View',
            actionUrl: '#'
          });
        } catch (error) {
          console.error('Import failed:', error);
          setIsImporting(false);
          toast.error('Import Failed', {
            id: 'import-settings',
            description: 'Invalid settings file or corrupted data'
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Clear all settings
  const handleClearSettings = async () => {
    const confirmed = await confirmWarning({
      title: 'Clear All Settings',
      message: 'Permanently delete all saved settings and reset to defaults? This will clear your localStorage and cannot be undone.',
      confirmLabel: 'Clear All',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        const defaults = { ...DEFAULT_SETTINGS, role: user.role, version: SETTINGS_VERSION };
        setSettings(defaults);
        setOriginalSettings(defaults);
        setHasUnsavedChanges(false);
        setLastSaveTime(null);

        toast.success('Settings Cleared', {
          description: 'All settings have been cleared from storage'
        });
      } catch (error) {
        console.error('Failed to clear settings:', error);
        toast.error('Failed to clear settings');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      
      <div className="relative bg-card dark:bg-[#0d1932] border border-card-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-text-secondary" />
            <h3 id="settings-modal-title" className="text-lg font-semibold text-text-primary">Settings</h3>
            {hasUnsavedChanges && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-warning/10 text-warning border border-warning/30 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unsaved Changes
              </span>
            )}
            {lastSaveTime && !hasUnsavedChanges && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-success/10 text-success border border-success/30 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lastSaveTime && (
              <div className="flex items-center gap-1 text-xs text-text-tertiary mr-2">
                <Clock className="w-3 h-3" />
                Last saved: {lastSaveTime}
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-background-secondary rounded transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Profile</h4>
              </div>
              <div className="space-y-3 pl-6">
                <div>
                  <label className="text-xs text-text-tertiary">Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background-secondary border border-card-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-tertiary">Email</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background-secondary border border-card-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Notifications</h4>
              </div>
              <div className="space-y-3 pl-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateNotification('emailNotifications', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">Email notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.aiRecommendations}
                    onChange={(e) => updateNotification('aiRecommendations', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">AI Assistant recommendations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dataValidationAlerts}
                    onChange={(e) => updateNotification('dataValidationAlerts', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">Data validation alerts</span>
                </label>
              </div>
            </div>

            {/* Language & Region */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Language & Region</h4>
              </div>
              <div className="space-y-3 pl-6">
                <div>
                  <label className="text-xs text-text-tertiary">Language</label>
                  <select
                    value={settings.localization.language}
                    onChange={(e) => updateLocalization('language', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background-secondary border border-card-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>English</option>
                    <option>العربية (Arabic)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary">Timezone</label>
                  <select
                    value={settings.localization.timezone}
                    onChange={(e) => updateLocalization('timezone', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background-secondary border border-card-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>UTC+4 (Gulf Standard Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Privacy & Security</h4>
              </div>
              <div className="space-y-3 pl-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.twoFactorAuth}
                    onChange={(e) => updatePrivacy('twoFactorAuth', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">Two-factor authentication</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.sessionTimeout}
                    onChange={(e) => updatePrivacy('sessionTimeout', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">Session timeout (30 min)</span>
                </label>
              </div>
            </div>

            {/* Role Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserCog className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Role</h4>
              </div>
              <div className="space-y-3 pl-6">
                <div>
                  <label className="text-xs text-text-tertiary">Role</label>
                  <select
                    className="w-full mt-1 px-3 py-2 bg-background-secondary border border-card-border rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={settings.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  >
                    {availableRoles.map(role => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-text-tertiary">
                    Changing your role will update your discipline access and visible features
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Save className="w-4 h-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Advanced</h4>
              </div>
              <div className="space-y-3 pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportSettings}
                    disabled={isExporting}
                    className="justify-start"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export Settings
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleImportSettings}
                    disabled={isImporting}
                    className="justify-start"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Settings
                      </>
                    )}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearSettings}
                  className="w-full justify-start text-danger hover:text-danger"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Settings
                </Button>
                <p className="text-xs text-text-tertiary">
                  Version: {settings.version} • Settings are stored locally in your browser
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-card-border flex-shrink-0">
          <Button variant="ghost" onClick={handleResetToDefaults}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}