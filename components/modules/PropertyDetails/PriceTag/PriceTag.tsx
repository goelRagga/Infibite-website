import React from 'react';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import useIsMobile from '@/hooks/useIsMobile';
import { useFilters } from '@/hooks/filters';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';

interface PriceTagProps {
  propertyInfo: Record<string, any>;
  className?: string;
  loading?: boolean;
  amountDetails?: any;
  checkIn?: string | undefined;
  checkOut?: string | undefined;
  onDateClick?: () => void;
}

const PriceTag: React.FC<PriceTagProps> = ({
  propertyInfo,
  className,
  loading = false,
  amountDetails,
  onDateClick,
}) => {
  const isMobile = useIsMobile();
  const { filters } = useFilters();
  const original =
    Number(amountDetails?.originalNetPerNightAmountBeforeTax) || 0;
  const discounted = Number(amountDetails?.promotionDiscountAmount) || 0;
  const priceAmount = Number(
    filters.checkinDate &&
      filters.checkoutDate &&
      amountDetails?.netPerNightAmountBeforeTax > 0
      ? amountDetails?.netPerNightAmountBeforeTax
      : propertyInfo?.priceAmount
  );

  const showDiscount =
    original > 0 &&
    discounted > 0 &&
    filters.checkinDate &&
    filters.checkoutDate;

  const showPrice = priceAmount > 0;

  // if (loading) {
  //   return (
  //     <div className={clsx('flex flex-col', className)}>
  //       <div className='flex items-baseline gap-2'>
  //         <Skeleton className='h-8 w-34' />
  //       </div>
  //       <Skeleton className='h-3 w-28 mt-2' />
  //     </div>
  //   );
  // }
  const checkin = filters.checkinDate;
  const checkout = filters.checkoutDate;

  if (!showDiscount && !showPrice) return null;

  return (
    <div className={clsx('flex flex-col', className)}>
      {showDiscount ? (
        <div
          className={clsx(
            'flex flex-col sm:flex-row sm:items-baseline sm:gap-1',
            loading && 'opacity-50'
          )}
        >
          <span className='line-through text-accent-red-700 font-medium text-sm sm:text-base sm:mr-2 dark:text-red'>
            ₹{formatPrice(original)}
          </span>

          <div className='flex items-baseline gap-1 flex-wrap'>
            <span className='text-xl sm:text-2xl font-semibold text-primary-950 dark:text-white'>
              ₹{formatPrice(priceAmount)}
            </span>
            <span className='text-xs sm:text-sm text-neutral-600 dark:text-white'>
              /night
            </span>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'flex items-baseline gap-1 flex-wrap',
            loading && 'opacity-50'
          )}
        >
          <span className='text-xl sm:text-2xl font-bold text-primary-950 dark:text-white'>
            ₹{formatPrice(priceAmount)}
          </span>
          <span className='text-xs sm:text-sm text-neutral-600 dark:text-white'>
            /night
          </span>
        </div>
      )}

      {isMobile && (
        <span
          onClick={onDateClick}
          className={clsx(
            'text-xs font-semibold text-accent-red-900 mt-0 dark:text-[var(--accent-text)] flex items-center',
            onDateClick && 'cursor-pointer'
          )}
        >
          {checkin && checkout
            ? `${format(checkin, 'dd MMM')} - ${format(checkout, 'dd MMM')}`
            : 'Any dates'}
          {checkin && checkout && <Pencil className='w-4 h-4 ml-1 scale-90' />}
        </span>
      )}

      {!isMobile && showDiscount && (
        <p className='text-xs sm:text-xs text-neutral-500 mt-1 dark:text-white'>
          Exclusive of taxes
        </p>
      )}
    </div>
  );
};

export default PriceTag;
