import WarningIcon from '@/assets/warning.svg';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
// import { AlertCircle } from 'lucide-react';
import React from 'react';

interface BookingCardBannerProps {
  title: string;
  message?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  variant: BookingCardBannerVariant;
}

export type BookingCardBannerVariant = 'error' | 'success' | 'warning';

const BookingCardBanner: React.FC<BookingCardBannerProps> = ({
  title,
  message,
  cta,
  variant,
}) => {
  const config = {
    error: {
      bg: 'bg-accent-red-50',
      text1: 'text-[var(--gold1)] font-semibold',
      text2: 'text-foreground',
      icon: 'text-accent-red-950',
      btn: {
        bg: 'bg-accent-red-950 hover:bg-accent-red-950/80',
        text: 'text-white',
      },
    },
    success: {
      bg: 'bg-[var(--green1)]',
      text1: 'text-[var(--gold1)] font-semibold',
      text2: 'text-foreground',
      icon: 'text-accent-green-700',
      btn: {
        bg: 'bg-accent-green-950 hover:bg-accent-green-950/80',
        text: 'text-white',
      },
    },
    warning: {
      bg: 'bg-[var(--accent-yellow-50)]',
      text1: 'text-[var(--gold1)] font-semibold',
      text2: 'text-foreground',
      icon: 'text-accent-yellow-500',
      btn: {
        bg: 'bg-accent-yellow-900 hover:bg-accent-yellow-900/80',
        text: 'text-white',
      },
    },
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 md:gap-6 p-4 md:px-6 rounded-t-2xl',
        config?.[variant].bg
      )}
    >
      <WarningIcon className={cn('w-6 h-6 ', config?.[variant].icon)} />
      <div className='flex flex-row justify-between items-center w-full'>
        <div>
          <div className={cn('font-medium text-xs', config?.[variant].text1)}>
            {title}
          </div>
          <div className={cn('text-xs', config?.[variant].text2)}>
            {message}
          </div>
        </div>
        {cta && (
          <Button
            onClick={cta.onClick}
            className={cn(config?.[variant].btn.bg, config?.[variant].btn.text)}
          >
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCardBanner;
