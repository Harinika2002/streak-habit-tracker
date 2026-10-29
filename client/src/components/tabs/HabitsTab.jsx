import React, { useState } from 'react';
import { Plus, Check, Clock, Flame, Dumbbell, Code, BookOpen, Brain, Star, Trophy, Sparkles } from 'lucide-react';

export default function HabitsTab({ habits, isDark, onToggleHabit, onOpenAddHabit, onOpenTimer, onOpenSuccessModal }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Fitness', 'Coding', 'Learning', 'Mindset'];

  const filteredHabits = filter === 'All' ? habits : habits.filter(h => h.category === filter);
  const allCompletedToday = habits.length > 0 && habits.every(h => h.completedToday);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-rose-400" />;
      case 'Code': return <Code className="w-5 h-5 text-cyan-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-violet-400" />;
      default: return <Star className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Fitness':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Coding':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Learning':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Mindset':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const getWeekDays = () => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Daily Habit Protocols</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Execute daily disciplines to reinforce neural pathways and compound your streak.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Filter Pills */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-all overflow-x-auto scrollbar-none max-w-full ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  filter === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddHabit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Daily All Tasks / Habits Completed Celebration Banner */}
      {allCompletedToday && (
        <div className={`p-4 md:p-5 rounded-3xl border transition-all duration-300 flex flex-wrap items-center justify-between gap-4 ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.1)]'
            : 'bg-gradient-to-r from-emerald-50 via-indigo-50 to-white border-emerald-300 shadow-sm'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0 animate-pulse">
              <Trophy className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-black text-emerald-400">100% Daily Protocols Complete!</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Streak Secured
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                You've cleared every discipline today. Your streak is protected and growing!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSuccessModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Achievement Summary</span>
          </button>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className={`p-5 rounded-3xl border transition-all duration-300 ${
              habit.completedToday
                ? isDark
                  ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.06)]'
                  : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                : isDark
                ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-indigo-500/5'
                : 'bg-white/90 border-slate-200/80 hover:border-slate-300 shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <button
                  onClick={() => onToggleHabit(habit.id)}
                  aria-label={habit.completedToday ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                  className={`w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] shrink-0 aspect-square rounded-2xl flex items-center justify-center transition-all select-none active:scale-90 ${
                    habit.completedToday
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:border-indigo-500/40'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  {habit.completedToday ? <Check className="w-6 h-6 stroke-[3] shrink-0" /> : <span className="shrink-0">{getCategoryIcon(habit.icon)}</span>}
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold text-sm sm:text-base leading-snug break-words ${habit.completedToday ? 'line-through opacity-70 text-slate-400' : ''}`}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(habit.category)}`}>
                      {habit.category}
                    </span>
                    <span className={`text-xs flex items-center gap-1 font-medium shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Clock className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      {habit.targetMins} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Habit Streak Badge */}
              <div className="flex flex-col items-end shrink-0 pl-1">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-400 font-black text-xs border border-indigo-500/20 shadow-sm shrink-0 whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 fill-indigo-400 shrink-0" />
                  <span>{habit.streak}d</span>
                </div>
                <button
                  onClick={() => onOpenTimer(habit)}
                  className="mt-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors shrink-0 whitespace-nowrap"
                >
                  Focus Timer →
                </button>
              </div>
            </div>

            {/* 7-Day Consistency Matrix */}
            <div className={`mt-4 pt-3.5 border-t flex items-center justify-between gap-2 ${
              isDark ? 'border-slate-800/60' : 'border-slate-100'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-wider shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                7-Day Consistency:
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
                {getWeekDays().map((day, i) => {
                  const isChecked = (habit.completedDates || []).length > i;
                  return (
                    <div key={day} className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] shrink-0 aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                          isChecked
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/25'
                            : isDark
                            ? 'bg-slate-800/70 text-slate-500 border border-slate-700/40'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isChecked ? '✓' : day[0]}
                      </div>
                      <span className={`text-[8px] font-medium shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
