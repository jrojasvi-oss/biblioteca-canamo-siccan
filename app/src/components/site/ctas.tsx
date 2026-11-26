import { Link } from "@tanstack/react-router";

export function CtaCatalog() {
  return (
    <Link to="/catalogo" className="cta-catalog">
      <span>Ver catálogo</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export function CtaRx() {
  return (
    <Link to="/certificacion" className="cta-rx">
      <img src="/assets/icons/i4.png" alt="" width="22" height="22" />
      <span>Validar fórmula</span>
    </Link>
  );
}

export function CtaRegister() {
  return (
    <Link to="/registro" className="cta-register">
      <img src="/assets/brand/mark.svg" alt="" width="30" height="30" />
      <span>Crear cuenta</span>
    </Link>
  );
}

export function HeroActions() {
  return (
    <div className="hero-actions">
      <CtaCatalog />
      <CtaRx />
    </div>
  );
}

export function ClosingActions() {
  return (
    <div className="hero-actions">
      <CtaRegister />
    </div>
  );
}
