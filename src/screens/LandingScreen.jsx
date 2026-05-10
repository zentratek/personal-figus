import { Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/landing-isolated.css';

export default function LandingScreen() {
  const { user } = useAuth();

  // Redirect authenticated users to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  useEffect(() => {
    // Build phone grid: 30 cells, mix of states, plus simulated number labels
    const grid = document.getElementById('phgrid');
    const states = [
      'have','have','dup','have','miss',
      'have','have','have','miss','dup',
      'have','miss','have','have','have',
      'have','dup','have','miss','have',
      'have','have','miss','have','have',
      'miss','have','have','dup','have'
    ];

    if (grid) {
      states.forEach((s, i) => {
        const c = document.createElement('div');
        c.className = 'ph-cell ' + s;
        c.textContent = String(i+1).padStart(2,'0');
        grid.appendChild(c);
      });
    }

    // Update year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <div className="landing-page-isolated">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><span className="dot"></span> MUNDIAL 2026 · BETA ABIERTA</div>
              <h1>
                FIGUS
                <span className="accent">Tu álbum digital de figuritas Panini.</span>
              </h1>
              <p className="lead">
                Dejá el álbum físico en casa. Coordiná intercambios <strong>ganar-ganar</strong> con tus amigos del cole y completá la colección antes del primer partido.
              </p>
              <div className="cta-row">
                <Link to="/login" className="btn btn-lime">▶ Empezar Ahora</Link>
                <a href="#features" className="btn btn-outline">Ver Demo</a>
              </div>
              <div className="hero-meta">
                <span><span className="check">✓</span> Gratis</span>
                <span><span className="check">✓</span> Sin tarjeta</span>
                <span><span className="check">✓</span> Login con Google</span>
              </div>
            </div>

            <div className="phone-wrap">
              <div className="float-chip match">
                <span className="label">⚡ MATCH ENCONTRADO</span>
                Vos das #142 ↔ Recibís #87
              </div>
              <div className="float-chip notify">
                <span className="label">🔔 NUEVO INTERCAMBIO</span>
                Lucas te propone 3×3
              </div>
              <div className="phone">
                <div className="phone-screen">
                  <div className="ph-bar">
                    <span>9:41</span>
                    <div className="dots"><i></i><i></i><i></i></div>
                  </div>
                  <div className="ph-header">
                    <div className="small">// MI ÁLBUM</div>
                    <h3>ARGENTINA 🇦🇷</h3>
                    <div className="ph-progress"><span></span></div>
                    <div className="ph-progress-meta">
                      <span>20/30 figuritas</span>
                      <b>67%</b>
                    </div>
                  </div>
                  <div className="ph-grid" id="phgrid"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem" id="problem">
        <div className="container">
          <div className="section-title">EL PROBLEMA CON LOS ÁLBUMES TRADICIONALES</div>
          <h2 className="section-h">Coleccionar figuritas <span className="hi">no debería</span> ser caos.</h2>

          <div className="problem-grid">
            <div className="p-card">
              <div className="icon">📒</div>
              <div className="pain">PROBLEMA #01</div>
              <h3>Llevar el álbum al cole es un riesgo</h3>
              <p>Se rompe, se pierde, se moja. Y sin él no podés cambiar.</p>
              <div className="fix"><b>FIX →</b> Tu colección vive en la nube. Siempre con vos.</div>
            </div>
            <div className="p-card">
              <div className="icon">🤷</div>
              <div className="pain">PROBLEMA #02</div>
              <h3>Nadie sabe qué tiene quién</h3>
              <p>Pasás horas preguntando "¿tenés la 142?" en el grupo de WhatsApp.</p>
              <div className="fix"><b>FIX →</b> Ves el progreso de tu grupo en tiempo real.</div>
            </div>
            <div className="p-card">
              <div className="icon">🔄</div>
              <div className="pain">PROBLEMA #03</div>
              <h3>Los intercambios son injustos</h3>
              <p>Cambiás 3 que te faltan por 1 buena. Nunca cierra el loop.</p>
              <div className="fix"><b>FIX →</b> Matchmaker automático con trades ganar-ganar.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title">CARACTERÍSTICAS</div>
          <h2 className="section-h">Todo lo que tu álbum <span className="hi-lime">debería tener.</span></h2>

          <div className="features-grid">
            {/* big card: matchmaker */}
            <div className="f-card big c-lime">
              <div className="num">01 / MATCHMAKER</div>
              <div className="ic">⚡</div>
              <h3>Encuentra intercambios ganar-ganar, automáticamente.</h3>
              <p>El algoritmo cruza tus repetidas con las que faltan a tus amigos. Te muestra los mejores trades primero.</p>
              <div className="match-vis">
                <div className="match-row">
                  <span className="match-pill give">DAS · #142 #210</span>
                  <span className="match-arrow">⇄</span>
                  <span className="match-pill get">RECIBÍS · #87 #34</span>
                </div>
                <div className="match-row">
                  <span className="match-pill give">DAS · #008</span>
                  <span className="match-arrow">⇄</span>
                  <span className="match-pill get">RECIBÍS · #199</span>
                </div>
              </div>
            </div>

            {/* big card: album */}
            <div className="f-card big c-pink">
              <div className="num">02 / ÁLBUM DIGITAL</div>
              <div className="ic">📊</div>
              <h3>Grid interactivo con 3 estados: tengo, falta, repetida.</h3>
              <p>Agrupado por equipos del Mundial 2026. Contador de progreso en tiempo real, animaciones cuando completás un equipo.</p>
              <div className="match-vis" style={{display:'grid', gridTemplateColumns: 'repeat(8,1fr)', gap:'4px'}}>
                {/* mini grid */}
                <span style={{aspectRatio:'1', background:'rgba(198,255,62,.15)', border:'1px solid var(--lime)', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'rgba(198,255,62,.15)', border:'1px solid var(--lime)', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'#14141e', border:'1px solid #2a2a3e', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'rgba(255,45,142,.18)', border:'1px solid var(--primary)', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'rgba(198,255,62,.15)', border:'1px solid var(--lime)', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'#14141e', border:'1px solid #2a2a3e', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'rgba(198,255,62,.15)', border:'1px solid var(--lime)', borderRadius:'4px'}}></span>
                <span style={{aspectRatio:'1', background:'rgba(255,45,142,.18)', border:'1px solid var(--primary)', borderRadius:'4px'}}></span>
              </div>
            </div>

            {/* 4 small cards */}
            <div className="f-card small c-cyan">
              <div className="num">03</div>
              <div className="ic">👥</div>
              <h3>Grupos cerrados</h3>
              <p>Hasta 10 amigos por grupo. Código único formato XX-YYYY.</p>
            </div>

            <div className="f-card small c-pink">
              <div className="num">04</div>
              <div className="ic">📤</div>
              <h3>Propuestas</h3>
              <p>Enviá, aceptá, rechazá. Historial completo de cada cambio.</p>
            </div>

            <div className="f-card small c-lime">
              <div className="num">05</div>
              <div className="ic">📷</div>
              <h3>Escaneo OCR</h3>
              <p>Apuntá la cámara al sobre y registramos las 5 figuritas de una.</p>
              <span className="tag beta">🧪 EN BETA</span>
            </div>

            <div className="f-card small c-cyan">
              <div className="num">06</div>
              <div className="ic">🔐</div>
              <h3>Login con Google</h3>
              <p>Un click. Sincronización automática en la nube. Sin contraseñas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-title">CÓMO FUNCIONA</div>
          <h2 className="section-h">De cero al primer trade <span className="hi">en 4 pasos.</span></h2>

          <div className="steps">
            <div className="step">
              <span className="n">01</span>
              <h3>Iniciá sesión</h3>
              <p>Login con tu cuenta de Google. Listo en 5 segundos, sin formularios.</p>
              <span className="tag-mini">~5s</span>
            </div>
            <div className="step">
              <span className="n">02</span>
              <h3>Cargá tus figuritas</h3>
              <p>Manual con un toque, o escaneá el sobre con la cámara. Vos elegís.</p>
              <span className="tag-mini">manual / OCR</span>
            </div>
            <div className="step">
              <span className="n">03</span>
              <h3>Creá o uníte a un grupo</h3>
              <p>Compartí el código <span className="text-mono" style={{color:'var(--cyan)'}}>FG-2X9P</span> con tus amigos.</p>
              <span className="tag-mini">hasta 10 personas</span>
            </div>
            <div className="step">
              <span className="n">04</span>
              <h3>Intercambiá</h3>
              <p>El matchmaker te sugiere trades. Aceptás, te ven en el recreo, listo.</p>
              <span className="tag-mini">ganar-ganar</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" id="start">
        <div className="container">
          <div className="section-title" style={{justifyContent:'center', display:'flex'}}>EMPEZÁ HOY</div>
          <h2>
            Completá tu álbum
            <span className="br">antes del Mundial.</span>
          </h2>
          <p className="sub">El próximo recreo es tu próxima oportunidad. Crea tu grupo, invitá a tus amigos y dejá que el matchmaker haga el resto.</p>
          <Link to="/login" className="btn btn-lime" style={{fontSize: '18px', padding: '20px 40px'}}>▶ Empezar Gratis</Link>
          <div className="final-note">
            <span className="check">✓</span> No requiere tarjeta de crédito &nbsp;·&nbsp;
            <span className="check">✓</span> 100% gratis &nbsp;·&nbsp;
            <span className="check">✓</span> Listo en 30 segundos
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo-mark">FIGUS</a>
              <p>Tu álbum digital de figuritas Panini para el Mundial 2026. Hecho por fans, para fans.</p>
            </div>
            <div>
              <h4>Producto</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how">Cómo funciona</a></li>
                <li><a href="#">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Términos</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul>
                <li><a href="mailto:hola@figus.app">hola@figus.app</a></li>
                <li><a href="#">Twitter / X</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="disclaim">Proyecto educativo. No afiliado, asociado, autorizado, respaldado por, o de cualquier forma oficialmente conectado con Panini o FIFA.</span>
            <span>© <span id="year">2026</span> FIGUS<span className="blink">_</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
