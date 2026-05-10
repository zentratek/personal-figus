# Configurar Firebase Admin SDK

## Descargar Credenciales

Para que el script de activación funcione, necesitas descargar las credenciales de Firebase Admin SDK:

### Pasos:

1. **Ir a Firebase Console:**
   ```
   https://console.firebase.google.com/project/figus-app-495718/settings/serviceaccounts/adminsdk
   ```

2. **Generar nueva clave privada:**
   - Click en "Generar nueva clave privada"
   - Se descargará un archivo JSON

3. **Renombrar y mover el archivo:**
   ```bash
   mv ~/Downloads/figus-app-*.json /home/juan/projects/personal/panini/app/figus-app-495718-firebase-adminsdk-6cz8m-45bfc36ed1.json
   ```

4. **Verificar que el archivo está en el lugar correcto:**
   ```bash
   ls -la /home/juan/projects/personal/panini/app/*.json | grep adminsdk
   ```

5. **¡Listo!** Ya podés ejecutar el script de activación.

## ⚠️ Seguridad

**IMPORTANTE:** 
- Este archivo contiene credenciales sensibles
- NO lo subas a Git (ya está en .gitignore)
- NO lo compartas con nadie
- Guardalo en un lugar seguro

Si el archivo se pierde, simplemente generá una nueva clave desde Firebase Console.
