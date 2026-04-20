import HomeModule from '@/components/modules/Home';
import { Property } from '@/contexts/property';
import {
  getAllLoyaltyTiers,
  getCitiesWithDetails,
  getEventPropertiesByTag,
  getHomePageBanners,
  getHomePageEscape,
  getHomePageEvents,
  getHomePageGems,
  getHomePageMetrics,
  getHomePagePartnerships,
  getHomePageSpotlight,
  getHomePageStarStays,
  getHomePageStories,
  getKeyValueData,
  getLocationsData,
  getOffers,
  getPropertyListWithSorting,
} from '@/lib/api';
import { KEY_VALUE_KEYS } from '@/lib/constants';
import {
  AlliancesLogosData,
  DiscoverNewestGemsData,
  EnchantingAutumnEscapesData,
  EventSectionData,
  HomePageContentData,
  OffersSectionData,
  PartnerLogosData,
  PartnerSectionData,
  PriveCardData,
  SpecialCardData,
  SpotlightData,
  StarStaysData,
  StatsData,
  StaysStoryData,
} from 'api-types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'ELIVAAS | Luxury Villa Vacation Rentals & Private Holiday Homes in India',
  alternates: {
    canonical: 'https://www.elivaas.com',
  },
  description:
    'Discover ELIVAAS, offering luxury villa vacation rentals and private holiday homes across India for serene getaways, family stays, and celebrations.',
  openGraph: {
    title:
      'ELIVAAS | Luxury Villa Vacation Rentals & Private Holiday Homes in India',
    description:
      'Discover ELIVAAS, offering luxury villa vacation rentals and private holiday homes across India for serene getaways, family stays, and celebrations.',
    type: 'website',
  },
};

interface HomePageResults {
  partnerLogos: PartnerLogosData | null;
  allianceLogos: AlliancesLogosData | null;
  partnerWithUsSection: PartnerSectionData | null;
  statsSection: StatsData | null;
  eventsSection: EventSectionData | null;
  starStays: StarStaysData | null;
  stayStories: StaysStoryData | null;
  specialCards: SpecialCardData | null;
  priveCards: PriveCardData | null;
  spotlightSection: SpotlightData | null;
  offersSection: OffersSectionData | null;
  seasonalRecommendations: EnchantingAutumnEscapesData | null;
  newestProperties: DiscoverNewestGemsData | null;
}

interface PropertyResponse {
  propertiesList: Partial<Property>[];
  currentPage: number;
  error: string | null;
}

const getRankedProperties = async (): Promise<PropertyResponse> => {
  return await getPropertyListWithSorting({
    sortField: 'rank',
    sortDirection: 'ASCENDING',
  });
};
const getLatestProperties = async (): Promise<PropertyResponse> => {
  return await getPropertyListWithSorting({
    sortField: 'liveDate',
    sortDirection: 'DESCENDING',
  });
};

const getPriveProperties = async (): Promise<PropertyResponse> => {
  return await getPropertyListWithSorting(
    {
      sortField: 'rank',
      sortDirection: 'ASCENDING',
    },
    {
      isPrive: true,
    }
  );
};

