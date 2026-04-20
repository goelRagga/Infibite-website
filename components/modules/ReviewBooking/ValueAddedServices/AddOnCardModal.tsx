'use client';

import { Button } from '@/components/ui/button';
import ServiceCard from './ServiceCard';
import ReviewBookingTypes from '../ReviewBooking.types';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/mixpanel';

type ValueAddedProps = ReviewBookingTypes.AddOnnServices & {
  vasModalOpen: boolean;
  setVasModalOpen: (open: boolean) => void;
  selectedCounts: Record<string, number>;
  setSelectedCounts: (counts: Record<string, number>) => void;
};

export default function AddOnSelectorModal({
  valueAddedServices,
  vasModalOpen,
  setVasModalOpen,
  selectedCounts,
  setSelectedCounts,
}: ValueAddedProps) {
  const [localCounts, setLocalCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (vasModalOpen) {
      trackEvent('exclusive_add_ons_viewed', {
        page_name: 'booking_details',
        number_of_vas_shows: valueAddedServices?.length,
      });
      setLocalCounts({ ...selectedCounts });
    }
  }, [vasModalOpen]);

  const localAdd = (id: string) => {
    setLocalCounts((prev) => ({ ...prev, [id]: 1 }));
  };

  const localIncrement = (id: string) => {
    setLocalCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const localDecrement = (id: string) => {
    setLocalCounts((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleApply = () => {
    trackEvent('exclusive_add_ons_applied', {
      number_of_vas_selected: localCounts,
      page_name: 'booking_details',
    });
    setSelectedCounts(localCounts);
    setVasModalOpen(false);
  };

  return (
    <ResponsiveDialogDrawer
      open={vasModalOpen}
      setOpen={setVasModalOpen}
      title='Exclusive Add-Ons'
      contentClassName='sm:max-w-[792px]! dark:bg-[var(--black5)] dark:border-0!'
      trigger={
        <Button
          variant='outline'
          className='text-sm min-w-[100px] h-10 sm:h-12 font-semibold text-accent-red-900 border-accent-red-900 hover:bg-accent-red-950 hover:text-white rounded-full dark:bg-[var(--grey7)] dark:text-[var(--prive2)] dark:border-[var(--prive2)] dark:hover:bg-[var(--grey7)]'
          type='button'
          onClick={() => {
            trackEvent('add_vas_widget_clicked', {
              page_name: 'booking_details',
            });
            setVasModalOpen(true);
          }}
        >
          Add
        </Button>
      }
      footer={
        <div className={cn('sticky bottom-0 flex gap-3')}>
          <Button
            variant='outline'
            size='lg'
            className='flex-1 rounded-full border-primary-100 dark:bg-[var(--grey7)] dark:border-[var(--prive2)] dark:text-[var(--prive2)]'
            onClick={() => setVasModalOpen(false)}
          >
            Back
          </Button>
          <Button
            size='lg'
            className={cn(
              'flex-1 text-white rounded-full bg-accent-red-900 hover:bg-accent-red-950 dark:bg-[var(--prive5)]'
            )}
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      }
    >
      <div className='space-y-6 sm:max-h-[70vh] sm:overflow-y-auto scrollbar-hide'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {valueAddedServices.map((item) => (
            <ServiceCard
              key={item.id}
              id={item.id}
              image={item.image}
              name={item.name}
              description={item.description}
              basePrice={item.basePrice}
              count={localCounts[item.id] ?? 0}
              onAdd={localAdd}
              onIncrement={localIncrement}
              onDecrement={localDecrement}
              applicableAdults={item.applicableAdults}
            />
          ))}
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
}
