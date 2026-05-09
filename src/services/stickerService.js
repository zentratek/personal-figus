import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Update a sticker document in Firestore
 * @param {string} userId - User ID
 * @param {string} stickerId - Sticker ID (e.g., "ARG 1")
 * @param {object} updates - Fields to update
 */
export const updateSticker = async (userId, stickerId, updates) => {
  const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;
  const stickerRef = doc(db, 'stickers', docId);

  await updateDoc(stickerRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

/**
 * Get all stickers for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of sticker objects
 */
export const getUserStickers = async (userId) => {
  const stickersRef = collection(db, 'stickers');
  const q = query(
    stickersRef,
    where('userId', '==', userId),
    where('albumId', '==', 'copa-mundial-fifa-2026')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Get a single sticker by ID
 * @param {string} userId - User ID
 * @param {string} stickerId - Sticker ID (e.g., "ARG 1")
 * @returns {Promise<Object|null>} Sticker object or null if not found
 */
export const getSticker = async (userId, stickerId) => {
  const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;
  const stickerRef = doc(db, 'stickers', docId);
  const snapshot = await getDoc(stickerRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};

/**
 * Update sticker status and count
 * @param {string} userId - User ID
 * @param {string} stickerId - Sticker ID
 * @param {string} newStatus - "needed" | "owned" | "repeated"
 * @param {number} count - Count for repeated stickers
 */
export const updateStickerStatus = async (userId, stickerId, newStatus, count = 1) => {
  const updates = {
    status: newStatus,
    count: newStatus === 'repeated' ? count : newStatus === 'owned' ? 1 : 0
  };

  await updateSticker(userId, stickerId, updates);
};
