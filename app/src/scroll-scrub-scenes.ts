/**
 * Escenas del viaje: un solo plano continuo de 15 s cortado en cuatro tramos
 * consecutivos. Cada poster es el primer frame exacto de su clip codificado.
 */
import { createElement } from "react";

import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";
import { ClosingActions, HeroActions } from "@/components/site/ctas";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#8FA98A",
  background: "#0F2A1F",
  ink: "#FFFFFF",
  muted: "#B9C8B5",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "planta",
    label: "Planta",
    title: "Cannabis medicinal, con fórmula.",
    body: "Productos estandarizados y trazables, dispensados solo con prescripción médica válida en Colombia.",
    actions: createElement(HeroActions),
    clip: "/assets/world/scene-01.mp4",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    poster: "/assets/world/scene-01-poster.jpg",
    mobilePoster: "/assets/world/scene-01-mobile-poster.jpg",
    scroll: 1.4,
  },
  {
    id: "flor",
    label: "Flor",
    title: "Cada lote nace en cultivo licenciado.",
    body: "Genética registrada, cultivo bajo buenas prácticas y cosecha con trazabilidad de la semilla al frasco.",
    tags: ["Cultivo licenciado", "Trazabilidad por lote"],
    align: "right",
    clip: "/assets/world/scene-02.mp4",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    poster: "/assets/world/scene-02-poster.jpg",
    mobilePoster: "/assets/world/scene-02-mobile-poster.jpg",
    scroll: 1.2,
  },
  {
    id: "tricoma",
    label: "Tricoma",
    title: "La medicina vive en el tricoma.",
    body: "Ahí se concentran CBD, THC y terpenos. Los medimos lote por lote antes de que algo llegue a tus manos.",
    tags: ["Certificado de análisis", "Cromatografía"],
    clip: "/assets/world/scene-03.mp4",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    poster: "/assets/world/scene-03-poster.jpg",
    mobilePoster: "/assets/world/scene-03-mobile-poster.jpg",
    scroll: 1.2,
  },
  {
    id: "gota",
    label: "Gota",
    title: "Una dosis exacta en cada gota.",
    body: "Tu médico define la concentración. Nosotros garantizamos que el frasco diga la verdad.",
    actions: createElement(ClosingActions),
    align: "right",
    clip: "/assets/world/scene-04.mp4",
    mobileClip: "/assets/world/scene-04-mobile.mp4",
    poster: "/assets/world/scene-04-poster.jpg",
    mobilePoster: "/assets/world/scene-04-mobile-poster.jpg",
    scroll: 1.3,
  },
];
