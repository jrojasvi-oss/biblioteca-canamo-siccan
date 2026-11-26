import { createFileRoute } from "@tanstack/react-router";

import { db, randomId, storage, tokenFromRequest, userFromToken } from "@/lib/auth.server";

const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const Route = createFileRoute("/api/rx")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await userFromToken(tokenFromRequest(request));
        if (!user) return json({ ok: false, error: "Ingresa a tu cuenta para enviar tu fórmula." }, 401);
        const form = await request.formData();
        const file = form.get("file");
        const doctorName = String(form.get("doctor_name") ?? "").trim();
        const doctorReg = String(form.get("doctor_reg") ?? "").trim();
        const issuedAt = String(form.get("issued_at") ?? "").trim();
        const notes = String(form.get("notes") ?? "").trim().slice(0, 500);
        if (!(file instanceof File) || file.size === 0) return json({ ok: false, error: "Adjunta tu fórmula en PDF o foto." }, 400);
        const ext = ALLOWED[file.type];
        if (!ext) return json({ ok: false, error: "Formato no permitido. Usa PDF, JPG, PNG o WEBP." }, 400);
        if (file.size > 8 * 1024 * 1024) return json({ ok: false, error: "El archivo supera 8 MB." }, 400);
        if (doctorName.length < 3 || doctorReg.length < 3) return json({ ok: false, error: "Completa nombre y registro del médico." }, 400);
        const issued = new Date(`${issuedAt}T00:00:00Z`);
        const now = Date.now();
        if (Number.isNaN(issued.getTime()) || issued.getTime() > now) return json({ ok: false, error: "Revisa la fecha de expedición." }, 400);
        if (now - issued.getTime() > 1000 * 60 * 60 * 24 * 180) return json({ ok: false, error: "La fórmula tiene más de 6 meses. Solicita una actualizada." }, 400);
        const id = randomId(12);
        const key = `rx/${user.id}/${id}.${ext}`;
        await storage().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
        await db()
          .prepare(
            "INSERT INTO prescriptions (id, user_id, doctor_name, doctor_reg, issued_at, notes, file_key, file_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          )
          .bind(id, user.id, doctorName, doctorReg, issuedAt, notes || null, key, file.type)
          .run();
        return json({ ok: true });
      },
    },
  },
});
