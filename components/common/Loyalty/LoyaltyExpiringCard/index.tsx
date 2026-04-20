import CustomImage from '@/components/common/CustomImage';
import { LoyaltyExpiringCardContent } from 'loyalty-expiring-card-types';
import useIsMobile from '@/hooks/useIsMobile';

export interface LoyaltyExpiringCardProps {
  data?: LoyaltyExpiringCardContent | null;
  hasAuth?: boolean;
  isNewUser?: boolean;
}

function LoyaltyExpiringCard({
  data: content,
  hasAuth,
  isNewUser,
}: LoyaltyExpiringCardProps) {
  if (hasAuth && !isNewUser) return null;

  const isMobile = useIsMobile();
  const expiringDays = content?.expiringDays;
  const title = content?.title;
  const description = content?.description;

  return (
    <div className='relative mx-4 sm:mx-0'>
      <div className='bg-foreground rounded-2xl overflow-hidden'>
        <CustomImage
          alt='Elicash'
          src={
            isMobile
              ? `${process.env.IMAGE_DOMAIN}/Mobile_Loyalty_aaac374d92.png`
              : `${process.env.IMAGE_DOMAIN}/Web_Loyalty_e333205f72.png`
          }
          width={isMobile ? 90 : 100}
          height={isMobile ? 150 : 1500}
          className={`w-full ${isNewUser ? 'h-21 sm:h-28' : 'h-16 sm:h-22 '}  object-cover rounded-2xl`}
          imageType='svg'
        />
      </div>
      <div
        className={`absolute ${isNewUser ? 'top-0' : 'top-1/2 -translate-y-1/2'} -translate-x-1/2 left-1/2 w-full`}
      >
        {isNewUser && (
          <div className='text-foreground w-[134px] mx-auto flex items-center justify-center gap-1 bg-accent-yellow-300 shadow-[inset_0px_-1px_8px_0px_#00000040] rounded-br-lg rounded-bl-lg px-2 sm:py-1.5 py-1 text-[10px]'>
            Expiring in:{' '}
            <span className='font-semibold'>{expiringDays} Days</span>{' '}
          </div>
        )}
        <h5
          className={`text-base sm:text-xl font-serif text-white text-center ${isNewUser ? 'mt-1.5 sm:mt-4' : 'sm:mt-0'}  pb-0  sm:pb-1`}
        >
          {title}
        </h5>
        <p className='text-[10px] sm:text-xs text-[var(--black4)] text-center'>
          {description}
        </p>
      </div>
    </div>
  );
}

export default LoyaltyExpiringCard;
