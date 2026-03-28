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
    redirect(`/api/shopify/auth?shop=${encodeURIComponent(shop)}`);
  }

  return { shop, host };
}
