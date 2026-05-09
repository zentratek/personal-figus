# 104 - Phase 4: Sticker Management

---
**Title:** Phase 4: Sticker Management - Edición y Gestión de Figuritas
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Duration:** 2-3 días

---

## Summary

Implementar la funcionalidad para agregar, editar y gestionar figuritas individualmente. Modal de edición con controles para cambiar estado (needed/owned/repeated) y contador. Integración con Firestore para persistencia real de datos.

## Objectives

- [ ] Modal de edición de sticker con diseño cyberpunk
- [ ] Cambiar estado de sticker (needed → owned → repeated)
- [ ] Incrementar/decrementar contador de repetidas
- [ ] Integración con Firestore para guardar cambios
- [ ] Actualizar stats en tiempo real
- [ ] Animaciones y feedback visual

## Tasks

### 1. Crear Firestore Service

Service layer para operaciones CRUD de stickers en Firestore.

**Implementation:**
```javascript
// src/services/stickerService.js
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const updateSticker = async (userId, stickerId, updates) => {
  const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;
  const stickerRef = doc(db, 'stickers', docId);

  await updateDoc(stickerRef, {
    ...updates,
    updatedAt: new Date()
  });
};

export const getUserStickers = async (userId) => {
  const stickersRef = collection(db, 'stickers');
  const q = query(stickersRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateStickerStatus = async (userId, stickerId, newStatus, count = 1) => {
  await updateSticker(userId, stickerId, {
    status: newStatus,
    count: newStatus === 'repeated' ? count : newStatus === 'owned' ? 1 : 0
  });
};
```

**Files to create:**
- `src/services/stickerService.js`

### 2. Componente StickerModal

Modal full-screen para editar una figurita.

**Features:**
- Vista previa de la figurita con bandera
- Tabs de estado: Necesito / Tengo / Repetidas
- Contador para repetidas (+/- buttons)
- Botón "Guardar" con animación
- Botón "Cerrar" (X)

**Implementation:**
```javascript
// src/components/album/StickerModal.jsx
import { useState } from 'react';
import { updateStickerStatus } from '../../services/stickerService';
import { useAuth } from '../../contexts/AuthContext';

export function StickerModal({ sticker, onClose, onUpdate }) {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState(sticker.status);
  const [count, setCount] = useState(sticker.count || 1);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStickerStatus(
        user.uid,
        sticker.stickerId,
        selectedStatus,
        count
      );

      // Actualizar localmente
      onUpdate({
        ...sticker,
        status: selectedStatus,
        count: selectedStatus === 'repeated' ? count : selectedStatus === 'owned' ? 1 : 0
      });

      onClose();
    } catch (error) {
      console.error('Error updating sticker:', error);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">
      {/* Modal content */}
      <div className="bg-[var(--surface)] w-full max-w-md rounded-t-3xl sm:rounded-3xl border-2 border-[var(--border)] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b-2 border-[var(--border)] flex justify-between items-center">
          <h3 className="text-xl font-bold">Editar Figurita #{sticker.number}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Sticker preview */}
        <div className="p-6 text-center">
          <span className={`fi fi-${sticker.flagCode} text-6xl mb-4 inline-block`} />
          <h2 className="text-2xl font-bold mb-1">{sticker.playerName}</h2>
          <p className="text-[var(--muted)]">{sticker.teamName}</p>
        </div>

        {/* Status tabs */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: 'needed', label: 'Necesito', color: 'var(--muted)' },
              { id: 'owned', label: 'Tengo', color: 'var(--cyan)' },
              { id: 'repeated', label: 'Repetida', color: 'var(--lime)' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`
                  py-3 rounded-lg font-bold text-sm transition-all
                  ${selectedStatus === status.id
                    ? 'bg-[var(--lime)] text-black shadow-[3px_3px_0_#000] scale-105'
                    : 'bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--surface-3)]'
                  }
                `}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Counter for repeated */}
          {selectedStatus === 'repeated' && (
            <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-[var(--surface-2)] rounded-lg">
              <button
                onClick={() => setCount(Math.max(2, count - 1))}
                className="w-10 h-10 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border)] font-bold text-xl"
              >
                −
              </button>
              <div className="text-3xl font-bold text-[var(--lime)]">
                ×{count}
              </div>
              <button
                onClick={() => setCount(count + 1)}
                className="w-10 h-10 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border)] font-bold text-xl"
              >
                +
              </button>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Files to create:**
- `src/components/album/StickerModal.jsx`

### 3. Integrar Modal en AlbumScreen

Conectar el modal con el grid de stickers.

**Implementation:**
```javascript
// Actualizar AlbumScreen.jsx
const [selectedSticker, setSelectedSticker] = useState(null);

const handleStickerClick = (sticker) => {
  setSelectedSticker(sticker);
};

