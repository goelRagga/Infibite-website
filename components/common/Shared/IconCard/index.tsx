import { IconCardProps } from 'city-destination';
import Image from 'next/image';

const IconCard: React.FC<IconCardProps> = ({
  icon,
  iconUrl = `${process.env.IMAGE_DOMAIN}/award_star_674832d1bd.svg`,
  countNumbers = '3000',
  iconWidth = 28,
  iconHeight = 28,
  countFeature = '5-star reviews',
  className,
}) => {
  return (
    <>
      <div className={`flex flex-col items-center ${className}`}>
        {iconUrl && (
          <div className='bg-primary-100 h-[36px] w-[36px] md:h-[42px] md:w-[42px] flex items-center justify-center rounded-3xl mb-4 md:mb-4'>
            <Image
              src={iconUrl}
              alt='icon'
              width={iconWidth}
              height={iconHeight}
              className={`h-[24px] w-[24px] md:${iconWidth} md:${iconHeight}`}
            />
          </div>
        )}

        {countNumbers && (
          <h3 className='font-serif text-foreground leading-none mb-2 text-3xl md:text-5xl text-center md:text-start'>
            {countNumbers}
          </h3>
        )}

        {countFeature && <p className='md:text-sm text-xs'>{countFeature}</p>}
      </div>
    </>
  );
};
export default IconCard;
