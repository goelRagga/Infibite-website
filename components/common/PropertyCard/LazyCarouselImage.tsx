'use client';
import CustomImage from '@/components/common/CustomImage';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from '../VideoPlayer';

type SlideData = {
  name: string;
  url: string;
};

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

interface LazyCarouselImageProps {
  item: SlideData;
  index: number;
  shouldLoad: boolean;
  isFirstImage: boolean;
  priority?: boolean;
}

const LazyCarouselImage = ({
  item,
  index,
  shouldLoad,
  isFirstImage,
  priority = false,
}: LazyCarouselImageProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver to detect when slide becomes visible in carousel
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of slide is visible
        root: element.closest('.overflow-hidden'), // Observe within carousel container
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load image when:
  // 1. It's the first image AND shouldLoad is true (card in viewport)
  // 2. OR it's not the first image AND it becomes visible in carousel
  useEffect(() => {
    const shouldLoadImage = isFirstImage ? shouldLoad : isVisible;
    if (shouldLoadImage && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isFirstImage, shouldLoad, isVisible, hasLoaded]);

  if (!hasLoaded) {
    // Render placeholder for unloaded images
    return (
      <div
        ref={ref}
        className='bg-primary-100 rounded w-full h-[260px] md:h-[270px] animate-pulse'
      />
    );
  }

  return (
    <div ref={ref} className='bg-white rounded'>
      {isVideo(item.url) ? (
        <VideoPlayer
          src={item.url}
          poster={item.name}
          thumbnail={item.name}
          className='w-full h-[260px] md:h-[270px] object-cover transition-transform overflow-hidden'
          showControls={false}
          showPlayButton={true}
          showVolumeControl={false}
          preload='none'
          isActive={isVisible}
          autoplay={isVisible}
        />
      ) : (
        <CustomImage
          src={item.url}
          alt={item.name}
          priority={priority && isFirstImage}
          className={cn(
            'object-cover transition-transform duration-300 h-[260px] md:h-[270px]'
          )}
          width={720}
          height={600}
          quality={20}
          objectFit='cover'
        />
      )}
    </div>
  );
};

export default LazyCarouselImage;
