export type TransactionStatus = 'earned' | 'expired' | 'upcoming';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  bookingId: string;
  status: TransactionStatus;
  validTill?: string;
  lastStatusUpdatedAt?: string;
};

export type EmptyState = {
  title: string;
  description: string;
  buttonText: string;
};

export type WalletDataType = {
  walletInfo: {
    balance: number;
    expiringAmount: number;
    expiringDate: string;
  };
  transactions: {
    all: Transaction[];
    upcoming: Transaction[];
    expired: Transaction[];
  };
  emptyStates: {
    all: EmptyState;
    upcoming: EmptyState;
    expired: EmptyState;
  };
};
