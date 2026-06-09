import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

type FavoritesContextValue = {
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({children}: {children: React.ReactNode}) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = useCallback((listingId: string) => {
    setFavorites(currentFavorites =>
      currentFavorites.includes(listingId)
        ? currentFavorites.filter(id => id !== listingId)
        : [...currentFavorites, listingId],
    );
  }, []);

  const isFavorite = useCallback(
    (listingId: string) => favorites.includes(listingId),
    [favorites],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({favorites, toggleFavorite, isFavorite}),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}
