'use client';

import { createContext } from 'react';
import {
  AmountDetails,
  BookingReview,
  PageInfo,
  Property,
  PropertyContextState,
  propertyErrorState,
} from './property-types';

const initialPropertiesPageInfo: PageInfo = {
  currentPage: 0,
  hasNext: false,
  hasPrevious: false,
  pageSize: null,
  pagesCount: null,
  totalElementsCount: null,
};

const initialPropertyData: Property = {
  __typename: '',
  id: '',
  name: '',
  city: '',
  state: '',
  metrics: [],
  priceAmount: 0,
  googleMapEmbedLink: '',
  spaces: [],
  topAmenities: [],
  guidedVideoTour: [],
  nonBrandedGuidedVideoTour: [],
  images: [],
  quotes: [],
  defaultMedia: { __typename: '', name: '', url: '' },
  amenities: [],
  maxAdults: 0,
  maxChildren: 0,
  maxOccupancy: 0,
  streetLine: '',
  sections: [],
  faqs: [],
};

const initialPropertyErrorState: propertyErrorState = {
  isError: false,
  errorMessage: '',
};

const initialAmountDetails: AmountDetails = {
  gstAmount: 0,
  numberOfNights: 0,
  netPerNightAmountBeforeTax: 0,
  originalNetAmountBeforeTax: 0,
  netAmountAfterTax: 0,
  promotionDiscountAmount: 0,
  originalNetPerNightAmountBeforeTax: 0,
  netPerNightAmountAfterTax: 0,
  originalNetPerNightAmountAfterTax: 0,
  couponDiscountAmount: 0,
  mealCost: 0,
  cancellationPlan: null,
  cancellationPlans: null,
  netVasAmountBeforeTax: 0,
  splitPaymentAmount: 0,
  cancellationPolicies: null,
};

const initialBookingDetails: BookingReview = {
  id: '',
  name: '',
  city: '',
  state: '',
  metrics: [],
  defaultMedia: { __typename: '', name: '', url: '' },
  sections: [],
  quotes: [
    {
      gstAmount: 0,
      checkinDate: '',
      checkoutDate: '',
      adults: 0,
      children: 0,
      couponDiscountAmount: 0,
      couponDiscountPercentage: 0,
      netAmountAfterTax: 0,
      netAmountBeforeTax: 0,
      originalNetAmountBeforeTax: 0,
      numberOfGuests: 1,
      numberOfNights: 0,
      splitPaymentAmount: 0,
      netPerNightAmountAfterTax: 0,
      netPerNightAmountBeforeTax: 0,
      promotionDiscountAmount: 0,
      promotionCode: '',
      ratePlan: {
        id: '',
        code: '',
        description: '',
        displayName: '',
      },
      remainingAmountAfterSplitPayment: 0,
      couponCode: '',
      splitPaymentPercentage: 0,
      cancellationPlan: null,
      cancellationPlans: null,
      netVasAmountBeforeTax: 0,
    },
  ],
};

export const initialPropertyState: PropertyContextState = {
  properties: [],
  propertyErrorState: initialPropertyErrorState,
  property: initialPropertyData,
  propertiesPageInfo: initialPropertiesPageInfo,
  amountDetails: initialAmountDetails,
  bookingReview: initialBookingDetails,

  //Actions
  setProperties: () => {},
  setProperty: () => {},
  setPropertyErrorState: () => {},
  setPropertiesPageInfo: () => {},
  setAmountDetails: () => {},
  setBookingReview: () => {},
  handlePropertyError: () => {},
};

export const PropertyContext =
  createContext<PropertyContextState>(initialPropertyState);
