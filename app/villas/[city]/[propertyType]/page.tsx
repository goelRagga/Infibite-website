import PropertyListingsModule from '@/components/modules/PropertyListing';

import {
  getInitialPropertyList,
  getLocationContent,
  getLocationsData,
  getPropertyFilters,
} from '@/lib/api';
import {
  formatCityName,
  formatCityNameLowerCase,
  formatParamsCityName,
  getCitySlugByName,
  getFilenameFromUrl,
} from '@/lib/utils';
import { Metadata } from 'next';
import { PropertyDetailsProps } from 'villa-types';

// export const revalidate = 1800;

export default async function PropertyTypeList(props: PropertyDetailsProps) {
  const { params } = props;
  const resolvedParams = await params;
  const formattedCityName = formatParamsCityName(resolvedParams.city, true);

  const [
    locationsResult,
    cityContentResult,
    availableFiltersResult,
    // offersListResult,
  ] = await Promise.allSettled([
    getLocationsData(),
    getLocationContent(formattedCityName),
    getPropertyFilters(),
  ]);

  const locations =
    locationsResult.status === 'fulfilled' ? locationsResult.value : [];
  const cityContent =
    cityContentResult.status === 'fulfilled' ? cityContentResult.value : null;
  const availableFilters =
    availableFiltersResult.status === 'fulfilled'
      ? availableFiltersResult.value
      : { propertyFilters: { propertyTypeFilter: [] } };
  // const offersList =
  //   offersListResult.status === 'fulfilled' ? offersListResult.value : [];

  if (locationsResult.status === 'rejected') {
    console.warn('Failed to fetch locations:', locationsResult.reason);
  }
  if (cityContentResult.status === 'rejected') {
    console.warn('Failed to fetch city content:', cityContentResult.reason);
  }
  if (availableFiltersResult.status === 'rejected') {
    console.warn(
      'Failed to fetch property filters:',
      availableFiltersResult.reason
    );
  }
  // if (offersListResult.status === 'rejected') {
  //   console.warn('Failed to fetch offers:', offersListResult.reason);
  // }

  const citySlug = getCitySlugByName(formattedCityName, locations);

  const propertyType = resolvedParams.propertyType
    ? availableFilters?.propertyFilters?.propertyTypeFilter?.find(
        (filter: any) => filter.slug === resolvedParams.propertyType
      )?.name
    : undefined;

  const finalCitySlug = citySlug || formattedCityName;

  const { propertiesList, propertiesPageInfo } = await getInitialPropertyList({
    page: 0,
    pageSize: 12,
    filters: {
      adults: 1,
      children: 0,
      city: finalCitySlug,
      ...(propertyType && { propertyType }),
    },
  });

  return (
    <PropertyListingsModule
      propertiesList={propertiesList}
      initialPropertiesPageInfo={propertiesPageInfo}
      advanceFilterData={availableFilters}
      // offersList={offersList}
      citySlug={finalCitySlug}
      cityContent={cityContent}
      locations={locations}
    />
  );
}

// export async function generateStaticParams() {
//   try {
//     const [locationsResult, availableFiltersResult] = await Promise.allSettled([
//       getLocationsData(),
//       getPropertyFilters(),
//     ]);

//     const locations =
//       locationsResult.status === 'fulfilled' ? locationsResult.value : [];
//     const availableFilters =
//       availableFiltersResult.status === 'fulfilled'
//         ? availableFiltersResult.value
//         : { propertyFilters: { propertyTypeFilter: [] } };

//     if (locationsResult.status === 'rejected') {
//       console.warn(
//         'Failed to fetch locations in generateStaticParams:',
//         locationsResult.reason
//       );
//     }
//     if (availableFiltersResult.status === 'rejected') {
//       console.warn(
//         'Failed to fetch property filters in generateStaticParams:',
//         availableFiltersResult.reason
//       );
//     }

//     const cityOnlyParams =
//       locations?.map((location: any) => ({
//         city: `villas-in-${formatCityNameLowerCase(
//           location?.slug
//         )?.toLowerCase()}`,
//       })) || [];

//     const cityWithPropertyTypeParams =
//       availableFilters.propertyFilters.propertyTypeFilter.reduce(
//         (
//           acc: {
//             city: string;
//             propertyType: string;
//           }[],
//           propertyType: { slug: any }
//         ) => [
//           ...acc,
//           ...(locations?.map((city: any) => ({
//             city: `villas-in-${formatCityName(city.slug).toLowerCase()}`,
//             propertyType: propertyType.slug,
//           })) || []),
//         ],
//         []
//       );

//     return [...cityOnlyParams, ...cityWithPropertyTypeParams];
//   } catch (error) {
//     console.error('Failed to generate static params:', error);
//     return [];
//   }
// }

interface GenerateMetadataProps {
  params: Promise<{
    city: string;
    propertyType?: string;
  }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cityRaw = resolvedParams.city;
  const propertyTypeRaw = resolvedParams.propertyType || 'villas';

  const city = formatParamsCityName(cityRaw, true);
  const citySlug = formatParamsCityName(cityRaw, true);
  const formattedCity = formatCityNameLowerCase(city)?.replace('-', '_');
  const capitalizedPropertyType =
    propertyTypeRaw.charAt(0).toUpperCase() + propertyTypeRaw.slice(1);

  const [cityContent] = await Promise.allSettled([
    getLocationContent(citySlug),
  ]);

  // const baseTitle =
  //   cityContent.status === 'fulfilled' && cityContent.value?.metaTitle;
  // const baseDescription =
  //   cityContent.status === 'fulfilled' && cityContent.value?.metaDescription;
  const metaImage =
    cityContent.status === 'fulfilled' && cityContent.value?.mobileImageUrl
      ? getFilenameFromUrl(cityContent.value.mobileImageUrl)
      : 'default-image.jpg';

  // Override metaTitle and metaDescription if propertyType is present
  const metaTitle = `${capitalizedPropertyType} in ${formatCityName(city)}`;
  const metaDescription = `Explore luxury ${propertyTypeRaw.toLowerCase()} in ${formattedCity}`;

  const canonicalUrl = `https://www.elivaas.com/villas/villas-in-${formatCityName(
    city
  )?.toLowerCase()}${resolvedParams.propertyType ? `/${resolvedParams.propertyType}` : ''}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      siteName: 'www.elivaas.com',
      url: canonicalUrl,
      images: [
        {
          url: `https://cpjlcwamma.cloudimg.io/${metaImage}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
          alt: `Luxury ${capitalizedPropertyType} in ${formattedCity}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: `https://cpjlcwamma.cloudimg.io/${metaImage}?width=720&height=600&func=boundmin&force_format=webp&q=80`,
          alt: `Luxury ${capitalizedPropertyType} in ${formattedCity}`,
        },
      ],
    },
  };
}

export const revalidate = 1800;

export const fetchCache = 'force-cache';
