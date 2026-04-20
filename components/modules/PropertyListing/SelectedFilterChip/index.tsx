// components/common/AdvanceFilterChip.tsx
import { Button } from '@/components/ui';
import FilterChip from '@/components/common/FilterChip';
import { SecondaryPropertyFilters } from '@/contexts';
import useIsMobile from '@/hooks/useIsMobile';

interface SelectedFilterChipProps {
  secondaryPropertyFilters: SecondaryPropertyFilters;
  sortFilter: string | undefined;
  selectedPropertyType: string | null;
  selectedPropertyBrand: string[];
  clearAllSecondaryFilters: () => void;
  clearPriceFilter: () => void;
  clearPetFriendlyFilter: () => void;
  clearPriveFilter: () => void;
  clearPropertyTypeFilter: () => void;
  clearPropertyBrandFilter: () => void;
  setSecondaryPropertyFilters: ({
    newFilters,
    sortKey,
    propertyTypeFilter,
    propertyBrandFilter,
  }: {
    newFilters?: Partial<SecondaryPropertyFilters>;
    sortKey?: string;
    propertyTypeFilter?: string | null;
    propertyBrandFilter?: string[] | null;
  }) => void;
}

export default function SelectedFilterChip({
  secondaryPropertyFilters,
  sortFilter,
  selectedPropertyType,
  selectedPropertyBrand,
  clearAllSecondaryFilters,
  clearPriceFilter,
  setSecondaryPropertyFilters,
  clearPetFriendlyFilter,
  clearPriveFilter,
  clearPropertyTypeFilter,
  clearPropertyBrandFilter,
}: SelectedFilterChipProps) {
  const isMobile = useIsMobile();

  const currentBhkList = secondaryPropertyFilters?.bhkList || [];
  const currentMinPrice = secondaryPropertyFilters?.minPrice;
  const currentMaxPrice = secondaryPropertyFilters?.maxPrice;
  const currentPetFriendly = secondaryPropertyFilters?.isPetFriendly;
  const currentPrive = secondaryPropertyFilters?.isPrive;

  const totalFiltersCount =
    (sortFilter !== 'popularity' && sortFilter !== undefined ? 1 : 0) +
    (currentBhkList.length > 0 ? 1 : 0) +
    (currentMinPrice && currentMaxPrice ? 1 : 0) +
    (currentPetFriendly ? 1 : 0) +
    (currentPrive ? 1 : 0) +
    (selectedPropertyType ? 1 : 0) +
    (selectedPropertyBrand?.length > 0 ? selectedPropertyBrand.length : 0);

  if (totalFiltersCount === 0) {
    return null;
  }

  const getPropertyTypeDisplayName = (slug: string) => {
    const propertyTypeMap: Record<string, string> = {
      villas: 'Villas',
      apartments: 'Apartments',
    };
    return propertyTypeMap[slug] || slug;
  };

  const getPropertyBrandDisplayName = (brand: string) => {
    const brandMap: Record<string, string> = {
      PRIVE: 'Prive',
      ELIVAAS: 'ELIVAAS',
      ALAYASTAYS: 'Alaya Stays',
    };
    return brandMap[brand] || brand;
  };
  const getSortLabel = (key: string): string => {
    const normalizedKey = key.replace(/_/g, '-');
    const sortMap: Record<string, string> = {
      'price-asc': 'Price: Low to High',
      'price-desc': 'Price: High to Low',
      ratings: 'Ratings',
      'best-value': 'Best Value',
    };
    return sortMap[normalizedKey] || key;
  };

  const sortedbyfilter = sortFilter && getSortLabel(sortFilter);

  return (
    <div className='flex items-center gap-3 sm:gap-4 px-4 md:px-10 sm:pl-2 md:pl-10 lg:pl-0 flex-nowrap overflow-x-scroll no-scrollbar w-[100%]'>
      {isMobile ? (
        <Button
          variant='link'
          className='font-semibold text-accent-red-900 px-0'
          onClick={clearAllSecondaryFilters}
        >
          Clear All
        </Button>
      ) : (
        <FilterChip
          label='Filter & Sort'
          count={totalFiltersCount}
          onClick={() => {}}
          infoChip={true}
          className='border-gray-400 h-10'
        />
      )}

      {sortFilter && sortFilter !== 'popularity' && (
        <FilterChip
          label={`${sortedbyfilter}`}
          removable
          onRemove={() =>
            setSecondaryPropertyFilters({
              sortKey: 'popularity',
            })
          }
          className='bg-primary-50 border-primary-200 h-10'
        />
      )}

      {selectedPropertyType && (
        <FilterChip
          label={getPropertyTypeDisplayName(selectedPropertyType)}
          removable
          onRemove={clearPropertyTypeFilter}
          className='bg-primary-50 border-primary-200 h-10'
        />
      )}
      {selectedPropertyBrand &&
        selectedPropertyBrand.length > 0 &&
        selectedPropertyBrand.map((brand, index) => (
          <FilterChip
            key={index}
            label={getPropertyBrandDisplayName(brand)}
            removable
            onRemove={() => {
              const updatedBrands = selectedPropertyBrand.filter(
                (item) => item !== brand
              );
              setSecondaryPropertyFilters({
                propertyBrandFilter:
                  updatedBrands.length > 0 ? updatedBrands : null,
              });
            }}
            className='bg-primary-50 border-primary-200 h-10'
          />
        ))}
      {currentBhkList.length > 0 &&
        currentBhkList.map((bhk, index) => (
          <FilterChip
            key={index}
            label={`${bhk} BHK`}
            removable
            onRemove={() => {
              const updatedBhkList = currentBhkList.filter(
                (item) => item !== bhk
              );
              // CORRECTED CALL: Wrap the partial filters inside 'newFilters'
              setSecondaryPropertyFilters({
                newFilters: {
                  bhkList: updatedBhkList,
                },
              });
            }}
            className='bg-primary-50 border-primary-200 h-10'
          />
        ))}

      {currentMinPrice && currentMaxPrice && (
        <FilterChip
          label={`₹${currentMinPrice.toLocaleString()} - ₹${currentMaxPrice.toLocaleString()} `}
          removable
          onRemove={clearPriceFilter}
          className='bg-primary-50 border-primary-200 h-10'
        />
      )}
      {currentPetFriendly && (
        <FilterChip
          label={`Pet Friendly`}
          removable
          onRemove={clearPetFriendlyFilter}
          className='bg-primary-50 border-primary-200 h-10'
        />
      )}
      {currentPrive && (
        <FilterChip
          label={`Prive`}
          removable
          onRemove={clearPriveFilter}
          className='bg-primary-50 border-primary-200 h-10'
        />
      )}
    </div>
  );
}
