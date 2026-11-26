export type Category = "aceite" | "capsula" | "flor" | "topico";

export type Product = {
  id: string;
  name: string;
  format: string;
  category: Category;
  rx: boolean;
  price: number;
  image: string;
  profile: string;
  summary: string;
  lot: string;
};

export const categoryLabels: Record<Category, string> = {
  aceite: "Aceites",
  capsula: "Cápsulas",
  flor: "Flor",
  topico: "Tópicos",
};

export const products: Product[] = [
  {
    id: "aceite-cbd-10",
    name: "Aceite CBD 10%",
    format: "Gotero ámbar · 30 ml",
    category: "aceite",
    rx: true,
    price: 189000,
    image: "/assets/products/oil.webp",
    profile: "CBD 100 mg/ml · THC < 0,2%",
    summary: "Espectro amplio en aceite de MCT. Cada gota entrega una concentración medida por lote.",
    lot: "Lote CM-A10-2611",
  },
  {
    id: "aceite-balanceado-11",
    name: "Aceite balanceado 1:1",
    format: "Dos goteros · 2 x 15 ml",
    category: "aceite",
    rx: true,
    price: 239000,
    image: "/assets/products/balanced.webp",
    profile: "CBD 25 mg/ml · THC 25 mg/ml",
    summary: "Proporción equilibrada de CBD y THC para tratamientos que tu médico ajusta por gotas.",
    lot: "Lote CM-B11-2611",
  },
  {
    id: "capsulas-cbd-25",
    name: "Cápsulas CBD 25 mg",
    format: "Frasco · 30 cápsulas blandas",
    category: "capsula",
    rx: true,
    price: 165000,
    image: "/assets/products/caps.webp",
    profile: "CBD 25 mg por cápsula · THC < 0,2%",
    summary: "Dosis fija sin medir gotas. Útil cuando la pauta médica pide precisión diaria.",
    lot: "Lote CM-C25-2610",
  },
  {
    id: "flor-estandarizada",
    name: "Flor medicinal estandarizada",
    format: "Frasco de vidrio · 10 g",
    category: "flor",
    rx: true,
    price: 210000,
    image: "/assets/products/flower.webp",
    profile: "THC 18% · CBD 1% · mirceno dominante",
    summary: "Flor seca de cultivo licenciado, para vaporización según indicación médica.",
    lot: "Lote CM-F18-2609",
  },
  {
    id: "crema-cbd-500",
    name: "Crema tópica CBD",
    format: "Tarro airless · 50 g",
    category: "topico",
    rx: false,
    price: 98000,
    image: "/assets/products/cream.webp",
    profile: "CBD 500 mg · sin THC",
    summary: "Textura ligera de rápida absorción para masaje localizado. Uso externo.",
    lot: "Lote CM-T50-2611",
  },
  {
    id: "balsamo-cbd",
    name: "Bálsamo CBD y manzanilla",
    format: "Lata · 30 g",
    category: "topico",
    rx: false,
    price: 72000,
    image: "/assets/products/balm.webp",
    profile: "CBD 300 mg · manzanilla · caléndula",
    summary: "Bálsamo denso con extractos botánicos para piel seca y zonas de tensión.",
    lot: "Lote CM-T30-2610",
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);

export const SHIPPING_FLAT = 12000;
export const FREE_SHIPPING_FROM = 250000;

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FLAT;
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatCOP = (n: number) => copFormatter.format(n);

export const rxStatusLabel: Record<string, string> = {
  en_revision: "En revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export const orderStatusLabel: Record<string, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  rechazado: "Pago rechazado",
  enviado: "Enviado",
};
