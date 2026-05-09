# Instrucciones para Claude Code - Proyecto Figus

## Contexto del Proyecto

Estás ayudando a desarrollar **Figus** (figus.digital), una aplicación web colaborativa para el intercambio de figuritas Panini entre grupos de amigos adolescentes. El proyecto es desarrollado por un padre y su hijo de 14 años como experiencia de aprendizaje.

**Diseño Base:** Existe un prototipo completo en `/figus/project/` que debes usar como referencia visual exacta. Lee ese código para entender la estructura de componentes, pero implementarás todo desde cero con tecnologías modernas.

## Principios Fundamentales

### 1. Mobile-First SIEMPRE
- **TODAS** las decisiones de diseño deben priorizar la experiencia móvil
- Viewport base: 375px (iPhone SE) hasta 430px (iPhone 14 Pro Max)
- Diseña primero para móvil, luego adapta a tablet/desktop si es necesario
- Touch targets mínimos: 44x44px (estándar iOS/Android)
- Testea mentalmente cada elemento con el pulgar en una mano
- **Viewport del prototipo:** 402x874px (simulación iOS device)

### 2. Dark Mode Cyberpunk - Estética "Brutal"
**IMPORTANTE:** El diseño aprobado usa un estilo dark mode con estética gaming/cyberpunk, NO colores deportivos tradicionales.

**Identidad Visual:**
- **Estilo:** Brutalismo digital, gaming, coleccionismo moderno
- **Ambiente:** Oscuro pero vibrante, con acentos neón
- **Personalidad:** Energético, juvenil, tech-forward
- **Referencias:** Trading card games digitales, apps de coleccionismo

**Navegación y UX:**
- **Bottom Navigation Bar** con 4 tabs: Inicio, Álbum, Cambios, Grupo
- **Modales full-screen** estilo bottom sheet (deslizar desde abajo)
- **Transiciones:** 200-300ms con cubic-bezier suaves
- **Feedback táctil:** Transform scale + sombras que "se comprimen"
- **Safe Areas:** 56px top (status bar), 28px bottom (home indicator)

### 3. Stack Tecnológico
```
Frontend: React 18+ con Vite
Styling: Tailwind CSS + CSS custom properties para tema
Backend: Firebase (Auth con Google, Firestore, Hosting)
PWA: Workbox para funcionalidad offline
Estado: Context API o Zustand (NO Redux para este proyecto)
Fuentes: Space Grotesk, JetBrains Mono, Bungee (Google Fonts)
```

### 4. Arquitectura Anti-Spaghetti
- **SIEMPRE** sigue la guía `/docs/guia-anti-spaguetti.md`
- Componentes < 100 líneas
- Lógica de negocio en custom hooks
- Llamadas Firebase en services centralizados
- Constantes en archivos dedicados
- Una responsabilidad por componente

## Sistema de Diseño Dark Mode

### Paleta de Colores (CSS Custom Properties)

```css
:root {
  /* Fondos */
  --bg: #08080F;           /* Fondo principal casi negro */
  --surface: #14141F;      /* Cards y elementos elevados */
  --surface-2: #1C1C2A;    /* Segundo nivel */
  --surface-3: #262638;    /* Tercer nivel */
  --border: #2A2A3D;       /* Bordes sutiles */

  /* Colores de Marca */
  --primary: #FF2D8E;      /* Rosa/Magenta - CTA principal */
  --cyan: #00F0FF;         /* Cyan neón - Acentos */
  --lime: #C6FF3E;         /* Lima - Estado "tengo" */
  --gold: #FFC700;         /* Oro - Especiales/premium */
  --red: #FF4D4D;          /* Rojo - Alertas */

  /* Texto */
  --text: #F5F5FF;         /* Blanco casi puro */
  --muted: #6E6E85;        /* Texto secundario */
}
```

