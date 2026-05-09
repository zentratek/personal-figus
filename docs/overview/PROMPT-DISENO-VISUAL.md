# Prompt para Diseño Visual - Figus App

## Contexto del Proyecto

Diseña el prototipo visual para **Figus**, una aplicación web móvil colaborativa para que grupos de amigos adolescentes gestionen su colección de figuritas Panini e intercambien entre ellos.

---

## 🎯 Brief Creativo

### Público Objetivo
- **Edad:** 12-16 años (adolescentes)
- **Contexto de uso:** Mientras abren sobres de figuritas, en el colegio, en casa con amigos
- **Dispositivo principal:** Smartphone (Android/iOS)
- **Nivel técnico:** Usuario casual de apps móviles

### Personalidad de la Marca
- **Energética** - Como la emoción de abrir un sobre
- **Social** - Es para compartir con amigos, no solitaria
- **Confiable** - Maneja colecciones valiosas
- **Divertida pero funcional** - No es un juego, es una herramienta útil que disfrutan usar
- **Juvenil sin ser infantil** - Para adolescentes, no niños pequeños

### Referencias de Estilo
- Apps deportivas modernas (OneFootball, ESPN)
- Apps de intercambio peer-to-peer (Vinted, Wallapop)
- Diseño material de Google (componentes móviles)
- Estética del álbum físico de Panini (colores vibrantes, números grandes)

---

## 📱 Especificaciones Técnicas Obligatorias

### Canvas y Viewports
```
Dispositivo base: iPhone SE (375 x 667 px)
Dispositivo objetivo: iPhone 14 Pro (393 x 852 px)
Orientación: Portrait (vertical) únicamente
Safe areas: Considerar notch y barra inferior iOS
```

### Dimensiones Críticas Mobile
- **Touch targets:** Mínimo 44x44 px (iOS HIG)
- **Spacing entre elementos táctiles:** Mínimo 8px
- **Fuentes mínimas:** 16px para body text (evita zoom automático iOS)
- **Bottom navigation:** 64-80px de altura
- **Header:** 56-64px de altura
- **Modales:** Full-screen en móvil

### Tipografía Sugerida
```
Primaria: Inter, SF Pro, o Roboto (legibles en pantallas pequeñas)
Títulos: 20-24px (bold)
Body: 16-18px (regular)
Captions: 14px (mínimo absoluto)
Números de figuritas: 18-20px (bold, alta legibilidad)
```

### Paleta de Colores Base (Ajusta según branding)
```
Primario: #1E40AF (Azul Panini clásico)
Secundario: #10B981 (Verde éxito/tengo)
Acento: #F59E0B (Amarillo repetidas)
Neutro falta: #94A3B8 (Gris claro)
Fondo: #FFFFFF / #F8FAFC
Texto: #1E293B (casi negro, mejor contraste que #000)
Error: #EF4444
```

### Estados de Figuritas (Código de colores)
```
✅ Tengo (owned): Verde #10B981
📥 Necesito (needed): Gris #94A3B8
🔄 Repetida (repeated): Amarillo #F59E0B
⭐ Especial/Holográfica: Degradado dorado
```

---

## 🏗️ Pantallas Principales a Diseñar

### 1. Splash Screen / Onboarding
**Función:** Primera impresión al abrir la app

**Elementos:**
- Logo Figus (grande, centrado)
- Tagline: "Tu álbum digital de figuritas"
- Animación sutil de carga
- Safe area para notch

**Estado:** 1-2 segundos antes de ir a login

---

### 2. Login / Registro
**Función:** Autenticación simple

**Elementos:**
- Logo Figus (parte superior)
- Input: Email o teléfono (grande, 48px altura)
- Input: Contraseña (con toggle mostrar/ocultar)
- Botón: "Entrar" (full-width, CTA principal)
- Botón: "Continuar con Google" (outline, icono)
- Link: "¿Primera vez? Crear cuenta"

**UX Mobile:**
- Inputs con `inputMode` apropiado
- Botones con mínimo 48px altura
- Keyboard overlay considerado (no ocultar botón principal)

---

