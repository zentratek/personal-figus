# Phase 5: Home Screen con Estadísticas Reales

**Status**: In Progress
**Priority**: High
**Estimated effort**: 3-4 hours

## Overview
Rediseñar la pantalla de inicio (HomeScreen) para mostrar estadísticas reales del álbum del usuario cargadas desde Firestore, con el diseño cyberpunk proporcionado en los mockups.

## User Stories
- Como usuario, quiero ver mi progreso del álbum al entrar a la app
- Como usuario, quiero ver cuántas figuritas me faltan para completar
- Como usuario, quiero acceder rápidamente a funciones clave (abrir sobre, buscar)
- Como usuario, quiero ver mis "matches" de intercambio del día
- Como usuario, quiero ver el progreso de mi grupo de amigos

## Requirements

### 1. Header Section
- **Greeting**: "Hola, {firstName}. Te faltan {missing}."
  - Extraer firstName del user.displayName (primera palabra)
  - Calcular missing desde stats
- **Date**: "VIERNES, 3 DE MAYO" (formato español, uppercase)
  - Usar Date con locale 'es-ES'
  - Formato: día de semana completo, día, mes

### 2. Stats Card Component
**Design**:
- Border: 2px solid pink (var(--primary)) con rounded-2xl
- Background: var(--surface) con gradient sutil
- Padding: p-6

**Content**:
- **Title**: "COPA CONTINENTAL" + "EDICIÓN 2026" (pequeño, muted)
- **Progress Bar**:
  - Lime green (var(--lime)) fill
  - Height: h-2
  - Background: var(--surface-3)
  - Rounded: rounded-full
- **Percentage**: "45%" (text-5xl, bold, lime color) con "89/200" pequeño
- **Stats Grid**: 3 columnas
  - TENGO: 89 (cyan)
  - REPS: 62 (lime)
  - FALTAN: 116 (muted)

**Data Source**:
- Calcular desde stickers array usando calculateStats()
- Total: 960 stickers
- owned + repeated = tengo
- repeated count = reps
- needed count = faltan

### 3. Action Buttons
**Two buttons in grid (2 columns)**:

**Button A - ABRIR SOBRE**:
- Icon: "+" en círculo cyan (bg-[var(--cyan)])
- Label: "ABRIR SOBRE"
- Sublabel: "Canjear 5 figuritas"
- Background: var(--surface-2)
- Border: 2px var(--border)
- Hover: scale-105

**Button B - BUSCAR**:
- Icon: "🔍" en círculo gold (bg-[var(--gold)])
- Label: "BUSCAR"
- Sublabel: "por número"
- Same styling as Button A

**Actions**:
- ABRIR SOBRE: Phase 7 feature (show "Próximamente" alert for now)
- BUSCAR: Navigate to /album with search input focused

### 4. Matches Today Section
**Label**: "// MATCHES DE HOY" (text-xs, muted, font-mono, mb-2)

