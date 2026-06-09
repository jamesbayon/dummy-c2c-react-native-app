import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';

import {ListingCard} from '../components/ListingCard';
import {useFavorites} from '../context/FavoritesContext';
import {useListings} from '../context/ListingsContext';
import type {FavoritesStackParamList, Listing} from '../types';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export function FavoritesScreen({navigation}: Props) {
  const {favorites} = useFavorites();
  const {listings} = useListings();
  const favoriteListings = useMemo(
    () => listings.filter(listing => favorites.includes(listing.id)),
    [favorites, listings],
  );

  const openListing = (listing: Listing) => {
    navigation.navigate('ProductDetail', {listingId: listing.id});
  };

  return (
    <FlatList
      style={styles.screen}
      data={favoriteListings}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={[
        styles.grid,
        favoriteListings.length === 0 && styles.emptyGrid,
      ]}
      renderItem={({item}) => <ListingCard listing={item} onPress={openListing} />}
      ListEmptyComponent={
        <Text testID="empty-favorites-message" style={styles.emptyText}>
          No favorites yet. Start exploring!
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 20,
  },
  emptyGrid: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#555555',
    fontSize: 16,
    textAlign: 'center',
  },
});
