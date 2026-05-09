# 111 - Phase 9.1: UI Polish & Design Improvements

---
**Title:** Phase 9.1: UI Polish - Header, Notifications, Social Sharing, Album Separators
**Status:** 🟡 In Review
**Created:** 2026-05-09
**Duration:** 2-3 días

---

## Summary

Mejoras de diseño visual basadas en el prototipo de referencia (`/figus/project`):
1. Mejorar header con logo "FIGUS" en estilo Bungee
2. Implementar sistema de notificaciones in-app
3. Agregar compartir social (WhatsApp, Instagram, TikTok) en grupos
4. Mejorar separadores de equipos en álbum con banderas y códigos FIFA

## Objectives

- [ ] Logo "FIGUS" en HomeScreen header con estilo cyberpunk
- [ ] Botón de notificaciones con badge de contador
- [ ] Panel de notificaciones in-app funcional
- [ ] Compartir código de grupo via WhatsApp, Instagram, TikTok
- [ ] Separadores de equipos mejorados en AlbumScreen con banderas

## Tasks

### 1. Header con Logo FIGUS (HomeScreen)

**Referencia:**
```jsx
// figus/project/src/screens.jsx líneas 22-28
<div style={{
  fontFamily: 'Bungee, sans-serif', fontSize: 24,
  color: C.primary, letterSpacing: 0.5,
  textShadow: '2px 2px 0 #000',
}}>FIGUS</div>
```

**Implementation:**

**src/components/layout/TopBar.jsx** - Modificar para aceptar custom left content:
```jsx
export function TopBar({ title, left, center, right, onBack }) {
  return (
    <div className="sticky top-0 z-10 bg-[var(--bg)] border-b-2 border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-3.5">
        {/* Left slot - custom content or back button */}
        {left || (onBack && (
          <button onClick={onBack} className="...">
            <ArrowLeft />
          </button>
        ))}

        {/* Center - title or custom content */}
        {center || (
          <h1 className="text-base font-bold tracking-wide">{title}</h1>
        )}

        {/* Right slot - custom content */}
        {right}
      </div>
    </div>
  );
}
```

**src/screens/HomeScreen.jsx** - Usar custom header:
```jsx
<AppLayout
  customTopBar={
    <TopBar
      left={
        <div className="font-bungee text-2xl text-[var(--primary)] tracking-wide"
             style={{ textShadow: '2px 2px 0 #000' }}>
          FIGUS
        </div>
      }
      right={
        <div className="flex items-center gap-2.5">
          <NotificationButton count={3} onClick={() => setShowNotifications(true)} />
          <UserAvatar user={user} />
        </div>
      }
    />
  }
>
  {/* HomeScreen content */}
</AppLayout>
```

**Files to modify:**
- `src/components/layout/TopBar.jsx`
- `src/components/layout/AppLayout.jsx` (add customTopBar prop)
- `src/screens/HomeScreen.jsx`

---

### 2. Sistema de Notificaciones In-App

**Referencia:**
```jsx
// figus/project/src/screens.jsx líneas 31-45
<button style={{
  width: 40, height: 40, background: '#13131F',
  border: `2px solid ${C.border}`, borderRadius: 10,
  color: C.text, position: 'relative',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  <Icon.bell width={18} />
  <span style={{
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    background: C.red, color: '#fff', fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #0A0A14',
  }}>3</span>
</button>
```

**Implementation:**

**src/components/notifications/NotificationButton.jsx** - Nuevo componente:
```jsx
import { Bell } from 'lucide-react';

export function NotificationButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 bg-[var(--surface)] border-2 border-[var(--border)] rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors"
    >
      <Bell className="w-[18px] h-[18px] text-[var(--text)]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--red)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0A0A14]">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
```

