import { authenticateShopifyWebhook } from "@/lib/shopify/authenticate/webhook";
import { shopifySessionStorage } from "@/lib/shopify";

/**
 * Dedicated APP_UNINSTALLED webhook endpoint.
 */
export async function POST(request: Request) {
  const outcome = await authenticateShopifyWebhook(request);
  if (outcome instanceof Response) {
    return outcome;
  }

  if (outcome.topic !== "APP_UNINSTALLED") {
    return new Response(null, { status: 200 });
  }

  try {
    const sessions = await shopifySessionStorage.findSessionsByShop(outcome.shopDomain);
    await Promise.all(sessions.map((s: any) => shopifySessionStorage.deleteSession(s.id)));
  } catch (err) {
    console.error("[webhook] APP_UNINSTALLED session cleanup failed:", err);
  }

  return new Response(null, { status: 200 });
}
