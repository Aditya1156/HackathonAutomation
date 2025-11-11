import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserRole = 'student' | 'admin' | 'judge' | 'mentor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  teamId?: string; // For students
  judgeId?: string; // For judges
  createdAt: string;
  lastLogin: string;
}

const USERS_COLLECTION = 'users';

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'student',
  additionalData?: { teamId?: string; judgeId?: string }
): Promise<UserProfile> => {
  try {
    // Create auth user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      teamId: additionalData?.teamId,
      judgeId: additionalData?.judgeId,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return userProfile;
  } catch (error: any) {
    console.error('Error registering user:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    throw new Error('Failed to register user');
  }
};

/**
 * Sign in with email and password
 */
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateLastLogin(user.uid);

    // Get user profile
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    return userProfile;
  } catch (error: any) {
    console.error('Error logging in:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later');
    }
    throw new Error('Failed to log in');
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to log out');
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLogin: data.lastLogin?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update last login timestamp
 */
const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, { lastLogin: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    delete updates.uid; // Don't update uid
    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email');
    }
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user has specific role
 */
export const checkUserRole = async (uid: string, role: UserRole): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.role === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Link team to student user
 */
export const linkTeamToUser = async (uid: string, teamId: string): Promise<void> => {
  try {
    await updateUserProfile(uid, { teamId });
  } catch (error) {
    console.error('Error linking team to user:', error);
    throw new Error('Failed to link team to user');
  }
};

/**
 * Link judge profile to user
 */
export const linkJudgeToUser = async (uid: string, judgeId: string): Promise<void> => {
  try {
    await updateUserProfile(uid, { judgeId });
  } catch (error) {
    console.error('Error linking judge to user:', error);
    throw new Error('Failed to link judge to user');
  }
};
