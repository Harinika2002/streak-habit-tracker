import { useState, useEffect } from 'react';
import { INITIAL_HABITS } from '../constants/initialData';
import { sfx } from '../utils/sound';
import { saveUserData } from '../services/authStorage';
import { notificationService } from '../utils/notifications';

export function useHabits({ currentUser, triggerToast, onAllHabitsCompleted }) {
  const [habits, setHabits] = useState(() => {
    if (currentUser?.habits) return currentUser.habits;
    try {
      const saved = localStorage.getItem('streak_habits');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [profile, setProfile] = useState(() => {
    if (currentUser?.profile) return currentUser.profile;
    try {
      const saved = localStorage.getItem('streak_profile');
      return saved
        ? JSON.parse(saved)
        : {
            streak: 7,
            longestStreak: 14,
            xp: 860,
            level: 4,
            gems: 125,
            freezes: 2,
            unlockedMilestones: [3, 7],
          };
    } catch {
      return {
        streak: 7,
        longestStreak: 14,
        xp: 860,
        level: 4,
        gems: 125,
        freezes: 2,
        unlockedMilestones: [3, 7],
      };
    }
  });

  // When currentUser changes (login/logout/switch user), synchronize habits and profile
  useEffect(() => {
    if (currentUser) {
      if (currentUser.habits) setHabits(currentUser.habits);
      if (currentUser.profile) setProfile(currentUser.profile);
    } else {
      // Guest mode
      try {
        const guestHabits = localStorage.getItem('streak_guest_habits');
        const guestProfile = localStorage.getItem('streak_guest_profile');
        setHabits(guestHabits ? JSON.parse(guestHabits) : INITIAL_HABITS);
        setProfile(
          guestProfile
            ? JSON.parse(guestProfile)
            : {
                streak: 0,
                longestStreak: 0,
                xp: 0,
                level: 1,
                gems: 0,
                freezes: 0,
                unlockedMilestones: [],
              }
        );
      } catch {
        setHabits(INITIAL_HABITS);
      }
    }
  }, [currentUser?.id]);

  // Persist habits and profile points whenever they change
  useEffect(() => {
    if (currentUser?.id) {
      saveUserData(currentUser.id, { habits, profile });
    } else {
      try {
        localStorage.setItem('streak_guest_habits', JSON.stringify(habits));
        localStorage.setItem('streak_guest_profile', JSON.stringify(profile));
      } catch (e) {}
    }
  }, [habits, profile, currentUser?.id]);

  const toggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    let justCompleted = false;

    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const nextState = !h.completedToday;
        justCompleted = nextState;
        const newCompletedDates = nextState
          ? [...h.completedDates.filter((d) => d !== today), today]
          : h.completedDates.filter((d) => d !== today);
        return {
          ...h,
          completedToday: nextState,
          streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
          completedDates: newCompletedDates,
        };
      }
      return h;
    });

    setHabits(updated);

    if (justCompleted) {
      sfx.playStreakFlame();
      const earnedXp = 20;
      setProfile((prev) => {
        const newXp = prev.xp + earnedXp;
        const newLevel = Math.floor(1 + Math.sqrt(newXp / 100));
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          gems: prev.gems + 2,
        };
      });

      if (updated.length > 0 && updated.every((h) => h.completedToday)) {
        sfx.playFanfare();
        triggerToast?.('🔥 Daily Perfection! All daily habits complete! Streak Extended!');
        onAllHabitsCompleted?.();

        // Send browser notification if enabled
        notificationService.sendNotification('🔥 Daily Perfection! All Habits Complete!', {
          body: `Streak maintained! You earned +${earnedXp} XP. Ignis is proud of you!`,
        });
      }
    }
  };

  const claimDailyBonus = ({ xp = 100, gems = 10 } = {}) => {
    setProfile((prev) => {
      const newXp = prev.xp + xp;
      const newLevel = Math.floor(1 + Math.sqrt(newXp / 100));
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        gems: prev.gems + gems,
      };
    });
  };

  const addHabit = (newHabit) => {
    const habit = {
      id: 'h_' + Date.now(),
      ...newHabit,
      completedToday: false,
      streak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, habit]);
    sfx.playSuccess();
    triggerToast?.(`🎯 Habit "${habit.title}" added to your daily tracker!`);
  };

  const buyFreeze = () => {
    if (profile.gems < 50) {
      triggerToast?.('❌ Not enough gems! Complete habits to earn more.');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      gems: prev.gems - 50,
      freezes: prev.freezes + 1,
    }));
    sfx.playSuccess();
    triggerToast?.('🛡️ Streak Freeze Shield acquired!');
  };

  return {
    habits,
    setHabits,
    profile,
    setProfile,
    toggleHabit,
    addHabit,
    buyFreeze,
    claimDailyBonus,
  };
}
