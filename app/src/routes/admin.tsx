import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { FieldError, PageShell } from "@/components/site/chrome";
import { adminOverview, adminReviewRx } from "@/lib/api/cannamed.functions";
import { formatCOP, orderStatusLabel, rxStatusLabel } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Panel farmacéutico | Cannamed" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Overview = { rx: Record<string, string>[]; consults: Record<string, string>[]; orders: Record<string, string>[] };

function Admin() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(k: string) {
    setError(null);
    const res = await adminOverview({ data: { key: k } });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setData({ rx: res.rx, consults: res.consults, orders: res.orders });
  }

  async function review(id: string, status: "aprobada" | "rechazada") {
    const note = status === "rechazada" ? (window.prompt("Motivo para el paciente") ?? "") : "";
    const res = await adminReviewRx({ data: { key, id, status, note } });
    if (!res.ok) setError(res.error);
    else await load(key);
  }

  if (!data) {
    return (
      <PageShell>
        <section className="admin">
          <h1 className="page-title">Panel farmacéutico</h1>
          <form
            className="form admin__login"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              void load(key);
            }}
          >
            <label className="field">
              <span>Clave de administración</span>
              <input type="password" value={key} onChange={(e) => setKey(e.target.value)} required />
            </label>
            <FieldError message={error} />
            <button type="submit" className="submit-btn">Entrar al panel</button>
          </form>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="admin">
        <h1 className="page-title">Panel farmacéutico</h1>
        <FieldError message={error} />
        <h2 className="admin__h">Fórmulas</h2>
        <div className="admin__table">
          {data.rx.length === 0 ? <p className="hint">Sin fórmulas todavía.</p> : null}
          {data.rx.map((r) => (
            <div key={r.id} className="admin__row">
              <div>
                <strong>{r.name}</strong> <span className="mono">CC {r.document}</span>
                <p>Dr(a). {r.doctor_name} · RM {r.doctor_reg} · {r.issued_at}</p>
                {r.notes ? <p className="hint">{r.notes}</p> : null}
              </div>
              <span className={`admin__state admin__state--${r.status}`}>{rxStatusLabel[r.status] ?? r.status}</span>
              <div className="admin__actions">
                <a className="inline-link" href={`/api/rx-file?id=${encodeURIComponent(r.id)}&key=${encodeURIComponent(key)}`} target="_blank" rel="noreferrer">Ver archivo</a>
                <button type="button" onClick={() => void review(r.id, "aprobada")}>Aprobar</button>
                <button type="button" onClick={() => void review(r.id, "rechazada")}>Rechazar</button>
              </div>
            </div>
          ))}
        </div>
        <h2 className="admin__h">Solicitudes de evaluación</h2>
        <div className="admin__table">
          {data.consults.map((c) => (
            <div key={c.id} className="admin__row">
              <div>
                <strong>{c.name}</strong> <span className="mono">{c.phone}</span>
                <p>{c.reason}</p>
              </div>
              <span className="mono">{c.preferred}</span>
              <span className="mono">{c.email}</span>
            </div>
          ))}
        </div>
        <h2 className="admin__h">Pedidos</h2>
        <div className="admin__table">
          {data.orders.map((o) => (
            <div key={o.id} className="admin__row">
              <div>
                <strong className="mono">{o.id}</strong>
                <p>{o.name} · {o.ship_city} · {o.method}</p>
              </div>
              <span>{orderStatusLabel[o.status] ?? o.status}</span>
              <span className="mono">{formatCOP(Number(o.total))}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
