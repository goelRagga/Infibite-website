'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

import CommonBalanceSection from '@/components/modules/ProfilePage/Wallet/Common/CommonBalanceSection';
import CurrentSpendsCard from '@/components/modules/ProfilePage/loyalty/CurrentSpendCard';
import useIsMobile from '@/hooks/useIsMobile';

import ElicashIcon from '@/assets/elicash.svg';
import { CarouselTemplate } from '@/components/common/Carousel';
import HeaderWithIcon from '@/components/common/HeaderWithIcon/HeaderWithIcon';

import ScrollData from '@/components/common/ScrollData';
import { useUserContext } from '@/contexts/SharedProvider';
import { useLoyaltyOptIn } from '@/hooks/useLoyaltyOptIn';
import { getKeyValueData } from '@/lib/api';

import { KEY_VALUE_KEYS } from '@/lib/constants';
import { FETCH_ALL_LOYALTY_TIERS, GET_ACCOUNT } from '@/lib/loyaltyQueries';
import { getTierConfig } from '@/lib/utils';
import { LoyaltyFAQData } from 'api-types';
import Cookies from 'js-cookie';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WelcomeHeader from './WelcomeHeader';
import { Account, LoyaltyTierItem } from './data/type';
import WelcomeCard from '@/components/common/Loyalty/WelcomeCard';
import { Button } from '@/components/ui';
import { urqlLoyaltyClient } from '@/lib/client/unified-client-manager';

const ElicashCard = lazy(
  () => import('@/components/common/Loyalty/ElicashCard')
);
const EnhancedBenefitsSection = lazy(
  () =>
    import('@/components/modules/ProfilePage/loyalty/EnhancedBenefitsSection')
);

const FAQAccordion = lazy(
  () => import('@/components/modules/ProfilePage/loyalty/FAQSection')
);

const MembershipTierCard = lazy(
  () => import('@/components/modules/ProfilePage/loyalty/MembershipTierCard')
);

