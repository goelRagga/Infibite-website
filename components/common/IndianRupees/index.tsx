export function formatToIndianShort(number: number) {
  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
  } else if (number >= 100000) {
    return `${(number / 100000).toFixed(1).replace(/\.0$/, '')} Lac`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  } else {
    return number.toString();
  }
}
