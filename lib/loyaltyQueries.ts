import gql from 'graphql-tag';

export const GET_ACCOUNT = gql`
  query GetAccount($userId: String, $userType: UserType) {
    account(userId: $userId, userType: $userType) {
      id
      loyaltyDetails {
        id
        amountSpentIn12Months
        amountNeededForNextTier
        loyaltyTier {
          id
          tier
          minAmount
          redemptionCapability
          metadata
          rewardRule {
            id
            name
            description
            amountSpent
            rewardPoints
          }
          benefits {
            id
            category
            benefitType
            isRedeemable
            maxRedeemPerYear
            metadata
          }
        }
        nextLoyaltyTier {
          id
          tier
          minAmount
          redemptionCapability
          metadata
          rewardRule {
            id
            name
            description
            amountSpent
            rewardPoints
          }
          benefits {
            id
            category
            benefitType
            isRedeemable
            maxRedeemPerYear
            metadata
          }
        }
      }
      wallet {
        walletId
        amount
        firstExpiryTransaction {
          id
          walletId
          bookingId
          amount
          transactionType
          status
          consumedStatus
          transactionMode
          availableToConsume
          isExpiry
          validTill
          source
          lastStatusUpdatedAt
        }
      }
    }
  }
`;

export const FETCH_ALL_LOYALTY_TIERS = gql`
  query FetchAllLoyaltyTier {
    fetchAllLoyaltyTier {
      id
      tier
      minAmount
      redemptionCapability
      metadata
      rewardRule {
        id
        name
        description
        amountSpent
        rewardPoints
      }
      benefits {
        id
        category
        benefitType
        isRedeemable
        maxRedeemPerYear
        metadata
      }
    }
  }
`;

export const GET_WALLET_TRANSACTIONS = gql`
  query WalletTransactions($input: WalletTransactionInput!) {
    walletTransactions(input: $input) {
      id
      walletId
      bookingId
      amount
      transactionType
      status
      consumedStatus
      transactionMode
      availableToConsume
      isExpiry
      validTill
      source
      lastStatusUpdatedAt
    }
  }
`;

export const APPLY_WALLET_MONEY = gql`
  query ApplyWalletMoney($quoteId: String!, $userId: String!, $userType: UserType!) {
    applyWalletMoney(quoteId: $quoteId, userId: $userId, userType: $userType) {
      success
      message
    }
  }
`;

export const REMOVE_WALLET_MONEY = gql`
  query RemoveWalletMoney($quoteId: String!, $userId: String!, $userType: UserType!) {
    removeWalletMoney(quoteId: $quoteId, userId: $userId, userType: $userType) {
      success
      message
    }
  }
`;

export const GET_WALLET_DETAILS = gql`
  query GetAccount($userId: String, $userType: UserType) {
    account(userId: $userId, userType: $userType) {
        id
         loyaltyDetails {
            id
            amountSpentIn12Months
            amountNeededForNextTier
            loyaltyTier {
                id
                tier
                minAmount
                redemptionCapability
                metadata
            }
        }
        wallet {
            walletId
            amount
            firstExpiryTransaction {
                amount
                status
                availableToConsume
                isExpiry
                validTill
            }
        }
    
    }
  }
`;

export const GET_WALLET_APPLICABLE_AMOUNT = gql`
  query WalletApplicableAmount(
    $quoteId: String!
    $userId: String!
    $userType: UserType
  ) {
    walletApplicableAmount(
      quoteId: $quoteId
      userId: $userId
      userType: $userType
    )
  }
`;
