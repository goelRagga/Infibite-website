import SuspenseLoader from '@/components/common/SuspenseLoader';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const BookingFailurePage = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div>BookingFailurePage</div>
    </Suspense>
  );
};

export default BookingFailurePage;
