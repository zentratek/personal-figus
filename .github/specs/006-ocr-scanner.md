# 006 - OCR Scanner

---
**Title:** OCR Scanner for Sticker Pack Opening
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Authors:** Juan, hijo
**Reviewers:** Juan

---

## Summary

Sistema de escaneo OCR usando la cámara del móvil para detectar números de figuritas automáticamente al abrir sobres. **Modo Batch** permite escanear múltiples sobres consecutivamente en una sola sesión. Acelera el input 10x comparado con teclado manual.

## Problem Statement

**Pain Point Actual:**
- Abrir múltiples sobres = 10-25 figuritas para registrar de una vez
- Ingresar manualmente cada número es tedioso y lento
- Usuarios se frustran y abandonan el registro después de 1-2 sobres
- **Escenario común:** Abrir 3-5 sobres con amigos, pero solo registran 1 por pereza

**Impacto:**
- Menos engagement (usuarios no actualizan su álbum completo)
- Datos desactualizados = matchmaking menos efectivo
- Pérdida de momentum al abrir sobres con amigos
- Experiencia social interrumpida por input manual

## Proposed Solution

Implementar un **"Modo Abrir Sobres"** con **escaneo batch** que:

1. Activa la cámara del móvil en modo persistente
2. Usuario escanea primer sobre (5 figuritas)
3. OCR detecta números y los acumula
4. Usuario toca "Escanear Otro Sobre" sin salir de la cámara
5. Repite escaneo para 2do, 3er, 4to sobre (hasta completar sesión)
6. Preview muestra TODAS las figuritas acumuladas
7. Usuario confirma o corrige manualmente
8. Guarda todas de una vez en Firestore

**Key Feature:** Modo batch = escanear 3-5 sobres consecutivos sin fricción, guardando todo al final.

### UX Flow (Modo Batch)

```
[HomeScreen]
  ↓ Tap "Abrir Sobres"
[CameraScreen - Batch Mode]
  ├─ Vista de cámara activa PERSISTENTE
  ├─ Overlay con guías visuales
  ├─ Badge "Sobre 1/?"
  ├─ Botón "Capturar Sobre"
  ↓ Tap "Capturar Sobre"
[Processing...]
  ├─ OCR analiza imagen
  ├─ Detecta 4 números: [45, 67, 123, 234]
  ├─ Acumula en array: accumulated = [45, 67, 123, 234]
  ↓ OCR termina (2-3s)
[CameraScreen - Vuelve Automáticamente]
  ├─ Badge actualizado "Sobre 2/?"
  ├─ Botón "Capturar Otro Sobre" (mismo estilo)
  ├─ Botón "Terminar y Revisar" (secundario)
  ├─ Mini-preview: "4 figus escaneadas"
  ↓ Usuario toca "Capturar Otro Sobre" × 2 veces más
[CameraScreen - Después de 3 sobres]
  ├─ Badge "Sobre 3/3"
  ├─ Mini-preview: "13 figus escaneadas"
  ↓ Tap "Terminar y Revisar"
[PreviewScreen - Batch]
  ├─ Título: "Figuritas detectadas (13 de 3 sobres)"
  ├─ Grid muestra TODOS los números acumulados
  ├─ Agrupados por sobre (opcional)
  ├─ Permite editar/eliminar cada número
  ├─ Botón "Agregar Manual" (si faltan)
  ↓ Tap "Guardar Todo"
[Success]
  ├─ Guarda todas en Firestore (1 batch write)
  ├─ Actualiza stats
  ├─ Toast: "✅ 13 figuritas guardadas"
  ↓ Redirect a AlbumScreen
```

**Ventaja del flujo:** Usuario puede escanear 1-10 sobres sin salir de la cámara, maximizando eficiencia.

## Technology Options

### Option A: Tesseract.js (Recomendado para MVP)

**Pros:**
- ✅ JavaScript puro (sin backend)
- ✅ Funciona offline (WASM)
- ✅ Gratis y open-source
- ✅ Especialmente bueno para números
- ✅ ~2MB bundle (aceptable)

**Cons:**
- ⚠️ Puede ser lento en dispositivos low-end (~2-3s)
- ⚠️ Requiere buena iluminación

**Implementación:**
```bash
npm install tesseract.js
```

