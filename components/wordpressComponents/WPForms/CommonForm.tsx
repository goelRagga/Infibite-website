'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import DetailsForm from '@/components/common/DetailsForm';
import { Button } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';

export type FormSection<TSectionKey extends string = string> = {
  sectionKey: TSectionKey;
  fields: Array<any>;
  columns?: number;
  sectionTitle?: string;
  // Optional initial values for this section
  initialValues?: Record<string, any>;
};

export interface CommonFormProps<TFormData extends Record<string, any> = any> {
  className?: string;
  sections: Array<FormSection<keyof TFormData & string>>;
  // HubSpot or any HTTP endpoint
  endpoint: string;
  // Maps full formData to HubSpot fields payload
  mapToPayload: (formData: TFormData) => {
    fields: Array<{ name: string; value: any }>;
  };
  // Optional external validation per-field; return string error or null
  validateField?: (args: {
    name: string;
    value: any;
    sectionKey: string;
    formData: TFormData;
  }) => string | null;
  // Render submit button text
  submitText?: string;
  // Reset form on success
  resetOnSuccess?: boolean;
  // Called after successful submission
  onSuccess?: (result: any) => void;
  // Called before submission with form data
  onSubmit?: (formData: TFormData) => void;
  // Optional button container className
  buttonContainerClassName?: string;
  // Optional submit button className
  buttonClassName?: string;
  // Custom success message component to render instead of result.inlineMessage
  successMessage?: React.ReactNode;
  // Whether to show custom success message instead of inline HTML
  useCustomSuccessMessage?: boolean;
  onClose?: () => void;
}

const defaultValidateField = (name: string, value: any): string | null => {
  if (typeof value === 'string' && value.trim() === '')
    return 'This field is required';
  if (
    name === 'email' &&
    typeof value === 'string' &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  ) {
    return 'Invalid email address';
  }
  return null;
};

function CommonForm<TFormData extends Record<string, any>>({
  className = '',
  sections,
  endpoint,
  mapToPayload,
  validateField,
  submitText = 'Submit',
  resetOnSuccess = true,
  onSuccess,
  onSubmit,
  buttonContainerClassName = 'fixed bottom-0 left-0 mt-4 w-full bg-white p-5 flex items-center justify-center gap-4 md:static md:p-0 md:mt-4 md:bg-transparent dark:bg-[var(--brown2)]',
  buttonClassName = 'text-white bg-accent-red-900 hover:bg-accent-red-950 border border-accent-red-900 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4',
  successMessage,
  useCustomSuccessMessage = false,
  onClose,
}: CommonFormProps<TFormData>) {
  const initialFormData = useMemo(() => {
    const obj: Record<string, any> = {};
    sections.forEach((s) => {
      obj[s.sectionKey] = { id: '', ...(s.initialValues || {}) };
    });
    return obj as TFormData;
  }, [sections]);

  const [formData, setFormData] = useState<TFormData>(initialFormData);
  const [inlineHTML, setInlineHTML] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>(
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();

  // Handle input focus scrolling on mobile to prevent keyboard from hiding inputs
  useEffect(() => {
    if (!isMobile || !formRef.current) return;

    const handleInputFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      // Handle all input types including inputs inside custom components
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        // Find the scrollable container (drawer content)
        const scrollableContainer =
          document.querySelector('[data-slot="drawer-content"]') ||
          document.querySelector('[role="dialog"]') ||
          window;

        // Small delay to allow keyboard to appear
        setTimeout(() => {
          if (scrollableContainer === window) {
            // If no specific container, use window scroll
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          } else {
            // Scroll within the container
            const container = scrollableContainer as HTMLElement;
            const targetRect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollTop = container.scrollTop;
            const targetTop = targetRect.top - containerRect.top + scrollTop;

            container.scrollTo({
              top: targetTop - containerRect.height / 2 + targetRect.height / 2,
              behavior: 'smooth',
            });
          }
        }, 350);
      }
    };

    const form = formRef.current;
    form.addEventListener('focusin', handleInputFocus);

    return () => {
      form.removeEventListener('focusin', handleInputFocus);
    };
  }, [isMobile]);

  const handleSectionChange = (
    sectionKey: keyof TFormData & string,
    updated: Record<string, any>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev as any)[sectionKey],
        ...updated,
      },
    }));
  };

  const computeFieldError = (
    name: string,
    value: any,
    sectionKey: string
  ): string | null => {
    if (validateField)
      return validateField({ name, value, sectionKey, formData });
    return defaultValidateField(name, value);
  };

  const validateAllFields = () => {
    const newErrors: Record<string, string | null> = {};
    sections.forEach((section) => {
      section.fields.forEach((field: any) => {
        const sectionValues = (formData as any)[section.sectionKey] || {};
        const value = sectionValues[field.name];
        const err = computeFieldError(field.name, value, section.sectionKey);
        if (err) newErrors[field.name] = err;
      });
    });
    return newErrors;
  };

  const allFieldsFilled = useMemo(() => {
    return sections.every((section) =>
      section.fields.every((field: any) => {
        const sectionValues = (formData as any)[section.sectionKey] || {};
        const value = sectionValues[field.name];
        return (
          value !== undefined &&
          value !== null &&
          (value.toString ? value.toString().trim() !== '' : true) &&
          computeFieldError(field.name, value, section.sectionKey) === null
        );
      })
    );
  }, [sections, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors = validateAllFields();
    setFormErrors(errors);
    const hasErrors = Object.values(errors).some((e) => !!e);
    if (hasErrors) return;

    // Call onSubmit callback before submission
    if (onSubmit) {
      onSubmit(formData);
    }

    setLoading(true);

    const payload = mapToPayload(formData);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        if (useCustomSuccessMessage) {
          setShowSuccess(true);
        } else if (result.inlineMessage) {
          setInlineHTML(result.inlineMessage);
        }
        if (resetOnSuccess) setFormData(initialFormData);
        setFormErrors({});
        if (onSuccess) {
          onSuccess(result);
          // If onSuccess is provided and no custom success message, close immediately
          if (!useCustomSuccessMessage && onClose) {
            onClose();
          }
        } else if (onClose) {
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess && successMessage) {
    return <div className='mt-10'>{successMessage}</div>;
  }

  if (inlineHTML) {
    return (
      <div className='mt-10' dangerouslySetInnerHTML={{ __html: inlineHTML }} />
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`flex flex-col ${className}`}
    >
      <div className='mb-0'>
        {sections.map((section) => (
          <DetailsForm
            key={section.sectionKey}
            fields={section.fields}
            onChange={(updated) =>
              handleSectionChange(section.sectionKey, updated)
            }
            sectionTitle={section.sectionTitle || ''}
            columns={section.columns || 1}
            data={{ id: '', ...(formData as any)[section.sectionKey] }}
            errors={formErrors}
          />
        ))}
      </div>

      {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

      <div className={buttonContainerClassName}>
        <Button
          type='submit'
          disabled={!allFieldsFilled || loading}
          className={`${buttonClassName} ${!allFieldsFilled || loading ? 'opacity-50 cursor-not-allowed' : ''} dark:bg-[var(--prive5)] dark:text-white`}
        >
          {loading ? 'Submitting...' : submitText}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
