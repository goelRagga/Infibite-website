import React from 'react';
import { Star } from './index';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  color?: string;
  fillColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 20,
  className = '',
  color = 'var(--accent-yellow-500)',
  fillColor,
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;

        if (rating >= starValue) {
          return (
            <Star
              key={index}
              size={size}
              type='full'
              color={color}
              fillColor={fillColor}
            />
          );
        }

        if (rating >= starValue - 0.5) {
          return (
            <Star
              key={index}
              size={size}
              type='half'
              color={color}
              fillColor={fillColor}
            />
          );
        }

        return (
          <Star
            key={index}
            size={size}
            type='empty'
            color={color}
            fillColor={fillColor}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
