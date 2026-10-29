import React, { useState } from 'react';
import { Plus, Pin, Trash2, Tag, Calendar } from 'lucide-react';

export default function NotesTab({ notes, isDark, onOpenAddNote, onTogglePin, onDeleteNote }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const tags = ['All', 'Habit Win', 'Motivation', 'Coding', 'Reflection', 'Idea'];

  const filtered = selectedTag === 'All' ? notes : notes.filter(n => n.tag === selectedTag);
  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6">
      {/* Header & Tag Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Executive Notes & Habit Reflections</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Capture tactical wins, cognitive breakthroughs, and compound momentum reflections.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTag === t
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(note => (
          <div
            key={note.id}
            className={`p-5 md:p-6 rounded-3xl border relative flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
              note.pinned
                ? isDark
                  ? 'bg-indigo-950/25 border-indigo-500/40 shadow-[0_8px_24px_rgba(99,102,241,0.1)]'
                  : 'bg-indigo-50/70 border-indigo-200 shadow-sm'
                : isDark
                ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                : 'bg-white/90 border-slate-200/80 hover:border-slate-300 shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {note.tag}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(note.id)}
                    title={note.pinned ? 'Unpin' : 'Pin note'}
                    className={`p-1.5 rounded-xl transition-all ${
                      note.pinned
                        ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Pin className={`w-4 h-4 ${note.pinned ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    title="Delete note"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {note.title && (
                <h3 className={`font-bold text-base mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {note.title}
                </h3>
              )}
              <p className={`text-xs whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {note.content}
              </p>
            </div>

            <div className={`mt-5 pt-3.5 border-t text-[10px] flex items-center justify-between font-medium ${
              isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              {note.pinned && (
                <span className="font-bold text-indigo-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Pinned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
