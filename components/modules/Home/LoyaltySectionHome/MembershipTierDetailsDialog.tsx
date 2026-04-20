'use client';

import { LoyaltyTierItem } from '@/components/modules/ProfilePage/loyalty/data/type';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import useIsMobile from '@/hooks/useIsMobile';
import MembershipTierCard from '@/components/modules/ProfilePage/loyalty/MembershipTierCard';

interface MembershipTierDetailsDialogProps {
  selectedTier: LoyaltyTierItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MembershipTierDetailsDialog({
  selectedTier,
  isOpen,
  onOpenChange,
}: MembershipTierDetailsDialogProps) {
  const isMobile = useIsMobile();

  if (!selectedTier) {
    return null;
  }

  const tierName =
    selectedTier?.metadata?.membershipTiers?.name || 'Membership';
  const tierSubtitle = selectedTier?.metadata?.membershipTiers?.subtitle || '';
  const tierColor = selectedTier?.metadata?.membershipTiers?.color || 'blue';
  const tierIcon = selectedTier?.metadata?.membershipTiers?.icon;
  const tierBenefits =
    selectedTier?.metadata?.membershipTiers?.benefits ||
    selectedTier?.benefits ||
    [];

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side='bottom'
          className='h-[80dvh] bg-[var(--prive4)] p-0 gap-0 rounded-[20px] border-0'
          hideCloseButton={true}
        >
          <MembershipTierCard
            name={tierName}
            subtitle={tierSubtitle}
            color={tierColor}
            icon={tierIcon}
            benefits={tierBenefits}
            className='text-white h-full w-full rounded-[20px]'
            showAllBenefits={true}
            showCloseButton={true}
            onClose={() => onOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] bg-[var(--prive4)] p-0 gap-0 rounded-[20px] border-0 [&_button[data-slot="dialog-close"]]:hidden'>
        <MembershipTierCard
          name={tierName}
          subtitle={tierSubtitle}
          color={tierColor}
          icon={tierIcon}
          benefits={tierBenefits}
          className='text-white h-full w-full rounded-[20px]'
          showAllBenefits={true}
          showCloseButton={true}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