**Match Card**:
- Background: gradient pink (var(--primary))
- Icon: Target/bullseye icon en círculo negro
- Text: "**5 cambios posibles** con 3 amigos - ahora"
- Arrow: "→" right side
- Rounded: rounded-xl
- Shadow: shadow-[3px_3px_0_#000]
- Full width button with hover effects

**Data**:
- Placeholder for now: "5 cambios posibles con 3 amigos"
- Phase 6 will implement real matching logic

### 5. Group Section (Optional - Future)
**Label**: "// MI GRUPO" (text-xs, muted, font-mono, mb-2)

**Group Card**:
- Title: "LOS PIBES" con shield icon
- Subtitle: "5 jugadores - PB-9940"
- Avatar row: 5 colored circles (cyan, lime, gold, primary, purple)
  - Each shows completion %
  - Letters: M, A, L, R, P
- Background: var(--surface-2)
- Border: 2px var(--border)

**Data**:
- Phase 8+ feature
- Show placeholder or hide for Phase 5

### 6. Streak Section (Optional - Future)
**Racha Card**:
- Background: var(--surface-2)
- Border: 2px dashed gold (var(--gold))
- Icon: Lightning bolt en círculo gold
- Text: "Racha de {days} días"
- Subtext: "Seguí cargando para no perderla"
- Number: Large, bold, gold color

**Data**:
- Track last login date in Firestore (users collection)
- Calculate streak from consecutive days
- Phase 6+ feature

## Technical Implementation

### File Structure
```
src/
├── screens/
│   └── HomeScreen.jsx (rewrite)
├── components/
│   └── home/
│       ├── StatsCard.jsx (new)
│       ├── ActionButtons.jsx (new)
│       └── MatchesCard.jsx (new)
└── services/
    └── statsService.js (new - helper functions)
```

### HomeScreen.jsx
```javascript
import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatsCard } from '../components/home/StatsCard';
import { ActionButtons } from '../components/home/ActionButtons';
import { MatchesCard } from '../components/home/MatchesCard';
import { getUserStickers } from '../services/stickerService';
import { calculateStats } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';

export function HomeScreen() {
  const { user } = useAuth();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user stickers
  useEffect(() => {
    const loadStickers = async () => {
      try {
        const userStickers = await getUserStickers(user.uid);
        setStickers(userStickers);
      } catch (error) {
        console.error('Error loading stickers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStickers();
  }, [user.uid]);

  // Calculate stats
  const stats = useMemo(() => calculateStats(stickers), [stickers]);

  // Get first name from displayName
  const firstName = user.displayName?.split(' ')[0] || 'Usuario';

  // Format current date
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).toUpperCase();

  if (loading) {
    return <AppLayout><LoadingSpinner /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="p-4 pb-24 space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs text-[var(--muted)] mb-1">{currentDate}</p>
          <h1 className="text-2xl font-bold">
            Hola, <span className="text-[var(--primary)]">{firstName}</span>.
          </h1>
          <p className="text-xl">
            Te faltan <span className="text-[var(--lime)] font-bold">{stats.needed}</span>.
          </p>
        </div>

        {/* Stats Card */}
        <StatsCard stats={stats} total={stickers.length} />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Matches Today */}
        <div>
          <p className="text-xs text-[var(--muted)] font-mono mb-2">// MATCHES DE HOY</p>
          <MatchesCard />
        </div>
      </div>
    </AppLayout>
  );
}
```

### StatsCard.jsx
- Props: `{ stats, total }`
- Calculate progress percentage
- Render progress bar with lime fill
- Show TENGO/REPS/FALTAN grid

### ActionButtons.jsx
- Two button grid
- ABRIR SOBRE: alert("Próximamente: Abrir sobres!")
- BUSCAR: useNavigate() to /album with query param

### MatchesCard.jsx
- Pink gradient button
- Placeholder: "5 cambios posibles con 3 amigos - ahora"
- onClick: alert("Próximamente: Sistema de intercambios!")

## Design Tokens (Already in index.css)
```css
--primary: #FF2D8E (pink)
--cyan: #00F0FF
--lime: #C6FF3E
--gold: #FFC700
--surface: #14141F
--surface-2: #1C1C2A
--surface-3: #262638
--border: #2A2A3D
--muted: #6E6E85
```

## Acceptance Criteria
- [ ] Header shows user's first name and missing count
- [ ] Date is formatted in Spanish and uppercase
- [ ] Stats card shows real data from Firestore
- [ ] Progress bar visual matches mockup (lime/pink/dark theme)
- [ ] TENGO/REPS/FALTAN stats are accurate
- [ ] Action buttons navigate correctly
- [ ] "BUSCAR" button navigates to /album
- [ ] "ABRIR SOBRE" shows placeholder alert
- [ ] Matches card shows placeholder with proper styling
- [ ] Loading state while fetching stickers
- [ ] Mobile-responsive (matches mockup on mobile)
- [ ] Proper spacing and padding (pb-24 for bottom nav)

## Future Enhancements (Phase 6+)
- [ ] Real matches calculation (compare user's repeated with friends' needed)
- [ ] Group section with real group data
- [ ] Streak tracking with Firestore
- [ ] Abrir Sobre functionality (Phase 7)
- [ ] Push notifications for matches

## Testing Notes
- Test with empty album (0 stickers)
- Test with partial completion (e.g., 45%)
- Test with 100% completion
- Verify stats calculation accuracy
- Test on mobile device (UI must match mockup)

## Dependencies
- Existing: calculateStats() from mockData.js
- Existing: getUserStickers() from stickerService.js
- React Router (useNavigate)

## Estimated Time Breakdown
1. Create StatsCard component: 45 min
2. Create ActionButtons component: 30 min
3. Create MatchesCard component: 20 min
4. Rewrite HomeScreen: 45 min
5. Styling and responsiveness: 45 min
6. Testing and refinement: 30 min

**Total**: ~3.5 hours
