import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FooterRegionListProps } from 'footerTypes';

const FooterRegionList: React.FC<FooterRegionListProps> = ({
  regions,
  isMobile = false,
}) => {
  return isMobile ? (
    <div className='columns-2 gap-4 space-y-6'>
      {regions.map((region, i) => (
        <div key={i} className='break-inside-avoid mb-6'>
          <h5 className='text-xs font-semibold mb-2 text-white'>
            <Link
              href={`/villas/villas-in-${region.slug}`}
              prefetch={false}
              className={cn(
                'text-xs text-gray-400 hover:text-white transition-colors',
                isMobile && 'text-gray-300'
              )}
            >
              Villas in {region.name}
            </Link>
          </h5>

          {region.cities.map((city, j) => (
            <div key={j} className='mb-3'>
              <p className='text-xs font-medium text-gray-200 mb-1'>
                <Link
                  prefetch={false}
                  href={`/villas/villas-in-${city.slug}`}
                  className='hover:text-white transition-colors'
                >
                  {city.name}
                </Link>
              </p>

              {city.areas && city.areas.length > 0 ? (
                <ul className='flex flex-col space-y-1'>
                  {city.areas.map((area, k) => (
                    <li key={k}>
                      <Link
                        prefetch={false}
                        href={`/villas/villas-in-${area.slug}`}
                        className='text-xs text-gray-300 hover:text-white transition-colors'
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div className='columns-4 gap-4 space-y-4'>
      {regions.map((region, i) => (
        <div key={i} className='break-inside-avoid mb-4 space-y-2'>
          <h6 className='text-sm font-semibold text-gray-300 mb-2'>
            <Link
              href={`/villas/villas-in-${region.slug}`}
              className='hover:text-white transition-colors'
              prefetch={false}
            >
              Villas in {region.name}
            </Link>
          </h6>

          {region.cities.map((city, j) => (
            <div key={j} className='mb-3'>
              <p className='text-sm font-medium text-gray-200 mb-1'>
                <Link
                  href={`/villas/villas-in-${city.slug}`}
                  className='text-sm text-gray-400 hover:text-white transition-colors'
                  prefetch={false}
                >
                  {city.name}
                </Link>
              </p>

              {city.areas && city.areas.length > 0 ? (
                <ul className='space-y-1'>
                  {city.areas.map((area, k) => (
                    <li key={k}>
                      <Link
                        href={`/villas/villas-in-${area.slug}`}
                        className='text-sm text-gray-400 hover:text-white transition-colors'
                        prefetch={false}
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FooterRegionList;
