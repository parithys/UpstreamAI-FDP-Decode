import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { 
  LayoutGrid, Database, ClockArrowDown, ScatterChart, 
  Lightbulb, FileText, Bot, Settings, Bell, Sun, Moon,
  ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { useNotifications } from '../context/NotificationsContext';
import { SettingsModal } from './modals/SettingsModal';
import { NotificationsModal } from './modals/NotificationsModal';
import upstreamaiLogo from 'figma:asset/9beb0d38a15a59ea10724901fda4b02c359da990.png';

const modules = [
  { id: 'dashboard', label: 'FDP Nerve Center', icon: LayoutGrid, path: '/dashboard' },
  { id: 'data-health', label: 'Data Health', icon: Database, path: '/data-health' },
  { id: 'history-matching', label: 'History Matching', icon: ClockArrowDown, path: '/history-matching' },
  { id: 'uncertainty', label: 'Uncertainty Analysis', icon: ScatterChart, path: '/uncertainty' },
  { id: 'insights', label: 'Insights & Decisions', icon: Lightbulb, path: '/insights' },
  { id: 'fdp-summary', label: 'FDP Summary', icon: FileText, path: '/fdp-summary' },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot, path: '/ai-agents-management', badge: '12' }
];

interface SidebarProps {
  onChatOpen?: () => void;
}

export function Sidebar({ onChatOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { unreadCount } = useNotifications();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | HTMLButtonElement | null }>({});

  const handleToggleClick = () => {
    toggleSidebar();
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-background-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 ease-in-out",
        isCollapsed ? "w-16" : "w-60"
      )}
      data-testid="sidebar"
    >
      {/* Logo & Platform Name */}
      <div className="h-16 flex items-center px-3 border-b border-sidebar-border justify-center">
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center transition-opacity hover:opacity-80",
            isCollapsed ? "justify-center" : "gap-3"
          )}
          aria-label="Go to main dashboard"
          title="UpstreamAI FDP - Home"
        >
          <img src={upstreamaiLogo} alt="UpstreamAI Logo" className="w-8 h-8 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-xl font-bold text-sidebar-foreground tracking-tight whitespace-nowrap">
              UpstreamAI FDP
            </span>
          )}
        </Link>
      </div>

      {/* Module Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {modules.map((module) => {
          const isActive = location.pathname === module.path || location.pathname.startsWith(module.path + '/');
          const Icon = module.icon;
          
          return (
            <div key={module.id} className="relative">
              <Link
                ref={(el) => (itemRefs.current[module.id] = el)}
                to={module.path}
                className={cn(
                  "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isCollapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
                onMouseEnter={() => isCollapsed && setHoveredItem(module.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => isCollapsed && setHoveredItem(module.id)}
                onBlur={() => setHoveredItem(null)}
                onClick={() => setHoveredItem(null)}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    !isCollapsed && "mr-3",
                    isActive ? "text-primary" : "text-text-tertiary group-hover:text-text-primary"
                  )}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{module.label}</span>
                    {module.badge && (
                      <div className="ml-auto bg-danger text-white text-xs px-1.5 py-0.5 rounded-full">{module.badge}</div>
                    )}
                  </>
                )}
              </Link>
              {isCollapsed && hoveredItem === module.id && (
                <NavTooltip
                  label={module.label}
                  show={true}
                  targetRef={{ current: itemRefs.current[module.id] }}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-4">
        <div className="relative">
          <button
            ref={(el) => (itemRefs.current['notifications'] = el)}
            onClick={() => setIsNotificationsModalOpen(true)}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            className={cn(
              "w-full flex items-center rounded-lg text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors",
              isCollapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"
            )}
            onMouseEnter={() => isCollapsed && setHoveredItem('notifications')}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => isCollapsed && setHoveredItem('notifications')}
            onBlur={() => setHoveredItem(null)}
          >
            <Bell className={cn("w-5 h-5 text-text-tertiary flex-shrink-0", !isCollapsed && "mr-3")} />
            {!isCollapsed && (
              <>
                <span className="truncate">Notifications</span>
                {unreadCount > 0 && (
                  <div className="ml-auto bg-primary text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </div>
                )}
              </>
            )}
            {isCollapsed && unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadCount}
              </div>
            )}
          </button>
          {isCollapsed && hoveredItem === 'notifications' && (
            <NavTooltip
              label={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
              show={true}
              targetRef={{ current: itemRefs.current['notifications'] }}
            />
          )}
        </div>
        
        <div className="relative">
          <button
            ref={(el) => (itemRefs.current['ai-chat'] = el)}
            onClick={onChatOpen}
            aria-label="AI Assistant Chat"
            className={cn(
              "w-full flex items-center rounded-lg text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors",
              isCollapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"
            )}
            onMouseEnter={() => isCollapsed && setHoveredItem('ai-chat')}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => isCollapsed && setHoveredItem('ai-chat')}
            onBlur={() => setHoveredItem(null)}
          >
            <MessageSquare className={cn("w-5 h-5 text-text-tertiary flex-shrink-0", !isCollapsed && "mr-3")} />
            {!isCollapsed && (
              <>
                <span className="truncate">AI Assistant Chat</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
              </>
            )}
            {isCollapsed && (
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>
          {isCollapsed && hoveredItem === 'ai-chat' && (
            <NavTooltip
              label="AI Assistant Chat"
              show={true}
              targetRef={{ current: itemRefs.current['ai-chat'] }}
            />
          )}
        </div>
        
        <div className="relative">
          <button 
            ref={(el) => (itemRefs.current['theme-toggle'] = el)}
            aria-label="Toggle Theme"
            className={cn(
              "w-full flex items-center rounded-lg text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors",
              isCollapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"
            )}
            onClick={toggleTheme}
            onMouseEnter={() => isCollapsed && setHoveredItem('theme-toggle')}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => isCollapsed && setHoveredItem('theme-toggle')}
            onBlur={() => setHoveredItem(null)}
          >
            {theme === 'dark' ? 
              <Sun className={cn("w-5 h-5 text-text-tertiary flex-shrink-0", !isCollapsed && "mr-3")} /> : 
              <Moon className={cn("w-5 h-5 text-text-tertiary flex-shrink-0", !isCollapsed && "mr-3")} />
            }
            {!isCollapsed && <span className="truncate">Toggle Theme</span>}
          </button>
          {isCollapsed && hoveredItem === 'theme-toggle' && (
            <NavTooltip
              label="Toggle Theme"
              show={true}
              targetRef={{ current: itemRefs.current['theme-toggle'] }}
            />
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className={cn("px-3 py-3 border-t border-sidebar-border", isCollapsed ? "flex justify-center" : "")}>
        <button
          onClick={handleToggleClick}
          onKeyDown={handleToggleKeyDown}
          className="flex items-center justify-center p-2 rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-sidebar"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <NotificationsModal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)} />
    </aside>
  );
}

// Tooltip component for collapsed sidebar
interface NavTooltipProps {
  label: string;
  show: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
}

function NavTooltip({ label, show, targetRef }: NavTooltipProps) {
  if (!show || !targetRef.current) return null;

  const rect = targetRef.current.getBoundingClientRect();
  
  return (
    <div
      className="fixed z-50 px-3 py-2 bg-card text-card-foreground text-sm rounded-lg shadow-lg border border-card-border whitespace-nowrap pointer-events-none"
      style={{
        left: `${rect.right + 8}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: 'translateY(-50%)',
      }}
    >
      {label}
    </div>
  );
}