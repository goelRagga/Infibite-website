'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Images, ArrowLeft, Share, Upload, X } from 'lucide-react';
import PlayIcon from '@/assets/playIcon.svg';
import PropertyDetailsTypes from '../PropertyDetail.types';
import CustomImage from '@/components/common/CustomImage';
import ElivaasLight from '@/assets/elivaasLight.svg';
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'framer-motion';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui';
import ImageViewerDialog from './ImageViewerDialog';
import { ShareButton, ShareModal } from '@/components/common/ShareModal';
import VideoTourModal from '@/components/common/VideoTourModal';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/mixpanel';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PriveLogo from '@/assets/elivaasPriveLogo.svg';

const VideoPlayer = dynamic(() => import('@/components/common/VideoPlayer'), {
  ssr: false,
});
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

const StylishImageGallery = dynamic(() => import('./ImageDialog'), {
  ssr: false,
});
interface OverlayButtonProps {
  icon: React.ReactNode;
  label: string | number;
  ariaLabel: string;
  onClick?: () => void;
}

const isVideo = (url: string) => {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
};

const OverlayButton = ({
  icon,
  label,
  ariaLabel,
  onClick,
}: OverlayButtonProps) => (
  <button
    aria-label={ariaLabel}
    className='flex items-center border border-white px-2.5  text-white text-sm h-8.5 sm:h-10 rounded-[8px] overflow-hidden relative cursor-pointer'
    onClick={onClick}
  >
    <span className='absolute bg-[#4d393e] opacity-90 hover:opacity-100 dark:bg-black/30 backdrop-blur-md h-full w-full rounded-[8px] left-0 top-0' />
    <div className='relative flex items-center gap-1.5 sm:px-2 py-1 sm:py-2 sm:text-xs sm:font-semibold'>
      {icon}
      {label}
    </div>
  </button>
);