### 3. Home / Dashboard
**Función:** Vista general del estado de la colección

**Layout Mobile:**
```
┌─────────────────────────┐
│  Header (64px)          │
│  [Logo] [Notif] [User]  │
├─────────────────────────┤
│                         │
│  Card: Progreso         │
│  ┌──────────────────┐   │
│  │ 180/638 (28%)    │   │
│  │ [Progress Bar]   │   │
│  └──────────────────┘   │
│                         │
│  Card: Acciones Rápidas │
│  [+ Agregar] [🔍 Buscar]│
│                         │
│  Card: Grupo Activo     │
│  "Los Cracks" (5 amigos)│
│                         │
│  Card: Matches Hoy      │
│  🎯 3 posibles          │
│  intercambios           │
│                         │
│  (scroll vertical)      │
└─────────────────────────┘
│  Bottom Nav (64px)      │
│  [🏠][📔][🔄][👥]      │
└─────────────────────────┘
```

**Componentes:**
- **Header:** Sticky, con sombra al scroll
- **Cards:** Bordes redondeados (12px), sombra sutil
- **Progreso:** Barra visual gruesa (8px altura)
- **CTAs:** Botones grandes, iconos claros

---

### 4. Mi Álbum (Pantalla Principal)
**Función:** Grid interactivo de figuritas

**Layout Mobile:**
```
┌─────────────────────────┐
│  Header: "Mi Álbum"     │
│  [← Atrás] [Filtros ⚙] │
├─────────────────────────┤
│  Selector de Álbum      │
│  [Mundial Qatar 2022 ▼] │
├─────────────────────────┤
│  Filtros Rápidos (Chips)│
│  [Todas] [Faltantes]    │
│  [Repetidas] [Especiales]│
├─────────────────────────┤
│                         │
│  Grid de Números        │
│  ┌──┬──┬──┬──┬──┐      │
│  │1 │2 │3 │4 │5 │      │ (5 columnas en 375px)
│  ├──┼──┼──┼──┼──┤      │
│  │6 │7 │8 │9 │10│      │
│  ├──┼──┼──┼──┼──┤      │
│  │11│12│13│14│15│      │
│  └──┴──┴──┴──┴──┘      │
│  (scroll infinito)      │
│                         │
│  [+ Agregar Rápido] FAB │ (Floating Action Button)
│                         │
└─────────────────────────┘
│  Bottom Nav             │
└─────────────────────────┘
```

**Especificaciones del Grid:**
- **Tamaño de celda:** ~68x68px en 375px width
- **Gap entre celdas:** 8px
- **Estados visuales:**
  - Tengo: Fondo verde, número en blanco, checkmark
  - Necesito: Fondo gris claro, número en gris oscuro
  - Repetida: Fondo amarillo, número en negro, badge "x3"
  - Especial: Borde dorado grueso, efecto shimmer

**Interacciones:**
- **Tap simple:** Abre modal de detalle
- **Long-press:** Quick actions (marcar como repetida, etc.)
- **Feedback:** Active state con scale(0.95) y sombra

---

### 5. Modal: Detalle de Figurita
**Función:** Ver info y cambiar estado

**Layout Mobile (Full-screen):**
```
┌─────────────────────────┐
│  [✕ Cerrar]  #125       │
│                         │
│  ┌──────────────────┐   │
│  │                  │   │
│  │  [Imagen Figu]   │   │ (Placeholder si no hay foto)
│  │                  │   │
│  └──────────────────┘   │
│                         │
│  Lionel Messi           │
│  Argentina · Delantero  │
│                         │
│  Estado Actual:         │
│  ● Tengo (1)            │
│                         │
│  Cambiar a:             │
│  [  ] Necesito          │ (Radio buttons grandes)
│  [●] Tengo              │
│  [  ] Repetida          │
│                         │
│  Si tengo repetidas:    │
│  Cantidad: [- 1 +]      │ (Stepper)
│                         │
│  [Guardar Cambios] CTA  │
│                         │
└─────────────────────────┘
```

**Animación:** Slide up desde abajo (300ms ease-out)

---

