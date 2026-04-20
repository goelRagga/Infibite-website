// for getting date
export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = `'${date.getFullYear().toString().slice(-2)}`;
  return `${day} ${month} ${year}`;
};

export const formatDateWithFullYear = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = `${date.getFullYear().toString().slice(0)}`;
  return `${day} ${month}, ${year}`;
};

// for getting day
export const getDayAbbreviation = (dateString: any) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', { weekday: 'short' });
};
