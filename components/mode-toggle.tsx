'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wrap in timeout or frame to avoid synchronous cascading render lint error
    // though this is a standard hydration fix pattern
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <div className="w-5 h-5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 w-5 h-5 text-amber-500 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 opacity-100 dark:opacity-0" />
        <Moon className="absolute inset-0 w-5 h-5 text-indigo-400 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 opacity-0 dark:opacity-100" />
      </div>
    </button>
  );
}
