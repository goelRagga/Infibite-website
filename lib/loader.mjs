'use client';

export default function myImageLoader({ src }) {
  return `${src}`;
}

// // Docs: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
// export default function cloudfrontLoader({ src, width, quality }) {
//   const baseUrl = process.env.IMAGE_DOMAIN;
//   let relativeSrc = src;
//   if (src.startsWith(baseUrl)) {
//     relativeSrc = src.substring(baseUrl.length);
//   }

//   const url = new URL(`${process.env.IMAGE_DOMAIN}/${relativeSrc}`);
//   url.searchParams.set('format', 'auto');
//   url.searchParams.set('width', width.toString());
//   url.searchParams.set('quality', (quality || 75).toString());
//   return url.href;
// }
