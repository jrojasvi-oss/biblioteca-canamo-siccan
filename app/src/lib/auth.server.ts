import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

import { bindings } from "./bindings.server";

export function db(): D1Database {
  const { DB } = bindings();
  if (!DB) throw new Error("Base de datos no disponible");
  return DB;
}

export function storage(): R2Bucket {
  const { STORAGE } = bindings();
  if (!STORAGE) throw new Error("Almacenamiento no disponible");
  return STORAGE;
}

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomId(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return toHex(a.buffer);
}

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ?? randomId(16);
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: 100000 },
    key,
    256,
  );
  return { hash: toHex(bits), salt };
}

export async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

export const SESSION_COOKIE = "cm_session";
export const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
};

export async function userFromToken(token: string | null | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const row = await db()
    .prepare(
      "SELECT u.id, u.name, u.email, u.phone, u.document FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > datetime('now')",
    )
    .bind(token)
    .first<SessionUser>();
  return row ?? null;
}

export function tokenFromRequest(request: Request) {
  const raw = request.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === SESSION_COOKIE) return decodeURIComponent(v.join("="));
  }
  return null;
}

function envRecord() {
  return bindings() as unknown as Record<string, unknown>;
}

export function wompiConfig() {
  const env = envRecord();
  const pub = typeof env.WOMPI_PUBLIC_KEY === "string" ? env.WOMPI_PUBLIC_KEY : "";
  const integrity = typeof env.WOMPI_INTEGRITY_SECRET === "string" ? env.WOMPI_INTEGRITY_SECRET : "";
  if (!pub || !integrity) return null;
  const sandbox = pub.startsWith("pub_test");
  return {
    pub,
    integrity,
    api: sandbox ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1",
  };
}

export function adminKeyOk(key: string) {
  const k = envRecord().ADMIN_KEY;
  return typeof k === "string" && k.length >= 8 && key === k;
}

export function ageFrom(birthdate: string) {
  const b = new Date(`${birthdate}T00:00:00Z`);
  if (Number.isNaN(b.getTime())) return -1;
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age -= 1;
  return age;
}
