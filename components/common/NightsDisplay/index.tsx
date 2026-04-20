import React from 'react';

interface NightsDisplayProps {
  numberOfNights: number | string;
  className?: string;
}

const NightsDisplay: React.FC<NightsDisplayProps> = ({
  numberOfNights,
  className = 'text-xs h-[30px] w-[auto] bg-primary-50 flex justify-center items-center text-primary-600 border border-primary-100 px-3 py-1 rounded-full font-normal dark:bg-[var(--black5)] dark:border-secondary-950 dark:text-primary-400',
}) => {
  const nightCount = Number(numberOfNights);

  return (
    <div className={className}>
      {nightCount
        ? `${nightCount} ${nightCount === 1 ? 'Night' : 'Nights'}`
        : 'N/A'}
    </div>
  );
};

export default NightsDisplay;
