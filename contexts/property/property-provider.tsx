'use client';

import { ReactNode, useState } from 'react';
import {
  AmountDetails,
  BookingReview,
  PageInfo,
  Property,
  propertyErrorState,
} from './property-types';
import { PropertyContext, initialPropertyState } from './property-context';

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property>(
    initialPropertyState.property
  );
  const [propertiesPageInfo, setPropertiesPageInfo] = useState<PageInfo>(
    initialPropertyState.propertiesPageInfo
  );
  const [propertyErrorState, setPropertyErrorState] =
    useState<propertyErrorState>(initialPropertyState.propertyErrorState);

  const [amountDetails, setAmountDetails] = useState<AmountDetails>(
    initialPropertyState.amountDetails
  );
  const [bookingReview, setBookingReview] = useState<BookingReview>(
    initialPropertyState.bookingReview
  );

  const handlePropertyError = (error: any) => {
    setPropertyErrorState({
      isError: true,
      errorMessage: error,
    });
  };

  const contextValue = {
    properties,
    property,
    propertyErrorState,
    propertiesPageInfo,
    amountDetails,
    bookingReview,
    setAmountDetails,
    setProperty,
    setProperties,
    setPropertyErrorState,
    setPropertiesPageInfo,
    handlePropertyError,
    setBookingReview,
  };

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
}
