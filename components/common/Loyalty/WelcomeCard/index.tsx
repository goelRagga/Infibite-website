'use client';

import { Progress } from '@/components/ui/progress';
import ElicashIcon from '@/assets/elicashIcon.svg';
import { getTierConfig } from '@/lib/utils';
import Svg from '@/components/common/Shared/Svg';
import { formatToIndianShort } from '@/components/common/IndianRupees';
import useIsMobile from '@/hooks/useIsMobile';

interface WelcomeCardProps {
  loyaltyDetails: any;
  walletAmount: number;
  username?: string;
  nextTierThreshold: number;
  className?: string;
  style?: React.CSSProperties;
  minAmount: number;
}

export default function WelcomeCard({
  loyaltyDetails,
  walletAmount,
  username,
  nextTierThreshold,
  className,
  style,
  minAmount,
}: WelcomeCardProps) {
  const isMobile = useIsMobile();
  // Extract values from loyaltyDetails
  const currentSpend = loyaltyDetails?.amountSpentIn12Months || 0;

  const loyaltyTier =
    loyaltyDetails?.loyaltyTier?.metadata?.membershipTiers?.name || '';
  const nextTierName =
    loyaltyDetails?.nextLoyaltyTier?.metadata?.membershipTiers?.name;

  const tierData = getTierConfig(loyaltyTier);

  const progressPercentage = nextTierThreshold
    ? Math.min((currentSpend / nextTierThreshold) * 100, 100).toFixed(2)
    : '0.00';

  const maxTierAmount = loyaltyDetails?.nextLoyaltyTier?.minAmount ?? 1500000;

  // if nextTierName is null
  const amountNeededForNextTier = loyaltyDetails?.nextLoyaltyTier
    ? loyaltyDetails.amountNeededForNextTier
    : Math.max(0, maxTierAmount - loyaltyDetails?.amountSpentIn12Months);

  const lastTierMessage = 'to keep this tier';
  const nextTierText = nextTierName
    ? `away from ${nextTierName} Tier`
    : lastTierMessage;
  const lastMembershipTierMessage = 'keep this tier';

  return (
    <>
      <div
        className='h-[210px] w-[300px] blur-3xl absolute top-0 overflow-hidden left-0 opacity-10'
        style={{
          background: tierData?.profileCardBg,
        }}
      ></div>
      <div
        className={`rounded-2xl py-4 px-4 relative overflow-hidden ${className}`}
        style={style}
      >
        <div
          className='h-[210px] w-[266px] blur-3xl absolute top-0 overflow-hidden right-0 opacity-30'
          style={{
            background: tierData?.profileCardBg,
          }}
        ></div>
        <div className='p-0 flex flex-col justify-between h-full'>
          {/* Header Section */}
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-[17px] tracking-[0.6px] font-serif font-semibold text-[var(--prive4)]'>
                {'Welcome'} {username}!
              </h2>
              <div className='flex items-center gap-1 text-sm mt-1'>
                {walletAmount >= 0 && (
                  <>
                    <ElicashIcon className='h-3 w-3' />
                    <span className='text-secondary-950 text-xs font-semibold'>
                      {walletAmount}
                    </span>
                    <span className='mx-1'>•</span>
                  </>
                )}
                <span className='text-[var(--prive4)] text-xs tracking-[0.6px]'>
                  {loyaltyTier} Member
                </span>
              </div>
            </div>
            <div>
              <Svg
                src={tierData?.svg || ''}
                className='object-contain w-8 h-8'
              />
            </div>
          </div>

          <hr className='my-4 border border-[var(--grey12)]' />

          {/* Spend Info */}
          <div className='flex justify-between text-sm items-center'>
            <div className='flex-none w-[32%]'>
              <p className='text-[var(--prive4)] text-[11px] pb-1 tracking-[0.6px] font-normal'>
                {'Current Spends'}
              </p>
              <p className='text-xs font-medium text-secondary-950'>
                ₹ {currentSpend?.toLocaleString('en-IN') || 0}
              </p>
            </div>
            <div className='flex-none w-[60%] text-right'>
              <p className='text-[var(--prive4)] text-[11px] text-left tracking-[0.6px] font-normal'>
                {amountNeededForNextTier > 0 ? (
                  <>
                    {loyaltyTier?.toLowerCase() === 'diamond' ? (
                      <>
                        {isMobile ? '' : 'Spend'}{' '}
                        <span className='font-bold'>
                          <span className='mr-0.5'>₹</span>
                          {`${amountNeededForNextTier?.toLocaleString('en-IN')} `}
                        </span>
                        {'to '}
                        {`${lastMembershipTierMessage}`}
                      </>
                    ) : (
                      <>
                        <span className='font-bold'>
                          <span className='mr-0.5'>₹</span>
                          {amountNeededForNextTier?.toLocaleString('en-IN')}
                        </span>{' '}
                        {loyaltyDetails?.nextLoyaltyTier?.metadata
                          ?.membershipTiers?.name
                          ? `away from ${loyaltyDetails?.nextLoyaltyTier?.metadata?.membershipTiers?.name}`
                          : lastMembershipTierMessage}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Spend{' '}
                    <span className='font-bold'>
                      <span className='mr-0.5'>₹</span>
                      {`${formatToIndianShort(minAmount)}/ `}
                    </span>
                    {'year to '}
                    {`${lastMembershipTierMessage}`}
                  </>
                )}
              </p>

              <Progress
                value={parseFloat(progressPercentage)}
                className='h-[5px] rounded-full drop-shadow-[var(--black7)] mt-2 mb-2'
                style={{
                  backgroundColor: tierData?.progresscolor,
                  boxShadow: '0px 4px 4px 0px #00000040',
                }}
                indicatorStyle={{
                  background: `var(--black10)`,
                }}
              />
              <div className='flex justify-between text-xs mt-1'>
                <span className='text-[11px] text-[var(--prive4)] tracking-[0.6px] font-normal'>
                  {loyaltyTier}
                </span>
                <span className='text-[11px] text-[var(--prive4)] tracking-[0.6px] font-normal'>
                  {nextTierName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
