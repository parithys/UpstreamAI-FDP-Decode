import { useEffect, useRef, useState } from 'react';
import { Bell, Search, Settings, User, LogOut, HelpCircle, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { AssetSelector } from './AssetSelector';
import { SettingsModal } from './modals/SettingsModal';
import { RealTimeSyncIndicator } from './RealTimeSyncIndicator';
import { useUser, getUserByRole, UserRole } from '../context/UserContext';
import { useCollaboration } from '../context/CollaborationContext';
import { useConfirmation } from '../context/ConfirmationContext';
import { useSearch } from '../context/SearchContext';
import { toast } from 'sonner';
import { useSidebar } from '../context/SidebarContext';

export function TopBar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const user = useUser();
  const { isAnnotationToolbarVisible, setAnnotationToolbarVisible } = useCollaboration();
  const { confirmWarning } = useConfirmation();
  const { openSearch } = useSearch();

  const handleLogout = async () => {
    const confirmed = await confirmWarning({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
      confirmLabel: 'Sign Out',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      setIsProfileOpen(false);
      toast.success('Logged out successfully');
      // Clear any session/auth state here
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      // Redirect to login
      navigate('/');
    }
  };

  const handleSettingsClick = () => {
    setIsProfileOpen(false);
    setIsSettingsOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <>
      <div 
        className={`fixed top-0 right-0 h-16 bg-card border-b border-card-border flex items-center justify-between px-6 z-30 transition-all duration-200 ease-in-out ${isCollapsed ? 'left-16' : 'left-60'}`}
      >
        {/* Left Section - Asset Selector */}
        <div className="flex items-center gap-4">
          <AssetSelector />
        </div>

        {/* Right Section - Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Real-Time Sync Indicator */}
          <RealTimeSyncIndicator variant="compact" />

          {/* Search */}
          <button
            onClick={openSearch}
            className="group relative flex items-center w-[320px] px-4 py-2.5 bg-background-secondary/50 border border-card-border rounded-full text-sm text-text-tertiary hover:bg-background-secondary hover:border-card-hover hover:text-text-secondary transition-all duration-200"
          >
            <Search className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-normal truncate">Search projects, scenarios...</span>
            <kbd className="ml-auto flex items-center px-2 py-0.5 bg-background-primary/80 rounded border border-card-border text-[10px] font-mono font-medium text-text-tertiary opacity-70 group-hover:opacity-100 transition-opacity">
              Ctrl K
            </kbd>
          </button>

          {/* Collaboration Actions */}
          <div className="flex items-center border-l border-r border-card-border px-2 mx-2 gap-1">
            <button 
              onClick={() => navigate('/forum')}
              className="p-2 hover:bg-card-hover rounded-lg transition-colors"
              title="Discussion Forum"
              aria-label="Discussion Forum"
            >
              <MessageSquare className="w-5 h-5 text-text-secondary" />
            </button>
            

          </div>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-card-hover rounded-lg transition-colors"
            aria-label="Open Settings"
          >
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-card-hover rounded-lg transition-colors"
              aria-label="User profile menu"
              aria-expanded={isProfileOpen}
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                DU
              </div>
              <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-card-border rounded-lg shadow-2xl overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-card-border bg-background-secondary/50 dark:bg-background-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      DU
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">Demo User</div>
                      <div className="text-xs text-text-secondary truncate">demouser@upstreamai.com</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-card-hover transition-colors"
                  >
                    <Settings className="w-4 h-4 text-text-tertiary" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}