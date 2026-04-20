// WordPress GraphQL Types

export interface WordPressImage {
  id: string;
  sourceUrl: string;
  altText?: string;
  title?: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface WordPressSEO {
  canonical?: string;
  metaDesc?: string;
  title?: string;
  opengraphTitle?: string;
  opengraphUrl?: string;
  twitterDescription?: string;
  metaRobotsNofollow?: string;
  metaRobotsNoindex?: string;
  twitterTitle?: string;
  schema?: {
    raw?: string;
  };
}

export interface WordPressAuthor {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: {
    url: string;
  };
}

export interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
}

export interface WordPressTag {
  id: string;
  name: string;
  slug: string;
}

export interface WordPressMenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId?: string;
  childItems?: {
    nodes: WordPressMenuItem[];
  };
}

export interface WordPressMenu {
  id: string;
  name: string;
  menuItems: {
    nodes: WordPressMenuItem[];
  };
}

export interface WordPressMediaItem {
  mediaItemUrl?: string;
  altText?: string;
  title?: string;
}

export interface WordPressFeaturedImage {
  node?: WordPressMediaItem;
}

export interface WordPressTemplate {
  templateName?: string;
}

// Base WordPress Node
export interface WordPressNode {
  id: string;
  slug?: string;
  uri?: string;
  status?: string;
}

// WordPress Page Types
export interface WordPressPage extends WordPressNode {
  title: string;
  content?: string;
  template?: WordPressTemplate;
  featuredImage?: WordPressFeaturedImage;
  seo?: WordPressSEO;
  enqueuedScripts?: {
    nodes?: Array<{ src?: string }>;
  };
  enqueuedStylesheets?: {
    nodes?: Array<{ src?: string }>;
  };
}

// WordPress Post Types
export interface WordPressPost extends WordPressNode {
  title: string;
  content?: string;
  excerpt?: string;
  date?: string;
  postId?: number;
  featuredImage?: WordPressFeaturedImage;
  seo?: WordPressSEO;
}

// WordPress Category Types
export interface WordPressCategory extends WordPressNode {
  name: string;
  blogCategory?: {
    categoryTitle?: string;
    categoryBlogsHeading?: string;
    categoryBanner?: string;
    categoryAboutImage?: string;
    categoryBriefOverview?: string;
    categoryExploreCityName?: string;
    categoryHeading?: string;
    categorySelectCheckbox?: boolean;
    categoryShortDescription?: string;
    categoryEventsRepeater?: Array<{
      categoryEventSideContent?: string;
      categoryLink?: string;
      categorySubTitle?: string;
      categoryEventImage?: string;
    }>;
  };
  seo?: WordPressSEO;
}

// Template-specific page types
export interface AboutPageTemplate {
  templateName: string;
  aboutPage?: {
    aboutPageBanner?: string;
    aboutPageHeading?: string;
    aboutPageSubHeading?: string;
    ourPurpose?: {
      fieldGroupName?: string;
      ourPurposeContent?: string;
      ourPurposeTitle?: string;
    };
    ourValues?: {
      fieldGroupName?: string;
      ourValuesContent?: string;
      ourValuesTitle?: string;
      ourValuesDetails?: Array<{
        fieldGroupName?: string;
        ourValuesIconContent?: string;
        ourValuesIconTitle?: string;
        ourValuesImageIcon?: string;
      }>;
    };
    advantagesRepeater?: Array<{
      content?: string;
      fieldGroupName?: string;
      sideImage?: string;
      title?: string;
    }>;
    fieldGroupName?: string;
  };
}

export interface PartnerPageTemplate {
  templateName: string;
  partnerWithUsPage?: {
    emailAdress?: string;
    fieldGroupName?: string;
    partnerWithUsBanner?: string;
    partnerWithUsBannerSmall?: string;
    partnerWithUsCardsRepeater?: Array<{
      cardContent?: {
        fieldGroupName?: string;
        pointDescription?: string;
        pointTitle?: string;
      };
      cardIcon?: string;
      cardTitle?: string;
      fieldGroupName?: string;
    }>;
    partnerWithUsChannels?: {
      fieldGroupName?: string;
      partnerWithUsChannelLogo?: string;
    };
    partnerWithUsHeading?: string;
    partnerWithUsOfficeAddress?: {
      fieldGroupName?: string;
      partnerWithUsAddress?: string;
      partnerWithUsBusinessAddress?: string;
    };
    partnerWithUsSubHeading?: string;
    phoneNumber?: string;
  };
}

export interface PrivacyPageTemplate {
  templateName: string;
  privacyPolicyPage?: {
    fieldGroupName?: string;
    privacyPolicyBanner?: string;
    privacyPolicyBannerSmall?: string;
    privacyPolicyHeading?: string;
    privacyPolicySubHeading?: string;
  };
}

