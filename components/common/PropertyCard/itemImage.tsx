import EmblaCarousel from '@/components/common/ImageSlider';
import useIsMobile from '@/hooks/useIsMobile';
import LazyCarouselImage from './LazyCarouselImage';

type SlideData = {
  name: string;
  url: string;
};

export default function Example({
  slides,
  shouldLoadFirstImage = false,
  priority = false,
}: {
  slides: SlideData[];
  autoPlay?: boolean;
  shouldLoadFirstImage?: boolean;
  priority?: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <div className='relative'>
      <EmblaCarousel
        slides={slides}
        arrow={isMobile ? false : true}
        wrapperClassName='arrow-on-card-hover'
        autoPlay={false}
        renderSlide={(item, index) => (
          <LazyCarouselImage
            item={item}
            index={index}
            key={index}
            shouldLoad={shouldLoadFirstImage}
            isFirstImage={index === 0}
            priority={priority}
          />
        )}
      />
    </div>
  );
}
