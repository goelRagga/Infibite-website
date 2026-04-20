declare module 'events-page' {
  interface EventsPageProps {
    seo?: SeoData;
    template?: EventsPage;
  }

  export interface EventsPage {
    eventsBanner?: string;
    eventsHeading?: string;
    eventsTitle?: string;
    eventsGallery?: eventsGallery[];
    valuesCard?: valuesCard[];
  }

  export interface MediaItemNode {
    id?: string;
    mediaItemUrl: string;
  }

  export interface AcfMediaItemConnectionEdge {
    node: MediaItemNode;
  }

  export interface EventsGallery {
    edges: AcfMediaItemConnectionEdge[];
  }
  export interface valuesCard {
    description?: string;
    logoIcon?: string;
    title?: string;
  }
}
