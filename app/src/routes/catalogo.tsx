import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { cart } from "@/components/site/cart";
import { PageShell } from "@/components/site/chrome";
import { categoryLabels, formatCOP, products, type Category } from "@/lib/catalog";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo | Cannamed" },
      { name: "description", content: "Aceites, cápsulas, flor y tópicos de cannabis medicinal con concentración declarada." },
    ],
  }),
  component: Catalog,
});

const filters: (Category | "todos")[] = ["todos", "aceite", "capsula", "flor", "topico"];

function AddButton({ id }: { id: string }) {
  const [bump, setBump] = useState(0);
  return (
    <button
      type="button"
      className="add-btn"
      data-bump={bump % 2}
      onClick={() => {
        cart.add(id, 1);
        setBump((b) => b + 1);
      }}
    >
      <img src="/assets/icons/i7.png" alt="" width="22" height="22" />
      <span>{bump > 0 ? "Agregado" : "Agregar"}</span>
    </button>
  );
}

function Catalog() {
  const [filter, setFilter] = useState<Category | "todos">("todos");
  const list = filter === "todos" ? products : products.filter((p) => p.category === filter);
  return (
    <PageShell>
      <section className="catalog">
        <div className="catalog__head">
          <h1 className="page-title">Catálogo</h1>
          <p className="lead">
            Los productos marcados con fórmula se habilitan cuando tu prescripción está aprobada.{" "}
            <Link to="/certificacion" className="inline-link">Validar fórmula</Link>
          </p>
          <div className="filters" role="tablist" aria-label="Filtrar por tipo">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className="filter-chip"
                onClick={() => setFilter(f)}
              >
                {f === "todos" ? "Todos" : categoryLabels[f]}
              </button>
            ))}
          </div>
        </div>
        <ul className="catalog__grid">
          {list.map((p) => (
            <li key={p.id} className="product-card">
              <div className="product-card__media">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="product-card__body">
                <p className={p.rx ? "rx-flag rx-flag--on" : "rx-flag"}>{p.rx ? "Requiere fórmula" : "Venta libre a mayores de 18"}</p>
                <h2>{p.name}</h2>
                <p className="product-card__format">{p.format}</p>
                <p className="mono product-card__profile">{p.profile}</p>
                <p className="product-card__summary">{p.summary}</p>
                <p className="mono product-card__lot">{p.lot}</p>
                <div className="product-card__foot">
                  <span className="mono product-card__price">{formatCOP(p.price)}</span>
                  <AddButton id={p.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
