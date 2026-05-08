import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { TEAMS } from './mockData';

/**
 * Initialize all 960 stickers for a new user in Firestore
 * Creates stickers in "needed" status by default
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const initializeUserStickers = async (userId) => {
  console.log(`Initializing 960 stickers for user ${userId}...`);

  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;
  let totalStickers = 0;

  TEAMS.forEach(team => {
    for (let i = 0; i < 20; i++) {
      const number = team.range[0] + i;
      const stickerId = `${team.code}-${String(number).padStart(3, '0')}`;
      const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;

      // Determine position and player name
      let position, playerName;
      if (i === 0) {
        position = 'BADGE';
        playerName = `Escudo ${team.name}`;
      } else if (i === 1) {
        position = 'GROUP';
        playerName = `Equipo ${team.name}`;
      } else {
        position = ['DEL', 'MED', 'DEF', 'POR'][Math.floor(Math.random() * 4)];
        playerName = `Jugador ${number}`;
      }

      const stickerData = {
        userId,
        stickerId,
        albumId: 'copa-mundial-fifa-2026',
        status: 'needed',
        count: 0,
        number,
        team: team.code,
        teamName: team.name,
        flagCode: team.flagCode,
        playerName,
        position,
        isSpecial: i === 0, // Badge is special
        color1: team.color1,
        color2: team.color2,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      currentBatch.set(doc(db, 'stickers', docId), stickerData);

      operationCount++;
      totalStickers++;

      // Firestore batch limit is 500 operations
      if (operationCount === 500) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }
  });

  // Add the last batch if it has operations
  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  console.log(`Created ${batches.length} batches for ${totalStickers} stickers`);

  // Execute all batches in parallel
  await Promise.all(batches.map((batch, index) => {
    console.log(`Committing batch ${index + 1}/${batches.length}...`);
    return batch.commit();
  }));

  console.log(`✅ Successfully initialized ${totalStickers} stickers for user ${userId}`);
};
