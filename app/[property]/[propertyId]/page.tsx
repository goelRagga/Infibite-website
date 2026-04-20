import DynamicSearchPageContent from '@/components/modules/DynamicSearchPage';
import PropertyDetailModule from '@/components/modules/PropertyDetails';
import {
  getEventPropertiesByTag,
  getOffers,
  getPropertyData,
  getSeoPage,
  getSeoPageSlugs,
  getValueAddedServices,
  seoPageResponseMatchesSlug,
} from '@/lib/api';
import { serverClient } from '@/lib/client/unified-client-manager';
import { GET_PROPERTIES_DETAILS_LIST } from '@/lib/queries';
import { formatCityNameLowerCase, getFilenameFromUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';
import NotFound from '../../not-found';

interface PropertyDetailsProps {
  params: Promise<{
    property: string;
    propertyId: string;
  }>;
}

function isPropertyRoute(segment: string): boolean {
  return segment.startsWith('villa-in-');
}

export default async function PropertyDetailOrDynamicSearch({
  params,
}: PropertyDetailsProps) {
  const { property, propertyId } = await params;

  if (!isPropertyRoute(property)) {
    const slug = `${property}/${propertyId}`;
    const { data, error } = await getSeoPage(slug, { revalidate });

    if (error || !data) {
      return <NotFound />;
    }

    if (!seoPageResponseMatchesSlug(slug, data)) {
      return <NotFound />;
    }

    const tagSlug = data.path?.slug ?? slug;
    const {
      list: eventListing,
      pageInfo: eventPageInfo,
      error: eventError,
    } = await getEventPropertiesByTag({
      tag: tagSlug,
      page: 0,
      pageSize: 20,
    });

    return (
      <DynamicSearchPageContent
        data={data}
        slug={slug}
        eventListing={eventError ? [] : eventListing}
        eventPageInfo={eventError ? null : eventPageInfo}
        eventTag={tagSlug}
      />
    );
  }

  const citySlug = property;
  const paramCity = citySlug.split('villa-in-')[1];
  const offersList = await getOffers({ propertyId });
  const { propertyData: propertyData, error } = await getPropertyData({
    propertyId,
  });
  const valueAddedServices = await getValueAddedServices(propertyId);

  const isCitySlugValid = propertyData?.citySlug === paramCity;

  if (error || !propertyData || !isCitySlugValid) {
    notFound();
  }

  return (
    <div className='mx-auto w-full xl:px-10 xl:py-2'>
      <PropertyDetailModule
        propertyInfo={propertyData}
        valueAddedServices={valueAddedServices}
        initialOffers={offersList}
        stayStories={null}
        pageName={isCitySlugValid ? 'property_details' : 'booking_details'}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PropertyDetailsProps) {
  const { property, propertyId } = await params;

  if (!isPropertyRoute(property)) {
    const slug = `${property}/${propertyId}`;
    const { data } = await getSeoPage(slug, { revalidate });
    if (!data?.path) return {};
    if (!seoPageResponseMatchesSlug(slug, data)) return {};
    const title = data.path.metaTitle ?? data.seoContent?.title;
    const description =
      data.path.metaDescription ?? data.seoContent?.description;
    const canonicalUrl = `https://www.elivaas.com/${slug}`;
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, type: 'website', url: canonicalUrl },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  try {
    const { propertyData } = await getPropertyData({ propertyId });
    if (!propertyData) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
      };
    }
    const filename = getFilenameFromUrl(propertyData?.images?.[0]?.url);
    return {
      title: propertyData?.metaTag?.title || propertyData?.name,
      description: propertyData?.metaTag?.description || propertyData?.name,
      twitter: {
        card: 'summary_large_image',
        title: propertyData?.metaTag?.title || propertyData?.name,
        description: propertyData?.metaTag?.description || propertyData?.name,
        images: [
          `https://cpjlcwamma.cloudimg.io/${filename}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
        ],
      },
      alternates: {
        canonical: `https://www.elivaas.com/villa-in-${formatCityNameLowerCase(
          propertyData?.city
        )?.toLowerCase()}/${propertyId}`,
      },
      openGraph: {
        title: propertyData?.metaTag?.title || propertyData?.name,
        description: propertyData?.metaTag?.description || propertyData?.name,
        siteName: 'www.elivaas.com',
        url: `https://www.elivaas.com/villa-in-${formatCityNameLowerCase(
          propertyData?.city
        )?.toLowerCase()}/${propertyId}`,
        images: [
          {
            url: `https://cpjlcwamma.cloudimg.io/${filename}?width=720&height=600&func=boundmin&force_format=webp&q=20`,
            alt: propertyData?.name,
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

// export async function generateStaticParams() {
//   const { propertyData, error } = await getPropertyData({ fetchList: true });

//   if (error || !propertyData?.propertiesRatesV1?.list) {
//     console.error('Failed to fetch property IDs for static params:', error);
//     return [];
//   }

//   return (
//     propertyData?.propertiesRatesV1?.list?.map(
//       ({ slug }: { slug: string }) => ({
//         propertyId: slug?.toString(),
//       })
//     ) || []
//   );
// }

export async function generateStaticParams() {
  const staticParams: { property: string; propertyId: string }[] = [];

  try {
    const allProperties: { citySlug: string; slug: string }[] = [];
    let currentPage = 0;
    const pageSize = 100;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await serverClient.request<any>(
        GET_PROPERTIES_DETAILS_LIST,
        { page: currentPage, pageSize }
      );

      const properties = data?.propertiesRatesV1?.list || [];

      if (properties.length > 0) {
        const validProperties = properties.filter(
          (item: { citySlug?: string; slug?: string }) =>
            item?.citySlug && item?.slug
        );
        allProperties.push(
          ...validProperties.map(
            ({ citySlug, slug }: { citySlug: string; slug: string }) => ({
              citySlug,
              slug,
            })
          )
        );
        currentPage++;

        if (properties.length < pageSize) {
          hasMoreData = false;
        }
      } else {
        hasMoreData = false;
      }
    }

    for (const { citySlug, slug } of allProperties) {
      staticParams.push({ property: `villa-in-${citySlug}`, propertyId: slug });
    }
  } catch (error: any) {
    console.error(
      'Failed to fetch property IDs while generating Static Params:',
      error
    );
  }

  try {
    const { slugs } = await getSeoPageSlugs({ revalidate });
    if (slugs) {
      for (const s of slugs) {
        const parts = s.split('/');
        if (parts.length === 2) {
          staticParams.push({ property: parts[0], propertyId: parts[1] });
        }
      }
    }
  } catch (error: any) {
    console.error(
      'Failed to fetch SEO slugs while generating Static Params:',
      error
    );
  }

  return staticParams;
}

export const revalidate = 1800;
