#!/usr/bin/env node

/**
 * Script para recalcular estadísticas de usuarios basado en sus stickers reales
 * Solución para el bug donde stats.owned = 0 pero el usuario tiene 200+ figuras
 *
 * Uso: node scripts/recalculate-stats.cjs [--dry-run] [--user=USER_ID]
 *
 * Opciones:
 *   --dry-run    Simula la operación sin hacer cambios en Firestore
 *   --user=ID    Recalcula solo para un usuario específico
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Parse argumentos
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const userArg = args.find(arg => arg.startsWith('--user='));
const specificUserId = userArg ? userArg.split('=')[1] : null;

// Verificar que existe el archivo de credenciales
const credentialsPath = path.join(__dirname, '../figus-app-495718-firebase-adminsdk-6cz8m-45bfc36ed1.json');

if (!fs.existsSync(credentialsPath)) {
  console.error('\x1b[31m❌ Error: Archivo de credenciales no encontrado\x1b[0m');
  console.log('\nNecesitas descargar las credenciales de Firebase Admin SDK.');
  console.log('Lee las instrucciones en: app/SETUP-ADMIN-SDK.md\n');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = require(credentialsPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

/**
 * Calcula las estadísticas de un usuario basado en sus stickers
 */
async function calculateUserStats(userId) {
  const stickersSnapshot = await db.collection('stickers')
    .where('userId', '==', userId)
    .get();

  const stats = {
    needed: 0,
    owned: 0,
    repeated: 0,
    completionPct: 0
  };

  stickersSnapshot.forEach(doc => {
    const sticker = doc.data();

    if (sticker.status === 'needed') {
      stats.needed++;
    } else if (sticker.status === 'owned') {
      stats.owned++;
    } else if (sticker.status === 'repeated') {
      stats.repeated++;
    }
  });

  const totalStickers = stickersSnapshot.size;
  const ownedAndRepeated = stats.owned + stats.repeated;
  stats.completionPct = totalStickers > 0 ? Math.round((ownedAndRepeated / totalStickers) * 100) : 0;

  return { stats, totalStickers };
}

/**
 * Actualiza las estadísticas de un usuario
 */
async function updateUserStats(userId, stats) {
  await db.collection('users').doc(userId).update({
    stats: {
      needed: stats.needed || 0,
      owned: stats.owned || 0,
      repeated: stats.repeated || 0,
      completionPct: stats.completionPct || 0
    },
    updatedAt: admin.firestore.Timestamp.now()
  });
}

/**
 * Procesa un usuario individual
 */
async function processUser(userId, userName, userEmail, oldStats) {
  try {
    // Calcular stats reales desde stickers
    const { stats: newStats, totalStickers } = await calculateUserStats(userId);

    // Comparar con stats antiguos
    const hasChanged =
      oldStats.needed !== newStats.needed ||
      oldStats.owned !== newStats.owned ||
      oldStats.repeated !== newStats.repeated ||
      oldStats.completionPct !== newStats.completionPct;

    if (!hasChanged) {
      console.log(`  ${colors.green}✓${colors.reset} ${userName} - Sin cambios (stats correctos)`);
      return { updated: false, hadStickers: totalStickers > 0 };
    }

    console.log(`  ${colors.yellow}📊${colors.reset} ${userName} (${userEmail || 'sin email'})`);
    console.log(`     User ID: ${colors.cyan}${userId}${colors.reset}`);
    console.log(`     Total stickers: ${totalStickers}`);
    console.log(`     Antiguo → Nuevo:`);
    console.log(`       Needed:    ${colors.red}${oldStats.needed}${colors.reset} → ${colors.green}${newStats.needed}${colors.reset}`);
    console.log(`       Owned:     ${colors.red}${oldStats.owned}${colors.reset} → ${colors.green}${newStats.owned}${colors.reset}`);
    console.log(`       Repeated:  ${colors.red}${oldStats.repeated}${colors.reset} → ${colors.green}${newStats.repeated}${colors.reset}`);
    console.log(`       Progress:  ${colors.red}${oldStats.completionPct}%${colors.reset} → ${colors.green}${newStats.completionPct}%${colors.reset}`);

    if (!dryRun) {
      await updateUserStats(userId, newStats);
      console.log(`     ${colors.green}✅ Actualizado en Firestore${colors.reset}`);
    } else {
      console.log(`     ${colors.yellow}⚠️  DRY RUN - No se actualizó${colors.reset}`);
    }

    console.log('');
    return { updated: true, hadStickers: totalStickers > 0 };

  } catch (error) {
    console.error(`  ${colors.red}❌${colors.reset} Error procesando ${userName}:`, error.message);
    return { updated: false, hadStickers: false, error: true };
  }
}

