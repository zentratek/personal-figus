# 007 - Copa Mundial de la FIFA 2026™ - Álbum Oficial Panini

---
**Title:** Especificaciones del Álbum Oficial Copa Mundial de la FIFA 2026™
**Status:** 🟢 Reference
**Created:** 2026-05-08
**Updated:** 2026-05-08
**Authors:** Panini, Juan
**Source:** https://www.panini.com.co/copa-mundial-fifa-2026

---

## Summary

La Copa Mundial de la FIFA 26™ marca un nuevo capítulo en la historia del torneo. Por eso, el álbum oficial licenciado de stickers de Panini presenta una colección más amplia, desarrollada para reflejar la escala de una edición con más selecciones, más jugadores y más contenido oficial.

Este documento contiene las especificaciones oficiales del álbum que servirán como base para el modelo de datos de la aplicación Figus.

## Especificaciones Oficiales del Álbum

### Información General

- **Nombre:** Copa Mundial de la FIFA 2026™
- **Publisher:** Panini
- **Año:** 2026
- **Variante única:** Disponible en versión Filial y Export

### Dimensiones del Álbum

| Característica | Cantidad |
|----------------|----------|
| **Páginas totales** | 112 |
| **Stickers totales** | 980 |
| **Selecciones participantes** | 48 |
| **Stickers por sobre** | 7 |
| **Sticker extra insertado** | 1 (aleatorio) |
| **Sobres por Display Box** | 104 |

### Estructura por Selección

Cada una de las 48 selecciones tendrá:

- **2 páginas** dedicadas en el álbum
- **20 stickers** por equipo:
  - **18 stickers** de retratos de jugadores
  - **1 sticker** grupal del equipo
  - **1 escudo oficial** en material especial

**Total stickers de selecciones:** 48 × 20 = **960 stickers**

### Páginas Especiales

El álbum incluirá páginas especiales sobre:

- **Estadios** - Sedes del torneo
- **Calendario de partidos** - Fixture completo
- **Historia de la Copa Mundial de la FIFA™** - Retrospectiva
- **Camino a la Copa Mundial de la FIFA™** - Proceso clasificatorio
- **Récords** - Estadísticas y logros históricos

### Stickers Extra (Coleccionables Especiales)

- **20 stickers extra únicos** de jugadores en acción
- **4 variantes de color** por cada sticker extra
- **Inserción aleatoria:** 1 cada 100 sobres (en promedio)
- **Formato:** Mismo que la colección 2022

**Total stickers extra:** 20 × 4 variantes = **80 stickers**

### Cálculo Total

```
Stickers de selecciones:     48 equipos × 20 = 960
Stickers extra:              20 únicos × 4 variantes = 80
─────────────────────────────────────────────────────
TOTAL:                                                 1,040 stickers coleccionables

Stickers en álbum base:                                980 stickers
```

> **Nota:** Los 980 stickers incluyen los 960 de selecciones más 20 espacios base. Los stickers extra con sus variantes (80 adicionales) son inserciones especiales que no cuentan para la completitud del álbum base.

## Distribución y Probabilidades

### Por Sobre

- **Stickers regulares:** 7 por sobre
- **Probabilidad de sticker extra:** ~1% (1 cada 100 sobres)

### Por Display Box

- **Sobres incluidos:** 104
- **Stickers regulares esperados:** 104 × 7 = 728
- **Stickers extra esperados:** ~1 por box (en promedio)

### Completitud Esperada

Para completar el álbum de 980 stickers (sin contar extras):

```
Sobres teóricos mínimos:  980 ÷ 7 = 140 sobres
Sobres reales estimados:  ~400-600 sobres (considerando repetidas)
Display Boxes estimadas:  4-6 boxes aproximadamente
```

> **Importante:** Estos son valores estimados. La cantidad real depende de la distribución aleatoria y el nivel de intercambios con otros coleccionistas.

## Tipos de Stickers Especiales

### 1. Escudo Oficial (Badge)
- **Cantidad:** 48 (1 por selección)
- **Material:** Material especial (holográfico/brillante)
- **Posición:** Primera posición de cada equipo

