import { Suspense } from 'react';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import PropertyListingsModule from '@/components/modules/PropertyListing';
import PropertyListingTypes from '@/components/modules/PropertyListing/PropertyListing.types';
import { Metadata } from 'next';
import {
  getLocationsData,
  getInitialPropertyList,
  getPropertyFilters,
  getOffers,
  getKeyValueData,
} from '@/lib/api';
import { KEY_VALUE_KEYS } from '@/lib/constants';

const title = 'Luxury Villas, Holiday Homes & Villas Across India - ELIVAAS';
const description =
  'Your search for luxury villas & holiday homes is over! Explore ELIVAAS retreats in India across various locations & book your perfect staycation today!';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: title,
    description: description,
    alternates: {
      canonical: `https://www.elivaas.com/villas`,
    },
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      siteName: 'www.elivaas.com',
      url: `https://www.elivaas.com/villas`,
    },
  };
}

const PropertyListingPage = async () => {
  // Fetch all data in parallel with error handling
  const [
    locationsResult,
    propertiesResult,
    advanceFilterDataResult,
    loyaltyExpiringResult,
  ] = await Promise.allSettled([
    getLocationsData(),
    getInitialPropertyList({
      page: 0,
      pageSize: 12,
      filters: {
        adults: 1,
        children: 0,
      },
    }),
    getPropertyFilters(),
    getKeyValueData<{
      loyaltyExpiringCardContent?: PropertyListingTypes.LoyaltyExpiringCardContent;
    }>(KEY_VALUE_KEYS.LOYALTY_EXPIRING_CARD_CONTENT),
  ]);

  // Extract data with fallbacks for failed requests
  const locations =
    locationsResult.status === 'fulfilled' ? locationsResult.value : [];
  const { propertiesList, propertiesPageInfo } =
    propertiesResult.status === 'fulfilled'
      ? propertiesResult.value
      : { propertiesList: [], propertiesPageInfo: null };
  const advanceFilterData =
    advanceFilterDataResult.status === 'fulfilled'
      ? advanceFilterDataResult.value
      : { propertyFilters: { propertyTypeFilter: [] } };
  const loyaltyExpiringCardContent =
    loyaltyExpiringResult.status === 'fulfilled' && loyaltyExpiringResult.value
      ? ((
          loyaltyExpiringResult.value as {
            loyaltyExpiringCardContent?: PropertyListingTypes.LoyaltyExpiringCardContent;
          }
        )?.loyaltyExpiringCardContent ?? null)
      : null;

  // Log any failed requests for debugging
  if (locationsResult.status === 'rejected') {
    console.warn('Failed to fetch locations:', locationsResult.reason);
  }
  if (propertiesResult.status === 'rejected') {
    console.warn('Failed to fetch properties:', propertiesResult.reason);
  }
  if (advanceFilterDataResult.status === 'rejected') {
    console.warn(
      'Failed to fetch property filters:',
      advanceFilterDataResult.reason
    );
  }

  const offersResult = await Promise.allSettled([getOffers()]);
  const offersList =
    offersResult[0].status === 'fulfilled' ? offersResult[0].value : null;

  if (offersResult[0].status === 'rejected') {
    console.error('Failed to fetch offers:', offersResult[0].reason);
  }

  return (
    <div className='mx-auto w-full  lg:px-10 sm:py-4'>
      <Suspense fallback={<SuspenseLoader />}>
        <PropertyListingsModule
          propertiesList={propertiesList}
          initialPropertiesPageInfo={propertiesPageInfo}
          advanceFilterData={advanceFilterData}
          offersList={offersList || []}
          citySlug={''}
          locations={locations}
          loyaltyExpiringCardContent={loyaltyExpiringCardContent}
        />
      </Suspense>
    </div>
  );
};

export default PropertyListingPage;
