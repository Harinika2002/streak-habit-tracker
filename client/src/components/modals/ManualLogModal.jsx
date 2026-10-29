import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ManualLogModal({ isOpen, tasks, onClose, onLog, isDark }) {
  const [selectedTask, setSelectedTask] = useState('');
  const [minutes, setMinutes] = useState(25);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    onLog(selectedTask, Number(minutes) * 60);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 border shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black">Manual Focus Logging</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Select Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              required
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="">-- Choose a task to log time for --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Duration (Minutes)</label>
            <input
              type="number"
              min="1"
              max="480"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
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
              disabled={!selectedTask}
              className="px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