### 2. Foto Grupal (Group Photo)
- **Cantidad:** 48 (1 por selección)
- **Tipo:** Foto oficial del equipo completo
- **Posición:** Segunda posición de cada equipo

### 3. Retratos de Jugadores (Portraits)
- **Cantidad:** 864 (18 por selección × 48 equipos)
- **Tipo:** Fotos individuales de jugadores
- **Posiciones:** Posiciones 3-20 de cada equipo

### 4. Stickers Extra en Acción (Action Cards)
- **Cantidad:** 20 únicos con 4 variantes cada uno
- **Tipo:** Jugadores destacados en poses de acción
- **Variantes:** 4 colores diferentes (ej: rojo, azul, verde, dorado)
- **Rareza:** Alta (1 cada 100 sobres aprox.)

## Implementación en Figus

### ID Format

```typescript
// Stickers regulares de equipos
`{TEAM_CODE}-{NUMBER}`
// Ejemplo: "ARG-001" (Escudo Argentina)
// Ejemplo: "ARG-002" (Grupo Argentina)
// Ejemplo: "ARG-003" (Jugador #1 Argentina)

// Stickers extra en acción
`ACTION-{NUMBER}-{VARIANT}`
// Ejemplo: "ACTION-001-red" (Messi en acción, variante roja)
// Ejemplo: "ACTION-001-blue" (Messi en acción, variante azul)
```

### Ranges de Stickers

```
Selección 1 (ARG):     001 - 020
Selección 2 (BRA):     021 - 040
Selección 3 (URU):     041 - 060
...
Selección 48:          941 - 960

Stickers Extra:        ACTION-001 a ACTION-020 (× 4 variantes)
```

### Stats Calculation

```typescript
// Para tracking de completitud
totalStickers: 980          // Base álbum (no incluye variantes extras)
totalOwned: number          // Stickers únicos que el usuario tiene
totalNeeded: number         // 980 - totalOwned
totalRepeated: number       // Cantidad de duplicados
completionPct: number       // (totalOwned / 980) × 100
```

## Referencias Visuales

### Estructura del Álbum (Conceptual)

```
┌─────────────────────────────────────────┐
│  Páginas 1-2: Introducción              │
│  Páginas 3-4: Historia Copa Mundial     │
│  Páginas 5-6: Estadios                  │
│  Páginas 7-8: Calendario                │
│  ─────────────────────────────────────  │
│  Páginas 9-10: Selección 1 (ARG)        │
│    • Sticker 1: Escudo                  │
│    • Sticker 2: Foto Grupal             │
│    • Stickers 3-20: Jugadores           │
│  ─────────────────────────────────────  │
│  Páginas 11-12: Selección 2 (BRA)       │
│    • ...                                │
│  ─────────────────────────────────────  │
│  ... (46 selecciones más)               │
│  ─────────────────────────────────────  │
│  Páginas 109-110: Récords               │
│  Páginas 111-112: Camino a Copa         │
│  ─────────────────────────────────────  │
│  Sección Extra: Action Cards (colección │
│  opcional, no pegados en álbum)         │
└─────────────────────────────────────────┘
```

## Open Questions

- ❓ **¿Cuándo será la fecha de lanzamiento oficial?**
  - **Status:** TBD - Pendiente confirmación de Panini

- ❓ **¿Los stickers extra se pegan en el álbum o son coleccionables aparte?**
  - **Status:** Presumiblemente son coleccionables aparte (como en 2022)

- ❓ **¿Habrá versión digital oficial de Panini?**
  - **Status:** No confirmado - Figus sería alternativa independiente

## References

- [Data Models](./002-data-models.md) - Schema de Firestore actualizado
- [Panini Colombia - Copa Mundial FIFA 2026™](https://www.panini.com.co/copa-mundial-fifa-2026)
- Colección Copa Mundial 2022 (formato de referencia)

---

**Una colección oficial para una edición histórica**

> Este documento sirve como referencia permanente para el desarrollo de Figus. Cualquier decisión de diseño o implementación relacionada con el álbum debe basarse en estas especificaciones oficiales.
