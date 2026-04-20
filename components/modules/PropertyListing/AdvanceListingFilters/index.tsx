'use client';
import AlayaLogo from '@/assets/alaystays_brand.svg';
import Apartment from '@/assets/apartment.svg';
import Cottage from '@/assets/bungalow.svg';
import Farmhouse from '@/assets/cottage.svg';
import ElivaasDark from '@/assets/elivaasDark.svg';
import PriveLogo from '@/assets/prive_brand.svg';
import Villa from '@/assets/villa.svg';
import {
  Badge,
  Button,
  Checkbox,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Slider,
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSecondaryFilters } from '@/hooks/filters';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { sortByOptions } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { formatPrice, mapPropertyFiltersToTypes } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { useState } from 'react';

const AdvanceListingFilters = ({
  advanceFilterData,
  showPropertyTypes = false,
  openFiltersSheet,
  setOpenFiltersSheet,
}: any) => {
  const {
    sortFilter,
    selectedPropertyType,
    selectedPropertyBrand,
    secondaryPropertyFilters,
    setSecondaryPropertyFilters,
    clearAllSecondaryFilters,
  } = useSecondaryFilters();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [mobileFilters, setMobileFilters] = useState({
    minPrice: secondaryPropertyFilters.minPrice,
    maxPrice: secondaryPropertyFilters.maxPrice,
    bhkList: secondaryPropertyFilters.bhkList || [],
    propertyTypeFilter: selectedPropertyType,
    propertyBrandFilter: selectedPropertyBrand || [],
    totalPriceEnable: false,
    isPetFriendly: secondaryPropertyFilters?.isPetFriendly || false,
    isPrive: secondaryPropertyFilters?.isPrive || false,
    isStressed: secondaryPropertyFilters?.isStressed || false,
    sortFilter: sortFilter,
    applyAutoBankOffer: true,
  });

  const renderSortByFilter = () => {
    // FIX: Use sortFilter from hook instead of mobileFilters
    const currentSortFilter =
      isMobile || isTablet ? mobileFilters.sortFilter : sortFilter;

    const handleSortChange = (value: string) => {
      if (isTablet) {
        setMobileFilters((prev) => ({
          ...prev,
          sortFilter: value,
        }));
      } else {
        setSecondaryPropertyFilters({ sortKey: value });
      }
      trackEvent('filter_applied', {
        page_name: 'property_listing',
        is_prive_filter_applied: mobileFilters.isPrive,
        is_price_filter_applied:
          mobileFilters?.minPrice !== undefined ||
          mobileFilters?.maxPrice !== undefined
            ? true
            : false,
        is_bedroom_filter_applied:
          mobileFilters.bhkList?.length > 0 ? true : false,
        is_property_type_filter_applied: mobileFilters.propertyTypeFilter
          ? true
          : false,
        is_sort_filter_applied:
          mobileFilters.sortFilter !== 'popularity' ? true : false,
      });
    };

    return (
      <div className='flex flex-col gap-4'>
        <h3 className='typography-body-semibold'>Sort By</h3>
        <RadioGroup
          value={currentSortFilter}
          onValueChange={handleSortChange}
          className='space-y-4 gap-0'
        >
          {sortByOptions.map((option) => (
            <div key={option.value} className='flex items-center space-x-3'>
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className='w-5 h-5 border-2'
              />
              <Label
                htmlFor={option.value}
                className={`text-sm cursor-pointer ${
                  currentSortFilter === option.value
                    ? 'font-semibold text-foreground'
                    : 'text-foreground'
                }`}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div className='flex justify-between items-center w-full sm:mb-3'>
        {isTablet && (
          <ArrowLeft className='' onClick={() => setOpenFiltersSheet(false)} />
        )}
        <h4 className='font-serif text-xl'>Filters</h4>
        <Button
          variant='link'
          className={`
          p-0 typography-label-semibold text-accent-red-900 no-underline! cursor-pointer sm:static sm:right-auto sm:top-auto
        `}
          onClick={() => {
            clearAllSecondaryFilters();

            if (isTablet) {
              setMobileFilters({
                minPrice: undefined,
                maxPrice: undefined,
                bhkList: [],
                propertyTypeFilter: null,
                propertyBrandFilter: [],
                totalPriceEnable: false,
                isPetFriendly: false,
                isPrive: false,
                isStressed: false,
                sortFilter: 'popularity',
                applyAutoBankOffer: true,
              });
            }
          }}
        >
          Clear All
        </Button>
      </div>
    );
  };

  const brandFilters = [
    {
      label: 'Prive',
      value: 'PRIVE',
      icon: <PriveLogo className='w-fit! h-auto! px-4 py-2' />,
      // rating: 7,
      gradient: 'linear-gradient(360deg, #8C4500 -20.17%, #D1A66E 98.75%)',
    },
    {
      label: 'Elivaas',
      value: 'ELIVAAS',
      icon: <ElivaasDark className='w-fit! max-w-[120px]! h-auto! px-4 py-2' />,
      rating: 5,
      gradient: 'bg-[#fdefdf]',
    },
    {
      label: 'Alayastays',
      value: 'ALAYASTAYS',
      icon: (
        <AlayaLogo className='w-[120px]! sm:w-[135px]! h-auto! px-4 py-2' />
      ),
      rating: 4,
      gradient: 'bg-[#fdefdf]',
    },
  ];
  const renderBrandFilters = () => {
    const currentPropertyBrands = isTablet
      ? mobileFilters.propertyBrandFilter || []
      : selectedPropertyBrand || [];

    const handlePropertyBrandChange = (updated: string[]) => {
      if (isTablet) {
        setMobileFilters((prev) => ({
          ...prev,
          propertyBrandFilter: updated,
        }));
        trackEvent('filter_applied', {
          page_name: 'property_listing',
          // is_prive_filter_applied: checked,
          is_price_filter_applied:
            mobileFilters?.minPrice !== undefined ||
            mobileFilters?.maxPrice !== undefined
              ? true
              : false,
          is_bedroom_filter_applied:
            mobileFilters.bhkList?.length > 0 ? true : false,
          is_property_type_filter_applied: mobileFilters.propertyTypeFilter
            ? true
            : false,
          is_sort_filter_applied:
            mobileFilters.sortFilter !== 'popularity' ? true : false,
        });
      } else {
        setSecondaryPropertyFilters({
          propertyBrandFilter: updated.length > 0 ? updated : null,
        });
        trackEvent('filter_clicked', {
          // is_prive_filter_applied: checked,
          is_property_type_filter_applied: selectedPropertyType ? true : false,
          page_name: 'property_listing',
          is_price_filter_applied:
            secondaryPropertyFilters?.minPrice !== undefined ||
            secondaryPropertyFilters?.maxPrice !== undefined
              ? true
              : false,
          is_bedroom_filter_applied:
            secondaryPropertyFilters.bhkList?.length > 0 ? true : false,
          is_pet_friendly_applied: secondaryPropertyFilters?.isPetFriendly
            ? true
            : false,
          is_property_brand_filter_applied: updated.length > 0 ? true : false,
        });
      }
    };

    return (
      <div>
        <div>
          <h4 className='typography-body-semibold mb-2'>By Brand</h4>
        </div>

        <ToggleGroup
          type='multiple'
          className={`grid gap-3 w-full ${
            isTablet ? 'grid-cols-3' : 'grid-cols-2'
          }`}
          value={currentPropertyBrands}
          onValueChange={handlePropertyBrandChange}
        >
          {brandFilters.map((brand) => {
            const isSelected = currentPropertyBrands.includes(brand.value);

            const getBackgroundStyle = () => {
              if (!isSelected) return {};

              if (brand.value === 'PRIVE') {
                return {
                  background: brand.gradient,
                  boxShadow: '0px 3px 0px 0px #3D1E00',
                  border: 'none',
                };
              }

              if (brand.value === 'ELIVAAS' || brand.value === 'ALAYASTAYS') {
                const bgColor = brand.gradient
                  .replace('bg-[', '')
                  .replace(']', '');
                return {
                  backgroundColor: bgColor,
                  boxShadow: '0px 2px 0px 0px #B18458',
                };
              }

              const bgColor = brand.gradient
                .replace('bg-[', '')
                .replace(']', '');
              return {
                backgroundColor: bgColor,
              };
            };

            const getBorderClass = () => {
              if (!isSelected) return 'border-1';

              if (brand.value === 'ELIVAAS' || brand.value === 'ALAYASTAYS') {
                return 'border-1 border-[#B18458]';
              }

              return 'border-1';
            };

            return (
              <motion.div key={brand.value} whileTap={{ scale: 0.97 }}>
                <ToggleGroupItem
                  value={brand.value}
                  className={`relative w-full cursor-pointer hover:bg-primary-50 rounded-2xl! px-4 py-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    isTablet
                      ? 'min-h-[80px] max-h-[80px]'
                      : 'min-h-[100px] max-h-[100px]'
                  } ${getBorderClass()}`}
                  style={getBackgroundStyle()}
                >
                  <div
                    className={`${
                      isSelected && brand.value === 'PRIVE'
                        ? '[&_path]:fill-white [&_svg]:text-white'
                        : ''
                    }`}
                  >
                    {brand.icon}
                  </div>
                  {brand.rating && (
                    <div
                      className={`absolute bottom-0 right-0 flex items-center gap-1 rounded-tl-2xl rounded-br-xl px-2 py-1 ${
                        isSelected && brand.value === 'PRIVE'
                          ? 'bg-[rgba(255,255,255,0.3)] backdrop-blur-sm'
                          : isSelected &&
                              (brand.value === 'ELIVAAS' ||
                                brand.value === 'ALAYASTAYS')
                            ? 'bg-[#B18458]'
                            : 'bg-primary-100 text-primary-900 italic'
                      }`}
                    >
                      <span
                        className={`text-xs italic ${
                          isSelected && brand.value === 'PRIVE'
                            ? 'text-white'
                            : isSelected &&
                                (brand.value === 'ELIVAAS' ||
                                  brand.value === 'ALAYASTAYS')
                              ? 'text-white'
                              : 'text-primary-900'
                        }`}
                      >
                        Like a {brand.rating}
                      </span>
                      <Star
                        className={`w-3! h-3! ${
                          isSelected && brand.value === 'PRIVE'
                            ? 'fill-white text-white'
                            : isSelected &&
                                (brand.value === 'ELIVAAS' ||
                                  brand.value === 'ALAYASTAYS')
                              ? 'fill-white text-white'
                              : 'fill-primary-900 text-primary-900'
                        }`}
                      />
                    </div>
                  )}
                </ToggleGroupItem>
              </motion.div>
            );
          })}
        </ToggleGroup>
      </div>
    );
  };
  const renderPriceRange = () => {
    // Use mobile filters for mobile, global filters for desktop
    const currentMinPrice = isTablet
      ? mobileFilters.minPrice
      : secondaryPropertyFilters.minPrice;
    const currentMaxPrice = isTablet
      ? mobileFilters.maxPrice
      : secondaryPropertyFilters.maxPrice;
    const defaultMinPrice = advanceFilterData.pricingFilter?.minPrice;
    const defaultMaxPrice = advanceFilterData.pricingFilter?.maxPrice;

    const handlePriceChange = (values: number[]) => {
      if (isTablet) {
        // Update mobile temporary state
        setMobileFilters((prev) => ({
          ...prev,
          minPrice: values[0],
          maxPrice: values[1],
        }));
      } else {
        // Apply immediately on desktop
        setSecondaryPropertyFilters({
          newFilters: {
            minPrice: values[0],
            maxPrice: values[1],
          },
        });
        // Check if price values are different from defaults (user actually changed them)
        const isPriceChanged =
          values[0] !== defaultMinPrice || values[1] !== defaultMaxPrice;

        trackEvent('filter_clicked', {
          page_name: 'property_listing',
          is_price_filter_applied: isPriceChanged,
          is_bedroom_filter_applied:
            secondaryPropertyFilters.bhkList?.length > 0 ? true : false,
          is_pet_friendly_applied: secondaryPropertyFilters?.isPetFriendly
            ? true
            : false,
          is_prive_filter_applied: secondaryPropertyFilters.isPrive
            ? true
            : false,
          is_property_type_filter_applied: selectedPropertyType ? true : false,
        });
      }
    };

    return (
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <h4 className='typography-body-semibold'>Prices Range</h4>
          <p className='typography-small-regular text-secondary-700'>
            Prices excluding taxes and fees
          </p>
        </div>
        <div className='flex flex-col gap-5'>
          <h5 className='typography-body-semibold text-foreground text-sm!'>
            &#8377;
            {formatPrice(currentMinPrice || defaultMinPrice)} - &#8377;
            {formatPrice(currentMaxPrice || defaultMaxPrice)}
          </h5>
          <div className='h-6'>
            <Slider
              key={`${currentMinPrice}-${currentMaxPrice}`}
              defaultValue={[
                currentMinPrice || defaultMinPrice,
                currentMaxPrice || defaultMaxPrice,
              ]}
              max={defaultMaxPrice}
              min={defaultMinPrice}
              step={1000}
              className='text-primary-800!'
              onValueCommit={handlePriceChange}
            />
          </div>
        </div>
        {/* 
        <div className="flex items-center justify-between w-full h-[52px] px-3 rounded-2xl border bg-primary-50">
          <p className="typography-small-semibold flex justify-between items-center gap-1">
            Show Total Price
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-white fill-red-900" />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="w-full bg-white text-accent-red-900 rounded-2xl shadow-xl p-3"
                >
                  <p className="w-55">
                    Displays the total cost for your entire stay based on the
                    selected dates
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <Switch
            checked={isTablet ? mobileFilters.totalPriceEnable : localTotalPriceEnable}
            onCheckedChange={(checked) => {
              if (isTablet) {
                setMobileFilters(prev => ({ ...prev, totalPriceEnable: checked }));
              } else {
                setLocalTotalPriceEnable(checked);
              }
            }}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-400"
          />
        </div> */}
      </div>
    );
  };

  const iconPropertyTypes = 'w-fit! h-auto! px-4 py-2';

  const propertyTypes = [
    {
      label: 'Villa',
      value: 'villas',
      icon: <Villa className={iconPropertyTypes} />,
    },
    {
      label: 'Apartment',
      value: 'apartments',
      icon: <Apartment className={iconPropertyTypes} />,
    },
    {
      label: 'Cottage',
      value: 'cottage',
      icon: <Cottage className={iconPropertyTypes} />,
    },
    {
      label: 'Farmhouse',
      value: 'farmhouse',
      icon: <Farmhouse className={iconPropertyTypes} />,
    },
  ];

  const renderPropertyTypes = () => {
    const filterTypes = advanceFilterData?.propertyTypeFilter ?? [];
    const mappedTypes = mapPropertyFiltersToTypes(filterTypes, propertyTypes);

    const currentPropertyType = isTablet
      ? mobileFilters.propertyTypeFilter
      : selectedPropertyType;

    const handlePropertyTypeChange = (value: string) => {
      if (isTablet) {
        setMobileFilters((prev) => ({
          ...prev,
          propertyTypeFilter: value || null,
        }));
      } else {
        setSecondaryPropertyFilters({ propertyTypeFilter: value || null });
        trackEvent('filter_clicked', {
          page_name: 'property_listing',
          is_property_type_filter_applied: value ? true : false,
          is_price_filter_applied:
            secondaryPropertyFilters?.minPrice !== undefined ||
            secondaryPropertyFilters?.maxPrice !== undefined
              ? true
              : false,
          is_bedroom_filter_applied:
            secondaryPropertyFilters.bhkList?.length > 0 ? true : false,
          is_pet_friendly_applied: secondaryPropertyFilters?.isPetFriendly
            ? true
            : false,
          is_prive_filter_applied: secondaryPropertyFilters.isPrive
            ? true
            : false,
        });
      }
    };

    return (
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex justify-between items-center mb-4'>
            <h4 className='typography-body-semibold'>Property Types</h4>
          </div>
        </div>

        <ToggleGroup
          key={currentPropertyType || 'no-selection'}
          type='single'
          className='grid grid-cols-2 gap-3 w-full'
          value={currentPropertyType || undefined}
          onValueChange={handlePropertyTypeChange}
        >
          {mappedTypes.map((type: any) => (
            <motion.div key={type.value} whileTap={{ scale: 0.97 }}>
              <ToggleGroupItem
                value={type.value}
                className='w-full cursor-pointer h-auto border rounded-md px-4 py-2 flex flex-col items-center justify-center hover:border-primary-800 hover:bg-transparent! gap-2 data-[state=on]:bg-primary-50 data-[state=on]:border-2 data-[state=on]:border-primary-800'
              >
                {type.icon}
                <span className='text-sm'>{type.label}</span>
              </ToggleGroupItem>
            </motion.div>
          ))}
        </ToggleGroup>
      </div>
    );
  };

  const renderBedrooms = () => {
    const currentSelectedBedrooms = isTablet
      ? mobileFilters.bhkList?.map(String) || []
      : secondaryPropertyFilters.bhkList?.map(String) || [];

    const sortedBhkFilter = advanceFilterData?.bhkFilter.sort(
      (a: number, b: number) => a - b
    );

    const handleBedroomsChange = (updated: string[]) => {
      if (isTablet) {
        setMobileFilters((prev) => ({
          ...prev,
          bhkList: updated.map(Number),
        }));
      } else {
        setSecondaryPropertyFilters({
          newFilters: {
            ...secondaryPropertyFilters,
            bhkList: updated.map(Number),
          },
        });
        trackEvent('filter_clicked', {
          page_name: 'property_listing',
          is_bedroom_filter_applied: updated.length > 0 ? true : false,
          is_price_filter_applied:
            secondaryPropertyFilters?.minPrice !== undefined ||
            secondaryPropertyFilters?.maxPrice !== undefined
              ? true
              : false,
          is_pet_friendly_applied: secondaryPropertyFilters.isPetFriendly
            ? true
            : false,
          is_prive_filter_applied: secondaryPropertyFilters.isPrive
            ? true
            : false,
          is_property_type_filter_applied: selectedPropertyType ? true : false,
        });
      }
    };

    return (
      <div className='border-b pb-8 border-primary-50'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <h4 className='text-base font-semibold text-neutral-900'>
              Bedrooms
            </h4>
            {currentSelectedBedrooms.length > 0 && (
              <Badge className='text-xs bg-primary-800 rounded-full text-white'>
                {currentSelectedBedrooms.length}
              </Badge>
            )}
          </div>
        </div>

        <ToggleGroup
          type='multiple'
          className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-4 xl:grid-cols-5 gap-3'
          value={currentSelectedBedrooms}
          onValueChange={handleBedroomsChange}
        >
          {sortedBhkFilter?.map((option: string) => (
            <motion.div key={option} whileTap={{ scale: 0.95 }}>
              <ToggleGroupItem
                value={option.toString()}
                className='rounded-xl! border h-12 w-12 cursor-pointer hover:bg-transparent! hover:border-primary-800 px-4 py-2 typography-label-semibold text-primary-800 data-[state=on]:bg-primary-50 data-[state=on]:border-2 data-[state=on]:border-primary-800 data-[state=on]:text-primary-900'
              >
                {option}
              </ToggleGroupItem>
            </motion.div>
          ))}
        </ToggleGroup>
      </div>
    );
  };

  // const renderAmenities = () => {
  //   return (
  //     <div className='border-b pb-6'>
  //       <div className='flex justify-between items-center mb-4'>
  //         <h3 className='typography-body-semibold'>Amenities</h3>
  //       </div>

  //       <div className='space-y-3'>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='pool' />
  //           <label htmlFor='pool' className='text-sm'>
  //             Pool / Jacuzzi
  //           </label>
  //         </div>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='meeting' />
  //           <label htmlFor='meeting' className='text-sm'>
  //             Meeting Room
  //           </label>
  //         </div>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='wifi' />
  //           <label htmlFor='wifi' className='text-sm'>
  //             High Speed WiFi
  //           </label>
  //         </div>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='lawn' />
  //           <label htmlFor='lawn' className='text-sm'>
  //             Private Lawn
  //           </label>
  //         </div>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='kitchen' />
  //           <label htmlFor='kitchen' className='text-sm'>
  //             Kitchen
  //           </label>
  //         </div>
  //         <div className='flex items-center space-x-2'>
  //           <Checkbox id='terrace' />
  //           <label htmlFor='terrace' className='text-sm'>
  //             Terrace
  //           </label>
  //         </div>
  //         <Button variant='link' className='text-sm p-0'>
  //           View 21 More
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };

  // const renderLocationSpecialties = () => {
  //   return (
  //     <div className='border-b pb-6'>
  //       <div className='flex justify-between items-center mb-4'>
  //         <div className='flex items-center gap-2'>
  //           <h3 className='typography-body-semibold'>Location Specialties</h3>
  //           <Badge className='text-xs bg-primary-800 rounded-full'>1</Badge>
  //         </div>
  //       </div>

  //       <div className='flex flex-wrap gap-2'>
  //         <Badge
  //           variant='outline'
  //           className='rounded-full px-4 py-2 bg-gray-50'
  //         >
  //           New Homes
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Beachfront
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Ocean View
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Mountain View
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Historic Property
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Lakefront
  //         </Badge>
  //         <Badge variant='outline' className='rounded-full px-4 py-2'>
  //           Forest Retreat
  //         </Badge>
  //       </div>
  //     </div>
  //   );
  // };

  const renderGroupSuitability = () => {
    return (
      <div className='pb-2'>
        <div className='flex justify-between items-center mb-4'>
          <h4 className='typography-body-semibold'>Groups & Suitability</h4>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isPetFriendly'
              className='cursor-pointer'
              checked={
                isTablet
                  ? mobileFilters.isPetFriendly
                  : secondaryPropertyFilters.isPetFriendly || false
              }
              onCheckedChange={(checked: boolean) => {
                if (isTablet) {
                  setMobileFilters((prev) => ({
                    ...prev,
                    isPetFriendly: checked,
                  }));
                } else {
                  setSecondaryPropertyFilters({
                    newFilters: {
                      ...secondaryPropertyFilters,
                      isPetFriendly: checked,
                    },
                  });
                  trackEvent('filter_clicked', {
                    page_name: 'property_listing',
                    is_pet_friendly_applied: checked,
                    is_price_filter_applied:
                      secondaryPropertyFilters?.minPrice !== undefined ||
                      secondaryPropertyFilters?.maxPrice !== undefined
                        ? true
                        : false,
                    is_bedroom_filter_applied:
                      secondaryPropertyFilters.bhkList?.length > 0
                        ? true
                        : false,
                    is_prive_filter_applied: secondaryPropertyFilters.isPrive
                      ? true
                      : false,
                    is_property_type_filter_applied: selectedPropertyType
                      ? true
                      : false,
                  });
                }
              }}
            />
            <label htmlFor='isPetFriendly' className='text-sm cursor-pointer'>
              Pet Friendly
            </label>
          </div>
          {/* <div className='flex items-center space-x-2'>
            <Checkbox id='senior' />
            <label htmlFor='senior' className='text-sm'>
              Senior Citizen Friendly
            </label>
          </div> */}
          {/* <div className='flex items-center space-x-2'>
            <Checkbox id='large' />
            <label htmlFor='large' className='text-sm'>
              Ideal For Large Groups
            </label>
          </div> */}
          {/* <div className='flex items-center space-x-2'>
            <Checkbox id='kids' />
            <label htmlFor='kids' className='text-sm'>
              Great For Kids
            </label>
          </div> */}
        </div>
      </div>
    );
  };

  const applyMobileFilters = () => {
    // Track filter_applied event with all filter states
    trackEvent('filter_applied', {
      page_name: 'property_listing',
      is_price_filter_applied:
        mobileFilters.minPrice !== undefined ||
        mobileFilters.maxPrice !== undefined
          ? true
          : false,
      is_bedroom_filter_applied:
        mobileFilters.bhkList?.length > 0 ? true : false,
      is_property_type_filter_applied: mobileFilters.propertyTypeFilter
        ? true
        : false,
      is_property_brand_filter_applied:
        mobileFilters.propertyBrandFilter?.length > 0 ? true : false,
      is_prive_filter_applied: mobileFilters.isPrive,
      is_pet_friendly_applied: mobileFilters.isPetFriendly,
      is_sort_filter_applied:
        mobileFilters.sortFilter !== 'popularity' ? true : false,
    });

    setSecondaryPropertyFilters({
      newFilters: {
        minPrice: mobileFilters.minPrice,
        maxPrice: mobileFilters.maxPrice,
        bhkList: mobileFilters.bhkList,
        isPetFriendly: mobileFilters.isPetFriendly,
        isPrive: mobileFilters.isPrive,
      },
      propertyTypeFilter: mobileFilters.propertyTypeFilter,
      propertyBrandFilter:
        mobileFilters.propertyBrandFilter?.length > 0
          ? mobileFilters.propertyBrandFilter
          : null,
      sortKey: mobileFilters.sortFilter,
    });
    setOpenFiltersSheet(false);
  };

  const renderMobileFilterSheet = () => {
    return (
      <Sheet
        open={openFiltersSheet}
        onOpenChange={setOpenFiltersSheet}
        key='right'
      >
        <SheetContent className='h-[100dvh] w-[100vw] [&>button]:hidden gap-0 flex flex-col'>
          <SheetHeader className='m-0 p-0'>
            <SheetTitle className='relative flex h-15 items-center justify-center text-xl border-b border-primary-100 py-3 px-3 text-black'>
              <div className={`flex justify-between items-center w-full`}>
                {renderHeader()}
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className='px-4 py-4 flex flex-col gap-6 sm:gap-4 overflow-y-auto flex-1 max-h-[calc(100vh-140px)]'>
            {/* {renderPriveToggle()} */}
            {renderSortByFilter()}
            <div className='border-t border-primary-50' />
            {renderPriceRange()}

            <div className='border-t border-primary-50' />
            {/* {showPropertyTypes && ( */}
            <>
              {renderPropertyTypes()}
              <div className='border-t border-primary-50' />
            </>
            {/* )} */}

            {/* Bedrooms Filter */}
            {renderBedrooms()}
            {/* Amenities Filter */}
            {/* {renderAmenities()} */}
            {/* Location Specialties */}
            {/* {renderLocationSpecialties()} */}
            {/* Groups & Suitability */}
            {renderGroupSuitability()}
            <div className='border-t border-primary-50' />
            {renderBrandFilters()}
            <div className='pb-0' />
          </div>

          <SheetFooter className='mt-auto px-3 bg-white border-primary-50 px-4 border-t border-primary-100'>
            <SheetClose asChild>
              <Button
                onClick={applyMobileFilters}
                className='bg-accent-red-900! hover:bg-accent-red-950 rounded-full'
                size='lg'
              >
                Apply
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      {isTablet ? (
        renderMobileFilterSheet()
      ) : (
        <div className='flex flex-col h-full'>
          <div className='flex-shrink-0'>{renderHeader()}</div>
          <div className='flex-1 space-y-7 pr-2'>
            {/* {renderPriveToggle()} */}
            {renderPriceRange()}
            <div className='border-t border-primary-50' />
            {/* {showPropertyTypes && ( */}
            <>
              {renderPropertyTypes()}
              <div className='border-t border-primary-50' />
            </>
            {/* )} */}
            {/* Bedrooms Filter */}
            {renderBedrooms()}
            {/* Amenities Filter */}
            {/* {renderAmenities()} */}
            {/* Location Specialties */}
            {/* {renderLocationSpecialties()} */}
            {/* Groups & Suitability */}
            {renderGroupSuitability()}
            <div className='border-t border-primary-50' />
            {renderBrandFilters()}
          </div>
        </div>
      )}
    </>
  );
};

export default AdvanceListingFilters;
