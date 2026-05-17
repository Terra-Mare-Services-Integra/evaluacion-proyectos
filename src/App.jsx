import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// ─── MÓDULOS ──────────────────────────────────────────────────────────────────
const MODULOS = [
  {
    id: "ais",
    label: "AIS Analyzer",
    icon: "📡",
    descripcion: "Análisis de datos AIS por viaje. Etiquetado de servicios y modelo financiero integrado.",
    activo: false,
  },
  {
    id: "arena",
    label: "Transporte de Arena",
    icon: "⛏",
    descripcion: "Evaluación económica del corredor Zárate–SAE. Modelo Monte Carlo P10–P90.",
    activo: true,
    url: "https://terra-mare-portal-9w3x.vercel.app",
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy:    #213363;
  --blue:    #235C96;
  --mid:     #6381A7;
  --light:   #A5B5CC;
  --bg:      #EEF2F7;
  --surface: #FFFFFF;
  --border:  #D6E0ED;
  --text:    #213363;
  --muted:   #6381A7;
  --sans:    'Montserrat', sans-serif;
  --mono:    'DM Mono', monospace;
}
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; }

/* ── LOGIN ── */
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
.login-logo-wrap {
  display: flex; justify-content: center; margin-bottom: 20px;
}
.login-logo-icon {
  width: 56px; height: 56px; border-radius: 14px;
  background: linear-gradient(135deg, #ede9fe, #f5f3ff);
  border: 1.5px solid #c4b5fd;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
}
.login-title { text-align: center; font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
.login-sub   { text-align: center; font-size: 11px; color: var(--muted); margin-bottom: 28px; font-family: var(--mono); letter-spacing: .5px; }
.login-fg    { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.login-fg label { font-size: 10px; color: var(--navy); letter-spacing: .5px; text-transform: uppercase; font-weight: 600; }
.login-fg input {
  border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px;
  font-size: 13px; font-family: var(--sans); color: var(--text); outline: none; transition: border-color .15s;
}
.login-fg input:focus { border-color: var(--blue); }
.login-btn {
  width: 100%; padding: 11px; background: var(--blue); color: #fff; border: none;
  border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: background .15s; margin-top: 6px; letter-spacing: .5px;
}
.login-btn:hover    { background: var(--navy); }
.login-btn:disabled { opacity: .6; cursor: not-allowed; }
.login-error  { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 14px; font-size: 12px; margin-bottom: 14px; }
.login-footer { text-align: center; font-size: 10px; color: var(--muted); margin-top: 24px; font-family: var(--mono); }
.login-back   {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--muted); text-decoration: none;
  font-family: var(--mono); margin-bottom: 20px;
  cursor: pointer; border: none; background: none; padding: 0;
}
.login-back:hover { color: var(--navy); }

/* ── SHELL ── */
.shell { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: 220px; min-height: 100vh; background: var(--navy);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  flex-shrink: 0;
}
.sidebar-brand {
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sidebar-brand-icon {
  width: 36px; height: 36px; border-radius: 9px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; margin-bottom: 10px;
}
.sidebar-brand-name { font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; line-height: 1.3; }
.sidebar-brand-sub  { font-size: 9px; color: rgba(255,255,255,.35); font-family: var(--mono); margin-top: 2px; letter-spacing: .5px; }

.sidebar-section-label {
  font-family: var(--mono); font-size: 8px; letter-spacing: 2px;
  color: rgba(255,255,255,.3); text-transform: uppercase;
  padding: 16px 16px 6px;
}
.sidebar-nav { flex: 1; padding: 0 8px; }
.sidebar-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 8px; cursor: pointer;
  transition: background .15s; margin-bottom: 2px;
  border: none; background: none; width: 100%; text-align: left;
  font-family: var(--sans);
}
.sidebar-item:hover    { background: rgba(255,255,255,.07); }
.sidebar-item.active   { background: rgba(255,255,255,.12); }
.sidebar-item.disabled { opacity: .4; cursor: not-allowed; }
.sidebar-item-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
.sidebar-item-label {
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,.75);
  flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sidebar-item.active .sidebar-item-label { color: #fff; font-weight: 600; }
.sidebar-badge-dev {
  font-family: var(--mono); font-size: 7px; font-weight: 700;
  padding: 2px 5px; border-radius: 3px;
  background: rgba(99,129,167,.3); color: rgba(255,255,255,.5);
  letter-spacing: .3px; text-transform: uppercase;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,.08);
}
.sidebar-user-email { font-size: 9px; color: rgba(255,255,255,.3); font-family: var(--mono); margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sidebar-logout {
  width: 100%; padding: 7px 10px; border-radius: 7px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.5); font-family: var(--sans); font-size: 10px;
  font-weight: 600; cursor: pointer; transition: all .15s; letter-spacing: .3px;
  text-align: center;
}
.sidebar-logout:hover { background: rgba(255,255,255,.14); color: #fff; }
.sidebar-home {
  width: 100%; padding: 7px 10px; border-radius: 7px;
  background: transparent; border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.35); font-family: var(--mono); font-size: 9px;
  cursor: pointer; transition: all .15s; letter-spacing: .5px;
  text-align: center; margin-bottom: 6px; text-transform: uppercase;
}
.sidebar-home:hover { color: rgba(255,255,255,.6); border-color: rgba(255,255,255,.2); }

/* ── MAIN ── */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar {
  height: 52px; background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 28px;
  position: sticky; top: 0; z-index: 5;
  gap: 12px;
}
.topbar-title { font-size: 14px; font-weight: 700; color: var(--navy); }
.topbar-sep   { color: var(--border); font-size: 16px; }
.topbar-sub   { font-size: 12px; color: var(--muted); }
.topbar-right { margin-left: auto; }

.page-content { flex: 1; padding: 32px 28px; }

/* ── HOME (selector de proyectos) ── */
.home-eyebrow { font-family: var(--mono); font-size: 9px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 8px; }
.home-title   { font-size: 24px; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
.home-desc    { font-size: 13px; color: var(--muted); line-height: 1.7; max-width: 520px; margin-bottom: 36px; }

.proyectos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.proyecto-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  overflow: hidden; transition: all .2s;
  box-shadow: 0 2px 8px rgba(33,51,99,.06);
}
.proyecto-card.clickable { cursor: pointer; }
.proyecto-card.clickable:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(33,51,99,.14); border-color: var(--proj-color); }
.proyecto-card.disabled  { opacity: .55; }
.proyecto-card-banner    { height: 5px; background: var(--proj-color); }
.proyecto-card-body      { padding: 22px; }
.proyecto-card-top       { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.proyecto-card-icon      {
  width: 46px; height: 46px; border-radius: 11px;
  background: var(--proj-color); opacity: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
  filter: opacity(.15);
}
.proyecto-card-icon-wrap {
  width: 46px; height: 46px; border-radius: 11px;
  border: 1.5px solid var(--proj-color);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.badge-activo { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .5px; text-transform: uppercase; }
.badge-dev    { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; letter-spacing: .5px; text-transform: uppercase; }
.proyecto-card-nombre { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.proyecto-card-desc   { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }
.proyecto-card-footer {
  padding: 12px 22px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: #F8FAFC;
}
.card-link          { font-size: 11px; font-weight: 600; letter-spacing: .3px; text-transform: uppercase; }
.card-link-disabled { font-size: 11px; color: var(--muted); }

/* ── COMING SOON ── */
.coming-soon-wrap {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 400px; text-align: center;
}
.coming-soon-icon  { font-size: 48px; margin-bottom: 16px; opacity: .4; }
.coming-soon-title { font-size: 20px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.coming-soon-desc  { font-size: 13px; color: var(--muted); max-width: 380px; line-height: 1.7; }
.coming-soon-tag   { display: inline-block; margin-top: 16px; font-family: var(--mono); font-size: 9px; padding: 4px 12px; background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; }

/* ── LOADING ── */
.loading-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); }
.loading-inner { text-align: center; }
.loading-icon  { font-size: 40px; margin-bottom: 16px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.2} }
.loading-text  { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; }
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
        <button className="login-back" onClick={() => window.location.href = "https://erp-home-nine.vercel.app"}>
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

// ─── COMING SOON ──────────────────────────────────────────────────────────────
function ComingSoon({ modulo }) {
  return (
    <div className="coming-soon-wrap">
      <div className="coming-soon-icon">{modulo.icon}</div>
      <div className="coming-soon-title">{modulo.label}</div>
      <div className="coming-soon-desc">{modulo.descripcion}</div>
      <span className="coming-soon-tag">En desarrollo</span>
    </div>
  );
}

// ─── HOME (selector) ──────────────────────────────────────────────────────────
function HomePage({ onSelect }) {
  return (
    <div className="page-content">
      <div className="home-eyebrow">Portal de análisis</div>
      <div className="home-title">Evaluación de Proyectos</div>
      <div className="home-desc">
        Herramientas de análisis estratégico para evaluación de inversiones y nuevos negocios del Grupo Marítimo.
      </div>
      <div className="proyectos-grid">
        {MODULOS.map(m => (
          <div
            key={m.id}
            className={`proyecto-card ${m.activo ? "clickable" : "disabled"}`}
            style={{ "--proj-color": m.id === "ais" ? "#235C96" : "#854F0B" }}
            onClick={() => m.activo && onSelect(m.id)}
          >
            <div className="proyecto-card-banner" />
            <div className="proyecto-card-body">
              <div className="proyecto-card-top">
                <div className="proyecto-card-icon-wrap">{m.icon}</div>
                {m.activo
                  ? <span className="badge-activo">● Activo</span>
                  : <span className="badge-dev">En desarrollo</span>
                }
              </div>
              <div className="proyecto-card-nombre">{m.label}</div>
              <div className="proyecto-card-desc">{m.descripcion}</div>
            </div>
            <div className="proyecto-card-footer">
              {m.activo
                ? <span className="card-link" style={{ color: m.id === "ais" ? "#235C96" : "#854F0B" }}>Abrir herramienta →</span>
                : <span className="card-link-disabled">En desarrollo</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHELL (sidebar + topbar) ─────────────────────────────────────────────────
function Shell({ user, moduloActivo, setModuloActivo, onLogout, children }) {
  const modulo = MODULOS.find(m => m.id === moduloActivo);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">📊</div>
          <div className="sidebar-brand-name">Evaluación<br />de Proyectos</div>
          <div className="sidebar-brand-sub">Grupo Marítimo ERP</div>
        </div>

        <div className="sidebar-section-label">Herramientas</div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${moduloActivo === "home" ? "active" : ""}`}
            onClick={() => setModuloActivo("home")}
          >
            <span className="sidebar-item-icon">🏠</span>
            <span className="sidebar-item-label">Inicio</span>
          </button>

          {MODULOS.map(m => (
            <button
              key={m.id}
              className={`sidebar-item ${moduloActivo === m.id ? "active" : ""} ${!m.activo ? "disabled" : ""}`}
              onClick={() => m.activo && setModuloActivo(m.id)}
            >
              <span className="sidebar-item-icon">{m.icon}</span>
              <span className="sidebar-item-label">{m.label}</span>
              {!m.activo && <span className="sidebar-badge-dev">Dev</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-email">{user.email}</div>
          <button className="sidebar-home" onClick={() => window.open("https://erp-home-nine.vercel.app", "_blank")}>
            ← ERP Home
          </button>
          <button className="sidebar-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <span className="topbar-title">
            {moduloActivo === "home" ? "Inicio" : modulo?.label}
          </span>
          {moduloActivo !== "home" && modulo && (
            <>
              <span className="topbar-sep">·</span>
              <span className="topbar-sub">{modulo.descripcion}</span>
            </>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moduloActivo, setModuloActivo] = useState("home");

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <style>{CSS}</style>
        <div className="loading-inner">
          <div className="loading-icon">📊</div>
          <div className="loading-text">Cargando...</div>
        </div>
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

  // Contenido según módulo activo
  const renderContent = () => {
    if (moduloActivo === "home") return <HomePage onSelect={setModuloActivo} />;

    const modulo = MODULOS.find(m => m.id === moduloActivo);
    if (!modulo) return null;

    if (!modulo.activo) return <ComingSoon modulo={modulo} />;

    // AIS Analyzer — placeholder hasta que construyamos el módulo
    if (moduloActivo === "ais") {
      return (
        <div className="page-content">
          <ComingSoon modulo={modulo} />
        </div>
      );
    }

    // Transporte de Arena — redirige al portal existente
    if (moduloActivo === "arena") {
      window.open(modulo.url, "_blank");
      setModuloActivo("home");
      return null;
    }

    return null;
  };

  return (
    <>
      <style>{CSS}</style>
      <Shell
        user={session.user}
        moduloActivo={moduloActivo}
        setModuloActivo={setModuloActivo}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Shell>
    </>
  );
}