### 6. Agregar Rápido (Modal)
**Función:** Input rápido de múltiples figuritas

**Layout Mobile:**
```
┌─────────────────────────┐
│  Agregar Figuritas      │
│  [✕]                    │
├─────────────────────────┤
│                         │
│  Modo: [Manual ▼]       │
│  (Manual / Rango / Pegar lista)
│                         │
│  ─── Manual ───         │
│  Número de figurita:    │
│  [______] ← Input       │ (Teclado numérico)
│  (Números grandes)      │
│                         │
│  Estado:                │
│  [Tengo] [Repetida]     │ (Toggle buttons)
│                         │
│  [+ Agregar Otra]       │
│                         │
│  ─── Rango ───          │
│  Desde: [1__]           │
│  Hasta: [50_]           │
│  Excepto: [5,12,23]     │
│                         │
│  [Marcar Rango] CTA     │
│                         │
└─────────────────────────┘
```

**UX Crítico:**
- Input con `inputMode="numeric"` y `pattern="[0-9]*"`
- Autocomplete OFF
- Focus automático al abrir
- Enter key → agregar y limpiar input (flujo rápido)

---

### 7. Intercambios / Matches
**Función:** Matchmaker de figuritas

**Layout Mobile:**
```
┌─────────────────────────┐
│  Intercambios           │
│  [Filtros: Todos ▼]     │
├─────────────────────────┤
│                         │
│  Card de Match          │
│  ┌──────────────────┐   │
│  │ 👤 Martín        │   │
│  │ ─────────────────│   │
│  │ 🎯 3 matches     │   │
│  │                  │   │
│  │ Tú das: #45,#67  │   │
│  │ Recibes: #12,#89 │   │
│  │                  │   │
│  │ [Ver Detalles]   │   │
│  └──────────────────┘   │
│                         │
│  Card de Match          │
│  ┌──────────────────┐   │
│  │ 👤 Ana           │   │
│  │ ─────────────────│   │
│  │ 🎯 1 match       │   │
│  │ ...              │   │
│  └──────────────────┘   │
│                         │
│  (scroll vertical)      │
│                         │
└─────────────────────────┘
│  Bottom Nav             │
└─────────────────────────┘
```

**Jerarquía Visual:**
- Nombre del amigo: Bold, 18px
- Número de matches: Color primario, icono 🎯
- Números de figuritas: Monospace, fácil de escanear

---

### 8. Detalle de Match (Modal)
**Función:** Proponer intercambio

**Layout Mobile:**
```
┌─────────────────────────┐
│  [← Volver]             │
│  Intercambio con Martín │
├─────────────────────────┤
│                         │
│  Tú das (2):            │
│  ┌────┐ ┌────┐         │
│  │#45 │ │#67 │         │
│  │Messi│ │Neymar│       │
│  └────┘ └────┘         │
│                         │
│       ⇅ ⇅ ⇅            │ (Visual de intercambio)
│                         │
│  Tú recibes (2):        │
│  ┌────┐ ┌────┐         │
│  │#12 │ │#89 │         │
│  │CR7  │ │Mbappé│       │
│  └────┘ └────┘         │
│                         │
│  Mensaje (opcional):    │
│  [_______________]      │
│                         │
│  [Proponer Intercambio] │ (CTA primario)
│  [Cancelar]             │ (Secundario)
│                         │
└─────────────────────────┘
```

---

### 9. Grupo / Amigos
**Función:** Gestionar tu crew de coleccionistas

**Layout Mobile:**
```
┌─────────────────────────┐
│  Mi Grupo               │
│  [+ Invitar Amigos]     │
├─────────────────────────┤
│                         │
│  Los Cracks 🏆          │
│  Código: LC-8X9Q        │
│  [Copiar] [Compartir]   │
│                         │
│  Miembros (5):          │
│                         │
│  ┌──────────────────┐   │
│  │ 👤 Martín (Tú)   │   │
│  │ 180/638 (28%)    │   │
│  │ ──────────────   │   │ (Progress bar)
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ 👤 Ana           │   │
│  │ 250/638 (39%)    │   │
│  │ ──────────────── │   │
│  │ [Ver Álbum]      │   │
│  └──────────────────┘   │
│                         │
│  (más miembros)         │
│                         │
│  Top Más Buscadas:      │
│  1. #125 (4 personas)   │
│  2. #67 (3 personas)    │
│  3. #89 (3 personas)    │
│                         │
└─────────────────────────┘
│  Bottom Nav             │
└─────────────────────────┘
```

