import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const initial = saved ? JSON.parse(saved) : false;
    console.log('Initial dark mode:', initial);
    // Sync with DOM immediately
    if (initial) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return initial;
  });

  useEffect(() => {
    console.log('Dark mode changed to:', isDark);
    console.log('HTML classes:', document.documentElement.className);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    console.log('HTML classes after:', document.documentElement.className);
  }, [isDark]);

  const toggle = () => {
    console.log('Toggle called, current:', isDark);
    setIsDark(!isDark);
  };

  return { isDark, toggle };
}
