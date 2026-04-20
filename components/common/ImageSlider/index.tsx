import { Button } from '@/components/ui/button';
import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  addThumbBtnsClickHandlers,
  addToggleThumbBtnsActive,
} from './emblaThumbsButton';
import { useDotButton } from './useDotButton';
import { usePrevNextButtons } from './usePrevNextButtons';

type EmblaCarouselProps<T = any> = {
  slides: T[];
  options?: EmblaOptionsType;
  thumbsOptions?: EmblaOptionsType;
  arrow?: boolean;
  renderSlide: (item: T, index: number) => React.ReactNode;
  wrapperClassName?: string;
  autoPlay?: boolean;
};

const EmblaCarousel = <T,>({
  slides,
  options,
  thumbsOptions = { containScroll: 'keepSnaps', dragFree: true },
  renderSlide,
  arrow,
  wrapperClassName,
  autoPlay = false,
}: EmblaCarouselProps<T>) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [thumbRef, emblaThumbApi] = useEmblaCarousel(thumbsOptions);
  const [isArrowHovered, setIsArrowHovered] = useState(false);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const cleanupFns = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    let interval: NodeJS.Timeout | null = null;
    if (autoPlay && !isArrowHovered) {
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 1500); // Adjust speed as needed
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [emblaApi, autoPlay, isArrowHovered]);

  useEffect(() => {
    if (!emblaApi || !emblaThumbApi) return;

    const removeClickHandlers = addThumbBtnsClickHandlers(
      emblaApi,
      emblaThumbApi
    );
    const removeToggleActive = addToggleThumbBtnsActive(
      emblaApi,
      emblaThumbApi
    );

    cleanupFns.current = [removeClickHandlers, removeToggleActive];

    return () => {
      cleanupFns.current.forEach((fn) => fn());
    };
  }, [emblaApi, emblaThumbApi]);

  return (
    <section
      className={cn(
        'relative max-w-3xl mx-auto',
        wrapperClassName,
        wrapperClassName?.includes('arrow-on-card-hover') && 'group'
      )}
    >
      {/* Main Carousel */}
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex ml-[-1rem]'>
          {slides?.map((item, index) => (
            <div
              className='group flex-[0_0_100%] min-w-0 pl-0 translate-z-0'
              key={index}
            >
              {renderSlide(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {arrow && (
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-full flex items-center justify-between px-4 z-10 transition-all duration-300 disabled:opacity-0 opacity-0 group-hover:opacity-100',
            wrapperClassName?.includes('arrow-on-card-hover')
              ? 'opacity-0 group-hover:opacity-100 pointer-events-none'
              : ''
          )}
          onMouseEnter={() => setIsArrowHovered(true)}
          onMouseLeave={() => setIsArrowHovered(false)}
        >
          <Button
            variant='outline'
            size='icon'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPrevButtonClick();
            }}
            disabled={prevBtnDisabled}
            className='hover:bg-white rounded-full border-1 border-white w-7 h-7 cursor-pointer pointer-events-auto disabled:opacity-0 transition-transform duration-200 hover:scale-110'
          >
            <ChevronLeft className='w-5 h-5' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNextButtonClick();
            }}
            disabled={nextBtnDisabled}
            className='hover:bg-white rounded-full border-1 border-white w-7 h-7 cursor-pointer border-white pointer-events-auto transition-transform duration-200 hover:scale-110 hover:scale-110'
          >
            <ChevronRight className='w-5 h-5' />
          </Button>
        </div>
      )}

      {/* Thumbs Carousel */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center'>
        <div className='flex items-center overflow-hidden' ref={thumbRef}>
          <div className='flex gap-1 max-w-8 mx-auto'>
            {slides.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'relative shrink-0 grow-0 basis-auto cursor-pointer transition-all duration-300 w-2 h-2 rounded-full border border-white bg-white transform scale-80 opacity-70',
                  selectedIndex === index
                    ? 'bg-white transform scale-100 opacity-100'
                    : ''
                )}
                onClick={() => onDotButtonClick(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
