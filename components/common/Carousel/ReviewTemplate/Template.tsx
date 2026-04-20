import CustomImage from '@/components/common/CustomImage';
import { useVideoContext } from '@/contexts/video-context';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { trackEvent } from '@/lib/mixpanel';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Loader2,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Template = ({
  data,
  isCenterSlide = false,
  className,
  pageName,
  onClick,
  widgetName,
  verticalPosition,
}: {
  data: any;
  isCenterSlide?: boolean;
  className?: string;
  pageName?: string;
  onClick?: (ctaType: 'played' | 'paused' | 'scrolled') => void;
  widgetName?: string;
  verticalPosition?: number;
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { currentPlayingVideo, setCurrentPlayingVideo, isAnyVideoPlaying } =
    useVideoContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  // Support both old and new data structures
  const title = data.title || data.celebrity;

  const isNewVideoStructure = data.video && typeof data.video === 'object';
  const videoUrl = isNewVideoStructure
    ? isMobile
      ? data.video.videoMobile
      : data.video.videoWeb
    : data.video || data.videoUrl;

  const imageUrl = isNewVideoStructure
    ? data.video.thumbnailWeb
    : data.image || data.video || data.videoUrl;
  const imageUrlMobile = isNewVideoStructure
    ? data.video.thumbnailMobile
    : undefined;
  const hasVideo = data.hasVideo !== undefined ? data.hasVideo : !!videoUrl;
  const tag = data.tag;

  // Generate unique video ID
  const videoId = `${title}-${videoUrl}`;

  // Reset video state when data changes
  useEffect(() => {
    setIsVideoPlaying(false);
    setIsVideoLoaded(false);
    setShowVideo(false);
  }, [videoUrl]);

  // Auto-play when becoming center slide if any video was playing
  useEffect(() => {
    if (isCenterSlide && isAnyVideoPlaying && hasVideo && !isVideoPlaying) {
      handlePlayClick();
    }
  }, [isCenterSlide, isAnyVideoPlaying]);

  // Stop video when not center slide
  useEffect(() => {
    if (!isCenterSlide && isVideoPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsVideoPlaying(false);
      setCurrentPlayingVideo(null);
    }
  }, [isCenterSlide, isVideoPlaying]);

  // Pause this video if another video starts playing
  useEffect(() => {
    if (
      currentPlayingVideo &&
      currentPlayingVideo !== videoId &&
      isVideoPlaying
    ) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsVideoPlaying(false);
    }
  }, [currentPlayingVideo, videoId, isVideoPlaying]);

  // Pause video when component goes out of view (scrolled)
  useEffect(() => {
    if (!isIntersecting && isVideoPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsVideoPlaying(false);
      setCurrentPlayingVideo(null);
      // Track scroll event
      if (onClick) {
        onClick('scrolled');
      } else if (widgetName && pageName && verticalPosition !== undefined) {
        trackEvent('widget_clicked', {
          page_name: pageName,
          widget_name: widgetName,
          widget_type: 'video_cards',
          cta_type: 'scrolled',
          vertical_position: verticalPosition,
          horizontal_position: verticalPosition,
        });
      }
    }
  }, [
    isIntersecting,
    isVideoPlaying,
    setCurrentPlayingVideo,
    onClick,
    widgetName,
    pageName,
    verticalPosition,
  ]);

  const handlePlayClick = () => {
    if (!videoRef.current) {
      return;
    }

    if (isVideoPlaying) {
      // Pause video
      videoRef.current.pause();
      setIsVideoPlaying(false);
      setCurrentPlayingVideo(null);
      // Track pause event
      if (onClick) {
        onClick('paused');
      } else if (widgetName && pageName && verticalPosition !== undefined) {
        trackEvent('widget_clicked', {
          page_name: pageName,
          widget_name: widgetName,
          widget_type: 'video_cards',
          cta_type: 'paused',
          vertical_position: verticalPosition,
          horizontal_position: verticalPosition,
        });
      }
    } else {
      // Call the onClick prop if provided (it handles its own tracking) - call when starting to play
      if (onClick) {
        onClick('played');
      } else if (widgetName && pageName && verticalPosition !== undefined) {
        // Fallback to internal tracking if onClick not provided
        trackEvent('widget_clicked', {
          page_name: pageName,
          widget_name: widgetName,
          widget_type: 'video_cards',
          cta_type: 'played',
          vertical_position: verticalPosition,
          horizontal_position: verticalPosition,
        });
      }

      // Set this as the current playing video
      setCurrentPlayingVideo(videoId);

      // Show video and play
      setShowVideo(true);

      // Play video - load if not loaded
      if (!isVideoLoaded) {
        // Load video first
        videoRef.current.load();
        videoRef.current.onloadeddata = () => {
          setIsVideoLoaded(true);
          videoRef.current?.play().catch((error) => {
            console.error('Error playing video:', error);
          });
          setIsVideoPlaying(true);
        };
      } else {
        // Video already loaded, just play
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-3xl overflow-hidden TODO:shadow-lg b-2 xl:h-[450px] h-[400px]',
        className
      )}
    >
      {/* Lazy load image when in viewport */}
      {isIntersecting ? (
        <CustomImage
          src={imageUrl}
          srcMobile={imageUrlMobile}
          alt={title || 'Star Stay'}
          title={title}
          width={isMobile ? 400 : isTablet ? 700 : 1000}
          height={isMobile ? 700 : isTablet ? 1000 : 1000}
          quality={60}
          priority={false}
          className='object-cover h-full w-[100%] cursor-pointer starCarouselBg rounded-3xl'
        />
      ) : (
        <div className='w-full h-full bg-gray-200 animate-pulse rounded-3xl' />
      )}

      {/* Video overlay - only show when playing */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`object-cover h-full w-full rounded-3xl cursor-pointer absolute inset-0 ${showVideo && isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={handleVideoLoad}
          onEnded={() => setIsVideoPlaying(false)}
          onError={(e) => console.error('Video error:', e)}
          muted={isVideoMuted}
          loop
          preload='none'
          playsInline
          webkit-playsinline='true'
          x5-playsinline='true'
          x5-video-player-type='h5'
          x5-video-player-fullscreen='false'
          x5-video-orientation='portraint'
          onClick={handlePlayClick}
        />
      )}
      <AnimatePresence>
        {!isVideoPlaying && (tag || title) && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='absolute top-3 left-3 bg-accent-green-700 px-3 py-1 rounded-full text-xs font-semibold text-white inline-flex items-center gap-1 [&_img]:w-4 [&_img]:h-4 [&_img]:object-contain [&_img]:inline-block [&_img]:align-middle'
          >
            {tag ? <span dangerouslySetInnerHTML={{ __html: tag }} /> : title}
          </motion.div>
        )}
      </AnimatePresence>

      {hasVideo && isVideoPlaying && (
        <div className='absolute top-3 right-3 p-1 flex items-center gap-2'>
          {' '}
          <div
            className='left-none right-7 bg-white/80 p-1 rounded-full'
            onClick={() => setIsVideoMuted(!isVideoMuted)}
          >
            <PauseIcon
              onClick={handlePlayClick}
              className='text-black cursor-pointer'
              size={14}
            />
          </div>
          <div
            className='bg-white/80 p-1 rounded-full'
            onClick={() => setIsVideoMuted(!isVideoMuted)}
          >
            {isVideoMuted ? (
              <VolumeXIcon size={14} className='text-black cursor-pointer' />
            ) : (
              <Volume2Icon size={14} className='text-black cursor-pointer' />
            )}
          </div>
        </div>
      )}

      {hasVideo && !isVideoPlaying && (
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 cursor-pointer hover:bg-white/90 transition-colors'
          onClick={handlePlayClick}
        >
          {showVideo && !isVideoLoaded ? (
            <Loader2 className='text-black animate-spin' size={30} />
          ) : (
            <PlayIcon className='text-black' size={30} />
          )}
        </div>
      )}
      <AnimatePresence>
        {!isVideoPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='absolute bottom-0 w-full p-4 px-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white'
          >
            <h3 className='text-xl font-serif scale-90'>{title}</h3>
            <p className='text-xs scale-90'>{data.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
