import React from 'react';
import {
  Flame,
  Shield,
  Sparkles,
  Zap,
  Bell,
  LogIn,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function StatsBar({
  profile,
  isDark,
  onToggleTheme,
  onOpenProfile,
  onOpenAuth,
  onOpenNotifications,
}) {
  const { user, isLoggedIn, notificationPermission } = useAuth();

  const getFlameTier = (streak) => {
    if (streak >= 30)
      return {
        name: 'Singularity',
        color: 'from-violet-600 via-fuchsia-500 to-cyan-400',
        glow: 'shadow-violet-500/40',
        text: 'text-violet-300',
      };
    if (streak >= 14)
      return {
        name: 'Zenith',
        color: 'from-indigo-600 via-indigo-500 to-violet-500',
        glow: 'shadow-indigo-500/40',
        text: 'text-indigo-300',
      };
    if (streak >= 7)
      return {
        name: 'Velocity',
        color: 'from-cyan-500 to-indigo-600',
        glow: 'shadow-cyan-500/35',
        text: 'text-cyan-300',
      };
    if (streak >= 3)
      return {
        name: 'Momentum',
        color: 'from-teal-400 to-cyan-500',
        glow: 'shadow-teal-400/30',
        text: 'text-teal-300',
      };
    return {
      name: 'Genesis',
      color: 'from-slate-400 to-indigo-400',
      glow: 'shadow-indigo-400/20',
      text: 'text-slate-300',
    };
  };

  const streakCount = profile?.streak || 0;
  const flame = getFlameTier(streakCount);

  return (
    <header
      className={`rounded-3xl p-3.5 sm:p-4 lg:p-5 mb-5 md:mb-6 border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl'
          : 'bg-white/90 border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
      }`}
    >
      {/* ========================================================
          📱 1. MOBILE VIEW (< sm / < 640px)
          Compact 3-tier mobile layout: Actions -> Hero -> 3-Grid
         ======================================================== */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {/* Row 1: Profile & Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* User Profile Pill or Sign In */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all active:scale-[0.98] ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold leading-tight max-w-[120px] truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-indigo-400 font-semibold leading-none mt-0.5">
                  Profile
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/20 active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Right Controls: Notification Bell & Theme Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenNotifications}
              title={
                notificationPermission === 'granted'
                  ? 'Notifications enabled'
                  : 'Notification settings'
              }
              className={`relative p-2 rounded-xl border transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700/70 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notificationPermission === 'granted' ? (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              ) : notificationPermission === 'default' ? (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-slate-900" />
              ) : null}
            </button>

            <div
              className={`p-0.5 rounded-xl border ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700/70'
                  : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>

        {/* Row 2: Flame & Streak Hero Card */}
        <div
          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-800/40 border-slate-700/50'
              : 'bg-gradient-to-r from-amber-50/60 via-white to-orange-50/60 border-amber-200/60 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${flame.color} flex items-center justify-center text-white shadow-lg ${flame.glow} ring-2 ring-white/20`}
            >
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight">
                  {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-gradient-to-r ${flame.color} text-white shadow-sm`}
                >
                  {flame.name} Tier
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Longest: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{profile?.longestStreak || 0} days</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: 3-Column Equal Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Level / XP */}
          <div
            className={`p-2 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60'
                : 'bg-slate-50 border-slate-200/80 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-violet-400 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-violet-400/40" />
              <span>Lvl {profile?.level || 1}</span>
            </div>
            <div
              className={`text-[10px] font-semibold mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {profile?.xp || 0} XP
            </div>
          </div>

          {/* Card 2: Gems */}
          <div
            className={`p-2 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60'
                : 'bg-slate-50 border-slate-200/80 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 fill-cyan-400/40" />
              <span>{profile?.gems || 0}</span>
            </div>
            <div
              className={`text-[10px] font-semibold mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Gems
            </div>
          </div>

          {/* Card 3: Freezes */}
          <div
            className={`p-2 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60'
                : 'bg-slate-50 border-slate-200/80 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-sky-400 font-bold text-xs">
              <Shield className="w-3.5 h-3.5 fill-sky-400/40" />
              <span>{profile?.freezes || 0}</span>
            </div>
            <div
              className={`text-[10px] font-semibold mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Freezes
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          📱 2. TABLET VIEW (640px to 1023px, sm:block lg:hidden)
          2-Tier Balanced Tablet Layout:
          Row 1: Streak (Left) + Actions/Profile (Right)
          Row 2: 3 Spacious Equal-Width Stat Cards
         ======================================================== */}
      <div className="hidden sm:flex lg:hidden flex-col gap-3.5">
        {/* Row 1: Streak (Left) & Controls (Right) */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand & Streak Tier */}
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 p-2.5 rounded-2xl bg-gradient-to-tr ${flame.color} flex items-center justify-center text-white shadow-lg ${flame.glow} ring-2 ring-white/20 shrink-0`}
            >
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight">
                  {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-gradient-to-r ${flame.color} text-white shadow-sm`}
                >
                  {flame.name} Tier
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Longest Streak: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{profile?.longestStreak || 0} days</strong>
              </p>
            </div>
          </div>

          {/* Right: Notifications, User Profile & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              title={
                notificationPermission === 'granted'
                  ? 'Notifications enabled'
                  : 'Notification settings'
              }
              className={`relative h-10.5 w-10.5 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                  : 'bg-slate-100/90 border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notificationPermission === 'granted' ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              ) : notificationPermission === 'default' ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-slate-900" />
              ) : null}
            </button>

            {/* Profile Pill or Sign In Button */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className={`h-10.5 flex items-center gap-2 pl-2 pr-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500/40 hover:border-indigo-400'
                    : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-bold leading-tight max-w-[100px] truncate">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-indigo-400 font-semibold leading-none mt-0.5">
                    Profile
                  </div>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="h-10.5 flex items-center gap-1.5 px-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Switch */}
            <div
              className={`h-10.5 flex items-center px-1 rounded-2xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/70' : 'bg-slate-100/90 border-slate-200 shadow-sm'
              }`}
            >
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>

        {/* Row 2: 3 Equal-Width Stats Grid on Tablet */}
        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Level / XP */}
          <div
            className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                : 'bg-slate-50 border-slate-200/90 shadow-sm hover:bg-slate-100/80'
            }`}
          >
            <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400">
              <Zap className="w-4 h-4 fill-violet-400/30" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">Level {profile?.level || 1}</div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {profile?.xp || 0} XP
              </div>
            </div>
          </div>

          {/* Card 2: Gems */}
          <div
            className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                : 'bg-slate-50 border-slate-200/90 shadow-sm hover:bg-slate-100/80'
            }`}
          >
            <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4 fill-cyan-400/30" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">{profile?.gems || 0}</div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Gems Earned
              </div>
            </div>
          </div>

          {/* Card 3: Freezes */}
          <div
            className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-2xl border transition-all ${
              isDark
                ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                : 'bg-slate-50 border-slate-200/90 shadow-sm hover:bg-slate-100/80'
            }`}
          >
            <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Shield className="w-4 h-4 fill-sky-400/30" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">{profile?.freezes || 0}</div>
              <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Streak Shields
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          💻 3. DESKTOP VIEW (>= lg / >= 1024px)
          A wide, spacious, horizontal single-row executive bar
         ======================================================== */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        {/* Brand & Streak Tier */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr ${flame.color} flex items-center justify-center text-white shadow-xl ${flame.glow} ring-2 ring-white/20 transition-transform hover:scale-105`}
          >
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl xl:text-3xl font-black tracking-tight">
                {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
              </span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-gradient-to-r ${flame.color} text-white shadow-sm`}
              >
                {flame.name} Tier
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Longest Streak:{' '}
              <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                {profile?.longestStreak || 0} days
              </strong>
            </p>
          </div>
        </div>

        {/* Gamification Stats & User Controls */}
        <div className="flex items-center gap-2 xl:gap-2.5 flex-nowrap">
          {/* Level / XP Points */}
          <div
            className={`h-11 px-3.5 rounded-2xl border flex items-center gap-2 shrink-0 transition-all ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80'
                : 'bg-slate-100/80 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-violet-400 fill-violet-400/40 shrink-0" />
            <div className="flex items-baseline gap-1.5 text-left">
              <span className="text-xs font-bold leading-none whitespace-nowrap">
                Level {profile?.level || 1}
              </span>
              <span
                className={`text-[11px] font-semibold leading-none whitespace-nowrap ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {profile?.xp || 0} XP
              </span>
            </div>
          </div>

          {/* Gems */}
          <div
            className={`h-11 px-3.5 rounded-2xl border flex items-center gap-2 shrink-0 transition-all ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80'
                : 'bg-slate-100/80 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/40 shrink-0" />
            <span className="text-xs font-bold leading-none whitespace-nowrap">
              {profile?.gems || 0} Gems
            </span>
          </div>

          {/* Freeze Shields */}
          <div
            className={`h-11 px-3.5 rounded-2xl border flex items-center gap-2 shrink-0 transition-all ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80'
                : 'bg-slate-100/80 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4 text-sky-400 fill-sky-400/40 shrink-0" />
            <span className="text-xs font-bold leading-none whitespace-nowrap">
              {profile?.freezes || 0} Freezes
            </span>
          </div>

          {/* Notification Center Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            title={
              notificationPermission === 'granted'
                ? 'Notifications enabled'
                : 'Notification settings'
            }
            className={`relative h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800/80 text-slate-300'
                : 'bg-slate-100/80 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            {notificationPermission === 'granted' ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            ) : notificationPermission === 'default' ? (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-slate-900" />
            ) : null}
          </button>

          {/* User Account Button (Login / Sign Up or Profile) */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className={`h-11 flex items-center gap-2.5 pl-2 pr-3.5 rounded-2xl border transition-all active:scale-[0.98] shrink-0 ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500/40 hover:border-indigo-400'
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold leading-tight max-w-[90px] xl:max-w-[120px] truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-indigo-400 font-semibold leading-none mt-0.5">
                  Profile
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="h-11 px-4 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Ripple Theme Switch */}
          <div
            className={`h-11 flex items-center pl-2.5 border-l shrink-0 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
}
