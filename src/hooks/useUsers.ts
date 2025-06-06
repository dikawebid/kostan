import { useState, useEffect } from 'react';
import { User } from '../types';
import { getAllUsers, subscribeToUsers, getUserStats } from '../services/userService';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  stats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  } | null;
  refetch: () => Promise<void>;
}

export const useUsers = (realtime: boolean = false): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedUsers, userStats] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      setUsers(fetchedUsers);
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (userList: User[]) => {
    const adminUsers = userList.filter(user => user.isAdmin).length;
    setStats({
      totalUsers: userList.length,
      adminUsers,
      regularUsers: userList.length - adminUsers
    });
  };

  useEffect(() => {
    if (realtime) {
      // Use real-time subscription
      const unsubscribe = subscribeToUsers((updatedUsers) => {
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      fetchUsers();
    }
  }, [realtime]);

  return {
    users,
    loading,
    error,
    stats,
    refetch: fetchUsers
  };
};