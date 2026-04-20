import ElicashIcon from '@/assets/elicash.svg';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { WALLET_STATUS } from '@/lib/constants';
import { format } from 'date-fns';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Timeline from './Common/TimeLine';
import { Transaction } from './walletType';
import Link from 'next/link';

interface TransactionItemProps {
  transaction: Transaction;
  isLast: boolean;
}

export default function TransactionItem({
  transaction,
  isLast,
}: TransactionItemProps) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, {
    once: true,
    margin: '-50px 0px',
    amount: 0.2,
  });

  const getStatusBadgeColor = () => {
    switch (transaction.status?.toUpperCase()) {
      case WALLET_STATUS.EARNED:
        return 'text-green-600 border-green-100 bg-green-50';
      case WALLET_STATUS.UPCOMING:
        return 'text-green-600 border-green-100 bg-green-50';
      case WALLET_STATUS.EXPIRED:
        return 'text-red-600 border-red-100 bg-red-50';
      case WALLET_STATUS.USED:
        return 'text-red-600 border-red-100 bg-red-50';
      default:
        return 'text-gray-600 border-gray-100 bg-gray-50';
    }
  };

  const getAmountColor = () => {
    switch (transaction.status?.toUpperCase()) {
      case WALLET_STATUS.EARNED:
        return 'text-green-600';
      case WALLET_STATUS.UPCOMING:
        return 'text-green-600';
      case WALLET_STATUS.EXPIRED:
        return 'text-red-600';
      case WALLET_STATUS.USED:
        return 'text-red-600';
      default:
        return transaction.amount > 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const getAmountSign = () => {
    switch (transaction.status?.toUpperCase()) {
      case WALLET_STATUS.EXPIRED:
      case WALLET_STATUS.USED:
        return '-';
      case WALLET_STATUS.EARNED:
      case WALLET_STATUS.UPCOMING:
        return '+';
      default:
        return transaction.amount > 0 ? '+' : '';
    }
  };

  return (
    <div className='relative md:bg-[var(--primary-10)] bg-white pb-10'>
      <div className=''>
        <Timeline isLast={isLast} />
      </div>

      {/* Date and Badge */}
      <div className='pl-6 md:pr-0 flex justify-between items-center mb-2 md:mb-4'>
        <span className='text-gray-800 text-sm -mt-1'>
          {transaction.lastStatusUpdatedAt
            ? format(new Date(transaction.lastStatusUpdatedAt), 'dd MMM, yyyy')
            : undefined}
        </span>

        <Badge
          variant='outline'
          className={`text-xs px-[8px] py-[4px] w-auto h-[22px] rounded-full whitespace-nowrap -mt-1 ${getStatusBadgeColor()}`}
        >
          {transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1)}
        </Badge>
      </div>

      {/* Transaction Card */}
      <div className='pl-6'>
        <motion.div
          ref={cardRef}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            isCardInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1,
          }}
        >
          <Card className='bg-white border border-[var(--primary-100)] rounded-2xl py-0 shadow-none '>
            <CardContent className=' px-0'>
              <div className='flex flex-row md:flex-row justify-between md:items-center md:px-4 md:py-3 px-3 py-4  '>
                <div className='flex items-center gap-1  '>
                  {/* <CustomImage
                  src={`${process.env.IMAGE_DOMAIN}/Elicash_Icon_d070aca13e.svg`}
                  alt='elicash coin'
                  className='w-4 h-4'
                  width={16}
                  height={16}
                /> */}
                  <ElicashIcon />

                  <span
                    className={`text-lg sm:text-base font-semibold ${getAmountColor()}`}
                  >
                    {getAmountSign()}
                    {Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
                {transaction.validTill && transaction.status !== 'expired' && (
                  <div className='text-right mt-0 md:mt-0 '>
                    <span className='text-gray-700 text-sm'>
                      Valid Till:{' '}
                      <span className='font-semibold'>
                        {transaction.validTill
                          ? format(
                              new Date(transaction.validTill),
                              'dd MMM, yyyy'
                            )
                          : undefined}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div className=' border-t-[1px] shadow-none bg-[var(--primary-50)] md:px-4 md:py-3 px-3 py-4 md:mt-0.5 rounded-b-2xl'>
                <div className='mt-2'>
                  <p className='text-sm sm:text-md text-gray-700'>
                    Booking ID:{' '}
                    <Link
                      href={`/booking-details/${transaction.bookingId}`}
                      className='font-semibold underline hover:text-red-900'
                    >
                      {transaction.bookingId}{' '}
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
