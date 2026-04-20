'use client';

import React from 'react';
import InlineSVG from 'react-inlinesvg';
import { SvgProps } from 'svg-component';

const Svg: React.FC<SvgProps> = ({
  src,
  title,
  className,
  loader,
  height,
  width,
  color,
}) => {
  const ref = React.useRef<SVGElement>(null);

  const getRewriteSrc = (src?: string) => {
    if (!src) {
      return `${process.env.IMAGE_DOMAIN}/no_Image_b5126bc85f.svg`;
    }

    try {
      if (typeof window !== 'undefined') {
        const url = new URL(src, window.location.origin);
        return `/cloudfront${url.pathname}`;
      }
      return src;
    } catch (err) {
      return src.startsWith('/')
        ? `/cloudfront${src}`
        : `${process.env.IMAGE_DOMAIN}/no_Image_b5126bc85f.svg`;
    }
  };

  const rewriteSrc = getRewriteSrc(src);

  return (
    <InlineSVG
      src={rewriteSrc}
      title={title}
      cacheRequests
      loader={
        loader || <span style={{ width: '16px', height: '16px' }}>*</span>
      }
      onError={(error) => console.error('SVG load error:', error.message)}
      onLoad={() => {
        const svgEl = ref.current;
        if (svgEl && color) {
          svgEl.querySelectorAll('path').forEach((el) => {
            el.setAttribute('stroke', color);
            el.setAttribute('fill', color);
          });
        }
      }}
      className={className}
      innerRef={ref}
      uniqueHash='a1f8d1'
      uniquifyIDs
      height={height}
      width={width}
    />
  );
};

export default Svg;
