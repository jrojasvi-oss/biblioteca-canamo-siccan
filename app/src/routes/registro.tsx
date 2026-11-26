import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { FieldError, PageShell } from "@/components/site/chrome";
import { registerUser } from "@/lib/api/cannamed.functions";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Crear cuenta | Cannamed" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("password2")) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (fd.get("consent") !== "on") {
      setError("Debes aceptar el tratamiento de datos para continuar.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await registerUser({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          document: String(fd.get("document") ?? ""),
          birthdate: String(fd.get("birthdate") ?? ""),
          password: String(fd.get("password") ?? ""),
          consent: true,
        },
      });
      if (res.ok) await navigate({ to: "/certificacion" });
      else setError(res.error);
    } catch {
      setError("Revisa los datos: correo válido, documento de 5 a 15 caracteres y contraseña de al menos 8.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell>
      <section className="auth">
        <div className="auth__aside">
          <img src="/assets/brand/mark.svg" alt="" width="88" height="88" />
          <h1 className="page-title">Crear cuenta de paciente</h1>
          <p className="lead">Con tu cuenta validas tu fórmula, sigues tus pedidos y guardas tu historial de tratamiento.</p>
        </div>
        <form className="form auth__form" onSubmit={onSubmit}>
          <label className="field">
            <span>Nombre completo</span>
            <input name="name" required minLength={3} maxLength={80} autoComplete="name" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Cédula</span>
              <input name="document" required minLength={5} maxLength={15} inputMode="numeric" />
            </label>
            <label className="field">
              <span>Fecha de nacimiento</span>
              <input name="birthdate" type="date" required />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>Correo</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>Celular</span>
              <input name="phone" type="tel" required minLength={7} maxLength={20} autoComplete="tel" />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>Contraseña</span>
              <input name="password" type="password" required minLength={8} autoComplete="new-password" />
            </label>
            <label className="field">
              <span>Repite la contraseña</span>
              <input name="password2" type="password" required minLength={8} autoComplete="new-password" />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" name="consent" />
            <span>Autorizo el tratamiento de mis datos personales y de salud según la Ley 1581 de 2012 y confirmo que soy mayor de 18 años.</span>
          </label>
          <FieldError message={error} />
          <button type="submit" className="submit-btn" disabled={busy}>
            {busy ? "Creando..." : "Crear cuenta"}
          </button>
          <p className="form-alt">
            ¿Ya tienes cuenta? <Link to="/ingresar" className="inline-link">Ingresar</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
