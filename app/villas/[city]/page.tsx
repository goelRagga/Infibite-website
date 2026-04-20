import PropertyListingsModule from '@/components/modules/PropertyListing';

import { PropertyType } from '@/contexts';
import {
  getInitialPropertyList,
  getKeyValueData,
  getLocationContent,
  getOffers,
  getPropertyFilters,
} from '@/lib/api';
import { serverClient } from '@/lib/client/unified-client-manager';
import { KEY_VALUE_KEYS } from '@/lib/constants';
import { GET_LOCATIONS_LIST } from '@/lib/queries';
import {
  formatCityName,
  formatCityNameLowerCase,
  formatParamsCityName,
  getFilenameFromUrl,
} from '@/lib/utils';
import { LoyaltyExpiringCardContent } from 'loyalty-expiring-card-types';
import { Metadata } from 'next';
import { CityListProps } from 'villa-types';

interface PropertyListResponse {
  propertiesList: PropertyType[];
  propertiesPageInfo: {
    hasNextPage: boolean;
    totalCount: number;
    [key: string]: any;
  };
}

const getLocationsData = async (): Promise<any[]> => {
  try {
    const data = await serverClient.request<any>(
      GET_LOCATIONS_LIST,
      {},
      {
        'Channel-Id': process.env.NEXT_PUBLIC_CHANNEL_ID || '',
      }
    );

    return data?.getLocations || [];
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
};

// export async function generateStaticParams() {
//   try {
//     const locations = await getLocationsData();
//     return (
//       locations?.map((location: any) => ({
//         city: `villas-in-${formatCityNameLowerCase(
//           location?.slug
//         )?.toLowerCase()}`,
//       })) || []
//     );
//   } catch (error) {
//     console.error('Failed to fetch locations:', error);
//     return [];
//   }
// }

export async function generateMetadata(
  props: CityListProps
): Promise<Metadata> {
  const params = await props.params;
  const city = formatParamsCityName(params.city, true);
  const citySlug = formatParamsCityName(params.city, true);

  // Fetch city content for metadata
  const [cityContent] = await Promise.allSettled([
    getLocationContent(citySlug),
  ]);
  const formattedCity = formatCityNameLowerCase(city)?.replace('-', '_');
  const metaTitle =
    cityContent.status === 'fulfilled' && cityContent.value?.metaTitle
      ? cityContent.value.metaTitle
      : `Villas in ${formattedCity}`;
  const metaDescription =
    cityContent.status === 'fulfilled' && cityContent.value?.metaDescription
      ? cityContent.value.metaDescription
      : `Explore luxury villas in ${formattedCity}`;

  const metaImage =
    cityContent.status === 'fulfilled' && cityContent.value?.mobileImageUrl
      ? getFilenameFromUrl(cityContent.value.mobileImageUrl)
      : 'default-image.jpg';

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `https://www.elivaas.com/villas/villas-in-${formatCityName(
        city
      )?.toLowerCase()}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      siteName: 'www.elivaas.com',
      url: `https://www.elivaas.com/villas/villas-in-${formatCityName(
        city
      )?.toLowerCase()}`,
      images: [
        {
          url: `https://cpjlcwamma.cloudimg.io/${metaImage}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
          alt: `Luxury Villas in ${formattedCity}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: `https://cpjlcwamma.cloudimg.io/${metaImage}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
          alt: metaTitle,
        },
      ],
    },
  };
}

export default async function CityPropertyList(props: CityListProps) {
  const { params } = props;
  const citySlug = formatParamsCityName((await params).city, true);

  // Fetch all data in parallel for better performance
  const [cityContent, locations, propertyRes, filters, loyaltyExpiringResult] =
    await Promise.allSettled([
      getLocationContent(citySlug),
      getLocationsData(),
      getInitialPropertyList({
        page: 0,
        pageSize: 12,
        filters: {
          adults: 1,
          children: 0,
          city: citySlug,
        },
      }),
      getPropertyFilters(),
      getKeyValueData<{
        loyaltyExpiringCardContent?: LoyaltyExpiringCardContent;
      }>(KEY_VALUE_KEYS.LOYALTY_EXPIRING_CARD_CONTENT),
    ]);

  // Extract results with proper error handling
  const cityContentData =
    cityContent.status === 'fulfilled' ? cityContent.value : null;
  const locationsData = locations.status === 'fulfilled' ? locations.value : [];
  const propertyData: PropertyListResponse =
    propertyRes.status === 'fulfilled'
      ? (propertyRes.value as PropertyListResponse)
      : {
          propertiesList: [],
          propertiesPageInfo: {
            hasNextPage: false,
            totalCount: 0,
          },
        };
  const filtersData = filters.status === 'fulfilled' ? filters.value : null;

  const loyaltyExpiringCardContent =
    loyaltyExpiringResult.status === 'fulfilled' && loyaltyExpiringResult.value
      ? ((
          loyaltyExpiringResult.value as {
            loyaltyExpiringCardContent?: LoyaltyExpiringCardContent;
          }
        )?.loyaltyExpiringCardContent ?? null)
      : null;

  const offersResult = await Promise.allSettled([getOffers()]);
  const offersList =
    offersResult[0].status === 'fulfilled' ? offersResult[0].value : null;

  if (offersResult[0].status === 'rejected') {
    console.error('Failed to fetch offers:', offersResult[0].reason);
  }
  return (
    <PropertyListingsModule
      propertiesList={propertyData.propertiesList}
      initialPropertiesPageInfo={propertyData.propertiesPageInfo}
      advanceFilterData={filtersData}
      offersList={offersList || []}
      citySlug={citySlug}
      cityContent={cityContentData}
      locations={locationsData}
      city={
        propertyData.propertiesList[0]?.state
          ? propertyData.propertiesList[0].state
          : ''
      }
      loyaltyExpiringCardContent={loyaltyExpiringCardContent}
    />
  );
}

// export async function generateStaticParams() {}
//   try {
//     // Add timeout to prevent hanging during build
//     const locationsPromise = Promise.race([
//       getLocationsData(),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('Locations fetch timeout')), 10000)
//       ),
//     ]);

//     const locations = await locationsPromise;

//     if (!locations || !Array.isArray(locations)) {
//       console.warn('No locations data available for static generation');
//       return [];
//     }

//     return locations.map((location: any) => ({
//       city: `villas-in-${formatCityNameLowerCase(location?.slug)?.toLowerCase()}`,
//     }));
//   } catch (error) {
//     console.error('Failed to fetch locations for static generation:', error);
//     // Return empty array to prevent build failure
//     return [];
//   }
// }

// Fetch static paths for all cities at build time
export async function generateStaticParams() {
  try {
    const cityList = await getLocationsData();

    return (
      cityList?.map((city: any) => ({
        city: `villas-in-${formatCityNameLowerCase(city?.slug)?.toLowerCase()}`,
      })) || []
    );
  } catch (error) {
    console.error('Failed to fetch city properties:', error);
    return [];
  }
}

export const revalidate = 1800;

// export const fetchCache = 'force-cache';
