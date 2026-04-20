'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import SingleBlogPageForm from '@/components/wordpressComponents/WPForms/SingleBlogPageForm';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import CustomImage from '@/components/common/CustomImage';
import useIsMobile from '@/hooks/useIsMobile';
import { VideoPlayer } from '@/components/common/VideoPlayer';

interface BannerContentSection {
  isBannerInfoBox?: boolean;
  Heading?: string;
  SubHeading?: string;
  banner?: {
    BannerMob?: string;
    BannerDesk?: string;
    thumbnailMob?: string;
    thumbnailDesk?: string;
  };
  bannerContent?: {
    firstLine?: string;
    secondLine?: string;
  };
  classNameBanner?: string;
  ctaName?: string;
  isCorporateOffsite?: boolean;
  formContentClassName?: string;
}

const isVideoSource = (source?: string) =>
  Boolean(source && /\.(mp4|webm|ogg)$/i.test(source?.split('?')[0] ?? ''));

const BannerSection: React.FC<BannerContentSection> = ({
  Heading,
  SubHeading,
  banner,
  bannerContent,
  isBannerInfoBox,
  ctaName,
  isCorporateOffsite = false,
  formContentClassName = 'h-screen h-auto! sm:h-[640px]! sm:max-w-[550px]! bg-card gap-0 fixed! bottom-0!',
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const isMobileVideo = useMemo(
    () => isVideoSource(banner?.BannerMob),
    [banner?.BannerMob]
  );

  const isDesktopVideo = useMemo(
    () => isVideoSource(banner?.BannerDesk),
    [banner?.BannerDesk]
  );

  const isVideo = isMobile ? isMobileVideo : isDesktopVideo;
  const mediaSource = isMobile
    ? (banner?.BannerMob ?? '')
    : (banner?.BannerDesk ?? '');
  const posterSource = isMobile
    ? (banner?.BannerDesk ?? '')
    : (banner?.BannerMob ?? '');
  const thumbnailSource = isMobile
    ? (banner?.thumbnailMob ?? '')
    : (banner?.thumbnailDesk ?? '');
  const imageDimensions = isMobile
    ? { width: 600, height: 520 }
    : { width: 1920, height: 480 };
  const imageClassName = `object-cover w-full h-full${
    isMobile ? '' : ' object-bottom'
  }`;

  return (
    <>
      <div className='relative w-full h-[85vh] max-h-[600px] md:min-h-[600px] xl:h-[90vh] sm:max-h-[600px] md:max-h-[700px] lg:max-h-[430px] xl:max-h-[600px]'>
        {isVideo ? (
          <VideoPlayer
            src={mediaSource}
            poster={posterSource}
            thumbnail={thumbnailSource}
            isActive
            autoplay
            loop
            preload='none'
            muted
            showControls={false}
            showPlayButton={false}
            showVolumeControl={false}
            showLoadingSpinner={false}
            className={`w-full h-full${isMobile ? '' : ' object-bottom'}`}
          />
        ) : (
          <CustomImage
            src={mediaSource}
            alt={Heading || ''}
            className={imageClassName}
            priority
            {...imageDimensions}
          />
        )}

        {/* Overlay Content */}
        {isBannerInfoBox ? (
          <div className='absolute inset-x-5 bg-[var(--white2)] bottom-5 md:bottom-12 md:left-10 md:inset-x-auto md:w-[550px] backdrop-blur-xl rounded-2xl overflow-hidden z-10 p-5 md:p-10'>
            <p className='text-accent-red-900 flex items-center font-semibold italic text-xs md:text-sm text-center md:text-left mb-1'>
              <span>{bannerContent?.firstLine}</span>{' '}
              <span className='bg-accent-red-900 h-1 w-1 flex rounded-full ml-2.5 mr-1.5'></span>
              <span>{bannerContent?.secondLine}</span>
            </p>

            <h1 className='text-foreground md:text-left text-xl md:text-3xl leading-6 md:leading-12 font-serif pt-1 mb-2 md:mb-4'>
              {Heading}
            </h1>
            <p className='text-foreground text-xs md:text-sm md:text-left mb-6 max-w-xl'>
              {SubHeading}
            </p>
            <div className='flex justify-center md:justify-start'>
              <Button
                onClick={() => setOpen(true)}
                className='bg-white text-foreground font-semibold text-xs rounded-full h-12 px-6 py-3 hover:bg-primary-100'
              >
                {ctaName}
              </Button>
            </div>
          </div>
        ) : (
          <div className='absolute bottom-25 md:bottom-20 left-0 right-0 mx-auto md:left-10 rounded-2xl overflow-hidden z-10 p-5 md:p-10'>
            <div className='flex justify-center md:justify-start'>
              <Button
                onClick={() => setOpen(true)}
                className='bg-white text-foreground font-semibold text-sm rounded-full h-12 px-8 py-4 hover:bg-primary-100'
              >
                {ctaName}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ResponsiveDialogDrawer
        contentClassName={formContentClassName}
        title="Let's Find You Perfect Venue"
        description="Tell us what you're planning, we'll make it real."
        open={open}
        setOpen={setOpen}
      >
        <SingleBlogPageForm
          formType='event'
          onClose={() => setOpen(false)}
          isCorporateOffsite={isCorporateOffsite}
        />
        <div className='relative h-auto overflow-auto pt-0 mb-20'></div>
      </ResponsiveDialogDrawer>
    </>
  );
};

export default BannerSection;
