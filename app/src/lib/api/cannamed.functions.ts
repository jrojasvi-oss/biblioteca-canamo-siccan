import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  SESSION_COOKIE,
  SESSION_DAYS,
  adminKeyOk,
  ageFrom,
  db,
  hashPassword,
  randomId,
  sha256Hex,
  userFromToken,
  wompiConfig,
} from "../auth.server";
import { productById, shippingFor } from "../catalog";

type Fail = { ok: false; error: string };
const fail = (error: string): Fail => ({ ok: false, error });

async function currentUser() {
  return userFromToken(getCookie(SESSION_COOKIE));
}

async function startSession(userId: string) {
  const token = randomId(32);
  await db()
    .prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+${SESSION_DAYS} days'))`)
    .bind(token, userId)
    .run();
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export const registerUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(3).max(80),
      email: z.string().trim().toLowerCase().email(),
      phone: z.string().trim().min(7).max(20),
      document: z.string().trim().min(5).max(15),
      birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      password: z.string().min(8).max(100),
      consent: z.literal(true),
    }),
  )
  .handler(async ({ data }) => {
    if (ageFrom(data.birthdate) < 18) return fail("Debes ser mayor de 18 años para registrarte.");
    const exists = await db().prepare("SELECT id FROM users WHERE email = ?").bind(data.email).first();
    if (exists) return fail("Ya existe una cuenta con ese correo. Ingresa con tu contraseña.");
    const { hash, salt } = await hashPassword(data.password);
    const id = randomId(12);
    await db()
      .prepare(
        "INSERT INTO users (id, name, email, phone, document, birthdate, pass_hash, pass_salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(id, data.name, data.email, data.phone, data.document, data.birthdate, hash, salt)
      .run();
    await startSession(id);
    return { ok: true as const };
  });

export const loginUser = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const row = await db()
      .prepare("SELECT id, pass_hash, pass_salt FROM users WHERE email = ?")
      .bind(data.email)
      .first<{ id: string; pass_hash: string; pass_salt: string }>();
    if (!row) return fail("Correo o contraseña incorrectos.");
    const { hash } = await hashPassword(data.password, row.pass_salt);
    if (hash !== row.pass_hash) return fail("Correo o contraseña incorrectos.");
    await startSession(row.id);
    return { ok: true as const };
  });

export const logoutUser = createServerFn({ method: "POST" }).handler(async () => {
  const token = getCookie(SESSION_COOKIE);
  if (token) await db().prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  deleteCookie(SESSION_COOKIE, { path: "/" });
  return { ok: true as const };
});

export type RxRow = {
  id: string;
  doctor_name: string;
  doctor_reg: string;
  issued_at: string;
  status: string;
  review_note: string | null;
  created_at: string;
};

export type OrderRow = {
  id: string;
  items_json: string;
  subtotal: number;
  shipping: number;
  total: number;
  method: string;
  status: string;
  ship_name: string;
  ship_address: string;
  ship_city: string;
  ship_department: string;
  created_at: string;
};

export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  if (!user) return { user: null, rx: null, orders: [] as OrderRow[] };
  const rx = await db()
    .prepare(
      "SELECT id, doctor_name, doctor_reg, issued_at, status, review_note, created_at FROM prescriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    )
    .bind(user.id)
    .first<RxRow>();
  const orders = await db()
    .prepare(
      "SELECT id, items_json, subtotal, shipping, total, method, status, ship_name, ship_address, ship_city, ship_department, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
    )
    .bind(user.id)
    .all<OrderRow>();
  return {
    user: { name: user.name, email: user.email, phone: user.phone },
    rx: rx ?? null,
    orders: orders.results ?? [],
  };
});

