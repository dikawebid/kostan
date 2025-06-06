import { useState, useEffect } from 'react';
import { Facility } from '../types';
import { getAllFacilities, subscribeToFacilities } from '../services/facilityService';

interface UseFacilitiesReturn {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFacilities = (realtime: boolean = false): UseFacilitiesReturn => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFacilities = await getAllFacilities();
      setFacilities(fetchedFacilities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (realtime) {
      // Use real-time subscription
      const unsubscribe = subscribeToFacilities((updatedFacilities) => {
        setFacilities(updatedFacilities);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      fetchFacilities();
    }
  }, [realtime]);

  return {
    facilities,
    loading,
    error,
    refetch: fetchFacilities
  };
};