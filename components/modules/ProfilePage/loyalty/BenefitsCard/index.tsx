import Image from 'next/image';

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  category: string;
  benefitType: string;
  isRedeemable: boolean;
  maxRedeemPerYear: number;
  metadata: {
    icon: string;
  };
}

interface BenefitCardItemProps {
  item: BenefitItem;
}

export default function BenefitCardItem({ item }: BenefitCardItemProps) {
  return (
    <div className='text-center border rounded-xl p-6 shadow-sm'>
      {/* Icon */}
      <div className='flex justify-center mb-4'>
        <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center'>
          {item?.metadata?.icon ? (
            <Image
              src={item?.metadata?.icon}
              alt={item?.title}
              width={32}
              height={32}
              className='object-contain'
            />
          ) : (
            <span className='text-white text-sm'>No Icon</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className='text-base font-medium text-gray-600'>{item?.title}</h3>

      {/* Max Redeem */}
      <div className='text-lg font-bold text-red-600'>
        {item?.maxRedeemPerYear}
      </div>

      {/* Description */}
      <p className='text-sm text-gray-500'>{item?.description}</p>
    </div>
  );
}
