import { useSyncExternalStore } from "react";

export type CartLine = { id: string; qty: number };

const KEY = "cm_cart";
const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) lines = parsed.filter((l) => typeof l.id === "string" && l.qty > 0);
    }
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Almacenamiento no disponible: el carrito vive en memoria.
  }
  listeners.forEach((l) => l());
}

export const cart = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get() {
    load();
    return lines;
  },
  add(id: string, qty = 1) {
    load();
    const found = lines.find((l) => l.id === id);
    commit(
      found
        ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
        : [...lines, { id, qty }],
    );
  },
  set(id: string, qty: number) {
    load();
    commit(qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty: Math.min(10, qty) } : l)));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.get, () => EMPTY);
}
