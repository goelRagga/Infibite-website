'use client';

import CustomImage from '@/components/common/CustomImage';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/hooks/useIsMobile';
import { CopyIcon, CheckIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface BannerGrassberryProps {
  mobileSrc?: string;
  desktopSrc?: string;
  className?: string;
  isButton?: boolean;
  mobHeight?: number;
  desktopHeight?: number;
  mobImageFormat?: string;
  desktopImageFormat?: string;
}

export default function BannerGrassberry({
  mobileSrc,
  desktopSrc,
  mobHeight = 200,
  desktopHeight = 300,
  mobImageFormat,
  desktopImageFormat,
  className,
  isButton = false,
}: BannerGrassberryProps) {
  const isMobile = useIsMobile();
  const [isCopied, setIsCopied] = useState(false);

  const code = 'ELIXBERRY10';

  const copyCoupon = () => {
    const coupon = code;
    navigator.clipboard.writeText(coupon);
    toast.success('Coupon code copied!');
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1200);
  };

  return (
    <div className='-mb-20 mt-0 md:mt-0 md:mb-5 relative top-13 md:top-0 left-0 w-full'>
      <CustomImage
        src={isMobile ? mobileSrc || '' : desktopSrc || ''}
        alt='Banner'
        width={1600}
        height={isMobile ? mobHeight : 250}
        className={`${className} w-full! `}
        format={isMobile ? mobImageFormat : desktopImageFormat}
      />
      {isButton && (
        <div className='absolute inset-x-5 bottom-2 md:-bottom-5 md:left-10 text-center z-10 p-5 md:p-10 transform -translate-y-0'>
          <Button
            onClick={copyCoupon}
            variant='default'
            className={`rounded-full shadow-lg z-20 bg-accent-red-900 hover:bg-accent-red-950 overflow-hidden cursor-pointer text-white transition-colors duration-300`}
          >
            {code}
            {isCopied ? (
              <CheckIcon className='w-4 h-4' />
            ) : (
              <CopyIcon className='w-4 h-4' />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