const ImageSectionInner: React.FC<PropertyDetailsTypes.ImageSectionProps> = ({
  data,
  brand,
  propertyName,
  city,
  location,
  state,
  pageName = 'property_details',
  propertyId,
  is_checkin_out_entered,
  guidedVideoTour,
  nonBrandedGuidedVideoTour,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imagesParamOpen = searchParams.get('images') === 'true';
  const [optimisticGalleryOpen, setOptimisticGalleryOpen] = useState(false);
  const imageModalOpen = imagesParamOpen || optimisticGalleryOpen;
  const [galleryShareModalOpen, setGalleryShareModalOpen] = useState(false);
  const [openImageSlider, setOpenImageSlider] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-40%' });
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<number | null>(
    null
  );
  const firstTwoItems = data?.slice(1, 3);

  // Function to pause all videos except the current one
  const pauseOtherVideos = (currentVideoIndex: number) => {
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video && parseInt(index) !== currentVideoIndex) {
        video.pause();
      }
    });
    setCurrentPlayingVideo(currentVideoIndex);
  };

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const openImagesModal = useCallback(() => {
    trackEvent('image_folder_clicked', {
      page_name: 'property_details',
      property_id: propertyId,
      property_name: propertyName,
      is_checkin_out_entered: is_checkin_out_entered ? true : false,
    });
    setOptimisticGalleryOpen(true);
    queueMicrotask(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('images', 'true');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [
    pathname,
    router,
    searchParams,
    propertyId,
    propertyName,
    is_checkin_out_entered,
  ]);

  useEffect(() => {
    if (imagesParamOpen) setOptimisticGalleryOpen(false);
  }, [imagesParamOpen]);

  const closeImagesModal = useCallback(() => {
    setOpenImageSlider(false);
    setOptimisticGalleryOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('images');
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handelImageModalOpen = openImagesModal;

  const galleryDisplayName =
    propertyName?.split('|')[0]?.trim() ?? propertyName ?? '';
  const gallerySharePreviewUrl = useMemo(() => {
    const list = data ?? [];
    const isVideoUrl = (u: string) =>
      /\.(mp4|webm|mov|avi|mkv|wmv|flv|m4v|3gp|ogv)$/i.test(u);
    const firstPhoto = list.find((img) => img?.url && !isVideoUrl(img.url));
    return firstPhoto?.url ?? list[0]?.url;
  }, [data]);
  const galleryShareText =
    galleryDisplayName && city && state
      ? `Check out this amazing ${galleryDisplayName} in ${city}, ${state}!`
      : galleryDisplayName
        ? `Check out photos of ${galleryDisplayName}!`
        : 'Check out this property photo gallery!';

  const handleGalleryMobileShare = useCallback(async () => {
    const title = galleryDisplayName || 'Property Details';
    const text =
      city != null && city !== '' && location != null && location !== ''
        ? `Check out this amazing property in ${city}, ${location}`
        : galleryShareText;
    const shareData = {
      title,
      text,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  }, [galleryDisplayName, galleryShareText, city, location]);

  const handleGalleryDesktopShare = useCallback(() => {
    trackEvent('share_property_clicked', {
      page_name: pageName,
      property_id: propertyId,
      property_name: propertyName,
      is_checkin_out_entered: is_checkin_out_entered ? true : false,
    });
    setGalleryShareModalOpen(true);
  }, [pageName, propertyId, propertyName, is_checkin_out_entered]);

  /** Align with Tailwind `lg:` — ShareModal only on web; mobile keeps native share. */
  const [isLgViewport, setIsLgViewport] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsLgViewport(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isLgViewport && galleryShareModalOpen) {
      setGalleryShareModalOpen(false);
    }
  }, [isLgViewport, galleryShareModalOpen]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const newActiveIndex = api.selectedScrollSnap();

      // Pause all videos when slide changes
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });

      setActiveIndex(newActiveIndex);
      setCurrentPlayingVideo(null);
      setIsVideoPlaying(false);
    };

    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  // Control autoplay based on video state
  useEffect(() => {
    if (!api) return;

    if (isVideoPlaying) {
      // Pause carousel autoplay when video is playing
      api.plugins().autoplay?.stop();
    } else {
      // Resume carousel autoplay when video is not playing
      api.plugins().autoplay?.play();
    }
  }, [isVideoPlaying, api]);

  // Pause videos that are not active or not in view
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video) {
        const isActiveVideo = parseInt(index) === activeIndex;
        const shouldPlay = isActiveVideo && isInView;

        if (!shouldPlay && !video.paused) {
          video.pause();
        }
      }
    });
  }, [activeIndex, isInView]);

  // Auto-play video when it becomes active and in view
  useEffect(() => {
    if (activeIndex !== null && isInView && videoRefs.current[activeIndex]) {
      const activeVideo = videoRefs.current[activeIndex];
      if (activeVideo && isVideo(data[activeIndex]?.url)) {
        // Pause other videos before playing this one
        pauseOtherVideos(activeIndex);

        // Small delay to ensure video is ready
        setTimeout(() => {
          activeVideo.play().catch((error) => {
            console.error('Autoplay failed:', error);
          });
        }, 100);
      }
    }
  }, [activeIndex, isInView, data]);

  return (
    <div
      ref={containerRef}
      className='w-full h-[350px] lg:h-auto xl:h-[550px] lg:px-10 xl:px-0'
    >
      <div className='block lg:hidden relative'>
        {brand === 'ALAYASTAYS' && (
          <div className='absolute left-1/2 -translate-x-1/2 z-1 top-0 rounded-b-sm overflow-hidden'>
            <CustomImage
              src={`${process.env.IMAGE_DOMAIN}/Alays_Stays_Black_Bg_f95556e5da_1_990e2acf81.svg`}
              alt='alaya stays'
              width={100}
              height={100}
              format='svg'
              priority
            />
          </div>
        )}
        {brand === 'ELIVAAS' && (
          <div className='absolute left-1/2 -translate-x-1/2 z-1 top-[-13px] rounded-b-sm overflow-hidden bg-black/80 px-4 py-4 scale-[.7]'>
            <ElivaasLight />
          </div>
        )}
        {brand === 'PRIVE' && (
          <div className='absolute left-1/2 -translate-x-1/2 z-1 top-[-62px] rounded-b-sm overflow-hidden scale-[.9]'>
            <PriveLogo />
          </div>
        )}

        <Carousel setApi={setApi}>
          <CarouselContent>
            {data.map((item, index) => (
              <CarouselItem className='p-0' key={index}>
                <div className='relative w-full h-[350px] sm:h-[500px] overflow-hidden'>
                  {isVideo(item?.url) ? (
                    <Suspense fallback={''}>
                      <VideoPlayer
                        src={item?.url}
                        poster={item?.name}
                        thumbnail={item?.name}
                        className='w-full h-full object-cover overflow-hidden'
                        showControls={true}
                        showPlayButton={true}
                        showVolumeControl={false}
                        preload='none'
                        onEnded={() => {
                          if (index === activeIndex) {
                            setIsVideoPlaying(false);
                            // Auto scroll to next slide after video completes
                            setTimeout(() => {
                              api?.scrollNext();
                            }, 1000); // 1 second delay before moving to next slide
                          }
                        }}
                        isActive={isInView}
                        autoplay={isInView && index === 0}
                      />
                    </Suspense>
                  ) : (
                    <CustomImage
                      onClick={handelImageModalOpen}
                      src={item?.url}
                      alt={item?.name || 'villa Image'}
                      title={item?.name}
                      width={720}
                      height={480}
                      quality={80}
                      priority={index === 0 ? true : false}
                      className='object-cover cursor-pointer h-full w-full'
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {(guidedVideoTour?.videoMobile ||
            nonBrandedGuidedVideoTour?.videoMobile) &&
            showVirtualTour && (
              <VideoTourModal
                open={showVirtualTour}
                onClose={() => setShowVirtualTour(false)}
                src={guidedVideoTour || nonBrandedGuidedVideoTour}
                title='Video Tour'
              />
            )}
          <div className='absolute bottom-10 sm:bottom-40 left-4 right-4 flex justify-between z-10 animate-fade-up'>
            {guidedVideoTour?.videoMobile ? (
              <>
                <OverlayButton
                  icon={<PlayIcon />}
                  label='View'
                  ariaLabel='Video Tour'
                  onClick={() => setShowVirtualTour(true)}
                />
              </>
            ) : (
              <span />
            )}
            <OverlayButton
              icon={<Images size={16} />}
              onClick={handelImageModalOpen}
              label={
                current == 1 ? data?.length : `${current} / ${data?.length}`
              }
              ariaLabel={`${data?.length} images`}
            />
          </div>
        </Carousel>
      </div>

      <div className='hidden lg:grid grid-cols-12 gap-5 h-[550px] overflow-hidden'>
        {/* Left - 8 columns: Full height */}
        <div className='relative col-span-8 h-full rounded-xl overflow-hidden bg-black'>
          {brand === 'ALAYASTAYS' && (
            <div className='absolute top-3 left-3 z-15 rounded-sm overflow-hidden'>
              <CustomImage
                src={`${process.env.IMAGE_DOMAIN}/Alays_Stays_Black_Bg_f95556e5da_1_990e2acf81.svg`}
                alt='alaya stays'
                width={120}
                height={120}
                priority
                format='svg'
              />
            </div>
          )}
          {brand === 'ELIVAAS' && (
            <div className='absolute top-2 left-0 z-15'>
              <div className='bg-black/80 px-4 py-4 rounded-sm scale-[.8]'>
                <ElivaasLight />
              </div>
            </div>
          )}
          {brand === 'PRIVE' && (
            <div className='absolute top-3 left-3 z-15 '>
              <div className='bg-black/80 px-4 py-2 rounded-sm'>
                <CustomImage
                  src={`${process.env.IMAGE_DOMAIN}/Prive_Logo_f7202f7b17.svg`}
                  alt='prive logo'
                  width={92}
                  height={48}
                  format='svg'
                  className='w-[80px] md:w-[92px] scale-[.8]'
                />
              </div>
            </div>
          )}
          {isVideo(data[0]?.url) ? (
            <VideoPlayer
              src={data[0]?.url}
              poster={data[0]?.name}
              thumbnail={data[0]?.name}
              className='w-full h-full object-cover overflow-hidden'
              showControls={true}
              showPlayButton={true}
              showVolumeControl={false}
              preload='none'
              isActive={isInView}
              autoplay={isInView}
            />
          ) : (
            <CustomImage
              onClick={handelImageModalOpen}
              src={data[0]?.url}
              alt={data[0]?.name || 'villa Image'}
              title={data[0]?.name}
              width={1200}
              height={800}
              quality={80}
              priority={false}
              className='object-cover cursor-pointer rounded-md h-full transition-opacity duration-300 hover:opacity-90'
            />
          )}
          <div className='absolute sm:bottom-4 left-4 right-4 flex justify-between z-10 animate-fade-up'>
            {guidedVideoTour || nonBrandedGuidedVideoTour ? (
              <>
                <OverlayButton
                  icon={<PlayIcon />}
                  label='View Video'
                  ariaLabel='View Video'
                  onClick={() => setShowVirtualTour(true)}
                />
              </>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* Right - 4 columns: stacked 2 equal halves */}
        <div className='col-span-4 h-full flex flex-col gap-5'>
          {firstTwoItems.map((item, index) => (
            <div
              key={index}
              className='relative flex-1 rounded-xl overflow-hidden bg-black'
              onClick={handelImageModalOpen}
            >
              {isVideo(item?.url) ? (
                <VideoPlayer
                  src={item?.url}
                  poster={item?.name}
                  thumbnail={item?.name}
                  className='w-full h-full object-cover overflow-hidden'
                  showControls={false}
                  showPlayButton={false}
                  showVolumeControl={false}
                  preload='none'
                  isActive={isInView}
                  autoplay={isInView}
                />
              ) : (
                <CustomImage
                  onClick={handelImageModalOpen}
                  src={item.url}
                  alt={item.name || 'villa Image'}
                  title={item.name}
                  width={720}
                  height={600}
                  quality={80}
                  priority={false}
                  className='absolute object-cover w-full h-full cursor-pointer rounded-md transition-opacity duration-300 hover:opacity-90'
                />
              )}
              {index === 1 && (
                <div className='absolute bottom-4 right-4 cursor-pointer'>
                  <OverlayButton
                    onClick={handelImageModalOpen}
                    icon={<Images size={18} />}
                    label={data?.length}
                    ariaLabel={`${data?.length} images`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Sheet
        open={imageModalOpen}
        // onOpenChange={(open) => {
        //   if (!open) closeImagesModal();
        // }}
      >
        <SheetTitle />
        <SheetContent
          className='h-[100dvh] w-[100vw] overflow-y-auto gap-0  z-99'
          side='bottom'
        >
          <SheetHeader className='px-4 gap-4 sm:gap-0 pb-0 border-b-1 max-w-full pt-0 sticky top-0 z-99 bg-white dark:bg-background dark:border-secondary-950'>
            <div className='mx-auto flex w-full max-w-[1100px] items-center gap-3 px-0 py-2 sm:px-4 sm:px-10'>
              <button
                type='button'
                onClick={closeImagesModal}
                className='shrink-0 rounded-full p-1 text-[#3b3b3b] hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10 cursor-pointer'
                aria-label='Close gallery'
              >
                <ArrowLeft className='h-6 w-6' />
              </button>
              {propertyName ? (
                <h2 className='min-w-0 flex-1 truncate text-left text-base font-semibold font-serif text-primary-950 dark:text-white'>
                  {propertyName.split('|')[0]?.trim() ?? propertyName}
                </h2>
              ) : (
                <span className='flex-1' />
              )}
              <button
                type='button'
                className='bg-card border-1 border-[var(--color-primary-200)] flex shrink-0 items-center justify-center rounded-full p-2 backdrop-blur-md lg:hidden dark:border-[var(--color-primary-400)] dark:bg-white/80'
                onClick={handleGalleryMobileShare}
                aria-label='Share this property'
                title='Share this property'
              >
                <Upload className='h-5 w-5 text-[var(--color-primary-800)]' />
              </button>
              <div className='hidden shrink-0 lg:block'>
                <ShareButton
                  onClick={handleGalleryDesktopShare}
                  icon={<Share size={16} />}
                >
                  Share
                </ShareButton>
              </div>
            </div>
          </SheetHeader>

          <div className='mx-auto w-full max-w-[1100px] px-4 sm:px-4 py-2 sm:px-10 sm:py-4'>
            <Suspense fallback={''}>
              <StylishImageGallery
                images={data}
                setOpenImageSlider={setOpenImageSlider}
                setActiveIndex={setActiveIndex}
              />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
      {isLgViewport ? (
        <ShareModal
          open={galleryShareModalOpen}
          onOpenChange={setGalleryShareModalOpen}
          modalTitle='Share'
          title={galleryDisplayName || propertyName}
          previewImageSrc={gallerySharePreviewUrl}
          text={galleryShareText}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
        />
      ) : null}
      {openImageSlider && (
        <Sheet open={openImageSlider}>
          <SheetContent
            className='h-full w-full z-99 overflow-hidden p-0 top-0 m-0 border-0'
            side='bottom'
          >
            <div className='absolute top-0 left-0 w-full h-full bg-black z-99'></div>
            <ImageViewerDialog
              images={data}
              open={openImageSlider}
              onOpenChange={setOpenImageSlider}
              initialIndex={activeIndex ?? 0}
            />

            <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[100] flex justify-center pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8 sm:hidden'>
              <button
                type='button'
                onClick={() => setOpenImageSlider(false)}
                className='pointer-events-auto flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/70 active:scale-95'
                aria-label='Close image viewer'
              >
                <X className='size-6' strokeWidth={2.25} />
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

ImageSectionInner.displayName = 'ImageSection';

export default function ImageSection(
  props: PropertyDetailsTypes.ImageSectionProps
) {
  return (
    <Suspense fallback={null}>
      <ImageSectionInner {...props} />
    </Suspense>
  );
}
