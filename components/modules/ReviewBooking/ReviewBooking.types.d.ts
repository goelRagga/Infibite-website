export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqList {
  list: FaqItem[];
}

export interface SectionItem {
  title?: string;
  content?: string;
}

export interface ValueAddedServiceItem {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  applicableAdults: number;
  image: string;
}

export interface Offer {
  id: string;
  name: string;
  discountValue: number;
  code: string;
  minBookingAmount: number;
  validFrom: string;
  validTo: string;
}

export interface ReviewBookingDetail {
  sections?: SectionItem[];
  faqs?: FaqList[];
}

// Main props for ReviewBookingModule
export interface Props {
  reviewBookingDetail?: ReviewBookingDetail;
  offers: Offer[];
}

export interface AddOnnServicesProps {
  valueAddedServices: ValueAddedServiceItem[];
}

declare namespace ReviewBookingTypes {
  export type Props = import('./ReviewBooking.types').Props;
  export type AddOnnServices =
    import('./ReviewBooking.types').AddOnnServicesProps;

  export type FaqItem = import('./ReviewBooking.types').FaqItem;
  export type FaqList = import('./ReviewBooking.types').FaqList;
  export type SectionItem = import('./ReviewBooking.types').SectionItem;
  export type ValueAddedServiceItem =
    import('./ReviewBooking.types').ValueAddedServiceItem;
  export type Offer = import('./ReviewBooking.types').Offer;
  export type ReviewBookingDetail =
    import('./ReviewBooking.types').ReviewBookingDetail;
}

export interface GuestDetailsChangeResult {
  hasChanges: boolean;
  changedFields: string[];
  signupPayload: SignupPayload | null;
}

export interface SignupPayload {
  id: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
}

export interface GuestData {
  id: string;
  salutation: 'Mr.' | 'Mrs.' | 'Ms.';
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  countryCode: string;
  phoneVerified: boolean;
}

export default ReviewBookingTypes;
