import { Card } from '@/components/ui/card';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React, { useMemo } from 'react';
import PropertyDetailsTypes from '../PropertyDetail.types';
import { MapPin } from 'lucide-react';
import { useRef } from 'react';

type NearestPlace = {
  href: string;
  label: string;
};

const MapInfo: React.FC<PropertyDetailsTypes.MapInfoProps> = ({
  googleMapEmbedLink,
  nearestLocation,
  isPrive,
}) => {
  const extractNearestPlaces = (html: string): NearestPlace[] => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const links = tempDiv.querySelectorAll('li > a');
    const nearestPlaces: NearestPlace[] = [];

    links.forEach((link) => {
      nearestPlaces.push({
        href: link.getAttribute('href') || '#',
        label: link.textContent?.trim() || '',
      });
    });

    return nearestPlaces;
  };

  const getModifiedMapUrl = (url?: string) => {
    if (!url) {
      return 'https://www.google.com/maps/embed?...';
    }

    const urlObj = new URL(url);
    urlObj.searchParams.set('zoom', '15');
    urlObj.searchParams.set('maptype', 'roadmap');
    urlObj.searchParams.set(
      'markers',
      'color:green%7Clabel:P%7C15.593963,73.743870'
    );
    urlObj.searchParams.set('ui', '1');

    return urlObj.toString();
  };

  const nearestPlaces: NearestPlace[] = useMemo(() => {
    if (typeof window !== 'undefined' && nearestLocation?.content) {
      return extractNearestPlaces(nearestLocation.content);
    }
    return [];
  }, [nearestLocation?.content]);

  const ref = useRef<HTMLDivElement>(null);

  // Get scroll progress for the icon
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // when icon enters/leaves viewport
  });

  // Calculate scale: 1.5 at center, 0.7 at edges
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [0.7, 1.3, 0.7]);
  // Optionally, smooth the scale
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 30 });

  return (
    <Card className='border-none shadow-none p-0 mt-0 dark:bg-[var(--prive-background)]'>
      <div className='overflow-hidden rounded-xl w-full h-[200px] md:h-[350px]'>
        <iframe
          title='Google Map'
          src={getModifiedMapUrl(googleMapEmbedLink)}
          width='100%'
          height={'100%'}
          className='border-0'
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          style={{
            filter: isPrive == true ? 'grayscale(.3) invert(90%)' : '',
          }}
        />
      </div>

      {nearestPlaces.length > 0 && (
        <div className='mt-2'>
          <h3 className='text-base sm:text-lg font-base text-foreground mb-4'>
            Nearest point of interest
          </h3>
          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 text-sm sm:text-sm text-muted-foreground'>
            {nearestPlaces.map((place, idx) => (
              <li
                key={idx}
                className='list-disc list-inside flex items-center gap-2'
              >
                <div ref={ref} className='flex items-center justify-center'>
                  <MapPin className='w-4 h-4 text-primary' />
                </div>
                <a
                  href={place.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 hover:text-primary border-gray-200 hover:border-primary'
                >
                  {place.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default MapInfo;
