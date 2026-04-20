import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { memo, useCallback, startTransition } from 'react';
import { DateRange } from 'react-day-picker';
import CitySearch from '../../CitySelector';
import { DateRangePicker } from '../../DateRangePicker';
import GuestFields from '../../GuestSelector/GuestFields';

const MobileSearchPanel = memo(
  ({
    openDrawer,
    setOpenDrawer,
    selectedLocation,
    setSelectedLocation,
    cityOptions,
    date,
    handleDateChange,
    isCalendarOpen,
    setIsCalendarOpen,
    guestsData,
    updateGuestData,
    pageType,
    handleSearch,
    originalCityName,
    checkinDate,
    checkoutDate,
    isPrive,
    autoOpenCitySelector,
    onCalendarDismiss,
  }: {
    openDrawer: boolean;
    setOpenDrawer: any;
    selectedLocation: string;
    setSelectedLocation: (location: string) => void;
    cityOptions: any[];
    date: DateRange;
    handleDateChange: (date: DateRange) => void;
    isCalendarOpen: boolean;
    setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    guestsData: any;
    updateGuestData: (data: any, reset?: boolean) => void;
    pageType: string;
    handleSearch: () => void;
    originalCityName: string;
    checkinDate: string;
    checkoutDate: string;
    isPrive?: boolean;
    autoOpenCitySelector?: boolean;
    onCalendarDismiss?: () => void;
  }) => {
    const handleBackClick = useCallback(() => {
      onCalendarDismiss?.();
    }, [onCalendarDismiss]);

    const handleClearDates = useCallback(() => {
      onCalendarDismiss?.();
      handleDateChange({ from: undefined, to: undefined });
    }, [onCalendarDismiss, handleDateChange]);

    const setCalendarOpenWithTransition = useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        startTransition(() => setIsCalendarOpen(value));
      },
      [setIsCalendarOpen]
    );

    const handleDateRowClick = useCallback(() => {
      requestAnimationFrame(() => {
        startTransition(() => setIsCalendarOpen((prev) => !prev));
      });
    }, [setIsCalendarOpen]);

    return (
      <Sheet
        open={openDrawer}
        onOpenChange={(open) => startTransition(() => setOpenDrawer(open))}
      >
        <SheetContent
          className={cn(
            'h-[100dvh] w-[100vw] [&>button]:hidden',
            isPrive ? 'bg-[var(--prive4)] text-white border-none' : ''
          )}
          side='bottom'
        >
          <SheetHeader className={cn('mb-2 p-0', isPrive ? 'text-white' : '')}>
            <SheetTitle
              className={cn(
                'relative flex justify-center border-b py-4 h-15 font-serif',
                isPrive
                  ? 'border-[#333234] text-white bg-[var(--prive4)]'
                  : 'border-primary-100 text-primary-950'
              )}
            >
              <ArrowLeft
                className={cn(
                  'absolute left-[20px]',
                  isPrive ? 'text-white' : ''
                )}
                onClick={() => startTransition(() => setOpenDrawer(false))}
              />
              Search Villas
            </SheetTitle>
          </SheetHeader>

          <div
            className={cn(
              'px-4 flex flex-col gap-4 mb-20',
              isPrive ? 'text-white' : ''
            )}
          >
            <div
              className={cn(
                'border rounded-xl bg-card min-h-[54px] flex items-center',
                isPrive
                  ? 'border-[var(--prive6)] !bg-[var(--prive5)]/10'
                  : 'border-primary-100 dark:border-[var(--dawnpink)]'
              )}
            >
              <CitySearch
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                pageType={pageType}
                cityOptions={cityOptions}
                onPropertySelect={() => setOpenDrawer(false)}
                autoOpen={autoOpenCitySelector}
              >
                <div className='w-full p-3 flex flex-col items-start gap-1'>
                  <p
                    className={cn(
                      'text-xs',
                      isPrive
                        ? 'text-[var(--prive6)]'
                        : 'text-primary-800 dark:text-[var(--dawnpink)] '
                    )}
                  >
                    City / Villa / Location
                  </p>
                  {selectedLocation && (
                    <span
                      className={cn(
                        'typography-label-semibold',
                        isPrive ? 'text-white' : 'text-primary-950'
                      )}
                    >
                      {originalCityName}
                    </span>
                  )}
                </div>
              </CitySearch>
            </div>

            <div
              className={cn(
                'border rounded-xl min-h-[54px]',
                isPrive
                  ? 'border-[var(--prive6)] !bg-[var(--prive5)]/10'
                  : 'border-primary-100 bg-card'
              )}
            >
              <DateRangePicker
                date={date}
                handleDateChange={handleDateChange}
                isCalendarOpen={!!isCalendarOpen}
                setIsCalendarOpen={setCalendarOpenWithTransition}
                handleClearDates={handleClearDates}
                handleBackClick={handleBackClick}
                handleSelectGuestsClick={handleDateRowClick}
                isPopover={false}
                placement='filterbar'
              >
                <div
                  className='flex items-center justify-between p-4'
                  onClick={handleDateRowClick}
                >
                  <div className='flex flex-col'>
                    <span
                      className={cn(
                        'text-xs',
                        isPrive ? 'text-[var(--prive6)]' : 'text-primary-800'
                      )}
                    >
                      Check-In
                    </span>
                    {checkinDate && (
                      <span
                        className={cn(
                          'typography-label-semibold',
                          isPrive ? 'text-white' : 'text-primary-950'
                        )}
                      >
                        {checkinDate}
                      </span>
                    )}
                  </div>
                  <ArrowRight
                    className={cn(
                      'w-5 h-5',
                      isPrive ? 'text-[var(--prive6)]' : 'text-primary-200'
                    )}
                  />
                  <div className='flex flex-col'>
                    <span
                      className={cn(
                        'text-xs',
                        isPrive ? 'text-[var(--prive6)]' : 'text-primary-800'
                      )}
                    >
                      Check-Out
                    </span>
                    {checkoutDate && (
                      <span
                        className={cn(
                          'typography-label-semibold',
                          isPrive ? 'text-white' : 'text-primary-950'
                        )}
                      >
                        {checkoutDate}
                      </span>
                    )}
                  </div>
                </div>
              </DateRangePicker>
            </div>

            <div className='space-y-2'>
              <label
                className={cn(
                  'typography-label-regular',
                  isPrive ? 'text-white' : 'text-primary-800'
                )}
              >
                GUESTS
              </label>
              <div>
                <GuestFields
                  onChange={(data) => updateGuestData(data, false)}
                  isPrive={isPrive}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              'fixed bottom-0 left-0 right-0 p-4 border-t flex justify-between gap-3',
              isPrive ? 'bg-[var(--prive4)] border-[var(--prive5)]' : 'bg-white'
            )}
          >
            <Button
              className={cn(
                'flex-1 p-6 rounded-full',
                isPrive
                  ? 'bg-[var(--prive5)] text-white hover:bg-[var(--prive5)]/90'
                  : 'bg-accent-red-900 hover:bg-accent-red-950'
              )}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

export default MobileSearchPanel;
