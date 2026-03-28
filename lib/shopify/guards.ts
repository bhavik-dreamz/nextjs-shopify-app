/**
 * Shared validation for Shopify surfaces. Middleware and API routes use these
 * so /shopify UI is only reachable with Admin iframe params, not as a public web route.
 */

export const SHOPIFY_FORWARD_SHOP_HEADER = "x-next-shopify-shop";
export const SHOPIFY_FORWARD_HOST_HEADER = "x-next-shopify-host";

const SHOP_DOMAIN =
  /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;

export function isValidShopParam(shop: string | null | undefined): shop is string {
  if (!shop || typeof shop !== "string") return false;
  return SHOP_DOMAIN.test(shop.trim());
}

/**
 * `host` on embedded Admin loads is base64(admin.shopify.com/...).
 */
export function isValidEmbeddedHostParam(
  host: string | null | undefined,
): host is string {
  if (!host || typeof host !== "string") return false;
  try {
    let normalized = host.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    if (pad) normalized += "=".repeat(4 - pad);
    const decoded = atob(normalized);
    return decoded.includes("admin.shopify.com");
  } catch {
    return false;
  }
}
