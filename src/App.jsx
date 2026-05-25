import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import FSVProyecto from "./components/FSVProyecto";
import AISAnalyzer from "./components/AISAnalyzer";

const ERP_HOME_URL = "https://erp-home-nine.vercel.app";

const NAV = [
  { id: "fsv", label: "FSV / Crew Boat", icon: "🚢", sub: ["Resumen", "P&L", "Cashflow", "Returns"] },
  { id: "ais", label: "AIS Analyzer", icon: "📡", sub: ["Dashboard", "Viajes", "Upload"] },
  { id: "gdm", label: "Evaluación GdM", icon: "⚓", sub: ["Assumptions", "P&L", "Cashflow", "Returns"] },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#213363;--blue:#235C96;--mid:#6381A7;--light:#A5B5CC;
  --bg:#EEF2F7;--surface:#FFFFFF;--border:#D6E0ED;
  --text:#213363;--muted:#6381A7;
  --green:#1E7A4A;--green-bg:#D1FAE5;--green-border:#A7F3D0;
  --sans:'Montserrat',sans-serif;--mono:'DM Mono',monospace;
}
body{font-family:var(--sans);background:var(--bg);color:var(--text);min-height:100vh}

/* LOGIN */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f1d4a,#1a2a5e,#213363);padding:20px}
.login-card{background:#fff;border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.login-icon{width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border:1.5px solid #93c5fd;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 14px}
.login-title{text-align:center;font-size:17px;font-weight:700;color:var(--navy);margin-bottom:2px}
.login-sub{text-align:center;font-size:11px;color:var(--muted);margin-bottom:24px;font-family:var(--mono);letter-spacing:.5px}
.login-fg{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.login-fg label{font-size:10px;color:var(--navy);letter-spacing:.5px;text-transform:uppercase;font-weight:600}
.login-fg input{border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:13px;font-family:var(--sans);outline:none;transition:border-color .15s}
.login-fg input:focus{border-color:var(--blue)}
.login-btn{width:100%;padding:11px;background:var(--blue);color:#fff;border:none;border-radius:8px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;margin-top:4px}
.login-btn:hover{background:var(--navy)}
.login-btn:disabled{opacity:.6;cursor:not-allowed}
.login-err{background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:12px;margin-bottom:12px}
.login-footer{text-align:center;font-size:10px;color:var(--muted);margin-top:18px;font-family:var(--mono)}
.login-back{font-size:11px;color:var(--muted);font-family:var(--mono);margin-bottom:18px;cursor:pointer;border:none;background:none;padding:0;display:block}
.login-back:hover{color:var(--navy)}

/* SHELL */
.shell{display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{width:228px;min-height:100vh;background:var(--navy);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;flex-shrink:0;overflow-y:auto}
.sb-brand{padding:18px 14px 14px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
.sb-brand-icon{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:8px}
.sb-brand-name{font-size:11px;font-weight:700;color:#fff;letter-spacing:.8px;text-transform:uppercase;line-height:1.3}
.sb-brand-sub{font-size:9px;color:rgba(255,255,255,.3);font-family:var(--mono);margin-top:2px}
.sb-nav{flex:1;padding:6px 8px}
.sb-section{font-family:var(--mono);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,.25);text-transform:uppercase;padding:14px 8px 5px;display:flex;align-items:center;gap:6px}
.sb-section-icon{font-size:12px}
.sb-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;transition:background .15s;margin-bottom:1px;border:none;background:none;width:100%;text-align:left;font-family:var(--sans)}
.sb-item:hover{background:rgba(255,255,255,.07)}
.sb-item.active{background:rgba(255,255,255,.13)}
.sb-item-dot{font-size:11px;width:16px;text-align:center;flex-shrink:0;color:rgba(255,255,255,.25)}
.sb-item.active .sb-item-dot{color:rgba(255,255,255,.6)}
.sb-item-label{font-size:12px;font-weight:500;color:rgba(255,255,255,.65);flex:1}
.sb-item.active .sb-item-label{color:#fff;font-weight:600}
.sb-item-badge{font-family:var(--mono);font-size:7px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:.4px;text-transform:uppercase}
.sb-item-badge.nuevo{background:rgba(30,122,74,.35);color:#6EE7B7;border:1px solid rgba(110,231,183,.2)}
.sb-item-badge.pronto{background:rgba(255,255,255,.06);color:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.08)}
.sb-footer{padding:12px 14px;border-top:1px solid rgba(255,255,255,.08);flex-shrink:0}
.sb-email{font-size:9px;color:rgba(255,255,255,.22);font-family:var(--mono);margin-bottom:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-home{width:100%;padding:6px;border-radius:6px;background:transparent;border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.3);font-family:var(--mono);font-size:9px;cursor:pointer;transition:all .15s;text-align:center;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.sb-home:hover{color:rgba(255,255,255,.55);border-color:rgba(255,255,255,.2)}
.sb-logout{width:100%;padding:7px;border-radius:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.42);font-family:var(--sans);font-size:10px;font-weight:600;cursor:pointer;transition:all .15s;letter-spacing:.3px}
.sb-logout:hover{background:rgba(255,255,255,.12);color:#fff}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.topbar{height:50px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;position:sticky;top:0;z-index:5;gap:10px;flex-shrink:0}
.topbar-title{font-size:14px;font-weight:700;color:var(--navy)}
.topbar-sep{color:var(--border);font-size:16px}
.topbar-sub{font-size:11px;color:var(--muted)}
.page-body{flex:1}

/* PROXIMAMENTE */
.pronto-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:60px 40px}
.pronto-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:48px 40px;text-align:center;max-width:420px;width:100%}
.pronto-icon{font-size:40px;margin-bottom:16px}
.pronto-title{font-size:18px;font-weight:700;color:var(--navy);margin-bottom:8px}
.pronto-desc{font-size:12px;color:var(--muted);line-height:1.7}
.pronto-badge{display:inline-block;margin-top:16px;font-family:var(--mono);font-size:9px;font-weight:700;padding:4px 12px;border-radius:4px;background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB;letter-spacing:.5px;text-transform:uppercase}

/* LOADING */
.loading-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy)}
.loading-text{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.4);letter-spacing:2px;text-transform:uppercase}

@media(max-width:768px){
  .sidebar{width:200px}
  .topbar{padding:0 16px}
}
@media(max-width:600px){
  .shell{flex-direction:column}
  .sidebar{width:100%;height:auto;min-height:auto;position:relative}
  .sb-nav{display:flex;flex-wrap:wrap;padding:6px}
  .sb-section{display:none}
  .sb-item{width:auto;flex:none;padding:6px 10px}
  .sb-footer{flex-direction:row;display:flex;gap:8px;align-items:center;padding:8px 12px}
  .sb-email,.sb-home{display:none}
  .sb-logout{width:auto;padding:5px 12px}
}
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd]     = useState("");
  const [err, setErr]     = useState("");
  const [busy, setBusy]   = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) setErr("Email o contraseña incorrectos.");
    setBusy(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <button className="login-back" onClick={() => window.location.href = ERP_HOME_URL}>← Volver al home</button>
        <div className="login-icon">📊</div>
        <div className="login-title">Evaluación de Proyectos</div>
        <div className="login-sub">Grupo Marítimo · Herramientas de análisis</div>
        {err && <div className="login-err">{err}</div>}
        <form onSubmit={submit}>
          <div className="login-fg"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required autoFocus /></div>
          <div className="login-fg"><label>Contraseña</label><input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••" required /></div>
          <button type="submit" className="login-btn" disabled={busy}>{busy ? "Ingresando..." : "Ingresar"}</button>
        </form>
        <div className="login-footer">© {new Date().getFullYear()} Grupo Marítimo · Acceso restringido</div>
      </div>
    </div>
  );
}

