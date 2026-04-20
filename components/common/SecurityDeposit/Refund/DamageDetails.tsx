import { Separator } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { cn, formatPrice, truncateText } from '@/lib/utils';
import React, { useState } from 'react';
import DamageProofs from './DamageProofs';
import useIsMobile from '@/hooks/useIsMobile';

interface DamageItem {
  id: number;
  description: string;
  remark: string;
  cost: string;
  createdAt: string;
  attachments: Array<{
    url: string;
    __typename: string;
  }>;
  __typename: string;
}

// Create a proper interface that matches your DamageProofsProps from the type definition
interface DamageProofModalData {
  id: string;
  description: string;
  remark: string;
  amount: number;
  createdAt: string;
  attachments: string[]; // Array of image URLs
}

interface DamageDetailsProps {
  className?: string;
  depositPaymentDetail?: any;
  onViewProofs?: (damageId: string) => void;
}

const DamageDetails: React.FC<DamageDetailsProps> = ({
  className,
  depositPaymentDetail,
  onViewProofs,
}) => {
  const isMobile = useIsMobile();

  const [selectedDamageProof, setSelectedDamageProof] =
    useState<DamageProofModalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wordLimit = 10;

  const handleViewProofs = (damageId: string) => {
    const damageItem = damages?.find(
      (damage: DamageItem) => damage.id.toString() === damageId
    );

    if (damageItem) {
      const damageProof: DamageProofModalData = {
        id: damageItem.id.toString(),
        description: damageItem.description,
        remark: damageItem.remark,
        amount: parseFloat(damageItem.cost),
        createdAt: damageItem.createdAt,
        attachments:
          damageItem.attachments?.map(
            (attachment: { url: any }) => attachment.url
          ) || [],
      };

      setSelectedDamageProof(damageProof);
      setIsModalOpen(true);
    }
    onViewProofs?.(damageId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDamageProof(null);
  };

  const securityDeposit = 'Security Deposit';
  const viewProofs = 'View Proofs';
  const totalRefundAmount = 'Total Refund Amount';
  const damages = depositPaymentDetail?.refund?.deductions?.summary;

  return (
    <div
      className={cn(
        `rounded-2xl border border-primary-200 p-4 ${isMobile ? 'bg-[var(--white3)] dark:bg-[var(--grey6)]' : 'bg-white'} dark:bg-[var(--grey6)] dark:border-secondary-950`,
        className
      )}
    >
      {/* Security Deposit Paid Section */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm sm:text-base font-semibold text-foreground'>
            {securityDeposit}
          </h3>
          <span className='text-xs text-accent-green-700 font-normal'>
            (REFUNDABLE)
          </span>
        </div>
        <span className='text-sm sm:text-base font-semibold text-foreground'>
          ₹ {formatPrice(depositPaymentDetail?.refund?.amount || 0)}
        </span>
      </div>

      <Separator className='mb-4 border-t-1 dark:border-primary-800' />

      {/* Damage Details Section */}
      {damages && Array.isArray(damages) && damages.length > 0 && (
        <div className='space-y-3 mb-6'>
          {damages.map((damage: DamageItem, index: number) => (
            <div key={damage.id} className='space-y-2'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h5 className='text-sm text-foreground mb-1'>
                    {damage.description}
                  </h5>
                  <p className='text-xs mb-0.5 text-primary-400 leading-relaxed dark:text-[var(--prive6)]'>
                    {truncateText(damage?.remark, wordLimit)}
                  </p>
                  <Button
                    variant='link'
                    size='sm'
                    className='text-sm font-semibold text-accent-red-900 p-0 h-auto underline hover:no-underline dark:text-[var(--prive2)]'
                    onClick={() => handleViewProofs(damage.id.toString())}
                  >
                    {viewProofs}
                  </Button>
                </div>
                <div className='flex items-center gap-3 ml-4'>
                  <span className='text-sm text-red-600 dark:text-[var(--red1)]'>
                    - ₹ {formatPrice(parseFloat(damage?.cost || '0'))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator className='mb-4 border-t-1 dark:border-primary-800' />

      {/* Total Refund Amount Section */}
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold text-foreground'>
          {depositPaymentDetail?.refund?.flow === 'COLLECT_PAYMENT'
            ? 'Amount to pay'
            : 'Total Refund amount'}
        </h3>
        <span className='text-base font-semibold text-foreground'>
          ₹ {formatPrice(depositPaymentDetail?.refund?.totalAmount || 0)}
        </span>
      </div>

      {/* Damage Proofs Modal */}
      <DamageProofs
        damageData={selectedDamageProof}
        isProofsDrawerOpen={isModalOpen}
        handleProofsDrawerClose={handleCloseModal}
      />
    </div>
  );
};

export default DamageDetails;
