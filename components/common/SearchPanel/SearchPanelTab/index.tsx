'use client';

import { cn } from '@/lib/utils';
import React, { memo, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { TabItemProps } from 'search-panel-types';
import { DateRangePicker } from '../../DateRangePicker';
import GuestFields from '../../GuestSelector/GuestFields';
import VillaLocationSelector from '../VillaLocationSelector';

export const TabItem = React.forwardRef<HTMLDivElement, TabItemProps>(
  ({ label, tabValue, isActive, onClick, pageType }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex-1 flex items-center min-w-0 cursor-pointer px-3 py-2 relative',
          isActive
            ? 'text-black dark:text-white'
            : pageType === 'home'
              ? 'text-white'
              : 'text-[#5e3c3c]'
        )}
      >
        <div className='flex flex-col w-full text-left'>
          <span className='text-xs truncate'>{label}</span>
          <span
            className={cn(
              'text-sm font-semibold mt-1 truncate',
              pageType === 'home' ? 'text-primary-50' : 'text-[#2C1F1E]',
              isActive ? 'text-[#2C1F1E] dark:text-white' : ''
            )}
          >
            {tabValue}
          </span>
        </div>
      </div>
    );
  }
);

TabItem.displayName = 'TabItem';

// Memoized tab content component
export const TabContent = memo(
  ({
    index,
    setSelectedLocation,
    cityOptions,
    date,
    handleDateChange,
    isCalendarOpen,
    setIsCalendarOpen,
    updateGuestData,
    setActiveIndex,
  }: {
    index: number;
    selectedLocation: string;
    setSelectedLocation: (location: string) => void;
    cityOptions: any[];
    date: DateRange;
    handleDateChange: (date: DateRange) => void;
    isCalendarOpen: boolean;
    setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    guestsData: any;
    updateGuestData: (data: any, reset?: boolean) => void;
    totalGuests: number;
    pageType: string;
    setActiveIndex: (index: number | null) => void;
    isPrive?: boolean;
  }) => {
    const handleCitySelect = useCallback(
      (city: any) => {
        setSelectedLocation(city.value);
        if (!date.from && !date.to) {
          setTimeout(() => {
            setActiveIndex(1);
          }, 200);
        } else {
          setActiveIndex(null);
        }
      },
      [setSelectedLocation, setActiveIndex, date.from, date.to]
    );

    const handlePropertySelect = useCallback(
      (property: any) => {
        setActiveIndex(null);
      },
      [setActiveIndex]
    );

    if (index === 0) {
      return (
        <div>
          <VillaLocationSelector
            cityOptions={cityOptions}
            onCitySelect={handleCitySelect}
            onPropertySelect={handlePropertySelect}
          />
        </div>
      );
    }

    if (index === 1 || index === 2) {
      return (
        <div className='h-full'>
          <h3 className='text-lg font-semibold mb-4'>Select Dates</h3>
          <div className='h-full'>
            <DateRangePicker
              date={date}
              handleDateChange={handleDateChange}
              isCalendarOpen={!!isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
              handleClearDates={() =>
                handleDateChange({ from: undefined, to: undefined })
              }
              handleSelectGuestsClick={() => setIsCalendarOpen(!isCalendarOpen)}
              isPopover={false}
              placement='filterbar'
            />
          </div>
        </div>
      );
    }

    if (index === 3) {
      return (
        <div className='h-full '>
          <GuestFields onChange={(data) => updateGuestData(data, false)} />
        </div>
      );
    }

    return null;
  }
);

TabContent.displayName = 'TabContent';

// Memoized mobile search panel
