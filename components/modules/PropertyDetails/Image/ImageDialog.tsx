'use client';

import CustomImage from '@/components/common/CustomImage';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { trackEvent } from '@/lib/mixpanel';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

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

interface ImageGalleryProps {
  images: { url: string; name?: string }[];
  setActiveIndex: (index: number) => void;
  setOpenImageSlider: (open: boolean) => void;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

interface LazyMediaProps {
  img: { url: string; name?: string };
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
}

const LazyMedia = ({
  img,
  width,
  height,
  onClick,
  className,
}: LazyMediaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '100px 0px',
    amount: 0.1,
  });

  const isVideo = (url: string) => {
    return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div ref={ref} className={className} onClick={onClick}>
      {isInView ? (
        isVideo(img.url) ? (
          <div className='aspect-video w-full'>
            <VideoPlayer
              src={img.url}
              poster={img.name}
              thumbnail={img.name}
              className='h-full w-full object-cover overflow-hidden'
              showControls={true}
              showPlayButton={true}
              showVolumeControl={true}
              preload='none'
              muted={true}
              isActive={true}
              autoplay={false}
            />
          </div>
        ) : (
          <CustomImage
            src={img.url}
            alt={img.name || 'villa image'}
            width={width || 1900}
            height={height || 1200}
            quality={80}
            outFixClass='relative w-full h-auto'
            className='w-full h-auto max-h-none object-cover'
            priority={false}
          />
        )
      ) : (
        <div className='flex aspect-[4/3] w-full items-center justify-center rounded-md bg-gray-200 animate-pulse'>
          <div className='text-sm text-gray-400'>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default function StylishImageGallery({
  images,
  setActiveIndex,
  setOpenImageSlider,
}: ImageGalleryProps) {
  const galleryChunks = chunkArray(images, 6);

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    trackEvent('image_clicked', {
      index: index + 1,
      total_images: images.length,
      vertical_position: index + 1,
    });
    setOpenImageSlider(true);
  };

  const isVideo = (url: string) => {
    return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const getClickHandler = (
    img: { url: string; name?: string },
    index: number
  ) => {
    return isVideo(img.url) ? undefined : () => handleImageClick(index);
  };

  return (
    <>
      <div className='grid gap-6' id='outdoors'>
        {galleryChunks.map((chunk, chunkIndex) => {
          const baseIndex = chunkIndex * 6;
          return (
            <div key={chunkIndex} className='grid gap-4'>
              {/* Top 2 images - single column on mobile, 2 columns on desktop */}
              <div className='grid grid-cols-1 gap-4'>
                {chunk.slice(0, 2).map((img, i) => (
                  <LazyMedia
                    key={`${img.url}-${baseIndex + i}`}
                    img={img}
                    width={1200}
                    height={800}
                    onClick={getClickHandler(img, baseIndex + i)}
                    className={`w-full rounded-md overflow-hidden ${
                      !isVideo(img.url) ? 'cursor-pointer' : ''
                    }`}
                  />
                ))}
              </div>

              {/* Large middle image */}
              {chunk[2] && (
                <LazyMedia
                  img={chunk[2]}
                  onClick={getClickHandler(chunk[2], baseIndex + 2)}
                  className={`w-full rounded-md overflow-hidden ${
                    !isVideo(chunk[2].url) ? 'cursor-pointer' : ''
                  }`}
                />
              )}

              {/* Bottom 3 images - single column on mobile, 3 columns on desktop */}
              <div className='grid grid-cols-1 gap-4'>
                {chunk.slice(3, 6).map((img, i) => (
                  <LazyMedia
                    key={`${img.url}-${baseIndex + 3 + i}`}
                    img={img}
                    onClick={getClickHandler(img, baseIndex + 3 + i)}
                    className={`w-full rounded-md overflow-hidden ${
                      !isVideo(img.url) ? 'cursor-pointer' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
