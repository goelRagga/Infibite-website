declare module 'api-types' {
  import { PriveFeatureCardProps } from '@/components/modules/Prive/PriveFeatureCard';
  import { Property } from '@/contexts/property';

  export interface ValueAddedService {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    applicableAdults: number;
    image: string;
    totalPrice: number;
    __typename: string;
  }

  interface GetValueAddedServicesResponse {
    propertiesRatesV1: {
      list: {
        id: string;
        name: string;
        valueAddedServices: ValueAddedService[];
      }[];
    };
  }

  export interface KeyValueResponse<Value = unknown> {
    keyValue: {
      value: Value;
    };
  }

  export interface HomePageContentData {
    HomePageContent: {
      banners: { urlMobile: string; urlDesktop: string }[];
    };
  }

  export interface PartnerLogosData {
    title: string;
    partnerLogos: {
      url: string;
      name: string;
    }[];
  }

  export interface AlliancesLogosData {
    title: string;
    alliancesLogos: {
      url: string;
      name: string;
    }[];
  }

  export interface PartnerSectionData {
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
  }

  export interface StatItem {
    icon: string;
    countingNumbers: string;
    countingFeature: string;
  }

  export interface StatsData {
    heading: string;
    description: string;
    data: StatItem[];
  }

  export interface EventItem {
    image: string;
    tagLine: string;
    title: string;
    description: string;
    link: string;
  }

  export interface EventSectionData {
    heading: string;
    description: string;
    events: EventItem[];
  }

  export interface StarStayItem {
    title: string;
    description: string;
    tag: string;
    index: number;
    video: {
      thumbnailWeb: string;
      videoWeb: string;
      thumbnailMobile: string;
      videoMobile: string;
    };
  }

  export interface StarStaysData {
    heading: string;
    description: string;
    data: StarStayItem[];
  }

  export interface StaysStoryData {
    heading: string;
    description: string;
    data: StarStayItem[];
  }

  export interface LoyaltyFAQData {
    LoyaltyFAQ: {
      title: string;
      data: {
        faq: LoyaltyFAQItem[];
      };
    };
  }

  export interface LoyaltyFAQItem {
    answer: string;
    question: string;
    id: string;
  }

  export interface SpecialCardItem {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition: 'top' | 'left' | 'bottom';
  }

  export interface SpecialCardData {
    heading: string;
    description: string;
    data: SpecialCardItem[];
  }

  export interface Metric {
    name: string;
    value: string;
    __typename: string;
  }

  export type PriveCardItem = Partial<Property>;

  export interface PriveCardData {
    heading: string;
    description: string;
    leftSideBackground: string;
    rightSideBackground: string;
  }

  export interface SpotlightItem {
    mobileImage: string;
    webImage: string;
    tag: string;
    tagIcon: string;
    tagBg: string;
    title: string;
    description: string;
    link: string;
  }

  export interface SpotlightData {
    heading: string;
    description: string;
    data: SpotlightItem[];
  }

  export interface OffersSectionData {
    heading: string;
    description: string;
    buttonName?: string;
  }

  export interface EnchantingAutumnEscapesData {
    heading: string;
    description: string;
    buttonName: string;
    buttonLink: string;
  }

  export interface DiscoverNewestGemsData {
    heading: string;
    description: string;
    buttonName: string;
    buttonLink: string;
  }

  export interface OffersResponse {
    offers: {
      code: string;
      description: string;
      endDateTime: string;
      termsAndConditions: string;
      maximumDiscountAllowed: number;
      title: string;
      discountPercentage: number;
      discountMethod: string;
      icon: string;
      minimumNights: number;
    }[];
  }

  export interface PriveHeroSectionData {
    heading: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    banner: {
      poster: string;
      mobileSrc: string;
      webSrc: string;
    };
  }

  export interface PriveEscapeCurationContent {
    heading: string;
    body1: string;
    body2: string;
    buttonText: string;
  }

  export interface PriveExperience {
    title: string;
    description: string;
    image?: string;
    alt?: string;
    area: string;
  }

  export interface PriveServicesSectionContent {
    heading: string;
    webDescription: string;
    mobileDescription: string;
    data: PriveExperience[];
  }

  export interface PriveSelectionData {
    heading: string;
    description: string;
    buttonName: string;
  }

  export interface PriveFeaturesData {
    heading: string;
    description: string;
    data: PriveFeatureCardProps['data'][];
  }

  export interface AskAIQuestionParams {
    propertyId: string;
    question: string;
    sessionId: string;
  }

  export interface AIQuestionResponse {
    response: string;
    status: string;
  }

  export interface BannerSectionResponse {
    BannerSection?: {
      banners?: Array<{
        startDateTime?: string;
        endDateTime?: string;
        image?: {
          mobileImage?: string;
          webImage?: string;
        };
        video?: {
          thumbnailMobile?: string;
          thumbnailWeb?: string;
          videoMobile?: string;
          videoWeb?: string;
        };
        target?: string;
        link?: string;
      }>;
    };
  }
}
