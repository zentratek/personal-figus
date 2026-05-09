// Screens — Home, Album, Matches, MatchDetail
const { useState, useMemo, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeScreen({ counts, stickers, goto, density }) {
  const today = new Date();
  const dayLabel = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();

  // Pick a few "hot" stickers for the carousel — owned + a few specials
  const hot = useMemo(() => {
    const owned = stickers.filter((s) => s.state === 'owned' || s.state === 'repeated').slice(0, 4);
    return owned;
  }, [stickers]);

  const matchPreview = FIGUS.matches.slice(0, 3);

  return (
    <div data-screen-label="01 Home">
      <TopBar
        left={
          <div style={{
            fontFamily: 'Bungee, sans-serif', fontSize: 24,
            color: C.primary, letterSpacing: 0.5,
            textShadow: '2px 2px 0 #000',
          }}>FIGUS</div>
        }
        right={
          <>
            <button style={{
              width: 40, height: 40, background: '#13131F',
              border: `2px solid ${C.border}`, borderRadius: 10,
              color: C.text, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.bell width={18} />
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: 8,
                background: C.red, color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0A0A14',
              }}>3</span>
            </button>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: C.cyan, color: '#0A0A14',
              border: '2px solid #0A0A14',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              fontSize: 16,
            }}>M</div>
          </>
        }
      />

      <div style={{ padding: '14px 16px 100px' }}>
        {/* Greeting */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: C.muted, letterSpacing: 0.8, marginBottom: 4,
        }}>{`>> ${dayLabel}`}</div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          Hola, <span style={{ color: C.primary }}>Martín</span>.<br />
          Te faltan <span style={{ color: C.lime, fontFamily: "'JetBrains Mono', monospace" }}>{counts.falta + counts.special}</span>.
        </div>

        {/* Progress card — the hero */}
        <div style={{
          background: '#0F0F1A',
          border: `2px solid ${C.primary}`,
          borderRadius: 16,
          padding: 18,
          boxShadow: `4px 4px 0 #000`,
          marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            background: `repeating-linear-gradient(45deg, ${C.primary} 0 2px, transparent 2px 14px)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            gap: 12, marginBottom: 14, position: 'relative',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: C.muted, letterSpacing: 0.8, textTransform: 'uppercase',
              }}>Mi álbum</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, lineHeight: 1.15 }}>{FIGUS.albumName}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: C.cyan, marginTop: 2,
              }}>EDICIÓN {FIGUS.albumYear}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: 32, color: C.lime, lineHeight: 1,
                textShadow: '2px 2px 0 #000',
              }}>{counts.pct}%</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: C.muted, marginTop: 2,
              }}>{counts.owned}/{counts.total}</div>
            </div>
          </div>
          {/* progress bar — chunky pixel style */}
          <div style={{
            height: 16, background: '#0A0A14',
            border: `2px solid ${C.border}`, borderRadius: 4,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${counts.pct}%`,
              background: `repeating-linear-gradient(90deg, ${CHEX.lime} 0 6px, ${CHEX.lime}cc 6px 8px)`,
              borderRight: '2px solid #0A0A14',
            }} />
          </div>
          {/* stat row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <StatChip label="TENGO" value={counts.owned} color={C.lime} />
            <StatChip label="REPES" value={counts.repe} color={C.primary} />
            <StatChip label="FALTAN" value={counts.falta + counts.special} color="#5C5C75" />
          </div>
        </div>

        {/* Quick action row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <ActionTile
            color={C.cyan}
            icon={<Icon.plus width={20} />}
            title="ABRIR SOBRE"
            sub="cargar 5 figuritas"
            onClick={() => goto('album')}
          />
          <ActionTile
            color={C.gold}
            icon={<Icon.search width={20} />}
            title="BUSCAR"
            sub="por número"
            onClick={() => goto('album')}
          />
        </div>

        {/* Match alert card */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 8,
        }}>{`// MATCHES DE HOY`}</div>
        <div style={{
          background: C.primary,
          color: '#0A0A14',
          border: '2px solid #0A0A14',
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow: '4px 4px 0 #000',
          marginBottom: 14,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }} onClick={() => goto('matches')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: '#0A0A14', color: C.lime,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${C.lime}`,
            }}><Icon.target width={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>5 cambios posibles</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                opacity: 0.75, marginTop: 1,
              }}>con {FIGUS.friends.filter(f=>f.online).length} amigos · ahora</div>
            </div>
            <Icon.back width={22} style={{ transform: 'rotate(180deg)' }} />
          </div>
        </div>

        {/* Group activity */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 8,
        }}>{`// MI GRUPO`}</div>
        <div style={{
          background: C.surface,
          border: `2px solid ${C.border}`,
          borderRadius: 14, padding: 14,
          boxShadow: '4px 4px 0 #000', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: C.gold, color: '#0A0A14',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #0A0A14',
            }}><Icon.trophy width={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{FIGUS.groupName}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: C.muted,
              }}>{FIGUS.friends.length} jugadores · {FIGUS.groupCode}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {FIGUS.friends.map((f) => (
              <div key={f.id} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8, margin: '0 auto',
                  background: f.color, color: '#0A0A14',
                  border: '2px solid #0A0A14',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  fontSize: 14,
                }}>
                  {f.avatar}
                  {f.online && (
                    <span style={{
                      position: 'absolute', top: -2, right: 6,
                      width: 10, height: 10, borderRadius: 5,
                      background: C.lime, border: '2px solid #0A0A14',
                    }} />
                  )}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: C.muted, marginTop: 4,
                }}>{f.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak / pack opener */}
        <div style={{
          background: '#0F0F1A',
          border: `2px dashed ${CHEX.gold}66`,
          borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            background: 'linear-gradient(135deg,#FFE066,#FFC700)',
            color: '#1A1100', border: '2px solid #0A0A14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '3px 3px 0 #000',
          }}><Icon.flame width={22} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Racha de 12 días</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted,
            }}>seguí cargando para no perderla</div>
          </div>
          <div style={{
            fontFamily: 'Bungee, sans-serif', fontSize: 22,
            color: C.gold,
          }}>×12</div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div style={{
      flex: 1, background: '#0A0A14',
      border: `1.5px solid ${C.border}`, borderRadius: 8,
      padding: '8px 10px',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
        color: C.muted, letterSpacing: 0.6, fontWeight: 700,
      }}>{label}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 18,
        fontWeight: 700, color, marginTop: 2,
      }}>{value}</div>
    </div>
  );
}

