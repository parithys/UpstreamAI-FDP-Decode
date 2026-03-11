import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationCategory = 'simulation' | 'data' | 'system' | 'collaboration' | 'ai' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  actionLabel?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  clearRead: () => void;
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  getUnreadNotifications: () => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = 'adnoc_fdp_notifications';
const MAX_NOTIFICATIONS = 100;

// Default notifications for demo purposes
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    priority: 'medium',
    category: 'data',
    title: 'Data validation complete',
    message: 'All 54 data items successfully validated for Field Alpha',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    dismissed: false,
    actionLabel: 'View Report',
    actionUrl: '/data-validation'
  },
  {
    id: '2',
    type: 'warning',
    priority: 'high',
    category: 'data',
    title: 'Action required: Zone C logs',
    message: '3 petrophysical logs missing for optimal simulation accuracy',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    dismissed: false,
    actionLabel: 'Upload Logs',
    actionUrl: '/data-validation'
  },
  {
    id: '3',
    type: 'info',
    priority: 'medium',
    category: 'ai',
    title: 'AI-Led Simulation ready',
    message: 'Uncertainty framework configured. Ready to initiate 12.4M scenarios',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    dismissed: false,
    actionLabel: 'Start Simulation',
    actionUrl: '/ai-led-integration'
  },
  {
    id: '4',
    type: 'info',
    priority: 'low',
    category: 'system',
    title: 'Scheduled report generation',
    message: 'Monthly FDP summary will be generated on Mar 1, 2025',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    dismissed: false
  },
  {
    id: '5',
    type: 'success',
    priority: 'high',
    category: 'simulation',
    title: 'Optimization complete',
    message: 'Best case scenario identified: NPV $2.4B with 87% confidence',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: false,
    dismissed: false,
    actionLabel: 'View Results',
    actionUrl: '/scenario-optimization'
  },
  {
    id: '6',
    type: 'info',
    priority: 'medium',
    category: 'collaboration',
    title: 'New comment on Field Alpha',
    message: 'Sarah Ahmed commented on your production forecast analysis',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    dismissed: false,
    actionLabel: 'View Comment',
    actionUrl: '/l2-asset-manager'
  }
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      dismissed: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the most recent MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS);
    });

    // Show toast for high/critical priority notifications
    if (notification.priority === 'high' || notification.priority === 'critical') {
      const toastType = notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'info';
      toast[toastType](notification.title, {
        description: notification.message
      });
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark as unread
  const markAsUnread = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success('All notifications marked as read');
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    toast.success('All notifications cleared');
  }, []);

  // Clear read notifications
  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read || !n.dismissed));
    toast.success('Read notifications cleared');
  }, []);

  // Get notifications by category
  const getNotificationsByCategory = useCallback((category: NotificationCategory) => {
    return notifications.filter(n => n.category === category && !n.dismissed);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read && !n.dismissed);
  }, [notifications]);

  // Simulate real-time notifications (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a notification (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const types: NotificationType[] = ['success', 'warning', 'info', 'error'];
        const priorities: NotificationPriority[] = ['low', 'medium', 'high'];
        const categories: NotificationCategory[] = ['simulation', 'data', 'system', 'collaboration', 'ai', 'alert'];
        
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const messages = [
          { title: 'Simulation progress update', message: 'AI-led simulation 45% complete, 6.2M scenarios generated' },
          { title: 'Data sync completed', message: 'Production data synchronized from Eclipse database' },
          { title: 'New AI insight available', message: 'Pattern detected: optimal waterflood timing for Zone B' },
          { title: 'Collaboration update', message: 'Team member shared updated reservoir model' },
          { title: 'System maintenance', message: 'Scheduled maintenance window: Tonight 2AM-4AM GST' }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        addNotification({
          type: randomType,
          priority: randomPriority,
          category: randomCategory,
          title: randomMessage.title,
          message: randomMessage.message
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const value: NotificationsContextType = {
    notifications: notifications.filter(n => !n.dismissed),
    unreadCount,
    addNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    dismissNotification,
    clearAll,
    clearRead,
    getNotificationsByCategory,
    getUnreadNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
