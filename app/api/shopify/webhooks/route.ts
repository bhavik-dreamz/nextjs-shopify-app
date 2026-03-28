import { shopifyWebhookPOST } from "@/lib/shopify/authenticate";
import { shopifySessionStorage } from "@/lib/shopify";

/**
 * Webhook receiver. HMAC-unverified requests get 401 automatically.
 * Handles APP_UNINSTALLED to clean up stored sessions (mirrors Remix template behaviour).
 */
export const POST = shopifyWebhookPOST(async (validated) => {
  const { topic, shopDomain } = validated;

  switch (topic) {
    case "APP_UNINSTALLED": {
      // Delete all sessions for this shop so re-installs start fresh
      try {
        const sessions = await shopifySessionStorage.findSessionsByShop(shopDomain);
        await Promise.all(
          sessions.map((s: any) => shopifySessionStorage.deleteSession(s.id)),
        );
      } catch (err) {
        console.error("[webhook] APP_UNINSTALLED session cleanup failed:", err);
      }
      break;
    }
    default:
      break;
  }

  return new Response(null, { status: 200 });
});
