'use client';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui';
import { X } from 'lucide-react';
import VideoPlayer from '../VideoPlayer';
import { Suspense } from 'react';

interface VideoTourModalProps {
  open: boolean;
  onClose: () => void;
  src: any;
  title?: string;
  useBackIcon?: boolean; // If true, use ArrowLeft instead of X
}

const VideoTourModal: React.FC<VideoTourModalProps> = ({
  open,
  onClose,
  src,
  useBackIcon = true,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className={'backdrop-blur-[2px]!'} />
      <DialogContent className='h-[96dvh] w-full overflow-hidden flex flex-col rounded-2xl bg-[var(--white3)] p-0! [&>button]:hidden'>
        <span
          onClick={onClose}
          aria-label='Close'
          className='absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white hover:bg-white rounded-full p-2 shadow-md cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95'
        >
          {useBackIcon ? (
            <X size={24} className='text-black' />
          ) : (
            <X size={28} className='text-black' />
          )}
        </span>
        {/* Floating Back Button */}
        <div className='flex-1 overflow-hidden'>
          <Suspense fallback={''}>
            <VideoPlayer
              src={src.videoMobile}
              poster={src.thumbnailMobile}
              thumbnail={src.thumbnailMobile}
              className='w-full h-full object-cover'
              showControls={true}
              showPlayButton={true}
              showVolumeControl={true}
              preload='metadata'
              isActive={true}
              autoplay={true}
              format='mp4'
              loop={true}
              muted={true}
              width={620}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoTourModal;
