import type {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import {CreateListingScreen} from '../screens/CreateListingScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import type {MainTabParamList} from '../types';
import {FavoritesStack} from './FavoritesStack';
import {HomeStack} from './HomeStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, string> = {
  Home: '▦',
  Sell: '+',
  Favorites: '♥',
  Profile: '●',
};

const tabTestIDs: Record<keyof MainTabParamList, string> = {
  Home: 'tab-home',
  Sell: 'tab-sell',
  Favorites: 'tab-favorites',
  Profile: 'tab-profile',
};

function createTabButton(testID: string) {
  return function TabButton({
    children,
    style,
    onPress,
    onLongPress,
    accessibilityLabel,
    accessibilityState,
  }: BottomTabBarButtonProps) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        onPress={onPress}
        onLongPress={onLongPress}
        style={style}>
        {children}
      </Pressable>
    );
  };
}

const tabButtonByRoute: Record<
  keyof MainTabParamList,
  (props: BottomTabBarButtonProps) => React.ReactNode
> = {
  Home: createTabButton(tabTestIDs.Home),
  Sell: createTabButton(tabTestIDs.Sell),
  Favorites: createTabButton(tabTestIDs.Favorites),
  Profile: createTabButton(tabTestIDs.Profile),
};

const tabIconByRoute: Record<
  keyof MainTabParamList,
  BottomTabNavigationOptions['tabBarIcon']
> = {
  Home: ({color, focused}) => (
    <Text style={[styles.icon, {color}, focused && styles.iconFocused]}>
      {tabIcons.Home}
    </Text>
  ),
  Sell: ({color, focused}) => (
    <Text
      style={[
        styles.icon,
        styles.sellIcon,
        {color},
        focused && styles.iconFocused,
      ]}>
      {tabIcons.Sell}
    </Text>
  ),
  Favorites: ({color, focused}) => (
    <Text style={[styles.icon, {color}, focused && styles.iconFocused]}>
      {tabIcons.Favorites}
    </Text>
  ),
  Profile: ({color, focused}) => (
    <Text style={[styles.icon, {color}, focused && styles.iconFocused]}>
      {tabIcons.Profile}
    </Text>
  ),
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E33434',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: tabIconByRoute[route.name],
        tabBarButton: tabButtonByRoute[route.name],
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen
        name="Sell"
        component={CreateListingScreen}
        options={{headerShown: true, title: 'Sell an Item'}}
      />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: true, title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#EFEFF4',
    height: 84,
    paddingTop: 8,
    paddingBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  sellIcon: {
    fontSize: 28,
    lineHeight: 28,
  },
  iconFocused: {
    fontWeight: '900',
  },
});
