import {
  GET_AVAILABLE_PLANS_FOR_PROPERTY,
  GET_INDIAN_CITIES_LIST,
} from '@/lib/queries';
import { Client } from 'urql';

interface GetMealPlansParams {
  client: Client;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
  couponCode?: string;
  bankOfferCode?: string;
  applyAutoBankOffer?: boolean;
}

export const getMealPlans = async ({
  client,
  propertyId,
  checkInDate,
  checkOutDate,
  adults,
  children,
  couponCode,
  bankOfferCode,
  applyAutoBankOffer,
}: GetMealPlansParams) => {
  try {
    const filters = {
      propertyId,
      checkinDate: checkInDate,
      checkoutDate: checkOutDate,
      adults,
      children,
      ...(couponCode && { couponCode: couponCode.toUpperCase() }),
      ...(bankOfferCode && { bankOfferCode: bankOfferCode.toUpperCase() }),
      ...(applyAutoBankOffer !== undefined && { applyAutoBankOffer }),
    };

    const result = await client
      .query(GET_AVAILABLE_PLANS_FOR_PROPERTY, {
        filters,
      })
      .toPromise();

    if (result.error) {
      console.error('[getMealPlans] Failed to fetch meal plans:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('[getMealPlans] Unexpected error:', error);
    return null;
  }
};

interface FetchIndianCityDataParams {
  searchValue: string;
  client: Client;
}

export const fetchIndianCityData = async ({
  searchValue,
  client,
}: FetchIndianCityDataParams): Promise<string[] | null> => {
  if (searchValue.length < 2) return null;

  try {
    const result = await client
      .query(GET_INDIAN_CITIES_LIST, { keyword: searchValue })
      .toPromise();

    if (result.error) {
      console.error('[fetchIndianCityData] Failed:', result.error);
      return null;
    }

    return (
      result.data?.cityList?.map((city: { name: string }) => city.name) || []
    );
  } catch (error) {
    console.error('[fetchIndianCityData] Unexpected error:', error);
    return null;
  }
};
