import React, {createContext, useContext, useMemo, useState} from 'react';

import {listings as seededListings} from '../data/listings';
import type {Listing} from '../types';

type ListingsContextValue = {
  listings: Listing[];
  addListing: (newListing: Listing) => void;
};

const ListingsContext = createContext<ListingsContextValue | undefined>(
  undefined,
);

export function ListingsProvider({children}: {children: React.ReactNode}) {
  const [listings, setListings] = useState<Listing[]>(seededListings);

  const value = useMemo<ListingsContextValue>(
    () => ({
      listings,
      addListing: (newListing: Listing) => {
        setListings(currentListings => [newListing, ...currentListings]);
      },
    }),
    [listings],
  );

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);

  if (!context) {
    throw new Error('useListings must be used within ListingsProvider');
  }

  return context;
}
