import { redirect } from "next/navigation";

import { headers } from "next/headers";

import {
  SHOPIFY_FORWARD_HOST_HEADER,
  SHOPIFY_FORWARD_SHOP_HEADER,
} from "@/lib/shopify/guards";
import { getShopify, shopifySessionStorage } from "@/lib/shopify";

/**
 * Embedded **web pages** under `/shopify/*`: offline session + OAuth redirect.
 * Pair with root `middleware.ts` (iframe `shop` + `host`). See `lib/shopify/authenticate/index.ts` for API vs webhook vs OAuth.
 */
export async function requireShopifyEmbeddedSession() {
  const h = await headers();
  const shop = h.get(SHOPIFY_FORWARD_SHOP_HEADER);
  const host = h.get(SHOPIFY_FORWARD_HOST_HEADER);
  const fetchDest = h.get("sec-fetch-dest");

  if (!shop || !host) {
    redirect("/");
  }

  // If opened directly in a browser tab, jump to Shopify Admin embedded view.
  if (fetchDest !== "iframe") {
    const embeddedAppUrl = getShopify().auth.buildEmbeddedAppUrl(host);
    redirect(embeddedAppUrl);
  }

  let offline: unknown;
  try {
    const sessions = await shopifySessionStorage.findSessionsByShop(shop);
    offline = sessions.find((s: any) => !s.isOnline && s.accessToken);
  } catch (err) {
    // DB unavailable (e.g. DATABASE_URL not set, migrations not run).
    // Treat as "no session" and start OAuth so the user isn't stuck on 500.
    console.error("[shopify] session lookup failed, redirecting to auth:", err);
  }
  if (!offline) {
    // Redirect via the exit-iframe route so OAuth starts at the top-level
    // frame, not inside the Shopify Admin iframe. This is required because
    // browsers block third-party cookies set inside iframes (SameSite), which
    // would cause `auth.begin()` state cookies to be dropped and make the
    // callback fail with "Could not find an OAuth cookie".
    redirect(`/api/shopify/auth/exit-iframe?shop=${encodeURIComponent(shop)}`);
  }

  return { shop, host };
}
