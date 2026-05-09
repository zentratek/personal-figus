# 000 - Project Overview

---
**Title:** Figus - Project Overview & Vision
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Authors:** Juan, hijo
**Reviewers:** Juan

---

## Summary

**Figus** (figus.digital) es una aplicación web colaborativa mobile-first que permite a grupos de amigos adolescentes gestionar sus colecciones de figuritas Panini e intercambiarlas de manera eficiente mediante un algoritmo de matchmaking automático.

## Problem Statement

Los adolescentes que coleccionan figuritas Panini enfrentan varios problemas:

1. **No saben quién tiene las figuritas que necesitan** - Revisar álbumes físicos de 10+ amigos es tedioso
2. **Llevar el álbum físico es riesgoso** - Pueden perderlo o dañarlo en el colegio
3. **Registrar repetidas manualmente** - Usar papel para anotar repetidas es ineficiente
4. **Coordinar intercambios** - Difícil encontrar intercambios "ganar-ganar"
5. **Falta de visibilidad del progreso** - No saben qué tan cerca están de completar

## Proposed Solution

Una **Progressive Web App (PWA)** mobile-first con estas características core:

### Features Principales (MVP v1.0)

1. **Álbum Digital**
   - Grid interactivo con 3 estados: tengo / falta / repetida
   - Filtros rápidos (todas, faltantes, repetidas, especiales)
   - Contador de repetidas disponibles para intercambio
   - Agrupación visual por equipos

2. **Grupos Cerrados**
   - Crear grupo con código de invitación único (formato: `XX-YYYY`)
   - Unirse mediante código compartido por WhatsApp/etc
   - Máximo 10 miembros por grupo
   - Ver progreso de cada miembro

3. **Matchmaker Automático**
   - Algoritmo que encuentra intercambios posibles
   - Muestra: "Vos das [X, Y] y recibís [A, B]"
   - Ordenado por relevancia (cantidad de figuritas)

4. **Propuestas de Intercambio**
   - Enviar propuesta a un amigo del grupo
   - Aceptar/rechazar propuestas
   - Historial de intercambios realizados

5. **Autenticación Simple**
   - Login con cuenta Google (1 click)
   - No requiere crear contraseña

6. **Escaneo OCR de Sobres** 🧪
   - Usar cámara del móvil para detectar números automáticamente
   - Modo "Abrir Sobre" - escanea 5 figuritas de una vez
   - Fallback manual si OCR falla
   - Tecnología: TensorFlow.js o Tesseract.js

### Out of Scope (v1.0)

Estas features NO están en el MVP:

- ❌ **Marketplace/venta** - Requiere manejo de dinero y consideraciones legales con menores
- ❌ **Chat integrado** - Usar WhatsApp/Discord para coordinar
- ❌ **Notificaciones push** - Solo in-app notifications
- ❌ **Múltiples álbumes simultáneos** - Solo 1 álbum activo
- ❌ **Gamificación avanzada** - Sin logros, rankings, leaderboards
- ❌ **Integración con marketplace oficial Panini**

## Target Audience

### Usuario Principal

- **Edad:** 12-16 años
- **Contexto de uso:**
  - Mientras abren sobres con amigos
  - En el colegio durante recreos
  - En casa organizando colección
- **Dispositivo:** Smartphone (iOS/Android), orientación vertical
- **Experiencia técnica:** Usuario casual de apps móviles (TikTok, Instagram, WhatsApp)

### Pain Points Específicos

| Pain Point | Solución Figus |
|------------|----------------|
| "No sé quién tiene la 45 que me falta" | Matchmaker automático |
| "Perdí mi álbum en el colegio" | Todo está en la nube (Firebase) |
| "Tengo 5 repetidas de Messi y no sé con quién cambiar" | Algoritmo muestra todos los matches posibles |
| "¿Cuánto me falta para completar?" | Dashboard con % y stats visuales |
| "Acordé un intercambio y se me olvidó" | Historial de propuestas pendientes |

## Success Metrics

### Phase 1 

- ✅ **10+ grupos activos** (mínimo 3 miembros cada uno)
- ✅ **50+ usuarios registrados**
- ✅ **100+ intercambios propuestos**
- ✅ **70%+ de tasa de aceptación** de propuestas
- ✅ **< 3s tiempo de carga** inicial

### Phase 2 

- ✅ **1+ álbum completado** por al menos un usuario
- ✅ **80%+ retention** semanal (usuarios activos que vuelven)
- ✅ **5+ figuritas añadidas por usuario/semana** en promedio
- ✅ **NPS > 8** (Net Promoter Score) de beta testers

### Technical Metrics

- ✅ **< 2s** algoritmo de matchmaking
- ✅ **< 100ms** tiempo de respuesta de UI (interacciones)
- ✅ **0** bugs críticos en producción
- ✅ **< 5** bugs menores reportados/mes

## Design Principles

### 1. Mobile-First Always

- Diseñar para 375px width (iPhone SE) primero
- Touch targets mínimos: 44x44px
- Toda interacción pensada para una mano
- Viewport: orientación vertical únicamente

### 2. Dark Mode Cyberpunk

