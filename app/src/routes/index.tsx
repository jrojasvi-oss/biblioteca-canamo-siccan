import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { AgeGate, SiteFooter, SiteNav } from "@/components/site/chrome";
import { CtaCatalog, CtaRx } from "@/components/site/ctas";
import { formatCOP, products } from "@/lib/catalog";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

const steps = [
  { icon: "/assets/icons/i5.png", title: "Crea tu cuenta", body: "Datos de paciente verificados y protegidos." },
  { icon: "/assets/icons/i4.png", title: "Valida tu fórmula", body: "Sube tu prescripción o pide una evaluación médica." },
  { icon: "/assets/icons/i2.png", title: "Elige tu tratamiento", body: "Concentraciones claras, lote y análisis visibles." },
  { icon: "/assets/icons/i8.png", title: "Recíbelo en casa", body: "Empaque discreto, sin marcas exteriores." },
];

const faqs = [
  {
    q: "¿Necesito fórmula médica para comprar?",
    a: "Sí para aceites, cápsulas y flor. Los tópicos de CBD sin THC se pueden comprar sin fórmula siendo mayor de edad.",
  },
  {
    q: "¿Qué debe tener mi fórmula?",
    a: "Tu nombre y documento, el producto o principio activo con su concentración, la dosis, la fecha, y la firma y registro del médico.",
  },
  {
    q: "¿Quién revisa mi fórmula?",
    a: "El equipo farmacéutico de Cannamed la valida antes de habilitar los productos con prescripción en tu cuenta.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "PSE, tarjeta débito o crédito y Nequi, a través de una pasarela de pagos certificada.",
  },
  {
    q: "¿Es legal en Colombia?",
    a: "El uso medicinal del cannabis está regulado por la Ley 1787 de 2016 y el Decreto 811 de 2021. Solo vendemos productos de uso médico a mayores de edad.",
  },
];

function Index() {
  const [open, setOpen] = useState(0);
  const featured = products[0];
  const rest = products.slice(1, 5);
  return (
    <div className="home">
      <AgeGate />
      <SiteNav overlay />
      <main>
        <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />

        <section className="process" aria-labelledby="process-title">
          <h2 id="process-title" className="section-title">Tu tratamiento en cuatro pasos</h2>
          <ol className="process__line">
            {steps.map((s, i) => (
              <li key={s.title} className="process__step">
                <div className="process__node">
                  <img src={s.icon} alt="" width="56" height="56" />
                  <span className="process__index">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rx-split" aria-labelledby="rx-title">
          <figure className="rx-split__media">
            <img src="/assets/plates/herbarium.webp" alt="Hoja de cannabis en papel de herbario junto a un estetoscopio y una placa de laboratorio" loading="lazy" />
          </figure>
          <div className="rx-split__copy">
            <h2 id="rx-title" className="section-title">Certificación médica sin filas</h2>
            <p className="lead">
              Sube tu fórmula desde el celular. Si aún no la tienes, solicita una evaluación con un médico y te llamamos.
            </p>
            <ul className="rx-split__paths">
              <li>
                <strong>Ya tengo fórmula</strong>
                <span>PDF o foto, validada por el equipo farmacéutico.</span>
              </li>
              <li>
                <strong>Necesito evaluación</strong>
                <span>Un médico revisa tu caso y define si el tratamiento es para ti.</span>
              </li>
            </ul>
            <CtaRx />
          </div>
        </section>

        <section className="catalog-teaser" aria-labelledby="catalog-title">
          <div className="catalog-teaser__head">
            <h2 id="catalog-title" className="section-title">Formulaciones con concentración declarada</h2>
            <CtaCatalog />
          </div>
          <div className="catalog-teaser__grid">
            <Link to="/catalogo" className="teaser-card teaser-card--big">
              <img src={featured.image} alt={featured.name} loading="lazy" />
              <div className="teaser-card__info">
                <h3>{featured.name}</h3>
                <p className="mono">{featured.profile}</p>
                <p className="mono teaser-card__price">{formatCOP(featured.price)}</p>
              </div>
            </Link>
            {rest.map((p) => (
              <Link to="/catalogo" key={p.id} className="teaser-card">
                <img src={p.image} alt={p.name} loading="lazy" />
                <div className="teaser-card__info">
                  <h3>{p.name}</h3>
                  <p className="mono teaser-card__price">{formatCOP(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="lab" aria-labelledby="lab-title">
          <img className="lab__bg" src="/assets/plates/lab.webp" alt="" loading="lazy" />
          <div className="lab__panel">
            <div className="lab__icons">
              <img src="/assets/icons/i6.png" alt="" width="48" height="48" />
              <img src="/assets/icons/i3.png" alt="" width="48" height="48" />
            </div>
            <h2 id="lab-title" className="section-title">Cada lote, analizado</h2>
            <p className="lead">
              Antes de salir a la venta, cada lote pasa por análisis de cannabinoides, metales pesados, residuos y microbiología.
            </p>
            <dl className="lab__specs">
              <div><dt>Cannabinoides</dt><dd>CBD, CBDA, THC, CBG, CBN</dd></div>
              <div><dt>Contaminantes</dt><dd>Metales, pesticidas, solventes</dd></div>
              <div><dt>Microbiología</dt><dd>Hongos, levaduras, patógenos</dd></div>
              <div><dt>Documento</dt><dd>Certificado de análisis por lote</dd></div>
            </dl>
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <h2 id="faq-title" className="section-title">Preguntas frecuentes</h2>
          <div className="faq__list">
            {faqs.map((f, i) => (
              <div key={f.q} className="faq__item" data-open={open === i}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq__plus" aria-hidden="true" />
                </button>
                {open === i ? <p>{f.a}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
