import { createFileRoute } from "@tanstack/react-router";

import { adminKeyOk, db, storage } from "@/lib/auth.server";

export const Route = createFileRoute("/api/rx-file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        const key = url.searchParams.get("key") ?? "";
        if (!adminKeyOk(key)) return new Response("No autorizado", { status: 401 });
        const row = await db().prepare("SELECT file_key, file_type FROM prescriptions WHERE id = ?").bind(id).first<{ file_key: string; file_type: string }>();
        if (!row) return new Response("No encontrado", { status: 404 });
        const obj = await storage().get(row.file_key);
        if (!obj) return new Response("No encontrado", { status: 404 });
        return new Response(obj.body as unknown as BodyInit, {
          headers: { "Content-Type": row.file_type, "Cache-Control": "private, no-store" },
        });
      },
    },
  },
});
