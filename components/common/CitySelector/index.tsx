'use client';

import NoResults from '@/assets/noResults.svg';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CityOption } from '@/contexts';
import useIsMobile from '@/hooks/useIsMobile';
import usePropertySearch from '@/hooks/usePropertySearch';
import { cn } from '@/lib/utils';
import { ArrowLeft, Building2, MapPin, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '../Spinner';
import CustomImage from '../CustomImage';

interface CitySearchProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  pageType?: 'home' | 'pdp' | string;
  placeholder?: string;
  cityOptions?: CityOption[];
  children?: React.ReactNode;
  autoOpen?: boolean;
  onPropertySelect?: (property: any) => void;
}

const CitySearch = ({
  selectedLocation,
  setSelectedLocation,
  pageType = 'home',
  placeholder = 'City / Villa / Location',
  cityOptions = [],
  children,
  autoOpen = false,
  onPropertySelect,
}: CitySearchProps) => {
  const isMobile = useIsMobile();
  const [openLocation, setOpenLocation] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { properties, isLoading: isLoadingProperties } =
    usePropertySearch(searchValue);

  const filteredCities = useMemo(() => {
    if (!searchValue.trim()) return cityOptions;
    const searchLower = searchValue.toLowerCase();
    return cityOptions.filter((city) =>
      city.label.toLowerCase().includes(searchLower)
    );
  }, [cityOptions, searchValue]);

  useEffect(() => {
    if (autoOpen && isMobile) {
      const hasClosedCitySelector =
        sessionStorage.getItem('citySelectorClosed');
      if (!hasClosedCitySelector) {
        setOpenLocation(true);
      }
    }
  }, [autoOpen, isMobile]);

  const iconClasses = pageType === 'home' ? 'text-white' : 'text-primary';
  const textClasses = pageType === 'home' ? 'text-white' : 'text-gray-700';

  const defaultChildren = (
    <div className={cn('flex items-center cursor-pointer', textClasses)}>
      <MapPin className={cn('w-4 h-4 mr-2', iconClasses)} />
      <span>{selectedLocation || placeholder}</span>
    </div>
  );

  const handleCitySelect = (cityValue: string) => {
    setSelectedLocation(cityValue);
    setOpenLocation(false);
    setSearchValue('');
    sessionStorage.removeItem('citySelectorClosed');
  };

  const handlePropertySelect = useCallback(
    (property: any) => {
      setOpenLocation(false);
      setSearchValue('');
      sessionStorage.removeItem('citySelectorClosed');
      if (onPropertySelect) {
        onPropertySelect(property);
      }
    },
    [onPropertySelect]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const hasProperties = properties?.length > 0;
  const hasCities = filteredCities.length > 0;
  const hasSearchValue = searchValue.trim().length > 0;

  const showNoResults =
    hasSearchValue && !isLoadingProperties && !hasCities && !hasProperties;

  const MobileCommandContent = () => {
    // No results state - only show when we have search value and no results
    if (showNoResults) {
      return (
        <div className='flex-1 flex items-center justify-center text-center overflow-auto'>
          <div className='flex flex-col justify-center items-center min-h-[40dvh]'>
            <NoResults />
            <h2 className='text-2xl font-serif font-semibold mt-4'>
              No results found
            </h2>
            <p className='text-sm mt-2 text-gray-600 max-w-70'>
              Try adjusting your search or explore nearby destinations.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className='flex-1 overflow-y-auto'>
        <div className='px-4 space-y-6 pb-8'>
          {/* Cities Section */}
          {hasCities && (
            <div>
              <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 dark:text-secondary-800'>
                DESTINATIONS
              </h3>
              <div className='space-y-0'>
                {filteredCities.map((city) => (
                  <Button
                    key={`city-${city.value}`}
                    variant='ghost'
                    onClick={() => handleCitySelect(city.value)}
                    className='w-full justify-start h-auto p-3 rounded-lg hover:bg-gray-50 active:bg-[var(--primary-10)] dark:active:bg-[#0D0D0D] transition-colors duration-150'
                  >
                    <div className='flex items-center gap-3 w-full'>
                      {city.type === 'STATE' ? (
                        <MapPin className='w-[17px] h-[17px] stroke-primary-400 dark:text-[var(--dawnpink)]' />
                      ) : (
                        <Building2 className='w-[17px] h-[17px] stroke-primary-400 dark:text-[var(--dawnpink)]' />
                      )}
                      <div className='flex-1 min-w-0 text-left'>
                        <p className='text-[14px] text-gray-800 truncate dark:text-white font-medium'>
                          {city.label}
                        </p>
                        {city.region && (
                          <p className='text-xs text-gray-500 dark:text-white mt-0.5'>
                            {city.region}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {(hasProperties || (isLoadingProperties && hasSearchValue)) && (
            <div>
              <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 dark:text-secondary-800'>
                PROPERTIES
              </h3>
              {isLoadingProperties && hasSearchValue ? (
                <div className='flex items-center justify-center py-8'>
                  <Spinner />
                </div>
              ) : (
                <div className='space-y-2'>
                  {properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/villa-in-${property?.citySlug}/${property?.slug}?adults=1&children=0`}
                      className='group block'
                      aria-label={property?.name}
                      target='_self'
                      prefetch={true}
                    >
                      <div
                        onClick={() => handlePropertySelect(property)}
                        className='w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--primary-10)] transition-all duration-150 cursor-pointer group dark:hover:bg-[var(--brown2)] active:bg-[var(--primary-10)] dark:active:bg-[#0D0D0D]'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 relative'>
                            {property?.defaultMedia?.url ? (
                              <CustomImage
                                height={600}
                                width={720}
                                quality={20}
                                src={property?.defaultMedia?.url}
                                alt={property?.name}
                                className='object-cover h-full'
                                objectFit='cover'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <Building2
                                  className='w-5 h-5 text-gray-400'
                                  strokeWidth={1.5}
                                />
                              </div>
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-[13px] text-primary-950 leading-tight mb-0.5 dark:text-white line-clamp-2 group-hover:font-semibold'>
                              {property.name || property.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpenLocation(open);
      if (!open && !selectedLocation) {
        sessionStorage.setItem('citySelectorClosed', 'true');
      }
    },
    [selectedLocation]
  );

  if (isMobile) {
    return (
      <Sheet open={openLocation} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{children || defaultChildren}</SheetTrigger>

        <SheetContent
          side='bottom'
          className='h-[100dvh] p-0 flex flex-col overflow-hidden z-99'
          hideCloseButton
        >
          <div className='flex items-center p-4 py-2 border-b h-15 bg-white gap-3 dark:bg-background dark:border-primary-800'>
            <Button
              variant='ghost'
              className='flex-shrink-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              onClick={() => handleOpenChange(false)}
            >
              <ArrowLeft className='absolute left-[20px] w-4 h-4 scale-150' />
            </Button>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-500 dark:text-primary-400' />

              <Input
                type='text'
                placeholder='Where are you planning to stay?'
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className='flex-1 bg-primary-10 h-full py-2 pl-10 pr-4 rounded-lg shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-primary-500! placeholder:text-sm border border-primary-200 dark:border-primary-800 dark:bg-[var(--prive1)]! dark:text-white dark:placeholder:text-[var(--prive6)]! '
              />
              {searchValue && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleSearchChange('')}
                  className='absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto'
                >
                  <X className='w-4 h-4 text-gray-400' />
                </Button>
              )}
            </div>
          </div>
          <MobileCommandContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={openLocation} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild className='z-40'>
        {children || defaultChildren}
      </PopoverTrigger>
      <PopoverContent
        className='w-80 p-0 bg-white z-50'
        align='start'
        sideOffset={10}
        alignOffset={20}
        side='bottom'
      >
        <Command className='bg-white border-primary'>
          <CommandInput
            placeholder='Search cities and properties...'
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {showNoResults && <CommandEmpty>No results found</CommandEmpty>}

            {/* Cities Group */}
            {hasCities && (
              <CommandGroup heading='DESTINATIONS'>
                {filteredCities.map((city) => (
                  <CommandItem
                    key={city.value}
                    onSelect={() => handleCitySelect(city.value)}
                  >
                    {city.type === 'STATE' ? (
                      <MapPin className='w-4 h-4 mr-2 text-primary' />
                    ) : (
                      <Building2 className='w-4 h-4 mr-2 text-primary' />
                    )}
                    <div className='flex flex-col'>
                      <span className='font-medium text-black'>
                        {city.label}
                      </span>
                      {city.region && (
                        <span className='text-xs text-primary'>
                          {city.region}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Properties Group */}
            {(hasProperties || (isLoadingProperties && hasSearchValue)) && (
              <CommandGroup heading='PROPERTIES'>
                {isLoadingProperties && hasSearchValue ? (
                  <div className='flex items-center justify-center py-4'>
                    <Spinner />
                  </div>
                ) : (
                  properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/villa-in-${property?.citySlug}/${property?.slug}?adults=1&children=0`}
                      className='block'
                      aria-label={property?.name}
                      target='_blank'
                      prefetch={false}
                    >
                      <CommandItem
                        onSelect={() => handlePropertySelect(property)}
                        className='cursor-pointer'
                      >
                        <div className='w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-gray-100 relative mr-2'>
                          {property?.defaultMedia?.url ? (
                            <Image
                              src={property?.defaultMedia?.url}
                              alt={'Property Image'}
                              fill
                              className='object-cover'
                              priority
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <Building2
                                className='w-4 h-4 text-gray-400'
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col flex-1 min-w-0'>
                          <span className='font-medium text-black text-sm truncate'>
                            {property.name || property.title}
                          </span>
                        </div>
                      </CommandItem>
                    </Link>
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySearch;
