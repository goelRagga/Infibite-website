import { Property } from '@/contexts/property';
import { KEY_VALUE_KEYS } from '@/lib/constants';
import {
  BOOKING_DETAILS,
  CONFIRM_BOOKING_DETAILS,
  GET_BOOKINGS_LIST,
  GET_CITY_PROPERTIES_AND_LOCATION,
  GET_CITY_WITH_DETAILS,
  GET_EVENT_LISTING,
  GET_HOMEPAGE_CONTENT,
  GET_KEY_VALUE,
  GET_LOCATIONS_CONTENT,
  GET_LOCATIONS_LIST,
  GET_NEW_PROPERTIES_LIST,
  GET_OFFERS,
  GET_PROPERTIES_DETAILS_LIST,
  GET_PROPERTIES_LISTING,
  GET_PROPERTY_FILTERS,
  GET_REVIEW_BOOKING_DETAILS,
  GET_VALUE_ADDED_SERVICES,
} from '@/lib/queries';

import {
  GET_HOME_PAGE_BANNERS,
  GET_HOME_PAGE_CITIES,
  GET_HOME_PAGE_ESCAPE,
  GET_HOME_PAGE_EVENTS,
  GET_HOME_PAGE_GEMS,
  GET_HOME_PAGE_METRICS,
  GET_HOME_PAGE_PARTNERSHIPS,
  GET_HOME_PAGE_SPOTLIGHT,
  GET_HOME_PAGE_STAR_STAYS,
  GET_HOME_PAGE_STORIES,
} from '@/lib/homePageQueries';

import {
  ClientPresets,
  graphqlClientManager,
  serverClient,
} from '@/lib/client/unified-client-manager';
import type { BannerSectionResponse } from 'api-types';
import { Booking } from 'booking-types';
import { ClientError } from 'graphql-request';
import { noCacheClient } from '../client/unified-client-manager';

// ------------------------------
// PROPERTY LIST WITH SORTING
// ------------------------------
interface PropertyListSortOptions {
  sortField: 'rank' | 'liveDate' | 'name' | 'priceAmount';
  sortDirection: 'ASCENDING' | 'DESCENDING';
}

