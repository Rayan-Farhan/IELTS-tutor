// Custom hook for managing autoplay preference

import { useState, useCallback, useEffect } from 'react';

const AUTOPLAY_KEY = 'tutor_autoplay';

export const useAutoplay = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTOPLAY_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTOPLAY_KEY, String(enabled));
    } catch (err) {
      console.error('Failed to save autoplay preference:', err);
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return {
    enabled,
    toggle,
  };
};
