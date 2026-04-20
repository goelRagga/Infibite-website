'use client';

import ElivaasLight from '@/assets/elivaasLight.svg';
import CustomImage from '@/components/common/CustomImage';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import useIsTablet from '@/hooks/useIsTablet';
import { trackEvent } from '@/lib/mixpanel';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';

const SearchPanel = dynamic(() => import('@/components/common/SearchPanel'));
const MobileSearchInput = dynamic(
  () => import('@/components/common/MobileSearchInput')
);
interface Banner {
  urlMobile: string;
  urlDesktop: string;
  isImage?: boolean;
  isVideo?: boolean;
  thumbnail?: string;
  mobilePoster?: string;
  link?: string;
}

export type { Banner };

interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  variant?: 'home' | 'listing';
  locations?: {
    id: string;
    name: string;
    slug: string;
  }[];
  verticalPosition?: number;
  horizontalPosition?: number;
}

export const BannerCarousel = ({
  banners,
  autoPlay = false,
  variant = 'home',
  locations = [],
  verticalPosition,
  horizontalPosition,
}: BannerCarouselProps) => {
  const isTablet = useIsTablet();
  const isListingVariant = variant === 'listing';

  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [openSearchPanel, setOpenSearchPanel] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [loadedBanners, setLoadedBanners] = useState<Set<number>>(
    new Set([0, 1])
  );

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      setActiveIndex(currentIndex);
      const nextIndex = (currentIndex + 1) % banners.length;
      setLoadedBanners((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentIndex);
        newSet.add(nextIndex);
        return newSet;
      });
    };

    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api, banners]);

  // Control autoplay based on video state
  useEffect(() => {
    if (!api) return;

    if (isVideoPlaying) {
      // Pause carousel autoplay when video is playing
      api.plugins().autoplay?.stop();
    } else {
      // Resume carousel autoplay when video is not playing
      api.plugins().autoplay?.play();
    }
  }, [isVideoPlaying, api]);

  const shouldRenderBanner = useMemo(() => {
    return (index: number) => {
      if (loadedBanners.has(index)) return true;
      return false;
    };
  }, [loadedBanners]);

  // useEffect(() => {
  //   if (!autoPlay || !api) {
  //     setAutoplayProgress(0);
  //     return;
  //   }

  //   const startTime = Date.now();
  //   const timer = setInterval(() => {
  //     const elapsed = Date.now() - startTime;
  //     const progress = Math.min((elapsed / interval) * 100, 100);
  //     setAutoplayProgress(progress);

  //     if (progress >= 100) {
  //       api.scrollNext();
  //       setAutoplayProgress(0);
  //     }
  //   }, 50); // Update progress every 50ms for smooth animation

  //   return () => clearInterval(timer);
  // }, [autoPlay, interval, api, activeIndex]);

  return (
    <div
      className={cn(
        'relative w-full',
        isListingVariant ? 'min-h-[200px] md:min-h-[300px]' : 'h-full',
        !isListingVariant &&
          `vertical-position-${verticalPosition} horizontal-position-${horizontalPosition}`
      )}
    >
      {!isListingVariant && isTablet && (
        <div className='absolute top-8 left-1/2 scale-90 transform -translate-x-1/2 z-10 animate-in slide-in-from-top-10 zoom-in-100 duration-800 ease-out'>
          <Link href='/'>
            <ElivaasLight />
          </Link>
        </div>
      )}

      <Carousel
        className='w-full'
        opts={{ loop: true, duration: 40 }}
        plugins={
          [
            // Autoplay({
            //   delay: 5000,
            //   stopOnInteraction: false,
            //   stopOnMouseEnter: true,
            // }),
          ]
        }
        setApi={setApi}
      >
        <CarouselContent className='m-0!'>
          {banners?.map((banner, index) => (
            <CarouselItem
              key={`banner-${banner.urlDesktop}-${index}`}
              className='w-full p-0 m-0!'
            >
              <div
                className={cn(
                  'm-0! relative w-full overflow-hidden',
                  isListingVariant
                    ? 'h-[200px] md:h-[300px]'
                    : 'h-[85vh] max-h-[600px] md:min-h-[600px] xl:h-[90vh] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[430px] xl:max-h-[600px]'
                )}
              >
                {shouldRenderBanner(index) ? (
                  banner.link && banner.link.trim() !== '' ? (
                    <Link
                      prefetch={false}
                      href={banner.link}
                      onClick={() => {
                        trackEvent('banner_clicked', {
                          page_name: 'homepage',
                          banner_name: banner.urlDesktop,
                          banner_id: index,
                          vertical_position: '1',
                          horizontal_position: index,
                          banner_type: banner.isVideo ? 'video' : 'image',
                        });
                      }}
                    >
                      {banner.isVideo ? (
                        <VideoPlayer
                          src={banner.urlDesktop}
                          srcMobile={banner.urlMobile}
                          poster={banner.thumbnail}
                          posterMobile={banner.mobilePoster}
                          thumbnail={banner.thumbnail}
                          thumbnailMobile={banner.mobilePoster}
                          autoplay={index === activeIndex}
                          loop={true}
                          muted={true}
                          preload='none'
                          className='h-full w-full'
                          priority={index === 0}
                          onPlay={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(true);
                            }
                          }}
                          onPause={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(false);
                            }
                          }}
                          onEnded={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(false);
                              // Auto scroll to next slide after video completes
                              setTimeout(() => {
                                api?.scrollNext();
                              }, 1000); // 1 second delay before moving to next slide
                            }
                          }}
                          showControls={false}
                          showPlayButton={false}
                          showVolumeControl={false}
                          isActive={index === activeIndex}
                          height='auto'
                          width='auto'
                          format='mp4'
                        />
                      ) : (
                        <CustomImage
                          src={banner.urlDesktop}
                          srcMobile={banner.urlMobile}
                          alt={`Banner ${index + 1}`}
                          title={`Banner ${index + 1}`}
                          width={2000}
                          height={900}
                          quality={40}
                          priority={index === 0}
                          className='cursor-pointer h-full  w-full'
                        />
                      )}
                    </Link>
                  ) : (
                    <div>
                      {banner.isVideo ? (
                        <VideoPlayer
                          src={banner.urlDesktop}
                          srcMobile={banner.urlMobile}
                          poster={banner.thumbnail}
                          posterMobile={banner.mobilePoster}
                          thumbnail={banner.thumbnail}
                          thumbnailMobile={banner.mobilePoster}
                          autoplay={index === activeIndex}
                          loop={true}
                          muted={true}
                          preload='none'
                          className='h-full w-full'
                          priority={index === 0}
                          onPlay={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(true);
                            }
                          }}
                          onPause={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(false);
                            }
                          }}
                          onEnded={() => {
                            if (index === activeIndex) {
                              setIsVideoPlaying(false);
                              // Auto scroll to next slide after video completes
                              setTimeout(() => {
                                api?.scrollNext();
                              }, 1000); // 1 second delay before moving to next slide
                            }
                          }}
                          showControls={false}
                          showPlayButton={false}
                          showVolumeControl={false}
                          isActive={index === activeIndex}
                          height='auto'
                          width='auto'
                          format='mp4'
                        />
                      ) : (
                        <CustomImage
                          src={banner.urlDesktop}
                          srcMobile={banner.urlMobile}
                          alt={`Banner ${index + 1}`}
                          title={`Banner ${index + 1}`}
                          width={2000}
                          height={900}
                          quality={40}
                          priority={index === 0}
                          className='h-full w-full'
                        />
                      )}
                    </div>
                  )
                ) : (
                  <div className='w-full h-full bg-gray-200 animate-pulse' />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Slide Indicators */}
        {(autoPlay || isListingVariant) && banners?.length > 1 && (
          <div
            className={cn(
              'absolute left-1/2 transform -translate-x-1/2 z-20',
              isListingVariant ? 'bottom-3' : 'sm:bottom-8 bottom-6'
            )}
          >
            <div className='flex space-x-1 sm:space-x-2'>
              {banners?.map((banner, index) => (
                <div
                  key={`indicator-${banner.urlDesktop}-${index}`}
                  className={cn(
                    'w-1.5 h-1.5 bg-white/30 rounded-full transition-all duration-300',
                    index === activeIndex && 'sm:w-8 w-4 bg-white'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {!isListingVariant &&
          (isTablet ? (
            <Suspense fallback=''>
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='absolute bottom-35 transform z-10! px-4 w-full lg:max-w-4xl lg:-translate-x-1/2 lg:left-1/2'
              >
                <MobileSearchInput onClick={() => setOpenSearchPanel(true)} />
              </motion.div>
            </Suspense>
          ) : (
            <Suspense fallback=''>
              <motion.div
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='absolute bottom-20 transform z-10! px-4 w-full lg:max-w-4xl lg:-translate-x-1/2 lg:left-1/2'
              >
                <SearchPanel
                  pageType='home'
                  locations={locations}
                  shouldScrollOnTabClick
                />
              </motion.div>
            </Suspense>
          ))}

        {api && (
          <>
            <ChevronLeft
              width={80}
              height={80}
              strokeWidth={1}
              onClick={() => api.scrollPrev()}
              className='cursor-pointer hidden md:flex absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-transparent border-none p-0 m-0 text-white drop-shadow-lg cursor-pointer'
            />
            <ChevronRight
              width={80}
              height={80}
              strokeWidth={1}
              onClick={() => api.scrollNext()}
              className='cursor-pointer text-white drop-shadow-lg hidden md:flex absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-transparent border-none p-0 m-0 cursor-pointer'
            />
          </>
        )}
      </Carousel>

      {openSearchPanel && (
        <SearchPanel
          pageType='listing'
          setClose={setOpenSearchPanel}
          openDrawer={openSearchPanel}
          setOpenDrawer={setOpenSearchPanel}
          locations={locations}
        />
      )}
    </div>
  );
};

export default BannerCarousel;
