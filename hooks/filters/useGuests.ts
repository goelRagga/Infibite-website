import { FilterContext, GuestsData, initialFilterState } from '@/contexts';
import { useContext, useCallback } from 'react';

export const useGuests = () => {
  const { guestsData, setGuestsData, updateGuestParams, clearGuestParams } =
    useContext(FilterContext);

  const updateAdultGuests = useCallback(
    (count: number, updateUrl = true) => {
      setGuestsData((prev) => ({
        ...prev,
        numberOfGuests: count,
      }));

      if (updateUrl) {
        const updatedGuestData = { ...guestsData, numberOfGuests: count };
        updateGuestParams(updatedGuestData);
      }
    },
    [setGuestsData, updateGuestParams, guestsData]
  );

  const updateChildGuests = useCallback(
    (count: number, updateUrl = true) => {
      setGuestsData((prev) => ({
        ...prev,
        numberOfChildren: count,
      }));

      if (updateUrl) {
        const updatedGuestData = { ...guestsData, numberOfChildren: count };

        updateGuestParams(updatedGuestData);
      }
    },
    [setGuestsData, updateGuestParams, guestsData]
  );

  const updateGuestData = useCallback(
    (updates: Partial<GuestsData>, updateUrl = true) => {
      const updatedGuestData = { ...guestsData, ...updates };
      setGuestsData(updatedGuestData);

      if (updateUrl) {
        updateGuestParams(updatedGuestData);
      }
    },
    [guestsData, setGuestsData, updateGuestParams]
  );
  const updatePetGuests = useCallback(
    (count: number, updateUrl = true) => {
      setGuestsData((prev) => ({
        ...prev,
        numberOfPets: count,
      }));

      if (updateUrl) {
        const updatedGuestData = { ...guestsData, numberOfPets: count };
        updateGuestParams(updatedGuestData);
      }
    },
    [setGuestsData, guestsData]
  );

  const isWithinOccupancyLimits = useCallback(() => {
    const totalGuests = guestsData.numberOfGuests + guestsData.numberOfChildren;
    return totalGuests <= guestsData.max_occupancy;
  }, [guestsData]);

  return {
    guestsData,
    updateAdultGuests,
    updateChildGuests,
    updatePetGuests,
    updateGuestData,
    clearGuestParams,
    isWithinOccupancyLimits,
    totalGuests: guestsData.numberOfGuests + guestsData.numberOfChildren,
  };
};
