# Phase 8: Trade Proposals & Completion

---
**Title:** Phase 8: Trade Proposals & Completion
**Status:** 🟡 In Review
**Created:** 2026-05-08
**Duration:** 3 días

---

## Summary

Sistema completo de propuestas de intercambio: crear propuestas personalizadas, enviar/recibir, aceptar/rechazar, y actualizar automáticamente las figuritas de ambos usuarios cuando se completa el intercambio.

## Objectives

- [x] Crear propuestas de intercambio con selección de figuritas específicas
- [x] Ver propuestas enviadas y recibidas con estados (pending/accepted/rejected)
- [x] Aceptar o rechazar propuestas recibidas
- [x] Actualizar automáticamente las figuritas de ambos usuarios al aceptar
- [x] Mostrar historial de intercambios completados

## Tasks

### 1. Trade Proposal Modal

Modal para crear propuestas de intercambio permitiendo seleccionar figuritas específicas de ambos lados.

**Implementation:**

Componente `TradeProposalModal` que:
- Muestra las figuritas compatibles del match seleccionado
- Permite seleccionar múltiples figuritas para ofrecer (de tus repetidas)
- Permite seleccionar múltiples figuritas para pedir (de las repetidas del otro)
- Incluye búsqueda por número o nombre de jugador
- Valida que se seleccione al menos 1 de cada lado
- Envía la propuesta usando `createTrade()`

**Files created:**
- `src/components/trades/TradeProposalModal.jsx`

**Features:**
- Grid de 4 columnas con figuritas seleccionables
- Búsqueda en tiempo real (aparece cuando hay >10 figuritas)
- Contador de figuritas seleccionadas
- Botón de envío con formato "ENVIAR PROPUESTA (3×2)"
- Estados de loading y error

### 2. Match Detail Modal

Modal que muestra el detalle completo de un match y permite iniciar propuesta.

**Implementation:**

Componente `MatchDetailModal` que:
- Muestra información del usuario (avatar, nombre, % completado)
- Muestra contador de figuritas compatibles
- Lista todas las figuritas que podés ofrecer
- Lista todas las figuritas que podés recibir
- Botón para abrir TradeProposalModal

**Files created:**
- `src/components/trades/MatchDetailModal.jsx`

**Features:**
- Diseño con gradiente rosa para el score
- Grid de 5 columnas para mostrar figuritas
- Textos actualizados: "LAS QUE TENÉS REPETIDAS" y "LAS QUE {NOMBRE} TIENE REPETIDAS"
- Modal apilado sobre TradesScreen

### 3. Trades Screen - Tabs Expansion

Expandir TradesScreen para mostrar propuestas enviadas, recibidas y completadas.

**Implementation:**

Actualizar `TradesScreen.jsx`:
- Grid de 2x2 para 4 tabs: POSIBLES / ENVIADOS / RECIBIDOS / HECHOS
- Cargar trades del usuario con `getUserTrades()`
- Filtrar por tipo: sent, received, completed
- Mostrar badges con estados (PENDIENTE, ACEPTADO, RECHAZADO)
- Botones de ACEPTAR/RECHAZAR en recibidos
- Vista de historial en completados

**Files modified:**
- `src/screens/TradesScreen.jsx`

**Features:**
- Tab ENVIADOS: muestra propuestas enviadas con estado
- Tab RECIBIDOS: propuestas pendientes con botones de acción
- Tab HECHOS: historial de intercambios completados
- Auto-reload después de aceptar/rechazar
- Animación pulse en badge "NUEVA"

### 4. Trade Service - CRUD Operations

Servicios para crear, obtener y actualizar propuestas de intercambio.

**Implementation:**

Funciones en `tradeService.js`:

```javascript
// Crear propuesta
createTrade(fromUserId, fromUserName, toUserId, toUserName, offering, requesting, message)

// Obtener trades de un usuario
getUserTrades(userId, type = 'all') // type: 'sent' | 'received' | 'all'

// Aceptar propuesta
acceptTrade(tradeId, userId)

// Rechazar propuesta
rejectTrade(tradeId, userId)

// Cancelar propuesta (solo creador)
cancelTrade(tradeId, userId)

// Completar trade manualmente
completeTrade(tradeId, userId)
```

**Files modified:**
- `src/services/tradeService.js`

**Features:**
- Validaciones: solo recipient puede aceptar/rechazar
- Validaciones: solo pending trades pueden cambiar estado
- Timestamps: createdAt, acceptedAt, completedAt
- Estructura completa de datos (offering/requesting con full sticker info)

### 5. Auto-Update Stickers After Trade

Actualizar automáticamente las figuritas de ambos usuarios cuando se acepta un intercambio.

**Implementation:**

Función helper `updateUserStickersAfterTrade()`:

