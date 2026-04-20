import React, { useImperativeHandle, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui';
import { trackEvent } from '@/lib/mixpanel';
// import { CarouselProps } from './CarouselTypes';

export function CarouselTemplate<T>({
  items,
  renderItem,
  slidesPerView = 1.3,
  loop = false,
  showArrows = false,
  spacing,
  autoPlay = false,
  autoPlayDelay = 3000,
  paginationDots,
  ref,
  heading,
  selectedCount,
  description,
  trackingProps,
}: any) {
  const carouselRef = useRef<CarouselApi | null>(null);

  useImperativeHandle(ref, () => ({
    scrollPrev: () => carouselRef.current?.scrollPrev(),
    scrollNext: () => carouselRef.current?.scrollNext(),
  }));

  const wheelGesturesPlugin = WheelGesturesPlugin({
    touchAction: 'pan-y',
    eventOptions: {
      passive: false,
      capture: true,
    },
  });

  // Configure plugins (autoplay)
  const plugins = React.useMemo(() => {
    if (autoPlay && loop) {
      return [
        Autoplay({
          delay: autoPlayDelay,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ];
    }
    return [];
  }, [autoPlay, loop, autoPlayDelay]);

  // Carousel options (looping + centering)
  const carouselOptions = {
    loop,
    align: 'center' as const,
    dragFree: true,
  };

  const handlePreviousClick = () => {
    if (trackingProps && carouselRef.current) {
      const horizontalPosition = carouselRef.current.selectedScrollSnap() + 1;
      trackEvent('property_content_clicked', {
        ...trackingProps,
        cta_type: 'carousel_previous',
        horizontal_position: horizontalPosition,
      });
    }
    carouselRef.current?.scrollPrev();
  };

  const handleNextClick = () => {
    if (trackingProps && carouselRef.current) {
      const horizontalPosition = carouselRef.current.selectedScrollSnap() + 1;
      trackEvent('property_content_clicked', {
        ...trackingProps,
        cta_type: 'carousel_next',
        horizontal_position: horizontalPosition,
      });
    }
    carouselRef.current?.scrollNext();
  };

  return (
    <div className='relative w-full'>
      <Carousel
        className='w-full'
        opts={carouselOptions}
        plugins={[wheelGesturesPlugin, ...plugins]}
        setApi={(api) => (carouselRef.current = api)}
      >
        {(heading || description || paginationDots || showArrows) && (
          <div className={`flex items-center justify-between mb-4 mt-2`}>
            <div className='flex flex-col gap-1 text-card-foreground'>
              {heading && (
                <h3 className='text-xl sm:text-2xl font-serif'>{heading}</h3>
              )}
              {description && (
                <h5 className='text-sm md:text-base'>{description}</h5>
              )}
            </div>
            {(paginationDots || showArrows) && (
              <div className='flex items-center justify-end gap-2 sm:gap-4'>
                {showArrows && (
                  <CarouselPrevious
                    className='static size-9 sm:size-10 translate-y-0 text-[var(--color-accent-red-900)] cursor-pointer border-[var(--color-accent-red-900)] dark:text-accent-yellow-950 dark:bg-[#2E282A] dark:border-accent-yellow-950'
                    onClick={handlePreviousClick}
                  />
                )}

                {showArrows && (
                  <CarouselNext
                    className='static size-9 sm:size-10 translate-y-0 text-[var(--color-accent-red-900)] cursor-pointer border-[var(--color-accent-red-900)] dark:text-accent-yellow-950 dark:bg-[#2E282A] dark:border-accent-yellow-950'
                    onClick={handleNextClick}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* dark:border-primary-800 */}

        <CarouselContent className={`ml-0 flex ${spacing} `}>
          {items?.map((item: any, index: number) => {
            const baseSlides =
              typeof slidesPerView === 'number' ? slidesPerView : 1;
            const smSlides =
              typeof slidesPerView === 'object' ? slidesPerView.sm : undefined;
            const mdSlides =
              typeof slidesPerView === 'object' ? slidesPerView.md : undefined;
            const lgSlides =
              typeof slidesPerView === 'object' ? slidesPerView.lg : undefined;
            const xlSlides =
              typeof slidesPerView === 'object' ? slidesPerView.xl : undefined;
            return (
              <CarouselItem
                key={index}
                style={{ flexBasis: `calc(100% / ${slidesPerView})` }}
                className={`
                basis-[calc(100%/${baseSlides})]
                ${smSlides ? `sm:basis-[calc(100%/${smSlides})]` : ''}
                ${mdSlides ? `sm:basis-[calc(100%/${mdSlides})]` : ''}
                ${lgSlides ? `xl:basis-[calc(100%/${lgSlides})]` : ''}
                ${xlSlides ? `xl:basis-[calc(100%/${xlSlides})]` : ''}
               first:ml-0 first:pl-0
              `}
              >
                {renderItem(item, index)}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* <div className="mt-4 flex items-center justify-center gap-4">
          {paginationDots && <CarouselDots className="mt-0" />}
        </div> */}
      </Carousel>
    </div>
  );
}
