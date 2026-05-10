# Imágenes QR de Pago - Bancolombia

## Instrucciones

Para completar la integración del sistema de suscripciones, necesitas agregar las imágenes QR de Bancolombia en este directorio (`/public/`).

### Archivos Requeridos:

1. **qr-premium.png** - QR para pago de Premium ($5,000 COP con código, $10,000 sin código)
2. **qr-vip.png** - QR para pago de VIP ($10,000 COP con código, $20,000 sin código)

### Pasos:

1. Coloca las imágenes QR proporcionadas en este directorio:
   ```
   /home/juan/projects/personal/panini/app/public/qr-premium.png
   /home/juan/projects/personal/panini/app/public/qr-vip.png
   ```

2. Abre el archivo `src/components/subscription/UpgradeModal.jsx`

3. Busca el comentario `/* TODO: Reemplazar con imágenes QR reales en /public/ */`

4. Comenta el placeholder actual (líneas 275-284)

5. Descomenta las líneas del `<img>` tag (líneas 285-291)

### Código a descomentar:

```jsx
<img
  src={selectedTier === 'premium' ? '/qr-premium.png' : '/qr-vip.png'}
  alt="QR Bancolombia"
  className="w-full rounded-lg"
/>
```

### Especificaciones de las Imágenes:

- **Formato**: PNG (preferido) o JPG
- **Tamaño recomendado**: 500x500px o mayor (cuadrado)
- **Contenido**: QR de Bancolombia apuntando a la cuenta @bustamante161

### Verificación:

Después de agregar las imágenes:
1. Abre la app en desarrollo
2. Intenta hacer un escaneo OCR hasta alcanzar el límite
3. Verifica que el modal de upgrade muestre el QR correcto
4. Prueba con ambos tiers (Premium y VIP)

---

**Cuenta de Destino**: @bustamante161 (Bancolombia)
**Email de Confirmación**: latinkid2211@gmail.com
