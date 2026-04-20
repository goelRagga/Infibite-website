'use client';

import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '../DateRangePicker';
import useIsMobile from '@/hooks/useIsMobile';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';

interface DateRangeFieldProps {
  label: string;
  fromValue?: string;
  toValue?: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  error?: string;
  className?: string;
  checkInName?: string;
  checkOutName?: string;
  sideOffset?: number;
  popoverContentClassName?: string;
}

const DateRangeField: React.FC<DateRangeFieldProps> = ({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  error,
  className,
  checkInName,
  checkOutName,
  sideOffset = 0,
  popoverContentClassName,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useIsMobile();

  const dateRange: DateRange = {
    from: fromValue ? new Date(fromValue) : undefined,
    to: toValue ? new Date(toValue) : undefined,
  };

  const handleDateChange = (range: DateRange) => {
    onFromChange(range.from ? range.from.toISOString() : '');
    onToChange(range.to ? range.to.toISOString() : '');
  };

  const handleClearDates = () => {
    onFromChange('');
    onToChange('');
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd MMM, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <div className={cn('flex flex-col gap-0 w-full', className)}>
      {/* Trigger field */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border border-primary-10 rounded-2xl min-h-[54px] cursor-pointer bg-white hover:bg-accent/50 transition-colors',
          error && 'border-red-500',
          'min-w-[200px]'
        )}
        onClick={() => setIsCalendarOpen(true)}
      >
        <div className='flex flex-col'>
          <span className='text-xs text-primary-800'>{checkInName}</span>
          {fromValue ? (
            <span className='typography-label-semibold text-primary-950'>
              {formatDateForDisplay(fromValue)}
            </span>
          ) : (
            <span className='text-sm text-muted-foreground'>Select date</span>
          )}
        </div>

        <ArrowRight className='w-5 h-5 text-primary-200' />

        <div className='flex flex-col'>
          <span className='text-xs text-primary-800'>{checkOutName}</span>
          {toValue ? (
            <span className='typography-label-semibold text-primary-950'>
              {formatDateForDisplay(toValue)}
            </span>
          ) : (
            <span className='text-sm text-muted-foreground'>Select date</span>
          )}
        </div>
      </div>

      {/* Mobile: inline */}
      {isMobile && (
        <DateRangePicker
          date={dateRange}
          handleDateChange={handleDateChange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          handleClearDates={handleClearDates}
          isPopover={false}
          placement='filterbar'
          handleSelectGuestsClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}

      {/* Desktop: modal */}
      {!isMobile && (
        <DateRangePicker
          date={dateRange}
          handleDateChange={handleDateChange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          handleClearDates={handleClearDates}
          isPopover={true}
          popoverContentClassName={popoverContentClassName}
          sideOffset={sideOffset}
          handleSelectGuestsClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}

      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
};

export default DateRangeField;