const getHomePageDataWithBatching = async () => {
  try {
    const [
      locationsResult,
      citiesResult,
      starStaysResult,
      bannersResult,
      spotlightResult,
      escapeResult,
      gemsResult,
      storiesResult,
      eventsResult,
      metricsResult,
      partnershipsResult,
      loyaltyTiersResult,
    ] = await Promise.allSettled([
      getLocationsData(),
      getCitiesWithDetails(),
      getHomePageStarStays(),
      getHomePageBanners('homepage'),
      getHomePageSpotlight(),
      getHomePageEscape(),
      getHomePageGems(),
      getHomePageStories(),
      getHomePageEvents(),
      getHomePageMetrics(),
      getHomePagePartnerships(),
      getAllLoyaltyTiers(),
    ]);

    const locations: any[] =
      locationsResult.status === 'fulfilled' &&
      Array.isArray(locationsResult.value)
        ? locationsResult.value
        : [];
    const cities: any[] =
      citiesResult.status === 'fulfilled' && Array.isArray(citiesResult.value)
        ? citiesResult.value
        : [];

    const starStaysData =
      starStaysResult.status === 'fulfilled' ? starStaysResult.value : null;

    const bannersData =
      bannersResult.status === 'fulfilled' ? bannersResult.value : null;

    const bannerContent: HomePageContentData | null =
      bannersData && !bannersData.error && Array.isArray(bannersData.banners)
        ? {
            HomePageContent: {
              banners: bannersData.banners,
            },
          }
        : null;

    const spotlightData =
      spotlightResult.status === 'fulfilled' ? spotlightResult.value : null;

    const escapeData =
      escapeResult.status === 'fulfilled' ? escapeResult.value : null;

    const gemsData =
      gemsResult.status === 'fulfilled' ? gemsResult.value : null;

    const storiesData =
      storiesResult.status === 'fulfilled' ? storiesResult.value : null;

    const eventsData =
      eventsResult.status === 'fulfilled' ? eventsResult.value : null;

    const metricsData =
      metricsResult.status === 'fulfilled' ? metricsResult.value : null;

    const partnershipsData =
      partnershipsResult.status === 'fulfilled'
        ? partnershipsResult.value
        : null;

    const loyaltyTiersData =
      loyaltyTiersResult.status === 'fulfilled'
        ? loyaltyTiersResult.value
        : { fetchAllLoyaltyTier: [], error: null };

    if (spotlightResult.status === 'rejected') {
      console.error('Failed to fetch spotlight:', spotlightResult.reason);
    }
    if (escapeResult.status === 'rejected') {
      console.error('Failed to fetch escape:', escapeResult.reason);
    }
    if (gemsResult.status === 'rejected') {
      console.error('Failed to fetch gems:', gemsResult.reason);
    }
    if (storiesResult.status === 'rejected') {
      console.error('Failed to fetch stories:', storiesResult.reason);
    }
    if (eventsResult.status === 'rejected') {
      console.error('Failed to fetch events:', eventsResult.reason);
    }
    if (metricsResult.status === 'rejected') {
      console.error('Failed to fetch metrics:', metricsResult.reason);
    }
    if (partnershipsResult.status === 'rejected') {
      console.error('Failed to fetch partnerships:', partnershipsResult.reason);
    }
    if (loyaltyTiersResult.status === 'rejected') {
      console.error(
        'Failed to fetch loyalty tiers:',
        loyaltyTiersResult.reason
      );
    }

    if (locationsResult.status === 'rejected') {
      console.error('Failed to fetch locations:', locationsResult.reason);
    }
    if (citiesResult.status === 'rejected') {
      console.error('Failed to fetch cities:', citiesResult.reason);
    }
    if (starStaysResult.status === 'rejected') {
      console.error('Failed to fetch star stays:', starStaysResult.reason);
    }
    if (bannersResult.status === 'rejected') {
      console.error('Failed to fetch banners:', bannersResult.reason);
    }

    const keyValueRequests: Array<{
      key: string;
      name: keyof HomePageResults;
    }> = [
      { key: KEY_VALUE_KEYS.OFFERS_SECTION_CONTENT, name: 'offersSection' },
      { key: KEY_VALUE_KEYS.ALLIANCES_LOGOS_CONTENT, name: 'allianceLogos' },
      { key: KEY_VALUE_KEYS.PRIVE_CARD_CONTENT, name: 'priveCards' },
      { key: KEY_VALUE_KEYS.SPECIAL_CARD_CONTENT, name: 'specialCards' },
      {
        key: KEY_VALUE_KEYS.PARTNER_SECTION_CONTENT,
        name: 'partnerWithUsSection',
      },
      {
        key: KEY_VALUE_KEYS.DISCOVER_NEWEST_GEMS_CONTENT,
        name: 'newestProperties',
      },
      { key: KEY_VALUE_KEYS.PARTNER_LOGOS_CONTENT, name: 'partnerLogos' },
    ];

    const BATCH_SIZE = 3;
    const results: HomePageResults = {} as HomePageResults;

    for (let i = 0; i < keyValueRequests.length; i += BATCH_SIZE) {
      const batch = keyValueRequests.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(({ key, name }) =>
        getKeyValueData(key).then((data) => ({ name, data }))
      );
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        const itemName = batch[index].name;
        if (result.status === 'fulfilled') {
          results[itemName] = result.value.data;
        } else {
          console.error(`Failed to fetch ${itemName}:`, result.reason);
          results[itemName] = null;
        }
      });

      if (i + BATCH_SIZE < keyValueRequests.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    const escapePropertiesResult = escapeData?.mapping_id
      ? await Promise.allSettled([
          getEventPropertiesByTag({
            tag: escapeData.mapping_id,
            page: 0,
            pageSize: 4,
          }),
        ])
      : null;

    const escapeProperties =
      escapePropertiesResult &&
      escapePropertiesResult[0]?.status === 'fulfilled'
        ? escapePropertiesResult[0].value.list
        : [];

    if (
      escapePropertiesResult &&
      escapePropertiesResult[0]?.status === 'rejected'
    ) {
      console.error(
        'Failed to fetch escape properties:',
        escapePropertiesResult[0].reason
      );
    }

    const offersResult = await Promise.allSettled([getOffers()]);
    const offersList =
      offersResult[0].status === 'fulfilled' ? offersResult[0].value : null;

    // Log offers failure if it occurred
    if (offersResult[0].status === 'rejected') {
      console.error('Failed to fetch offers:', offersResult[0].reason);
    }
    return {
      locations,
      cities,
      bannerContent,
      partnerLogos: results.partnerLogos,
      allianceLogos: results.allianceLogos,
      partnerWithUsSection: partnershipsData,
      statsSection: metricsData,
      eventsSection: eventsData,
      starStays: starStaysData,
      stayStories: storiesData,
      specialCards: results.specialCards,
      priveCards: results.priveCards,
      spotlightSection: spotlightData,
      offersSection: results.offersSection,
      seasonalRecommendations: escapeData,
      newestProperties: results.newestProperties
        ? {
            ...results.newestProperties,
            heading: gemsData?.heading || results.newestProperties.heading,
            description:
              gemsData?.description || results.newestProperties.description,
            buttonName:
              gemsData?.buttonName || results.newestProperties.buttonName,
            buttonLink:
              gemsData?.buttonLink || results.newestProperties.buttonLink,
          }
        : null,
      escapeProperties,
      offersList,
      loyaltyTiers: loyaltyTiersData.fetchAllLoyaltyTier,
    };
  } catch (error) {
    console.error('Homepage data fetch failed:', error);
    throw error;
  }
};

