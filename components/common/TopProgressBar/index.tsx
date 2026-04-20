'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const TopProgressBar = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle link clicks to start progress immediately
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (
        link &&
        link.href &&
        !link.target &&
        link.href.startsWith(window.location.origin)
      ) {
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Check if it's the same page (pathname + search)
        const isSamePage =
          linkUrl.pathname === currentUrl.pathname &&
          linkUrl.search === currentUrl.search;

        if (isSamePage) {
          // Same page click - complete immediately
          setIsNavigating(true);
          setProgress(0);

          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setIsNavigating(false);
              setProgress(0);
            }, 300);
          }, 100);
        } else {
          // Different page - show progress
          const startPath = pathname;
          setIsNavigating(true);
          setProgress(0);

          // Simulate progress
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) return 90;
              return prev + 10;
            });
          }, 50);

          // Reset if navigation doesn't happen (e.g., preventDefault was called)
          setTimeout(() => {
            if (startPath === window.location.pathname) {
              setIsNavigating(false);
              setProgress(0);
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
          }, 1000);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [pathname]);

  // Complete progress when pathname changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 300);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className='fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-gradient-to-r from-accent-red-900 via-red-600 to-accent-red-900'
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </AnimatePresence>
  );
};

export default TopProgressBar;
