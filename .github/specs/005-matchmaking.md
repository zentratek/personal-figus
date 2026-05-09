# 005 - Matchmaking Algorithm

---
**Title:** Trade Matching Algorithm
**Status:** 🟢 Approved
**Created:** 2026-05-08

---

## Summary
Algoritmo que encuentra intercambios ganar-ganar: mis repetidas ∩ tus faltantes.

## Algorithm
```javascript
export async function findMatches(userId, groupId) {
  const members = await getGroupMembers(groupId);
  const repeated = {};  // { userId: Set([stickerIds]) }
  const needed = {};

  // Build maps (usar denormalized arrays)
  for (const memberId of members) {
    const user = await getDoc(doc(db, 'users', memberId));
    repeated[memberId] = new Set(user.data().denormalized.repeatedIds);
    needed[memberId] = new Set(user.data().denormalized.neededIds);
  }

  // Find matches
  const matches = [];
  for (const otherId of members) {
    if (otherId === userId) continue;

    const iGive = intersection(repeated[userId], needed[otherId]);
    const iReceive = intersection(repeated[otherId], needed[userId]);

    if (iGive.size > 0 && iReceive.size > 0) {
      matches.push({
        friendId: otherId,
        give: Array.from(iGive),
        receive: Array.from(iReceive),
        score: iGive.size + iReceive.size
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

function intersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}
```

## Performance
- **Worst case:** 10 users → 10 Firestore reads (users)
- **Target:** < 2s execution
- **Optimization:** Denormalized arrays evitan leer 6,380 stickers

## Success Metrics
- ✅ Encuentra matches correctos (test con seed data)
- ✅ < 2s execution en mid-range phones

**Refs:** [Data Models](./002-data-models.md)
