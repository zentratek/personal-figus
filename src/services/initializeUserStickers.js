import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { TEAMS } from './mockData';

/**
 * Initialize all stickers for a new user in Firestore
 * - 48 teams × 20 stickers = 960 team stickers
 * - FWC group: 20 stickers
 * - CC group: 14 stickers
 * Total: 994 stickers
 * Creates stickers in "needed" status by default
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const initializeUserStickers = async (userId) => {
  console.log(`Initializing stickers for user ${userId}...`);

  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;
  let totalStickers = 0;

  TEAMS.forEach(team => {
    // Determine max stickers for this team/group
    let maxStickers = 20; // Default for teams
    if (team.code === 'CC') {
      maxStickers = 14; // Coca-Cola has only 14
    }

    for (let i = 1; i <= maxStickers; i++) {
      const number = i;
      const stickerId = `${team.code} ${i}`; // Format: "ARG 1", "FWC 1", "CC 1"
      const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;

      // Determine position and player name
      let position, playerName;

      // Special groups (FWC, CC) don't have BADGE/GROUP structure
      if (team.code === 'FWC' || team.code === 'CC') {
        position = 'SPECIAL';
        playerName = `${team.name} ${i}`;
      } else {
        if (i === 1) {
          position = 'BADGE';
          playerName = `Escudo ${team.name}`;
        } else if (i === 2) {
          position = 'GROUP';
          playerName = `Equipo ${team.name}`;
        } else {
          position = ['DEL', 'MED', 'DEF', 'POR'][Math.floor(Math.random() * 4)];
          playerName = `Jugador ${team.code} ${i}`;
        }
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
        isSpecial: i === 1 && team.code !== 'FWC' && team.code !== 'CC', // Badge is special (position 1) for teams only
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
