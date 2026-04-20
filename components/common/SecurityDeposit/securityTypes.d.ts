declare module 'deposit-refund' {
  interface SecurityDepositCardProps {
    securityStatus?: string | 'PENDING' | 'PAID';
    className?: string;
    bookingId?: string;
    getSecurityDepositDetail?: any;
  }

  interface SecurityDepositProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    renderAmountDisplay: () => JSX.Element;
    renderTerms?: () => JSX.Element;
    handlePaymentClick: (type: string) => void;
    handleRefund?: any;
    isProcessing?: any;
  }
  interface RenderDepositStatusProps {
    depositStatus?: string;
    depositMode?: string;
  }
  interface PaymentOptionsProps {
    getPaymentGatewayCheckoutCode: (paymentGatewayType: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    handleRefund?: any;
    handleOfflinePaymentSuccess?: any;
    refundResponseData?: any;
    isProcessing?: boolean;
  }

  interface StatusProps {
    isOpen: boolean;
    onClose: () => void;
    depositPaymentError?: boolean;
    paymentDetails: any;
    refundPaymentError?: boolean;
    isRefund?: boolean | null;
  }
}
