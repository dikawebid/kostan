import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Facility } from '../types';

const COLLECTION_NAME = 'facilities';

// Convert Firestore document to Facility object
const convertFirestoreFacility = (doc: any): Facility => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    icon: data.icon,
    description: data.description,
    category: data.category,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

// Get all facilities
export const getAllFacilities = async (): Promise<Facility[]> => {
  try {
    const facilitiesCollection = collection(db, COLLECTION_NAME);
    const facilitiesQuery = query(facilitiesCollection, orderBy('category'), orderBy('name'));
    const querySnapshot = await getDocs(facilitiesQuery);
    
    return querySnapshot.docs.map(convertFirestoreFacility);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw new Error('Failed to fetch facilities');
  }
};

// Get facility by ID
export const getFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const facilityDoc = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(facilityDoc);
    
    if (docSnapshot.exists()) {
      return convertFirestoreFacility(docSnapshot);
    }
    return null;
  } catch (error) {
    console.error('Error fetching facility:', error);
    throw new Error('Failed to fetch facility');
  }
};

// Add new facility
export const addFacility = async (facilityData: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const facilitiesCollection = collection(db, COLLECTION_NAME);
    const newFacility = {
      ...facilityData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(facilitiesCollection, newFacility);
    return docRef.id;
  } catch (error) {
    console.error('Error adding facility:', error);
    throw new Error('Failed to add facility');
  }
};

// Update facility
export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<void> => {
  try {
    const facilityDoc = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(facilityDoc, updateData);
  } catch (error) {
    console.error('Error updating facility:', error);
    throw new Error('Failed to update facility');
  }
};

// Delete facility
export const deleteFacility = async (id: string): Promise<void> => {
  try {
    const facilityDoc = doc(db, COLLECTION_NAME, id);
    await deleteDoc(facilityDoc);
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw new Error('Failed to delete facility');
  }
};

// Real-time listener for facilities
export const subscribeToFacilities = (callback: (facilities: Facility[]) => void): (() => void) => {
  const facilitiesCollection = collection(db, COLLECTION_NAME);
  const facilitiesQuery = query(facilitiesCollection, orderBy('category'), orderBy('name'));
  
  const unsubscribe = onSnapshot(facilitiesQuery, (querySnapshot) => {
    const facilities = querySnapshot.docs.map(convertFirestoreFacility);
    callback(facilities);
  }, (error) => {
    console.error('Error in facilities subscription:', error);
  });
  
  return unsubscribe;
};

// Seed default facilities
export const seedDefaultFacilities = async (): Promise<void> => {
  const defaultFacilities: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Basic facilities
    { name: 'WiFi', icon: 'wifi', description: 'Internet berkecepatan tinggi', category: 'basic' },
    { name: 'Listrik', icon: 'zap', description: 'Listrik 24 jam', category: 'basic' },
    { name: 'Air', icon: 'droplets', description: 'Air bersih 24 jam', category: 'basic' },
    { name: 'Keamanan', icon: 'shield', description: 'Keamanan 24 jam', category: 'basic' },
    
    // Comfort facilities
    { name: 'AC', icon: 'snowflake', description: 'Air conditioning', category: 'comfort' },
    { name: 'Kamar Mandi Dalam', icon: 'bath', description: 'Kamar mandi pribadi', category: 'comfort' },
    { name: 'Lemari', icon: 'cabinet', description: 'Lemari pakaian', category: 'comfort' },
    { name: 'Meja Belajar', icon: 'desk', description: 'Meja dan kursi belajar', category: 'comfort' },
    { name: 'Kasur', icon: 'bed-double', description: 'Kasur nyaman', category: 'comfort' },
    { name: 'Jendela', icon: 'sun', description: 'Pencahayaan alami', category: 'comfort' },
    
    // Premium facilities
    { name: 'Balkon', icon: 'home', description: 'Balkon pribadi', category: 'premium' },
    { name: 'Parkir Motor', icon: 'bike', description: 'Parkir motor', category: 'premium' },
    { name: 'Parkir Mobil', icon: 'car', description: 'Parkir mobil', category: 'premium' },
    { name: 'Dapur Kecil', icon: 'chef-hat', description: 'Dapur mini', category: 'premium' },
    { name: 'TV', icon: 'tv', description: 'Televisi', category: 'premium' },
    { name: 'Kulkas', icon: 'refrigerator', description: 'Kulkas mini', category: 'premium' }
  ];

  try {
    for (const facility of defaultFacilities) {
      await addFacility(facility);
    }
    console.log('Default facilities seeded successfully');
  } catch (error) {
    console.error('Error seeding default facilities:', error);
  }
};