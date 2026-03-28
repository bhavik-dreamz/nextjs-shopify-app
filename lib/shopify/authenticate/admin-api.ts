import type { JwtPayload } from "@shopify/shopify-api";

import { getShopify } from "@/lib/shopify";

export type ValidatedShopifyAdminSession = {
  payload: JwtPayload;
  shop: string;
};

export type ShopifyAdminApiHandler = (
  session: ValidatedShopifyAdminSession,
  request: Request,
) => Response | Promise<Response>;

/**
 * Validates the App Bridge session token (`Authorization: Bearer <jwt>`).
 * On failure returns a `Response` (401); on success returns `{ payload, shop }`.
 *
 * Use for `/api/shopify/...` handlers called from the embedded app (fetch with `authenticatedFetch` / session token).
 * Does not apply to OAuth or webhook routes.
 */
export async function authenticateShopifyAdminRequest(
  request: Request,
): Promise<Response | ValidatedShopifyAdminSession> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new Response("Missing Authorization bearer token", { status: 401 });
  }

  const token = auth.slice("Bearer ".length).trim();
  if (!token) {
    return new Response("Missing session token", { status: 401 });
  }

  try {
    const shopify = getShopify();
    const payload = await shopify.session.decodeSessionToken(token, {
      checkAudience: true,
    });
    const shop = new URL(payload.dest).hostname;

    return { payload, shop };
  } catch {
    return new Response("Invalid session token", { status: 401 });
  }
}

/**
 * Wraps a route handler (GET, POST, PUT, DELETE, …): assign the result to `export const GET = shopifyAdminApi(...)`, etc.
 * Invalid or missing session tokens become the route response; your function only runs after validation.
 */
export function shopifyAdminApi(handler: ShopifyAdminApiHandler) {
  return async function route(request: Request) {
    const outcome = await authenticateShopifyAdminRequest(request);
    if (outcome instanceof Response) {
      return outcome;
    }
    return handler(outcome, request);
  };
}
