import { Dispatch, JSX, SetStateAction } from 'react';

export interface PropertyFilters {
  city?: string | null;
  checkinDate: string | null;
  checkoutDate: string | null;
  [key: string]: string | number | undefined | null;
  slug?: string | null;
}

export type SecondaryPropertyFilterKeyType =
  | 'sort'
  | 'price'
  | 'property_type'
  | 'bedrooms';

export interface GuestsData {
  numberOfGuests: number;
  numberOfChildren: number;
  max_adults: number;
  max_children: number;
  max_occupancy: number;
  standard_guests?: number;
  numberOfPets: number;
  max_pets: number;
}

export interface CityOption {
  value: string;
  label: string;
  icon?: JSX.Element;
  slug: string;
  region?: string;
  type?: string;
}

export interface PropertyType {
  name: string;
  slug: string;
  state: string;
}

export interface SecondaryPropertyFilters {
  bhkList?: number[];
  maxPrice?: number;
  minPrice?: number;
  isPetFriendly?: boolean;
  isPrive?: boolean;
  isStressed?: boolean;
}

export interface SecondaryPropertyFiltersAvailable {
  propertyFilters: {
    bhkFilter: number[];
    isPetFriendly?: boolean;
    isPrive?: boolean;
    propertyTypeFilter: PropertyType[];
    propertyBrand: string[];
    isStressed?: boolean;
    pricingFilter: {
      minPrice: number;
      maxPrice: number;
    };
  };
}

export interface FilterContextState {
  filters: PropertyFilters;
  guestsData: GuestsData;
  openSecondaryFiltersDrawer: boolean;
  selectedSecondaryPropertyFilter: SecondaryPropertyFilterKeyType;
  selectedCitySlug: string | null;
  cityOptions: CityOption[];
  isDatePickerOpen: boolean;
  isDateSelected: boolean | null;

  // Actions
  setFilters: Dispatch<SetStateAction<PropertyFilters>>;
  setGuestsData: Dispatch<SetStateAction<GuestsData>>;
  setOpenSecondaryFiltersDrawer: Dispatch<SetStateAction<boolean>>;
  setSelectedSecondaryPropertyFilter: Dispatch<
    SetStateAction<SecondaryPropertyFilterKeyType>
  >;
  setSelectedCitySlug: Dispatch<SetStateAction<string | null>>;
  setCityOptions: Dispatch<SetStateAction<CityOption[]>>;
  setDatePickerOpen: Dispatch<SetStateAction<boolean>>;
  setIsDateSelected: Dispatch<SetStateAction<boolean | null>>;
  updateFiltersFromParams: () => void;
  updateParams: (updates: Record<string, any>) => void;
  updateFilterParams: (filterUpdates: Partial<PropertyFilters>) => void;
  updateGuestParams: (guestUpdates: Partial<GuestsData>) => void;
  clearFilterParams: () => void;
  clearGuestParams: () => void;
  clearAllParams: () => void;

  urlParams: any;
}
