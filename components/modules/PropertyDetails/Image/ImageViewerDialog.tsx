'use client';

import { useEffect, useState } from 'react';
// Removed unused imports since we're using a custom div instead of Dialog
import CustomImage from '@/components/common/CustomImage';
import { ArrowLeft, X } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface ImageViewerDialogProps {
  images: { url: string; name?: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex: number;
}

export default function ImageViewerDialog({
  images,
  open,
  onOpenChange,
  initialIndex,
}: ImageViewerDialogProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Set the carousel to the initial image when modal opens
  useEffect(() => {
    if (open && api && initialIndex !== null) {
      api.scrollTo(initialIndex);
    }
  }, [open, api, initialIndex]);

  if (!open) return null;

  return (
    <div className='max-w-none w-full h-full overflow-hidden p-0 border-0 fixed top-0 bottom-0 left-0 z-99'>
      <div className='relative w-full h-full flex items-center justify-center'>
        {/* Mobile top bar (no share button) */}
        <div className='absolute top-0 left-0 z-50 w-full px-4 py-4 flex items-center justify-center sm:hidden'>
          <div className='text-white text-sm font-medium'>
            {current} / {count}
          </div>
          <span className='w-6 h-6' />
        </div>

        {/* Close Button (desktop) */}
        <button
          onClick={() => onOpenChange(false)}
          className='hidden sm:flex absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/20 transition-colors cursor-pointer'
        >
          <X className='w-6 h-6' />
        </button>

        {/* Image Counter (desktop) */}
        <div className='hidden sm:block absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-black/50 text-white text-sm'>
          {current} / {count}
        </div>

        {/* Carousel */}
        <div className='w-full h-[100vh] overflow-hidden flex items-center justify-center'>
          <Carousel setApi={setApi} className='w-full max-w-5xl h-full'>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className='flex items-center justify-center'
                >
                  <div className='w-full h-full flex items-center justify-center min-h-screen'>
                    <CustomImage
                      src={image.url}
                      alt={image.name || 'villa image'}
                      width={1900}
                      height={1200}
                      quality={60}
                      className='max-w-full max-h-full object-contain '
                      priority={index === 0 ? true : false}
                      outFixClass='w-full h-full flex items-center justify-center'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='fixed left-6 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-12 rounded-full border border-white bg-transparent text-white hover:bg-black/10 hidden sm:flex' />
            <CarouselNext className='fixed right-6 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-12 rounded-full border border-white bg-transparent text-white hover:bg-black/10 hidden sm:flex' />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
