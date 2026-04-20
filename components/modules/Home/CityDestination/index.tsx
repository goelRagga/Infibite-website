import { CityDestinationProps } from 'city-destination';
import dynamic from 'next/dynamic';
const CityDestinationCard = dynamic(() => import('../CityDestinationCard'), {
  ssr: false,
  loading: () => null,
});
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useMemo, useCallback, Suspense } from 'react';
import CustomImage from '@/components/common/CustomImage';
// import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/mixpanel';
import { formatCityName } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CityData {
  __typename: string;
  name: string;
  noOfProperties: number;
  homepageImageUrl: string;
  slug: string;
  category: string;
  categoryIcon?: string;
}

interface CityType {
  cityType: string;
  cityLink: string;
  cityIcon: string;
}

const CityDestinations: React.FC<CityDestinationProps> = ({ data }) => {
  const router = useRouter();

  // Memoize unique city types to prevent recalculation on every render
  const uniqueCityTypes: CityType[] = useMemo(() => {
    if (!data?.length) return [];

    const cityTypeMap = new Map<string, CityType>();

    data.forEach((city: CityData) => {
      if (city?.category && !cityTypeMap.has(city.category)) {
        cityTypeMap.set(city.category, {
          cityType: city.category,
          cityLink: `/${city.category.toLowerCase().replace(/\s+/g, '-')}/`,
          cityIcon: city.categoryIcon || '',
        });
      }
    });

    const cityTypesArray = Array.from(cityTypeMap.values());

    // Sort: "Beach Retreats" first, "Urban Getaways" second, rest random
    return cityTypesArray.sort((a, b) => {
      const aType = a.cityType.toLowerCase().trim();
      const bType = b.cityType.toLowerCase().trim();

      // "Beach Retreats" always first
      if (aType === 'beach retreats') return -1;
      if (bType === 'beach retreats') return 1;

      // "Urban Getaways" always second (after Beach Retreats)
      if (aType === 'urban getaways') return -1;
      if (bType === 'urban getaways') return 1;

      // Rest are random
      return Math.random() - 0.5;
    });
  }, [data]);

  const [selectedTab, setSelectedTab] = useState<string>(
    uniqueCityTypes[0]?.cityType || ''
  );

  // Memoize cities by category to prevent filtering on every render
  const citiesByCategory = useMemo(() => {
    if (!data?.length) return new Map();

    const categoryMap = new Map<string, CityData[]>();

    data.forEach((city: CityData) => {
      if (city?.category) {
        if (!categoryMap.has(city.category)) {
          categoryMap.set(city.category, []);
        }
        categoryMap.get(city.category)!.push(city);
      }
    });

    return categoryMap;
  }, [data]);

  // Memoize tab change handler
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  // Memoize column span calculation
  const getColumnSpan = useCallback((index: number): string => {
    if (index < 4) {
      return index % 2 === 0 ? 'sm:col-span-2' : 'w-[160px] sm:col-span-1';
    }
    return index % 2 === 0 ? 'sm:col-span-1' : 'w-[160px] sm:col-span-2';
  }, []);

  // Early return if no data
  if (!data?.length || !uniqueCityTypes.length) {
    return null;
  }

  return (
    <div className='w-full mx-auto'>
      <div className='flex flex-col gap-1 md:w-full mb-4 sm:mb-6'>
        <h1
          className={'text-center font-serif text-xl md:text-4xl inline-flex'}
        >
          Dreamy Getaways, Luxurious Stays
        </h1>

        <p className={'text-xs sm:text-sm md:text-base sm:p-0'}>
          {'Your Next Escape Awaits at Our Handpicked Locations'}
        </p>
      </div>

      <Tabs
        value={selectedTab}
        defaultValue={uniqueCityTypes[0]?.cityType || ''}
        onValueChange={handleTabChange}
        className='w-ful gap-3 mt-0 sm:mt-6'
      >
        <div
          className='overflow-x-auto no-scrollbar -ml-5 pl-5 md:ml-0 md:pl-0'
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <TabsList className='flex gap-2 sm:gap-4 bg-transparent sm:mb-3 h-auto px-0! py-1 overflow-y-hidden whitespace-nowrap flex-nowrap min-w-max'>
            {uniqueCityTypes.map((item, index) => (
              <div key={`${item.cityType}-${index}`}>
                <TabsTrigger
                  onClick={() => {
                    trackEvent('widget_clicked', {
                      page_name: 'homepage',
                      city_name: item.cityType,
                      widget_name: 'City destination card',
                      cta_type: 'category_cards',
                      vertical_position: 2,
                      horizontal_position: 2,
                      number_of_cities_shown: citiesByCategory.get(
                        item.cityType
                      )?.length,
                    });
                  }}
                  value={item.cityType}
                  className='peer group flex-shrink-0 bg-primary-50 rounded-full text-primary-800 p-0 text-xs md:text-sm cursor-pointer border border-primary-100
                      data-[state=active]:bg-accent-red-50 data-[state=active]:font-semibold data-[state=active]:shadow-none
                      data-[state=active]:text-accent-red-900 leading-none md:w-[200px] h-[44px] pl-4 pr-4 data-[state=active]:border-accent-red-900 tab-border flex items-center gap-2'
                >
                  <span className='m-0 flex items-center gap-2 min-w-max'>
                    {item.cityIcon && (
                      <div
                      // whileHover={{ scale: 1.1 }}
                      // transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <CustomImage
                          format='svg'
                          src={item.cityIcon}
                          className='h-[16px]'
                          height={20}
                          width={20}
                          imageType='svg'
                          alt={`${item.cityType} icon`}
                        />
                      </div>
                    )}
                    {item.cityType}
                  </span>
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
        </div>

        {uniqueCityTypes.map((tabItem, tabIndex) => {
          const cities = citiesByCategory.get(tabItem.cityType) || [];

          return (
            <TabsContent
              key={`${tabItem.cityType}-${tabIndex}`}
              value={tabItem.cityType}
              className='mt-0'
            >
              <div className='flex gap-4 -ml-5 pl-5 w-[108%] overflow-x-auto no-scrollbar px-1 sm:grid sm:grid-cols-3 sm:gap-6 sm:w-full sm:pl-1 sm:-ml-1 sm:overflow-visible sm:px-0 lg:grid-cols-6'>
                {cities
                  .sort((a: CityData, b: CityData) => {
                    const aName = a.name.toLowerCase().trim();
                    const bName = b.name.toLowerCase().trim();
                    if (aName === 'north goa') return -1;
                    if (bName === 'north goa') return 1;
                    return 0;
                  })
                  .map((city: CityData, cityIndex: number) => {
                    const href = `/villas/villas-in-${formatCityName(city.slug)?.toLowerCase()}`;
                    return (
                      <Link
                        key={`${city.slug}-${cityIndex}`}
                        href={href}
                        className={`flex-shrink-0 sm:w-auto ${getColumnSpan(cityIndex)}`}
                        prefetch={false}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(href);
                        }}
                      >
                        <div>
                          <CityDestinationCard
                            name={city.name}
                            propertiesCount={city.noOfProperties}
                            link={city.slug}
                            image={city.homepageImageUrl}
                            index={cityIndex}
                          />
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default CityDestinations;
