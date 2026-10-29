import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './composables/useTheme';
import { useHabits } from './composables/useHabits';
import { useTasks } from './composables/useTasks';
import { useNotes } from './composables/useNotes';
import { useTimer } from './composables/useTimer';
import { notificationService } from './utils/notifications';

import StatsBar from './components/common/StatsBar';
import CoachBanner from './components/common/CoachBanner';
import NotificationBanner from './components/common/NotificationBanner';
import LoggedOutBanner from './components/common/LoggedOutBanner';
import Navigation from './components/common/Navigation';
import Toast from './components/common/Toast';

import HabitsTab from './components/tabs/HabitsTab';
import TimerTab from './components/tabs/TimerTab';
import NotesTab from './components/tabs/NotesTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import ShopTab from './components/tabs/ShopTab';
import ProgressGraphsTab from './components/tabs/ProgressGraphsTab';

import AddHabitModal from './components/modals/AddHabitModal';
import AddTaskModal from './components/modals/AddTaskModal';
import AddNoteModal from './components/modals/AddNoteModal';
import ManualLogModal from './components/modals/ManualLogModal';
import DailySuccessModal from './components/modals/DailySuccessModal';
import AuthModal from './components/modals/AuthModal';
import UserProfileModal from './components/modals/UserProfileModal';
import NotificationModal from './components/modals/NotificationModal';

