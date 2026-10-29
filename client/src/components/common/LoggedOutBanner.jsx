import React from 'react';
import { User, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoggedOutBanner({ onOpenAuth, isDark }) {
  return (
    <div
      className={`relative mb-6 rounded-3xl p-4 md:p-5 border transition-all animate-fade-in ${
        isDark
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-indigo-950/40 border-amber-500/30 shadow-lg shadow-black/40 backdrop-blur-xl'
          : 'bg-gradient-to-r from-amber-50 via-white to-indigo-50 border-amber-200 shadow-sm backdrop-blur-xl'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black tracking-tight">You're Currently Browsing as Guest</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                Guest Mode
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Sign in or create an account with your name to save your points permanently across logouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Account & Save Points</span>
          </button>
        </div>
      </div>
    </div>
  );
}
