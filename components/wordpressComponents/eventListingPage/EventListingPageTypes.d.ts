declare module 'event-listing-page' {
  type PageType = 'events' | 'corporate-offsite';
  interface EventsListingPageProps {
    content?: string | Array | Object;
    propertyData?: string | Array | Object;
    eventPageType?: PageType;
    redirectUrl?: string;
    isPartnerSection?: boolean;
    isBannerInfoBox?: boolean;
    isEventSpaces?: boolean;
    isReviewSection?: boolean;
    isCorporateOffsite?: boolean;
  }
}
