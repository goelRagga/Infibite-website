'use client';
import React, { useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrevNextButtons } from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import { Template } from './Template';
import Image from 'next/image';
import useIsMobile from '@/hooks/useIsMobile';
import PropertyCard from '@/components/common/PropertyCard';
import { cn } from '@/lib/utils';

type PropType = {
  slides: any;
  options?: EmblaOptionsType;
  heading?: string;
  description?: string;
  topArrow?: boolean;
  isStar?: boolean;
  height?: string;
  mobHeight?: string;
  isDots?: boolean;
  prive?: boolean;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const isMobile = useIsMobile();
  const {
    slides,
    options,
    heading,
    description,
    topArrow,
    isStar,
    height = '580',
    mobHeight = '426',
    isDots = true,
    prive,
  } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: false }, [
    ClassNames(),
  ]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(2); // make second item active
    }
  }, [emblaApi]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className='embla'>
      {!topArrow && (
        <div className='flex flex-col gap-1 text-center text-card-foreground mb-8 '>
          <div className='flex justify-center items-center'>
            {heading && (
              <h1
                className={cn(
                  'font-serif text-xl md:text-4xl',
                  prive && 'text-[var(--prive2)]'
                )}
              >
                {heading}
              </h1>
            )}
            {isStar && (
              <>
                <Image
                  src={`${process.env.IMAGE_DOMAIN}/star_d2e9ba2a3d.svg`}
                  alt='logo'
                  width={isMobile ? 15 : 28}
                  height={isMobile ? 16 : 28}
                  className='md:mt-[-50px] mt-[-23px] md:mr-[7px] mr-[-2px] md:ml-[10px] ml-[1px]'
                />
                <Image
                  src={`${process.env.IMAGE_DOMAIN}/star_d2e9ba2a3d.svg`}
                  alt='logo'
                  width={isMobile ? 8 : 16}
                  height={isMobile ? 8 : 16}
                  className='md:mt-[-20px] mt-[2px]'
                />
              </>
            )}
          </div>

          {description && (
            <h5 className={cn('text-sm md:text-base', prive && 'text-white')}>
              {description}
            </h5>
          )}
        </div>
      )}
      {topArrow && (
        <div className={`flex items-center justify-between mb-4`}>
          <div className='flex flex-col gap-1 text-card-foreground'>
            {heading && (
              <h3 className='font-serif text-xl md:text-4xl'>{heading}</h3>
            )}
            {description && (
              <h5 className='text-sm md:text-base'>{description}</h5>
            )}
          </div>

          <div className='mt-4 flex items-center justify-end gap-4'>
            <button
              onClick={onPrevButtonClick}
              className='p-2 text-black hover:opacity-80 disabled:opacity-30 cursor-pointer'
              disabled={prevBtnDisabled}
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            <button
              onClick={onNextButtonClick}
              className='p-2 text-black hover:opacity-80 disabled:opacity-30 cursor-pointer'
              disabled={nextBtnDisabled}
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      )}
      <div className='embla__viewport' ref={emblaRef}>
        <div className='embla__container flex'>
          {slides?.map((item: any, index: number) => (
            <div
              className={`embla__slide snap-start px-2 xl:h-[${height}] h-[${mobHeight}] 
                h-[${isMobile ? mobHeight : height}px]
                 flex-[0_0_70%] md:flex-[0_0_20%] lg:flex-[0_0_25%] max-w-[70%] md:max-w-[20%] lg:max-w-[25%]`}
              key={index}
            >
              {item?.slug && item?.title ? (
                <PropertyCard
                  property={item}
                  variant='prive-home'
                  isClickable={false}
                  showActionButton={true}
                />
              ) : (
                <Template data={item} />
              )}
            </div>
          ))}
        </div>
      </div>
      {!topArrow && isDots && (
        <div className='embla__buttons flex items-center justify-center gap-4 py-4'>
          {!isMobile && (
            <button
              onClick={onPrevButtonClick}
              className='w-7 h-7 rounded-full border border-[#EFBF8E] bg-[rgba(177,132,87,0.1)] hover:bg-[rgba(177,132,87,0.15)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center justify-center'
              disabled={prevBtnDisabled}
            >
              <ChevronLeft className='w-3.5 h-3.5 text-[#B18457]' />
            </button>
          )}
          {isDots && (
            <div className='embla__dots flex gap-2 items-center'>
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={cn(
                    'cursor-pointer rounded-full transition-all embla__dot',
                    index === selectedIndex
                      ? 'embla__dot--selected bg-[#B09287] w-2.5 h-2.5 scale-100'
                      : 'bg-[#E1E1E4] w-2 h-2 md:w-2.5 md:h-2.5 scale-90'
                  )}
                />
              ))}
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onNextButtonClick}
              className='w-7 h-7 rounded-full border border-[#EFBF8E] bg-[rgba(177,132,87,0.1)] hover:bg-[rgba(177,132,87,0.15)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center justify-center'
              disabled={nextBtnDisabled}
            >
              <ChevronRight className='w-3.5 h-3.5 text-[#B18457]' />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmblaCarousel;
