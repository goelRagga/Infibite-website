interface InfoDisplayProps {
  title?: string;
  value?: string;
  description?: string;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({
  title,
  value,
  description,
}) => {
  return (
    <div>
      {title && (
        <p className='text-xs font-normal mb-0.5 text-accent-red-900 uppercase dark:text-[var(--prive2)]'>
          {title}
        </p>
      )}
      {value && (
        <p className='text-sm lg:text-base font-semibold text-foreground'>
          {value}
        </p>
      )}
      {description && (
        <p className='text-secondary-900 text-xs dark:text-primary-400'>
          {description}
        </p>
      )}
    </div>
  );
};

export default InfoDisplay;
