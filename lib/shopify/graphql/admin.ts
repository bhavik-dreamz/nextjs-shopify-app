import type { Session } from "@shopify/shopify-api";

import { getShopify, shopifySessionStorage } from "@/lib/shopify";

export async function loadOfflineSession(shop: string): Promise<Session | null> {
  const shopify = getShopify();
  const id = shopify.session.getOfflineId(shop);
  const session = (await shopifySessionStorage.loadSession(id)) as unknown as Session | null;
  if (!session?.accessToken) {
    return null;
  }
  return session;
}

/**
 * Runs a GraphQL operation against Admin API using the shop’s offline token.
 * Returned `body.data` matches the GraphQL `data` key (e.g. {@link import("./mutations/product-create").ProductCreateData}).
 */
export async function adminGraphql<TData>(options: {
  shop: string;
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ body: { data?: TData; errors?: unknown }; session: Session }> {
  const session = await loadOfflineSession(options.shop);
  if (!session) {
    throw new Error("OFFLINE_SESSION_MISSING");
  }

  const shopify = getShopify();
  const client = new shopify.clients.Graphql({ session });

  const { body: rawBody } = await client.query({
    data: {
      query: options.query,
      variables: options.variables,
    },
  });

  const body = rawBody as unknown as { data?: TData; errors?: unknown };
  return { body, session };
}