export async function getPropertyListWithSorting(
  sortOptions: PropertyListSortOptions,
  filters?: PropertyListOptions['filters']
): Promise<{
  propertiesList: Partial<Property>[];
  currentPage: number;
  error: string | null;
}> {
  const { sortField, sortDirection } = sortOptions;

  try {
    const data = await serverClient.request<{
      propertiesRatesV1: {
        list: Partial<Property>[];
        currentPage: number;
      };
    }>(GET_NEW_PROPERTIES_LIST, {
      sortField,
      sortDirection,
      filters,
    });

    return {
      propertiesList: data?.propertiesRatesV1?.list || [],
      currentPage: data?.propertiesRatesV1?.currentPage || 0,
      error: null,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof ClientError
        ? err.response.errors?.map((e) => e.message).join(', ')
        : 'Unknown error occurred while fetching property list';

    return {
      propertiesList: [],
      currentPage: 0,
      error: errorMessage || 'Error fetching property list with sorting',
    };
  }
}

// ------------------------------
// HOMEPAGE DATA
// ------------------------------
type HomepageContentResponse = {
  keyValue?: {
    value?: {
      HomePageContent?: {
        banners?: { urlMobile: string; urlDesktop: string }[];
      };
    };
  };
};

export async function getHomepageContent(): Promise<{
  banners: { urlMobile: string; urlDesktop: string }[];
  error: string | null;
}> {
  try {
    const data = await serverClient.request<HomepageContentResponse>(
      GET_HOMEPAGE_CONTENT,
      {
        key: KEY_VALUE_KEYS.HOMEPAGE_CONTENT,
      }
    );

    return {
      banners: data?.keyValue?.value?.HomePageContent?.banners || [],
      error: null,
    };
  } catch (err) {
    const errorMessage =
      err instanceof ClientError
        ? err.response.errors?.map((e) => e.message).join(', ')
        : 'Unknown error occurred while fetching homepage content';

    return {
      banners: [],
      error: errorMessage || 'Error fetching homepage content',
    };
  }
}

// ------------------------------
// GENERIC KEY-VALUE DATA
// ------------------------------
type KeyValueResponse<T> = {
  keyValue?: {
    value?: T;
  };
};

export async function getKeyValueData<T = any>(key: string): Promise<T | null> {
  try {
    const data = await serverClient.request<KeyValueResponse<T>>(
      GET_KEY_VALUE,
      {
        key,
      }
    );

    return data?.keyValue?.value ?? null;
  } catch (err) {
    const errorMessage =
      err instanceof ClientError
        ? err.response.errors?.map((e) => e.message).join(', ')
        : 'Unknown error while fetching key-value data';

    console.error(
      `Failed to fetch key-value data for key: ${key}`,
      errorMessage
    );
    return null;
  }
}
// ------------------------------
// PROPERTY DATA
// ------------------------------

interface GetPropertyDataOptions {
  propertyId?: string;
  fetchList?: boolean;
}
interface PropertyDataResponse {
  propertiesRatesV1?: {
    list?: Array<any>;
  };
}

export async function getPropertyData(options?: GetPropertyDataOptions) {
  const { propertyId, fetchList = false } = options || {};

  let variables: { filters?: { propertyId: string } } = {};
  if (propertyId) {
    variables = { filters: { propertyId } };
  } else if (!fetchList) {
    console.error('Either propertyId or fetchList must be provided.');
    return { propertyData: null, error: 'Missing parameters' };
  }

  try {
    const propertyData = await serverClient.request<PropertyDataResponse>(
      GET_PROPERTIES_DETAILS_LIST,
      variables
    );

    return fetchList || !propertyId
      ? { propertyData, error: null }
      : {
          propertyData: propertyData?.propertiesRatesV1?.list?.[0] || null,
          error: null,
        };
  } catch (error: any) {
    console.error('GraphQL Server Error:', error);
    return {
      propertyData: null,
      error:
        error?.response?.errors?.[0]?.message ||
        error.message ||
        'Unknown error occurred while fetching property data',
    };
  }
}

interface PropertyListOptions {
  page?: number;
  pageSize?: number;
  filters?: {
    adults?: number;
    children?: number;
    isPrive?: boolean;
    [key: string]: unknown;
  };
  sortOptions?: PropertyListSortOptions;
}
export interface PropertiesRatesV1Response {
  propertiesRatesV1: {
    list: Property[];
    totalCount: number;
    hasNextPage: boolean;
    [key: string]: unknown;
  };
}
export async function getInitialPropertyList(
  options?: PropertyListOptions
): Promise<{
  propertiesList: unknown[];
  propertiesPageInfo: unknown;
}> {
  try {
    const data = await serverClient.request<PropertiesRatesV1Response>(
      GET_PROPERTIES_LISTING,
      {
        page: options?.page ?? 0,
        pageSize: options?.pageSize ?? 12,
        filters: options?.filters ?? { adults: 1, children: 0 },
        sort: options?.sortOptions,
      }
    );

    const { list: propertiesList, ...propertiesPageInfo } =
      data?.propertiesRatesV1 ?? {};

    return { propertiesList, propertiesPageInfo };
  } catch (error) {
    console.error('Failed to fetch initial property list:', error);
    return { propertiesList: [], propertiesPageInfo: {} };
  }
}

// ------------------------------
// VALUE ADDED SERVICES
// ------------------------------

interface GetValueAddedServicesResponse {
  propertiesRatesV1?: {
    list?: {
      valueAddedServices?: any[];
    }[];
  };
}

export async function getValueAddedServices(
  propertyId: string
): Promise<any[]> {
  if (!propertyId) {
    console.warn('getValueAddedServices called without propertyId.');
    return [];
  }

  try {
    const data: GetValueAddedServicesResponse = await serverClient.request(
      GET_VALUE_ADDED_SERVICES,
      { propertyId }
    );

    return (
      data?.propertiesRatesV1?.list?.flatMap(
        (item) => item?.valueAddedServices ?? []
      ) ?? []
    );
  } catch (error) {
    console.error('Failed to fetch value added services:', error);
    return [];
  }
}
// ------------------------------
// OFFERS (Reusable)
// ------------------------------
interface GetOffersOptions {
  propertyId?: string;
}

export async function getOffers({ propertyId }: GetOffersOptions = {}): Promise<
  any[]
> {
  try {
    const variables = propertyId ? { propertyId } : {};
    const data = await serverClient.request<any>(GET_OFFERS, variables);
    return data?.offers ?? [];
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

// ------------------------------
// EVENTS LISTING BY TAG
// ------------------------------
interface GetEventPropertiesByTagOptions {
  tag: number | string;
  page?: number;
  pageSize?: number;
}

interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElementsCount: number;
  pagesCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  liveListingCount: number;
}

export async function getEventPropertiesByTag({
  tag,
  page = 0,
  pageSize = 7,
}: GetEventPropertiesByTagOptions): Promise<{
  list: any[];
  pageInfo: PageInfo | null;
  error: string | null;
}> {
  try {
    const variables = { tag, page, pageSize };

    const data = await serverClient.request<any>(
      GET_EVENT_LISTING,
      variables
      // CHANNEL_ID_HEADER
    );

    const payload = data?.propertiesByTag ?? null;

    return {
      list: payload?.list ?? [],
      pageInfo: payload
        ? {
            currentPage: payload.currentPage,
            pageSize: payload.pageSize,
            totalElementsCount: payload.totalElementsCount,
            pagesCount: payload.pagesCount,
            hasPrevious: payload.hasPrevious,
            hasNext: payload.hasNext,
            liveListingCount: payload.liveListingCount,
          }
        : null,
      error: null,
    };
  } catch (error: any) {
    console.error('Failed to fetch event properties by tag:', error);
    return {
      list: [],
      pageInfo: null,
      error: error?.message || 'Unknown error while fetching event listings',
    };
  }
}

// ------------------------------
// REVIEW BOOKING DETAILS
// ------------------------------

export async function getReviewBookingDetails(
  propertyId: string,
  token?: string
): Promise<{
  reviewBookingDetail: any;
  error: string | null;
  statusCode: number | null;
}> {
  try {
    // const client = token
    //   ? createServerClient({ Authorization: `Bearer ${token}` })
    //   : createServerClient();

    const client = graphqlClientManager.getClient(
      ClientPresets.DEFAULT,
      token ? { token } : undefined
    );
    const variables = { filters: { propertyId } };
    const data = await client.request<any>(
      GET_REVIEW_BOOKING_DETAILS,
      variables
    );

    return {
      reviewBookingDetail: data?.propertiesRatesV1?.list?.[0] || null,
      error: null,
      statusCode: null,
    };
  } catch (error: any) {
    return {
      reviewBookingDetail: null,
      statusCode: error?.response?.status || null,
      error:
        error?.message ||
        'Unknown error occurred while fetching review booking details',
    };
  }
}

// ------------------------------
// LOCATIONS
// ------------------------------
export async function getLocationsData(): Promise<any[]> {
  try {
    const data = await serverClient.request<any>(GET_LOCATIONS_LIST);

    return data?.getLocations ?? [];
  } catch (error: any) {
    console.error('Failed to fetch locations:', error);
    throw new Error(
      error?.message || 'Unknown error occurred while fetching locations'
    );
  }
}

export async function getLocationContent(locationSlug: string): Promise<any> {
  try {
    const variables = { slug: locationSlug };
    const data = await serverClient.request<any>(
      GET_LOCATIONS_CONTENT,
      variables
    );

    return data?.locationContent ?? null;
  } catch (error: any) {
    console.error('Failed to fetch location content:', error);
    throw new Error(
      error?.message || 'Unknown error occurred while fetching location content'
    );
  }
}

// ------------------------------
// FILTERS
// ------------------------------
export async function getPropertyFilters(): Promise<any> {
  try {
    const data = await serverClient.request(GET_PROPERTY_FILTERS);
    return data ?? {};
  } catch (error: any) {
    console.error('Failed to fetch property filters:', error);
    throw new Error(
      error?.message || 'Unknown error occurred while fetching property filters'
    );
  }
}

// ------------------------------
// BOOKING CONFIRM PAGE
// ------------------------------
export async function getConfirmBooking(
  bookingId: string,
  token?: string
): Promise<{
  bookingConfirmDetail: any;
  error: string | null;
  statusCode: number | null;
}> {
  try {
    const client = graphqlClientManager.getClient(
      ClientPresets.DEFAULT,
      token ? { token } : undefined
    );

    const variables = { id: bookingId };
    const data = await client.request(CONFIRM_BOOKING_DETAILS, variables);

    return {
      bookingConfirmDetail: data,
      error: null,
      statusCode: null,
    };
  } catch (error: any) {
    return {
      bookingConfirmDetail: null,
      statusCode: error?.response?.status || null,
      error:
        error?.message ||
        'Unknown error occurred while fetching booking details',
    };
  }
}

// ------------------------------
// BOOKING DETAIL PAGE
// ------------------------------

export async function getBookingDetails(
  bookingId: string,
  token?: string
): Promise<{
  bookingConfirmDetail: any;
  error: string | null;
  statusCode: number | null;
}> {
  try {
    const client = graphqlClientManager.getClient(
      ClientPresets.DEFAULT,
      token ? { token } : undefined
    );
    const variables = { id: bookingId };
    const data = await client.request(BOOKING_DETAILS, variables);

    return {
      bookingConfirmDetail: data,
      error: null,
      statusCode: null,
    };
  } catch (error: any) {
    return {
      bookingConfirmDetail: null,
      statusCode: error?.response?.status || null,
      error:
        error?.message ||
        'Unknown error occurred while fetching booking details',
    };
  }
}

// ------------------------------
// BOOKING LIST
// ------------------------------

export async function getBookingList(token?: string): Promise<{
  bookingList: Booking[];
  error: string | null;
  statusCode: number | null;
}> {
  try {
    const client = graphqlClientManager.getClient(
      ClientPresets.DEFAULT,
      token ? { token } : undefined
    );

    const data = await client.request<{ bookings: Booking[] }>(
      GET_BOOKINGS_LIST
    );

    return {
      bookingList: data?.bookings || [],
      statusCode: null,
      error: null,
    };
  } catch (error: any) {
    return {
      bookingList: [],
      statusCode: error?.response?.status || null,
      error: error?.message || 'Unknown error occurred while fetching bookings',
    };
  }
}
// ------------------------------
// Cities (Reusable)
// ------------------------------

export async function getCitiesWithDetails(): Promise<any[]> {
  try {
    const data = await serverClient.request<any>(GET_CITY_WITH_DETAILS);
    return data?.cityWithDetails ?? [];
  } catch (error: any) {
    console.error('Failed to fetch cities with details:', error);
    return [];
  }
}
// ------------------------------
// Search Properties with location
// ------------------------------

export async function getCityPropertiesAndLocation(): Promise<any[]> {
  try {
    const data = await serverClient.request<any>(
      GET_CITY_PROPERTIES_AND_LOCATION
    );
    return data?.searchPropertyAndLocation ?? [];
  } catch (error: any) {
    console.error('Failed to fetch getCityPropertiesAndLocation():', error);
    // graphql-request throws standard Errors
    return [];
  }
}

// ------------------------------
// Home Page Dynamic Queries (GraphQL)
// ------------------------------

export async function getHomePageCities(): Promise<any> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_CITIES);
    return data?.homePageCitiesSection ?? null;
  } catch (error: any) {
    console.error('Failed to fetch home page cities:', error);
    return null;
  }
}

