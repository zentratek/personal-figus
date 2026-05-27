import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  canUseOcr as checkOcrAccess,
  canJoinGroup as checkGroupAccess,
  canAddGroupMember as checkAddMember,
  isSubscriptionActive,
  getTierDisplayName,
  getTierColor
} from '../services/subscriptionService';

/**
 * Hook to manage user subscription state and permissions
 * @param {string} userId - User ID
 * @returns {Object} Subscription state and helper functions
 */
export function useSubscription(userId) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time subscription listener
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        const data = doc.data();
        const sub = data?.subscription || {
          tier: 'free',
          ocrScansUsed: 0,
          ocrScansLimit: 5,
          validUntil: null
        };

        // Check if expired
        const validUntilMs = sub.validUntil?.toMillis ? sub.validUntil.toMillis() : sub.validUntil;
        const isExpired = validUntilMs && validUntilMs < Date.now();
        if (isExpired && sub.tier !== 'free') {
          sub.tier = 'free'; // Downgrade to free if expired
        }

        setSubscription(sub);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading subscription:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Helper functions
  const canUseOcr = async () => {
    if (!userId) return false;
    const result = await checkOcrAccess(userId);
    return result.allowed;
  };

  const canJoinGroup = async () => {
    if (!userId) return { allowed: false };
    return await checkGroupAccess(userId);
  };

  const canAddGroupMember = async (groupId) => {
    if (!userId) return { allowed: false };
    return await checkAddMember(groupId, userId);
  };

  const getOcrStatus = async () => {
    if (!userId) return { allowed: false, remaining: 0 };
    return await checkOcrAccess(userId);
  };

  // Computed properties
  const tier = subscription?.tier || 'free';
  const isActive = isSubscriptionActive(subscription);
  const isVip = tier === 'vip' && isActive;
  const isPremium = tier === 'premium' && isActive;
  const isFree = tier === 'free' || !isActive;

  const ocrScansUsed = subscription?.ocrScansUsed || 0;
  const ocrScansLimit = isVip ? Infinity : 5;
  const ocrScansRemaining = isVip ? Infinity : Math.max(0, ocrScansLimit - ocrScansUsed);

  const tierDisplayName = getTierDisplayName(tier);
  const tierColor = getTierColor(tier);

  const validUntil = subscription?.validUntil;
  const expiresAt = validUntil ? new Date(validUntil) : null;
  const daysUntilExpiry = expiresAt
    ? Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return {
    // Raw subscription data
    subscription,
    loading,

    // Tier info
    tier,
    tierDisplayName,
    tierColor,
    isActive,
    isVip,
    isPremium,
    isFree,

    // OCR info
    ocrScansUsed,
    ocrScansLimit,
    ocrScansRemaining,
    hasOcrScansLeft: ocrScansRemaining > 0,

    // Expiration info
    validUntil,
    expiresAt,
    daysUntilExpiry,

    // Permission check functions
    canUseOcr,
    canJoinGroup,
    canAddGroupMember,
    getOcrStatus
  };
}