- Estética: Gaming brutalism, coleccionismo moderno
- Colores neón sobre fondo oscuro (#08080F)
- Sombras duras (hard shadows 4px offset, no difusas)
- Tipografías: Space Grotesk + JetBrains Mono + Bungee

### 3. Performance > Aesthetics

- Priorizar velocidad de carga
- Animaciones solo con `transform` y `opacity` (GPU)
- Optimistic UI (actualizar local antes de server)
- Offline-first con Firestore persistence

### 4. Social by Design

- Grupos cerrados = confianza (no marketplace público)
- Ver progreso de amigos = motivación
- Matchmaker muestra siempre ambos lados del intercambio

### 5. Educational Project

- Código simple > abstracciones prematuras
- Comentarios explicativos para aprendizaje
- Decisiones técnicas documentadas
- Trade-offs explicados

## High-Level Architecture

```
┌─────────────────────────────────┐
│         FRONTEND (PWA)          │
│  React + Vite + Tailwind CSS    │
└────────────┬────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────┐
│          FIREBASE               │
│  Auth | Firestore | Hosting     │
└─────────────────────────────────┘
```

### Key Decisions

- **React:** Ecosystem educativo extenso
- **Firebase:** Zero DevOps, real-time sync, plan gratuito generoso
- **Tailwind CSS:** Utility-first = rápido de iterar
- **PWA:** Look & feel nativo sin app stores
- **TypeScript:** Usar



## Risks & Mitigations

### Risk: Firestore costs si el proyecto escala

**Probabilidad:** Media
**Impacto:** Alto
**Mitigación:**
- Denormalizar datos críticos (evitar joins)
- Implementar rate limiting en reglas
- Monitorear usage dashboard de Firebase
- Plan B: Migrar a Cloud Functions con cacheo

### Risk: Performance del matchmaker en grupos grandes

**Probabilidad:** Baja (grupos limitados a 10)
**Impacto:** Medio
**Mitigación:**
- Denormalizar arrays de repetidas/needed en user profile
- Ejecutar matching en background (no bloqueante)
- Mostrar skeleton mientras calcula

### Risk: Usuario pierde acceso a su cuenta Google

**Probabilidad:** Baja
**Impacto:** Alto
**Mitigación:**
- Permitir login con email secundario (v2.0)
- Export/backup de colección (v2.0)
- Por ahora: educar sobre importancia de mantener acceso a Google

### Risk: Álbum de Panini oficial cambia (nuevo torneo, nuevas figuritas)

**Probabilidad:** Alta (cada año sale nuevo álbum)
**Impacto:** Medio
**Mitigación:**
- Diseño preparado para múltiples álbumes (campo `albumId`)
- Seed data de álbumes en Firestore
- Proceso de "archivar" álbumes viejos (v2.0)

## Alternatives Considered

### Alternative 1: Native Apps (iOS + Android)

**Pros:**
- Mejor performance
- Acceso a APIs nativas completas
- Publicación en stores (más descubribilidad)

**Cons:**
- Requiere 2 codebases (o React Native = más complejo)
- Proceso de review en stores (2-7 días)
- Curva de aprendizaje más empinada para el hijo

**Decision:** PWA es suficiente para MVP y más educativo.

### Alternative 2: Backend Propio (Node.js + PostgreSQL)

**Pros:**
- Más control sobre queries complejas
- No vendor lock-in
- Potencialmente más barato a largo plazo

**Cons:**
- Requiere configurar servidor, CI/CD, monitoreo
- No hay real-time sync out-of-the-box
- Más complejo para proyecto educativo

**Decision:** Firebase reduce fricción y permite enfocarse en features.

### Alternative 3: Marketplace Público desde el Inicio

**Pros:**
- Potencial de monetización
- Más usuarios posibles

**Cons:**
- Requiere sistema de pagos (Stripe, etc.)
- Consideraciones legales con menores de edad
- Mayor complejidad de moderación
- Dilución del foco social (grupos de amigos)

**Decision:** Grupos cerrados primero, marketplace en v2.0 si hay demanda.

## Open Questions

- ✅ ¿Qué álbum de Panini usar para el MVP?
  - **Decision:** "Copa Continental 2026" ficticio (200 figuritas = 20 equipos × 10)

- ⚠️ ¿Deberíamos permitir múltiples grupos simultáneos?
  - **Status:** Sí pueden estar en múltiples, pero solo 1 activo a la vez

- ⚠️ ¿Cómo manejar usuarios que no completan intercambios acordados?
  - **Status:** Sistema de reportes en v2.0, por ahora confiar en amigos

- ❓ ¿Agregar sistema de "notas" en cada figurita?
  - **Status:** Pendiente, evaluar en beta testing

## References

- [Architecture Spec](./001-architecture.md)
- [Data Models Spec](./002-data-models.md)
- [Master Plan Original](../../docs/modulos/00-MASTER-PLAN.md) (legacy)
- [CLAUDE.md](../../docs/CLAUDE.md) (guía de implementación)
- [Prototipo Visual](../../figus/project/Figus.html)

---

**Next Steps:**
1. Review y aprobar esta spec
2. Leer [001-architecture.md](./001-architecture.md)
3. Iniciar [Phase 0: Setup](./100-phase-0-setup.md)
