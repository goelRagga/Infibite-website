import Cookies from 'js-cookie';

const LOYALTY_DIALOG_COOKIE = 'loyalty_dialog_shown';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

export const hasLoyaltyDialogBeenShown = (): boolean => {
  return Cookies.get(LOYALTY_DIALOG_COOKIE) === 'true';
};

export const markLoyaltyDialogAsShown = (): void => {
  Cookies.set(LOYALTY_DIALOG_COOKIE, 'true', { expires: COOKIE_EXPIRY_DAYS });
};

export const resetLoyaltyDialogCookie = (): void => {
  Cookies.remove(LOYALTY_DIALOG_COOKIE);
};

export type ShouldShowLoyaltyDialogOptions = {
  fromNewUserSignup?: boolean;
};

export const shouldShowLoyaltyDialog = (
  userData: any,
  options?: ShouldShowLoyaltyDialogOptions
): boolean => {
  if (hasLoyaltyDialogBeenShown()) {
    return false;
  }
  if (!userData) {
    return false;
  }
  if (options?.fromNewUserSignup !== true) {
    return false;
  }
  return true;
};
