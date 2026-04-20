import SpecialOccasionsModalContent from '@/components/common/BookingConfirm/specialOccasionsModalContent';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import InfoDisplay from '@/components/common/InfoDisplay';
import { SpecialRequestsProps } from 'plans';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SpecialRequests: React.FC<SpecialRequestsProps> = ({
  booking,
  hideDesc,
  hideBottomBorder,
  hideSpecialRequests,
  mealInfoDisplayContainerClassName,
  className,
}) => {
  // TODO: Need to get the actual rate plan description from the booking
  // const ratePlanNameDesc = 'N/A';
  const specialRequests = 'Special Requests';
  // TODO: Need to get the actual special requests from the booking
  // const dummyOtherRequests = 'Celebrating a family reunion';
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={cn(
          'rounded-bl-2xl rounded-br-2xl border-0 px-4 pb-4 md:px-6 mx-auto text-sm',
          hideBottomBorder ? 'border-0' : 'border-b-primary-100 dark:border-0',
          className
        )}
      >
        <div className='p-0'>
          <div className='flex flex-col md:grid md:grid-cols-2 gap-6'>
            <div
              className={cn(
                'border-b-0 md:border-b-0 pb-1 border-b-primary-100 ',
                hideBottomBorder && 'md:border-r-0',
                mealInfoDisplayContainerClassName
              )}
            >
              <InfoDisplay
                title='Meals'
                value={booking?.ratePlanName || 'N/A'}
                // description={!hideDesc ? ratePlanNameDesc : undefined}
              />
            </div>

            {!hideSpecialRequests && (
              <div
                className='flex justify-between'
                // onClick={() => setOpen(true)}
              >
                <InfoDisplay
                  title={specialRequests}
                  value='Others'
                  // description={!hideDesc ? `Note: ${dummyOtherRequests}` : undefined}
                />
                {/* <Svg
                src={
                  {`${process.env.IMAGE_DOMAIN}/edit_13e9d2635b.svg`}
                }
                width='16'
                height='16'
              /> */}
              </div>
            )}
          </div>
        </div>
      </div>
      {!hideSpecialRequests && (
        <ResponsiveDialogDrawer
          open={open}
          setOpen={setOpen}
          title='Special Occasions'
          contentClassName='sm:max-w-[792px]! bg-card'
        >
          <SpecialOccasionsModalContent onClose={() => setOpen(false)} />
        </ResponsiveDialogDrawer>
      )}
    </>
  );
};
export default SpecialRequests;