export async function getHomePageStarStays(): Promise<any> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_STAR_STAYS);

    const section = data?.homePageStarStaySection;
    if (!section) return null;

    // Return raw GraphQL response
    return {
      heading: section.sectionTitle,
      description: section.caption,
      data: section.homePageStarStays || [],
    };
  } catch (error: any) {
    console.error('Failed to fetch home page star stays:', error);
    return null;
  }
}

export async function getHomePageStories(): Promise<any> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_STORIES);

    const section = data?.homePageStoriesSection;
    if (!section) return null;

    return {
      heading: section.sectionTitle,
      description: section.caption,
      data: section.homePageStories || [],
    };
  } catch (error: any) {
    console.error('Failed to fetch home page stories:', error);
    return null;
  }
}

export async function getHomePageBanners(target: string = 'homepage'): Promise<{
  banners: Array<{
    urlMobile: string;
    urlDesktop: string;
    isImage?: boolean;
    isVideo?: boolean;
    thumbnail?: string;
    mobilePoster?: string;
    link?: string;
  }>;
  error: string | null;
}> {
  try {
    const data = await noCacheClient.request<BannerSectionResponse>(
      GET_HOME_PAGE_BANNERS,
      { target }
    );

    const banners =
      data?.BannerSection?.banners
        ?.map((banner) => {
          if (banner.image) {
            const urlMobile = banner.image.mobileImage;
            const urlDesktop = banner.image.webImage;
            if (!urlMobile || !urlDesktop) return null;
            return {
              urlMobile,
              urlDesktop,
              isImage: true,
              isVideo: false,
              link: banner.link,
            };
          }
          if (banner.video) {
            const urlMobile = banner.video.videoMobile;
            const urlDesktop = banner.video.videoWeb;
            if (!urlMobile || !urlDesktop) return null;
            return {
              urlMobile,
              urlDesktop,
              isImage: false,
              isVideo: true,
              thumbnail: banner.video.thumbnailWeb,
              mobilePoster: banner.video.thumbnailMobile,
              link: banner.link,
            };
          }
          return null;
        })
        .filter((b): b is NonNullable<typeof b> => b !== null) || [];

    return { banners, error: null };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof ClientError
        ? error.response.errors?.map((e) => e.message).join(', ')
        : 'Unknown error occurred while fetching home page banners';

    console.error('Failed to fetch home page banners:', errorMessage);
    return {
      banners: [],
      error: errorMessage || 'Error fetching home page banners',
    };
  }
}

