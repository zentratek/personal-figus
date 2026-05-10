import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create or update user profile in Firestore
 * Called after login to ensure user document exists
 * @param {string} uid - User ID from Firebase Auth
 * @param {object} userData - User data from Firebase Auth
 */
export const createOrUpdateUserProfile = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  const profileData = {
    uid,
    displayName: userData.displayName || 'Usuario',
    email: userData.email,
    photoURL: userData.photoURL || null,
    lastActive: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  if (!userDoc.exists()) {
    // First time user - create profile
    await setDoc(userRef, {
      ...profileData,
      groupId: null,
      groupCode: null,
      groupName: null,
      stats: {
        needed: 960,
        owned: 0,
        repeated: 0,
        completionPct: 0
      },
      // Initialize subscription (FREE tier by default)
      subscription: {
        tier: 'free',
        ocrScansUsed: 0,
        ocrScansLimit: 5,
        validUntil: null,
        activatedAt: null,
        activatedBy: null,
        promoCode: null,
        amountPaid: null,
        paymentMethod: null,
        history: []
      },
      createdAt: Timestamp.now()
    });
    console.log('Created new user profile:', uid);
  } else {
    // Existing user - update profile
    await updateDoc(userRef, profileData);
    console.log('Updated user profile:', uid);
  }
};

/**
 * Get user profile from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<object|null>} User profile or null
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data()
  };
};

/**
 * Update user's group membership
 * @param {string} uid - User ID
 * @param {string|null} groupId - Group ID or null to clear
 * @param {string|null} groupCode - Group code or null
 * @param {string|null} groupName - Group name or null
 */
export const updateUserGroup = async (uid, groupId, groupCode, groupName) => {
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    groupId: groupId || null,
    groupCode: groupCode || null,
    groupName: groupName || null,
    updatedAt: Timestamp.now()
  });

  console.log(`Updated user ${uid} group:`, { groupId, groupCode, groupName });
};

/**
 * Calculate user stats from their stickers
 * @param {string} uid - User ID
 * @returns {Promise<object>} Calculated stats
 */
export const calculateUserStats = async (uid) => {
  const { getUserStickers } = await import('./stickerService');
  const stickers = await getUserStickers(uid);

  const stats = {
    needed: 0,
    owned: 0,
    repeated: 0,
    completionPct: 0
  };

  stickers.forEach(sticker => {
    if (sticker.status === 'needed') {
      stats.needed++;
    } else if (sticker.status === 'owned') {
      stats.owned++;
    } else if (sticker.status === 'repeated') {
      stats.repeated++;
    }
  });

  const totalStickers = stickers.length;
  const ownedAndRepeated = stats.owned + stats.repeated;
  stats.completionPct = totalStickers > 0 ? Math.round((ownedAndRepeated / totalStickers) * 100) : 0;

  return stats;
};

/**
 * Recalculate and update user stats from their current stickers
 * @param {string} uid - User ID
 */
export const recalculateUserStats = async (uid) => {
  const stats = await calculateUserStats(uid);
  await updateUserStats(uid, stats);
  return stats;
};

/**
 * Update user stats (called after sticker changes)
 * @param {string} uid - User ID
 * @param {object} stats - Stats object with needed, owned, repeated, completionPct
 */
export const updateUserStats = async (uid, stats) => {
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    stats: {
      needed: stats.needed || 0,
      owned: stats.owned || 0,
      repeated: stats.repeated || 0,
      completionPct: stats.completionPct || 0
    },
    updatedAt: Timestamp.now()
  });

  console.log(`Updated user ${uid} stats:`, stats);
};

/**
 * Update last active timestamp
 * @param {string} uid - User ID
 */
export const updateLastActive = async (uid) => {
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    lastActive: Timestamp.now()
  });
};

/**
 * Get all users (for admin purposes or matching)
 * @returns {Promise<Array>} Array of user profiles
 */
export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Get users by group ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of user profiles in the group
 */
export const getUsersByGroup = async (groupId) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('groupId', '==', groupId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
