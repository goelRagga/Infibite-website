'use client';

import ElicashIcon from '@/assets/elicash.svg';
import ElicashApplied from '@/assets/elicash1.svg';
import { Checkbox } from '@/components/ui/checkbox';
import { useURLParams } from '@/hooks/useURLParams';
import { useWallet } from '@/hooks/useWallet';

import {
  APPLY_WALLET_MONEY,
  GET_WALLET_APPLICABLE_AMOUNT,
  REMOVE_WALLET_MONEY,
} from '@/lib/loyaltyQueries';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { ChevronRight, Info } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ResponsiveDialogDrawer from './ResponsiveDialogDrawer';
import { WALLET_STATUS } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { urqlLoyaltyClient } from '@/lib/client/unified-client-manager';

interface ElicashCardProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  type: 'beforeApply' | 'afterApply' | 'pdp';
  balance?: number;
  quoteId?: string;
  userType?: 'GUEST' | 'MEMBER';
  onWalletActionComplete?: () => void | Promise<void>;
  priceData?: any;
  quoteIdUpdated?: boolean;
}

export default function ElicashPaymentCard({
  balance: propBalance,
  checked,
  onChange,
  type,
  quoteId,
  userType = 'GUEST',
  priceData,
  quoteIdUpdated = false,
  onWalletActionComplete,
}: ElicashCardProps) {
  const [open, setOpen] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const searchParams = useSearchParams();
  const { removeParams, setParams } = useURLParams();
  const walletParam = searchParams.get('wallet');
  const hasProcessedInitialSync = useRef(false);

  const { wallet, loyaltyTierDetails } = useWallet();
  const walletAmount = wallet?.amount.toLocaleString('en-IN') ?? 0;

  const accessToken = Cookies.get('accessToken');
  const userData = Cookies.get('userData');
  const userId = userData ? JSON.parse(userData)?.id : null;
  const prevQuoteIdRef = useRef<string | undefined>(quoteId);
  const walletMoney = wallet?.amount ?? 0;
  const balance = propBalance ?? walletAmount;

  const isBeforeApply = type === 'beforeApply' || type === 'pdp';
  const isPdp = type === 'pdp';

  const isDisabled = walletMoney === 0 || balance === 0 || isWalletLoading;

  const [applicableData, setApplicableData] = useState<number>(0);
  const [applicableFetching, setApplicableFetching] = useState(false);
  const usableBalance = applicableData.toLocaleString('en-IN') ?? 0;

  const syncElicashState = async (forceApply = false) => {
    if (!quoteId || !userId || !accessToken) return;

    const walletParamExists = walletParam === 'true';
    const currentlyChecked = checked;
    const walletAmountUsed = priceData?.WalletAmountUsed ?? 0;
    const hasWalletAmountUsed = walletAmountUsed > 0;

    if (hasWalletAmountUsed && !currentlyChecked) {
      onChange(true);
      if (!walletParamExists) {
        setParams({ wallet: 'true' });
      }
      return;
    }

    if (currentlyChecked && !hasWalletAmountUsed && !walletParamExists) {
      onChange(false);
      return;
    }

    if (walletParamExists && !hasWalletAmountUsed && !isWalletLoading) {
      await handleWalletToggle(true, false);
      return;
    }

    // if (forceApply && !hasWalletAmountUsed && !isWalletLoading) {
    //   await handleWalletToggle(true, false);
    //   return;
    // }
  };

  useEffect(() => {
    const handleQuoteChange = async () => {
      const walletAmountUsed = priceData?.WalletAmountUsed ?? 0;
      const hasWalletAmountUsed = walletAmountUsed > 0;

      if (
        quoteIdUpdated &&
        userId &&
        accessToken &&
        isInitialized &&
        hasWalletAmountUsed
      ) {
        try {
          setIsWalletLoading(true);

          const result = await urqlLoyaltyClient
            .query(
              REMOVE_WALLET_MONEY,
              {
                quoteId: prevQuoteIdRef.current,
                userId,
                userType,
              },
              {
                requestPolicy: 'network-only',
                fetchOptions: {
                  headers: {
                    authorization: `Bearer ${accessToken}`,
                  },
                },
              }
            )
            .toPromise();

          if (result.error) {
            console.error(
              'Error removing wallet money on quote change:',
              result.error
            );
          }

          onChange(false);

          removeParams(['wallet']);

          if (onWalletActionComplete) {
            await onWalletActionComplete();
          }
        } catch (error) {
          console.error(
            'Failed to remove wallet money on quote change:',
            error
          );
          onChange(false);
          removeParams(['wallet']);
        } finally {
          setIsWalletLoading(false);
        }
      }

      prevQuoteIdRef.current = quoteId;

      if (prevQuoteIdRef.current !== quoteId) {
        hasProcessedInitialSync.current = false;
        setIsInitialized(false);
      }
    };

    handleQuoteChange();
  }, [quoteId, userId, accessToken, quoteIdUpdated]);

  useEffect(() => {
    if (walletParam && (!accessToken || !userId)) {
      removeParams(['wallet']);
    }
  }, [walletParam, accessToken, userId]);

  useEffect(() => {
    if (
      !quoteId ||
      !userId ||
      !accessToken ||
      hasProcessedInitialSync.current ||
      !quoteIdUpdated
    ) {
      return;
    }

    const initializeState = async () => {
      hasProcessedInitialSync.current = true;
      setIsInitialized(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      await syncElicashState(walletParam === 'true');
    };

    initializeState();
  }, [quoteId, userId, accessToken, quoteIdUpdated]);

  useEffect(() => {
    if (!open || !quoteId || !userId) return;

    setApplicableFetching(true);

    urqlLoyaltyClient
      .query(
        GET_WALLET_APPLICABLE_AMOUNT,
        {
          quoteId,
          userId,
          userType: 'GUEST',
        },
        {
          fetchOptions: {
            headers: {
              ...(accessToken && { authorization: `Bearer ${accessToken}` }),
            },
          },
        }
      )
      .toPromise()
      .then((res) => {
        setApplicableData(res.data?.walletApplicableAmount ?? 0);
      })
      .catch((err) => {
        console.error('Error fetching usable balance', err);
      })
      .finally(() => {
        setApplicableFetching(false);
      });
  }, [open, quoteId, userId, accessToken]);

  if ((type === 'beforeApply' || type === 'pdp') && !accessToken) {
    return null;
  }

  const handleWalletToggle = async (
    isChecked: boolean,
    updateParams = true
  ) => {
    if (!quoteId || !userId || !quoteIdUpdated) {
      return;
    }

    setIsWalletLoading(true);

    try {
      const query = isChecked ? APPLY_WALLET_MONEY : REMOVE_WALLET_MONEY;
      const operation = isChecked ? 'apply' : 'remove';

      const result = await urqlLoyaltyClient
        .query(
          query,
          {
            quoteId,
            userId,
            userType,
          },
          {
            requestPolicy: 'network-only',
            fetchOptions: {
              headers: {
                ...(accessToken && { authorization: `Bearer ${accessToken}` }),
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      const responseData = isChecked
        ? result.data?.applyWalletMoney
        : result.data?.removeWalletMoney;

      if (responseData?.success) {
        onChange(isChecked);

        if (updateParams) {
          if (isChecked) {
            setParams({ wallet: 'true' });
            trackEvent('apply_wallet_money_success');
          } else {
            removeParams(['wallet']);
            trackEvent('remove_wallet_money_success');
          }
        }

        if (onWalletActionComplete) {
          await onWalletActionComplete();
        }
      } else {
        const errorMessage =
          responseData?.message || `Failed to ${operation} wallet money`;
        toast.error(errorMessage);

        if (isChecked) {
          onChange(false);
          if (updateParams) {
            removeParams(['wallet']);
          }

          if (onWalletActionComplete) {
            await onWalletActionComplete();
          }
        }
        return;
      }
    } catch (error: any) {
      console.error(
        `Error ${isChecked ? 'applying' : 'removing'} wallet money:`,
        error
      );

      toast.error(
        error.message ||
          `Failed to ${isChecked ? 'apply' : 'remove'} wallet money`
      );

      if (isChecked) {
        onChange(false);
        if (updateParams) {
          removeParams(['wallet']);
        }

        if (onWalletActionComplete) {
          await onWalletActionComplete();
        }
      }
    } finally {
      setIsWalletLoading(false);
    }
  };

  const handleManualToggle = async (value: boolean) => {
    if (isDisabled) return;

    const walletAmountUsed = priceData?.WalletAmountUsed ?? 0;
    const hasWalletAmountUsed = walletAmountUsed > 0;

    if (!value && hasWalletAmountUsed) {
      await handleWalletToggle(false);
      return;
    }

    if (value && !hasWalletAmountUsed) {
      await handleWalletToggle(true);
      return;
    }

    await handleWalletToggle(value);
  };

  const expiredDate = wallet?.firstExpiryTransaction?.status;

  const ShineOverlay = () => (
    <motion.div
      initial={{ x: '-120%' }}
      animate={{ x: '180%' }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className='absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-20'
    />
  );

  return (
    <div>
      {isBeforeApply ? (
        <div
          className='
        flex items-center justify-between w-full rounded-2xl
        border border-[var(--border-light)]
        bg-gradient-to-r from-[var(--bg-cream-light)] to-[var(--bg-cream-lighter)]
        px-4 py-3 shadow-none
        dark:border-[var(--prive6)]
        dark:bg-[conic-gradient(from_205.62deg_at_75.98%_-9.86%,_#2C2107_-77.63deg,_#151515_69.09deg,_#151515_203.95deg,_#312302_204.31deg,_#2C2107_282.37deg,_#151515_429.09deg)]
      '
        >
          <label className='flex items-center gap-3 cursor-pointer'>
            {!isPdp && (
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => handleManualToggle(!!value)}
                disabled={isDisabled}
                className={`rounded transition-all duration-200 ${
                  isDisabled
                    ? 'data-[state=checked]:bg-gray-400! data-[state=checked]:border-gray-400! border-gray-400! opacity-50 cursor-not-allowed'
                    : 'data-[state=checked]:bg-[var(--brown-medium)]! data-[state=checked]:border-[var(--brown-medium)]! border-[var(--brown-medium)]! cursor-pointer'
                }`}
              />
            )}

            <div className='flex flex-col'>
              <span className='font-semibold text-[15px] text-[var(--text-dark)] dark:text-primary-100'>
                Pay using Elicash
              </span>

              <div className='flex items-center gap-1 text-sm text-[var(--brown-medium)] dark:text-primary-400'>
                <span>Remaining Balance:</span>
                <motion.div
                  className='flex items-center gap-1'
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: 0.2,
                  }}
                >
                  <motion.div
                    className='relative w-5 h-5 overflow-hidden rounded-full'
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 0.9 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeOut',
                      delay: 0.4,
                    }}
                  >
                    <ElicashIcon />
                    <ShineOverlay />
                  </motion.div>
                  <motion.span
                    className='font-semibold text-[var(--text-dark)] dark:text-[var(--prive2)]'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeOut',
                      delay: 0.6,
                    }}
                  >
                    {balance.toLocaleString()}
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </label>

          {!isPdp && walletMoney > 0 && (
            <Info
              className='h-6 w-6 fill-[var(--brown-dark)] dark:fill-[var(--prive8)] text-white dark:text-[var(--prive9)] cursor-pointer'
              onClick={() => setOpen(true)}
            />
          )}

          <ResponsiveDialogDrawer
            open={open}
            setOpen={setOpen}
            title='Using Elicash'
            contentClassName='md:max-w-[500px]! max-h-[40dvh]!'
          >
            <div className='space-y-4 '>
              <p className='text-sm text-[var(--text-dark)] dark:text-white'>
                As a{' '}
                <span className='font-semibold'>
                  {
                    loyaltyTierDetails?.loyaltyTier?.metadata?.membershipTiers
                      ?.name
                  }
                  Member
                </span>
                , you can use Elicash to pay up to{' '}
                <span className='font-semibold'>
                  {loyaltyTierDetails?.loyaltyTier?.redemptionCapability}%
                </span>{' '}
                of your booking amount.
              </p>

              <hr className='border-[var(--border-light)]' />

              <div className='flex justify-between items-center text-sm'>
                <span className='text-[var(--red-dark)] font-semibold dark:text-white'>
                  Total Elicash Balance
                </span>
                <div className='flex items-center gap-2'>
                  <div className='relative overflow-hidden'>
                    <ElicashIcon />
                  </div>
                  <span className='font-semibold text-[var(--text-dark)] dark:text-white'>
                    {walletAmount}
                  </span>
                </div>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <span className='text-[var(--red-dark)] font-semibold dark:text-white'>
                  Usable Balance for this booking
                </span>
                <div className='flex items-center gap-2'>
                  <div className='relative overflow-hidden'>
                    <ElicashIcon />
                  </div>
                  <span className='font-semibold text-[var(--text-dark)] dark:text-white'>
                    {usableBalance || 0}
                  </span>
                </div>
              </div>
            </div>
          </ResponsiveDialogDrawer>
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className='flex items-center justify-between w-full rounded-2xl bg-[var(--bg-cream-light)] px-4 py-4 cursor-pointer border border-[var(--border-light)] shadow-none dark:!bg-[var(--secondary-1000)] dark:border-secondary-950'
        >
          <div className='flex items-center gap-3'>
            <div className='relative overflow-hidden w-12 h-12'>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                whileInView={{
                  scale: [1, 1.3, 1],
                  transition: {
                    duration: 0.6,
                    ease: 'easeOut',
                    times: [0, 0.5, 1],
                  },
                }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ElicashApplied />
                <ShineOverlay />
              </motion.div>
            </div>

            <div className='flex flex-col w-full '>
              <span className='text-[var(--gold)] font-semibold text-base'>
                Congratulations
              </span>
              <div className='flex gap-1 items-center text-sm text-[var(--text-dark)] whitespace-nowrap'>
                <span className='text-[var(--brown-medium)] dark:text-white'>
                  You earned
                </span>
                <div className='relative overflow-hidden flex-shrink-0'>
                  <ElicashIcon />
                </div>

                <span className='font-semibold text-[var(--text-dark)] dark:text-white'>
                  {balance.toLocaleString()}
                </span>
                <span className='font-semibold dark:text-white '>Elicash</span>
              </div>
            </div>
          </div>

          <div className='text-[var(--red-dark)] text-2xl font-light dark:text-white'>
            <ChevronRight />
          </div>
        </div>
      )}

      {/* Post Dialog */}
      {!isBeforeApply && (
        <ResponsiveDialogDrawer
          open={open}
          setOpen={setOpen}
          title=''
          contentClassName='md:max-w-[500px]! max-h-[60dvh]! dark:border-secondary-950 '
        >
          <div className='flex flex-col justify-center items-center text-center mb-10 -mt-4'>
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              className='relative w-22 h-22 p-1 m-auto'
            >
              <ElicashApplied balance={balance} />
              <ShineOverlay />
            </motion.div>
          </div>

          <div className='flex flex-col justify-center items-center text-center space-y-3'>
            <p className='text-lg font-medium text-[var(--text-dark)]'>
              Yay! You earned
            </p>
            <p className='text-[var(--gold)] font-semibold text-xl flex gap-1'>
              <span className='relative flex items-center justify-center mx-auto block overflow-hidden'>
                <ElicashIcon />
              </span>
              {balance.toLocaleString()} Elicash
            </p>
            {expiredDate !== WALLET_STATUS.EARNED && (
              <p className='text-sm font-medium text-[var(--brown-medium)] dark:text-white'>
                Elicash will be credited to your wallet post your stay
                completion.
              </p>
            )}

            <Button
              onClick={() => setOpen(false)}
              className='
              px-8 py-2 
              bg-[var(--text-dark)] text-white 
              rounded-full font-medium 
              dark:bg-[var(--black5)] 
              dark:border dark:border-[var(--prive2)] 
              dark:text-[var(--prive2)]
            '
            >
              Continue
            </Button>
          </div>
        </ResponsiveDialogDrawer>
      )}
    </div>
  );
}
