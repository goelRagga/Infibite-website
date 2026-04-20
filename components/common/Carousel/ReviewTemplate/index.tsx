import EmblaCarousel from './reviewTemplate';
import './embla.css';
export const CarouselTemplate2 = ({
  data,
  topArrow,
  heading,
  description,
  isStar,
  height,
  mobHeight,
  isDots,
  prive,
}: {
  data: any;
  topArrow?: boolean;
  heading?: string;
  description?: string;
  isStar?: boolean;
  height?: string;
  mobHeight?: string;
  isDots?: boolean;
  prive?: boolean;
}) => {
  return (
    <EmblaCarousel
      height={height}
      mobHeight={mobHeight}
      heading={heading}
      description={description}
      topArrow={topArrow}
      slides={data}
      isStar={isStar}
      isDots={isDots}
      prive={prive}
    />
  );
};