export async function getHomePageSpotlight(): Promise<{
  heading: string;
  description: string;
  data: Array<{
    mobileImage: string;
    webImage: string;
    tag: string;
    tagIcon: string;
    tagBg: string;
    title: string;
    description: string;
    link: string;
  }>;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_SPOTLIGHT);

    const section = data?.homePageSpotlightSection;
    if (!section) return null;

    const spotlightItems = (section.Spotlights || []).map((spotlight: any) => {
      const mobileImage = spotlight.image?.mobileImage || '';
      const webImage = spotlight.image?.webImage || '';
      return {
        mobileImage: mobileImage || webImage,
        webImage: webImage || mobileImage,
        tag: spotlight.tag || '',
        tagIcon: '',
        tagBg: '#000000',
        title: spotlight.title || '',
        description: spotlight.description || '',
        link: spotlight.link || '',
      };
    });

    return {
      heading: section.sectionTitle || '',
      description: section.caption || '',
      data: spotlightItems,
    };
  } catch (error: any) {
    console.error('Failed to fetch home page spotlight:', error);
    return null;
  }
}

export async function getHomePageEscape(): Promise<{
  heading: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  mapping_id: number | null;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_ESCAPE);

    const section = data?.homePageEscapeSection;
    if (!section) return null;

    return {
      heading: section.sectionTitle,
      description: section.caption,
      buttonName: section.buttonContent?.text || '',
      buttonLink: section.buttonContent?.link || '',
      mapping_id: section.mapping_id || null,
    };
  } catch (error: any) {
    console.error('Failed to fetch home page escape:', error);
    return null;
  }
}

