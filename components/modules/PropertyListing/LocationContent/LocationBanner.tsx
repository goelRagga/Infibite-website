'use client';

import CustomImage from '@/components/common/CustomImage';
import VideoPlayer from '@/components/common/VideoPlayer';
import useIsMobile from '@/hooks/useIsMobile';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LocationBannerProps {
  cityContent?: any;
  imgMobile?: string;
  imgDesktop?: string;
  title?: string;
  description?: string;
}

const VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.mov',
  '.avi',
  '.mkv',
  '.wmv',
  '.flv',
  '.m4v',
  '.3gp',
  '.ogv',
];

const isVideo = (url: string) => {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
};

export const LocationBanner = ({
  cityContent,
  imgMobile,
  imgDesktop,
  title,
  description,
}: LocationBannerProps) => {
  const isMobile = useIsMobile();
  const imageUrl = isMobile
    ? cityContent?.mobileImageUrl || imgMobile
    : cityContent?.imageUrl || imgDesktop;

  const hasImage = !!imageUrl;
  const isVideoSource = isVideo(cityContent?.imageUrl);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='relative w-full h-38 sm:h-79 overflow-hidden'>
      <div className='relative w-full h-full'>
        {hasImage &&
          (isVideoSource ? (
            <VideoPlayer
              src={cityContent?.imageUrl}
              poster={cityContent?.mobileImageUrl}
              thumbnail={cityContent?.mobileImageUrl}
              className='w-full h-full object-cover'
              showControls={false}
              showPlayButton={false}
              showVolumeControl={false}
              preload='metadata'
              isActive={true}
              autoplay={true}
              format='mp4'
              loop={true}
              muted={true}
              width={isMobile ? 620 : 1600}
              height={isMobile ? 300 : 380}
            />
          ) : (
            <CustomImage
              format='webp'
              width={isMobile ? 620 : 1600}
              height={isMobile ? 300 : 380}
              quality={60}
              className='object-cover w-full h-full'
              alt='Banner'
              src={imageUrl}
            />
          ))}
        {/* Overlay */}
        {!isVideoSource && (
          <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/10 z-10' />
        )}

        {/* Centered Content */}
        <div className='absolute top-1/2 left-1/2 z-11 transform -translate-x-1/2 -translate-y-1/2 text-center px-4 w-full'>
          <h1
            className='text-white text-[20px] md:text-4xl font-serif font-semibold'
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.7, delay: 0.2 }}
          >
            {cityContent?.title || title}
          </h1>
          <h2
            className='text-white text-[12px] md:text-lg mt-2 max-w-[600px] mx-auto'
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.7, delay: 0.5 }}
          >
            {cityContent?.description || description}
          </h2>
        </div>
        {!isVideoSource && (
          <div
            className={`absolute left-0 top-0 w-full h-full z-1`}
            style={{
              background: 'var(--backgroundGradient9)',
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default LocationBanner;
