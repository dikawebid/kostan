import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { User } from '../types';

// Convert Firebase User to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Check if user is admin
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();
  
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAdmin: userData?.isAdmin || false
  };
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await convertFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw new Error('Failed to sign in with email and password');
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      displayName,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return await convertFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw new Error('Failed to create account');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return await convertFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw new Error('Failed to sign in with Google');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Check if user is admin
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();
    return userData?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Make user admin (only for development/setup)
export const makeUserAdmin = async (uid: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), {
      isAdmin: true,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error making user admin:', error);
    throw new Error('Failed to update admin status');
  }
};