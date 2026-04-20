import Cookies from 'js-cookie';

const COOKIE_NAME = 'recently_viewed_properties';
const MAX_PROPERTIES = 10;
const COOKIE_EXPIRY_DAYS = 7;

export interface RecentlyViewedProperty {
  id: string;
  timestamp: number;
}

export const getRecentlyViewedProperties = (): string[] => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    if (!cookieValue) return [];

    const properties: RecentlyViewedProperty[] = JSON.parse(cookieValue);
    return properties.map((p) => p.id);
  } catch (error) {
    console.error('Error reading recently viewed properties:', error);
    return [];
  }
};

export const addRecentlyViewedProperty = (propertyId: string): void => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    let properties: RecentlyViewedProperty[] = cookieValue
      ? JSON.parse(cookieValue)
      : [];

    properties = properties.filter((p) => p.id !== propertyId);

    properties.unshift({
      id: propertyId,
      timestamp: Date.now(),
    });

    properties = properties.slice(0, MAX_PROPERTIES);

    Cookies.set(COOKIE_NAME, JSON.stringify(properties), {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'lax',
    });
  } catch (error) {
    console.error('Error saving recently viewed property:', error);
  }
};

export const isPropertyRecentlyViewed = (propertyId: string): boolean => {
  const recentlyViewed = getRecentlyViewedProperties();
  return recentlyViewed.includes(propertyId);
};

export const clearRecentlyViewedProperties = (): void => {
  Cookies.remove(COOKIE_NAME);
};
