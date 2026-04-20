'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type VASCounts = Record<string, number>;

type VASContextType = {
  selectedCounts: VASCounts;
  setSelectedCounts: (counts: VASCounts) => void;
};

const VASContext = createContext<VASContextType | undefined>(undefined);

export const VASProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCounts, setSelectedCounts] = useState<VASCounts>({});

  return (
    <VASContext.Provider value={{ selectedCounts, setSelectedCounts }}>
      {children}
    </VASContext.Provider>
  );
};

export const useVAS = (): VASContextType => {
  const context = useContext(VASContext);
  if (!context) {
    throw new Error('useVAS must be used within a VASProvider');
  }
  return context;
};
