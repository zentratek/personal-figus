import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Delete ALL stickers for a user (to force re-initialization with new format)
 * WARNING: This permanently deletes all user sticker data
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of stickers deleted
 */
export const resetUserStickers = async (userId) => {
  console.log(`🗑️  Deleting all stickers for user ${userId}...`);

  const stickersRef = collection(db, 'stickers');
  const q = query(
    stickersRef,
    where('userId', '==', userId),
    where('albumId', '==', 'copa-mundial-fifa-2026')
  );

  const snapshot = await getDocs(q);
  const totalStickers = snapshot.docs.length;

  if (totalStickers === 0) {
    console.log('No stickers to delete');
    return 0;
  }

  console.log(`Found ${totalStickers} stickers to delete`);

  // Firestore batch limit is 500 operations
  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;

  snapshot.docs.forEach((docSnapshot) => {
    currentBatch.delete(doc(db, 'stickers', docSnapshot.id));
    operationCount++;

    if (operationCount === 500) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      operationCount = 0;
    }
  });

  // Add the last batch if it has operations
  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  console.log(`Deleting in ${batches.length} batches...`);

  // Execute all batches in parallel
  await Promise.all(batches.map((batch, index) => {
    console.log(`Committing delete batch ${index + 1}/${batches.length}...`);
    return batch.commit();
  }));

  console.log(`✅ Successfully deleted ${totalStickers} stickers for user ${userId}`);
  return totalStickers;
};
