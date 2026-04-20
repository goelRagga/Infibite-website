import { LoyaltySectionHomeProps } from 'loyalty-section';
import { LOYALTY_HOME_PAGE_CONTENT } from '@/lib/constants';
import { getTierConfig, normalizeTier, Tier } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import { motion, Variants } from 'framer-motion';
import Svg from '@/components/common/Shared/Svg';
import { formatToIndianShort } from '@/components/common/IndianRupees';
import { trackEvent } from '@/lib/mixpanel';

const LoyaltySectionHomeLoggedIn: React.FC<LoyaltySectionHomeProps> = ({
  data,
  title,
  isHome = true,
  className,
  pageName,
  verticalPosition,
}) => {
  const isMobile = useIsMobile();
  const { LoggedIn, congratulations } = LOYALTY_HOME_PAGE_CONTENT;

  const currentSpend = data?.amountSpentIn12Months || 0;

  const tierName =
    (data?.loyaltyTier as any)?.metadata?.membershipTiers?.name || '';
  const normalizedTier = normalizeTier(tierName) as Tier;
  const tierData = getTierConfig(normalizedTier);

  // Get next tier data from API
  const nextTierData = data?.nextLoyaltyTier;
  const nextTierName =
    (nextTierData?.metadata as any)?.membershipTiers?.name || null;
  const capitalize = (value: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  // Calculate next tier display name
  const tierOrder: Tier[] = [
    'blue',
    'silver',
    'gold',
    'diamond',
    'Reserve Plus',
  ];
  const nextTierRaw = (() => {
    const index = tierOrder.indexOf(normalizedTier as Tier);
    if (index === -1) return 'silver';
    return tierOrder[index + 1] || '';
  })();
  const displayNextTierName = nextTierName
    ? capitalize(nextTierName)
    : nextTierRaw
      ? capitalize(nextTierRaw)
      : '';

  // For Diamond tier, calculate amount needed to maintain tier (1500000)
  const amountNeededForNextTier =
    normalizedTier === 'diamond'
      ? Math.max(0, 1500000 - currentSpend)
      : (data?.amountNeededForNextTier ?? 0);

  // For Diamond tier, always use 1500000 as max amount to maintain the tier
  const maxTierAmount =
    normalizedTier === 'diamond'
      ? 1500000
      : (nextTierData?.minAmount ??
        (amountNeededForNextTier > 0
          ? currentSpend + amountNeededForNextTier
          : (data?.loyaltyTier?.minAmount ?? 1500000)));

  const progressPercentage = maxTierAmount
    ? Math.min((currentSpend / maxTierAmount) * 100, 100).toFixed(2)
    : '0.00';

  const cardSlideVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const handleLoyaltyWidgetClick = () => {
    trackEvent('Loyalty_widget_clicked', {
      page_name: pageName,
      vertical_position: isHome ? 4 : 5,
    });
  };

  const handleLoyaltyClick = () => {
    trackEvent('Loyalty_benefits_clicked', {
      page_name: pageName,
      vertical_position: isHome ? 4 : 5,
    });
  };

  return (
    <div
      className={`${verticalPosition && `vertical-position-${verticalPosition}`} ${className ? className : 'bg-[var(--prive4)] px-[30px] py-10'}`}
    >
      {data ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-between'>
          <motion.div
            className='flex flex-col items-center space-y-6 max-w-130'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={cardSlideVariants}
            onClick={handleLoyaltyWidgetClick}
          >
            {isMobile && (
              <>
                <h3 className='text-2xl tracking-widest text-[var(--prive8)] font-serif -mt-4 mb-6'>
                  {congratulations}
                </h3>
              </>
            )}

            <div
              className='rounded-[20px] p-[3px]'
              style={{
                background: tierData?.membershipTierBorder,
                boxShadow: tierData?.membershipBoxShadow,
              }}
            >
              <div className='bg-[var(--prive4)] rounded-[18px] py-4 px-4 md:p-6'>
                <div className='flex justify-end items-start -mb-4 md:mb-10'>
                  <div
                    className={`flex-none leading-tight ${isHome ? 'w-8/12 md:w-7/12' : 'w-8/12 md:w-9/12'}`}
                  >
                    {!isMobile && (
                      <p
                        className={`${isHome ? 'text-3xl' : 'text-[32px]'} text-left font-normal text-[var(--prive8)] font-serif mb-4`}
                      >
                        {congratulations}
                      </p>
                    )}

                    <p
                      className={`${isHome ? 'text-xs md:text-xl' : 'text-sm md:text-[18px]'} font-normal text-left text-[var(--prive8)]`}
                    >
                      You are a{' '}
                      <span
                        className={`bg-clip-text text-transparent ${isHome ? 'text-base md:text-2xl' : 'text-[16px] md:text-[22px]'} font-bold tracking-[0.6px] font-serif`}
                        style={{
                          backgroundImage: `linear-gradient(270deg, ${tierData?.textGradient?.from}, ${tierData?.textGradient?.to})`,
                        }}
                      >
                        {tierName ? tierName : LoggedIn?.defaultMember} Member
                      </span>{' '}
                      of{' '}
                      <span
                        className={`tracking-[2.5px] ${isHome ? 'text-base md:text-xl leading-6 md:leading-10' : 'text-base md:text-[20px] leading-6 md:leading-8'}`}
                      >
                        {LoggedIn?.elivaasLoyalty}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`flex-none ${isHome ? 'w-4/12 md:w-5/12' : 'w-4/12 md:w-3/12'} flex justify-end`}
                  >
                    <div>
                      <Svg
                        src={tierData?.svg || ''}
                        className='object-contain w-14 md:w-20 h-14 md:h-20'
                      />
                    </div>
                  </div>
                </div>
                {isMobile && (
                  <div className='text-left'>
                    <Link
                      href='/account/loyalty'
                      target={isMobile ? '' : '_blank'}
                    >
                      <button
                        className={`mb-4 mt-8 cursor-pointer text-[#2C1F1E] text-xs font-semibold  px-4 h-8 rounded-full hover:bg-gray-100 transition-colors`}
                        style={{
                          background: ` ${tierData?.ctaBg}`,
                        }}
                      >
                        {LoggedIn?.ctaName}
                      </button>
                    </Link>
                  </div>
                )}

                {/* Progress Bar */}
                <div className='w-full mt-0 md:mt-4'>
                  <p
                    className={`mt-3 text-[var(--prive8)] font-normal tracking-[0.6px] ${
                      isHome
                        ? 'text-left text-xs md:text-base'
                        : 'text-left text-xs md:text-sm'
                    } pb-0 md:pb-1`}
                  >
                    {amountNeededForNextTier > 0 ? (
                      <>
                        {normalizedTier?.toLowerCase() === 'diamond' ? (
                          <>
                            {'Spend'}{' '}
                            <span className='font-semibold'>
                              ₹{' '}
                              {amountNeededForNextTier.toLocaleString('en-IN')}
                            </span>
                            {'/ year to ' + LoggedIn?.keepThisTier}
                          </>
                        ) : amountNeededForNextTier > 0 ? (
                          <>
                            {isMobile ? '' : 'You are'}{' '}
                            <span className='font-semibold'>
                              ₹{' '}
                              {amountNeededForNextTier.toLocaleString('en-IN')}
                            </span>{' '}
                            {nextTierData
                              ? `to ${LoggedIn?.keepThisTier}`
                              : `away from ${displayNextTierName} Tier`}
                          </>
                        ) : (
                          <>{`to ${LoggedIn?.keepThisTier}`}</>
                        )}
                      </>
                    ) : (
                      <>
                        {'Spend'}{' '}
                        <span className='font-semibold'>
                          ₹{' '}
                          {isMobile
                            ? formatToIndianShort(data?.loyaltyTier?.minAmount)
                            : data?.loyaltyTier?.minAmount?.toLocaleString(
                                'en-IN'
                              )}
                        </span>
                        {'/ year to ' + LoggedIn?.keepThisTier}
                      </>
                    )}
                  </p>

                  <Progress
                    value={parseFloat(progressPercentage)}
                    className='h-1 md:h-2 rounded-full drop-shadow-[var(--black7)] mt-1 mb-1'
                    style={{
                      backgroundColor: tierData?.progresscolor,
                      boxShadow: '0px 4px 4px 0px #00000040',
                    }}
                    indicatorStyle={{
                      background: `var(--black10)`,
                    }}
                  />

                  <div className='flex justify-between text-xs mt-1'>
                    {tierName && tierName != 'Diamond' && (
                      <span
                        className={`${isHome ? 'text-[11px]' : 'text-[11px] md:text-xs'} font-normal tracking-[0.6px] md:text-base text-[var(--prive8)]`}
                      >
                        {tierName}
                      </span>
                    )}
                    {displayNextTierName && (
                      <span
                        className={`${isHome ? 'text-[11px]' : 'text-[11px] md:text-xs'} font-normal tracking-[0.6px] md:text-base text-[var(--prive8)]`}
                      >
                        {displayNextTierName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {!isMobile && (
            <div className='text-center md:text-left'>
              <p
                className={`text-secondary-400 ${isHome ? 'text-xs md:text-base' : 'text-xs md:text-sm'}  mb-6 max-w-xl font-normal`}
              >
                {isMobile ? LoggedIn?.mobileContent : LoggedIn?.webConteht}
              </p>
              <Link href='/account/loyalty' target={isMobile ? '' : '_blank'}>
                <button
                  className={`cursor-pointer text-[#2C1F1E] text-sm font-semibold py-3 px-6 h-12 rounded-full hover:bg-gray-100 transition-colors`}
                  style={{
                    background: `${tierData?.ctaBg}`,
                  }}
                  onClick={handleLoyaltyClick}
                >
                  {LoggedIn?.ctaName}
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className='text-white'>No Data...</div>
      )}
    </div>
  );
};

export default LoyaltySectionHomeLoggedIn;
