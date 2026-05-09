# Figus - Technical Specifications

Este directorio contiene todas las especificaciones técnicas del proyecto **Figus** (figus.digital) siguiendo el formato de [GitHub Spec Kit](https://github.com/github/spec-kit).

## 📚 Índice de Especificaciones

### Core Specifications

| ID | Spec | Status | Descripción |
|----|------|--------|-------------|
| [000](./000-overview.md) | **Project Overview** | 🟢 Approved | Visión, objetivos y alcance del proyecto |
| [001](./001-architecture.md) | **Technical Architecture** | 🟢 Approved | Stack tecnológico y decisiones de arquitectura |
| [002](./002-data-models.md) | **Data Models** | 🟢 Approved | Modelos de Firestore y schema completo |
| [003](./003-authentication.md) | **Authentication** | 🟢 Approved | Sistema de autenticación con Google OAuth |
| [004](./004-groups-invitations.md) | **Groups & Invitations** | 🟢 Approved | Sistema de grupos e invitaciones |
| [005](./005-matchmaking.md) | **Matchmaking Algorithm** | 🟢 Approved | Algoritmo de matching de intercambios |

### Implementation Phases

| ID | Fase | Status | Duración | Descripción |
|----|------|--------|----------|-------------|
| [100](./100-phase-0-setup.md) | **Phase 0: Setup** | 🟢 Approved | 1-2 días | Configuración inicial del proyecto |
| [101](./101-phase-1-auth.md) | **Phase 1: Authentication** | 🟢 Approved | 2-3 días | Login con Google |
| [102](./102-phase-2-navigation.md) | **Phase 2: Navigation** | 🟢 Approved | 2 días | Layout y navegación base |
| [103](./103-phase-3-album-view.md) | **Phase 3: Album View** | 🟢 Approved | 3-4 días | Vista del álbum con filtros |
| [104](./104-phase-4-album-edit.md) | **Phase 4: Album Edit** | 🟢 Approved | 2-3 días | Edición de figuritas |
| [105](./105-phase-5-home.md) | **Phase 5: Home Screen** | 🟢 Approved | 2 días | Dashboard con stats |
| [106](./106-phase-6-groups.md) | **Phase 6: Groups** | 🟢 Approved | 3-4 días | Crear y unirse a grupos |
| [107](./107-phase-7-matches.md) | **Phase 7: Match Finding** | 🟢 Approved | 4-5 días | Encontrar intercambios |
| [108](./108-phase-8-trades.md) | **Phase 8: Trade Proposals** | 🟢 Approved | 3 días | Proponer y responder intercambios |
| [109](./109-phase-9-polish.md) | **Phase 9: Polish & Testing** | 🟢 Approved | 3-4 días | Refinamiento y testing |
| [110](./110-phase-10-deploy.md) | **Phase 10: Deploy** | 🟢 Approved | 2 días | Deploy a producción |

## 📖 Cómo Usar Este Directorio

### Para Desarrolladores

1. **Antes de implementar una feature**, lee la spec correspondiente
2. **Si algo no está claro**, actualiza la spec y haz commit
3. **Después de implementar**, actualiza el status de la spec

### Para Revisiones

1. Cada spec tiene sección "Open Questions" - úsala para discusiones
2. Cambios a specs aprobadas requieren review del equipo
3. Nuevas specs empiezan como `status: draft`

### Status Legend

- 🟢 **Approved** - Lista para implementar, no cambiar sin review
- 🟡 **In Review** - En proceso de revisión
- 🔴 **Draft** - Borrador inicial, puede cambiar
- ⚫ **Deprecated** - Ya no se usa

## 🏗️ Convenciones

### Naming
- Core specs: `00X-nombre.md` (000-999)
- Implementation phases: `10X-phase-N.md` (100-199)
- Features específicas: `20X-feature.md` (200+)

### Template Base
Cada spec sigue esta estructura:
```markdown
---
title: Título de la Spec
status: draft | in-review | approved | deprecated
created: YYYY-MM-DD
updated: YYYY-MM-DD
authors: [nombre1, nombre2]
reviewers: [nombre1, nombre2]
---

## Summary
Resumen de 2-3 líneas

## Problem Statement
¿Qué problema resuelve?

## Proposed Solution
¿Cómo lo resolvemos?

## Detailed Design
Detalles técnicos

## Implementation Plan
Pasos concretos

## Open Questions
Dudas pendientes

## Alternatives Considered
Otras opciones evaluadas

## Success Metrics
¿Cómo medimos éxito?

## References
Links a otras specs/docs
```

## 🔗 Referencias Externas

- [Código del prototipo](../../figus/project/) - Diseño visual de referencia
- [CLAUDE.md](../../docs/CLAUDE.md) - Guía de implementación para Claude Code
- [Guía Anti-Spaghetti](../../docs/guia-anti-spaguetti.md) - Estándares de código
- [Master Plan Original](../../docs/modulos/00-MASTER-PLAN.md) - Documento legacy (migrado a specs)

## 📊 Timeline Estimado

**Total:** 25-35 días de trabajo
- Setup y autenticación: 3-5 días
- Core features (álbum + grupos): 10-15 días
- Matchmaking y trades: 7-8 días
- Polish y deploy: 5-6 días

## 👥 Equipo

- **Authors:** Juan (padre), hijo (14 años)
- **Reviewers:** Ambos revisan cada spec antes de implementar
- **Stakeholders:** Grupo de amigos beta testers

---

**Última actualización:** 2026-05-08
