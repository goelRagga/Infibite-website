import Image from 'next/image';
import { SectionTemplate } from '@/components/common/Shared/Section';
import Link from 'next/link';
import { EventsSectionProps } from 'event-section';
import ScrollData from '@/components/common/ScrollData';
import StatCard from '@/components/common/StatCard';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { trackEvent } from '@/lib/mixpanel';
import Svg from '@/components/common/Shared/Svg';

const CustomImage = dynamic(() => import('@/components/common/CustomImage'));
const EventsSection: React.FC<EventsSectionProps> = ({
  heading,
  description,
  events = [],
  verticalPosition,
  horizontalPosition,
}) => {
  return (
    <div className='w-full mx-auto'>
      <div className='md:pr-0'>
        <SectionTemplate
          heading={heading}
          description={description}
          showDefaultArrows={false}
          verticalPosition={verticalPosition}
          horizontalPosition={horizontalPosition}
        />
      </div>
      <div className=''>
        <ScrollData
          className=''
          itemClassName='sm:w-[65%] md:w-[45%] lg:w-[33%] xl:w-[23.7%] w-[90%] pb-3'
          gap='gap-4 md:gap-6'
        >
          {events?.map((item, index) => (
            <Link
              key={index}
              href={item?.link ? item?.link : '#'}
              onClick={() => {
                trackEvent('widget_clicked', {
                  page_name: 'homepage',
                  widget_name: 'Unforgettable Events',
                  widget_type: 'events',
                  cta_type: 'event_card',
                  vertical_position: verticalPosition || 11,
                  horizontal_position: index + 1,
                });
              }}
            >
              <div
                className={`relative  p-2 group rounded-3xl border border-primary-100 h-full flex flex-col hover:shadow-md`}
                style={{ background: 'var(--backgroundGradient3)' }}
              >
                <div className='relative group'>
                  <Suspense fallback={<div>Loading...</div>}>
                    <CustomImage
                      src={item?.image}
                      alt={item?.title}
                      className='md:h-[266px] w-full h-[240px] object-cover rounded-3xl'
                      width={690}
                      height={400}
                      quality={40}
                    />
                  </Suspense>
                  <div className='absolute top-3 right-3 z-20 w-9 h-9 rounded-full border border-background flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex backdrop-blur-md bg-white/50'>
                    <Svg
                      src={`${process.env.IMAGE_DOMAIN}/arrow_outward_d0b80a3cb1.svg`}
                      width='12px'
                      height='12px'
                    />
                  </div>
                </div>
                <div className='mt-1 pl-1 pr-1 pt-4 pb-2 md:p-5 flex flex-col flex-1'>
                  <h6 className='text-primary-800 text-center md:text-xl text-xl font-serif line-clamp-2'>
                    {item?.title}
                  </h6>
                  <p className='text-xs text-center text-foreground mt-1 line-clamp-3 flex-1'>
                    {item?.description}
                  </p>
                  <div className='mt-4'>
                    <StatCard
                      className='bg-primary-400 text-xs rounded-3xl p-2 text-white text-center'
                      stat={item?.tagLine}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </ScrollData>
      </div>
    </div>
  );
};

export default EventsSection;
