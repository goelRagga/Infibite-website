declare module 'property-damage-types' {
  interface DeductionsDrawerProps {
    handleClose?: () => void;
    open: boolean;
    title?: string;
    content?: string;
    drawerAction?: any;
    className?: string;
    onClose?: any;
  }
  interface DamageProofsProps {
    title?: string;
    handleClose?: () => void;
    content?: string;
    actions?: React.ReactNode;
    className?: string;
    onClose?: any;
    damageData?: any;
    isProofsDrawerOpen: boolean;
    handleProofsDrawerClose: () => void;
  }
}
