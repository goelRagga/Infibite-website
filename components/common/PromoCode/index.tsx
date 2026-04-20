import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CustomImage from '../CustomImage';
import Svg from '../Shared/Svg';
import { PromoCardProps } from 'promo-card';
import Link from 'next/link';
import ResponsiveDialogDrawer from '../ResponsiveDialogDrawer';
import EazyDinerModal from './EazyDinerModalContent';
import CouponCodeInputBox from './CouponCodeInputBox';

const PromoCard: React.FC<PromoCardProps> = ({
  logo = `${process.env.IMAGE_DOMAIN}/eazy_Diner_Logo_334d63e78b.svg`,
  membership = 'Free 3 Months Membership',
  title = 'Congratulations!',
  description = 'You are now eligible for a complimentary EazyDiner Prime Membership*',
  backgroundImage = `${process.env.IMAGE_DOMAIN}/eazy_Diner_046aa590fe.jpg`,
  backgroundColor,
  inputBoxBorder = '1px dashed var(--orange2)',
  codeDescription = "Use this code on EazyDiner's website to avail the membership:",
  couponCode = 'CodeHuMai',
  redeemLink,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const renderButton = () => {
    return (
      <Link
        href='https://b.ezyd.in/aoFmj0hDWOb'
        target='_blank'
        className='w-full md:w-[auto]'
      >
        <Button
          asChild
          className='text-white cursor-pointer w-[100%] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'
          style={{ backgroundColor: 'var(--orange1)' }}
        >
          <span>Redeem Now</span>
        </Button>
      </Link>
    );
  };

  const renderBackButton = () => {
    return (
      <Button
        onClick={() => setOpen(false)}
        className='text-accent-red-900 bg-white border border-accent-red-900 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'
      >
        Back
      </Button>
    );
  };

  return (
    <div
      className='rounded-bl-2xl rounded-tr-2xl rounded-tl-2xl rounded-br-2xl'
      style={{ background: backgroundColor || 'var(--orange3)' }}
    >
      <div className='w-full h-[211px] overflow-hidden relative bg-black text-white rounded-t-2xl rounded-b-2xl rounded-bl-none rounded-br-none'>
        <div className='absolute inset-0 h-full w-full z-0'>
          <CustomImage
            src={backgroundImage}
            alt='Food background'
            className='object-cover w-full h-[211px]'
            width={900}
            height={500}
          />
          <div
            className='absolute inset-0 w-full h-full'
            style={{ background: 'var(--black2)' }}
          />
        </div>

        <div className='relative z-10 p-4 sm:p-6 space-y-4'>
          <Svg src={logo} width={'42'} height={'42'} />
          <span className='bg-primary-50 orange1 border border-primary-100 px-3 py-1 rounded-full text-xs font-semibold'>
            {membership}
          </span>
          <h2 className='text-xl md:text-2xl font-serif mt-2 md:mt-2 mb-0.5 md:mb-1.5'>
            {title}
          </h2>
          <div className='flex flex-col md:flex-row items-start justify-between md:items-end'>
            <p className='text-xs md:text-sm text-white md:w-[50%]'>
              {description}
            </p>
            <span
              className='text-secondary-100 mt-2'
              style={{ fontSize: '10px' }}
            >
              *T&C Apply
            </span>
          </div>
        </div>
      </div>

      <div className='p-4 md:p-6'>
        <div>
          <CouponCodeInputBox
            inputBoxBorder={inputBoxBorder}
            couponCode={couponCode}
            codeDescription={codeDescription}
          />
        </div>
        <div className='pt-4 flex flex-col md:flex-row justify-between items-center'>
          {renderButton()}

          <span
            onClick={() => setOpen(true)}
            className='text-sm font-semibold text-foreground mt-4 md:mt-1 cursor-pointer'
          >
            How to Redeem?
          </span>
          <ResponsiveDialogDrawer
            title='EazyDiner Promotional Offer'
            open={open}
            setOpen={setOpen}
            contentClassName='sm:max-w-[792px]!'
          >
            <div className='relative h-[70dvh] md:h-auto'>
              <div className='overflow-y-auto h-[calc(100dvh-200px)] md:h-auto pb-[150px] md:pb-0'>
                <CouponCodeInputBox
                  inputBoxBorder={inputBoxBorder}
                  couponCode={couponCode}
                  codeDescription={codeDescription}
                />
                <EazyDinerModal />
              </div>

              <div className='fixed bottom-0 left-0 w-full bg-white p-5 flex items-center justify-center gap-4 md:static md:p-0 md:mt-4 md:bg-transparent'>
                {renderBackButton()}
                {renderButton()}
              </div>
            </div>
          </ResponsiveDialogDrawer>
        </div>
      </div>
    </div>
  );
};
export default PromoCard;
