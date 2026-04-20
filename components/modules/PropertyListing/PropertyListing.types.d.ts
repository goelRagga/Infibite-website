declare namespace PropertyListingTypes {
  export interface PropertyType {
    name: string;
    slug: string;
  }
  export interface SecondaryPropertyFiltersAvailable {
    propertyFilters: {
      bhkFilter: number[];
      isPetFriendly: boolean;
      isPrive: boolean;
      isStressed: boolean;
      propertyTypeFilter: PropertyType[];
      pricingFilter: {
        minPrice: number;
        maxPrice: number;
      };
    };
  }
  export interface LoyaltyExpiringCardContent {
    expiringDays?: number;
    title?: string;
    description?: string;
    validationDate?: string;
  }

  export interface Props {
    propertiesList: Property[];
    initialPropertiesPageInfo?: PageInfo;
    advanceFilterData?: SecondaryPropertyFiltersAvailable;
    // cityProperties?: Property[];
    cityContent?: any;
    citySlug?: any;
    city?: string;
    offersList?: Offer[];
    locations?: {
      id: string;
      name: string;
      slug: string;
    }[];
    loyaltyExpiringCardContent?: LoyaltyExpiringCardContent | null;
  }
}

export default PropertyListingTypes;
