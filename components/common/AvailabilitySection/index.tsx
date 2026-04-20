import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import { GuestsData } from '@/contexts';
import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import { useFilters } from '@/hooks/filters/useFilters';
import { useGuests } from '@/hooks/filters/useGuests';
import { useDateTooltip } from '@/hooks/useDateTooltip';
import { useDebounce } from '@/hooks/useDebounce';
import useIsLarge from '@/hooks/useIsLarge';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import { getMealPlans } from '@/lib/api/clientServices';
import { calculateNights } from '@/lib/dateUtils';
import { trackEvent } from '@/lib/mixpanel';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  ArrowRight,
  ChevronDownIcon,
  ChevronUpIcon,
  Users,
} from 'lucide-react';
import { MealPlan } from 'meal-plan';
import dynamic from 'next/dynamic';
import React, {
  startTransition,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DateRange } from 'react-day-picker';
import { useClient } from 'urql';
import { DateRangePicker } from '../DateRangePicker';
import GuestSelector from '../GuestSelector';
import MealPlanSelector from '../MealPlanSelector';
import { InputDateLabels } from './InputDateLabels';

const DatePersuation = dynamic(
  () => import('@/components/common/DatePersuation'),
  {
    ssr: false,
    loading: () => null,
  }
);
interface AvailabilitySectionProps {
  id: string | null;
  isBooking: boolean;
  propertyID: string;
  handlePopoverClose?: () => void;
  isGuestDrawer?: boolean;
  pdp?: boolean;
  soldOut?: boolean;
  autoOpenCalendar?: boolean;
  pageName?: string;
  onCloseParentDrawer?: () => void;
}

