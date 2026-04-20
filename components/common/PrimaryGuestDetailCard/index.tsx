import { PrimaryGuestDetailCardProps } from 'guest-details';

import Svg from '../Shared/Svg';
import useIsMobile from '@/hooks/useIsMobile';
// import ResponsiveDialogDrawer from '../ResponsiveDialogDrawer';
import PersonsIcon from '@/assets/personsIcon.svg';
import PhoneIcon from '@/assets/phoneIcon.svg';
import IconMail from '@/assets/iconMail.svg';
import ErrorIcon from '@/assets/errorIcon.svg';

const PrimaryGuestDetailCard: React.FC<PrimaryGuestDetailCardProps> = ({
  user,
  isBookingConfirm,
  className,
  isCancellationPlan,
}) => {
  const guestName = user?.name || 'N/A';
  const guestPhone = user?.phone || 'N/A';
  const guestEmail = user?.email || 'N/A';
  const isMobile = useIsMobile();
  // const [open, setOpen] = useState(false);
  // const [onClose, setOnClose] = useState(false);
  const refundableMessage =
    'This booking is non-refundable. No refund will be issued in the case of cancellation.';

  return (
    <>
      <div
        className={`${className}  
        ${
          !isBookingConfirm && isMobile
            ? 'rounded-tr-2xl rounded-tl-2xl'
            : 'rounded-2xl '
        }  
        ${isMobile && !isCancellationPlan ? 'rounded-b-2xl mb-6' : ''}
        ${isMobile && isCancellationPlan ? 'border-b-0' : ''} border ${
          !isBookingConfirm && isMobile
            ? 'border-primary-200'
            : 'border-primary-100'
        } overflow-hidden bg-card md:bg-white relative z-10 px-4 py-6 mb-0 md:px-6 md:py-6 dark:bg-[var(--black5)] dark:border-secondary-950`}
      >
        <div
          className={`w-full ${
            !isBookingConfirm ? 'justify-between' : ''
          } flex items-center`}
        >
          <h3 className='text-xl text-foreground font-serif'>
            Primary Guest Details
          </h3>
          {/* {!isBookingConfirm && (
            <span className='flex items-center justify-center border rounded-full border-accent-red-900 w-[28px] h-[28px]'>
              <Svg
                src={
                  `${process.env.IMAGE_DOMAIN}/edit_13e9d2635b.svg`
                }
                width='16'
                height='16'
              />
            </span>
          )} */}
        </div>

        <div className=''>
          <div className='flex pt-4 items-center'>
            <div className='bg-primary-400 px-1 py-2 mr-3 rounded-full flex justify-center items-center w-[24px] h-[24px]'>
              <PersonsIcon />
            </div>
            <p className='text-sm dark:text-primary-400'>{guestName}</p>
          </div>

          <div className='flex pt-4 items-center'>
            <div className='bg-primary-400 px-1 py-2 mr-3 rounded-full flex justify-center items-center w-[24px] h-[24px]'>
              <PhoneIcon />
            </div>
            <p className='text-sm dark:text-primary-400'>{guestPhone}</p>
          </div>

          <div className='flex pt-4 items-center'>
            <div className='bg-primary-400 px-1 py-2 mr-3 rounded-full flex justify-center items-center w-[24px] h-[24px]'>
              <IconMail />
            </div>
            <p className='text-sm dark:text-primary-400'>{guestEmail}</p>
          </div>
          {!isBookingConfirm && (
            <>
              {/* <div className='flex justify-center items-center md:block'>
                <div className='p-1 md:p-0 mt-4 border-0 md:border-primary-100'>
                  <Button
                    variant='outline'
                    className='h-[52px] md:h-[36px] cursor-pointer w-full text-sm border border-accent-red-900 text-accent-red-900 font-semibold rounded-lg px-4 py-4'
                  >
                    Modify Booking
                  </Button>
                </div>
                <div className='p-1 md:p-0 mt-4 md:mt-2 border-0 md:border-primary-100'>
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    variant='outline'
                    className='h-[52px] md:h-[36px] cursor-pointer w-full bg-accent-red-900 hover:bg-accent-red-950 hover:border-accent-red-950 text-sm border border-accent-red-900 text-primary-50 font-semibold rounded-lg px-4 py-4'
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div> */}
              {!isMobile && isCancellationPlan && !isBookingConfirm && (
                <div className='flex items-center bg-accent-yellow-50 dark:bg-[var(--grey6)] p-4 mt-3 md:mt-4 rounded-2xl'>
                  <div>
                    <ErrorIcon />
                  </div>
                  <p className='text-xs text-foreground ml-3'>
                    {refundableMessage}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {isMobile && isCancellationPlan && !isBookingConfirm && (
        <div className='flex items-center bg-accent-yellow-50 p-4 mt-0 md:mt-4 rounded-bl-2xl rounded-br-2xl dark:bg-secondary-950'>
          <div>
            <ErrorIcon />
          </div>
          <p className='text-xs text-foreground ml-3'>{refundableMessage}</p>
        </div>
      )}
      {/* <ResponsiveDialogDrawer
        title='Cancel Booking'
        open={open}
        setOpen={setOpen}
        contentClassName='sm:max-w-[792px]!'
      >
        <div className='relative h-[60dvh] md:h-auto'>
          <div className='overflow-y-auto h-[calc(80dvh-200px)] md:h-auto pb-[150px] md:pb-0'>
            <p className='text-xs text-foreground'>
              Are you sure you want to cancel your booking? Once cancelled, this
              action cannot be undone, and your reservation will no longer be
              valid. Below, you’ll find a detailed breakdown of your refund,
              including any applicable charges or deductions. Please review
              carefully before proceeding.
            </p>
            <div className='border border-primary-200 p-4 rounded-2xl mt-5'>
              <h5 className='text-base text-primary-800 font-semibold mb-3'>
                Refund Details
              </h5>
              <p className='text-sm text-foreground mb-1.5 flex items-center justify-between'>
                <span>Total Amount Paid</span>
                <span>₹ 1,28,000</span>
              </p>
              <p className='text-sm text-foreground mb-1.5 flex items-center justify-between'>
                <span>Cancellation Charges</span>
                <span className='text-accent-green-700'> - ₹ 1,28,000</span>
              </p>
              <p className='text-sm text-foreground mb-1.5 flex items-center justify-between'>
                <span>Total Amount Paid</span>
                <span>₹ 1,28,000</span>
              </p>
              <h5 className='flex justify-between items-center text-base border-t border-primary-200 pt-2 mt-2 text-foreground font-semibold'>
                <span>Total Refund Amount</span>
                <span>₹ 1,28,000</span>
              </h5>
            </div>
          </div>

          <div className='fixed bottom-0 left-0 mt-4 w-full bg-white p-5 flex items-center justify-center gap-4 md:static md:p-0 md:mt-4 md:bg-transparent'>
            <Button
              onClick={() => setOpen(false)}
              className='text-accent-red-900  bg-white border border-accent-red-900 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'
            >
              Back
            </Button>
            <Button className='text-white bg-accent-red-900 border border-accent-red-900 hover:bg-accent-red-950 hover:border-accent-red-950 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'>
              Cancel Booking
            </Button>
          </div>
        </div>
      </ResponsiveDialogDrawer> */}
    </>
  );
};

export default PrimaryGuestDetailCard;
