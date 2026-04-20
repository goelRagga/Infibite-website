export interface StarProps {
  size: number;
  type: 'full' | 'half' | 'empty';
  color?: string;
  fillColor?: string;
}

export const Star: React.FC<StarProps> = ({
  size,
  type,
  color = 'var(--accent-yellow-500)',
  fillColor,
}) => {
  const defaultFillColor = fillColor || color;
  const gradientId = `halfGradient-${defaultFillColor.replace('#', '')}`;
  const fill =
    type === 'full'
      ? defaultFillColor
      : type === 'half'
        ? `url(#${gradientId})`
        : 'none';

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      stroke={color}
      strokeWidth='1.5'
      fill={fill}
    >
      {type === 'half' && (
        <defs>
          <linearGradient id={gradientId}>
            <stop offset='50%' stopColor={defaultFillColor} />
            <stop offset='50%' stopColor='transparent' />
          </linearGradient>
        </defs>
      )}

      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z' />
    </svg>
  );
};
