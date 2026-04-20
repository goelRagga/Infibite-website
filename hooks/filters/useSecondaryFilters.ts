'use client';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useContext } from 'react';

import PropertyListingTypes from '@/components/modules/PropertyListing/PropertyListing.types';
import {
  FilterContext,
  SecondaryPropertyFilterKeyType,
  SecondaryPropertyFilters,
} from '@/contexts';
import {
  brandNames,
  PROPERTIES_LIST_ROUTE,
  SEARCH_PARAM,
} from '@/lib/constants';

export interface SortFilterPayload {
  field: string;
  direction: string;
}

export const sortFilterOptions: Record<
  string,
  { payload?: SortFilterPayload; label: string }
> = {
  'price-asc': {
    payload: {
      field: 'priceAmount',
      direction: 'ASCENDING',
    },
    label: 'Price Low to high',
  },
  'price-desc': {
    payload: {
      field: 'priceAmount',
      direction: 'DESCENDING',
    },
    label: 'Price High to low',
  },
  popularity: {
    label: 'Popularity',
  },
};

const DEFAULT_SORT_FILTER = 'popularity';

export const useSecondaryFilters = (
  secondaryPropertyFiltersAvailable?: PropertyListingTypes.SecondaryPropertyFiltersAvailable
) => {
  // UI Filter drawer state from context
  const {
    openSecondaryFiltersDrawer,
    setOpenSecondaryFiltersDrawer,
    selectedSecondaryPropertyFilter,
    setSelectedSecondaryPropertyFilter,
    guestsData,
  } = useContext(FilterContext);

  const pathname = usePathname();
  const params = useParams<{ city?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pushUrl = (href: string) => {
    const newPath = href.split('?')[0];
    if (pathname !== newPath) {
      router.push(href);
    } else {
      window.history.pushState(null, '', href);
    }
  };

  const secondaryPropertyFilters = {
    minPrice: searchParams.has(SEARCH_PARAM.FILTERS.PRICE.MIN)
      ? parseInt(searchParams.get(SEARCH_PARAM.FILTERS.PRICE.MIN)!, 10)
      : undefined,
    maxPrice: searchParams.has(SEARCH_PARAM.FILTERS.PRICE.MAX)
      ? parseInt(searchParams.get(SEARCH_PARAM.FILTERS.PRICE.MAX)!, 10)
      : undefined,
    bhkList: searchParams.getAll(SEARCH_PARAM.FILTERS.ROOM).map(Number) || [],
    isPetFriendly: searchParams.has(SEARCH_PARAM.FILTERS.PET_FRIENDLY)
      ? searchParams.get(SEARCH_PARAM.FILTERS.PET_FRIENDLY) === 'true'
      : false,
    isPrive: searchParams.has(SEARCH_PARAM.FILTERS.IS_PRIVE)
      ? searchParams.get(SEARCH_PARAM.FILTERS.IS_PRIVE) === 'true'
      : false,
    isStressed: searchParams.has(SEARCH_PARAM.FILTERS.IS_STRESSED)
      ? searchParams.get(SEARCH_PARAM.FILTERS.IS_STRESSED) === 'true'
      : false,
    applyAutoBankOffer: true,
  };

  const selectedPropertyType =
    searchParams.get(SEARCH_PARAM.FILTERS.PROPERTY_TYPE) || null;
  const selectedPropertyBrand = (() => {
    if (typeof window === 'undefined') return [];
    const query = window.location.search.substring(1);
    const brandKey = `${SEARCH_PARAM.FILTERS.PROPERTY_BRAND}=`;
    const idx = query.indexOf(brandKey);
    if (idx === -1) return [];
    const start = idx + brandKey.length;
    const nextParam = query.substring(start).match(/&[a-zA-Z_][a-zA-Z0-9_]*=/);
    const end = nextParam ? start + nextParam.index! : query.length;
    const brandValues = query.substring(start, end).split('&').filter(Boolean);
    return [...new Set(brandValues)];
  })();
  const sortFilter =
    searchParams.get(SEARCH_PARAM.FILTERS.SORT) || DEFAULT_SORT_FILTER;

  const updateSecondaryPropertyFilters = useCallback(
    ({
      newFilters,
      sortKey,
      propertyTypeFilter,
      propertyBrandFilter,
    }: {
      newFilters?: SecondaryPropertyFilters;
      sortKey?: string;
      propertyTypeFilter?: string | null;
      propertyBrandFilter?: string[] | null;
    }) => {
      const newParams = { ...params };
      const newSearchParams = new URLSearchParams(searchParams);

      if (newFilters) {
        if (newFilters.minPrice !== undefined) {
          newSearchParams.set(
            SEARCH_PARAM.FILTERS.PRICE.MIN,
            newFilters.minPrice.toString()
          );
        }
        if (newFilters.maxPrice !== undefined) {
          newSearchParams.set(
            SEARCH_PARAM.FILTERS.PRICE.MAX,
            newFilters.maxPrice.toString()
          );
        }

        if (
          newFilters.minPrice ===
            secondaryPropertyFiltersAvailable?.propertyFilters.pricingFilter
              .minPrice &&
          newFilters.maxPrice ===
            secondaryPropertyFiltersAvailable?.propertyFilters.pricingFilter
              .maxPrice
        ) {
          newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MIN);
          newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MAX);
        }

        if (newFilters.bhkList !== undefined) {
          newSearchParams.delete(SEARCH_PARAM.FILTERS.ROOM);
          newFilters.bhkList.forEach((bed) =>
            newSearchParams.append(SEARCH_PARAM.FILTERS.ROOM, bed.toString())
          );
        }

        if (newFilters.isPetFriendly !== undefined) {
          if (newFilters.isPetFriendly) {
            newSearchParams.set(SEARCH_PARAM.FILTERS.PET_FRIENDLY, 'true');
          } else {
            newSearchParams.delete(SEARCH_PARAM.FILTERS.PET_FRIENDLY);
          }
        }

        if (newFilters.isPrive !== undefined) {
          if (newFilters.isPrive) {
            newSearchParams.set(SEARCH_PARAM.FILTERS.IS_PRIVE, 'true');
          } else {
            newSearchParams.delete(SEARCH_PARAM.FILTERS.IS_PRIVE);
          }
        }
        if (newFilters.isStressed !== undefined) {
          if (newFilters.isStressed) {
            newSearchParams.set(SEARCH_PARAM.FILTERS.IS_STRESSED, 'true');
          } else {
            newSearchParams.delete(SEARCH_PARAM.FILTERS.IS_STRESSED);
          }
        }
      }

      if (sortKey === DEFAULT_SORT_FILTER) {
        newSearchParams.delete(SEARCH_PARAM.FILTERS.SORT);
      } else if (sortKey !== sortFilter && sortKey !== undefined) {
        newSearchParams.set(SEARCH_PARAM.FILTERS.SORT, sortKey);
      }

      if (propertyTypeFilter !== undefined) {
        if (propertyTypeFilter === null) {
          newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_TYPE);
        } else {
          newSearchParams.set(
            SEARCH_PARAM.FILTERS.PROPERTY_TYPE,
            propertyTypeFilter
          );
        }
      }

      if (propertyBrandFilter !== undefined) {
        newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_BRAND);
        if (propertyBrandFilter !== null && propertyBrandFilter.length > 0) {
          propertyBrandFilter.forEach((brand) =>
            newSearchParams.append(SEARCH_PARAM.FILTERS.PROPERTY_BRAND, brand)
          );
        }
      } else {
        newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_BRAND);
        if (selectedPropertyBrand && selectedPropertyBrand.length > 0) {
          selectedPropertyBrand.forEach((brand) =>
            newSearchParams.append(SEARCH_PARAM.FILTERS.PROPERTY_BRAND, brand)
          );
        }
      }

      const propertyBrandValues = newSearchParams.getAll(
        SEARCH_PARAM.FILTERS.PROPERTY_BRAND
      );

      newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_BRAND);

      const brandNames = ['ELIVAAS', 'PRIVE', 'ALAYASTAYS'];
      brandNames.forEach((brand) => {
        if (newSearchParams.has(brand)) {
          newSearchParams.delete(brand);
        }
      });

      const standardQuery = newSearchParams.toString();

      const uniqueBrandValues = [...new Set(propertyBrandValues)];
      let finalQuery = standardQuery;
      if (uniqueBrandValues.length > 0) {
        const propertyBrandPart = `${SEARCH_PARAM.FILTERS.PROPERTY_BRAND}=${uniqueBrandValues.join('&')}`;
        finalQuery = standardQuery
          ? `${standardQuery}&${propertyBrandPart}`
          : propertyBrandPart;
      }

      const pathSegments = Object.entries(newParams).map(([_, value]) => value);
      const href =
        [PROPERTIES_LIST_ROUTE, ...pathSegments]
          .filter((value) => value !== undefined && value.trim() !== '')
          .join('/') + (finalQuery ? `?${finalQuery}` : '');

      pushUrl(href);
    },
    [
      params,
      searchParams,
      selectedPropertyType,
      selectedPropertyBrand,
      sortFilter,
      secondaryPropertyFiltersAvailable,
      pushUrl,
    ]
  );

  const clearAllSecondaryFilters = useCallback(() => {
    const newParams = { ...params };
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_TYPE);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_BRAND);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MIN);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MAX);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.ROOM);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.SORT);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PET_FRIENDLY);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.IS_PRIVE);

    brandNames.forEach((brand) => {
      if (newSearchParams.has(brand)) {
        newSearchParams.delete(brand);
      }
    });

    const pathSegments = Object.entries(newParams).map(([_, value]) => value);
    const href =
      [PROPERTIES_LIST_ROUTE, ...pathSegments]
        .filter((value) => value !== undefined && value.trim() !== '')
        .join('/') + `?${newSearchParams.toString()}`;

    pushUrl(href);
  }, [params, searchParams]);

  const clearPriceFilter = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MIN);
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PRICE.MAX);
    const href = pathname + `?${newSearchParams.toString()}`;
    pushUrl(href);
  }, [pathname, searchParams]);

  const clearSortFilter = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(SEARCH_PARAM.FILTERS.SORT);
    const href = pathname + `?${newSearchParams.toString()}`;
    pushUrl(href);
  }, [pathname, searchParams]);

  const clearPropertyTypeFilter = useCallback(() => {
    const newParams = { ...params };
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_TYPE);

    const pathSegments = Object.entries(newParams).map(([_, value]) => value);
    const href =
      [PROPERTIES_LIST_ROUTE, ...pathSegments]
        .filter((value) => value !== undefined && value.trim() !== '')
        .join('/') + `?${newSearchParams.toString()}`;

    pushUrl(href);
  }, [params, searchParams]);

  const clearPropertyBrandFilter = useCallback(() => {
    const newParams = { ...params };
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete(SEARCH_PARAM.FILTERS.PROPERTY_BRAND);

    brandNames.forEach((brand) => {
      if (newSearchParams.has(brand)) {
        newSearchParams.delete(brand);
      }
    });

    const standardQuery = newSearchParams.toString();
    const finalQuery = standardQuery;

    const pathSegments = Object.entries(newParams).map(([_, value]) => value);
    const href =
      [PROPERTIES_LIST_ROUTE, ...pathSegments]
        .filter((value) => value !== undefined && value.trim() !== '')
        .join('/') + (finalQuery ? `?${finalQuery}` : '');

    pushUrl(href);
  }, [params, searchParams]);

  const clearPetFriendlyFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(SEARCH_PARAM.FILTERS.PET_FRIENDLY);
    const href = pathname + `?${newSearchParams.toString()}`;
    pushUrl(href);
  };

  const clearPriveFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(SEARCH_PARAM.FILTERS.IS_PRIVE);
    const href = pathname + `?${newSearchParams.toString()}`;
    pushUrl(href);
  };

  const toggleSecondaryFiltersDrawer = useCallback(() => {
    setOpenSecondaryFiltersDrawer((prev) => !prev);
  }, [setOpenSecondaryFiltersDrawer]);

  const openFilterDrawer = useCallback(
    (filterType: SecondaryPropertyFilterKeyType) => {
      setSelectedSecondaryPropertyFilter(filterType);
      setOpenSecondaryFiltersDrawer(true);
    },
    [setSelectedSecondaryPropertyFilter, setOpenSecondaryFiltersDrawer]
  );

  const closeFilterDrawer = useCallback(() => {
    setOpenSecondaryFiltersDrawer(false);
  }, [setOpenSecondaryFiltersDrawer]);

  return {
    // Filter values from URL
    secondaryPropertyFilters,
    selectedPropertyType,
    selectedPropertyBrand,
    sortFilter,

    // URL-based filter management functions
    setSecondaryPropertyFilters: updateSecondaryPropertyFilters,
    clearAllSecondaryFilters,
    clearPriceFilter,
    clearPropertyTypeFilter,
    clearPropertyBrandFilter,
    clearSortFilter,
    clearPetFriendlyFilter,
    clearPriveFilter,
    // UI drawer state
    isFilterDrawerOpen: openSecondaryFiltersDrawer,
    selectedFilterType: selectedSecondaryPropertyFilter,

    // UI drawer management functions
    toggleFilterDrawer: toggleSecondaryFiltersDrawer,
    openFilterDrawer,
    closeFilterDrawer,
    setSelectedFilterType: setSelectedSecondaryPropertyFilter,

    // Additional data
    guestsData,
  };
};
