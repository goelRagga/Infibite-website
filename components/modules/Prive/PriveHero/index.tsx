'use client';
import React, { useState } from 'react';
import { PriveHeroSectionData } from 'api-types';
import SearchPanel from '@/components/common/SearchPanel';
import MobileSearchInput from '@/components/common/MobileSearchInput';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { VideoPlayer } from '@/components/common/VideoPlayer';

interface PriveHeroProps {
  priveHeroSectionData: PriveHeroSectionData;
  locations: any[];
  verticalPosition?: number;
}

function PriveHero({
  priveHeroSectionData,
  locations,
  verticalPosition,
}: PriveHeroProps) {
  const logoBrand = (
    <Image
      src='/assets/elivaasPriveLogo.svg'
      alt='ELIVAAS'
      width={102}
      height={118}
    />
  );
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [openSearchPanel, setOpenSearchPanel] = useState(false);

  // Scroll-based animations
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  return (
    <div
      className={`relative w-full md:h-[70vh] lg:h-[90vh] h-[80vh] ${verticalPosition && `vertical-position-${verticalPosition}`}`}
    >
      {/* Background Video Container */}
      <div className='absolute inset-0'>
        <VideoPlayer
          src={
            isTablet
              ? `${process.env.IMAGE_DOMAIN}/${priveHeroSectionData.banner.mobileSrc}`
              : `${process.env.IMAGE_DOMAIN}/${priveHeroSectionData.banner.webSrc}`
          }
          poster={`${process.env.IMAGE_DOMAIN}/${priveHeroSectionData.banner.poster}`}
          thumbnail={`${process.env.IMAGE_DOMAIN}/${priveHeroSectionData.banner.poster}`}
          autoplay={true}
          loop={true}
          muted={true}
          preload='none'
          className='h-full w-full'
          onPlay={() => console.log('Video started')}
          onPause={() => console.log('Video paused')}
          showControls={false}
          showPlayButton={false}
          showVolumeControl={false}
          isActive={true}
        />
        {/* Gradient overlay on top of video */}
        <div className='absolute inset-0 bg-gradient-to-b from-[var(--prive4)]/75 via-[var(--prive4)]/50 to-[var(--prive4)]'></div>
      </div>

      {/* Content Container */}
      <div className='relative z-10 flex flex-col items-center justify-center h-full px-4'>
        {/* Logo Section - Positioned at top */}
        <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 mt-0 md:hidden'>
          {logoBrand}
        </div>

        {/* Main Content */}
        <div className='flex flex-col items-center justify-center text-center px-4 space-y-2 mt-0'>
          {/* Main Heading */}
          <motion.h1
            style={{ scale, opacity }}
            className='text-white font-serif font-normal text-2xl md:text-6xl leading-tight text-center max-w-sm md:max-w-5xl'
          >
            {priveHeroSectionData.heading}
          </motion.h1>

          {/* Subheading */}
          <p className='text-[var(--white1)] font-sans font-normal text-xs md:text-sm leading-relaxed text-center max-w-sm md:max-w-xl'>
            {priveHeroSectionData.description}
          </p>
        </div>

        <div className='absolute bottom-20 transform z-10! px-4 w-full md:max-w-4xl md:-translate-x-1/2 md:left-1/2'>
          {isTablet ? (
            <MobileSearchInput onClick={() => setOpenSearchPanel(true)} />
          ) : (
            <SearchPanel
              pageType='home'
              locations={locations}
              isPrive
              shouldScrollOnTabClick
            />
          )}
        </div>
      </div>

      {openSearchPanel && (
        <SearchPanel
          pageType='listing'
          setClose={setOpenSearchPanel}
          openDrawer={openSearchPanel}
          setOpenDrawer={setOpenSearchPanel}
          locations={locations}
          isPrive
        />
      )}
    </div>
  );
}

export default PriveHero;
