# 🎯 GUARDAR IMÁGENES QR - VERSIÓN FINAL

## ✅ Estrategia de Precios:

**Precios Públicos (mostrados en la app):**
- Premium: **$10,000 COP**
- VIP: **$20,000 COP**

**Código Secreto (privado, solo WhatsApp entre amigos):**
- 🔒 50% descuento
- Solo se comparte boca a boca
- NO aparece en la app

---

## 📥 Imágenes QR Recibidas:

Del chat anterior recibiste 3 imágenes:
1. ✅ QR de **$5,000** - NO USAR (es con descuento)
2. ✅ QR de **$10,000** - USAR para Premium
3. ✅ QR de **$20,000** - USAR para VIP

---

## 🎬 ACCIÓN REQUERIDA:

### Paso 1: Descargar del Chat

Descarga estas 2 imágenes de los mensajes anteriores:
- **QR de $10,000** (mensaje "qr de 10000")
- **QR de $20,000** (mensaje "este es el QR de 20000 COP")

### Paso 2: Guardar en /public/

```bash
cd /home/juan/projects/personal/panini/app/public/

# Guarda manualmente las imágenes como:
# - QR $10,000 → qr-premium.png
# - QR $20,000 → qr-vip.png
```

### Paso 3: Verificar

```bash
ls -lh /home/juan/projects/personal/panini/app/public/qr-*.png

# Debes ver:
# qr-premium.png  (QR de $10,000)
# qr-vip.png      (QR de $20,000)
```

### Paso 4: Descomentar Código

Edita: `src/components/subscription/UpgradeModal.jsx`

**Comentar placeholder (líneas ~275-284):**
```jsx
{/* Comentar esto:
<div className="aspect-square bg-gray-200...">
  ...
</div>
*/}
```

**Descomentar imagen (líneas ~285-291):**
```jsx
<img
  src={selectedTier === 'premium' ? '/qr-premium.png' : '/qr-vip.png'}
  alt="QR Bancolombia"
  className="w-full rounded-lg"
/>
```

### Paso 5: Commit

```bash
git add public/qr-premium.png public/qr-vip.png
git add src/components/subscription/UpgradeModal.jsx
git commit -m "feat: add Bancolombia QR codes for subscriptions

- Premium: $10,000 COP → qr-premium.png
- VIP: $20,000 COP → qr-vip.png

Account: @bustamante161
Promo code system ready (private distribution)"
```

---

## 📊 Mapping Final:

| Tier | Precio Público | QR Mostrado | Archivo |
|------|----------------|-------------|---------|
| Premium | $10,000 | QR $10,000 | qr-premium.png |
| VIP | $20,000 | QR $20,000 | qr-vip.png |

**Código Promocional:**
- 🔒 Privado, solo WhatsApp
- Sigue funcionando en el backend
- Input visible en la app, pero sin hints
- 50% descuento cuando se aplica

---

## 🧪 Testing:

```bash
npm run dev
```

1. Abre https://localhost:5173
2. Loguéate con usuario test
3. Escanea 5 sobres → Alcanza límite OCR
4. Modal aparece:
   - Ve Premium: $10,000
   - Ve VIP: $20,000
5. **SIN código:** Selecciona Premium → Ve QR $10,000 ✅
6. **CON código secreto:**
   - Ingresa código (que solo conoces tú)
   - Precio baja a $5,000 Premium / $10,000 VIP
   - Pero QR sigue mostrando el monto original
   - Email automático incluirá el código usado

---

## 🎯 Ventajas de Esta Estrategia:

✅ Precios públicos altos → Mejor percepción de valor
✅ Código secreto → Marketing viral boca a boca
✅ Tu hijo comparte con amigos → Exclusividad
✅ Descuento significativo (50%) → Alta conversión
✅ QR codes simples → Menos confusión

**Listo para monetizar!** 🚀💰

---

**Cuenta:** @bustamante161 (Bancolombia Bre-B)
**Email:** latinkid2211@gmail.com
