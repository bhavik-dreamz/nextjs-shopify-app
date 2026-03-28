import { isValidShopParam } from "@/lib/shopify/guards";
import { getShopify } from "@/lib/shopify";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!isValidShopParam(shop)) {
    return new Response("Invalid or missing shop", { status: 400 });
  }

  const shopify = getShopify();

  return shopify.auth.begin({
    shop,
    callbackPath: "/shopify/api/shopify/auth/callback",
    isOnline: false,
    rawRequest: request,
  });
}