const AvailabilitySection = ({
  id,
  isBooking,
  propertyID,
  handlePopoverClose,
  isGuestDrawer = false,
  pdp = false,
  soldOut = false,
  autoOpenCalendar = false,
  pageName,
  onCloseParentDrawer,
}: AvailabilitySectionProps) => {
  const client = useClient();

  const { guestsData, updateGuestData, totalGuests } = useGuests();
  const { cityOptions, setCityOptions, updateMultipleFilters, urlParams } =
    useFilters();
  const [isCalendarOpen, setIsCalendarOpen] = useState(soldOut ? true : false);
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);
  const [calendarIconState, setCalendarIconState] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLarge = useIsLarge();
  const [isMealPlanOpen, setIsMealPlanOpen] = useState<boolean>(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isMealPlanLoading, setIsMealPlanLoading] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [localDateRange, setLocalDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const prevCouponStateRef = useRef<{
    bankOffer: string | null;
    customCoupon: string | null;
  }>({ bankOffer: null, customCoupon: null });

  const prevDateRangeRef = useRef<DateRange>({
    from: undefined,
    to: undefined,
  });
  const appSearchParams = urlParams.getAllParams();
  const shouldShowTooltip =
    (!appSearchParams.checkin || !appSearchParams.checkout) &&
    !isMobile &&
    !isTablet &&
    !isCalendarOpen;

  const {
    dateFieldRef: availabilityDateFieldRef,
    tooltipPosition: availabilityTooltipPosition,
    isTooltipVisible: isAvailabilityTooltipVisible,
    handleDismissTooltip: handleDismissAvailabilityTooltip,
    handleTooltipClick: handleAvailabilityTooltipClick,
    arrowPosition: availabilityArrowPosition,
    arrowHorizontalAlign: availabilityArrowHorizontalAlign,
  } = useDateTooltip({
    shouldShow: shouldShowTooltip,
    position: 'top',
    positionConfig: {
      verticalPosition: 'top',
      horizontalAlign: 'right',
      horizontalOffsetPercent: 10,
      spacing: 0,
      verticalOffset: 0,
      viewportPadding: 16,
    },
    onTooltipClick: () => {
      setIsCalendarOpen(true);
    },
  });

  const {
    bankOffer,
    customCoupon,
    autoApplyCoupon,
    prevBankOffer,
    prevCustomCoupon,
    setBankOffer,
    setCustomCoupon,
    appliedBankOffers,
    appliedCoupons,
    setAppliedBankOffers,
    setAppliedCoupons,
  } = useCouponContext();

  const debouncedBankOffer = useDebounce(bankOffer, 500);
  const debouncedCustomCoupon = useDebounce(customCoupon, 500);
  const debouncedAutoApplyCoupon = useDebounce(autoApplyCoupon, 500);

  const ongoingRequestRef = useRef<string | null>(null);
  const lastRequestTimeRef = useRef<number>(0);
  const REQUEST_THROTTLE_MS = 300;

  const checkinDate = useMemo(() => {
    const checkin = appSearchParams.checkin;
    return checkin ? format(checkin, 'dd MMM, yyyy') : '';
  }, [appSearchParams.checkin]);

  const urlbankOffer = useMemo(() => {
    return appSearchParams?.bankOffer ? appSearchParams?.bankOffer : null;
  }, [appSearchParams.bankOffer]);

  const urlCustomCoupon = useMemo(() => {
    return appSearchParams?.couponCode ? appSearchParams?.couponCode : null;
  }, [appSearchParams.couponCode]);

  const checkoutDate = useMemo(() => {
    const checkout = appSearchParams.checkout;
    return checkout ? format(checkout, 'dd MMM, yyyy') : '';
  }, [appSearchParams.checkout]);

  const urlDateRange = useMemo<DateRange>(() => {
    return {
      from: appSearchParams.checkin
        ? new Date(Date.parse(appSearchParams.checkin))
        : undefined,
      to: appSearchParams.checkout
        ? new Date(Date.parse(appSearchParams.checkout))
        : undefined,
    };
  }, [appSearchParams.checkin, appSearchParams.checkout]);

  const displayDateRange = useMemo<DateRange>(() => {
    if (isCalendarOpen) {
      return localDateRange;
    }
    return urlDateRange;
  }, [isCalendarOpen, localDateRange, urlDateRange]);

  const numberOfNights = useMemo(() => {
    if (!appSearchParams.checkin || !appSearchParams.checkout) return 0;
    try {
      return calculateNights(
        format(appSearchParams.checkin, 'yyyy-MM-dd'),
        format(appSearchParams.checkout, 'yyyy-MM-dd')
      );
    } catch {
      return 0;
    }
  }, [
    appSearchParams.checkin,
    appSearchParams.checkout,
    urlDateRange,
    localDateRange,
  ]);

  const hasValidDates = useMemo(() => {
    return !!(appSearchParams.checkin && appSearchParams.checkout);
  }, [appSearchParams.checkin, appSearchParams.checkout]);

  const toggleCalendar = () => {
    startTransition(() => {
      setIsCalendarOpen(!isCalendarOpen);
      setCalendarIconState(!isCalendarOpen);
    });
  };

  const toggleGuestDrawer = () => {
    if (!isGuestDrawerOpen) {
      trackEvent('guest_count_clicked', {
        page_name: pageName,
        is_guest_count_changed: guestsData ? true : false,
      });
    }
    startTransition(() => {
      setIsGuestDrawerOpen(!isGuestDrawerOpen);
    });
  };

  const handleDateChange = (newDate: DateRange) => {
    startTransition(() => {
      setLocalDateRange(newDate);
    });
  };

  const handleCalendarOpen = () => {
    startTransition(() => {
      setIsCalendarOpen(true);
      setLocalDateRange(urlDateRange);
    });
  };

  useEffect(() => {
    setLocalDateRange(urlDateRange);
    // Initialize previous date range with URL dates to avoid false triggers
    if (urlDateRange.from && urlDateRange.to) {
      prevDateRangeRef.current = {
        from: urlDateRange.from,
        to: urlDateRange.to,
      };
    }
  }, [urlDateRange]);

  // Track dates_clicked event only when both check-in and check-out dates are selected
  useEffect(() => {
    if (
      hasInitialized &&
      localDateRange.from &&
      localDateRange.to &&
      isCalendarOpen
    ) {
      const prevFrom = prevDateRangeRef.current.from;
      const prevTo = prevDateRangeRef.current.to;

      // Check if dates actually changed from previous values
      const areDatesChanged =
        !prevFrom ||
        !prevTo ||
        format(localDateRange.from, 'yyyy-MM-dd') !==
          format(prevFrom, 'yyyy-MM-dd') ||
        format(localDateRange.to, 'yyyy-MM-dd') !==
          format(prevTo, 'yyyy-MM-dd');

      trackEvent('dates_clicked', {
        page_name: pageName,
        are_dates_changed: areDatesChanged,
      });

      // Update previous date range after tracking only if dates changed
      if (areDatesChanged) {
        prevDateRangeRef.current = {
          from: localDateRange.from,
          to: localDateRange.to,
        };
      }
    }
  }, [
    localDateRange.from,
    localDateRange.to,
    isCalendarOpen,
    hasInitialized,
    pageName,
  ]);

  const handleCalendarClose = () => {
    if (!isCalendarOpen) return;

    setIsCalendarOpen(false);

    if (isMobile) {
      return;
    }

    if (hasInitialized && localDateRange.to && localDateRange.from) {
      const formattedCheckInDate = localDateRange?.from
        ? format(localDateRange.from, 'yyyy-MM-dd')
        : null;
      const formattedCheckOutDate = localDateRange?.to
        ? format(localDateRange.to, 'yyyy-MM-dd')
        : null;

      updateMultipleFilters({
        checkinDate: formattedCheckInDate,
        checkoutDate: formattedCheckOutDate,
      });
    }
  };

  const handleConfirmDates = () => {
    startTransition(() => {
      setIsCalendarOpen(false);

      if (hasInitialized && localDateRange.to && localDateRange.from) {
        const formattedCheckInDate = localDateRange?.from
          ? format(localDateRange.from, 'yyyy-MM-dd')
          : null;
        const formattedCheckOutDate = localDateRange?.to
          ? format(localDateRange.to, 'yyyy-MM-dd')
          : null;

        updateMultipleFilters({
          checkinDate: formattedCheckInDate,
          checkoutDate: formattedCheckOutDate,
        });
      }
    });
  };

  useEffect(() => {
    if (
      hasInitialized &&
      localDateRange?.to &&
      localDateRange?.from &&
      !isMobile
    ) {
      setTimeout(() => {
        handleCalendarClose();
      }, 500);
    }
  }, [hasInitialized, localDateRange]);

  const URL_CONFIG = {
    mealPlan: {
      paramName: 'mealPlan',
      defaultValue: null,
      shouldInclude: (value: string | null) => value != null,
    },
  };

  const { updateParams, getParam, removeParams } = useURLParams({
    customConfig: URL_CONFIG,
  });

  const handleMealPlanChange = (planData: any): void => {
    updateParams({
      mealPlan: planData.code,
    });
  };

  const handleGuestChange = (newData: GuestsData) => {
    updateGuestData(newData, true);
    trackEvent('guest_count_clicked', {
      page_name: pageName,
      is_guest_count_changed:
        newData.numberOfGuests !== guestsData.numberOfGuests ||
        newData.numberOfChildren !== guestsData.numberOfChildren
          ? true
          : false,
    });
  };

  const handleOpenChange = (open: boolean) => {
    startTransition(() => {
      setIsGuestSelectorOpen(open);
    });
  };

  const handleMealPlanDateRequiredClick = () => {
    startTransition(() => {
      setIsCalendarOpen(true);
    });
  };

  const handleClearDates = (shouldClearParams = true) => {
    startTransition(() => {
      setLocalDateRange({ from: undefined, to: undefined });
      if (shouldClearParams) {
        updateMultipleFilters({
          checkinDate: null,
          checkoutDate: null,
          mealPlan: null,
        });
      }
    });
  };

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (soldOut) {
      updateMultipleFilters(
        {
          checkinDate: null,
          checkoutDate: null,
        },
        true
      );
      setIsCalendarOpen(true);
      setHasInitialized(true);
    }
  }, [soldOut]);

  useEffect(() => {
    if (autoOpenCalendar && !hasValidDates && pdp && isMobile) {
      setIsCalendarOpen(true);
    }
  }, [autoOpenCalendar, hasValidDates, pdp, isMobile]);

  useEffect(() => {
    if (!checkinDate && !checkoutDate) {
      if (appliedBankOffers.length > 0 || urlbankOffer) {
        setBankOffer(null);
        setAppliedBankOffers([]);
      }

      if (appliedCoupons.length > 0 || urlCustomCoupon) {
        setCustomCoupon(null);
        setAppliedCoupons([]);
      }
    }
  }, [checkinDate, checkoutDate]);

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  const mealPlanCacheRef = useRef(new Map<string, MealPlan[]>());
  const mealPlanCache = mealPlanCacheRef.current;

  const MAX_CACHE_SIZE = 20;

  const cleanupCache = () => {
    if (mealPlanCache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(mealPlanCache.entries());
      const entriesToRemove = entries.slice(
        0,
        mealPlanCache.size - MAX_CACHE_SIZE
      );
      entriesToRemove.forEach(([key]) => mealPlanCache.delete(key));
    }
  };

  const fetchPlans = async () => {
    const shouldApplyAutoBankOffer =
      appSearchParams.checkin &&
      appSearchParams.checkout &&
      debouncedAutoApplyCoupon === 'true' &&
      !debouncedBankOffer;

    const cacheKey = `${propertyID}-${appSearchParams.checkin}-${appSearchParams.checkout}-${appSearchParams.adults}-${appSearchParams.children}-${debouncedBankOffer || 'NO_BANK_OFFER'}-${debouncedCustomCoupon || 'NO_COUPON'}-${shouldApplyAutoBankOffer}`;

    if (ongoingRequestRef.current === cacheKey) {
      return;
    }

    const now = Date.now();
    if (now - lastRequestTimeRef.current < REQUEST_THROTTLE_MS) {
      return;
    }

    if (mealPlanCache.has(cacheKey)) {
      setMealPlans(mealPlanCache.get(cacheKey)!);
      return;
    }

    ongoingRequestRef.current = cacheKey;
    lastRequestTimeRef.current = Date.now();
    setIsMealPlanLoading(true);

    try {
      const result = await getMealPlans({
        client,
        propertyId: propertyID,
        checkInDate: appSearchParams.checkin,
        checkOutDate: appSearchParams.checkout,
        adults: appSearchParams.adults,
        children: appSearchParams.children,
        couponCode: debouncedCustomCoupon ?? undefined,
        bankOfferCode: debouncedBankOffer ?? undefined,
        applyAutoBankOffer: shouldApplyAutoBankOffer,
      });

      const plans = result?.propertiesRatesV1?.list[0]?.quotes || [];
      mealPlanCache.set(cacheKey, plans);
      cleanupCache();
      setMealPlans(plans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setIsMealPlanLoading(false);
      ongoingRequestRef.current = null;
    }
  };

  const mealPlanOptions = useMemo(() => {
    if (!mealPlans || !Array.isArray(mealPlans)) return [];
    return mealPlans.map((plan: any) => ({
      id: plan.ratePlan.id,
      code: plan.ratePlan.code,
      title: plan.ratePlan.displayName,
      description: plan.ratePlan.description,
      price: plan.netPerNightAmountAfterTax,
      originalPrice: plan.netPerNightAmountBeforeTax,
      discountPercentage:
        plan.couponDiscountPercentage || plan.paymentDiscountPercentage,
      discountAmount: plan.couponDiscountAmount || plan.paymentDiscountAmount,
    }));
  }, [mealPlans]);

  const getDefaultMealPlan = () => {
    const urlMealPlan = getParam('mealPlan');
    if (urlMealPlan) {
      return mealPlanOptions.find((p) => p.code === urlMealPlan)?.id;
    }

    const epPlan = mealPlanOptions.find(
      (plan) => plan.code && plan.code.toLowerCase() === 'ep'
    );
    return epPlan ? epPlan.id : undefined;
  };

  const handleBackClick = () => {
    startTransition(() => {
      setIsCalendarOpen(false);
      if (!urlDateRange.from && !urlDateRange.to) {
        setLocalDateRange({ from: undefined, to: undefined });
        if (isMobile && pdp && onCloseParentDrawer) {
          onCloseParentDrawer();
        }
      } else {
        setLocalDateRange(urlDateRange);
      }
    });
  };

  useEffect(() => {
    const hasMealPlanInParams = !!getParam('mealPlan');
    const hasValidDatesAndGuests =
      appSearchParams.checkin &&
      appSearchParams.checkout &&
      appSearchParams.adults;

    if ((isMealPlanOpen || hasMealPlanInParams) && hasValidDatesAndGuests) {
      fetchPlans();
    }
  }, [isMealPlanOpen, appSearchParams]);

  useEffect(() => {
    const hasValidDatesAndGuests =
      appSearchParams.checkin &&
      appSearchParams.checkout &&
      appSearchParams.adults;

    if (hasValidDatesAndGuests) {
      const prevState = prevCouponStateRef.current;
      const hasCouponRemoved =
        (prevState.bankOffer && !debouncedBankOffer) ||
        (prevState.customCoupon && !debouncedCustomCoupon);

      const currentDateGuestKey = `${propertyID}-${appSearchParams.checkin}-${appSearchParams.checkout}-${appSearchParams.adults}-${appSearchParams.children}`;
      const keysToRemove = Array.from(mealPlanCache.keys()).filter((key) =>
        key.startsWith(currentDateGuestKey)
      );
      keysToRemove.forEach((key) => mealPlanCache.delete(key));

      fetchPlans();

      prevCouponStateRef.current = {
        bankOffer: debouncedBankOffer,
        customCoupon: debouncedCustomCoupon,
      };
    }
  }, [debouncedBankOffer, debouncedCustomCoupon, debouncedAutoApplyCoupon]);

  useEffect(() => {
    if (mealPlanOptions.length > 0 && !getParam('mealPlan')) {
      const epPlan = mealPlanOptions.find(
        (plan) => plan.code && plan.code.toLowerCase() === 'ep'
      );
      if (epPlan) {
        handleMealPlanChange(epPlan);
      }
    }
  }, [mealPlanOptions]);

  if (pdp && isTablet) {
    return (
      <div className='w-full space-y-6'>
        {/* Compact Date Range */}
        <DateRangePicker
          key={soldOut ? 'sold-out' : 'available'}
          date={displayDateRange}
          handleDateChange={handleDateChange}
          isCalendarOpen={isCalendarOpen}
          propertyID={propertyID}
          setIsCalendarOpen={(value) => {
            if (value) {
              handleCalendarOpen();
            } else {
              handleCalendarClose();
            }
          }}
          handleClearDates={(shouldClearParams = true) =>
            handleClearDates(shouldClearParams)
          }
          handleSelectGuestsClick={() =>
            startTransition(() => setIsCalendarOpen(!isCalendarOpen))
          }
          isPopover={false}
          placement='availability'
          handleBackClick={handleBackClick}
          onConfirm={isMobile ? handleConfirmDates : undefined}
        >
          <div
            className='bg-card rounded-xl p-4 cursor-pointer border dark:border-primary-400  dark:bg-[var(--brown2)]'
            onClick={() =>
              startTransition(() => setIsCalendarOpen(!isCalendarOpen))
            }
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <span className='text-xs text-primary-600 block'>Check-In</span>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {checkinDate || 'Select date'}
                </span>
              </div>
              <ArrowRight className='w-5 h-5 text-primary-200 dark:text-primary-800 mx-3' />
              <div className='flex-1 text-right'>
                <span className='text-xs text-primary-600 block '>
                  Check-Out
                </span>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {checkoutDate || 'Select date'}
                </span>
              </div>
            </div>
          </div>
        </DateRangePicker>

        {/* Meal Plan Selection */}
        <div className='bg-card py-1 rounded-xl border dark:border-primary-400 dark:bg-[var(--brown2)]'>
          <MealPlanSelector
            defaultValue={getDefaultMealPlan()}
            isOpen={isMealPlanOpen}
            setIsOpen={setIsMealPlanOpen}
            mealPlanOptions={mealPlanOptions}
            totalDays={numberOfNights || 1}
            onSelectionChange={handleMealPlanChange}
            title='Meals'
            hasValidDates={hasValidDates}
            onDateRequiredClick={handleMealPlanDateRequiredClick}
            isLoading={isMealPlanLoading}
          />
        </div>

        {/* Guest Selection */}
        <div>
          <p className={cn('p-1', isTablet ? 'text-xs' : 'text-sm')}>GUESTS</p>
          <GuestSelector
            guestsData={{
              ...guestsData,
              numberOfGuests: appSearchParams.adults,
              numberOfChildren: appSearchParams.children,
            }}
            onChange={handleGuestChange}
            open={isGuestSelectorOpen}
            onOpenChange={handleOpenChange}
            pageType='availability'
            showGuestBreakdown={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full flex mx-auto bg-white/20 dark:border-primary-800 dark:bg-[var(--prive-background)] ',
        isBooking
          ? 'rounded-none flex-col justify-start dark:border-primary-800'
          : 'rounded-lg flex-col border items-center dark:border-primary-800 '
      )}
    >
      <div
        className={cn(
          'w-full items-center',
          isBooking
            ? 'flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4'
            : 'flex-col gap-2'
        )}
      >
        <div
          className={cn(
            'w-full ',
            isBooking && !isTablet && 'w-2/3 md:w-full',
            !isBooking && 'border-b dark:border-primary-800'
          )}
        >
          <DateRangePicker
            key={soldOut ? 'sold-out' : 'available'}
            date={displayDateRange}
            handleDateChange={handleDateChange}
            isCalendarOpen={isCalendarOpen}
            propertyID={propertyID}
            setIsCalendarOpen={(value) => {
              if (value) {
                handleCalendarOpen();
              } else {
                handleCalendarClose();
              }
            }}
            handleClearDates={(shouldClearParams = true) =>
              handleClearDates(shouldClearParams)
            }
            handleSelectGuestsClick={() =>
              startTransition(() => setIsCalendarOpen(!isCalendarOpen))
            }
            isPopover={!isTablet}
            placement='availability'
            handleBackClick={handleBackClick}
            onConfirm={isMobile ? handleConfirmDates : undefined}
          >
            <div
              className='flex items-center justify-between cursor-pointer relative'
              onClick={() =>
                startTransition(() => setIsCalendarOpen(!isCalendarOpen))
              }
              data-calendar-trigger
            >
              <div
                ref={
                  availabilityDateFieldRef as React.RefObject<HTMLDivElement>
                }
                className='flex items-center flex-1'
              >
                <InputDateLabels
                  label='Check-In'
                  value={checkinDate}
                  subValue={
                    isBooking && displayDateRange?.from
                      ? `${format(displayDateRange.from, 'EEE')}, 2:00 PM`
                      : ''
                  }
                  isBooking={isBooking}
                  isMobile={isMobile}
                  showIcon={!isBooking}
                  side='left'
                />

                <InputDateLabels
                  label='Check-Out'
                  value={checkoutDate}
                  subValue={
                    isBooking && displayDateRange?.to
                      ? `${format(displayDateRange.to, 'EEE')}, 11:00 AM`
                      : ''
                  }
                  isBooking={isBooking}
                  isMobile={isMobile}
                  showIcon={!isBooking}
                  side='right'
                />
              </div>

              {isBooking && (
                <div>
                  {isCalendarOpen ? (
                    <ChevronUpIcon className='dark:text-[var(--prive2)]' />
                  ) : (
                    <ChevronDownIcon className='dark:text-[var(--prive2)]' />
                  )}
                </div>
              )}

              {isAvailabilityTooltipVisible && (
                <Suspense fallback={''}>
                  <DatePersuation
                    position={availabilityTooltipPosition}
                    onDismiss={handleDismissAvailabilityTooltip}
                    onClick={handleAvailabilityTooltipClick}
                    arrowPosition={availabilityArrowPosition}
                    arrowHorizontalAlign={availabilityArrowHorizontalAlign}
                  />
                </Suspense>
              )}
            </div>
          </DateRangePicker>
        </div>

        {isBooking && !isLarge && (
          <div className='h-18 w-[1px] bg-primary-100 dark:bg-secondary-950' />
        )}

        <div
          className={cn(
            'w-full mt-2 border-t sm:border-t-0',
            isBooking && !isTablet && 'w-1/3 lg:w-full xl:w-1/3',
            !isBooking && 'mb-2',
            isBooking && isTablet && 'dark:border-primary-800'
          )}
        >
          {isBooking && isTablet ? (
            <Drawer
              open={isGuestDrawerOpen}
              onOpenChange={(open) =>
                startTransition(() => setIsGuestDrawerOpen(open))
              }
            >
              <DrawerTrigger asChild>
                <div
                  className='flex items-center justify-between p-4 rounded-lg cursor-pointer'
                  onClick={toggleGuestDrawer}
                >
                  <div className='flex items-center gap-3'>
                    <Users className='w-5 h-5 text-primary-600' />
                    <div>
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        {totalGuests > 0
                          ? `${totalGuests} Guests`
                          : 'Select Guests'}
                      </span>
                      {totalGuests > 0 && (
                        <div className='text-xs text-gray-500 dark:text-primary-400'>
                          {guestsData.numberOfGuests} Adults
                          {guestsData.numberOfChildren > 0 &&
                            `, ${guestsData.numberOfChildren} Children`}
                        </div>
                      )}
                    </div>
                  </div>
                  {isBooking && (
                    <div>
                      {isGuestDrawerOpen ? (
                        <ChevronUpIcon className='dark:text-[var(--prive2)]' />
                      ) : (
                        <ChevronDownIcon className='dark:text-[var(--prive2)]' />
                      )}
                    </div>
                  )}
                </div>
              </DrawerTrigger>

              <DrawerContent className='max-h-[80vh]'>
                <DrawerHeader>
                  <DrawerTitle>Select Guests</DrawerTitle>
                </DrawerHeader>
                <div className='px-4 pb-4'>
                  <GuestSelector
                    guestsData={{
                      ...guestsData,
                      numberOfGuests: appSearchParams.adults,
                      numberOfChildren: appSearchParams.children,
                    }}
                    onChange={handleGuestChange}
                    open={isGuestSelectorOpen}
                    onOpenChange={handleOpenChange}
                    pageType='availability'
                    showGuestBreakdown={true}
                  />
                </div>

                <DrawerClose asChild>
                  <div
                    className={cn(
                      'sticky bottom-0 flex gap-3 pt-4',
                      isTablet
                        ? 'px-4 pb-4 border-t dark:border-secondary-950'
                        : 'justify-center md:mx-35 sm:mb-4 mt-3'
                    )}
                  >
                    <Button
                      variant='outline'
                      size={'lg'}
                      className={cn(
                        'flex-1',
                        isTablet
                          ? 'rounded-full border-gray-300 py-3 dark:text-[var(--prive2)] dark:bg-background dark:border-[var(--accent-background)]'
                          : 'rounded-full border-primary-100'
                      )}
                    >
                      Back
                    </Button>
                    <Button
                      size={'lg'}
                      onClick={() => {
                        trackEvent('guest_details_saved');
                      }}
                      className={cn(
                        'flex-1 text-white rounded-full bg-accent-red-900 dark:bg-[var(--accent-background)] dark:text-white hover:bg-accent-red-950',
                        isTablet ? 'py-3' : ''
                      )}
                    >
                      Save
                    </Button>
                  </div>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          ) : (
            <GuestSelector
              guestsData={{
                ...guestsData,
                numberOfGuests: appSearchParams.adults,
                numberOfChildren: appSearchParams.children,
              }}
              onChange={handleGuestChange}
              open={isGuestSelectorOpen}
              onOpenChange={handleOpenChange}
              pageType='availability'
              showGuestBreakdown={true}
              isBooking={isBooking}
            />
          )}
        </div>
      </div>

      {/* Meal Plan Selection */}
      <div
        className={cn(
          'w-full flex',
          isBooking && !isTablet
            ? 'w-2/5 py-2 px-2 justify-start items-start'
            : 'border-t dark:border-primary-800'
        )}
      >
        <div className='w-full'>
          <MealPlanSelector
            defaultValue={getDefaultMealPlan()}
            isOpen={isMealPlanOpen}
            setIsOpen={setIsMealPlanOpen}
            mealPlanOptions={mealPlanOptions}
            totalDays={numberOfNights || 1}
            onSelectionChange={handleMealPlanChange}
            title='Meal Plans'
            hasValidDates={hasValidDates}
            onDateRequiredClick={handleMealPlanDateRequiredClick}
            isLoading={isMealPlanLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySection;