---

### 10. Bottom Navigation (Componente Global)
**Función:** Navegación principal

**Layout:**
```
┌─────────────────────────────┐
│ [🏠]  [📔]  [🔄]  [👥]    │
│ Inicio Álbum Trades Grupo   │
└─────────────────────────────┘
```

**Especificaciones:**
- **Altura total:** 64px (+ safe-area-inset-bottom)
- **Iconos:** 24x24px, stroke 2px
- **Labels:** 12px, solo en tab activo (opcional)
- **Active state:** Color primario + bold
- **Inactive state:** Gris #64748B
- **Tap area:** Toda la columna (no solo el icono)
- **Ripple effect:** En Android, scale en iOS

---

## 🎨 Componentes Reutilizables a Diseñar

### Buttons
```
Primario:     Fondo azul, texto blanco, altura 48px, bold
Secundario:   Outline azul, texto azul, altura 48px
Terciario:    Sin borde, texto azul (links)
Destructivo:  Fondo rojo, texto blanco (eliminar)
Disabled:     Gris claro, opacity 0.5
```

### Cards
```
Padding:      16px
Border radius: 12px
Shadow:       0 1px 3px rgba(0,0,0,0.1)
Background:   #FFFFFF
```

### Inputs
```
Altura:       48px (touch-friendly)
Padding:      12px 16px
Border:       1px solid #E2E8F0
Focus:        Border 2px primary color
Radius:       8px
Placeholder:  #94A3B8
```

### Chips / Tags
```
Altura:       32px
Padding:      6px 12px
Radius:       16px (pill shape)
Background:   #F1F5F9 (default)
Active:       Primary color background
```

### Loading States
```
Skeleton screens: Animación shimmer sutil
Spinners: Solo para acciones cortas (<2s)
Progress bars: Para procesos largos
Pull to refresh: Indicador iOS-style
```

---

## 🎭 Estados de Interacción

### Touch Feedback (CRÍTICO para mobile)
```
Default:      Estado normal
Hover:        N/A (no existe en touch)
Active:       scale(0.95) + brightness(0.95)
Focus:        Outline 2px primary (para keyboard navigation)
Disabled:     opacity(0.5) + cursor not-allowed
Loading:      Spinner interno + disabled
Success:      Checkmark animado + feedback verde
Error:        Shake animation + feedback rojo
```

### Transiciones
```
Modal open:   Slide up 300ms ease-out
Modal close:  Slide down 200ms ease-in
Tab change:   Fade 150ms
Card tap:     Scale 100ms ease-out
List scroll:  Momentum scrolling (nativo)
```

---

## 📐 Grid System Mobile

```
Viewport: 375px (iPhone SE base)

Margins:    16px (lateral)
Columns:    4 columnas (uso flexible)
Gutters:    16px entre contenido

Ejemplo de uso:
┌─16px─┬─────┬─────┬─────┬─────┬─16px─┐
│      │ Col │ Col │ Col │ Col │      │
│      │  1  │  2  │  3  │  4  │      │
└──────┴─────┴─────┴─────┴─────┴──────┘
```

---

## 🔍 Ejemplos de Micro-Interacciones

### 1. Marcar Figurita como "Tengo"
```
1. Tap en número
2. Celda hace scale(1.1) + rotate(5deg)
3. Cambia a verde con ease-out 200ms
4. Checkmark aparece con scale from 0
5. Haptic feedback (vibración sutil)
6. Badge "+1" flota hacia arriba y desaparece
```

### 2. Match Encontrado (Notificación)
```
1. Badge rojo aparece en tab "Intercambios"
2. Al entrar, card de nuevo match con highlight
3. Animación de "shine" atraviesa la card
4. Tap abre detalle con slide-up
```

