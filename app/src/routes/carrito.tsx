import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { cart, useCart } from "@/components/site/cart";
import { FieldError, PageShell } from "@/components/site/chrome";
import { CtaCatalog } from "@/components/site/ctas";
import { createOrder, getMe } from "@/lib/api/cannamed.functions";
import { FREE_SHIPPING_FROM, formatCOP, productById, shippingFor } from "@/lib/catalog";

export const Route = createFileRoute("/carrito")({
  head: () => ({ meta: [{ title: "Carrito y pago | Cannamed" }] }),
  loader: () => getMe(),
  component: CartPage,
});

const methods = [
  { id: "pse", label: "PSE", hint: "Débito desde tu banco" },
  { id: "tarjeta", label: "Tarjeta", hint: "Crédito o débito" },
  { id: "nequi", label: "Nequi", hint: "Desde tu celular" },
] as const;

function CartPage() {
  const me = Route.useLoaderData();
  const navigate = useNavigate();
  const lines = useCart();
  const [method, setMethod] = useState<"pse" | "tarjeta" | "nequi">("pse");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const items = lines
    .map((l) => ({ line: l, product: productById(l.id) }))
    .filter((x): x is { line: typeof x.line; product: NonNullable<typeof x.product> } => Boolean(x.product));
  const subtotal = items.reduce((s, x) => s + x.product.price * x.line.qty, 0);
  const shipping = shippingFor(subtotal);
  const needsRx = items.some((x) => x.product.rx);
  const rxOk = me.rx?.status === "aprobada";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setBusy(true);
    try {
      const res = await createOrder({
        data: {
          items: items.map((x) => ({ id: x.product.id, qty: x.line.qty })),
          shipping: {
            name: String(fd.get("name") ?? ""),
            phone: String(fd.get("phone") ?? ""),
            address: String(fd.get("address") ?? ""),
            city: String(fd.get("city") ?? ""),
            department: String(fd.get("department") ?? ""),
          },
          method,
        },
      });
      if (!res.ok) {
        setError(res.error);
        setBusy(false);
        return;
      }
      cart.clear();
      if (res.checkoutUrl) window.location.href = res.checkoutUrl;
      else await navigate({ to: "/pedido/$id", params: { id: res.id }, search: {} });
    } catch {
      setError("Revisa los datos de envío e intenta de nuevo.");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <PageShell>
        <section className="cart cart--empty">
          <img src="/assets/icons/i8.png" alt="" width="72" height="72" />
          <h1 className="page-title">Tu carrito está vacío</h1>
          <p className="lead">Explora las formulaciones y agrega lo que tu médico te indicó.</p>
          <CtaCatalog />
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="cart">
        <div className="cart__lines">
          <h1 className="page-title">Carrito</h1>
          <ul>
            {items.map(({ line, product }) => (
              <li key={product.id} className="cart-line">
                <img src={product.image} alt="" width="88" height="110" />
                <div className="cart-line__info">
                  <h2>{product.name}</h2>
                  <p className="mono">{product.profile}</p>
                  {product.rx ? <p className="rx-flag rx-flag--on">Requiere fórmula</p> : null}
                </div>
                <div className="stepper" aria-label={`Cantidad de ${product.name}`}>
                  <button type="button" onClick={() => cart.set(product.id, line.qty - 1)} aria-label="Quitar uno">−</button>
                  <span className="mono">{line.qty}</span>
                  <button type="button" onClick={() => cart.set(product.id, line.qty + 1)} aria-label="Agregar uno">+</button>
                </div>
                <span className="mono cart-line__price">{formatCOP(product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd className="mono">{formatCOP(subtotal)}</dd></div>
            <div><dt>Envío</dt><dd className="mono">{shipping === 0 ? "Gratis" : formatCOP(shipping)}</dd></div>
            <div className="totals__grand"><dt>Total</dt><dd className="mono">{formatCOP(subtotal + shipping)}</dd></div>
          </dl>
          {shipping > 0 ? <p className="hint">Envío gratis desde {formatCOP(FREE_SHIPPING_FROM)}.</p> : null}
        </div>

        <div className="cart__checkout">
          {!me.user ? (
            <div className="gate-note">
              <h2>Ingresa para pagar</h2>
              <p>Los pedidos se asocian a tu cuenta de paciente.</p>
              <div className="gate-note__links">
                <Link to="/registro" className="inline-link">Crear cuenta</Link>
                <Link to="/ingresar" className="inline-link">Ingresar</Link>
              </div>
            </div>
          ) : needsRx && !rxOk ? (
            <div className="gate-note">
              <h2>Falta tu fórmula aprobada</h2>
              <p>
                Tu carrito tiene productos con prescripción.{" "}
                {me.rx?.status === "en_revision" ? "Tu fórmula está en revisión." : "Sube tu fórmula para continuar."}
              </p>
              <Link to="/certificacion" className="inline-link">Validar fórmula</Link>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              <h2 className="checkout-title">Envío y pago</h2>
              <label className="field">
                <span>Quién recibe</span>
                <input name="name" required minLength={3} defaultValue={me.user.name} autoComplete="name" />
              </label>
              <label className="field">
                <span>Celular</span>
                <input name="phone" type="tel" required minLength={7} defaultValue={me.user.phone} autoComplete="tel" />
              </label>
              <label className="field">
                <span>Dirección</span>
                <input name="address" required minLength={5} autoComplete="street-address" />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Ciudad</span>
                  <input name="city" required minLength={2} autoComplete="address-level2" />
                </label>
                <label className="field">
                  <span>Departamento</span>
                  <input name="department" required minLength={2} autoComplete="address-level1" />
                </label>
              </div>
              <fieldset className="methods">
                <legend>Medio de pago</legend>
                {methods.map((m) => (
                  <label key={m.id} className="method" data-on={method === m.id}>
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                    <strong>{m.label}</strong>
                    <span>{m.hint}</span>
                  </label>
                ))}
              </fieldset>
              <FieldError message={error} />
              <button type="submit" className="pay-btn" disabled={busy} data-busy={busy}>
                <span>{busy ? "Procesando..." : "Pagar pedido"}</span>
                <span className="mono">{formatCOP(subtotal + shipping)}</span>
              </button>
              <p className="hint">Pago procesado por pasarela certificada. Cannamed no almacena datos de tarjetas.</p>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
