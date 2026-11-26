# Cannamed · modelo de frontend

Prototipo de tienda web de cannabis medicinal para Colombia (Siembra Corp / SICCAN).
Esta rama es independiente de la biblioteca de cáñamo: solo contiene el sitio.

**Verlo en vivo:** https://cannamed-co.higgsfield.app

## Qué incluye

- Inicio animado con scroll (planta, flor, tricoma, gota).
- Catálogo con filtros y marca de "Requiere fórmula".
- Certificación médica: carga de fórmula (PDF/foto) o solicitud de evaluación.
- Registro e ingreso de pacientes (mayores de 18, Ley 1581).
- Carrito y pago (PSE, tarjeta, Nequi vía Wompi).
- Panel farmacéutico en `/admin` para aprobar fórmulas.

## Stack

React 19 + TanStack Start (SSR) sobre Cloudflare Workers, D1 (base de datos) y R2 (archivos).
El código del sitio está en `app/`. Archivos propios del proyecto:

- `app/src/routes/` páginas (inicio, catálogo, certificación, registro, cuenta, carrito, pedido, admin)
- `app/src/components/site/` navegación, footer, CTAs, carrito
- `app/src/lib/catalog.ts` productos y precios (datos de ejemplo)
- `app/src/lib/api/cannamed.functions.ts` y `app/src/lib/auth.server.ts` backend
- `app/migrations/0002_cannamed.sql` tablas
- `app/src/cannamed.css` estilos de marca
- `app/design-brief.md` brief de diseño

## Correr en local

```bash
cd app
bun install
bun run dev
```

## Pendiente antes de operar

- Llaves `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET` y `ADMIN_KEY` como secretos.
- Precios, lotes y concentraciones son de ejemplo.
- Licencias, registros Invima y revisión legal del texto.
