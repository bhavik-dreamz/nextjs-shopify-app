import { redirect } from "next/navigation";

import { headers } from "next/headers";

import {
  SHOPIFY_FORWARD_HOST_HEADER,
  SHOPIFY_FORWARD_SHOP_HEADER,
} from "@/lib/shopify/guards";
import { shopifySessionStorage } from "@/lib/shopify";

/**
 * Embedded **web pages** under `/shopify/*`: offline session + OAuth redirect.
 * Pair with root `middleware.ts` (iframe `shop` + `host`). See `lib/shopify/authenticate/index.ts` for API vs webhook vs OAuth.
 */
export async function requireShopifyEmbeddedSession() {
  const h = await headers();
  const shop = h.get(SHOPIFY_FORWARD_SHOP_HEADER);
  const host = h.get(SHOPIFY_FORWARD_HOST_HEADER);

  if (!shop || !host) {
    redirect("/");
  }

  const sessions = await shopifySessionStorage.findSessionsByShop(shop);
  const offline = sessions.find((s: any) => !s.isOnline && s.accessToken);
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
