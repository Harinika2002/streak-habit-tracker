import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddHabitModal({ isOpen, onClose, onAdd, isDark }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [targetMins, setTargetMins] = useState(25);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const colors = {
      Fitness: '#F43F5E',
      Coding: '#06B6D4',
      Learning: '#10B981',
      Mindset: '#8B5CF6',
      Productivity: '#6366F1'
    };

    onAdd({
      title: title.trim(),
      category,
      targetMins: Number(targetMins) || 20,
      color: colors[category] || '#6366F1',
      icon: category === 'Fitness' ? 'Dumbbell' : category === 'Coding' ? 'Code' : 'Star'
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 border shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black">Create Daily Protocol</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Habit Protocol Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 30 Mins Focused Deep Work, Core Mobility..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm ${
                  isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Fitness">Fitness</option>
                <option value="Coding">Coding</option>
                <option value="Learning">Learning</option>
                <option value="Mindset">Mindset</option>
                <option value="Productivity">Productivity</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Target (Mins)</label>
              <input
                type="number"
                min="5"
                max="240"
                value={targetMins}
                onChange={(e) => setTargetMins(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm ${
                  isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              Initialize Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
