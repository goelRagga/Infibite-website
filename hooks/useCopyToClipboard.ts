'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
}

/**
 * Custom hook for copying text to clipboard with feedback
 * @param resetDelay - Time in ms before resetting isCopied state (default: 2000)
 */
export const useCopyToClipboard = (
  resetDelay: number = 2000
): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
        return true;
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
      }
    },
    [resetDelay]
  );

  return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;
