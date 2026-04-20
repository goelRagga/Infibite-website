'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { capitalizeInitials, cn, getCitySlugByName } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { ArrowRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFilters, useGuests } from '@/hooks/filters';
import { DateRange } from 'react-day-picker';

import { DEFAULT_SEARCH_PANEL_OFFSET, SEARCH_PARAM } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { DateRangePicker } from '../DateRangePicker';

import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { SearchPanelProps } from 'search-panel-types';
import MobileSearchPanel from './MobileSearchPanel';
import { TabContent, TabItem } from './SearchPanelTab';

const tabs = [
  { label: 'City / Villa / Location', key: 'where' },
  { label: 'Check-In', key: 'checkin' },
  { label: 'Check-Out', key: 'checkout' },
  { label: 'Guests', key: 'who' },
];

let calendarDismissedForCities: Set<string> = new Set();

export default function SearchPanel({
  pageType = 'home',
  setClose,
  storedFilterValues,
  openDrawer,
  setOpenDrawer,
  locations,
  isPrive,
  shouldScrollOnTabClick = false,
  initialActiveIndex,
  onActiveIndexChange,
}: SearchPanelProps) {
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [autoOpenCitySelector, setAutoOpenCitySelector] = useState(false);
  const prevSelectedLocationRef = useRef<string>('');

  const handleCalendarOpenChange = useCallback(
    (open: boolean | ((prev: boolean) => boolean)) => {
      startTransition(() => setIsCalendarOpen(open));
    },
    []
  );

  const handleCalendarDismiss = useCallback(() => {
    if (selectedLocation) {
      calendarDismissedForCities.add(selectedLocation);
    }
  }, [selectedLocation]);

  const { guestsData, updateGuestData, totalGuests } = useGuests();
  const { cityOptions, setCityOptions, updateMultipleFilters } = useFilters();

  // Memoized values
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const originalCityName = useMemo(() => {
    if (!selectedLocation) return '';

    const exactMatch = cityOptions.find(
      (opt) => opt.value === selectedLocation || opt.slug === selectedLocation
    );

    if (exactMatch) {
      return exactMatch.label;
    }

    let cityPart = selectedLocation;

    if (cityPart.includes('/')) {
      cityPart = cityPart.split('/')[0];
    }

    if (cityPart.startsWith('villas-in-')) {
      cityPart = cityPart.replace('villas-in-', '');
    }

    const partialMatch = cityOptions.find(
      (opt) => opt.slug === cityPart || opt.value === cityPart
    );

    if (partialMatch) {
      return partialMatch.label;
    }

    return cityPart
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [selectedLocation, cityOptions]);

  useEffect(() => {
    if (activeIndex !== null) {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab;
        setSliderStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }

    setIsCalendarOpen(activeIndex === 1 || activeIndex === 2);
  }, [activeIndex]);

  const handleDateChange = useCallback(
    (newDate: DateRange) => {
      setCheckinDate(newDate?.from ? format(newDate.from, 'dd MMM, yyyy') : '');
      setCheckoutDate(newDate?.to ? format(newDate.to, 'dd MMM, yyyy') : '');
      setDate(newDate);

      if (newDate.from && !newDate.to && activeIndex === 1) {
        setTimeout(() => setActiveIndex(2), 0);
      }

      if (newDate.from && newDate.to && !isTablet) {
        setIsCalendarOpen(false);
        if (totalGuests <= 1 && guestsData.numberOfChildren === 0) {
          setTimeout(() => {
            setActiveIndex(3);
          }, 200);
        } else {
          setActiveIndex(null);
        }
      }
    },
    [activeIndex, isMobile, totalGuests, guestsData.numberOfChildren]
  );

  const handleSearch = useCallback(() => {
    // Check if search parameters changed
    const storedCheckin = storedFilterValues?.checkinDate
      ? format(new Date(storedFilterValues.checkinDate), 'yyyy-MM-dd')
      : null;
    const storedCheckout = storedFilterValues?.checkoutDate
      ? format(new Date(storedFilterValues.checkoutDate), 'yyyy-MM-dd')
      : null;
    const newCheckin = date.from ? format(date.from, 'yyyy-MM-dd') : null;
    const newCheckout = date.to ? format(date.to, 'yyyy-MM-dd') : null;
    const storedAdults = storedFilterValues?.adults ?? 1;
    const storedChildren = storedFilterValues?.children ?? 0;
    const storedCity = storedFilterValues?.city || null;
    const currentAdults = guestsData?.numberOfGuests ?? 1;
    const currentChildren = guestsData?.numberOfChildren ?? 0;

    const didSearchChange =
      storedCheckin !== newCheckin ||
      storedCheckout !== newCheckout ||
      storedAdults !== currentAdults ||
      storedChildren !== currentChildren ||
      storedCity !== originalCityName;

    // Track edit_dates_applied for listing page
    if (pageType === 'listing') {
      const isGuestCountChanged =
        currentAdults !== storedAdults || currentChildren !== storedChildren;

      trackEvent('edit_dates_applied', {
        is_city_selected: !!selectedLocation,
        is_date_selected: !!(date.from && date.to),
        is_number_of_guest_selected: isGuestCountChanged,
        did_search_change:
          !!selectedLocation ||
          !!(date.from && date.to) ||
          !!isGuestCountChanged
            ? true
            : false,
        page_name: 'property_listing',
      });
    }

    const currentParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;

    if (date.from) {
      currentParams.set('checkin', format(date.from, 'yyyy-MM-dd'));
    } else {
      currentParams.delete('checkin');
    }

    if (date.to) {
      currentParams.set('checkout', format(date.to, 'yyyy-MM-dd'));
    } else {
      currentParams.delete('checkout');
    }

    if (guestsData.numberOfGuests) {
      currentParams.set('adults', guestsData.numberOfGuests.toString());
    } else {
      currentParams.delete('adults');
    }

    if (guestsData.numberOfChildren) {
      currentParams.set('children', guestsData.numberOfChildren.toString());
    } else {
      currentParams.delete('children');
    }

    if (guestsData.numberOfPets) {
      currentParams.set('pets', guestsData.numberOfPets.toString());
    } else {
      currentParams.delete('pets');
    }

    if (isPrive) {
      currentParams.set(SEARCH_PARAM.FILTERS.IS_PRIVE, 'PRIVE');
    } else {
      currentParams.delete(SEARCH_PARAM.FILTERS.IS_PRIVE);
    }

    let urlPath = '/villas';
    if (selectedLocation) {
      const cleanCitySlug = selectedLocation;
      urlPath = `/villas/villas-in-${cleanCitySlug}`;
    }
    trackEvent('search_villas_applied', {
      city: originalCityName,
      is_city_null: originalCityName ? false : true,
      is_checkin_out_null: date.from && date.to ? false : true,
      type: isPrive ? 'Prive search' : 'Elivaas search',
      checkIn: date.from ? format(date.from, 'dd MMM, yyyy') : '',
      checkOut: date.to ? format(date.to, 'dd MMM, yyyy') : '',
      adults: guestsData?.numberOfGuests,
      children: guestsData?.numberOfChildren,
      page_name: pageType == 'home' ? 'homepage' : 'property_listing',
    });

    router.push(`${urlPath}?${currentParams.toString()}`);

    if (setClose && pathname != '/') {
      setTimeout(() => {
        setClose(false);
      }, 200);
    }

    setActiveIndex(null);
  }, [
    date,
    guestsData,
    selectedLocation,
    router,
    setClose,
    isPrive,
    pageType,
    storedFilterValues,
    originalCityName,
  ]);

  useEffect(() => {
    if (!locations?.length || cityOptions.length > 0) return;

    const locationData = locations.map((location: any) => ({
      value: location.slug,
      label: capitalizeInitials(location.name),
      type: location.locationType,
      slug: location.slug,
    }));

    setCityOptions((prevOptions) => {
      const mergedOptions = [...prevOptions];
      locationData.forEach((newLocation: any) => {
        if (!mergedOptions.find((opt) => opt.slug === newLocation.slug)) {
          mergedOptions.push(newLocation);
        }
      });
      return mergedOptions;
    });
  }, [locations, cityOptions.length, setCityOptions]);

  useEffect(() => {
    if (pageType !== 'listing') {
      updateMultipleFilters({
        city: null,
        checkinDate: null,
        checkoutDate: null,
      });
      updateGuestData({
        numberOfGuests: 1,
        numberOfChildren: 0,
        max_adults: 100,
        max_children: 100,
        max_occupancy: 100,
        standard_guests: 20,
      });
      return;
    }

    const parsedCheckinDate = storedFilterValues?.checkinDate
      ? format(
          parse(storedFilterValues?.checkinDate, 'yyyy-MM-dd', new Date()),
          'dd MMM yyyy'
        )
      : '';

    const parsedCheckOutDate = storedFilterValues?.checkoutDate
      ? format(
          parse(storedFilterValues?.checkoutDate, 'yyyy-MM-dd', new Date()),
          'dd MMM yyyy'
        )
      : '';

    setCheckinDate(parsedCheckinDate || '');
    setCheckoutDate(parsedCheckOutDate || '');

    if (parsedCheckOutDate && parsedCheckinDate) {
      setDate({
        from: parse(
          storedFilterValues?.checkinDate || '',
          'yyyy-MM-dd',
          new Date()
        ),
        to: parse(
          storedFilterValues?.checkoutDate || '',
          'yyyy-MM-dd',
          new Date()
        ),
      });
    }
  }, [pageType]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));

    if (
      shouldScrollOnTabClick &&
      typeof window !== 'undefined' &&
      window?.scrollY < DEFAULT_SEARCH_PANEL_OFFSET
    ) {
      window?.scrollBy({
        top: DEFAULT_SEARCH_PANEL_OFFSET - window?.scrollY + 10,
        behavior: 'smooth',
      });
    }
    trackEvent('search_bar_clicked', {
      page_name: pageType === 'home' ? 'homepage' : 'property_listing',
      vertical_position: 0,
    });
  }, []);

  useEffect(() => {
    if (locations && locations.length > 0) {
      const citySlug = locations
        ? getCitySlugByName(storedFilterValues?.city, locations)
        : null;

      setSelectedLocation(citySlug || '');
    }
  }, [locations]);

  useEffect(() => {
    if (isMobile && openDrawer && !selectedLocation && cityOptions.length > 0) {
      setAutoOpenCitySelector(true);
    } else {
      setAutoOpenCitySelector(false);
    }
  }, [isMobile, openDrawer, selectedLocation, cityOptions.length]);

  useEffect(() => {
    if (
      initialActiveIndex !== null &&
      initialActiveIndex !== undefined &&
      !isMobile
    ) {
      setTimeout(() => {
        setActiveIndex(initialActiveIndex);
      }, 0);
      if (onActiveIndexChange) {
        onActiveIndexChange();
      }
    }
  }, [initialActiveIndex, onActiveIndexChange]);

  useEffect(() => {
    if (selectedLocation) {
      setAutoOpenCitySelector(false);

      const hasBeenDismissed = calendarDismissedForCities.has(selectedLocation);

      if (
        openDrawer &&
        (isMobile || isTablet) &&
        (!date.from || !date.to) &&
        !hasBeenDismissed
      ) {
        calendarDismissedForCities.add(selectedLocation);
        setTimeout(() => {
          setIsCalendarOpen(true);
        }, 0);
      }

      prevSelectedLocationRef.current = selectedLocation;
    } else {
      prevSelectedLocationRef.current = '';
    }
  }, [selectedLocation, openDrawer, isMobile, isTablet, date.from, date.to]);

  if (isTablet) {
    return (
      <MobileSearchPanel
        openDrawer={openDrawer || false}
        setOpenDrawer={setOpenDrawer}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        cityOptions={cityOptions}
        date={date}
        handleDateChange={handleDateChange}
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={handleCalendarOpenChange}
        guestsData={guestsData}
        updateGuestData={updateGuestData}
        pageType={pageType}
        handleSearch={handleSearch}
        originalCityName={originalCityName}
        checkinDate={checkinDate}
        checkoutDate={checkoutDate}
        isPrive={isPrive}
        autoOpenCitySelector={autoOpenCitySelector}
        onCalendarDismiss={handleCalendarDismiss}
      />
    );
  }

  return (
    <div ref={wrapperRef} className='relative w-full max-w-5xl mx-auto z-10'>
      <div
        className={cn(
          'w-full p-1 flex items-center shadow-lg mx-auto relative',
          pageType === 'home'
            ? 'bg-white/30 backdrop-blur-md border border-secondary-500 rounded-3xl h-[68px]'
            : 'relative flex items-center bg-primary-50 rounded-full px-2 py-2 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(0,0,0,0.03)]'
        )}
      >
        {activeIndex !== null && (
          <div
            className={cn(
              'absolute top-[8px] -ml-2 left-0 h-[calc(100%-16px)] bg-white dark:bg-[var(--prive5)] rounded-full shadow-md transition-all duration-300 ease-in-out',
              pageType === 'home' ? 'rounded-xl bg-primary-50 shadow' : ''
            )}
            style={sliderStyle}
          />
        )}

        <div className='flex flex-1 items-center mx-4'>
          {tabs.map((tab, index) => {
            const isActive = activeIndex === index;
            const tabValue =
              tab.key === 'where'
                ? originalCityName || 'Select destination'
                : tab.key === 'checkin'
                  ? checkinDate || 'Add Date'
                  : tab.key === 'checkout'
                    ? checkoutDate || 'Add Date'
                    : totalGuests
                      ? `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`
                      : 'Add Guests';

            if (index === 0 || index === 3) {
              return (
                <Popover
                  key={tab.key}
                  open={activeIndex === index}
                  onOpenChange={(open) => !open && setActiveIndex(null)}
                >
                  <PopoverTrigger asChild>
                    <TabItem
                      label={tab.label}
                      tabValue={tabValue}
                      isActive={isActive}
                      onClick={() => handleTabClick(index)}
                      pageType={pageType}
                      ref={(el: any) => (tabRefs.current[index] = el)}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className={cn(
                      'w-fit max-w-lg max-h-[60dvh] overflow-y-auto dark:bg-background dark:border-none',
                      pageType === 'home' ? 'rounded-[30px]' : 'rounded-3xl',
                      index === 0 ? 'min-w-[480px]' : 'min-w-[380px]'
                    )}
                    align='start'
                    sideOffset={12}
                  >
                    <TabContent
                      index={index}
                      selectedLocation={selectedLocation}
                      setSelectedLocation={setSelectedLocation}
                      cityOptions={cityOptions}
                      date={date}
                      handleDateChange={handleDateChange}
                      isCalendarOpen={!!isCalendarOpen}
                      setIsCalendarOpen={handleCalendarOpenChange}
                      guestsData={guestsData}
                      updateGuestData={updateGuestData}
                      totalGuests={totalGuests}
                      pageType={pageType}
                      setActiveIndex={setActiveIndex}
                      isPrive={isPrive}
                    />
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <div
                key={tab.key}
                className={cn('flex-1 flex items-center min-w-0 relative')}
                ref={(el: any) => (tabRefs.current[index] = el)}
              >
                {index < tabs.length - 1 && tab.key === 'checkin' && (
                  <div className='w-px h-6 bg-gray-300 mx-2' />
                )}

                <TabItem
                  label={tab.label}
                  tabValue={tabValue}
                  isActive={isActive}
                  onClick={() => handleTabClick(index)}
                  pageType={pageType}
                  ref={(el: any) => (tabRefs.current[index] = el)}
                />

                {index < tabs.length - 1 &&
                  (tab.key === 'checkin' ? (
                    <span className='mx-2 text-[var(--color-disabled)] text-xl'>
                      <ArrowRight />
                    </span>
                  ) : (
                    <div className='w-px h-6 bg-gray-300 mx-2' />
                  ))}
              </div>
            );
          })}
        </div>

        <div className='ml-auto pr-1'>
          <Button
            onClick={handleSearch}
            size={'lg'}
            className={cn(
              'flex cursor-pointer items-center justify-center text-white rounded-full',
              isPrive
                ? 'bg-[var(--prive5)] hover:bg-[var(--prive5)]/90'
                : 'bg-accent-red-900 hover:bg-accent-red-900/90',
              pageType === 'home' && 'rounded-2xl h-[54px] w-[54px]'
            )}
          >
            {pageType === 'home' ? (
              <ArrowRight className='scale-140' />
            ) : (
              <Search size={28} />
            )}
          </Button>
        </div>
      </div>

      {(activeIndex === 1 || activeIndex === 2) && (
        <DateRangePicker
          date={date}
          handleDateChange={handleDateChange}
          isCalendarOpen={!!isCalendarOpen}
          setIsCalendarOpen={handleCalendarOpenChange}
          handleBackClick={() => handleCalendarOpenChange(false)}
          handleClearDates={() =>
            handleDateChange({ from: undefined, to: undefined })
          }
          handleSelectGuestsClick={() =>
            handleCalendarOpenChange(!isCalendarOpen)
          }
          isPopover={true}
          placement='filterbar'
        />
      )}
    </div>
  );
}
