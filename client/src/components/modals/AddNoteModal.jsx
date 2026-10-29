
import React, { useState } from 'react';
import { X, Pin } from 'lucide-react';

export default function AddNoteModal({ isOpen, onClose, onAdd, isDark }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Habit Win');
  const [pinned, setPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      title: title.trim(),
      content: content.trim(),
      tag,
      pinned
    });

    setTitle('');
    setContent('');
    setPinned(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 border shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black">Strategic Note & Reflection</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 7-Day milestone reflection, cognitive shift..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 opacity-80">Reflection / Insight</label>
            <textarea
              required
              rows={4}
              placeholder="What went well today? What friction occurred? What insight was gained?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-black uppercase tracking-wider opacity-80">Tag:</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'bg-slate-800/70 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Habit Win">Habit Win</option>
                <option value="Motivation">Motivation</option>
                <option value="Coding">Coding</option>
                <option value="Reflection">Reflection</option>
                <option value="Idea">Idea</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                pinned
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-sm'
                  : isDark
                  ? 'bg-slate-800/70 border-slate-700 text-slate-400'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-indigo-400 text-indigo-400' : ''}`} />
              <span>{pinned ? 'Pinned' : 'Pin Note'}</span>
            </button>
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
              Commit Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
