import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Plus,
  CheckCircle,
  Tag,
} from "lucide-react";
import { formatDuration } from "../../utils/time";

export default function TimerTab({
  timer,
  tasks,
  isDark,
  onLogTime,
  onOpenManualLog,
}) {
  const {
    timerMode,
    setTimerMode,
    timerSeconds,
    timerRunning,
    selectedTaskId,
    setSelectedTaskId,
    targetCountdownMins,
    setTargetCountdownMins,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = timer;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stopwatch / Focus Engine */}
        <div
          className={`lg:col-span-2 p-8 md:p-10 rounded-3xl border flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Subtle Ambient Focus Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

          {/* Mode Switcher */}
          <div
            className={`relative z-10 flex items-center gap-1 p-1 rounded-2xl border mb-6 transition-all ${
              isDark
                ? "bg-slate-800/70 border-slate-700/70"
                : "bg-slate-100 border-slate-300"
            }`}
          >
            <button
              onClick={() => switchMode("stopwatch")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === "stopwatch"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live Stopwatch
            </button>
            <button
              onClick={() => switchMode("countdown")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === "countdown"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pomodoro Focus
            </button>
          </div>

          {/* Active Task Indicator */}
          <div className="relative z-10 mb-2">
            <span
              className={`text-[10px] uppercase font-black tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Currently Focusing On
            </span>
            <h3 className="text-xl md:text-2xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
              {currentTask ? currentTask.title : "Deep Work & Focus Flow"}
            </h3>
          </div>

          {/* Timer Display */}
          <div className="relative z-10 my-6 font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-100 to-cyan-300 drop-shadow-[0_8px_32px_rgba(99,102,241,0.25)] select-none">
            {formatDuration(timerSeconds)}
          </div>

          {/* Timer Controls */}
          <div className="relative z-10 flex items-center gap-3.5 flex-wrap justify-center">
            {!timerRunning ? (
              <button
                onClick={() => startTimer()}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm md:text-base bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm md:text-base bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-500/25 active:scale-95 transition-all"
              >
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={resetTimer}
              title="Reset Timer"
              className={`p-3.5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300"
                  : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {currentTask && timerSeconds > 30 && (
              <button
                onClick={() => {
                  onLogTime(currentTask.id, timerSeconds);
                  resetTimer();
                }}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save & Complete</span>
              </button>
            )}
          </div>
        </div>

        {/* Task Queue & Selector */}
        <div
          className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base">Select Focus Task</h3>
            <button
              onClick={onOpenManualLog}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
            >
              + Manual Log
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selectedTaskId === t.id
                    ? "border-indigo-500/80 bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                    : isDark
                      ? "border-slate-800/80 bg-slate-800/40 hover:bg-slate-800/70 hover:border-slate-700"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs line-clamp-1">
                    {t.title}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400">
                    {t.estimatedMins}m est
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      t.priority === "high"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    }`}
                  >
                    {t.category}
                  </span>
                  <span
                    className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Logged: {Math.round((t.durationSeconds || 0) / 60)}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
