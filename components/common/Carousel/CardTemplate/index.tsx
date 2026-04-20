import CustomImage from '@/components/common/CustomImage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlayIcon, Volume2Icon } from 'lucide-react';
import Link from 'next/link';

interface CarouselTemplate1Props {
  data: any;
  titleClass?: string;
  descriptionClass?: string;
  priority?: boolean;
  className?: string;
  isButton?: boolean;
  onClick?: () => void;
}

export const CarouselTemplate1 = ({
  data,
  titleClass,
  descriptionClass,
  priority = false,
  className,
  isButton = false,
  onClick,
}: CarouselTemplate1Props) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden border border-gray-200 bg-white max-w-sm h-[280px] flex flex-col dark:border-primary-800  dark:bg-[var(--grey8)]`}
      onClick={onClick}
    >
      <div className={`relative w-full h-48 ${className}`}>
        <div className='overflow-hidden rounded-2xl h-full'>
          <CustomImage
            src={data?.url || data?.image}
            alt={data[0]?.name || 'villa Image'}
            title={data[0]?.name}
            width={720}
            height={600}
            quality={20}
            priority={priority}
            className='object-cover cursor-pointer sm:rounded-md h-full w-full'
          />
        </div>
        {data.tag && (
          <div className='absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-black'>
            {data.tag || 'Scenic View'}
          </div>
        )}

        {data.hasVideo && (
          <div className='absolute top-3 right-3 bg-white/80 p-1 rounded-full'>
            <Volume2Icon size={14} className='text-black' />
          </div>
        )}

        {data.hasVideo && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2'>
            <PlayIcon className='text-black' size={30} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className='py-2 px-3 flex-1 flex flex-col justify-between'>
        <div>
          {(data.title || data.name) && (
            <h5
              className={cn(
                'md:text-base sm:text-lg font-serif mb-1 text-foreground line-clamp-2 dark:text-accent-yellow-950',
                titleClass
              )}
            >
              {data.title || data.name}
            </h5>
          )}
          {data.description && (
            <p
              className={cn(
                'text-xs text-neutral-700 line-clamp-2 dark:text-white',
                descriptionClass
              )}
            >
              {data.description || 'Charming garden with serene views'}
            </p>
          )}
        </div>
        {data.meta && (
          <p className='text-sm text-neutral-500 mt-1 line-clamp-1'>
            {data.meta || '300 sq. ft. | Seating | Hill View'}
          </p>
        )}
        <div className='md:hidden'>
          {isButton && (
            <Button className='mt-4 w-28 text-xs font-semibold h-8 rounded-2xl bg-accent-red-900 text-white'>
              <Link href={'/villas'}>Redeem Now</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
