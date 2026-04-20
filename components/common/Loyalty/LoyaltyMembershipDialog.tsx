import { Button } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { KEY_VALUE_KEYS, LOYALTY_CAPTION } from '@/lib/constants';
import { getKeyValueData } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResponsiveDialogDrawer from '../ResponsiveDialogDrawer';
import { trackEvent } from '@/lib/mixpanel';
import { useUserContext } from '@/contexts/SharedProvider';

interface LoyaltyMembershipDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const LoyaltyMembershipDialog = ({
  isModalOpen,
  setIsModalOpen,
}: LoyaltyMembershipDialogProps) => {
  const router = useRouter();
  const { loyaltyTierDetails } = useWallet();
  const [expiringCardContent, setExpiringCardContent] = useState<{
    validationDate?: string;
  } | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    getKeyValueData<{
      loyaltyExpiringCardContent?: { validationDate?: string };
    }>(KEY_VALUE_KEYS.LOYALTY_EXPIRING_CARD_CONTENT).then((data) => {
      setExpiringCardContent(data?.loyaltyExpiringCardContent ?? null);
    });
  }, [isModalOpen]);

  const memberTierName =
    loyaltyTierDetails?.loyaltyTier?.metadata?.membershipTiers?.name || 'Blue';

  const memberTierIcon =
    loyaltyTierDetails?.loyaltyTier?.metadata?.membershipTiers?.icon;

  const { userData } = useUserContext();

  const newUserIntentPhone =
    userData?.firstLoginIntent === 'phone' &&
    !(userData.firstName || userData.email);

  const newUserIntentGoogle =
    userData?.firstLoginIntent === 'email' && !userData.phone;

  const isNewUser = newUserIntentPhone || newUserIntentGoogle;

  if (!memberTierName) {
    return null;
  }

  const handleExploreBenefits = () => {
    setIsModalOpen(false);
    router.push('/account/loyalty');
  };

  return (
    <ResponsiveDialogDrawer
      contentClassName='w-full lg:max-w-[440px] dark:border-[var(--primary-800)] overflow-hidden max-h-[72dvh]!'
      open={isModalOpen}
      setOpen={setIsModalOpen}
    >
      {isNewUser && (
        <div className=''>
          <div className='border relative flex flex-col items-center justify-center border-secondary-50 dark:border-primary-800 rounded-2xl px-4 py-6 w-full shadow-[inset_0_1px_12px_0_#C8E7F8] dark:shadow-none'>
            <Image
              src={
                memberTierIcon ||
                `${process.env.IMAGE_DOMAIN}/blue_91b25f69c1.svg`
              }
              alt='Member Badge'
              width={70}
              height={70}
              className='w-17 h-17'
            />

            <p className='text-foreground text-sm text-center font-serif mb-6 mt-2'>
              You’re Now a Blue Member
            </p>

            <div className='absolute -bottom-5 -translate-x-1/2 left-1/2 w-[170px] flex items-center gap-1 justify-center items-center border border-secondary-50 dark:border-primary-800 dark:bg-[var(--prive-background)] shadow-[0_0_0_2px_#FFFFFF,0_6px_24px_0_#4C4C4C14] dark:shadow-none rounded-full px-2 py-2 overflow-hidden'>
              <Image
                src={`${process.env.IMAGE_DOMAIN}/elicash_6c6daab0d2.svg`}
                width='16'
                height='16'
                alt='EliCash'
                typeof='image/svg+xml'
              />
              <p className='text-xs text-foreground'>
                <span className='text-primary-800 dark:text-[var(--accent-text)] font-semibold'>
                  2000 EliCash
                </span>{' '}
                earned{' '}
              </p>
            </div>
          </div>

          <p className='text-xs text-[var(--orange9)] flex items-center gap-1 mt-13 justify-center'>
            <Image
              src={`${process.env.IMAGE_DOMAIN}/star_e5eeda5ac2.svg`}
              width='6'
              height='6'
              typeof='image/svg+xml'
              alt='Star'
            />
            Valid on first booking till {expiringCardContent?.validationDate}{' '}
            <Image
              src={`${process.env.IMAGE_DOMAIN}/star_e5eeda5ac2.svg`}
              width='6'
              height='6'
              typeof='image/svg+xml'
              alt='Star'
            />
          </p>
        </div>
      )}
      <div className='flex flex-col items-center justify-center py-4 px-6 text-center relative'>
        <h2 className='md:text-2xl text-xl font-base font-serif text-gray-900 dark:text-white mb-4'>
          {isNewUser
            ? 'Enjoy your Blue Member Benefits'
            : `You're Now a ${memberTierName} Member`}
        </h2>

        <p className='text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-8 max-w-sm'>
          {isNewUser
            ? 'Enjoy exclusive offers, priority benefits, curated experiences, and member-only pricing.'
            : `You're officially a ${memberTierName} Member! ${LOYALTY_CAPTION}`}
        </p>

        <Button
          variant='outline'
          className='w-full max-w-xs bg-[var(--grey9)] dark:bg-[var(--accent-background)] dark:text-white text-white hover:bg-gray-900 hover:text-white border-0 py-6 text-base font-medium rounded-full'
          onClick={handleExploreBenefits}
        >
          Explore Benefits
        </Button>
      </div>
    </ResponsiveDialogDrawer>
  );
};

export default LoyaltyMembershipDialog;
