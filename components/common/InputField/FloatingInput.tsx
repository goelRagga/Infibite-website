import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors?: string;
  isInputDisabled?: boolean;
  emailVerified?: boolean;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      id,
      className,
      errors,
      value,
      onChange,
      onBlur,
      isInputDisabled = false,
      emailVerified,
      ...props
    },
    ref
  ) => {
    const showVerified = id === 'email' && emailVerified;

    const showClear =
      isInputDisabled && value && value.length > 0 && !showVerified;

    const handleClear = () => {
      onChange({
        target: { value: '', name: id },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className='relative w-full'>
        <Input
          id={id}
          ref={ref}
          value={value}
          disabled={emailVerified}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
          placeholder=' '
          className={cn(
            `peer pt-6 pb-2 h-[68px] !shadow-none w-full bg-white rounded-2xl border px-6 text-sm text-[var(--primary-950)] typography-label-semibold placeholder-transparent md:h-14 gap-4 md:gap-4 dark:text-white dark:bg-[var(--brown2)] dark:border-primary-800`,
            errors
              ? 'border-red-500'
              : isInputDisabled
                ? 'border-primary-50'
                : 'border-primary-10',
            emailVerified &&
              'cursor-not-allowed text-typography-label-semibold !border-primary-10 !bg-primary-10',
            'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-primary-800 focus-visible:ring-inset'
          )}
        />
        <Label
          htmlFor={id}
          className='absolute  top-2 text-sm  transition-all px-6 
          md:peer-placeholder-shown:top-5 peer-placeholder-shown:top-6  text-[var(--primary-500)] 
          md:peer-focus:top-2 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--primary-500)] typography-small-regular'
        >
          {label}
        </Label>

        {showVerified && (
          <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-green-700)] typography-label-semibold '>
            Verified
          </span>
        )}

        {showClear && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black'
          >
            <X className='w-4 h-4' />
          </button>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
export default FloatingLabelInput;
