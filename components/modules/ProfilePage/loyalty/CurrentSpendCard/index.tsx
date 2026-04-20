'use client';
import { Progress } from '@/components/ui/progress';
import CustomImage from '@/components/common/CustomImage';
import { getTierConfig, Tier } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';
import { Button } from '@/components/ui';
import Svg from '@/components/common/Shared/Svg';

interface CurrentSpendsCardProps {
  username?: string;
  amountSpentIn12Months: number;
  tier?: string;
  period: string;
  nextTier: string;
  amountNeededForNextTier: number;
  maxTierAmount: number;
  loyaltyTier: Tier | string;
  svg?: string;
  className?: string;
  style?: React.CSSProperties;
  minAmount: number;
}

export default function CurrentSpendsCard({
  username,
  amountSpentIn12Months,
  period,
  tier,
  nextTier,
  amountNeededForNextTier,
  maxTierAmount,
  loyaltyTier,
  className = '',
  style,
  minAmount,
}: CurrentSpendsCardProps) {
  const tierData = getTierConfig(loyaltyTier);
  const isMobile = useIsMobile();

  const progressPercentage = Math.min(
    (amountSpentIn12Months / maxTierAmount) * 100,
    100
  ).toFixed(2);

  const currentSpends = 'Current Spends';
  const lastMembershipTierMessage = 'to keep this membership';
  const toKeepThisTier = 'year to keep this tier';

  return (
    <div
      className={`rounded-2xl p-6 md:p-6 border-[var(--black4)] relative overflow-hidden ${className}`}
      style={style}
    >
      <div
        className='h-[210px] w-[500px] blur-3xl absolute top-0 overflow-hidden right-0 opacity-90 -z-10'
        style={{
          background: tierData?.profileCardBg,
        }}
      ></div>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
        {!isMobile && (
          <div className='mb-6 lg:mb-0'>
            <h3 className='text-foreground mb-2 text-sm'>{currentSpends}</h3>
            <h4 className='text-xl font-semibold text-foreground'>
              {amountSpentIn12Months || amountSpentIn12Months == 0 ? (
                <>₹ {amountSpentIn12Months?.toLocaleString('en-IN')}</>
              ) : (
                0
              )}
            </h4>
            <p className='text-secondary-700 text-[10px]'>{period}</p>
          </div>
        )}

        <div className='flex justify-center lg:justify-end'>
          <Svg
            src={tierData?.svg || ''}
            className='object-contain w-20 h-20 z-50'
          />
        </div>
      </div>
      <div className='mt-13'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-secondary-900 text-xs font-normal'>
            {amountNeededForNextTier > 0 ? (
              <>
                You are{' '}
                <span className='font-bold'>
                  <span className='mr-0.5'>₹</span>
                  {amountNeededForNextTier?.toLocaleString('en-IN')}
                </span>{' '}
                {nextTier ? `away from ${nextTier}` : lastMembershipTierMessage}
              </>
            ) : (
              <>
                Spend{' '}
                <span className='font-bold'>
                  <span className='mr-0.5'>₹</span>
                  {minAmount?.toLocaleString('en-IN')}
                </span>
                {nextTier ? ` away from ${nextTier}` : `/ ${toKeepThisTier}`}
              </>
            )}
          </span>
          <span className='font-semibold text-secondary-700 text-xs z-10'>
            <span className='mr-0.5'>₹</span>
            {maxTierAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <Progress
          value={parseFloat(progressPercentage)}
          className='h-3 rounded-full drop-shadow-[var(--black7)] mt-2 mb-2'
          style={{
            backgroundColor: tierData?.progresscolor,
            boxShadow: '0px 4px 4px 0px #00000040',
          }}
          indicatorStyle={{
            background: `var(--black10)`,
          }}
        />
        <p className='flex justify-between items-center'>
          {loyaltyTier?.toLowerCase() !== 'diamond' && (
            <span className='text-xs text-secondary-900 font-normal'>
              {loyaltyTier}
            </span>
          )}
          <span className='text-xs text-secondary-900 font-normal'>
            {nextTier}
          </span>
        </p>
      </div>
    </div>
  );
}
