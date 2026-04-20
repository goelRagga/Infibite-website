'use client';
import { createContext } from 'react';
import {
  FilterContextState,
  GuestsData,
  PropertyFilters,
} from './filter-types';

const initialFilters: PropertyFilters = {
  city: null,
  checkinDate: null,
  checkoutDate: null,
};

const initialguestsData: GuestsData = {
  numberOfGuests: 1,
  numberOfChildren: 0,
  max_adults: 100,
  max_children: 100,
  max_occupancy: 100,
  standard_guests: 20,
  numberOfPets: 0,
  max_pets: 10,
};

export const initialFilterState: FilterContextState = {
  filters: initialFilters,
  guestsData: initialguestsData,
  openSecondaryFiltersDrawer: false,
  selectedSecondaryPropertyFilter: 'price',
  selectedCitySlug: '',
  cityOptions: [],
  isDatePickerOpen: false,
  isDateSelected: false,

  // Empty action implementations for initial state
  setFilters: () => {},
  setGuestsData: () => {},
  setOpenSecondaryFiltersDrawer: () => {},
  setSelectedSecondaryPropertyFilter: () => {},
  setSelectedCitySlug: () => {},
  setCityOptions: () => {},
  setDatePickerOpen: () => {},
  setIsDateSelected: () => {},
  updateFiltersFromParams: () => {},
  updateParams: () => {},
  updateFilterParams: () => {},
  updateGuestParams: () => {},
  clearFilterParams: () => {},
  clearGuestParams: () => {},
  clearAllParams: () => {},

  urlParams: null,
};

export const FilterContext =
  createContext<FilterContextState>(initialFilterState);
