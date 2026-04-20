'use client';
import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselSectionWrapperProps } from './SectionTypes';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import Svg from '../Svg';

export const SectionTemplate = memo(
  ({
    textAlign,
    heading,
    description,
    children,
    id,
    showDefaultArrows = true,
    justifyContent = 'justify-between',
    onPrev,
    onNext,
    buttonName,
    isButton = false,
    buttonLink = '',
    prive = false,
    className,
    verticalPosition,
    horizontalPosition,
    isStar,
    onClick,
  }: CarouselSectionWrapperProps & { prive?: boolean }) => {
    const isMobile = useIsMobile();

    // Memoize computed values
    const containerClassName = useMemo(
      () =>
        cn(
          `relative ${prive ? 'bg-[#151515]' : ''}`,
          verticalPosition && `vertical-position-${verticalPosition}`,
          horizontalPosition && `horizontal-position-${horizontalPosition}`,
          className
        ),
      [prive, className]
    );

    const contentWrapperClassName = useMemo(
      () =>
        cn(`flex flex-col gap-1 md:w-full`, prive && 'text-[var(--prive2)]'),
      [prive]
    );

    const headingClassName = useMemo(
      () =>
        cn(
          `text-${textAlign} font-serif text-xl md:text-4xl inline-flex`,
          prive &&
            'bg-[conic-gradient(from_70.97deg_at_10.54%_-10.5%,_#B18457_0deg,_#EFBF8E_360deg)] text-transparent bg-clip-text',
          textAlign === 'center' && 'justify-center'
        ),
      [textAlign, prive]
    );

    const descriptionClassName = useMemo(
      () =>
        cn(
          `text-${textAlign} text-xs sm:text-sm md:text-base sm:p-0`,
          prive && 'text-white',
          textAlign === 'center' && 'px-3'
        ),
      [textAlign, prive]
    );

    const buttonClassName = useMemo(
      () =>
        cn(
          'pl-6 pr-6 h-[49px] rounded-full sm:min-w-[180px]',
          !prive &&
            'bg-accent-red-900 hover:bg-accent-red-950 text-white text-xs font-semibold'
        ),
      [prive]
    );

    // Memoize star SVG components
    const starElements = useMemo(() => {
      if (!isStar) return null;

      return (
        <>
          <Svg
            src={`${process.env.IMAGE_DOMAIN}/star_d2e9ba2a3d.svg`}
            className='w-4 md:w-7 h-4 md:h-7 md:-mt-6 -mt-3 md:mr-1 -mr-0.25 md:-ml-1 ml-0.25'
          />
          <Svg
            src={`${process.env.IMAGE_DOMAIN}/star_d2e9ba2a3d.svg`}
            className='w-2 md:w-4 h-2 md:h-4 md:-mt-2 mt-0.25'
          />
        </>
      );
    }, [isStar]);

    // Memoize arrow buttons
    const arrowButtons = useMemo(() => {
      if (!showDefaultArrows) return null;

      return (
        <div className='flex gap-2 items-center'>
          <Button
            variant='outline'
            className='w-9 h-9 p-0 border-foreground border rounded-full cursor-pointer'
            onClick={onPrev}
          >
            <ChevronLeft className='w-5 h-5' />
          </Button>
          <Button
            variant='outline'
            className='w-9 h-9 p-0 border-foreground border rounded-full cursor-pointer'
            onClick={onNext}
          >
            <ChevronRight className='w-5 h-5' />
          </Button>
        </div>
      );
    }, [showDefaultArrows, onPrev, onNext]);

    // Memoize action button
    const actionButton = useMemo(() => {
      if (isMobile || !isButton) return null;

      return (
        <Button
          asChild
          variant={prive ? 'prive-default' : 'default'}
          size={'lg'}
          className={buttonClassName}
          onClick={onClick}
        >
          <Link href={buttonLink}>{buttonName}</Link>
        </Button>
      );
    }, [isMobile, isButton, prive, buttonClassName, buttonLink, buttonName]);

    // Memoize content header
    const contentHeader = useMemo(() => {
      if (!heading && !description && !showDefaultArrows) return null;

      return (
        <div className={`flex items-center ${justifyContent} mb-4 sm:mb-6`}>
          <div className={contentWrapperClassName}>
            {heading && (
              <h3 className={headingClassName}>
                {heading}
                {starElements}
              </h3>
            )}

            {description && (
              <h5 className={descriptionClassName}>{description}</h5>
            )}
          </div>

          {arrowButtons}
          {actionButton}
        </div>
      );
    }, [
      heading,
      description,
      showDefaultArrows,
      justifyContent,
      contentWrapperClassName,
      headingClassName,
      starElements,
      descriptionClassName,
      arrowButtons,
      actionButton,
    ]);

    return (
      <div className={containerClassName} id={id}>
        {contentHeader}
        {children}
      </div>
    );
  }
);

SectionTemplate.displayName = 'SectionTemplate';
