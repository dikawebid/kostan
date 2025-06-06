import { useState, useEffect } from 'react';
import { Room } from '../types';
import { getRoomById } from '../services/roomService';

interface UseRoomReturn {
  room: Room | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoom = (id: string | null): UseRoomReturn => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = async () => {
    if (!id) {
      setRoom(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedRoom = await getRoomById(id);
      setRoom(fetchedRoom);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  return {
    room,
    loading,
    error,
    refetch: fetchRoom
  };
};