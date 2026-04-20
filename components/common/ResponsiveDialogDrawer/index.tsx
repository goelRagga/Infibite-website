import * as React from 'react';
import { createPortal } from 'react-dom';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerOverlay,
} from '@/components/ui/drawer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ResponsiveDialogDrawerProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  titleClassName?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerClassName?: string;
  contentClassName?: string;
  overlayClassName?: string;
  closeButtonClassName?: string;
  isArrowLeft?: boolean;
  isCrossButton?: boolean;
};

// Animation variants for dialog (desktop) - using spring for ultra-smooth animations
const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
};

// Animation variants for drawer (mobile/tablet) - smooth fade
const drawerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const ResponsiveDialogDrawer = ({
  open,
  setOpen,
  trigger,
  title,
  titleClassName,
  description,
  children,
  footer,
  footerClassName,
  contentClassName,
  overlayClassName,
  closeButtonClassName,
  isArrowLeft = true,
  isCrossButton = false,
}: ResponsiveDialogDrawerProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Use Drawer for both mobile and tablet to enable swipe gestures
  if (isMobile || isTablet) {
    return (
      <>
        <Drawer open={open} onOpenChange={setOpen} modal={true}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent
            className={`min-h-[80dvh] flex flex-col bg-[var(--white3)] dark:bg-background ${contentClassName}`}
          >
            <DrawerHeader className='text-center font-serif text-xl relative flex-shrink-0'>
              {isArrowLeft && (
                <ArrowLeft
                  className='absolute left-4 top-4 dark:text-white cursor-pointer'
                  onClick={() => setOpen(false)}
                />
              )}

              {isCrossButton && (
                <span className='absolute right-4 -top-2.5 bg-white rounded-lg p-1.5 dark:text-white cursor-pointer dark:bg-[var(--grey8)]'>
                  <X
                    className=' dark:text-white cursor-pointer h-4 w-4'
                    onClick={() => setOpen(false)}
                  />
                </span>
              )}

              <DrawerTitle
                className={cn('font-normal dark:text-white', titleClassName)}
              >
                {title}
              </DrawerTitle>
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>

            <div
              className='flex-1 overflow-y-auto px-4 sm:pb-24 dark:text-white pb-8 min-h-0'
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {children}
            </div>

            {footer && (
              <DrawerFooter className={`${footerClassName} flex-shrink-0`}>
                {footer}
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {open &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-0 z-[49] bg-black/70 ${
              overlayClassName || ''
            }`}
            onClick={() => setOpen(false)}
          />,
          document.body
        )}
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={`sm:max-w-[1200px] bg-[var(--white3)] ${contentClassName} dark:bg-[var(--prive-background)]`}
          closeButtonClassName={closeButtonClassName}
        >
          <motion.div
            variants={dialogVariants}
            initial='hidden'
            animate='visible'
          >
            <DialogHeader>
              <DialogTitle
                className={cn(
                  'text-2xl font-normal',
                  titleClassName ? titleClassName : 'font-serif'
                )}
              >
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <motion.div
              className='pt-4'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring' as const,
                stiffness: 300,
                damping: 35,
                mass: 0.9,
                delay: 0.1,
              }}
            >
              {children}
            </motion.div>
            {footer && <div className='pt-4'>{footer}</div>}
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResponsiveDialogDrawer;
