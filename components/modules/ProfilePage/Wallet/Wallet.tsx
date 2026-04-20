'use client';

import { ArrowLeft, Clock, List, XCircle } from 'lucide-react';

import { useUserContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import { useWallet } from '@/hooks/useWallet';
import { urqlLoyaltyClient } from '@/lib/client/unified-client-manager';
import { WALLET_STATUS } from '@/lib/constants';
import { GET_WALLET_TRANSACTIONS } from '@/lib/loyaltyQueries';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommonBalanceSection from './Common/CommonBalanceSection';
import WalletTabGroup from './Common/RenderTabGroup';
import ElicashTabContent from './TabSection/ElicashTabContent';

export default function WalletMain() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [walletTransactions, setWalletTransactions] = useState([]);
  const { wallet: walletDetails, isLoading: walletLoading } = useWallet();
  const [activeTab, setActiveTab] = useState('all');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUserContext();

  const handleRedeemNow = () => {
    router.push('/villas?adults=1');
  };

  const fetchWalletTransaction = async (tab: string = 'all') => {
    setIsLoading(true);
    setError(null);

    if (!userData?.id) {
      setIsLoading(false);
      return;
    }

    try {
      let status = null;
      if (tab === 'upcoming') {
        status = [WALLET_STATUS.UPCOMING];
      } else if (tab === 'expired') {
        status = [WALLET_STATUS.EXPIRED];
      } else {
        status = Object.values(WALLET_STATUS);
      }

      const variables = {
        input: {
          userId: userData.id,
          userType: 'GUEST',
          status,
        },
      };
      const accessToken = Cookies.get('accessToken');
      const result = await urqlLoyaltyClient
        .query(GET_WALLET_TRANSACTIONS, variables, {
          fetchOptions: {
            headers: {
              ...(accessToken && { authorization: `Bearer ${accessToken}` }),
            },
          },
        })
        .toPromise();

      if (result.error) {
        console.error('Wallet query error:', result.error);
        setError('Failed to fetch wallet transactions. Please try again.');
      } else {
        setWalletTransactions(result.data.walletTransactions || []);
      }
    } catch (error) {
      console.error('Unexpected error during wallet query:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletTransaction(activeTab);
  }, [activeTab, userData?.id]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  const walletTabs = [
    {
      value: 'all',
      title: 'All',
      icon: <List className='w-4 h-4' />,
      className: 'typography-label-regular',
      iconClassName: '',
      component: (
        <ElicashTabContent
          transactions={walletTransactions}
          isLoading={isLoading}
          error={error}
          emptyStateType='all'
        />
      ),
    },
    {
      value: 'upcoming',
      title: 'Upcoming',
      icon: <Clock className='w-4 h-4' />,
      className: 'typography-label-regular',
      iconClassName: '',
      component: (
        <ElicashTabContent
          transactions={walletTransactions}
          isLoading={isLoading}
          error={error}
          emptyStateType='upcoming'
        />
      ),
    },
    {
      value: 'expired',
      title: 'Expired',
      icon: <XCircle className='w-4 h-4' />,
      className: 'typography-label-regular',
      iconClassName: '',
      component: (
        <ElicashTabContent
          transactions={walletTransactions}
          isLoading={isLoading}
          error={error}
          emptyStateType='expired'
        />
      ),
    },
  ];
  return (
    <div className='w-full min-h-screen rounded-2xl bg-[var(--primary-10)] md:p-6'>
      <div className='mx-auto max-w-7xl bg-primary-50 md:bg-[var(--primary-10)]'>
        {/* Header */}
        {!isMobile ? (
          <div className='flex items-center justify-between'>
            <h2 className='font-dm-serif typography-title-regular text-xl sm:text-2xl'>
              My Wallet
            </h2>
            {/* <button
              onClick={handleHelpClick}
              className='cursor-pointer p-1'
              aria-label='Help'
            >
              <HelpCircle className='h-6 w-6 text-[var(--grey9)]' />
            </button> */}
          </div>
        ) : (
          <div className='relative flex items-center justify-center p-4 md:mb-6'>
            <button
              onClick={() => window.history.back()}
              className='absolute left-4 flex items-center'
              aria-label='Go back'
            >
              <ArrowLeft className='!h-6 !w-6 bg-primary-50 text-black' />
            </button>
            <h1 className='font-dm-serif typography-title-regular text-2xl text-[var(--secondary-950)]'>
              My Wallet
            </h1>
          </div>
        )}

        {/* Balance Section */}
        <div className='rounded-2xl p-0 md:p-6 sm:mb-2'>
          <CommonBalanceSection
            showBalance={true}
            title='MY ELICASH BALANCE'
            balance={walletDetails?.amount ?? 0}
            expiringAmount={
              walletDetails?.firstExpiryTransaction?.availableToConsume ?? 0
            }
            expiringDate={
              walletDetails?.firstExpiryTransaction?.validTill
                ? format(
                    new Date(walletDetails.firstExpiryTransaction.validTill),
                    'dd MMM, yyyy'
                  )
                : undefined
            }
            onRedeemClick={handleRedeemNow}
            className='p-0'
            ButtonText='Redeem Now'
            ButtonClassName='bg-[var(--grey9)] hover:bg-gray-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full'
          />
        </div>

        {/* Tabs */}
        <div className='mt-8 rounded-none border-t-[1px] bg-white shadow-none md:mt-0 md:rounded-2xl md:border-none md:bg-[var(--primary-10)]'>
          <WalletTabGroup tabs={walletTabs} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}
