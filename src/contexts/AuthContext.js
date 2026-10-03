/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return ctx;
};