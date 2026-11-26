import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { FieldError, PageShell } from "@/components/site/chrome";
import { loginUser } from "@/lib/api/cannamed.functions";

export const Route = createFileRoute("/ingresar")({
  head: () => ({ meta: [{ title: "Ingresar | Cannamed" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setBusy(true);
    try {
      const res = await loginUser({ data: { email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") } });
      if (res.ok) await navigate({ to: "/cuenta" });
      else setError(res.error);
    } catch {
      setError("Escribe un correo válido y tu contraseña.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell>
      <section className="auth auth--narrow">
        <div className="auth__aside">
          <h1 className="page-title">Ingresar</h1>
          <p className="lead">Accede a tu fórmula, tus pedidos y tu historial.</p>
        </div>
        <form className="form auth__form" onSubmit={onSubmit}>
          <label className="field">
            <span>Correo</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input name="password" type="password" required autoComplete="current-password" />
          </label>
          <FieldError message={error} />
          <button type="submit" className="submit-btn" disabled={busy}>
            {busy ? "Ingresando..." : "Ingresar"}
          </button>
          <p className="form-alt">
            ¿Aún no tienes cuenta? <Link to="/registro" className="inline-link">Crear cuenta</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
