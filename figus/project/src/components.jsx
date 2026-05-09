// Shared components — sticker cells, nav, headers, badges.

// Concrete hex used for alpha-suffixed colors (CSS vars + alpha hex don't combine).
const CHEX = {
  lime: '#C6FF3E',
  gold: '#FFC700',
  cyan: '#00F0FF',
  red: '#FF4D4D',
};
const C = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-2)',
  surface3: 'var(--surface-3)',
  border: 'var(--border)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  primary: 'var(--primary)',
  cyan: 'var(--cyan)',
  lime: 'var(--lime)',
  gold: 'var(--gold)',
  red: 'var(--red)',
};

// ── Hard-shadow card ────────────────────────────────────────
function Card({ children, color = '#000', shadow = 4, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.surface, border: `2px solid ${C.border}`,
      borderRadius: 14, padding: 16,
      boxShadow: `${shadow}px ${shadow}px 0 ${color}`,
      ...style,
    }}>{children}</div>
  );
}

// ── Sticker cell — the hero atom ────────────────────────────
function StickerCell({ sticker, size = 64, onTap }) {
  const { n, state, count, special } = sticker;
  const [tapped, setTapped] = React.useState(false);
  const fontSize = size >= 70 ? 22 : size >= 60 ? 19 : size >= 52 ? 16 : 14;

  const tap = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 120);
    onTap && onTap();
  };

  const base = {
    width: size, height: size, position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize,
    transition: 'transform 100ms ease-out, box-shadow 100ms ease-out',
    transform: tapped ? 'translate(2px,2px)' : 'translate(0,0)',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    flexShrink: 0,
  };

  if (special && state !== 'needed') {
    return (
      <button onClick={tap} style={{
        ...base,
        background: 'linear-gradient(135deg,#FFE066 0%,#FFC700 45%,#A56600 100%)',
        color: '#1A1100',
        border: '2px solid #2A1A00',
        boxShadow: tapped ? '1px 1px 0 #000' : '3px 3px 0 #000, inset 0 0 0 1.5px #FFF1A8',
      }}>
        <span style={{ position: 'absolute', top: 4, left: 5, fontSize: 9, opacity: 0.65, fontWeight: 700 }}>★</span>
        {n}
        {state === 'repeated' && (
          <span style={{
            position: 'absolute', top: -7, right: -7,
            background: '#000', color: C.gold, padding: '2px 5px',
            fontSize: 11, borderRadius: 4, border: `1.5px solid ${C.gold}`,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          }}>×{count}</span>
        )}
      </button>
    );
  }

  if (state === 'owned') {
    return (
      <button onClick={tap} style={{
        ...base,
        background: special ? 'linear-gradient(135deg,#FFE066,#FFC700)' : C.lime,
        color: '#0A1400',
        border: '2px solid #0A0A14',
        boxShadow: tapped ? '1px 1px 0 #000' : '3px 3px 0 #000',
      }}>
        {n}
        <span style={{ position: 'absolute', bottom: 3, right: 4, fontSize: 8, opacity: 0.6, fontWeight: 700 }}>✓</span>
      </button>
    );
  }

  if (state === 'repeated') {
    return (
      <button onClick={tap} style={{
        ...base,
        background: C.primary,
        color: '#FFFFFF',
        border: '2px solid #0A0A14',
        boxShadow: tapped ? '1px 1px 0 #000' : '3px 3px 0 #000',
      }}>
        {n}
        <span style={{
          position: 'absolute', top: -7, right: -7,
          background: '#0A0A14', color: C.lime, padding: '2px 5px',
          fontSize: 11, borderRadius: 4, border: `1.5px solid ${C.lime}`,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          boxShadow: '2px 2px 0 #000',
        }}>×{count}</span>
      </button>
    );
  }

  // needed
  return (
    <button onClick={tap} style={{
      ...base,
      background: '#13131F',
      color: '#3A3A52',
      border: `1.5px dashed ${special ? 'rgba(255,199,0,0.55)' : '#2D2D42'}`,
    }}>
      {n}
      {special && (
        <span style={{ position: 'absolute', top: 3, right: 4, color: C.gold, fontSize: 9, opacity: 0.85 }}>★</span>
      )}
    </button>
  );
}

// ── Mini sticker preview (for match cards) ──────────────────
function MiniSticker({ n, state = 'owned', size = 44, label }) {
  const fill = state === 'owned' ? C.lime : state === 'repeated' ? C.primary : '#262638';
  const color = state === 'needed' ? '#5C5C75' : '#0A0A14';
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{
        width: size, height: size, background: fill, color,
        border: '2px solid #0A0A14',
        boxShadow: '2px 2px 0 #000',
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15,
      }}>{n}</div>
      {label && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: C.muted,
          textTransform: 'uppercase', letterSpacing: 0.4,
        }}>{label}</span>
      )}
    </div>
  );
}

