declare module 'search-panel-types' {
  export interface SearchPanelProps {
    pageType?: string;
    storedFilterValues?: any;
    isPrive?: boolean;
    setClose?: any;
    openDrawer?: boolean;
    setOpenDrawer?: React.Dispatch<React.SetStateAction<boolean>> | any;
    locations?: {
      id: string;
      name: string;
      slug: string;
    }[];
    shouldScrollOnTabClick?: boolean;
    initialActiveIndex?: number | null;
    onActiveIndexChange?: () => void;
  }

  export interface TabItemProps {
    label: string;
    tabValue: string;
    isActive: boolean;
    onClick: () => void;
    pageType?: string;
    tabRef?: React.Ref<HTMLDivElement>;
  }

  export interface CityOption {
    value: string;
    label: string;
    type: string;
    slug: string;
    region?: string;
  }

  export interface Property {
    id: string;
    name?: string;
    title?: string;
    slug: string;
    citySlug: string;
    defaultMedia?: {
      url: string;
    };
  }

  export interface CityInputProps {
    cityOptions: CityOption[];
    onCitySelect: (city: CityOption) => void;
    onPropertySelect?: (property: Property) => void;
    className?: string;
  }
}