**Estados de Figuritas:**
- 🟢 **Tengo (owned):** `--lime` (#C6FF3E) con checkmark
- 🔴 **Repetida (repeated):** `--primary` (#FF2D8E) con badge "×N"
- ⚫ **Falta (needed):** Gris oscuro #13131F con borde dashed
- ⭐ **Especial:** Degradado dorado con borde grueso y estrella

### Tipografías

```css
/* Importar desde Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Bungee&display=swap');

/* Uso */
body, .text-body {
  font-family: 'Space Grotesk', system-ui, sans-serif;
}

.text-mono, .sticker-number {
  font-family: 'JetBrains Mono', monospace;
}

.text-logo, .text-impact {
  font-family: 'Bungee', sans-serif;
}
```

**Escalas de Texto:**
- Body: 14-16px (Space Grotesk)
- Números de figuritas: 16-22px (JetBrains Mono Bold)
- Títulos: 18-24px (Space Grotesk Bold)
- Logo: 24px+ (Bungee)
- Captions/labels: 10-12px (JetBrains Mono)

### Sombras "Brutales" (Hard Shadows)

**NO uses sombras difusas.** El estilo requiere **sombras duras offset**:

```jsx
// ✅ BIEN: Sombra dura estilo brutal
<div className="
  border-2 border-black
  shadow-[4px_4px_0_#000]
  active:shadow-[1px_1px_0_#000]
  active:translate-x-[3px]
  active:translate-y-[3px]
  transition-all duration-100
">

// ❌ MAL: Sombras suaves tradicionales
<div className="shadow-lg shadow-gray-500/50">
```

**Niveles de Sombra:**
- Cards: `4px 4px 0 #000`
- Buttons pressed: `1px 1px 0 #000`
- CTAs: `4px 4px 0 #000`
- Stickers: `3px 3px 0 #000`

### Componentes Base - Referencia del Prototipo

#### StickerCell (Componente Hero)

```jsx
// Specs del prototipo:
// - Tamaño: 50px-76px (según densidad)
// - Border: 2px solid
// - Border radius: 8px
// - Font: JetBrains Mono Bold
// - Shadow: 3px 3px 0 #000
// - Transition: transform 100ms

// Estados visuales:
{
  needed: {
    bg: '#13131F',
    color: '#3A3A52',
    border: '1.5px dashed #2D2D42'
  },
  owned: {
    bg: '--lime',
    color: '#0A1400',
    border: '2px solid #0A0A14',
    shadow: '3px 3px 0 #000'
  },
  repeated: {
    bg: '--primary',
    color: '#FFFFFF',
    border: '2px solid #0A0A14',
    shadow: '3px 3px 0 #000',
    badge: { bg: '#0A0A14', color: '--lime', text: '×N' }
  },
  special: {
    bg: 'linear-gradient(135deg, #FFE066 0%, #FFC700 45%, #A56600 100%)',
    color: '#1A1100',
    border: '2px solid #2A1A00',
    shadow: '3px 3px 0 #000, inset 0 0 0 1.5px #FFF1A8',
    icon: '★' // top-left corner
  }
}
```

#### Card Component

```jsx
// ✅ BIEN: Card estilo Figus
<div className="
  bg-[var(--surface)]
  border-2 border-[var(--border)]
  rounded-[14px]
  p-4
  shadow-[4px_4px_0_#000]
">

// Variantes:
// - Primary: border-[var(--primary)] con shadow-[4px_4px_0_var(--primary)]
// - Success: border-[var(--lime)]
// - Alert: border-[var(--gold)]
```

#### CTA Button (Call-to-Action)

```jsx
// ✅ BIEN: Botón principal Figus
<button className="
  w-full h-[50px]
  bg-[var(--primary)]
  text-[#0A0A14]
  border-2 border-black
  rounded-xl
  font-bold text-base uppercase tracking-wide
  shadow-[4px_4px_0_#000]
  active:shadow-[1px_1px_0_#000]
  active:translate-x-[3px]
  active:translate-y-[3px]
  transition-all duration-100
  flex items-center justify-center gap-2
">
  <Icon /> PROPONER CAMBIO
</button>

// Variantes de color:
// - Primary: bg-[var(--primary)]
// - Success: bg-[var(--lime)] text-[#0A0A14]
// - Cyan: bg-[var(--cyan)] text-[#0A0A14]
// - Gold: bg-[var(--gold)] text-[#1A1100]
```

#### Pill/Chip (Filtros)

```jsx
// ✅ BIEN: Chip de filtro
<button className={`
  h-9 px-[14px]
  rounded-full
  border-2
  font-mono text-[11px] font-bold uppercase tracking-wider
  whitespace-nowrap
  transition-all duration-150
  ${active
    ? 'bg-[var(--primary)] text-[#0A0A14] border-black shadow-[2px_2px_0_#000]'
    : 'bg-[#13131F] text-[#9A9AB5] border-[#2A2A3D]'
  }
`}>
  TODAS · 200
</button>
```

## Reglas de Desarrollo

### UI/UX Mobile

```jsx
// ✅ BIEN: Diseño mobile-first estilo Figus
<button className="
  w-full                    // Botones a ancho completo en móvil
  min-h-[50px]             // 50px altura (más que 44px estándar)
  px-5 py-3                // Padding generoso
  text-base font-bold      // Texto legible y bold
  active:scale-[0.97]      // Feedback táctil sutil
  active:translate-x-[3px] active:translate-y-[3px]
  shadow-[4px_4px_0_#000]
  active:shadow-[1px_1px_0_#000]
  transition-all duration-100
  border-2 border-black
  rounded-xl
">
  GUARDAR CAMBIOS
</button>

// ❌ MAL: Diseño que no sigue el sistema
<button className="px-2 py-1 text-sm shadow-md">
  Guardar
</button>
```

### Layouts Responsivos

```jsx
// ✅ BIEN: Grid de figuritas (álbum)
// Densidad ajustable: 4, 5 o 6 columnas
<div className="
  grid grid-cols-5           // 5 columnas por defecto (68px cells en 375px)
  gap-2                      // 8px gap para touch targets
  p-4                        // Padding lateral 16px
  justify-start
">
  {stickers.map(s => <StickerCell key={s.n} sticker={s} size={64} />)}
</div>

// Por equipo (agrupación visual)
<div className="mb-6">
  <div className="flex items-center gap-2 mb-2">
    <TeamBadge code="ARG" />
    <h3 className="font-bold">ARGENTINA</h3>
    <div className="flex-1 h-[2px] bg-[var(--border)]" />
    <span className="font-mono text-xs text-[var(--muted)]">8/10</span>
  </div>
  <div className="grid grid-cols-5 gap-2">
    {/* celdas del equipo */}
  </div>
</div>
```

### Bottom Navigation (Componente Crítico)

```jsx
// ✅ BIEN: Bottom Nav estilo Figus
<nav className="
  fixed bottom-0 left-0 right-0
  bg-[#0A0A14]
  border-t-2 border-[#1F1F30]
  pb-7                      // 28px para home indicator iOS
  pt-2.5                    // 10px padding top
  flex justify-around items-stretch
  z-20
">
  {tabs.map(tab => (
    <button key={tab.id} className="
      flex-1 flex flex-col items-center gap-1 py-1.5
    ">
      <div className={`
        w-12 h-8
        flex items-center justify-center
        rounded-lg
        border-2
        transition-all duration-150
        ${isActive
          ? 'bg-[var(--primary)] border-black shadow-[2px_2px_0_#000]'
          : 'bg-transparent border-transparent text-[#7C7C95]'
        }
      `}>
        <Icon width={22} height={22} />
      </div>
      <span className={`
        font-mono text-[9.5px] font-bold tracking-wider
        ${isActive ? 'text-[var(--text)]' : 'text-[#5C5C75]'}
      `}>
        {tab.label}
      </span>
    </button>
  ))}
</nav>

// Tabs:
// - home: INICIO (icono: casa)
// - album: ÁLBUM (icono: grid)
// - matches: CAMBIOS (icono: swap arrows)
// - group: GRUPO (icono: personas) - DESHABILITADO en prototipo
```

### Modales Bottom Sheet

```jsx
// ✅ BIEN: Modal estilo Figus (bottom sheet)
<div className="fixed inset-0 z-[60]">
  {/* Backdrop */}
  <div
    onClick={onClose}
    className="
      absolute inset-0
      bg-[rgba(5,5,12,0.72)]
      backdrop-blur-sm
      transition-opacity duration-200
    "
    style={{ opacity: isVisible ? 1 : 0 }}
  />

  {/* Sheet */}
  <div className="
    absolute left-0 right-0 bottom-0
    bg-[var(--bg)]
    border-t-[3px] border-[var(--primary)]
    rounded-t-3xl
    p-[14px_18px_28px]
    max-h-[88%] overflow-auto
    shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
    transition-transform duration-[260ms] cubic-bezier(0.2,0.8,0.2,1)
  " style={{
    transform: isVisible ? 'translateY(0)' : 'translateY(100%)'
  }}>
    {/* Drag handle */}
    <div className="
      w-11 h-[5px]
      bg-[#2A2A3D] rounded-full
      mx-auto mb-3
    " />

    {/* Content */}
    {children}
  </div>
</div>

// Animación de entrada:
// 1. Montar componente
// 2. setTimeout 10ms → setIsVisible(true)
// 3. CSS transition hace el slide-up
```

### TopBar (Header Component)

```jsx
// ✅ BIEN: TopBar estilo Figus
<div className="
  sticky top-0 z-15
  pt-14                      // 56px status bar safe area
  bg-[var(--bg)]
  border-b-2 border-[#16162A]
">
  <div className="
    flex items-center h-14
    px-4 gap-3
  ">
    {/* Left slot */}
    <div className="flex items-center min-w-[40px]">
      {leftContent}
    </div>

    {/* Center slot */}
    <div className="flex-1 text-center min-w-0">
      {centerContent}
    </div>

    {/* Right slot */}
    <div className="flex items-center gap-2 min-w-[40px] justify-end">
      {rightContent}
    </div>
  </div>
</div>

// Ejemplo con logo (Home):
<TopBar
  left={
    <div className="
      font-['Bungee'] text-2xl
      text-[var(--primary)]
      tracking-wide
      [text-shadow:2px_2px_0_#000]
    ">
      FIGUS
    </div>
  }
  right={
    <>
      <IconButton icon="bell" badge={3} />
      <Avatar letter="M" color="var(--cyan)" />
    </>
  }
/>

// Ejemplo con navegación (Album):
<TopBar
  left={<IconButton icon="back" onClick={goBack} />}
  center={
    <div>
      <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wide">
        MI ÁLBUM
      </div>
      <div className="font-bold text-[15px] mt-0.5">
        COPA CONTINENTAL
      </div>
    </div>
  }
  right={<IconButton icon="filter" />}
/>
```

### Inputs Mobile-Friendly

```jsx
// ✅ BIEN: Input estilo Figus
<input
  type="text"
  className="
    w-full h-12
    bg-[#0F0F1A]
    border-2 border-[var(--border)]
    rounded-xl
    px-4
    text-[15px] text-[var(--text)]
    placeholder:text-[var(--muted)]
    focus:border-[var(--primary)]
    focus:outline-none
    transition-colors
  "
  placeholder="Escribí algo..."
/>

// Input numérico para agregar figuritas:
<input
  type="number"
  inputMode="numeric"
  pattern="[0-9]*"
  className="
    w-full h-14
    bg-[#0F0F1A]
    border-2 border-[var(--border)]
    rounded-xl
    text-center
    font-mono text-2xl font-bold
    text-[var(--text)]
  "
  placeholder="125"
/>
```

### Iconos SVG (24x24px)

```jsx
// El prototipo usa iconos custom stroke-based
// Specs: 24x24px viewBox, stroke-width 2.2-2.6px, currentColor

const Icons = {
  home: <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z"
      stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
  </svg>,

  album: <svg viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="4" width="17" height="16" rx="1.5"
      stroke="currentColor" strokeWidth="2.2"/>
    <path d="M3.5 9h17M9 4v16" stroke="currentColor" strokeWidth="2.2"/>
  </svg>,

  swap: <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 9h14l-3-3M19 15H5l3 3"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,

  // Ver /figus/project/src/icons.jsx para el set completo
}

// Uso:
<div className="w-6 h-6 text-[var(--primary)]">
  {Icons.home}
</div>
```

### Performance Mobile

- **Imágenes:** Usa WebP, lazy loading, tamaños múltiples con `srcset`
- **Listas largas:** Virtualización con `@tanstack/react-virtual` para el álbum (200+ items)
- **Bundle:** Code splitting por rutas
- **Cacheo:** Service Worker para assets estáticos
- **Optimistic UI:** Actualiza UI antes de respuesta del servidor
- **Animaciones:** Usa `transform` y `opacity` (GPU accelerated)

### Accesibilidad Táctil

```jsx
// ✅ BIEN: Área táctil generosa
<button className="
  relative
  min-w-[44px] min-h-[44px]
  p-3
  flex items-center justify-center
">
  <Icon size={20} />
</button>

// ✅ BIEN: Feedback visual en cada tap
<button className="
  active:translate-x-[2px]
  active:translate-y-[2px]
  active:shadow-[1px_1px_0_#000]
  transition-all duration-100
  transition-colors
  cursor-pointer
">
```

## Estructura de Componentes - Basada en Prototipo

```
src/
├── components/
│   ├── layout/
│   │   ├── BottomNav.jsx         # Ver figus/project/src/components.jsx:166
│   │   ├── TopBar.jsx            # Ver figus/project/src/components.jsx:220
│   │   └── StickerModal.jsx      # Ver figus/project/src/components.jsx:357
│   ├── common/
│   │   ├── StickerCell.jsx       # Ver figus/project/src/components.jsx:38
│   │   ├── Card.jsx              # Ver figus/project/src/components.jsx:26
│   │   ├── CTA.jsx               # Ver figus/project/src/components.jsx:264
│   │   ├── Pill.jsx              # Ver figus/project/src/components.jsx:242
│   │   └── MiniSticker.jsx       # Ver figus/project/src/components.jsx:140
│   ├── player/
│   │   └── PlayerFace.jsx        # Ver figus/project/src/components.jsx:292
│   └── icons/
│       └── Icon.jsx              # Ver figus/project/src/icons.jsx
├── screens/
│   ├── HomeScreen.jsx            # Ver figus/project/src/screens.jsx:7
│   ├── AlbumScreen.jsx           # Ver figus/project/src/screens.jsx:318
│   ├── MatchesScreen.jsx         # Ver figus/project/src/screens.jsx:494
│   └── MatchDetailScreen.jsx    # Ver figus/project/src/screens.jsx:701
├── data/
│   └── mockData.js              # Ver figus/project/src/data.js
├── services/
│   ├── authService.js           # Firebase Auth (Google OAuth)
│   ├── stickerService.js        # CRUD de figuritas
│   ├── matchService.js          # Lógica de matchmaking
│   └── groupService.js          # Gestión de grupos
├── hooks/
│   ├── useAuth.js
│   ├── useStickers.js
│   └── useMatches.js
└── constants/
    ├── colors.js
    └── stickerStates.js
```

**Referencias al Prototipo:**
- Todo el código visual está en `/figus/project/`
- Lee esos archivos para entender cómo funcionan las interacciones
- Reimplementa con tecnologías modernas, NO copies el código directamente

## Tailwind Config Mobile-First

```js
// tailwind.config.js - Asegúrate de incluir esto
module.exports = {
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        'touch': '44px',      // iOS HIG minimum
      },
      fontSize: {
        'mobile-xs': ['14px', '20px'],
        'mobile-base': ['16px', '24px'],
        'mobile-lg': ['18px', '28px'],
      }
    }
  }
}
```

## Testing Mobile

Cuando implementes features, testea mentalmente:

1. **¿Puedo tocarlo con el pulgar fácilmente?**
2. **¿Se ve bien en iPhone SE (375px)?**
3. **¿Funciona con una mano?**
4. **¿El texto es legible sin zoom?**
5. **¿Responde al tap en <100ms?**

## Flujo de Trabajo

### Al implementar una nueva feature:

1. **Diseña mobile-first:** Sketches mentales para 375px
2. **Componente base:** Crea el componente más simple que funcione
3. **Responsive:** Adapta a pantallas mayores (si es necesario)
4. **Touch interactions:** Añade feedback táctil
5. **Performance:** Optimiza renders y bundle
6. **Review:** Verifica contra esta guía

### Al recibir feedback del usuario:

- Pregunta: **"¿Esto mejora la experiencia móvil?"**
- Si la respuesta es no, busca alternativas mobile-first

## Red Flags - Detente si ves esto:

- ❌ `onClick` sin feedback visual
- ❌ Elementos < 44x44px táctiles
- ❌ Texto < 16px sin buen contraste
- ❌ Hover states (no existen en móvil)
- ❌ Tooltips en hover (usa long-press o info icons)
- ❌ `cursor: pointer` sin `active:` state
- ❌ Desktop-first media queries (`min-width` antes que diseño base)
- ❌ Modales pequeños flotantes
- ❌ Menús desplegables complejos (usa bottom sheets)

## Prioridades

1. **Funcionalidad mobile** > Estética desktop
2. **Velocidad de carga** > Animaciones fancy
3. **Usabilidad con una mano** > Diseño simétrico
4. **Código simple** > Abstracciones prematuras (recuerda: proyecto educativo)

## Vocabulario Mobile

Usa estos términos correctos:
- ✅ "Tap" (no "click")
- ✅ "Bottom sheet" (no "modal")
- ✅ "Swipe" (no "drag")
- ✅ "Long-press" (no "right-click")
- ✅ "Pull to refresh" (no "reload button")
- ✅ "Thumb zone" (no "hover area")

## PWA Requirements

Asegúrate de incluir:
- `manifest.json` con íconos 192x192, 512x512
- Meta tags: `viewport`, `theme-color`, `apple-mobile-web-app-capable`
- Service Worker para cacheo offline
- Splash screen personalizada

## Cuando Sugerir Código

- Siempre provee ejemplos mobile-first
- Usa Tailwind utility classes
- Incluye comentarios explicando decisiones mobile
- Señala áreas críticas de touch targets
- Sugiere optimizaciones de performance cuando sean relevantes

## Recuerda

> "Si no funciona bien en un iPhone SE con una mano mientras vas en el bus, no está listo"

Este es un proyecto de aprendizaje para un adolescente de 14 años. Explica decisiones técnicas de manera clara, señala trade-offs, y mantén el código simple pero profesional.

---

**Última actualización:** 2026-05-08