// ── Bottom navigation ───────────────────────────────────────
function BottomNav({ active, onChange }) {
  const items = [
    { id: 'home',    label: 'INICIO',    icon: Icon.home },
    { id: 'album',   label: 'ÁLBUM',     icon: Icon.album },
    { id: 'matches', label: 'CAMBIOS',   icon: Icon.swap },
    { id: 'group',   label: 'GRUPO',     icon: Icon.group },
  ];
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 20,
      background: '#0A0A14',
      borderTop: '2px solid #1F1F30',
      paddingBottom: 28, // home indicator
      paddingTop: 10,
      display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
    }}>
      {items.map((it) => {
        const on = it.id === active;
        const disabled = it.id === 'group';
        return (
          <button
            key={it.id}
            onClick={() => !disabled && onChange(it.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, padding: '6px 0', position: 'relative',
              opacity: disabled ? 0.35 : 1,
            }}
          >
            <div style={{
              width: 48, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: on ? C.primary : 'transparent',
              border: on ? '2px solid #0A0A14' : '2px solid transparent',
              borderRadius: 8,
              boxShadow: on ? '2px 2px 0 #000' : 'none',
              color: on ? '#0A0A14' : '#7C7C95',
              transition: 'all 120ms',
            }}>
              <it.icon width={22} height={22} />
            </div>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6,
              color: on ? C.text : '#5C5C75',
              fontFamily: "'JetBrains Mono', monospace",
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Top bar (status-bar safe) ───────────────────────────────
function TopBar({ left, center, right, transparent = false, sticky = true }) {
  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative',
      top: 0, zIndex: 15,
      paddingTop: 56, // status bar
      background: transparent ? 'transparent' : C.bg,
      borderBottom: transparent ? 'none' : '2px solid #16162A',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', height: 56,
        padding: '0 16px', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 40 }}>{left}</div>
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>{center}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40, justifyContent: 'flex-end' }}>{right}</div>
      </div>
    </div>
  );
}

// ── Pill button (for filter chips / state toggles) ──────────
function Pill({ children, active, onClick, color = C.primary, size = 'md' }) {
  const h = size === 'sm' ? 28 : 36;
  return (
    <button onClick={onClick} style={{
      height: h,
      padding: '0 14px',
      background: active ? color : '#13131F',
      color: active ? '#0A0A14' : '#9A9AB5',
      border: '2px solid ' + (active ? '#0A0A14' : '#2A2A3D'),
      borderRadius: 999,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      boxShadow: active ? '2px 2px 0 #000' : 'none',
      transition: 'all 120ms',
      WebkitTapHighlightColor: 'transparent',
    }}>{children}</button>
  );
}

// ── Hard-shadow CTA button ──────────────────────────────────
function CTA({ children, onClick, color = C.primary, full = true, dark = '#0A0A14' }) {
  const [t, setT] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setT(true)}
      onPointerUp={() => setT(false)}
      onPointerLeave={() => setT(false)}
      style={{
        width: full ? '100%' : 'auto',
        height: 50, padding: '0 20px',
        background: color, color: dark,
        border: '2px solid #0A0A14',
        borderRadius: 12,
        boxShadow: t ? '1px 1px 0 #000' : '4px 4px 0 #000',
        transform: t ? 'translate(3px,3px)' : 'translate(0,0)',
        transition: 'all 80ms',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 16, fontWeight: 700,
        letterSpacing: 0.4, textTransform: 'uppercase',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, WebkitTapHighlightColor: 'transparent',
      }}
    >{children}</button>
  );
}

// ── Player avatar block (cell faceplate) ────────────────────
function PlayerFace({ team, name, pos, n, age }) {
  const teamData = FIGUS.TEAMS.find((tt) => tt.code === team) || FIGUS.TEAMS[0];
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: '2px solid #0A0A14',
      boxShadow: '4px 4px 0 #000',
      background: '#11111C',
      position: 'relative',
    }}>
      {/* striped placeholder portrait */}
      <div style={{
        height: 200, position: 'relative',
        background: `repeating-linear-gradient(135deg, ${teamData.c1}22 0 8px, ${teamData.c1}44 8px 16px), ${teamData.c1}`,
      }}>
        {/* corner number */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: '#0A0A14', color: C.lime,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 14, padding: '4px 8px', borderRadius: 4,
          border: `1.5px solid ${C.lime}`,
        }}>#{String(n).padStart(3, '0')}</div>
        {/* country chip */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: teamData.c2, color: teamData.c1,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: 12, padding: '4px 8px', borderRadius: 4,
          border: '2px solid #0A0A14',
        }}>{team}</div>
        {/* big silhouette letter */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bungee, sans-serif',
          fontSize: 110, color: '#0A0A1466',
          letterSpacing: 0.04,
        }}>{name.split(' ').slice(-1)[0].slice(0, 2).toUpperCase()}</div>
        {/* photo placeholder caption */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: '#0A0A1499', textTransform: 'uppercase', letterSpacing: 1,
        }}>// foto del jugador</div>
      </div>
      {/* name plate */}
      <div style={{ background: '#0A0A14', padding: '12px 14px', borderTop: '2px solid #0A0A14' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>{name}</div>
        <div style={{
          marginTop: 4, display: 'flex', gap: 10, alignItems: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted,
          textTransform: 'uppercase', letterSpacing: 0.6,
        }}>
          <span style={{ color: C.cyan }}>{teamData.name}</span>
          <span>·</span>
          <span>{pos}</span>
          {age && <><span>·</span><span>{age} años</span></>}
        </div>
      </div>
    </div>
  );
}

