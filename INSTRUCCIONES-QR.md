# 📥 INSTRUCCIONES: Guardar QR Codes

## Imágenes Recibidas:
1. ❌ QR de $5,000 - NO USAR (con descuento CSF2026)
2. ✅ QR de $10,000 - USAR para Premium
3. ✅ QR de $20,000 - USAR para VIP

## PASOS PARA GUARDAR:

### 1. Descargar del Chat
En el chat donde enviaste las imágenes, descarga:
- **Segunda imagen** (QR $10,000)
- **Tercera imagen** (QR $20,000)

### 2. Guardar en /public/

```bash
# Navega al directorio público
cd /home/juan/projects/personal/panini/app/public/

# Desde tu navegador/chat, descarga las imágenes y guárdalas como:
# - QR $10,000 → qr-premium.png
# - QR $20,000 → qr-vip.png
```

**IMPORTANTE:** Los nombres deben ser exactamente:
- `qr-premium.png` (QR de $10,000)
- `qr-vip.png` (QR de $20,000)

### 3. Verificar

```bash
ls -lh /home/juan/projects/personal/panini/app/public/qr-*.png

# Debes ver:
# -rw-rw-r-- 1 juan juan XXK ... qr-premium.png
# -rw-rw-r-- 1 juan juan XXK ... qr-vip.png
```

### 4. Commit y Deploy

Una vez guardadas las imágenes, ejecuta:

```bash
cd /home/juan/projects/personal/panini/app
git add public/qr-premium.png public/qr-vip.png src/components/subscription/UpgradeModal.jsx
git commit -m "feat: add Bancolombia QR payment images"

npm run build
firebase deploy --only hosting
```

## Mapping Final:

| Tier | Precio Público | QR Archivo | Monto QR |
|------|----------------|------------|----------|
| Premium | $10,000 COP | qr-premium.png | $10,000 |
| VIP | $20,000 COP | qr-vip.png | $20,000 |

**Código CSF2026:**
- Privado (WhatsApp only)
- NO aparece públicamente en la app
- Reduce precios 50% cuando se aplica
- QR siempre muestra precio público

---

## Estado Actual:

✅ Código actualizado en UpgradeModal.jsx
✅ Referencias a imágenes correctas (/qr-premium.png y /qr-vip.png)
⏳ PENDIENTE: Guardar imágenes en /public/

Una vez guardes las imágenes, las verás automáticamente en dev server.
