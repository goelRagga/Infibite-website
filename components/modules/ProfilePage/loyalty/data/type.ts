// types/loyalty.ts

export interface LoyaltyAccountResponse {
  data: {
    account: Account;
  };
}

export interface Account {
  id: string;
  loyaltyDetails: LoyaltyDetails;
  wallet: Wallet;
}

export interface Wallet {
  walletId: string;
  amount: number;
  firstExpiryTransaction?: FirstExpiryTransaction;
}

export interface FirstExpiryTransaction {
  id: string;
  walletId: string;
  bookingId: string;
  amount: number;
  transactionType: string;
  status: string;
  consumedStatus: string;
  transactionMode: string;
  availableToConsume: number;
  isExpiry: boolean;
  validTill: string;
  source: string;
  lastStatusUpdatedAt: string;
}

export interface LoyaltyDetails {
  id: string;
  amountSpentIn12Months: number;
  amountNeededForNextTier: number;
  loyaltyTier: LoyaltyTier;
  nextLoyaltyTier: LoyaltyTier;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  description: string;
  tier: number;
  minAmount: number;
  redemptionCapability: number;
  rewardRule: RewardRule;
  benefits: Benefit[];
  metadata: LoyaltyTierMetadata;
}

export interface LoyaltyTierMetadata {
  icon: string;
  membershipTiers: MembershipTier;
}

export interface MembershipTier {
  name: string;
  subtitle: string;
  color: 'blue' | 'silver' | 'gold' | 'diamond';
  icon: string;
  benefits: Benefit[];
}

export interface RewardRule {
  id: string;
  name: string;
  description: string;
  amountSpent: number;
  rewardPoints: number;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  category: string;
  benefitType: string;
  isRedeemable: boolean;
  maxRedeemPerYear: number;
  metadata: BenefitMetadata;
}

export interface BenefitMetadata {
  icon: string;
}

// For the loyalty FAQ data
export interface LoyaltyFAQ {
  title: string;
  data: {
    faq: FAQItem[];
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// For the loyalty tiers list
export interface LoyaltyTierItem {
  id: string;
  tier: number;
  minAmount: number;
  redemptionCapability: number;
  metadata: LoyaltyTierMetadata;
  rewardRule: RewardRule;
  benefits: Benefit[];
}
