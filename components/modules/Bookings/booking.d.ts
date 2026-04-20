declare module 'booking-types' {
  import { Metric } from '@/contexts/property';

  export type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  export type PaymentStatus = 'PAID' | 'UNPAID';

  export interface Booking {
    user?: {
      name?: string;
      phone?: string;
      email?: string;
    };
    reviews?: {
      rating?: number;
      comments?: string;
    }[];
    actualPaidAmount: number;
    checkinDate: string;
    checkoutDate: string;
    bookingStatus: BookingStatus;
    bookingDate: string;
    id: string;
    numberOfNights: number;
    numberOfGuest: number;
    outstandingAmount: number;
    ratePlanName: string;
    // user: User;
    property: {
      image: string;
      name: string;
      city: string;
      metrics: Metric[];
      brandedBrochure: string;
      state: string;
      location?: string;
    };
    paymentStatus: PaymentStatus;
    isGroupBooking: boolean;
    childBookings?: Booking[];
  }
}
