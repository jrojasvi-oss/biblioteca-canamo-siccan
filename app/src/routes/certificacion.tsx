import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { FieldError, PageShell } from "@/components/site/chrome";
import { getMe, requestConsult } from "@/lib/api/cannamed.functions";
import { rxStatusLabel } from "@/lib/catalog";

export const Route = createFileRoute("/certificacion")({
  head: () => ({
    meta: [
      { title: "Certificación médica | Cannamed" },
      { name: "description", content: "Sube tu fórmula de cannabis medicinal o solicita una evaluación médica." },
    ],
  }),
  loader: () => getMe(),
  component: Certification,
});

function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/rx", { method: "POST", body: new FormData(e.currentTarget) });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!body.ok) setError(body.error ?? "No pudimos recibir tu fórmula.");
      else {
        setDone(true);
        await router.invalidate();
      }
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }
  if (done) {
    return (
      <div className="form-success">
        <img src="/assets/icons/i5.png" alt="" width="48" height="48" />
        <h3>Fórmula recibida</h3>
        <p>La revisaremos y verás el resultado en tu cuenta.</p>
        <Link to="/cuenta" className="inline-link">Ir a mi cuenta</Link>
      </div>
    );
  }
  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="field">
        <span>Nombre del médico</span>
        <input name="doctor_name" required minLength={3} maxLength={80} autoComplete="off" />
      </label>
      <label className="field">
        <span>Registro médico</span>
        <input name="doctor_reg" required minLength={3} maxLength={30} autoComplete="off" />
      </label>
      <label className="field">
        <span>Fecha de expedición</span>
        <input name="issued_at" type="date" required />
      </label>
      <label className="field field--file">
        <span>Fórmula (PDF, JPG o PNG, máximo 8 MB)</span>
        <input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required />
      </label>
      <label className="field">
        <span>Notas para el farmacéutico (opcional)</span>
        <textarea name="notes" rows={3} maxLength={500} />
      </label>
      <FieldError message={error} />
      <button type="submit" className="submit-btn" disabled={busy}>
        {busy ? "Enviando..." : "Enviar fórmula"}
      </button>
    </form>
  );
}

function ConsultForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setBusy(true);
    try {
      const res = await requestConsult({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          reason: String(fd.get("reason") ?? ""),
          preferred: String(fd.get("preferred") ?? "manana") as "manana" | "tarde" | "noche",
        },
      });
      if (res.ok) setDone(true);
    } catch {
      setError("Revisa los datos: el motivo necesita al menos 10 caracteres y el correo debe ser válido.");
    } finally {
      setBusy(false);
    }
  }
  if (done) {
    return (
      <div className="form-success">
        <img src="/assets/icons/i5.png" alt="" width="48" height="48" />
        <h3>Solicitud enviada</h3>
        <p>Un profesional te contactará en la franja que elegiste.</p>
      </div>
    );
  }
  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="field">
        <span>Nombre completo</span>
        <input name="name" required minLength={3} maxLength={80} autoComplete="name" />
      </label>
      <label className="field">
        <span>Correo</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>Celular</span>
        <input name="phone" type="tel" required minLength={7} maxLength={20} autoComplete="tel" />
      </label>
      <label className="field">
        <span>Motivo de consulta</span>
        <textarea name="reason" rows={3} required minLength={10} maxLength={600} />
      </label>
      <label className="field">
        <span>Franja preferida</span>
        <select name="preferred" defaultValue="manana">
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </label>
      <FieldError message={error} />
      <button type="submit" className="submit-btn" disabled={busy}>
        {busy ? "Enviando..." : "Solicitar evaluación"}
      </button>
    </form>
  );
}

function Certification() {
  const me = Route.useLoaderData();
  const [tab, setTab] = useState<"rx" | "consult">("rx");
  return (
    <PageShell>
      <section className="cert">
        <div className="cert__intro">
          <h1 className="page-title">Certificación médica</h1>
          <p className="lead">Tu fórmula habilita aceites, cápsulas y flor. Sin ella, puedes pedir una evaluación médica.</p>
          <img className="cert__plate" src="/assets/plates/herbarium.webp" alt="" />
          <h2 className="cert__req-title">Una fórmula válida incluye</h2>
          <ul className="cert__req">
            <li>Tu nombre completo y número de documento</li>
            <li>Producto o principio activo con su concentración</li>
            <li>Dosis, frecuencia y duración del tratamiento</li>
            <li>Fecha de expedición menor a 6 meses</li>
            <li>Firma y registro profesional del médico</li>
          </ul>
        </div>
        <div className="cert__panel">
          {me.rx ? (
            <div className={`rx-status rx-status--${me.rx.status}`}>
              <span className="mono">Última fórmula</span>
              <strong>{rxStatusLabel[me.rx.status] ?? me.rx.status}</strong>
              {me.rx.review_note ? <p>{me.rx.review_note}</p> : null}
            </div>
          ) : null}
          <div className="tabs" role="tablist" aria-label="Tipo de trámite">
            <button type="button" role="tab" aria-selected={tab === "rx"} onClick={() => setTab("rx")}>
              Ya tengo fórmula
            </button>
            <button type="button" role="tab" aria-selected={tab === "consult"} onClick={() => setTab("consult")}>
              Necesito evaluación
            </button>
          </div>
          {tab === "rx" ? (
            me.user ? (
              <UploadForm />
            ) : (
              <div className="gate-note">
                <p>Para asociar la fórmula a tu historial necesitas una cuenta de paciente.</p>
                <div className="gate-note__links">
                  <Link to="/registro" className="inline-link">Crear cuenta</Link>
                  <Link to="/ingresar" className="inline-link">Ingresar</Link>
                </div>
              </div>
            )
          ) : (
            <ConsultForm />
          )}
        </div>
      </section>
    </PageShell>
  );
}