**src/components/notifications/NotificationPanel.jsx** - Panel lateral:
```jsx
import { X, UserPlus, ArrowLeftRight, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationPanel({ isOpen, onClose, notifications, onMarkRead }) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'trade_received': return <ArrowLeftRight className="w-5 h-5" />;
      case 'trade_accepted': return <CheckCircle className="w-5 h-5" />;
      case 'group_invite': return <UserPlus className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'trade_received': return 'var(--cyan)';
      case 'trade_accepted': return 'var(--lime)';
      case 'group_invite': return 'var(--gold)';
      default: return 'var(--muted)';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[90%] max-w-sm bg-[var(--bg)] border-l-2 border-[var(--border)] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--surface)] border-b-2 border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Notificaciones</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-[var(--muted)] font-mono text-sm">
                // sin notificaciones
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-[12px] border-2 ${
                  notif.read
                    ? 'bg-[var(--surface)] border-[var(--border)]'
                    : 'bg-[var(--surface-2)] border-[var(--primary)]'
                }`}
                onClick={() => !notif.read && onMarkRead(notif.id)}
              >
                <div className="flex gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-black shrink-0"
                    style={{ background: getColor(notif.type), color: '#0A0A14' }}
                  >
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5">{notif.title}</p>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] font-mono mt-1.5">
                      {formatDistanceToNow(new Date(notif.timestamp), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
```

**src/services/notificationService.js** - Nuevo servicio:
```js
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Listen to notifications for a user
export function subscribeToNotifications(userId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    }));
    callback(notifications);
  });
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  const notifRef = doc(db, 'notifications', notificationId);
  await updateDoc(notifRef, { read: true });
}

