import LazyImage from '@/components/common/LazyImage';
import { Card, CardContent } from '@/components/ui/card';

interface SpecialCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const SpecialCard = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imagePosition = 'top',
  className = '',
}: SpecialCardProps) => {
  const isHorizontal =
    (imagePosition === 'left' || imagePosition === 'right') && 'xl:grid-cols-2';
  const isReversed = imagePosition === 'right' || imagePosition === 'bottom';

  const containerClass = `grid grid-cols-1 ${isHorizontal}`;

  const renderContent = () => (
    <CardContent className='flex flex-col items-center justify-center p-4 md:p-6 text-center'>
      <h3
        className={`typography-title-regular font-serif text-primary-800 mt-1 md:mt-0 mb-1 md:mb-1`}
      >
        {title}
      </h3>
      <p className='typography-small-regular text-foreground '>{description}</p>
    </CardContent>
  );

  const renderImage = () => (
    <div className='aspect-[4/3] xl:aspect-auto w-full h-[187px] xl:h-auto overflow-hidden'>
      <LazyImage
        src={imageSrc}
        alt={imageAlt}
        width={550}
        height={600}
        quality={90}
        rootMargin='100px'
        className='object-cover h-[200px] xl:h-full w-full rounded-2xl'
        skeletonClassName='h-[200px] xl:h-full w-full rounded-2xl bg-gray-200 animate-pulse'
      />
    </div>
  );

  return (
    <Card
      className={`overflow-hidden border-none shadow-none rounded-3xl p-2 h-[340px] xl:h-auto ${className}`}
      style={{ background: 'var(--backgroundGradient)', boxShadow: 'none' }}
    >
      <div className={containerClass}>
        <div className='block xl:hidden'>
          {renderImage()}
          {renderContent()}
        </div>

        <div className='hidden xl:block xl:contents'>
          {isReversed ? (
            <>
              {renderContent()}
              {renderImage()}
            </>
          ) : (
            <>
              {renderImage()}
              {renderContent()}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SpecialCard;
