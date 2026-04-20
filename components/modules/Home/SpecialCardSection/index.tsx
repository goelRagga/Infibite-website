import SpecialCard from '@/components/common/LuxuryCard';
import { SectionTemplate } from '@/components/common/Shared/Section';
import useIsMobile from '@/hooks/useIsMobile';
import { SpecialCardSectionProps } from 'special-cardSection';

const SpecialCardSection: React.FC<SpecialCardSectionProps> = ({
  cardData,
  title,
  description,
}) => {
  const isMobile = useIsMobile();
  return (
    <div className='w-full mx-auto'>
      {isMobile && (
        <div>
          <SectionTemplate
            heading={title}
            description={description}
            showDefaultArrows={false}
          />
        </div>
      )}

      <div className='xl:hidden'>
        <div
          className='block overflow-x-auto no-scrollbar'
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <div className='flex gap-4 w-max'>
            {cardData?.map((card: any, index: number) => (
              <div key={index} className='w-[70vw] sm:w-[38vw] flex-shrink-0'>
                <SpecialCard
                  title={card?.title}
                  description={card?.description}
                  imageSrc={card?.imageSrc}
                  imageAlt={card?.imageAlt}
                  imagePosition={card?.imagePosition}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='hidden xl:block'>
        <div className='grid xl:grid-cols-3 gap-4'>
          <SpecialCard
            title={cardData[0]?.title}
            description={cardData[0]?.description}
            imageSrc={cardData[0]?.imageSrc}
            imageAlt={cardData[0]?.imageAlt}
            imagePosition={cardData[0]?.imagePosition}
            className='col-span-1 xl:col-span-1'
          />

          <div className='col-span-1 xl:col-span-2 grid grid-cols-1 gap-4'>
            <SpecialCard
              title={cardData[1]?.title}
              description={cardData[1]?.description}
              imageSrc={cardData[1]?.imageSrc}
              imageAlt={cardData[1]?.imageAlt}
              imagePosition={cardData[1]?.imagePosition}
            />

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
              <SpecialCard
                title={cardData[2]?.title}
                description={cardData[2]?.description}
                imageSrc={cardData[2]?.imageSrc}
                imageAlt={cardData[2]?.imageAlt}
                imagePosition={cardData[2]?.imagePosition}
              />

              <SpecialCard
                title={cardData[3]?.title}
                description={cardData[3]?.description}
                imageSrc={cardData[3]?.imageSrc}
                imageAlt={cardData[3]?.imageAlt}
                imagePosition={cardData[3]?.imagePosition}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpecialCardSection;
