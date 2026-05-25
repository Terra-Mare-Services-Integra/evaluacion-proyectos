import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const ERP_HOME_URL = "https://erp-home-nine.vercel.app";

const MODULOS = [
  {
    id: "arena",
    nombre: "Transporte de Arena",
    descripcion: "Modelo económico para transporte de arena en buques Handysize. Análisis de viajes, costos y rentabilidad.",
    icono: "⚓",
    status: "activo",
    url: "https://transporte-arena.vercel.app",
    color: "#B07D0A",
    tags: ["Handysize", "Costos", "Rentabilidad"],
  },
  {
    id: "ais",
    nombre: "AIS Analyzer",
    descripcion: "Análisis de trayectorias AIS, viajes y servicios prestados por embarcaciones.",
    icono: "📡",
    status: "activo",
    url: "https://ais-analyzer.vercel.app",
    color: "#0D7AA8",
    tags: ["AIS", "Embarcaciones", "Trayectorias"],
  },
  {
    id: "gdm",
    nombre: "Evaluación GdM",
    descripcion: "Modelo financiero para evaluación de adquisición y operación del Golondrina de Mar. P&L, Cashflow y Returns.",
    icono: "🚢",
    status: "activo",
    url: "https://evaluacion-gdm.vercel.app",
    color: "#213363",
    tags: ["FSV", "Financiero", "Returns"],
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

.header {
  background: var(--navy); padding: 0 40px; display: flex; align-items: center;
  justify-content: space-between; height: 64px;
  box-shadow: 0 2px 12px rgba(33,51,99,.2); position: sticky; top: 0; z-index: 10;
}
.header-brand { display: flex; align-items: center; gap: 12px; }
.header-main { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 1.5px; text-transform: uppercase; }
.header-sub { font-size: 9px; color: rgba(255,255,255,.45); letter-spacing: .5px; font-family: var(--mono); margin-top: 1px; }
.header-right { display: flex; align-items: center; gap: 12px; }
.header-email { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,.4); }
.back-btn {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.7); font-family: var(--sans); font-size: 10px; font-weight: 600;
  padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .15s; letter-spacing: .3px;
}
.back-btn:hover { background: rgba(255,255,255,.2); color: #fff; }

.hero {
  background: linear-gradient(135deg, var(--navy) 0%, #1a2a5e 50%, #0f1d4a 100%);
  padding: 52px 40px 48px; position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; top: -60px; right: -60px;
  width: 300px; height: 300px; border-radius: 50%;
  background: rgba(35,92,150,.2); pointer-events: none;
}
.hero::after {
  content: ''; position: absolute; bottom: -80px; left: 20%;
  width: 200px; height: 200px; border-radius: 50%;
  background: rgba(35,92,150,.1); pointer-events: none;
}
.hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; text-align: center; }
.hero-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; color: rgba(255,255,255,.4); text-transform: uppercase; margin-bottom: 10px; }
.hero-title { font-size: 32px; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 10px; letter-spacing: -.5px; }
.hero-title span { color: #7EB8E8; }
.hero-desc { font-size: 13px; color: rgba(255,255,255,.5); max-width: 520px; line-height: 1.7; margin: 0 auto; }
.hero-stats { display: flex; gap: 32px; margin-top: 28px; justify-content: center; }
.hero-stat { display: flex; flex-direction: column; gap: 2px; }
.hero-stat-n { font-family: var(--mono); font-size: 24px; font-weight: 700; color: #fff; }
.hero-stat-l { font-size: 10px; color: rgba(255,255,255,.4); letter-spacing: .5px; text-transform: uppercase; }

.content { max-width: 1200px; margin: 0 auto; padding: 36px 40px 60px; }
.section-label {
  font-family: var(--mono); font-size: 9px; letter-spacing: 2.5px; color: var(--muted);
  text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
}
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.modulos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 36px; }

.modulo-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 22px; transition: all .2s; position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 14px;
}
.modulo-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--card-color, var(--blue)); opacity: 0; transition: opacity .2s;
}
.modulo-card.activo { cursor: pointer; box-shadow: 0 2px 8px rgba(33,51,99,.06); }
.modulo-card.activo:hover { border-color: var(--card-color, var(--blue)); box-shadow: 0 4px 20px rgba(33,51,99,.12); transform: translateY(-2px); }
.modulo-card.activo:hover::before { opacity: 1; }
.modulo-card.proximamente { opacity: .75; }

