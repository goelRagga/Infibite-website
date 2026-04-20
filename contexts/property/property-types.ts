import { Dispatch, SetStateAction } from 'react';

export interface Price {
  priceAmount: number;
}
export interface Metric {
  __typename: string;
  name: string;
  value: string;
}

export interface Image {
  __typename: string;
  name: string;
  url: string;
}

export interface DefaultMedia {
  __typename: string;
  name?: string | null;
  url: string;
}
export interface Amenity {
  __typename: string;
  icon: string;
  name: string;
  category?: string;
}
export interface GuidedVideoTour {
  __typename: string;
  videoWeb: string;
  videoMobile: string;
  thumbnailWeb: string;
  thumbnailMobile: string;
}

export interface NonBrandedGuidedVideoTour {
  __typename: string;
  videoWeb: string;
  videoMobile: string;
  thumbnailWeb: string;
  thumbnailMobile: string;
}
export interface Space {
  __typename: string;
  title: string;
  url: string;
  description: string;
}

export interface Section {
  content: string;
  title: string;
  url?: string | null;
  __typename: string;
}

export interface FaqList {
  question: string;
  answer: string;
  __typename: string;
}

export interface Faq {
  category: string;
  list: FaqList[];
  __typename: string;
}
export interface Quotes {
  checkinDate: string;
  checkoutDate: string;
  ratePlanId: string;
  ratePlanName: string;
  netAmountAfterTax: string;
}

export interface RatePlan {
  __typename?: 'RatePlan';
  code: string;
  description: string;
  displayName: string;
  id: string;
}

export interface RatePlans {
  __typename: 'Quote';
  ratePlan: RatePlan;
  gstAmount: number;
  netAmountBeforeTax: number;
  netPerNightAmountBeforeTax: number;
  netPerNightAmountAfterTax: number;
  netPerNightGstAmount: number;
}

export interface ApplicableCancellationPlan {
  discountAmount: number;
  messages: string[];
  offerType: string;
  offerValue: number;
  ruleDescription: string;
  ruleId: string;
  ruleName: string;
}

export interface ValueAddedService {
  id: string;
  basePrice?: number;
  code?: string;
  description?: string;
  price?: number;
  netAmountBeforeTax?: number;
  quantity: number;
  totalPrice?: number;
  image?: string;
  name: string;
  gstAmount?: number;
  __typename?: string;
}

export interface Quote {
  id?: any;
  gstAmount?: number;
  checkinDate?: string;
  checkoutDate?: string;
  adults?: number;
  children?: number;
  originalNetAmountBeforeTax?: number;
  netAmountAfterTax?: number;
  netAmountBeforeTax?: number;
  netPerNightAmountBeforeTax?: number;
  originalNetPerNightAmountAfterTax?: number;
  netPerNightAmountAfterTax?: number;
  numberOfGuests?: number;
  numberOfNights?: number;
  splitPaymentAmount?: number;
  ratePlan?: RatePlan;
  remainingAmountAfterSplitPayment?: number;
  originalNetPerNightAmountBeforeTax?: number;
  splitPaymentPercentage?: number;
  couponCode?: string;
  bankOfferCode?: string;
  promotionCode?: string;
  couponDiscountAmount?: number;
  paymentDiscountAmount?: number;
  promotionDiscountAmount?: number;
  extraAmount?: number;
  couponDiscountApplied?: boolean;
  paymentDiscountApplied?: boolean;
  promotionDiscountApplied?: boolean;
  couponDiscountPercentage?: number;
  promotionDiscountPercentage?: number;
  paymentDiscountPercentage?: number;
  mealCost?: any;
  cancellationPlans: ApplicableCancellationPlan[] | null;
  cancellationPlan: ApplicableCancellationPlan | null;
  valueAddedServices?: ValueAddedService[];
  netVasAmountBeforeTax?: number;
  soldOut?: boolean;
  cancellationPolicies?: any;
  bankOfferPercentage?: number;
  icon?: string;
  shortDescription?: string;
}

export interface GuestInfo {
  guestname: string;
  mobile: string;
  email: string;
}

