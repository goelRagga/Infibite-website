import { Suspense } from 'react';

import Metadata from '@/components/common/Metadata';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import ReviewBookingModule from '@/components/modules/ReviewBooking';

import {
  getOffers,
  getReviewBookingDetails,
  getValueAddedServices,
} from '@/lib/api';
import { Offer } from 'villa-types';

export const dynamic = 'force-dynamic';

interface ReviewBookingProps {
  params: Promise<{ propertyId: string }>;
}

const ReviewBooking = async ({ params }: ReviewBookingProps) => {
  try {
    const { propertyId } = await params;

    const valueAddedServices = await getValueAddedServices(propertyId);
    const [reviewBookingRes, offersRes] = await Promise.all([
      getReviewBookingDetails(propertyId),
      getOffers({ propertyId }),
    ]);

    const reviewBookingDetail = reviewBookingRes.reviewBookingDetail;
    const offers: Offer[] = Array.isArray(offersRes) ? offersRes : [];

    return (
      <>
        <Metadata title={`Pay | ${reviewBookingDetail?.name ?? 'Villa'}`} />
        <Suspense fallback={<SuspenseLoader />}>
          <ReviewBookingModule
            reviewBookingDetail={reviewBookingDetail}
            offers={offers}
            valueAddedService={valueAddedServices}
            isPrive={reviewBookingDetail?.isPrive}
            authError={reviewBookingRes?.statusCode == 401 ? true : false}
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading review booking:', error);
    return <></>;
  }
};

export default ReviewBooking;