export interface EventsPageTemplate {
  templateName: string;
  eventsAndCulture?: {
    eventContent?: string;
    eventsBanner?: string;
    eventsBannerSmall?: string;
    eventsHeading?: string;
    eventsSubHeading?: string;
    eventsTitle?: string;
    fieldGroupName?: string;
    eventsGallery?: {
      edges?: Array<{
        node?: {
          id: string;
          mediaItemUrl?: string;
        };
      }>;
    };
  };
}

export interface CorporatePageTemplate {
  templateName: string;
  corporatePage?: {
    corporateBanner?: string;
    corporateBannerSmall?: string;
    corporateBannerSubHeading?: string;
    corporateFeatures?: Array<{
      corporateFeatureImage?: string;
      corporateFeatureTitle?: string;
      fieldGroupName?: string;
    }>;
    corporateHappyClients?: Array<{
      corporateCliientLogo?: string;
      fieldGroupName?: string;
    }>;
    corporateHeading?: string;
    corporateReviews?: Array<{
      corporateReviewLogo?: string;
      corporateReviewRating?: number;
      fieldGroupName?: string;
    }>;
    corporateServices?: Array<{
      corporateServiceLogo?: string;
      corporateServiceName?: string;
      fieldGroupName?: string;
    }>;
    corporateTestimonials?: Array<{
      corporateTestimonialContent?: string;
      corporateTestimonialLogo?: string;
      corporateTestimonialName?: string;
      fieldGroupName?: string;
    }>;
    corporateWhyUsGroup?: Array<{
      corporateWhyUsContent?: string;
      corporateWhyUsContentTitle?: string;
      fieldGroupName?: string;
    }>;
    fieldGroupName?: string;
  };
}

export interface UpsellOffersPageTemplate {
  templateName: string;
  upsellOffersPage?: {
    fieldGroupName?: string;
    offerRepeater?: Array<{
      fieldGroupName?: string;
      offerImage?: string;
      offerName?: string;
    }>;
    upsellVideoLink?: string;
  };
}

export interface BankCreditCardPageTemplate {
  templateName: string;
  bankOffer?: {
    bankOfferBanner?: string;
    bankOfferBannerHeading?: string;
    bankOfferBannerLogo?: string;
    bankOfferBannerSmall?: string;
    bankOfferCardLayoutTitle?: string;
    bankOfferCardsLayout?: Array<{
      bankOfferCardsLayoutContent?: string;
      bankOfferCardsLayoutLogoSmall?: string;
      fieldGroupName?: string;
    }>;
    bankOfferModalFooter?: string;
    bankOfferModalImageData?: string;
    bankOfferModalTitle?: string;
    fieldGroupName?: string;
  };
}

export interface TermsPageTemplate {
  templateName: string;
  termsAndConditions?: {
    fieldGroupName?: string;
    termsAndConditionsBanner?: string;
    termsAndConditionsBannerSmall?: string;
    termsAndConditionsHeading?: string;
    termsAndConditionsSubHeading?: string;
  };
}

export interface PressReleasePageTemplate {
  templateName: string;
  pressReleasePage?: {
    fieldGroupName?: string;
    pressReleaseBanner?: string;
    pressReleaseData?: Array<{
      auhor?: string;
      date?: string;
      fieldGroupName?: string;
      imageLink?: string;
      link?: string;
      logos?: string;
      title?: string;
    }>;
    pressReleaseHeading?: string;
    pressReleaseShortDescription?: string;
  };
}

export interface ContactPageTemplate {
  templateName?: string;
  contactPage?: {
    addressMapLink?: string;
    contactPageBanner?: string;
    contactPageHeading?: string;
    contactPageSubHeading?: string;
    customerSupportDescription?: string;
    customerSupportEmailAddress?: string;
    customerSupportPhoneNumber?: string;
    customerSupportTitle?: string;
    mediaEnquiriesDescription?: string;
    mediaEnquiriesEmailAddress?: string;
    mediaEnquiriesTitle?: string;
    officeAddress?: string;
  };
}

export interface CareerPageTemplate {
  templateName: string;
  careerListingPage?: {
    bannerlisting?: string;
    careerContent?: string;
    careerListingGallery?: {
      nodes?: Array<{
        mediaItemUrl?: string;
      }>;
    };
    careerTitle?: string;
    fieldGroupName?: string;
    headinglisting?: string;
    shortDescriptionListing?: string;
  };
}

export interface TeamPageTemplate {
  templateName: string;
  teamMembers?: {
    advisorsAndInvestors?: Array<{
      fieldGroupName?: string;
      investorImage?: string;
      investorLinkedinUrl?: string;
      investorTitle?: string;
    }>;
    fieldGroupName?: string;
    leadershipTeamMembers?: Array<{
      fieldGroupName?: string;
      memberDesignation?: string;
      memberImage?: string;
      memberLinkedinUrl?: string;
      memberName?: string;
    }>;
    managementTeamMembers?: Array<{
      fieldGroupName?: string;
      memberDesignation?: string;
      memberImage?: string;
      memberLinkedinUrl?: string;
      memberName?: string;
    }>;
    teamPageBanner?: string;
    teamPageHeading?: string;
    teamPageSubHeading?: string;
    founderTeamMembers?: Array<{
      fieldGroupName?: string;
      memberDescription?: string;
      memberDesignation?: string;
      memberImage?: string;
      memberLinkedinUrl?: string;
      memberName?: string;
    }>;
  };
}

