import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { ListingCard } from '../components/ListingCard';
import { useListings } from '../context/ListingsContext';
import { users } from '../data/users';
import type {
  FavoritesStackParamList,
  HomeStackParamList,
  Listing,
} from '../types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'SellerProfile'>
  | NativeStackScreenProps<FavoritesStackParamList, 'SellerProfile'>;

type SellerProfileNavigation = NativeStackNavigationProp<
  HomeStackParamList & FavoritesStackParamList
>;

export function SellerProfileScreen({ route }: Props) {
  const navigation = useNavigation<SellerProfileNavigation>();
  const { listings } = useListings();
  const seller = users.find(user => user.id === route.params.sellerId);
  const sellerListings = useMemo(
    () =>
      listings.filter(listing => listing.sellerId === route.params.sellerId),
    [listings, route.params.sellerId],
  );

  const openListing = (listing: Listing) => {
    navigation.navigate('ProductDetail', { listingId: listing.id });
  };

  if (!seller) {
    return (
      <View style={styles.missingScreen}>
        <Text style={styles.missingText}>Seller not found</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={sellerListings}
      keyExtractor={item => item.id}
      numColumns={2}
      ListHeaderComponent={
        <View style={styles.header}>
          <Image source={{ uri: seller.avatar }} style={styles.avatar} />
          <Text testID="seller-name" style={styles.name}>
            {seller.name}
          </Text>
          <Text testID="seller-joined-date" style={styles.joined}>
            {seller.joinedDate}
          </Text>
          <Text testID="seller-bio" style={styles.bio}>
            {seller.bio}
          </Text>
          <Text style={styles.sectionTitle}>Listings</Text>
        </View>
      }
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <ListingCard listing={item} onPress={openListing} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F2F2F7',
  },
  name: {
    marginTop: 14,
    color: '#111111',
    fontSize: 24,
    fontWeight: '800',
  },
  joined: {
    marginTop: 6,
    color: '#777777',
    fontSize: 14,
  },
  bio: {
    marginTop: 14,
    color: '#333333',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginTop: 28,
    marginLeft: 2,
    color: '#111111',
    fontSize: 19,
    fontWeight: '800',
  },
  missingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  missingText: {
    color: '#555555',
    fontSize: 16,
  },
});
