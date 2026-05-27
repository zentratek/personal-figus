import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if user can use OCR scanner
 * @param {string} userId - User ID
 * @returns {Promise<Object>} { allowed: boolean, remaining: number, tier: string }
 */
export async function canUseOcr(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const data = userDoc.data();

  // Initialize subscription if doesn't exist
  if (!data?.subscription) {
    return {
      allowed: true,
      remaining: 5,
      tier: 'free'
    };
  }

  const { tier, ocrScansUsed = 0, validUntil } = data.subscription;

  // Check if subscription is expired
  const validUntilMs = validUntil?.toMillis ? validUntil.toMillis() : validUntil;
  const isExpired = validUntilMs && validUntilMs < Date.now();
  const effectiveTier = isExpired ? 'free' : tier;

  // VIP = unlimited OCR
  if (effectiveTier === 'vip') {
    return {
      allowed: true,
      remaining: Infinity,
      tier: effectiveTier
    };
  }

  // Free/Premium = 5 scans limit
  const limit = 5;
  const remaining = Math.max(0, limit - ocrScansUsed);

  return {
    allowed: remaining > 0,
    remaining,
    tier: effectiveTier
  };
}

/**
 * Increment OCR usage counter (only for non-VIP users)
 * @param {string} userId - User ID
 */
export async function incrementOcrUsage(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const data = userDoc.data();

  // Don't increment for VIP users
  if (data?.subscription?.tier === 'vip') {
    return;
  }

  // Initialize subscription if doesn't exist
  if (!data?.subscription) {
    await updateDoc(userRef, {
      subscription: {
        tier: 'free',
        ocrScansUsed: 1,
        ocrScansLimit: 5,
        validUntil: null
      }
    });
    return;
  }

  // Increment counter
  await updateDoc(userRef, {
    'subscription.ocrScansUsed': increment(1)
  });
}

/**
 * Get max group size based on tier
 * @param {string} tier - User tier (free, premium, vip)
 * @returns {number} Max group size (3 for free, Infinity for premium/vip)
 */
export function getMaxGroupSize(tier) {
  if (!tier || tier === 'free') return 3;
  return Infinity; // premium & vip = unlimited
}

/**
 * Get max number of active groups
 * @param {string} tier - User tier
 * @returns {number} Max active groups (1 for free, Infinity for premium/vip)
 */
export function getMaxActiveGroups(tier) {
  if (!tier || tier === 'free') return 1;
  return Infinity; // premium & vip = unlimited
}

/**
 * Check if user can create/join a new group
 * @param {string} userId - User ID
 * @returns {Promise<Object>} { allowed: boolean, reason: string, currentCount: number }
 */
export async function canJoinGroup(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const data = userDoc.data();

  const tier = data?.subscription?.tier || 'free';
  const validUntil = data?.subscription?.validUntil;

  // Check if subscription is expired
  const validUntilMs = validUntil?.toMillis ? validUntil.toMillis() : validUntil;
  const isExpired = validUntilMs && validUntilMs < Date.now();
  const effectiveTier = isExpired ? 'free' : tier;

  // Get user's active groups
  const groupsRef = collection(db, 'groups');
  const q = query(groupsRef, where('members', 'array-contains', userId));
  const groupsSnapshot = await getDocs(q);
  const activeGroupsCount = groupsSnapshot.size;

  const maxGroups = getMaxActiveGroups(effectiveTier);

  if (activeGroupsCount >= maxGroups) {
    return {
      allowed: false,
      reason: 'group_count_limit',
      currentCount: activeGroupsCount,
      maxGroups,
      tier: effectiveTier
    };
  }

  return {
    allowed: true,
    currentCount: activeGroupsCount,
    maxGroups,
    tier: effectiveTier
  };
}

/**
 * Check if a group can add more members
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID trying to add member
 * @returns {Promise<Object>} { allowed: boolean, reason: string }
 */
export async function canAddGroupMember(groupId, userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();

  const tier = userData?.subscription?.tier || 'free';
  const validUntil = userData?.subscription?.validUntil;

  // Check if subscription is expired
  const validUntilMs = validUntil?.toMillis ? validUntil.toMillis() : validUntil;
  const isExpired = validUntilMs && validUntilMs < Date.now();
  const effectiveTier = isExpired ? 'free' : tier;

  const groupDoc = await getDoc(doc(db, 'groups', groupId));
  const groupData = groupDoc.data();
  const currentSize = groupData?.members?.length || 0;

  const maxSize = getMaxGroupSize(effectiveTier);

  if (currentSize >= maxSize) {
    return {
      allowed: false,
      reason: 'group_size_limit',
      currentSize,
      maxSize,
      tier: effectiveTier
    };
  }

  return {
    allowed: true,
    currentSize,
    maxSize,
    tier: effectiveTier
  };
}

/**
 * Check if subscription is active (not expired)
 * @param {Object} subscription - Subscription object
 * @returns {boolean}
 */
export function isSubscriptionActive(subscription) {
  if (!subscription || subscription.tier === 'free') {
    return false;
  }

  if (!subscription.validUntil) {
    return false;
  }

  const validUntilMs = subscription.validUntil?.toMillis ? subscription.validUntil.toMillis() : subscription.validUntil;
  return validUntilMs > Date.now();
}

/**
 * Calculate expiration timestamp (3 months from now)
 * @returns {number} Timestamp
 */
export function calculateExpiration() {
  const now = new Date();
  now.setMonth(now.getMonth() + 3);
  return now.getTime();
}

/**
 * Get tier display name
 * @param {string} tier
 * @returns {string}
 */
export function getTierDisplayName(tier) {
  const names = {
    free: 'Free',
    premium: 'Premium',
    vip: 'VIP'
  };
  return names[tier] || 'Free';
}

/**
 * Get tier color for UI
 * @param {string} tier
 * @returns {string} CSS color variable
 */
export function getTierColor(tier) {
  const colors = {
    free: 'var(--muted)',
    premium: 'var(--primary)',
    vip: 'var(--lime)'
  };
  return colors[tier] || 'var(--muted)';
}

/**
 * Validate promo code
 * @param {string} code - Promo code entered by user
 * @returns {Object} { valid: boolean, discount: number }
 */
export function validatePromoCode(code) {
  const validCodes = {
    'CSF2026': { discount: 0.5, description: '50% OFF' }
  };

  const upperCode = code.toUpperCase().trim();

  if (validCodes[upperCode]) {
    return {
      valid: true,
      discount: validCodes[upperCode].discount,
      description: validCodes[upperCode].description
    };
  }

  return {
    valid: false,
    discount: 0,
    description: null
  };
}

/**
 * Calculate price after discount
 * @param {number} basePrice - Base price
 * @param {string} promoCode - Promo code
 * @returns {number} Final price
 */
export function calculatePrice(basePrice, promoCode) {
  if (!promoCode) return basePrice;

  const validation = validatePromoCode(promoCode);
  if (!validation.valid) return basePrice;

  return Math.round(basePrice * (1 - validation.discount));
}
