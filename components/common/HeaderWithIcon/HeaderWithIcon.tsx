'use client';

import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
import React from 'react';

type HeaderWithIconProps = {
  icon?: React.ReactNode;
  title: string;
  onIconClick?: () => void;
  titleClassName?: string;
  showicon?: React.ReactNode;
  onclick?: () => void;
  isShare?: boolean;
};

const HeaderWithIcon: React.FC<HeaderWithIconProps> = ({
  icon,
  title,
  onIconClick,
  showicon,
  titleClassName = '',
  onclick,
  isShare = false,
}) => {
  const showHelp = typeof onclick === 'function';
  const showIcon = Boolean(icon);

  const wrapperClass = clsx(
    'flex items-center mb-4 md:mb-0',
    showHelp && showIcon
      ? 'justify-between gap-4' // all 3 present
      : showIcon
        ? 'justify-start gap-20' // only icon + title
        : 'justify-start' // just title (or title + help)
  );

  const handleShare = async () => {
    const shareData = {
      title: title || 'Loyalty',
      text: ``,
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

  return (
    <div className='flex justify-between items-center md:justify-start mb-2 md:mb-0 '>
      {icon && (
        <Button
          type='button'
          onClick={onIconClick}
          className='md:hidden bg-transparent shadow-none p-0 h-6 w-6 z-1'
        >
          {icon}
        </Button>
      )}

      <h1 className={`text-2xl font-dm-serif font-normal ${titleClassName}`}>
        {title}
      </h1>

      {showHelp && (
        <button onClick={onclick} className='p-1 cursor-pointer '>
          {showicon}
        </button>
      )}
      {isShare && (
        <button
          className={`flex items-center justify-center backdrop-blur-md  p-2 dark:bg-white/80 dark:border-[var(--color-primary-400)]`}
          onClick={handleShare}
          aria-label='Share this'
          title='Share this'
        >
          <Upload className={`w-5 h-5  text-foreground`} />
        </button>
      )}
    </div>
  );
};

export default HeaderWithIcon;
