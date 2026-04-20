declare module 'prive-page-types' {
  import { Property } from '@/contexts/property';
  import {
    PriveHeroSectionData,
    EnchantingAutumnEscapesData,
    PriveCardData,
    SpotlightData,
    PriveEscapeCurationContent,
    PriveServicesSectionContent,
    PriveSelectionData,
    PriveFeaturesData,
    StaysStoryData,
  } from 'api-types';

  export interface PrivePageProps {
    priveHeroSectionData: PriveHeroSectionData | null;
    locations: Location[];
    priveSelection: PriveSelectionData | null;
    priveFeatures: PriveFeaturesData | null;
    seasonalRecommendations: EnchantingAutumnEscapesData | null;
    priveCards: PriveCardData | null;
    spotlightSection: SpotlightData | null;
    stayStories: StaysStoryData | null;
    priveProperties: Partial<Property>[] | null;
    privePropertiesDescending: Partial<Property>[] | null;
    priveEscapeCurationContent: PriveEscapeCurationContent | null;
    priveServicesSectionContent: PriveServicesSectionContent | null;
  }
}
