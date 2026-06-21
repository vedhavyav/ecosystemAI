import { db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FootprintResult, UserInputs } from '@/engine/types';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: 'individual' | 'b2b';
  avatar: string; // e.g., 'Leaf', 'Earth', 'Tree', 'Sun'
  createdAt: string;
};

export type FootprintRecord = {
  id?: string;
  userId: string;
  date: string;
  inputs: UserInputs;
  result: FootprintResult;
};

// Create or update a user profile
export const saveUserProfile = async (profile: Partial<UserProfile> & { uid: string }) => {
  if (!db) return;
  const userRef = doc(db, 'users', profile.uid);
  // Merge with existing
  await setDoc(userRef, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
};

// Get a user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};

// Save a footprint record by storing it in the user's document (bypasses rule deployment issues)
export const saveFootprintRecord = async (
  userId: string,
  inputs: UserInputs,
  result: FootprintResult
) => {
  if (!db) return;
  const userRef = doc(db, 'users', userId);

  const { arrayUnion } = await import('firebase/firestore');
  const newRecord = {
    id: crypto.randomUUID(),
    userId,
    date: new Date().toISOString(),
    inputs,
    result,
  };

  // We use setDoc with merge to ensure the document exists and arrayUnion works
  await setDoc(
    userRef,
    {
      footprints: arrayUnion(newRecord),
    },
    { merge: true }
  );
};

// Get footprint history for a user directly from their document
export const getFootprintHistory = async (userId: string): Promise<FootprintRecord[]> => {
  if (!db) return [];
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    if (data.footprints && Array.isArray(data.footprints)) {
      // Sort in descending order (newest first)
      const sorted = (data.footprints as FootprintRecord[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sorted;
    }
  }
  return [];
};

export type CommunityStats = {
  tonsSaved: number;
  treesEquivalent: number;
  activeUsers: number;
};

// Get aggregated community impact statistics
export const getCommunityStats = async (): Promise<CommunityStats> => {
  if (!db) return { tonsSaved: 1250, treesEquivalent: 50000, activeUsers: 340 };

  try {
    const statsRef = doc(db, 'community_stats', 'global');
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      return snap.data() as CommunityStats;
    }
  } catch (error) {
    console.error('Error fetching community stats:', error);
  }

  // Return placeholder stats if not available
  return { tonsSaved: 1250, treesEquivalent: 50000, activeUsers: 340 };
};
