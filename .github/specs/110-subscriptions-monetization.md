# 110 - Subscriptions & Monetization

---
**Title:** Sistema de Suscripciones VIP y Monetización
**Status:** 🟡 In Progress
**Created:** 2026-05-10
**Updated:** 2026-05-10
**Authors:** Juan
**Reviewers:** -

---

## Summary

Sistema de monetización freemium con tres niveles de acceso: **FREE**, **PREMIUM**, y **VIP**. Basado en limitaciones estratégicas de OCR y tamaño de grupos, con pago manual vía QR Bancolombia.

## Business Model

### 🎯 Target Audience

**Primario:** Adolescentes 12-16 años (colegio)
**Secundario:** Adultos coleccionistas 20-40 años

### 💰 Revenue Streams

1. **Grupos Premium** ($5,000 - $10,000 COP)
2. **Suscripción VIP** ($20,000 COP / 3 meses)

---

## Tiers & Pricing

### ✅ **TIER FREE** (Funcionalidad Base)

**Precio:** $0

**Incluye:**
- ✅ Álbum digital ilimitado
- ✅ Gestión manual de figuritas
- ✅ **5 escaneos OCR incluidos** (feature trial)
- ✅ **1 grupo activo** con hasta **3 miembros**
- ✅ Matchmaking automático básico
- ✅ Propuestas de intercambio ilimitadas
- ✅ Login con Google
- ✅ Sincronización en la nube

**Limitaciones:**
- ⚠️ Solo 5 escaneos OCR
- ⚠️ Solo 1 grupo activo
- ⚠️ Grupos limitados a 3 miembros
- ⚠️ Después de 5 escaneos: Mensaje "Upgrade a VIP para OCR ilimitado"
- ⚠️ Al intentar crear/unirse a 2do grupo: "Upgrade a Premium para grupos ilimitados"

---

### 🏆 **TIER PREMIUM** (Grupos Grandes)

**Precio:**
- **Con código promocional `CSF2026`:** $5,000 COP (50% OFF)
- **Sin código:** $10,000 COP
- **Duración:** 3 meses

**Desbloquea:**
- ✅ **Grupos ILIMITADOS** (pueden crear y unirse a múltiples grupos)
- ✅ Grupos de **más de 3 miembros** (sin límite de tamaño)
- ✅ Todo lo incluido en FREE

**Limitaciones:**
- ⚠️ Sigue con solo 5 escaneos OCR totales

**Use Case:** Grupos de amigos del colegio, múltiples círculos sociales

---

### 🌟 **TIER VIP** (All Access)

**Precio:**
- **Con código promocional `CSF2026`:** $10,000 COP (50% OFF)
- **Sin código:** $20,000 COP
- **Duración:** 3 meses

**Incluye TODO de FREE + PREMIUM +:**
- ✅ **OCR ILIMITADO** (feature estrella)
- ✅ **Grupos ILIMITADOS** (crear y unirse a múltiples)
- ✅ Grupos de tamaño ilimitado (sin límite de miembros)
- ✅ Badge "VIP" en perfil
- ✅ Soporte prioritario

**Use Case:** Power users que abren muchos sobres y participan en múltiples grupos

---

## Payment Flow

### Método de Pago: QR Bancolombia

**Cuentas de Pago:**

#### Opción 1: Grupos Premium ($5,000 / $10,000)
- **Banco:** Bancolombia
- **Monto:** $10,000 COP (o $5,000 con código)
- **Llave:** `@bustamante161`
- **QR:** [Imagen proporcionada por usuario]

#### Opción 2: VIP ($20,000)
- **Banco:** Bancolombia
- **Monto:** $20,000 COP (o $10,000 con código)
- **Llave:** `@bustamante161`
- **QR:** [Imagen proporcionada por usuario]

### Proceso de Activación

```
1. Usuario toca "Upgrade to Premium/VIP"
2. Pantalla muestra:
   - Descripción de beneficios
   - Campo para código promocional
   - QR de Bancolombia con monto
   - Instrucciones de transferencia
3. Usuario ingresa código "CSF2026" (opcional)
   → Monto se actualiza con 50% descuento
4. Usuario realiza transferencia
5. Usuario toca "Ya pagué" → Abre email
6. Email pre-llenado enviado a: latinkid2211@gmail.com
   Asunto: "[FIGUS] Pago Premium/VIP - [userId]"
   Cuerpo:
   - Nombre de usuario
   - Email registrado
   - Tier solicitado (Premium/VIP)
   - Código promocional usado (si aplica)
   - Espacio para adjuntar screenshot
7. Admin (Juan) recibe email, verifica pago
8. Admin actualiza Firestore manualmente:
   users/{userId}/subscription { tier: 'premium'|'vip', ... }
9. Usuario recibe confirmación automática (in-app)
```

