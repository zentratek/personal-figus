# Guía Anti-Spaghetti Code 🍝❌

## Para Desarrolladores Padre-Hijo

Esta guía está diseñada para que tú y tu hijo de 14 años puedan mantener el código limpio, organizado y fácil de entender mientras aprenden juntos.

---

## 🎯 Regla de Oro

> **"Si no puedes explicárselo a tu compañero de equipo en 30 segundos, el código es demasiado complicado"**

---

## 📁 Estructura de Carpetas: Todo en su Lugar

```
src/
├── components/         # Piezas de UI reutilizables
│   ├── common/        # Botones, inputs, cards (se usan en toda la app)
│   └── features/      # Componentes específicos de cada módulo
├── pages/             # Una carpeta = Una pantalla de la app
├── hooks/             # Lógica reutilizable (custom hooks)
├── services/          # Comunicación con Firebase/API
├── utils/             # Funciones auxiliares (formatear fechas, etc.)
├── contexts/          # Estado global de la app
└── constants/         # Valores que no cambian (colores, textos, etc.)
```

### ✅ Ejemplo BUENO:
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   └── Card.jsx
│   └── features/
│       ├── AlbumGrid.jsx
│       └── StickerCard.jsx
├── pages/
│   ├── HomePage.jsx
│   └── AlbumPage.jsx
```

### ❌ Ejemplo MALO:
```
src/
├── Album.jsx
├── AlbumHelper.jsx
├── AlbumUtils.jsx
├── Button1.jsx
├── Button2.jsx
├── misc.js
└── stuff.jsx
```

---

## 🧩 Componentes: Una Sola Responsabilidad

### Regla: Un Componente = Una Cosa

**❌ MAL - Componente que hace TODO:**
```jsx
function AlbumPage() {
  // 300 líneas de código
  // Maneja autenticación
  // Renderiza el grid
  // Hace llamadas a Firebase
  // Maneja el estado de intercambios
  // Muestra notificaciones
  // ...
}
```

**✅ BIEN - Componentes especializados:**
```jsx
function AlbumPage() {
  return (
    <div>
      <AlbumHeader />
      <AlbumFilters />
      <AlbumGrid />
      <QuickActions />
    </div>
  );
}

function AlbumGrid() {
  const { stickers } = useAlbum();
  return (
    <div className="grid">
      {stickers.map(s => <StickerCard key={s.id} sticker={s} />)}
    </div>
  );
}
```

### 📏 Límites Recomendados:
- **Componente:** Máximo 100-150 líneas
- **Función:** Máximo 20-30 líneas
- **Si es más largo:** Probablemente puedes dividirlo

---

## 🎣 Custom Hooks: Separa la Lógica de la UI

### ❌ MAL - Todo mezclado:
```jsx
function AlbumPage() {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStickers = async () => {
      setLoading(true);
      const db = getFirestore();
      const q = query(collection(db, 'stickers'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStickers(data);
      setLoading(false);
    };
    fetchStickers();
  }, []);

  return <div>{loading ? 'Cargando...' : stickers.map(...)}</div>;
}
```

### ✅ BIEN - Lógica separada en hook:
```jsx
// hooks/useStickers.js
function useStickers(userId) {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStickers = async () => {
      setLoading(true);
      const data = await stickerService.getByUser(userId);
      setStickers(data);
      setLoading(false);
    };
    fetchStickers();
  }, [userId]);

  return { stickers, loading };
}

// pages/AlbumPage.jsx
function AlbumPage() {
  const { stickers, loading } = useStickers(currentUser.id);

  if (loading) return <LoadingSpinner />;
  return <AlbumGrid stickers={stickers} />;
}
```

**Ventajas:**
- Puedes reutilizar `useStickers` en otros componentes
- Es fácil de testear
- La página se enfoca solo en UI

---

## 🔧 Services: Centraliza las Llamadas a Firebase

### ❌ MAL - Firebase por todos lados:
```jsx
// En AlbumPage.jsx
const db = getFirestore();
const snapshot = await getDocs(collection(db, 'stickers'));

// En TradePage.jsx
const db = getFirestore();
const snapshot = await getDocs(collection(db, 'stickers'));

