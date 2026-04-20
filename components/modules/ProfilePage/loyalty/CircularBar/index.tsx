'use client';
import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  gradientColors?: [string, string];
  trackColor?: string;
}

export default function CircularProgress({
  progress,
  size = 200,
  strokeWidth = 12,
  gradientColors = ['#38BDF8', '#3B82F6'],
  trackColor = '#E5E7EB',
}: CircularProgressProps) {
  const startAngle = 227;
  const endAngle = 490;
  const sweep = (progress / 100) * (endAngle - startAngle);

  const radius = size / 2 - strokeWidth * 2;
  const cx = size / 2;
  const cy = size / 2;

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle + sweep);
  const largeArcFlag = sweep > 180 ? 1 : 0;

  const arcPath = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(' ');

  return (
    <div className='relative flex justify-center items-center'>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient
            id='progressGradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor={gradientColors[0]} />
            <stop offset='100%' stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>

        <path
          d={`
            M ${polarToCartesian(cx, cy, radius, startAngle).x} 
              ${polarToCartesian(cx, cy, radius, startAngle).y}
            A ${radius} ${radius} 0 1 1 
              ${polarToCartesian(cx, cy, radius, endAngle).x} 
              ${polarToCartesian(cx, cy, radius, endAngle).y}
          `}
          fill='none'
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />

        <path
          d={arcPath}
          fill='none'
          stroke='url(#progressGradient)'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      </svg>
    </div>
  );
}
