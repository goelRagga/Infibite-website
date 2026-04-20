'use client';

import CustomImage from '@/components/common/CustomImage';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';

type AddOnCardProps = {
  id: any;
  image: string;
  name: string;
  description?: string;
  basePrice: number;
  count?: number;
  onAdd: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  applicableAdults: any;
};

export default function ServiceCard({
  id,
  image,
  name,
  description,
  basePrice,
  count = 0,
  onAdd,
  onIncrement,
  onDecrement,
  applicableAdults,
}: AddOnCardProps) {
  const isSelected = count > 0;

  return (
    <div
      className={clsx(
        'flex rounded-xl border-1 shadow-none overflow-hidden bg-white dark:bg-[var(--grey6)]',
        isSelected
          ? 'border-primary dark:border-secondary-950'
          : 'border-muted dark:border-secondary-950'
      )}
    >
      <div className='relative w-1/3 min-w-[100px]'>
        <CustomImage
          height={200}
          width={200}
          src={image}
          alt={name}
          className='object-cover h-full'
        />
      </div>

      <div className='flex flex-col justify-between py-2 px-4 pr-2 sm:p-4 md:p-2 xl:p-4 w-2/3 h-full'>
        <div className='flex-1'>
          <h4 className='text-sm font-semibold font-serif text-accent-red-900 line-clamp-2 dark:text-[var(--prive2)]'>
            {name}
          </h4>
          {description && (
            <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
              {description}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between mt-2 sm:mt-4'>
          <div>
            <p className='text-sm xl:text-sm font-semibold'>
              {basePrice == 0 ? (
                <span className='text-green-800'>FREE for you</span>
              ) : (
                `₹ ${basePrice}`
              )}
            </p>
            <p className='text-xs text-muted-foreground'>
              {basePrice !== 0 &&
                (name !== 'Bonfire' &&
                name !== 'Eli-Card' &&
                name !== 'Movie Night'
                  ? `Per ${applicableAdults} person`
                  : 'Per unit')}
            </p>
          </div>
          {isSelected ? (
            <div className='flex items-center py-1'>
              <Button
                onClick={() => onDecrement(id)}
                size='sm'
                className='cursor-pointer h-8 w-8 p-1 bg-white text-accent-red-900 border border-accent-red-900 rounded-full hover:bg-one hover:border-accent-red-950 dark:bg-[var(--grey7)] dark:border-[var(--prive2)] dark:text-[var(--prive2)]'
              >
                <Minus className='h-5 w-5' />
              </Button>
              <span className='mx-4 text-sm font-medium'>{count}</span>
              <Button
                size='sm'
                onClick={() => onIncrement(id)}
                className='cursor-pointer h-8 w-8 p-1 bg-white text-accent-red-900 border border-accent-red-900 rounded-full hover:bg-one hover:border-accent-red-950 dark:bg-[var(--grey7)] dark:border-[var(--prive2)] dark:text-[var(--prive2)]'
              >
                <Plus className='h-5 w-5' />
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant='outline'
                className='cursor-pointer min-w-[100px] rounded-full border-accent-red-900 text-accent-red-900 hover:bg-one hover:border-accent-red-950 dark:bg-[var(--grey7)] dark:border-[var(--prive2)] dark:text-[var(--prive2)]'
                onClick={() => onAdd(id)}
              >
                Add
              </Button>
              {name !== 'Bonfire' && basePrice !== 0 && (
                <div className='text-xs text-secondary-800 text-center pt-1'>
                  {' '}
                  No. of guests
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
