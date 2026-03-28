import { shopifyWebhookPOST } from "@/lib/shopify/authenticate";

/**
 * Example webhook receiver. Register the same path in shopify.app.toml / Partner Dashboard.
 * HMAC-unverified requests get 401 without extra branching in this file.
 */
export const POST = shopifyWebhookPOST(async (validated) => {
  // switch (validated.topic) { case "app/uninstalled": ... }
  // const payload = JSON.parse(validated.rawBody);

  return new Response(null, { status: 200 });
});
