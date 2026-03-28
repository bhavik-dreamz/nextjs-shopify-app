import { NextResponse } from "next/server";

import {
  isValidEmbeddedHostParam,
  isValidShopParam,
} from "@/lib/shopify/guards";
import { getShopify, shopifySessionStorage } from "@/lib/shopify";

export async function GET(request: Request) {
  const shopify = getShopify();
  try {
    const { session, headers } = await shopify.auth.callback({
      rawRequest: request,
    });
    await shopifySessionStorage.storeSession(session);

    const url = new URL(request.url);
    const hostParam = url.searchParams.get("host");
    const shopParam = url.searchParams.get("shop");
    if (
      !isValidEmbeddedHostParam(hostParam) ||
      !isValidShopParam(shopParam) ||
      session.shop !== shopParam
    ) {
      return new NextResponse("Invalid OAuth callback", { status: 400 });
    }

    const redirectUrl = shopify.auth.buildEmbeddedAppUrl(hostParam);
    const res = NextResponse.redirect(redirectUrl);

    if (headers instanceof Headers) {
      for (const cookie of headers.getSetCookie()) {
        res.headers.append("Set-Cookie", cookie);
      }
    }

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed";
    return new NextResponse(message, { status: 400 });
  }
}
