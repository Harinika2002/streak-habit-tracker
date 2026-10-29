import React from 'react';
import { BarChart2, CheckCircle2, Clock, Flame } from 'lucide-react';
import { formatMinutes } from '../../utils/time';

export default function AnalyticsTab({ habits, tasks, isDark }) {
  const totalCompletedHabits = habits.reduce((acc, h) => acc + (h.completedDates ? h.completedDates.length : 0), 0);
  const totalSecondsLogged = tasks.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
  const totalMinsLogged = Math.round(totalSecondsLogged / 60);

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
            : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed Rituals</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black mt-3 tracking-tight">{totalCompletedHabits}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total daily checks logged</p>
        </div>

        <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
            : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deep Focus Time</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black mt-3 tracking-tight">{formatMinutes(totalMinsLogged)}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total logged across deep work</p>
        </div>

        <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
            : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Protocols</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black mt-3 tracking-tight">{habits.length}</div>
          <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tracked in daily discipline</p>
        </div>
      </div>

      {/* Task Time Breakdown Table */}
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
          : 'bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
      }`}>
        <h3 className="font-black text-base md:text-lg mb-4">Task Duration Log Breakdown</h3>
        <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
          {tasks.map(t => (
            <div key={t.id} className="py-3.5 flex items-center justify-between transition-colors">
              <div>
                <h4 className="font-bold text-sm">{t.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{t.category}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Est: {t.estimatedMins}m</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {formatMinutes(Math.round((t.durationSeconds || 0) / 60))}
                </span>
                <div className={`text-[10px] font-bold mt-0.5 ${t.status === 'completed' ? 'text-emerald-500' : 'text-cyan-400'}`}>
                  {t.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