export interface VisaPageTemplate {
  templateName: string;
  visaLandingPage?: {
    fieldGroupName?: string;
    firstOffersRepeater?: Array<{
      fieldGroupName?: string;
      offerContent?: string;
      offerCouponCode?: string;
      offerCouponLable?: string;
      offerTitle?: string;
      offerPropertySlider?: Array<{
        fieldGroupName?: string;
        visaPropertyImage?: string;
        visaPropertyLink?: {
          url?: string;
        };
        visaPropertyName?: string;
      }>;
      offerTerms?: Array<{
        fieldGroupName?: string;
        offerTermDescription?: string;
        offerTermTitle?: string;
      }>;
      offerTitleCta?: {
        target?: string;
        title?: string;
        url?: string;
      };
    }>;
    visaLandingBanner?: string;
    howToRedeem?: string;
    visaLandingBannerSmall?: string;
    visaLandingContactNumber?: string;
    visaLandingHeading?: string;
    visaTermsAndConditions?: string;
  };
}

export interface VisaTemplate {
  fieldGroupName?: string;
  visaBanner?: string;
  visaBannerMobile?: string;
  brandCardsHeading?: string;
  brandCardsContent?: string;
  brandCards?: Array<{
    brandCardImageLink?: string;
    fieldGroupName?: string;
    brandLink?: string;
  }>;
  discountContent?: string;
  discountHeading?: string;
  discountRepeaterCard?: Array<{
    discountContent?: string;
    discountIcon?: string;
    discountTitle?: string;
    fieldGroupName?: string;
  }>;
  promotionContent?: string;
  promotionTerms?: string;
  brandCardsMobile?: Array<{
    brandCardImageLink?: string;
    fieldGroupName?: string;
    brandLink?: string;
  }>;
}

export interface CampaignPageTemplate {
  templateName: string;
  content?: string;
  enqueuedStylesheets?: {
    edges?: Array<{
      node?: {
        src?: string;
      };
    }>;
  };
}

// Home Page Template
export interface HomePageTemplate {
  fieldGroupName?: string;
  homePageBanner?: string;
  homePageHeading?: string;
}

// Response Types
export interface WordPressPostsResponse {
  nodes: WordPressPost[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: string;
    startCursor?: string;
  };
}

export interface WordPressPagesResponse {
  nodes: WordPressPage[];
}

export interface WordPressCategoriesResponse {
  nodes: WordPressCategory[];
}

// Extended Page Types with Templates
export interface WordPressPageWithTemplate extends WordPressPage {
  template?:
    | WordPressTemplate
    | AboutPageTemplate
    | PartnerPageTemplate
    | PrivacyPageTemplate
    | EventsPageTemplate
    | CorporatePageTemplate
    | UpsellOffersPageTemplate
    | BankCreditCardPageTemplate
    | TermsPageTemplate
    | PressReleasePageTemplate
    | ContactPageTemplate
    | CareerPageTemplate
    | TeamPageTemplate
    | VisaPageTemplate
    | CampaignPageTemplate;
  homePage?: HomePageTemplate;
  visa?: VisaTemplate;
}

// API Response Types
export interface WordPressAPIResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

// Custom Post Type: Villa Reviews
export interface VillaReviewFields {
  villaId: string;
  rating: number;
  guestName: string;
  guestEmail: string;
  reviewDate: string;
  amenitiesRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
}

export interface VillaReview {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  villaReviewFields: VillaReviewFields;
  featuredImage?: {
    node: WordPressImage;
  };
}

export interface VillaReviewsResponse {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  nodes: VillaReview[];
}

// Custom Post Type: Destinations
export interface DestinationFields {
  location: string;
  description: string;
  highlights: string;
  bestTimeToVisit: string;
  averageTemperature: string;
  distanceFromAirport: string;
}

export interface Destination {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  uri: string;
  date: string;
  modified: string;
  destinationFields: DestinationFields;
  featuredImage?: {
    node: WordPressImage;
  };
}

export interface DestinationsResponse {
  nodes: Destination[];
}

// Custom Post Type: Experiences
export interface ExperienceFields {
  duration: string;
  difficulty: string;
  groupSize: string;
  price: string;
  location: string;
  included: string;
  notIncluded: string;
  requirements: string;
}

export interface Experience {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  uri: string;
  date: string;
  modified: string;
  experienceFields: ExperienceFields;
  featuredImage?: {
    node: WordPressImage;
  };
  categories: {
    nodes: WordPressCategory[];
  };
}

export interface ExperiencesResponse {
  nodes: Experience[];
}

// Search Response
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  uri: string;
  date?: string;
  featuredImage?: {
    node: WordPressImage;
  };
}

export interface SearchResponse {
  posts: {
    nodes: SearchResult[];
  };
  pages: {
    nodes: SearchResult[];
  };
}
