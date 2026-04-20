'use client';

import { FC, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface LocationProps {
  location: string;
  onChange: (updatedLocation: { city: string }) => void;
  errors: string;
}

const Location: FC<LocationProps> = ({ location, onChange, errors }) => {
  const city = location || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ city: e.target.value });
  };

  return (
    <div className='relative'>
      <Input
        id='city'
        placeholder=''
        className={`peer h-[68px] w-[326px] md:h-14 md:w-full bg-white rounded-2xl border px-3 pt-5 pb-2 text-sm text-[var(--primary-950)] placeholder-transparent ${
          errors ? 'border-accent-red-500' : ''
        }`}
        value={city}
        onChange={handleChange}
      />
      <label
        htmlFor='city'
        className='absolute left-3 top-2 text-sm text-[var(--primary-700)] transition-all
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--primary-700)]
          peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--primary-500)]'
      >
        City
      </label>
      {errors && <p className='text-sm text-accent-red-500 mt-1'>{errors}</p>}
    </div>
  );
};

export default Location;
