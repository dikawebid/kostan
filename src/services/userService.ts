import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  Timestamp,
  where 
} from 'firebase/firestore';
import { deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { db } from '../config/firebase';
import { User } from '../types';

const COLLECTION_NAME = 'users';

// Convert Firestore document to User object
const convertFirestoreUser = (doc: any): User => {
  const data = doc.data();
  return {
    uid: doc.id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    isAdmin: data.isAdmin || false,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, COLLECTION_NAME);
    const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(usersQuery);
    
    return querySnapshot.docs.map(convertFirestoreUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Get user by ID
export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, COLLECTION_NAME, uid);
    const docSnapshot = await getDoc(userDoc);
    
    if (docSnapshot.exists()) {
      return convertFirestoreUser(docSnapshot);
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

// Get admin users
export const getAdminUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, COLLECTION_NAME);
    const adminQuery = query(
      usersCollection, 
      where('isAdmin', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(adminQuery);
    
    return querySnapshot.docs.map(convertFirestoreUser);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw new Error('Failed to fetch admin users');
  }
};

// Update user admin status
export const updateUserAdminStatus = async (uid: string, isAdmin: boolean): Promise<void> => {
  try {
    const userDoc = doc(db, COLLECTION_NAME, uid);
    await updateDoc(userDoc, {
      isAdmin,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user admin status:', error);
    throw new Error('Failed to update user admin status');
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
  try {
    const userDoc = doc(db, COLLECTION_NAME, uid);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(userDoc, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

// Delete user (Firestore document only)
export const deleteUserDocument = async (uid: string): Promise<void> => {
  try {
    const userDoc = doc(db, COLLECTION_NAME, uid);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error('Error deleting user document:', error);
    throw new Error('Failed to delete user document');
  }
};

// Real-time listener for users
export const subscribeToUsers = (callback: (users: User[]) => void): (() => void) => {
  const usersCollection = collection(db, COLLECTION_NAME);
  const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
    const users = querySnapshot.docs.map(convertFirestoreUser);
    callback(users);
  }, (error) => {
    console.error('Error in users subscription:', error);
  });
  
  return unsubscribe;
};

// Real-time listener for admin users
export const subscribeToAdminUsers = (callback: (users: User[]) => void): (() => void) => {
  const usersCollection = collection(db, COLLECTION_NAME);
  const adminQuery = query(
    usersCollection, 
    where('isAdmin', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(adminQuery, (querySnapshot) => {
    const users = querySnapshot.docs.map(convertFirestoreUser);
    callback(users);
  }, (error) => {
    console.error('Error in admin users subscription:', error);
  });
  
  return unsubscribe;
};

// Get user statistics
export const getUserStats = async (): Promise<{
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}> => {
  try {
    const allUsers = await getAllUsers();
    const adminUsers = allUsers.filter(user => user.isAdmin).length;
    
    return {
      totalUsers: allUsers.length,
      adminUsers,
      regularUsers: allUsers.length - adminUsers
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw new Error('Failed to get user statistics');
  }
};