import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { COACH_QUOTES } from '../../constants/initialData';

// Deterministic daily index based on day of year so each calendar day gets a unique quote
const getDailyQuoteIndex = (total) => {
  if (!total) return 0;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % total;
};

export default function CoachBanner({ isDark }) {
  const totalQuotes = COACH_QUOTES.length;

  // Defaults to the daily new quote
  const [idx, setIdx] = useState(() => getDailyQuoteIndex(totalQuotes));
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize on new calendar days
  useEffect(() => {
    setIdx(getDailyQuoteIndex(totalQuotes));
  }, [totalQuotes]);

  const rawQuote = COACH_QUOTES[idx];
  const quoteItem =
    typeof rawQuote === 'object'
      ? rawQuote
      : { quote: rawQuote, author: 'Discipline Protocol', tag: 'Wisdom' };

  const handleRerun = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    setIdx((prev) => (prev + 1) % totalQuotes);
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(`"${quoteItem.quote}" — ${quoteItem.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-4 md:p-5 mb-6 border transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900/90 to-slate-900/90 border-indigo-500/20 text-indigo-100 shadow-[0_4px_24px_rgba(99,102,241,0.06)]'
          : 'bg-gradient-to-r from-indigo-50/70 via-violet-50/40 to-white border-indigo-100 text-indigo-950 shadow-sm'
      }`}
    >
      {/* Subtle ambient decorative glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon & Daily Quote */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-lg shadow-lg shadow-indigo-500/25 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 fill-white/80" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Top Meta Line: Header + Tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              >
                Daily Discipline Briefing
              </span>

              {quoteItem.tag && (
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    isDark
                      ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                      : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {quoteItem.tag}
                </span>
              )}
            </div>

            {/* Dynamic Quote Text with smooth animated entrance */}
            <div
              key={idx}
              className="animate-subtab-in mt-1"
            >
              <div
                className={`text-sm md:text-base font-semibold leading-snug break-words ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                "{quoteItem.quote}"
              </div>
              <div
                className={`text-xs mt-1 font-bold italic ${
                  isDark ? 'text-indigo-300/80' : 'text-indigo-600/80'
                }`}
              >
                — {quoteItem.author}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Controls (Re-run & Copy) */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy Quote"}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRerun}
            title="Re-run Briefing / Next Insight"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 ${
              isDark
                ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30 hover:border-indigo-500/50'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:border-indigo-300'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-500 ${
                isSpinning ? 'rotate-180 text-indigo-400' : ''
              }`}
            />
            <span>Re-run</span>
          </button>
        </div>
      </div>
    </div>
  );
}
