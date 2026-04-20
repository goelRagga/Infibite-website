'use client';

import { useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface UseLeadCaptureReturn {
  /** Check if lead has been captured */
  hasLeadCaptured: () => boolean;
  /** Mark lead as captured */
  markLeadCaptured: () => void;
  /** Clear lead capture flag */
  clearLeadCapture: () => void;
}

/**
 * Custom hook to manage lead capture state in localStorage
 * Used for both FloatingCta lead form and AI chat registration
 * Persists across page reloads and sessions
 */
export const useLeadCapture = (): UseLeadCaptureReturn => {
  const key = LOCAL_STORAGE_KEYS.CAPTURED_LEAD;

  const hasLeadCaptured = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(key) === 'true';
  }, [key]);

  const markLeadCaptured = useCallback((): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, 'true');
    }
  }, [key]);

  const clearLeadCapture = useCallback((): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, [key]);

  return { hasLeadCaptured, markLeadCaptured, clearLeadCapture };
};

export default useLeadCapture;
