import { ShieldCheck } from 'lucide-react';

interface SecureBookingBannerProps {
  className?: string;
}

const SecureBookingBanner: React.FC<SecureBookingBannerProps> = ({
  className,
}) => {
  const title = 'Book Now – No Hidden Fees, 100% Secure!';
  const desc = 'Transparent pricing, no surprises—just seamless stays.';
  return (
    <div
      className={`flex items-center gap-4 p-4 bg-gradient-to-r from-white to-[#f4fefb] rounded-xl border border-accent-green-50 dark:border-accent-green-500 dark:bg-gradient-to-r dark:from-[var(--brown5)] dark:to-[var(--brown5)] ${className}`}
    >
      <div>
        <ShieldCheck className='text-accent-green-700 dark:text-accent-green-500 w-6 h-6' />
      </div>
      <div>
        <h5 className='text-accent-green-700 font-semibold text-sm dark:text-accent-green-500'>
          {title}
        </h5>
        <p className='text-accent-green-700 text-xs dark:text-accent-green-500'>
          {desc}
        </p>
      </div>
    </div>
  );
};

export default SecureBookingBanner;
