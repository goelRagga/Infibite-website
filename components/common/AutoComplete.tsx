import { cn } from '@/lib/utils';
import { ChevronDown, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Label } from '../ui/label';

interface AutocompleteOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string | null;
  onChange?: (value: string, option: AutocompleteOption | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  isLoading?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Search...',
  label,
  className = '',
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<any>(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const filtered = options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        (option.sublabel &&
          option.sublabel.toLowerCase().includes(inputValue.toLowerCase()))
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange?.(newValue, null);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange?.(option.label, option);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      listRef.current &&
      !listRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className={cn('relative w-full dark:bg-[var(--grey6)]', className)}>
      <div className='relative'>
        <input
          id='autocomplete-input'
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder=' '
          className={cn(
            'peer pt-5 pb-1 h-[68px] md:h-14 px-6 w-full rounded-xl border bg-white placeholder-transparent',
            'focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none focus-visible:border-0',
            'border-primary-10 text-sm font-semibold text-gray-900 dark:bg-[var(--grey6)] dark:border-[var(--prive2)] dark:focus-visible:ring-[var(--prive2)] dark:text-primary-100'
          )}
        />

        {label && (
          <Label
            htmlFor='autocomplete-input'
            className='absolute top-2 px-6 text-xs font-base text-[var(--primary-500)] transition-all
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-primary-400
              peer-focus:top-2 peer-focus:text-sm peer-focus:text-[var(--primary-500)]'
          >
            {label}
          </Label>
        )}

        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          {isLoading && (
            <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 text-sm font-semibold'>
              <div className='flex items-center justify-center space-x-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Searching cities...</span>
              </div>
            </div>
          )}

          {!isLoading && filteredOptions.length > 0 && (
            <ul
              ref={listRef}
              className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto'
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    'flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 text-sm font-semibold',
                    index === highlightedIndex
                      ? 'bg-black-50 text-black-900'
                      : 'hover:bg-gray-50 text-gray-900',
                    index === 0 && 'rounded-t-xl',
                    index === filteredOptions.length - 1 && 'rounded-b-xl'
                  )}
                >
                  <div className='flex-1'>
                    <div className='text-sm font-semibold text-gray-900'>
                      {option.label}
                    </div>
                    {option.sublabel && (
                      <div className='text-sm text-gray-500 mt-0.5'>
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isLoading &&
            filteredOptions.length === 0 &&
            inputValue &&
            inputValue.length >= 3 && (
              <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 text-sm font-semibold'>
                No cities found
              </div>
            )}

          {!isLoading && inputValue && inputValue.length < 3 && (
            <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 text-sm font-semibold'>
              Type at least 3 characters to search
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Autocomplete;