export async function getHomePageEvents(): Promise<{
  heading: string;
  description: string;
  events: Array<{
    image: string;
    tagLine: string;
    title: string;
    description: string;
    link: string;
  }>;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_EVENTS);

    const section = data?.homePageEventSection;
    if (!section) return null;

    const eventItems = (section.events || []).map((event: any) => ({
      image: event.image?.webImage || event.image?.mobileImage || '',
      tagLine: event.tag || '',
      title: event.title || '',
      description: event.description || '',
      link: event.link || '',
    }));

    return {
      heading: section.sectionTitle || '',
      description: section.caption || '',
      events: eventItems,
    };
  } catch (error: any) {
    console.error('Failed to fetch home page events:', error);
    return null;
  }
}

export async function getHomePageMetrics(): Promise<{
  heading: string;
  description: string;
  data: Array<{
    icon: string;
    countingNumbers: string;
    countingFeature: string;
  }>;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_METRICS);

    const section = data?.homePageMetricSection;
    if (!section) return null;

    // Transform GraphQL response to match StatsData format
    const metricItems = (section.Metrics || []).map((metric: any) => ({
      icon: metric.icon || '',
      countingNumbers: metric.value || '',
      countingFeature: metric.name || '',
    }));

    return {
      heading: section.sectionTitle || '',
      description: section.caption || '',
      data: metricItems,
    };
  } catch (error: any) {
    console.error('Failed to fetch home page metrics:', error);
    return null;
  }
}

