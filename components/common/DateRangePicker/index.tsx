'use client';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { Calendar } from '@/components/ui/calendar';
import { TooltipProvider } from '@/components/ui/tooltip';
import useIsLarge from '@/hooks/useIsLarge';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import {
  addMonthsToDate,
  disableMinimumStays,
  filterUnavailableDates,
  isDateBooked,
  isDateDisabled,
} from '@/lib/dateUtils';
import { GET_AVAILABILITY_LIST } from '@/lib/queries';
import { cn } from '@/lib/utils';
import { addMonths, format, isSameMonth } from 'date-fns';
import { DateRangeSelector, Inventory } from 'date-type';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DateRange } from 'react-day-picker';
import { useClient } from 'urql';
import Cookies from 'js-cookie';
import { Spinner } from '../Spinner';

export function DateRangePicker({
  className,
  date,
  handleDateChange,
  isCalendarOpen,
  setIsCalendarOpen,
  handleClearDates,
  children,
  sideOffset = 0,
  handleSelectGuestsClick,
  propertyID = '',
  isPopover = true,
  handlePopoverClose = () => {},
  handleGuestDrawerOpen = () => {},
  handleGuestDrawerClose = () => {},
  placement = 'availability',
  popoverContentClassName,
  dayContent,
  handleBackClick = () => {},
  onConfirm,
}: DateRangeSelector) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const pathname = usePathname();
  // const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLarge = useIsLarge();

  const [dateMap, setDateMap] = useState(new Map());
  const [allUnavailableDates, setAllUnavailableDates] = useState<string[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVisibleMonthRef = useRef<Date | null>(null);
  const { removeParams } = useURLParams();
  const tooltipElementsRef = useRef<Map<string, boolean>>(new Map());
  const validateCheckoutOnlyDateRef = useRef<string[]>([]);

  const isBookingPage = pathname.includes('booking');

  const firstDayOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );
  const lastDayOfNextMonth = new Date(
    firstDayOfNextMonth.getFullYear(),
    firstDayOfNextMonth.getMonth() + 1,
    1
  );
  const twelveMonthsFromNow = addMonthsToDate(today, 12);
  const initialEndMonth = isTablet
    ? new Date(today.getFullYear(), today.getMonth() + 3, 1) // 3 months - mobile
    : new Date(
        firstDayOfNextMonth.getFullYear(),
        firstDayOfNextMonth.getMonth() + 1,
        1
      ); // 2 months - desktop

  const [visibleStartMonth, setVisibleStartMonth] = useState(firstDayOfMonth);
  const [visibleEndMonth, setVisibleEndMonth] = useState(initialEndMonth);
  const [availabilityToggle, setAvailabilityToggle] = useState(false);
  const [currentAvailabilityList, setCurrentAvailabilityList] = useState<
    Inventory[]
  >([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [validateCheckoutOnlyDate, setValidateCheckoutOnlyDate] = useState('');
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [mobileCalendarLoading, setMobileCalendarLoading] = useState(true);
  const isCorporateChannel = Cookies.get('isCorporateChannel');
  const client = useClient();

  const formatDateForDisplay = useCallback((date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'dd MMM, yyyy');
  }, []);

  const fetchAvailabilityList = useCallback(
    async (id: string, fromDate: any, toDate: any) => {
      try {
        const result = await client
          .query(
            GET_AVAILABILITY_LIST,
            { propertyId: id, fromDate, toDate },
            {
              fetchOptions: {
                headers: {
                  'Channel-Id': isCorporateChannel
                    ? isCorporateChannel
                    : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                },
              },
            }
          )
          .toPromise();

        if (result.error) {
          throw result.error;
        }

        if (result.data) {
          setCurrentAvailabilityList(result.data?.inventories ?? []);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    },
    [client]
  );

  const handleDateSelect = useCallback(
    (selectedDate: DateRange | any) => {
      if (!selectedDate) {
        return;
      }

      const shouldUpdateImmediately = () => {
        if (
          date?.from &&
          !date?.to &&
          selectedDate?.from &&
          new Date(selectedDate.from) < new Date(date.from)
        ) {
          handleClearDates();
          handleDateChange({ from: selectedDate.from, to: undefined });
          return true;
        }

        if (selectedDate?.from && selectedDate?.to && date?.to && date?.from) {
          const { to, from } = selectedDate;

          if (placement !== 'filterbar') {
            if (new Date(to).getTime() !== new Date(date?.to).getTime()) {
              handleDateChange({ from: selectedDate?.to, to: undefined });
              return true;
            }
          } else {
            if (new Date(from).getTime() !== new Date(date?.from).getTime()) {
              handleDateChange({ from: selectedDate?.from, to: undefined });
              return true;
            }
          }
        }

        if (
          selectedDate?.from &&
          selectedDate?.to &&
          date?.from &&
          placement === 'filterbar'
        ) {
          const { from } = selectedDate;

          if (new Date(from).getTime() !== new Date(date?.from).getTime()) {
            handleDateChange({ from: selectedDate?.from, to: undefined });
            return true;
          }
        }

        if (
          selectedDate.from &&
          selectedDate.to &&
          format(selectedDate.from, 'yyyy-MM-dd') ===
            format(selectedDate.to, 'yyyy-MM-dd')
        ) {
          handleDateChange({ from: selectedDate.from, to: undefined });
          return true;
        }

        if (
          format(selectedDate?.from, 'yyyy-MM-dd') === validateCheckoutOnlyDate
        ) {
          return true;
        }

        return false;
      };

      if (shouldUpdateImmediately()) {
        return;
      }

      const selectedFromDate =
        placement === 'availability' ? selectedDate?.from : selectedDate?.to;

      if (date?.from && date?.to) {
        handleClearDates(false);
        handleDateChange({ from: selectedFromDate, to: undefined });
        return;
      }

      if (selectedDate?.from || selectedDate?.to) {
        const { from } = selectedDate;
        let checkOutDate = null;
        let shouldEnableCheckoutDate = true;

        handleDateChange(selectedDate);

        requestAnimationFrame(() => {
          const latestUnavailableDate = unavailableDates
            .filter((date) => new Date(date) > from)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .slice(0, 1)[0];

          if (selectedDate?.to) {
            checkOutDate = format(selectedDate?.to, 'yyyy-MM-dd');

            if (new Date(checkOutDate) <= new Date(validateCheckoutOnlyDate)) {
              shouldEnableCheckoutDate = false;
            }
          }

          if (
            unavailableDates.includes(latestUnavailableDate) &&
            shouldEnableCheckoutDate
          ) {
            setValidateCheckoutOnlyDate(latestUnavailableDate);

            const fromStr = format(from, 'yyyy-MM-dd');
            const toStr = selectedDate?.to
              ? format(selectedDate.to, 'yyyy-MM-dd')
              : null;

            validateCheckoutOnlyDateRef.current = unavailableDates.filter(
              (date) => {
                if (date <= fromStr) return false;
                if (toStr && date >= toStr) return false;
                return true;
              }
            );

            setUnavailableDates((prev) =>
              prev.filter(
                (date) => date !== format(latestUnavailableDate, 'yyyy-MM-dd')
              )
            );
          }

          if (!isMobile) {
            const secondMonth = addMonths(visibleStartMonth, 1);
            if (
              (isSameMonth(from, secondMonth) ||
                isSameMonth(selectedDate.to, secondMonth)) &&
              selectedDate?.from
            ) {
              const startOfVisibleMonth = new Date(
                secondMonth.getFullYear(),
                secondMonth.getMonth(),
                1
              );
              setVisibleStartMonth(startOfVisibleMonth);
              const nextMonth = addMonths(secondMonth, 1);
              fetchAvailabilityList(
                propertyID,
                format(visibleStartMonth, 'yyyy-MM-dd'),
                format(addMonths(nextMonth, 1), 'yyyy-MM-dd')
              );
            }
          }

          if (selectedDate?.from && selectedDate?.to) {
            setTimeout(() => {
              if (!isMobile) {
                setIsCalendarOpen(false);
              }
            }, 100);
          }
        });
      }
    },
    [
      date,
      handleClearDates,
      handleDateChange,
      placement,
      validateCheckoutOnlyDate,
      unavailableDates,
      isMobile,
      visibleStartMonth,
      fetchAvailabilityList,
      propertyID,
    ]
  );

  const handleDateSelectMobile = useCallback(
    (selectedDate: DateRange | any) => {
      startTransition(() => handleDateSelect(selectedDate));
    },
    [handleDateSelect]
  );

  const handleDrawerScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = calendarContainerRef.current;
      if (!container) return;

      const scrollPosition = container.scrollTop;
      const containerHeight = container.offsetHeight;

      const monthHeight = containerHeight / 2;
      const monthIndex = Math.floor(scrollPosition / monthHeight);

      const newVisibleMonth = new Date(
        visibleStartMonth.getFullYear(),
        visibleStartMonth.getMonth() + monthIndex,
        1
      );

      const lastMonth = lastVisibleMonthRef.current;
      const isSameMonth =
        lastMonth &&
        lastMonth.getFullYear() === newVisibleMonth.getFullYear() &&
        lastMonth.getMonth() === newVisibleMonth.getMonth();

      if (!isSameMonth) {
        lastVisibleMonthRef.current = newVisibleMonth;
        handleMonthChange(newVisibleMonth);
      }
    }, 200);
  }, [visibleStartMonth]);

  const handleMonthChange = useCallback(
    (visibleMonth: Date) => {
      const startOfVisibleMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        1
      );

      // Mobile  3 months, desktop  2 months
      const monthsToAdd = isTablet ? 3 : 2;
      const endMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + monthsToAdd,
        1
      );

      setAvailabilityToggle((prev) => !prev);
      setVisibleStartMonth(startOfVisibleMonth);
      setVisibleEndMonth(endMonth);
    },
    [isMobile]
  );

  const handleDatePickerClear = useCallback(() => {
    handleClearDates();
    validateCheckoutOnlyDateRef.current = [];
    if (validateCheckoutOnlyDate.length > 0) {
      setUnavailableDates((prev) => [...prev, validateCheckoutOnlyDate]);
      setValidateCheckoutOnlyDate('');
    }
    if (!isMobile) {
      tooltipElementsRef.current.clear();
    }
  }, [handleClearDates, validateCheckoutOnlyDate, isMobile]);

  useEffect(() => {
    if (propertyID && isCalendarOpen && placement === 'availability') {
      fetchAvailabilityList(
        propertyID,
        format(visibleStartMonth, 'yyyy-MM-dd'),
        format(visibleEndMonth, 'yyyy-MM-dd')
      );
    }
  }, [propertyID, availabilityToggle, isCalendarOpen, placement]);

  useEffect(() => {
    if (
      isTablet &&
      (pathname.includes('villa-in') || pathname.includes('booking')) &&
      !date?.from
    ) {
      const startDateKey =
        currentAvailabilityList?.length > 0
          ? currentAvailabilityList[0]?.date
          : '';

      const unavailableDatesArrayMobile = filterUnavailableDates(
        currentAvailabilityList,
        date?.from,
        setValidateCheckoutOnlyDate
      );

      if (!dateMap.has(startDateKey)) {
        dateMap.set(startDateKey, unavailableDatesArrayMobile);
        setDateMap(new Map(dateMap));
        setAllUnavailableDates((prev) => [
          ...prev,
          ...unavailableDatesArrayMobile,
        ]);
      }
    }
    const unavailableDatesArray = filterUnavailableDates(
      currentAvailabilityList,
      date?.from,
      setValidateCheckoutOnlyDate
    );
    setUnavailableDates(unavailableDatesArray);
  }, [currentAvailabilityList, date?.from]);

  useEffect(() => {
    if (unavailableDates.length > 0) {
      if (date?.from && date.to) {
        const { isBooked, bookedDates } = isDateBooked(date, unavailableDates);
        if (isBooked && !isBookingPage) {
          const reallyBooked = bookedDates.filter(
            (d) => !validateCheckoutOnlyDateRef.current.includes(d)
          );

          if (reallyBooked.length > 0) {
            validateCheckoutOnlyDateRef.current = [];
            handleClearDates();
          }
        } else if (isBooked && isBookingPage) {
          setValidateCheckoutOnlyDate(bookedDates[0]);
          setUnavailableDates((prev) =>
            prev.filter((date) => date !== bookedDates[0])
          );
        }
      }
    }
  }, [unavailableDates]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isCalendarOpen) {
      intervalId = setInterval(() => {
        const container = calendarContainerRef.current;

        if (container) {
          container.addEventListener('scroll', handleDrawerScroll);
          clearInterval(intervalId);
        }
      }, 100);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }

        if (calendarContainerRef.current) {
          calendarContainerRef.current.removeEventListener(
            'scroll',
            handleDrawerScroll
          );
        }
      };
    }
  }, [isCalendarOpen]);

  useEffect(() => {
    if (placement === 'availability' && isCalendarOpen && isLarge) {
      setMobileCalendarLoading(true);
      const timer = setTimeout(() => {
        setMobileCalendarLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isCalendarOpen, placement, isLarge]);

  const getMinimumStayByDate = (
    inventoryList: Inventory[],
    actualDate: Date
  ): number | undefined => {
    const formattedDate = format(actualDate, 'yyyy-MM-dd');

    const inventoryItem = inventoryList.find(
      (item) => item.date === formattedDate
    );

    return inventoryItem?.minimumStay;
  };

  useEffect(() => {
    if (isMobile || !date?.from || !isCalendarOpen) return;

    const handleTooltips = () => {
      const tooltipDays = document.querySelectorAll('.tooltip-day');
      const dateStr = format(date?.from, 'yyyy-MM-dd');

      if (tooltipElementsRef.current.has(dateStr)) {
        return;
      }

      const calendarContainers = document.querySelectorAll(
        '.rdp, [class*="calendar"]'
      );
      calendarContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.overflow = 'visible';
        }
      });

      tooltipDays.forEach((dayElement) => {
        const elementDateStr = dayElement.getAttribute('data-date') || dateStr;

        if (dayElement.hasAttribute('data-tooltip-processed')) {
          return;
        }

        const minimumStay = getMinimumStayByDate(
          currentAvailabilityList,
          date?.from
        );

        if (minimumStay && minimumStay > 1) {
          dayElement.setAttribute('data-tooltip-processed', 'true');

          const originalContent = dayElement.innerHTML;

          const rect = dayElement.getBoundingClientRect();
          const calendarContainer =
            dayElement.closest('.rdp') ||
            dayElement.closest('[class*="calendar"]');
          const containerRect = calendarContainer?.getBoundingClientRect();

          let tooltipPositionClass = '';
          let tooltipTransformClass = '';

          if (containerRect && rect) {
            const viewportLeft = rect.left;
            const viewportTop = rect.top;
            const viewportRight = window.innerWidth - rect.right;

            const tooltipTop = Math.max(viewportTop - 45, 5);

            if (viewportLeft < 120) {
              tooltipPositionClass = `top: ${tooltipTop}px; left: ${viewportLeft + rect.width + 8}px;`;
              tooltipTransformClass = '';
            } else if (viewportRight < 120) {
              tooltipPositionClass = `top: ${tooltipTop}px; right: ${viewportRight + rect.width + 8}px;`;
              tooltipTransformClass = '';
            } else {
              tooltipPositionClass = `top: ${tooltipTop}px; left: ${viewportLeft + rect.width / 2}px;`;
              tooltipTransformClass = 'transform: translateX(-50%);';
            }
          } else {
            const fallbackTop = rect ? Math.max(rect.top - 40, 10) : 10;
            const fallbackLeft = rect ? rect.left + rect.width / 2 : 0;
            tooltipPositionClass = `top-[${fallbackTop}px] left-[${fallbackLeft}px]`;
            tooltipTransformClass = 'transform -translate-x-1/2';
          }

          const tooltipWrapper = document.createElement('div');
          tooltipWrapper.className = 'relative w-full h-full overflow-visible';

          const tooltipContent = document.createElement('div');
          tooltipContent.className =
            'tooltip-content fixed z-[99] overflow-visible rounded-md border bg-popover dark:bg-[var(--prive4)] px-3 py-1.5 text-sm text-popover-foreground shadow-md opacity-0 invisible transition-all duration-200 whitespace-nowrap pointer-events-none max-w-none';
          tooltipContent.style.cssText =
            tooltipPositionClass +
            '; ' +
            (tooltipTransformClass.includes('transform')
              ? 'transform: translateX(-50%);'
              : '');
          tooltipContent.textContent = `${minimumStay} night(s) minimum`;

          tooltipWrapper.innerHTML = `
            <div class="tooltip-trigger w-full h-full flex items-center justify-center">
              ${originalContent}
            </div>
          `;
          tooltipWrapper.appendChild(tooltipContent);

          dayElement.innerHTML = '';
          dayElement.appendChild(tooltipWrapper);

          const trigger = tooltipWrapper.querySelector('.tooltip-trigger');
          const content = tooltipContent;

          let hoverTimeout: NodeJS.Timeout;

          const showTooltip = () => {
            clearTimeout(hoverTimeout);
            if (content) {
              content.classList.remove('opacity-0', 'invisible');
              content.classList.add('opacity-100', 'visible');
            }
          };

          const hideTooltip = () => {
            hoverTimeout = setTimeout(() => {
              if (content) {
                content.classList.remove('opacity-100', 'visible');
                content.classList.add('opacity-0', 'invisible');
              }
            }, 100);
          };

          if (trigger && content) {
            trigger.addEventListener('mouseenter', showTooltip);
            trigger.addEventListener('mouseleave', hideTooltip);

            (dayElement as any)._tooltipCleanup = () => {
              trigger.removeEventListener('mouseenter', showTooltip);
              trigger.removeEventListener('mouseleave', hideTooltip);
              clearTimeout(hoverTimeout);
            };
          }
        }
      });

      tooltipElementsRef.current.set(dateStr, true);
    };

    const timeoutId = setTimeout(handleTooltips, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    date?.from,
    currentAvailabilityList,
    isCalendarOpen,
    isMobile,
    getMinimumStayByDate,
  ]);

  useEffect(() => {
    if (isMobile) return;

    if (!isCalendarOpen || !date?.from) {
      const processedElements = document.querySelectorAll(
        '[data-tooltip-processed]'
      );
      processedElements.forEach((element) => {
        if ((element as any)._tooltipCleanup) {
          (element as any)._tooltipCleanup();
        }
        element.removeAttribute('data-tooltip-processed');
      });

      tooltipElementsRef.current.clear();

      const calendarContainers = document.querySelectorAll(
        '.rdp, [class*="calendar"]'
      );
      calendarContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.style.overflow = '';
        }
      });
    }
  }, [isCalendarOpen, date?.from, isMobile]);

  const MobilePDPDateInputs = () => {
    if (!isTablet || placement !== 'availability') return null;

    return (
      <div className='flex gap-2 mb-2'>
        <div
          className='flex-1 p-3 border rounded-xl bg-primary-10 dark:border-primary-800 dark:bg-[var(--brown2)] cursor-pointer'
          onClick={() => setIsCalendarOpen(true)}
        >
          <div className='flex items-center gap-2 w-full'>
            <div className='text-left'>
              <div className='text-xs text-primary-800 '>Check-In</div>
              <div className='text-sm font-medium'>
                {date?.from ? formatDateForDisplay(date.from) : 'Select date'}
              </div>
            </div>
          </div>
        </div>
        <div
          className='flex-1 p-3 border rounded-xl bg-primary-10 dark:border-primary-800 dark:bg-[var(--brown2)] cursor-pointer'
          onClick={() => setIsCalendarOpen(true)}
        >
          <div className='flex items-center gap-2 justify-end'>
            <div className='text-right'>
              <div className='text-xs text-primary-800'>Check-Out</div>
              <div className='text-sm font-medium'>
                {date?.to ? formatDateForDisplay(date.to) : 'Select date'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isPopover && !isTablet ? (
        <div className={cn('grid gap-2 ', className)}>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent
              className={cn(
                'w-[90vw] md:w-auto p-0 h-[45dvh] md:h-auto overflow-scroll bg-white dark:bg-background dark:border-none relative',
                popoverContentClassName ? popoverContentClassName : '',
                placement === 'filterbar' ? 'rounded-[30px]' : ''
              )}
              align='center'
              side='bottom'
              avoidCollisions={true}
              sideOffset={placement === 'filterbar' ? 6 : sideOffset}
            >
              <div className='relative w-full h-full'>
                <div
                  className={cn(
                    'flex flex-col gap-4 justify-center items-center lg:justify-start lg:items-start',
                    'px-4 py-6 md:px-6 md:py-8 sm:pb-10!'
                  )}
                >
                  <div className={placement == 'availability' ? 'mb-2' : ''}>
                    <TooltipProvider>
                      <Calendar
                        autoFocus
                        mode='range'
                        defaultMonth={isTablet ? today : date?.from}
                        selected={date}
                        onSelect={(date) => handleDateSelect(date)}
                        numberOfMonths={!isTablet ? 2 : 13}
                        startMonth={today}
                        endMonth={twelveMonthsFromNow}
                        onMonthChange={(month: any) => handleMonthChange(month)}
                        modifiers={{
                          disabled: (calendarDate) => {
                            const dateStr = format(calendarDate, 'yyyy-MM-dd');

                            // Don't disable the selected check-in date
                            if (
                              date?.from &&
                              format(date.from, 'yyyy-MM-dd') === dateStr
                            ) {
                              return false;
                            }

                            // Don't disable the selected check-out date
                            if (
                              date?.to &&
                              format(date.to, 'yyyy-MM-dd') === dateStr
                            ) {
                              return false;
                            }

                            return (
                              isDateDisabled(
                                calendarDate,
                                date,
                                '',
                                placement == 'filterbar' ? true : false
                              ) ||
                              unavailableDates.includes(dateStr) ||
                              disableMinimumStays(
                                calendarDate,
                                date?.from,
                                currentAvailabilityList
                              )
                            );
                          },
                          struck: (calendarDate) => {
                            const dateStr = format(calendarDate, 'yyyy-MM-dd');
                            return unavailableDates.includes(dateStr);
                          },
                          tooltip: (day) => {
                            if (
                              date.from &&
                              format(day, 'yyyy-MM-dd') ===
                                format(date?.from, 'yyyy-MM-dd') &&
                              !date.to
                            ) {
                              const minimumStay = getMinimumStayByDate(
                                currentAvailabilityList,
                                day
                              );
                              return minimumStay ? minimumStay > 1 : false;
                            }
                            return false;
                          },
                        }}
                        modifiersClassNames={{
                          struck: 'line-through opacity-50',
                          tooltip: !isMobile ? 'tooltip-day relative' : '',
                        }}
                      />
                    </TooltipProvider>
                  </div>
                  <Button
                    variant='link'
                    className='absolute bottom-3 right-5 z-10 text-sm text-accent-red-950 hover:text-foreground cursor-pointer hover:no-underline dark:text-[var(--accent-background)]'
                    onClick={handleDatePickerClear}
                  >
                    Clear dates
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <>
          <div>{children}</div>
          <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <SheetContent
              className='min-h-[100%] w-[100vw] p-0 overflow-hidden transition-all duration-300 ease-in-out [&>button]:hidden'
              side='bottom'
            >
              <SheetHeader className='p-0'>
                <SheetTitle className='relative flex items-center justify-center font-serif typography-title-regular border-b border-primary-100 h-15 dark:border-primary-800 dark: py-3 text-primary-950 px-4'>
                  <div
                    className='p-1 cursor-pointer'
                    onClick={() => {
                      handleBackClick();
                      setIsCalendarOpen(false);
                    }}
                  >
                    <ArrowLeft className='shrink-0 text-primary-950 dark:text-white' />
                  </div>

                  <h2 className='flex-1 text-center text-base font-semibold dark:text-white'>
                    Check-In & Check-Out
                  </h2>

                  <Button
                    variant='ghost'
                    className='shrink-0 p-0 text-accent-red-900 hover:bg-transparent dark:text-[var(--accent-background)]'
                    onClick={handleDatePickerClear}
                  >
                    Clear
                  </Button>
                </SheetTitle>
              </SheetHeader>

              {placement === 'availability' && mobileCalendarLoading && (
                <div className='fixed inset-0 z-50 bg-white/5 backdrop-blur-xs flex items-center justify-center'>
                  <Spinner size='lg' />
                </div>
              )}

              <div
                ref={calendarContainerRef}
                className={cn(
                  'overflow-auto max-h-[calc(100dvh-160px)] transition-opacity duration-300',
                  placement === 'availability' && mobileCalendarLoading
                    ? 'opacity-0'
                    : 'opacity-100',
                  'pb-[110px]'
                )}
              >
                <TooltipProvider>
                  <Calendar
                    mode='range'
                    defaultMonth={isTablet ? today : date?.from}
                    selected={date}
                    onSelect={handleDateSelectMobile}
                    numberOfMonths={!isTablet ? 2 : 13}
                    startMonth={today}
                    endMonth={twelveMonthsFromNow}
                    onMonthChange={(month: any) => handleMonthChange(month)}
                    modifiers={{
                      disabled: (calendarDate) => {
                        const dateStr = format(calendarDate, 'yyyy-MM-dd');

                        if (
                          date?.from &&
                          format(date.from, 'yyyy-MM-dd') === dateStr
                        ) {
                          return false;
                        }

                        if (
                          date?.to &&
                          format(date.to, 'yyyy-MM-dd') === dateStr
                        ) {
                          return false;
                        }

                        return (
                          isDateDisabled(
                            calendarDate,
                            date,
                            '',
                            placement == 'filterbar' ? true : false
                          ) ||
                          (date?.from
                            ? unavailableDates.includes(dateStr)
                            : allUnavailableDates.includes(dateStr)) ||
                          disableMinimumStays(
                            calendarDate,
                            date?.from,
                            currentAvailabilityList
                          )
                        );
                      },

                      struck: (calendarDate) => {
                        const dateStr = format(calendarDate, 'yyyy-MM-dd');
                        return date?.from
                          ? unavailableDates.includes(dateStr)
                          : allUnavailableDates.includes(dateStr);
                      },
                      tooltip: (day) => {
                        if (
                          date.from &&
                          format(day, 'yyyy-MM-dd') ===
                            format(date?.from, 'yyyy-MM-dd') &&
                          !date.to
                        ) {
                          const minimumStay = getMinimumStayByDate(
                            currentAvailabilityList,
                            day
                          );

                          return minimumStay
                            ? minimumStay > 1
                              ? true
                              : false
                            : false;
                        }
                        return false;
                      },
                    }}
                    modifiersClassNames={{
                      struck: 'line-through opacity-50',
                      tooltip: !isMobile ? 'tooltip-day relative' : '',
                    }}
                  />
                </TooltipProvider>
              </div>
              <div className='fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-background border-t  dark:border-[var(--prive6)] flex flex-col justify-between gap-3'>
                <MobilePDPDateInputs />
                <Button
                  size='lg'
                  className='bg-accent-red-900 hover:bg-accent-red-950 p-3 rounded-full dark:text-white dark:bg-[var(--accent-background)]'
                  onClick={() => {
                    if (onConfirm) {
                      onConfirm();
                    } else {
                      setIsCalendarOpen(false);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
}
