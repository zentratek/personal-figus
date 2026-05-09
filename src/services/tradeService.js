import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  or,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getUserStickers } from './stickerService';
import { getUsersByGroup } from './userService';

/**
 * Find matches for a user within their group
 * Returns users who have stickers I need AND need stickers I have (repeated)
 * @param {string} userId - Current user ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of match objects with compatible stickers
 */
export const findMatches = async (userId, groupId) => {
  try {
    // Get all members in the group
    const groupMembers = await getUsersByGroup(groupId);

    // Get current user's stickers
    const myStickers = await getUserStickers(userId);
    const myNeeded = myStickers.filter(s => s.status === 'needed');
    const myRepeated = myStickers.filter(s => s.status === 'repeated');

    const matches = [];

    // Check each group member (except myself)
    for (const member of groupMembers) {
      if (member.id === userId) continue;

      // Get their stickers
      const theirStickers = await getUserStickers(member.id);
      const theirRepeated = theirStickers.filter(s => s.status === 'repeated');
      const theirNeeded = theirStickers.filter(s => s.status === 'needed');

      // Find stickers they have (repeated) that I need
      const theyHaveThatINeed = theirRepeated.filter(s =>
        myNeeded.some(n => n.stickerId === s.stickerId)
      );

      // Find stickers I have (repeated) that they need
      const iHaveThatTheyNeed = myRepeated.filter(s =>
        theirNeeded.some(n => n.stickerId === s.stickerId)
      );

      // Only include if there's a match in both directions
      if (theyHaveThatINeed.length > 0 && iHaveThatTheyNeed.length > 0) {
        matches.push({
          user: member,
          theyHave: theyHaveThatINeed,
          iHave: iHaveThatTheyNeed,
          score: theyHaveThatINeed.length + iHaveThatTheyNeed.length
        });
      }
    }

    // Sort by score (most compatible first)
    return matches.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

/**
 * Create a new trade proposal
 * @param {string} fromUserId - User creating the trade
 * @param {string} fromUserName - Creator's name
 * @param {string} toUserId - User receiving the proposal
 * @param {string} toUserName - Recipient's name
 * @param {Array} offering - Stickers being offered
 * @param {Array} requesting - Stickers being requested
 * @param {string} message - Optional message
 * @returns {Promise<object>} Created trade
 */
export const createTrade = async (
  fromUserId,
  fromUserName,
  toUserId,
  toUserName,
  offering,
  requesting,
  message = ''
) => {
  const tradeDoc = {
    fromUserId,
    fromUserName,
    toUserId,
    toUserName,
    status: 'pending',
    offering: offering.map(s => ({
      stickerId: s.stickerId,
      number: s.number,
      playerName: s.playerName,
      teamName: s.teamName,
      flagCode: s.flagCode
    })),
    requesting: requesting.map(s => ({
      stickerId: s.stickerId,
      number: s.number,
      playerName: s.playerName,
      teamName: s.teamName,
      flagCode: s.flagCode
    })),
    message,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    acceptedAt: null,
    completedAt: null
  };

  const tradeRef = await addDoc(collection(db, 'trades'), tradeDoc);

  console.log('Created trade:', tradeRef.id);

  return {
    id: tradeRef.id,
    ...tradeDoc
  };
};

/**
 * Get trades for a user (sent or received)
 * @param {string} userId - User ID
 * @param {string} type - 'sent' | 'received' | 'all'
 * @returns {Promise<Array>} Array of trades
 */
export const getUserTrades = async (userId, type = 'all') => {
  const tradesRef = collection(db, 'trades');

  let q;
  if (type === 'sent') {
    q = query(tradesRef, where('fromUserId', '==', userId));
  } else if (type === 'received') {
    q = query(tradesRef, where('toUserId', '==', userId));
  } else {
    // Get both sent and received
    q = query(
      tradesRef,
      or(
        where('fromUserId', '==', userId),
        where('toUserId', '==', userId)
      )
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Update trade status
 * @param {string} tradeId - Trade ID
 * @param {string} newStatus - 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
 * @param {string} userId - User making the update
 * @returns {Promise<void>}
 */
export const updateTradeStatus = async (tradeId, newStatus, userId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data();

  // Verify user is part of this trade
  if (trade.fromUserId !== userId && trade.toUserId !== userId) {
    throw new Error('Unauthorized');
  }

  const updates = {
    status: newStatus,
    updatedAt: Timestamp.now()
  };

  // Set timestamp based on status
  if (newStatus === 'accepted') {
    updates.acceptedAt = Timestamp.now();
  } else if (newStatus === 'completed') {
    updates.completedAt = Timestamp.now();
  }

  await updateDoc(tradeRef, updates);

  console.log(`Trade ${tradeId} status updated to ${newStatus}`);
};

/**
 * Cancel a trade (only creator can cancel)
 * @param {string} tradeId - Trade ID
 * @param {string} userId - User ID (must be creator)
 */
export const cancelTrade = async (tradeId, userId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data();

  // Only creator can cancel
  if (trade.fromUserId !== userId) {
    throw new Error('Only the creator can cancel this trade');
  }

  // Can only cancel if pending
  if (trade.status !== 'pending') {
    throw new Error('Can only cancel pending trades');
  }

  await updateTradeStatus(tradeId, 'cancelled', userId);
};

/**
 * Validate that all stickers in the trade are still available
 * @param {string} userId - User ID
 * @param {Array} stickersToCheck - Stickers to validate
 * @returns {Promise<{valid: boolean, missing: Array}>}
 */
const validateStickerAvailability = async (userId, stickersToCheck) => {
  const { getUserStickers } = await import('./stickerService');
  const userStickers = await getUserStickers(userId);
  const missing = [];

  for (const sticker of stickersToCheck) {
    const userSticker = userStickers.find(s => s.stickerId === sticker.stickerId);

    // Check if sticker exists and is repeated (count >= 2)
    if (!userSticker || userSticker.status !== 'repeated' || userSticker.count < 2) {
      missing.push(sticker);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
};

/**
 * Accept a trade proposal
 * @param {string} tradeId - Trade ID
 * @param {string} userId - User ID (must be recipient)
 */
export const acceptTrade = async (tradeId, userId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data();

  // Only recipient can accept
  if (trade.toUserId !== userId) {
    throw new Error('Only the recipient can accept this trade');
  }

  // Can only accept if pending
  if (trade.status !== 'pending') {
    throw new Error('Can only accept pending trades');
  }

  // Validate that both users still have the stickers available
  const fromUserValidation = await validateStickerAvailability(trade.fromUserId, trade.offering);
  const toUserValidation = await validateStickerAvailability(trade.toUserId, trade.requesting);

  if (!fromUserValidation.valid) {
    throw new Error(`El usuario ${trade.fromUserName} ya no tiene algunas figuritas disponibles: ${fromUserValidation.missing.map(s => s.number).join(', ')}`);
  }

  if (!toUserValidation.valid) {
    throw new Error(`Ya no tenés algunas figuritas disponibles: ${toUserValidation.missing.map(s => s.number).join(', ')}`);
  }

  // Mark as completed directly when accepted
  await updateTradeStatus(tradeId, 'completed', userId);

  // Update sticker statuses for both users
  await updateUserStickersAfterTrade(
    trade.fromUserId,
    trade.offering,    // Remove these from fromUser
    trade.requesting   // Add these to fromUser
  );

  await updateUserStickersAfterTrade(
    trade.toUserId,
    trade.requesting,  // Remove these from toUser
    trade.offering     // Add these to toUser
  );

  // Recalculate stats for both users
  const { recalculateUserStats } = await import('./userService');
  await Promise.all([
    recalculateUserStats(trade.fromUserId),
    recalculateUserStats(trade.toUserId)
  ]);

  console.log('Trade completed and stats updated for both users');
};

/**
 * Reject a trade proposal
 * @param {string} tradeId - Trade ID
 * @param {string} userId - User ID (must be recipient)
 */
export const rejectTrade = async (tradeId, userId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data();

  // Only recipient can reject
  if (trade.toUserId !== userId) {
    throw new Error('Only the recipient can reject this trade');
  }

  // Can only reject if pending
  if (trade.status !== 'pending') {
    throw new Error('Can only reject pending trades');
  }

  await updateTradeStatus(tradeId, 'rejected', userId);
};

/**
 * Update user stickers after trade completion
 * @param {string} userId - User ID
 * @param {Array} stickersToRemove - Stickers to remove/decrement
 * @param {Array} stickersToAdd - Stickers to add
 */
const updateUserStickersAfterTrade = async (userId, stickersToRemove, stickersToAdd) => {
  const { getUserStickers } = await import('./stickerService');
  const { updateSticker } = await import('./stickerService');

  const userStickers = await getUserStickers(userId);

  // Remove/decrement offering stickers
  for (const stickerToRemove of stickersToRemove) {
    const userSticker = userStickers.find(s => s.stickerId === stickerToRemove.stickerId);

    if (!userSticker) continue;

    if (userSticker.count > 2) {
      // If count > 2, just decrement (still repeated)
      await updateSticker(userId, stickerToRemove.stickerId, {
        count: userSticker.count - 1,
        status: 'repeated'
      });
    } else if (userSticker.count === 2) {
      // If count == 2, decrement to 1 (becomes owned)
      await updateSticker(userId, stickerToRemove.stickerId, {
        count: 1,
        status: 'owned'
      });
    } else {
      // If count == 1, this shouldn't happen (can't trade owned stickers)
      // But just in case, mark as needed
      await updateSticker(userId, stickerToRemove.stickerId, {
        count: 0,
        status: 'needed'
      });
    }
  }

  // Add requesting stickers
  for (const stickerToAdd of stickersToAdd) {
    const userSticker = userStickers.find(s => s.stickerId === stickerToAdd.stickerId);

    if (!userSticker) continue;

    if (userSticker.status === 'needed') {
      // Needed -> Owned
      await updateSticker(userId, stickerToAdd.stickerId, {
        count: 1,
        status: 'owned'
      });
    } else if (userSticker.status === 'owned') {
      // Owned -> Repeated (count 2)
      await updateSticker(userId, stickerToAdd.stickerId, {
        count: 2,
        status: 'repeated'
      });
    } else {
      // Already repeated, increment count
      await updateSticker(userId, stickerToAdd.stickerId, {
        count: userSticker.count + 1,
        status: 'repeated'
      });
    }
  }
};

/**
 * Mark trade as completed
 * Note: In a real implementation, this would also update sticker statuses
 * @param {string} tradeId - Trade ID
 * @param {string} userId - User ID
 */
export const completeTrade = async (tradeId, userId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data();

  // Both users must be part of the trade
  if (trade.fromUserId !== userId && trade.toUserId !== userId) {
    throw new Error('Unauthorized');
  }

  // Can only complete if accepted
  if (trade.status !== 'accepted') {
    throw new Error('Can only complete accepted trades');
  }

  await updateTradeStatus(tradeId, 'completed', userId);

  // Update sticker statuses for both users
  await updateUserStickersAfterTrade(
    trade.fromUserId,
    trade.offering,    // Remove these from fromUser
    trade.requesting   // Add these to fromUser
  );

  await updateUserStickersAfterTrade(
    trade.toUserId,
    trade.requesting,  // Remove these from toUser
    trade.offering     // Add these to toUser
  );
};

/**
 * Get trade by ID
 * @param {string} tradeId - Trade ID
 * @returns {Promise<object|null>} Trade object or null
 */
export const getTrade = async (tradeId) => {
  const tradeRef = doc(db, 'trades', tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    return null;
  }

  return {
    id: tradeDoc.id,
    ...tradeDoc.data()
  };
};
