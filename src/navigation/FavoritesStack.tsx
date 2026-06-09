import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {FavoritesScreen} from '../screens/FavoritesScreen';
import {ProductDetailScreen} from '../screens/ProductDetailScreen';
import {SellerProfileScreen} from '../screens/SellerProfileScreen';
import type {FavoritesStackParamList} from '../types';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{title: 'Favorites'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Item Details'}}
      />
      <Stack.Screen
        name="SellerProfile"
        component={SellerProfileScreen}
        options={{title: 'Seller Profile'}}
      />
    </Stack.Navigator>
  );
}
