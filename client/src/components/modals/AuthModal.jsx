import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Flame,
  ShieldCheck,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sfx } from '../../utils/sound';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', isDark, triggerToast }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notificationsConsent, setNotificationsConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Fill demo account credentials
  const fillDemoAccount = () => {
    setEmail('alex@streakhabit.app');
    setPassword('password123');
    setErrorMsg('');
    sfx.playTone(523.25, 'sine', 0.1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        if (!password || password.length < 4) {
          setErrorMsg('Password must be at least 4 characters long.');
          setLoading(false);
          return;
        }

        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          notificationsEnabled: notificationsConsent,
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Failed to create account.');
          setLoading(false);
          return;
        }

        sfx.playFanfare();
        triggerToast?.(`🎉 Welcome to StreakHabit, ${name.trim()}! Your points are saved.`);
        onClose();
      } else {
        // Login mode
        if (!email.trim()) {
          setErrorMsg('Please enter your email or name.');
          setLoading(false);
          return;
        }
        if (!password) {
          setErrorMsg('Please enter your password.');
          setLoading(false);
          return;
        }

        const res = await login({ email: email.trim(), password });
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials.');
          setLoading(false);
          return;
        }

        sfx.playSuccess();
        triggerToast?.(`🔥 Welcome back, ${res.user.name}! Restored ${res.user.profile.xp} XP & ${res.user.profile.streak}-day streak.`);
        onClose();
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-2xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Flame className="w-7 h-7 fill-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {mode === 'login' ? 'Sign In to StreakHabit' : 'Create Your Account'}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mode === 'login'
                ? 'Restore your points, streak flame & daily records'
                : 'Save your points permanently even when you log out'}
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div
          className={`grid grid-cols-2 p-1 rounded-2xl mb-5 border ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold mb-1.5 flex items-center justify-between">
                  <span>Full Name</span>
                  <span className="text-[10px] text-indigo-400 font-normal">Required</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold mb-1.5">
              {mode === 'login' ? 'Email or Username' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'alex@streakhabit.app' : 'you@example.com'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-2.5 rounded-2xl border text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Notification Permission Request Checkbox (Sign Up) */}
          {mode === 'signup' && (
            <div
              className={`p-3 rounded-2xl border transition-all ${
                notificationsConsent
                  ? isDark
                    ? 'bg-indigo-950/40 border-indigo-500/40'
                    : 'bg-indigo-50 border-indigo-200'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700/60'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsConsent}
                  onChange={(e) => setNotificationsConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ask for permission to send streak notifications</span>
                  </div>
                  <p className={`mt-0.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Receive a smart reminder before midnight so you never break your streak flame.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Points Preservation Guarantee */}
          <div
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] ${
              isDark
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300'
                : 'bg-slate-100/70 border-slate-200 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Points, XP, and streak levels are saved and restored on logout/login.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In & Restore Points</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Create Account & Secure Points</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Account Quick-Fill for Testing */}
        {mode === 'login' && (
          <div className="mt-4 pt-4 border-t border-slate-800/40 text-center">
            <button
              type="button"
              onClick={fillDemoAccount}
              className={`text-xs font-semibold py-1.5 px-3 rounded-xl border transition-colors inline-flex items-center gap-1.5 ${
                isDark
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                  : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Fill Demo (Alex Rivera • 860 XP)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
