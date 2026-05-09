# 004 - Groups & Invitations

---
**Title:** Group System & Invitation Codes
**Status:** 🟢 Approved  
**Created:** 2026-05-08

---

## Summary
Sistema de grupos cerrados (max 10 miembros) con códigos de invitación formato `XX-YYYY`.

## Code Generation
```javascript
// "LOS PIBES" → "PB-9X4Q"
function generateGroupCode(name) {
  const initials = name.replace(/[^A-Z0-9]/g, '').substring(0, 2).padEnd(2, 'X');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${initials}-${random}`;
}
```

## Join Flow
1. User ingresa código `PB-9X4Q`
2. Query: `where('code', '==', code)`
3. Validar: exists + not full + not already member
4. Update: `arrayUnion(userId)` to `members[]`

## Success Metrics
- ✅ Código único generado en < 100ms
- ✅ Join exitoso en < 2s

**Refs:** [Data Models](./002-data-models.md)