```javascript
import Tesseract from 'tesseract.js';

async function scanStickers(imageFile) {
  const { data: { text } } = await Tesseract.recognize(
    imageFile,
    'eng',
    {
      tessedit_char_whitelist: '0123456789',  // Solo números
      logger: m => console.log(m)             // Progress
    }
  );

  // Extraer números de 1-3 dígitos
  const numbers = text.match(/\b\d{1,3}\b/g) || [];
  return numbers.map(n => parseInt(n)).filter(n => n >= 1 && n <= 638);
}
```

### Option B: TensorFlow.js + Custom Model

**Pros:**
- ✅ Mejor accuracy (con entrenamiento)
- ✅ Más rápido que Tesseract
- ✅ Puede detectar múltiples números en una imagen

**Cons:**
- ❌ Requiere entrenar modelo (20+ horas trabajo)
- ❌ Necesita dataset de figuritas Panini
- ❌ Bundle más pesado (~5-8MB)
- ❌ Más complejo de implementar

**Decision:** Tesseract.js para MVP, TensorFlow.js en v2.0 si hay necesidad.

### Option C: Google ML Kit (Nativo)

**Pros:**
- ✅ Muy preciso
- ✅ Rápido (usa hardware del dispositivo)

**Cons:**
- ❌ Requiere app nativa (no PWA)
- ❌ Fuera del scope de tecnologías elegidas

**Decision:** NO para este proyecto (somos PWA).

---

## Detailed Design

### Component: `OcrScannerScreen.jsx` (Batch Mode)

```javascript
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

export function OcrScannerScreen({ onScanComplete, onCancel }) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allDetectedNumbers, setAllDetectedNumbers] = useState([]); // Acumulador batch
  const [packsScanned, setPacksScanned] = useState(0); // Contador de sobres
  const [lastScanCount, setLastScanCount] = useState(0); // Última captura
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 1. Activar cámara
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }  // Cámara trasera
    });
    videoRef.current.srcObject = stream;
  };

  // 2. Capturar frame
  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/png');
  };

  // 3. Escanear con OCR (modo batch - acumula)
  const scanImage = async () => {
    setScanning(true);
    const imageData = capture();

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageData,
        'eng',
        {
          tessedit_char_whitelist: '0123456789',
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      // Extraer números válidos de ESTE sobre
      const numbers = extractStickerNumbers(text);

      // BATCH MODE: Acumular con los anteriores (sin duplicados)
      const combined = [...allDetectedNumbers, ...numbers];
      const unique = [...new Set(combined)];

      setAllDetectedNumbers(unique);
      setPacksScanned(prev => prev + 1);
      setLastScanCount(numbers.length);
    } catch (error) {
      console.error('OCR error:', error);
      alert('Error al escanear. Intenta de nuevo con mejor luz.');
    } finally {
      setScanning(false);
      setProgress(0); // Reset para próximo sobre
    }
  };

  // 4. Terminar sesión batch
  const finishBatchSession = () => {
    // Mostrar preview con TODOS los números acumulados
    // (el component de preview se mostrará automáticamente)
  };

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera view */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay guías + Badge de sobres */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-4 border-dashed border-[var(--primary)] opacity-50 m-8 rounded-xl" />

        {/* Instrucciones */}
        <div className="absolute top-24 left-0 right-0 text-center">
          <p className="text-white text-lg font-bold shadow-lg">
            {packsScanned === 0
              ? "Apuntá a las 5 figuritas del primer sobre"
              : "Apuntá al siguiente sobre"}
          </p>
        </div>

        {/* Badge: Sobres escaneados */}
        {packsScanned > 0 && (
          <div className="absolute top-8 right-8">
            <div className="bg-[var(--lime)] text-black px-4 py-2 rounded-lg font-bold shadow-[4px_4px_0_#000]">
              {packsScanned} {packsScanned === 1 ? 'sobre' : 'sobres'}
            </div>
          </div>
        )}

        {/* Mini-preview: Total acumulado */}
        {allDetectedNumbers.length > 0 && (
          <div className="absolute top-24 left-8 bg-black/80 px-4 py-2 rounded-lg">
            <p className="text-[var(--lime)] font-mono font-bold">
              {allDetectedNumbers.length} figus totales
            </p>
            {lastScanCount > 0 && (
              <p className="text-[var(--muted)] text-sm">
                +{lastScanCount} en último escaneo
              </p>
            )}
          </div>
        )}
      </div>

      {/* Canvas oculto para capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Botones batch mode */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        {/* Botón principal: Capturar */}
        <button
          onClick={scanImage}
          disabled={scanning}
          className="w-full h-14 bg-[var(--primary)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] mb-3"
        >
          {scanning
            ? `Escaneando ${progress}%...`
            : packsScanned === 0
              ? 'Capturar Primer Sobre'
              : 'Capturar Otro Sobre'}
        </button>

        {/* Botones secundarios */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl text-[var(--text)]"
          >
            Cancelar
          </button>

          {allDetectedNumbers.length > 0 && (
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 px-6 py-3 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]"
            >
              Terminar y Revisar
            </button>
          )}
        </div>
      </div>

      {/* Preview de números detectados (batch) */}
      {showPreview && (
        <OcrPreview
          numbers={allDetectedNumbers}
          packsScanned={packsScanned}
          onConfirm={() => onScanComplete(allDetectedNumbers)}
          onEdit={setAllDetectedNumbers}
          onBack={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function extractStickerNumbers(text) {
  // Extraer todos los números de 1-3 dígitos
  const matches = text.match(/\b\d{1,3}\b/g) || [];

  // Filtrar solo números válidos (1-638)
  const valid = matches
    .map(n => parseInt(n))
    .filter(n => n >= 1 && n <= 638);

  // Remover duplicados
  return [...new Set(valid)];
}
```