---

## Data Model

### Firestore Schema

```javascript
// Collection: users
{
  userId: "abc123",
  email: "usuario@example.com",
  displayName: "Juan Pérez",

  // Subscription data
  subscription: {
    tier: 'free' | 'premium' | 'vip',
    validUntil: timestamp,  // null para 'free'

    // Tracking
    ocrScansUsed: 3,        // Contador de escaneos
    ocrScansLimit: 5,       // Límite para tier actual

    // Payment info
    paymentMethod: 'qr_bancolombia',
    activatedAt: timestamp,
    activatedBy: 'admin',
    promoCode: 'CSF2026' | null,
    amountPaid: 10000,  // COP

    // Audit
    history: [
      {
        tier: 'premium',
        activatedAt: timestamp,
        expiresAt: timestamp,
        promoCode: 'CSF2026',
        amountPaid: 5000
      }
    ]
  }
}
```

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read their own subscription
    match /users/{userId} {
      allow read: if request.auth.uid == userId;

      // Only admins can write subscription data
      allow update: if request.auth.uid == userId
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['subscription']);
    }

    // Admin collection (for manual activation)
    match /subscriptionRequests/{requestId} {
      allow create: if request.auth != null;
      allow read, update: if false;  // Solo backend/admin
    }
  }
}
```

---

## Features Gating

### OCR Scanner

```javascript
// OcrScannerScreen.jsx
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

