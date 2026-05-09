// Figus app — main entry
const { useState: aUseState, useMemo: aUseMemo, useEffect: aUseEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#FF2D8E",
  "density": 5
}/*EDITMODE-END*/;

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = aUseState('home');
  const [stickers, setStickers] = aUseState(() => FIGUS.stickers.map((s) => ({ ...s })));
  const [activeMatchId, setActiveMatchId] = aUseState(FIGUS.matches[0].id);
  const [openSticker, setOpenSticker] = aUseState(null);
  const [filter, setFilter] = aUseState('all');

  aUseEffect(() => {
    document.documentElement.style.setProperty('--primary', t.primary);
  }, [t.primary]);

  const counts = aUseMemo(() => {
    let owned = 0, repe = 0, falta = 0, special = 0;
    for (const s of stickers) {
      if (s.state === 'owned') owned++;
      else if (s.state === 'repeated') { owned++; repe += (s.count || 2) - 1; }
      else { falta++; if (s.special) special++; }
    }
    const total = stickers.length;
    return { owned, repe, falta, special, total, pct: Math.round((owned / total) * 100) };
  }, [stickers]);

  const updateSticker = (n, patch) => {
    setStickers((prev) => prev.map((s) => (s.n === n ? { ...s, ...patch } : s)));
  };

  const goto = (s) => {
    setScreen(s);
    // scroll content to top on screen change
    setTimeout(() => {
      const scrollEl = document.querySelector('[data-figus-scroll]');
      if (scrollEl) scrollEl.scrollTop = 0;
    }, 0);
  };

  const activeSticker = openSticker != null ? stickers.find((s) => s.n === openSticker) : null;

  let body;
  if (screen === 'home') {
    body = <HomeScreen counts={counts} stickers={stickers} goto={goto} density={t.density} />;
  } else if (screen === 'album') {
    body = <AlbumScreen
      stickers={stickers} density={t.density} goto={goto}
      openSticker={openSticker} setOpenSticker={setOpenSticker}
      filter={filter} setFilter={setFilter}
      counts={counts}
    />;
  } else if (screen === 'matches') {
    body = <MatchesScreen goto={goto} setActiveMatchId={setActiveMatchId} />;
  } else if (screen === 'matchDetail') {
    body = <MatchDetailScreen goto={goto} activeMatchId={activeMatchId} stickers={stickers} />;
  }

  // Map screen → bottom-nav tab
  const navTab = screen === 'matchDetail' ? 'matches' : screen;

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <IOSDevice dark={true} width={402} height={874}>
          <div className="figus-app" data-figus-scroll style={{
            display: 'flex', flexDirection: 'column', minHeight: '100%',
            position: 'relative',
          }}>
            <div style={{ flex: 1 }}>{body}</div>
            <BottomNav active={navTab} onChange={(id) => goto(id)} />
            {activeSticker && (
              <StickerModal
                sticker={activeSticker}
                onClose={() => setOpenSticker(null)}
                onUpdate={(patch) => updateSticker(activeSticker.n, patch)}
              />
            )}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Figus tweaks">
        <TweakSection label="Tema">
          <TweakColor
            label="Color primario"
            value={t.primary}
            options={['#FF2D8E', '#00F0FF', '#C6FF3E', '#FFC700', '#9B5BFF']}
            onChange={(v) => setTweak('primary', v)}
          />
        </TweakSection>
        <TweakSection label="Álbum">
          <TweakRadio
            label="Densidad del grid"
            value={t.density}
            options={[
              { value: 4, label: '4' },
              { value: 5, label: '5' },
              { value: 6, label: '6' },
            ]}
            onChange={(v) => setTweak('density', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