export const requestConsult = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(3).max(80),
      email: z.string().trim().toLowerCase().email(),
      phone: z.string().trim().min(7).max(20),
      reason: z.string().trim().min(10).max(600),
      preferred: z.enum(["manana", "tarde", "noche"]),
    }),
  )
  .handler(async ({ data }) => {
    await db()
      .prepare("INSERT INTO consults (id, name, email, phone, reason, preferred) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(randomId(10), data.name, data.email, data.phone, data.reason, data.preferred)
      .run();
    return { ok: true as const };
  });

export const createOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      items: z
        .array(z.object({ id: z.string().max(60), qty: z.number().int().min(1).max(10) }))
        .min(1)
        .max(20),
      shipping: z.object({
        name: z.string().trim().min(3).max(80),
        phone: z.string().trim().min(7).max(20),
        address: z.string().trim().min(5).max(160),
        city: z.string().trim().min(2).max(60),
        department: z.string().trim().min(2).max(60),
      }),
      method: z.enum(["pse", "tarjeta", "nequi"]),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    if (!user) return fail("Ingresa a tu cuenta para pagar.");
    const lines: { id: string; name: string; qty: number; price: number }[] = [];
    let needsRx = false;
    for (const item of data.items) {
      const p = productById(item.id);
      if (!p) return fail("Uno de los productos ya no está disponible.");
      if (p.rx) needsRx = true;
      lines.push({ id: p.id, name: p.name, qty: item.qty, price: p.price });
    }
    if (needsRx) {
      const rx = await db()
        .prepare("SELECT status FROM prescriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1")
        .bind(user.id)
        .first<{ status: string }>();
      if (rx?.status !== "aprobada") {
        return fail("Tu pedido incluye productos con fórmula. Necesitas una fórmula aprobada antes de pagar.");
      }
    }
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const shipping = shippingFor(subtotal);
    const total = subtotal + shipping;
    const id = `CM${Date.now().toString(36).toUpperCase()}${randomId(2).toUpperCase()}`;
    const s = data.shipping;
    await db()
      .prepare(
        "INSERT INTO orders (id, user_id, items_json, subtotal, shipping, total, method, ship_name, ship_phone, ship_address, ship_city, ship_department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(id, user.id, JSON.stringify(lines), subtotal, shipping, total, data.method, s.name, s.phone, s.address, s.city, s.department)
      .run();

    const wompi = wompiConfig();
    let checkoutUrl: string | null = null;
    if (wompi) {
      const cents = total * 100;
      const signature = await sha256Hex(`${id}${cents}COP${wompi.integrity}`);
      const origin = new URL(getRequest().url).origin;
      const params = new URLSearchParams({
        "public-key": wompi.pub,
        currency: "COP",
        "amount-in-cents": String(cents),
        reference: id,
        "signature:integrity": signature,
        "redirect-url": `${origin}/pedido/${id}`,
        "customer-data:email": user.email,
        "customer-data:full-name": user.name,
      });
      checkoutUrl = `https://checkout.wompi.co/p/?${params.toString()}`;
    }
    return { ok: true as const, id, checkoutUrl };
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().max(40), tx: z.string().max(80).optional() }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    if (!user) return { order: null, signedIn: false };
    let order = await db()
      .prepare(
        "SELECT id, items_json, subtotal, shipping, total, method, status, ship_name, ship_address, ship_city, ship_department, created_at FROM orders WHERE id = ? AND user_id = ?",
      )
      .bind(data.id, user.id)
      .first<OrderRow>();
    if (!order) return { order: null, signedIn: true };
    const wompi = wompiConfig();
    if (data.tx && wompi && order.status === "pendiente_pago") {
      try {
        const res = await fetch(`${wompi.api}/transactions/${encodeURIComponent(data.tx)}`);
        if (res.ok) {
          const json = (await res.json()) as { data?: { status?: string; reference?: string } };
          const st = json.data?.status;
          if (json.data?.reference === order.id && st) {
            const next = st === "APPROVED" ? "pagado" : st === "PENDING" ? "pendiente_pago" : "rechazado";
            await db().prepare("UPDATE orders SET status = ?, wompi_tx = ? WHERE id = ?").bind(next, data.tx, order.id).run();
            order = { ...order, status: next };
          }
        }
      } catch {
        // La verificación se reintenta en la siguiente visita.
      }
    }
    return { order, signedIn: true, paymentsLive: Boolean(wompi) };
  });

export const adminOverview = createServerFn({ method: "POST" })
  .validator(z.object({ key: z.string().max(200) }))
  .handler(async ({ data }) => {
    if (!adminKeyOk(data.key)) return fail("Clave de administración inválida.");
    const rx = await db()
      .prepare(
        "SELECT p.id, p.doctor_name, p.doctor_reg, p.issued_at, p.notes, p.status, p.created_at, u.name, u.email, u.document FROM prescriptions p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 60",
      )
      .all<Record<string, string>>();
    const consults = await db()
      .prepare("SELECT id, name, email, phone, reason, preferred, status, created_at FROM consults ORDER BY created_at DESC LIMIT 60")
      .all<Record<string, string>>();
    const orders = await db()
      .prepare("SELECT o.id, o.total, o.status, o.method, o.ship_city, o.created_at, u.name FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 60")
      .all<Record<string, string>>();
    return { ok: true as const, rx: rx.results ?? [], consults: consults.results ?? [], orders: orders.results ?? [] };
  });

export const adminReviewRx = createServerFn({ method: "POST" })
  .validator(
    z.object({
      key: z.string().max(200),
      id: z.string().max(40),
      status: z.enum(["aprobada", "rechazada"]),
      note: z.string().max(300).optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!adminKeyOk(data.key)) return fail("Clave de administración inválida.");
    await db()
      .prepare("UPDATE prescriptions SET status = ?, review_note = ? WHERE id = ?")
      .bind(data.status, data.note ?? null, data.id)
      .run();
    return { ok: true as const };
  });
