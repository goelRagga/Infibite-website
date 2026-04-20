declare module 'footerTypes' {
  interface Area {
    name: string;
    slug: string;
  }

  interface City {
    name: string;
    slug: string;
    areas?: Area[];
  }

  interface Region {
    name: string;
    slug: string;
    cities: City[];
  }

  // Raw API response types
  interface AreaData {
    name: string;
    slug: string;
  }

  interface CityData {
    name: string;
    slug: string;
    areas?: AreaData[] | null;
  }

  interface RawStateData {
    name: string;
    slug: string;
    cities: CityData[];
  }

  interface FooterRegionListProps {
    regions: Region[];
    isMobile?: boolean;
    loading?: boolean;
  }
}