.card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.card-icono { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.badge-activo { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .5px; text-transform: uppercase; }
.badge-prox { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB; letter-spacing: .5px; text-transform: uppercase; }

.card-body { flex: 1; }
.card-nombre { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px; line-height: 1.3; }
.card-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
.card-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 12px; }
.card-tag { font-family: var(--mono); font-size: 9px; padding: 2px 7px; background: #F0F4F8; border: 1px solid var(--border); border-radius: 4px; color: var(--muted); }
.card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); margin-top: auto; }
.card-link { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; letter-spacing: .3px; text-transform: uppercase; cursor: pointer; border: none; background: none; font-family: var(--sans); padding: 0; }
.card-link:hover { text-decoration: underline; }
.card-link-disabled { font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: .3px; }

.portal-footer { background: var(--navy); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
.footer-left { font-size: 11px; color: rgba(255,255,255,.3); font-family: var(--mono); letter-spacing: .5px; }
.footer-right { font-size: 10px; color: rgba(255,255,255,.2); font-family: var(--mono); }

.loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); }
.loading-text { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; }
`;

function ModuloCard({ mod }) {
  const isActivo = mod.status === "activo";
  const handleClick = () => { if (isActivo && mod.url) window.open(mod.url, "_self"); };

  return (
    <div className={`modulo-card ${mod.status}`} style={{ "--card-color": mod.color }} onClick={handleClick}>
      <div className="card-top">
        <div className="card-icono" style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30` }}>
          {mod.icono}
        </div>
        <div>
          {isActivo
            ? <span className="badge-activo">● Activo</span>
            : <span className="badge-prox">Próximamente</span>
          }
        </div>
      </div>
      <div className="card-body">
        <div className="card-nombre">{mod.nombre}</div>
        <div className="card-desc">{mod.descripcion}</div>
        <div className="card-tags">{mod.tags.map(t => <span key={t} className="card-tag">{t}</span>)}</div>
      </div>
      <div className="card-footer">
        {isActivo
          ? <span className="card-link" style={{ color: mod.color }}>Abrir módulo →</span>
          : <span className="card-link-disabled">En desarrollo</span>
        }
      </div>
    </div>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email);
      setLoading(false);
    });
  }, []);

  const activos = MODULOS.filter(m => m.status === "activo");
  const proximos = MODULOS.filter(m => m.status === "proximamente");

  if (loading) return <><style>{CSS}</style><div className="loading"><div className="loading-text">Cargando...</div></div></>;

  return (
    <>
      <style>{CSS}</style>

      <header className="header">
        <div className="header-brand">
          <div>
            <div className="header-main">Evaluación de Proyectos</div>
            <div className="header-sub">Grupo Marítimo · Herramientas de análisis</div>
          </div>
        </div>
        <div className="header-right">
          {userEmail && <span className="header-email">{userEmail}</span>}
          <button className="back-btn" onClick={() => window.open(ERP_HOME_URL, "_self")}>← Volver al ERP</button>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Herramientas de análisis</div>
          <h1 className="hero-title">Evaluación de <span>Proyectos</span></h1>
          <p className="hero-desc">Modelos financieros y análisis operativo para decisiones de inversión marítima.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">{MODULOS.length}</div>
              <div className="hero-stat-l">Módulos</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">{activos.length}</div>
              <div className="hero-stat-l">Activos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="section-label">Módulos activos</div>
        <div className="modulos-grid">
          {activos.map(mod => <ModuloCard key={mod.id} mod={mod} />)}
        </div>
        <div className="section-label" style={{ marginTop: 8 }}>Próximamente</div>
        <div className="modulos-grid">
          {proximos.map(mod => <ModuloCard key={mod.id} mod={mod} />)}
        </div>
      </div>

      <footer className="portal-footer">
        <div className="footer-left">Grupo Marítimo · Confidencial</div>
        <div className="footer-right">v1.0 — {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}