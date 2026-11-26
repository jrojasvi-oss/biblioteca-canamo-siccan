import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { useCart } from "./cart";

export function SiteNav({ overlay = false }: { overlay?: boolean }) {
  const lines = useCart();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return (
    <header className={overlay ? "site-nav site-nav--overlay" : "site-nav"}>
      <Link to="/" className="site-nav__brand" aria-label="Cannamed, inicio">
        <img src="/assets/brand/mark-cream.svg" alt="" width="34" height="34" />
        <span>Cannamed</span>
      </Link>
      <nav className="site-nav__links" aria-label="Principal">
        <Link to="/catalogo" activeProps={{ className: "is-active" }}>Catálogo</Link>
        <Link to="/certificacion" activeProps={{ className: "is-active" }}>Certificación médica</Link>
        <Link to="/cuenta" activeProps={{ className: "is-active" }}>Mi cuenta</Link>
      </nav>
      <div className="site-nav__right">
        <Link to="/carrito" className="site-nav__cart" aria-label={`Carrito, ${count} productos`}>
          <img src="/assets/icons/i8.png" alt="" width="26" height="26" />
          <span className="site-nav__count">{count}</span>
        </Link>
        <details className="site-nav__menu">
          <summary aria-label="Abrir menú">Menú</summary>
          <div className="site-nav__sheet">
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/certificacion">Certificación médica</Link>
            <Link to="/cuenta">Mi cuenta</Link>
            <Link to="/carrito">Carrito</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <img src="/assets/icons/i1.png" alt="" width="40" height="40" />
          <p>Cannamed. Cannabis medicinal con fórmula, trazabilidad y ciencia.</p>
        </div>
        <nav className="site-footer__links" aria-label="Pie de página">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/certificacion">Certificación médica</Link>
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/ingresar">Ingresar</Link>
        </nav>
      </div>
      <p className="site-footer__legal">
        Venta exclusiva a personas mayores de 18 años. Los aceites, cápsulas y flor con cannabinoides se dispensan
        únicamente con prescripción médica vigente, conforme a la Ley 1787 de 2016 y el Decreto 811 de 2021. Los productos
        tópicos son de uso externo. Esta información no reemplaza la consulta médica. Mantener fuera del alcance de niños.
      </p>
    </footer>
  );
}

export function AgeGate() {
  const [state, setState] = useState<"hidden" | "ask" | "denied">("hidden");
  useEffect(() => {
    let ok = false;
    try {
      ok = window.localStorage.getItem("cm_age") === "ok";
    } catch {
      ok = false;
    }
    if (!ok) setState("ask");
  }, []);
  if (state === "hidden") return null;
  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="age-gate__card">
        <img src="/assets/brand/mark.svg" alt="" width="64" height="64" />
        {state === "ask" ? (
          <>
            <h2 id="age-title">¿Eres mayor de 18 años?</h2>
            <p>Cannamed ofrece productos de cannabis medicinal regulados. Debes ser mayor de edad para continuar.</p>
            <div className="age-gate__actions">
              <button
                type="button"
                className="age-gate__yes"
                onClick={() => {
                  try {
                    window.localStorage.setItem("cm_age", "ok");
                  } catch {
                    // Sin almacenamiento: se pregunta en cada visita.
                  }
                  setState("hidden");
                }}
              >
                Sí, soy mayor
              </button>
              <button type="button" className="age-gate__no" onClick={() => setState("denied")}>
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title">Este sitio es solo para adultos</h2>
            <p>Si necesitas tratamiento para un menor, su médico tratante y su EPS te orientarán.</p>
          </>
        )}
      </div>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="page-main">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  );
}
