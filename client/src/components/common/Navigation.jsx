import React, { useRef, useState, useEffect } from "react";
import {
  Flame,
  Clock,
  StickyNote,
  BarChart2,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function Navigation({ activeTab, onChangeTab, isDark }) {
  const tabs = [
    { id: "habits", label: "Daily Habits", icon: Flame },
    { id: "timer", label: "Task Stopwatch", icon: Clock },
    { id: "graphs", label: "Progress Graphs", icon: TrendingUp },
    { id: "notes", label: "Notes & Wins", icon: StickyNote },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "shop", label: "Streak Vault", icon: Shield },
  ];

  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = () => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [activeTab]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  const handleTabClick = (tabId) => {
    onChangeTab(tabId);
    const el = tabRefs.current[tabId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  return (
    <nav
      className={`relative flex items-center gap-1.5 p-1.5 rounded-2xl border mb-6 overflow-x-auto scrollbar-none backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? "bg-slate-900/80 border-slate-800/80 shadow-md"
          : "bg-slate-200/60 border-slate-300/60 shadow-sm"
      }`}
    >
      {/* Smooth Sliding Active Pill Indicator */}
      <div
        className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30 border border-indigo-400/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
        style={{
          left: 0,
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />

      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => (tabRefs.current[t.id] = el)}
            onClick={() => handleTabClick(t.id)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap select-none transition-colors duration-200 ${
              isActive
                ? "text-white"
                : isDark
                ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? "text-white scale-110" : ""
              }`}
            />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
