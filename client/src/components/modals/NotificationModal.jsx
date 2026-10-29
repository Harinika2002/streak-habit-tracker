import React from 'react';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NotificationModal({ isOpen, onClose, isDark, triggerToast }) {
  const {
    user,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification,
  } = useAuth();

  if (!isOpen) return null;

  const handleRequest = async () => {
    const res = await requestNotificationPermission();
    if (res.success) {
      triggerToast?.('🔔 Notifications enabled! Ignis will safeguard your streak.');
    } else if (res.status === 'denied') {
      triggerToast?.('⚠️ Permission denied. Please enable notifications in your browser URL bar.');
    }
  };

  const handleTest = () => {
    const sent = sendTestNotification();
    if (sent) {
      triggerToast?.('🔔 Test notification dispatched to your system desktop!');
    } else {
      triggerToast?.('⚠️ Please allow notifications first to test alerts.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 md:p-8 transition-all ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-2xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Streak Notifications</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Status:
              </span>
              {notificationPermission === 'granted' ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Granted & Active
                </span>
              ) : notificationPermission === 'denied' ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Blocked in Browser
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Permission Required
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 mb-6">
          <div
            className={`p-3 rounded-2xl border flex items-start gap-3 ${
              isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Midnight Streak Saver Alert</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ignis nudges you at 8:00 PM if your daily habits aren't checked off so you don't lose your streak.
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-start gap-3 ${
              isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Focus Stopwatch & Pomodoro Timer Chime</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Get notified when your focus session completes, even if you are working in another tab or app.
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-start gap-3 ${
              isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Milestones & Gem Rewards</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant celebration notifications when you unlock 3-day, 7-day, and 30-day streak achievements.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {notificationPermission !== 'granted' ? (
            <button
              type="button"
              onClick={handleRequest}
              className="w-full py-3 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Ask for Notification Permission</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTest}
              className="w-full py-3 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Send Test Notification Now</span>
            </button>
          )}

          {notificationPermission === 'granted' && (
            <p className={`text-[11px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Notifications are active for {user ? user.name : 'your account'}. Click above to test.
            </p>
          )}

          {notificationPermission === 'denied' && (
            <p className="text-[11px] text-center text-rose-400">
              Browser permission is blocked. To enable, click the lock/settings icon in your browser URL bar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