export interface ErrorState {
  isError: boolean;
  errorMessage: object;
}

export interface propertyErrorState {
  isError: boolean;
  errorMessage: string;
}

export interface Property {
  __typename: string;
  id: string;
  brand?: string;
  name: string;
  city: string;
  state?: string;
  location?: string;
  isHighDemand?: boolean;
  metrics: Metric[];
  priceAmount: number;
  virtualTourUrl?: string | null;
  spaces?: Space[];
  topAmenities?: Amenity[];
  quotes?: Quote[] | null;
  images: Image[];
  googleMapEmbedLink: string;
  defaultMedia: DefaultMedia;
  amenities?: Amenity[];
  maxAdults?: number;
  maxChildren?: number;
  maxOccupancy?: number;
  streetLine?: string;
  sections?: Section[];
  faqs?: Faq[] | null;
  guestInfo?: GuestInfo[];
  elfSightClassId?: string | null;
  isPrive?: boolean;
  slug?: string;
  citySlug?: string;
  guidedVideoTour?: GuidedVideoTour[];
  nonBrandedGuidedVideoTour?: NonBrandedGuidedVideoTour[];
  numberOfOffers?: number;
  isNew?: boolean;
  metaTag?: {
    description?: string | null;
    keywords: string;
    title: string;
    __typename: string;
  };
  rating?: string | number | null;
  badges?: string[];
  review?: {
    rating?: string | number | null;
    __typename: string;
  };
  isPetFriendly?: boolean;
}

export interface PageInfo {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number | null;
  pagesCount: number | null;
  totalElementsCount: number | null;
}

export interface PropertiesRates {
  __typename: string;
  list: Property[];
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  pagesCount: number;
  totalElementsCount: number;
}

// Property Interface
export interface Properties {
  // id?: string;
  propertiesRatesV1: PropertiesRates;
  __typename: string;
}

export interface AmountDetails {
  gstAmount?: number;
  originalNetAmountBeforeTax: number;
  netVasAmountBeforeTax: number;
  netAmountAfterTax: number;
  netPerNightAmountBeforeTax: number;
  originalNetPerNightAmountBeforeTax?: number;
  numberOfNights?: number;
  netPerNightAmountAfterTax?: number;
  originalNetPerNightAmountAfterTax?: number;
  splitPaymentPercentage?: number;
  splitPaymentAmount?: number;
  couponCode?: string;
  bankOfferCode?: string;
  promotionCode?: string;
  couponDiscountAmount?: number;
  paymentDiscountAmount?: number;
  promotionDiscountAmount?: number;
  couponDiscountPercentage?: number;
  paymentDiscountPercentage?: number;
  promotionDiscountPercentage?: number;
  mealCost: any;
  cancellationPlan: ApplicableCancellationPlan | null;
  cancellationPlans: ApplicableCancellationPlan[] | null;
  cancellationPolicies?: any;
}

export interface BookingReview {
  slug?: any;
  id: string;
  name: string;
  city: string;
  state?: string;
  metrics: Metric[];
  defaultMedia: DefaultMedia;
  sections?: Section[];
  quotes?: Quote[];
  maxAdults?: number;
  maxChildren?: number;
  maxOccupancy?: number;
  isPrive?: boolean;
}

export interface PropertyContextState {
  properties: Property[];
  propertyErrorState: propertyErrorState;
  property: Property;
  propertiesPageInfo: PageInfo;
  amountDetails: AmountDetails;
  bookingReview: BookingReview;

  //Actions
  setProperties: Dispatch<SetStateAction<Property[]>>;
  setProperty: Dispatch<SetStateAction<Property>>;
  setPropertyErrorState: Dispatch<SetStateAction<propertyErrorState>>;
  setPropertiesPageInfo: Dispatch<SetStateAction<PageInfo>>;
  setAmountDetails: Dispatch<SetStateAction<AmountDetails>>;
  setBookingReview: Dispatch<SetStateAction<BookingReview>>;
  handlePropertyError: (error: any) => void;
}
