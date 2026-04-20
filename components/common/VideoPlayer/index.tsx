import {
  Loader2,
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import CustomImage from '@/components/common/CustomImage';
import useIsMobile from '@/hooks/useIsMobile';
import { getFilenameFromUrl } from '@/lib/utils';
interface VideoPlayerProps {
  src: string;
  srcMobile?: string;
  poster?: string;
  posterMobile?: string;
  thumbnail?: string;
  thumbnailMobile?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
  priority?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  showControls?: boolean;
  showPlayButton?: boolean;
  showVolumeControl?: boolean;
  showLoadingSpinner?: boolean;
  isActive?: boolean;
  fallbackSrc?: string;
  width?: number | 'auto';
  height?: number | 'auto';
  format?: string;
  bg_color?: string;
  func?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  srcMobile,
  poster,
  posterMobile,
  thumbnail,
  thumbnailMobile,
  autoplay = false,
  loop = true,
  muted = true,
  preload = 'none',
  className = '',
  priority = false,
  onPlay,
  onPause,
  onEnded,
  onError,
  showControls = true,
  showPlayButton = true,
  showVolumeControl = true,
  showLoadingSpinner = true,
  isActive = false,
  fallbackSrc = `${process.env.IMAGE_DOMAIN}/no_Image_b5126bc85f.svg`,
  width = 'auto',
  height = 'auto',
  format = 'auto',
  bg_color = 'transparent',
  func,
}) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = srcMobile && isMobile ? srcMobile : src;
  const videoPoster = posterMobile && isMobile ? posterMobile : poster;
  const videoThumbnail =
    thumbnailMobile && isMobile ? thumbnailMobile : thumbnail;

  const filename = getFilenameFromUrl(videoSrc);

  const cloudimgUrl =
    videoSrc && filename
      ? `https://cpjlcwamma.cloudimg.io/${filename}?w=${width}&h=${height}`
      : videoSrc || fallbackSrc;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(false);
    setIsLoaded(false);
    setShowVideo(false);
    setIsLoading(false);
  }, [cloudimgUrl]);

  // Handle autoplay when active
  useEffect(() => {
    if (autoplay && isActive && videoRef.current) {
      // Set video to show immediately for autoplay
      setShowVideo(true);

      if (isLoaded) {
        videoRef.current.play().catch((error) => {
          console.error('Autoplay failed:', error);
        });
        setIsPlaying(true);
        onPlay?.();
      } else {
        // Load video first, then autoplay
        videoRef.current.load();
        videoRef.current.onloadeddata = () => {
          setIsLoaded(true);
          setIsLoading(false);
          videoRef.current?.play().catch((error) => {
            console.error('Autoplay failed:', error);
          });
          setIsPlaying(true);
          onPlay?.();
        };
      }
    }
  }, [autoplay, isActive, isLoaded, onPlay]);

  // Pause video when not active
  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  }, [isActive, isPlaying, onPause]);

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      // Pause video
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      // Show video and play
      setShowVideo(true);
      setIsLoading(true);

      if (!isLoaded) {
        // Load video first
        videoRef.current.load();
        videoRef.current.onloadeddata = () => {
          setIsLoaded(true);
          setIsLoading(false);
          videoRef.current?.play().catch((error) => {
            console.error('Error playing video:', error);
            onError?.(error);
          });
          setIsPlaying(true);
          onPlay?.();
        };
      } else {
        // Video already loaded, just play
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
          onError?.(error);
        });
        setIsPlaying(true);
        onPlay?.();
      }
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    if (showPlayButton) {
      handlePlayClick();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Thumbnail/Poster Image */}
      {(videoThumbnail || videoPoster) && (
        <CustomImage
          src={videoThumbnail || videoPoster || ''}
          srcMobile={thumbnailMobile || posterMobile}
          alt='Video thumbnail'
          title='Video thumbnail'
          width={700}
          height={1000}
          quality={60}
          priority={priority}
          className='object-cover h-full w-full cursor-pointer'
        />
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        poster={videoPoster}
        className={`object-cover h-full w-full cursor-pointer absolute inset-0 ${
          showVideo && isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadedData={handleVideoLoad}
        onEnded={handleVideoEnd}
        onError={(e) => {
          console.error('Video error:', e);
          // Fallback to original video source if cloudimg fails
          if (cloudimgUrl !== videoSrc && videoRef.current) {
            videoRef.current.src = videoSrc;
            videoRef.current.load();
          }
          onError?.(e);
        }}
        muted={isMuted}
        loop={loop}
        preload={preload}
        playsInline
        autoPlay={autoplay}
        onClick={handleVideoClick}
        src={cloudimgUrl}
      />

      {/* Play Button */}
      {showPlayButton && !isPlaying && (
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 cursor-pointer hover:bg-white/90 transition-colors z-10'
          onClick={handlePlayClick}
        >
          {isLoading && showLoadingSpinner ? (
            <Loader2 className='text-black animate-spin' size={30} />
          ) : (
            <PlayIcon className='text-black' size={30} />
          )}
        </div>
      )}

      {/* Controls */}
      {showControls && isPlaying && (
        <div className='absolute top-3 right-3 p-1 flex items-center gap-2 z-10'>
          {/* Pause Button */}
          <div
            className='bg-white/80 p-1 rounded-full cursor-pointer'
            onClick={handlePlayClick}
          >
            <PauseIcon className='text-black' size={14} />
          </div>

          {/* Volume Control */}
          {showVolumeControl && (
            <div
              className='bg-white/80 p-1 rounded-full cursor-pointer'
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <VolumeXIcon size={14} className='text-black' />
              ) : (
                <Volume2Icon size={14} className='text-black' />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