function MainApp() {
  const { theme, isDark, ripple, setRipple, toggleTheme } = useTheme();
  const { user, isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState('habits');
  const [toastMsg, setToastMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const {
    habits,
    profile,
    toggleHabit,
    addHabit,
    buyFreeze,
    claimDailyBonus,
  } = useHabits({
    currentUser: user,
    triggerToast,
    onAllHabitsCompleted: () => setShowSuccessModal(true),
  });

  const { tasks, addTask, logTaskDuration } = useTasks({
    currentUser: user,
    triggerToast,
  });

  const { notes, addNote, togglePinNote, deleteNote } = useNotes({
    currentUser: user,
    triggerToast,
  });

  const timer = useTimer({
    onPomodoroComplete: () => {
      triggerToast('🎉 Pomodoro session finished! Focus XP logged.');
      notificationService.sendTimerCompletedNotification('Pomodoro Session');
    },
  });

  const [modals, setModals] = useState({
    habit: false,
    task: false,
    note: false,
    manualLog: false,
    auth: false,
    profile: false,
    notifications: false,
  });
  const [authMode, setAuthMode] = useState('login');

  const openModal = (key) => setModals((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) => setModals((prev) => ({ ...prev, [key]: false }));

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    openModal('auth');
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Ambient Gradient Glows (Sleek Aurora Backdrop) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[128px] opacity-40 transition-opacity duration-700 ${
            isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/40'
          }`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[30rem] h-[30rem] rounded-full blur-[140px] opacity-30 transition-opacity duration-700 ${
            isDark ? 'bg-cyan-600/20' : 'bg-cyan-300/30'
          }`}
        />
        <div
          className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-[128px] opacity-25 transition-opacity duration-700 ${
            isDark ? 'bg-violet-600/25' : 'bg-violet-200/40'
          }`}
        />
      </div>

      {/* Ripple Animation Overlay */}
      {ripple && (
        <span
          onTransitionEnd={() => setRipple(null)}
          style={{
            position: 'fixed',
            left: `${ripple.x - 12}px`,
            top: `${ripple.y - 12}px`,
            width: '24px',
            height: '24px',
            backgroundColor: ripple.color,
            borderRadius: '50%',
            transform: ripple.expand ? 'scale(250)' : 'scale(0)',
            transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
            zIndex: 40,
            pointerEvents: 'none',
            boxShadow:
              ripple.color === '#f8fafc'
                ? '0 0 60px rgba(255,255,255,0.7)'
                : '0 0 60px rgba(0,0,0,0.7)',
          }}
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-3.5 sm:py-6 md:py-8">
        <StatsBar
          profile={profile}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenProfile={() => openModal('profile')}
          onOpenAuth={(mode) => openAuth(mode)}
          onOpenNotifications={() => openModal('notifications')}
        />

        {/* Guest Banner if user is logged out */}
        {!isLoggedIn && (
          <LoggedOutBanner onOpenAuth={(mode) => openAuth(mode)} isDark={isDark} />
        )}

        {/* Motivational Notification Banner (asks for permission if not yet decided) */}
        <NotificationBanner isDark={isDark} triggerToast={triggerToast} />

        <CoachBanner isDark={isDark} />

        <Navigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          isDark={isDark}
        />

        <main className="mt-6">
          <div key={activeTab} className="animate-tab-in">
            {activeTab === 'habits' && (
              <HabitsTab
                habits={habits}
                isDark={isDark}
                onToggleHabit={toggleHabit}
                onOpenAddHabit={() => openModal('habit')}
                onOpenSuccessModal={() => setShowSuccessModal(true)}
                onOpenTimer={(habit) => {
                  timer.setSelectedTaskId(habit.id);
                  setActiveTab('timer');
                }}
              />
            )}

            {activeTab === 'timer' && (
              <TimerTab
                timer={timer}
                tasks={tasks}
                isDark={isDark}
                onLogTime={(taskId, secs) => logTaskDuration(taskId, secs)}
                onOpenManualLog={() => openModal('manualLog')}
              />
            )}

            {activeTab === 'graphs' && (
              <ProgressGraphsTab habits={habits} tasks={tasks} isDark={isDark} />
            )}

            {activeTab === 'notes' && (
              <NotesTab
                notes={notes}
                isDark={isDark}
                onOpenAddNote={() => openModal('note')}
                onTogglePin={togglePinNote}
                onDeleteNote={deleteNote}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab habits={habits} tasks={tasks} isDark={isDark} />
            )}

            {activeTab === 'shop' && (
              <ShopTab
                profile={profile}
                onBuyFreeze={buyFreeze}
                isDark={isDark}
              />
            )}
          </div>
        </main>
      </div>

      <Toast message={toastMsg} />

      {/* Auth Modal (Login / Sign Up asking for Name, Email, Password) */}
      <AuthModal
        isOpen={modals.auth}
        onClose={() => closeModal('auth')}
        initialMode={authMode}
        isDark={isDark}
        triggerToast={triggerToast}
      />

      {/* User Profile Modal (Displays Name, Saved Points, Logout) */}
      <UserProfileModal
        isOpen={modals.profile}
        onClose={() => closeModal('profile')}
        isDark={isDark}
        profile={profile}
        habits={habits}
        tasks={tasks}
        notes={notes}
        triggerToast={triggerToast}
      />

      {/* Notification Center / Permission Modal */}
      <NotificationModal
        isOpen={modals.notifications}
        onClose={() => closeModal('notifications')}
        isDark={isDark}
        triggerToast={triggerToast}
      />

      <AddHabitModal
        isOpen={modals.habit}
        onClose={() => closeModal('habit')}
        onAdd={addHabit}
        isDark={isDark}
      />
      <AddTaskModal
        isOpen={modals.task}
        onClose={() => closeModal('task')}
        onAdd={addTask}
        isDark={isDark}
      />
      <AddNoteModal
        isOpen={modals.note}
        onClose={() => closeModal('note')}
        onAdd={addNote}
        isDark={isDark}
      />
      <ManualLogModal
        isOpen={modals.manualLog}
        tasks={tasks}
        onClose={() => closeModal('manualLog')}
        onLog={logTaskDuration}
        isDark={isDark}
      />
      <DailySuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        habits={habits}
        tasks={tasks}
        profile={profile}
        isDark={isDark}
        onClaimReward={claimDailyBonus}
        triggerToast={triggerToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
