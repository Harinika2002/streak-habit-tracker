import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  Flame,
  CheckCircle2,
  Target,
  Calendar,
  BarChart3,
  Layers,
  Sparkles,
  Zap,
  Grid,
  PieChart,
} from "lucide-react";
import { formatMinutes } from "../../utils/time";

export default function ProgressGraphsTab({ habits, tasks, isDark }) {
  const trackableTasks = tasks.filter((t) => t.trackProgress);

  const [selectedView, setSelectedView] = useState("overall");
  const [graphStyle, setGraphStyle] = useState("bar"); // 'bar' (Pillars), 'heatmap', 'radial'
  const [taskTimeRange, setTaskTimeRange] = useState("week"); // 'week' (7d) or 'month' (30d)
  const [overallRange, setOverallRange] = useState("7d"); // '7d' or '14d'

  // Switch views and ensure task tabs don't retain the overall-only 'radial' style
  const handleSelectView = (viewId) => {
    setSelectedView(viewId);
    if (viewId !== "overall" && graphStyle === "radial") {
      setGraphStyle("bar");
    }
  };

  // --- Dates for Overall Habit Velocity ---
  const overallDays = overallRange === "7d" ? 7 : 14;
  const overallDateLabels = Array.from({ length: overallDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (overallDays - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const habitTrendData = overallDateLabels.map((dateStr) => {
    let completedCount = 0;
    habits.forEach((h) => {
      if (h.completedDates && h.completedDates.includes(dateStr)) {
        completedCount += 1;
      }
    });
    return {
      date: dateStr,
      label: new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }),
      shortDay: new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count: completedCount,
    };
  });

  const maxHabitCount = Math.max(
    ...habitTrendData.map((d) => d.count),
    habits.length || 1,
  );

  // Active task object
  const activeTask = trackableTasks.find((t) => t.id === selectedView);

  // --- Task Daily Data ---
  const taskDaysCount = taskTimeRange === "week" ? 7 : 30;
  const taskDailyData = Array.from({ length: taskDaysCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (taskDaysCount - 1 - i));
    const dateStr = d.toISOString().split("T")[0];

    const history = (activeTask && activeTask.completedHistory) || [];
    const isDone = history.includes(dateStr);

    return {
      date: dateStr,
      dayNum: d.getDate(),
      shortLabel:
        taskTimeRange === "week"
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : `${d.getMonth() + 1}/${d.getDate()}`,
      fullLabel: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      done: isDone,
      val: isDone ? 1 : 0,
    };
  });

  const completedDaysCount = taskDailyData.filter((d) => d.done).length;
  const completionRate = Math.round((completedDaysCount / taskDaysCount) * 100);

  // --- Active Data for Pillars Chart ---
  const activeData = selectedView === "overall" ? habitTrendData : taskDailyData;

  // --- 30-Day Activity Heatmap Matrix Data (Overall) ---
  const heatmapDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];

    const completedHabitsCount = habits.filter(
      (h) => h.completedDates && h.completedDates.includes(dateStr)
    ).length;

    const completedTasksCount = tasks.filter(
      (t) => t.completedHistory && t.completedHistory.includes(dateStr)
    ).length;

    const totalActive = completedHabitsCount + completedTasksCount;
    const ratio = totalActive / Math.max(1, habits.length);
    let intensity = 0;
    if (ratio > 0.8) intensity = 4;
    else if (ratio > 0.5) intensity = 3;
    else if (ratio > 0.25) intensity = 2;
    else if (totalActive > 0) intensity = 1;

    return {
      date: dateStr,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      completedHabitsCount,
      completedTasksCount,
      totalActive,
      intensity,
    };
  });

  // --- Category Time Breakdown Data (for Overall Rings view) ---
  const categoryStats = ["Coding", "Fitness", "Learning", "Mindset"].map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catHabits = habits.filter((h) => h.category === cat);
    const seconds = catTasks.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
    const habitChecks = catHabits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    return {
      category: cat,
      seconds,
      mins: Math.round(seconds / 60),
      habitChecks,
    };
  });
  const totalCategorySeconds = categoryStats.reduce((acc, c) => acc + c.seconds, 0) || 1;

  // Radial Rings Metrics (Overall only)
  const habitsDoneToday = habits.filter((h) => h.completedToday).length;
  const habitRate = habits.length ? Math.round((habitsDoneToday / habits.length) * 100) : 0;
  const totalTrackableDone = trackableTasks.filter((t) => t.status === "completed").length;
  const taskRate = trackableTasks.length ? Math.round((totalTrackableDone / trackableTasks.length) * 100) : 0;
  const avgDiscipline = Math.round((habitRate + taskRate) / 2) || 85;

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Progress & Velocity Graphs
            </h2>
            <p
              className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Analyze your streak trajectory, consistency density, and focus velocity.
            </p>
          </div>

          {/* Context-Aware Graph Style Selector Pills */}
          <div
            className={`flex items-center gap-1 p-1 rounded-2xl border backdrop-blur-md transition-all ${
              isDark
                ? "bg-slate-900/80 border-slate-800"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            {/* Primary: Pillars */}
            <button
              onClick={() => setGraphStyle("bar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                graphStyle === "bar"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Pillars</span>
            </button>

            {/* Common: Heatmap / Task Checklist Grid */}
            <button
              onClick={() => setGraphStyle("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                graphStyle === "heatmap"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                  : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{selectedView === "overall" ? "Heatmap" : "Checklist Grid"}</span>
            </button>

            {/* OVERALL ONLY: Concentric Discipline Rings */}
            {selectedView === "overall" && (
              <button
                onClick={() => setGraphStyle("radial")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  graphStyle === "radial"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Rings</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tab Navigation Bar (Task vs Overall) */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border overflow-x-auto scrollbar-none backdrop-blur-xl ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80"
              : "bg-slate-200/60 border-slate-300/60"
          }`}
        >
          <button
            onClick={() => handleSelectView("overall")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedView === "overall"
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                : isDark
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overall Discipline Velocity</span>
          </button>

          {trackableTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleSelectView(task.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedView === task.id
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                  : isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span className="max-w-[150px] truncate">{task.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. OVERALL VIEW: RINGS STYLE (ONLY IN OVERALL)            */}
      {/* ======================================================== */}
      {selectedView === "overall" && graphStyle === "radial" && (
        <div
          key="overall-radial"
          className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl animate-subtab-in transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* SVG Concentric Rings */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {/* Outer Ring Background (Cyan - Habits) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={isDark ? "#1e293b" : "#e2e8f0"}
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - habitRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Middle Ring (Violet - Tasks) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="62"
                    fill="none"
                    stroke={isDark ? "#1e293b" : "#e2e8f0"}
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="62"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 62}
                    strokeDashoffset={2 * Math.PI * 62 * (1 - taskRate / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Inner Ring (Emerald - Consistency) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="44"
                    fill="none"
                    stroke={isDark ? "#1e293b" : "#e2e8f0"}
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="44"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - 0.88)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Center Score Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                    {avgDiscipline}%
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Discipline
                  </span>
                </div>
              </div>

              {/* Rings Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Habits ({habitRate}%)
                </span>
                <span className="flex items-center gap-1.5 text-violet-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  Tasks ({taskRate}%)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Momentum (88%)
                </span>
              </div>
            </div>

            {/* Category Focus Allocation Breakdown */}
            <div className="space-y-4">
              <div>
                <h4 className="font-black text-base mb-1">
                  Overall Category Focus Allocation
                </h4>
                <p
                  className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Proportion of deep work invested across daily domains.
                </p>
              </div>

              <div className="space-y-3">
                {categoryStats.map((cat) => {
                  const percent = Math.round(
                    (cat.seconds / totalCategorySeconds) * 100
                  );
                  const colors = {
                    Coding: "from-cyan-500 to-blue-500",
                    Fitness: "from-rose-500 to-pink-500",
                    Learning: "from-emerald-500 to-teal-500",
                    Mindset: "from-violet-500 to-indigo-500",
                  };
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>{cat.category}</span>
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                          {cat.mins} mins ({percent}%)
                        </span>
                      </div>
                      <div
                        className={`w-full h-2 rounded-full overflow-hidden ${
                          isDark ? "bg-slate-800" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            colors[cat.category] || "from-indigo-500 to-violet-500"
                          } transition-all duration-700`}
                          style={{ width: `${Math.max(5, percent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. OVERALL VIEW: 30-DAY HEATMAP MATRIX                    */}
      {/* ======================================================== */}
      {selectedView === "overall" && graphStyle === "heatmap" && (
        <div
          key="overall-heatmap"
          className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl animate-subtab-in transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Grid className="w-4 h-4" />
                </span>
                <h3 className="font-black text-base md:text-lg">
                  Overall 30-Day Activity Density Matrix
                </h3>
              </div>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Darker tiles indicate peak daily ritual and task completion volume.
              </p>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>Less</span>
              <span className="w-3.5 h-3.5 rounded bg-slate-800/80 border border-slate-700/50" />
              <span className="w-3.5 h-3.5 rounded bg-indigo-900/70 border border-indigo-600/40" />
              <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400/50" />
              <span className="w-3.5 h-3.5 rounded bg-violet-500 shadow-sm" />
              <span className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-sm" />
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>More</span>
            </div>
          </div>

          {/* 30-Day Heatmap Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5">
            {heatmapDays.map((d, index) => {
              const getTileBg = (lvl) => {
                switch (lvl) {
                  case 4:
                    return "bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/25";
                  case 3:
                    return "bg-violet-600 text-white font-bold shadow-sm shadow-violet-500/20";
                  case 2:
                    return "bg-indigo-600/80 text-white font-semibold";
                  case 1:
                    return isDark
                      ? "bg-indigo-950/70 border border-indigo-800/60 text-indigo-300"
                      : "bg-indigo-100 text-indigo-800 border border-indigo-200";
                  default:
                    return isDark
                      ? "bg-slate-800/50 border border-slate-700/40 text-slate-500"
                      : "bg-slate-100 border border-slate-200 text-slate-400";
                }
              };

              return (
                <div
                  key={index}
                  className={`p-3 rounded-2xl flex flex-col justify-between h-20 transition-all duration-200 hover:scale-105 group relative cursor-pointer ${getTileBg(
                    d.intensity
                  )}`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold">{d.dayName}</span>
                    <span className="font-black text-xs">{d.dayNum}</span>
                  </div>

                  <div className="text-[11px] font-bold">
                    {d.totalActive > 0 ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {d.totalActive} done
                      </span>
                    ) : (
                      <span className="opacity-50 text-[10px]">Rest</span>
                    )}
                  </div>

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-30 border border-slate-700">
                    {d.date}: {d.completedHabitsCount} habits, {d.completedTasksCount} tasks
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TASK-SPECIFIC VIEW: 30-DAY CHECKLIST GRID              */}
      {/* ======================================================== */}
      {selectedView !== "overall" && graphStyle === "heatmap" && activeTask && (
        <div
          key={`task-checklist-${selectedView}`}
          className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl animate-subtab-in transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Grid className="w-4 h-4" />
                </span>
                <h3 className="font-black text-base md:text-lg">
                  {activeTask.title} — Daily Checklist Matrix
                </h3>
              </div>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Track day-by-day execution status for this specific task across the last 30 days.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                Completed ({completedDaysCount} Days)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
                Missed ({taskDaysCount - completedDaysCount} Days)
              </span>
            </div>
          </div>

          {/* Task 30-Day Tiles */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5">
            {taskDailyData.map((d, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl flex flex-col justify-between h-20 transition-all duration-200 hover:scale-105 group relative cursor-pointer ${
                  d.done
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                    : isDark
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-500"
                    : "bg-slate-100 border border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold">{d.shortLabel}</span>
                  <span className="font-black text-xs">{d.dayNum}</span>
                </div>

                <div className="text-[11px] font-bold">
                  {d.done ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      Done
                    </span>
                  ) : (
                    <span className="opacity-50 text-[10px]">Missed</span>
                  )}
                </div>

                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-30 border border-slate-700">
                  {d.fullLabel}: {d.done ? "Executed successfully" : "Not completed"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PILLARS ARCHITECTURAL VELOCITY CHART (PRIMARY)         */}
      {/* ======================================================== */}
      {graphStyle === "bar" && (
        <div
          key={`pillars-${selectedView}`}
          className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl animate-subtab-in transition-all duration-300 ${
            isDark
              ? "bg-slate-900/80 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
              : "bg-white/85 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Chart Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <h3 className="font-black text-base md:text-lg">
                  {selectedView === "overall"
                    ? "Overall Habit Velocity Pillars"
                    : `${activeTask?.title} Execution Pillars`}
                </h3>
              </div>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {selectedView === "overall"
                  ? "Daily habit completions compiled across all active rituals."
                  : `${completedDaysCount} of ${taskDaysCount} days completed (${completionRate}% Consistency Rate).`}
              </p>
            </div>

            {/* Time Period Filter */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border ${
                isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100 border-slate-200"
              }`}
            >
              {selectedView === "overall" ? (
                <>
                  <button
                    onClick={() => setOverallRange("7d")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      overallRange === "7d"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setOverallRange("14d")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      overallRange === "14d"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    14 Days
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setTaskTimeRange("week")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      taskTimeRange === "week"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Week (7D)
                  </button>
                  <button
                    onClick={() => setTaskTimeRange("month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      taskTimeRange === "month"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Month (30D)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pillars Architectural Chart */}
          <div className="relative w-full overflow-x-auto pb-4">
            <div className="min-w-[580px] sm:min-w-0">
              <div className="relative h-64 flex items-end">
                {/* Horizontal Dashed Guidelines & Left Y-Axis Scale */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-2">
                  <div className="w-full border-b border-dashed border-slate-700/30 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="text-emerald-400">
                      {selectedView === "overall" ? `${maxHabitCount} RITUALS` : "100% DONE"}
                    </span>
                  </div>
                  <div className="w-full border-b border-dashed border-slate-700/20 flex items-center justify-between text-[10px] font-bold text-slate-500/60">
                    <span>
                      {selectedView === "overall" ? `${Math.round(maxHabitCount / 2)}` : "50%"}
                    </span>
                  </div>
                  <div className="w-full border-b border-slate-700/30 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="text-rose-400">
                      {selectedView === "overall" ? "0" : "MISSED"}
                    </span>
                  </div>
                </div>

                {/* Columns Container */}
                <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-4 pl-14 pr-2 pb-8">
                  {activeData.map((d, index) => {
                    const isOverall = selectedView === "overall";
                    const isSuccess = isOverall ? d.count > 0 : d.done;
                    const heightPercent = isOverall
                      ? maxHabitCount > 0
                        ? (d.count / maxHabitCount) * 100
                        : 0
                      : d.done
                      ? 100
                      : 12;

                    const itemLabel = d.label || d.fullLabel;
                    const shortLabel = d.shortDay || d.shortLabel;
                    const tooltipText = isOverall
                      ? `${d.count} completed`
                      : d.done
                      ? "Executed"
                      : "Missed";
                    const badgeText = isOverall
                      ? d.count > 0 ? d.count : "—"
                      : d.done ? "✓" : "—";

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                      >
                        {/* Hover Tooltip Card */}
                        <div className="absolute -top-11 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-950 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30 border border-slate-700 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSuccess ? "bg-cyan-400" : "bg-rose-500"
                            }`}
                          />
                          <span>{itemLabel}:</span>
                          <span
                            className={isSuccess ? "text-cyan-300" : "text-rose-300"}
                          >
                            {tooltipText}
                          </span>
                        </div>

                        {/* Top Value / Status Pill */}
                        <div
                          className={`mb-2 text-[10px] font-black transition-all duration-200 ${
                            isSuccess
                              ? "text-cyan-400 opacity-90 group-hover:scale-110"
                              : isDark
                              ? "text-slate-600"
                              : "text-slate-400"
                          }`}
                        >
                          {badgeText}
                        </div>

                        {/* Architectural Pillar Column */}
                        <div
                          style={{ height: `${Math.max(heightPercent, 10)}%` }}
                          className={`w-full ${
                            taskTimeRange === "month" && !isOverall
                              ? "max-w-[20px]"
                              : "max-w-[42px]"
                          } rounded-t-2xl transition-all duration-500 group-hover:scale-y-105 origin-bottom relative overflow-hidden ${
                            isSuccess
                              ? "bg-gradient-to-t from-indigo-600 via-violet-500 to-cyan-400 shadow-lg shadow-indigo-500/25 border-t-2 border-cyan-300"
                              : isDark
                              ? "bg-slate-800/60 border border-slate-700/40"
                              : "bg-slate-200 border border-slate-300"
                          }`}
                        >
                          {/* Inner Ambient Glow Highlight on Hover */}
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                        </div>

                        {/* X-Axis Date / Day Label */}
                        <div className="absolute -bottom-2 flex flex-col items-center">
                          <span
                            className={`text-[10px] font-black transition-colors ${
                              isDark
                                ? "text-slate-400 group-hover:text-slate-200"
                                : "text-slate-500 group-hover:text-slate-900"
                            }`}
                          >
                            {shortLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-700/20">
            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Tracked Range
              </span>
              <div className="text-xl font-black mt-1">
                {selectedView === "overall" ? `${overallDays} Days` : `${taskDaysCount} Days`}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {selectedView === "overall" ? "Peak Velocity" : "Executed Days"}
              </span>
              <div className="text-xl font-black mt-1 text-emerald-400">
                {selectedView === "overall"
                  ? `${maxHabitCount} Rituals`
                  : `${completedDaysCount} Days`}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {selectedView === "overall" ? "Active Habits" : "Missed Days"}
              </span>
              <div
                className={`text-xl font-black mt-1 ${
                  selectedView === "overall" ? "text-cyan-400" : "text-rose-400"
                }`}
              >
                {selectedView === "overall"
                  ? `${habits.length} Tracked`
                  : `${taskDaysCount - completedDaysCount} Days`}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark ? "bg-slate-800/40 border-slate-700/60" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Discipline Rating
              </span>
              <div className="text-xl font-black mt-1 text-indigo-400">
                {selectedView === "overall" ? "92% A+" : `${completionRate}%`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
