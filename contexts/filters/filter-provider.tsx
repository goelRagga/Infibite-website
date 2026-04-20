'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  CityOption,
  GuestsData,
  PropertyFilters,
  SecondaryPropertyFilterKeyType,
} from './filter-types';
import { FilterContext, initialFilterState } from './filter-context';
import { useURLParams } from '@/hooks/useURLParams';

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<PropertyFilters>(
    initialFilterState.filters
  );
  const [guestsData, setGuestsData] = useState<GuestsData>(
    initialFilterState.guestsData
  );

  const [openSecondaryFiltersDrawer, setOpenSecondaryFiltersDrawer] =
    useState(false);
  const [selectedSecondaryPropertyFilter, setSelectedSecondaryPropertyFilter] =
    useState<SecondaryPropertyFilterKeyType>('price');
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>('');
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [isDateSelected, setIsDateSelected] = useState<boolean | null>(false);

  // Initialize URL params hook
  const urlParams = useURLParams({
    preserveChannelId: false,
    scrollBehavior: false,
  });

  const updateFiltersFromParams = () => {
    // Get all relevant params from URL
    const urlFilters = urlParams.getParams<PropertyFilters>([
      'city',
      'checkinDate',
      'checkoutDate',
    ]);

    const urlGuestData = urlParams.getParams<GuestsData>([
      'numberOfGuests',
      'numberOfChildren',
    ]);

    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev) => ({
        ...prev,
        ...urlFilters,
      }));
    }

    if (Object.keys(urlGuestData).length > 0) {
      setGuestsData((prev) => ({
        ...prev,
        ...urlGuestData,
      }));
    }
  };

  const updateParams = (updates: Record<string, any>) => {
    urlParams.updateParams(updates);
  };

  const updateFilterParams = (filterUpdates: Partial<PropertyFilters>) => {
    updateParams(filterUpdates);
  };

  const updateGuestParams = (guestUpdates: Partial<GuestsData>) => {
    updateParams(guestUpdates);
  };

  const clearFilterParams = () => {
    urlParams.removeParams(['city', 'checkinDate', 'checkoutDate']);
  };

  const clearGuestParams = () => {
    urlParams.removeParams(['numberOfGuests', 'numberOfChildren']);
  };

  useEffect(() => {
    if (urlParams.searchParams.size > 0) {
      setTimeout(() => {
        updateFiltersFromParams();
      }, 500);
    }
  }, []);

  const contextValue = {
    // Existing state
    filters,
    setFilters,
    guestsData,
    setGuestsData,
    openSecondaryFiltersDrawer,
    setOpenSecondaryFiltersDrawer,
    selectedSecondaryPropertyFilter,
    setSelectedSecondaryPropertyFilter,
    selectedCitySlug,
    setSelectedCitySlug,
    cityOptions,
    setCityOptions,
    isDatePickerOpen,
    setDatePickerOpen,
    isDateSelected,
    setIsDateSelected,

    updateFiltersFromParams,
    updateParams,
    updateFilterParams,
    updateGuestParams,

    clearFilterParams,
    clearGuestParams,
    clearAllParams: urlParams.clearAllParams,

    urlParams,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}
