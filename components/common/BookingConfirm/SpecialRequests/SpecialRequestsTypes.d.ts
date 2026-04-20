declare module 'plans' {
  import { Booking } from 'booking-types';
  interface SpecialRequestsProps {
    booking?: Booking;
    hideDesc?: boolean;
    hideBottomBorder?: boolean;
    hideSpecialRequests?: boolean;
    mealInfoDisplayContainerClassName?: string;
    className?: string;
  }
}