export async function getHomePagePartnerships(): Promise<{
  sectionTitle: string;
  description?: string;
  cta?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageSrcMobile?: string;
  imageAlt?: string;
  totalStays: string;
  occupancy: string;
  earnings: string;
  sectionHeading?: string;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_PARTNERSHIPS);

    const section = data?.homePagePartnershipSection;
    if (!section) return null;
    const taglines = section.taglines || [];

    return {
      sectionTitle: section.title || '',
      description: section.description || '',
      cta: section.buttonContent?.text || 'Learn More',
      ctaLink: section.buttonContent?.link || '',
      imageSrc: section.image?.webImage || '',
      imageSrcMobile: section.image?.mobileImage || '',
      imageAlt: section.image?.title || '',
      totalStays: taglines[0] || '',
      occupancy: taglines[1] || '',
      earnings: taglines[2] || '',
      sectionHeading: section.subtitle || '',
    };
  } catch (error: any) {
    console.error('Failed to fetch home page partnerships:', error);
    return null;
  }
}

export async function getHomePageGems(): Promise<{
  heading: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  mapping_id: number | null;
} | null> {
  try {
    const data = await noCacheClient.request<any>(GET_HOME_PAGE_GEMS);

    const section = data?.homePageGemsSection;
    if (!section) return null;

    return {
      heading: section.sectionTitle,
      description: section.caption,
      buttonName: section.buttonContent?.text || '',
      buttonLink: section.buttonContent?.link || '',
      mapping_id: section.mapping_id || null,
    };
  } catch (error: any) {
    console.error('Failed to fetch home page gems:', error);
    return null;
  }
}

// ------------------------------
// LOYALTY TIERS
// ------------------------------
export async function getAllLoyaltyTiers(): Promise<{
  fetchAllLoyaltyTier: any[];
  error: string | null;
}> {
  try {
    const { FETCH_ALL_LOYALTY_TIERS } = await import('@/lib/loyaltyQueries');
    const client = graphqlClientManager.getClient(ClientPresets.LOYALTY);

    const data = await client.request<{
      fetchAllLoyaltyTier: any[];
    }>(FETCH_ALL_LOYALTY_TIERS, {});

    return {
      fetchAllLoyaltyTier: data?.fetchAllLoyaltyTier || [],
      error: null,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof ClientError
        ? err.response.errors?.map((e) => e.message).join(', ')
        : 'Unknown error occurred while fetching loyalty tiers';

    console.error('Failed to fetch loyalty tiers:', errorMessage);

    return {
      fetchAllLoyaltyTier: [],
      error: errorMessage || 'Error fetching loyalty tiers',
    };
  }
}

// ------------------------------
// SEO PAGE (REST API)
// ------------------------------
export {
  getSeoPage,
  getSeoPageSitemapEntries,
  getSeoPageSlugs,
  normalizeSeoPageEntry,
  seoPageResponseMatchesSlug,
} from './seo-page';
export type {
  SeoPageListItem,
  SeoPageProperty,
  SeoPageResponse,
  SeoPageResult,
  SeoPageSeoContent,
  SeoPageSitemapEntry,
} from './seo-page';
