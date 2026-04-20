'use client';
import CustomImage from '@/components/common/CustomImage';
import { SectionTemplate } from '@/components/common/Shared/Section';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsTablet from '@/hooks/useIsTablet';
import { trackEvent } from '@/lib/mixpanel';
import { cn } from '@/lib/utils';
import { SpotlightItem } from 'api-types';
import Image from 'next/image';
import Link from 'next/link';

interface SpotlightSectionProps {
  spotlightData: SpotlightItem[];
  heading?: string;
  description?: string;
  prive?: boolean;
  verticalPosition?: number;
  horizontalPosition?: number;
}

const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  spotlightData,
  heading,
  description,
  prive,
  verticalPosition,
  horizontalPosition,
}) => {
  const isTablet = useIsTablet();

  const { ref: contentRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });
  return (
    <div className='w-full mx-auto'>
      <div className='md:pr-0'>
        <SectionTemplate
          heading={heading}
          description={description}
          showDefaultArrows={false}
          prive={prive}
          verticalPosition={verticalPosition}
          horizontalPosition={horizontalPosition}
        />
      </div>
      <div
        ref={contentRef}
        className='flex -ml-5 w-[108%] pl-5 sm:pl-0 sm:ml-0 flex-row xl:flex-row gap-4 sm:gap-6 sm:w-full overflow-x-auto xl:overflow-visible no-scrollbar xl:no-scrollbar'
      >
        {spotlightData?.map((item, index) => (
          <div
            key={index}
            className={cn(
              `relative overflow-hidden border border-white group flex-shrink-0 ${
                index === 0 ? 'lg:w-1/4 xl:w-2/4' : 'lg:w-1/4'
              } w-[280px] lg:w-[400px] xl:flex-shrink`,
              prive && 'border-none'
            )}
          >
            <Link
              onClick={() => {
                trackEvent('widget_clicked', {
                  page_name: prive ? 'prive' : 'homepage',
                  widget_name: 'ELIVAAS in the Spotlight',
                  widget_type: 'spotlight',
                  cta_type: 'spotlight_card',
                  vertical_position: 4,
                  horizontal_position: index + 1,
                });
              }}
              href={item.link ? item.link : '#'}
              target={item.link && '_blank'}
            >
              <div className='relative group'>
                {isIntersecting ? (
                  <>
                    <CustomImage
                      src={isTablet ? item.mobileImage : item.webImage}
                      alt={item.title}
                      className='md:h-[270px] w-full h-[200px] object-cover rounded-3xl'
                      width={1000}
                      height={380}
                      quality={40}
                    />
                    {item.link && !isTablet && (
                      <div className='absolute top-3 right-3 z-20 w-9 h-9 rounded-full border border-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-10 bg-white/50'>
                        <Image
                          src={`${process.env.IMAGE_DOMAIN}/arrow_outward_d0b80a3cb1.svg`}
                          alt='icon'
                          width={13}
                          height={13}
                          loading='lazy'
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className='md:h-[270px] w-full md:w-full h-[200px] bg-gray-200 rounded-3xl animate-pulse' />
                )}
              </div>

              <div className='md:mt-6 mt-0 md:static absolute top-4 left-4'>
                <span
                  className='inline-flex items-center gap-1 text-white text-xs font-medium px-2 py-1 rounded-full [&_img]:w-4 [&_img]:h-4 [&_img]:object-contain [&_img]:inline-block [&_img]:align-middle'
                  style={{
                    backgroundColor:
                      index === 0 ? 'var(--accent-yellow-500)' : item.tagBg,
                  }}
                >
                  {item.tagIcon &&
                    isIntersecting &&
                    !item.tag?.includes('<img') && (
                      <Image
                        src={item.tagIcon}
                        alt='icon'
                        className='w-4 h-4'
                        width={16}
                        height={16}
                        loading='lazy'
                      />
                    )}
                  <span dangerouslySetInnerHTML={{ __html: item.tag || '' }} />
                </span>
              </div>
              <div className='mt-2'>
                <h6
                  className={cn(
                    `text-foreground md:text-xl text-md font-serif`,
                    prive && 'text-white'
                  )}
                >
                  {item.title}
                </h6>

                <p
                  className={cn(
                    'text-xs text-foreground mt-2  line-clamp-2',
                    prive && 'text-white'
                  )}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightSection;
