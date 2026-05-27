import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FWC and CC groups
const SPECIAL_GROUPS = [
  { code: 'FWC', name: 'FIFA World Cup', flagCode: '🏆', color1: '#FF2D8E', color2: '#C6FF3E', count: 20 },
  { code: 'CC', name: 'Coca-Cola', flagCode: '🥤', color1: '#F40009', color2: '#FFFFFF', count: 14 },
];

async function addSpecialStickersToUser(userId) {
  console.log(`\n🔄 Adding FWC and CC stickers for user: ${userId}`);

  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;
  let totalStickers = 0;

  for (const group of SPECIAL_GROUPS) {
    console.log(`\n  📦 Adding ${group.name} (${group.code} 1-${group.count})...`);

    for (let i = 1; i <= group.count; i++) {
      const stickerId = `${group.code} ${i}`;
      const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;

      // Check if sticker already exists
      const stickerRef = doc(db, 'stickers', docId);

      const stickerData = {
        userId,
        stickerId,
        albumId: 'copa-mundial-fifa-2026',
        status: 'needed',
        count: 0,
        number: i,
        team: group.code,
        teamName: group.name,
        flagCode: group.flagCode,
        playerName: `${group.name} ${i}`,
        position: 'SPECIAL',
        isSpecial: false,
        color1: group.color1,
        color2: group.color2,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      currentBatch.set(stickerRef, stickerData);
      operationCount++;
      totalStickers++;

      // Firestore batch limit is 500 operations
      if (operationCount === 500) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }

    console.log(`  ✅ ${group.name}: ${group.count} stickers queued`);
  }

  // Add the last batch if it has operations
  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  console.log(`\n  💾 Committing ${batches.length} batch(es) with ${totalStickers} total stickers...`);

  // Execute all batches
  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`  ✅ Batch ${i + 1}/${batches.length} committed`);
  }

  console.log(`\n✅ Successfully added ${totalStickers} special stickers for user ${userId}`);
  return totalStickers;
}

async function migrateAllUsers() {
  console.log('🚀 Starting migration: Adding FWC and CC stickers to all users\n');

  try {
    // Get all users from Firestore users collection
    const usersSnapshot = await getDocs(collection(db, 'users'));

    if (usersSnapshot.empty) {
      console.log('⚠️  No users found in database');
      return;
    }

    console.log(`📊 Found ${usersSnapshot.size} user(s) to migrate\n`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      try {
        await addSpecialStickersToUser(userId);
      } catch (error) {
        console.error(`❌ Error migrating user ${userId}:`, error);
      }
    }

    console.log('\n🎉 Migration completed for all users!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateAllUsers()
  .then(() => {
    console.log('\n✅ Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
