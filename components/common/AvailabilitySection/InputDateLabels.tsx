// components/ui/DateBlock.tsx
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

type DateBlockProps = {
  label: string;
  value?: string | any;
  subValue?: string;
  isBooking: boolean;
  isMobile: boolean;
  showIcon?: boolean;
  side?: 'left' | 'right';
};

export function InputDateLabels({
  label,
  value,
  subValue,
  isBooking,
  isMobile,
  showIcon = false,
  side = 'left',
}: DateBlockProps) {
  const textSize = isBooking ? (isMobile ? 'text-sm' : 'text-md') : 'text-sm';
  const labelTextSize = isBooking
    ? isMobile
      ? 'text-sm'
      : 'text-sm text-accent-red-900 dark:text-[var(--prive2)]'
    : 'text-sm';
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        isBooking
          ? isMobile
            ? 'w-[60%] px-4 py-2'
            : 'w-[30%] p-6'
          : `p-4 w-[50%] ${side === 'left' ? 'border-r border-r-gray-200 dark:border-primary-800' : ''}`
      )}
    >
      <div className='flex flex-col text-left'>
        <span
          className={cn(
            'text-primary-400 dark:text-[var(--prive2)]',
            labelTextSize
          )}
        >
          {label}
        </span>
        {value && (
          <span
            className={cn(
              'text-text-primary-950 font-semibold text-md',
              textSize
            )}
          >
            {value}
          </span>
        )}
        {subValue && (
          <span
            className={cn(
              'text-muted-foreground dark:text-primary-400',
              isMobile ? 'text-xs' : 'text-sm'
            )}
          >
            {subValue}
          </span>
        )}
      </div>
      {showIcon && (
        <CalendarDays className='w-4 h-4 mr-2 text-accent-red-900 dark:text-accent-yellow-950' />
      )}
    </div>
  );
}