### Component: `OcrPreview.jsx` (Batch Mode)

```javascript
export function OcrPreview({ numbers, packsScanned, onConfirm, onEdit, onBack }) {
  const [editableNumbers, setEditableNumbers] = useState(numbers);

  const addManual = () => {
    // Abrir input para agregar número manual
    const num = prompt('Número de figurita:');
    if (num && num >= 1 && num <= 638) {
      setEditableNumbers([...editableNumbers, parseInt(num)]);
    }
  };

  const remove = (index) => {
    const updated = editableNumbers.filter((_, i) => i !== index);
    setEditableNumbers(updated);
    onEdit(updated); // Sync con parent
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-60 flex items-end">
      <div className="bg-[var(--bg)] w-full rounded-t-3xl p-6 max-h-[85%] overflow-auto">
        {/* Header con stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Figuritas detectadas
          </h2>
          <div className="flex gap-4 text-sm">
            <span className="text-[var(--lime)] font-bold">
              {editableNumbers.length} figuritas
            </span>
            <span className="text-[var(--muted)]">
              de {packsScanned} {packsScanned === 1 ? 'sobre' : 'sobres'}
            </span>
          </div>
        </div>

        {/* Grid de números */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {editableNumbers.map((num, i) => (
            <div key={i} className="relative">
              <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl p-4 text-center">
                <span className="font-mono text-2xl font-bold text-[var(--text)]">{num}</span>
              </div>
              <button
                onClick={() => remove(i)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full text-white text-xs font-bold shadow-[2px_2px_0_#000]"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Botón agregar más */}
          <button
            onClick={addManual}
            className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center text-[var(--muted)] hover:border-[var(--primary)] transition-colors"
          >
            <div className="text-3xl mb-1">+</div>
            <div className="text-xs">Agregar</div>
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 h-12 bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl text-[var(--text)] font-bold"
          >
            Volver a Cámara
          </button>

          <button
            onClick={() => onConfirm(editableNumbers)}
            className="flex-[2] h-12 bg-[var(--lime)] text-black font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000]"
          >
            Guardar Todo ({editableNumbers.length})
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Implementation Plan

### Phase 1: Basic Camera Access (2 días)

- [ ] Implementar `OcrScannerScreen` con cámara activa persistente
- [ ] Botón "Capturar Sobre" que toma foto
- [ ] Mostrar foto capturada (sin OCR aún)
- [ ] Navegación desde HomeScreen con botón "Abrir Sobres"

### Phase 2: OCR Integration + Batch Mode (3 días)

- [ ] Instalar Tesseract.js
- [ ] Implementar `scanImage()` con OCR
- [ ] Progress indicator durante escaneo
- [ ] **Batch mode:** Acumulador de números entre escaneos
- [ ] Contador de sobres escaneados
- [ ] Mini-preview en cámara mostrando total acumulado
- [ ] Extraer y validar números (1-638)

### Phase 3: Preview & Edit Batch (2 días)

- [ ] Implementar `OcrPreview` component con stats de batch
- [ ] Mostrar total de figuritas + sobres escaneados
- [ ] Permitir eliminar números incorrectos
- [ ] Permitir agregar números manualmente
- [ ] Botón "Volver a Cámara" para seguir escaneando
- [ ] Botón "Guardar Todo" que persiste en Firestore (batch write)

### Phase 4: UX Polish (2 días)

- [ ] Overlay con guías visuales animadas
- [ ] Badge de sobres escaneados (top-right)
- [ ] Mejor manejo de errores (poca luz, cámara bloqueada, etc.)
- [ ] Loading states con progress bar
- [ ] Toast de éxito: "✅ N figuritas guardadas de M sobres"
- [ ] Tutorial la primera vez (GIF animado)

**Total:** 7-9 días (vs 4-6 días sin batch)

## Success Metrics

- ✅ **Accuracy > 70%** en condiciones normales de luz (por sobre individual)
- ✅ **< 3s** tiempo de escaneo promedio por sobre
- ✅ **3+ sobres** escaneados en promedio por sesión batch
- ✅ **80%+ usuarios** prefieren OCR batch vs manual (encuesta in-app)
- ✅ **< 10s** tiempo total para escanear y guardar 3 sobres (15 figuritas)
- ✅ **0** crashes relacionados con cámara o memoria
- ✅ **95%+ sesiones** completan al menos 1 sobre exitosamente

## Performance Considerations

### Bundle Size
- Tesseract.js: ~2MB (core + traineddata)
- Lazy load: solo cargar cuando usuario toca "Abrir Sobres"

```javascript
// Lazy load OCR
const OcrScanner = lazy(() => import('./components/OcrScanner'));
```

### Memory Management (Batch Mode)
- **Preocupación:** Acumular 5-10 sobres = 25-50 números en memoria
- **Solución:** Array simple de integers (< 1KB), no es problema
- **Cámara:** Stream se mantiene activo durante toda la sesión
  - Verificar cleanup al cancelar/guardar: `stream.getTracks().forEach(track => track.stop())`

### Battery Considerations
- Cámara activa consume batería
- **Recomendación:** Mostrar warning si sesión > 5min
- **Auto-stop:** Pausar cámara después de 10min de inactividad

### Browser Compatibility
- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ✅ Firefox Android 90+
- ⚠️ Requiere HTTPS (PWA lo garantiza)
- ⚠️ Permisos de cámara deben persistir entre escaneos

## Alternatives Considered

### Manual Input con Autocomplete
**Pro:** Más simple, sin OCR
**Con:** Sigue siendo tedioso
**Decision:** OCR es mejor UX

### Barcode Scanner
**Pro:** Más preciso
**Con:** Figuritas no tienen barcode
**Decision:** No aplicable

## Open Questions

- ✅ ¿Funciona bien con iluminación de interiores?
  - **Testing:** Probar en diferentes condiciones de luz

- ✅ ¿Qué pasa si detecta 0 números en un sobre?
  - **Fallback:** Mostrar mensaje "No se detectaron números. Intenta mejorar la luz o ingresá manualmente"
  - **Batch mode:** Permitir seguir escaneando otros sobres

- ✅ ¿Agregar tutorial la primera vez?
  - **Decision:** Sí, modal con GIF animado mostrando cómo usar batch mode

- ❓ ¿Mostrar preview después de CADA sobre o solo al final?
  - **Decision:** Solo al final (botón "Terminar y Revisar")
  - **Razón:** Minimizar fricción, mantener momentum de escaneo
  - **Alternativa:** Mini-preview acumulativo en cámara es suficiente

- ❓ ¿Agrupar figuritas por sobre en el preview?
  - **Pro:** Usuario sabe qué vino de cada sobre
  - **Con:** Más complejo visualmente
  - **Testing:** Probar ambas versiones en beta

- ❓ ¿Límite máximo de sobres por sesión?
  - **Recomendación:** 10 sobres (50 figuritas) max
  - **Razón:** Evitar sesiones > 5min (batería, cansancio)
  - **UI:** Mostrar warning al llegar a 8 sobres

- ❓ ¿Permitir editar números mientras escaneas (antes del preview final)?
  - **Decision:** NO, mantener flujo simple
  - **Razón:** Preview final es momento de corrección

## References

- [Tesseract.js Docs](https://tesseract.projectnaptha.com/)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**Implementation:** Phase 8.5 (después de trades, antes de polish)
**Duration:** 7-9 días (con batch mode)
**Priority:** Alta (core MVP feature)
**Next:** [Phase 9: Polish](./109-phase-9-polish.md)

---

## Changelog

- **2026-05-08**: Spec creada con OCR básico (4-6 días)
- **2026-05-08**: Actualizada con **Batch Mode** para escanear múltiples sobres consecutivos (7-9 días)
