'use client';

import FloatingLabelInput from '@/components/common/InputField/FloatingInput';

import { FieldConfig } from './DetailsFormTypes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useIsMobile from '@/hooks/useIsMobile';
import PhoneNumberInput from '../PhoneInputField';
import { usePhoneContext } from '@/contexts/SharedProvider';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns/format';
import { Calendar } from '@/components/ui';
import DateRangeField from '../DateRangeField';

interface DynamicFormProps<T> {
  data: T;
  fields: FieldConfig<T>[];
  onChange: (updated: Partial<T>) => void;
  sectionTitle?: string;
  columns?: number;
  rows?: number;
  errors?: Record<string, string | null>;
}

const DetailsForm = <T extends Record<string, any>>({
  data,
  fields,
  onChange,
  sectionTitle = 'Form Section',
  columns = 2,
  rows = 1,
  errors = {},
}: DynamicFormProps<T>) => {
  const handleChange = (field: keyof T, value: any) => {
    onChange({ [field]: value } as Partial<T>);
  };
  const isMobile = useIsMobile();

  return (
    <div className='space-y-4 w-full mx-auto'>
      <h3 className='text-md mt-4 typography-body-semibold text-[var(--secondary-950)]'>
        {sectionTitle}
      </h3>

      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {fields.map((field) => {
          const fieldError = errors?.[field.name as string];

          if (field.type === 'radio' && field.options) {
            return (
              <div key={String(field.name)} className='col-span-full'>
                <RadioGroup
                  value={data[field.name]}
                  onValueChange={(val) => handleChange(field.name, val)}
                  className='flex gap-6 flex-wrap'
                >
                  {field.options.map((option) => (
                    <div key={option} className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className='border-2 border-[var(--primary-500)]'
                      />
                      <Label
                        htmlFor={option}
                        className='font-medium text-sm text-[var(--secondary-950)]'
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {fieldError && (
                  <p className='text-sm text-accent-red-500 mt-1'>
                    {fieldError}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === 'phone') {
            return (
              <div key={String(field.name)}>
                <PhoneNumberInput
                  phoneNumber={data[field.name] ?? ''}
                  setPhoneNumber={(val) => handleChange(field.name, val)}
                  countryCode={data.countryCode ?? '+91'}
                  setCountryCode={(val) => handleChange('countryCode', val)}
                  error={errors[field.name] || ''}
                  disabled={false}
                  isVerified={data?.firstLoginIntent === 'phone' || false}
                  isCountryCode={false}
                />
              </div>
            );
          }

          if (field.type === 'date') {
            const dateValue = data[field.name]
              ? new Date(data[field.name])
              : undefined;

            return (
              <div
                key={String(field.name)}
                className='flex flex-col gap-2 w-full'
              >
                <Label className='text-sm font-medium text-gray-700'>
                  {field.label}
                </Label>
                {isMobile ? (
                  <input
                    type='date'
                    value={dateValue ? format(dateValue, 'dd-MM-yyyy') : ''}
                    onChange={(e) => {
                      const d = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      if (d) handleChange(field.name, d.toISOString());
                    }}
                    min={format(new Date(), 'dd-MM-yyyy')}
                    className={cn(
                      'w-full border rounded px-3 py-2',
                      fieldError && 'border-red-500'
                    )}
                  />
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal py-7 rounded-xl',
                          !dateValue && 'text-muted-foreground',
                          fieldError && 'border-red-500',
                          'min-w-[200px]'
                        )}
                      >
                        {dateValue ? (
                          format(dateValue, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0'
                      align='center'
                      sideOffset={10}
                      collisionPadding={20}
                      style={{
                        width: 'min(90vw, 360px)',
                        maxHeight: '70vh',
                        overflow: 'auto',
                      }}
                    >
                      <Calendar
                        mode='single'
                        selected={dateValue}
                        onSelect={(date) => {
                          if (date) {
                            handleChange(field.name, date.toISOString());
                          }
                        }}
                        initialFocus
                        className='p-3'
                        disabled={{
                          before: new Date(),
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {fieldError && (
                  <p className='text-sm text-red-500 mt-1'>{fieldError}</p>
                )}
              </div>
            );
          }

          if (field.type === 'daterange') {
            const fromField = (field as any).fromField || 'checkin';
            const toField = (field as any).toField || 'check_out';

            return (
              <DateRangeField
                checkInName='From'
                checkOutName='To'
                key={String(field.name)}
                label={field.label || 'Date Range'}
                fromValue={data[fromField]}
                toValue={data[toField]}
                onFromChange={(value) => handleChange(fromField, value)}
                onToChange={(value) => handleChange(toField, value)}
                error={fieldError || undefined}
                className='col-span-full'
                sideOffset={-450}
                popoverContentClassName='top-[-80px] z-99999'
              />
            );
          }

          if (field.type === 'number') {
            return (
              <div key={String(field.name)}>
                <FloatingLabelInput
                  id={String(field.name)}
                  label={field.label ?? ''}
                  type='number'
                  value={String(data[field.name] ?? '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Convert to number if not empty, otherwise keep as empty string
                    const numericValue = value === '' ? '' : Number(value);
                    handleChange(field.name, numericValue);
                  }}
                  errors={errors[field.name] || ''}
                  emailVerified={
                    field.name === 'email' && data.firstLoginIntent === 'email'
                  }
                  isInputDisabled={false}
                />
                {fieldError && (
                  <p className='text-sm text-accent-red-500 mt-1'>
                    {fieldError}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={String(field.name)}>
              <FloatingLabelInput
                id={String(field.name)}
                label={field.label ?? ''}
                value={data[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                errors={errors[field.name] || ''}
                emailVerified={
                  field.name === 'email' && data.firstLoginIntent === 'email'
                }
                isInputDisabled={false}
              />
              {fieldError && (
                <p className='text-sm text-accent-red-500 mt-1'>{fieldError}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailsForm;
