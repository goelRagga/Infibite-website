import { Property } from '@/contexts/property/property-types';

declare namespace PropertyCardTypes {
  export type Variant =
    | 'default'
    | 'default-home'
    | 'prive-default'
    | 'prive-home';

  export type BadgeType =
    | 'featured'
    | 'sale'
    | 'popular'
    | 'new'
    | 'smart-tv'
    | 'pool';

  export interface Amenity {
    icon: string;
    label: string;
  }

  export interface BookingDetails {
    checkIn?: string;
    checkOut?: string;
    guestCount?: number;
    adultCount?: number;
    childrenCount?: number;
    petCount?: number;
    meals?: string[];
  }

  export interface Props {
    property: Partial<Property>;
    variant?: Variant;
    onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
    onCardClick?: (id: string) => void;
    className?: string;
    showActionButton?: boolean;
    isClickable?: boolean;
    queryString?: string;
    isRenderFeatures?: boolean;
    isRenderPrice?: boolean;
    isRenderAmenities?: boolean;
    peram?: string;
    isRecentlyViewed?: boolean;
    verticalPosition?: number;
    priority?: boolean;
    lazyLoadAmenityIcons?: boolean;
    showBrandLogo?: boolean;
  }
}

export default PropertyCardTypes;
