'use client';

import { CalendarDaysIcon, X } from 'lucide-react';
import { memo, useCallback } from 'react';

interface DatePersuationProps {
  position: { left: number; top: number } | null;
  onDismiss: () => void;
  onClick: () => void;
  className?: string;
  arrowPosition?: 'top' | 'bottom';
  arrowHorizontalAlign?: 'left' | 'center' | 'right';
}

const DatePersuation = memo(
  ({
    position,
    onDismiss,
    onClick,
    className,
    arrowPosition = 'top',
    arrowHorizontalAlign = 'right',
  }: DatePersuationProps) => {
    const handleDismissClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDismiss();
      },
      [onDismiss]
    );

    const handleContainerClick = useCallback(() => {
      onClick();
    }, [onClick]);

    if (!position) return null;

    const getArrowHorizontalClass = () => {
      switch (arrowHorizontalAlign) {
        case 'left':
          return 'left-[60px]';
        case 'center':
          return 'left-1/2 -translate-x-1/2';
        case 'right':
        default:
          return 'right-[60px]';
      }
    };

    const arrowClass = getArrowHorizontalClass();

    return (
      <div
        className={`fixed z-50 pointer-events-auto ${className || ''}`}
        style={{
          transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
      >
        <div className='relative bg-[var(--black1)] dark:bg-primary-900 text-white rounded-full! px-2 py-2 sm:px-2 sm:py-2 shadow-lg flex gap-1 min-w-[240px] max-w-[240px]'>
          <div
            className='flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer'
            onClick={handleContainerClick}
          >
            <div className='w-8 h-8 rounded-full bg-[#F6F6F766] flex items-center justify-center flex-shrink-0'>
              <CalendarDaysIcon className='w-4 h-4 text-white' />
            </div>
            <span className='text-xs font-semibold text-white text-left!'>
              Select dates to unlock best price
            </span>
          </div>
          <button
            onClick={handleDismissClick}
            className='flex-shrink-0 hover:bg-white/10 rounded-full p-1 transition-colors'
            aria-label='Close tooltip'
          >
            <X className='w-4 h-4 text-white' />
          </button>

          {arrowPosition === 'top' ? (
            <div
              className={`absolute -top-2 ${arrowClass} w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#1b0107] dark:border-b-[var(--primary-900)]`}
            />
          ) : (
            <div
              className={`absolute -bottom-2 ${arrowClass} w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1b0107] dark:border-t-[var(--primary-900)]`}
            />
          )}
        </div>
      </div>
    );
  }
);

DatePersuation.displayName = 'DatePersuation';

export default DatePersuation;
