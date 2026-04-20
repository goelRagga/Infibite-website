declare namespace PropertyDetailsTypes {
  export interface PropertyDetailProps {
    propertyInfo: any;
    breadcrumb?: any;
    valueAddedServices?: any;
    initialOffers?: any;
    stayStories?: any;
    pageName?: string;
  }

  export interface ImageSectionProps {
    data: Image[];
    virtualTourUrl?: string;
    isPropertyDetail?: boolean;
    brand?: string;
    propertyName?: string;
    city?: string;
    location?: string;
    state?: string;
    pageName?: string;
    propertyId?: string;
    is_checkin_out_entered?: boolean;
    guidedVideoTour?: GuidedVideoTour | null;
    nonBrandedGuidedVideoTour?: NonBrandedGuidedVideoTour | null;
  }

  export interface InfoSectionProps {
    propertyId?: string;
    is_checkin_out_entered?: boolean;
    name?: string;
    city?: string;
    location?: string;
    metrics?: Metrics[];
    isHighDemand?: boolean;
    isPetFriendly?: boolean;
    review?: {
      rating: number;
      numberOfReviews: number;
    };
    backHref?: any;
    className?: string;
    isArrow?: boolean;
    isBookingConfirmIcon?: boolean;
    onShareClick?: () => void;
    tabs?: any;
    state?: any;
    brandedBrochure?: string;
  }

  export interface PropertyImages {
    images?: Images[];
    imageModal: boolean;
    setImageModal: any;
  }
  export interface VIllaAboutProps {
    data?: Data[];
    faqs?: faqs[];
  }

  export interface MapInfoProps {
    googleMapEmbedLink?: string;
    nearestLocation?: any;
    isPrive?: boolean;
  }
  export type Section = {
    __typename: string;
    title: string;
    content: string;
    url: string | null;
  };
}

export default PropertyDetailsTypes;
