import BookingDetail from '@/components/common/BookingConfirm';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import { Suspense } from 'react';
import { getBookingDetails } from '@/lib/api';
import { getFilenameFromUrl } from '@/lib/utils';

interface BookingConfirmationPageProps {
  params: Promise<{ bookingId: string }>;
}

export async function generateMetadata({
  params,
}: BookingConfirmationPageProps) {
  const { bookingId } = await params;
  try {
    const { bookingConfirmDetail } = await getBookingDetails(bookingId);
    const propertyData = bookingConfirmDetail?.booking;
    if (!propertyData) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
      };
    }
    const filename = getFilenameFromUrl(propertyData?.property?.image);
    return {
      title: `Booking Details - ${propertyData?.property?.name} - ELIVAAS`,
      description:
        'Discover exclusive Luxury Villas for short rentals. Find the perfect vacation homes or weekend homes. Book your dream homestay with us today!',
      openGraph: {
        title: `Booking Details - ${propertyData?.property?.name} - ELIVAAS`,
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
        title: `Booking Details - ${propertyData?.property?.name} - ELIVAAS`,
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

  const { bookingConfirmDetail, error } = await getBookingDetails(bookingId);

  if (error) {
    console.error('Booking error:', error);
    return <p className='text-red-500'>Something went wrong: {error}</p>;
  }

  const propertyData = bookingConfirmDetail?.booking;

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <BookingDetail
        data={propertyData}
        bookingId={bookingId}
        isBookingConfirm={false}
        isPrive={propertyData?.property?.isPrive}
      />
    </Suspense>
  );
};

export default BookingConfirmationPage;
