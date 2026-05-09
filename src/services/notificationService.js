import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Listen to notifications for a user
 * @param {string} userId - User ID to listen for notifications
 * @param {Function} callback - Callback function to receive notifications
 * @returns {Function} Unsubscribe function
 */
export function subscribeToNotifications(userId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    }));
    callback(notifications);
  });
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification document ID
 */
export async function markNotificationAsRead(notificationId) {
  const notifRef = doc(db, 'notifications', notificationId);
  await updateDoc(notifRef, { read: true });
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 */
export async function markAllNotificationsAsRead(userId) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await q.get();
  const updates = snapshot.docs.map(doc =>
    updateDoc(doc.ref, { read: true })
  );

  await Promise.all(updates);
}

/**
 * Create a new notification
 * @param {string} userId - User ID to receive notification
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Object} data - Additional context data
 */
export async function createNotification(userId, type, title, message, data = {}) {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type, // 'trade_received', 'trade_accepted', 'group_invite', etc.
    title,
    message,
    data, // Additional context (tradeId, groupId, etc.)
    read: false,
    timestamp: serverTimestamp(),
  });
}

/**
 * Notification types:
 * - 'trade_received': Someone sent you a trade proposal
 * - 'trade_accepted': Someone accepted your trade proposal
 * - 'trade_rejected': Someone rejected your trade proposal
 * - 'trade_cancelled': Someone cancelled a trade you received
 * - 'group_invite': Someone invited you to a group
 * - 'match_found': New matches are available
 */