async function main() {
  console.log('\n');
  console.log(`${colors.blue}╔══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   FIGUS - Recalcular Estadísticas de Usuarios       ║${colors.reset}`);
  console.log(`${colors.blue}╚══════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  if (dryRun) {
    console.log(`${colors.yellow}⚠️  MODO DRY RUN - No se harán cambios en Firestore${colors.reset}`);
    console.log('');
  }

  if (specificUserId) {
    console.log(`${colors.cyan}🎯 Procesando solo el usuario: ${specificUserId}${colors.reset}`);
    console.log('');
  }

  try {
    const startTime = Date.now();
    let usersToProcess;

    // Obtener usuarios
    if (specificUserId) {
      const userDoc = await db.collection('users').doc(specificUserId).get();
      if (!userDoc.exists) {
        console.log(`${colors.red}❌ Error: Usuario no encontrado${colors.reset}`);
        process.exit(1);
      }
      usersToProcess = [{ id: userDoc.id, data: userDoc.data() }];
    } else {
      const usersSnapshot = await db.collection('users').get();
      usersToProcess = usersSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    }

    console.log(`${colors.blue}📋 Total de usuarios a procesar: ${usersToProcess.length}${colors.reset}`);
    console.log('');
    console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log('');

    let totalUpdated = 0;
    let totalUnchanged = 0;
    let totalErrors = 0;
    let totalWithoutStickers = 0;

    // Procesar cada usuario
    for (let i = 0; i < usersToProcess.length; i++) {
      const { id: userId, data: userData } = usersToProcess[i];

      const userName = userData.displayName || 'Sin nombre';
      const userEmail = userData.email;
      const oldStats = userData.stats || { needed: 0, owned: 0, repeated: 0, completionPct: 0 };

      console.log(`[${i + 1}/${usersToProcess.length}]`);

      const result = await processUser(userId, userName, userEmail, oldStats);

      if (result.error) {
        totalErrors++;
      } else if (result.updated) {
        totalUpdated++;
      } else {
        totalUnchanged++;
      }

      if (!result.hadStickers) {
        totalWithoutStickers++;
      }

      // Pausa pequeña para no saturar Firestore
      if (i < usersToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Resumen final
    console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log('');
    console.log(`${colors.blue}📊 RESUMEN:${colors.reset}`);
    console.log(`  Usuarios procesados:    ${usersToProcess.length}`);
    console.log(`  ${colors.green}✓${colors.reset} Actualizados:          ${totalUpdated}`);
    console.log(`  ${colors.blue}→${colors.reset} Sin cambios:           ${totalUnchanged}`);
    console.log(`  ${colors.red}✗${colors.reset} Errores:               ${totalErrors}`);
    console.log(`  ${colors.yellow}⚠${colors.reset}  Sin stickers:          ${totalWithoutStickers}`);
    console.log(`  Tiempo total:           ${duration}s`);
    console.log('');

    if (dryRun) {
      console.log(`${colors.yellow}⚠️  DRY RUN - Para aplicar los cambios, ejecuta sin --dry-run${colors.reset}`);
    } else {
      console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`${colors.green}✅ ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!${colors.reset}`);
      console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    }
    console.log('');

  } catch (error) {
    console.error(`${colors.red}❌ Error fatal:${colors.reset}`, error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