export default function LoyaltyDashboard() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { userData } = useUserContext();
  const { getUserIdFromCookie } = useLoyaltyOptIn();
  const userDataStr = Cookies.get('userData');
  let userId: string | null = null;
  let userName: string | null = null;
  let firstName: string | null = null;

  const [loyaltyFAQ, setLoyaltyFAQ] = useState<LoyaltyFAQData | null>(null);
  const [faqLoading, setFaqLoading] = useState(true);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const data = await getKeyValueData<LoyaltyFAQData>(
          KEY_VALUE_KEYS?.LOYALTY_FAQ
        );
        setLoyaltyFAQ(data);
      } catch (err) {
        console.error('Failed to fetch Loyalty FAQ:', err);
      } finally {
        setFaqLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  // Get user data from context first, then fallback to cookie
  if (userData?.id) {
    userId = userData.id;
    userName = userData.name || null;
    firstName = userData.firstName || null;
  } else if (userDataStr) {
    try {
      const parsedUserData = JSON.parse(userDataStr);
      userName = parsedUserData?.name || null;
      userId = parsedUserData?.id || null;
      firstName = parsedUserData?.firstName || null;
    } catch (err) {
      console.error('Failed to parse userData cookie:', err);
    }
  }

  // Final fallback to get userId from cookie using the hook
  if (!userId) {
    userId = getUserIdFromCookie();
  }

  const [loyaltyAccount, setLoyaltyAccount] = useState<Account | null>(null);
  const [allTiers, setAllTiers] = useState<LoyaltyTierItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeemClick = () => {
    console.log('Redeem clicked');
  };

  const handleLoyaltyQuery = async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const variables = { userId: userId, userType: 'GUEST' };

      // run both queries in parallel
      const [accountRes, tiersRes] = await Promise.all([
        urqlLoyaltyClient.query(GET_ACCOUNT, variables).toPromise(),
        urqlLoyaltyClient.query(FETCH_ALL_LOYALTY_TIERS, {}).toPromise(),
      ]);

      if (accountRes.error) {
        console.error('Loyalty query error:', accountRes?.error);
        setError('Failed to fetch loyalty account data. Please login!');
      } else {
        setLoyaltyAccount(accountRes?.data?.account);
      }

      if (tiersRes.error) {
        console.error('Fetch tiers query error:', tiersRes?.error);
        setError('Failed to fetch loyalty tiers.');
      } else {
        setAllTiers(tiersRes?.data?.fetchAllLoyaltyTier || []);
      }
    } catch (err) {
      console.error('Unexpected error during loyalty query:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger loyalty query when userId is available
  useEffect(() => {
    if (userId) {
      handleLoyaltyQuery();
    }
  }, [userId]);

  if (isLoading) return <div className='p-6'>Loading loyalty data...</div>;
  if (error)
    return (
      <div className='p-6 text-red-600'>
        <p>{error}</p>
      </div>
    );
  if (!loyaltyAccount)
    return (
      <div className='p-6'>
        <p>No loyalty account data available</p>
      </div>
    );

  const { loyaltyDetails, wallet } = loyaltyAccount;

  const nextTierName =
    loyaltyDetails?.nextLoyaltyTier?.metadata?.membershipTiers?.name || null;

  const maxTierAmount = loyaltyDetails?.nextLoyaltyTier?.minAmount ?? 1500000;

  // if nextTierName is null
  const amountNeededForNextTier = loyaltyDetails?.nextLoyaltyTier
    ? loyaltyDetails.amountNeededForNextTier
    : Math.max(0, maxTierAmount - loyaltyDetails?.amountSpentIn12Months);

  const lastTierMessage = 'to keep this tier';

  const tierName = loyaltyDetails?.loyaltyTier?.metadata?.membershipTiers?.name;
  const tierConfig = getTierConfig(tierName);

  return (
    <div className='w-full min-h-screen rounded-2xl'>
      {!isMobile ? (
        <WelcomeHeader
          userName={firstName || 'Guest'}
          membershipTier={loyaltyDetails?.loyaltyTier?.name}
          className='mb-4'
        />
      ) : (
        <div className='items-center justify-between p-4'>
          <HeaderWithIcon
            isShare={true}
            icon={<ArrowLeft className='text-black !h-6 !w-6 ' />}
            title=''
            onIconClick={() => router.back()}
            titleClassName='text-[var(--secondary-950)] text-2xl font-dm-serif typography-title-regular md:mb-6 w-full text-center md:text-left'
            onclick={handleRedeemClick}
          />
        </div>
      )}

      <div className='md:grid md:grid-cols-3 md:gap-6 md:mb-6 mb-0'>
        {!isMobile ? (
          <div className='md:col-span-2 mb-6 md:mb-0'>
            <CurrentSpendsCard
              style={{
                background: tierConfig?.fullGradient,
              }}
              amountSpentIn12Months={loyaltyDetails?.amountSpentIn12Months}
              period={'Last 12 months'}
              nextTier={nextTierName || ''}
              amountNeededForNextTier={amountNeededForNextTier}
              maxTierAmount={maxTierAmount}
              loyaltyTier={
                loyaltyDetails?.loyaltyTier?.metadata?.membershipTiers?.name ||
                ''
              }
              svg={loyaltyDetails?.loyaltyTier?.metadata?.icon || ''}
              minAmount={loyaltyDetails?.loyaltyTier?.minAmount || 0}
            />
          </div>
        ) : (
          <div className='mb-2 md:mb-0 mx-4'>
            <WelcomeCard
              style={{
                background: tierConfig?.fullGradient,
              }}
              loyaltyDetails={loyaltyDetails}
              walletAmount={wallet?.amount}
              username={firstName || 'Guest'}
              nextTierThreshold={maxTierAmount}
              minAmount={loyaltyDetails?.loyaltyTier?.minAmount || 0}
            />
          </div>
        )}

        {!isMobile ? (
          <CommonBalanceSection
            titleClassName='text-white typography-label-regular'
            balanceClassName='text-white typography-h3'
            balance={wallet?.amount}
            ButtonClassName='border border-accent-red-900 text-xs w-[113px] text-[var(--red3)] font-semibold rounded-full px-4 py-2 md:py-2.5 bg-white'
            description={{
              className: 'text-sm md:text-base',
              iconClassname: 'w-4 h-4',
              Secondiconclassname: 'w-4 h-4',
              text: (
                <>
                  <span className='flex text-xs text-[var(--black11)] items-center gap-1 px-4 py-2'>
                    Get
                    <span className='font-bold'>
                      ₹{' '}
                      {
                        loyaltyDetails?.loyaltyTier?.rewardRule?.rewardPoints
                      }{' '}
                    </span>{' '}
                    for every
                    <span className='font-bold'>
                      ₹ {loyaltyDetails?.loyaltyTier?.rewardRule?.amountSpent}
                    </span>{' '}
                    spent
                  </span>
                </>
              ),
            }}
            ButtonText='Book Now'
            onRedeemClick={handleRedeemClick}
            className='bg-[var(--grey14)] px-10 py-4 rounded-2xl text-white'
          />
        ) : (
          <ElicashCard
            elicash={{
              balance: wallet?.amount,
              exchangeRate: {
                earn: loyaltyDetails?.loyaltyTier?.rewardRule?.rewardPoints,
                spend: loyaltyDetails?.loyaltyTier?.rewardRule?.amountSpent,
              },
            }}
          />
        )}
      </div>

      {/* Benefits */}
      <div className='md:mb-8 mb-0 md:p-0 p-4'>
        <Suspense
          fallback={
            <div className='w-full flex justify-center items-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
            </div>
          }
        >
          <EnhancedBenefitsSection
            benefits={loyaltyDetails?.loyaltyTier?.benefits}
            nextTierBenefits={loyaltyDetails?.nextLoyaltyTier?.benefits}
            amountNeededForNextTier={loyaltyDetails?.amountNeededForNextTier}
            nextTierName={nextTierName || undefined}
          />
        </Suspense>
      </div>

      {/* Membership Tiers */}
      <div className='md:p-0 p-4'>
        <div className='sm:mb-4 mb-0 bg-[var(--primary-10)] rounded-2xl py-4 px-4'>
          {isMobile ? (
            <>
              <h2 className='text-foreground typography-title-regular font-serif mb-4'>
                {'Level Up with Every Stay'}
              </h2>

              <ScrollData
                className='items-stretch'
                itemClassName='md:w-[37%] lg:w-[27%] xl:w-[23.7%] w-[100%] overflow-hidden flex rounded-[20px]'
                gap='gap-3 md:gap-6'
              >
                {allTiers.map((item: LoyaltyTierItem) => (
                  <Suspense
                    key={item.id}
                    fallback={
                      <div className='w-full flex justify-center items-center py-8'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                      </div>
                    }
                  >
                    <MembershipTierCard
                      key={item?.id}
                      name={item?.metadata?.membershipTiers?.name}
                      subtitle={item?.metadata?.membershipTiers?.subtitle}
                      color={item?.metadata?.membershipTiers?.color}
                      icon={item?.metadata?.membershipTiers?.icon}
                      benefits={item?.metadata?.membershipTiers?.benefits}
                      className='text-white h-full w-full rounded-[20px]'
                    />
                  </Suspense>
                ))}
              </ScrollData>
            </>
          ) : (
            <CarouselTemplate
              heading='Level Up With Every Stay'
              items={allTiers}
              className='overflow-hidden rounded-[20px]'
              slidesPerView={isMobile ? 1.12 : 1.98}
              showArrows
              renderItem={(item: LoyaltyTierItem) => (
                <Suspense
                  key={item.id}
                  fallback={
                    <div className='w-full flex justify-center items-center py-8'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                    </div>
                  }
                >
                  <MembershipTierCard
                    key={item?.id}
                    name={item?.metadata?.membershipTiers?.name}
                    subtitle={item?.metadata?.membershipTiers?.subtitle}
                    color={item?.metadata?.membershipTiers?.color}
                    icon={item?.metadata?.membershipTiers?.icon}
                    benefits={item?.metadata?.membershipTiers?.benefits}
                    className='text-white h-full rounded-[20px]'
                  />
                </Suspense>
              )}
            />
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className='p-4 md:p-0'>
        {!faqLoading && loyaltyFAQ?.LoyaltyFAQ && (
          <Suspense
            fallback={
              <div className='w-full flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
              </div>
            }
          >
            <FAQAccordion
              title={loyaltyFAQ?.LoyaltyFAQ?.title}
              questions={loyaltyFAQ?.LoyaltyFAQ?.data?.faq?.map(
                (item: { id: string; question: string; answer: string }) => ({
                  key: item?.id,
                  id: item?.id,
                  question: item?.question,
                  answer: item?.answer,
                })
              )}
              className='bg-[var(--primary-10)] rounded-2xl p-4 md:p-6'
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
