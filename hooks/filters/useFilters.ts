import { FilterContext, PropertyFilters } from '@/contexts';
import { useCallback, useContext, useMemo } from 'react';

export const useFilters = () => {
  const {
    filters,
    setFilters,
    updateFilterParams,
    cityOptions,
    setCityOptions,
    clearFilterParams,
    urlParams,
  } = useContext(FilterContext);

  // Memoize the updateFilterParams function to prevent unnecessary re-renders
  const memoizedUpdateFilterParams = useMemo(
    () => updateFilterParams,
    [updateFilterParams]
  );

  const updateFilter = useCallback(
    (
      key: keyof PropertyFilters,
      value: string | number | null,
      updateUrl = true
    ) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };

        if (value !== null && value !== undefined) {
          updatedFilters[key] = value;
        } else {
          delete updatedFilters[key];
        }

        // Update URL if needed
        if (updateUrl) {
          memoizedUpdateFilterParams(updatedFilters);
        }

        return updatedFilters;
      });
    },
    [setFilters, memoizedUpdateFilterParams]
  );

  const updateMultipleFilters = useCallback(
    (updates: Partial<PropertyFilters>, updateUrl = true) => {
      setFilters((prevFilters) => {
        // Create a copy of current filters
        const updatedFilters = { ...prevFilters };

        // Apply each update, removing keys with null values
        Object.entries(updates).forEach(([key, value]) => {
          updatedFilters[key as keyof PropertyFilters] = value;
        });

        // Update URL if needed
        if (updateUrl) {
          memoizedUpdateFilterParams(updatedFilters);
        }

        return updatedFilters;
      });
    },
    [setFilters, memoizedUpdateFilterParams]
  );

  return {
    filters,
    cityOptions,
    setCityOptions,
    updateFilter,
    updateMultipleFilters,
    clearFilterParams,
    urlParams,
  };
};
