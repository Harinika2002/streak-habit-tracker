import React, { useState, useEffect } from 'react';
import { Bell, Flame, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBanner({ isDark, triggerToast }) {
  const { notificationPermission, requestNotificationPermission } = useAuth();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('streak_notif_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  // Only show if browser supports notifications and status is 'default' (not yet answered) and not dismissed
  if (notificationPermission !== 'default' || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('streak_notif_banner_dismissed', 'true');
    } catch (e) {}
  };

  const handleAllow = async () => {
    const res = await requestNotificationPermission();
    if (res.success) {
      triggerToast?.('🔔 Notifications enabled! Ignis will safeguard your streak.');
    }
  };

  return (
    <div
      className={`relative mb-6 rounded-3xl p-4 md:p-5 border transition-all animate-fade-in ${
        isDark
          ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border-indigo-500/40 shadow-lg shadow-indigo-950/40 backdrop-blur-xl'
          : 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-sm backdrop-blur-xl'
      }`}
    >
      <button
        onClick={handleDismiss}
        className={`absolute top-3.5 right-3.5 p-1.5 rounded-xl transition-colors ${
          isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
        }`}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pr-6 md:pr-0">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Flame className="w-6 h-6 fill-white animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black tracking-tight">Stay Accountable with Streak Reminders</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Recommended
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ignis can notify you before midnight so you never accidentally break your daily habit streak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAllow}
            className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Enable Notifications</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
