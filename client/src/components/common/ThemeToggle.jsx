import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`relative w-[60px] h-[30px] rounded-full cursor-pointer transition-all duration-300 select-none border ${
        isDark
          ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
          : 'bg-slate-200 border-slate-300 hover:border-slate-400'
      }`}
      role="button"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-[2px] left-[2px] w-[24px] h-[24px] rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark
            ? 'translate-x-[30px] bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
            : 'translate-x-0 bg-white text-slate-800 shadow-md'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        )}
      </div>
    </div>
  );
}
