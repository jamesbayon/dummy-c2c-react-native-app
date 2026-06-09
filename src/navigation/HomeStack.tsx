import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {ListingsScreen} from '../screens/ListingsScreen';
import {ProductDetailScreen} from '../screens/ProductDetailScreen';
import {SellerProfileScreen} from '../screens/SellerProfileScreen';
import type {HomeStackParamList} from '../types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Listings"
        component={ListingsScreen}
        options={{title: 'C2C Marketplace'}}
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