// Create notification
export async function createNotification(userId, type, title, message, data = {}) {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type, // 'trade_received', 'trade_accepted', 'group_invite', etc.
    title,
    message,
    data, // Additional context (tradeId, groupId, etc.)
    read: false,
    timestamp: serverTimestamp(),
  });
}
```

**Files to create:**
- `src/components/notifications/NotificationButton.jsx`
- `src/components/notifications/NotificationPanel.jsx`
- `src/components/notifications/UserAvatar.jsx`
- `src/services/notificationService.js`

**Files to modify:**
- `src/screens/HomeScreen.jsx` (add notification state)
- Install `date-fns` package: `npm install date-fns`

---

### 3. Compartir Código de Grupo via Redes Sociales

**Implementation:**

**src/components/groups/ShareGroupModal.jsx** - Nuevo componente:
```jsx
import { X, Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ShareGroupModal({ group, onClose }) {
  const shareUrl = `https://figus.online/join/${group.code}`;
  const shareText = `¡Unite a mi grupo de Figus "${group.name}"! 🏆\n\nCódigo: ${group.code}\nÓ entrá directo: ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.code);
    toast.success('¡Código copiado!');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaInstagram = () => {
    // Instagram no permite deep links directos, copiamos al portapapeles
    navigator.clipboard.writeText(shareText);
    toast.success('Texto copiado! Pegalo en tu historia de Instagram', {
      duration: 4000,
    });
  };

  const shareViaTikTok = () => {
    // TikTok tampoco permite deep links, copiamos al portapapeles
    navigator.clipboard.writeText(shareText);
    toast.success('Texto copiado! Pegalo en tu video de TikTok', {
      duration: 4000,
    });
  };

  const shareViaNavigator = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Grupo de Figus: ${group.name}`,
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
        {/* Modal */}
        <div
          className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-t-[20px] sm:rounded-[20px] w-full sm:max-w-md shadow-[0_-4px_0_#000] sm:shadow-[4px_4px_0_#000] p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Compartir Grupo</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group Info */}
          <div className="p-3.5 bg-[var(--surface-2)] border-2 border-[var(--border)] rounded-[12px] mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{group.emoji}</div>
              <div>
                <p className="font-bold">{group.name}</p>
                <p className="text-xs text-[var(--muted)] font-mono">
                  {group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}
                </p>
              </div>
            </div>
            <div className="p-2.5 bg-[var(--surface)] rounded-lg border-2 border-[var(--border)] text-center">
              <p className="text-[9px] text-[var(--muted)] font-mono mb-1">CÓDIGO</p>
              <p className="text-lg font-bold text-[var(--lime)] font-mono tracking-wider">
                {group.code}
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={shareViaWhatsApp}
              className="w-full flex items-center gap-3 p-3.5 bg-[#25D366] text-white border-2 border-black rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <span className="text-2xl">💬</span>
              <span className="flex-1 text-left">Compartir por WhatsApp</span>
            </button>

            <button
              onClick={shareViaInstagram}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-2 border-black rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <span className="text-2xl">📸</span>
              <span className="flex-1 text-left">Compartir en Instagram</span>
            </button>

            <button
              onClick={shareViaTikTok}
              className="w-full flex items-center gap-3 p-3.5 bg-[#000000] text-white border-2 border-[var(--cyan)] rounded-[12px] shadow-[3px_3px_0_var(--cyan)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--cyan)] transition-all font-semibold"
            >
              <span className="text-2xl">🎵</span>
              <span className="flex-1 text-left">Compartir en TikTok</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-2 text-[var(--muted)] font-mono">O</span>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 p-3.5 bg-[var(--surface-2)] text-[var(--text)] border-2 border-[var(--border)] rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
            >
              <Copy className="w-5 h-5" />
              <span className="flex-1 text-left">Copiar código</span>
            </button>

            {navigator.share && (
              <button
                onClick={shareViaNavigator}
                className="w-full flex items-center gap-3 p-3.5 bg-[var(--surface-2)] text-[var(--text)] border-2 border-[var(--border)] rounded-[12px] shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all font-semibold"
              >
                <Share2 className="w-5 h-5" />
                <span className="flex-1 text-left">Más opciones...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
```

**src/screens/GroupScreen.jsx** - Modificar botones de compartir:
```jsx
// Replace existing share buttons with single "Compartir" button
<button
  onClick={() => setShowShareModal(true)}
  className="w-full px-3 py-2.5 bg-[var(--cyan)] text-black border-2 border-black rounded-[10px] text-sm font-bold shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center justify-center gap-1.5"
>
  <span>📤</span> Compartir Grupo
</button>

{/* Add modal at bottom */}
{showShareModal && (
  <ShareGroupModal group={group} onClose={() => setShowShareModal(false)} />
)}
```

**Files to create:**
- `src/components/groups/ShareGroupModal.jsx`

**Files to modify:**
- `src/screens/GroupScreen.jsx`

---

### 4. Separadores de Equipos con Banderas en Álbum

**Referencia:**
```jsx
// figus/project/src/screens.jsx líneas 439-458
<div style={{
  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
  position: 'relative',
}}>
  <div style={{
    background: team.c1, color: team.c2,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700, fontSize: 11,
    padding: '4px 8px', borderRadius: 5,
    border: '2px solid #0A0A14',
  }}>{g.team}</div>
  <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.4 }}>{team.name.toUpperCase()}</div>
  <div style={{
    flex: 1, height: 2, background: C.border, marginLeft: 4,
  }} />
  <div style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: C.muted,
  }}>{have}/{g.items.length}</div>
</div>
```

**Implementation:**

Instalar librería de banderas:
```bash
# Ya instalada: npm install flag-icons
```

**src/components/album/TeamSeparator.jsx** - Nuevo componente:
```jsx
import `/node_modules/flag-icons/css/flag-icons.min.css`;

// Map FIFA codes to flag-icons country codes
const FIFA_TO_FLAG = {
  'ARG': 'ar', 'BRA': 'br', 'URU': 'uy', 'CHI': 'cl', 'COL': 'co',
  'ECU': 'ec', 'PAR': 'py', 'PER': 'pe', 'VEN': 've', 'BOL': 'bo',
  'MEX': 'mx', 'USA': 'us', 'CAN': 'ca', 'CRC': 'cr', 'HON': 'hn',
  'JAM': 'jm', 'PAN': 'pa', 'TRI': 'tt',
  'ENG': 'gb-eng', 'FRA': 'fr', 'GER': 'de', 'ESP': 'es', 'ITA': 'it',
  'POR': 'pt', 'NED': 'nl', 'BEL': 'be', 'SUI': 'ch', 'CRO': 'hr',
  'DEN': 'dk', 'POL': 'pl', 'SRB': 'rs', 'AUT': 'at', 'CZE': 'cz',
  'WAL': 'gb-wls', 'SCO': 'gb-sct', 'SWE': 'se', 'UKR': 'ua',
  'KOR': 'kr', 'JPN': 'jp', 'AUS': 'au', 'IRN': 'ir', 'KSA': 'sa',
  'QAT': 'qa', 'IRQ': 'iq', 'UAE': 'ae', 'UZB': 'uz', 'NZL': 'nz',
  'MAR': 'ma', 'SEN': 'sn', 'TUN': 'tn', 'CMR': 'cm', 'GHA': 'gh',
  'NGA': 'ng', 'ALG': 'dz', 'EGY': 'eg', 'RSA': 'za', 'CIV': 'ci',
};

export function TeamSeparator({ teamCode, teamName, have, total }) {
  const flagCode = FIFA_TO_FLAG[teamCode] || teamCode.toLowerCase();

  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      {/* Flag */}
      <div className="relative w-10 h-7 rounded-md overflow-hidden border-2 border-black shadow-[2px_2px_0_#000] shrink-0">
        <span className={`fi fi-${flagCode} absolute inset-0 w-full h-full`} style={{ fontSize: '28px' }} />
      </div>

      {/* FIFA Code Badge */}
      <div className="px-2 py-1 bg-[var(--surface-2)] border-2 border-black rounded-md font-mono font-bold text-[11px] tracking-wide shadow-[2px_2px_0_#000]">
        {teamCode}
      </div>

      {/* Team Name */}
      <div className="font-bold text-sm tracking-wide">
        {teamName.toUpperCase()}
      </div>

      {/* Separator Line */}
      <div className="flex-1 h-[2px] bg-[var(--border)] ml-1" />

      {/* Progress Counter */}
      <div className="font-mono text-[11px] text-[var(--muted)] shrink-0">
        {have}/{total}
      </div>
    </div>
  );
}
```

**src/screens/AlbumScreen.jsx** - Usar TeamSeparator:
```jsx
import { TeamSeparator } from '../components/album/TeamSeparator';
import { TEAMS } from '../services/mockData';

