'use client';

import CustomImage from '@/components/common/CustomImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface BannerListingSlide {
  urlDesktop: string;
  urlMobile: string;
}

interface BannerListingProps {
  banners: BannerListingSlide[];
}

export default function SearchPageBanner({ banners }: BannerListingProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  if (!banners?.length) return null;
  return (
    <section
      className='relative w-full min-h-[200px] md:min-h-[300px]'
      aria-label='Banner carousel'
    >
      <Carousel
        className='w-full'
        opts={{ loop: true, duration: 40 }}
        setApi={setApi}
      >
        <CarouselContent className='m-0!'>
          {banners.map((banner, index) => (
            <CarouselItem
              key={`banner-${index}-${banner.urlDesktop}`}
              className='w-full p-0 m-0!'
            >
              <div className='relative w-full h-[200px] md:h-[300px] overflow-hidden m-0!'>
                <CustomImage
                  src={isMobile ? banner.urlMobile : banner.urlDesktop}
                  alt={`Banner ${index + 1}`}
                  format='webp'
                  width={isMobile ? 620 : 1600}
                  height={isMobile ? 300 : 380}
                  quality={60}
                  className='object-cover w-full h-full'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {banners.length > 1 && (
          <>
            <div
              className='absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2'
              role='tablist'
              aria-label='Carousel slides'
            >
              {banners.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  role='tab'
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={index === activeIndex}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    'rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                    'h-1.5 w-1.5 sm:h-1.5 sm:w-1.5 bg-white/30 hover:bg-white/50',
                    index === activeIndex && 'sm:w-8 w-4 bg-white'
                  )}
                />
              ))}
            </div>
            {api && (
              <>
                <button
                  type='button'
                  aria-label='Previous slide'
                  onClick={() => api.scrollPrev()}
                  className='cursor-pointer hidden md:flex absolute left-2 top-1/2 z-10 -translate-y-1/2 p-2 text-white drop-shadow-lg rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'
                >
                  <ChevronLeft width={32} height={32} strokeWidth={1.5} />
                </button>
                <button
                  type='button'
                  aria-label='Next slide'
                  onClick={() => api.scrollNext()}
                  className='cursor-pointer hidden md:flex absolute right-2 top-1/2 z-10 -translate-y-1/2 p-2 text-white drop-shadow-lg rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'
                >
                  <ChevronRight width={32} height={32} strokeWidth={1.5} />
                </button>
              </>
            )}
          </>
        )}
      </Carousel>
    </section>
  );
}
