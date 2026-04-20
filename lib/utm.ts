// lib/utm.ts
export const saveUTMParamsToLocalStorage = (): void => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);

  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];

  utmParams.forEach((param) => {
    const value = urlParams?.getAll(param); // get all if duplicated
    if (value?.length > 0) {
      // Save as single string or array, your choice
      localStorage.setItem(param, value?.join(','));
    }
  });
};
