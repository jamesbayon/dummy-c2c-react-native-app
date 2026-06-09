import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {useAuth} from '../context/AuthContext';
import type {RootStackParamList} from '../types';

export function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {register} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = register({name, email, password, bio});

    if (!result.success) {
      setError(result.error ?? 'Could not create account');
      return;
    }

    // On success the root navigator swaps to the main tabs automatically.
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>Create Account</Text>

        <TextInput
          testID="register-name-input"
          value={name}
          onChangeText={value => {
            setName(value);
            setError(null);
          }}
          autoCapitalize="words"
          placeholder="Full name"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TextInput
          testID="register-email-input"
          value={email}
          onChangeText={value => {
            setEmail(value);
            setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TextInput
          testID="register-password-input"
          value={password}
          onChangeText={value => {
            setPassword(value);
            setError(null);
          }}
          secureTextEntry
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TextInput
          testID="register-confirm-password-input"
          value={confirmPassword}
          onChangeText={value => {
            setConfirmPassword(value);
            setError(null);
          }}
          secureTextEntry
          placeholder="Confirm password"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TextInput
          testID="register-bio-input"
          value={bio}
          onChangeText={setBio}
          placeholder="Short bio (optional)"
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.bioInput]}
        />

        <TouchableOpacity
          testID="register-submit-button"
          accessibilityRole="button"
          onPress={handleSubmit}
          style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {error ? (
          <Text testID="register-error-message" style={styles.error}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          testID="go-to-login-button"
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkAccent}>Log in</Text>
          </Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    marginBottom: 28,
    color: '#E33434',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    color: '#111111',
    fontSize: 16,
  },
  bioInput: {
    minHeight: 90,
    paddingTop: 12,
  },
  button: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E33434',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  error: {
    marginTop: 12,
    color: '#E33434',
    textAlign: 'center',
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#555555',
    fontSize: 15,
  },
  linkAccent: {
    color: '#E33434',
    fontWeight: '700',
  },
});