function ProntoPantalla({ modulo }) {
  return (
    <div className="pronto-wrap">
      <div className="pronto-card">
        <div className="pronto-icon">{modulo.icon}</div>
        <div className="pronto-title">{modulo.label}</div>
        <div className="pronto-desc">
          Este módulo está en desarrollo activo.<br />
          Pronto vas a poder acceder al modelo completo desde acá.
        </div>
        <span className="pronto-badge">En desarrollo</span>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modulo, setModulo]   = useState("fsv");
  const [tab, setTab]         = useState("Resumen");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const goModulo = (id, firstTab) => {
    setModulo(id);
    setTab(firstTab);
  };

  if (loading) return <><style>{CSS}</style><div className="loading-wrap"><div className="loading-text">Cargando...</div></div></>;
  if (!session) return <><style>{CSS}</style><LoginPage /></>;

  const nav = NAV.find(n => n.id === modulo);

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-brand">
            <div className="sb-brand-icon">📊</div>
            <div className="sb-brand-name">Evaluación<br/>de Proyectos</div>
            <div className="sb-brand-sub">Grupo Marítimo ERP</div>
          </div>

          <nav className="sb-nav">
            {NAV.map(n => (
              <div key={n.id}>
                <div className="sb-section">
                  <span className="sb-section-icon">{n.icon}</span>
                  {n.label}
                  {n.id === "gdm" && <span className="sb-item-badge nuevo">Nuevo</span>}
                </div>
                {n.sub.map(s => (
                  <button
                    key={s}
                    className={`sb-item ${modulo === n.id && tab === s ? "active" : ""}`}
                    onClick={() => { setModulo(n.id); setTab(s); }}
                  >
                    <span className="sb-item-dot">—</span>
                    <span className="sb-item-label">{s}</span>
                    {n.id === "gdm" && <span className="sb-item-badge pronto">Pronto</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="sb-footer">
            <div className="sb-email">{session.user.email}</div>
            <button className="sb-home" onClick={() => window.open(ERP_HOME_URL, "_self")}>← ERP Home</button>
            <button className="sb-logout" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <span className="topbar-title">{nav.label}</span>
            <span className="topbar-sep">·</span>
            <span className="topbar-sub">{tab}</span>
          </div>
          <div className="page-body">
            {modulo === "fsv" && <FSVProyecto tab={tab} setTab={setTab} />}
            {modulo === "ais" && <AISAnalyzer tab={tab} setTab={setTab} />}
            {modulo === "gdm" && <ProntoPantalla modulo={nav} />}
          </div>
        </main>
      </div>
    </>
  );
}