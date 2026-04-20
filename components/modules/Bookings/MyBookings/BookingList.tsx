'use client';

import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import HeaderWithIcon from '@/components/common/HeaderWithIcon/HeaderWithIcon';
import NoResults from '@/components/common/NoResults';
import BookingListCard from '@/components/modules/Bookings/MyBookings/BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useURLParams } from '@/hooks/useURLParams';
import { bookingStatusType, SEARCH_PARAM } from '@/lib/constants';
import { cn, getBookingStatusByDates } from '@/lib/utils';
import { Booking } from 'booking-types';
import { ArrowLeft, CircleX } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import CarryOnBagCheckedFilledIcon from '@/public/assets/filled/carryOnBagChecked.svg';
import UpcomingEventFilledIcon from '@/public/assets/filled/upcomingEvent.svg';
import CarryOnBagCheckedOutlinedIcon from '@/public/assets/outlined/carryOnBagChecked.svg';
import UpcomingEventOutlinedIcon from '@/public/assets/outlined/upcomingEvent.svg';

const BOOKING_URL_CONFIG = {
  [SEARCH_PARAM.BOOKING_STATUS]: {
    paramName: SEARCH_PARAM.BOOKING_STATUS,
    defaultValue: bookingStatusType[0].code,
    shouldInclude: (value: string | null) => value != null,
  },
};

type IconComponent = React.ComponentType<{ className?: string }>;

const bookingStatusIcons: Record<
  string,
  { outlined: IconComponent; filled: IconComponent }
> = {
  [bookingStatusType[0].code]: {
    outlined: UpcomingEventOutlinedIcon,
    filled: UpcomingEventFilledIcon,
  },
  [bookingStatusType[1].code]: {
    outlined: CarryOnBagCheckedOutlinedIcon,
    filled: CarryOnBagCheckedFilledIcon,
  },
  [bookingStatusType[2].code]: {
    outlined: CircleX,
    filled: CircleX,
  },
};

interface BookingListProps {
  bookings: Booking[];
}

function BookingList({ bookings }: BookingListProps) {
  const { getParam, setParam } = useURLParams({
    customConfig: BOOKING_URL_CONFIG,
  });

  const activeTab =
    getParam(SEARCH_PARAM.BOOKING_STATUS) || bookingStatusType[0].code;
  const setActiveTab = (value: string) => {
    setParam(SEARCH_PARAM.BOOKING_STATUS, value);
  };

  const filteredBookings = bookings?.filter((booking: Booking) => {
    const effectiveStatus = getBookingStatusByDates(booking);
    return effectiveStatus === activeTab;
  });

  const renderIcon = (statusCode: string, isActive: boolean) => {
    const IconComponent = isActive
      ? bookingStatusIcons[statusCode]?.filled
      : bookingStatusIcons[statusCode]?.outlined;
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <>
      <div className='px-4 pt-4 lg:hidden block'>
        <HeaderWithIcon
          icon={<ArrowLeft className='text-black !h-6 !w-6' />}
          title='My Bookings'
          onIconClick={() => window.history.back()}
          titleClassName='text-[var(--secondary-950)] text-2xl font-dm-serif typography-title-regular md:px-3 w-full text-center md:text-left'
        />
      </div>
      <div className='md:px-10 px-0'>
        <CustomBreadcrumb
          className='py-4 bg-white lg:block hidden'
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Bookings', href: '/my-bookings' },
          ]}
        />
        <h1 className='bg-white text-3xl font-serif mb-6 lg:block hidden'>
          My Bookings
        </h1>
        {bookings && bookings.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='lg:gap-5 gap-6 mb-6 md:mb-5'
          >
            <TabsList className='relative flex p-0 md:w-auto w-full md:bg-transparent md:justify-start bg-primary-foreground h-auto overflow-x-scroll rounded-none md:mx-0 md:gap-3'>
              {bookingStatusType.map((status) => {
                const filteredBookings = bookings?.filter(
                  (booking: Booking) => {
                    const effectiveStatus = getBookingStatusByDates(booking);
                    return effectiveStatus === status.code;
                  }
                );
                const isActive = status.code === activeTab;

                return (
                  <TabsTrigger
                    key={status.code}
                    value={status.code}
                    className={cn(
                      'group lg:max-w-[290px] cursor-pointer rounded-none md:rounded-2xl md:py-4 py-5 px-6 h-auto shadow-none text-sm',
                      'data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:bg-accent-red-900 md:text-primary-800 text-foreground font-normal',
                      'leading-[140%]',
                      'data-[state=inactive]:md:hover:bg-secondary-50 data-[state=inactive]:transition-colors'
                    )}
                  >
                    <div className='lg:block hidden'>
                      {renderIcon(status.code, isActive)}
                    </div>
                    {status.label}
                    {filteredBookings?.length > 0 && (
                      <div
                        className={cn(
                          'text-xs rounded-full h-6 w-6 hidden items-center justify-center md:flex group-data-[state=active]:text-foreground group-data-[state=active]:bg-white text-white bg-primary-800'
                        )}
                      >
                        {filteredBookings?.length}
                      </div>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value={activeTab} className='md:px-0 px-4'>
              {filteredBookings && filteredBookings.length > 0 ? (
                <div className='grid md:gap-6 gap-4'>
                  {filteredBookings.map((booking: Booking) => {
                    const effectiveStatus = getBookingStatusByDates(booking);
                    const bookingWithEffectiveStatus = {
                      ...booking,
                      bookingStatus: effectiveStatus,
                    };

                    return (
                      <Link
                        href={`/booking-details/${booking?.id}`}
                        key={booking?.id}
                      >
                        <BookingListCard
                          key={booking?.id}
                          booking={bookingWithEffectiveStatus}
                        />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <NoResults
                  title={`No ${activeTab?.toLowerCase()} bookings found`}
                  description={`You don't have any ${activeTab?.toLowerCase()} bookings yet.`}
                />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <NoResults
            title='No bookings found'
            description="You don't have any bookings yet."
          />
        )}
      </div>
    </>
  );
}

export default BookingList;
