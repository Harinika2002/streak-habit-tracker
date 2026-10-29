import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 text-white font-bold px-5 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 border border-indigo-500/40 backdrop-blur-xl">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-semibold text-slate-100">{message}</span>
      </div>
    </div>
  );
}
