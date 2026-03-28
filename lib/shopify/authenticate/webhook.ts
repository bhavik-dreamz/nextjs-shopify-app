import { WebhookType } from "@shopify/shopify-api";

import { getShopify } from "@/lib/shopify";

export type ValidatedShopifyWebhook =
  | {
      delivery: "webhooks";
      topic: string;
      shopDomain: string;
      apiVersion: string;
      webhookId: string;
      rawBody: string;
    }
  | {
      delivery: "events";
      topic: string;
      shopDomain: string;
      apiVersion: string;
      eventId: string;
      rawBody: string;
    };

export type ShopifyWebhookPOSTHandler = (
  validated: ValidatedShopifyWebhook,
) => Response | Promise<Response>;

/**
 * Validates HMAC + headers. On failure returns a `Response` (e.g. 401); on success returns payload.
 * In a route you must do: `const r = await authenticateShopifyWebhook(req); if (r instanceof Response) return r;`
 * or use {@link shopifyWebhookPOST} so you only write the success path.
 */
export async function authenticateShopifyWebhook(
  request: Request,
): Promise<Response | ValidatedShopifyWebhook> {
  const rawBody = await request.text();
  const shopify = getShopify();
  const result = await shopify.webhooks.validate({
    rawRequest: request,
    rawBody,
  });

  if (!result.valid) {
    return new Response("Invalid webhook", { status: 401 });
  }

  const base = {
    topic: result.topic,
    shopDomain: result.domain,
    apiVersion: result.apiVersion,
    rawBody,
  };

  if (result.webhookType === WebhookType.Webhooks) {
    return {
      ...base,
      delivery: "webhooks",
      webhookId: result.webhookId,
    };
  }

  return {
    ...base,
    delivery: "events",
    eventId: result.eventId,
  };
}

/**
 * Wraps a POST handler: invalid webhooks become the route response automatically; your function only runs when validation passed.
 *
 * @example
 * export const POST = shopifyWebhookPOST(async (validated) => new Response(null, { status: 200 }));
 */
export function shopifyWebhookPOST(handler: ShopifyWebhookPOSTHandler) {
  return async function POST(request: Request) {
    const outcome = await authenticateShopifyWebhook(request);
    if (outcome instanceof Response) {
      return outcome;
    }
    return handler(outcome);
  };
}
