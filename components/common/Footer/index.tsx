'use client';

import ElivaasLight from '@/assets/elivaasLight.svg';
import FooterBGLogo from '@/assets/footerBigLogo.svg';
import { useDestinationsContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import { fallbackFooterData } from '@/lib/constants';
import { GET_DESTINATIONS_LIST } from '@/lib/queries';
import { cn } from '@/lib/utils';
import { AreaData, CityData, RawStateData, Region } from 'footerTypes';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useClient } from 'urql';
import FooterCopyright from './FooterCopyright';
import FooterRegionList from './FooterRegionList';
import FooterSocialIcons from './FooterSocialIcons';

const CompanyLinks = memo(function CompanyLinks({
  data,
  isMobile,
}: {
  data: typeof fallbackFooterData.company;
  isMobile: boolean;
}) {
  return (
    <>
      <h3 className='text-xs md:text-sm font-medium tracking-wider mb-4 md:mb-6 text-gray-400'>
        {data.title}
      </h3>
      <ul
        className={cn(
          'space-y-2',
          isMobile && 'flex flex-wrap gap-x-4 gap-y-2'
        )}
      >
        {data.links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              prefetch={false}
              className='text-xs md:text-sm text-gray-300 hover:text-white transition-colors'
              target={link.target === 'blank' ? '_blank' : '_self'}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
});

const BackgroundLogo = memo(function BackgroundLogo() {
  return (
    <div className='absolute bottom-0 left-0 w-full h-full pointer-events-none'>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 0.1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true }}
        className='absolute bottom-0 left-0 w-full'
      >
        <FooterBGLogo className='w-full' />
      </motion.div>
    </div>
  );
});

const processDestinationsData = (destinations: RawStateData[]): Region[] => {
  return destinations.map((destination: RawStateData) => {
    const region: Region = {
      name: destination.name,
      slug: destination.slug,
      cities: [],
    };

    if (destination.cities && Array.isArray(destination.cities)) {
      destination.cities.forEach((city: CityData) => {
        const processedCity = {
          name: city.name,
          slug: city.slug,
          areas:
            city.areas && Array.isArray(city.areas)
              ? city.areas.map((area: AreaData) => ({
                  name: area.name,
                  slug: area.slug,
                }))
              : undefined,
        };

        region.cities.push(processedCity);
      });
    }

    region.cities.sort((a, b) => a.name.localeCompare(b.name));

    region.cities.forEach((city) => {
      if (city.areas) {
        city.areas.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    return region;
  });
};
function Footer() {
  const isMobile = useIsMobile();
  const client = useClient();

  const { destinationsList, setDestinationsList } = useDestinationsContext();

  const DESTINATIONS_COOKIE_NAME = 'destinations_data';
  const CACHE_DURATION_DAYS = 1;

  const loadDestinationsFromCache = useCallback(() => {
    try {
      const cachedData = Cookies.get(DESTINATIONS_COOKIE_NAME);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDestinationsList(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Error loading destinations from cache:', error);
      Cookies.remove(DESTINATIONS_COOKIE_NAME);
    }
    return false;
  }, []);

  const saveDestinationsToCache = useCallback((data: Region[]) => {
    try {
      Cookies.set(DESTINATIONS_COOKIE_NAME, JSON.stringify(data), {
        expires: CACHE_DURATION_DAYS,
        sameSite: 'strict',
      });
    } catch (error) {
      console.error('Error saving destinations to cache:', error);
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    try {
      const result = await client
        .query(
          GET_DESTINATIONS_LIST,
          {},
          {
            fetchOptions: {
              headers: {
                'Channel-Id': process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      const processedRegions = processDestinationsData(
        result.data?.destinations ?? []
      );

      setDestinationsList(processedRegions);
      saveDestinationsToCache(processedRegions);
    } catch (error) {
      console.error('Failed to fetch destinations list:', error);
      setDestinationsList([]);
    }
  }, [client, saveDestinationsToCache]);

  useEffect(() => {
    const cacheLoaded = loadDestinationsFromCache();

    if (!cacheLoaded) {
      fetchDestinations();
    }
  }, [loadDestinationsFromCache, fetchDestinations]);

  const data = useMemo(
    () => ({
      ...fallbackFooterData,
      domesticDestinations: {
        ...fallbackFooterData.domesticDestinations,
        regions: destinationsList,
      },
    }),
    [destinationsList]
  );

  const radialBackground = useMemo(
    () => ({
      background: isMobile
        ? 'radial-gradient(108.14% 148.14% at 50% 128.68%, #301105 0%, #000000 49.4%, #000000 100%)'
        : 'radial-gradient(225.17% 225.17% at 46.33% 166.67%, #301105 0%, #000000 49.4%, #301105 100%)',
    }),
    [isMobile]
  );

  return (
    <footer
      className='text-white py-8 md:py-4 px-5 md:px-10 relative overflow-hidden z-0'
      style={radialBackground}
    >
      <BackgroundLogo />

      <div className='mx-auto relative z-1'>
        {!isMobile && (
          <div className='mb-10 mt-6'>
            <ElivaasLight />
          </div>
        )}

        {isMobile ? (
          <>
            <div className='flex justify-center mb-4'>
              <FooterSocialIcons />
            </div>
            <div className='border-t border-secondary-700 my-6' />
            <CompanyLinks data={data.company} isMobile={isMobile} />
            <div className='border-t border-secondary-700 my-6' />
            <h3 className='text-xs font-medium tracking-wider mb-4 text-gray-400'>
              {data.domesticDestinations.title}
            </h3>
            <FooterRegionList
              regions={data.domesticDestinations.regions}
              isMobile
            />
            <div className='border-t border-secondary-700 my-6' />
            <ElivaasLight className='mx-auto' />
            <FooterCopyright center />
          </>
        ) : (
          <div className='grid grid-cols-12 gap-8'>
            <div className='col-span-8'>
              <h3 className='text-sm font-medium tracking-wider mb-6 text-gray-400'>
                {data.domesticDestinations.title}
              </h3>
              <FooterRegionList
                regions={data.domesticDestinations.regions}
                isMobile={false}
              />
            </div>
            <div className='col-span-2'>
              <CompanyLinks data={data.company} isMobile={isMobile} />
            </div>
            <div className='col-span-2'>
              <h3 className='text-sm font-medium tracking-wider mb-6 text-gray-400'>
                {data.social.title}
              </h3>
              <FooterSocialIcons />
            </div>
          </div>
        )}

        {!isMobile && <FooterCopyright />}
      </div>
    </footer>
  );
}

export default memo(Footer);
