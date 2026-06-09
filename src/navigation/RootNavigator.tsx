import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {useAuth} from '../context/AuthContext';
import {LoginScreen} from '../screens/LoginScreen';
import type {RootStackParamList} from '../types';
import {MainTabs} from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#E33434',
  },
};

export function RootNavigator() {
  const {currentUser} = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: '#FFFFFF'},
          headerTintColor: '#111111',
          headerTitleStyle: {fontWeight: '800'},
          headerShadowVisible: true,
        }}>
        {currentUser ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