const RootPage = async () => {
  const [
    homepageDataResult,
    rankedPropertiesResult,
    latestPropertiesResult,
    privePropertiesResult,
  ] = await Promise.allSettled([
    getHomePageDataWithBatching(),
    getRankedProperties(),
    getLatestProperties(),
    getPriveProperties(),
  ]);

  const homepageData =
    homepageDataResult.status === 'fulfilled'
      ? homepageDataResult.value
      : {
          bannerContent: null,
          starStays: null,
          spotlightSection: null,
          offersSection: null,
          allianceLogos: null,
          priveCards: null,
          eventsSection: null,
          stayStories: null,
          locations: [],
          cities: [],
          partnerLogos: null,
          partnerWithUsSection: null,
          statsSection: null,
          specialCards: null,
          seasonalRecommendations: null,
          newestProperties: null,
          escapeProperties: [],
          offersList: null,
          loyaltyTiers: [],
        };

  const extractPropertyData = (
    result: PromiseSettledResult<PropertyResponse>
  ): PropertyResponse => {
    if (
      result.status === 'fulfilled' &&
      result.value &&
      typeof result.value === 'object'
    ) {
      if (
        'propertiesList' in result.value &&
        Array.isArray(result.value.propertiesList)
      ) {
        return result.value;
      }
    }
    return {
      propertiesList: [],
      currentPage: 1,
      error:
        result.status === 'rejected'
          ? result.reason?.message || 'Failed to fetch'
          : 'Invalid response format',
    };
  };

  const rankedProperties = extractPropertyData(rankedPropertiesResult);
  const latestProperties = extractPropertyData(latestPropertiesResult);
  const priveProperties = extractPropertyData(privePropertiesResult);

  const {
    locations,
    cities,
    bannerContent,
    partnerLogos,
    allianceLogos,
    partnerWithUsSection,
    statsSection,
    eventsSection,
    starStays,
    stayStories,
    specialCards,
    priveCards,
    spotlightSection,
    offersSection,
    seasonalRecommendations,
    newestProperties,
    escapeProperties,
    offersList,
    loyaltyTiers,
  } = homepageData;
  return (
    <HomeModule
      rankedProperties={rankedProperties}
      latestProperties={latestProperties}
      locations={locations}
      cities={cities}
      bannerContent={bannerContent}
      partnerLogos={partnerLogos}
      allianceLogos={allianceLogos}
      partnerWithUsSection={partnerWithUsSection}
      statsSection={statsSection}
      eventsSection={eventsSection}
      starStays={starStays}
      stayStories={stayStories}
      specialCards={specialCards}
      priveCards={priveCards}
      spotlightSection={spotlightSection}
      offersSection={offersSection}
      seasonalRecommendations={seasonalRecommendations}
      newestProperties={newestProperties}
      escapeProperties={escapeProperties}
      gemsProperties={latestProperties?.propertiesList?.slice(0, 4) || []}
      priveProperties={priveProperties?.propertiesList?.slice(0, 4) || []}
      offersList={offersList}
      loyaltyTiers={loyaltyTiers}
    />
  );
};

export default RootPage;

export const revalidate = 1800;
