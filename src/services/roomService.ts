import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Room } from '../types';

const COLLECTION_NAME = 'rooms';

// Convert Firestore document to Room object
const convertFirestoreRoom = (doc: any): Room => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
    price: data.price,
    available: data.available,
    facilities: data.facilities || [],
    images: data.images || [],
    description: data.description,
    size: data.size,
    floor: data.floor,
    orientation: data.orientation,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

// Get all rooms
export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const roomsCollection = collection(db, COLLECTION_NAME);
    const roomsQuery = query(roomsCollection, orderBy('floor'), orderBy('name'));
    const querySnapshot = await getDocs(roomsQuery);
    
    return querySnapshot.docs.map(convertFirestoreRoom);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
};

// Get room by ID
export const getRoomById = async (id: string): Promise<Room | null> => {
  try {
    const roomDoc = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(roomDoc);
    
    if (docSnapshot.exists()) {
      return convertFirestoreRoom(docSnapshot);
    }
    return null;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw new Error('Failed to fetch room');
  }
};

// Get available rooms
export const getAvailableRooms = async (): Promise<Room[]> => {
  try {
    const roomsCollection = collection(db, COLLECTION_NAME);
    const availableQuery = query(
      roomsCollection, 
      where('available', '==', true),
      orderBy('price')
    );
    const querySnapshot = await getDocs(availableQuery);
    
    return querySnapshot.docs.map(convertFirestoreRoom);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    throw new Error('Failed to fetch available rooms');
  }
};

// Get rooms by type
export const getRoomsByType = async (type: string): Promise<Room[]> => {
  try {
    const roomsCollection = collection(db, COLLECTION_NAME);
    const typeQuery = query(
      roomsCollection, 
      where('type', '==', type),
      orderBy('price')
    );
    const querySnapshot = await getDocs(typeQuery);
    
    return querySnapshot.docs.map(convertFirestoreRoom);
  } catch (error) {
    console.error('Error fetching rooms by type:', error);
    throw new Error('Failed to fetch rooms by type');
  }
};

// Add new room
export const addRoom = async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const roomsCollection = collection(db, COLLECTION_NAME);
    const newRoom = {
      ...roomData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(roomsCollection, newRoom);
    return docRef.id;
  } catch (error) {
    console.error('Error adding room:', error);
    throw new Error('Failed to add room');
  }
};

// Update room
export const updateRoom = async (id: string, updates: Partial<Room>): Promise<void> => {
  try {
    const roomDoc = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(roomDoc, updateData);
  } catch (error) {
    console.error('Error updating room:', error);
    throw new Error('Failed to update room');
  }
};

// Delete room
export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const roomDoc = doc(db, COLLECTION_NAME, id);
    await deleteDoc(roomDoc);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error('Failed to delete room');
  }
};

// Update room availability
export const updateRoomAvailability = async (id: string, available: boolean): Promise<void> => {
  try {
    await updateRoom(id, { available });
  } catch (error) {
    console.error('Error updating room availability:', error);
    throw new Error('Failed to update room availability');
  }
};

// Real-time listener for rooms
export const subscribeToRooms = (callback: (rooms: Room[]) => void): (() => void) => {
  const roomsCollection = collection(db, COLLECTION_NAME);
  const roomsQuery = query(roomsCollection, orderBy('floor'), orderBy('name'));
  
  const unsubscribe = onSnapshot(roomsQuery, (querySnapshot) => {
    const rooms = querySnapshot.docs.map(convertFirestoreRoom);
    callback(rooms);
  }, (error) => {
    console.error('Error in rooms subscription:', error);
  });
  
  return unsubscribe;
};

// Real-time listener for available rooms
export const subscribeToAvailableRooms = (callback: (rooms: Room[]) => void): (() => void) => {
  const roomsCollection = collection(db, COLLECTION_NAME);
  const availableQuery = query(
    roomsCollection, 
    where('available', '==', true),
    orderBy('price')
  );
  
  const unsubscribe = onSnapshot(availableQuery, (querySnapshot) => {
    const rooms = querySnapshot.docs.map(convertFirestoreRoom);
    callback(rooms);
  }, (error) => {
    console.error('Error in available rooms subscription:', error);
  });
  
  return unsubscribe;
};