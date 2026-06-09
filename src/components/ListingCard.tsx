import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFavorites} from '../context/FavoritesContext';
import type {Listing} from '../types';

type ListingCardProps = {
  listing: Listing;
  onPress: (listing: Listing) => void;
};

export function ListingCard({listing, onPress}: ListingCardProps) {
  const {isFavorite, toggleFavorite} = useFavorites();
  const favorite = isFavorite(listing.id);

  return (
    <Pressable
      testID={`listing-card-${listing.id}`}
      accessibilityRole="button"
      onPress={() => onPress(listing)}
      style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{uri: listing.images[0]}} style={styles.image} />
        {listing.isSold ? (
          <View testID={`sold-badge-${listing.id}`} style={styles.soldBadge}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        ) : null}
        <TouchableOpacity
          testID={`favorite-button-${listing.id}`}
          accessibilityRole="button"
          onPress={event => {
            event.stopPropagation();
            toggleFavorite(listing.id);
          }}
          style={styles.favoriteButton}>
          <Text style={[styles.heart, favorite && styles.heartActive]}>
            {favorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {listing.title}
        </Text>
        <Text style={styles.price}>¥{listing.price.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    overflow: 'hidden',
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: '#F2F2F7',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 4,
    backgroundColor: '#E33434',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soldText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  heart: {
    color: '#444444',
    fontSize: 24,
    lineHeight: 27,
  },
  heartActive: {
    color: '#E33434',
  },
  content: {
    minHeight: 74,
    padding: 10,
  },
  title: {
    minHeight: 38,
    color: '#111111',
    fontSize: 14,
    lineHeight: 19,
  },
  price: {
    marginTop: 6,
    color: '#E33434',
    fontSize: 16,
    fontWeight: '700',
  },
});
