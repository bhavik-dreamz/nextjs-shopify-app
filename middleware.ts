/**
 * Embedded **page** routes only (`/shopify/*`): requires `shop` + `host` (Admin iframe).
 * Webhooks (HMAC) and OAuth use `/api/shopify/...` without this gate; validate those inside each route.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isValidEmbeddedHostParam,
  isValidShopParam,
  SHOPIFY_FORWARD_HOST_HEADER,
  SHOPIFY_FORWARD_SHOP_HEADER,
} from "@/lib/shopify/guards";

export function middleware(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get("shop");
  const host = request.nextUrl.searchParams.get("host");

  if (!isValidShopParam(shop) || !isValidEmbeddedHostParam(host)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(SHOPIFY_FORWARD_SHOP_HEADER);
  requestHeaders.delete(SHOPIFY_FORWARD_HOST_HEADER);
  requestHeaders.set(SHOPIFY_FORWARD_SHOP_HEADER, shop);
  requestHeaders.set(SHOPIFY_FORWARD_HOST_HEADER, host);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/shopify/:path*"],
};
