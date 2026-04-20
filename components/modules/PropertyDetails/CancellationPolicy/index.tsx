'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils'; // shadcn utility
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { Button } from '@/components/ui';

interface PolicyCardProps {
  title?: string;
  subTitle?: string;
  note?: any;
  highlight?: string;
  color: 'yellow' | 'pink';
}

interface CancellationPolicyProps {
  isPropertyDetail?: boolean;
  policyData?: any;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  title = 'Title',
  subTitle,
  note = 'note',
  highlight,
  color,
}) => {
  const baseColor = {
    yellow: {
      border: 'border border-accent-yellow-200 dark:bg-[var(--brown7)]',
      bg: 'bg-accent-yellow-50 ',
    },
    pink: {
      border: 'border border-accent-red-200 dark:bg-[var(--brown8)]',
      bg: 'bg-accent-red-50 dark:border-accent-red-500',
    },
  }[color];

  return (
    <div
      className={cn(
        'flex-1 rounded-2xl p-4 md:p-4 text-sm md:text-base',
        baseColor.border,
        baseColor.bg
      )}
    >
      <div className='flex text-xs justify-between font-semibold'>
        <span className='mb-1 uppercase'>{title}</span>
        <span>{subTitle}</span>
      </div>

      {Array.isArray(note) ? (
        <div className='mt-1 text-xs text-foreground'>
          <ul className='space-y-2 pl-3 list-disc marker:text-accent-red-900 dark:marker:text-white'>
            {note.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='mt-1 text-xs flex justify-between text-muted-foreground dark:text-white'>
          <span>{note}</span>
          {highlight && <span>{highlight}</span>}
        </div>
      )}
    </div>
  );
};

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({
  isPropertyDetail = true,
  policyData,
}) => {
  return (
    <>
      <section className='w-full space-y-4'>
        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
          {isPropertyDetail && (
            <>
              {policyData?.messages?.length > 0 && (
                <div className='w-full md:w-1/2'>
                  <PolicyCard
                    title='Before'
                    note={policyData.messages}
                    color='yellow'
                  />
                </div>
              )}
              <div
                className={cn(
                  'w-full',
                  policyData?.messages?.length ? 'md:w-1/2' : 'md:w-1/2'
                )}
              >
                <PolicyCard
                  title='Within'
                  subTitle='No Refund'
                  note='15 days from check-in'
                  highlight='Non-Refundable'
                  color='pink'
                />
              </div>
            </>
          )}

          {!isPropertyDetail && (
            <PolicyCard
              title='CANCELLATION'
              note='This Booking is Non-Refundable'
              color='pink'
            />
          )}
        </div>

        {isPropertyDetail && (
          <p className='text-xs text-muted-foreground'>
            **Refund if applicable will be processed within 7-9 days
            <br />
            **All bookings for blackout dates like Christmas, New Year etc will
            be non refundable.
          </p>
        )}

        {/* <p className='text-sm cursor-pointer font-semibold text-accent-red-900 underline underline-offset-4'>
          View more details
        </p> */}
      </section>
    </>
  );
};
export default CancellationPolicy;
