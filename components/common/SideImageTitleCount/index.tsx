import Image from 'next/image';

interface SideImageTitleCountProps {
  imageUrl: string;
  name: string;
  quantity: number;
}

export function SideImageTitleCount({
  imageUrl,
  name,
  quantity,
}: SideImageTitleCountProps) {
  return (
    <div className='flex items-center w-full h-[60px] rounded-2xl bg-white overflow-hidden border border-primary-100 dark:bg-[var(--grey8)] dark:border-primary-400'>
      <div className='w-[64px] h-[60px] relative'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover rounded-tl-2xl rounded-bl-2xl'
        />
      </div>
      <div className='flex-1 flex items-center justify-between px-6 h-full'>
        <span className='text-base font-serif text-accent-red-900 dark:text-primary-100'>
          {name}
        </span>
        <span className='text-base font-semibold text-accent-red-900 dark:text-primary-100'>
          × {quantity}
        </span>
      </div>
    </div>
  );
}
