import { useState, useEffect } from 'react';
import { User } from '../types';
import { onAuthStateChange } from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAdmin: user?.isAdmin || false
  };
};