// In render, replace team header with:
{groups.map((group) => {
  const team = TEAMS.find(t => t.code === group.team);
  const have = group.stickers.filter(s => s.status !== 'needed').length;

  return (
    <div key={group.team} className="mb-5">
      <TeamSeparator
        teamCode={team.code}
        teamName={team.name}
        have={have}
        total={group.stickers.length}
      />

      {/* Grid of stickers */}
      <div className="grid grid-cols-5 gap-2">
        {group.stickers.map(sticker => (
          <StickerCard key={sticker.id} sticker={sticker} onClick={handleStickerClick} />
        ))}
      </div>
    </div>
  );
})}
```

**Files to create:**
- `src/components/album/TeamSeparator.jsx`

**Files to modify:**
- `src/screens/AlbumScreen.jsx`
- `src/index.css` (import flag-icons CSS)

---

## Data Model Changes

### Firestore Collections

**notifications** (new collection):
```js
{
  id: "auto-generated",
  userId: "user123",
  type: "trade_received" | "trade_accepted" | "trade_rejected" | "group_invite" | "match_found",
  title: "Nueva propuesta de intercambio",
  message: "Juan te propuso intercambiar 3 figuritas",
  data: {
    tradeId: "trade123",
    fromUserId: "user456",
    fromUserName: "Juan",
    // ... context-specific data
  },
  read: false,
  timestamp: Timestamp
}
```

### Notification Types

- `trade_received` - Alguien te envió una propuesta
- `trade_accepted` - Aceptaron tu propuesta
- `trade_rejected` - Rechazaron tu propuesta
- `trade_cancelled` - Cancelaron una propuesta que recibiste
- `group_invite` - Te invitaron a un grupo
- `match_found` - Hay nuevos matches disponibles

---

## Success Metrics

- ✅ Logo "FIGUS" visible en home con estilo Bungee
- ✅ Notificaciones en tiempo real funcionando
- ✅ Badge de contador actualiza correctamente
- ✅ Panel de notificaciones abre/cierra suavemente
- ✅ Compartir por WhatsApp abre app nativa
- ✅ Copiar a clipboard funciona para Instagram/TikTok
- ✅ Banderas se muestran correctamente para todos los equipos
- ✅ Separadores de equipos tienen diseño consistente
- ✅ Responsive en mobile y tablet

---

## Design Reference

Ver prototipo en: `/home/juan/projects/personal/panini/figus/project`

Key files:
- `src/screens.jsx` - HomeScreen (líneas 1-268), AlbumScreen (líneas 315-489)
- `src/components.jsx` - TopBar, NotificationButton

---

## Dependencies

**Requiere completar primero:**
- Phase 9: Toast Notifications ✅

**Bloquea a:**
- N/A (mejoras visuales independientes)

---

## Open Questions

- ❓ ¿Implementar push notifications (FCM) para notificaciones cuando la app está cerrada?
  - **Decisión:** Post-MVP, por ahora solo in-app notifications

- ❓ ¿Persistir notificaciones leídas/no leídas localmente (localStorage)?
  - **Respuesta:** Sí, usar Firestore para sincronización entre dispositivos

- ❓ ¿Expirar notificaciones viejas automáticamente?
  - **Respuesta:** Sí, Cloud Function que elimina notificaciones > 30 días

---

## Implementation Notes

1. **Font Bungee** ya está cargada en `index.css`
2. **flag-icons** ya está instalado como dependencia
3. **date-fns** necesita instalarse: `npm install date-fns`
4. Las notificaciones usan Firestore real-time listeners para updates instantáneos
5. El share via Instagram/TikTok copia al clipboard porque no hay deep links oficiales

---

**Next:** Continue Phase 9 polish tasks

---

**Última actualización:** 2026-05-09
