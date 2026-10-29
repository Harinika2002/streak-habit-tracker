import { useState, useEffect } from 'react';
import { sfx } from '../utils/sound';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('streak_theme');
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('streak_theme', theme);
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.body.style.backgroundColor = '#0b0f19';
        } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = '#f8fafc';
        }
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    let centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
    let centerY = 30;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    } else if (e && e.clientX && e.clientY) {
      centerX = e.clientX;
      centerY = e.clientY;
    }

    sfx.playTone(nextTheme === 'dark' ? 360 : 540, 'sine', 0.15);

    // 1. Native Circular Clip-Path Wave (Supported in modern Chrome, Edge & Safari 18+)
    if (typeof document !== 'undefined' && document.startViewTransition) {
      const endRadius = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${centerX}px ${centerY}px)`,
              `circle(${endRadius}px at ${centerX}px ${centerY}px)`,
            ],
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // 2. High-Performance DOM Circular Ripple Fallback
    const targetColor = nextTheme === 'dark' ? '#0b0f19' : '#f8fafc';

    setRipple({ x: centerX, y: centerY, color: targetColor, expand: false });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRipple(prev => (prev ? { ...prev, expand: true } : null));
      });
    });

    setTheme(nextTheme);
  };

  return { theme, isDark: theme === 'dark', ripple, setRipple, toggleTheme };
}