```javascript
// Para cada figurita ofrecida:
- Si count > 2: decrementa count (sigue repeated)
- Si count == 2: count = 1, status = 'owned'
- Si count == 1: count = 0, status = 'needed' (caso edge)

// Para cada figurita recibida:
- Si status == 'needed': count = 1, status = 'owned'
- Si status == 'owned': count = 2, status = 'repeated'
- Si status == 'repeated': incrementa count
```

Llamada automática desde `acceptTrade()` para ambos usuarios.

**Files modified:**
- `src/services/tradeService.js`
- Usa `getUserStickers()` y `updateSticker()` de `stickerService.js`

**Features:**
- Actualización atómica (ambos usuarios o ninguno)
- Manejo correcto de cantidades y estados
- Logging para debugging

### 6. UI/UX Improvements

Mejoras de texto y experiencia de usuario.

**Changes:**
- Texto del modal: "VOS DAS" → "LAS QUE TENÉS REPETIDAS"
- Texto del modal: "RECIBES" → "LAS QUE {NOMBRE} TIENE REPETIDAS"
- Helper text actualizado: "Seleccioná las figuritas que querés intercambiar"
- Estados visuales claros con colores (yellow=pending, cyan=accepted, red=rejected, lime=completed)

**Files modified:**
- `src/components/trades/MatchDetailModal.jsx`
- `src/screens/TradesScreen.jsx`

## Testing Checklist

- [x] Crear propuesta con múltiples figuritas funciona
- [x] Búsqueda de figuritas en modal funciona
- [x] Propuestas aparecen en tab ENVIADOS del creador
- [x] Propuestas aparecen en tab RECIBIDOS del destinatario
- [x] Aceptar propuesta actualiza estado a completed
- [x] Aceptar propuesta actualiza figuritas de ambos usuarios correctamente
- [ ] Rechazar propuesta funciona
- [ ] Propuestas completadas aparecen en tab HECHOS para ambos
- [ ] Stats del home se actualizan después del intercambio
- [ ] Matches se recalculan después del intercambio
- [ ] No hay errores en console
- [ ] Performance: aceptar trade < 2s

## Success Metrics

- ✅ Usuario puede crear propuesta personalizada seleccionando figuritas
- ✅ Usuario ve claramente qué propuestas envió y cuáles recibió
- ✅ Usuario puede aceptar/rechazar propuestas con un click
- ✅ Figuritas se actualizan automáticamente al completar intercambio
- ✅ Historial de intercambios completados visible para ambos usuarios
- ✅ UX clara y responsive en mobile

## Deliverables

Lista de qué debe estar terminado al finalizar esta fase:

- ✅ TradeProposalModal implementado con selección de figuritas
- ✅ MatchDetailModal con vista completa del match
- ✅ TradesScreen con 4 tabs funcionales (Posibles/Enviados/Recibidos/Hechos)
- ✅ CRUD completo de trades en tradeService
- ✅ Auto-actualización de figuritas al aceptar
- [ ] Tests manuales pasando
- [ ] Performance verificada
- [ ] Stats y matches se actualizan post-trade

## Dependencies

**Requiere completar primero:**
- Phase 7: Match Finding ✅

**Bloquea a:**
- Phase 9: Polish & Testing

## Open Questions

- ❓ ¿Deberíamos permitir cancelar propuestas enviadas?
  - **Respuesta:** Sí, función `cancelTrade()` implementada pero no hay UI
- ❓ ¿Qué pasa si un usuario modifica sus figuritas después de recibir una propuesta?
  - **Pendiente:** Validar que las figuritas siguen disponibles al aceptar
- ❓ ¿Deberíamos mostrar notificaciones push cuando recibes una propuesta?
  - **Futuro:** Phase 9 o post-MVP
- ❓ ¿Límite de propuestas activas por usuario?
  - **Pendiente:** Considerar límite de 10 propuestas pending

## Implementation Status

### ✅ Completado
- TradeProposalModal
- MatchDetailModal
- TradesScreen con 4 tabs
- CRUD de trades (create, get, accept, reject, cancel)
- Auto-actualización de figuritas
- UI/UX mejoras de texto

### 🔄 En Progreso
- Testing completo

### ⏳ Pendiente
- Validación de disponibilidad al aceptar
- Cancelar propuesta desde UI
- Actualización de stats post-trade
- Recálculo de matches post-trade

## References

- [Spec 005: Matchmaking Algorithm](./005-matchmaking.md)
- [Spec 002: Data Models](./002-data-models.md)
- [Phase 7: Match Finding](./107-phase-7-matches.md)

---

**Next:** [Phase 9: Polish & Testing](./109-phase-9-polish.md)

---

**Última actualización:** 2026-05-08
