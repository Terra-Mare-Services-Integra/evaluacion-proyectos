import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const ERP_HOME_URL = "https://erp-home-nine.vercel.app";

const MODULOS = [
  {
    id: "ais_analyzer",
    nombre: "AIS Analyzer",
    descripcion: "Análisis de datos AIS por viaje. Etiquetado de servicios, análisis de base de zarpe y modelo financiero integrado para evaluación de incorporación de activos.",
    icono: "📡",
    status: "proximamente",
    url: null,
    color: "#235C96",
    tags: ["Análisis AIS", "Modelo Financiero", "TIR / VAN", "Base de zarpe"],
  },
  {
    id: "transporte_arena",
    nombre: "Transporte de Arena",
    descripcion: "Evaluación económica del corredor Zárate–SAE para transporte de arena de fractura. Modelo probabilístico Monte Carlo con análisis de fricciones operativas P10–P90.",
    icono: "⛏️",
    status: "activo",
    url: "https://transporte-arena.vercel.app",
    color: "#854F0B",
    tags: ["Monte Carlo", "P10–P90", "Logística fluvial", "Vaca Muerta"],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy: #213363; --blue: #235C96; --mid: #6381A7; --light: #A5B5CC;
  --bg: #EEF2F7; --surface: #FFFFFF; --border: #D6E0ED;
  --text: #213363; --muted: #6381A7;
  --sans: 'Montserrat', sans-serif; --mono: 'DM Mono', monospace;
}
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; }

/* LOGIN */
.login-wrap {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0f1d4a 0%, #1a2a5e 50%, #213363 100%);
  padding: 20px;
}
.login-card {
  background: #fff; border-radius: 16px; padding: 40px;
  width: 100%; max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}
.login-logo-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
.login-logo-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: linear-gradient(135deg, #ede9fe, #f5f3ff);
  border: 1.5px solid #c4b5fd;
  display: flex; align-items: center; justify-content: center; font-size: 26px;
}
.login-title { text-align: center; font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
.login-sub { text-align: center; font-size: 11px; color: var(--muted); margin-bottom: 28px; font-family: var(--mono); letter-spacing: .5px; }
.login-fg { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.login-fg label { font-size: 10px; color: var(--navy); letter-spacing: .5px; text-transform: uppercase; font-weight: 600; }
.login-fg input { border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; font-family: var(--sans); color: var(--text); outline: none; transition: border-color .15s; }
.login-fg input:focus { border-color: var(--blue); }
.login-btn { width: 100%; padding: 11px; background: var(--blue); color: #fff; border: none; border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; margin-top: 6px; letter-spacing: .5px; }
.login-btn:hover { background: var(--navy); }
.login-btn:disabled { opacity: .6; cursor: not-allowed; }
.login-error { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 14px; font-size: 12px; margin-bottom: 14px; }
.login-footer { text-align: center; font-size: 10px; color: var(--muted); margin-top: 24px; font-family: var(--mono); }
.login-back { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); font-family: var(--mono); margin-bottom: 20px; cursor: pointer; border: none; background: none; padding: 0; }
.login-back:hover { color: var(--navy); }

/* HEADER */
.header {
  background: var(--navy); padding: 0 40px; display: flex; align-items: center;
  justify-content: space-between; height: 64px;
  box-shadow: 0 2px 12px rgba(33,51,99,.2); position: sticky; top: 0; z-index: 10;
}
.header-brand { display: flex; align-items: center; gap: 12px; }
.header-icon { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; font-size: 18px; }
.header-main { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 1.5px; text-transform: uppercase; }
.header-sub  { font-size: 9px; color: rgba(255,255,255,.45); letter-spacing: .5px; font-family: var(--mono); margin-top: 1px; }
.header-right { display: flex; align-items: center; gap: 12px; }
.header-email { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,.4); }
.back-btn { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.7); font-family: var(--sans); font-size: 10px; font-weight: 600; padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .15s; letter-spacing: .3px; }
.back-btn:hover { background: rgba(255,255,255,.2); color: #fff; }
.logout-btn { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.5); font-family: var(--sans); font-size: 10px; font-weight: 600; padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .15s; letter-spacing: .3px; }
.logout-btn:hover { background: rgba(255,255,255,.15); color: #fff; }

/* HERO */
.hero {
  background: linear-gradient(135deg, var(--navy) 0%, #1a2a5e 50%, #0f1d4a 100%);
  padding: 52px 40px 48px; position: relative; overflow: hidden;
}
.hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; border-radius: 50%; background: rgba(35,92,150,.2); pointer-events: none; }
.hero-content { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; text-align: center; }
.hero-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; color: rgba(255,255,255,.4); text-transform: uppercase; margin-bottom: 10px; }
.hero-title { font-size: 32px; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 10px; }
.hero-title span { color: #7EB8E8; }
.hero-desc { font-size: 13px; color: rgba(255,255,255,.5); max-width: 480px; line-height: 1.7; margin: 0 auto; }

/* CONTENT */
.content { max-width: 1100px; margin: 0 auto; padding: 48px 40px 80px; }
.section-label { font-family: var(--mono); font-size: 9px; letter-spacing: 2.5px; color: var(--muted); text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* GRID */
.modulos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 48px; }

/* CARD — idéntica al portal de Parana */
.modulo-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  overflow: hidden; transition: all .2s;
  box-shadow: 0 2px 8px rgba(33,51,99,.06);
  display: flex; flex-direction: column;
}
.modulo-card.activo  { cursor: pointer; }
.modulo-card.activo:hover  { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(33,51,99,.14); border-color: var(--card-color); }
.modulo-card.proximamente  { opacity: .65; }
.modulo-card.sin-acceso    { opacity: .4; cursor: not-allowed; }

