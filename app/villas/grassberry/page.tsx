import { Suspense } from 'react';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import PropertyListingsModule from '@/components/modules/PropertyListing';
import { Metadata } from 'next';
import {
  getLocationsData,
  getInitialPropertyList,
  getPropertyFilters,
} from '@/lib/api';
import CustomImage from '@/components/common/CustomImage';
import { Button } from '@/components/ui/button';
import BannerGrassberry from './BannerGrassberry';

const title = 'Luxury Villas, Holiday Homes & Villas Across India - ELIVAAS';
const description =
  'Your search for luxury villas & holiday homes is over! Explore ELIVAAS retreats in India across various locations & book your perfect staycation today!';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: title,
    description: description,
    alternates: {
      canonical: `https://www.elivaas.com/villas/grassberry`,
    },
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      siteName: 'www.elivaas.com',
      url: `https://www.elivaas.com/villas/grassberry`,
    },
  };
}

const CouplVillasPage = async () => {
  // Fetch all data in parallel with error handling
  const [locationsResult, propertiesResult, advanceFilterDataResult] =
    await Promise.allSettled([
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

  return (
    <>
      <BannerGrassberry
        mobileSrc={`${process.env.IMAGE_DOMAIN}/mobile_grassberry1_8a9f1b57e6_688f07f84d.jpg`}
        desktopSrc={`${process.env.IMAGE_DOMAIN}/desktop_grassberry_4_0b6070afa9.jpg`}
        className='object-cover w-full! h-[200px] md:h-[250px]'
        mobHeight={100}
        desktopHeight={240}
        mobImageFormat='svg'
        desktopImageFormat='webp'
        isButton={true}
      />
      <div className='mx-auto w-full lg:px-10 sm:py-4 relative'>
        <Suspense fallback={<SuspenseLoader />}>
          <PropertyListingsModule
            propertiesList={propertiesList}
            initialPropertiesPageInfo={propertiesPageInfo}
            advanceFilterData={advanceFilterData}
            // offersList={[]}
            citySlug={''}
            locations={locations}
          />
        </Suspense>
      </div>
    </>
  );
};

export default CouplVillasPage;
