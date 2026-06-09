import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.profile}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <Text testID="profile-name" style={styles.name}>
          {currentUser.name}
        </Text>
        <Text testID="profile-email" style={styles.email}>
          {currentUser.email}
        </Text>
        <Text testID="profile-joined-date" style={styles.joined}>
          {currentUser.joinedDate}
        </Text>
        <Text testID="profile-bio" style={styles.bio}>
          {currentUser.bio}
        </Text>
      </View>
      <TouchableOpacity
        testID="logout-button"
        accessibilityRole="button"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 22,
  },
  profile: {
    alignItems: 'center',
    paddingTop: 32,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#F2F2F7',
  },
  name: {
    marginTop: 16,
    color: '#111111',
    fontSize: 25,
    fontWeight: '800',
  },
  email: {
    marginTop: 6,
    color: '#555555',
    fontSize: 16,
  },
  joined: {
    marginTop: 10,
    color: '#777777',
    fontSize: 14,
  },
  bio: {
    marginTop: 20,
    color: '#333333',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  logoutButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E33434',
    marginBottom: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
