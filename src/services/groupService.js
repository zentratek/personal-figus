import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  arrayUnion,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { updateUserGroup } from './userService';
import { getUserStickers } from './stickerService';
import { calculateStats } from './mockData';

// Characters for code generation (excluding ambiguous: 0, O, I, 1)
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generate a random group code in format XXXX-XXXX
 * @returns {string} Group code
 */
function generateGroupCode() {
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/**
 * Generate a unique group code (not already in use)
 * @returns {Promise<string>} Unique group code
 */
async function generateUniqueGroupCode() {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateGroupCode();
    const existing = await getGroupByCode(code);
    if (!existing) {
      return code;
    }
    attempts++;
  }
  throw new Error('Could not generate unique group code after 10 attempts');
}

/**
 * Create a new group
 * @param {string} userId - Creator's user ID
 * @param {string} userName - Creator's display name
 * @param {string} userPhoto - Creator's photo URL
 * @param {object} groupData - Group data (name, emoji, maxMembers)
 * @returns {Promise<object>} Created group with ID
 */
export const createGroup = async (userId, userName, userPhoto, groupData) => {
  const code = await generateUniqueGroupCode();

  const groupDoc = {
    name: groupData.name,
    code,
    emoji: groupData.emoji || '🏆',
    createdBy: userId,
    createdByName: userName,
    members: [{
      userId,
      displayName: userName,
      photoURL: userPhoto || null,
      joinedAt: Timestamp.now(),
      role: 'admin'
    }],
    memberCount: 1,
    stats: {
      totalStickers: 960,
      totalOwned: 0,
      totalNeeded: 960,
      averageCompletion: 0
    },
    settings: {
      allowInvites: true,
      maxMembers: groupData.maxMembers || 20,
      isActive: true
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const groupRef = await addDoc(collection(db, 'groups'), groupDoc);

  // Update user's groupId
  await updateUserGroup(userId, groupRef.id, code, groupData.name);

  console.log('Created group:', groupRef.id, code);

  return {
    id: groupRef.id,
    ...groupDoc
  };
};

/**
 * Get group by code
 * @param {string} code - Group code (e.g., "PB94-K7M2")
 * @returns {Promise<object|null>} Group object or null
 */
export const getGroupByCode = async (code) => {
  const groupsRef = collection(db, 'groups');
  const q = query(
    groupsRef,
    where('code', '==', code.toUpperCase()),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const groupDoc = snapshot.docs[0];
  return {
    id: groupDoc.id,
    ...groupDoc.data()
  };
};

/**
 * Get group by ID
 * @param {string} groupId - Group ID
 * @returns {Promise<object|null>} Group object or null
 */
export const getGroup = async (groupId) => {
  const groupRef = doc(db, 'groups', groupId);
  const groupDoc = await getDoc(groupRef);

  if (!groupDoc.exists()) {
    return null;
  }

  return {
    id: groupDoc.id,
    ...groupDoc.data()
  };
};

/**
 * Get user's current group
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Group object or null
 */
export const getUserGroup = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists() || !userDoc.data().groupId) {
    return null;
  }

  return getGroup(userDoc.data().groupId);
};

/**
 * Join an existing group
 * @param {string} userId - User ID
 * @param {string} userName - User's display name
 * @param {string} userPhoto - User's photo URL
 * @param {string} code - Group code
 * @returns {Promise<object>} Joined group
 */
export const joinGroup = async (userId, userName, userPhoto, code) => {
  const group = await getGroupByCode(code);

  if (!group) {
    throw new Error('Grupo no encontrado. Verificá el código.');
  }

  if (!group.settings.isActive) {
    throw new Error('Este grupo ya no está activo.');
  }

  if (group.memberCount >= group.settings.maxMembers) {
    throw new Error(`Este grupo está lleno (máximo ${group.settings.maxMembers} miembros).`);
  }

  // Check if user already in group
  if (group.members.some(m => m.userId === userId)) {
    throw new Error('Ya sos miembro de este grupo.');
  }

  // Add user to group.members
  const newMember = {
    userId,
    displayName: userName,
    photoURL: userPhoto || null,
    joinedAt: Timestamp.now(),
    role: 'member'
  };

  const groupRef = doc(db, 'groups', group.id);
  await updateDoc(groupRef, {
    members: arrayUnion(newMember),
    memberCount: increment(1),
    updatedAt: Timestamp.now()
  });

  // Update user's groupId
  await updateUserGroup(userId, group.id, group.code, group.name);

  console.log(`User ${userId} joined group ${group.id}`);

  // Return updated group
  return getGroup(group.id);
};

/**
 * Leave a group
 * @param {string} userId - User ID
 * @param {string} groupId - Group ID
 */
export const leaveGroup = async (userId, groupId) => {
  const group = await getGroup(groupId);

  if (!group) {
    throw new Error('Grupo no encontrado.');
  }

  // Remove user from members array
  const updatedMembers = group.members.filter(m => m.userId !== userId);

  // If admin leaves, transfer admin to oldest member
  const wasAdmin = group.members.find(m => m.userId === userId)?.role === 'admin';
  if (wasAdmin && updatedMembers.length > 0) {
    updatedMembers[0].role = 'admin';
  }

  const groupRef = doc(db, 'groups', groupId);

  // If last member, mark group as inactive
  if (updatedMembers.length === 0) {
    await updateDoc(groupRef, {
      members: [],
      memberCount: 0,
      'settings.isActive': false,
      updatedAt: Timestamp.now()
    });
    console.log(`Group ${groupId} is now inactive (no members)`);
  } else {
    await updateDoc(groupRef, {
      members: updatedMembers,
      memberCount: updatedMembers.length,
      updatedAt: Timestamp.now()
    });
  }

  // Clear user's groupId
  await updateUserGroup(userId, null, null, null);

  console.log(`User ${userId} left group ${groupId}`);
};

/**
 * Update group stats based on members' sticker collections
 * This should be called after any member's stickers change
 * @param {string} groupId - Group ID
 */
export const updateGroupStats = async (groupId) => {
  const group = await getGroup(groupId);

  if (!group || group.memberCount === 0) {
    return;
  }

  // Fetch all member stickers and calculate aggregate stats
  const memberStats = await Promise.all(
    group.members.map(async (member) => {
      try {
        const stickers = await getUserStickers(member.userId);
        return calculateStats(stickers);
      } catch (error) {
        console.error(`Error calculating stats for user ${member.userId}:`, error);
        return { owned: 0, repeated: 0, needed: 960, completionPct: 0 };
      }
    })
  );

  const stats = {
    totalStickers: 960 * group.memberCount,
    totalOwned: memberStats.reduce((sum, s) => sum + s.owned + s.repeated, 0),
    totalNeeded: memberStats.reduce((sum, s) => sum + s.needed, 0),
    averageCompletion: Math.round(
      memberStats.reduce((sum, s) => sum + (s.completionPct || 0), 0) / group.memberCount
    )
  };

  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    stats,
    updatedAt: Timestamp.now()
  });

  console.log(`Updated group ${groupId} stats:`, stats);
};

/**
 * Update group name and emoji (admin only)
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID (must be admin)
 * @param {object} updates - { name, emoji }
 */
export const updateGroupInfo = async (groupId, userId, updates) => {
  const group = await getGroup(groupId);

  if (!group) {
    throw new Error('Grupo no encontrado.');
  }

  // Check if user is admin
  const member = group.members.find(m => m.userId === userId);
  if (!member || member.role !== 'admin') {
    throw new Error('Solo el admin puede editar el grupo.');
  }

  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });

  console.log(`Updated group ${groupId} info:`, updates);
};
