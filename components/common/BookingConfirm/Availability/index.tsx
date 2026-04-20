import {
  formatDate,
  getDayAbbreviation,
} from '@/components/common/Shared/FormatDate';
import InfoDisplay from '@/components/common/InfoDisplay';
import NightsDisplay from '@/components/common/NightsDisplay';
import { AvailabilityProps } from 'available';
import { cn } from '@/lib/utils';

const Availability: React.FC<AvailabilityProps> = ({
  booking,
  nightsDisplay,
  hideInfoDisplayDesc,
  guestInRow = false,
  hideBottomBorder = false,
  guestInfoDisplayContainerClassName,
}) => {
  const Guests = 'Guests';
  const CHECKIN = 'Check-In';
  const CHECKOUT = 'Check-Out';
  // TODO: Need to get the actual check in and check out time from the booking
  const checkInTime = '2:00 PM';
  const checkOutTime = '11:00 AM';

  // Default nights display component
  const defaultNightsDisplay = (
    <NightsDisplay numberOfNights={booking?.numberOfNights} />
  );

  const guestInfoDisplay = (
    <InfoDisplay
      title={Guests}
      value={`${booking?.numberOfGuest} ${Guests}`}
      description={
        !hideInfoDisplayDesc
          ? `${booking?.adults} Adults${booking?.children > 0 ? `, ${booking?.children} Children` : ''}${booking?.pets > 0 ? `, ${booking?.pets} ${booking?.pets === 1 ? 'Pet' : 'Pets'}` : ''}`
          : undefined
      }
    />
  );

  return (
    <div className='rounded-bl-2xl rounded-br-2xl border-0 p-4 pb-0 md:px-6 mx-auto text-sm'>
      <div className='p-0'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex flex-2/3 md:pr-6 md:border-r md:border-r-primary-100 justify-between gap-4 items-center relative dark:border-secondary-950'>
            <InfoDisplay
              title={CHECKIN}
              value={
                booking?.checkinDate ? formatDate(booking.checkinDate) : 'N/A'
              }
              description={
                !hideInfoDisplayDesc
                  ? booking?.checkinDate
                    ? `${getDayAbbreviation(booking.checkinDate)}, ${checkInTime}`
                    : undefined
                  : undefined
              }
            />
            {nightsDisplay || defaultNightsDisplay}
            <div className='text-right md:text-start'>
              <InfoDisplay
                title={CHECKOUT}
                value={
                  booking?.checkoutDate
                    ? formatDate(booking.checkoutDate)
                    : 'N/A'
                }
                description={
                  !hideInfoDisplayDesc
                    ? booking?.checkoutDate
                      ? `${getDayAbbreviation(booking.checkoutDate)}, ${checkOutTime}`
                      : undefined
                    : undefined
                }
              />
            </div>
            {/* Mobile only: Guest in row when guestInRow is true */}
            {guestInRow && (
              <div
                className={cn(
                  'md:hidden pl-4 border-l border-l-primary-100',
                  guestInfoDisplayContainerClassName
                )}
              >
                {guestInfoDisplay}
              </div>
            )}
          </div>
          {/* Desktop: Always in separate section. Mobile: Only when guestInRow is false */}
          <div
            className={cn(
              'flex-1/3 pt-4 md:pt-0 md:pl-4 border-t md:border-t-0 border-t-primary-100 dark:border-secondary-950',
              guestInRow && 'hidden md:block',
              guestInfoDisplayContainerClassName
            )}
          >
            {guestInfoDisplay}
          </div>
        </div>

        {!hideBottomBorder && (
          <hr className='my-5 border-primary-100 dark:border-secondary-950' />
        )}
      </div>
    </div>
  );
};
export default Availability;
