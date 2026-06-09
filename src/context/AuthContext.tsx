import React, {createContext, useContext, useMemo, useState} from 'react';

import {users} from '../data/users';
import type {User} from '../types';

type AuthContextValue = {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      login: (email: string, password: string) => {
        const user = users.find(
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
      logout: () => setCurrentUser(null),
    }),
    [currentUser],
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
