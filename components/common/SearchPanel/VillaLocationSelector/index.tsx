'use client';

import useIsMobile from '@/hooks/useIsMobile';
import usePropertySearch from '@/hooks/usePropertySearch';
import { cn } from '@/lib/utils';
import { Building2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import { CityInputProps } from 'search-panel-types';
import CustomImage from '../../CustomImage';
import { Spinner } from '../../Spinner';

const VillaLocationSelector = memo(
  ({
    cityOptions,
    onCitySelect,
    onPropertySelect,
    className = '',
  }: CityInputProps) => {
    const [searchValue, setSearchValue] = useState('');
    const isMobile = useIsMobile();

    const { properties, isLoading: isLoadingProperties } =
      usePropertySearch(searchValue);

    const filteredCities = useMemo(() => {
      if (!searchValue.trim()) return cityOptions;
      const searchLower = searchValue.toLowerCase();
      return cityOptions.filter((city) =>
        city.label.toLowerCase().includes(searchLower)
      );
    }, [cityOptions, searchValue]);

    const handleSearchChange = useCallback((value: string) => {
      setSearchValue(value);
    }, []);

    const hasProperties = properties?.length > 0;
    const hasCities = filteredCities.length > 0;
    const hasSearchValue = searchValue.trim().length > 0;

    const showNoResults =
      hasSearchValue && !isLoadingProperties && !hasCities && !hasProperties;
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* Search Input */}
        <div className='z-20'>
          <div className='relative '>
            <div className='absolute left-4 top-1/2 transform  -translate-y-1/2 text-gray-400'>
              <Search
                size={18}
                strokeWidth={2}
                className='stroke-primary-400 dark:stroke-primary-800'
              />
            </div>

            <input
              type='text'
              placeholder='Where are you planning to stay?'
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='w-full h-12 pl-11 pr-36 text-sm text-primary-950 placeholder:text-primary-400 rounded-full bg-white focus:outline-none dark:bg-[var(--black5)] dark:text-white dark:placeholder-primary-800'
            />

            <div className='absolute right-4 top-1/2 transform -translate-y-1/2 italic text-xs text-secondary-400 dark:text-secondary-900 text-[10px] font-light pointer-events-none'>
              Property/ Location/ City
            </div>
          </div>
        </div>

        <div
          className='overflow-y-auto bg-white dark:bg-[var(--black5)] rounded-[18px] p-2 '
          style={{ maxHeight: 'calc(60vh - 100px)' }}
        >
          {/* No results */}
          {showNoResults && (
            <div className='flex flex-col items-center justify-center text-center py-10'>
              <h2 className='text-base font-semibold text-gray-600 dark:text-white'>
                No results found
              </h2>
            </div>
          )}

          {/* Cities Section */}
          {hasCities && (
            <div>
              <h6 className='text-[10px] font-medium tracking-wider bg-white text-gray-400 dark:text-secondary-800 uppercase px-1 dark:bg-[var(--black5)] z-[10] py-2'>
                DESTINATION
              </h6>
              <div className='space-y-1'>
                {filteredCities.map((city) => (
                  <div
                    key={city.value}
                    onClick={() => onCitySelect(city)}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--primary-10)] transition-all duration-150 cursor-pointer group dark:hover:bg-[#0D0D0D]'
                  >
                    <div className='flex items-center gap-3'>
                      {city.type === 'STATE' ? (
                        <MapPin className='w-[17px] h-[17px] stroke-primary-400 dark:text-secondary-800 hover:text-primary-400' />
                      ) : (
                        <Building2 className='w-[17px] h-[17px] stroke-primary-400 dark:text-secondary-800' />
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='text-[14px] text-gray-800 truncate dark:text-white'>
                          {city.label}
                        </p>
                        {city.region && (
                          <p className='text-xs text-gray-500 dark:text-white mt-0.5'>
                            {city.region}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {(hasProperties || (isLoadingProperties && hasSearchValue)) && (
            <div>
              <h6 className='text-[10px] font-medium tracking-wider bg-white text-gray-400 dark:text-secondary-800 uppercase px-1 dark:bg-[var(--black5)] z-[10] py-2'>
                PROPERTIES
              </h6>
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
                      className='group'
                      aria-label={property?.name}
                      target={
                        isMobile
                          ? '_self'
                          : `listing_/villa-in-${property?.citySlug}/${property?.slug}?adults=1&children=0`
                      }
                      prefetch={isMobile ? true : false}
                    >
                      <div
                        onClick={() => onPropertySelect?.(property)}
                        className='w-full text-left px-3 py-2 rounded-md hover:bg-[var(--primary-10)] transition-all duration-150 cursor-pointer group dark:hover:bg-[#0D0D0D]'
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
                            <p className='text-[13px] text-primary-950 leading-tight mb-0.5 dark:text-white line-clamp-2'>
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
  }
);

export default VillaLocationSelector;
