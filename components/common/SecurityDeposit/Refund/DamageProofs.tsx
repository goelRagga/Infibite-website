import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BASE64 } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { DamageProofsProps } from 'property-damage-types';
import React, { useState } from 'react';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import useIsMobile from '@/hooks/useIsMobile';

const DamageProofs: React.FC<DamageProofsProps> = ({
  damageData,
  className,
  isProofsDrawerOpen,
  handleProofsDrawerClose,
  title,
  content,
  actions,
  handleClose,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const wordLimit = 20;
  const createdDate = damageData?.createdAt
    ? format(new Date(damageData.createdAt), 'dd MMM yyyy, hh:mm a')
    : '';

  // Reset current image index when modal opens with new damage data
  React.useEffect(() => {
    if (isProofsDrawerOpen) {
      setCurrentImageIndex(0);
    }
  }, [isProofsDrawerOpen, damageData?.id]);

  if (!damageData || !damageData?.attachments?.length) return null;

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? damageData.attachments.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === damageData.attachments.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const modalTitle = title || damageData.description;
  return (
    <ResponsiveDialogDrawer
      open={isProofsDrawerOpen}
      setOpen={handleProofsDrawerClose}
      title={modalTitle}
      contentClassName={`sm:max-w-[600px]! sm:h-auto sm:max-h-[60dvh] max-h-[100dvh]! ${isMobile ? '' : 'bg-[var(--white3)]'} dark:bg-background border-none sm:p-6 p-0`}
    >
      <div className='relative h-full flex flex-col'>
        {/* Header */}
        <div className='flex items-start justify-between pb-4'>
          <div className='flex-1'>
            <p className='text-xs text-muted-foreground'>{createdDate}</p>
          </div>
          {damageData.amount && (
            <div className='flex items-center gap-3'>
              <Badge
                variant='outline'
                className='text-sm text-[var(--red1)] border-accent-red-50 dark:text-[var(--red1)] bg-white font-semibold rounded-full px-4 py-1 dark:bg-[var(--red4)] dark:border-[var(--red3)]'
              >
                ₹ {damageData.amount.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>

        {/* Content from props */}
        {content && (
          <div className='pb-4'>
            <p className='text-sm text-muted-foreground'>{content}</p>
          </div>
        )}

        {/* Image Slider */}
        <div className='flex-1 pb-4'>
          <div className='relative'>
            {/* Main Image */}
            <div className='relative rounded-lg overflow-hidden border-2 border-blue-200'>
              <Image
                src={`${damageData.attachments[currentImageIndex]}`}
                alt={`${damageData.title} - Image ${currentImageIndex + 1}`}
                className='w-[600px] h-64 md:h-80 object-cover'
                height={320}
                width={320}
                placeholder='blur'
                blurDataURL={BASE64}
              />
            </div>

            {/* Navigation Arrows */}
            {damageData.attachments.length > 1 && (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handlePrevious}
                  className='absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-md'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleNext}
                  className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-md'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </>
            )}
          </div>

          {/* Pagination Dots */}
          {damageData.attachments.length > 1 && (
            <div className='flex justify-center items-center gap-2 mt-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handlePrevious}
                className='h-8 w-8 p-0'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <div className='flex gap-2'>
                {damageData.attachments.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentImageIndex
                        ? 'bg-[var(--prive6)]'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                  />
                ))}
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={handleNext}
                className='h-8 w-8 p-0'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>

        {/* Remark Section */}
        <div className='pb-4'>
          <h4 className='text-xs font-semibold text-foreground mb-1 dark:text-[var(--prive6)]'>
            Remark:
          </h4>
          <p className='text-xs text-muted-foreground leading-relaxed'>
            {damageData.remark}
          </p>
        </div>

        {/* Custom Actions */}
        {actions && <div className='pb-4'>{actions}</div>}

        {/* Footer */}
        <div className='px-0 pb-6 sm:px-6'>
          <div className='flex justify-center'>
            <Button
              size={'lg'}
              className='border-accent-red-900 sm:min-w-[180px] min-w-full text-accent-red-900 rounded-full font-semibold dark:bg-background dark:text-[var(--accent-text)] dark:border-[var(--accent-text)]'
              variant='outline'
              color='secondary'
              onClick={handleProofsDrawerClose || handleClose || onClose}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
};

export default DamageProofs;