export function OcrScannerScreen() {
  const { user } = useAuth();
  const { tier, ocrScansUsed, ocrScansLimit, canUseOcr } = useSubscription();

  const handleScan = async () => {
    // Check if user can scan
    if (!canUseOcr()) {
      // Show upgrade modal
      setShowUpgradeModal(true);
      return;
    }

    // Proceed with scan
    await performOcrScan();

    // Increment counter (if not VIP)
    if (tier !== 'vip') {
      await incrementOcrUsage(user.uid);
    }
  };

  return (
    <div>
      {/* Show remaining scans */}
      {tier === 'free' && (
        <div className="text-sm text-[var(--muted)]">
          {ocrScansLimit - ocrScansUsed} escaneos restantes
        </div>
      )}

      {tier === 'vip' && (
        <div className="flex items-center gap-2 text-[var(--lime)]">
          <span className="font-bold">✨ VIP</span>
          <span className="text-sm">OCR ilimitado</span>
        </div>
      )}

      <button onClick={handleScan}>
        Escanear Sobre
      </button>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          reason="ocr_limit"
          currentUsage={ocrScansUsed}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
}
```

### Group Size & Count Limits

```javascript
// GroupSetupScreen.jsx
export function GroupSetupScreen() {
  const { tier } = useSubscription();
  const maxMembers = tier === 'free' ? 3 : Infinity;

  const handleInviteMember = async () => {
    const currentMembers = await getGroupMembers(groupId);

    if (tier === 'free' && currentMembers.length >= 3) {
      // Show upgrade to Premium modal
      setShowUpgradeModal({ reason: 'group_size_limit' });
      return;
    }

    // Proceed with invite
    await sendInvite();
  };

  return (
    <div>
      <p className="text-[var(--muted)]">
        {currentMembers.length} miembros
        {tier === 'free' && ` / 3 máximo`}
      </p>

      {tier === 'free' && currentMembers.length >= 2 && (
        <div className="bg-[var(--surface)] border-2 border-[var(--primary)] rounded-xl p-4 mt-4">
          <p className="text-sm mb-2">
            🔒 Grupos de más de 3 personas requieren Premium
          </p>
          <button className="text-[var(--primary)] font-bold text-sm">
            Upgrade por $5,000 →
          </button>
        </div>
      )}
    </div>
  );
}

// HomeScreen.jsx - Create/Join Group
export function HomeScreen() {
  const { tier, activeGroups } = useSubscription();

  const handleCreateGroup = async () => {
    // Check group count limit
    if (tier === 'free' && activeGroups.length >= 1) {
      setShowUpgradeModal({ reason: 'group_count_limit' });
      return;
    }

    // Proceed with group creation
    await createGroup();
  };

  return (
    <div>
      {tier === 'free' && activeGroups.length > 0 && (
        <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-4 mb-4">
          <p className="text-sm text-[var(--muted)] mb-2">
            🔒 Ya tenés 1 grupo activo (límite FREE)
          </p>
          <button className="text-[var(--primary)] font-bold text-sm">
            Upgrade a Premium para grupos ilimitados →
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## UI Components

### Component: UpgradeModal.jsx

```javascript
export function UpgradeModal({ reason, onClose }) {
  const [promoCode, setPromoCode] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = {
    premium: {
      name: 'Premium',
      price: 10000,
      priceWithCode: 5000,
      duration: '3 meses',
      features: [
        '✅ Grupos de hasta 10 miembros',
        '✅ Todo lo incluido en FREE',
        '⚠️ 5 escaneos OCR (mismo límite)'
      ]
    },
    vip: {
      name: 'VIP',
      price: 20000,
      priceWithCode: 10000,
      duration: '3 meses',
      features: [
        '✨ OCR ILIMITADO',
        '✅ Grupos de hasta 10 miembros',
        '✅ Badge VIP en perfil',
        '✅ Soporte prioritario'
      ]
    }
  };

  const getPrice = (tier) => {
    const discount = promoCode.toUpperCase() === 'CSF2026';
    return discount ? tier.priceWithCode : tier.price;
  };

  const handleUpgrade = (tierKey) => {
    setSelectedTier(tierKey);
    setShowQr(true);
  };

  const handleSendEmail = () => {
    const tier = tiers[selectedTier];
    const price = getPrice(tier);

    const subject = `[FIGUS] Pago ${tier.name} - ${user.uid}`;
    const body = `
Hola,

Acabo de realizar el pago para activar mi suscripción:

- Usuario: ${user.displayName}
- Email: ${user.email}
- User ID: ${user.uid}
- Tier: ${tier.name}
- Código promocional: ${promoCode || 'Ninguno'}
- Monto pagado: $${price.toLocaleString('es-CO')} COP

Adjunto screenshot del comprobante.

Gracias!
    `.trim();

    window.location.href = `mailto:latinkid2211@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">

        {!showQr ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {reason === 'ocr_limit'
                ? '🔒 Llegaste al límite de escaneos'
                : '🔒 Grupos grandes requieren Premium'}
            </h2>

            {/* Promo Code Input */}
            <div className="mb-6">
              <label className="text-sm text-[var(--muted)] mb-2 block">
                ¿Tenés un código promocional?
              </label>
              <input
                type="text"
                placeholder="Ej: CSF2026"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg)] border-2 border-[var(--border)] rounded-xl text-[var(--text)] font-mono"
              />
              {promoCode.toUpperCase() === 'CSF2026' && (
                <p className="text-[var(--lime)] text-sm mt-2 font-bold">
                  ✅ ¡50% de descuento aplicado!
                </p>
              )}
            </div>

            {/* Tier Cards */}
            <div className="space-y-4">
              {/* Premium Tier */}
              <div className="bg-[var(--bg)] border-2 border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--primary)]">
                      Premium
                    </h3>
                    <p className="text-sm text-[var(--muted)]">
                      Grupos grandes
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={promoCode.toUpperCase() === 'CSF2026' ? 'line-through text-[var(--muted)] text-sm' : 'text-2xl font-bold'}>
                      ${tiers.premium.price.toLocaleString('es-CO')}
                    </div>
                    {promoCode.toUpperCase() === 'CSF2026' && (
                      <div className="text-2xl font-bold text-[var(--lime)]">
                        ${tiers.premium.priceWithCode.toLocaleString('es-CO')}
                      </div>
                    )}
                    <div className="text-xs text-[var(--muted)]">
                      / 3 meses
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4 text-sm">
                  {tiers.premium.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]"
                >
                  Seleccionar Premium
                </button>
              </div>

              {/* VIP Tier */}
              <div className="bg-[var(--bg)] border-2 border-[var(--lime)] rounded-xl p-4 relative">
                <div className="absolute -top-3 left-4 bg-[var(--lime)] text-black px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ RECOMENDADO
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--lime)]">
                      VIP
                    </h3>
                    <p className="text-sm text-[var(--muted)]">
                      OCR ilimitado
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={promoCode.toUpperCase() === 'CSF2026' ? 'line-through text-[var(--muted)] text-sm' : 'text-2xl font-bold'}>
                      ${tiers.vip.price.toLocaleString('es-CO')}
                    </div>
                    {promoCode.toUpperCase() === 'CSF2026' && (
                      <div className="text-2xl font-bold text-[var(--lime)]">
                        ${tiers.vip.priceWithCode.toLocaleString('es-CO')}
                      </div>
                    )}
                    <div className="text-xs text-[var(--muted)]">
                      / 3 meses
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4 text-sm">
                  {tiers.vip.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade('vip')}
                  className="w-full py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]"
                >
                  Seleccionar VIP
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 py-3 text-[var(--muted)] font-bold"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            {/* Payment QR Screen */}
            <h2 className="text-2xl font-bold mb-4">
              Paso 2: Realizar Pago
            </h2>

            <div className="bg-[var(--bg)] border-2 border-[var(--border)] rounded-xl p-6 mb-4">
              <div className="text-center mb-4">
                <p className="text-[var(--muted)] text-sm mb-2">
                  Monto a transferir:
                </p>
                <p className="text-4xl font-bold text-[var(--lime)]">
                  ${getPrice(tiers[selectedTier]).toLocaleString('es-CO')} COP
                </p>
              </div>

              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-xl mb-4">
                <img
                  src="/qr-bancolombia.png"
                  alt="QR Bancolombia"
                  className="w-full"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-[var(--muted)] mb-1">
                  Llave Bancolombia:
                </p>
                <p className="font-mono font-bold text-[var(--lime)]">
                  @bustamante161
                </p>
              </div>
            </div>

            <div className="bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-xl p-4 mb-4">
              <p className="text-sm font-bold mb-2">
                📱 Instrucciones:
              </p>
              <ol className="text-sm text-[var(--muted)] space-y-1 list-decimal list-inside">
                <li>Escaneá el código QR con Bancolombia</li>
                <li>Transferí el monto exacto</li>
                <li>Tomá screenshot del comprobante</li>
                <li>Tocá "Ya Pagué" abajo para enviar email</li>
              </ol>
            </div>

            <button
              onClick={handleSendEmail}
              className="w-full py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] mb-3"
            >
              ✉️ Ya Pagué - Enviar Comprobante
            </button>

            <button
              onClick={() => setShowQr(false)}
              className="w-full py-3 text-[var(--muted)] font-bold"
            >
              ← Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## Services

### subscriptionService.js

```javascript
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Check if user can use OCR
export async function canUseOcr(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const data = userDoc.data();

  if (!data.subscription) {
    return { allowed: true, remaining: 5 }; // First time user
  }

  const { tier, ocrScansUsed = 0, validUntil } = data.subscription;

  // VIP = unlimited
  if (tier === 'vip' && validUntil > Date.now()) {
    return { allowed: true, remaining: Infinity };
  }

  // Free/Premium = 5 scans limit
  const limit = 5;
  const remaining = limit - ocrScansUsed;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    tier
  };
}

// Increment OCR usage counter
export async function incrementOcrUsage(userId) {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    'subscription.ocrScansUsed': increment(1)
  });
}

// Check group size limit
export function getMaxGroupSize(tier) {
  if (tier === 'free') return 3;
  return Infinity; // premium & vip = unlimited
}

// Check max active groups
export function getMaxActiveGroups(tier) {
  if (tier === 'free') return 1;
  return Infinity; // premium & vip = unlimited
}

// Check if subscription is active
export function isSubscriptionActive(subscription) {
  if (!subscription || subscription.tier === 'free') {
    return false;
  }

  return subscription.validUntil > Date.now();
}

// Calculate expiration (3 months from now)
export function calculateExpiration() {
  const now = new Date();
  now.setMonth(now.getMonth() + 3);
  return now.getTime();
}
```

### useSubscription.js (Hook)

```javascript
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { canUseOcr as checkOcrAccess } from '../services/subscriptionService';

export function useSubscription(userId) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        const data = doc.data();
        setSubscription(data?.subscription || {
          tier: 'free',
          ocrScansUsed: 0,
          ocrScansLimit: 5
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const canUseOcr = async () => {
    const result = await checkOcrAccess(userId);
    return result.allowed;
  };

  return {
    ...subscription,
    loading,
    canUseOcr,
    isVip: subscription?.tier === 'vip',
    isPremium: subscription?.tier === 'premium',
    isFree: !subscription || subscription?.tier === 'free'
  };
}
```

---

## Admin Manual Activation Process

### Step-by-Step para Admin (Juan)

1. **Recibir email** en `latinkid2211@gmail.com` con:
   - User ID
   - Tier solicitado
   - Código promocional (si aplica)
   - Screenshot del comprobante

2. **Verificar pago** en cuenta Bancolombia

3. **Activar en Firestore** (usar Firebase Console):
   ```
   Collection: users
   Document: {userId from email}

   Update fields:
   subscription.tier = 'premium' | 'vip'
   subscription.validUntil = [timestamp 3 meses]
   subscription.activatedAt = [timestamp now]
   subscription.promoCode = 'CSF2026' | null
   subscription.amountPaid = 5000 | 10000 | 20000
   subscription.paymentMethod = 'qr_bancolombia'
   subscription.activatedBy = 'admin'
   ```

4. **Usuario recibe confirmación automática** (vía real-time listener)

---

## Implementation Plan

### Phase 1: Core Subscription Logic (2-3 días)

- [ ] Crear data model en Firestore (`subscription` field)
- [ ] Implementar `subscriptionService.js`
- [ ] Implementar `useSubscription.js` hook
- [ ] Agregar gating en OCR scanner (5 scans limit)
- [ ] Agregar gating en group creation (3 members limit)
- [ ] Testing con usuarios de prueba

### Phase 2: Upgrade UI (2-3 días)

- [ ] Crear `UpgradeModal.jsx` component
- [ ] Integrar imágenes QR Bancolombia
- [ ] Implementar flujo de código promocional
- [ ] Email pre-llenado a `latinkid2211@gmail.com`
- [ ] Testing de flujo completo

### Phase 3: In-App Indicators (1-2 días)

- [ ] Badge "VIP" en perfil de usuarios
- [ ] Contador de escaneos restantes en OCR screen
- [ ] Warning en grupos cuando alcanzan límite
- [ ] Banner promocional en HomeScreen para upgrade

### Phase 4: Admin Tools (Opcional - Fase 2)

- [ ] Dashboard admin básico en `admin.figus.online`
- [ ] Lista de pending payments
- [ ] Activación con un click
- [ ] Analytics de conversión

**Total:** 5-8 días de desarrollo

---

## Success Metrics

### Conversión
- ✅ **> 10% conversión** FREE → PREMIUM/VIP (primeros 3 meses)
- ✅ **> 50% usuarios** usan código promocional `CSF2026`

### Engagement
- ✅ **> 80% usuarios VIP** usan OCR 10+ veces/mes
- ✅ **> 60% grupos Premium** tienen 5+ miembros

### Revenue (6 meses)
- ✅ **> 20 suscripciones** activas
- ✅ **MRR > $200,000 COP** (~USD $50)

---

## Risks & Mitigations

### Risk: Usuarios no quieren pagar

**Probabilidad:** Media
**Impacto:** Alto
**Mitigación:**
- Trial de 5 escaneos OCR para probar feature
- Código `CSF2026` agresivo (50% OFF) para early adopters
- Pricing accesible ($5K-$10K para adolescentes)

### Risk: Proceso manual de activación es lento

**Probabilidad:** Alta
**Impacto:** Medio
**Mitigación:**
- Expectativa clara: "Activación en < 24 horas"
- Notificar cuando se active (email + in-app)
- Fase 2: Admin dashboard para activación rápida

### Risk: Fraude en pagos

**Probabilidad:** Baja
**Impacto:** Bajo
**Mitigación:**
- Verificar screenshot con datos de cuenta
- Montos pequeños reducen incentivo de fraude
- Firestore audit log de todas las activaciones

---

## Open Questions

- ❓ ¿Agregar plan anual con mayor descuento? (ej: $50K/año)
- ❓ ¿Permitir regalar suscripciones? (ej: padre compra para grupo del hijo)
- ❓ ¿Agregar alertas de expiración? (notificar 1 semana antes)
- ❓ ¿Renovación automática o manual?

---

## References

- [Authentication Spec](./003-authentication.md)
- [Data Models Spec](./002-data-models.md)
- [OCR Scanner Spec](./006-ocr-scanner.md)
- [Groups Spec](./004-groups-invitations.md)

---

**Next Steps:**
1. Review y aprobar esta spec
2. Implementar Phase 1 (Core Subscription Logic)
3. Testing con usuarios beta
4. Launch con código promocional `CSF2026`
