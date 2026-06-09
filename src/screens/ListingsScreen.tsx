import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {ListingCard} from '../components/ListingCard';
import {SearchBar} from '../components/SearchBar';
import {useListings} from '../context/ListingsContext';
import type {HomeStackParamList, Listing} from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Listings'>;

export function ListingsScreen({navigation}: Props) {
  const {listings} = useListings();
  const [search, setSearch] = useState('');

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return listings;
    }

    return listings.filter(listing =>
      listing.title.toLowerCase().includes(query),
    );
  }, [listings, search]);

  const openListing = (listing: Listing) => {
    navigation.navigate('ProductDetail', {listingId: listing.id});
  };

  return (
    <View style={styles.screen}>
      <SearchBar value={search} onChangeText={setSearch} />
      <FlatList
        testID="listings-list"
        data={filteredListings}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.grid,
          filteredListings.length === 0 && styles.emptyGrid,
        ]}
        renderItem={({item}) => (
          <ListingCard listing={item} onPress={openListing} />
        )}
        ListEmptyComponent={
          <Text testID="empty-search-message" style={styles.emptyText}>
            No items found for your search
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  grid: {
    paddingHorizontal: 10,
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
