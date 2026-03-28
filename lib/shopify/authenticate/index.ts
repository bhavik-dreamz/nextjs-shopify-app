/**
 * Shopify-only traffic validation for Next.js (same ideas as Remix / React Router helpers, without those packages).
 *
 * | Surface | What enforces it | Use in code |
 * | -------- | ------------------ | ------------- |
 * | **Embedded web pages** (`/shopify/...`) | `middleware.ts` → `host` + `shop` query params; stripped forged headers | `app/shopify/layout.tsx` calls `requireShopifyEmbeddedSession()` |
 * | **OAuth** (`/api/shopify/auth*`) | Partner allow-list + `isValidShopParam` + `@shopify/shopify-api` callback | Route files under `app/api/shopify/auth/` |
 * | **Webhooks** (`POST`, HMAC body) | `authenticateShopifyWebhook` / `shopifyWebhookPOST` | `export const POST = shopifyWebhookPOST(...)` |
 * | **Embedded Admin API** (Bearer session JWT) | `shopifyAdminApi` for Route Handlers, or Server Actions + `decodeSessionToken` (see `app/shopify/app/actions.ts`) |
 *
 * Do not use Admin API helpers on OAuth or webhook routes; they expect different credentials.
 */

export { requireShopifyEmbeddedSession } from "@/lib/shopify/session-layout";
export {
  authenticateShopifyAdminRequest,
  shopifyAdminApi,
  type ShopifyAdminApiHandler,
  type ValidatedShopifyAdminSession,
} from "./admin-api";
export {
  authenticateShopifyWebhook,
  shopifyWebhookPOST,
  type ShopifyWebhookPOSTHandler,
  type ValidatedShopifyWebhook,
} from "./webhook";