// ── Sticker detail modal ────────────────────────────────────
function StickerModal({ sticker, onClose, onUpdate }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(id);
  }, []);
  if (!sticker) return null;

  const close = () => {
    setShow(false);
    setTimeout(onClose, 220);
  };

  const setState = (next) => {
    if (next === 'repeated') {
      onUpdate({ state: 'repeated', count: Math.max(2, sticker.count || 2) });
    } else if (next === 'owned') {
      onUpdate({ state: 'owned', count: 0 });
    } else {
      onUpdate({ state: 'needed', count: 0 });
    }
  };

  const stepCount = (delta) => {
    const next = Math.max(2, (sticker.count || 2) + delta);
    onUpdate({ count: next });
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      pointerEvents: 'auto',
    }}>
      {/* backdrop */}
      <div onClick={close} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(5,5,12,0.72)',
        backdropFilter: 'blur(4px)',
        opacity: show ? 1 : 0, transition: 'opacity 200ms',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: C.bg,
        borderTop: `3px solid ${C.primary}`,
        borderRadius: '24px 24px 0 0',
        padding: '14px 18px 28px',
        maxHeight: '88%', overflow: 'auto',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
      }}>
        {/* drag handle */}
        <div style={{
          width: 44, height: 5, background: '#2A2A3D', borderRadius: 99,
          margin: '0 auto 12px',
        }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.muted,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>FIGURITA #{String(sticker.n).padStart(3, '0')}</div>
          <button onClick={close} style={{
            width: 36, height: 36, background: '#13131F',
            border: `2px solid ${C.border}`, borderRadius: 10,
            color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.close width={18} /></button>
        </div>

        <PlayerFace team={sticker.team} name={sticker.name} pos={sticker.pos} n={sticker.n} age={sticker.age} />

        {sticker.special && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'linear-gradient(135deg,#FFE066,#FFC700)',
            color: '#1A1100', border: '2px solid #0A0A14',
            borderRadius: 10, boxShadow: '3px 3px 0 #000',
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon.spark width={16} /> Edición especial · holográfica
          </div>
        )}

        {/* state selector */}
        <div style={{ marginTop: 18 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: C.muted, letterSpacing: 0.8, textTransform: 'uppercase',
            marginBottom: 8,
          }}>Estado</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { k: 'needed',   label: 'FALTA',   bg: '#13131F', color: '#9A9AB5', border: '#2A2A3D' },
              { k: 'owned',    label: 'TENGO',   bg: C.lime,    color: '#0A0A14', border: '#0A0A14' },
              { k: 'repeated', label: 'REPE',    bg: C.primary, color: '#FFFFFF', border: '#0A0A14' },
            ].map((opt) => {
              const on = sticker.state === opt.k;
              return (
                <button key={opt.k} onClick={() => setState(opt.k)} style={{
                  height: 50, borderRadius: 10,
                  background: on ? opt.bg : '#0F0F1A',
                  color: on ? opt.color : '#5C5C75',
                  border: `2px solid ${on ? opt.border : '#1F1F30'}`,
                  boxShadow: on ? '3px 3px 0 #000' : 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, fontSize: 12, letterSpacing: 0.8,
                }}>{opt.label}</button>
              );
            })}
          </div>
        </div>

        {sticker.state === 'repeated' && (
          <div style={{ marginTop: 18 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: C.muted, letterSpacing: 0.8, textTransform: 'uppercase',
              marginBottom: 8,
            }}>Cantidad de repetidas</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#13131F', border: `2px solid ${C.border}`,
              borderRadius: 12, padding: 6,
            }}>
              <button onClick={() => stepCount(-1)} style={{
                width: 44, height: 44, background: '#0A0A14',
                border: `2px solid ${C.border}`, borderRadius: 8,
                color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon.minus width={20} /></button>
              <div style={{
                flex: 1, textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28, fontWeight: 700, color: C.primary,
              }}>×{sticker.count}</div>
              <button onClick={() => stepCount(1)} style={{
                width: 44, height: 44, background: C.primary,
                border: '2px solid #0A0A14', borderRadius: 8,
                color: '#0A0A14', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '2px 2px 0 #000',
              }}><Icon.plus width={20} /></button>
            </div>
            <div style={{
              marginTop: 10, fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: C.cyan, letterSpacing: 0.5,
            }}>// {sticker.count - 1} disponibles para cambio</div>
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <CTA color={C.lime} onClick={close}>
            <Icon.check width={18} /> Guardar cambios
          </CTA>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  C, Card, StickerCell, MiniSticker, BottomNav, TopBar, Pill, CTA, PlayerFace, StickerModal,
});
