'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useIsMobile from '@/hooks/useIsMobile';

import { FC, useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
}

const OtpDialog: FC<OtpDialogProps> = ({ open, onClose }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const isMobile = useIsMobile();

  const isOtpComplete = otp.every((digit) => digit !== '');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = [...otp];
    pasted
      .slice(0, 6)
      .split('')
      .forEach((digit, i) => {
        newOtp[i] = digit;
      });
    setOtp(newOtp);
  };

  const Content = (
    <div className='space-y-6 px-6 pb-6'>
      <p className='text-center text-[var(--secondary-950)] font-light'>
        Enter the OTP sent via SMS/WhatsApp to
        {!isMobile && <span className='font-semibold'> +91 91234 56789</span>}
      </p>
      {isMobile && (
        <p className='text-center text-[var(--secondary-950)] font-semibold mt-[-18]  '>
          +91 91234 56789
        </p>
      )}

      <div className='flex justify-center gap-3'>
        {otp.map((val, i) => (
          <Input
            key={i}
            ref={(el) => {
              if (el) inputRefs.current[i] = el;
            }}
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={() => setActiveInput(i)}
            onBlur={() => setActiveInput(null)}
            inputMode='numeric'
            className='w-12 h-14 text-center text-xl bg-white font-semibold rounded-xl'
          />
        ))}
      </div>

      <p className='text-center text-sm text-muted-foreground'>
        Haven&apos;t received OTP?{' '}
        <span className='font-semibold text-[var(--color-accent-red-900)]'>
          Resend (26s)
        </span>
      </p>

      <div className=' md:w-[744px] flex justify-center '>
        <div className='flex justify-between items-center gap-4 md:w-[384px] w-full'>
          {!isMobile && (
            <Button
              className='flex-1 h-12   rounded-full  bg-white border-2 border-[var(--primary-700)] font-semibold text-[var(--primary-800)]'
              variant='outline'
            >
              Back
            </Button>
          )}

          <Button
            disabled={!isOtpComplete}
            className={`flex-1 h-12 rounded-full text-white font-semibold disabled:bg-secondary-600 ${
              isOtpComplete
                ? 'bg-[var(--color-accent-red-900)]'
                : 'bg-[var(--secondary-500)]'
            } transition-colors duration-300`}
          >
            Verify OTP
          </Button>
        </div>
      </div>

      <p className='text-center text-xs text-muted-foreground'>
        By proceeding you agree to our{' '}
        <span className='text-[var(--color-accent-red-900)] font-medium'>
          Privacy Policy
        </span>{' '}
        and{' '}
        <span className='text-[var(--color-accent-red-900)] font-medium'>
          T&amp;C
        </span>
        .
      </p>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
          <DrawerContent className=''>
            <DrawerHeader>
              <div className='flex items-center '>
                <div>
                  <button onClick={onClose} className='p-2'>
                    <ArrowLeft className='h-6 w-6 text-gray-700' />
                  </button>
                </div>

                <div className='flex-1'>
                  <DrawerTitle className='text-2xl font-semibold text-center mt-4'>
                    Verify Your Number
                  </DrawerTitle>
                </div>
              </div>
            </DrawerHeader>
            {Content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
          <DialogOverlay className={'backdrop-blur-[2px]!'} />
          <DialogContent className='lg:max-w-4xl bg-[var(--primary-50)] rounded-2xl'>
            <DialogHeader className='relative'>
              <DialogTitle className='text-2xl font-semibold text-[var(--secondary-950)] mt-[-8px] font-dm-serif typography-h3-regular'>
                Verify Your Number
              </DialogTitle>
            </DialogHeader>
            {Content}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OtpDialog;
