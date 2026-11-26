import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PageShell } from "@/components/site/chrome";
import { getOrder } from "@/lib/api/cannamed.functions";
import { formatCOP, orderStatusLabel } from "@/lib/catalog";

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({ meta: [{ title: "Tu pedido | Cannamed" }] }),
  validateSearch: z.object({ id: z.string().optional() }),
  loaderDeps: ({ search }) => ({ tx: search.id }),
  loader: ({ params, deps }) => getOrder({ data: { id: params.id, tx: deps.tx } }),
  component: OrderPage,
});

function OrderPage() {
  const data = Route.useLoaderData();
  if (!data.order) {
    return (
      <PageShell>
        <section className="order order--missing">
          <h1 className="page-title">Pedido no disponible</h1>
          <p className="lead">{data.signedIn ? "No encontramos este pedido en tu cuenta." : "Ingresa para ver tu pedido."}</p>
          <Link to={data.signedIn ? "/cuenta" : "/ingresar"} className="inline-link">
            {data.signedIn ? "Ir a mi cuenta" : "Ingresar"}
          </Link>
        </section>
      </PageShell>
    );
  }
  const o = data.order;
  const lines = JSON.parse(o.items_json) as { name: string; qty: number; price: number }[];
  const paid = o.status === "pagado";
  return (
    <PageShell>
      <section className="order">
        <div className={`order__badge order__badge--${o.status}`}>
          <img src={paid ? "/assets/icons/i5.png" : "/assets/icons/i8.png"} alt="" width="56" height="56" />
          <div>
            <span className="mono">{o.id}</span>
            <h1 className="page-title">{paid ? "Pago confirmado" : (orderStatusLabel[o.status] ?? o.status)}</h1>
          </div>
        </div>
        {!paid && o.status === "pendiente_pago" ? (
          <p className="lead">
            {data.paymentsLive
              ? "Si ya completaste el pago, la confirmación puede tardar unos minutos. Recarga esta página para actualizar."
              : "Tu pedido quedó reservado. Te enviaremos el enlace de pago a tu correo y celular registrados."}
          </p>
        ) : null}
        <ul className="order__lines">
          {lines.map((l) => (
            <li key={l.name}>
              <span>{l.qty} x {l.name}</span>
              <span className="mono">{formatCOP(l.price * l.qty)}</span>
            </li>
          ))}
          <li><span>Envío</span><span className="mono">{o.shipping === 0 ? "Gratis" : formatCOP(o.shipping)}</span></li>
          <li className="order__total"><span>Total</span><span className="mono">{formatCOP(o.total)}</span></li>
        </ul>
        <p className="hint">
          Entrega a {o.ship_name}, {o.ship_address}, {o.ship_city} ({o.ship_department}).
        </p>
        <Link to="/cuenta" className="inline-link">Ver mis pedidos</Link>
      </section>
    </PageShell>
  );
}
