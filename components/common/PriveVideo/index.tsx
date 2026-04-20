'use client';
import { useEffect, useRef, useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';

export interface BannerProps {
  poster: string;
  mobileSrc: string;
  webSrc: string;
}

const PriveVideo: React.FC<BannerProps> = ({ poster, mobileSrc, webSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    // Promise to load the video
    const loadVideo = async () => {
      try {
        await video?.play();
        setIsVideoLoaded(true);
      } catch (error) {
        // Retry playback on user interaction
        const playOnInteraction = () => {
          video.play().catch(console.log);
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
      }
    };

    // Configure video properties
    video.muted = true; // Important for autoplay
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;

    // Load and play video when component mounts
    const handleCanPlay = () => {
      loadVideo();
      video.removeEventListener('canplay', handleCanPlay);
    };

    video.addEventListener('canplay', handleCanPlay);

    // Reset video when it ends
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(console.log);
    };

    video.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        poster={poster}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        preload='auto'
        muted
        playsInline
        autoPlay
        loop
        webkit-playsinline='true'
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={(e) => {
          setIsVideoLoaded(true); // Show poster on error
        }}
      >
        <source src={isMobile ? mobileSrc : webSrc} type='video/mp4' />
      </video>
    </>
  );
};

export default PriveVideo;
