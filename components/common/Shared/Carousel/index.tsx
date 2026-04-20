import React, { useImperativeHandle, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui';
import { CarouselProps } from './CarouselTypes';

export function CarouselTemplate<T>({
  items,
  renderItem,
  slidesPerView = 1.2,
  loop = false,
  showArrows = false,
  spacing,
  autoPlay = false,
  autoPlayDelay = 3000,
  paginationDots,
  ref,
}: CarouselProps<T>) {
  const carouselRef = useRef<CarouselApi | null>(null);

  useImperativeHandle(ref, () => ({
    scrollPrev: () => carouselRef.current?.scrollPrev(),
    scrollNext: () => carouselRef.current?.scrollNext(),
  }));

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

  return (
    <div className="relative w-full">
      <Carousel
        className="w-full"
        opts={carouselOptions}
        plugins={plugins}
        setApi={(api) => (carouselRef.current = api)}
      >
        <CarouselContent className={`ml-0 flex ${spacing}`}>
          {items?.map((item, index) => (
            <CarouselItem
              key={index}
              style={{ flexBasis: `calc(100% / ${slidesPerView})` }}
            >
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {(paginationDots || showArrows) && (
          <div className="mt-4 flex items-center justify-center gap-4">
            {showArrows && (
              <CarouselPrevious className="static translate-y-0 primary-950 cursor-pointer" />
            )}
            {/* {paginationDots && <CarouselDots className="mt-0" />} */}
            {showArrows && (
              <CarouselNext className="static translate-y-0 primary-950 cursor-pointer" />
            )}
          </div>
        )}
      </Carousel>
    </div>
  );
}
