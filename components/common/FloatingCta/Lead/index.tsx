'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';
import ResponsiveDialogDrawer from '../../ResponsiveDialogDrawer';
import SingleBlogPageForm from '@/components/wordpressComponents/WPForms/SingleBlogPageForm';
import { trackEvent } from '@/lib/mixpanel';
import { useLeadCapture } from '@/hooks/useLeadCapture';

const LeadCTA: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTriggeredRef = useRef(false);

  // Check if current page belongs to /explore/ path
  const isExplorePage = pathname?.startsWith('/explore/') ?? false;

  // Use the lead capture hook for tracking if form was opened
  const {
    hasLeadCaptured: hasOpenedInSession,
    markLeadCaptured: markAsOpened,
  } = useLeadCapture();

  // Function to open modal (only if not already opened in this session)
  const handleOpenModal = useCallback(() => {
    if (!hasOpenedInSession() && isExplorePage) {
      markAsOpened();
      setOpen(true);
      trackEvent('enqiry_cta_auto_opened');
    }
  }, [isExplorePage, hasOpenedInSession, markAsOpened]);

  const leadEventTrack = () => {
    markAsOpened();
    setOpen(true);
    trackEvent('enqiry_cta_clicked');
  };

  // Reset page-specific triggers when pathname changes (but keep persistent flag)
  useEffect(() => {
    // Only reset page-specific state, not persistent flag
    scrollTriggeredRef.current = false;
    setOpen(false);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [pathname]);

  // Trigger 1: Open modal after 15 seconds
  useEffect(() => {
    // Only trigger on /explore/ pages
    if (!isExplorePage) return;

    // Clear any existing timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const timer = setTimeout(() => {
      handleOpenModal();
    }, 15000); // 15 seconds

    timerRef.current = timer;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleOpenModal, pathname, isExplorePage]);

  // Trigger 2: Open modal when user scrolls 30% of the page
  useEffect(() => {
    // Only trigger on /explore/ pages
    if (!isExplorePage) return;

    const handleScroll = () => {
      if (hasOpenedInSession() || scrollTriggeredRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;

      // Only calculate if there's scrollable content
      if (scrollableHeight > 0) {
        const scrollPercentage = (scrollTop / scrollableHeight) * 100;

        // Open modal when user scrolls approximately 30% of the page
        if (scrollPercentage >= 20) {
          scrollTriggeredRef.current = true;
          handleOpenModal();
        }
      }
    };

    // Wait for page to be fully loaded
    const initScroll = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Check initial scroll position
      handleScroll();
    };

    // Small delay to ensure DOM is ready after navigation
    const timeoutId = setTimeout(() => {
      if (document.readyState === 'complete') {
        initScroll();
      } else {
        window.addEventListener('load', initScroll, { once: true });
        initScroll();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', initScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleOpenModal, pathname, isExplorePage, hasOpenedInSession]);

  // Trigger 3: Open modal when user is leaving the page
  useEffect(() => {
    // Only trigger on /explore/ pages
    if (!isExplorePage) return;

    // Track mouse leaving from the top of the viewport (user moving to close tab/bookmarks/address bar)
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the viewport (going to browser chrome)
      if (e.clientY <= 0 && !hasOpenedInSession()) {
        handleOpenModal();
      }
    };

    // Handle visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden && !hasOpenedInSession()) {
        handleOpenModal();
      }
    };

    // Handle window blur (user switching to another window/app)
    const handleBlur = () => {
      if (!hasOpenedInSession()) {
        handleOpenModal();
      }
    };

    // Use document-level mouseout for better detection
    const handleMouseOut = (e: MouseEvent) => {
      // Check if mouse is leaving the document from the top
      // relatedTarget will be null when leaving the document
      if (!e.relatedTarget && e.clientY <= 0 && !hasOpenedInSession()) {
        handleOpenModal();
      }
    };

    // Also listen on document body for mouse leave
    const handleBodyMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasOpenedInSession()) {
        handleOpenModal();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseout', handleMouseOut);
    document.body?.addEventListener('mouseleave', handleBodyMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body?.removeEventListener('mouseleave', handleBodyMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleOpenModal, pathname, isExplorePage, hasOpenedInSession]);

  return (
    <>
      <div
        onClick={leadEventTrack}
        className='relative w-[42px] h-[42px] sm:w-[70px] sm:h-[70px] rounded-full bg-accent-red-900 shadow-lg flex justify-center items-center z-20 overflow-hidden cursor-pointer'
      >
        <div className='flex justify-center items-center w-full h-full'>
          <div className='icon'>
            <Mail className='w-[22px] h-[22px] sm:w-[35px] sm:h-[35px] transition-transform duration-300 hover:scale-110 text-white' />
          </div>
        </div>
      </div>
      <ResponsiveDialogDrawer
        contentClassName='h-screen h-auto sm:h-[500px] sm:max-w-[480px]! bg-card gap-0 fixed! bottom-0!'
        overlayClassName='bg-black/70!'
        title='Send a Request'
        description='Our team will get back to you promply'
        open={open}
        setOpen={setOpen}
      >
        <div className='relative h-auto overflow-auto pt-0 mb-20'>
          <SingleBlogPageForm
            formType='lead'
            className='h-auto'
            onClose={() => setOpen(false)}
          />
        </div>
      </ResponsiveDialogDrawer>
    </>
  );
};

LeadCTA.displayName = 'LeadCTA';

export default React.memo(LeadCTA);
