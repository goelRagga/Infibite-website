declare module 'home-page-types' {
  import {
    HomePageContentData,
    PartnerLogosData,
    AlliancesLogosData,
    PartnerSectionData,
    StatsData,
    EventSectionData,
    StarStaysData,
    StaysStoryData,
    SpecialCardData,
    PriveCardData,
    SpotlightData,
    OffersSectionData,
    EnchantingAutumnEscapesData,
    DiscoverNewestGemsData,
  } from 'api-types';
  export interface HomePageProps {
    locations: {
      id: string;
      name: string;
      slug: string;
    }[];
    cities: {
      name: string;
      noOfProperties: number;
      homepageImageUrl: string;
      slug: string;
      category: string;
      categoryIcon?: string;
    }[];
    rankedProperties: {
      propertiesList: any[];
      currentPage: number;
      error: string | null;
    };
    latestProperties: {
      propertiesList: any[];
      currentPage: number;
      error: string | null;
    };
    // Key-value data from CMS
    bannerContent: HomePageContentData | null;
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
    priveProperties: Partial<Property>[] | null;
    offersList: any;
  }
}
