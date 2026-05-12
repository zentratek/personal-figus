# Subscription System - Implementation TODO

## ✅ Completado (2026-05-10)

1. **subscriptionService.js** ✅
   - `canUseOcr()` - Verifica si usuario puede escanear
   - `incrementOcrUsage()` - Incrementa contador de escaneos
   - `canJoinGroup()` - Verifica límite de grupos
   - `canAddGroupMember()` - Verifica límite de miembros
   - `validatePromoCode()` - Valida código CSF2026
   - `calculatePrice()` - Calcula precio con descuento
   - Funciones helper para UI

2. **useSubscription.js** Hook ✅
   - Real-time listener de suscripción
   - Computed properties (tier, isVip, isPremium, isFree)
   - Funciones de permisos (canUseOcr, canJoinGroup, etc.)
   - Info de escaneos (remaining, used, limit)
   - Info de expiración

3. **UpgradeModal.jsx** Component ✅
   - UI de selección Premium/VIP
   - Input de código promocional con validación
   - Pantalla de QR de pago
   - Email pre-llenado a latinkid2211@gmail.com
   - Mensajes contextuales según reason

4. **Spec Completa** ✅
   - Modelo de negocio definido
   - Data models en Firestore
   - Flujo de pago documentado
   - Plan de implementación

---

## 🚧 Pendiente de Integración

### 1. Agregar Gating en OCR Scanner

**Archivo:** `src/screens/OcrScannerScreen.jsx`

**Cambios necesarios:**

```javascript
// Agregar imports
import { useSubscription } from '../hooks/useSubscription';
import { incrementOcrUsage } from '../services/subscriptionService';
import { UpgradeModal } from '../components/subscription/UpgradeModal';

export function OcrScannerScreen() {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Agregar en el UI - Mostrar contador
  {subscription.isFree && (
    <div className="text-sm text-[var(--muted)]">
      {subscription.ocrScansRemaining} escaneos restantes
    </div>
  )}

  {subscription.isVip && (
    <div className="flex items-center gap-2 text-[var(--lime)]">
      <span className="font-bold">✨ VIP</span>
      <span className="text-sm">OCR ilimitado</span>
    </div>
  )}

  // Modificar handleScan (dentro del botón "Capturar Sobre")
  const handleScan = async () => {
    // CHECK PERMISSION BEFORE SCANNING
    const canScan = await subscription.canUseOcr();
    if (!canScan) {
      setShowUpgradeModal(true);
      return;
    }

    // ... existing scan logic ...

    // AFTER successful scan, increment counter
    if (!subscription.isVip) {
      await incrementOcrUsage(user.uid);
    }
  };

  // Agregar al render
  return (
    <>
      {/* ... existing UI ... */}

      {showUpgradeModal && (
        <UpgradeModal
          reason="ocr_limit"
          currentUsage={subscription.ocrScansUsed}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}
```

---

### 2. Agregar Gating en Grupos

#### A. GroupSetupScreen - Límite de miembros

**Archivo:** `src/screens/GroupSetupScreen.jsx`

```javascript
import { useSubscription } from '../hooks/useSubscription';
import { UpgradeModal } from '../components/subscription/UpgradeModal';

export function GroupSetupScreen() {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleInviteMember = async () => {
    // CHECK if can add more members
    const canAdd = await subscription.canAddGroupMember(groupId);

    if (!canAdd.allowed) {
      setShowUpgradeModal(true);
      return;
    }

    // ... existing invite logic ...
  };

  // Mostrar warning visual
  {subscription.isFree && currentMembers.length >= 2 && (
    <div className="bg-[var(--surface)] border-2 border-[var(--primary)] rounded-xl p-4 mt-4">
      <p className="text-sm mb-2">
        🔒 Grupos de más de 3 personas requieren Premium
      </p>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="text-[var(--primary)] font-bold text-sm"
      >
        Upgrade por $5,000 →
      </button>
    </div>
  )}

  {showUpgradeModal && (
    <UpgradeModal
      reason="group_size_limit"
      onClose={() => setShowUpgradeModal(false)}
    />
  )}
}
```

#### B. HomeScreen/GroupScreen - Límite de cantidad de grupos

**Archivos:** `src/screens/HomeScreen.jsx` o donde esté el botón "Crear Grupo"

```javascript
import { useSubscription } from '../hooks/useSubscription';

export function HomeScreen() {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleCreateGroup = async () => {
    // CHECK if can join/create another group
    const canJoin = await subscription.canJoinGroup();

    if (!canJoin.allowed) {
      setShowUpgradeModal(true);
      return;
    }

    // ... existing create group logic ...
  };

  // Show visual warning if at limit
  {subscription.isFree && hasActiveGroup && (
    <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-4 mb-4">
      <p className="text-sm text-[var(--muted)] mb-2">
        🔒 Ya tenés 1 grupo activo (límite FREE)
      </p>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="text-[var(--primary)] font-bold text-sm"
      >
        Upgrade a Premium para grupos ilimitados →
      </button>
    </div>
  )}
}
```

---

### 3. Agregar Badge VIP en Perfil

**Archivo:** `src/screens/ProfileScreen.jsx`

