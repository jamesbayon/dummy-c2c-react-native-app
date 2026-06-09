import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({value, onChangeText}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search items"
        placeholderTextColor="#8E8E93"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    color: '#111111',
    fontSize: 16,
  },
});
