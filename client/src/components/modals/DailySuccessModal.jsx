import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  CheckCircle2,
  Share2,
  RotateCcw,
  Clock,
  ArrowRight,
} from "lucide-react";
import { sfx } from "../../utils/sound";
import { formatMinutes } from "../../utils/time";

export default function DailySuccessModal({
  isOpen,
  onClose,
  habits = [],
  tasks = [],
  profile,
  isDark,
  onClaimReward,
  triggerToast,
}) {
  const canvasRef = useRef(null);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate stats
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalSeconds = tasks.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
  const totalMins = Math.round(totalSeconds / 60);

  // Streak Tier resolver
  const getFlameTier = (streak) => {
    if (streak >= 30) return { name: "Singularity", color: "from-violet-600 via-fuchsia-500 to-cyan-400" };
    if (streak >= 14) return { name: "Zenith", color: "from-indigo-600 via-indigo-500 to-violet-500" };
    if (streak >= 7) return { name: "Velocity", color: "from-cyan-500 to-indigo-600" };
    if (streak >= 3) return { name: "Momentum", color: "from-teal-400 to-cyan-500" };
    return { name: "Genesis", color: "from-slate-400 to-indigo-400" };
  };

  const flameTier = getFlameTier(profile?.streak || 1);

  // Confetti Particle Engine
  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#38BDF8"];
    const particles = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 150,
        y: canvas.height / 3 + (Math.random() - 0.5) * 50,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1,
      });
    }

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      }

      if (alive) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animationId);
  };

  useEffect(() => {
    if (isOpen) {
      sfx.playFanfare();
      const timer = setTimeout(fireConfetti, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (!claimed) {
      setClaimed(true);
      onClaimReward?.({ xp: 100, gems: 10 });
      sfx.playSuccess();
      triggerToast?.("🎉 +100 XP & +10 Gems claimed for 100% daily mastery!");
    }
    onClose();
  };

  const handleShare = () => {
    const text = `🏆 StreakHabit Victory! I completed 100% of my daily protocols today! Current streak: ${profile.streak} days (${flameTier.name} Tier).`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      triggerToast?.("📋 Daily victory summary copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 md:p-8 border shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all ${
          isDark
            ? "bg-[#0B0F19] border-indigo-500/30 text-slate-100"
            : "bg-white border-indigo-200 text-slate-900"
        }`}
      >
        {/* Confetti Animation Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 z-30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Trophy */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/40 animate-bounce">
              <div
                className={`w-full h-full rounded-[22px] flex items-center justify-center ${
                  isDark ? "bg-slate-950" : "bg-white"
                }`}
              >
                <Trophy className="w-10 h-10 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            Protocol Completion Unlocked
          </span>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Daily Mastery Achieved!
          </h2>
          <p
            className={`text-xs md:text-sm max-w-sm mt-1.5 leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Flawless execution today! You checked off all{" "}
            <strong className={isDark ? "text-white" : "text-slate-900"}>
              {completedHabits} daily protocols
            </strong>{" "}
            and reinforced your consecutive streak momentum.
          </p>
        </div>

        {/* Streak Progression & Rewards Showcase */}
        <div
          className={`relative z-10 mt-6 p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-slate-900/90 border-slate-800 shadow-inner"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${flameTier.color} flex items-center justify-center text-white shadow-md`}
              >
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg">
                    {profile?.streak || 1} Days Active
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {flameTier.name} Tier
                  </span>
                </div>
                <span
                  className={`text-[11px] block mt-0.5 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Streak secured until tomorrow!
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1 justify-end">
                <Sparkles className="w-3.5 h-3.5" />
                Bonus Rewards
              </div>
              <div className="text-sm font-black mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                +100 XP / +10 Gems
              </div>
            </div>
          </div>

          {/* Level Progress Indicator */}
          <div className="mt-3.5 pt-3 border-t border-slate-700/20">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                Level {profile?.level || 1} Progress
              </span>
              <span className="text-indigo-400">
                {profile?.xp || 0} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((profile?.xp || 0) % 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Metrics Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 mt-4">
          <div
            className={`p-3 rounded-2xl border text-center ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span
              className={`text-[9px] uppercase font-black block tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Rituals
            </span>
            <span className="text-base font-black text-emerald-400 mt-0.5 block">
              {completedHabits}/{totalHabits}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-center ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span
              className={`text-[9px] uppercase font-black block tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Focus Time
            </span>
            <span className="text-base font-black text-indigo-400 mt-0.5 block">
              {formatMinutes(totalMins)}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border text-center ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span
              className={`text-[9px] uppercase font-black block tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Execution
            </span>
            <span className="text-base font-black text-cyan-400 mt-0.5 block">
              100%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={fireConfetti}
            title="Burst celebration confetti again"
            className={`w-full sm:w-auto p-3 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
              isDark
                ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="sm:hidden md:inline">Celebrate</span>
          </button>

          <button
            onClick={handleShare}
            className={`w-full sm:w-auto px-4 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              isDark
                ? "border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300"
                : "border-indigo-200 hover:bg-indigo-50 text-indigo-700"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Share Recap"}</span>
          </button>

          <button
            onClick={handleClaim}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl font-black text-xs md:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Claim & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