// En ProfilePage.jsx
const db = getFirestore();
const snapshot = await getDocs(collection(db, 'stickers'));
```

### ✅ BIEN - Un servicio centralizado:
```js
// services/stickerService.js
import { getFirestore, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore();
const stickersCollection = collection(db, 'stickers');

export const stickerService = {
  async getByUser(userId) {
    const q = query(stickersCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markAsOwned(stickerId) {
    const docRef = doc(db, 'stickers', stickerId);
    await updateDoc(docRef, { status: 'owned' });
  },

  async addSticker(stickerData) {
    return await addDoc(stickersCollection, stickerData);
  }
};
```

**Ahora en cualquier componente:**
```jsx
import { stickerService } from '@/services/stickerService';

const stickers = await stickerService.getByUser(userId);
```

---

## 🎨 Constantes: No Repitas Valores Mágicos

### ❌ MAL:
```jsx
if (sticker.status === 'owned') { ... }
if (sticker.status === 'needed') { ... }
if (sticker.status === 'repeated') { ... }

// En otro archivo:
if (sticker.status === 'own') { ... }  // ¡ERROR! Escribiste mal
```

### ✅ BIEN:
```js
// constants/stickerStatus.js
export const STICKER_STATUS = {
  OWNED: 'owned',
  NEEDED: 'needed',
  REPEATED: 'repeated'
};

export const STATUS_COLORS = {
  [STICKER_STATUS.OWNED]: '#22c55e',      // verde
  [STICKER_STATUS.NEEDED]: '#94a3b8',     // gris
  [STICKER_STATUS.REPEATED]: '#fbbf24'    // amarillo
};
```

```jsx
import { STICKER_STATUS, STATUS_COLORS } from '@/constants/stickerStatus';

if (sticker.status === STICKER_STATUS.OWNED) {
  // El IDE te ayuda con autocompletado
  // Si te equivocas, el linter te avisa
}
```

---

## 🚨 Manejo de Errores: Siempre Espera lo Peor

### ❌ MAL:
```jsx
const data = await fetch('/api/stickers');
const stickers = data.json();  // ¿Y si falla?
setStickers(stickers);
```

### ✅ BIEN:
```jsx
try {
  const response = await fetch('/api/stickers');

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const stickers = await response.json();
  setStickers(stickers);
} catch (error) {
  console.error('Error cargando figuritas:', error);
  showNotification('No pudimos cargar tus figuritas. Intenta de nuevo.', 'error');
}
```

---

## 📝 Nombres: Claros y Descriptivos

### ❌ MAL:
```js
const d = new Date();
const arr = [];
const fn = () => { ... };
const temp = getStickers();
```

### ✅ BIEN:
```js
const currentDate = new Date();
const userStickers = [];
const calculateMatchPercentage = () => { ... };
const availableStickers = getStickers();
```

### Reglas de Naming:
- **Variables/Funciones:** `camelCase` → `getUserStickers`, `isLoading`
- **Componentes:** `PascalCase` → `AlbumGrid`, `StickerCard`
- **Constantes:** `UPPER_SNAKE_CASE` → `MAX_STICKERS`, `API_URL`
- **Archivos:** Igual que el componente → `AlbumGrid.jsx`

---

## 🔄 Props y Estado: Mantén el Flujo Claro

### Principio: "Data Down, Events Up"

```jsx
// ✅ BIEN: El padre maneja el estado, el hijo avisa cuando algo cambia
function AlbumPage() {
  const [selectedSticker, setSelectedSticker] = useState(null);

  return (
    <AlbumGrid
      stickers={stickers}
      onStickerClick={setSelectedSticker}  // Evento sube ↑
    />
  );
}

function AlbumGrid({ stickers, onStickerClick }) {
  return (
    <div>
      {stickers.map(s => (
        <StickerCard
          key={s.id}
          sticker={s}              // Data baja ↓
          onClick={onStickerClick}  // Evento sube ↑
        />
      ))}
    </div>
  );
}
```

---

## 🧪 Comentarios: Explica el "Por Qué", No el "Qué"

### ❌ MAL:
```js
// Suma 1 a counter
setCounter(counter + 1);
```

### ✅ BIEN:
```js
// Incrementamos el contador porque Firebase cobra por lectura,
// y queremos limitar a máximo 3 intentos de reconexión
setRetryCount(retryCount + 1);
```

### 📌 Cuándo comentar:
- ✅ Lógica de negocio compleja
- ✅ Workarounds o hacks temporales
- ✅ TODOs con contexto: `// TODO: Agregar validación cuando tengamos el diseño final`
- ❌ Código obvio

---

## 🎯 Checklist Antes de Cada Commit

```
[ ] ¿Los nombres de variables/funciones son claros?
[ ] ¿Hay funciones de más de 30 líneas que pueda dividir?
[ ] ¿Repetí el mismo código en varios lugares? (DRY: Don't Repeat Yourself)
[ ] ¿Dejé console.logs de debugging?
[ ] ¿Agregué manejo de errores en las llamadas async?
[ ] ¿El componente tiene una sola responsabilidad?
[ ] ¿Puedo explicarle este código a mi compañero fácilmente?
```

---

## 🚦 Sistema de Semáforo para Code Review

Cuando revisen el código juntos, usen este sistema:

- 🟢 **Verde:** Código limpio, sigue las reglas
- 🟡 **Amarillo:** Funciona pero puede mejorarse
- 🔴 **Rojo:** Necesita refactorización antes de continuar

---

## 💡 Consejo Final

> **"El código se escribe una vez, pero se lee 100 veces"**

Escriban código pensando en ustedes mismos dentro de 3 meses. Si vuelven al código y no entienden qué hace en 10 segundos, necesita mejorarse.

---

## 📚 Recursos para Aprender Más

- [Clean Code en JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**Recuerden:** El código perfecto no existe. Lo importante es mejorar un poco cada día. ¡Diviértanse programando! 🚀
