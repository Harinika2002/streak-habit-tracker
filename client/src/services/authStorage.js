import { INITIAL_HABITS, INITIAL_TASKS, INITIAL_NOTES } from '../constants/initialData';

const USERS_STORAGE_KEY = 'streak_users_db';
const ACTIVE_USER_KEY = 'streak_active_user_id';

// Default Demo User so user doesn't start from a blank screen unless they want to
export const DEFAULT_DEMO_USER = {
  id: 'user_alex_rivera',
  name: 'Alex Rivera',
  email: 'alex@streakhabit.app',
  password: 'password123',
  notificationsEnabled: false,
  createdAt: '2026-01-15T00:00:00.000Z',
  profile: {
    streak: 7,
    longestStreak: 14,
    xp: 860,
    level: 4,
    gems: 125,
    freezes: 2,
    unlockedMilestones: [3, 7],
  },
  habits: INITIAL_HABITS,
  tasks: INITIAL_TASKS,
  notes: INITIAL_NOTES,
};

// Retrieve all stored users
export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo user
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_USER];
  } catch (e) {
    console.error('Error reading users from storage:', e);
    return [DEFAULT_DEMO_USER];
  }
}

// Save all users
export function saveAllUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage:', e);
  }
}

// Get active user ID
export function getActiveUserId() {
  try {
    return localStorage.getItem(ACTIVE_USER_KEY);
  } catch {
    return null;
  }
}

// Set active user ID
export function setActiveUserId(userId) {
  try {
    if (userId) {
      localStorage.setItem(ACTIVE_USER_KEY, userId);
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch (e) {
    console.error('Error setting active user ID:', e);
  }
}

// Get currently active user object
export function getActiveUser() {
  const activeId = getActiveUserId();
  const users = getAllUsers();

  // If no active ID stored yet, check if this is initial run
  if (!activeId) {
    // If activeId was explicitly set to null/empty (meaning user logged out), return null
    if (localStorage.getItem(ACTIVE_USER_KEY) === '') {
      return null;
    }
    // First time visitor: default to demo user
    const demo = users.find((u) => u.id === DEFAULT_DEMO_USER.id) || users[0];
    if (demo) {
      setActiveUserId(demo.id);
      return demo;
    }
    return null;
  }

  const user = users.find((u) => u.id === activeId);
  return user || null;
}

// Background helper to sync with backend server if running
async function syncWithServer(endpoint, method = 'POST', data = null, userId = null) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (userId) headers['x-user-id'] = userId;
    const res = await fetch(`/api/auth${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Server is offline; local client storage is primary and fully reliable
  }
  return null;
}

// Save specific user's points and progress to the persistent database
export function saveUserData(userId, { profile, habits, tasks, notes, notificationsEnabled }) {
  if (!userId) return;

  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return;

  const current = users[index];
  const updated = {
    ...current,
    profile: profile !== undefined ? profile : current.profile,
    habits: habits !== undefined ? habits : current.habits,
    tasks: tasks !== undefined ? tasks : current.tasks,
    notes: notes !== undefined ? notes : current.notes,
    notificationsEnabled:
      notificationsEnabled !== undefined ? notificationsEnabled : current.notificationsEnabled,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updated;
  saveAllUsers(users);

  // Sync to legacy keys as well for current user
  if (userId === getActiveUserId()) {
    if (profile) localStorage.setItem('streak_profile', JSON.stringify(profile));
    if (habits) localStorage.setItem('streak_habits', JSON.stringify(habits));
    if (tasks) localStorage.setItem('streak_tasks', JSON.stringify(tasks));
    if (notes) localStorage.setItem('streak_notes', JSON.stringify(notes));
  }

  // Attempt async sync to backend in background
  if (profile) {
    syncWithServer(
      '/profile',
      'PUT',
      {
        userId,
        xp: profile.xp,
        level: profile.level,
        gems: profile.gems,
        freezes: profile.freezes,
        notifications_enabled: notificationsEnabled,
      },
      userId
    );
  }
}

// Register a new user
export function registerUser({ name, email, password, notificationsEnabled = false }) {
  const users = getAllUsers();

  const trimmedEmail = email.trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const newUserId = 'user_' + Date.now();
  const newUser = {
    id: newUserId,
    name: name.trim(),
    email: trimmedEmail,
    password: password,
    notificationsEnabled: !!notificationsEnabled,
    createdAt: new Date().toISOString(),
    // Fresh user starts with starter points & Duolingo style bonuses
    profile: {
      streak: 1,
      longestStreak: 1,
      xp: 50, // Welcome bonus points!
      level: 1,
      gems: 60, // Starter gems
      freezes: 2, // Welcome streak freezes
      unlockedMilestones: [],
    },
    // Fresh habits customized for new user
    habits: [
      {
        id: 'h_starter_1',
        title: 'Morning Water & Mindful Stretch',
        category: 'Fitness',
        targetMins: 15,
        color: '#EF4444',
        icon: 'Dumbbell',
        completedToday: false,
        streak: 0,
        completedDates: [],
      },
      {
        id: 'h_starter_2',
        title: 'Daily Focus Session',
        category: 'Coding',
        targetMins: 30,
        color: '#3B82F6',
        icon: 'Code',
        completedToday: false,
        streak: 0,
        completedDates: [],
      },
      {
        id: 'h_starter_3',
        title: 'Read 10 Pages',
        category: 'Learning',
        targetMins: 15,
        color: '#10B981',
        icon: 'BookOpen',
        completedToday: false,
        streak: 0,
        completedDates: [],
      },
    ],
    tasks: [
      {
        id: 't_starter_1',
        title: `Welcome to StreakHabit, ${name.trim()}! Complete your first habit`,
        category: 'General',
        priority: 'high',
        status: 'pending',
        estimatedMins: 10,
        durationSeconds: 0,
        completedAt: null,
        note: 'Every journey begins with a single streak flame!',
      },
    ],
    notes: [
      {
        id: 'n_starter_1',
        title: `Welcome, ${name.trim()}! 🎉`,
        content: `Account created for ${name.trim()}. Keep your daily flame alive to unlock badges and level up!`,
        tag: 'Motivation',
        createdAt: new Date().toISOString(),
        pinned: true,
      },
    ],
  };

  users.push(newUser);
  saveAllUsers(users);
  setActiveUserId(newUserId);

  // Sync to server in background
  syncWithServer('/register', 'POST', {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    notifications_enabled: newUser.notificationsEnabled,
  });

  return { success: true, user: newUser };
}

// Login an existing user
export function loginUser({ email, password }) {
  const users = getAllUsers();
  const trimmed = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === trimmed || (u.name && u.name.toLowerCase() === trimmed)
  );

  if (!user) {
    return { success: false, error: 'No account found with this email or name.' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  setActiveUserId(user.id);
  return { success: true, user };
}

// Logout user and securely persist their points
export function logoutUser(currentSnapshot = {}) {
  const activeId = getActiveUserId();
  if (activeId && currentSnapshot) {
    saveUserData(activeId, currentSnapshot);
  }
  // Explicitly mark as logged out
  localStorage.setItem(ACTIVE_USER_KEY, '');
  return { success: true };
}
