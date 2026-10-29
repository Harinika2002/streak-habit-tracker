import { sfx } from './sound';

// StreakHabit Flame Icon as inline SVG Data URL for native browser notifications
const FLAME_ICON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23F59E0B" stroke="%23D97706" stroke-width="1.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;

export const notificationService = {
  // Check if browser supports Web Notifications
  isSupported: () => {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  // Get current permission: 'granted' | 'denied' | 'default' | 'unsupported'
  getPermission: () => {
    if (!notificationService.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  // Request notification permission from the user
  requestPermission: async () => {
    if (!notificationService.isSupported()) {
      return { success: false, status: 'unsupported', message: 'Notifications not supported in this browser' };
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      if (granted) {
        sfx.playFanfare();
        // Immediately dispatch a welcome notification
        notificationService.sendNotification('🔥 StreakHabit Notifications Enabled!', {
          body: "Awesome! We'll keep your streak alive and alert you before midnight.",
          tag: 'streak-welcome',
        });
      }

      return {
        success: granted,
        status: permission,
        message: granted
          ? 'Notification permission granted!'
          : permission === 'denied'
          ? 'Notification permission was denied. You can re-enable it in browser settings.'
          : 'Notification permission dismissed.',
      };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, status: 'error', message: error.message };
    }
  },

  // Send a browser notification
  sendNotification: (title, options = {}) => {
    if (!notificationService.isSupported()) {
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Cannot send notification: Permission is', Notification.permission);
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: FLAME_ICON_SVG,
        badge: FLAME_ICON_SVG,
        silent: false,
        ...options,
      });

      // Play sound
      sfx.playSuccess();

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (e) {
      console.error('Failed to trigger notification:', e);
      return null;
    }
  },

  // Send a test notification
  sendTestNotification: (userName = 'Streak Champion') => {
    if (Notification.permission !== 'granted') {
      return false;
    }

    notificationService.sendNotification(`🔥 Ignis Daily Alert • Streak Protected!`, {
      body: `Hey ${userName}! Your daily streak is burning bright. Keep crushing your habits today!`,
      tag: 'test-streak-alert',
    });
    return true;
  },

  // Alert when Pomodoro completes
  sendTimerCompletedNotification: (taskTitle = 'Focus Session') => {
    if (Notification.permission === 'granted') {
      notificationService.sendNotification(`⏰ Focus Session Complete!`, {
        body: `Great job completing "${taskTitle}". Your focus XP has been recorded!`,
        tag: 'timer-complete',
      });
    }
  },

  // Alert when streak milestone unlocked
  sendMilestoneNotification: (milestoneName, days) => {
    if (Notification.permission === 'granted') {
      notificationService.sendNotification(`🏆 Milestone Unlocked: ${milestoneName}!`, {
        body: `Incredible dedication! You have maintained a ${days}-day habit streak! XP bonus awarded.`,
        tag: 'milestone-unlocked',
      });
    }
  },
};
