import { useState, useEffect } from "react";
import { Room } from "../types";
import {
  getAllRooms,
  getPublishedRooms,
  subscribeToRooms,
} from "../services/roomService";

interface UseRoomsReturn {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  publishedRooms: Room[];
  fetchPublishedRooms: () => Promise<void>;
}

export const useRooms = (realtime: boolean = false): UseRoomsReturn => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [publishedRooms, setPublishedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRooms = await getAllRooms();
      setRooms(fetchedRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRooms = await getPublishedRooms();
      setPublishedRooms(fetchedRooms);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch published rooms",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (realtime) {
      // Use real-time subscription
      const unsubscribe = subscribeToRooms((updatedRooms) => {
        setRooms(updatedRooms);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      fetchRooms();
    }
  }, [realtime]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    publishedRooms,
    fetchPublishedRooms: fetchPublishedRooms,
  };
};
