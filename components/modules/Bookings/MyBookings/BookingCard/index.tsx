import {
  formatDate,
  formatDateWithFullYear,
} from '@/components/common/Shared/FormatDate';
import { usePayRemainingAmount } from '@/lib/payRemaning';
import { Badge } from '@/components/ui/badge';
import { Booking } from 'booking-types';
import React from 'react';
import { formatDistance } from 'date-fns';
import { bookingStatusType } from '@/lib/constants';
import { ArrowUpRight, MoveRight } from 'lucide-react';
import NightsDisplay from '@/components/common/NightsDisplay';
import BalancePaymentDueBanner, {
  BookingCardBannerVariant,
} from '@/components/common/BalanceCardBanner';
import useIsMobile from '@/hooks/useIsMobile';
import { formatPrice } from '@/lib/utils';
import BookingConfirmCard from '@/components/common/BookingConfirm/BookingConfirmCard';
import Availability from '@/components/common/BookingConfirm/Availability';
import SpecialRequests from '@/components/common/BookingConfirm/SpecialRequests';

// Utility function to get time remaining text or status label
const getTimeRemainingText = (booking: Booking): string => {
  // If booking is CONFIRMED, show time remaining
  if (booking.bookingStatus === 'CONFIRMED') {
    const checkInDate = new Date(booking.checkinDate);
    const now = new Date();
    const distance = formatDistance(checkInDate, now);
    return `${distance} to go`;
  }

  // For other statuses, find and return the status label
  const statusInfo = bookingStatusType.find(
    (status) => status.code === booking.bookingStatus
  );
  return statusInfo?.label || booking.bookingStatus;
};

function BookingListCard({ booking }: { booking: Booking }) {
  const isMobile = useIsMobile();
  const timeRemaining = getTimeRemainingText(booking);
  const { payRemaining } = usePayRemainingAmount();
  const bannerConfig:
    | {
        title: string;
        message: string;
        variant: BookingCardBannerVariant;
        cta?: {
          label: string;
          onClick: any;
        };
      }
    | undefined = (() => {
    if (booking.paymentStatus !== 'PAID') {
      return {
        title: `Balance Payment Due by ${formatDateWithFullYear(booking.checkinDate)}`,
        message:
          'To confirm your booking, please pay the remaining balance before check-in.',
        variant: 'error',
        cta: isMobile
          ? undefined
          : {
              label: 'Pay Now',
              onClick: (e: any) => {
                e.preventDefault();
                payRemaining(booking.id);
              },
            },
      };
    }
  })();

  return (
    <div
      key={booking.id}
      className='relative group rounded-2xl md:bg-[var(--brown1)] md:hover:outline md:hover:outline-primary-300 md:hover:shadow-[0px_0px_12px_0px_#A9A6AE40] cursor-pointer transition-all ease-in-out'
    >
      <div className='md:block hidden'>
        {bannerConfig && (
          <BalancePaymentDueBanner
            title={bannerConfig.title}
            message={bannerConfig.message}
            cta={bannerConfig.cta}
            variant={bannerConfig.variant}
          />
        )}
      </div>

      <div className='flex flex-row justify-between md:px-6 px-0 md:pt-4 md:pb-0 py-2 mb-2 md:mb-0'>
        <div className='flex flex-row gap-2 items-center'>
          <Badge
            variant={'outline'}
            className='text-xs bg-white md:px-4 md:py-2 border-gray-200 border-0 md:border-1 px-0 py-0'
          >
            Booking ID: <span className='font-semibold'>{booking.id}</span>
          </Badge>
          <p className='text-xs md:block hidden'>
            Booked On:{' '}
            <span className='font-semibold'>
              {formatDate(booking.bookingDate)}
            </span>
          </p>
        </div>
        <Badge
          className='text-xs px-4 py-2 rounded-md font-semibold md:block hidden'
          variant={
            booking.bookingStatus === 'CANCELLED'
              ? 'outline-error'
              : 'outline-success'
          }
        >
          {timeRemaining}
        </Badge>
      </div>

      <div className='bg-[var(--brown1)] pb-4 md:pb-6 rounded-2xl outline-1 outline-primary-100 md:outline-none shadow-[0px_0px_12px_7px_#A2A2A240] md:shadow-none'>
        <div className='lg:hidden block'>
          {bannerConfig && (
            <BalancePaymentDueBanner
              title={bannerConfig.title}
              message={bannerConfig.message}
              cta={bannerConfig.cta}
              variant={bannerConfig.variant}
            />
          )}
        </div>

        <div className='flex flex-row border-b border-b-primary-100'>
          <div className='flex-3/5'>
            <BookingConfirmCard
              booking={booking}
              isBookingConfirm
              isBookingList
              hideRating
              hideBorderBottom
            />
          </div>
          <div className='flex-2/5 lg:block hidden pr-6 my-6 border-l border-l-primary-100'>
            <div className='flex flex-col gap-1 pl-6 h-full justify-center'>
              {booking?.outstandingAmount > 0 ? (
                <>
                  <div className='flex flex-row justify-between items-center text-xs'>
                    <h4>Amount Paid</h4>
                    <h4>₹ {formatPrice(booking?.actualPaidAmount)}</h4>
                  </div>
                  <div className='flex flex-row justify-between items-center text-sm font-semibold text-[var(--red1)]'>
                    <h4>Amount Due</h4>
                    <h4>₹ {formatPrice(booking?.outstandingAmount)}</h4>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex flex-row justify-between items-center text-sm font-semibold'>
                    <h4>Amount Paid</h4>
                    <h4>₹ {formatPrice(booking?.actualPaidAmount)}</h4>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-row'>
          <div className='flex-2/3'>
            <Availability
              booking={booking}
              nightsDisplay={
                <>
                  <MoveRight className='h-4 text-primary-200 lg:hidden block' />
                  <div className='lg:block hidden'>
                    <NightsDisplay numberOfNights={booking.numberOfNights} />
                  </div>
                </>
              }
              hideInfoDisplayDesc
              guestInRow
              hideBottomBorder
              guestInfoDisplayContainerClassName='md:border-r md:border-r-primary-100'
            />
          </div>
          <div className='lg:flex-1/3 hidden lg:block'>
            <SpecialRequests
              booking={booking}
              hideDesc
              hideSpecialRequests
              hideBottomBorder
              className='pb-0 px-0 md:px-0 pt-4'
              mealInfoDisplayContainerClassName='pb-0'
            />
          </div>
        </div>
        {/* <div className='md:block hidden'>
            <SpecialRequests booking={booking} />
          </div> */}
      </div>

      <button className='hidden md:block absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full border-1 border-[var(--accent-red-800)] bg-[var(--accent-red-50)] hover:bg-[var(--accent-red-100)] text-[var(--accent-red-800)]'>
        <ArrowUpRight className='h-6 w-6' />
      </button>
    </div>
  );
}

export default BookingListCard;
