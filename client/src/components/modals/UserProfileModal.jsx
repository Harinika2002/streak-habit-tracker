import React from 'react';
import {
  X,
  User,
  Mail,
  Flame,
  Zap,
  Sparkles,
  Shield,
  Bell,
  BellRing,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sfx } from '../../utils/sound';

export default function UserProfileModal({
  isOpen,
  onClose,
  isDark,
  profile,
  habits,
  tasks,
  notes,
  triggerToast,
}) {
  const {
    user,
    logout,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification,
  } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    // Collect snapshot of points to guarantee persistence
    const snapshot = {
      profile,
      habits,
      tasks,
      notes,
    };
    logout(snapshot);
    sfx.playSuccess();
    triggerToast?.(`👋 Logged out. Your ${profile?.xp || 0} XP and ${profile?.streak || 0}-day streak are securely saved!`);
    onClose();
  };

  const handleRequestNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res.success) {
      triggerToast?.('🔔 Notifications enabled! Ignis will safeguard your streak.');
    } else if (res.status === 'denied') {
      triggerToast?.('⚠️ Notifications blocked in browser. Please enable them in browser settings.');
    }
  };

  const handleSendTestNotification = () => {
    const sent = sendTestNotification();
    if (sent) {
      triggerToast?.('🔔 Test notification sent to your desktop!');
    } else {
      triggerToast?.('⚠️ Please enable notifications first to receive alerts.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 transition-all max-h-[90vh] overflow-y-auto scrollbar-none ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-2xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black tracking-tight">{user.name}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Level {profile?.level || 1}
              </span>
            </div>
            <p className={`text-xs flex items-center gap-1.5 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Saved Points & Gamification Stats */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Saved Points & Achievements</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* XP Points */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Zap className="w-5 h-5 mx-auto mb-1 text-violet-400 fill-violet-400/30" />
              <div className="text-base font-black text-violet-400">{profile?.xp || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">XP Points</div>
            </div>

            {/* Streak */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Flame className="w-5 h-5 mx-auto mb-1 text-amber-400 fill-amber-400/30" />
              <div className="text-base font-black text-amber-400">{profile?.streak || 0}d</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</div>
            </div>

            {/* Gems */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-cyan-400 fill-cyan-400/30" />
              <div className="text-base font-black text-cyan-400">{profile?.gems || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Gems</div>
            </div>

            {/* Freezes */}
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Shield className="w-5 h-5 mx-auto mb-1 text-sky-400 fill-sky-400/30" />
              <div className="text-base font-black text-sky-400">{profile?.freezes || 0}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Shields</div>
            </div>
          </div>
        </div>

        {/* Notifications & Permissions Section */}
        <div
          className={`p-4 rounded-3xl border mb-6 transition-all ${
            isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold">Browser Notifications</span>
            </div>
            {notificationPermission === 'granted' ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enabled
              </span>
            ) : notificationPermission === 'denied' ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Blocked
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Not Requested
              </span>
            )}
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ignis alerts you before midnight if your habits aren't done, and reminds you when focus timers finish.
          </p>

          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestNotifications}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Ask for Permission</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendTestNotification}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                    : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Send Test Notification</span>
              </button>
            )}
          </div>
        </div>

        {/* Log Out Button */}
        <div className="pt-2 border-t border-slate-800/40">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out (Preserve {profile?.xp || 0} Points & Streaks)</span>
          </button>
          <p className={`text-[10px] text-center mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Safe Logout Guarantee: Your progress will be available when you sign back in.
          </p>
        </div>
      </div>
    </div>
  );
}