.card-banner { height: 6px; background: var(--card-color); flex-shrink: 0; }
.card-body   { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.card-top    { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.card-logo-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--card-color-light, #f0f4f8), var(--card-color-light2, #e6edf5));
  border: 1px solid var(--border);
}
.badge-activo { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .5px; text-transform: uppercase; }
.badge-prox   { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB; letter-spacing: .5px; text-transform: uppercase; }
.badge-sin    { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; letter-spacing: .5px; text-transform: uppercase; }

.card-nombre { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.card-desc   { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; flex: 1; }
.card-tags   { display: flex; gap: 5px; flex-wrap: wrap; }
.card-tag    { font-family: var(--mono); font-size: 9px; padding: 2px 7px; background: #F0F4F8; border: 1px solid var(--border); border-radius: 4px; color: var(--muted); }

.card-footer { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; flex-shrink: 0; }
.card-link          { font-size: 11px; font-weight: 600; letter-spacing: .3px; text-transform: uppercase; cursor: pointer; }
.card-link:hover    { text-decoration: underline; }
.card-link-disabled { font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: .3px; }

/* FOOTER */
.portal-footer { background: var(--navy); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
.footer-left  { font-size: 11px; color: rgba(255,255,255,.3); font-family: var(--mono); }
.footer-right { font-size: 10px; color: rgba(255,255,255,.2); font-family: var(--mono); }

/* LOADING */
.loading-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); }
.loading-text { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .header { padding: 0 20px; }
  .header-email { display: none; }
  .hero { padding: 36px 20px 32px; }
  .hero-title { font-size: 24px; }
  .content { padding: 32px 20px 60px; }
  .modulos-grid { grid-template-columns: 1fr; }
  .portal-footer { padding: 16px 20px; flex-direction: column; gap: 6px; text-align: center; }
}
@media (max-width: 480px) {
  .login-card { padding: 28px 24px; }
  .back-btn { display: none; }
}
`;

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email o contraseña incorrectos.");
    } catch {
      setError("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <button className="login-back" onClick={() => window.location.href = ERP_HOME_URL}>
          ← Volver al home
        </button>
        <div className="login-logo-wrap">
          <div className="login-logo-icon">📊</div>
        </div>
        <div className="login-title">Evaluación de Proyectos</div>
        <div className="login-sub">Grupo Marítimo · Herramientas de análisis</div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="login-fg">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required autoFocus />
          </div>
          <div className="login-fg">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="login-footer">© {new Date().getFullYear()} Grupo Marítimo · Acceso restringido</div>
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function ModuloCard({ mod }) {
  const isActivo = mod.status === "activo";
  const puedeAbrir = isActivo && mod.url;

  const handleClick = () => {
    if (puedeAbrir) window.open(mod.url, "_blank");
  };

  return (
    <div
      className={`modulo-card ${mod.status}`}
      style={{ "--card-color": mod.color }}
      onClick={handleClick}
    >
      <div className="card-banner" />
      <div className="card-body">
        <div className="card-top">
          <div className="card-logo-icon">{mod.icono}</div>
          {isActivo
            ? <span className="badge-activo">● Activo</span>
            : <span className="badge-prox">Próximamente</span>
          }
        </div>
        <div className="card-nombre">{mod.nombre}</div>
        <div className="card-desc">{mod.descripcion}</div>
        <div className="card-tags">
          {mod.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
        </div>
      </div>
      <div className="card-footer">
        {puedeAbrir
          ? <span className="card-link" style={{ color: mod.color }}>Abrir módulo →</span>
          : <span className="card-link-disabled">En desarrollo</span>
        }
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)" }}>
          {mod.tags.length} componentes
        </span>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loading) {
    return (
      <div className="loading-wrap">
        <style>{CSS}</style>
        <div className="loading-text">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <style>{CSS}</style>
        <LoginPage />
      </>
    );
  }

  const activos   = MODULOS.filter(m => m.status === "activo");
  const proximos  = MODULOS.filter(m => m.status === "proximamente");

  return (
    <>
      <style>{CSS}</style>

      <header className="header">
        <div className="header-brand">
          <div className="header-icon">📊</div>
          <div>
            <div className="header-main">Evaluación de Proyectos</div>
            <div className="header-sub">Grupo Marítimo ERP</div>
          </div>
        </div>
        <div className="header-right">
          <span className="header-email">{session.user.email}</span>
          <button className="back-btn" onClick={() => window.open(ERP_HOME_URL, "_self")}>← ERP Home</button>
          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Portal de análisis</div>
          <h1 className="hero-title">Evaluación de <span>Proyectos</span></h1>
          <p className="hero-desc">Herramientas de análisis estratégico para evaluación de inversiones y nuevos negocios del Grupo Marítimo.</p>
        </div>
      </div>

      <div className="content">
        {activos.length > 0 && (
          <>
            <div className="section-label">Módulos activos</div>
            <div className="modulos-grid">
              {activos.map(m => <ModuloCard key={m.id} mod={m} />)}
            </div>
          </>
        )}

        {proximos.length > 0 && (
          <>
            <div className="section-label">Próximamente</div>
            <div className="modulos-grid">
              {proximos.map(m => <ModuloCard key={m.id} mod={m} />)}
            </div>
          </>
        )}
      </div>

      <footer className="portal-footer">
        <div className="footer-left">Evaluación de Proyectos · Grupo Marítimo · Confidencial</div>
        <div className="footer-right">v1.0 — {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}
