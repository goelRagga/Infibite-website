import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
  currentPlayingVideo: string | null;
  setCurrentPlayingVideo: (videoId: string | null) => void;
  pauseAllVideos: () => void;
  isAnyVideoPlaying: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(
    null
  );

  const pauseAllVideos = () => {
    setCurrentPlayingVideo(null);
  };

  const isAnyVideoPlaying = currentPlayingVideo !== null;

  return (
    <VideoContext.Provider
      value={{
        currentPlayingVideo,
        setCurrentPlayingVideo,
        pauseAllVideos,
        isAnyVideoPlaying,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
