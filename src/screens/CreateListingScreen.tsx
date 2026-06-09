import { CommonActions, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import type { Category, ListingCondition, MainTabParamList } from '../types';
import { categories, conditions } from '../types';

type FormErrors = Partial<
  Record<'title' | 'price' | 'category' | 'condition', string>
>;

export function CreateListingScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { currentUser } = useAuth();
  const { addListing } = useListings();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<ListingCondition | ''>('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required';
    }

    if (!price.trim()) {
      nextErrors.price = 'Price is required';
    }

    if (!category) {
      nextErrors.category = 'Category is required';
    }

    if (!condition) {
      nextErrors.condition = 'Condition is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !currentUser || !category || !condition) {
      return;
    }

    const id = Date.now().toString();

    addListing({
      id,
      title: title.trim(),
      price: Number(price) || 0,
      images: [`https://picsum.photos/300/300?random=${id}`],
      category,
      condition,
      description: description.trim() || 'No description provided.',
      sellerId: currentUser.id,
      isSold: false,
    });

    setTitle('');
    setPrice('');
    setCategory('');
    setCondition('');
    setDescription('');
    setErrors({});

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            state: {
              index: 0,
              routes: [{ name: 'Listings' }],
            },
          },
          { name: 'Sell' },
          { name: 'Favorites' },
          { name: 'Profile' },
        ],
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        testID="create-listing-scroll"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity accessibilityRole="button" style={styles.photoBox}>
          <Text style={styles.photoText}>Add Photo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Title</Text>
        <TextInput
          testID="listing-title-input"
          value={title}
          onChangeText={value => {
            setTitle(value);
            setErrors(current => ({ ...current, title: undefined }));
          }}
          placeholder="What are you selling?"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        {errors.title ? (
          <Text testID="listing-title-error" style={styles.error}>
            {errors.title}
          </Text>
        ) : null}

        <Text style={styles.label}>Price</Text>
        <TextInput
          testID="listing-price-input"
          value={price}
          onChangeText={value => {
            setPrice(value.replace(/[^0-9]/g, ''));
            setErrors(current => ({ ...current, price: undefined }));
          }}
          keyboardType="numeric"
          placeholder="¥0"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        {errors.price ? (
          <Text testID="listing-price-error" style={styles.error}>
            {errors.price}
          </Text>
        ) : null}

        <Text style={styles.label}>Category</Text>
        <View style={styles.optionGrid}>
          {categories.map(option => (
            <TouchableOpacity
              key={option}
              testID={`category-option-${option}`}
              accessibilityRole="button"
              onPress={() => {
                setCategory(option);
                setErrors(current => ({ ...current, category: undefined }));
              }}
              style={[
                styles.option,
                category === option && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  category === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category ? (
          <Text testID="listing-category-error" style={styles.error}>
            {errors.category}
          </Text>
        ) : null}

        <Text style={styles.label}>Condition</Text>
        <View style={styles.optionGrid}>
          {conditions.map(option => (
            <TouchableOpacity
              key={option}
              testID={`condition-option-${option}`}
              accessibilityRole="button"
              onPress={() => {
                setCondition(option);
                setErrors(current => ({ ...current, condition: undefined }));
              }}
              style={[
                styles.option,
                condition === option && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  condition === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.condition ? (
          <Text testID="listing-condition-error" style={styles.error}>
            {errors.condition}
          </Text>
        ) : null}

        <Text style={styles.label}>Description</Text>
        <TextInput
          testID="listing-description-input"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details about condition, size, or shipping."
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.descriptionInput]}
        />

        <TouchableOpacity
          testID="listing-submit-button"
          accessibilityRole="button"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitText}>List Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  photoBox: {
    height: 150,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C7C7CC',
    borderRadius: 8,
    backgroundColor: '#F9F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  photoText: {
    color: '#E33434',
    fontSize: 17,
    fontWeight: '700',
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 14,
    color: '#111111',
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 110,
    paddingTop: 12,
  },
  error: {
    marginTop: 6,
    color: '#E33434',
    fontSize: 13,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#E33434',
    backgroundColor: '#FFF1F1',
  },
  optionText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#E33434',
  },
  submitButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E33434',
    marginTop: 26,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
