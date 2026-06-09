import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthProvider} from './src/context/AuthContext';
import {FavoritesProvider} from './src/context/FavoritesContext';
import {ListingsProvider} from './src/context/ListingsContext';
import {RootNavigator} from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AuthProvider>
        <ListingsProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </ListingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <RootNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
