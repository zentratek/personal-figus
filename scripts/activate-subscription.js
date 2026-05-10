#!/usr/bin/env node

/**
 * Script para activar suscripciones de Figus
 * Uso: node scripts/activate-subscription.js
 */

const admin = require('firebase-admin');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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
  red: '\x1b[31m'
};

// Función para hacer preguntas
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n');
  console.log(`${colors.blue}╔══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║     FIGUS - Activar Suscripción          ║${colors.reset}`);
  console.log(`${colors.blue}╚══════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  try {
    // 1. Pedir User ID
    console.log(`${colors.yellow}📝 Paso 1: Información del Usuario${colors.reset}`);
    const userId = await question('Ingresa el User ID del usuario: ');

    if (!userId.trim()) {
      console.log(`${colors.red}❌ Error: User ID no puede estar vacío${colors.reset}`);
      process.exit(1);
    }

    // Verificar que el usuario existe
    const userDoc = await db.collection('users').doc(userId.trim()).get();
    if (!userDoc.exists) {
      console.log(`${colors.red}❌ Error: Usuario no encontrado en Firestore${colors.reset}`);
      process.exit(1);
    }

    const userData = userDoc.data();
    console.log(`${colors.green}✓${colors.reset} Usuario encontrado: ${userData.displayName || 'Sin nombre'} (${userData.email || 'Sin email'})`);
    console.log('');

    // 2. Seleccionar Tier
    console.log(`${colors.yellow}📦 Paso 2: Selecciona el Plan${colors.reset}`);
    console.log('1) Premium ($10,000 COP - 3 meses)');
    console.log('2) VIP ($20,000 COP - 3 meses)');
    const tierOption = await question('Selecciona una opción (1 o 2): ');

    let tier, tierName, basePrice, ocrLimit;

    if (tierOption === '1') {
      tier = 'premium';
      tierName = 'Premium';
      basePrice = 10000;
      ocrLimit = 5;
    } else if (tierOption === '2') {
      tier = 'vip';
      tierName = 'VIP';
      basePrice = 20000;
      ocrLimit = 999999;
    } else {
      console.log(`${colors.red}❌ Opción inválida${colors.reset}`);
      process.exit(1);
    }

    console.log(`${colors.green}✓${colors.reset} Tier seleccionado: ${tierName}`);
    console.log('');

    // 3. Código Promocional
    console.log(`${colors.yellow}🎟️  Paso 3: Código Promocional${colors.reset}`);
    const usedPromo = await question('¿El usuario usó código CSF2026? (s/n): ');

    let promoCode = null;
    let amount = basePrice;

    if (usedPromo.toLowerCase() === 's') {
      promoCode = 'CSF2026';
      amount = basePrice / 2;
      console.log(`${colors.green}✓${colors.reset} Código aplicado - Precio: $${amount.toLocaleString('es-CO')} COP`);
    } else {
      console.log(`${colors.green}✓${colors.reset} Sin código - Precio: $${amount.toLocaleString('es-CO')} COP`);
    }

    console.log('');

    // 4. Calcular fechas
    console.log(`${colors.yellow}📅 Paso 4: Calculando fechas...${colors.reset}`);

    const activatedAt = admin.firestore.Timestamp.now();

    // 3 meses = 92 días
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 92);
    const validUntil = admin.firestore.Timestamp.fromDate(validUntilDate);

    console.log(`${colors.green}✓${colors.reset} Fecha de activación: ${activatedAt.toDate().toLocaleDateString('es-CO')}`);
    console.log(`${colors.green}✓${colors.reset} Válido hasta: ${validUntil.toDate().toLocaleDateString('es-CO')}`);
    console.log('');

    // 5. Confirmación
    console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}📋 RESUMEN:${colors.reset}`);
    console.log(`  User ID: ${userId.trim()}`);
    console.log(`  Usuario: ${userData.displayName || 'Sin nombre'}`);
    console.log(`  Email: ${userData.email || 'Sin email'}`);
    console.log(`  Tier: ${tierName}`);
    console.log(`  Monto: $${amount.toLocaleString('es-CO')} COP`);
    console.log(`  Código: ${promoCode || 'Ninguno'}`);
    console.log(`  Válido hasta: ${validUntil.toDate().toLocaleDateString('es-CO')}`);
    console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log('');

    const confirm = await question('¿Confirmar activación? (s/n): ');

    if (confirm.toLowerCase() !== 's') {
      console.log(`${colors.red}❌ Activación cancelada${colors.reset}`);
      process.exit(0);
    }

    console.log('');
    console.log(`${colors.blue}🔄 Activando suscripción en Firebase...${colors.reset}`);
    console.log('');

    // 6. Actualizar Firestore
    const historyEntry = {
      tier,
      activatedAt,
      validUntil,
      promoCode,
      amount
    };

    // Obtener history actual y agregar nueva entrada
    const currentSubscription = userData.subscription || {};
    const currentHistory = currentSubscription.history || [];
    const newHistory = [...currentHistory, historyEntry];

    const subscriptionData = {
      tier,
      ocrScansUsed: 0,
      ocrScansLimit: ocrLimit,
      validUntil,
      activatedAt,
      history: newHistory
    };

    await db.collection('users').doc(userId.trim()).update({
      subscription: subscriptionData
    });

    // 7. Éxito
    console.log('');
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.green}✅ ¡SUSCRIPCIÓN ACTIVADA EXITOSAMENTE!${colors.reset}`);
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log('');
    console.log('📧 Ahora podés responder el email del usuario con:');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('¡Hola!');
    console.log('');
    console.log(`Tu suscripción ${tierName} ha sido activada exitosamente ✅`);
    console.log('');
    console.log(`• Plan: ${tierName}`);
    console.log('• Duración: 3 meses');
    console.log(`• Válido hasta: ${validUntil.toDate().toLocaleDateString('es-CO')}`);
    console.log('');

    if (tier === 'premium') {
      console.log('Beneficios activados:');
      console.log('✓ Grupos ilimitados');
      console.log('✓ Miembros ilimitados por grupo');
      console.log('✓ Soporte prioritario');
    } else {
      console.log('Beneficios activados:');
      console.log('✓ OCR ilimitado');
      console.log('✓ Grupos ilimitados');
      console.log('✓ Miembros ilimitados');
      console.log('✓ Badge VIP en perfil');
      console.log('✓ Soporte prioritario');
    }

    console.log('');
    console.log('¡Gracias por tu compra!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

  } catch (error) {
    console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
