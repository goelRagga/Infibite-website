'use client';

import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { AI_CHAT_MESSAGES } from '@/lib/constants';

interface CouponCardProps {
  content: string;
  couponCode: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ content, couponCode }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className='bg-primary-50 rounded-2xl p-5 relative overflow-hidden border border-primary-100'>
      {/* Discount icon */}
      <div className='absolute top-4 right-4'>
        <Image
          src='/assets/discount.svg'
          alt='Discount'
          width={34}
          height={34}
        />
      </div>

      <h2 className='text-xl font-serif font-normal mb-2 text-[#533D3B]'>
        {AI_CHAT_MESSAGES.REGISTRATION.PROMO_TITLE}
      </h2>
      <p className='text-sm text-primary-700 pr-12 mb-4'>{content}</p>

      {/* Coupon Code Box */}
      <div
        onClick={() => copyToClipboard(couponCode)}
        className='flex items-center justify-center gap-2 bg-white rounded-full py-3 px-6 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200'
      >
        <span className='font-bold text-gray-800 tracking-wider'>
          {couponCode}
        </span>
        {isCopied ? (
          <Check className='w-4 h-4 text-green-600' />
        ) : (
          <Copy className='w-4 h-4 text-gray-400' />
        )}
      </div>
    </div>
  );
};

export default CouponCard;
