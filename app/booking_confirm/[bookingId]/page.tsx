import BookingDetail from '@/components/common/BookingConfirm';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import { Suspense } from 'react';
import { getConfirmBooking } from '@/lib/api';
import { getFilenameFromUrl } from '@/lib/utils';

interface BookingConfirmationPageProps {
  params: Promise<{ bookingId: string }>;
}

export async function generateMetadata({
  params,
}: BookingConfirmationPageProps) {
  const { bookingId } = await params;

  const isPaymentId = bookingId.startsWith('pay_');

  let bookingConfirmDetail = null;
  let error = null;
  let bookingData = null;

  if (!isPaymentId) {
    const result = await getConfirmBooking(bookingId);
    bookingConfirmDetail = result.bookingConfirmDetail;
    error = result.error;
    bookingData = bookingConfirmDetail?.booking;
  }

  if (error) {
    console.error('Booking error:', error);
    return <p className='text-red-500'>Something went wrong: {error}</p>;
  }

  try {
    const propertyData = bookingData;
    if (!propertyData) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
      };
    }
    const filename = getFilenameFromUrl(propertyData?.property?.image);
    return {
      title: `Booking Confirmed - ${propertyData?.property?.name} - ELIVAAS`,
      description:
        'Discover exclusive Luxury Villas for short rentals. Find the perfect vacation homes or weekend homes. Book your dream homestay with us today!',
      openGraph: {
        title: `Booking Confirmed - ${propertyData?.property?.name} - ELIVAAS`,
        siteName: 'www.elivaas.com',
        description:
          'Discover exclusive Luxury Villas for short rentals. Find the perfect vacation homes or weekend homes. Book your dream homestay with us today!',
        images: [
          {
            url: `https://cpjlcwamma.cloudimg.io/${filename}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
            alt: propertyData?.property?.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Booking Confirmed - ${propertyData?.property?.name} - ELIVAAS`,
        description:
          'Discover exclusive Luxury Villas for short rentals. Find the perfect vacation homes or weekend homes. Book your dream homestay with us today!',
        images: [
          {
            url: `https://cpjlcwamma.cloudimg.io/${filename}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
            alt: propertyData?.property?.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Property Details',
      description: 'Property details page',
    };
  }
}

const BookingConfirmationPage = async ({
  params,
}: BookingConfirmationPageProps) => {
  const { bookingId } = await params;

  const isPaymentId = bookingId.startsWith('pay_');

  let bookingConfirmDetail = null;
  let error = null;
  let bookingData = null;

  if (!isPaymentId) {
    const result = await getConfirmBooking(bookingId);
    bookingConfirmDetail = result.bookingConfirmDetail;
    error = result.error;
    bookingData = bookingConfirmDetail?.booking;
  }

  if (error) {
    console.error('Booking error:', error);
    return <p className='text-red-500'>Something went wrong: {error}</p>;
  }

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <BookingDetail
        data={bookingData}
        bookingId={bookingId}
        isBookingConfirm={true}
        isPrive={bookingData?.property?.isPrive}
      />
    </Suspense>
  );
};

export default BookingConfirmationPage;
