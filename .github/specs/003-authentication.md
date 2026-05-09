# 003 - Authentication

---
**Title:** Google OAuth Authentication Flow
**Status:** 🟢 Approved
**Created:** 2026-05-08
**Authors:** Juan
**Reviewers:** Juan, hijo

---

## Summary

Sistema de autenticación usando Google OAuth via Firebase Auth. Login de 1 click, creación automática de perfil + álbum inicial (638 figuritas).

## Flow Diagram

```
┌─────────────────────────────────┐
│ 1. User toca "Continuar con     │
│    Google"                       │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 2. Firebase abre popup OAuth    │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 3. Usuario elige cuenta Google  │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 4. Firebase devuelve credential │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 5. ¿Usuario existe en Firestore?│
└─────┬───────────────────┬───────┘
      ▼ NO                ▼ YES
┌──────────────┐   ┌──────────────┐
│ 6. Crear:    │   │ 6. Actualizar│
│    - Profile │   │    lastLogin │
│    - Album   │   └──────────────┘
│    (638 docs)│
└──────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 7. Redirect a HomeScreen        │
└─────────────────────────────────┘
```

## Implementation

### authService.js

```javascript
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { generateInitialAlbum } from '../utils/albumGenerator';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      await createUserProfile(user);
      await generateInitialAlbum(user.uid, 'copa-2026');
    } else {
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: Timestamp.now()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Error en sign in:', error);
    throw error;
  }
};

async function createUserProfile(user) {
  const colors = ['#FFC700', '#00F0FF', '#C6FF3E', '#FF2D8E', '#9B5BFF'];

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Usuario',
    photoURL: user.photoURL,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
    avatarLetter: (user.displayName || 'U').charAt(0).toUpperCase(),
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    currentGroupId: null,
    albumId: 'copa-2026',
    stats: {
      totalOwned: 0,
      totalRepeated: 0,
      totalNeeded: 638,
      completionPct: 0,
      streakDays: 0,
      lastAddedAt: null
    },
    denormalized: {
      repeatedIds: [],
      neededIds: [],
      lastSyncAt: Timestamp.now()
    }
  });
}

export const signOut = async () => {
  await firebaseSignOut(auth);
};
```

## Security Considerations

- ✅ Firebase SDK maneja tokens automáticamente (no localStorage)
- ✅ Tokens expiran y se refrescan sin intervención
- ✅ HTTPS obligatorio (Firestore rules lo validan)

## Success Metrics

- ✅ Login exitoso en < 3s
- ✅ Álbum inicial generado en < 5s
- ✅ 0 errores de autenticación en producción

## References

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Data Models](./002-data-models.md)

---

**Next:** [004-groups-invitations.md](./004-groups-invitations.md)
