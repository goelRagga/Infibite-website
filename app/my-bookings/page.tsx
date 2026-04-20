import SuspenseLoader from '@/components/common/SuspenseLoader';
import BookingList from '@/components/modules/Bookings/MyBookings/BookingList';
import { getBookingList } from '@/lib/api';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

async function MyBookingsPage() {
  const accessToken = (await cookies()).get('accessToken')?.value;
  const { bookingList, error: bookingListError } =
    await getBookingList(accessToken);

  if (bookingListError) {
    console.error('Booking list error:', bookingListError);
    return (
      <div className='py-6 text-red-500 p-8'>Error: {bookingListError}</div>
    );
  }

  const bookings = bookingList || [];

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <BookingList bookings={bookings} />
    </Suspense>
  );
}

export default MyBookingsPage;
