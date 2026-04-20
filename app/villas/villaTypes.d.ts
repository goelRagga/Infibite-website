declare module 'villa-types' {
  export interface Offer {
    code: string;
    title: string;
    description: string;
    discountMethod: string;
    discountPercentage: number;
    maximumDiscountAllowed: number;
    minimumNights: number;
    endDateTime: string | null;
    icon: string;
    termsAndConditions: string;
    __typename: string;
  }

  export interface CityListProps {
    params: Promise<{
      city: string;
    }>;
  }

  export interface PropertyDetailsProps {
    params: Promise<{
      city: string;
      propertyType: string;
    }>;
  }
}
