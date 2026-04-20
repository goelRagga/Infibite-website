import CustomImage from '@/components/common/CustomImage';
import PropertyCard from '@/components/common/PropertyCard';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/hooks/useIsMobile';
import Link from 'next/link';
import { PriveCardItem } from 'api-types';
import { ReusableCarousel } from '@/components/common/ReusableCarousel';
import useIsTablet from '@/hooks/useIsTablet';
import { trackEvent } from '@/lib/mixpanel';

interface PriveCardSectionProps {
  priveCardData: PriveCardItem[];
  heading?: string;
  verticalPosition?: number;
  horizontalPosition?: number;
  onClick?: (index: number) => void;
}

const PriveCardSection: React.FC<PriveCardSectionProps> = ({
  priveCardData,
  heading,
  verticalPosition,
  horizontalPosition,
  onClick,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const radialBackground = {
    background: isMobile
      ? 'radial-gradient(108.14% 148.14% at 50% 128.68%, #301105 0%, #000000 49.4%, #000000 100%)'
      : 'radial-gradient(225.17% 225.17% at 46.33% 166.67%, #301105 0%, #000000 49.4%, #301105 100%)',
  };

  return (
    <div
      className={`bg-primary-950 text-white relative md:pt-32 pt-30 pb-10 md:pb-16
      ${verticalPosition && `vertical-position-${verticalPosition}`} ${horizontalPosition && `horizontal-position-${horizontalPosition}`}`}
      style={radialBackground}
    >
      <div
        style={{
          background:
            'conic-gradient(from 70.97deg at 10.54% -10.5%, #B18457 0deg, #3C2309 360deg)',
        }}
        className='absolute top-0 left-1/2 md:left-10 transform -translate-x-1/2 md:translate-x-0 md:h-[110px] h-[90px] md:w-[122px] w-[113px] z-40 flex justify-center items-end pb-4'
      >
        <div>
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

      <div className='pr-5 pl-5 mt-2 md:pl-10 md:pr-10 flex items-center justify-between items-end mb-6'>
        <h2 className='text-sm md:text-base text-center md:text-start text-white px-0'>
          {heading}
        </h2>
        {!isMobile && (
          <div className=''>
            <Button
              asChild
              style={{
                background: 'var(--prive1)',
                border: '1px solid var(--prive2)',
                color: 'var(--prive2)',
              }}
              variant={'default'}
              size={'lg'}
              className='rounded-[100px] pl-6 pr-6 h-[50px]'
            >
              <Link
                href='/prive'
                onClick={() => {
                  trackEvent('widget_clicked', {
                    page_name: 'homepage',
                    widget_name: 'Prive',
                    widget_type: 'prive',
                    cta_type: 'explore_more',
                    vertical_position: 8,
                    horizontal_position: 8,
                  });
                }}
              >
                Explore privé
              </Link>
            </Button>
          </div>
        )}
      </div>

      <ReusableCarousel
        className='px-0 md:px-10'
        mobileViewType='carousel'
        data={priveCardData}
        renderItem={(item, index) => (
          <PropertyCard
            property={item}
            variant='prive-home'
            onCardClick={(id) => {
              if (onClick) {
                onClick(index);
              }
            }}
            isClickable={true}
            showActionButton={true}
            peram='homepage'
          />
        )}
        spacing={{ mobile: 16, tablet: 16, desktop: 16 }}
        slidesPerView={{ mobile: 1.5, tablet: 2.1, desktop: 2.9 }}
        showArrows={true}
        prive={true}
        showDots={!isMobile}
        startIndex={isMobile ? Math.floor(priveCardData?.length / 2) : 0}
        centerSlides={isMobile}
        centerSlideScale={1}
      />

      {isMobile && (
        <div className='text-center mt-6 md:mt-0'>
          <Button
            asChild
            style={{
              background: 'var(--prive1)',
              border: '1px solid var(--prive2)',
              color: 'var(--prive2)',
            }}
            variant={'default'}
            size={'lg'}
            className='rounded-[100px] pl-6 pr-6 h-[42px] sm:h-[52px]'
          >
            <Link
              href='/prive'
              onClick={() => {
                trackEvent('widget_clicked', {
                  page_name: 'homepage',
                  widget_name: 'Prive',
                  widget_type: 'prive',
                  cta_type: 'explore_more',
                  vertical_position: 8,
                  horizontal_position: 8,
                });
              }}
            >
              Explore privé
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PriveCardSection;
