import { useUserContext } from '@/contexts/SharedProvider';
import { urqlLoyaltyClient } from '@/lib/client/unified-client-manager';
import { GET_WALLET_DETAILS } from '@/lib/loyaltyQueries';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface LoyaltyTier {
  id: string;
  tier: string;
  minAmount: number;
  redemptionCapability: boolean;
  metadata?: any | null;
}

interface LoyaltyTierDetails {
  id: string;
  amountSpentIn12Months: number;
  amountNeededForNextTier: number;
  loyaltyTier: LoyaltyTier;
  nextLoyaltyTier?: LoyaltyTier | null;
}

interface WalletDetails {
  walletId: string;
  amount: number;
  firstExpiryTransaction?: {
    id: string;
    walletId: string;
    bookingId: string;
    amount: number;
    transactionType: string;
    status: string;
    consumedStatus: string;
    transactionMode: string;
    availableToConsume: boolean;
    isExpiry: boolean;
    validTill: string;
    source: string;
    lastStatusUpdatedAt: string;
  };
}

// let walletCache: {
//   wallet: WalletDetails | null;
//   loyaltyTierDetails: LoyaltyTierDetails | null;
//   timestamp: number;
// } | null = null;

// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletDetails | null>(null);
  const [loyaltyTierDetails, setLoyaltyTierDetails] =
    useState<LoyaltyTierDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { userData } = useUserContext();

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (!userData?.id) return;

      // if (walletCache && Date.now() - walletCache.timestamp < CACHE_DURATION) {
      //   setWallet(walletCache.wallet);
      //   setLoyaltyTierDetails(walletCache.loyaltyTierDetails);
      //   return;
      // }

      setIsLoading(true);
      try {
        const variables = {
          userId: userData.id,
          userType: 'GUEST',
        };

        const accessToken = Cookies.get('accessToken');

        const result = await urqlLoyaltyClient
          .query(GET_WALLET_DETAILS, variables, {
            fetchOptions: {
              headers: {
                ...(accessToken && { authorization: `Bearer ${accessToken}` }),
              },
            },
          })
          .toPromise();

        if (!result.error && result.data?.account) {
          const walletDetails = result.data.account.wallet;
          const tierDetails = result.data.account.loyaltyDetails;
          setWallet(walletDetails);
          setLoyaltyTierDetails(tierDetails);

          // walletCache = {
          //   wallet: walletDetails,
          //   loyaltyTierDetails: tierDetails,
          //   timestamp: Date.now(),
          // };
        }
      } catch (error) {
        console.error('Error fetching wallet/loyalty details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletDetails();
  }, [userData?.id]);

  return { wallet, loyaltyTierDetails, isLoading };
};
