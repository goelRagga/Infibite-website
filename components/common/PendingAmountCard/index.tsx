import React, { useRef } from 'react';
import { PendingAmountCardProps } from 'pending-payment';
import { Button } from '@/components/ui';
import { usePayRemainingAmount } from '@/lib/payRemaning';

const PendingAmountCard: React.FC<PendingAmountCardProps> = ({
  outstandingAmount,
  id,
  className,
}) => {
  const { payRemaining } = usePayRemainingAmount();
  return (
    <div
      className={`${className} rounded-2xl border border-accent-red-100 overflow-hidden relative z-10 p-4 dark:bg-[#361c1a]! dark:border-[var(--red1)]`}
      style={{ backgroundColor: 'var(--pink1)' }}
    >
      <div className=''>
        <div className='flex items-center justify-between'>
          <h6 className='text-sm text-accent-red-900 dark:text-white'>
            Pending Amount:{' '}
            <span className='font-semibold'>
              ₹ {outstandingAmount?.toLocaleString() || ''}
            </span>{' '}
          </h6>
          <div className='relative'>
            <span className='absolute inline-flex h-full w-15 left-3 animate-ping rounded-full bg-[var(--red1)] opacity-20'></span>
            <Button
              onClick={() => {
                payRemaining(id || '');
              }}
              className='bg-accent-red-900 relative hover:bg-accent-red-950 font-semibold text-xs rounded-lg cursor-pointer dark:bg-[var(--red1)] dark:hover:bg-[var(--red2)] dark:text-white'
            >
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingAmountCard;
