import { Button } from '@/components/ui';
import { useState } from 'react';
import Svg from '../Shared/Svg';

interface CouponCodeInputBoxProps {
  inputBoxBorder?: string;
  codeDescription?: string;
  couponCode?: string;
  className?: string;
}

const CouponCodeInputBox: React.FC<CouponCodeInputBoxProps> = ({
  inputBoxBorder = '1px dashed var(--orange2)',
  codeDescription = 'Use this code on EazyDiner’s website to activate your membership:',
  couponCode = 'EDZ2R3TZU',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <>
      <p className='text-xs leading-4 md:leading-6 md:text-sm pb-1 font-normal text-foreground dark:text-[#2c1f1e]'>
        {codeDescription}
      </p>
      <div
        className='flex items-center gap-2 mt-1.5 rounded-2xl h-[56px] bg-white justify-between px-4'
        style={{ border: inputBoxBorder }}
      >
        <div className='text-base font-semibold w-40 bg-white dark:text-[#1B0107]'>
          {couponCode}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleCopy}
          className={`font-semibold ${
            copied ? 'accent-green-700 dark:text-accent-green-700' : 'orange2'
          } border-0 shadow-none hover:cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out h-[32px]`}
          style={{
            backgroundColor: copied ? 'var(--green1)' : 'var(--orange3)',
            fontSize: '10px',
          }}
        >
          {copied ? 'Code Copied' : 'Copy Code'}
          <Svg
            src={
              copied
                ? `${process.env.IMAGE_DOMAIN}/done_all_681ae48f3c.svg`
                : `${process.env.IMAGE_DOMAIN}/copy_faf7e2c927.svg`
            }
            className='w-4 h-4 transition-all duration-300 ease-in-out'
            width={copied ? '16' : '16'}
            height={copied ? '16' : '16'}
          />
        </Button>
      </div>
    </>
  );
};

export default CouponCodeInputBox;
