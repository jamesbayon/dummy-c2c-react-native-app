import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFavorites} from '../context/FavoritesContext';
import {useListings} from '../context/ListingsContext';
import {users} from '../data/users';
import type {FavoritesStackParamList, HomeStackParamList} from '../types';

type Props =
  | NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>
  | NativeStackScreenProps<FavoritesStackParamList, 'ProductDetail'>;

type ProductNavigation = NativeStackNavigationProp<
  HomeStackParamList & FavoritesStackParamList
>;

export function ProductDetailScreen({route}: Props) {
  const navigation = useNavigation<ProductNavigation>();
  const {listings} = useListings();
  const {isFavorite, toggleFavorite} = useFavorites();
  const listing =
    route.params.listing ??
    listings.find(candidate => candidate.id === route.params.listingId);

  if (!listing) {
    return (
      <View style={styles.missingScreen}>
        <Text style={styles.missingText}>Listing not found</Text>
      </View>
    );
  }

  const seller = users.find(candidate => candidate.id === listing.sellerId);
  const favorite = isFavorite(listing.id);

  const openSeller = () => {
    navigation.navigate('SellerProfile', {sellerId: listing.sellerId});
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.imageWrap}>
        <Image source={{uri: listing.images[0]}} style={styles.image} />
        {listing.isSold ? (
          <View style={styles.soldBanner}>
            <Text style={styles.soldBannerText}>SOLD</Text>
          </View>
        ) : null}
        <TouchableOpacity
          testID="favorite-button"
          accessibilityRole="button"
          onPress={() => toggleFavorite(listing.id)}
          style={styles.favoriteButton}>
          <Text style={[styles.heart, favorite && styles.heartActive]}>
            {favorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text testID="product-title" style={styles.title}>
          {listing.title}
        </Text>
        <Text testID="product-price" style={styles.price}>
          ¥{listing.price.toLocaleString()}
        </Text>
        <View style={styles.metaRow}>
          <Text testID="product-condition" style={styles.conditionBadge}>
            {listing.condition}
          </Text>
          <Text style={styles.category}>{listing.category}</Text>
        </View>
        <Text style={styles.description}>{listing.description}</Text>
        {seller ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={openSeller}
            style={styles.sellerRow}>
            <Image source={{uri: seller.avatar}} style={styles.avatar} />
            <View style={styles.sellerText}>
              <Text style={styles.sellerLabel}>Seller</Text>
              <Text style={styles.sellerName}>{seller.name}</Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          testID="view-seller-button"
          accessibilityRole="button"
          onPress={openSeller}
          style={styles.sellerButton}>
          <Text style={styles.sellerButtonText}>View Seller Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 28,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F2F2F7',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    backgroundColor: 'rgba(227,52,52,0.92)',
    alignItems: 'center',
  },
  soldBannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  heart: {
    color: '#444444',
    fontSize: 32,
    lineHeight: 35,
  },
  heartActive: {
    color: '#E33434',
  },
  details: {
    padding: 18,
  },
  title: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
  },
  price: {
    marginTop: 8,
    color: '#E33434',
    fontSize: 26,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  conditionBadge: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#FFF1F1',
    color: '#E33434',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  category: {
    color: '#555555',
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    marginTop: 18,
    color: '#333333',
    fontSize: 16,
    lineHeight: 24,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFF4',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F2F2F7',
  },
  sellerText: {
    marginLeft: 12,
  },
  sellerLabel: {
    color: '#777777',
    fontSize: 13,
  },
  sellerName: {
    marginTop: 3,
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
  },
  sellerButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E33434',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  sellerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
