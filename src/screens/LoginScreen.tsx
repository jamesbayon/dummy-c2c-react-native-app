import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';

export function LoginScreen() {
  const {login} = useAuth();
  const [email, setEmail] = useState('user1@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const didLogin = login(email, password);
    setError(!didLogin);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>C2C Marketplace</Text>
        <TextInput
          testID="email-input"
          value={email}
          onChangeText={value => {
            setEmail(value);
            setError(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TextInput
          testID="password-input"
          value={password}
          onChangeText={value => {
            setPassword(value);
            setError(false);
          }}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#8E8E93"
          style={styles.input}
        />
        <TouchableOpacity
          testID="login-button"
          accessibilityRole="button"
          onPress={handleSubmit}
          style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {error ? (
          <Text testID="login-error-message" style={styles.error}>
            Invalid email or password
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  logo: {
    marginBottom: 28,
    color: '#E33434',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    color: '#111111',
    fontSize: 16,
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
});
