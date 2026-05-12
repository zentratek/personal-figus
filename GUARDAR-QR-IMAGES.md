# 🎯 GUARDAR IMÁGENES QR - PASO A PASO

## Imágenes que Recibiste:

✅ **QR de $5,000** - Para Premium con código CSF2026
✅ **QR de $10,000** - Para VIP con código CSF2026
✅ **QR de $20,000** - Para VIP sin código (backup)

## Estrategia Final:

Vamos a usar **SIEMPRE** los precios con código CSF2026 aplicado, ya que:
1. El código está en todas las comunicaciones
2. Incentiva a los usuarios a usarlo
3. Precios más atractivos

## ACCIÓN REQUERIDA:

### Paso 1: Descargar las 3 imágenes QR del chat

Desde este chat, descarga estas 3 imágenes:
- La imagen del QR de $5,000 COP
- La imagen del QR de $10,000 COP
- La imagen del QR de $20,000 COP (opcional, backup)

### Paso 2: Guardar en `/public/`

```bash
cd /home/juan/projects/personal/panini/app/public/

# Guarda manualmente:
# - Imagen QR $5,000 → qr-premium.png
# - Imagen QR $10,000 → qr-vip.png
```

### Paso 3: Verificar

```bash
ls -lh /home/juan/projects/personal/panini/app/public/qr-*.png

# Deberías ver:
# -rw-rw-r-- 1 juan juan XXK ... qr-premium.png
# -rw-rw-r-- 1 juan juan XXK ... qr-vip.png
```

### Paso 4: Descomentar código

El archivo `src/components/subscription/UpgradeModal.jsx` ya tiene el código preparado en las líneas 285-291. Solo necesitas:

1. **Comentar** el placeholder (líneas 275-284):
```jsx
{/* COMENTAR ESTO:
<div className="aspect-square bg-gray-200...">
  ...placeholder...
</div>
*/}
```

2. **Descomentar** el tag `<img>` (líneas 285-291):
```jsx
<img
  src={selectedTier === 'premium' ? '/qr-premium.png' : '/qr-vip.png'}
  alt="QR Bancolombia"
  className="w-full rounded-lg"
/>
```

### Paso 5: Commit

```bash
cd /home/juan/projects/personal/panini/app
git add public/qr-premium.png public/qr-vip.png
git add src/components/subscription/UpgradeModal.jsx
git commit -m "feat: add QR payment images for Premium and VIP tiers

- qr-premium.png: $5,000 COP (Premium with CSF2026)
- qr-vip.png: $10,000 COP (VIP with CSF2026)

Account: @bustamante161
Email: latinkid2211@gmail.com"
```

## Mapping Final:

| Tier | Precio Mostrado | QR Image | Llave |
|------|----------------|----------|-------|
| **Premium** | $5,000 COP (con CSF2026) | qr-premium.png | @bustamante161 |
| **VIP** | $10,000 COP (con CSF2026) | qr-vip.png | @bustamante161 |

## Testing:

1. `npm run dev`
2. Abre https://localhost:5173
3. Loguéate
4. Escanea 5 sobres → Alcanza límite
5. Modal aparece → Selecciona VIP
6. Ingresa código CSF2026 → Precio muestra $10,000
7. Toca "Seleccionar VIP" → Ve QR de $10,000 ✅
8. Repite con Premium → Ve QR de $5,000 ✅

---

**¿Dudas?** Las imágenes QR están en los mensajes anteriores de este chat. Solo descárgalas, renombra y guarda en `/public/`.

🎯 **Objetivo:** Mostrar precios con descuento por defecto para maximizar conversiones.
