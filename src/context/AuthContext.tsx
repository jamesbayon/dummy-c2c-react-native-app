import React, {createContext, useContext, useMemo, useState} from 'react';

import {users as seedUsers} from '../data/users';
import type {User} from '../types';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  bio?: string;
};

export type RegisterResult = {
  success: boolean;
  error?: string;
};

type AuthContextValue = {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (input: RegisterInput) => RegisterResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildJoinedDate() {
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return `Joined ${formatted}`;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [allUsers, setAllUsers] = useState<User[]>(seedUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      login: (email: string, password: string) => {
        const user = allUsers.find(
          candidate =>
            candidate.email.toLowerCase() === email.trim().toLowerCase() &&
            candidate.password === password,
        );

        if (!user) {
          return false;
        }

        setCurrentUser(user);
        return true;
      },
      register: ({name, email, password, bio}: RegisterInput): RegisterResult => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail || !password) {
          return {
            success: false,
            error: 'Name, email, and password are required',
          };
        }

        if (!EMAIL_PATTERN.test(trimmedEmail)) {
          return {success: false, error: 'Enter a valid email address'};
        }

        if (password.length < 6) {
          return {
            success: false,
            error: 'Password must be at least 6 characters',
          };
        }

        const emailTaken = allUsers.some(
          candidate =>
            candidate.email.toLowerCase() === trimmedEmail.toLowerCase(),
        );

        if (emailTaken) {
          return {
            success: false,
            error: 'An account with this email already exists',
          };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          password,
          avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(
            trimmedEmail,
          )}`,
          bio: bio?.trim() || 'New to C2C Marketplace.',
          joinedDate: buildJoinedDate(),
        };

        setAllUsers(current => [...current, newUser]);
        setCurrentUser(newUser);
        return {success: true};
      },
      logout: () => setCurrentUser(null),
    }),
    [allUsers, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
