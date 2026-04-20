import { useContext } from 'react';
import { PropertyContext } from './property-context';

export function usePropertyContext() {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error(
      'usePropertyContext must be used within a PropertyProvider'
    );
  }

  return context;
}
