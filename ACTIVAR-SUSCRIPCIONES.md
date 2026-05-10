# 🚀 Cómo Activar Suscripciones

## Instrucciones Rápidas

1. **Abre una terminal** en tu computadora

2. **Navega al directorio del proyecto:**
   ```bash
   cd /home/juan/projects/personal/panini/app
   ```

3. **Ejecuta el script:**
   ```bash
   node scripts/activate-subscription.js
   ```

4. **Sigue los pasos interactivos:**
   - Ingresa el User ID del usuario (copialo del email)
   - Selecciona el plan (1=Premium, 2=VIP)
   - Indica si usó código promocional (s/n)
   - Confirma los datos
   - ¡Listo! La suscripción está activada

## 📋 Ejemplo de Uso

```
╔══════════════════════════════════════════╗
║     FIGUS - Activar Suscripción          ║
╚══════════════════════════════════════════╝

📝 Paso 1: Información del Usuario
Ingresa el User ID del usuario: abc123xyz789

✓ User ID: abc123xyz789

📦 Paso 2: Selecciona el Plan
1) Premium ($10,000 COP - 3 meses)
2) VIP ($20,000 COP - 3 meses)
Selecciona una opción (1 o 2): 2

✓ Tier seleccionado: VIP

🎟️  Paso 3: Código Promocional
¿El usuario usó código CSF2026? (s/n): s

✓ Código aplicado - Precio: $10000 COP

📅 Paso 4: Calculando fechas...
✓ Fecha de activación: 2026-05-10T22:30:00Z
✓ Válido hasta: 2026-08-10T22:30:00Z

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESUMEN:
  User ID: abc123xyz789
  Tier: VIP
  Monto: $10000 COP
  Código: CSF2026
  Válido hasta: 2026-08-10T22:30:00Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Confirmar activación? (s/n): s

🔄 Activando suscripción en Firebase...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡SUSCRIPCIÓN ACTIVADA EXITOSAMENTE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔍 Dónde Encontrar el User ID

Cuando el usuario envía el email de pago, debe incluir su **User ID**. 

Si no lo incluyó, puedes:
1. Pedirle que vaya a Perfil en la app
2. Su User ID aparece en la URL cuando está en la app
3. O buscalo en Firebase Console por email

## ⚠️ Importante

- **Siempre verifica el comprobante** antes de activar
- El script calcula automáticamente 3 meses (92 días)
- Los cambios se aplican **instantáneamente** en la app del usuario
- Guarda un registro de las activaciones

## 🐛 Problemas?

Si el script da error:
1. Verifica que estés en el directorio correcto
2. Asegúrate de estar logueado en Firebase: `firebase login`
3. Verifica que el User ID sea correcto (copialo/pegalo del email)

## 📞 Después de Activar

El script te genera un email de respuesta automáticamente. 
Solo copialo y envialo al usuario confirmando la activación.

---

**Script ubicado en:** `/home/juan/projects/personal/panini/app/scripts/activate-subscription.js`

**Requisito:** Necesitas tener el archivo de credenciales de Firebase Admin SDK en `app/figus-app-495718-firebase-adminsdk-6cz8m-45bfc36ed1.json`
