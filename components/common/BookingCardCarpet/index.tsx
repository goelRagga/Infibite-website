'use client';
import React from 'react';
import { formatDate } from '@/components/common/Shared/FormatDate';
import useIsMobile from '@/hooks/useIsMobile';
import CustomImage from '../CustomImage';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import StarRating from '../StarRating/StarRating';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';

interface bookingData {
  bookingId: string;
  properties: {
    name: string;
    image: string;
  }[];
  paidAmount: string;
  checkinDate: string;
  checkoutDate: string;
  guestName: string;
  guestReview: string;
  reviewReply: string;
  rating: number;
}
interface BookingCardProps {
  booking?: bookingData;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const isMobile = useIsMobile();

  return (
    <div className='bg-foreground rounded-2xl p-4 shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15)] transition-shadow duration-300'>
      <div className='flex flex-row items-start justify-between group '>
        <div className='flex md:flex-row flex-col gap-4'>
          <div className=''>
            <CustomImage
              src={booking?.properties?.[0]?.image || ''}
              alt={booking?.properties?.[0]?.name || ''}
              width={441}
              height={330}
              className='rounded-lg sm:h-28 h-25 w-34 sm:w-full'
            />
          </div>
          <div className='w-full md:w-xl flex flex-col md:gap-8 gap-4 justify-between'>
            <h3 className='text-xl font-serif text-secondary-50 leading-none'>
              {booking?.properties?.[0]?.name || ''}
            </h3>
            <div className='flex flex-row md:justify-between justify-start gap-6 md:gap-0'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-secondary-300'>
                  {RED_CARPET_PAGE_CONTENT?.bookingCardSection?.CHECK_IN_OUT}
                </span>
                <span className='text-sm text-secondary-200 font-semibold'>
                  {formatDate(booking?.checkinDate || '')} -{' '}
                  {formatDate(booking?.checkoutDate || '')}
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-secondary-300'>
                  {RED_CARPET_PAGE_CONTENT?.bookingCardSection?.PAID_AMOUNT}
                </span>
                <span className='text-sm text-secondary-200 font-semibold'>
                  ₹ {formatPrice(booking?.paidAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <span className='rounded-full p-2 flex items-center justify-center w-8 h-8 border border-white'>
              <ArrowUpRight className='h-5 w-5 text-white' />
            </span>
          </div>
        )}
      </div>

      {/* review section */}
      <div className='border-t border-t-[#FFFFFF1A] mt-4 md:mt-6 pt-4 md:pt-8'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <div>
              <span className='text-[var(--black12)] text-sm bg-[var(--grey16)] font-semibold rounded-full w-8 h-8 flex items-center justify-center'>
                {booking?.guestName?.charAt(0) || ''}
              </span>
            </div>
            <div>
              {booking?.guestName && (
                <span className='text-secondary-200 text-xs font-semibold'>
                  {booking?.guestName}
                </span>
              )}
              <StarRating
                rating={booking?.rating || 0}
                size={16}
                color='var(--accent-yellow-500)'
              />
            </div>
          </div>
        </div>
        <div className='pt-3'>
          <p className='text-[var(--black4)] text-sm md:text-base'>
            {booking?.guestReview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
