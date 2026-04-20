import React, { Suspense, useState } from 'react';
import PropertyCard from '@/components/common/PropertyCard';
import { SectionTemplate } from '@/components/common/Shared/Section';
import ScrollData from '@/components/common/ScrollData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

interface EventSpacesProps {
  data?: any[];
  title?: string;
  description?: string;
  redirectUrl?: string;
  itemClassName?: string;
  isButton?: boolean;
}

const EventSpaces: React.FC<EventSpacesProps> = ({
  data,
  title,
  description,
  redirectUrl,
  itemClassName,
  isButton = true,
}) => {
  const isMobile = useIsMobile();
  const eventSpacesData = Array.isArray(data) ? data : [];

  return (
    <>
      {eventSpacesData.length > 0 && (
        <section className='w-full px-5 sm:px-10 pt-10 pb-5'>
          <SectionTemplate
            heading={title}
            description={description}
            showDefaultArrows={false}
            isButton={isButton}
            buttonName='Explore more Properties'
            buttonLink={redirectUrl ?? ''}
          />

          <Suspense fallback={null}>
            <ScrollData
              className=''
              itemClassName={
                itemClassName ? itemClassName : 'md:w-[23.7%] w-[90%]'
              }
            >
              {eventSpacesData?.map((property, index) => (
                <div key={property.id ?? index}>
                  <PropertyCard
                    isRenderFeatures={false}
                    isRenderPrice={false}
                    property={property}
                    peram='getquote=true'
                    variant='default'
                    showActionButton={false}
                  />
                </div>
              ))}
            </ScrollData>
          </Suspense>
          {isMobile && (
            <div className='text-center'>
              <Button
                variant={'default'}
                size={'lg'}
                className='mt-5 pl-6 pr-6 h-[49px] rounded-full sm:min-w-[180px] bg-accent-red-900 hover:bg-accent-red-950 text-white text-xs'
              >
                <Link href={redirectUrl ?? ''}>Explore more Properties</Link>
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default EventSpaces;