```javascript
import { useSubscription } from '../hooks/useSubscription';

export function ProfileScreen() {
  const { user } = useAuth();
  const subscription = useSubscription(user?.uid);

  return (
    <div>
      {/* User avatar/name */}
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <div>
          <h1>{user.displayName}</h1>
          {subscription.isVip && (
            <div className="inline-flex items-center gap-1 bg-[var(--lime)] text-black px-2 py-0.5 rounded-full text-xs font-bold">
              <span>✨</span>
              <span>VIP</span>
            </div>
          )}
          {subscription.isPremium && (
            <div className="inline-flex items-center gap-1 bg-[var(--primary)] text-white px-2 py-0.5 rounded-full text-xs font-bold">
              <span>⭐</span>
              <span>PREMIUM</span>
            </div>
          )}
        </div>
      </div>

      {/* Show expiration date if has subscription */}
      {subscription.isActive && (
        <div className="text-sm text-[var(--muted)] mt-2">
          Válido hasta: {subscription.expiresAt?.toLocaleDateString('es-ES')}
          ({subscription.daysUntilExpiry} días restantes)
        </div>
      )}
    </div>
  );
}
```

---

### 4. Agregar Imágenes QR

**Acción:** Colocar las imágenes QR de Bancolombia en `/public/`

```bash
# Copiar las imágenes proporcionadas
cp /ruta/imagen1.png /home/juan/projects/personal/panini/app/public/qr-premium.png
cp /ruta/imagen2.png /home/juan/projects/personal/panini/app/public/qr-vip.png
```

**Actualizar UpgradeModal.jsx:**

```javascript
{/* QR Code */}
<div className="bg-white p-4 rounded-xl mb-4">
  <img
    src={selectedTier === 'premium' ? '/qr-premium.png' : '/qr-vip.png'}
    alt="QR Bancolombia"
    className="w-full rounded-lg"
  />
</div>
```

---

### 5. Inicializar Subscription en Nuevos Usuarios

**Archivo:** `src/services/userService.js` (en la función `createUserDocument`)

```javascript
import { calculateExpiration } from './subscriptionService';

export async function createUserDocument(user) {
  const userRef = doc(db, 'users', user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),

    // Initialize subscription
    subscription: {
      tier: 'free',
      ocrScansUsed: 0,
      ocrScansLimit: 5,
      validUntil: null,
      activatedAt: null,
      activatedBy: null,
      promoCode: null,
      amountPaid: null,
      history: []
    }
  });
}
```

---

### 6. Admin Manual Activation (Fase 1 - Manual)

**Proceso cuando recibís el email:**

1. Verificar pago en cuenta Bancolombia
2. Ir a Firebase Console → Firestore
3. Buscar usuario por `email` o `userId`
4. Actualizar campos:

```javascript
subscription: {
  tier: 'premium', // o 'vip'
  validUntil: <timestamp 3 meses>,
  activatedAt: <timestamp now>,
  activatedBy: 'admin',
  promoCode: 'CSF2026', // si usó código
  amountPaid: 5000, // o 10000 o 20000
  paymentMethod: 'qr_bancolombia',

  // Agregar a history
  history: [
    {
      tier: 'premium',
      activatedAt: <timestamp>,
      expiresAt: <timestamp>,
      promoCode: 'CSF2026',
      amountPaid: 5000
    }
  ]
}
```

**Nota:** El usuario verá el cambio automáticamente gracias al real-time listener.

---

## 🧪 Testing Checklist

### Flujo FREE → VIP (OCR)

- [ ] Usuario FREE abre scanner → Ve "5 escaneos restantes"
- [ ] Escanea 5 sobres exitosamente
- [ ] Al 6to intento → Modal de upgrade aparece
- [ ] Modal muestra VIP como "RECOMENDADO"
- [ ] Ingresa código CSF2026 → Precio baja a $10,000
- [ ] Toca "Seleccionar VIP" → Muestra QR
- [ ] Toca "Ya Pagué" → Abre email con datos pre-llenados
- [ ] Admin activa VIP manualmente
- [ ] Usuario ve badge VIP en perfil
- [ ] Scanner ahora muestra "✨ VIP - OCR ilimitado"
- [ ] Puede escanear sin límite

### Flujo FREE → PREMIUM (Grupos)

- [ ] Usuario FREE crea grupo con 3 miembros
- [ ] Al intentar agregar 4to → Modal aparece
- [ ] Modal muestra Premium como "RECOMENDADO"
- [ ] Usuario paga $5,000 con código
- [ ] Admin activa Premium
- [ ] Ahora puede agregar miembros ilimitados
- [ ] Puede crear/unirse a múltiples grupos

### Edge Cases

- [ ] Suscripción expirada → Vuelve a FREE automáticamente
- [ ] Usuario VIP expira → Contador OCR se mantiene en 5
- [ ] Código promocional inválido → No aplica descuento
- [ ] Usuario cancela modal → Puede seguir usando app (no blocking)

---

## 📦 Deployment Checklist

- [ ] Commit de todo el código
- [ ] Agregar imágenes QR a `/public/`
- [ ] Build: `npm run build`
- [ ] Deploy: `firebase deploy --only hosting`
- [ ] Testing en producción con usuario test
- [ ] Documentar proceso de activación manual
- [ ] Preparar template de respuesta para emails

---

## 💡 Mejoras Futuras (Fase 2)

1. **Admin Dashboard** (`admin.figus.online`)
   - Lista de pending payments
   - Activación con un click
   - Analytics de conversión

2. **Notificaciones de Expiración**
   - Email 7 días antes de expirar
   - Toast in-app cuando quedan 3 días

3. **Renovación Automática**
   - Link de pago en email de expiración
   - Proceso sin intervención manual

4. **Webhooks Bancolombia**
   - Activación automática al confirmar pago
   - Sin delay de 24 horas

---

**Última actualización:** 2026-05-10
**Status:** Servicios core completados, pendiente integración UI
**Próximo paso:** Integrar gating en OcrScannerScreen
