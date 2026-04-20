'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUserContext } from '@/contexts/SharedProvider';
import { getTierConfig } from '@/lib/utils';
import { urqlLoyaltyClient } from '@/lib/client/unified-client-manager';
import { GET_ACCOUNT } from '@/lib/loyaltyQueries';

interface ProfileCardProps {
  name?: string;
  joinedYear?: string;
  membershipLevel?: string;
  avatarUrl?: string;
}

export default function ProfileCard({
  name,
  joinedYear,
  membershipLevel = '',
  avatarUrl,
}: ProfileCardProps) {
  const { userData } = useUserContext();
  const [dynamicTier, setDynamicTier] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch loyalty data to get dynamic tier
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!userData?.id) return;

      setIsLoading(true);
      try {
        const variables = { userId: userData?.id, userType: 'GUEST' };
        const result = await urqlLoyaltyClient
          .query(GET_ACCOUNT, variables)
          .toPromise();

        if (
          result.data?.account?.loyaltyDetails?.loyaltyTier?.metadata
            ?.membershipTiers?.name
        ) {
          const tierName =
            result?.data?.account?.loyaltyDetails?.loyaltyTier?.metadata
              ?.membershipTiers?.name;
          setDynamicTier(tierName.toLowerCase());
        }
      } catch (error) {
        console.error('Failed to fetch loyalty data:', error);
        setDynamicTier('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [userData?.id]);

  const currentTier = dynamicTier || membershipLevel || '';
  const styles = getTierConfig(currentTier);

  return (
    <Card
      className={`overflow-hidden relative rounded-2xl border-1 h-[132px] p-4 shadow-none mb-6 ${styles.cardBorder} bg-white`}
    >
      <div
        className={`h-[107px] w-[285px] blur-3xl absolute -bottom-10 overflow-hidden -left-10 opacity-30`}
        style={{
          background: styles?.profileCardBg,
        }}
      ></div>
      <CardContent className='p-0'>
        <div className='flex items-center space-x-4 w-full h-[100px] gap-2'>
          <div className='relative mr-2'>
            <Avatar className='h-[100px] w-[100px] rounded-md'>
              <AvatarImage
                src={avatarUrl || userData?.imageUrl}
                alt={userData?.firstName}
                className='object-cover rounded-md'
              />
              <AvatarFallback className='rounded-full bg-gray-200 text-gray-700 text-4xl'>
                {userData?.firstName || userData?.lastName
                  ? `${userData.firstName?.[0] || ''}${
                      userData.lastName?.[0] || ''
                    }`
                  : ''}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className='flex flex-col justify-center gap-[2px] text-md leading-tight '>
            <Badge
              variant='secondary'
              className={`rounded-md h-7 md:transform md:-translate-x capitalize
              ${styles.badgeBg} ${styles.badgeText} px-2 py-0 text-xs`}
            >
              {isLoading ? 'Loading...' : `${currentTier} Member`}
            </Badge>

            <h3 className='text-[20px] text-gray-900   font-dm-serif font-normal '>
              {userData?.firstName} {userData?.lastName || ''}
            </h3>

            <p className='text-[11px] text-gray-900'>
              {/* Joined {formatDate(userData?.createdAt)} */}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
