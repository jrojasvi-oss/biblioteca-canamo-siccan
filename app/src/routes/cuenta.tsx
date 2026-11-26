import { Link, createFileRoute, useRouter } from "@tanstack/react-router";

import { PageShell } from "@/components/site/chrome";
import { CtaRegister } from "@/components/site/ctas";
import { getMe, logoutUser } from "@/lib/api/cannamed.functions";
import { formatCOP, orderStatusLabel, rxStatusLabel } from "@/lib/catalog";

export const Route = createFileRoute("/cuenta")({
  head: () => ({ meta: [{ title: "Mi cuenta | Cannamed" }] }),
  loader: () => getMe(),
  component: Account,
});

function Account() {
  const me = Route.useLoaderData();
  const router = useRouter();
  if (!me.user) {
    return (
      <PageShell>
        <section className="account account--empty">
          <h1 className="page-title">Mi cuenta</h1>
          <p className="lead">Ingresa para ver tu fórmula y tus pedidos, o crea tu cuenta de paciente.</p>
          <div className="account__ctas">
            <CtaRegister />
            <Link to="/ingresar" className="inline-link">Ingresar</Link>
          </div>
        </section>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <section className="account">
        <div className="account__head">
          <h1 className="page-title">Hola, {me.user.name.split(" ")[0]}</h1>
          <button
            type="button"
            className="logout-btn"
            onClick={async () => {
              await logoutUser();
              await router.invalidate();
            }}
          >
            Cerrar sesión
          </button>
        </div>
        <div className="account__grid">
          <div className={`rx-status rx-status--${me.rx?.status ?? "none"}`}>
            <span className="mono">Fórmula médica</span>
            <strong>{me.rx ? (rxStatusLabel[me.rx.status] ?? me.rx.status) : "Sin fórmula"}</strong>
            {me.rx ? (
              <p>
                Dr(a). {me.rx.doctor_name} · expedida el {me.rx.issued_at}
              </p>
            ) : (
              <p>Sube tu fórmula para habilitar aceites, cápsulas y flor.</p>
            )}
            {me.rx?.review_note ? <p>{me.rx.review_note}</p> : null}
            <Link to="/certificacion" className="inline-link">
              {me.rx ? "Actualizar fórmula" : "Validar fórmula"}
            </Link>
          </div>
          <div className="orders">
            <h2 className="orders__title">Pedidos</h2>
            {me.orders.length === 0 ? (
              <p className="orders__empty">
                Aún no tienes pedidos. <Link to="/catalogo" className="inline-link">Ver catálogo</Link>
              </p>
            ) : (
              <ul className="orders__list">
                {me.orders.map((o) => (
                  <li key={o.id}>
                    <Link to="/pedido/$id" params={{ id: o.id }} search={{}}>
                      <span className="mono">{o.id}</span>
                      <span>{orderStatusLabel[o.status] ?? o.status}</span>
                      <span className="mono">{formatCOP(o.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