const handleStickerUpdate = (updatedSticker) => {
  setStickers(prev =>
    prev.map(s => s.id === updatedSticker.id ? updatedSticker : s)
  );
};

return (
  <AppLayout title="ÁLBUM">
    {/* ... existing code ... */}

    {selectedSticker && (
      <StickerModal
        sticker={selectedSticker}
        onClose={() => setSelectedSticker(null)}
        onUpdate={handleStickerUpdate}
      />
    )}
  </AppLayout>
);
```

**Files to modify:**
- `src/screens/AlbumScreen.jsx`

### 4. Inicializar Stickers en Firestore

Cloud Function o script para crear los 960 stickers cuando un usuario se registra.

**Implementation:**
```javascript
// src/services/initializeUserStickers.js
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { TEAMS } from './mockData';

export const initializeUserStickers = async (userId) => {
  const batches = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;

  TEAMS.forEach(team => {
    for (let i = 0; i < 20; i++) {
      const number = team.range[0] + i;
      const stickerId = `${team.code}-${String(number).padStart(3, '0')}`;
      const docId = `${userId}_copa-mundial-fifa-2026_${stickerId}`;

      currentBatch.set(doc(db, 'stickers', docId), {
        userId,
        stickerId,
        albumId: 'copa-mundial-fifa-2026',
        status: 'needed',
        count: 0,
        number,
        team: team.code,
        teamName: team.name,
        flagCode: team.flagCode,
        playerName: i === 0 ? `Escudo ${team.name}` :
                    i === 1 ? `Equipo ${team.name}` :
                    `Jugador ${number}`,
        position: i === 0 ? 'BADGE' : i === 1 ? 'GROUP' : 'DEL',
        isSpecial: i === 0,
        color1: team.color1,
        color2: team.color2,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      operationCount++;

      if (operationCount === 500) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }
  });

  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  await Promise.all(batches.map(batch => batch.commit()));
};
```

**Files to create:**
- `src/services/initializeUserStickers.js`

### 5. Cargar Stickers desde Firestore

Reemplazar mock data con datos reales de Firestore.

**Implementation:**
```javascript
// Actualizar AlbumScreen.jsx
import { getUserStickers } from '../services/stickerService';

export function AlbumScreen() {
  const { user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStickers = async () => {
      try {
        const userStickers = await getUserStickers(user.uid);

        // Si no tiene stickers, inicializar
        if (userStickers.length === 0) {
          await initializeUserStickers(user.uid);
          const newStickers = await getUserStickers(user.uid);
          setStickers(newStickers);
        } else {
          setStickers(userStickers);
        }
      } catch (error) {
        console.error('Error loading stickers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStickers();
  }, [user.uid]);

  if (loading) {
    return (
      <AppLayout title="ÁLBUM">
        <div className="flex items-center justify-center h-64">
          <div className="text-[var(--muted)]">Cargando álbum...</div>
        </div>
      </AppLayout>
    );
  }

  // ... rest of component
}
```

**Files to modify:**
- `src/screens/AlbumScreen.jsx`

## Testing Checklist

- [ ] Modal abre al hacer click en una figurita
- [ ] Tabs de estado cambian correctamente
- [ ] Contador de repetidas incrementa/decrementa
- [ ] Guardar persiste cambios en Firestore
- [ ] Stats se actualizan en tiempo real
- [ ] Modal cierra con botón X o al guardar
- [ ] Loading state mientras carga stickers
- [ ] Inicialización automática de 960 stickers
- [ ] Animaciones fluidas del modal
- [ ] Responsive en mobile

## Success Metrics

- ✅ CRUD completo de stickers funcional
- ✅ Persistencia en Firestore
- ✅ Stats actualizados en tiempo real
- ✅ UX fluida sin lag

## Deliverables

- ✅ `StickerModal` component funcional
- ✅ `stickerService` con Firestore integration
- ✅ Inicialización automática de stickers
- ✅ AlbumScreen conectado a Firestore
- ✅ Stats en tiempo real

## Dependencies

**Requiere completar primero:**
- Phase 3: Album View ✅

**Bloquea a:**
- Phase 5: Home Screen mejorado
- Phase 6: Groups & Matching

## Open Questions

- ✅ ¿Usar mock data o Firestore?
  - **Decision:** Firestore en Phase 4

- ❓ ¿Permitir eliminar stickers?
  - **Status:** No por ahora, solo cambiar a "needed"

- ❓ ¿Agregar confirmación antes de guardar?
  - **Status:** No necesario, es una operación reversible

## References

- [002-data-models.md](./002-data-models.md) - Sticker schema
- [103-phase-3-album-view.md](./103-phase-3-album-view.md) - Album view

---

**Next:** [Phase 5: Home Screen](./105-phase-5-home-screen.md)
