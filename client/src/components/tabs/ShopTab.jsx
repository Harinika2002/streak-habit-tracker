import React from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';
import { MILESTONES } from '../../constants/initialData';

export default function ShopTab({ profile, onBuyFreeze, isDark }) {
  return (
    <div className="space-y-6">
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
          : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <Shield className="w-8 h-8 fill-cyan-400/30" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black">Streak Freeze Shield</h3>
              <p className={`text-xs max-w-md mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Missed an unexpected day? A streak freeze automatically shields your active streak from resetting to zero.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-cyan-400 flex items-center justify-end gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Cost: 50 Gems
              </div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Balance: {profile.gems} gems</div>
            </div>
            <button
              onClick={onBuyFreeze}
              className="px-6 py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              Equip Shield
            </button>
          </div>
        </div>
      </div>

      {/* Milestones / Trophy Room */}
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
          : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
      }`}>
        <h3 className="text-base md:text-lg font-black mb-4">Mastery Trophies & Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MILESTONES.map(m => {
            const unlocked = profile.streak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all duration-300 ${
                  unlocked
                    ? isDark
                      ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent shadow-md shadow-indigo-500/10'
                      : 'border-indigo-200 bg-indigo-50/60 shadow-sm'
                    : isDark ? 'border-slate-800/70 bg-slate-800/30 opacity-50' : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  unlocked
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">{m.title} ({m.days} Days)</h4>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>
                  <span className={`text-[10px] font-bold mt-1 inline-block ${unlocked ? 'text-indigo-400' : 'text-slate-500'}`}>
                    +{m.xp} XP / +{m.gems} Gems
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
