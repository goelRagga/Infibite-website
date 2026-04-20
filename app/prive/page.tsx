import Prive from '@/components/modules/Prive';
import { Property } from '@/contexts/property';
import {
  getHomePageSpotlight,
  getHomePageStories,
  getKeyValueData,
  getLocationsData,
  getPropertyListWithSorting,
} from '@/lib/api';
import { KEY_VALUE_KEYS } from '@/lib/constants';
import {
  EnchantingAutumnEscapesData,
  PriveCardData,
  PriveEscapeCurationContent,
  PriveServicesSectionContent,
  PriveHeroSectionData,
  PriveSelectionData,
  PriveFeaturesData,
  SpotlightData,
  StaysStoryData,
} from 'api-types';
import { cache } from 'react';

export const revalidate = 1800;

interface PrivePageResults {
  seasonalRecommendations: EnchantingAutumnEscapesData | null;
  priveCards: PriveCardData | null;
  spotlightSection: SpotlightData | null;
  stayStories: StaysStoryData | null;
  priveEscapeCurationContent: PriveEscapeCurationContent | null;
  priveServicesSectionContent: PriveServicesSectionContent | null;
  priveHeroSectionData: PriveHeroSectionData | null;
  priveSelectionData: PriveSelectionData | null;
  priveFeaturesData: PriveFeaturesData | null;
}

interface PropertyResponse {
  propertiesList: Partial<Property>[];
  currentPage: number;
  error: string | null;
}

const getRankedPriveProperties = cache(async (): Promise<PropertyResponse> => {
  return await getPropertyListWithSorting(
    {
      sortField: 'rank',
      sortDirection: 'ASCENDING',
    },
    {
      isPrive: true,
    }
  );
});

const getLatestPriveProperties = cache(async (): Promise<PropertyResponse> => {
  return await getPropertyListWithSorting(
    {
      sortField: 'liveDate',
      sortDirection: 'DESCENDING',
    },
    {
      isPrive: true,
    }
  );
});

const getPrivePageDataWithBatching = cache(async () => {
  try {
    const [locationsResult, spotlightResult, stayStoriesResult] =
      await Promise.allSettled([
        getLocationsData(),
        getHomePageSpotlight(),
        getHomePageStories(),
      ]);

    const locations: any[] =
      locationsResult.status === 'fulfilled' &&
      Array.isArray(locationsResult.value)
        ? locationsResult.value
        : [];

    if (locationsResult.status === 'rejected') {
      console.error('Failed to fetch locations:', locationsResult.reason);
    }

    const spotlightData =
      spotlightResult.status === 'fulfilled' ? spotlightResult.value : null;

    if (spotlightResult.status === 'rejected') {
      console.error('Failed to fetch spotlight:', spotlightResult.reason);
    }

    const stayStoriesData =
      stayStoriesResult.status === 'fulfilled' ? stayStoriesResult.value : null;

    if (stayStoriesResult.status === 'rejected') {
      console.error('Failed to fetch stay stories:', stayStoriesResult.reason);
    }

    type KeyValueResults = Omit<
      PrivePageResults,
      'spotlightSection' | 'stayStories'
    >;

    const keyValueRequests: Array<{
      key: string;
      name: keyof KeyValueResults;
    }> = [
      {
        key: KEY_VALUE_KEYS.ENCHANTING_AUTUMN_ESCAPES_CONTENT,
        name: 'seasonalRecommendations',
      },
      { key: KEY_VALUE_KEYS.PRIVE_CARD_CONTENT, name: 'priveCards' },
      {
        key: KEY_VALUE_KEYS.PRIVE_ESCAPE_CURATION_CONTENT,
        name: 'priveEscapeCurationContent',
      },
      {
        key: KEY_VALUE_KEYS.PRIVE_SERVICES_SECTION_CONTENT,
        name: 'priveServicesSectionContent',
      },
      {
        key: KEY_VALUE_KEYS.PRIVE_HERO_SECTION_CONTENT,
        name: 'priveHeroSectionData',
      },
      {
        key: KEY_VALUE_KEYS.PRIVE_SELECTION_CONTENT,
        name: 'priveSelectionData',
      },
      {
        key: KEY_VALUE_KEYS.PRIVE_FEATURES_CONTENT,
        name: 'priveFeaturesData',
      },
    ];

    const BATCH_SIZE = 3;
    const results: KeyValueResults = {} as KeyValueResults;

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

      // Add a small delay between batches to avoid overwhelming the API
      if (i + BATCH_SIZE < keyValueRequests.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return {
      locations,
      ...results,
      spotlightSection: spotlightData,
      stayStories: stayStoriesData,
    };
  } catch (error) {
    console.error('Prive page data fetch failed:', error);
    throw error;
  }
});

const PrivePage = async () => {
  const [
    privePageDataResult,
    rankedPrivePropertiesResult,
    latestPrivePropertiesResult,
  ] = await Promise.allSettled([
    getPrivePageDataWithBatching(),
    getRankedPriveProperties(),
    getLatestPriveProperties(),
  ]);

  const privePageData =
    privePageDataResult.status === 'fulfilled'
      ? privePageDataResult.value
      : {
          locations: [],
          seasonalRecommendations: null,
          priveCards: null,
          spotlightSection: null,
          stayStories: null,
          priveEscapeCurationContent: null,
          priveServicesSectionContent: null,
          priveHeroSectionData: null,
          priveSelectionData: null,
          priveFeaturesData: null,
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

  const rankedPriveProperties = extractPropertyData(
    rankedPrivePropertiesResult
  );
  const latestPriveProperties = extractPropertyData(
    latestPrivePropertiesResult
  );

  const {
    locations,
    seasonalRecommendations,
    priveCards,
    spotlightSection,
    stayStories,
    priveEscapeCurationContent,
    priveServicesSectionContent,
    priveHeroSectionData,
    priveSelectionData,
    priveFeaturesData,
  } = privePageData;

  return (
    <Prive
      priveHeroSectionData={priveHeroSectionData}
      locations={locations}
      seasonalRecommendations={seasonalRecommendations}
      priveProperties={rankedPriveProperties?.propertiesList?.slice(0, 4) || []}
      privePropertiesDescending={
        latestPriveProperties?.propertiesList?.slice(0, 4) || []
      }
      priveCards={priveCards}
      spotlightSection={spotlightSection}
      stayStories={stayStories}
      priveSelection={priveSelectionData}
      priveFeatures={priveFeaturesData}
      priveEscapeCurationContent={priveEscapeCurationContent}
      priveServicesSectionContent={priveServicesSectionContent}
    />
  );
};

export default PrivePage;