### 3. Completar Álbum (Easter Egg)
```
1. Al marcar la última figurita
2. Confetti explosion full-screen
3. Modal de celebración: "¡ÁLBUM COMPLETO!"
4. Estadísticas finales
5. Botón para compartir logro
```

---

## ✅ Checklist de Diseño Mobile

Antes de finalizar cada pantalla, verifica:

- [ ] Touch targets ≥ 44x44px
- [ ] Textos ≥ 16px (body text)
- [ ] Funciona en 375px width
- [ ] Respeta safe areas (notch/barra)
- [ ] Bottom nav no oculta contenido
- [ ] Inputs tienen `inputMode` apropiado
- [ ] Modales son full-screen
- [ ] Hay feedback visual en cada tap
- [ ] Scrolls son fluidos (no nested incompatibles)
- [ ] Estados vacíos tienen ilustración + CTA
- [ ] Estados de error son claros y accionables
- [ ] Loading states no bloquean toda la UI
- [ ] Colores tienen contraste WCAG AA (4.5:1 mínimo)
- [ ] Iconos son reconocibles sin labels
- [ ] Navegación es thumb-friendly

---

## 🛠️ Herramientas Recomendadas

**Para Diseño:**
- Figma (templates mobile-first)
- Sketch (con plugins iOS)
- Adobe XD (prototipos interactivos)

**Recursos:**
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [Mobbin](https://mobbin.com/) - Referencia de apps móviles reales
- [UI Sources](https://www.uisources.com/apps) - Inspiración mobile

**Plugins Útiles:**
- Stark (contraste de colores)
- Unsplash (placeholders de fotos)
- Iconify (biblioteca de iconos)
- Anima (export a código)

---

## 📦 Entregables Esperados

1. **Wireframes Low-Fi** (Balsamiq o sketches)
   - Flujo principal: Login → Home → Álbum → Match

2. **Mockups High-Fi** (Figma/Sketch)
   - 10 pantallas principales
   - Estados: Normal, Loading, Error, Empty
   - Light mode (Dark mode opcional fase 2)

3. **Prototipo Interactivo**
   - Navegación entre pantallas
   - Animaciones de modales
   - Transiciones de bottom nav

4. **Design System Base**
   - Colores (palette completa)
   - Tipografías (tamaños y weights)
   - Componentes (buttons, inputs, cards)
   - Iconografía (set de 20-30 iconos)
   - Espaciado (sistema de 4px/8px base)

5. **Especificaciones para Developers**
   - Assets exportados (@1x, @2x, @3x)
   - Tokens de diseño (JSON)
   - Guía de motion (duración de animaciones)

---

## 🎯 Principios de Diseño (TL;DR)

1. **Thumb-first:** Todo alcanzable con una mano
2. **Fast feedback:** Cada acción tiene respuesta visual inmediata
3. **Clear hierarchy:** Siempre claro qué es lo más importante
4. **Familiar patterns:** Usa convenciones mobile estándar
5. **Forgiving UX:** Fácil deshacer errores
6. **Delightful details:** Micro-interacciones que sorprenden
7. **Performance-aware:** Diseños que se pueden implementar eficientemente

---

## 🚀 Prompt Listo para IA de Diseño

Si vas a usar una IA de diseño (Midjourney, DALL-E, etc.) para generar mockups, usa este prompt:

```
Mobile app UI design for "Figus" - a Panini sticker album manager for teens.
Style: Modern, clean, sporty. Color scheme: Blue primary (#1E40AF), green
success, yellow accent. Show: [DESCRIPCIÓN DE LA PANTALLA]. Layout: iOS,
portrait, 375x667px. Include: bottom navigation bar, safe area spacing,
touch-friendly buttons (44px min). Design system: rounded corners (12px),
subtle shadows, bold typography. Feel: energetic but functional, like
a sports app meets a collection manager.
```

---

**¿Listo para diseñar Figus?** 🎨📱

Este documento es tu guía completa para crear un diseño mobile-first que los adolescentes van a amar usar.