function ActionTile({ color, icon, title, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: C.surface,
      border: `2px solid ${C.border}`,
      borderRadius: 12, padding: 12,
      boxShadow: '3px 3px 0 #000',
      textAlign: 'left',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: color, color: '#0A0A14',
        border: '2px solid #0A0A14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.text, letterSpacing: 0.4 }}>{title}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
        color: C.muted, marginTop: 2,
      }}>{sub}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ALBUM
// ─────────────────────────────────────────────────────────────
function AlbumScreen({ stickers, density, goto, openSticker, setOpenSticker, filter, setFilter, counts }) {
  const [showFab, setShowFab] = useState(true);

  const filtered = useMemo(() => {
    if (filter === 'all') return stickers;
    if (filter === 'needed') return stickers.filter((s) => s.state === 'needed');
    if (filter === 'repeated') return stickers.filter((s) => s.state === 'repeated');
    if (filter === 'special') return stickers.filter((s) => s.special);
    return stickers;
  }, [filter, stickers]);

  // group by team (10 per team)
  const groups = useMemo(() => {
    const out = [];
    let cur = null;
    for (const s of filtered) {
      if (!cur || cur.team !== s.team) {
        cur = { team: s.team, items: [] };
        out.push(cur);
      }
      cur.items.push(s);
    }
    return out;
  }, [filtered]);

  const cellSize = density === 4 ? 76 : density === 5 ? 60 : 50;
  const gap = density === 6 ? 6 : 8;

  return (
    <div data-screen-label="02 Álbum">
      <TopBar
        left={
          <button onClick={() => goto('home')} style={{
            width: 40, height: 40, background: '#13131F',
            border: `2px solid ${C.border}`, borderRadius: 10,
            color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.back width={20} /></button>
        }
        center={
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
            }}>MI ÁLBUM</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 1 }}>{FIGUS.albumName}</div>
          </div>
        }
        right={
          <button style={{
            width: 40, height: 40, background: '#13131F',
            border: `2px solid ${C.border}`, borderRadius: 10,
            color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.filter width={18} /></button>
        }
      />

      {/* Mini progress strip */}
      <div style={{
        padding: '12px 16px',
        background: '#0A0A14',
        borderBottom: `1.5px solid ${C.border}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: C.text, letterSpacing: 0.4,
          }}>
            <span style={{ color: C.lime, fontWeight: 700 }}>{counts.owned}</span>
            <span style={{ color: C.muted }}>/{counts.total}</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            fontWeight: 700, color: C.primary,
          }}>{counts.pct}%</div>
        </div>
        <div style={{
          height: 6, background: '#13131F', borderRadius: 4, overflow: 'hidden',
          border: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: `${counts.pct}%`, height: '100%',
            background: C.lime,
          }} />
        </div>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        background: C.bg, borderBottom: `1.5px solid ${C.border}`,
        position: 'sticky', top: 112, zIndex: 4,
      }}>
        <Pill active={filter === 'all'}      onClick={() => setFilter('all')}      color={C.text}>TODAS · {counts.total}</Pill>
        <Pill active={filter === 'needed'}   onClick={() => setFilter('needed')}   color="#9A9AB5">FALTAN · {counts.falta + counts.special}</Pill>
        <Pill active={filter === 'repeated'} onClick={() => setFilter('repeated')} color={C.primary}>REPES · {counts.repe}</Pill>
        <Pill active={filter === 'special'}  onClick={() => setFilter('special')}  color={C.gold}>★ ESPECIALES</Pill>
      </div>

      {/* Sticker grid by team */}
      <div style={{ padding: '14px 16px 110px', position: 'relative' }}>
        {groups.length === 0 && (
          <div style={{
            padding: '60px 20px', textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            color: C.muted, letterSpacing: 0.6,
          }}>
            // sin resultados<br />
            <span style={{ color: C.text, fontFamily: 'Space Grotesk' }}>
              Probá otro filtro
            </span>
          </div>
        )}
        {groups.map((g) => {
          const team = FIGUS.TEAMS.find((t) => t.code === g.team);
          const have = g.items.filter((s) => s.state !== 'needed').length;
          return (
            <div key={g.team} style={{ marginBottom: 22 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                position: 'relative',
              }}>
                <div style={{
                  background: team.c1, color: team.c2,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, fontSize: 11,
                  padding: '4px 8px', borderRadius: 5,
                  border: '2px solid #0A0A14',
                }}>{g.team}</div>
                <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.4 }}>{team.name.toUpperCase()}</div>
                <div style={{
                  flex: 1, height: 2, background: C.border, marginLeft: 4,
                }} />
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: C.muted,
                }}>{have}/{g.items.length}</div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${density}, ${cellSize}px)`,
                gap, justifyContent: 'start',
              }}>
                {g.items.map((s) => (
                  <StickerCell key={s.n} sticker={s} size={cellSize} onTap={() => setOpenSticker(s.n)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating action button */}
      {showFab && (
        <button onClick={() => goto('album')} style={{
          position: 'absolute', right: 18, bottom: 96, zIndex: 30,
          width: 58, height: 58, borderRadius: 14,
          background: C.primary, color: '#0A0A14',
          border: '3px solid #0A0A14',
          boxShadow: '4px 4px 0 #000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <Icon.plus width={26} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATCHES LIST
// ─────────────────────────────────────────────────────────────
function MatchesScreen({ goto, setActiveMatchId }) {
  const [tab, setTab] = useState('possible');

  return (
    <div data-screen-label="03 Cambios">
      <TopBar
        left={
          <button onClick={() => goto('home')} style={{
            width: 40, height: 40, background: '#13131F',
            border: `2px solid ${C.border}`, borderRadius: 10,
            color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.back width={20} /></button>
        }
        center={
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
            }}>MATCHMAKER</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 1 }}>Cambios</div>
          </div>
        }
        right={null}
      />

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        background: C.bg, borderBottom: `1.5px solid ${C.border}`,
        position: 'sticky', top: 112, zIndex: 4,
      }}>
        <Pill active={tab === 'possible'}  onClick={() => setTab('possible')}  color={C.lime}>POSIBLES · {FIGUS.matches.length}</Pill>
        <Pill active={tab === 'sent'}      onClick={() => setTab('sent')}      color={C.cyan}>ENVIADOS</Pill>
        <Pill active={tab === 'done'}      onClick={() => setTab('done')}      color={C.gold}>HECHOS</Pill>
      </div>

      <div style={{ padding: '14px 16px 110px' }}>
        {tab === 'possible' && (
          <>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: C.muted, letterSpacing: 0.6, marginBottom: 12,
            }}>// figuritas que vos tenés repe y a tus amigos les faltan</div>
            {FIGUS.matches.map((m) => {
              const friend = FIGUS.friends.find((f) => f.id === m.friend);
              return (
                <MatchCard key={m.id} match={m} friend={friend} onClick={() => {
                  setActiveMatchId(m.id);
                  goto('matchDetail');
                }} />
              );
            })}
          </>
        )}
        {tab === 'sent' && (
          <EmptyState
            label="Sin cambios pendientes"
            sub="cuando propongas un cambio, va a aparecer acá"
            color={C.cyan}
          />
        )}
        {tab === 'done' && (
          <EmptyState
            label="Todavía no hiciste cambios"
            sub="acá vas a ver tu historial completo"
            color={C.gold}
          />
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, friend, onClick }) {
  const total = match.give.length + match.receive.length;
  return (
    <div onClick={onClick} style={{
      background: C.surface,
      border: `2px solid ${C.border}`,
      borderRadius: 14, padding: 14,
      boxShadow: '4px 4px 0 #000',
      marginBottom: 14, cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: friend.color, color: '#0A0A14',
            border: '2px solid #0A0A14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: 18, boxShadow: '2px 2px 0 #000',
          }}>{friend.avatar}</div>
          {friend.online && (
            <span style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 12, height: 12, borderRadius: 6,
              background: C.lime, border: '2px solid #0A0A14',
            }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{friend.name}</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: C.muted,
          }}>{friend.pct}% del álbum · {friend.online ? 'EN LÍNEA' : 'hace 2h'}</div>
        </div>
        <div style={{
          background: C.lime, color: '#0A0A14',
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 12, padding: '4px 8px', borderRadius: 5,
          border: '2px solid #0A0A14', boxShadow: '2px 2px 0 #000',
          letterSpacing: 0.4,
        }}>{match.give.length}↔{match.receive.length}</div>
      </div>

      <div style={{
        background: '#0A0A14', border: `1.5px solid ${C.border}`,
        borderRadius: 10, padding: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            color: C.primary, fontWeight: 700, letterSpacing: 0.8,
            width: 56,
          }}>VOS DAS</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {match.give.slice(0, 4).map((n) => (
              <NumberChip key={n} n={n} state="repeated" />
            ))}
            {match.give.length > 4 && <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted,
              alignSelf: 'center',
            }}>+{match.give.length - 4}</span>}
          </div>
        </div>
        <div style={{
          height: 1, background: C.border, margin: '6px 0',
          backgroundImage: 'repeating-linear-gradient(90deg, #2A2A3D 0 4px, transparent 4px 8px)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5,
            color: C.lime, fontWeight: 700, letterSpacing: 0.8,
            width: 56,
          }}>RECIBÍS</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {match.receive.slice(0, 4).map((n) => (
              <NumberChip key={n} n={n} state="owned" />
            ))}
            {match.receive.length > 4 && <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted,
              alignSelf: 'center',
            }}>+{match.receive.length - 4}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberChip({ n, state }) {
  const fill = state === 'owned' ? C.lime : state === 'repeated' ? C.primary : '#262638';
  const color = '#0A0A14';
  return (
    <div style={{
      minWidth: 34, height: 28, padding: '0 8px',
      background: fill, color,
      border: '1.5px solid #0A0A14',
      borderRadius: 5,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
      fontSize: 12,
    }}>{n}</div>
  );
}

function EmptyState({ label, sub, color }) {
  return (
    <div style={{
      padding: '60px 20px', textAlign: 'center',
      border: `1.5px dashed ${C.border}`, borderRadius: 14,
      background: '#0A0A14',
    }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 14px',
        background: color, color: '#0A0A14',
        border: '2px solid #0A0A14', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '3px 3px 0 #000',
      }}>
        <Icon.swap width={26} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: C.muted, marginTop: 4, letterSpacing: 0.4,
      }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATCH DETAIL
// ─────────────────────────────────────────────────────────────
function MatchDetailScreen({ goto, activeMatchId, stickers, setProposeOk }) {
  const match = FIGUS.matches.find((m) => m.id === activeMatchId) || FIGUS.matches[0];
  const friend = FIGUS.friends.find((f) => f.id === match.friend);
  const [msg, setMsg] = useState('Hola! Me re sirven 👌');
  const [sent, setSent] = useState(false);

  const giveItems  = match.give.map((n) => stickers.find((s) => s.n === n)).filter(Boolean);
  const recvItems  = match.receive.map((n) => stickers.find((s) => s.n === n) || { n, name: 'Desconocido', team: 'ARG', pos: 'DEL' });

  const propose = () => {
    setSent(true);
    setTimeout(() => {
      goto('matches');
      setSent(false);
    }, 1200);
  };

  return (
    <div data-screen-label="04 Match detalle">
      <TopBar
        left={
          <button onClick={() => goto('matches')} style={{
            width: 40, height: 40, background: '#13131F',
            border: `2px solid ${C.border}`, borderRadius: 10,
            color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.back width={20} /></button>
        }
        center={
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: C.muted, letterSpacing: 1, textTransform: 'uppercase',
            }}>CAMBIO CON</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 1 }}>{friend.name}</div>
          </div>
        }
      />

      <div style={{ padding: '16px 16px 110px' }}>
        {/* Friend banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: friend.color, color: '#0A0A14',
          border: '2px solid #0A0A14', borderRadius: 14,
          padding: 14, boxShadow: '4px 4px 0 #000',
          marginBottom: 18,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: '#0A0A14', color: friend.color,
            border: '2px solid #0A0A14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: 22,
          }}>{friend.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{friend.name}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              fontWeight: 700,
            }}>{friend.pct}% · {friend.online ? '● EN LÍNEA' : 'hace 2h'}</div>
          </div>
          <div style={{
            fontFamily: 'Bungee, sans-serif', fontSize: 22,
          }}>{match.give.length}↔{match.receive.length}</div>
        </div>

        {/* Trade visual */}
        <SwapBlock
          label="VOS DAS"
          color={C.primary}
          count={match.give.length}
          items={giveItems}
          tone="repeated"
        />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '12px 0', gap: 6,
        }}>
          <div style={{ height: 2, background: C.border, flex: 1 }} />
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: C.cyan, color: '#0A0A14',
            border: '2px solid #0A0A14', boxShadow: '3px 3px 0 #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.swap width={22} /></div>
          <div style={{ height: 2, background: C.border, flex: 1 }} />
        </div>
        <SwapBlock
          label="VOS RECIBÍS"
          color={C.lime}
          count={match.receive.length}
          items={recvItems}
          tone="owned"
        />

        {/* Message */}
        <div style={{ marginTop: 22 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: C.muted, letterSpacing: 0.8, textTransform: 'uppercase',
            marginBottom: 8,
          }}>Mensaje</div>
          <div style={{
            background: '#0F0F1A', border: `2px solid ${C.border}`,
            borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Escribí algo..."
              style={{
                flex: 1, background: 'transparent', border: 0, outline: 'none',
                color: C.text, fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 15,
              }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: C.muted,
            }}>{msg.length}/100</span>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CTA color={sent ? C.lime : C.primary} onClick={propose}>
            {sent ? <><Icon.check width={18}/> Enviado</> : <>Proponer cambio <Icon.bolt width={16}/></>}
          </CTA>
          <button onClick={() => goto('matches')} style={{
            height: 44, background: 'transparent',
            border: `2px solid ${C.border}`, borderRadius: 12,
            color: C.muted, fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700, fontSize: 12, letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function SwapBlock({ label, color, count, items, tone }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color, fontWeight: 700, letterSpacing: 0.8,
        }}>// {label}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: C.muted,
        }}>{count} figuritas</span>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        paddingBottom: 6, paddingRight: 4,
      }}>
        {items.map((s) => (
          <SwapCard key={s.n} sticker={s} tone={tone} color={color} />
        ))}
      </div>
    </div>
  );
}

