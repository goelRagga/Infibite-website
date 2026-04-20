'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import PropertyDetailsTypes from '@/components/modules/PropertyDetails/PropertyDetail.types';
import Link from 'next/link';
import { trackEvent } from '@/lib/mixpanel';

// Dynamic import for TabSlider with loading fallback
const TabSlider = dynamic(() => import('@/components/common/TabSlider'));

export const DetailMobileHeader = ({
  name,
  city,
  location,
  backHref,
  className,
  isArrow = true,
  isBookingConfirmIcon = false,
  tabs: tabsProps,
  propertyId,
  is_checkin_out_entered = false,
  brandedBrochure,
}: PropertyDetailsTypes.InfoSectionProps) => {
  const [showSticky, setShowSticky] = useState(false);
  const [showFullHeader, setShowFullHeader] = useState(false);
  const lastScrollY = useRef(0);

  const handleShare = async () => {
    // trackEvent('share_property_clicked', {
    //   page_name: 'property_details',
    //   property_id: propertyId,
    //   property_name: name,
    //   is_checkin_out_entered: is_checkin_out_entered ? true : false,
    // });
    const shareData = {
      title: name || 'Property Details',
      text: `Check out this amazing property in ${city}, ${location}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;

      // Show sticky header when scrolled past 400px
      if (currentScrollY >= 300) {
        setShowSticky(true);
        // Show full header when scrolling up, only tabs when scrolling down
        if (isScrollingUp) {
          setShowFullHeader(true);
        } else {
          setShowFullHeader(false);
        }
      } else if (currentScrollY <= 50) {
        // Hide sticky when near top
        setShowSticky(false);
        setShowFullHeader(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating Buttons */}
      <div
        className={`absolute top-4 left-0 right-0 z-50 flex justify-between items-center px-4 ${className}`}
      >
        {isArrow && backHref && (
          <Link
            href={backHref}
            prefetch={false}
            aria-label='Go back 1'
            className={`bg-white backdrop-blur-md ${isBookingConfirmIcon ? 'rounded' : 'rounded-full'} p-2 shadow-sm inline-flex items-center justify-center`}
          >
            <ArrowLeft className='w-5 h-5 text-[#3b3b3b] border-white' />
          </Link>
        )}

        <div className='flex items-center space-x-3'>
          <button
            className={`bg-card border-1 border-[var(--color-primary-200)] flex items-center justify-center backdrop-blur-md ${isBookingConfirmIcon ? 'rounded w-[40px] h-[40px]' : 'rounded-full'} p-2 dark:bg-white/80 dark:border-[var(--color-primary-400)]`}
            onClick={handleShare}
            aria-label='Share this property'
            title='Share this property'
          >
            <Upload
              className={`w-5 h-5 ${isBookingConfirmIcon ? 'text-accent-green-700' : 'text-[var(--color-primary-800)]'} `}
            />
          </button>

          {/* <button className='bg-card border-1 border-[var(--color-primary-200)] backdrop-blur-md rounded-full p-2'>
            <Bookmark className='w-5 h-5 text-[var(--color-primary-800)]' />
          </button> */}
        </div>
      </div>

      {/* Sticky Header (Animated Slide) */}
      {!isBookingConfirmIcon && (
        <div
          className={`fixed left-0 right-0 z-40 bg-white dark:bg-background shadow-sm transition-all duration-300 ease-out ${
            showSticky
              ? showFullHeader
                ? 'top-0' // Full header visible - at top
                : '-top-[56px]' // Only tabs visible - slide header up
              : '-top-[200px]' // Hidden completely
          }`}
        >
          {/* Full header section */}
          <div className='flex items-center justify-between px-4 pt-2 pb-0 h-[56px]'>
            {isArrow && (
              <Link
                href={backHref}
                aria-label='Go back 2'
                className='z-40 inline-flex items-center justify-center p-0'
              >
                <ArrowLeft />
              </Link>
            )}

            <div className='text-center flex-1 -ml-6'>
              {name && (
                <h1 className='text-lg font-semibold font-serif'>
                  {' '}
                  {name?.split(' ').slice(0, 2).join(' ')}
                </h1>
              )}
              <p className='text-xs text-gray-500 dark:text-white'>
                {city}, {location}
              </p>
            </div>
          </div>
          {/* TabSlider */}
          <div className='flex justify-around text-sm font-medium'>
            <Suspense fallback=''>
              <TabSlider
                tabs={tabsProps}
                headerOffset={showFullHeader ? 90 : 50}
              />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};
