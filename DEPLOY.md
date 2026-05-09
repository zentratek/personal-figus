# Deploy Guide - Figus App

## 🚀 Quick Deploy

```bash
# 1. Build para producción
npm run build

# 2. Preview local (opcional)
npm run preview

# 3. Deploy a Firebase Hosting
firebase deploy --only hosting
```

## 📋 Prerequisitos

### 1. Instalar Firebase CLI (una sola vez)

```bash
npm install -g firebase-tools
```

### 2. Login a Firebase (una sola vez)

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con Google.

## 🌐 Configurar Dominio Custom (figus.online)

### Paso 1: Agregar dominio en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/project/figus-app-495718/hosting)
2. Click en "Add custom domain"
3. Ingresa: `figus.online`
4. Firebase te dará 2 registros DNS que necesitás agregar

### Paso 2: Configurar DNS en GoDaddy

Vas a recibir algo como esto de Firebase:

```
A record:
  Name: @
  Value: 151.101.1.195

A record:
  Name: @
  Value: 151.101.65.195
```

**En GoDaddy:**

1. Ingresa a GoDaddy → DNS Management para `figus.online`
2. Agrega los 2 registros A que Firebase te dio:
   - **Type:** A
   - **Name:** @
   - **Value:** (la IP que Firebase te dio)
   - **TTL:** 1 hora

3. **IMPORTANTE:** Si hay registros A antiguos apuntando a otro lado, eliminá esos primero

### Paso 3: Agregar subdominios (opcional)

Si querés que `www.figus.online` también funcione:

```
CNAME record:
  Name: www
  Value: figus.online
```

### Paso 4: Esperar propagación DNS

- La propagación puede tardar **5 minutos a 48 horas**
- Generalmente es ~15-30 minutos
- Podés verificar en: https://www.whatsmydns.net/

### Paso 5: Verificar en Firebase

Una vez que el DNS propagó, Firebase automáticamente:
- ✅ Genera certificado SSL (HTTPS)
- ✅ Configura redirects de www → apex (si elegiste esa opción)
- ✅ Habilita HTTP/2

## 🔄 Workflow de Deploy

### Deploy Normal

```bash
# Build + Deploy en un comando
npm run build && firebase deploy --only hosting
```

### Deploy con Preview (recomendado antes de producción)

```bash
# 1. Build
npm run build

# 2. Preview local
npm run preview
# Abre http://localhost:4173 y verifica que todo funcione

# 3. Si todo está bien, deploy
firebase deploy --only hosting
```

### Rollback a versión anterior

Si algo sale mal:

```bash
# Ver historial de deploys
firebase hosting:channel:list

# Hacer rollback desde Firebase Console:
# https://console.firebase.google.com/project/figus-app-495718/hosting
# → Hosting → Release history → "..." → Rollback
```

## 📦 Deploy de Firestore Rules (si cambiaron)

```bash
firebase deploy --only firestore:rules
```

## 📦 Deploy de Firestore Indexes (si cambiaron)

```bash
firebase deploy --only firestore:indexes
```

## 🔧 Troubleshooting

### Error: "Firebase CLI not found"

```bash
npm install -g firebase-tools
```

### Error: "Not authorized"

```bash
firebase login --reauth
```

### Error: "Build failed"

Revisá la consola para errores de TypeScript/ESLint:

```bash
npm run build
```

### Dominio no funciona después de 48 horas

1. Verificá DNS en https://www.whatsmydns.net/
2. Revisá que los registros A en GoDaddy coincidan con los de Firebase
3. Eliminá cache de DNS: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)

## 🌍 URLs después del deploy

- **Firebase default:** https://figus-app-495718.web.app
- **Dominio custom:** https://figus.online (después de configurar DNS)

## 📊 Monitoring

### Ver logs de deploy

```bash
firebase hosting:channel:list
```

### Analytics

Ve a [Firebase Console - Analytics](https://console.firebase.google.com/project/figus-app-495718/analytics) para ver:
- Usuarios activos
- Páginas más visitadas
- Errores de la app

## 🔐 Seguridad

### Headers de seguridad

Ya configurados en `firebase.json`:
- ✅ Cross-Origin-Opener-Policy
- ✅ Cross-Origin-Embedder-Policy
- ✅ Cache-Control para assets

### SSL/HTTPS

Firebase Hosting provee:
- ✅ Certificado SSL gratis (Let's Encrypt)
- ✅ Auto-renewal
- ✅ Redirect automático HTTP → HTTPS

## 📝 Checklist pre-deploy

- [ ] `npm run build` pasa sin errores
- [ ] `npm run preview` - verificar app localmente
- [ ] Firebase index para notificaciones creado (ya hecho)
- [ ] Variables de entorno correctas (.env no se commitea)
- [ ] Firestore rules actualizadas si hace falta

## 🚨 Variables de Entorno

**IMPORTANTE:** Las API keys de Firebase son públicas, pero están protegidas por Firestore Security Rules. No es necesario ocultarlas.

Si necesitás variables secretas en el futuro, usá Firebase Functions + environment config.

---

**Última actualización:** 2026-05-09
