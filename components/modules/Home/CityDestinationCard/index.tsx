import CustomImage from '@/components/common/CustomImage';
import Svg from '@/components/common/Shared/Svg';
import { CityDestinationCardProps } from 'city-destinationCard';
import useIsMobile from '@/hooks/useIsMobile';

export default function CityDestinationCard({
  name,
  propertiesCount,
  image,
}: CityDestinationCardProps) {
  const isMobile = useIsMobile();
  return (
    <>
      <div
        className={isMobile ? '' : 'group'}
        // onClick={() => {
        //   trackEvent('widget_clicked', {
        //     page_name: 'homepage',
        //     city_name: name,
        //     number_of_properties_shown: propertiesCount,
        //     widget_name: 'City Destination Card',
        //     cta_type: 'city_cards',
        //     vertical_position: 2,
        //     horizontal_position: index,
        //   });
        // }}
      >
        <div className='relative rounded-3xl overflow-hidden sm:background-on-hover2 sm:shadow transition-transform duration-200 ease-out cursor-pointer group-hover:scale-[1.02]'>
          <div className='transition-all duration-500'>
            <CustomImage
              src={image}
              alt={name}
              width={isMobile ? 320 : 600}
              height={isMobile ? 280 : 380}
              quality={80}
              className='w-[265px] h-[200px] sm:w-full sm:h-[230px] object-cover object-center transition-all duration-500 ease-in-out brightness-[95%] group-hover:brightness-[100%]'
            />
          </div>

          {/* Background overlay for readability */}
          <div className='cityCardBackground absolute inset-0 z-10'></div>
          <div className='absolute top-3 right-3 z-20 w-9 h-9 rounded-full border border-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex backdrop-blur-md bg-white/50'>
            <Svg
              src={`${process.env.IMAGE_DOMAIN}/arrow_outward_d0b80a3cb1.svg`}
              width='12px'
              height='12px'
            />
          </div>

          <div className='absolute w-full bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20'>
            <h4 className='typography-title-regular font-serif white1'>
              {name}
            </h4>
            <p className='typography-small-regular white1'>{`${propertiesCount} ${
              propertiesCount > 1 ? 'Properties' : 'Property'
            }`}</p>
          </div>
        </div>
      </div>
    </>
  );
}
