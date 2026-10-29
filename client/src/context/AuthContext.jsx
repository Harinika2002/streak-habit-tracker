import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getActiveUser,
  registerUser,
  loginUser,
  logoutUser,
  saveUserData,
} from '../services/authStorage';
import { notificationService } from '../utils/notifications';

const AuthContext = createContext(null);

export function AuthProvider({ children, onSnapshotRequest }) {
  const [user, setUser] = useState(() => getActiveUser());
  const [notificationPermission, setNotificationPermission] = useState(() =>
    notificationService.getPermission()
  );

  // Sync notification permission state
  useEffect(() => {
    setNotificationPermission(notificationService.getPermission());
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    const res = await notificationService.requestPermission();
    setNotificationPermission(res.status);

    if (res.success && user) {
      // Update user's notifications preference
      saveUserData(user.id, { notificationsEnabled: true });
      setUser((prev) => (prev ? { ...prev, notificationsEnabled: true } : prev));
    }
    return res;
  }, [user]);

  // Send a test notification
  const sendTestNotification = useCallback(() => {
    const name = user ? user.name : 'Streak Champion';
    return notificationService.sendTestNotification(name);
  }, [user]);

  // Login handler
  const handleLogin = useCallback(
    async ({ email, password }) => {
      const result = loginUser({ email, password });
      if (result.success) {
        setUser(result.user);
      }
      return result;
    },
    []
  );

  // Register handler (asking for Name, Email, Password)
  const handleRegister = useCallback(
    async ({ name, email, password, notificationsEnabled }) => {
      const result = registerUser({
        name,
        email,
        password,
        notificationsEnabled,
      });

      if (result.success) {
        setUser(result.user);
        // If user checked notification permission, prompt for it
        if (notificationsEnabled) {
          notificationService.requestPermission().then((res) => {
            setNotificationPermission(res.status);
          });
        }
      }
      return result;
    },
    []
  );

  // Logout handler - ensures points are securely saved!
  const handleLogout = useCallback(
    (currentSnapshot) => {
      logoutUser(currentSnapshot);
      setUser(null);
    },
    []
  );

  // Update profile or user details
  const updateCurrentUser = useCallback(
    (updates) => {
      if (!user) return;
      saveUserData(user.id, updates);
      setUser((prev) => ({ ...prev, ...updates }));
    },
    [user]
  );

  const value = {
    user,
    isLoggedIn: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateCurrentUser,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
