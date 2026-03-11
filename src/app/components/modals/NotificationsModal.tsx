import { useNavigate } from 'react-router';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useNotifications, NotificationCategory, NotificationType, Notification } from '../../context/NotificationsContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import { toast } from 'sonner';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'unread' | NotificationCategory;

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread,
    markAllAsRead, 
    dismissNotification,
    clearAll,
    clearRead 
  } = useNotifications();
  const { confirmWarning, confirmDanger } = useConfirmation();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [hoveredNotificationId, setHoveredNotificationId] = useState<string | null>(null);

  // Keyboard accessibility: ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  // Sort by timestamp (newest first)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleDismiss = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    dismissNotification(notificationId);
  };

  const handleToggleRead = (e: React.MouseEvent, notification: typeof notifications[0]) => {
    e.stopPropagation();
    if (notification.read) {
      markAsUnread(notification.id);
    } else {
      markAsRead(notification.id);
    }
  };

  const handleClearAll = async () => {
    const confirmed = await confirmDanger({
      title: 'Clear All Notifications',
      message: 'Are you sure you want to clear all notifications? This action cannot be undone.',
      confirmLabel: 'Clear All',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      clearAll();
    }
  };

  const handleClearRead = async () => {
    const confirmed = await confirmWarning({
      title: 'Clear Read Notifications',
      message: 'Are you sure you want to clear all read notifications?',
      confirmLabel: 'Clear Read',
      cancelLabel: 'Cancel'
    });

    if (confirmed) {
      clearRead();
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return CheckCircle2;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  // Get icon color based on notification type
  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    if (priority === 'critical') {
      return <Badge className="bg-error/10 text-error border-error/30 text-xs">Critical</Badge>;
    }
    if (priority === 'high') {
      return <Badge className="bg-warning/10 text-warning border-warning/30 text-xs">High</Badge>;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" role="dialog" aria-modal="true" aria-labelledby="notifications-modal-title">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      
      <div className="relative bg-card dark:bg-[#0d1932] border border-card-border rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-card-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-text-secondary" />
            <h3 id="notifications-modal-title" className="text-text-primary font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/30">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background-secondary rounded transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-card-border overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-background-secondary text-text-secondary hover:bg-card-hover'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'unread' 
                ? 'bg-primary text-white' 
                : 'bg-background-secondary text-text-secondary hover:bg-card-hover'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'simulation' 
                ? 'bg-primary text-white' 
                : 'bg-background-secondary text-text-secondary hover:bg-card-hover'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => setFilter('data')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'data' 
                ? 'bg-primary text-white' 
                : 'bg-background-secondary text-text-secondary hover:bg-card-hover'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === 'ai' 
                ? 'bg-primary text-white' 
                : 'bg-background-secondary text-text-secondary hover:bg-card-hover'
            }`}
          >
            AI
          </button>
        </div>

        {/* Notifications List - Scrollable */}
        <div className="overflow-y-auto flex-1">
          {sortedNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
              <p className="text-sm text-text-secondary">No notifications</p>
              <p className="text-xs text-text-tertiary mt-1">
                {filter === 'unread' ? 'All caught up!' : 'You\'ll see new notifications here'}
              </p>
            </div>
          ) : (
            sortedNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              const isHovered = hoveredNotificationId === notification.id;
              
              return (
                <div
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  className={`p-4 border-b border-card-border transition-all cursor-pointer relative group ${
                    notification.read ? 'hover:bg-card-hover' : 'bg-primary/5 hover:bg-primary/10'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notification);
                    }
                  }}
                  onMouseEnter={() => setHoveredNotificationId(notification.id)}
                  onMouseLeave={() => setHoveredNotificationId(null)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-text-primary">
                            {notification.title}
                          </span>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {notification.actionLabel && (
                          <span className="text-xs text-primary font-medium">
                            {notification.actionLabel} →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (shown on hover) */}
                  {isHovered && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-card rounded-lg border border-card-border shadow-lg p-1">
                      <button
                        onClick={(e) => handleToggleRead(e, notification)}
                        className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                        title={notification.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.read ? (
                          <Mail className="w-3.5 h-3.5 text-text-secondary" />
                        ) : (
                          <MailOpen className="w-3.5 h-3.5 text-text-secondary" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDismiss(e, notification.id)}
                        className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-text-secondary" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-card-border flex items-center gap-2 flex-shrink-0">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <>
              <Button variant="ghost" size="sm" onClick={handleClearRead}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear read
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}