function SwapCard({ sticker, tone, color }) {
  const team = FIGUS.TEAMS.find((t) => t.code === sticker.team) || FIGUS.TEAMS[0];
  const fill = tone === 'owned' ? C.lime : C.primary;
  return (
    <div style={{
      width: 110, flexShrink: 0,
      background: C.surface, border: `2px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '3px 3px 0 #000',
    }}>
      <div style={{
        height: 90, position: 'relative',
        background: `repeating-linear-gradient(135deg, ${team.c1}33 0 6px, ${team.c1}55 6px 12px), ${team.c1}`,
      }}>
        <div style={{
          position: 'absolute', top: 6, left: 6,
          background: '#0A0A14', color: fill,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 11, padding: '2px 6px', borderRadius: 3,
          border: `1.5px solid ${fill}`,
        }}>#{sticker.n}</div>
        <div style={{
          position: 'absolute', top: 6, right: 6,
          background: team.c2, color: team.c1,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 9, padding: '2px 5px', borderRadius: 3,
          border: '1.5px solid #0A0A14',
        }}>{sticker.team}</div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bungee, sans-serif', fontSize: 56,
          color: '#0A0A1466', letterSpacing: 0.04,
        }}>{sticker.name.split(' ').slice(-1)[0].slice(0, 2).toUpperCase()}</div>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{
          fontWeight: 700, fontSize: 12, color: C.text,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{sticker.name}</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: C.muted, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>{sticker.pos}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, AlbumScreen, MatchesScreen, MatchDetailScreen,
});
